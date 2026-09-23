// Outcome Measures (OM) Dictionary Logic

const omLibrary = [
    {
        id: 'nds',
        name: 'Neck Disability Index (NDI)',
        description: 'Measures self-rated disability due to neck pain.',
        calculate: (scores) => {
            // Scores array of 10 items, 0-5 each
            const total = scores.reduce((a, b) => a + parseInt(b || 0), 0);
            const percentage = (total / 50) * 100;
            return `NDI Score: ${total}/50 (${percentage}%)`;
        },
        inputs: 10,
        inputLabel: 'Section '
    },
    {
        id: 'odi',
        name: 'Oswestry Disability Index (ODI)',
        description: 'Gold standard for measuring degree of disability and estimating quality of life in a person with low back pain.',
        calculate: (scores) => {
            const total = scores.reduce((a, b) => a + parseInt(b || 0), 0);
            const percentage = (total / 50) * 100;
            return `ODI Score: ${total}/50 (${percentage}%)`;
        },
        inputs: 10,
        inputLabel: 'Section '
    },
    {
        id: 'dash',
        name: 'DASH (Disabilities of the Arm, Shoulder and Hand)',
        description: 'Measures physical function and symptoms in people with any of several musculoskeletal disorders of the upper limb.',
        calculate: (scores) => {
            // Formula: [(sum of n responses / n) - 1] * 25
            const validScores = scores.filter(s => s !== "" && s !== null);
            if (validScores.length < 27) return "DASH requires at least 27 completed items.";
            const sum = validScores.reduce((a, b) => a + parseInt(b), 0);
            const score = ((sum / validScores.length) - 1) * 25;
            return `DASH Score: ${score.toFixed(1)}/100`;
        },
        inputs: 30,
        inputLabel: 'Item '
    }
];

function openOMDictionary() {
    const modal = document.getElementById('om-dictionary-modal');
    modal.classList.remove('hidden');
    modal.classList.add('flex');
    renderOMLibrary();
}

function closeOMDictionary() {
    const modal = document.getElementById('om-dictionary-modal');
    modal.classList.add('hidden');
    modal.classList.remove('flex');
    document.getElementById('om-calculator-container').innerHTML = ''; // reset
}

function renderOMLibrary(filterText = '') {
    const list = document.getElementById('om-list');
    list.innerHTML = '';

    const filtered = omLibrary.filter(om => om.name.toLowerCase().includes(filterText.toLowerCase()));

    filtered.forEach(om => {
        const div = document.createElement('div');
        div.className = 'p-3 hover:bg-blue-50 cursor-pointer border-b border-gray-100 transition-colors';
        div.innerHTML = `
            <div class="font-bold text-gray-900 text-sm">${om.name}</div>
            <div class="text-xs text-gray-500 mt-1">${om.description}</div>
        `;
        div.onclick = () => renderOMCalculator(om);
        list.appendChild(div);
    });
}

function renderOMCalculator(om) {
    const container = document.getElementById('om-calculator-container');

    let inputsHtml = '<div class="grid grid-cols-5 gap-2 mt-4 max-h-[300px] overflow-y-auto p-2">';
    for (let i = 0; i < om.inputs; i++) {
        inputsHtml += `
            <div>
                <label class="block text-[10px] text-gray-500">${om.inputLabel}${i+1}</label>
                <input type="number" min="0" max="5" class="om-input w-full border border-gray-300 rounded px-2 py-1 text-sm text-center focus:ring-1 focus:ring-blue-500 focus:border-blue-500" data-index="${i}">
            </div>
        `;
    }
    inputsHtml += '</div>';

    container.innerHTML = `
        <div class="bg-gray-50 p-4 border-b border-gray-100 flex justify-between items-center">
            <div>
                <h4 class="font-bold text-gray-900">${om.name}</h4>
                <p class="text-xs text-gray-500">${om.description}</p>
            </div>
        </div>
        ${inputsHtml}
        <div class="p-4 bg-gray-50 border-t border-gray-100 flex justify-between items-center mt-auto">
            <div id="om-result-preview" class="font-bold text-blue-800 text-sm">Score: --</div>
            <button onclick="calculateAndInsertOM('${om.id}')" class="px-3 py-1.5 bg-blue-600 text-white rounded hover:bg-blue-700 shadow-sm text-sm">Calculate & Insert</button>
        </div>
    `;

    // Add listeners to auto-calculate preview
    const inputs = container.querySelectorAll('.om-input');
    inputs.forEach(input => {
        input.addEventListener('input', () => {
            const scores = Array.from(inputs).map(inp => inp.value);
            const result = om.calculate(scores);
            document.getElementById('om-result-preview').innerText = result;
        });
    });
}

function calculateAndInsertOM(omId) {
    const om = omLibrary.find(o => o.id === omId);
    if (!om) return;

    const inputs = document.querySelectorAll('#om-calculator-container .om-input');
    const scores = Array.from(inputs).map(inp => inp.value);
    const result = om.calculate(scores);

    // Insert into note content
    const noteTextarea = document.getElementById('note-content');
    if (noteTextarea) {
        const currentText = noteTextarea.value;
        const insertText = `\n[${om.name}]\n${result}\n`;

        const cursorPos = noteTextarea.selectionStart;
        noteTextarea.value = currentText.substring(0, cursorPos) + insertText + currentText.substring(noteTextarea.selectionEnd);

        closeOMDictionary();
    } else {
        alert("Please open a note editor first.");
    }
}

document.addEventListener('DOMContentLoaded', () => {
    // Search listener
    const search = document.getElementById('om-search-input');
    if (search) {
        search.addEventListener('input', (e) => {
            renderOMLibrary(e.target.value);
        });
    }
});