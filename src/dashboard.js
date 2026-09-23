// Clock Logic
function updateClock() {
    const now = new Date();
    const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const dateString = now.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' });

    document.getElementById('header-clock').textContent = `${timeString}`;

    const dashClock = document.getElementById('dashboard-large-clock');
    if (dashClock) {
        dashClock.innerHTML = `
            <div class="text-6xl font-bold tracking-tight text-gray-800">${timeString}</div>
            <div class="text-xl text-gray-500 mt-2">${dateString}</div>
        `;
    }
}

setInterval(updateClock, 1000);
updateClock();

// Dashboard Init
document.addEventListener('DOMContentLoaded', () => {
    buildDashboard();
});

async function buildDashboard() {
    const dashContainer = document.getElementById('view-dashboard');

    dashContainer.innerHTML = `
        <div class="flex flex-col h-full space-y-6">

            <!-- Top Section: Large Clock & Quick Stats -->
            <div class="bg-white rounded-xl shadow-sm p-8 flex items-center justify-between border border-gray-100">
                <div id="dashboard-large-clock" class="flex flex-col">
                    <!-- Clock injected here -->
                </div>

                <div class="flex space-x-8">
                    <div class="text-center">
                        <div class="text-3xl font-bold text-blue-600" id="dash-stat-appts">0</div>
                        <div class="text-sm text-gray-500 uppercase tracking-wide">Today's Appts</div>
                    </div>
                </div>
            </div>

            <!-- Diary Section (Drag & Drop) -->
            <div class="flex-1 bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col overflow-hidden">
                <div class="px-6 py-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
                    <div class="flex items-center space-x-4">
                        <h3 class="text-lg font-semibold text-gray-800">Daily Diary</h3>
                        <button onclick="openCreateAppointmentModal()" class="text-sm font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-full hover:bg-blue-100">+ New Appointment</button>
                    </div>
                    <div class="text-sm text-gray-500">Drag to reschedule</div>
                </div>

                <div class="flex-1 overflow-y-auto p-4 relative" id="diary-container">
                    <!-- Time slots will be generated here -->
                </div>
            </div>
        </div>
    `;

    await renderDiary();
}

