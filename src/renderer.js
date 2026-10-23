'use strict';

// ═══════════════════════════════════════════════════════════════════════════
// UTILITIES
// ═══════════════════════════════════════════════════════════════════════════

const $ = (id) => document.getElementById(id);

function debounce(fn, ms) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), ms);
  };
}

/** Format an ISO datetime string to a readable local date */
function fmtDate(iso) {
  if (!iso) return '—';
  try {
    return new Date(iso).toLocaleDateString('en-AU', {
      day: 'numeric', month: 'short', year: 'numeric',
    });
  } catch { return iso; }
}

/** Format an ISO datetime string to date + time */
function fmtDateTime(iso) {
  if (!iso) return '—';
  try {
    return new Date(iso).toLocaleString('en-AU', {
      day: 'numeric', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });
  } catch { return iso; }
}

// ═══════════════════════════════════════════════════════════════════════════
// THEME ENGINE
// ═══════════════════════════════════════════════════════════════════════════

const THEME_KEY = 'clinic:theme';

function initTheme() {
  const saved  = localStorage.getItem(THEME_KEY);
  const osDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  applyTheme(saved ? saved === 'dark' : osDark, false);
}

function applyTheme(isDark, animate = true) {
  if (!animate) {
    document.documentElement.classList.add('no-transition');
    document.documentElement.classList.toggle('dark', isDark);
    requestAnimationFrame(() =>
      requestAnimationFrame(() =>
        document.documentElement.classList.remove('no-transition')
      )
    );
  } else {
    document.documentElement.classList.toggle('dark', isDark);
  }
  const iconSun  = $('icon-sun');
  const iconMoon = $('icon-moon');
  const label    = $('theme-label');
  if (iconSun)  iconSun.classList.toggle('hidden', !isDark);
  if (iconMoon) iconMoon.classList.toggle('hidden', isDark);
  if (label)    label.textContent = isDark ? 'Light Mode' : 'Dark Mode';
}

function toggleTheme() {
  const isDark = document.documentElement.classList.contains('dark');
  localStorage.setItem(THEME_KEY, isDark ? 'light' : 'dark');
  applyTheme(!isDark, true);
}

const btnTheme = $('btn-theme-toggle');
if (btnTheme) btnTheme.addEventListener('click', toggleTheme);
initTheme();

// ═══════════════════════════════════════════════════════════════════════════
// NAVIGATION
// ═══════════════════════════════════════════════════════════════════════════

const ALL_VIEWS = ['dashboard', 'diary', 'patients', 'programs', 'invoicing', 'settings'];

function switchView(target) {
  ALL_VIEWS.forEach(v => {
    const el = $(`view-${v}`);
    if (!el) return;
    el.classList.toggle('hidden', v !== target);
    el.classList.toggle('flex',   v === target);
  });
  document.querySelectorAll('[data-view]').forEach(link => {
    link.className = link.dataset.view === target ? 'nav-item-active' : 'nav-item';
  });

  // Activate diary when navigating to it
  if (target === 'diary' && window.Diary) {
    // diary.js is loaded after renderer.js; use rAF to ensure DOM is ready
    requestAnimationFrame(() => window.Diary.activate());
  }
}

document.querySelectorAll('[data-view]').forEach(link => {
  link.addEventListener('click', e => { e.preventDefault(); switchView(link.dataset.view); });
});

// ═══════════════════════════════════════════════════════════════════════════
// CLOCK
// ═══════════════════════════════════════════════════════════════════════════

function startClock() {
  const els = {
    h: $('clock-h'), m: $('clock-m'), s: $('clock-s'), date: $('clock-date'),
    ovH: $('ov-h'), ovM: $('ov-m'), ovS: $('ov-s'), ovDate: $('ov-date'),
  };
  const pad = n => String(n).padStart(2, '0');

  function tick() {
    const now = new Date();
    const h = pad(now.getHours()), m = pad(now.getMinutes()), s = pad(now.getSeconds());
    const dateStr = now.toLocaleDateString('en-AU', {
      weekday: 'long', month: 'long', day: 'numeric', year: 'numeric',
    });
    if (els.h)      els.h.textContent      = h;
    if (els.m)      els.m.textContent      = m;
    if (els.s)      els.s.textContent      = s;
    if (els.date)   els.date.textContent   = dateStr;
    if (els.ovH)    els.ovH.textContent    = h;
    if (els.ovM)    els.ovM.textContent    = m;
    if (els.ovS)    els.ovS.textContent    = s;
    if (els.ovDate) els.ovDate.textContent = dateStr;
  }
  tick();
  setInterval(tick, 1000);
}

