let currentSelectedPatient = null;
let allPatients = [];

// Modal Logic
function openCreatePatientModal() {
    document.getElementById('create-patient-modal').classList.remove('hidden');
    document.getElementById('create-patient-modal').classList.add('flex');
}

function closeCreatePatientModal() {
    document.getElementById('create-patient-modal').classList.add('hidden');
    document.getElementById('create-patient-modal').classList.remove('flex');
    document.getElementById('create-patient-form').reset();
}

document.addEventListener('DOMContentLoaded', () => {
    // Form Submission
    document.getElementById('create-patient-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const newPatient = {
            first_name: document.getElementById('cp-fname').value,
            last_name: document.getElementById('cp-lname').value,
            email: document.getElementById('cp-email').value,
            phone: document.getElementById('cp-phone').value
        };

        try {
            const id = await window.api.createPatient(newPatient);
            console.log('Patient created with ID:', id);
            closeCreatePatientModal();
            loadPatients(); // Refresh list
        } catch (error) {
            console.error('Error creating patient:', error);
            alert('Failed to create patient.');
        }
    });

    // Patient List Filtering
    document.getElementById('patient-list-search').addEventListener('input', (e) => {
        const term = e.target.value.toLowerCase();
        const filtered = allPatients.filter(p =>
            p.first_name.toLowerCase().includes(term) ||
            p.last_name.toLowerCase().includes(term)
        );
        renderPatientList(filtered);
    });

    // Initial Load (when navigating to the view)
    // For now we just load them immediately, but ideally only load when view is active
    loadPatients();
});

// Original navigate function override to handle patient loading dynamically if needed
const originalNavigate = window.navigate;
window.navigate = function(viewId) {
    originalNavigate(viewId);
    if (viewId === 'patients') {
        loadPatients();
    }
};


async function loadPatients() {
    try {
        allPatients = await window.api.getPatients();
        renderPatientList(allPatients);
    } catch (error) {
        console.error('Error loading patients:', error);
    }
}

function renderPatientList(patients) {
    const container = document.getElementById('patient-list-container');
    container.innerHTML = '';

    if (patients.length === 0) {
        container.innerHTML = '<div class="p-6 text-center text-gray-500 text-sm">No patients found.</div>';
        return;
    }

    patients.forEach(p => {
        const div = document.createElement('div');
        const isSelected = currentSelectedPatient && currentSelectedPatient.id === p.id;
        div.className = `p-4 border-b border-gray-100 cursor-pointer transition-colors flex items-center ${isSelected ? 'bg-blue-50 border-l-4 border-l-blue-600' : 'hover:bg-gray-50 border-l-4 border-l-transparent'}`;
        div.innerHTML = `
            <div class="h-10 w-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold mr-3 shadow-inner">
                ${p.first_name[0]}${p.last_name[0]}
            </div>
            <div>
                <div class="font-semibold text-gray-900">${p.first_name} ${p.last_name}</div>
                <div class="text-xs text-gray-500">${p.phone || p.email || 'No contact info'}</div>
            </div>
        `;
        div.onclick = () => selectPatient(p);
        container.appendChild(div);
    });
}

