// PT Program Builder Logic
let selectedDays = [];
let programData = {}; // Format: { "Mon": [ {order, exercise, sets, reps, rest} ] }
let activeDay = null;

document.addEventListener('DOMContentLoaded', () => {
    // Setup day selectors (Page 1)
    const dayBtns = document.querySelectorAll('.day-btn');
    dayBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const day = e.target.dataset.day;
            if (selectedDays.includes(day)) {
                selectedDays = selectedDays.filter(d => d !== day);
                e.target.classList.remove('border-blue-500', 'text-blue-500', 'bg-blue-50');
                e.target.classList.add('border-gray-300', 'text-gray-500');
            } else {
                selectedDays.push(day);
                e.target.classList.remove('border-gray-300', 'text-gray-500');
                e.target.classList.add('border-blue-500', 'text-blue-500', 'bg-blue-50');
            }
        });
    });
});

function startNewProgram() {
    document.getElementById('prog-empty-state').classList.add('hidden');
    document.getElementById('program-wizard').classList.remove('hidden');

    // Reset state
    selectedDays = [];
    programData = {};
    document.querySelectorAll('.day-btn').forEach(btn => {
        btn.classList.remove('border-blue-500', 'text-blue-500', 'bg-blue-50');
        btn.classList.add('border-gray-300', 'text-gray-500');
    });

    goToProgramPage(1);
}

function goToProgramPage(pageNumber) {
    if (pageNumber === 2 && selectedDays.length === 0) {
        alert("Please select at least one training day.");
        return;
    }

    // Hide all pages
    document.getElementById('prog-page-1').classList.add('hidden');
    document.getElementById('prog-page-2').classList.add('hidden');
    document.getElementById('prog-page-3').classList.add('hidden');

    document.getElementById('prog-page-1').classList.remove('flex');
    document.getElementById('prog-page-2').classList.remove('flex');
    document.getElementById('prog-page-3').classList.remove('flex');

    // Reset Tabs
    document.getElementById('prog-tab-1').className = 'flex-1 py-4 text-center border-r border-gray-100 font-medium text-sm text-gray-500';
    document.getElementById('prog-tab-2').className = 'flex-1 py-4 text-center border-r border-gray-100 font-medium text-sm text-gray-500';
    document.getElementById('prog-tab-3').className = 'flex-1 py-4 text-center font-medium text-sm text-gray-500';

    // Show selected page
    const page = document.getElementById(`prog-page-${pageNumber}`);
    page.classList.remove('hidden');
    page.classList.add('flex');

    // Highlight Active Tab
    const activeTab = document.getElementById(`prog-tab-${pageNumber}`);
    activeTab.className = 'flex-1 py-4 text-center border-r border-gray-100 font-medium text-sm text-blue-600 bg-white';

    // Page Specific Logic
    if (pageNumber === 2) {
        initPage2();
    } else if (pageNumber === 3) {
        saveCurrentDayState(); // Save before moving to summary
        initPage3();
    }
}

function initPage2() {
    // Sort selected days logically
    const dayOrder = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    selectedDays.sort((a, b) => dayOrder.indexOf(a) - dayOrder.indexOf(b));

    // Initialize data structure if empty
    selectedDays.forEach(day => {
        if (!programData[day]) {
            programData[day] = [];
        }
    });

    renderDayTabs();

    if (!activeDay || !selectedDays.includes(activeDay)) {
        activeDay = selectedDays[0];
    }

    selectDayTab(activeDay);
}

function renderDayTabs() {
    const tabsContainer = document.getElementById('prog-day-tabs');
    tabsContainer.innerHTML = '';

    selectedDays.forEach(day => {
        const btn = document.createElement('button');
        btn.className = `day-tab-btn px-4 py-2 rounded-t-lg font-medium text-sm transition-colors border-b-2 border-transparent text-gray-500 hover:text-gray-700`;
        btn.dataset.day = day;
        btn.innerText = day;
        btn.onclick = () => {
            saveCurrentDayState();
            selectDayTab(day);
        };
        tabsContainer.appendChild(btn);
    });
}

function selectDayTab(day) {
    activeDay = day;

    document.querySelectorAll('.day-tab-btn').forEach(btn => {
        if (btn.dataset.day === day) {
            btn.classList.remove('text-gray-500', 'border-transparent');
            btn.classList.add('text-blue-600', 'border-blue-600', 'bg-white');
        } else {
            btn.classList.add('text-gray-500', 'border-transparent');
            btn.classList.remove('text-blue-600', 'border-blue-600', 'bg-white');
        }
    });

    renderExerciseList(day);
}

function renderExerciseList(day) {
    const list = document.getElementById('prog-exercise-list');
    list.innerHTML = '';

    const exercises = programData[day] || [];

    if (exercises.length === 0) {
        // Add one default empty row
        addExerciseRowUI(1, '', '', '', '');
    } else {
        exercises.forEach((ex, idx) => {
            addExerciseRowUI(idx + 1, ex.exercise, ex.sets, ex.reps, ex.rest);
        });
    }
}