startClock();

// ═══════════════════════════════════════════════════════════════════════════
// CLOCK OVERLAY
// ═══════════════════════════════════════════════════════════════════════════

const clockOverlay   = $('clock-overlay');
const overlayContent = $('overlay-content');
const clockTrigger   = $('clock-trigger');

function openClockOverlay() {
  if (!clockOverlay) return;
  clockOverlay.classList.remove('opacity-0', 'pointer-events-none');
  clockOverlay.classList.add('opacity-100', 'pointer-events-auto');
}
function closeClockOverlay() {
  if (!clockOverlay) return;
  clockOverlay.classList.remove('opacity-100', 'pointer-events-auto');
  clockOverlay.classList.add('opacity-0', 'pointer-events-none');
}

if (clockTrigger) clockTrigger.addEventListener('click', openClockOverlay);
if (clockOverlay) clockOverlay.addEventListener('click', closeClockOverlay);
if (overlayContent) overlayContent.addEventListener('click', e => e.stopPropagation());

// ═══════════════════════════════════════════════════════════════════════════
// SESSION STOPWATCH
// ═══════════════════════════════════════════════════════════════════════════

let swRunning = false, swSeconds = 0, swInterval = null;
const swDisplay = $('sw-display');
const swToggle  = $('sw-toggle');
const swLabel   = $('sw-label');
const swReset   = $('sw-reset');

function renderSW() {
  if (swDisplay) swDisplay.textContent =
    `${String(Math.floor(swSeconds / 60)).padStart(2,'0')}:${String(swSeconds % 60).padStart(2,'0')}`;
}

function startSW() {
  swRunning = true;
  swInterval = setInterval(() => { swSeconds++; renderSW(); }, 1000);
  if (swToggle) swToggle.textContent = 'Pause';
  if (swLabel)  swLabel.textContent  = '';
}
function pauseSW() {
  swRunning = false;
  clearInterval(swInterval); swInterval = null;
  if (swToggle) swToggle.textContent = 'Resume';
}
function resetSW() {
  pauseSW(); swSeconds = 0; renderSW();
  if (swToggle) swToggle.textContent = 'Start Session';
}

if (swToggle) swToggle.addEventListener('click', () => {
  if (!swRunning && swSeconds === 0) startSW();
  else if (swRunning) pauseSW();
  else startSW();
});
if (swReset) swReset.addEventListener('click', resetSW);
renderSW();

// ═══════════════════════════════════════════════════════════════════════════
// RED FLAGS DRAWER
// ═══════════════════════════════════════════════════════════════════════════

const rfDrawer   = $('rf-drawer');
const rfBackdrop = $('rf-backdrop');
const rfClose    = $('rf-close');

function openRF() {
  if (!rfDrawer) return;
  rfDrawer.classList.remove('translate-x-full');
  rfBackdrop.classList.remove('opacity-0', 'pointer-events-none');
  rfBackdrop.classList.add('opacity-100', 'pointer-events-auto');
}
function closeRF() {
  if (!rfDrawer) return;
  rfDrawer.classList.add('translate-x-full');
  rfBackdrop.classList.remove('opacity-100', 'pointer-events-auto');
  rfBackdrop.classList.add('opacity-0', 'pointer-events-none');
}

['btn-red-flags', 'btn-red-flags-2'].forEach(id => {
  const btn = $(id);
  if (btn) btn.addEventListener('click', openRF);
});
if (rfClose)    rfClose.addEventListener('click', closeRF);
if (rfBackdrop) rfBackdrop.addEventListener('click', closeRF);

// ═══════════════════════════════════════════════════════════════════════════
// OMNI-SEARCH  — real-time fuzzy dropdown with keyboard navigation
// ═══════════════════════════════════════════════════════════════════════════

const searchInput    = $('omni-search');
const searchDropdown = $('search-dropdown');
const resultsList    = $('search-results-list');
const searchCreateBtn = $('search-create-btn');

