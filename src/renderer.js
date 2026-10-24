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

  // Activate patients directory when navigating to it
  if (target === 'patients' && typeof loadPatientsDirectory === 'function') {
    loadPatientsDirectory();
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
// PATIENTS DIRECTORY VIEW & PATIENT PORTFOLIO HUB (Phase 4)
// ═══════════════════════════════════════════════════════════════════════════

let activePortfolioPatientId = null;

function computeAge(dobStr) {
  if (!dobStr) return '—';
  const b = new Date(dobStr);
  if (isNaN(b.getTime())) return '—';
  const today = new Date();
  let age = today.getFullYear() - b.getFullYear();
  const m = today.getMonth() - b.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < b.getDate())) age--;
  return age >= 0 ? `${age} yrs old` : '—';
}

function formatAddendumTimestamp(isoStr) {
  const d = isoStr ? new Date(isoStr) : new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  const hh = String(d.getHours()).padStart(2, '0');
  const min = String(d.getMinutes()).padStart(2, '0');
  return `[Addendum added: ${yyyy}-${mm}-${dd} ${hh}:${min}]`;
}

function escapeHtml(str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function renderMarkdown(raw) {
  if (!raw) return '';
  const escaped = escapeHtml(raw);
  const lines = escaped.split('\n');
  const out = [];
  let inUl = false;
  let inOl = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Heading 3 or 2
    if (/^###\s+(.+)$/.test(line)) {
      if (inUl) { out.push('</ul>'); inUl = false; }
      if (inOl) { out.push('</ol>'); inOl = false; }
      out.push(`<h3>${formatInline(line.replace(/^###\s+/, ''))}</h3>`);
      continue;
    }
    if (/^##\s+(.+)$/.test(line)) {
      if (inUl) { out.push('</ul>'); inUl = false; }
      if (inOl) { out.push('</ol>'); inOl = false; }
      out.push(`<h3>${formatInline(line.replace(/^##\s+/, ''))}</h3>`);
      continue;
    }

    // Unordered bullet list
    if (/^\s*[-*]\s+(.+)$/.test(line)) {
      if (inOl) { out.push('</ol>'); inOl = false; }
      if (!inUl) { out.push('<ul>'); inUl = true; }
      out.push(`<li>${formatInline(line.replace(/^\s*[-*]\s+/, ''))}</li>`);
      continue;
    }

    // Ordered list
    if (/^\s*\d+\.\s+(.+)$/.test(line)) {
      if (inUl) { out.push('</ul>'); inUl = false; }
      if (!inOl) { out.push('<ol>'); inOl = true; }
      out.push(`<li>${formatInline(line.replace(/^\s*\d+\.\s+/, ''))}</li>`);
      continue;
    }

    if (inUl) { out.push('</ul>'); inUl = false; }
    if (inOl) { out.push('</ol>'); inOl = false; }

    if (line.trim() === '') {
      out.push('<br/>');
    } else {
      out.push(`<p>${formatInline(line)}</p>`);
    }
  }

  if (inUl) out.push('</ul>');
  if (inOl) out.push('</ol>');
  return out.join('');
}

function formatInline(str) {
  let s = str.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  s = s.replace(/\*(.*?)\*/g, '<em>$1</em>');
  s = s.replace(/`([^`]+)`/g, '<code>$1</code>');
  s = s.replace(/\[(\d{1,2}:\d{2}(?:\s*[AaPp][Mm])?)\]/g, '<span class="font-mono text-xs px-1.5 py-0.5 rounded bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-semibold">$1</span>');
  return s;
}

const SOAP_TEMPLATE = `### Subjective
- Presenting complaint & mechanism of injury: 
- Pain level (0-10) & symptom behavior: 
- Aggravating & easing factors: 
- Functional impact: 

### Objective
- Observation / posture: 
- Active Range of Motion (AROM): 
- Palpation & neurodynamic tests: 
- Orthopedic special tests: 

### Assessment
- Primary clinical impression / pathology: 
- Impairment list & clinical prognosis: 