function addExerciseRow() {
    const list = document.getElementById('prog-exercise-list');
    const rowCount = list.children.length + 1;
    addExerciseRowUI(rowCount, '', '', '', '');
}

function addExerciseRowUI(order, exercise, sets, reps, rest) {
    const list = document.getElementById('prog-exercise-list');

    const row = document.createElement('div');
    row.className = 'prog-ex-row grid grid-cols-12 gap-2 items-center';
    row.innerHTML = `
        <div class="col-span-1 text-center font-bold text-gray-400 text-sm">${order}</div>
        <div class="col-span-5"><input type="text" class="w-full border border-gray-300 rounded px-2 py-1 text-sm focus:ring-1 focus:ring-blue-500 outline-none" placeholder="e.g. Barbell Squat" value="${exercise}"></div>
        <div class="col-span-2"><input type="text" class="w-full border border-gray-300 rounded px-2 py-1 text-sm focus:ring-1 focus:ring-blue-500 outline-none text-center" placeholder="3" value="${sets}"></div>
        <div class="col-span-2"><input type="text" class="w-full border border-gray-300 rounded px-2 py-1 text-sm focus:ring-1 focus:ring-blue-500 outline-none text-center" placeholder="8-10" value="${reps}"></div>
        <div class="col-span-2"><input type="text" class="w-full border border-gray-300 rounded px-2 py-1 text-sm focus:ring-1 focus:ring-blue-500 outline-none text-center" placeholder="90s" value="${rest}"></div>
    `;
    list.appendChild(row);
}

function saveCurrentDayState() {
    if (!activeDay) return;

    const rows = document.querySelectorAll('.prog-ex-row');
    const dayData = [];

    rows.forEach((row, idx) => {
        const inputs = row.querySelectorAll('input');
        const exercise = inputs[0].value.trim();

        // Only save rows that have at least an exercise name
        if (exercise) {
            dayData.push({
                order: idx + 1,
                exercise: exercise,
                sets: inputs[1].value.trim(),
                reps: inputs[2].value.trim(),
                rest: inputs[3].value.trim()
            });
        }
    });

    programData[activeDay] = dayData;
}

async function initPage3() {
    const container = document.getElementById('prog-summary-container');

    // Populate Patient Select
    try {
        const select = document.getElementById('prog-patient-select');
        select.innerHTML = '<option value="">Select a patient to save to...</option>';
        const patients = await window.api.getPatients();
        patients.forEach(p => {
            const opt = document.createElement('option');
            opt.value = p.id;
            opt.innerText = `${p.first_name} ${p.last_name}`;
            select.appendChild(opt);
        });

        // Auto-select if there is an active patient globally
        // Assumes currentSelectedPatient exists globally from patient.js
        if (typeof currentSelectedPatient !== 'undefined' && currentSelectedPatient) {
             select.value = currentSelectedPatient.id;
        }
    } catch (error) {
        console.error("Error loading patients for program assignment", error);
    }

    let html = `
        <div class="max-w-3xl mx-auto bg-white p-8 shadow-sm">
            <h1 class="text-3xl font-bold text-gray-900 mb-2">Training Program</h1>
            <p class="text-gray-500 mb-8 border-b border-gray-200 pb-4">Generated on ${new Date().toLocaleDateString()}</p>
    `;

    selectedDays.forEach(day => {
        const exercises = programData[day] || [];
        if (exercises.length === 0) return;

        html += `
            <div class="mb-8">
                <h3 class="text-xl font-bold text-blue-700 mb-3 border-b-2 border-blue-100 pb-1">${day}</h3>
                <table class="w-full text-sm text-left">
                    <thead class="text-xs text-gray-500 uppercase bg-gray-50">
                        <tr>
                            <th class="px-4 py-2 w-12">#</th>
                            <th class="px-4 py-2">Exercise</th>
                            <th class="px-4 py-2 text-center w-20">Sets</th>
                            <th class="px-4 py-2 text-center w-24">Reps</th>
                            <th class="px-4 py-2 text-center w-24">Rest</th>
                        </tr>
                    </thead>
                    <tbody>
        `;

        exercises.forEach(ex => {
            html += `
                <tr class="border-b border-gray-100">
                    <td class="px-4 py-3 font-medium text-gray-400">${ex.order}</td>
                    <td class="px-4 py-3 font-bold text-gray-800">${ex.exercise}</td>
                    <td class="px-4 py-3 text-center">${ex.sets}</td>
                    <td class="px-4 py-3 text-center">${ex.reps}</td>
                    <td class="px-4 py-3 text-center text-gray-500">${ex.rest}</td>
                </tr>
            `;
        });

        html += `
                    </tbody>
                </table>
            </div>
        `;
    });

    html += `</div>`;
    container.innerHTML = html;
}