let searchResults  = [];   // current result array
let searchFocusIdx = -1;   // keyboard-highlighted row index

/** Position the dropdown directly beneath the search input */
function positionDropdown() {
  if (!searchInput || !searchDropdown) return;
  const rect = searchInput.getBoundingClientRect();
  searchDropdown.style.left   = `${rect.left}px`;
  searchDropdown.style.top    = `${rect.bottom + 6}px`;
  searchDropdown.style.width  = `${rect.width}px`;
}

function openSearchDropdown() {
  if (!searchDropdown) return;
  positionDropdown();
  searchDropdown.classList.remove('hidden');
}

function closeSearchDropdown() {
  if (!searchDropdown) return;
  searchDropdown.classList.add('hidden');
  searchFocusIdx = -1;
}

function renderSearchResults(results) {
  searchResults  = results;
  searchFocusIdx = -1;
  if (!resultsList) return;

  if (!results.length) {
    resultsList.innerHTML = `
      <li class="px-4 py-5 text-center text-sm text-slate-400 dark:text-slate-600">
        No patients found.
      </li>`;
    return;
  }

  resultsList.innerHTML = results.map((p, i) => `
    <li class="search-result-item" data-idx="${i}" data-id="${p.id}" role="option">
      <!-- Avatar initials -->
      <span class="flex-none flex h-8 w-8 items-center justify-center rounded-full
                   bg-indigo-100 dark:bg-indigo-500/20
                   text-[11px] font-semibold text-indigo-600 dark:text-indigo-400
                   select-none shrink-0">
        ${p.first_name[0]}${p.last_name[0]}
      </span>
      <span class="flex-1 min-w-0">
        <span class="block font-medium text-slate-900 dark:text-slate-100 truncate">
          ${p.first_name} ${p.last_name}
        </span>
        <span class="block text-xs text-slate-400 dark:text-slate-600 truncate mt-0.5">
          ${[p.phone, p.email].filter(Boolean).join(' · ') || 'No contact on record'}
        </span>
      </span>
      <svg class="h-3.5 w-3.5 shrink-0 text-slate-300 dark:text-slate-700"
           fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
      </svg>
    </li>
  `).join('');

  // Click to open profile
  resultsList.querySelectorAll('.search-result-item').forEach(li => {
    li.addEventListener('click', () => {
      const id = Number(li.dataset.id);
      closeSearchDropdown();
      if (searchInput) searchInput.value = '';
      openPatientProfile(id);
    });
  });
}

function highlightResult(idx) {
  const items = resultsList ? resultsList.querySelectorAll('.search-result-item') : [];
  items.forEach((el, i) => el.classList.toggle('is-active', i === idx));
  if (items[idx]) items[idx].scrollIntoView({ block: 'nearest' });
  searchFocusIdx = idx;
}

const doSearch = debounce(async (query) => {
  if (!query || query.length < 1) {
    closeSearchDropdown();
    return;
  }
  try {
    const results = await window.api.patients.search(query);
    renderSearchResults(results);
    openSearchDropdown();
  } catch (err) {
    console.error('[Search] IPC error:', err);
  }
}, 200);

if (searchInput) {
  searchInput.addEventListener('input', e => doSearch(e.target.value.trim()));

  searchInput.addEventListener('keydown', e => {
    if (!searchDropdown || searchDropdown.classList.contains('hidden')) return;
    const len = searchResults.length;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      highlightResult((searchFocusIdx + 1) % len);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      highlightResult((searchFocusIdx - 1 + len) % len);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (searchFocusIdx >= 0 && searchResults[searchFocusIdx]) {
        const patient = searchResults[searchFocusIdx];
        closeSearchDropdown();
        searchInput.value = '';
        openPatientProfile(patient.id);
      }
    }
  });

  // Close dropdown if clicking outside
  document.addEventListener('mousedown', e => {
    if (
      searchDropdown && !searchDropdown.contains(e.target) &&
      e.target !== searchInput
    ) {
      closeSearchDropdown();
    }
  });
}