async function selectPatient(patient) {
    currentSelectedPatient = patient;
    renderPatientList(allPatients); // Re-render to show active state

    const container = document.getElementById('patient-portfolio-container');

    // Render Portfolio Header
    container.innerHTML = `
        <div class="p-6 border-b border-gray-100 bg-white flex justify-between items-start">
            <div class="flex items-center">
                <div class="h-16 w-16 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-2xl mr-4 shadow-sm">
                    ${patient.first_name[0]}${patient.last_name[0]}
                </div>
                <div>
                    <h2 class="text-2xl font-bold text-gray-900">${patient.first_name} ${patient.last_name}</h2>
                    <div class="text-sm text-gray-500 flex space-x-4 mt-1">
                        <span><span class="material-icons text-xs mr-1 align-middle">phone</span>${patient.phone || '--'}</span>
                        <span><span class="material-icons text-xs mr-1 align-middle">email</span>${patient.email || '--'}</span>
                    </div>
                </div>
            </div>
            <button onclick="generateDischargeSummary(${patient.id})" class="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium hover:bg-gray-50 flex items-center shadow-sm">
                <span class="material-icons mr-2 text-sm">picture_as_pdf</span> Discharge Summary
            </button>
        </div>

        <!-- Timeline Controls -->
        <div class="bg-gray-50 px-6 py-3 border-b border-gray-100 flex space-x-4">
            <button onclick="createNewNote()" class="text-sm font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-full hover:bg-blue-100">+ Clinical Note</button>
        </div>

        <!-- Timeline Feed -->
        <div class="flex-1 overflow-y-auto p-6 bg-gray-50" id="portfolio-timeline">
            <div class="flex justify-center my-8">
                <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
        </div>
    `;

    // Fetch Notes, Invoices, and Programs, then sort chronologically
    try {
        const notes = await window.api.getNotesForPatient(patient.id);
        const invoices = await window.api.getInvoicesForPatient(patient.id);
        const programs = await window.api.getPatientPrograms(patient.id);

        let timelineItems = [];

        notes.forEach(note => {
            timelineItems.push({
                type: 'note',
                date: new Date(note.created_at),
                data: note
            });
        });

        invoices.forEach(inv => {
            timelineItems.push({
                type: 'invoice',
                date: new Date(inv.date), // Or created_at if we strictly want generation time
                data: inv
            });
        });

        programs.forEach(prog => {
            timelineItems.push({
                type: 'program',
                date: new Date(prog.created_at),
                data: prog
            });
        });

        // Sort descending (newest first)
        timelineItems.sort((a, b) => b.date - a.date);

        const timeline = document.getElementById('portfolio-timeline');

        if (timelineItems.length === 0) {
            timeline.innerHTML = `
                <div class="text-center py-12 text-gray-400">
                    <span class="material-icons text-4xl mb-2">history</span>
                    <p>No clinical history found.</p>
                </div>
            `;
            return;
        }

        timeline.innerHTML = '<div class="relative border-l-2 border-gray-200 ml-4 space-y-8 pb-8" id="timeline-track"></div>';
        const track = document.getElementById('timeline-track');

        timelineItems.forEach(item => {
            const domItem = document.createElement('div');
            domItem.className = 'relative pl-8';

            const dateStr = item.date.toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' });

            if (item.type === 'note') {
                const note = item.data;
                const isLocked = note.locked === 1;

                let addendumsHtml = '';
                if (note.addendums && note.addendums.length > 0) {
                    addendumsHtml = '<div class="mt-4 space-y-3">';
                    note.addendums.forEach(add => {
                        const addDate = new Date(add.created_at).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' });
                        addendumsHtml += `
                            <div class="bg-yellow-50 p-3 rounded border border-yellow-100 text-sm">
                                <div class="font-semibold text-yellow-800 text-xs mb-1">Addendum • HARD-STAMPED ${addDate}</div>
                                <div class="text-gray-800 whitespace-pre-wrap">${add.content}</div>
                            </div>
                        `;
                    });
                    addendumsHtml += '</div>';
                }

                domItem.innerHTML = `
                    <div class="absolute -left-2 top-0 h-4 w-4 rounded-full border-2 border-white ${isLocked ? 'bg-gray-400' : 'bg-blue-500'}"></div>
                    <div class="bg-white p-5 rounded-lg shadow-sm border border-gray-100">
                        <div class="flex justify-between items-start mb-3">
                            <div>
                                <span class="font-bold text-gray-900 flex items-center"><span class="material-icons text-sm mr-1 text-blue-500">edit_document</span> Clinical Note</span>
                                <span class="text-xs text-gray-500 ml-2">${dateStr}</span>
                            </div>
                            <div>
                                ${isLocked
                                    ? '<span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800"><span class="material-icons text-[14px] mr-1">lock</span> Locked</span>'
                                    : '<span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">Editable (24h)</span>'
                                }
                            </div>
                        </div>
                        <div class="text-gray-700 text-sm whitespace-pre-wrap">${note.content}</div>

                        ${addendumsHtml}

                        <div class="mt-4 pt-3 border-t border-gray-50 text-right">
                            ${isLocked
                                ? `<button onclick="openAddendumModal(${note.id})" class="text-sm text-blue-600 hover:text-blue-800 font-medium">Add Addendum</button>`
                                : `<button onclick="editNote(${note.id})" class="text-sm text-blue-600 hover:text-blue-800 font-medium mr-3">Edit Note</button>`
                            }
                        </div>
                    </div>
                `;
            } else if (item.type === 'invoice') {
                const inv = item.data;
                domItem.innerHTML = `
                    <div class="absolute -left-2 top-0 h-4 w-4 rounded-full border-2 border-white bg-green-500"></div>
                    <div class="bg-white p-5 rounded-lg shadow-sm border border-gray-100">
                        <div class="flex justify-between items-start mb-3">
                            <div>
                                <span class="font-bold text-gray-900 flex items-center"><span class="material-icons text-sm mr-1 text-green-500">receipt</span> Invoice Generated</span>
                                <span class="text-xs text-gray-500 ml-2">${dateStr}</span>
                            </div>
                            <span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800 capitalize">${inv.status}</span>
                        </div>
                        <div class="text-lg font-bold text-gray-900">$${inv.amount.toFixed(2)}</div>
                    </div>
                `;
            } else if (item.type === 'program') {
                const prog = item.data;
                const daysStr = Object.keys(prog.program_data).join(', ');
                domItem.innerHTML = `
                    <div class="absolute -left-2 top-0 h-4 w-4 rounded-full border-2 border-white bg-purple-500"></div>
                    <div class="bg-white p-5 rounded-lg shadow-sm border border-gray-100">
                        <div class="flex justify-between items-start mb-3">
                            <div>
                                <span class="font-bold text-gray-900 flex items-center"><span class="material-icons text-sm mr-1 text-purple-500">fitness_center</span> PT Program Assigned</span>
                                <span class="text-xs text-gray-500 ml-2">${dateStr}</span>
                            </div>
                        </div>
                        <div class="text-sm text-gray-700">Days configured: <span class="font-semibold">${daysStr}</span></div>
                        <div class="mt-3 text-right">
                             <button onclick="navigate('programs')" class="text-sm text-blue-600 hover:text-blue-800 font-medium">Open Builder</button>
                        </div>
                    </div>
                `;
            }

            track.appendChild(domItem);
        });

    } catch (error) {
        console.error("Error loading portfolio timeline", error);
        document.getElementById('portfolio-timeline').innerHTML = '<div class="text-red-500 p-4">Error loading history.</div>';
    }
}

