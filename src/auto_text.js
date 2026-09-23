// Auto-Text System Logic
let autoTextTemplates = [];
let isAutoTextMenuOpen = false;
let currentAtSymbolIndex = -1;

document.addEventListener('DOMContentLoaded', async () => {
    // Load templates on init
    try {
        autoTextTemplates = await window.api.getAutoTextTemplates();

        // Seed some defaults if empty
        if (autoTextTemplates.length === 0) {
            await window.api.createAutoTextTemplate({ shortcut: 'obj', content: 'Objective Assessment:\n- ROM: \n- Strength: \n- Palpation: '});
            await window.api.createAutoTextTemplate({ shortcut: 'plan', content: 'Treatment Plan:\n- Manual therapy: \n- Exercise Rx: \n- Advice & Ed: '});
            await window.api.createAutoTextTemplate({ shortcut: 'sub', content: 'Subjective:\n- C/O: \n- Hx: \n- Aggravating: \n- Easing: '});
            autoTextTemplates = await window.api.getAutoTextTemplates();
        }

        renderSettingsAutoTextList();
    } catch (error) {
        console.error("Failed to load auto-text templates", error);
    }

    // Add form listener for modal
    const atForm = document.getElementById('create-autotext-form');
    if (atForm) {
        atForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const shortcut = document.getElementById('cat-shortcut').value.trim();
            const content = document.getElementById('cat-content').value.trim();

            try {
                await window.api.createAutoTextTemplate({ shortcut, content });
                closeCreateAutoTextModal();
                autoTextTemplates = await window.api.getAutoTextTemplates();
                renderSettingsAutoTextList();
                // Optionally reload global autoText templates in this context
            } catch (error) {
                console.error(error);
                alert("Failed to create auto-text. Ensure shortcut is unique.");
            }
        });
    }

    const noteTextarea = document.getElementById('note-content');
    const dropdown = document.getElementById('auto-text-dropdown');

    noteTextarea.addEventListener('input', (e) => {
        const text = noteTextarea.value;
        const cursorPos = noteTextarea.selectionStart;

        // Look backwards from cursor for an '@' symbol without spaces after it
        const textBeforeCursor = text.substring(0, cursorPos);
        const lastAtIndex = textBeforeCursor.lastIndexOf('@');

        if (lastAtIndex !== -1) {
            const queryText = textBeforeCursor.substring(lastAtIndex + 1);
            // If there's a space, we've moved past the query
            if (!queryText.includes(' ') && !queryText.includes('\n')) {
                currentAtSymbolIndex = lastAtIndex;
                showAutoTextDropdown(queryText);
                return;
            }
        }

        hideAutoTextDropdown();
    });

    // Handle keyboard navigation in dropdown
    noteTextarea.addEventListener('keydown', (e) => {
        if (!isAutoTextMenuOpen) return;

        const items = dropdown.querySelectorAll('.autotext-item');
        if (items.length === 0) return;

        let activeIndex = Array.from(items).findIndex(item => item.classList.contains('bg-blue-50'));

        if (e.key === 'ArrowDown') {
            e.preventDefault();
            if (activeIndex < items.length - 1) {
                if (activeIndex >= 0) items[activeIndex].classList.remove('bg-blue-50');
                items[activeIndex + 1].classList.add('bg-blue-50');
                items[activeIndex + 1].scrollIntoView({ block: 'nearest' });
            }
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            if (activeIndex > 0) {
                items[activeIndex].classList.remove('bg-blue-50');
                items[activeIndex - 1].classList.add('bg-blue-50');
                items[activeIndex - 1].scrollIntoView({ block: 'nearest' });
            }
        } else if (e.key === 'Enter' || e.key === 'Tab') {
            e.preventDefault();
            if (activeIndex >= 0) {
                insertTemplate(autoTextTemplates.find(t => t.shortcut === items[activeIndex].dataset.shortcut).content);
            } else {
                // Select first if none active
                insertTemplate(autoTextTemplates.find(t => t.shortcut === items[0].dataset.shortcut).content);
            }
        } else if (e.key === 'Escape') {
            hideAutoTextDropdown();
        }
    });

    function showAutoTextDropdown(query) {
        // Filter templates
        const filtered = autoTextTemplates.filter(t => t.shortcut.toLowerCase().startsWith(query.toLowerCase()));

        if (filtered.length === 0) {
            hideAutoTextDropdown();
            return;
        }

        dropdown.innerHTML = '';
        filtered.forEach((t, index) => {
            const div = document.createElement('div');
            div.className = `autotext-item p-2 cursor-pointer border-b border-gray-100 ${index === 0 ? 'bg-blue-50' : 'hover:bg-gray-50'}`;
            div.dataset.shortcut = t.shortcut;
            div.innerHTML = `
                <div class="font-bold text-blue-600 text-xs mb-0.5">@${t.shortcut}</div>
                <div class="text-xs text-gray-500 truncate">${t.content.replace(/\n/g, ' ↵ ')}</div>
            `;
            div.onmousedown = (e) => {
                e.preventDefault(); // Prevent losing focus
                insertTemplate(t.content);
            };
            dropdown.appendChild(div);
        });

        // Position dropdown
        // This is a rough estimation since getting precise textarea coordinates without a complex library is tricky
        const textareaRect = noteTextarea.getBoundingClientRect();
        dropdown.style.left = `24px`; // Static left for now, could be improved with a caret-pos library
        dropdown.style.top = `60px`;  // Static top relative to textarea container

        dropdown.classList.remove('hidden');
        isAutoTextMenuOpen = true;
    }

    function hideAutoTextDropdown() {
        dropdown.classList.add('hidden');
        isAutoTextMenuOpen = false;
        currentAtSymbolIndex = -1;
    }

    function insertTemplate(content) {
        if (currentAtSymbolIndex === -1) return;

        const text = noteTextarea.value;
        const textBefore = text.substring(0, currentAtSymbolIndex);
        const textAfter = text.substring(noteTextarea.selectionStart);

        noteTextarea.value = textBefore + content + textAfter;

        // Set cursor position after inserted content
        const newPos = currentAtSymbolIndex + content.length;
        noteTextarea.setSelectionRange(newPos, newPos);
        noteTextarea.focus();

        hideAutoTextDropdown();
    }
});

// Settings UI rendering
function renderSettingsAutoTextList() {
    const list = document.getElementById('settings-autotext-list');
    if (!list) return;

    list.innerHTML = '';
    autoTextTemplates.forEach(t => {
        const div = document.createElement('div');
        div.className = 'bg-gray-50 border border-gray-200 rounded p-3 flex justify-between items-start';
        div.innerHTML = `
            <div>
                <div class="font-bold text-blue-600 text-sm mb-1">@${t.shortcut}</div>
                <div class="text-xs text-gray-600 whitespace-pre-wrap">${t.content}</div>
            </div>
            <!-- Delete not implemented in DB schema for simplicity of this demo, but UI indicates it -->
        `;
        list.appendChild(div);
    });
}

function openCreateAutoTextModal() {
    const modal = document.getElementById('create-autotext-modal');
    if (modal) {
        modal.classList.remove('hidden');
        modal.classList.add('flex');
    }
}

function closeCreateAutoTextModal() {
    const modal = document.getElementById('create-autotext-modal');
    if (modal) {
        modal.classList.add('hidden');
        modal.classList.remove('flex');
        document.getElementById('create-autotext-form').reset();
    }
}