// Ctrl+K focuses search
document.addEventListener('keydown', e => {
  if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
    e.preventDefault();
    if (searchInput) { searchInput.focus(); searchInput.select(); }
  }
  if (e.key === 'Escape') {
    closeClockOverlay();
    closeRF();
    closeSearchDropdown();
    closeNewPatientModal();
  }
});

// "New patient" link inside dropdown footer
if (searchCreateBtn) searchCreateBtn.addEventListener('click', () => {
  closeSearchDropdown();
  openNewPatientModal();
});

// ═══════════════════════════════════════════════════════════════════════════
// NEW PATIENT MODAL
// ═══════════════════════════════════════════════════════════════════════════

const npBackdrop = $('np-backdrop');
const npModal    = $('np-modal');
const npPanel    = $('np-panel');
const npForm     = $('np-form');
const npClose    = $('np-close');
const npCancel   = $('np-cancel');
const npSubmit   = $('np-submit');
const npSpinner  = $('np-spinner');
const npLabel    = $('np-submit-label');
const npError    = $('np-error');
const npErrorTxt = $('np-error-text');

function openNewPatientModal(prefill = '') {
  if (!npModal) return;
  // Reset form
  if (npForm) npForm.reset();
  if (prefill && $('np-first-name')) {
    const parts = prefill.trim().split(' ');
    $('np-first-name').value = parts[0] || '';
    $('np-last-name').value  = parts.slice(1).join(' ') || '';
  }
  hideNpError();
  setNpLoading(false);

  npBackdrop.classList.remove('opacity-0', 'pointer-events-none');
  npBackdrop.classList.add('opacity-100', 'pointer-events-auto');
  npModal.classList.remove('opacity-0', 'pointer-events-none');
  npModal.classList.add('opacity-100', 'pointer-events-auto');
  npPanel.classList.remove('translate-y-4');

  // Auto-focus first name
  setTimeout(() => { const el = $('np-first-name'); if (el) el.focus(); }, 50);
}

function closeNewPatientModal() {
  if (!npModal) return;
  npBackdrop.classList.remove('opacity-100', 'pointer-events-auto');
  npBackdrop.classList.add('opacity-0', 'pointer-events-none');
  npModal.classList.remove('opacity-100', 'pointer-events-auto');
  npModal.classList.add('opacity-0', 'pointer-events-none');
  npPanel.classList.add('translate-y-4');
}

function showNpError(msg) {
  if (!npError) return;
  npError.classList.remove('hidden');
  npError.classList.add('flex');
  if (npErrorTxt) npErrorTxt.textContent = msg;
}
function hideNpError() {
  if (!npError) return;
  npError.classList.add('hidden');
  npError.classList.remove('flex');
}

function setNpLoading(on) {
  if (npSpinner) npSpinner.classList.toggle('hidden', !on);
  if (npLabel)   npLabel.textContent = on ? 'Saving…' : 'Save Patient';
  if (npSubmit)  npSubmit.disabled   = on;
}

// "New Appointment" button → open New Patient modal
const btnNewAppt = $('btn-new-appt');
if (btnNewAppt) btnNewAppt.addEventListener('click', () => openNewPatientModal());

if (npClose)   npClose.addEventListener('click',   closeNewPatientModal);
if (npCancel)  npCancel.addEventListener('click',  closeNewPatientModal);
if (npBackdrop) npBackdrop.addEventListener('click', closeNewPatientModal);
if (npPanel)   npPanel.addEventListener('click', e => e.stopPropagation());

// Form submit
if (npForm) {
  npForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    hideNpError();

    const data = {
      first_name:        ($('np-first-name')?.value || '').trim(),
      last_name:         ($('np-last-name')?.value  || '').trim(),
      phone:             ($('np-phone')?.value       || '').trim(),
      email:             ($('np-email')?.value       || '').trim(),
      dob:               ($('np-dob')?.value         || '').trim(),
      emergency_contact: ($('np-emergency')?.value   || '').trim(),
    };

    if (!data.first_name) { showNpError('First name is required.'); $('np-first-name')?.focus(); return; }
    if (!data.last_name)  { showNpError('Last name is required.');  $('np-last-name')?.focus();  return; }

    setNpLoading(true);
    try {
      const patient = await window.api.patients.create(data);
      setNpLoading(false);
      closeNewPatientModal();
      // Navigate straight to the new patient's profile
      openPatientProfile(patient.id, patient);
      // Refresh stats
      loadStats();
    } catch (err) {
      setNpLoading(false);
      showNpError(err.message || 'Failed to save patient. Please try again.');
    }
  });
}