### Plan
- In-clinic manual therapy & modalities: 
- Home Exercise Program (HEP) prescribed: 
- Patient education & red flag precautions: 
- Follow-up frequency: `;

const patientProfile = $('patient-profile');
const profileBack    = $('profile-back');

async function openPatientProfile(id, preloaded = null) {
  if (!patientProfile) return;
  activePortfolioPatientId = Number(id);

  // Show overlay
  patientProfile.classList.remove('opacity-0', 'pointer-events-none');
  patientProfile.classList.add('opacity-100', 'pointer-events-auto');

  // Fetch full patient data
  const patient = preloaded && preloaded.notes
    ? preloaded
    : await window.api.patients.getById(id);

  if (!patient) {
    closePatientProfile();
    return;
  }

  // Header and Avatar
  const profileName   = $('profile-name');
  const profileMeta   = $('profile-meta');
  const profileAvatar = $('profile-avatar');
  const fullName = `${patient.first_name} ${patient.last_name}`;
  if (profileName) profileName.textContent = fullName;
  if (profileAvatar) {
    const initials = `${patient.first_name?.[0] || ''}${patient.last_name?.[0] || ''}`.toUpperCase();
    profileAvatar.textContent = initials || 'PT';
  }
  if (profileMeta) {
    const parts = [];
    if (patient.dob) parts.push(`DOB: ${fmtDate(patient.dob)}`);
    if (patient.phone) parts.push(patient.phone);
    if (patient.email) parts.push(patient.email);
    profileMeta.textContent = parts.join(' · ') || '—';
  }

  // Demographics Card
  const setText = (elId, val) => { const el = $(elId); if (el) el.textContent = val || '—'; };
  setText('profile-age',       computeAge(patient.dob));
  setText('profile-dob',       patient.dob ? fmtDate(patient.dob) : '—');
  setText('profile-phone',     patient.phone || '—');
  setText('profile-email',     patient.email || '—');
  setText('profile-emergency', patient.emergency_contact || 'None specified');
  setText('profile-since',     fmtDate(patient.created_at));

  // Next Scheduled Appointment Card
  const nextAppt = patient.next_appointment;
  const nextBadge = $('profile-next-appt-badge');
  const nextDetails = $('profile-next-appt-details');
  const nextBtn = $('btn-next-appt-action');

  if (nextAppt) {
    if (nextBadge) nextBadge.classList.remove('hidden');
    if (nextDetails) {
      nextDetails.innerHTML = `
        <p class="text-sm font-semibold text-slate-900 dark:text-slate-100">${escapeHtml(nextAppt.type || 'Appointment')}</p>
        <p class="text-xs text-indigo-600 dark:text-indigo-400 font-medium">${fmtDateTime(nextAppt.scheduled_at)} (${nextAppt.duration_min || 30} mins)</p>
        ${nextAppt.notes ? `<p class="text-xs text-slate-500 dark:text-slate-400 mt-1 truncate">${escapeHtml(nextAppt.notes)}</p>` : ''}
      `;
    }
    if (nextBtn) {
      nextBtn.textContent = 'View in Diary Grid →';
      nextBtn.onclick = () => {
        closePatientProfile();
        switchView('diary');
      };
    }
  } else {
    if (nextBadge) nextBadge.classList.add('hidden');
    if (nextDetails) {
      nextDetails.innerHTML = `<p class="text-xs text-slate-400 dark:text-slate-600">No upcoming appointments on record.</p>`;
    }
    if (nextBtn) {
      nextBtn.textContent = '+ Schedule Next Appointment';
      nextBtn.onclick = () => {
        if (window.Diary) {
          closePatientProfile();
          switchView('diary');
          window.Diary.openEventDrawer({ patient_id: patient.id, patient_name: fullName });
        }
      };
    }
  }

  // Clear note input and set preview mode off
  const noteInput = $('note-content-input');
  if (noteInput) noteInput.value = '';
  setNotePreviewMode(false);

  // Render clinical notes feed
  await refreshPatientNotesFeed(patient.id);
}

function closePatientProfile() {
  if (!patientProfile) return;
  patientProfile.classList.add('opacity-0', 'pointer-events-none');
  patientProfile.classList.remove('opacity-100', 'pointer-events-auto');
  activePortfolioPatientId = null;
}

if (profileBack) profileBack.addEventListener('click', closePatientProfile);

// Quick action buttons in portfolio header
const btnQuickNewNote = $('btn-quick-new-note');
if (btnQuickNewNote) {
  btnQuickNewNote.addEventListener('click', () => {
    const editor = $('clinical-note-editor-section');
    if (editor) editor.scrollIntoView({ behavior: 'smooth' });
    const input = $('note-content-input');
    if (input) input.focus();
  });
}

const btnProfileBookAppt = $('btn-profile-book-appt');
if (btnProfileBookAppt) {
  btnProfileBookAppt.addEventListener('click', () => {
    if (activePortfolioPatientId && window.Diary) {
      const pName = $('profile-name')?.textContent || '';
      closePatientProfile();
      switchView('diary');
      window.Diary.openEventDrawer({ patient_id: activePortfolioPatientId, patient_name: pName });
    }
  });
}

// ── Distraction-free Note Editor Controls ───────────────────────────────────

function setNotePreviewMode(isPreview) {
  const input = $('note-content-input');
  const pane  = $('note-preview-pane');
  const tabW  = $('btn-tab-write');
  const tabP  = $('btn-tab-preview');
  if (!input || !pane) return;

  if (isPreview) {
    pane.innerHTML = renderMarkdown(input.value) || '<p class="text-xs italic text-slate-400">Empty note.</p>';
    pane.classList.remove('hidden');
    input.classList.add('hidden');
    if (tabP) tabP.className = 'px-2.5 py-1 text-xs font-semibold rounded-md bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200';
    if (tabW) tabW.className = 'px-2.5 py-1 text-xs font-medium rounded-md text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors';
  } else {
    pane.classList.add('hidden');
    input.classList.remove('hidden');
    if (tabW) tabW.className = 'px-2.5 py-1 text-xs font-semibold rounded-md bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200';
    if (tabP) tabP.className = 'px-2.5 py-1 text-xs font-medium rounded-md text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors';
  }
}

const tabWrite   = $('btn-tab-write');
const tabPreview = $('btn-tab-preview');
if (tabWrite)   tabWrite.addEventListener('click', () => setNotePreviewMode(false));
if (tabPreview) tabPreview.addEventListener('click', () => setNotePreviewMode(true));

// Insert Helper at cursor
function insertAtCursor(text) {
  const el = $('note-content-input');
  if (!el) return;
  setNotePreviewMode(false);
  const start = el.selectionStart || 0;
  const end = el.selectionEnd || 0;
  const val = el.value;
  el.value = val.substring(0, start) + text + val.substring(end);
  el.focus();
  el.selectionStart = el.selectionEnd = start + text.length;
}

$('btn-insert-soap')?.addEventListener('click', () => insertAtCursor(SOAP_TEMPLATE));
$('btn-insert-bullet')?.addEventListener('click', () => insertAtCursor('\n- '));
$('btn-insert-timestamp')?.addEventListener('click', () => {
  const now = new Date();
  const timeStr = `[${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}] `;
  insertAtCursor(timeStr);
});
$('btn-insert-bold')?.addEventListener('click', () => insertAtCursor('**bold text**'));
$('btn-insert-h3')?.addEventListener('click', () => insertAtCursor('\n### Section Title\n'));
$('btn-clear-note')?.addEventListener('click', () => {
  const el = $('note-content-input');
  if (el) el.value = '';
  setNotePreviewMode(false);
});

// Save / Sign Note
const btnSaveNote = $('btn-save-note');
if (btnSaveNote) {
  btnSaveNote.addEventListener('click', async () => {
    if (!activePortfolioPatientId) return;
    const input = $('note-content-input');
    const content = (input?.value || '').trim();
    if (!content) {
      alert('Please enter clinical note content before signing.');
      input?.focus();
      return;
    }

    const spinner = $('note-spinner');
    if (spinner) spinner.classList.remove('hidden');
    btnSaveNote.disabled = true;

    try {
      await window.api.notes.create({
        patient_id: activePortfolioPatientId,
        content: content,
      });

      if (input) input.value = '';
      setNotePreviewMode(false);

      const statusEl = $('note-editor-status');
      if (statusEl) {
        statusEl.textContent = 'Note signed & legally recorded ✓';
        statusEl.classList.remove('hidden');
        setTimeout(() => statusEl.classList.add('hidden'), 4000);
      }

      await refreshPatientNotesFeed(activePortfolioPatientId);
      loadStats();
    } catch (err) {
      alert(err.message || 'Failed to save note.');
    } finally {
      if (spinner) spinner.classList.add('hidden');
      btnSaveNote.disabled = false;
    }
  });
}

// ── Refresh and Render Chronological Notes Feed ─────────────────────────────

async function refreshPatientNotesFeed(patientId) {
  const feed = $('profile-notes-feed');
  const countBadge = $('profile-notes-count');
  if (!feed) return;

  const notes = await window.api.notes.listByPatient(patientId);
  if (countBadge) countBadge.textContent = notes.length;

  if (!notes || notes.length === 0) {
    feed.innerHTML = `
      <div class="card p-8 text-center text-sm text-slate-400 dark:text-slate-600">
        No clinical notes on record. Use the editor above to sign your first consultation note.
      </div>
    `;
    return;
  }

  feed.innerHTML = notes.map(note => {
    const isLocked = note.is_locked === 1;
    const addendums = note.addendums || [];
    const dateFormatted = fmtDateTime(note.created_at);
    const updatedFormatted = note.updated_at !== note.created_at ? fmtDateTime(note.updated_at) : null;

    return `
      <article class="card p-5 space-y-3.5 border-l-4 ${isLocked ? 'border-l-slate-400 dark:border-l-slate-600' : 'border-l-emerald-500'}"
               id="note-card-${note.id}">
        <!-- Note Header -->
        <div class="flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b border-slate-100 dark:border-slate-800">
          <div class="flex items-center gap-2.5">
            <span class="text-xs font-semibold text-slate-900 dark:text-slate-100">${dateFormatted}</span>
            ${updatedFormatted ? `<span class="text-[10px] text-slate-400 dark:text-slate-500">(Edited: ${updatedFormatted})</span>` : ''}
          </div>

          <!-- Status badge & Actions -->
          <div class="flex items-center gap-2">
            ${isLocked ? `
              <span class="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 select-none">
                <svg class="h-2.5 w-2.5 text-slate-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z" clip-rule="evenodd" />
                </svg>
                Locked · Medico-Legal Sealed
              </span>
              <button class="btn-toggle-addendum text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline ml-2"
                      data-note-id="${note.id}">
                + Add Addendum
              </button>
            ` : `
              <span class="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-semibold bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/30 select-none">
                <span class="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                Editable (${note.hours_remaining > 0 ? `${note.hours_remaining}h remaining` : 'Ending soon'})
              </span>
              <button class="btn-edit-note text-xs font-semibold text-slate-600 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 ml-2"
                      data-note-id="${note.id}">
                ✎ Edit Note
              </button>
            `}
          </div>
        </div>

        <!-- Note Content (View Mode) -->
        <div id="note-view-${note.id}" class="note-prose">
          ${renderMarkdown(note.content)}
        </div>

        <!-- In-Place Edit Mode (< 24 hours only) -->
        <div id="note-edit-wrap-${note.id}" class="hidden space-y-2.5 pt-1">
          <textarea id="note-edit-input-${note.id}" rows="6"
                    class="w-full p-3 rounded-lg text-sm bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500">${escapeHtml(note.content)}</textarea>
          <div class="flex items-center justify-end gap-2">
            <button class="btn-cancel-edit btn-ghost text-xs py-1 px-3" data-note-id="${note.id}">Cancel</button>
            <button class="btn-save-edit btn-primary text-xs py-1 px-3" data-note-id="${note.id}">Save Edit</button>
          </div>
        </div>

        <!-- Addendums Section -->
        <div class="space-y-2 pt-1">
          ${addendums.map(add => `
            <div class="addendum-card">
              <div class="flex items-center justify-between text-[11px] font-mono font-semibold text-amber-700 dark:text-amber-400 mb-1">
                <span>${formatAddendumTimestamp(add.timestamp)}</span>
                <span class="text-[9px] uppercase tracking-wider text-amber-600/70 dark:text-amber-500/70 font-sans font-bold">Immutable Addendum</span>
              </div>
              <p class="text-xs text-slate-800 dark:text-slate-200 whitespace-pre-wrap leading-relaxed">${escapeHtml(add.content)}</p>
            </div>
          `).join('')}

          <!-- Add Addendum Form (Expandable) -->
          <div id="addendum-form-${note.id}" class="hidden mt-3 p-3.5 rounded-lg bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
            <p class="text-[11px] font-semibold text-slate-700 dark:text-slate-300">
              New Medico-Legal Addendum (Append-Only)
            </p>
            <textarea id="addendum-input-${note.id}" rows="3"
                      class="w-full p-2.5 rounded-md text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="Addendum text (clarification, late-arriving pathology result, or consultation note)…"></textarea>
            <div class="flex items-center justify-end gap-2">
              <button class="btn-cancel-addendum btn-ghost text-xs py-1 px-2.5" data-note-id="${note.id}">Cancel</button>
              <button class="btn-submit-addendum btn-primary text-xs py-1 px-3" data-note-id="${note.id}">Sign &amp; Append Addendum</button>
            </div>
          </div>
        </div>
      </article>
    `;
  }).join('');

  // Wire event handlers for the rendered notes
  wireNoteInteractions(patientId);
}

function wireNoteInteractions(patientId) {
  // 1. Edit note in-place
  document.querySelectorAll('.btn-edit-note').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.noteId;
      const viewEl = $(`note-view-${id}`);
      const editWrap = $(`note-edit-wrap-${id}`);
      if (viewEl && editWrap) {
        viewEl.classList.add('hidden');
        editWrap.classList.remove('hidden');
      }
    });
  });

  // Cancel edit
  document.querySelectorAll('.btn-cancel-edit').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.noteId;
      const viewEl = $(`note-view-${id}`);
      const editWrap = $(`note-edit-wrap-${id}`);
      if (viewEl && editWrap) {
        viewEl.classList.remove('hidden');
        editWrap.classList.add('hidden');
      }
    });
  });

  // Save edit
  document.querySelectorAll('.btn-save-edit').forEach(btn => {
    btn.addEventListener('click', async () => {
      const id = btn.dataset.noteId;
      const input = $(`note-edit-input-${id}`);
      const content = (input?.value || '').trim();
      if (!content) {
        alert('Note content cannot be empty.');
        return;
      }
      btn.disabled = true;
      try {
        await window.api.notes.update(id, { content });
        await refreshPatientNotesFeed(patientId);
      } catch (err) {
        alert(err.message || 'Failed to update note.');
        btn.disabled = false;
      }
    });
  });

  // 2. Toggle addendum form
  document.querySelectorAll('.btn-toggle-addendum').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.noteId;
      const form = $(`addendum-form-${id}`);
      if (form) {
        form.classList.toggle('hidden');
        if (!form.classList.contains('hidden')) {
          $(`addendum-input-${id}`)?.focus();
        }
      }
    });
  });

  // Cancel addendum
  document.querySelectorAll('.btn-cancel-addendum').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.noteId;
      $(`addendum-form-${id}`)?.classList.add('hidden');
    });
  });

  // Submit addendum
  document.querySelectorAll('.btn-submit-addendum').forEach(btn => {
    btn.addEventListener('click', async () => {
      const id = btn.dataset.noteId;
      const input = $(`addendum-input-${id}`);
      const text = (input?.value || '').trim();
      if (!text) {
        alert('Please enter addendum text before appending.');
        input?.focus();
        return;
      }
      btn.disabled = true;
      try {
        await window.api.notes.addAddendum(id, text);
        await refreshPatientNotesFeed(patientId);
      } catch (err) {
        alert(err.message || 'Failed to append addendum.');
        btn.disabled = false;
      }
    });
  });
}

// ── Patients Directory View (when clicking "Patients" in sidebar) ───────────

async function loadPatientsDirectory() {
  const tbody = $('patients-table-body');
  const countPill = $('patients-view-count');
  const filterInput = $('patients-filter-input');
  if (!tbody) return;

  const query = filterInput ? filterInput.value.trim() : '';
  const patients = query
    ? await window.api.patients.search(query)
    : await window.api.patients.list();

  if (countPill) countPill.textContent = `${patients.length} patient${patients.length === 1 ? '' : 's'}`;

  if (!patients || patients.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="5" class="px-5 py-8 text-center text-sm text-slate-400 dark:text-slate-600">
          ${query ? 'No matching patients found.' : 'No patients registered yet. Click "+ New Patient" to add one.'}
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = patients.map(p => {
    const age = computeAge(p.dob);
    return `
      <tr class="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors cursor-pointer patient-dir-row" data-id="${p.id}">
        <td class="px-5 py-3 font-semibold text-slate-900 dark:text-slate-100">${escapeHtml(p.first_name)} ${escapeHtml(p.last_name)}</td>
        <td class="px-5 py-3 text-slate-600 dark:text-slate-400">${age} ${p.dob ? `<span class="text-xs text-slate-400 dark:text-slate-500">(${fmtDate(p.dob)})</span>` : ''}</td>
        <td class="px-5 py-3 text-slate-600 dark:text-slate-400 font-mono text-xs">${escapeHtml(p.phone || p.email || '—')}</td>
        <td class="px-5 py-3 text-slate-500 dark:text-slate-400 text-xs">${escapeHtml(p.emergency_contact || '—')}</td>
        <td class="px-5 py-3 text-right">
          <button class="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300">
            Open Portfolio →
          </button>
        </td>
      </tr>
    `;
  }).join('');

  tbody.querySelectorAll('.patient-dir-row').forEach(row => {
    row.addEventListener('click', () => {
      const id = row.dataset.id;
      openPatientProfile(id);
    });
  });
}

// Wire Patients view search filter and "+ New Patient"
$('patients-filter-input')?.addEventListener('input', debounce(loadPatientsDirectory, 200));
$('btn-patients-view-new')?.addEventListener('click', openNewPatientModal);

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