// Template Library Implementation
async function loadProgramLibrary() {
    const modal = document.getElementById('program-library-modal');
    modal.classList.remove('hidden');
    modal.classList.add('flex');

    const list = document.getElementById('program-templates-list');
    list.innerHTML = '<div class="text-center py-10 text-gray-400">Loading templates...</div>';

    try {
        const templates = await window.api.getProgramTemplates();

        if (templates.length === 0) {
            list.innerHTML = `
                <div class="text-center py-10 text-gray-400">
                    <span class="material-icons text-4xl mb-2">inbox</span>
                    <p>No saved templates found.</p>
                </div>
            `;
            return;
        }

        list.innerHTML = '';
        templates.forEach(t => {
            const days = Object.keys(t.program_data).join(', ');

            const div = document.createElement('div');
            div.className = 'bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex justify-between items-center hover:border-blue-300 transition-colors cursor-pointer';
            div.innerHTML = `
                <div>
                    <h4 class="font-bold text-gray-900">${t.name}</h4>
                    <p class="text-xs text-gray-500 mt-1">Days: ${days}</p>
                </div>
                <button class="text-blue-600 font-medium text-sm px-3 py-1 bg-blue-50 rounded hover:bg-blue-100">Load Template</button>
            `;
            div.onclick = () => {
                loadTemplateIntoBuilder(t.program_data);
                closeProgramLibrary();
            };
            list.appendChild(div);
        });

    } catch (error) {
        console.error("Failed to load templates", error);
        list.innerHTML = '<div class="text-red-500 text-center py-4">Error loading templates.</div>';
    }
}

function closeProgramLibrary() {
    const modal = document.getElementById('program-library-modal');
    modal.classList.add('hidden');
    modal.classList.remove('flex');
}

function loadTemplateIntoBuilder(data) {
    document.getElementById('prog-empty-state').classList.add('hidden');
    document.getElementById('program-wizard').classList.remove('hidden');

    programData = JSON.parse(JSON.stringify(data)); // deep copy
    selectedDays = Object.keys(programData);

    // Update Day selector UI
    document.querySelectorAll('.day-btn').forEach(btn => {
        if (selectedDays.includes(btn.dataset.day)) {
            btn.classList.remove('border-gray-300', 'text-gray-500');
            btn.classList.add('border-blue-500', 'text-blue-500', 'bg-blue-50');
        } else {
            btn.classList.remove('border-blue-500', 'text-blue-500', 'bg-blue-50');
            btn.classList.add('border-gray-300', 'text-gray-500');
        }
    });

    // Jump straight to summary page
    goToProgramPage(3);
}

async function saveProgramToPatient() {
    const patientId = document.getElementById('prog-patient-select').value;
    if (!patientId) {
        alert("Please select a patient to save the program to.");
        return;
    }

    try {
        await window.api.savePatientProgram(patientId, programData);
        alert("Program successfully saved to patient portfolio.");
    } catch (error) {
        console.error("Failed to save program to patient", error);
        alert("Failed to save program to patient.");
    }
}

async function saveProgramAsTemplate() {
    const name = prompt("Enter a name for this program template:");
    if (!name) return;

    try {
        await window.api.saveProgramTemplate({
            name: name,
            program_data: programData
        });
        alert("Template saved successfully!");
    } catch (error) {
        console.error("Failed to save template", error);
        alert("Failed to save template.");
    }
}

async function exportProgramPDF() {
    const container = document.getElementById('prog-summary-container');
    if (!container) return;

    // Add some inline styles for the PDF rendering context since Tailwind classes might not translate perfectly in the basic printToPDF without full CSS loading.
    const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
            <title>PT Program</title>
            <style>
                body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; padding: 40px; color: #333; }
                h1 { color: #1a56db; margin-bottom: 5px; }
                .meta { color: #666; margin-bottom: 30px; border-bottom: 1px solid #eee; padding-bottom: 10px; }
                .day-header { color: #1a56db; font-size: 18px; font-weight: bold; margin-bottom: 10px; border-bottom: 2px solid #e5e7eb; padding-bottom: 5px; margin-top: 30px; }
                table { width: 100%; border-collapse: collapse; margin-bottom: 20px; text-align: left; }
                th { background: #f9fafb; padding: 10px; color: #6b7280; text-transform: uppercase; font-size: 12px; border-bottom: 1px solid #e5e7eb; }
                td { padding: 10px; border-bottom: 1px solid #f3f4f6; }
                .text-center { text-align: center; }
            </style>
        </head>
        <body>
            ${container.innerHTML.replace(/class="[^"]*"/g, '')}
        </body>
        </html>
    `;

    try {
        const result = await window.api.generatePDF(htmlContent, `PT_Program`);
        if (result.success) {
            alert(`Program saved to:\n${result.path}`);
        } else {
            alert("Error generating PDF: " + result.error);
        }
    } catch (error) {
        console.error("PDF generation failed:", error);
        alert("Failed to generate PDF.");
    }
}