// ═══════════════════════════════════════════════════════════════════════════
// PATIENT PROFILE VIEW
// ═══════════════════════════════════════════════════════════════════════════

const patientProfile = $('patient-profile');
const profileBack    = $('profile-back');

async function openPatientProfile(id, preloaded = null) {
  if (!patientProfile) return;

  // Show immediately with skeleton state
  patientProfile.classList.remove('opacity-0', 'pointer-events-none');
  patientProfile.classList.add('opacity-100', 'pointer-events-auto');

  // Populate from preloaded data or fetch
  const patient = preloaded && preloaded.appointments
    ? preloaded
    : await window.api.patients.getById(id);

  if (!patient) {
    patientProfile.classList.add('opacity-0', 'pointer-events-none');
    patientProfile.classList.remove('opacity-100', 'pointer-events-auto');
    console.error('[Profile] Patient not found:', id);
    return;
  }

  // Header
  const profileName = $('profile-name');
  const profileMeta = $('profile-meta');
  if (profileName) profileName.textContent = `${patient.first_name} ${patient.last_name}`;
  if (profileMeta) {
    const parts = [];
    if (patient.dob) parts.push(`DOB: ${fmtDate(patient.dob)}`);
    if (patient.phone) parts.push(patient.phone);
    if (patient.email) parts.push(patient.email);
    profileMeta.textContent = parts.join(' · ') || '—';
  }

  // Contact card
  const setText = (id, val) => { const el = $(id); if (el) el.textContent = val || '—'; };
  setText('profile-phone',     patient.phone);
  setText('profile-email',     patient.email);
  setText('profile-dob',       patient.dob ? fmtDate(patient.dob) : null);
  setText('profile-emergency', patient.emergency_contact);
  setText('profile-since',     fmtDate(patient.created_at));

  // Appointments
  const appts      = patient.appointments || [];
  const apptCount  = $('profile-appt-count');
  const apptsList  = $('profile-appts');
  if (apptCount) apptCount.textContent = appts.length;
  if (apptsList) {
    apptsList.innerHTML = appts.length ? appts.map(a => `
      <div class="flex items-center justify-between px-5 py-3 gap-4">
        <div class="min-w-0">
          <p class="text-sm font-medium text-slate-800 dark:text-slate-200 truncate">${a.type}</p>
          <p class="text-xs text-slate-400 dark:text-slate-600 mt-0.5">${fmtDateTime(a.scheduled_at)}</p>
        </div>
        <span class="shrink-0 inline-flex items-center rounded-full px-2.5 py-1
                     text-[10px] font-semibold uppercase tracking-wide
                     ${a.status === 'completed' ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                      : a.status === 'cancelled' ? 'bg-red-50 dark:bg-red-500/10 text-red-500 dark:text-red-400'
                      : 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400'}">
          ${a.status}
        </span>
      </div>
    `).join('') : `<p class="px-5 py-8 text-center text-sm text-slate-400 dark:text-slate-600">No appointments on record.</p>`;
  }

  // Clinical notes
  const notes      = patient.clinical_notes || [];
  const notesCount = $('profile-notes-count');
  const notesList  = $('profile-notes');
  if (notesCount) notesCount.textContent = notes.length;
  if (notesList) {
    notesList.innerHTML = notes.length ? notes.map(n => `
      <div class="px-5 py-4">
        <p class="text-xs font-semibold text-slate-500 dark:text-slate-500 mb-2">
          ${fmtDate(n.created_at)}
        </p>
        ${n.subjective  ? `<p class="text-sm text-slate-700 dark:text-slate-300 mb-1"><span class="font-semibold">S:</span> ${n.subjective}</p>` : ''}
        ${n.objective   ? `<p class="text-sm text-slate-700 dark:text-slate-300 mb-1"><span class="font-semibold">O:</span> ${n.objective}</p>` : ''}
        ${n.assessment  ? `<p class="text-sm text-slate-700 dark:text-slate-300 mb-1"><span class="font-semibold">A:</span> ${n.assessment}</p>` : ''}
        ${n.plan        ? `<p class="text-sm text-slate-700 dark:text-slate-300"><span class="font-semibold">P:</span> ${n.plan}</p>` : ''}
      </div>
    `).join('') : `<p class="px-5 py-8 text-center text-sm text-slate-400 dark:text-slate-600">No clinical notes on record.</p>`;
  }
}