// Stubs for next modules
function createNewNote() {
    alert("Note Editor will be opened here in the next step.");
}

function editNote(id) {
    alert("Edit Note " + id);
}

function openAddendumModal(id) {
    alert("Addendum Modal for Note " + id);
}

async function generateDischargeSummary(patientId) {
    if (!currentSelectedPatient || currentSelectedPatient.id !== patientId) return;

    // Fetch settings for clinic branding
    let clinicName = "Physio Clinic";
    let logoHtml = "";
    try {
        const settings = await window.api.getSettings();
        if (settings) {
            clinicName = settings.clinic_name;
            if (settings.logo_path) {
                const base64Logo = await window.api.readImageAsBase64(settings.logo_path);
                if (base64Logo) {
                    logoHtml = `<img src="${base64Logo}" alt="Clinic Logo" style="max-height: 80px; max-width: 250px; margin-bottom: 10px;">`;
                }
            }
        }
    } catch (e) {
        console.warn("Could not load settings or logo for PDF.", e);
    }

    // Escape HTML string utility
    function escapeHtml(unsafe) {
        if (!unsafe) return '';
        return unsafe
             .replace(/&/g, "&amp;")
             .replace(/</g, "&lt;")
             .replace(/>/g, "&gt;")
             .replace(/"/g, "&quot;")
             .replace(/'/g, "&#039;");
    }

    // Construct HTML payload for PDF
    const notesContainer = document.getElementById('timeline-track');
    let notesHtml = "No clinical notes found.";
    if (notesContainer) {
        // Simple extraction of text content for demo purposes
        notesHtml = Array.from(notesContainer.children)
            .filter(node => node.innerHTML.includes('Clinical Note')) // Ensure we only print notes, not invoices/programs
            .map(node => {
                const dateStr = escapeHtml(node.querySelector('.text-gray-500')?.innerText || '');
                const textContent = escapeHtml(node.querySelector('.whitespace-pre-wrap')?.innerText || '');
                const isLocked = node.innerHTML.includes('Locked');
                return `
                    <div style="margin-bottom: 20px; padding-bottom: 20px; border-bottom: 1px solid #eee;">
                        <h4 style="margin: 0 0 10px 0; color: #333;">Note Date: ${dateStr} ${isLocked ? '(Locked)' : ''}</h4>
                        <pre style="font-family: sans-serif; white-space: pre-wrap; font-size: 14px; margin: 0; color: #555;">${textContent}</pre>
                    </div>
                `;
            }).join('');

        if (!notesHtml) notesHtml = "No clinical notes found.";
    }

    const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
            <title>Discharge Summary</title>
            <style>
                body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; padding: 40px; color: #333; }
                h1 { color: #1a56db; border-bottom: 2px solid #1a56db; padding-bottom: 10px; }
                .header { display: flex; justify-content: space-between; margin-bottom: 40px; }
                .patient-info { background: #f9fafb; padding: 20px; border-radius: 8px; margin-bottom: 30px; }
            </style>
        </head>
        <body>
            <div class="header">
                <div>
                    ${logoHtml}
                    <h2>${clinicName}</h2>
                    <h1 style="border-bottom: none;">Discharge Summary</h1>
                </div>
                <div style="text-align: right; color: #666; padding-top: 20px;">
                    Date: ${new Date().toLocaleDateString()}
                </div>
            </div>

            <div class="patient-info">
                <h3 style="margin-top:0;">Patient Details</h3>
                <p><strong>Name:</strong> ${currentSelectedPatient.first_name} ${currentSelectedPatient.last_name}</p>
                <p><strong>Email:</strong> ${currentSelectedPatient.email || 'N/A'}</p>
                <p><strong>Phone:</strong> ${currentSelectedPatient.phone || 'N/A'}</p>
            </div>

            <h3>Clinical History</h3>
            <div>
                ${notesHtml}
            </div>
        </body>
        </html>
    `;

    try {
        const result = await window.api.generatePDF(htmlContent, `Discharge_${currentSelectedPatient.last_name}`);
        if (result.success) {
            alert(`Discharge summary saved to:\n${result.path}`);
        } else {
            alert("Error generating PDF: " + result.error);
        }
    } catch (error) {
        console.error("PDF generation failed:", error);
        alert("Failed to generate PDF.");
    }
}