async function renderDiary() {
    const container = document.getElementById('diary-container');
    container.innerHTML = '';

    // Generate time slots from 8 AM to 6 PM
    const startHour = 8;
    const endHour = 18;

    for (let hour = startHour; hour <= endHour; hour++) {
        // Create full hour slot
        const hourStr = hour.toString().padStart(2, '0');
        createTimeSlot(container, `${hourStr}:00`);
        // Create half hour slot
        if (hour !== endHour) {
            createTimeSlot(container, `${hourStr}:30`);
        }
    }

    // Fetch today's appointments
    const today = new Date().toLocaleDateString('en-CA');
    try {
        const appointments = await window.api.getAppointmentsByDate(today);
        document.getElementById('dash-stat-appts').innerText = appointments.length;

        appointments.forEach(appt => {
            const title = `${appt.first_name} ${appt.last_name}`;
            addAppointmentToSlot(appt.start_time, title, appt.id);
        });
    } catch (error) {
        console.error("Failed to load appointments for diary", error);
    }

    // Add form listener for new appointments
    const caForm = document.getElementById('create-appointment-form');
    if (caForm && !caForm.dataset.bound) {
        caForm.dataset.bound = true;
        caForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const patientId = document.getElementById('ca-patient').value;
            const date = document.getElementById('ca-date').value;
            const startTime = document.getElementById('ca-time').value;

            let [hours, mins] = startTime.split(':').map(Number);
            mins += 30;
            if (mins >= 60) { hours += 1; mins -= 60; }
            const endTime = `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;

            const notes = document.getElementById('ca-notes').value;

            try {
                await window.api.createAppointment({
                    patient_id: patientId,
                    appointment_date: date,
                    start_time: startTime,
                    end_time: endTime,
                    notes: notes
                });
                closeCreateAppointmentModal();
                renderDiary(); // Refresh dashboard
            } catch (error) {
                console.error("Error creating appointment:", error);
                alert("Failed to book appointment.");
            }
        });
    }
}

async function openCreateAppointmentModal() {
    const modal = document.getElementById('create-appointment-modal');
    modal.classList.remove('hidden');
    modal.classList.add('flex');

    document.getElementById('ca-date').valueAsDate = new Date();

    try {
        const select = document.getElementById('ca-patient');
        select.innerHTML = '<option value="">Select a patient...</option>';
        const patients = await window.api.getPatients();
        patients.forEach(p => {
            const opt = document.createElement('option');
            opt.value = p.id;
            opt.innerText = `${p.first_name} ${p.last_name}`;
            select.appendChild(opt);
        });
    } catch (error) {
        console.error("Error loading patients for appointment", error);
    }
}

function closeCreateAppointmentModal() {
    const modal = document.getElementById('create-appointment-modal');
    modal.classList.add('hidden');
    modal.classList.remove('flex');
    document.getElementById('create-appointment-form').reset();
}

function createTimeSlot(parent, timeLabel) {
    const slot = document.createElement('div');
    slot.className = 'flex border-b border-gray-100 min-h-[60px] diary-time-slot group';
    slot.dataset.time = timeLabel;

    // Drag Drop events
    slot.addEventListener('dragover', handleDragOver);
    slot.addEventListener('dragleave', handleDragLeave);
    slot.addEventListener('drop', handleDrop);

    slot.innerHTML = `
        <div class="w-20 pr-4 text-right py-2 text-sm text-gray-500 select-none">${timeLabel}</div>
        <div class="flex-1 relative border-l border-gray-100 group-hover:bg-gray-50 transition-colors p-1 drop-zone" data-time="${timeLabel}">
        </div>
    `;

    parent.appendChild(slot);
}

function addAppointmentToSlot(timeLabel, title, id) {
    const slot = document.querySelector(`.drop-zone[data-time="${timeLabel}"]`);
    if (!slot) return;

    const appt = document.createElement('div');
    appt.className = 'absolute inset-x-2 top-1 bottom-1 bg-blue-100 border border-blue-200 rounded-md p-2 cursor-grab shadow-sm flex flex-col justify-center active:cursor-grabbing';
    appt.draggable = true;
    appt.id = `appt-${id}`;
    appt.dataset.id = id;

    appt.addEventListener('dragstart', handleDragStart);
    appt.addEventListener('dragend', handleDragEnd);

    appt.innerHTML = `
        <div class="text-sm font-semibold text-blue-900 pointer-events-none">${title}</div>
    `;

    slot.appendChild(appt);
}

// Drag & Drop Handlers
let draggedItem = null;

function handleDragStart(e) {
    draggedItem = this;
    setTimeout(() => this.classList.add('opacity-50'), 0);
    e.dataTransfer.effectAllowed = 'move';
}

function handleDragEnd(e) {
    this.classList.remove('opacity-50');
    draggedItem = null;

    document.querySelectorAll('.drop-zone').forEach(zone => {
        zone.classList.remove('bg-blue-50');
    });
}

function handleDragOver(e) {
    e.preventDefault(); // Necessary to allow dropping
    e.dataTransfer.dropEffect = 'move';
    const dropZone = this.querySelector('.drop-zone');
    if (dropZone) dropZone.classList.add('bg-blue-50');
    return false;
}

function handleDragLeave(e) {
    const dropZone = this.querySelector('.drop-zone');
    if (dropZone) dropZone.classList.remove('bg-blue-50');
}

async function handleDrop(e) {
    e.stopPropagation(); // Stops some browsers from redirecting
    const dropZone = this.querySelector('.drop-zone');
    if (dropZone) dropZone.classList.remove('bg-blue-50');

    if (draggedItem && dropZone) {
        // If slot is empty, append
        if (dropZone.children.length === 0) {
            dropZone.appendChild(draggedItem);

            const newStartTime = dropZone.dataset.time;
            const apptId = draggedItem.dataset.id;

            // Calculate a dummy end time (+30 mins for demo)
            let [hours, mins] = newStartTime.split(':').map(Number);
            mins += 30;
            if (mins >= 60) {
                hours += 1;
                mins -= 60;
            }
            const newEndTime = `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;

            try {
                await window.api.updateAppointmentTime(apptId, newStartTime, newEndTime);
                console.log(`Appointment ${apptId} moved to ${newStartTime}`);
            } catch (error) {
                console.error("Failed to update appointment time:", error);
                alert("Failed to save new appointment time.");
            }
        }
    }
    return false;
}