function closePatientProfile() {
  if (!patientProfile) return;
  patientProfile.classList.add('opacity-0', 'pointer-events-none');
  patientProfile.classList.remove('opacity-100', 'pointer-events-auto');
}

if (profileBack) profileBack.addEventListener('click', closePatientProfile);

// ═══════════════════════════════════════════════════════════════════════════
// DAILY SCHEDULE
// ═══════════════════════════════════════════════════════════════════════════

const SCHEDULE_START = 8;
const SCHEDULE_END   = 18;
const SLOT_INTERVAL  = 30;

const DEMO_APPOINTMENTS = [
  { id: 1, patientName: 'Sarah Mitchell',  type: 'Initial Assessment', hour: 9,  minute: 0,  duration: 60, status: 'confirmed' },
  { id: 2, patientName: 'James Thornton',  type: 'Follow-up Session',  hour: 11, minute: 0,  duration: 45, status: 'confirmed' },
  { id: 3, patientName: 'Emma Rodriguez',  type: 'Dry Needling',       hour: 14, minute: 30, duration: 30, status: 'pending'   },
];

function buildSchedule() {
  const container      = $('schedule-container');
  const scheduleDateEl = $('schedule-date');
  if (!container) return;

  if (scheduleDateEl) {
    scheduleDateEl.textContent = new Date().toLocaleDateString('en-AU', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
    });
  }

  const frag = document.createDocumentFragment();
  for (let h = SCHEDULE_START; h < SCHEDULE_END; h++)
    for (let m = 0; m < 60; m += SLOT_INTERVAL)
      frag.appendChild(createTimeSlotRow(h, m));

  container.appendChild(frag);

  DEMO_APPOINTMENTS.forEach(appt => {
    const slot = document.getElementById(slotBodyId(appt.hour, appt.minute));
    if (slot) slot.appendChild(createApptCard(appt));
  });

  addNowIndicator();
  scrollToNow();
}

function slotBodyId(h, m) {
  return `slot-${String(h).padStart(2,'0')}-${String(m).padStart(2,'0')}`;
}

function createTimeSlotRow(h, m) {
  const isHour = m === 0;
  const timeStr = `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}`;
  const row = document.createElement('div');
  row.className = `flex gap-3 py-1 ${isHour ? 'border-t border-slate-200 dark:border-slate-800' : 'border-t border-dashed border-slate-100 dark:border-slate-800/50'}`;
  row.dataset.time = timeStr;

  const label = document.createElement('span');
  label.className = `w-11 shrink-0 text-right pt-1 font-mono text-[11px] leading-none select-none ${isHour ? 'font-medium text-slate-500 dark:text-slate-500' : 'text-slate-300 dark:text-slate-700'}`;
  label.textContent = isHour ? timeStr : '·';

  const body = document.createElement('div');
  body.id = slotBodyId(h, m);
  body.className = 'flex-1 min-h-[44px] relative rounded-md transition-all duration-100 flex flex-col gap-1';
  body.dataset.time = timeStr;

  body.addEventListener('dragover', e => { e.preventDefault(); e.dataTransfer.dropEffect = 'move'; body.classList.add('drop-active'); });
  body.addEventListener('dragleave', () => body.classList.remove('drop-active'));
  body.addEventListener('drop', e => {
    e.preventDefault(); body.classList.remove('drop-active');
    const card = document.querySelector(`[data-appt-id="${e.dataTransfer.getData('text/appt-id')}"]`);
    if (card && card.parentElement !== body) body.appendChild(card);
  });

  row.appendChild(label);
  row.appendChild(body);
  return row;
}

