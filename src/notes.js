let activeNoteId = null;
let activeAddendumNoteId = null;

// Ensure this matches the global patient variable from patient.js
// We use window.currentSelectedPatient or pass it around

function createNewNote() {
    if (!currentSelectedPatient) {
        alert("Please select a patient first.");
        return;
    }
    activeNoteId = null;
    document.getElementById('note-modal-title').innerText = `New Clinical Note for ${currentSelectedPatient.first_name}`;
    document.getElementById('note-content').value = '';

    const badge = document.getElementById('note-status-badge');
    badge.className = 'inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800';
    badge.innerText = 'Draft (Editable for 24h)';
    badge.classList.remove('hidden');

    openNoteEditor();
}

async function editNote(id) {
    // In a real app, we'd fetch the specific note details or find it in a local cache.
    // For now, we simulate fetching the note list again to find it.
    try {
        const notes = await window.api.getNotesForPatient(currentSelectedPatient.id);
        const note = notes.find(n => n.id === id);

        if (!note) return;

        if (note.locked) {
            alert("This note is locked and cannot be edited. Please add an addendum.");
            return;
        }

        activeNoteId = note.id;
        document.getElementById('note-modal-title').innerText = `Edit Clinical Note`;
        document.getElementById('note-content').value = note.content;

        const badge = document.getElementById('note-status-badge');
        badge.className = 'inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800';
        badge.innerText = 'Editable (within 24h)';
        badge.classList.remove('hidden');

        openNoteEditor();
    } catch (error) {
        console.error("Error editing note:", error);
    }
}

async function saveNote() {
    const content = document.getElementById('note-content').value.trim();
    if (!content) {
        alert("Note cannot be empty.");
        return;
    }

    try {
        if (activeNoteId) {
            await window.api.updateNote(activeNoteId, content);
            console.log("Note updated");
        } else {
            await window.api.createNote({
                patient_id: currentSelectedPatient.id,
                content: content
            });
            console.log("Note created");
        }

        closeNoteEditor();
        // Refresh patient portfolio to show new note
        selectPatient(currentSelectedPatient);
    } catch (error) {
        console.error("Error saving note:", error);
        alert(error.message || "Failed to save note.");
    }
}

function openNoteEditor() {
    const modal = document.getElementById('note-editor-modal');
    modal.classList.remove('hidden');
    modal.classList.add('flex');
    document.getElementById('note-content').focus();
}

function closeNoteEditor() {
    const modal = document.getElementById('note-editor-modal');
    modal.classList.add('hidden');
    modal.classList.remove('flex');
    activeNoteId = null;
}

// Addendum System
function openAddendumModal(noteId) {
    activeAddendumNoteId = noteId;
    document.getElementById('addendum-content').value = '';

    const modal = document.getElementById('addendum-modal');
    modal.classList.remove('hidden');
    modal.classList.add('flex');
    document.getElementById('addendum-content').focus();
}

function closeAddendumModal() {
    const modal = document.getElementById('addendum-modal');
    modal.classList.add('hidden');
    modal.classList.remove('flex');
    activeAddendumNoteId = null;
}

async function saveAddendum() {
    const content = document.getElementById('addendum-content').value.trim();
    if (!content) {
        alert("Addendum cannot be empty.");
        return;
    }

    try {
        await window.api.addAddendum({
            note_id: activeAddendumNoteId,
            content: content
        });

        closeAddendumModal();
        // Refresh patient portfolio to show new addendum
        selectPatient(currentSelectedPatient);
    } catch (error) {
        console.error("Error saving addendum:", error);
        alert("Failed to save addendum.");
    }
}

// Keyboard shortcuts for saving
document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        const noteModal = document.getElementById('note-editor-modal');
        if (!noteModal.classList.contains('hidden')) {
            e.preventDefault();
            saveNote();
        }
    }
});