function createApptCard(appt) {
  const statusDot  = { confirmed: 'bg-indigo-500', pending: 'bg-amber-400', completed: 'bg-emerald-500' };
  const statusText = { confirmed: 'Confirmed',     pending: 'Pending',      completed: 'Completed'      };

  const card = document.createElement('div');
  card.className = `appt-card status-${appt.status}`;
  card.draggable = true;
  card.dataset.apptId = String(appt.id);

  card.innerHTML = `
    <div class="flex items-center justify-between gap-2">
      <span class="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate leading-snug">${appt.patientName}</span>
      <span class="flex items-center gap-1 shrink-0">
        <span class="h-1.5 w-1.5 rounded-full ${statusDot[appt.status] ?? 'bg-slate-400'}"></span>
        <span class="text-[10px] font-medium text-slate-500 dark:text-slate-400">${statusText[appt.status] ?? appt.status}</span>
      </span>
    </div>
    <span class="text-[11px] text-slate-400 dark:text-slate-500 leading-snug">${appt.type} &middot; ${appt.duration}&thinsp;min</span>
  `;

  card.addEventListener('dragstart', e => {
    e.dataTransfer.setData('text/appt-id', String(appt.id));
    e.dataTransfer.effectAllowed = 'move';
    requestAnimationFrame(() => card.classList.add('dragging'));
  });
  card.addEventListener('dragend', () => card.classList.remove('dragging'));
  return card;
}

function addNowIndicator() {
  const now = new Date();
  const h = now.getHours(), m = now.getMinutes() < SLOT_INTERVAL ? 0 : SLOT_INTERVAL;
  if (h < SCHEDULE_START || h >= SCHEDULE_END) return;
  const body = document.getElementById(slotBodyId(h, m));
  if (!body) return;
  const line = document.createElement('div');
  line.className = 'absolute -top-px left-0 right-0 h-px z-10 bg-indigo-500 dark:bg-indigo-400';
  const dot = document.createElement('span');
  dot.className = 'absolute -left-1 -top-[3px] h-[7px] w-[7px] rounded-full bg-indigo-500 dark:bg-indigo-400';
  line.appendChild(dot);
  body.style.position = 'relative';
  body.prepend(line);
}

function scrollToNow() {
  const now = new Date();
  const h = now.getHours(), m = now.getMinutes() < SLOT_INTERVAL ? 0 : SLOT_INTERVAL;
  if (h < SCHEDULE_START || h >= SCHEDULE_END) return;
  const prevH = m === 0 ? h - 1 : h, prevM = m === 0 ? 30 : 0;
  const tH = prevH >= SCHEDULE_START ? prevH : h, tM = prevH >= SCHEDULE_START ? prevM : m;
  const row = document.getElementById(slotBodyId(tH, tM));
  if (row) row.scrollIntoView({ block: 'start', behavior: 'instant' });
}

buildSchedule();

// ═══════════════════════════════════════════════════════════════════════════
// SCRATCHPAD
// ═══════════════════════════════════════════════════════════════════════════

const SCRATCH_KEY = 'clinic:scratchpad';

function initScratchpad() {
  const el      = $('scratchpad');
  const savedEl = $('scratchpad-saved');
  if (!el) return;
  el.value = localStorage.getItem(SCRATCH_KEY) ?? '';
  const save = debounce(() => {
    localStorage.setItem(SCRATCH_KEY, el.value);
    if (savedEl) {
      savedEl.style.opacity = '1';
      clearTimeout(savedEl._t);
      savedEl._t = setTimeout(() => { savedEl.style.opacity = '0'; }, 1800);
    }
  }, 600);
  el.addEventListener('input', save);
}

initScratchpad();

// ═══════════════════════════════════════════════════════════════════════════
// STATS  — single IPC round-trip via stats:dashboard
// ═══════════════════════════════════════════════════════════════════════════

async function loadStats() {
  try {
    const today = new Date().toISOString().split('T')[0];
    const s = await window.api.stats.dashboard(today);

    const elP = $('stat-total-patients');
    const elA = $('stat-today-appts');
    const elN = $('stat-notes');
    const elC = $('appt-count');

    if (elP) elP.textContent = s.totalPatients ?? 0;
    if (elA) elA.textContent = s.todayAppts    ?? 0;
    if (elN) elN.textContent = s.totalNotes    ?? 0;
    if (elC) elC.textContent = DEMO_APPOINTMENTS.length;
  } catch (err) {
    console.error('[Stats]', err);
  }
}

loadStats();
