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

const THEME_KEY = 'theme';

function initTheme() {
  const saved  = localStorage.getItem('theme') || localStorage.getItem('clinic:theme');
  const osDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  const isDark = saved !== null ? saved === 'dark' : osDark;
  applyTheme(isDark, false);
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

  localStorage.setItem('theme', isDark ? 'dark' : 'light');
  localStorage.setItem('clinic:theme', isDark ? 'dark' : 'light');

  const iconSun  = $('icon-sun');
  const iconMoon = $('icon-moon');
  const label    = $('theme-label');
  if (iconSun)  iconSun.classList.toggle('hidden', !isDark);
  if (iconMoon) iconMoon.classList.toggle('hidden', isDark);
  if (label)    label.textContent = isDark ? 'Light Mode' : 'Dark Mode';
}

function toggleTheme() {
  const isDark = document.documentElement.classList.contains('dark');
  applyTheme(!isDark, true);
}

const btnTheme = $('btn-theme-toggle');
if (btnTheme) btnTheme.addEventListener('click', toggleTheme);
initTheme();

// ═══════════════════════════════════════════════════════════════════════════
// NAVIGATION
// ═══════════════════════════════════════════════════════════════════════════

const ALL_VIEWS = ['dashboard', 'diary', 'patients', 'smart-phrases', 'programs', 'exercise-library', 'research-library', 'paper-detail', 'invoicing', 'settings'];

function switchView(target) {
  if (target === 'pt-programs') target = 'programs';

  // Ensure full-screen overlays (such as patient portfolio) are completely closed on view switch
  if (typeof closePatientProfile === 'function') {
    closePatientProfile();
  }

  // Strictly hide ALL view containers
  document.querySelectorAll('.view-container').forEach(view => {
    view.classList.add('hidden', 'view-pane-hidden');
    view.classList.remove('flex', 'block', 'view-pane-active', 'active');
    view.style.setProperty('display', 'none', 'important');
    view.style.setProperty('pointer-events', 'none', 'important');
    view.style.setProperty('visibility', 'hidden', 'important');
    view.setAttribute('aria-hidden', 'true');
  });

  // Activate exclusively the active view
  const activeView = document.getElementById(`view-${target}`);
  if (activeView) {
    activeView.classList.remove('hidden', 'view-pane-hidden');
    if (target === 'settings') {
      activeView.classList.add('block', 'view-pane-active', 'active');
      activeView.style.setProperty('display', 'block', 'important');
    } else {
      activeView.classList.add('flex', 'view-pane-active', 'active');
      activeView.style.setProperty('display', 'flex', 'important');
    }
    activeView.style.setProperty('pointer-events', 'auto', 'important');
    activeView.style.setProperty('visibility', 'visible', 'important');
    activeView.setAttribute('aria-hidden', 'false');
  }

  document.querySelectorAll('[data-view]').forEach(link => {
    const isTarget = link.dataset.view === target ||
                     (target === 'paper-detail' && link.dataset.view === 'research-library') ||
                     (target === 'programs' && link.dataset.view === 'pt-programs');
    link.className = isTarget ? 'nav-item-active' : 'nav-item';
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

  // Activate smart phrases hub when navigating to it
  if (target === 'smart-phrases' && typeof loadSmartPhrasesHub === 'function') {
    loadSmartPhrasesHub();
  }

  // Activate rehab builder when navigating to it (Phase 7)
  if (target === 'programs' && window.RehabBuilder) {
    requestAnimationFrame(() => window.RehabBuilder.activate());
  }

  // Activate dedicated exercise library hub when navigating to it
  if (target === 'exercise-library' && typeof loadExerciseLibraryHub === 'function') {
    loadExerciseLibraryHub();
  }

  // Activate invoicing & billing ledger when navigating to it (Phase 8)
  if (target === 'invoicing' && typeof loadInvoicingLedger === 'function') {
    loadInvoicingLedger();
  }

  // Activate research paper library when navigating to it
  if (target === 'research-library' && window.ResearchLibrary) {
    requestAnimationFrame(() => window.ResearchLibrary.activate());
  }

  // Activate settings preferences when navigating to it (NEVER defaults to exercise library)
  if (target === 'settings') {
    if (typeof initSettingsView === 'function') initSettingsView();
    if (typeof loadSettingsGeneralPreferences === 'function') {
      loadSettingsGeneralPreferences();
    }
  }
}

function navigateTo(target) {
  if (target === 'pt-programs') target = 'programs';
  const navItem = document.getElementById(`nav-${target}`) || document.querySelector(`[data-view="${target}"]`);
  if (navItem) {
    navItem.click();
  } else {
    switchView(target);
  }
}

window.switchView = switchView;
window.navigateTo = navigateTo;

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
  clockOverlay.classList.remove('hidden', 'opacity-0', 'pointer-events-none');
  clockOverlay.classList.add('flex', 'opacity-100', 'pointer-events-auto');
  clockOverlay.style.setProperty('display', 'flex', 'important');
  clockOverlay.style.setProperty('pointer-events', 'auto', 'important');
}
function closeClockOverlay() {
  if (!clockOverlay) return;
  clockOverlay.classList.remove('opacity-100', 'pointer-events-auto', 'flex');
  clockOverlay.classList.add('hidden', 'opacity-0', 'pointer-events-none');
  clockOverlay.style.setProperty('display', 'none', 'important');
  clockOverlay.style.setProperty('pointer-events', 'none', 'important');
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
  if (rfBackdrop) {
    rfBackdrop.classList.remove('hidden', 'opacity-0', 'pointer-events-none');
    rfBackdrop.classList.add('opacity-100', 'pointer-events-auto');
    rfBackdrop.style.setProperty('display', 'block', 'important');
    rfBackdrop.style.setProperty('pointer-events', 'auto', 'important');
  }
  rfDrawer.classList.remove('hidden', 'translate-x-full');
  rfDrawer.style.setProperty('display', 'flex', 'important');
  rfDrawer.style.setProperty('pointer-events', 'auto', 'important');
}
function closeRF() {
  if (!rfDrawer) return;
  rfDrawer.classList.add('hidden', 'translate-x-full');
  rfDrawer.style.setProperty('display', 'none', 'important');
  rfDrawer.style.setProperty('pointer-events', 'none', 'important');

  if (rfBackdrop) {
    rfBackdrop.classList.remove('opacity-100', 'pointer-events-auto');
    rfBackdrop.classList.add('hidden', 'opacity-0', 'pointer-events-none');
    rfBackdrop.style.setProperty('display', 'none', 'important');
    rfBackdrop.style.setProperty('pointer-events', 'none', 'important');
  }
}

['btn-red-flags', 'btn-red-flags-2'].forEach(id => {
  const btn = $(id);
  if (btn) btn.addEventListener('click', openRF);
});
if (rfClose)    rfClose.addEventListener('click', closeRF);
if (rfBackdrop) rfBackdrop.addEventListener('click', closeRF);

// ── Dashboard Red Flags Interactive Screening & Alert Box ───────────────────
const RF_ALERT_MAP = {
  ces: {
    title: 'Cauda Equina Syndrome Alert',
    guideline: 'NICE NG59 / CSP Consensus',
    text: 'Immediate same-day emergency department transfer for urgent MRI spine (< 4 hrs). Do not delay.',
    class: 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/25'
  },
  csm: {
    title: 'Cervical Myelopathy Alert',
    guideline: 'BMJ Best Practice / NICE',
    text: 'Urgent spinal surgical/neurosurgical consult. Zero high-velocity cervical thrust manipulation.',
    class: 'bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/25'
  },
  malig: {
    title: 'Suspected Malignancy Alert',
    guideline: 'NICE NG12 Suspected Cancer',
    text: 'Urgent 2-week wait cancer pathway referral via GP for full bloods, ESR/CRP & whole-spine MRI.',
    class: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/25'
  },
  infect: {
    title: 'Spinal Infection Alert',
    guideline: 'NICE NG59 / BMJ',
    text: 'Immediate emergency department transfer for urgent blood cultures, inflammatory markers & MRI.',
    class: 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-500/25'
  },
  fracture: {
    title: 'Spinal Fracture Alert',
    guideline: 'WHO / NICE Guidelines',
    text: 'Urgent imaging (X-ray / CT). Strict spinal precautions; avoid spinal flexion & manual loading.',
    class: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/25'
  },
  cad: {
    title: 'Vascular CAD / Stroke Alert',
    guideline: 'IFOMPT CAD International Consensus',
    text: 'Immediate 999 emergency call / hyper-acute stroke pathway. Do not move or manipulate neck.',
    class: 'bg-violet-500/10 text-violet-600 dark:text-violet-400 border-violet-500/25'
  }
};

function updateDashRfAlerts() {
  const alertBox = $('dash-rf-alert-box');
  if (!alertBox) return;

  const rows = document.querySelectorAll('#dash-rf-list [data-rf-key]');
  const activeAlerts = [];

  rows.forEach(row => {
    const key = row.dataset.rfKey;
    const chip = row.querySelector('.dash-rf-chip');
    const status = chip?.dataset.status;
    if (status && status !== 'clear' && RF_ALERT_MAP[key]) {
      activeAlerts.push({ key, status, ...RF_ALERT_MAP[key] });
    }
  });

  if (!activeAlerts.length) {
    alertBox.classList.add('hidden');
    alertBox.innerHTML = '';
  } else {
    alertBox.classList.remove('hidden');
    alertBox.innerHTML = activeAlerts.map(a => `
      <div class="p-2 rounded border ${a.class} space-y-0.5">
        <div class="flex items-center justify-between font-bold text-[10px]">
          <span class="flex items-center gap-1.5">
            <svg class="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
            </svg>
            <span>${a.title} (${a.status.toUpperCase()})</span>
          </span>
          <span class="font-mono text-[9px] opacity-75">${a.guideline}</span>
        </div>
        <p class="text-[10px] leading-snug">${a.text}</p>
      </div>
    `).join('');
  }
}

// Wire chip clicking on dashboard
document.querySelectorAll('#dash-rf-list .dash-rf-chip').forEach(chip => {
  chip.addEventListener('click', e => {
    e.stopPropagation();
    const curr = chip.dataset.status || 'clear';
    if (curr === 'clear') {
      chip.dataset.status = 'flag';
      chip.textContent = 'Flag';
      chip.className = 'dash-rf-chip px-2 py-0.5 rounded text-[10px] font-bold border shrink-0 transition-all select-none cursor-pointer bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30';
    } else if (curr === 'flag') {
      chip.dataset.status = 'escalate';
      chip.textContent = 'Referral';
      chip.className = 'dash-rf-chip px-2 py-0.5 rounded text-[10px] font-bold border shrink-0 transition-all select-none cursor-pointer bg-red-500/15 text-red-600 dark:text-red-400 border-red-500/30';
    } else {
      chip.dataset.status = 'clear';
      chip.textContent = 'Clear';
      chip.className = 'dash-rf-chip px-2 py-0.5 rounded text-[10px] font-bold border shrink-0 transition-all select-none cursor-pointer bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/25 hover:bg-emerald-500/20';
    }
    updateDashRfAlerts();
  });
});

$('dash-rf-btn-clear-all')?.addEventListener('click', () => {
  document.querySelectorAll('#dash-rf-list .dash-rf-chip').forEach(chip => {
    chip.dataset.status = 'clear';
    chip.textContent = 'Clear';
    chip.className = 'dash-rf-chip px-2 py-0.5 rounded text-[10px] font-bold border shrink-0 transition-all select-none cursor-pointer bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/25 hover:bg-emerald-500/20';
  });
  updateDashRfAlerts();
});

$('dash-rf-btn-full-guide')?.addEventListener('click', openRF);

// Copy Red Flags Documentation to Clipboard from Drawer
$('rf-btn-copy-note')?.addEventListener('click', () => {
  const noteText = `=== CLINICAL RED FLAGS SCREENING (NICE NG59 / CSP / BMJ / IFOMPT) ===
- Cauda Equina Syndrome (CES): Screened Clear (No saddle anaesthesia, bladder/bowel retention/incontinence, or progressive bilateral motor weakness).
- Cervical Myelopathy (CSM): Screened Clear (No spastic gait ataxia, hand clumsiness, +Hoffman's, or +Babinski).
- Spinal Malignancy: Screened Clear (No unexplained weight loss, constant unremitting night pain, or progressive bony tenderness).
- Spinal Infection: Screened Clear (No fever, rigors, night sweats, systemic illness, or IV drug history).
- Spinal Fracture: Screened Clear (No acute focal spinous tenderness, step deformity, or high-velocity trauma).
- Vascular (CAD / VBI): Screened Clear (Zero 5Ds: Dizziness, Diplopia, Dysarthria, Dysphagia, Drop attacks; Zero 3Ns: Nausea, Numbness, Nystagmus).
Outcome: Red flags screened clear. Safe for conservative physiotherapy rehabilitation.`;

  navigator.clipboard.writeText(noteText).then(() => {
    const btn = $('rf-btn-copy-note');
    if (btn) {
      const orig = btn.innerHTML;
      btn.innerHTML = `<span>Copied to Clipboard ✓</span>`;
      setTimeout(() => { btn.innerHTML = orig; }, 1800);
    }
  }).catch(err => {
    console.error('Clipboard error:', err);
  });
});

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
    closeEditPatientModal();
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
  if (typeof prefill === 'string' && prefill.trim() && $('np-first-name')) {
    const parts = prefill.trim().split(' ');
    $('np-first-name').value = parts[0] || '';
    $('np-last-name').value  = parts.slice(1).join(' ') || '';
  }
  hideNpError();
  setNpLoading(false);

  if (npBackdrop) {
    npBackdrop.classList.remove('hidden', 'opacity-0', 'pointer-events-none');
    npBackdrop.classList.add('opacity-100', 'pointer-events-auto');
    npBackdrop.style.setProperty('display', 'block', 'important');
    npBackdrop.style.setProperty('pointer-events', 'auto', 'important');
  }
  npModal.classList.remove('hidden', 'opacity-0', 'pointer-events-none');
  npModal.classList.add('flex', 'opacity-100', 'pointer-events-auto');
  npModal.style.setProperty('display', 'flex', 'important');
  npModal.style.setProperty('pointer-events', 'auto', 'important');
  npPanel.classList.remove('translate-y-4');

  // Auto-focus first name
  setTimeout(() => { const el = $('np-first-name'); if (el) el.focus(); }, 50);
}

function closeNewPatientModal() {
  if (!npModal) return;
  if (npBackdrop) {
    npBackdrop.classList.remove('opacity-100', 'pointer-events-auto');
    npBackdrop.classList.add('hidden', 'opacity-0', 'pointer-events-none');
    npBackdrop.style.setProperty('display', 'none', 'important');
    npBackdrop.style.setProperty('pointer-events', 'none', 'important');
  }
  npModal.classList.remove('opacity-100', 'pointer-events-auto', 'flex');
  npModal.classList.add('hidden', 'opacity-0', 'pointer-events-none');
  npModal.style.setProperty('display', 'none', 'important');
  npModal.style.setProperty('pointer-events', 'none', 'important');
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

// "New Appointment" header button → switch to Diary view and open booking drawer
const btnNewAppt = $('btn-new-appt');
if (btnNewAppt) {
  btnNewAppt.addEventListener('click', () => {
    switchView('diary');
    if (window.Diary) {
      const slot = typeof window.Diary.getNextAvailableTime === 'function'
        ? window.Diary.getNextAvailableTime()
        : 9 * 60;
      window.Diary.openEventDrawer({
        date: new Date().toISOString().slice(0, 10),
        startMin: slot,
        endMin: slot + 30
      });
    }
  });
}

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
      national_id:       ($('np-national-id')?.value || '').trim(),
      primary_diagnosis: ($('np-diagnosis')?.value   || '').trim(),
      address:           ($('np-address')?.value     || '').trim(),
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

  // Extract HTML tags so their attributes (class, data-*, style, placeholder) are preserved
  const htmlTokens = [];
  const tokenized = raw.replace(/<\/?(?:div|table|thead|tbody|tfoot|tr|th|td|input|span|label|button|code|pre|br|b|strong|i|em)\b[^>]*>/gi, (tag) => {
    const idx = htmlTokens.length;
    htmlTokens.push(tag);
    return `%%HTML_TOKEN_${idx}%%`;
  });

  const escaped = escapeHtml(tokenized);
  const lines = escaped.split('\n');
  const out = [];
  let inUl = false;
  let inOl = false;
  let inTable = false;
  let isTableHeader = true;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    // Markdown Table row: | Col 1 | Col 2 |
    if (trimmed.startsWith('|') && trimmed.endsWith('|')) {
      if (inUl) { out.push('</ul>'); inUl = false; }
      if (inOl) { out.push('</ol>'); inOl = false; }

      if (!inTable) {
        out.push('<div class="excel-table-wrap"><table class="excel-table"><thead>');
        inTable = true;
        isTableHeader = true;
      }

      // Check if delimiter row like |:---|:---|
      if (/^\|[\s\-:|]+\|$/.test(trimmed)) {
        out.push('</thead><tbody>');
        isTableHeader = false;
        continue;
      }

      const cells = trimmed.split('|').slice(1, -1).map(c => c.trim());
      const tag = isTableHeader ? 'th' : 'td';
      out.push('<tr>' + cells.map(c => `<${tag}>${formatInline(c)}${isTableHeader ? '<div class="col-resizer"></div>' : ''}</${tag}>`).join('') + '</tr>');
      continue;
    }

    if (inTable) {
      out.push('</tbody></table></div>');
      inTable = false;
    }

    // Lines that are only an HTML token placeholder (e.g. %%HTML_TOKEN_0%%) shouldn't be wrapped in <p>
    if (/^%%HTML_TOKEN_\d+%%$/.test(trimmed)) {
      if (inUl) { out.push('</ul>'); inUl = false; }
      if (inOl) { out.push('</ol>'); inOl = false; }
      out.push(trimmed);
      continue;
    }

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

    if (trimmed === '') {
      out.push('<br/>');
    } else {
      out.push(`<p>${formatInline(line)}</p>`);
    }
  }

  if (inUl) out.push('</ul>');
  if (inOl) out.push('</ol>');
  if (inTable) out.push('</tbody></table></div>');

  let result = out.join('\n');
  result = result.replace(/%%HTML_TOKEN_(\d+)%%/g, (_m, id) => {
    return htmlTokens[Number(id)] || '';
  });

  return result;
}

const STARTER_TABLE_HTML = `
<div class="excel-table-wrap">
  <table class="excel-table">
    <thead>
      <tr>
        <th style="width: 50%;"><span class="th-text" contenteditable="true">Parameter / Item</span><div class="col-resizer"></div></th>
        <th style="width: 50%;"><span class="th-text" contenteditable="true">Clinical Finding</span><div class="col-resizer"></div></th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><input type="text" class="excel-input text-left" placeholder="Enter item / test..." /></td>
        <td><input type="text" class="excel-input text-left" placeholder="Enter finding / value..." /></td>
      </tr>
    </tbody>
  </table>
</div>
`;

// ── Excel-Style Interactive Table Calculations & Column Resizing ──────────

function initExcelTables(container, optionalTextarea) {
  if (!container) return;

  const tables = container.classList && container.classList.contains('excel-table')
    ? [container]
    : Array.from(container.querySelectorAll('.excel-table'));

  tables.forEach(table => {
    // 1. Column Resizers
    table.querySelectorAll('.col-resizer').forEach(resizer => {
      if (resizer._resizerWired) return;
      resizer._resizerWired = true;

      resizer.addEventListener('mousedown', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const th = resizer.parentElement;
        if (!th) return;
        const startX = e.clientX;
        const startWidth = th.offsetWidth;
        document.body.style.cursor = 'col-resize';
        document.body.style.userSelect = 'none';

        function onMouseMove(moveEvent) {
          const newWidth = Math.max(35, startWidth + (moveEvent.clientX - startX));
          th.style.width = `${newWidth}px`;
        }

        function onMouseUp() {
          document.body.style.cursor = '';
          document.body.style.userSelect = '';
          document.removeEventListener('mousemove', onMouseMove);
          document.removeEventListener('mouseup', onMouseUp);
        }

        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
      });
    });

    // 2. Attach Interactive Row & Column Manipulation Controls
    attachTableControls(table, container, optionalTextarea);

    // 3. Interactive in-cell calculations & auto-summed rows
    function recalcTable() {
      const groupSums = {};

      table.querySelectorAll('.excel-input[data-group]').forEach(inp => {
        const g = inp.dataset.group;
        const val = parseFloat(inp.value) || 0;
        groupSums[g] = (groupSums[g] || 0) + val;
      });

      const tableGroup = table.dataset.calcGroup;

      // Update [data-sum-target]
      table.querySelectorAll('[data-sum-target]').forEach(target => {
        const g = target.dataset.sumTarget;
        let sum = 0;
        if (groupSums[g] !== undefined) {
          sum = groupSums[g];
        } else if (tableGroup === g) {
          sum = Array.from(table.querySelectorAll('.excel-input[data-group]')).reduce((acc, el) => acc + (parseFloat(el.value) || 0), 0);
        }
        target.textContent = Number.isInteger(sum) ? String(sum) : sum.toFixed(1);
      });

      // Update [data-percent-target]
      table.querySelectorAll('[data-percent-target]').forEach(target => {
        const g = target.dataset.percentTarget;
        const max = parseFloat(target.dataset.max) || 100;
        let sum = groupSums[g] !== undefined ? groupSums[g] : (tableGroup === g ? Array.from(table.querySelectorAll('.excel-input[data-group]')).reduce((acc, el) => acc + (parseFloat(el.value) || 0), 0) : 0);
        const pct = Math.min(100, Math.max(0, Math.round((sum / max) * 100)));
        target.textContent = `${pct}%`;
      });

      // Update [data-inv-percent-target]
      table.querySelectorAll('[data-inv-percent-target]').forEach(target => {
        const g = target.dataset.invPercentTarget;
        const max = parseFloat(target.dataset.max) || 100;
        let sum = groupSums[g] !== undefined ? groupSums[g] : (tableGroup === g ? Array.from(table.querySelectorAll('.excel-input[data-group]')).reduce((acc, el) => acc + (parseFloat(el.value) || 0), 0) : 0);
        const pct = Math.min(100, Math.max(0, Math.round(100 - ((sum / max) * 100))));
        target.textContent = `${pct}% Impairment`;
      });

      // Update [data-avg-target]
      table.querySelectorAll('[data-avg-target]').forEach(target => {
        const g = target.dataset.avgTarget;
        const inputs = Array.from(table.querySelectorAll(`.excel-input[data-group="${g}"]`));
        const sum = inputs.reduce((acc, el) => acc + (parseFloat(el.value) || 0), 0);
        const avg = inputs.length ? (sum / inputs.length) : 0;
        target.textContent = avg.toFixed(1);
      });

      // Update [data-inv-avg-target]
      table.querySelectorAll('[data-inv-avg-target]').forEach(target => {
        const g = target.dataset.invAvgTarget;
        const inputs = Array.from(table.querySelectorAll(`.excel-input[data-group="${g}"]`));
        const sum = inputs.reduce((acc, el) => acc + (parseFloat(el.value) || 0), 0);
        const avg = inputs.length ? (sum / inputs.length) : 0;
        const imp = Math.max(0, Math.min(100, 100 - avg));
        target.textContent = `${imp.toFixed(1)}%`;
      });

      // Update [data-visa-impair-target]
      table.querySelectorAll('[data-visa-impair-target]').forEach(target => {
        const g = target.dataset.visaImpairTarget;
        const sum = Array.from(table.querySelectorAll(`.excel-input[data-group="${g}"]`)).reduce((acc, el) => acc + (parseFloat(el.value) || 0), 0);
        const imp = Math.max(0, Math.min(100, 100 - sum));
        target.textContent = `${imp}% Impairment`;
      });

      // Update [data-dash-formula-target]
      table.querySelectorAll('[data-dash-formula-target]').forEach(target => {
        const g = target.dataset.dashFormulaTarget;
        const inputs = Array.from(table.querySelectorAll(`.excel-input[data-group="${g}"]`));
        const sum = inputs.reduce((acc, el) => acc + (parseFloat(el.value) || 1), 0);
        const n = inputs.length || 11;
        const score = Math.max(0, Math.min(100, ((sum / n) - 1) * 25));
        target.textContent = `${score.toFixed(1)}%`;
      });

      // Update [data-severity-target] (ODI & NDI & MSK measures)
      table.querySelectorAll('[data-severity-target]').forEach(sevTarget => {
        const type = sevTarget.dataset.severityTarget;
        if (type === 'odi') {
          const sum = Array.from(table.querySelectorAll('.excel-input[data-group]')).reduce((acc, el) => acc + (parseFloat(el.value) || 0), 0);
          const pct = Math.round((sum / 50) * 100);
          let label = 'Minimal Disability';
          let cls = 'risk-pill risk-low';
          if (pct > 20 && pct <= 40) { label = 'Moderate Disability'; cls = 'risk-pill risk-med'; }
          else if (pct > 40 && pct <= 60) { label = 'Severe Disability'; cls = 'risk-pill risk-high'; }
          else if (pct > 60 && pct <= 80) { label = 'Crippled'; cls = 'risk-pill risk-high'; }
          else if (pct > 80) { label = 'Bed-Bound'; cls = 'risk-pill risk-high'; }
          sevTarget.textContent = label;
          sevTarget.className = `excel-severity ${cls}`;
        } else if (type === 'ndi') {
          const sum = Array.from(table.querySelectorAll('.excel-input[data-group]')).reduce((acc, el) => acc + (parseFloat(el.value) || 0), 0);
          let label = 'No Disability';
          let cls = 'risk-pill risk-low';
          if (sum >= 5 && sum <= 14) { label = 'Mild Disability'; cls = 'risk-pill risk-low'; }
          else if (sum >= 15 && sum <= 24) { label = 'Moderate Disability'; cls = 'risk-pill risk-med'; }
          else if (sum >= 25 && sum <= 34) { label = 'Severe Disability'; cls = 'risk-pill risk-high'; }
          else if (sum >= 35) { label = 'Complete Disability'; cls = 'risk-pill risk-high'; }
          sevTarget.textContent = label;
          sevTarget.className = `excel-severity ${cls}`;
        } else if (type === 'hit6') {
          const sum = Array.from(table.querySelectorAll('.excel-input[data-group="hit6"]')).reduce((acc, el) => acc + (parseFloat(el.value) || 0), 0);
          let label = 'Little to No Impact';
          let cls = 'risk-pill risk-low';
          if (sum >= 50 && sum <= 55) { label = 'Some Impact'; cls = 'risk-pill risk-low'; }
          else if (sum >= 56 && sum <= 59) { label = 'Substantial Impact'; cls = 'risk-pill risk-med'; }
          else if (sum >= 60) { label = 'Severe Impact'; cls = 'risk-pill risk-high'; }
          sevTarget.textContent = label;
          sevTarget.className = `excel-severity ${cls}`;
        } else if (type === 'startback') {
          const total = Array.from(table.querySelectorAll('.excel-input[data-group="startback"]')).reduce((acc, el) => acc + (parseFloat(el.value) || 0), 0);
          const psych = Array.from(table.querySelectorAll('.excel-input[data-subgroup="sb-psych"]')).reduce((acc, el) => acc + (parseFloat(el.value) || 0), 0);
          table.querySelectorAll('[data-sum-target="sb-psych"]').forEach(t => {
            t.textContent = String(psych);
          });
          let label = 'Low Risk';
          let cls = 'risk-pill risk-low';
          if (psych >= 4) {
            label = 'High Risk (Psychosocial Focus)';
            cls = 'risk-pill risk-high';
          } else if (total >= 4) {
            label = 'Medium Risk (Physical Focus)';
            cls = 'risk-pill risk-med';
          }
          sevTarget.textContent = label;
          sevTarget.className = `excel-severity ${cls}`;
        } else if (type === 'midas') {
          const sum = Array.from(table.querySelectorAll('.excel-input[data-group="midas"]')).reduce((acc, el) => acc + (parseFloat(el.value) || 0), 0);
          let label = 'Grade I (0-5: Little/None)';
          let cls = 'risk-pill risk-low';
          if (sum >= 6 && sum <= 10) { label = 'Grade II (6-10: Mild)'; cls = 'risk-pill risk-low'; }
          else if (sum >= 11 && sum <= 20) { label = 'Grade III (11-20: Moderate)'; cls = 'risk-pill risk-med'; }
          else if (sum >= 21) { label = 'Grade IV (21+: Severe)'; cls = 'risk-pill risk-high'; }
          sevTarget.textContent = label;
          sevTarget.className = `excel-severity ${cls}`;
        } else if (type === 'rmdq') {
          const sum = Array.from(table.querySelectorAll('.excel-input[data-group="rmdq"]')).reduce((acc, el) => acc + (parseFloat(el.value) || 0), 0);
          let label = 'Mild / No Disability';
          let cls = 'risk-pill risk-low';
          if (sum >= 4 && sum <= 10) { label = 'Moderate Disability'; cls = 'risk-pill risk-med'; }
          else if (sum >= 11) { label = 'Severe Disability'; cls = 'risk-pill risk-high'; }
          sevTarget.textContent = label;
          sevTarget.className = `excel-severity ${cls}`;
        } else if (type === 'pcs') {
          const sum = Array.from(table.querySelectorAll('.excel-input[data-group="pcs"]')).reduce((acc, el) => acc + (parseFloat(el.value) || 0), 0);
          let label = 'Normal / Low Risk';
          let cls = 'risk-pill risk-low';
          if (sum >= 30) { label = 'Clinically Relevant Catastrophizing'; cls = 'risk-pill risk-high'; }
          sevTarget.textContent = label;
          sevTarget.className = `excel-severity ${cls}`;
        } else if (type === 'tskv') {
          const sum = Array.from(table.querySelectorAll('.excel-input[data-group="tskv"]')).reduce((acc, el) => acc + (parseFloat(el.value) || 0), 0);
          let label = 'Low Kinesiophobia (≤ 37)';
          let cls = 'risk-pill risk-low';
          if (sum > 37) { label = 'High Kinesiophobia (> 37)'; cls = 'risk-pill risk-high'; }
          sevTarget.textContent = label;
          sevTarget.className = `excel-severity ${cls}`;
        } else if (type === 'phq9') {
          const sum = Array.from(table.querySelectorAll('.excel-input[data-group="phq9"]')).reduce((acc, el) => acc + (parseFloat(el.value) || 0), 0);
          let label = 'None / Minimal (0-4)';
          let cls = 'risk-pill risk-low';
          if (sum >= 5 && sum <= 9) { label = 'Mild (5-9)'; cls = 'risk-pill risk-low'; }
          else if (sum >= 10 && sum <= 14) { label = 'Moderate (10-14)'; cls = 'risk-pill risk-med'; }
          else if (sum >= 15 && sum <= 19) { label = 'Mod. Severe (15-19)'; cls = 'risk-pill risk-high'; }
          else if (sum >= 20) { label = 'Severe (20-27)'; cls = 'risk-pill risk-high'; }
          sevTarget.textContent = label;
          sevTarget.className = `excel-severity ${cls}`;
        } else if (type === 'gad7') {
          const sum = Array.from(table.querySelectorAll('.excel-input[data-group="gad7"]')).reduce((acc, el) => acc + (parseFloat(el.value) || 0), 0);
          let label = 'Minimal (0-4)';
          let cls = 'risk-pill risk-low';
          if (sum >= 5 && sum <= 9) { label = 'Mild (5-9)'; cls = 'risk-pill risk-low'; }
          else if (sum >= 10 && sum <= 14) { label = 'Moderate (10-14)'; cls = 'risk-pill risk-med'; }
          else if (sum >= 15) { label = 'Severe (15-21)'; cls = 'risk-pill risk-high'; }
          sevTarget.textContent = label;
          sevTarget.className = `excel-severity ${cls}`;
        } else if (type === 'pss') {
          const sum = Array.from(table.querySelectorAll('.excel-input[data-group="pss"]')).reduce((acc, el) => acc + (parseFloat(el.value) || 0), 0);
          let label = 'Low Stress (0-13)';
          let cls = 'risk-pill risk-low';
          if (sum >= 14 && sum <= 26) { label = 'Moderate Stress (14-26)'; cls = 'risk-pill risk-med'; }
          else if (sum >= 27) { label = 'High Stress (27-40)'; cls = 'risk-pill risk-high'; }
          sevTarget.textContent = label;
          sevTarget.className = `excel-severity ${cls}`;
        } else if (type === 'pcl5') {
          const sum = Array.from(table.querySelectorAll('.excel-input[data-group="pcl5"]')).reduce((acc, el) => acc + (parseFloat(el.value) || 0), 0);
          let label = 'Below Cutoff (< 31)';
          let cls = 'risk-pill risk-low';
          if (sum >= 31) { label = 'Provisional PTSD (≥ 31)'; cls = 'risk-pill risk-high'; }
          sevTarget.textContent = label;
          sevTarget.className = `excel-severity ${cls}`;
        } else if (type === 'iesr') {
          const sum = Array.from(table.querySelectorAll('.excel-input[data-group="iesr"]')).reduce((acc, el) => acc + (parseFloat(el.value) || 0), 0);
          let label = 'Subclinical (< 24)';
          let cls = 'risk-pill risk-low';
          if (sum >= 24 && sum <= 32) { label = 'Mild Impact (24-32)'; cls = 'risk-pill risk-med'; }
          else if (sum >= 33) { label = 'Probable PTSD (≥ 33)'; cls = 'risk-pill risk-high'; }
          sevTarget.textContent = label;
          sevTarget.className = `excel-severity ${cls}`;
        } else if (type === 'olbi') {
          const sum = Array.from(table.querySelectorAll('.excel-input[data-group="olbi"]')).reduce((acc, el) => acc + (parseFloat(el.value) || 0), 0);
          let label = 'Low Burnout (≤ 35)';
          let cls = 'risk-pill risk-low';
          if (sum > 35) { label = 'High Burnout (> 35)'; cls = 'risk-pill risk-high'; }
          sevTarget.textContent = label;
          sevTarget.className = `excel-severity ${cls}`;
        } else if (type === 'sos') {
          const sum = Array.from(table.querySelectorAll('.excel-input[data-group="sos"]')).reduce((acc, el) => acc + (parseFloat(el.value) || 0), 0);
          let label = 'Minimal (0-3)';
          let cls = 'risk-pill risk-low';
          if (sum >= 4 && sum <= 7) { label = 'Low (4-7)'; cls = 'risk-pill risk-low'; }
          else if (sum >= 8 && sum <= 11) { label = 'Medium (8-11)'; cls = 'risk-pill risk-med'; }
          else if (sum >= 12 && sum <= 15) { label = 'High (12-15)'; cls = 'risk-pill risk-high'; }
          else if (sum >= 16) { label = 'Very High (16-32)'; cls = 'risk-pill risk-high'; }
          sevTarget.textContent = label;
          sevTarget.className = `excel-severity ${cls}`;
        }
      });

      // Update PRWE / PREE custom formula groups
      if (tableGroup === 'prwe') {
        const pain = Array.from(table.querySelectorAll('.excel-input[data-group="prwe-pain"]')).reduce((acc, el) => acc + (parseFloat(el.value) || 0), 0);
        const fn = Array.from(table.querySelectorAll('.excel-input[data-group="prwe-fn"]')).reduce((acc, el) => acc + (parseFloat(el.value) || 0), 0);
        const total = pain + (fn / 2);
        table.querySelectorAll('[data-sum-target="prwe"]').forEach(t => t.textContent = total.toFixed(1));
      }
      if (tableGroup === 'pree') {
        const pain = Array.from(table.querySelectorAll('.excel-input[data-group="pree-pain"]')).reduce((acc, el) => acc + (parseFloat(el.value) || 0), 0);
        const fn = Array.from(table.querySelectorAll('.excel-input[data-group="pree-fn"]')).reduce((acc, el) => acc + (parseFloat(el.value) || 0), 0);
        const fnNormalized = fn / 3;
        const total = pain + fnNormalized;
        table.querySelectorAll('[data-sum-target="pree"]').forEach(t => t.textContent = total.toFixed(1));
        table.querySelectorAll('[data-sum-target="pree-fn"]').forEach(t => t.textContent = fnNormalized.toFixed(1));
      }

      // Update [data-cutoff-target]
      table.querySelectorAll('[data-cutoff-target]').forEach(pill => {
        const g = pill.dataset.cutoffTarget;
        const cutoff = parseFloat(pill.dataset.cutoffVal) || 0;
        const sum = groupSums[g] !== undefined ? groupSums[g] : (parseFloat(table.querySelector(`[data-sum-target="${g}"]`)?.textContent) || 0);
        if (sum >= cutoff) {
          pill.classList.remove('risk-low', 'risk-neutral');
          pill.classList.add('risk-red');
        } else {
          pill.classList.remove('risk-red');
          pill.classList.add('risk-low');
        }
      });
    }

    if (!table._eventsWired) {
      table._eventsWired = true;

      table.addEventListener('input', (e) => {
        if (e.target && e.target.classList.contains('excel-input')) {
          e.target.setAttribute('value', e.target.value);
          recalcTable();
          if (optionalTextarea) {
            syncPreviewValuesToTextarea(container, optionalTextarea);
          }
        }
      });

      table.addEventListener('change', (e) => {
        if (e.target && e.target.classList.contains('excel-input')) {
          e.target.setAttribute('value', e.target.value);
          recalcTable();
          if (optionalTextarea) {
            syncPreviewValuesToTextarea(container, optionalTextarea);
          }
        }
      });
    }

    recalcTable();
  });
}

function attachTableControls(table, container, optionalTextarea) {
  const thead = table.querySelector('thead');
  const tbody = table.querySelector('tbody');
  if (!thead || !tbody) return;

  // 1. Column Controls on TH
  thead.querySelectorAll('tr').forEach(headerRow => {
    const ths = headerRow.querySelectorAll('th');
    ths.forEach((th, colIdx) => {
      // Ensure resizer exists
      if (!th.querySelector('.col-resizer')) {
        const resizer = document.createElement('div');
        resizer.className = 'col-resizer';
        th.appendChild(resizer);
      }

      // Ensure th-text exists
      if (!th.querySelector('.th-text')) {
        const textNodes = Array.from(th.childNodes).filter(n => {
          if (n.nodeType === 3) return true;
          return !n.classList || (!n.classList.contains('col-resizer') && !n.classList.contains('col-actions'));
        });
        const span = document.createElement('span');
        span.className = 'th-text';
        span.contentEditable = 'true';
        textNodes.forEach(n => span.appendChild(n));
        th.prepend(span);
      }

      // Ensure col-actions exists
      let colActions = th.querySelector('.col-actions');
      if (!colActions) {
        colActions = document.createElement('div');
        colActions.className = 'col-actions';
        colActions.innerHTML = `
          <button type="button" class="btn-col-add" title="Add column to right">+</button>
          <button type="button" class="btn-col-del" title="Delete column">✕</button>
        `;
        th.appendChild(colActions);
      }

      // Wire col-add
      const btnAdd = colActions.querySelector('.btn-col-add');
      if (btnAdd && !btnAdd._wired) {
        btnAdd._wired = true;
        btnAdd.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          addColumnToTable(table, colIdx, container, optionalTextarea);
        });
      }

      // Wire col-del
      const btnDel = colActions.querySelector('.btn-col-del');
      if (btnDel && !btnDel._wired) {
        btnDel._wired = true;
        btnDel.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          deleteColumnFromTable(table, colIdx, container, optionalTextarea);
        });
      }
    });
  });

  // 2. Row Controls on Body TR
  tbody.querySelectorAll('tr:not(.excel-total-row)').forEach(tr => {
    const firstTd = tr.querySelector('td');
    if (!firstTd) return;

    let flank = firstTd.querySelector('.row-flank-actions');
    if (!flank) {
      flank = document.createElement('div');
      flank.className = 'row-flank-actions';
      flank.innerHTML = `
        <button type="button" class="btn-row-add" title="Insert row below">+</button>
        <button type="button" class="btn-row-del" title="Delete row">
          <svg class="h-2.5 w-2.5" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
          </svg>
        </button>
      `;
      firstTd.prepend(flank);
    }

    const btnAdd = flank.querySelector('.btn-row-add');
    if (btnAdd && !btnAdd._wired) {
      btnAdd._wired = true;
      btnAdd.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        addRowToTable(table, tr, container, optionalTextarea);
      });
    }

    const btnDel = flank.querySelector('.btn-row-del');
    if (btnDel && !btnDel._wired) {
      btnDel._wired = true;
      btnDel.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        deleteRowFromTable(table, tr, container, optionalTextarea);
      });
    }
  });
}

function addRowToTable(table, targetTr, container, optionalTextarea) {
  const theadThs = table.querySelectorAll('thead th');
  const colCount = theadThs.length || targetTr.querySelectorAll('td').length || 2;
  const newTr = document.createElement('tr');

  for (let i = 0; i < colCount; i++) {
    const td = document.createElement('td');
    const input = document.createElement('input');
    input.type = 'text';
    input.className = 'excel-input text-left';
    input.placeholder = i === 0 ? 'New Item' : '—';
    td.appendChild(input);
    newTr.appendChild(td);
  }

  targetTr.after(newTr);
  initExcelTables(table, optionalTextarea);

  const firstInp = newTr.querySelector('input');
  if (firstInp) firstInp.focus();

  if (optionalTextarea) {
    syncPreviewValuesToTextarea(container, optionalTextarea);
  }
}

function deleteRowFromTable(table, targetTr, container, optionalTextarea) {
  const tbody = table.querySelector('tbody');
  const bodyRows = tbody.querySelectorAll('tr:not(.excel-total-row)');
  if (bodyRows.length <= 1) {
    targetTr.querySelectorAll('input').forEach(inp => {
      inp.value = '';
      inp.setAttribute('value', '');
    });
    return;
  }

  targetTr.remove();
  initExcelTables(table, optionalTextarea);

  if (optionalTextarea) {
    syncPreviewValuesToTextarea(container, optionalTextarea);
  }
}

function addColumnToTable(table, colIdx, container, optionalTextarea) {
  const headerRow = table.querySelector('thead tr');
  if (!headerRow) return;

  const currentTh = headerRow.children[colIdx];
  const newTh = document.createElement('th');
  newTh.style.width = '140px';
  newTh.innerHTML = `<span class="th-text" contenteditable="true">New Col</span><div class="col-resizer"></div>`;

  if (currentTh) {
    currentTh.after(newTh);
  } else {
    headerRow.appendChild(newTh);
  }

  table.querySelectorAll('tbody tr').forEach(tr => {
    if (tr.classList.contains('excel-total-row')) {
      const firstTd = tr.querySelector('td');
      if (firstTd && firstTd.hasAttribute('colspan')) {
        const span = parseInt(firstTd.getAttribute('colspan')) || 1;
        firstTd.setAttribute('colspan', String(span + 1));
      }
      return;
    }
    const currentTd = tr.children[colIdx];
    const newTd = document.createElement('td');
    newTd.innerHTML = `<input type="text" class="excel-input text-left" placeholder="—" />`;
    if (currentTd) {
      currentTd.after(newTd);
    } else {
      tr.appendChild(newTd);
    }
  });

  initExcelTables(table, optionalTextarea);

  if (optionalTextarea) {
    syncPreviewValuesToTextarea(container, optionalTextarea);
  }
}

function deleteColumnFromTable(table, colIdx, container, optionalTextarea) {
  const headerRow = table.querySelector('thead tr');
  if (!headerRow || headerRow.children.length <= 1) {
    alert('Clinical tables must have at least one column.');
    return;
  }

  headerRow.children[colIdx]?.remove();

  table.querySelectorAll('tbody tr').forEach(tr => {
    if (tr.classList.contains('excel-total-row')) {
      const firstTd = tr.querySelector('td');
      if (firstTd && firstTd.hasAttribute('colspan')) {
        const span = parseInt(firstTd.getAttribute('colspan')) || 2;
        if (span > 1) firstTd.setAttribute('colspan', String(span - 1));
      }
      return;
    }
    tr.children[colIdx]?.remove();
  });

  initExcelTables(table, optionalTextarea);

  if (optionalTextarea) {
    syncPreviewValuesToTextarea(container, optionalTextarea);
  }
}

function syncPreviewValuesToTextarea(previewPane, textarea) {
  if (!previewPane || !textarea) return;
  const renderedInputs = previewPane.querySelectorAll('.excel-input');
  if (!renderedInputs.length) return;

  let val = textarea.value;
  let idx = 0;
  val = val.replace(/<input\b([^>]*\bclass="[^"]*excel-input[^"]*"[^>]*)>/gi, (fullTag, attrs) => {
    if (idx >= renderedInputs.length) return fullTag;
    const currentInput = renderedInputs[idx++];
    const newVal = currentInput.value;
    let newAttrs = attrs;
    if (/value="[^"]*"/.test(newAttrs)) {
      newAttrs = newAttrs.replace(/value="[^"]*"/, `value="${escapeHtml(newVal)}"`);
    } else {
      newAttrs = `${newAttrs} value="${escapeHtml(newVal)}"`;
    }
    return `<input${newAttrs}>`;
  });
  textarea.value = val;
}

function formatInline(str) {
  let s = str.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  s = s.replace(/\*(.*?)\*/g, '<em>$1</em>');
  s = s.replace(/`([^`]+)`/g, '<code>$1</code>');
  s = s.replace(/\[(\d{1,2}:\d{2}(?:\s*[AaPp][Mm])?)\]/g, '<span class="font-mono text-xs px-1.5 py-0.5 rounded bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-semibold">$1</span>');
  return s;
}

const patientProfile = $('patient-profile');
const profileBack    = $('profile-back');
let currentPortfolioPatient = null;

async function openPatientProfile(id, preloaded = null) {
  if (!patientProfile) return;
  activePortfolioPatientId = Number(id);

  // Fetch full patient data FIRST before showing overlay to prevent visual flash on missing records
  let patient = preloaded;
  if (!patient || !patient.notes) {
    try {
      patient = await window.api.patients.getById(id);
    } catch (_) {
      patient = null;
    }
  }

  if (!patient) {
    console.warn(`[Portfolio] Patient id=${id} not found.`);
    alert(`Patient record #${id} could not be found in the local database.`);
    return;
  }
  currentPortfolioPatient = patient;

  // Show overlay safely now that patient exists
  patientProfile.classList.remove('hidden', 'opacity-0', 'pointer-events-none');
  patientProfile.classList.add('flex', 'opacity-100', 'pointer-events-auto');
  patientProfile.style.setProperty('display', 'flex', 'important');
  patientProfile.style.setProperty('pointer-events', 'auto', 'important');
  patientProfile.setAttribute('aria-hidden', 'false');

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

  // Set Primary Clinical Diagnosis
  const diagEl = $('profile-diagnosis-display');
  if (diagEl) {
    diagEl.textContent = patient.primary_diagnosis || 'No clinical diagnosis recorded';
    diagEl.className = patient.primary_diagnosis
      ? 'mt-1 text-sm font-semibold text-slate-900 dark:text-slate-100'
      : 'mt-1 text-xs italic text-slate-400 dark:text-slate-500';
  }

  // Demographics Card
  const setText = (elId, val) => { const el = $(elId); if (el) el.textContent = val || '—'; };
  setText('profile-age',         computeAge(patient.dob));
  setText('profile-dob',         patient.dob ? fmtDate(patient.dob) : '—');
  setText('profile-national-id', patient.national_id || '—');
  setText('profile-phone',       patient.phone || '—');
  setText('profile-email',       patient.email || '—');
  setText('profile-emergency',   patient.emergency_contact || 'None specified');
  setText('profile-address',     patient.address || '—');
  setText('profile-since',       fmtDate(patient.created_at));

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
          if (typeof window.Diary.setBookingContext === 'function') {
            window.Diary.setBookingContext({ patient_id: patient.id, patient_name: fullName });
          }
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
  await renderPatientRehabPrograms(patient.id);
}

function closePatientProfile() {
  if (!patientProfile) return;
  patientProfile.classList.add('hidden', 'opacity-0', 'pointer-events-none');
  patientProfile.classList.remove('flex', 'opacity-100', 'pointer-events-auto');
  patientProfile.style.setProperty('display', 'none', 'important');
  patientProfile.style.setProperty('pointer-events', 'none', 'important');
  patientProfile.setAttribute('aria-hidden', 'true');
  activePortfolioPatientId = null;
  currentPortfolioPatient = null;
}

if (profileBack) profileBack.addEventListener('click', closePatientProfile);

// ── Edit Patient Demographics Modal ──────────────────────────────────────────
const epModal    = $('modal-edit-patient') || $('ep-modal');
const epBackdrop = $('ep-backdrop');
const epForm     = $('ep-form');
const epClose    = $('ep-close');
const epCancel   = $('ep-cancel');
const epSubmit   = $('ep-submit');
const epSpinner  = $('ep-spinner');
const epLabel    = $('ep-submit-label');
const epError    = $('ep-error');
const epErrorTxt = $('ep-error-text');

function openEditPatientModal(patient = {}) {
  const modal = $('modal-edit-patient') || $('ep-modal');
  const backdrop = $('ep-backdrop');
  if (!modal) return;
  if (epError) epError.classList.add('hidden');
  if ($('ep-first-name')) $('ep-first-name').value = patient.first_name || '';
  if ($('ep-last-name')) $('ep-last-name').value = patient.last_name || '';
  if ($('ep-diagnosis')) $('ep-diagnosis').value = patient.primary_diagnosis || '';
  if ($('ep-national-id')) $('ep-national-id').value = patient.national_id || '';
  if ($('ep-dob')) $('ep-dob').value = patient.dob || '';
  if ($('ep-phone')) $('ep-phone').value = patient.phone || '';
  if ($('ep-email')) $('ep-email').value = patient.email || '';
  if ($('ep-address')) $('ep-address').value = patient.address || '';
  if ($('ep-emergency')) $('ep-emergency').value = patient.emergency_contact || '';

  if (backdrop) {
    backdrop.classList.remove('hidden', 'opacity-0', 'pointer-events-none');
    backdrop.classList.add('opacity-100', 'pointer-events-auto');
    backdrop.style.setProperty('display', 'block', 'important');
    backdrop.style.setProperty('pointer-events', 'auto', 'important');
    backdrop.style.setProperty('z-index', '99', 'important');
  }
  modal.classList.remove('hidden', 'opacity-0', 'pointer-events-none');
  modal.classList.add('flex', 'opacity-100', 'pointer-events-auto');
  modal.style.setProperty('display', 'flex', 'important');
  modal.style.setProperty('pointer-events', 'auto', 'important');
  modal.style.setProperty('z-index', '100', 'important');
}

function closeEditPatientModal() {
  const modal = $('modal-edit-patient') || $('ep-modal');
  const backdrop = $('ep-backdrop');
  if (backdrop) {
    backdrop.classList.remove('opacity-100', 'pointer-events-auto');
    backdrop.classList.add('hidden', 'opacity-0', 'pointer-events-none');
    backdrop.style.setProperty('display', 'none', 'important');
    backdrop.style.setProperty('pointer-events', 'none', 'important');
  }
  if (modal) {
    modal.classList.remove('opacity-100', 'pointer-events-auto', 'flex');
    modal.classList.add('hidden', 'opacity-0', 'pointer-events-none');
    modal.style.setProperty('display', 'none', 'important');
    modal.style.setProperty('pointer-events', 'none', 'important');
  }
  if (currentPortfolioPatient) {
    if ($('ep-first-name')) $('ep-first-name').value = currentPortfolioPatient.first_name || '';
    if ($('ep-last-name')) $('ep-last-name').value = currentPortfolioPatient.last_name || '';
    if ($('ep-diagnosis')) $('ep-diagnosis').value = currentPortfolioPatient.primary_diagnosis || '';
    if ($('ep-national-id')) $('ep-national-id').value = currentPortfolioPatient.national_id || '';
    if ($('ep-dob')) $('ep-dob').value = currentPortfolioPatient.dob || '';
    if ($('ep-phone')) $('ep-phone').value = currentPortfolioPatient.phone || '';
    if ($('ep-email')) $('ep-email').value = currentPortfolioPatient.email || '';
    if ($('ep-address')) $('ep-address').value = currentPortfolioPatient.address || '';
    if ($('ep-emergency')) $('ep-emergency').value = currentPortfolioPatient.emergency_contact || '';
  }
  if ($('ep-error')) $('ep-error').classList.add('hidden');
  document.body.classList.remove('modal-open');
  document.body.style.removeProperty('overflow');
  document.body.style.removeProperty('pointer-events');
}

$('btn-edit-patient-details')?.addEventListener('click', async () => {
  if (!activePortfolioPatientId) return;
  // Instantly open without delay
  if (currentPortfolioPatient && currentPortfolioPatient.id === activePortfolioPatientId) {
    openEditPatientModal(currentPortfolioPatient);
  } else {
    openEditPatientModal({});
  }
  // Ensure fresh DB record
  try {
    const p = await window.api.patients.getById(activePortfolioPatientId);
    if (p) {
      currentPortfolioPatient = p;
      openEditPatientModal(p);
    }
  } catch (err) {
    console.error('Failed to load patient for edit modal:', err);
  }
});

epClose?.addEventListener('click', closeEditPatientModal);
epCancel?.addEventListener('click', closeEditPatientModal);
epBackdrop?.addEventListener('click', closeEditPatientModal);

epForm?.addEventListener('submit', async (e) => {
  e.preventDefault();
  if (!activePortfolioPatientId) return;
  const firstName = ($('ep-first-name')?.value || '').trim();
  const lastName = ($('ep-last-name')?.value || '').trim();
  if (!firstName || !lastName) {
    if (epError) {
      epError.classList.remove('hidden');
      if (epErrorTxt) epErrorTxt.textContent = 'First and last name are required.';
    }
    return;
  }

  const payload = {
    first_name: firstName,
    last_name: lastName,
    primary_diagnosis: ($('ep-diagnosis')?.value || '').trim(),
    national_id: ($('ep-national-id')?.value || '').trim(),
    dob: ($('ep-dob')?.value || '').trim(),
    phone: ($('ep-phone')?.value || '').trim(),
    email: ($('ep-email')?.value || '').trim(),
    address: ($('ep-address')?.value || '').trim(),
    emergency_contact: ($('ep-emergency')?.value || '').trim(),
  };

  try {
    if (epSpinner) epSpinner.classList.remove('hidden');
    if (epLabel) epLabel.textContent = 'Saving…';
    if (epSubmit) epSubmit.disabled = true;

    await window.api.patients.update(activePortfolioPatientId, payload);
    closeEditPatientModal();
    await openPatientProfile(activePortfolioPatientId);
    if (typeof loadPatientsDirectory === 'function') loadPatientsDirectory();
  } catch (err) {
    if (epError) {
      epError.classList.remove('hidden');
      if (epErrorTxt) epErrorTxt.textContent = err.message || 'Failed to update patient.';
    }
  } finally {
    if (epSpinner) epSpinner.classList.add('hidden');
    if (epLabel) epLabel.textContent = 'Save Changes';
    if (epSubmit) epSubmit.disabled = false;
  }
});

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
      if (typeof window.Diary.setBookingContext === 'function') {
        window.Diary.setBookingContext({ patient_id: activePortfolioPatientId, patient_name: pName });
      }
      window.Diary.openEventDrawer({ patient_id: activePortfolioPatientId, patient_name: pName });
    }
  });
}

const btnProfileDischargePdf = $('btn-profile-discharge-pdf');
if (btnProfileDischargePdf) {
  btnProfileDischargePdf.addEventListener('click', () => {
    if (activePortfolioPatientId && typeof exportPatientDischargeSummary === 'function') {
      exportPatientDischargeSummary(activePortfolioPatientId);
    }
  });
}

const btnProfileDischargeEmail = $('btn-profile-discharge-email');
if (btnProfileDischargeEmail) {
  btnProfileDischargeEmail.addEventListener('click', () => {
    if (activePortfolioPatientId && typeof emailPatientDischargeSummary === 'function') {
      emailPatientDischargeSummary(activePortfolioPatientId);
    }
  });
}

const btnProfileRehabProgram = $('btn-profile-rehab-program');
if (btnProfileRehabProgram) {
  btnProfileRehabProgram.addEventListener('click', () => {
    const patId = activePortfolioPatientId;
    closePatientProfile();
    switchView('programs');
    if (window.RehabBuilder) {
      window.RehabBuilder.openForPatient(patId);
    }
  });
}

$('btn-profile-new-program')?.addEventListener('click', () => {
  const patId = activePortfolioPatientId;
  closePatientProfile();
  switchView('programs');
  if (window.RehabBuilder) {
    window.RehabBuilder.openForPatient(patId);
  }
});

// ── Distraction-free Note Editor Controls ───────────────────────────────────

function setNotePreviewMode(isPreview) {
  const editor = $('note-content-editor');
  const input  = $('note-content-input');
  const pane   = $('note-preview-pane');
  const tabW   = $('btn-tab-write');
  const tabP   = $('btn-tab-preview');
  if (!pane) return;

  if (isPreview) {
    const content = editor ? editor.innerHTML : (input ? input.value : '');
    pane.innerHTML = content.trim() ? (/<[a-z][\s\S]*>/i.test(content) ? content : renderMarkdown(content)) : '<p class="text-xs italic text-slate-400">Empty note.</p>';
    initExcelTables(pane);
    pane.classList.remove('hidden');
    if (editor) editor.classList.add('hidden');
    if (input) input.classList.add('hidden');
    if (tabP) tabP.className = 'px-2.5 py-1 text-xs font-semibold rounded-md bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200';
    if (tabW) tabW.className = 'px-2.5 py-1 text-xs font-medium rounded-md text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors';
  } else {
    pane.classList.add('hidden');
    if (editor) {
      editor.classList.remove('hidden');
      editor.focus();
    } else if (input) {
      input.classList.remove('hidden');
      input.focus();
    }
    if (tabW) tabW.className = 'px-2.5 py-1 text-xs font-semibold rounded-md bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200';
    if (tabP) tabP.className = 'px-2.5 py-1 text-xs font-medium rounded-md text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors';
  }
}

const tabWrite   = $('btn-tab-write');
const tabPreview = $('btn-tab-preview');
if (tabWrite)   tabWrite.addEventListener('click', () => setNotePreviewMode(false));
if (tabPreview) tabPreview.addEventListener('click', () => setNotePreviewMode(true));

// Insert Helper at cursor
function insertAtCursor(snippet) {
  setNotePreviewMode(false);
  const editor = $('note-content-editor');
  if (editor) {
    editor.focus();
    const sel = window.getSelection();
    let range;
    if (sel && sel.rangeCount > 0 && editor.contains(sel.getRangeAt(0).commonAncestorContainer)) {
      range = sel.getRangeAt(0);
    } else {
      range = document.createRange();
      range.selectNodeContents(editor);
      range.collapse(false);
      sel.removeAllRanges();
      sel.addRange(range);
    }
    range.deleteContents();
    if (/<[a-z][\s\S]*>/i.test(snippet)) {
      const frag = range.createContextualFragment(snippet);
      const last = frag.lastChild;
      range.insertNode(frag);
      if (last) {
        range.setStartAfter(last);
        range.collapse(true);
        sel.removeAllRanges();
        sel.addRange(range);
      }
    } else {
      const textNode = document.createTextNode(snippet);
      range.insertNode(textNode);
      range.setStartAfter(textNode);
      range.collapse(true);
      sel.removeAllRanges();
      sel.addRange(range);
    }
    initExcelTables(editor);
    return;
  }

  const el = $('note-content-input');
  if (!el) return;
  const start = el.selectionStart || 0;
  const end = el.selectionEnd || 0;
  const val = el.value;
  el.value = val.substring(0, start) + snippet + val.substring(end);
  el.focus();
  el.selectionStart = el.selectionEnd = start + snippet.length;
}

$('btn-insert-table')?.addEventListener('click', () => insertAtCursor(STARTER_TABLE_HTML));
$('btn-insert-bullet')?.addEventListener('click', () => insertAtCursor('\n• '));
$('btn-insert-timestamp')?.addEventListener('click', () => {
  const now = new Date();
  const timeStr = `[${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}] `;
  insertAtCursor(timeStr);
});
$('btn-insert-bold')?.addEventListener('click', () => insertAtCursor('**bold text**'));
$('btn-insert-h3')?.addEventListener('click', () => insertAtCursor('<h3>Section Title</h3>'));
$('btn-clear-note')?.addEventListener('click', () => {
  const editor = $('note-content-editor');
  if (editor) editor.innerHTML = '';
  const el = $('note-content-input');
  if (el) el.value = '';
  setNotePreviewMode(false);
});

// Save / Sign Note
const btnSaveNote = $('btn-save-note');
if (btnSaveNote) {
  btnSaveNote.addEventListener('click', async () => {
    if (!activePortfolioPatientId) return;
    const editor = $('note-content-editor');
    const input = $('note-content-input');
    const rawContent = (editor ? editor.innerHTML : (input?.value || '')).trim();
    const cleanContent = rawContent.replace(/^(?:<br>|<div><br><\/div>|\s)+$/gi, '');
    if (!cleanContent) {
      alert('Please enter clinical note content before signing.');
      if (editor) editor.focus();
      else input?.focus();
      return;
    }

    const spinner = $('note-spinner');
    if (spinner) spinner.classList.remove('hidden');
    btnSaveNote.disabled = true;

    try {
      const settings = (await window.api.settings.getAll()) || {};
      const pName = (settings.practitioner_name || '').trim() || 'Practitioner';
      const pTitle = (settings.practitioner_title || '').trim();
      const cName = (settings.clinic_name || '').trim() || 'Physiotherapy Clinic';
      const signDate = new Date().toLocaleString();
      const sigLine = `Electronically Signed by: ${pName}${pTitle ? ', ' + pTitle : ''} | ${cName} | Date: ${signDate}`;

      let finalContent = cleanContent;
      if (!finalContent.includes('Electronically Signed by:')) {
        finalContent = `${finalContent}\n<div class="mt-4 pt-2 border-t border-slate-300 dark:border-slate-700 text-xs text-slate-500 dark:text-slate-400 font-mono italic">${escapeHtml(sigLine)}</div>`;
      }

      await window.api.notes.create({
        patient_id: activePortfolioPatientId,
        content: finalContent,
      });

      if (editor) editor.innerHTML = '';
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

// ── Red Flags & Safety Screening Co-Pilot Sidebar in Note Editor ─────────────
const btnToggleRfCopilot = $('btn-toggle-note-rf-copilot');
const rfCopilotChips     = $('note-rf-copilot-chips');

btnToggleRfCopilot?.addEventListener('click', () => {
  if (!rfCopilotChips) return;
  const isHidden = rfCopilotChips.classList.toggle('hidden');
  btnToggleRfCopilot.textContent = isHidden ? 'Show' : 'Hide';
});

const RF_COPILOT_TEMPLATES = {
  ces: `<div class="my-2 p-2.5 rounded-lg bg-red-500/5 border border-red-500/20 text-xs">
<strong>[RED FLAG SCREENING: Cauda Equina Syndrome (NICE NG59 / CSP)]</strong><br>
• Saddle/Perianal Sensation: Intact, normal bilateral sensation to light touch (S2-S5)<br>
• Bladder Function: Normal control, zero urinary retention, change in stream, or overflow incontinence<br>
• Bowel Function: Intact sphincter control, zero faecal incontinence or loss of tone<br>
• Motor / Neuro: No progressive bilateral lower limb motor weakness, foot drop, or bilateral radiculopathy<br>
• <em>Conclusion: Cauda Equina Syndrome red flags screened and excluded.</em>
</div><p></p>`,
  csm: `<div class="my-2 p-2.5 rounded-lg bg-orange-500/5 border border-orange-500/20 text-xs">
<strong>[RED FLAG SCREENING: Cervical Spondylotic Myelopathy (BMJ / NICE NG127)]</strong><br>
• Upper Extremity: Preserved fine motor dexterity (buttons/zippers/cutlery intact); no dropping objects<br>
• Lower Extremity: Normal symmetrical gait; negative Romberg; zero spasticity or ataxia<br>
• Pathological Reflexes: Hoffman (-) bilaterally; Inverted supinator (-); Babinski (-) bilaterally; Clonus 0 beats<br>
• <em>Conclusion: Cervical myelopathy red flags screened and excluded.</em>
</div><p></p>`,
  cad: `<div class="my-2 p-2.5 rounded-lg bg-violet-500/5 border border-violet-500/20 text-xs">
<strong>[RED FLAG SCREENING: Cervical Artery Dysfunction (IFOMPT CAD Framework)]</strong><br>
• 5 Ds: Dizziness (-), Diplopia (-), Dysarthria (-), Dysphagia (-), Drop attacks (-)<br>
• 3 Ns: Nausea (-), Numbness / facial hemi-sensory loss (-), Nystagmus (-)<br>
• Pain Profile: No sudden-onset atypical severe "thunderclap" occipital or suboccipital headache<br>
• <em>Conclusion: CAD / cervical vascular pathologies screened and excluded prior to manual therapy.</em>
</div><p></p>`,
  malig: `<div class="my-2 p-2.5 rounded-lg bg-amber-500/5 border border-amber-500/20 text-xs">
<strong>[RED FLAG SCREENING: Spinal Malignancy (NICE NG12 / JOSPT)]</strong><br>
• Medical History: Zero personal history of primary cancer (prostate, breast, lung, kidney, thyroid, myeloma)<br>
• Weight & Systemic: No unexplained rapid weight loss; no fever, rigors, or constitutional cachexia<br>
• Pain Characteristics: Mechanical diurnal variation present; zero severe unrelenting non-mechanical night pain<br>
• Examination: No localized bony spinous percussion tenderness; no pathological lymphadenopathy<br>
• <em>Conclusion: Spinal malignancy red flags screened and excluded.</em>
</div><p></p>`,
  fracture: `<div class="my-2 p-2.5 rounded-lg bg-blue-500/5 border border-blue-500/20 text-xs">
<strong>[RED FLAG SCREENING: Spinal Fracture (NICE NG41)]</strong><br>
• Trauma: Zero major high-energy trauma (MVA, fall >1m); zero acute unprovoked low-energy collapse<br>
• Risk Factors: No prolonged oral corticosteroid use, no known osteoporosis history or fragility fractures<br>
• Palpation: No acute focal midline spinous process tenderness; no palpable step deformity<br>
• <em>Conclusion: Acute spinal fracture screened and excluded.</em>
</div><p></p>`,
  infect: `<div class="my-2 p-2.5 rounded-lg bg-yellow-500/5 border border-yellow-500/20 text-xs">
<strong>[RED FLAG SCREENING: Spinal Infection / Discitis / Osteomyelitis (IDSA / BMJ)]</strong><br>
• Systemic Signs: Apyrexial; zero chills, rigors, or drenching night sweats<br>
• Risk Profile: No recent invasive spinal procedures/injections, no indwelling lines, no IV drug use<br>
• Examination: No exquisite focal spinal percussion tenderness; no involuntary paravertebral muscle rigidity<br>
• <em>Conclusion: Spinal infection red flags screened and excluded.</em>
</div><p></p>`
};

document.querySelectorAll('.btn-copilot-stamp').forEach(btn => {
  btn.addEventListener('click', () => {
    const rfType = btn.dataset.rfType;
    const snippet = RF_COPILOT_TEMPLATES[rfType];
    if (snippet) {
      insertAtCursor(snippet);
    }
  });
});

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
              <button class="btn-edit-note text-xs font-semibold text-slate-600 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 ml-2 inline-flex items-center gap-1"
                      data-note-id="${note.id}">
                <svg class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
                </svg>
                <span>Edit Note</span>
              </button>
            `}
          </div>
        </div>

        <!-- Note Content (View Mode) -->
        <div id="note-view-${note.id}" class="note-prose">
          ${/<[a-z][\s\S]*>/i.test(note.content) ? note.content : renderMarkdown(note.content)}
        </div>

        <!-- In-Place Edit Mode (< 24 hours only) -->
        <div id="note-edit-wrap-${note.id}" class="hidden space-y-2.5 pt-1">
          <div id="note-edit-editor-${note.id}" contenteditable="true"
               class="rich-editor w-full p-3 rounded-lg text-sm bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500">${note.content}</div>
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

  initExcelTables(feed);

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
      const editEd = $(`note-edit-editor-${id}`);
      if (viewEl && editWrap) {
        viewEl.classList.add('hidden');
        editWrap.classList.remove('hidden');
        if (editEd) initExcelTables(editEd);
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
      const editEd = $(`note-edit-editor-${id}`);
      const input = $(`note-edit-input-${id}`);
      const content = (editEd ? editEd.innerHTML : (input?.value || '')).trim();
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

let currentScheduleDate = new Date();

function formatISODate(d) {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function getApptHourMinute(scheduled_at) {
  if (!scheduled_at) return { hour: 9, minute: 0 };
  const d = new Date(scheduled_at);
  if (isNaN(d.getTime())) {
    const match = String(scheduled_at).match(/(\d{1,2}):(\d{2})/);
    if (match) return { hour: parseInt(match[1], 10), minute: parseInt(match[2], 10) };
    return { hour: 9, minute: 0 };
  }
  let h = d.getHours();
  let m = d.getMinutes();
  if ((h < SCHEDULE_START || h >= SCHEDULE_END) && (d.getUTCHours() >= SCHEDULE_START && d.getUTCHours() < SCHEDULE_END)) {
    h = d.getUTCHours();
    m = d.getUTCMinutes();
  }
  return { hour: h, minute: m };
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
  const statusDot  = { confirmed: 'bg-indigo-500', pending: 'bg-amber-400', completed: 'bg-emerald-500', scheduled: 'bg-indigo-500' };
  const statusText = { confirmed: 'Confirmed',     pending: 'Pending',      completed: 'Completed',      scheduled: 'Scheduled' };

  const card = document.createElement('div');
  const statusKey = (appt.status || 'confirmed').toLowerCase();
  card.className = `appt-card status-${statusKey} cursor-pointer`;
  card.draggable = true;
  card.dataset.apptId = String(appt.id);

  const patientName = appt.patientName || (appt.first_name ? `${appt.first_name} ${appt.last_name}` : (appt.title || appt.type || 'Appointment'));
  const duration = appt.duration || appt.duration_min || 30;
  const apptType = appt.type || appt.event_type || 'Clinical Session';

  card.addEventListener('click', async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (card.classList.contains('dragging')) return;
    const pid = appt.patientId || appt.patient_id;
    if (pid) {
      try {
        const patient = await window.api.patients.getById(pid);
        if (patient) {
          openPatientProfile(pid, patient);
          return;
        }
      } catch (err) {
        console.warn('Patient lookup failed:', err);
      }
      alert(`Patient record #${pid} (${patientName}) could not be found in the local database.`);
    } else {
      alert(`Appointment / Block: ${patientName}\nDuration: ${duration} mins\nType: ${apptType}`);
    }
  });

  card.innerHTML = `
    <div class="flex items-center justify-between gap-2 pointer-events-none">
      <span class="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate leading-snug">${escapeHtml(patientName)}</span>
      <span class="flex items-center gap-1 shrink-0">
        <span class="h-1.5 w-1.5 rounded-full ${statusDot[statusKey] ?? 'bg-slate-400'}"></span>
        <span class="text-[10px] font-medium text-slate-500 dark:text-slate-400">${statusText[statusKey] ?? appt.status}</span>
      </span>
    </div>
    <span class="text-[11px] text-slate-400 dark:text-slate-500 leading-snug pointer-events-none">${escapeHtml(apptType)} &middot; ${duration}&thinsp;min</span>
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

async function renderDailySchedule(targetDate = null) {
  if (targetDate) {
    currentScheduleDate = new Date(targetDate);
  }
  const container = $('schedule-container');
  const scheduleDateEl = $('schedule-date');
  const scheduleCountLabel = $('schedule-count-label');
  const apptCountEl = $('appt-count');
  if (!container) return;

  const todayStr = formatISODate(new Date());
  const selectedStr = formatISODate(currentScheduleDate);
  const isToday = todayStr === selectedStr;

  if (scheduleDateEl) {
    scheduleDateEl.textContent = currentScheduleDate.toLocaleDateString('en-AU', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
    });
  }
  if (scheduleCountLabel) {
    scheduleCountLabel.textContent = isToday ? 'today' : currentScheduleDate.toLocaleDateString('en-AU', { month: 'short', day: 'numeric' });
  }

  container.innerHTML = '';

  const frag = document.createDocumentFragment();
  for (let h = SCHEDULE_START; h < SCHEDULE_END; h++) {
    for (let m = 0; m < 60; m += SLOT_INTERVAL) {
      frag.appendChild(createTimeSlotRow(h, m));
    }
  }
  container.appendChild(frag);

  let appts = [];
  try {
    appts = await window.api.appointments.list({ date: selectedStr });
  } catch (err) {
    console.error('Failed to load appointments for schedule:', err);
    appts = [];
  }

  if (apptCountEl) {
    apptCountEl.textContent = Array.isArray(appts) ? appts.length : 0;
  }

  if (Array.isArray(appts)) {
    appts.forEach(appt => {
      const { hour, minute } = getApptHourMinute(appt.scheduled_at);
      const slotM = minute < 30 ? 0 : 30;
      const slot = document.getElementById(slotBodyId(hour, slotM)) || document.getElementById(slotBodyId(SCHEDULE_START, 0));
      if (slot) {
        slot.appendChild(createApptCard(appt));
      }
    });
  }

  if (isToday) {
    addNowIndicator();
    scrollToNow();
  }
}

// Wire Day Navigation controls
$('btn-schedule-prev')?.addEventListener('click', () => {
  currentScheduleDate.setDate(currentScheduleDate.getDate() - 1);
  renderDailySchedule();
});

$('btn-schedule-next')?.addEventListener('click', () => {
  currentScheduleDate.setDate(currentScheduleDate.getDate() + 1);
  renderDailySchedule();
});

$('btn-schedule-today')?.addEventListener('click', () => {
  currentScheduleDate = new Date();
  renderDailySchedule();
});

renderDailySchedule();

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

    if (elP) elP.textContent = s.activePatients ?? 0;
    if (elA) elA.textContent = s.todayAppts    ?? 0;
    if (elN) elN.textContent = s.totalNotes    ?? 0;
  } catch (err) {
    console.error('[Stats]', err);
  }
}

loadStats();

// ═══════════════════════════════════════════════════════════════════════════
// SMART PHRASES HUB & EXPANSION ENGINE (Phase 5)
// ═══════════════════════════════════════════════════════════════════════════

let smartPhrasesCache = [];
let triggerCategoriesCache = [];
let selectedSmartPhraseId = null;
let currentPrefixFilter = 'all';

async function loadSmartPhrasesCache() {
  try {
    smartPhrasesCache = await window.api.smartPhrases.list();
  } catch (err) {
    console.error('[SmartPhrases] Failed to load cache:', err);
  }
}

async function loadTriggerCategories() {
  try {
    triggerCategoriesCache = await window.api.triggerCategories.list();
    renderDynamicCategoryTabs();
    populatePrefixSelect();
  } catch (err) {
    console.error('[SmartPhrases] Failed to load trigger categories:', err);
  }
}

function renderDynamicCategoryTabs() {
  const container = $('sp-dynamic-category-tabs');
  if (!container) return;
  container.innerHTML = triggerCategoriesCache.map(cat => {
    const isActive = currentPrefixFilter === cat.prefix;
    return `
      <button class="sp-tab-btn ${isActive ? 'active bg-indigo-50 dark:bg-indigo-500/15 text-indigo-700 dark:text-indigo-400 font-semibold' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 font-medium'} px-2.5 py-1 rounded-md text-[11px] whitespace-nowrap"
              data-filter="${escapeHtml(cat.prefix)}"
              title="Filter by ${escapeHtml(cat.prefix)} (${escapeHtml(cat.label)})">
        <span class="font-mono font-bold">${escapeHtml(cat.prefix)}</span> ${escapeHtml(cat.label)}
      </button>
    `;
  }).join('');

  container.querySelectorAll('.sp-tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      $('sp-prefix-tabs')?.querySelectorAll('.sp-tab-btn').forEach(b => {
        b.className = 'sp-tab-btn px-2.5 py-1 rounded-md text-[11px] font-medium text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 whitespace-nowrap';
      });
      btn.className = 'sp-tab-btn active px-2.5 py-1 rounded-md text-[11px] font-semibold bg-indigo-50 dark:bg-indigo-500/15 text-indigo-700 dark:text-indigo-400 whitespace-nowrap';
      currentPrefixFilter = btn.dataset.filter;
      renderSmartPhrasesList();
    });

    btn.addEventListener('dblclick', async (e) => {
      e.stopPropagation();
      const prefix = btn.dataset.filter;
      const cat = triggerCategoriesCache.find(c => c.prefix === prefix);
      if (!cat) return;
      const newLabel = prompt(`Rename category "${cat.label}" (${prefix}):`, cat.label);
      if (newLabel && newLabel.trim() && newLabel.trim() !== cat.label) {
        try {
          await window.api.triggerCategories.save(prefix, newLabel.trim());
          await loadTriggerCategories();
          renderSmartPhrasesList();
        } catch (err) {
          alert('Failed to update category: ' + err.message);
        }
      }
    });
  });
}

function populatePrefixSelect() {
  const select = $('sp-prefix-select');
  if (!select) return;
  const currentVal = select.value;
  select.innerHTML = triggerCategoriesCache.map(cat => {
    return `<option value="${escapeHtml(cat.prefix)}">${escapeHtml(cat.prefix)} (${escapeHtml(cat.label)})</option>`;
  }).join('') + '<option value="custom">Custom…</option>';
  if (currentVal) select.value = currentVal;
}

// Master-detail ledger population
async function loadSmartPhrasesHub() {
  await loadTriggerCategories();
  await loadSmartPhrasesCache();
  renderSmartPhrasesList();
  wireSmartPhraseEditorEvents();
}

function renderSmartPhrasesList() {
  const listEl = $('sp-list');
  const countBadge = $('sp-count-badge');
  const searchInput = $('sp-search-input');
  if (!listEl) return;

  const query = (searchInput?.value || '').trim().toLowerCase();
  let phrases = smartPhrasesCache;

  // Filter by dynamic prefix quick tab
  if (currentPrefixFilter && currentPrefixFilter !== 'all') {
    phrases = phrases.filter(sp => sp.trigger_prefix === currentPrefixFilter);
  }

  // Filter by search query
  if (query) {
    phrases = phrases.filter(sp => 
      sp.full_trigger.toLowerCase().includes(query) ||
      sp.title.toLowerCase().includes(query) ||
      (sp.category && sp.category.toLowerCase().includes(query))
    );
  }

  if (countBadge) countBadge.textContent = `${phrases.length} phrase${phrases.length === 1 ? '' : 's'}`;

  if (!phrases.length) {
    listEl.innerHTML = `
      <div class="p-8 text-center text-xs text-slate-400 dark:text-slate-500">
        No smart phrases match your filter.
      </div>
    `;
    return;
  }

  listEl.innerHTML = phrases.map(sp => {
    const isSelected = sp.id === selectedSmartPhraseId;
    return `
      <div class="p-3 cursor-pointer transition-colors border-l-2 ${isSelected ? 'sp-row-active border-l-indigo-600 dark:border-l-indigo-500' : 'border-l-transparent hover:bg-slate-50 dark:hover:bg-slate-800/50'} sp-ledger-item"
           data-id="${sp.id}">
        <div class="flex items-center justify-between gap-2 mb-1">
          <span class="sp-tag-badge">${escapeHtml(sp.full_trigger)}</span>
          <span class="text-[10px] uppercase font-semibold tracking-wider text-slate-400 dark:text-slate-500">${escapeHtml(sp.category || 'general')}</span>
        </div>
        <p class="text-xs font-semibold text-slate-900 dark:text-slate-100 truncate">${escapeHtml(sp.title)}</p>
        <p class="text-[11px] text-slate-400 dark:text-slate-500 truncate mt-0.5">${escapeHtml((sp.content || '').replace(/<[^>]*>/g, ' ').replace(/[\n#|]/g, ' ').substring(0, 75))}…</p>
      </div>
    `;
  }).join('');

  listEl.querySelectorAll('.sp-ledger-item').forEach(item => {
    item.addEventListener('click', () => {
      const id = Number(item.dataset.id);
      selectSmartPhrase(id);
    });
  });

  // If no phrase selected yet and phrases exist, select the first one
  if (!selectedSmartPhraseId && phrases.length > 0) {
    selectSmartPhrase(phrases[0].id);
  }
}

function selectSmartPhrase(id) {
  selectedSmartPhraseId = id;
  const sp = smartPhrasesCache.find(p => p.id === id);
  if (!sp) return;

  // Toggle active class on list
  document.querySelectorAll('.sp-ledger-item').forEach(item => {
    const isSel = Number(item.dataset.id) === id;
    item.classList.toggle('sp-row-active', isSel);
    item.classList.toggle('border-l-indigo-600', isSel);
    item.classList.toggle('dark:border-l-indigo-500', isSel);
  });

  const emptyState = $('sp-empty-state');
  const formBody   = $('sp-editor-form');
  if (emptyState) emptyState.classList.add('hidden');
  if (formBody) formBody.classList.remove('hidden');

  // Populate editor
  if ($('sp-title-input')) $('sp-title-input').value = sp.title || '';
  if ($('sp-code-input')) $('sp-code-input').value = sp.code || '';
  
  const spEditor = $('sp-content-editor');
  if (spEditor) {
    spEditor.innerHTML = sp.content || '';
    initExcelTables(spEditor);
  }
  if ($('sp-content-input')) $('sp-content-input').value = sp.content || '';
  if ($('sp-category-input')) $('sp-category-input').value = sp.category || 'general';

  // Handle prefix select vs custom input
  const select = $('sp-prefix-select');
  const customInput = $('sp-prefix-input');
  const knownPrefix = triggerCategoriesCache.some(c => c.prefix === sp.trigger_prefix);
  if (knownPrefix) {
    if (select) select.value = sp.trigger_prefix;
    if (customInput) customInput.classList.add('hidden');
  } else {
    if (select) select.value = 'custom';
    if (customInput) {
      customInput.classList.remove('hidden');
      customInput.value = sp.trigger_prefix || '';
    }
  }

  updateTriggerBadgePreview();
  setSmartPhrasePreviewMode(false);
}

function updateTriggerBadgePreview() {
  const select = $('sp-prefix-select');
  const customInput = $('sp-prefix-input');
  const pfx = select && select.value === 'custom' ? (customInput?.value || '@') : (select?.value || '@');
  let rawCode = ($('sp-code-input')?.value || 'code').trim().replace(/\s+/g, '-');
  const code = (pfx === '!' || pfx === '#' ? rawCode.toUpperCase() : rawCode);
  const full = `${pfx}${code}`;

  const preview = $('sp-trigger-preview');
  const fullLbl = $('sp-full-trigger-lbl');
  if (preview) preview.textContent = full;
  if (fullLbl) fullLbl.textContent = full;
}

function setSmartPhrasePreviewMode(isPreview) {
  const editor = $('sp-content-editor');
  const input  = $('sp-content-input');
  const pane   = $('sp-preview-pane');
  const btn    = $('sp-btn-preview-toggle');
  if (!pane) return;

  if (isPreview) {
    const content = editor ? editor.innerHTML : (input ? input.value : '');
    pane.innerHTML = content.trim() ? (/<[a-z][\s\S]*>/i.test(content) ? content : renderMarkdown(content)) : '<p class="text-xs italic text-slate-400">Empty template body.</p>';
    initExcelTables(pane);
    pane.classList.remove('hidden');
    if (editor) editor.classList.add('hidden');
    if (input) input.classList.add('hidden');
    if (btn) btn.textContent = 'Edit Content';
  } else {
    pane.classList.add('hidden');
    if (editor) {
      editor.classList.remove('hidden');
      editor.focus();
    } else if (input) {
      input.classList.remove('hidden');
      input.focus();
    }
    if (btn) btn.textContent = 'Live Preview';
  }
}

let spEventsWired = false;
function wireSmartPhraseEditorEvents() {
  if (spEventsWired) return;
  spEventsWired = true;

  // Search filter
  $('sp-search-input')?.addEventListener('input', debounce(renderSmartPhrasesList, 150));

  // "All" prefix tab
  $('sp-prefix-tabs')?.querySelector('[data-filter="all"]')?.addEventListener('click', (e) => {
    $('sp-prefix-tabs').querySelectorAll('.sp-tab-btn').forEach(b => {
      b.className = 'sp-tab-btn px-2.5 py-1 rounded-md text-[11px] font-medium text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 whitespace-nowrap';
    });
    e.currentTarget.className = 'sp-tab-btn active px-2.5 py-1 rounded-md text-[11px] font-semibold bg-indigo-50 dark:bg-indigo-500/15 text-indigo-700 dark:text-indigo-400 whitespace-nowrap';
    currentPrefixFilter = 'all';
    renderSmartPhrasesList();
  });

  // + New Category modal wiring
  const catModal = $('modal-new-category');
  const catBackdrop = $('cat-modal-backdrop');

  function openCatModal() {
    if ($('new-cat-prefix-input')) $('new-cat-prefix-input').value = '';
    if ($('new-cat-label-input')) $('new-cat-label-input').value = '';
    catBackdrop?.classList.remove('hidden', 'opacity-0', 'pointer-events-none');
    catBackdrop?.classList.add('pointer-events-auto');
    catModal?.classList.remove('hidden', 'opacity-0', 'pointer-events-none');
    catModal?.classList.add('flex', 'pointer-events-auto');
    document.body.classList.add('modal-open');
    $('new-cat-prefix-input')?.focus();
  }

  function closeCatModal() {
    catBackdrop?.classList.add('hidden', 'opacity-0', 'pointer-events-none');
    catBackdrop?.classList.remove('pointer-events-auto');
    catModal?.classList.add('hidden', 'opacity-0', 'pointer-events-none');
    catModal?.classList.remove('flex', 'pointer-events-auto');
    document.body.classList.remove('modal-open');
  }

  $('sp-btn-add-category')?.addEventListener('click', openCatModal);
  $('modal-new-category-close')?.addEventListener('click', closeCatModal);
  $('modal-new-category-cancel')?.addEventListener('click', closeCatModal);
  catBackdrop?.addEventListener('click', closeCatModal);

  $('modal-new-category-save')?.addEventListener('click', async () => {
    const prefix = ($('new-cat-prefix-input')?.value || '').trim();
    const label = ($('new-cat-label-input')?.value || '').trim();
    if (!prefix) { alert('Prefix symbol is required.'); $('new-cat-prefix-input')?.focus(); return; }
    if (!label) { alert('Category label is required.'); $('new-cat-label-input')?.focus(); return; }

    try {
      await window.api.triggerCategories.save(prefix, label);
      await loadTriggerCategories();
      closeCatModal();
      currentPrefixFilter = prefix;
      renderSmartPhrasesList();
    } catch (err) {
      alert(err.message || 'Failed to save category.');
    }
  });

  // Prefix select change
  $('sp-prefix-select')?.addEventListener('change', (e) => {
    const custom = $('sp-prefix-input');
    if (e.target.value === 'custom') {
      if (custom) { custom.classList.remove('hidden'); custom.focus(); }
    } else {
      if (custom) custom.classList.add('hidden');
    }
    updateTriggerBadgePreview();
  });

  $('sp-prefix-input')?.addEventListener('input', updateTriggerBadgePreview);
  $('sp-code-input')?.addEventListener('input', updateTriggerBadgePreview);

  // Import from PDF button (Phase 5: 100% Offline Local Importer)
  $('sp-btn-import-pdf')?.addEventListener('click', async () => {
    const btn = $('sp-btn-import-pdf');
    try {
      if (btn) {
        btn.disabled = true;
        btn.classList.add('opacity-50', 'pointer-events-none');
      }

      const result = await window.api.smartPhrases.importPdfLocal();
      if (btn) {
        btn.disabled = false;
        btn.classList.remove('opacity-50', 'pointer-events-none');
      }

      if (!result) return; // User canceled file dialog

      if (!result.success) {
        alert(result.error || 'Failed to parse PDF document.');
        return;
      }

      selectedSmartPhraseId = null;
      document.querySelectorAll('.sp-ledger-item').forEach(i => i.classList.remove('sp-row-active', 'border-l-indigo-600', 'dark:border-l-indigo-500'));
      
      $('sp-empty-state')?.classList.add('hidden');
      $('sp-editor-form')?.classList.remove('hidden');

      if ($('sp-title-input')) $('sp-title-input').value = result.title || '';
      if ($('sp-code-input')) $('sp-code-input').value = (result.code || '').toUpperCase();
      if ($('sp-prefix-select')) $('sp-prefix-select').value = result.trigger_prefix || '!';
      if ($('sp-prefix-input')) $('sp-prefix-input').classList.add('hidden');
      if ($('sp-category-input')) $('sp-category-input').value = result.category || 'outcome_measures';

      if ($('sp-content-editor')) {
        $('sp-content-editor').innerHTML = result.content || '';
        initExcelTables($('sp-content-editor'), $('sp-content-input'));
      }
      if ($('sp-content-input')) {
        $('sp-content-input').value = result.content || '';
      }

      updateTriggerBadgePreview();
      setSmartPhrasePreviewMode(false);
      $('sp-code-input')?.focus();
    } catch (err) {
      if (btn) {
        btn.disabled = false;
        btn.classList.remove('opacity-50', 'pointer-events-none');
      }
      console.error('[sp-btn-import-pdf] Error importing PDF:', err);
      alert('Error importing PDF: ' + (err.message || 'Unknown error'));
    }
  });

  // New Phrase button
  $('sp-btn-new')?.addEventListener('click', () => {
    selectedSmartPhraseId = null;
    document.querySelectorAll('.sp-ledger-item').forEach(i => i.classList.remove('sp-row-active', 'border-l-indigo-600', 'dark:border-l-indigo-500'));
    
    $('sp-empty-state')?.classList.add('hidden');
    $('sp-editor-form')?.classList.remove('hidden');

    if ($('sp-title-input')) $('sp-title-input').value = '';
    if ($('sp-code-input')) $('sp-code-input').value = '';
    if ($('sp-content-editor')) $('sp-content-editor').innerHTML = '';
    if ($('sp-content-input')) $('sp-content-input').value = '';
    if ($('sp-category-input')) $('sp-category-input').value = 'general';
    if ($('sp-prefix-select')) $('sp-prefix-select').value = '@';
    if ($('sp-prefix-input')) $('sp-prefix-input').classList.add('hidden');

    updateTriggerBadgePreview();
    setSmartPhrasePreviewMode(false);
    $('sp-title-input')?.focus();
  });

  // + Insert Table action
  $('sp-insert-table')?.addEventListener('click', () => {
    insertInSpEditor(STARTER_TABLE_HTML);
  });

  // Live preview toggle
  $('sp-btn-preview-toggle')?.addEventListener('click', () => {
    const isCurrentlyHidden = $('sp-preview-pane')?.classList.contains('hidden');
    setSmartPhrasePreviewMode(isCurrentlyHidden);
  });

  // Save Phrase
  $('sp-btn-save')?.addEventListener('click', async () => {
    const title = ($('sp-title-input')?.value || '').trim();
    const select = $('sp-prefix-select');
    const custom = $('sp-prefix-input');
    const prefix = select && select.value === 'custom' ? (custom?.value || '@').trim() : (select?.value || '@');
    let rawCode = ($('sp-code-input')?.value || '').trim().replace(/\s+/g, '-');
    const code = (prefix === '!' || prefix === '#' ? rawCode.toUpperCase() : rawCode);
    
    const editor = $('sp-content-editor');
    const content = (editor ? editor.innerHTML : ($('sp-content-input')?.value || '')).trim();
    const category = ($('sp-category-input')?.value || 'general').trim();

    if (!title) { alert('Phrase title is required.'); $('sp-title-input')?.focus(); return; }
    if (!code) { alert('Trigger keyword code is required.'); $('sp-code-input')?.focus(); return; }
    if (!content) { alert('Phrase content cannot be empty.'); (editor || $('sp-content-input'))?.focus(); return; }

    try {
      const payload = { title, trigger_prefix: prefix, code, content, category };
      let saved;
      if (selectedSmartPhraseId) {
        saved = await window.api.smartPhrases.update(selectedSmartPhraseId, payload);
      } else {
        saved = await window.api.smartPhrases.create(payload);
        selectedSmartPhraseId = saved.id;
      }

      await loadSmartPhrasesCache();
      renderSmartPhrasesList();
      selectSmartPhrase(saved.id);

      const ind = $('sp-save-indicator');
      if (ind) {
        ind.classList.remove('hidden');
        setTimeout(() => ind.classList.add('hidden'), 2500);
      }
    } catch (err) {
      alert(err.message || 'Failed to save phrase.');
    }
  });

  // Delete Phrase
  $('sp-btn-delete')?.addEventListener('click', async () => {
    if (!selectedSmartPhraseId) return;
    const sp = smartPhrasesCache.find(p => p.id === selectedSmartPhraseId);
    if (!confirm(`Are you sure you want to delete "${sp?.full_trigger || 'this phrase'}"?`)) return;

    try {
      await window.api.smartPhrases.delete(selectedSmartPhraseId);
      selectedSmartPhraseId = null;
      await loadSmartPhrasesCache();
      renderSmartPhrasesList();
      if (smartPhrasesCache.length > 0) {
        selectSmartPhrase(smartPhrasesCache[0].id);
      } else {
        $('sp-empty-state')?.classList.remove('hidden');
        $('sp-editor-form')?.classList.add('hidden');
      }
    } catch (err) {
      alert(err.message || 'Failed to delete phrase.');
    }
  });
}

function insertInSpEditor(snippet) {
  setSmartPhrasePreviewMode(false);
  const editor = $('sp-content-editor');
  if (editor) {
    editor.focus();
    const sel = window.getSelection();
    let range;
    if (sel && sel.rangeCount > 0 && editor.contains(sel.getRangeAt(0).commonAncestorContainer)) {
      range = sel.getRangeAt(0);
    } else {
      range = document.createRange();
      range.selectNodeContents(editor);
      range.collapse(false);
      sel.removeAllRanges();
      sel.addRange(range);
    }
    range.deleteContents();
    const frag = range.createContextualFragment(snippet);
    const last = frag.lastChild;
    range.insertNode(frag);
    if (last) {
      range.setStartAfter(last);
      range.collapse(true);
      sel.removeAllRanges();
      sel.addRange(range);
    }
    initExcelTables(editor);
    return;
  }

  const el = $('sp-content-input');
  if (!el) return;
  const start = el.selectionStart || 0;
  const end = el.selectionEnd || 0;
  const val = el.value;
  el.value = val.substring(0, start) + snippet + val.substring(end);
  el.focus();
  el.selectionStart = el.selectionEnd = start + snippet.length;
}

// ── Dynamic In-Editor Expansion Engine ───────────────────────────────────────

let activeEditorTarget = null;
let activeTriggerToken = null;
let popoverCandidates = [];
let popoverFocusIndex = 0;

function initSmartPhraseExpansionEngine() {
  const popover = $('sp-autocomplete-popover');
  const popoverList = $('sp-popover-list');
  if (!popover || !popoverList) return;

  function closePopover() {
    popover.classList.add('hidden');
    popoverCandidates = [];
    popoverFocusIndex = 0;
    activeTriggerToken = null;
    activeEditorTarget = null;
  }

  // Check if a character is a trigger prefix registered in the library
  function isTriggerPrefix(char) {
    if (!char) return false;
    return smartPhrasesCache.some(sp => sp.trigger_prefix === char) ||
           triggerCategoriesCache.some(c => c.prefix === char) ||
           ['@', '!', '#'].includes(char);
  }

  // Handle typing inside any editor (contenteditable or textarea)
  document.addEventListener('input', (e) => {
    const target = e.target;
    if (!target) return;

    // A: Contenteditable editor (note-content-editor, sp-content-editor, or note-edit-editor-*)
    if (target.isContentEditable || target.id === 'note-content-editor' || target.id === 'sp-content-editor' || (target.id && target.id.startsWith('note-edit-editor-'))) {
      const sel = window.getSelection();
      if (!sel || !sel.rangeCount) return;
      const range = sel.getRangeAt(0);
      const node = range.startContainer;
      if (node.nodeType !== Node.TEXT_NODE) {
        closePopover();
        return;
      }

      const text = node.textContent;
      const caretPos = range.startOffset;

      let triggerIdx = -1;
      for (let i = caretPos - 1; i >= 0; i--) {
        const c = text[i];
        if (c === ' ' || c === '\u00A0' || c === '\n') break;
        if (isTriggerPrefix(c)) {
          if (i === 0 || text[i - 1] === ' ' || text[i - 1] === '\u00A0' || text[i - 1] === '\n') {
            triggerIdx = i;
            break;
          }
        }
      }

      if (triggerIdx === -1) {
        closePopover();
        return;
      }

      const token = text.substring(triggerIdx, caretPos);
      const prefix = token[0];
      const query = token.slice(1).toLowerCase();

      activeEditorTarget = target;
      activeTriggerToken = {
        isContentEditable: true,
        textNode: node,
        startOffset: triggerIdx,
        endOffset: caretPos,
        prefix,
        query,
      };

      filterAndShowPopover(prefix, query, target);
      return;
    }

    // B: Textarea fallback
    if (target.tagName === 'TEXTAREA' && (target.id === 'note-content-input' || (target.id && target.id.startsWith('note-edit-input-')))) {
      activeEditorTarget = target;
      const caretPos = target.selectionStart;
      const val = target.value;

      let triggerIdx = -1;
      for (let i = caretPos - 1; i >= 0; i--) {
        const c = val[i];
        if (c === ' ' || c === '\n') break;
        if (isTriggerPrefix(c)) {
          if (i === 0 || val[i - 1] === ' ' || val[i - 1] === '\n') {
            triggerIdx = i;
            break;
          }
        }
      }

      if (triggerIdx === -1) {
        closePopover();
        return;
      }

      const token = val.substring(triggerIdx, caretPos);
      const prefix = token[0];
      const query = token.slice(1).toLowerCase();

      activeTriggerToken = {
        isContentEditable: false,
        prefix,
        query,
        start: triggerIdx,
        end: caretPos
      };

      filterAndShowPopover(prefix, query, target);
      return;
    }
  });

  function filterAndShowPopover(prefix, query, target) {
    popoverCandidates = smartPhrasesCache.filter(sp => {
      if (sp.trigger_prefix !== prefix) return false;
      if (!query) return true;
      return sp.code.toLowerCase().includes(query) || sp.title.toLowerCase().includes(query);
    }).slice(0, 10);

    if (popoverCandidates.length === 0) {
      closePopover();
      return;
    }

    popoverFocusIndex = 0;
    renderPopoverList(popoverList);
    positionPopover(target, popover);
  }

  function renderPopoverList(listEl) {
    listEl.innerHTML = popoverCandidates.map((sp, idx) => `
      <li class="px-3 py-2 cursor-pointer transition-colors flex items-center justify-between gap-3 ${idx === popoverFocusIndex ? 'bg-indigo-50 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300' : 'hover:bg-slate-50 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-300'}"
          data-index="${idx}">
        <div class="min-w-0">
          <div class="flex items-center gap-2">
            <span class="font-mono text-xs font-semibold text-indigo-600 dark:text-indigo-400">${escapeHtml(sp.full_trigger)}</span>
            <span class="text-[10px] text-slate-400 dark:text-slate-500 truncate font-sans">${escapeHtml(sp.title)}</span>
          </div>
        </div>
        <span class="shrink-0 text-[9px] uppercase font-semibold px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
          ${escapeHtml(sp.category || 'general')}
        </span>
      </li>
    `).join('');

    popover.classList.remove('hidden');

    listEl.querySelectorAll('li').forEach(li => {
      li.addEventListener('mousedown', (ev) => {
        ev.preventDefault();
        const idx = Number(li.dataset.index);
        applySmartPhrase(popoverCandidates[idx]);
      });
    });
  }

  function positionPopover(target, popoverEl) {
    if (activeTriggerToken?.isContentEditable) {
      const sel = window.getSelection();
      if (sel && sel.rangeCount > 0) {
        const rect = sel.getRangeAt(0).getBoundingClientRect();
        const approxTop = Math.min(window.innerHeight - 300, Math.max(10, rect.bottom + 6));
        const approxLeft = Math.min(window.innerWidth - 340, Math.max(10, rect.left));
        popoverEl.style.top = `${approxTop}px`;
        popoverEl.style.left = `${approxLeft}px`;
        return;
      }
    }

    const rect = target.getBoundingClientRect();
    const caretPos = target.selectionStart || 0;
    const textBefore = (target.value || '').substring(0, caretPos);
    const lineCount = (textBefore.match(/\n/g) || []).length;
    const lineHeight = 20;
    const approxTop = rect.top + Math.min(target.clientHeight - 60, (lineCount * lineHeight) + 26) - target.scrollTop;
    const approxLeft = Math.min(window.innerWidth - 340, rect.left + 24);

    popoverEl.style.top = `${Math.max(10, Math.min(window.innerHeight - 300, approxTop))}px`;
    popoverEl.style.left = `${approxLeft}px`;
  }

  function applySmartPhrase(sp) {
    if (!activeEditorTarget || !activeTriggerToken || !sp) return;

    if (activeTriggerToken.isContentEditable) {
      const { textNode, startOffset, endOffset } = activeTriggerToken;
      const range = document.createRange();
      range.setStart(textNode, startOffset);
      range.setEnd(textNode, endOffset);
      range.deleteContents();

      const frag = range.createContextualFragment(sp.content);
      const lastNode = frag.lastChild;
      range.insertNode(frag);

      const sel = window.getSelection();
      sel.removeAllRanges();
      const nextRange = document.createRange();
      if (lastNode) {
        nextRange.setStartAfter(lastNode);
        nextRange.collapse(true);
      }
      sel.addRange(nextRange);

      initExcelTables(activeEditorTarget);
      closePopover();
      return;
    }

    // Textarea fallback
    const target = activeEditorTarget;
    const val = target.value;
    const replacement = sp.content;
    const newVal = val.substring(0, activeTriggerToken.start) + replacement + val.substring(activeTriggerToken.end);
    target.value = newVal;
    const newCaret = activeTriggerToken.start + replacement.length;
    target.focus();
    target.selectionStart = target.selectionEnd = newCaret;
    closePopover();
  }

  // Keyboard navigation on active editor
  document.addEventListener('keydown', (e) => {
    if (popover.classList.contains('hidden') || popoverCandidates.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      popoverFocusIndex = (popoverFocusIndex + 1) % popoverCandidates.length;
      renderPopoverList(popoverList);
      popoverList.children[popoverFocusIndex]?.scrollIntoView({ block: 'nearest' });
      return;
    }

    if (e.key === 'ArrowUp') {
      e.preventDefault();
      popoverFocusIndex = (popoverFocusIndex - 1 + popoverCandidates.length) % popoverCandidates.length;
      renderPopoverList(popoverList);
      popoverList.children[popoverFocusIndex]?.scrollIntoView({ block: 'nearest' });
      return;
    }

    if (e.key === 'Enter' || e.key === 'Tab') {
      e.preventDefault();
      applySmartPhrase(popoverCandidates[popoverFocusIndex]);
      return;
    }

    if (e.key === 'Escape') {
      e.preventDefault();
      closePopover();
      return;
    }
  });

  // Close on outside click
  document.addEventListener('mousedown', (e) => {
    if (!popover.contains(e.target) && e.target !== activeEditorTarget) {
      closePopover();
    }
  });
}

// Initialise Smart Phrases Cache, Categories & Expansion Engine
loadTriggerCategories();
loadSmartPhrasesCache();
initSmartPhraseExpansionEngine();


// ═══════════════════════════════════════════════════════════════════════════
// PATIENT PORTFOLIO: REHAB & PT PROGRAMS SECTION
// ═══════════════════════════════════════════════════════════════════════════

async function renderPatientRehabPrograms(patientId) {
  const container = $('profile-rehab-programs-list');
  const countBadge = $('profile-rehab-count');
  if (!container) return;

  try {
    const programs = await window.api.rehab.listPrograms(patientId);
    if (countBadge) {
      countBadge.textContent = `${programs.length} active`;
    }

    if (!programs || programs.length === 0) {
      container.innerHTML = `
        <div class="py-4 text-center border border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
          <p class="text-xs text-slate-500 italic">No rehabilitation programs currently assigned to this patient.</p>
        </div>`;
      return;
    }

    container.innerHTML = '';
    programs.forEach(prog => {
      const item = document.createElement('div');
      item.className = 'flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 shadow-sm';

      let exerciseCount = 0;
      let sched = null;
      try {
        sched = typeof prog.schedule_json === 'string' ? JSON.parse(prog.schedule_json) : prog.schedule_json;
        if (sched && sched.weeks) {
          sched.weeks.forEach(w => {
            if (w.days) {
              Object.values(w.days).forEach(arr => {
                exerciseCount += (arr || []).length;
              });
            }
          });
        }
      } catch (e) {}

      item.innerHTML = `
        <div class="min-w-0">
          <div class="flex items-center gap-2">
            <span class="text-xs font-semibold text-slate-900 dark:text-slate-100 truncate">${escapeHtml(prog.title || 'Rehabilitation Routine')}</span>
            <span class="inline-flex items-center px-2 py-0.5 text-[10px] font-bold uppercase rounded-md bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-500/30">
              ${prog.duration_weeks || 4} Weeks
            </span>
          </div>
          <p class="text-[11px] text-slate-400 mt-1">
            ${exerciseCount} scheduled exercise doses · Created ${fmtDate(prog.created_at)}
          </p>
        </div>
        <div class="flex items-center gap-2 shrink-0">
          <button type="button" class="btn-prog-view btn-ghost text-xs py-1.5 px-2.5 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 flex items-center gap-1.5 transition-colors" title="Load in Builder">
            <svg class="h-3.5 w-3.5 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
            </svg>
            <span>View in Builder</span>
          </button>
          <button type="button" class="btn-prog-copy btn-ghost text-xs py-1.5 px-2.5 border border-indigo-500/30 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-500/20 flex items-center gap-1.5 transition-colors" title="Copy Table for Clinical Note">
            <svg class="h-3.5 w-3.5 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184" />
            </svg>
            <span>Copy Table</span>
          </button>
          <button type="button" class="btn-prog-pdf btn-ghost text-xs py-1.5 px-2.5 border border-rose-500/30 bg-rose-50 dark:bg-rose-500/10 text-rose-700 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-500/20 flex items-center gap-1.5 transition-colors" title="Export High-Contrast Patient Take-Home PDF">
            <svg class="h-3.5 w-3.5 text-rose-500" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
            </svg>
            <span>Export PDF</span>
          </button>
        </div>
      `;

      item.querySelector('.btn-prog-view')?.addEventListener('click', () => {
        closePatientProfile();
        switchView('programs');
        if (window.RehabBuilder) {
          window.RehabBuilder.loadProgramData(prog);
        }
      });

      item.querySelector('.btn-prog-copy')?.addEventListener('click', async (e) => {
        if (!window.RehabBuilder) return;
        const btn = e.currentTarget;
        const origText = btn.innerHTML;

        const progObj = {
          title: prog.title,
          duration_weeks: prog.duration_weeks,
          weeks: sched?.weeks || []
        };

        const tableHtml = window.RehabBuilder.generateExcelTableForProgram(progObj, 1);
        const plainFallback = window.RehabBuilder.formatProgramForSoapNote(progObj, 1);

        try {
          const blobHtml = new Blob([tableHtml], { type: 'text/html' });
          const blobText = new Blob([plainFallback], { type: 'text/plain' });
          const clipItem = new ClipboardItem({
            'text/html': blobHtml,
            'text/plain': blobText
          });
          await navigator.clipboard.write([clipItem]);
          btn.innerHTML = '<span>Table Copied!</span>';
          setTimeout(() => { btn.innerHTML = origText; }, 2000);
        } catch {
          await navigator.clipboard.writeText(plainFallback);
          btn.innerHTML = '<span>Text Copied!</span>';
          setTimeout(() => { btn.innerHTML = origText; }, 2000);
        }
      });

      item.querySelector('.btn-prog-pdf')?.addEventListener('click', async (e) => {
        if (!window.RehabBuilder) return;
        const btn = e.currentTarget;
        const origText = btn.innerHTML;
        btn.innerHTML = '<span>Exporting PDF…</span>';

        try {
          const patient = await window.api.patients.getById(patientId);
          const progObj = {
            title: prog.title,
            duration_weeks: prog.duration_weeks,
            weeks: sched?.weeks || []
          };
          const htmlContent = window.RehabBuilder.generatePatientPdfHtml(progObj, patient);
          const cleanName = (prog.title || 'Rehab_Routine').replace(/[^a-zA-Z0-9_-]/g, '_');
          const defaultFilename = `${cleanName}_Patient_Plan.pdf`;

          const result = await window.api.rehab.exportPdf(htmlContent, defaultFilename);
          if (result && result.success) {
            btn.innerHTML = '<span>PDF Saved!</span>';
            setTimeout(() => { btn.innerHTML = origText; }, 2500);
          } else {
            btn.innerHTML = origText;
          }
        } catch (err) {
          console.error('Error exporting patient PDF:', err);
          alert('Failed to export PDF: ' + err.message);
          btn.innerHTML = origText;
        }
      });

      container.appendChild(item);
    });
  } catch (err) {
    console.error('Error rendering patient rehab programs:', err);
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// DEDICATED EXERCISE & PROTOCOL LIBRARY HUB (VIEW: exercise-library)
// ═══════════════════════════════════════════════════════════════════════════

let exlibExercises = [];
let exlibProtocols = [];
let activeExLibTab = 'protocols';

function switchExerciseLibraryTab(tab) {
  activeExLibTab = tab;
  const tabProtocols = $('exlib-tab-protocols');
  const tabExercises = $('exlib-tab-exercises');
  const paneProtocols = $('exlib-pane-protocols');
  const paneExercises = $('exlib-pane-exercises');

  if (tab === 'protocols') {
    if (tabProtocols) tabProtocols.className = 'px-3.5 py-1.5 text-xs font-semibold rounded-md bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 shadow-sm transition-all cursor-pointer';
    if (tabExercises) tabExercises.className = 'px-3.5 py-1.5 text-xs font-medium rounded-md text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition-all cursor-pointer';
    if (paneProtocols) {
      paneProtocols.classList.remove('hidden', 'view-pane-hidden');
      paneProtocols.style.setProperty('display', 'flex', 'important');
      paneProtocols.style.setProperty('pointer-events', 'auto', 'important');
    }
    if (paneExercises) {
      paneExercises.classList.add('hidden', 'view-pane-hidden');
      paneExercises.style.setProperty('display', 'none', 'important');
      paneExercises.style.setProperty('pointer-events', 'none', 'important');
    }
    renderProtocolsGrid();
  } else {
    if (tabExercises) tabExercises.className = 'px-3.5 py-1.5 text-xs font-semibold rounded-md bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 shadow-sm transition-all cursor-pointer';
    if (tabProtocols) tabProtocols.className = 'px-3.5 py-1.5 text-xs font-medium rounded-md text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition-all cursor-pointer';
    if (paneExercises) {
      paneExercises.classList.remove('hidden', 'view-pane-hidden');
      paneExercises.style.setProperty('display', 'flex', 'important');
      paneExercises.style.setProperty('pointer-events', 'auto', 'important');
    }
    if (paneProtocols) {
      paneProtocols.classList.add('hidden', 'view-pane-hidden');
      paneProtocols.style.setProperty('display', 'none', 'important');
      paneProtocols.style.setProperty('pointer-events', 'none', 'important');
    }
    if (!exlibExercises || exlibExercises.length === 0) {
      loadExerciseLibraryHub();
    } else {
      renderExercisesTable();
    }
  }
}
window.switchExerciseLibraryTab = switchExerciseLibraryTab;

let exerciseCategoriesCache = [];

async function populateExerciseCategoryDropdowns() {
  try {
    if (!window.api?.rehab?.getCategories) return;
    const cats = await window.api.rehab.getCategories();
    if (!cats || !cats.length) return;
    exerciseCategoriesCache = cats;

    // 1. #exlib-cat
    const exlibCat = $('exlib-cat');
    if (exlibCat) {
      const currentVal = exlibCat.value || 'All';
      exlibCat.innerHTML = `<option value="All">All Categories (${cats.length})</option>` +
        cats.map(c => `<option value="${escapeHtml(c)}">${escapeHtml(c)}</option>`).join('');
      exlibCat.value = cats.includes(currentVal) ? currentVal : 'All';
    }

    // 2. #edit-ex-cat
    const editExCat = $('edit-ex-cat');
    if (editExCat) {
      const currentVal = editExCat.value || cats[0];
      editExCat.innerHTML = cats.map(c => `<option value="${escapeHtml(c)}">${escapeHtml(c)}</option>`).join('') +
        `<option value="__NEW__">+ New Category...</option>`;
      if (cats.includes(currentVal)) {
        editExCat.value = currentVal;
      } else if (cats.length > 0) {
        editExCat.value = cats[0];
      }
    }
  } catch (err) {
    console.error('[ExLib] Failed to populate exercise categories:', err);
  }
}

function initExerciseLibraryHub() {
  const tabProtocols = $('exlib-tab-protocols');
  const tabExercises = $('exlib-tab-exercises');

  tabProtocols?.addEventListener('click', () => switchExerciseLibraryTab('protocols'));
  tabExercises?.addEventListener('click', () => switchExerciseLibraryTab('exercises'));

  // Pre-load dynamic categories
  populateExerciseCategoryDropdowns();

  // Dynamic Category Creation Toggles
  $('btn-toggle-new-ex-cat')?.addEventListener('click', () => {
    $('edit-ex-cat-select-wrap')?.classList.add('hidden');
    $('edit-ex-cat-custom-wrap')?.classList.remove('hidden');
    $('edit-ex-custom-cat')?.focus();
  });

  $('btn-cancel-custom-ex-cat')?.addEventListener('click', () => {
    $('edit-ex-cat-custom-wrap')?.classList.add('hidden');
    $('edit-ex-cat-select-wrap')?.classList.remove('hidden');
    const editExCat = $('edit-ex-cat');
    if (editExCat && editExCat.value === '__NEW__') {
      editExCat.selectedIndex = 0;
    }
  });

  $('edit-ex-cat')?.addEventListener('change', (e) => {
    if (e.target.value === '__NEW__') {
      $('edit-ex-cat-select-wrap')?.classList.add('hidden');
      $('edit-ex-cat-custom-wrap')?.classList.remove('hidden');
      $('edit-ex-custom-cat')?.focus();
    }
  });

  // Filter & Search listeners for Exercises tab
  $('exlib-search')?.addEventListener('input', debounce(renderExercisesTable, 150));
  $('exlib-cat')?.addEventListener('change', renderExercisesTable);

  // New Exercise button
  $('exlib-btn-new-exercise')?.addEventListener('click', () => openEditExerciseModal(null));

  // New Protocol Template button
  $('btn-new-protocol-template')?.addEventListener('click', openNewProtocolModal);

  // Protocol template modal wiring
  $('btn-close-proto-modal')?.addEventListener('click', closeNewProtocolModal);
  $('btn-cancel-proto-modal')?.addEventListener('click', closeNewProtocolModal);
  $('btn-submit-proto-modal')?.addEventListener('click', (e) => {
    e.preventDefault();
    handleProtocolTemplateSubmit(e);
  });
  $('modal-edit-protocol-template')?.addEventListener('click', (e) => {
    if (e.target.id === 'modal-edit-protocol-template') closeNewProtocolModal();
  });
  $('form-edit-protocol-template')?.addEventListener('submit', handleProtocolTemplateSubmit);

  // Exercise modal wiring
  $('btn-close-edit-ex')?.addEventListener('click', closeEditExerciseModal);
  $('btn-cancel-edit-ex')?.addEventListener('click', closeEditExerciseModal);
  $('form-edit-exercise')?.addEventListener('submit', handleExerciseFormSubmit);
}

async function loadExerciseLibraryHub() {
  try {
    await populateExerciseCategoryDropdowns();
    exlibProtocols = await window.api.rehab.listTemplates();
    exlibExercises = await window.api.rehab.listExercises();

    if (activeExLibTab === 'protocols') {
      renderProtocolsGrid();
    } else {
      renderExercisesTable();
    }
  } catch (err) {
    console.error('[ExLib] Error loading data:', err);
  }
}

// ── Tab 1: Multi-Week Protocols Renderer ─────────────────────────────────────
function renderProtocolsGrid() {
  const grid = $('exlib-protocols-grid');
  if (!grid) return;
  grid.innerHTML = '';

  if (!exlibProtocols || exlibProtocols.length === 0) {
    grid.innerHTML = `
      <div class="col-span-full py-16 text-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl bg-white/40 dark:bg-slate-900/30 p-8 space-y-3">
        <svg class="h-10 w-10 mx-auto text-slate-300 dark:text-slate-700" fill="none" viewBox="0 0 24 24" stroke-width="1.2" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
        </svg>
        <p class="text-sm font-semibold text-slate-700 dark:text-slate-300">No Multi-Week Protocols Stored</p>
        <p class="text-xs text-slate-400 max-w-sm mx-auto">Build verified clinical protocols from scratch tailored to your practice standards.</p>
        <button type="button" onclick="document.getElementById('btn-new-protocol-template').click()" class="btn-primary text-xs py-2 px-3.5 shadow-sm inline-flex items-center gap-1.5">
          <svg class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          <span>Create First Protocol Template</span>
        </button>
      </div>
    `;
    return;
  }

  exlibProtocols.forEach(tmpl => {
    const card = document.createElement('div');
    card.className = 'card p-4 flex flex-col justify-between hover:border-slate-300 dark:hover:border-slate-700 transition-all shadow-sm space-y-3';

    let exerciseCount = 0;
    try {
      const proto = typeof tmpl.protocol_json === 'string' ? JSON.parse(tmpl.protocol_json) : tmpl.protocol_json;
      if (proto && proto.weeks) {
        proto.weeks.forEach(w => {
          if (w.days) {
            Object.values(w.days).forEach(arr => {
              exerciseCount += (arr || []).length;
            });
          }
        });
      }
    } catch (_) {}

    card.innerHTML = `
      <div class="space-y-2">
        <div class="flex items-start justify-between gap-2">
          <h3 class="text-xs font-bold text-slate-900 dark:text-slate-100 line-clamp-1">${escapeHtml(tmpl.name)}</h3>
          <span class="inline-flex px-2 py-0.5 text-[10px] uppercase font-semibold rounded-md bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-500/30 shrink-0">
            ${tmpl.duration_weeks || 4}w
          </span>
        </div>
        <div class="flex items-center gap-2 text-[11px] text-slate-400">
          <span class="font-medium text-slate-600 dark:text-slate-300">${escapeHtml(tmpl.category || 'General Rehab')}</span>
          <span>·</span>
          <span>${exerciseCount} total movement doses</span>
        </div>
      </div>
      <div class="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
        <button type="button" class="btn-proto-open btn-primary !py-1 !px-2.5 !text-[11px] shadow-sm flex items-center gap-1">
          <span>Open in Builder</span>
        </button>
        <div class="flex items-center gap-1">
          <button type="button" class="btn-proto-dup btn-ghost !py-1 !px-2 !text-[11px] text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400">
            Duplicate
          </button>
          <button type="button" class="btn-proto-del btn-ghost !py-1 !px-2 !text-[11px] text-rose-500 hover:text-rose-600">
            Delete
          </button>
        </div>
      </div>
    `;

    card.querySelector('.btn-proto-open')?.addEventListener('click', () => {
      switchView('programs');
      if (window.RehabBuilder) {
        window.RehabBuilder.loadProgramData(tmpl);
      }
    });

    card.querySelector('.btn-proto-dup')?.addEventListener('click', async () => {
      try {
        const payload = {
          name: `Copy of ${tmpl.name}`,
          category: tmpl.category,
          duration_weeks: tmpl.duration_weeks,
          protocol_json: tmpl.protocol_json
        };
        await window.api.rehab.saveTemplate(payload);
        await loadExerciseLibraryHub();
      } catch (err) {
        alert('Failed to duplicate template: ' + err.message);
      }
    });

    card.querySelector('.btn-proto-del')?.addEventListener('click', async () => {
      if (confirm(`Delete protocol template "${tmpl.name}"?`)) {
        try {
          await window.api.rehab.deleteTemplate(tmpl.id);
          await loadExerciseLibraryHub();
        } catch (err) {
          alert('Failed to delete template: ' + err.message);
        }
      }
    });

    grid.appendChild(card);
  });
}

function openNewProtocolModal() {
  const modal = $('modal-edit-protocol-template');
  if (!modal) return;
  $('edit-proto-id').value = '';
  $('edit-proto-name').value = '';
  $('edit-proto-cat').value = 'Knee & Quad';
  $('edit-proto-duration').value = '4';

  modal.classList.remove('hidden', 'opacity-0', 'pointer-events-none');
  modal.classList.add('flex', 'opacity-100', 'pointer-events-auto');
  modal.style.setProperty('display', 'flex', 'important');
  modal.style.setProperty('pointer-events', 'auto', 'important');
  modal.setAttribute('aria-hidden', 'false');

  document.body.classList.add('modal-open');
  setTimeout(() => $('edit-proto-name')?.focus(), 50);
}

function closeNewProtocolModal() {
  const modal = $('modal-edit-protocol-template');
  if (modal) {
    modal.classList.add('hidden', 'opacity-0', 'pointer-events-none');
    modal.classList.remove('flex', 'opacity-100', 'pointer-events-auto');
    modal.style.setProperty('display', 'none', 'important');
    modal.style.setProperty('pointer-events', 'none', 'important');
    modal.setAttribute('aria-hidden', 'true');
  }
  document.body.classList.remove('modal-open');
}

async function handleProtocolTemplateSubmit(e) {
  if (e) e.preventDefault();
  const name = $('edit-proto-name')?.value?.trim();
  const category = $('edit-proto-cat')?.value || 'Knee & Quad';
  const duration_weeks = parseInt($('edit-proto-duration')?.value, 10) || 4;

  if (!name) {
    alert('Please enter a protocol name.');
    $('edit-proto-name')?.focus();
    return;
  }

  const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const weeks = [];
  for (let w = 1; w <= duration_weeks; w++) {
    const daysObj = {};
    DAYS.forEach(d => { daysObj[d] = []; });
    weeks.push({
      week_num: w,
      title: `Week ${w}`,
      focus: 'Phase Progression & Tissue Capacity',
      days: daysObj
    });
  }

  const payload = {
    name,
    category,
    duration_weeks,
    protocol_json: JSON.stringify({
      title: name,
      duration_weeks,
      weeks
    })
  };

  try {
    const saved = await window.api.rehab.saveTemplate(payload);
    closeNewProtocolModal();
    navigateTo('programs');
    if (window.RehabBuilder) {
      window.RehabBuilder.loadProgramData(saved);
    }
  } catch (err) {
    alert('Failed to create protocol template: ' + err.message);
  }
}

// ── Tab 2: Individual Exercise Database Renderer ─────────────────────────────
function renderExercisesTable() {
  const tbody = $('exlib-table-body');
  const countBadge = $('exlib-count-badge');
  if (!tbody) return;

  const searchVal = ($('exlib-search')?.value || '').toLowerCase().trim();
  const catVal = $('exlib-cat')?.value || 'All';

  const filtered = exlibExercises.filter(ex => {
    if (catVal !== 'All') {
      const normCat = (ex.category || '').toLowerCase().replace(/quadriceps/g, 'quad').replace(/hamstrings/g, 'hamstring');
      const normVal = catVal.toLowerCase().replace(/quadriceps/g, 'quad').replace(/hamstrings/g, 'hamstring');
      if (normCat !== normVal && !normCat.includes(normVal) && !normVal.includes(normCat)) return false;
    }
    if (searchVal) {
      return (ex.name && ex.name.toLowerCase().includes(searchVal)) ||
             (ex.cues && ex.cues.toLowerCase().includes(searchVal)) ||
             (ex.category && ex.category.toLowerCase().includes(searchVal));
    }
    return true;
  });

  if (countBadge) {
    countBadge.textContent = `${filtered.length} of ${exlibExercises.length} exercises`;
  }

  tbody.innerHTML = '';

  if (filtered.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="6" class="p-8 text-center text-slate-400 dark:text-slate-500 italic">
          No matching exercises found.
        </td>
      </tr>`;
    return;
  }

  filtered.forEach(ex => {
    const tr = document.createElement('tr');
    tr.className = 'hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors';

    tr.innerHTML = `
      <td class="py-2.5 px-4 font-semibold text-slate-900 dark:text-slate-100">${escapeHtml(ex.name)}</td>
      <td class="py-2.5 px-4">
        <span class="inline-flex px-2 py-0.5 text-[10px] uppercase font-semibold rounded-md bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-500/30">
          ${escapeHtml(ex.category || 'General')}
        </span>
      </td>
      <td class="py-2.5 px-4 font-mono text-center">${ex.default_sets || 3}</td>
      <td class="py-2.5 px-4 font-mono text-center">${escapeHtml(ex.default_reps || '10')}</td>
      <td class="py-2.5 px-4 max-w-xs truncate text-slate-500 dark:text-slate-400">${escapeHtml(ex.cues || '—')}</td>
      <td class="py-2.5 px-4 text-right space-x-1 whitespace-nowrap">
        <button type="button" data-action="edit-exercise" data-id="${ex.id}" class="btn-ex-edit btn-ghost !py-1 !px-2 text-xs text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer">Edit</button>
        <button type="button" data-action="delete-exercise" data-id="${ex.id}" class="btn-ex-del btn-ghost !py-1 !px-2 text-xs text-rose-500 hover:underline cursor-pointer">Delete</button>
      </td>
    `;

    tr.querySelector('.btn-ex-edit')?.addEventListener('click', () => openEditExerciseModal(ex));
    tr.querySelector('.btn-ex-del')?.addEventListener('click', async () => {
      if (confirm(`Delete "${ex.name}" from the exercise database?`)) {
        try {
          await window.api.rehab.deleteExercise(ex.id);
          await loadExerciseLibraryHub();
        } catch (err) {
          alert('Failed to delete exercise: ' + err.message);
        }
      }
    });

    tbody.appendChild(tr);
  });
}

function openEditExerciseModal(exercise = null) {
  const modal = $('modal-edit-exercise');
  const title = $('modal-edit-ex-title');
  if (!modal) return;

  $('edit-ex-cat-custom-wrap')?.classList.add('hidden');
  $('edit-ex-cat-select-wrap')?.classList.remove('hidden');
  if ($('edit-ex-custom-cat')) $('edit-ex-custom-cat').value = '';

  const editExCat = $('edit-ex-cat');
  if (editExCat) {
    const cats = [...exerciseCategoriesCache];
    if (exercise && exercise.category && !cats.includes(exercise.category)) {
      cats.push(exercise.category);
    }
    editExCat.innerHTML = cats.map(c => `<option value="${escapeHtml(c)}">${escapeHtml(c)}</option>`).join('') +
      `<option value="__NEW__">+ New Category...</option>`;
    if (exercise && exercise.category) {
      editExCat.value = exercise.category;
    } else if (cats.length > 0) {
      editExCat.value = cats[0];
    }
  }

  const defaultCat = exerciseCategoriesCache[0] || 'Knee & Quad';
  $('edit-ex-id').value = exercise ? exercise.id : '';
  $('edit-ex-name').value = exercise ? exercise.name : '';
  $('edit-ex-sets').value = exercise ? (exercise.default_sets || 3) : 3;
  $('edit-ex-reps').value = exercise ? (exercise.default_reps || '10-12') : '10-12';
  $('edit-ex-cues').value = exercise ? (exercise.cues || '') : '';

  if (title) {
    title.textContent = exercise ? 'Edit Exercise Movement' : 'Add New Exercise Movement';
  }

  modal.classList.remove('hidden', 'opacity-0', 'pointer-events-none');
  modal.classList.add('flex', 'opacity-100', 'pointer-events-auto');
  modal.style.setProperty('display', 'flex', 'important');
  modal.style.setProperty('pointer-events', 'auto', 'important');
  modal.setAttribute('aria-hidden', 'false');

  document.body.classList.add('modal-open');
  setTimeout(() => $('edit-ex-name')?.focus(), 50);
}

function closeEditExerciseModal() {
  const modal = $('modal-edit-exercise');
  if (modal) {
    modal.classList.add('hidden', 'opacity-0', 'pointer-events-none');
    modal.classList.remove('flex', 'opacity-100', 'pointer-events-auto');
    modal.style.setProperty('display', 'none', 'important');
    modal.style.setProperty('pointer-events', 'none', 'important');
    modal.setAttribute('aria-hidden', 'true');
  }
  document.body.classList.remove('modal-open');
}

async function handleExerciseFormSubmit(e) {
  e.preventDefault();
  const id = $('edit-ex-id')?.value;
  const name = $('edit-ex-name')?.value?.trim();
  let category = $('edit-ex-cat')?.value;
  const customCategory = $('edit-ex-custom-cat')?.value?.trim();
  const isCustomVisible = !$('edit-ex-cat-custom-wrap')?.classList.contains('hidden');

  if ((isCustomVisible && customCategory) || category === '__NEW__') {
    category = customCategory || 'General';
  }

  const default_sets = parseInt($('edit-ex-sets')?.value, 10) || 3;
  const default_reps = $('edit-ex-reps')?.value?.trim() || '10';
  const cues = $('edit-ex-cues')?.value?.trim() || '';

  if (!name) return;
  const payload = { name, category, default_sets, default_reps, cues };

  try {
    if (id) {
      await window.api.rehab.updateExercise(Number(id), payload);
    } else {
      await window.api.rehab.createExercise(payload);
    }
    closeEditExerciseModal();
    await populateExerciseCategoryDropdowns();
    await loadExerciseLibraryHub();
  } catch (err) {
    alert('Failed to save exercise: ' + err.message);
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// PHASE 8: INVOICING & BILLING LEDGER, SETTINGS, AND LOCAL PDF ENGINE
// ═══════════════════════════════════════════════════════════════════════════

let currentInvoiceFilter = { status: 'All', search: '' };
let currentInvoiceLineItems = [];
let clinicSettingsCache = {};

function formatCurrency(amount) {
  const symbol = clinicSettingsCache.currency_symbol || '$';
  return symbol + Number(amount || 0).toFixed(2);
}

function formatDateLocal(isoDateStr) {
  if (!isoDateStr) return '—';
  try {
    const d = new Date(isoDateStr);
    if (isNaN(d.getTime())) return isoDateStr;
    return d.toLocaleDateString('en-AU', { day: '2-digit', month: 'short', year: 'numeric' });
  } catch (_) {
    return isoDateStr;
  }
}

// ── Invoicing Ledger Controller ─────────────────────────────────────────────

async function loadInvoicingLedger(filter = {}) {
  if (filter.status !== undefined) currentInvoiceFilter.status = filter.status;
  if (filter.search !== undefined) currentInvoiceFilter.search = filter.search;

  try {
    // 1. Fetch practice settings to ensure cache is warm
    if (window.api?.settings) {
      clinicSettingsCache = await window.api.settings.getAll() || {};
    }

    // 2. Fetch stats
    const stats = await window.api.invoices.getStats();
    if (stats) {
      if ($('inv-stat-total')) $('inv-stat-total').textContent = formatCurrency(stats.total_invoiced);
      if ($('inv-stat-paid')) $('inv-stat-paid').textContent = formatCurrency(stats.total_paid);
      if ($('inv-stat-pending')) $('inv-stat-pending').textContent = formatCurrency(stats.total_pending);
      if ($('inv-stat-overdue')) $('inv-stat-overdue').textContent = formatCurrency(stats.total_overdue);
      if ($('inv-stat-count')) $('inv-stat-count').textContent = `${stats.total_count} ${stats.total_count === 1 ? 'invoice' : 'invoices'} recorded`;
    }

    // 3. Fetch filtered invoices list
    const rows = await window.api.invoices.list(currentInvoiceFilter);
    const tbody = $('inv-table-body');
    const emptyState = $('inv-empty-state');
    if (!tbody) return;

    if (!rows || rows.length === 0) {
      tbody.innerHTML = '';
      if (emptyState) emptyState.classList.remove('hidden');
      return;
    }

    if (emptyState) emptyState.classList.add('hidden');
    tbody.innerHTML = rows.map(inv => {
      const isOverdue = inv.status === 'Overdue' || (inv.status === 'Pending' && new Date(inv.due_date) < new Date());
      let badgeCls = 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300';
      if (inv.status === 'Paid') {
        badgeCls = 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/30';
      } else if (inv.status === 'Pending' && !isOverdue) {
        badgeCls = 'bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-500/30';
      } else if (isOverdue) {
        badgeCls = 'bg-rose-50 dark:bg-rose-500/10 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-500/30';
      }

      const displayStatus = (inv.status === 'Pending' && isOverdue) ? 'Overdue' : inv.status;
      const patientFullName = `${escapeHtml(inv.first_name)} ${escapeHtml(inv.last_name)}`;
      const issueFmt = formatDateLocal(inv.issue_date);
      const dueFmt = formatDateLocal(inv.due_date);

      return `
        <tr class="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors">
          <td class="py-3 px-4 font-mono font-semibold text-indigo-600 dark:text-indigo-400">
            ${escapeHtml(inv.invoice_number)}
          </td>
          <td class="py-3 px-4">
            <div class="font-medium text-slate-900 dark:text-slate-100">${patientFullName}</div>
            <div class="text-[10px] text-slate-400">${escapeHtml(inv.phone || inv.email || 'No contact')}</div>
          </td>
          <td class="py-3 px-4 text-slate-600 dark:text-slate-400 whitespace-nowrap">
            ${issueFmt}
          </td>
          <td class="py-3 px-4 whitespace-nowrap">
            <span class="${isOverdue && inv.status !== 'Paid' ? 'text-rose-600 dark:text-rose-400 font-semibold' : 'text-slate-600 dark:text-slate-400'}">
              ${dueFmt}
            </span>
          </td>
          <td class="py-3 px-4 max-w-xs truncate text-slate-600 dark:text-slate-400">
            <span class="font-medium text-slate-800 dark:text-slate-200">${inv.item_count} ${inv.item_count === 1 ? 'item' : 'items'}</span>
            ${inv.notes ? `<span class="text-[11px] text-slate-400 block truncate">${escapeHtml(inv.notes)}</span>` : ''}
          </td>
          <td class="py-3 px-4 text-right font-mono font-bold text-slate-900 dark:text-slate-100">
            ${formatCurrency(inv.total)}
          </td>
          <td class="py-3 px-4 text-center">
            <span class="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold ${badgeCls}">
              ${displayStatus}
            </span>
          </td>
          <td class="py-3 px-4 text-right">
            <div class="inline-flex items-center justify-end gap-1.5">
              <button type="button" class="btn-ghost text-xs py-1 px-2 border border-slate-200 dark:border-slate-700 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 flex items-center gap-1 cursor-pointer"
                      title="Export Official PDF Receipt" onclick="exportInvoiceReceipt(${inv.id})">
                <svg class="h-3.5 w-3.5 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9Z" />
                </svg>
                <span class="pointer-events-none">PDF</span>
              </button>
              <button type="button" class="btn-ghost text-xs py-1 px-2 border border-slate-200 dark:border-slate-700 text-sky-600 dark:text-sky-400 hover:bg-sky-50 dark:hover:bg-sky-500/10 flex items-center gap-1 cursor-pointer"
                      title="Email Invoice to Patient" onclick="emailInvoiceReceipt(${inv.id})">
                <svg class="h-3.5 w-3.5 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                </svg>
                <span class="pointer-events-none">Email</span>
              </button>
              ${inv.status !== 'Paid' ? `
                <button type="button" class="btn-ghost text-xs py-1 px-2 border border-slate-200 dark:border-slate-700 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 cursor-pointer"
                        title="Mark Paid" onclick="updateInvoiceStatus(${inv.id}, 'Paid')">
                  ✓ Paid
                </button>
              ` : `
                <button type="button" class="btn-ghost text-xs py-1 px-2 border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                        title="Mark Pending" onclick="updateInvoiceStatus(${inv.id}, 'Pending')">
                  Revert
                </button>
              `}
              <button type="button" class="btn-ghost text-xs py-1 px-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded cursor-pointer"
                      title="Delete Invoice" onclick="deleteInvoice(${inv.id})">
                <svg class="h-3.5 w-3.5 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                </svg>
              </button>
            </div>
          </td>
        </tr>
      `;
    }).join('');

  } catch (err) {
    console.error('[Invoicing] Failed to load ledger:', err);
  }
}

async function updateInvoiceStatus(id, newStatus) {
  try {
    await window.api.invoices.update(id, { status: newStatus });
    await loadInvoicingLedger();
  } catch (err) {
    alert('Failed to update invoice status: ' + err.message);
  }
}

async function deleteInvoice(id) {
  if (!confirm('Are you sure you want to permanently delete this invoice record?')) return;
  try {
    await window.api.invoices.delete(id);
    await loadInvoicingLedger();
  } catch (err) {
    alert('Failed to delete invoice: ' + err.message);
  }
}

window.updateInvoiceStatus = updateInvoiceStatus;
window.deleteInvoice = deleteInvoice;

async function populateInvoicePatientSelect(selectedId = null) {
  const sel = $('inv-form-patient');
  if (!sel) return;
  try {
    const patients = await window.api.patients.list();
    sel.innerHTML = '<option value="">Select a patient...</option>' +
      (patients || []).map(p => `
        <option value="${p.id}" ${selectedId && Number(selectedId) === p.id ? 'selected' : ''}>
          ${escapeHtml(p.last_name)}, ${escapeHtml(p.first_name)} (${escapeHtml(p.phone || p.email || 'ID: ' + p.id)})
        </option>
      `).join('');
  } catch (err) {
    console.warn('[Invoicing] Failed to load patients list:', err);
  }
}

function openInvoiceDrawer(presetPatientId = null) {
  const drawer = $('drawer-invoice');
  const backdrop = $('drawer-invoice-backdrop');
  if (!drawer || !backdrop) return;

  populateInvoicePatientSelect(presetPatientId);

  // Set default dates
  const today = new Date().toISOString().slice(0, 10);
  const due = new Date(Date.now() + 14 * 86400000).toISOString().slice(0, 10);
  if ($('inv-form-issue-date')) $('inv-form-issue-date').value = today;
  if ($('inv-form-due-date')) $('inv-form-due-date').value = due;
  if ($('inv-form-status')) $('inv-form-status').value = 'Pending';
  if ($('inv-form-payment-method')) $('inv-form-payment-method').value = 'Credit/Debit Card';
  if ($('inv-form-notes')) $('inv-form-notes').value = '';

  const initFee = parseFloat(clinicSettingsCache.fee_initial) || 140.0;
  const taxRate = parseFloat(clinicSettingsCache.tax_rate) !== undefined ? parseFloat(clinicSettingsCache.tax_rate) : 10.0;
  if ($('inv-form-tax-rate')) $('inv-form-tax-rate').value = taxRate;

  currentInvoiceLineItems = [
    { description: 'Initial Comprehensive MSK Assessment (60 min)', quantity: 1, unit_price: initFee }
  ];
  renderInvoiceLineItems();
  recalculateInvoiceTotals();

  drawer.classList.remove('hidden');
  backdrop.classList.remove('hidden');
  drawer.style.setProperty('display', 'flex', 'important');
  drawer.style.setProperty('pointer-events', 'auto', 'important');
  backdrop.style.setProperty('display', 'block', 'important');
  backdrop.style.setProperty('pointer-events', 'auto', 'important');
}

function closeInvoiceDrawer() {
  const drawer = $('drawer-invoice');
  const backdrop = $('drawer-invoice-backdrop');
  if (drawer) {
    drawer.classList.add('hidden');
    drawer.style.setProperty('display', 'none', 'important');
    drawer.style.setProperty('pointer-events', 'none', 'important');
  }
  if (backdrop) {
    backdrop.classList.add('hidden');
    backdrop.style.setProperty('display', 'none', 'important');
    backdrop.style.setProperty('pointer-events', 'none', 'important');
  }
}

window.openInvoiceDrawer = openInvoiceDrawer;
window.closeInvoiceDrawer = closeInvoiceDrawer;

function renderInvoiceLineItems() {
  const container = $('inv-form-items-container');
  if (!container) return;

  if (currentInvoiceLineItems.length === 0) {
    container.innerHTML = `
      <div class="text-center py-4 text-slate-400 bg-slate-50 dark:bg-slate-800/40 rounded-lg border border-dashed border-slate-300 dark:border-slate-700">
        No billable line items added yet. Click "+ Add Line Item" or choose a preset above.
      </div>
    `;
    return;
  }

  container.innerHTML = currentInvoiceLineItems.map((item, idx) => `
    <div class="flex items-center gap-2 p-2 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700">
      <div class="flex-1 min-w-0">
        <input type="text" placeholder="Service description..." value="${escapeHtml(item.description || '')}"
               class="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded px-2.5 py-1.5 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:border-indigo-500"
               onchange="updateInvoiceLineItem(${idx}, 'description', this.value)" />
      </div>
      <div class="w-16">
        <input type="number" min="1" max="99" value="${item.quantity || 1}" title="Quantity"
               class="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded px-2 py-1.5 text-xs text-center text-slate-900 dark:text-slate-100 focus:outline-none focus:border-indigo-500 font-mono"
               onchange="updateInvoiceLineItem(${idx}, 'quantity', this.value)" />
      </div>
      <div class="w-24">
        <input type="number" min="0" step="1" value="${item.unit_price !== undefined ? item.unit_price : 0}" title="Unit Price ($)"
               class="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded px-2 py-1.5 text-xs text-right text-slate-900 dark:text-slate-100 focus:outline-none focus:border-indigo-500 font-mono"
               onchange="updateInvoiceLineItem(${idx}, 'unit_price', this.value)" />
      </div>
      <div class="w-20 text-right font-mono font-semibold text-xs text-slate-800 dark:text-slate-200 select-none">
        ${formatCurrency((Number(item.quantity) || 1) * (Number(item.unit_price) || 0))}
      </div>
      <button type="button" class="btn-icon text-slate-400 hover:text-rose-500 cursor-pointer" title="Remove line item"
              onclick="removeInvoiceLineItem(${idx})">
        <svg class="h-4 w-4 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  `).join('');
}

function updateInvoiceLineItem(index, field, value) {
  if (!currentInvoiceLineItems[index]) return;
  if (field === 'quantity') currentInvoiceLineItems[index].quantity = Math.max(1, parseInt(value) || 1);
  else if (field === 'unit_price') currentInvoiceLineItems[index].unit_price = Math.max(0, parseFloat(value) || 0);
  else currentInvoiceLineItems[index].description = String(value || '');
  renderInvoiceLineItems();
  recalculateInvoiceTotals();
}

function removeInvoiceLineItem(index) {
  currentInvoiceLineItems.splice(index, 1);
  renderInvoiceLineItems();
  recalculateInvoiceTotals();
}

function recalculateInvoiceTotals() {
  const subtotal = currentInvoiceLineItems.reduce((acc, it) => {
    return acc + ((Number(it.quantity) || 1) * (Number(it.unit_price) || 0));
  }, 0);

  const taxRate = parseFloat($('inv-form-tax-rate')?.value) || 0;
  const taxAmount = (subtotal * taxRate) / 100;
  const total = subtotal + taxAmount;

  if ($('inv-calc-subtotal')) $('inv-calc-subtotal').textContent = formatCurrency(subtotal);
  if ($('inv-calc-tax')) $('inv-calc-tax').textContent = formatCurrency(taxAmount);
  if ($('inv-calc-total')) $('inv-calc-total').textContent = formatCurrency(total);
}

window.updateInvoiceLineItem = updateInvoiceLineItem;
window.removeInvoiceLineItem = removeInvoiceLineItem;

function initInvoicingLedger() {
  // 1. Status Filter Tabs
  document.querySelectorAll('.inv-tab-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      document.querySelectorAll('.inv-tab-btn').forEach(b => {
        b.className = 'inv-tab-btn px-3 py-1.5 rounded-md font-medium transition-colors cursor-pointer select-none text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200';
      });
      btn.className = 'inv-tab-btn px-3 py-1.5 rounded-md font-medium transition-colors cursor-pointer select-none bg-indigo-50 dark:bg-indigo-500/15 text-indigo-700 dark:text-indigo-400';
      loadInvoicingLedger({ status: btn.dataset.status });
    });
  });

  // 2. Search Debounce
  let searchDebounce = null;
  $('inv-search-input')?.addEventListener('input', (e) => {
    clearTimeout(searchDebounce);
    searchDebounce = setTimeout(() => {
      loadInvoicingLedger({ search: e.target.value.trim() });
    }, 250);
  });

  // 3. New Invoice Drawer Triggers
  $('btn-create-invoice')?.addEventListener('click', () => openInvoiceDrawer());
  $('btn-close-invoice-drawer')?.addEventListener('click', closeInvoiceDrawer);
  $('btn-cancel-invoice')?.addEventListener('click', closeInvoiceDrawer);
  $('drawer-invoice-backdrop')?.addEventListener('click', closeInvoiceDrawer);

  // 4. Quick Fee Presets
  $('btn-quick-add-initial')?.addEventListener('click', () => {
    const fee = parseFloat(clinicSettingsCache.fee_initial) || 140.0;
    currentInvoiceLineItems.push({
      description: 'Initial Comprehensive MSK Assessment (60 min)',
      quantity: 1,
      unit_price: fee
    });
    renderInvoiceLineItems();
    recalculateInvoiceTotals();
  });

  $('btn-quick-add-followup')?.addEventListener('click', () => {
    const fee = parseFloat(clinicSettingsCache.fee_followup) || 95.0;
    currentInvoiceLineItems.push({
      description: 'Subsequent Treatment Consultation (30 min)',
      quantity: 1,
      unit_price: fee
    });
    renderInvoiceLineItems();
    recalculateInvoiceTotals();
  });

  // 5. Add Line Item Button
  $('btn-add-line-item')?.addEventListener('click', () => {
    currentInvoiceLineItems.push({
      description: '',
      quantity: 1,
      unit_price: 50.0
    });
    renderInvoiceLineItems();
    recalculateInvoiceTotals();
  });

  // 6. Tax Rate Change
  $('inv-form-tax-rate')?.addEventListener('input', recalculateInvoiceTotals);

  // 7. Form Submit
  $('form-new-invoice')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const patId = $('inv-form-patient')?.value;
    if (!patId) {
      alert('Please select a patient for this invoice.');
      return;
    }
    if (currentInvoiceLineItems.length === 0) {
      alert('Please add at least one line item to the invoice.');
      return;
    }

    const subtotal = currentInvoiceLineItems.reduce((acc, it) => {
      return acc + ((Number(it.quantity) || 1) * (Number(it.unit_price) || 0));
    }, 0);
    const taxRate = parseFloat($('inv-form-tax-rate')?.value) || 0;
    const taxAmount = (subtotal * taxRate) / 100;
    const total = subtotal + taxAmount;

    const payload = {
      patient_id: Number(patId),
      issue_date: $('inv-form-issue-date')?.value || new Date().toISOString().slice(0, 10),
      due_date: $('inv-form-due-date')?.value || new Date().toISOString().slice(0, 10),
      status: $('inv-form-status')?.value || 'Pending',
      payment_method: $('inv-form-payment-method')?.value || 'Credit/Debit Card',
      notes: $('inv-form-notes')?.value?.trim() || null,
      subtotal,
      tax_rate: taxRate,
      tax_amount: taxAmount,
      total,
      items: currentInvoiceLineItems
    };

    try {
      await window.api.invoices.create(payload);
      closeInvoiceDrawer();
      await loadInvoicingLedger();
    } catch (err) {
      alert('Failed to create invoice: ' + err.message);
    }
  });
}

// ── Local PDF Export Engine (Phase 8) ───────────────────────────────────────
const lastGeneratedInvoicePdfs = {};
const lastGeneratedDischargePdfs = {};

async function exportInvoiceReceipt(invoiceId) {
  try {
    const inv = await window.api.invoices.getById(invoiceId);
    if (!inv) throw new Error('Invoice not found.');
    const settings = await window.api.settings.getAll() || {};
    let branding = null;
    try {
      if (window.api?.branding) branding = await window.api.branding.get();
    } catch (_) {}
    const logoBase64 = branding?.logoBase64 || null;

    const clinicName = escapeHtml(settings.clinic_name || 'Antigravity Sports & Orthopaedic Physiotherapy');
    const clinicPhone = escapeHtml(settings.clinic_phone || '+61 (02) 9876 5432');
    const clinicEmail = escapeHtml(settings.clinic_email || 'reception@antigravityphysio.com.au');
    const clinicAddress = escapeHtml(settings.clinic_address || 'Suite 402, 100 Medical Centre Way, Sydney NSW 2000');
    const clinicAbn = escapeHtml(settings.clinic_abn || 'ABN 88 123 456 789');

    const pracName = escapeHtml(settings.practitioner_name || 'Dr. Sarah Jenkins, PT, DPT, OCS');
    const pracTitle = escapeHtml(settings.practitioner_title || 'Senior Orthopaedic Physiotherapist');
    const provNumber = escapeHtml(settings.provider_number || 'PRV-8829103A');
    const regNumber = escapeHtml(settings.reg_number || 'AHPRA-PHY00019283');

    const patientName = `${escapeHtml(inv.first_name)} ${escapeHtml(inv.last_name)}`;
    const patientContact = escapeHtml(inv.phone || inv.email || '—');
    const patientAddress = escapeHtml(inv.address || '—');
    const symbol = escapeHtml(settings.currency_symbol || '$');

    const isPaid = inv.status === 'Paid';
    const statusBg = isPaid ? '#ecfdf5' : (inv.status === 'Overdue' ? '#fff1f2' : '#fffbeb');
    const statusText = isPaid ? '#059669' : (inv.status === 'Overdue' ? '#e11d48' : '#d97706');
    const statusBorder = isPaid ? '#a7f3d0' : (inv.status === 'Overdue' ? '#fecdd3' : '#fde68a');

    const itemsHtml = (inv.items || []).map((it, i) => `
      <tr>
        <td style="padding: 10px 12px; border-bottom: 1px solid #e2e8f0; font-size: 12px; color: #64748b; width: 30px;">${i + 1}</td>
        <td style="padding: 10px 12px; border-bottom: 1px solid #e2e8f0; font-size: 12px; font-weight: 600; color: #1e293b;">
          ${escapeHtml(it.description)}
        </td>
        <td style="padding: 10px 12px; border-bottom: 1px solid #e2e8f0; font-size: 12px; text-align: center; color: #334155;">${it.quantity}</td>
        <td style="padding: 10px 12px; border-bottom: 1px solid #e2e8f0; font-size: 12px; text-align: right; font-family: monospace; color: #334155;">${symbol}${Number(it.unit_price).toFixed(2)}</td>
        <td style="padding: 10px 12px; border-bottom: 1px solid #e2e8f0; font-size: 12px; text-align: right; font-family: monospace; font-weight: 700; color: #0f172a;">${symbol}${Number(it.total).toFixed(2)}</td>
      </tr>
    `).join('');

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Tax Invoice ${escapeHtml(inv.invoice_number)}</title>
        <style>
          @page { size: A4 portrait; margin: 15mm; }
          body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif; color: #1e293b; line-height: 1.5; font-size: 13px; margin: 0; padding: 0; background: #fff; }
          .header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #4f46e5; padding-bottom: 15px; margin-bottom: 25px; }
          .clinic-name { font-size: 20px; font-weight: 800; color: #0f172a; margin: 0 0 4px 0; }
          .clinic-meta { font-size: 11px; color: #64748b; line-height: 1.4; }
          .doc-type { text-align: right; }
          .doc-title { font-size: 20px; font-weight: 800; color: #4f46e5; letter-spacing: -0.5px; margin: 0; text-transform: uppercase; }
          .inv-number { font-size: 14px; font-weight: 700; color: #0f172a; margin-top: 4px; font-family: monospace; }
          .status-badge { display: inline-block; padding: 4px 12px; border-radius: 9999px; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; margin-top: 8px; background: ${statusBg}; color: ${statusText}; border: 1px solid ${statusBorder}; }
          .details-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 25px; }
          .section-title { font-size: 10px; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 6px; border-bottom: 1px solid #e2e8f0; padding-bottom: 3px; }
          .details-box { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 12px; font-size: 12px; }
          .details-box p { margin: 2px 0; }
          table { width: 100%; border-collapse: collapse; margin-bottom: 25px; }
          th { background: #f1f5f9; text-align: left; padding: 10px 12px; font-size: 11px; font-weight: 700; color: #475569; text-transform: uppercase; border-bottom: 2px solid #cbd5e1; }
          .totals-area { display: flex; justify-content: flex-end; margin-bottom: 30px; }
          .totals-table { width: 300px; border-collapse: collapse; }
          .totals-table td { padding: 6px 12px; border-bottom: 1px solid #e2e8f0; font-size: 12px; }
          .totals-table .grand-total { font-size: 15px; font-weight: 800; color: #4f46e5; border-top: 2px solid #4f46e5; border-bottom: none; }
          .notes-box { background: #f8fafc; border-left: 3px solid #4f46e5; padding: 10px 14px; margin-bottom: 25px; font-size: 11px; color: #475569; border-radius: 0 4px 4px 0; }
          .footer { margin-top: 40px; padding-top: 15px; border-top: 1px solid #e2e8f0; font-size: 10px; color: #94a3b8; text-align: center; }
        </style>
      </head>
      <body>
        <div class="header">
          <div style="display: flex; align-items: flex-start; gap: 16px;">
            ${logoBase64 ? `<img src="${logoBase64}" style="max-height: 56px; max-width: 140px; object-fit: contain; margin-top: 2px;" alt="Clinic Logo" />` : ''}
            <div>
              <h1 class="clinic-name">${clinicName}</h1>
              <div class="clinic-meta">
                <div>${clinicAddress}</div>
                <div>Phone: ${clinicPhone} • Email: ${clinicEmail}</div>
                <div>${clinicAbn}</div>
              </div>
            </div>
          </div>
          <div class="doc-type">
            <h2 class="doc-title">${isPaid ? 'Official Tax Receipt' : 'Official Tax Invoice'}</h2>
            <div class="inv-number">${escapeHtml(inv.invoice_number)}</div>
            <div class="status-badge">${escapeHtml(inv.status)}</div>
          </div>
        </div>

        <div class="details-grid">
          <div class="details-box">
            <div class="section-title">Patient / Billed To</div>
            <p><strong>${patientName}</strong></p>
            <p>Address: ${patientAddress}</p>
            <p>Contact: ${patientContact}</p>
            <p>Patient ID: #PAT-${String(inv.patient_id).padStart(4, '0')}</p>
          </div>

          <div class="details-box">
            <div class="section-title">Consultation &amp; Practice Details</div>
            <p><strong>Attending Practitioner:</strong> ${pracName}</p>
            <p>Title: ${pracTitle}</p>
            <p>Provider #: <strong>${provNumber}</strong> • Reg #: <strong>${regNumber}</strong></p>
            <p>Date of Issue: <strong>${formatDateLocal(inv.issue_date)}</strong> • Due: <strong>${formatDateLocal(inv.due_date)}</strong></p>
            <p>Payment Method: ${escapeHtml(inv.payment_method || 'Electronic')}</p>
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th style="width: 30px;">#</th>
              <th>Service / Consultation Item Description</th>
              <th style="text-align: center; width: 60px;">Qty</th>
              <th style="text-align: right; width: 90px;">Rate</th>
              <th style="text-align: right; width: 100px;">Amount</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
          </tbody>
        </table>

        <div class="totals-area">
          <table class="totals-table">
            <tr>
              <td style="color: #64748b;">Subtotal:</td>
              <td style="text-align: right; font-family: monospace;">${symbol}${Number(inv.subtotal).toFixed(2)}</td>
            </tr>
            <tr>
              <td style="color: #64748b;">Tax / GST (${Number(inv.tax_rate).toFixed(1)}%):</td>
              <td style="text-align: right; font-family: monospace;">${symbol}${Number(inv.tax_amount).toFixed(2)}</td>
            </tr>
            <tr class="grand-total">
              <td>Total Amount:</td>
              <td style="text-align: right; font-family: monospace;">${symbol}${Number(inv.total).toFixed(2)}</td>
            </tr>
          </table>
        </div>

        ${inv.notes ? `
          <div class="notes-box">
            <strong>Remarks / Medico-Legal Billing Notes:</strong><br>
            ${escapeHtml(inv.notes)}
          </div>
        ` : ''}

        <div class="footer">
          <p>This medical invoice / receipt is valid for private health insurance fund claims (HICAPS), Medicare reimbursement, and tax deductions.</p>
          <p>Generated locally &amp; securely offline by Antigravity Physiotherapy Suite.</p>
        </div>
      </body>
      </html>
    `;

    const cleanFilename = `Invoice_${inv.invoice_number}_${(inv.last_name || 'Patient').replace(/[^a-zA-Z0-9]/g, '_')}.pdf`;
    const result = await window.api.pdf.generate({
      htmlContent,
      defaultFilename: cleanFilename,
      dialogTitle: 'Export Official Tax Invoice / Receipt PDF'
    });

    if (result && result.success && result.filePath) {
      lastGeneratedInvoicePdfs[invoiceId] = result.filePath;
      return result.filePath;
    }
    return null;

  } catch (err) {
    if (err.name !== 'AbortError') {
      alert('Failed to export PDF receipt: ' + err.message);
    }
    return null;
  }
}

async function emailInvoiceReceipt(invoiceId) {
  try {
    let filePath = lastGeneratedInvoicePdfs[invoiceId];
    if (!filePath) {
      filePath = await exportInvoiceReceipt(invoiceId);
      if (!filePath) return;
    }

    const inv = await window.api.invoices.getById(invoiceId);
    if (!inv) return;
    const settings = await window.api.settings.getAll() || {};

    const to = inv.email || '';
    const symbol = settings.currency_symbol || '$';
    const isPaid = inv.status === 'Paid';
    const subject = `${isPaid ? 'Receipt' : 'Tax Invoice'} #${inv.invoice_number} - ${settings.clinic_name || 'Antigravity Physiotherapy'}`;
    const body = `Dear ${inv.first_name || 'Patient'},\n\nPlease find attached your official ${isPaid ? 'tax receipt' : 'tax invoice'} (${inv.invoice_number}) from ${settings.clinic_name || 'Antigravity Physiotherapy'}.\n\nTotal Due: ${symbol}${Number(inv.total).toFixed(2)}\nPayment Status: ${inv.status}\n\nKind regards,\n${settings.clinic_name || 'Antigravity Physiotherapy'}\n${settings.clinic_phone || ''}`;

    if (window.api?.system?.openEmailClient) {
      await window.api.system.openEmailClient({ to, subject, body, filePath });
      if (typeof showToast === 'function') {
        showToast('Email client launched & Invoice PDF revealed in Explorer');
      }
    }
  } catch (err) {
    console.error('[Invoice Email] Error:', err);
    alert('Failed to dispatch email: ' + err.message);
  }
}

async function exportPatientDischargeSummary(patientId) {
  try {
    const data = await window.api.patients.getDischargeData(patientId);
    if (!data || !data.patient) throw new Error('Patient record not found.');
    const settings = await window.api.settings.getAll() || {};
    let branding = null;
    try {
      if (window.api?.branding) branding = await window.api.branding.get();
    } catch (_) {}
    const logoBase64 = branding?.logoBase64 || null;

    const p = data.patient;
    const notesList = (p.notes || []).slice().reverse(); // Chronological (oldest first)
    const programsList = data.programs || [];
    const appts = p.appointments || [];

    const clinicName = escapeHtml(settings.clinic_name || 'Antigravity Sports & Orthopaedic Physiotherapy');
    const clinicPhone = escapeHtml(settings.clinic_phone || '+61 (02) 9876 5432');
    const clinicEmail = escapeHtml(settings.clinic_email || 'reception@antigravityphysio.com.au');
    const clinicAddress = escapeHtml(settings.clinic_address || 'Suite 402, 100 Medical Centre Way, Sydney NSW 2000');
    const clinicAbn = escapeHtml(settings.clinic_abn || 'ABN 88 123 456 789');

    const pracName = escapeHtml(settings.practitioner_name || 'Dr. Sarah Jenkins, PT, DPT, OCS');
    const pracTitle = escapeHtml(settings.practitioner_title || 'Senior Orthopaedic Physiotherapist');
    const provNumber = escapeHtml(settings.provider_number || 'PRV-8829103A');
    const regNumber = escapeHtml(settings.reg_number || 'AHPRA-PHY00019283');

    const patientFullName = `${escapeHtml(p.first_name)} ${escapeHtml(p.last_name)}`;
    const initialDate = notesList[0]?.created_at || p.created_at;
    const dischargeDate = new Date().toISOString();

    const initialNote = notesList[0] || null;
    const latestNote = notesList.length > 0 ? notesList[notesList.length - 1] : null;

    // Build timeline of treatments
    const notesSummaryHtml = notesList.map((n, i) => `
      <div style="margin-bottom: 12px; padding: 10px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px;">
        <div style="display: flex; justify-content: space-between; font-size: 11px; font-weight: 700; color: #4338ca; margin-bottom: 4px;">
          <span>Session #${i + 1} (${formatDateLocal(n.created_at)})</span>
        </div>
        <div style="font-size: 11px; color: #334155;">
          ${n.subjective ? `<div><strong>S:</strong> ${escapeHtml(n.subjective)}</div>` : ''}
          ${n.objective ? `<div style="margin-top: 2px;"><strong>O:</strong> ${escapeHtml(n.objective)}</div>` : ''}
          ${n.assessment ? `<div style="margin-top: 2px;"><strong>A:</strong> ${escapeHtml(n.assessment)}</div>` : ''}
          ${n.plan ? `<div style="margin-top: 2px;"><strong>P:</strong> ${escapeHtml(n.plan)}</div>` : ''}
        </div>
      </div>
    `).join('') || '<p style="color: #94a3b8; font-style: italic;">No clinical entries recorded.</p>';

    // Build prescribed exercise handouts
    let programsHtml = '<p style="color: #94a3b8; font-style: italic;">Independent home maintenance program provided.</p>';
    if (programsList.length > 0) {
      try {
        const prog = programsList[0];
        const schedule = typeof prog.schedule_json === 'string' ? JSON.parse(prog.schedule_json) : prog.schedule_json;
        if (schedule && Array.isArray(schedule.weeks) && schedule.weeks[0]?.days) {
          const exercises = [];
          schedule.weeks[0].days.forEach(d => {
            if (Array.isArray(d.exercises)) exercises.push(...d.exercises);
          });
          if (exercises.length > 0) {
            programsHtml = exercises.map(ex => `
              <div style="display: flex; justify-content: space-between; align-items: center; padding: 6px 10px; background: #f1f5f9; border-radius: 4px; margin-bottom: 6px; font-size: 11px;">
                <div>
                  <strong>${escapeHtml(ex.name || 'Exercise')}</strong>
                  ${ex.cues ? `<div style="color: #64748b; font-size: 10px;">${escapeHtml(ex.cues)}</div>` : ''}
                </div>
                <div style="font-family: monospace; font-weight: 700; color: #4338ca; white-space: nowrap;">
                  ${ex.sets || 3} sets × ${ex.reps || '10'} reps
                </div>
              </div>
            `).join('');
          }
        }
      } catch (_) {}
    }

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Discharge Summary — ${patientFullName}</title>
        <style>
          @page { size: A4 portrait; margin: 15mm; }
          body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif; color: #1e293b; line-height: 1.5; font-size: 12px; margin: 0; padding: 0; background: #fff; }
          .header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #4338ca; padding-bottom: 12px; margin-bottom: 20px; }
          .clinic-name { font-size: 18px; font-weight: 800; color: #0f172a; margin: 0 0 2px 0; }
          .clinic-meta { font-size: 10px; color: #64748b; line-height: 1.4; }
          .doc-type { text-align: right; }
          .doc-title { font-size: 16px; font-weight: 800; color: #4338ca; text-transform: uppercase; margin: 0; }
          .details-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 20px; }
          .details-box { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 10px; font-size: 11px; }
          .section-heading { font-size: 12px; font-weight: 800; color: #0f172a; text-transform: uppercase; letter-spacing: 0.5px; margin: 18px 0 8px 0; border-bottom: 1.5px solid #e2e8f0; padding-bottom: 4px; }
          .kpi-row { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 10px; margin-bottom: 15px; }
          .kpi-card { background: #eef2ff; border: 1px solid #c7d2fe; border-radius: 6px; padding: 8px; text-align: center; }
          .kpi-val { font-size: 15px; font-weight: 800; color: #4338ca; }
          .kpi-lbl { font-size: 9px; font-weight: 700; color: #6366f1; text-transform: uppercase; }
          .status-table { width: 100%; border-collapse: collapse; margin-bottom: 15px; font-size: 11px; }
          .status-table th { background: #f1f5f9; text-align: left; padding: 8px 10px; font-weight: 700; border-bottom: 1.5px solid #cbd5e1; }
          .status-table td { padding: 8px 10px; border-bottom: 1px solid #e2e8f0; }
          .sign-block { margin-top: 30px; display: flex; justify-content: space-between; align-items: flex-end; padding-top: 15px; border-top: 1px solid #e2e8f0; }
          .footer { margin-top: 25px; padding-top: 10px; border-top: 1px solid #e2e8f0; font-size: 9px; color: #94a3b8; text-align: center; }
        </style>
      </head>
      <body>
        <div class="header">
          <div style="display: flex; align-items: flex-start; gap: 14px;">
            ${logoBase64 ? `<img src="${logoBase64}" style="max-height: 52px; max-width: 130px; object-fit: contain; margin-top: 2px;" alt="Clinic Logo" />` : ''}
            <div>
              <h1 class="clinic-name">${clinicName}</h1>
              <div class="clinic-meta">
                <div>${clinicAddress}</div>
                <div>Phone: ${clinicPhone} • Email: ${clinicEmail} • ${clinicAbn}</div>
              </div>
            </div>
          </div>
          <div class="doc-type">
            <h2 class="doc-title">Clinical Discharge Summary</h2>
            <div style="font-size: 11px; font-weight: 600; color: #64748b; margin-top: 2px;">
              Date of Discharge: ${formatDateLocal(dischargeDate)}
            </div>
          </div>
        </div>

        <div class="details-grid">
          <div class="details-box">
            <div style="font-weight: 700; color: #4338ca; font-size: 12px; margin-bottom: 4px;">${patientFullName}</div>
            <p style="margin: 2px 0;"><strong>DOB:</strong> ${escapeHtml(p.dob || '—')}</p>
            <p style="margin: 2px 0;"><strong>Phone:</strong> ${escapeHtml(p.phone || '—')} • <strong>Email:</strong> ${escapeHtml(p.email || '—')}</p>
            <p style="margin: 2px 0;"><strong>Medical Record #:</strong> MRN-${String(p.id).padStart(5, '0')}</p>
          </div>

          <div class="details-box">
            <div style="font-weight: 700; color: #4338ca; font-size: 12px; margin-bottom: 4px;">Treating Clinician</div>
            <p style="margin: 2px 0;"><strong>${pracName}</strong></p>
            <p style="margin: 2px 0;">${pracTitle}</p>
            <p style="margin: 2px 0;">Provider #: <strong>${provNumber}</strong> • Registration #: <strong>${regNumber}</strong></p>
          </div>
        </div>

        <div class="kpi-row">
          <div class="kpi-card">
            <div class="kpi-val">${formatDateLocal(initialDate)}</div>
            <div class="kpi-lbl">Initial Evaluation</div>
          </div>
          <div class="kpi-card">
            <div class="kpi-val">${formatDateLocal(dischargeDate)}</div>
            <div class="kpi-lbl">Discharge Date</div>
          </div>
          <div class="kpi-card">
            <div class="kpi-val">${notesList.length || appts.length || 1} Sessions</div>
            <div class="kpi-lbl">Total Encounters</div>
          </div>
        </div>

        <div class="section-heading">Initial Presentation vs. Discharge Functional Status</div>
        <table class="status-table">
          <thead>
            <tr>
              <th style="width: 25%;">Clinical Dimension</th>
              <th style="width: 37.5%;">Initial Baseline Status</th>
              <th style="width: 37.5%;">Discharge / Outcome Status</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>Subjective Symptoms</strong></td>
              <td>${escapeHtml(initialNote?.subjective || 'Acute functional limitation and localized symptoms.')}</td>
              <td style="color: #059669; font-weight: 600;">${escapeHtml(latestNote?.subjective || 'Significant symptom resolution; goals met.')}</td>
            </tr>
            <tr>
              <td><strong>Objective Findings &amp; ROM</strong></td>
              <td>${escapeHtml(initialNote?.objective || 'Deficits in active ROM and localized muscular inhibition.')}</td>
              <td style="color: #059669; font-weight: 600;">${escapeHtml(latestNote?.objective || 'Symmetrical ROM restored; pain-free loading tolerance achieved.')}</td>
            </tr>
            <tr>
              <td><strong>Diagnostic Assessment</strong></td>
              <td>${escapeHtml(initialNote?.assessment || p.notes || 'Musculoskeletal dysfunction with functional impairment.')}</td>
              <td style="color: #059669; font-weight: 600;">${escapeHtml(latestNote?.assessment || 'Rehabilitation complete. Successfully met discharge criteria.')}</td>
            </tr>
          </tbody>
        </table>

        <div class="section-heading">Chronological Clinical Care Summary</div>
        ${notesSummaryHtml}

        <div class="section-heading">Home Exercise Program &amp; Long-Term Maintenance</div>
        ${programsHtml}

        <div class="section-heading">Discharge Recommendation &amp; Prognosis</div>
        <p style="margin: 4px 0 10px 0; font-size: 11px; line-height: 1.6; color: #334155;">
          The patient has met clinical discharge milestones. They have demonstrated proficiency in their independent self-management home exercise protocol. Follow-up is advised only as needed should recurrence of symptoms occur under unaccustomed mechanical loads.
        </p>

        <div class="sign-block">
          <div>
            <div style="font-weight: 800; font-size: 13px; color: #0f172a;">${pracName}</div>
            <div style="font-size: 11px; color: #64748b;">${pracTitle}</div>
            <div style="font-size: 10px; color: #94a3b8; font-family: monospace;">Provider #${provNumber} • Reg #${regNumber}</div>
          </div>
          <div style="text-align: right;">
            <div style="border-bottom: 1.5px solid #0f172a; width: 180px; margin-bottom: 4px;"></div>
            <div style="font-size: 10px; color: #64748b;">Authorized Clinician Signature</div>
          </div>
        </div>

        <div class="footer">
          <p>Confidential Medical Record — Approved for Patient Records, Referrers, and Third-Party Payers.</p>
          <p>Generated locally &amp; securely offline by Antigravity Physiotherapy Suite.</p>
        </div>
      </body>
      </html>
    `;

    const cleanFilename = `Discharge_Summary_${(p.last_name || 'Patient').replace(/[^a-zA-Z0-9]/g, '_')}_${(p.first_name || '').replace(/[^a-zA-Z0-9]/g, '_')}.pdf`;
    const result = await window.api.pdf.generate({
      htmlContent,
      defaultFilename: cleanFilename,
      dialogTitle: 'Export Official Patient Discharge Summary PDF'
    });

    if (result && result.success && result.filePath) {
      lastGeneratedDischargePdfs[patientId] = result.filePath;
      return result.filePath;
    }
    return null;

  } catch (err) {
    if (err.name !== 'AbortError') {
      alert('Failed to export discharge summary PDF: ' + err.message);
    }
    return null;
  }
}

async function emailPatientDischargeSummary(patientId) {
  try {
    let filePath = lastGeneratedDischargePdfs[patientId];
    if (!filePath) {
      filePath = await exportPatientDischargeSummary(patientId);
      if (!filePath) return;
    }

    const data = await window.api.patients.getDischargeData(patientId);
    if (!data || !data.patient) return;
    const p = data.patient;
    const settings = await window.api.settings.getAll() || {};

    const to = p.email || '';
    const subject = `Physiotherapy Discharge Summary - ${p.first_name} ${p.last_name}`;
    const body = `Dear ${p.first_name},\n\nPlease find attached your formal Physiotherapy Clinical Discharge Summary from ${settings.clinic_name || 'Antigravity Physiotherapy'}.\n\nThis document details your rehabilitation course, objective functional improvements, and prescribed ongoing home exercises. You may share this with your referring physician or insurer.\n\nKind regards,\n${settings.practitioner_name || 'Physiotherapy Team'}\n${settings.clinic_name || 'Antigravity Physiotherapy'}\n${settings.clinic_phone || ''}`;

    if (window.api?.system?.openEmailClient) {
      await window.api.system.openEmailClient({ to, subject, body, filePath });
      if (typeof showToast === 'function') {
        showToast('Email client launched & Discharge Summary PDF revealed in Explorer');
      }
    }
  } catch (err) {
    console.error('[Discharge Email] Error:', err);
    alert('Failed to dispatch email: ' + err.message);
  }
}

window.exportInvoiceReceipt = exportInvoiceReceipt;
window.emailInvoiceReceipt = emailInvoiceReceipt;
window.exportPatientDischargeSummary = exportPatientDischargeSummary;
window.emailPatientDischargeSummary = emailPatientDischargeSummary;

// ── Domain: Branding & Clinic Logo Pipeline ──────────────────────────────
let currentBranding = {
  clinicName: '',
  practitionerName: '',
  logoPath: null,
  logoBase64: null
};

function updateBrandingUI(branding) {
  if (!branding) return;
  if (branding.clinicName !== undefined) currentBranding.clinicName = branding.clinicName;
  if (branding.practitionerName !== undefined) currentBranding.practitionerName = branding.practitionerName;
  if (branding.logoPath !== undefined) currentBranding.logoPath = branding.logoPath;
  if (branding.logoBase64 !== undefined) currentBranding.logoBase64 = branding.logoBase64;

  const displayName = (currentBranding.clinicName || '').trim() || 'SoloPhysio';
  const displaySubtitle = (currentBranding.practitionerName || '').trim() || 'v1.0.0';

  // Default to the master software logo file assets/logo.png
  const defaultMasterLogoSrc = '../assets/logo.png';
  const hasCustomLogo = Boolean(currentBranding.logoBase64 || currentBranding.logoPath);
  const activeLogoSrc = hasCustomLogo
    ? (currentBranding.logoBase64 || `file://${currentBranding.logoPath}?t=${Date.now()}`)
    : defaultMasterLogoSrc;

  // 1. Sidebar Brand (Top-Left) - Sole Location for Global App Branding
  const elGlobalName = $('global-clinic-name');
  if (elGlobalName) elGlobalName.textContent = displayName;

  const elGlobalSubtitle = $('global-clinic-subtitle');
  if (elGlobalSubtitle) elGlobalSubtitle.textContent = displaySubtitle;

  const elGlobalLogo = $('global-clinic-logo');
  if (elGlobalLogo) {
    elGlobalLogo.src = activeLogoSrc;
    elGlobalLogo.classList.remove('hidden');
  }

  // 2. Settings Screen Preview & Remove Button
  const elPreview = $('settings-clinic-logo-preview');
  const elPlaceholder = $('settings-clinic-logo-placeholder');
  const btnRemove = $('btn-remove-clinic-logo');
  if (hasCustomLogo) {
    if (elPreview) {
      elPreview.src = activeLogoSrc;
      elPreview.classList.remove('hidden');
    }
    if (elPlaceholder) elPlaceholder.classList.add('hidden');
    if (btnRemove) btnRemove.classList.remove('hidden');
  } else {
    if (elPreview) {
      elPreview.src = '';
      elPreview.classList.add('hidden');
    }
    if (elPlaceholder) elPlaceholder.classList.remove('hidden');
    if (btnRemove) btnRemove.classList.add('hidden');
  }
}

async function initBrandingPipeline() {
  try {
    if (!window.api?.branding) return;

    // Listen for live branding updates across the app (branding:updated IPC signal)
    window.api.branding.onUpdated((data) => {
      updateBrandingUI(data);
    });

    // Query clinic_settings table on application start: SELECT clinic_name, logo_path FROM clinic_settings WHERE id = 1
    const initialBranding = await window.api.branding.get();
    if (initialBranding) {
      updateBrandingUI(initialBranding);
    }
  } catch (err) {
    console.warn('[Branding] Failed to init branding pipeline:', err);
  }
}

// ── Settings View Controller (Phase 8 SQLite Backed) ───────────────────────

async function loadSettingsGeneralPreferences() {
  try {
    if (!window.api?.settings) return;
    const s = await window.api.settings.getAll() || {};
    clinicSettingsCache = s;

    // Sync branding preview and header from settings / SQLite
    if (window.api?.branding) {
      const b = await window.api.branding.get();
      if (b) {
        if (!b.practitionerName && s.practitioner_name) b.practitionerName = s.practitioner_name;
        if (!b.clinicName && s.clinic_name) b.clinicName = s.clinic_name;
        updateBrandingUI(b);
      }
    }

    // Demographics
    if ($('set-clinic-name')) $('set-clinic-name').value = s.clinic_name || '';
    if ($('set-clinic-phone')) $('set-clinic-phone').value = s.clinic_phone || '';
    if ($('set-clinic-email')) $('set-clinic-email').value = s.clinic_email || '';
    if ($('set-clinic-address')) $('set-clinic-address').value = s.clinic_address || '';
    if ($('set-clinic-abn')) $('set-clinic-abn').value = s.clinic_abn || '';

    // Practitioner
    if ($('set-practitioner-name')) $('set-practitioner-name').value = s.practitioner_name || '';
    if ($('set-practitioner-title')) $('set-practitioner-title').value = s.practitioner_title || '';
    if ($('set-provider-number')) $('set-provider-number').value = s.provider_number || '';
    if ($('set-reg-number')) $('set-reg-number').value = s.reg_number || '';

    // Hours & Schedule
    if (s.work_start && $('set-work-start')) $('set-work-start').value = s.work_start;
    if (s.work_end && $('set-work-end')) $('set-work-end').value = s.work_end;
    if (s.slot_duration && $('set-slot-duration')) $('set-slot-duration').value = s.slot_duration;

    if (s.active_days) {
      try {
        const days = typeof s.active_days === 'string' ? JSON.parse(s.active_days) : s.active_days;
        if (Array.isArray(days)) {
          document.querySelectorAll('#set-active-days-container input[type="checkbox"]').forEach(cb => {
            cb.checked = days.includes(cb.value);
          });
        }
      } catch (_) {}
    }

    if ($('set-lunch-enabled')) $('set-lunch-enabled').checked = (s.lunch_enabled === '1' || s.lunch_enabled === true || s.lunch_enabled === 'true');
    if (s.lunch_start && $('set-lunch-start')) $('set-lunch-start').value = s.lunch_start;
    if (s.lunch_duration && $('set-lunch-duration')) $('set-lunch-duration').value = s.lunch_duration;

    // Billing & Financial Defaults
    if (s.fee_initial && $('set-fee-initial')) $('set-fee-initial').value = s.fee_initial;
    if (s.fee_followup && $('set-fee-followup')) $('set-fee-followup').value = s.fee_followup;
    if (s.tax_rate && $('set-tax-rate')) $('set-tax-rate').value = s.tax_rate;
    if (s.currency_symbol && $('set-currency-symbol')) $('set-currency-symbol').value = s.currency_symbol;

    // Update quick preset labels in drawer
    if (s.fee_initial && $('label-fee-initial')) $('label-fee-initial').textContent = Number(s.fee_initial).toFixed(2);
    if (s.fee_followup && $('label-fee-followup')) $('label-fee-followup').textContent = Number(s.fee_followup).toFixed(2);

    // EULA Status in Settings
    if (window.api?.eula) {
      const eulaStatus = await window.api.eula.getStatus();
      updateEulaStatusCard(eulaStatus);
    }
  } catch (err) {
    console.warn('[Settings] Failed to load preferences from SQLite:', err);
  }
}

function initSettingsView() {
  // Custom Clinic Logo Management (Settings > Clinic Profile)
  const btnUploadLogo = $('btn-upload-clinic-logo');
  if (btnUploadLogo) {
    btnUploadLogo.onclick = async () => {
      try {
        const res = await window.api.branding.uploadLogo();
        if (res && res.success) {
          updateBrandingUI(res);
          const feedback = $('logo-upload-feedback');
          if (feedback) {
            feedback.classList.remove('hidden');
            setTimeout(() => feedback.classList.add('hidden'), 3500);
          }
        }
      } catch (err) {
        alert('Failed to upload clinic logo: ' + err.message);
      }
    };
  }

  const btnRemoveLogo = $('btn-remove-clinic-logo');
  if (btnRemoveLogo) {
    btnRemoveLogo.onclick = async () => {
      try {
        const res = await window.api.branding.removeLogo();
        if (res && res.success) {
          updateBrandingUI({ logoPath: null, logoBase64: null });
        }
      } catch (err) {
        alert('Failed to remove clinic logo: ' + err.message);
      }
    };
  }

  // Real-time dynamic updates on Clinic Name and Practitioner Name input
  const inputClinicName = $('set-clinic-name');
  if (inputClinicName) {
    inputClinicName.addEventListener('input', () => {
      updateBrandingUI({ clinicName: inputClinicName.value });
    });
  }

  const inputPracName = $('set-practitioner-name');
  if (inputPracName) {
    inputPracName.addEventListener('input', () => {
      updateBrandingUI({ practitionerName: inputPracName.value });
    });
  }

  // Jump buttons to Hubs
  const btnExLib = $('set-jump-exlib');
  if (btnExLib) {
    btnExLib.onclick = (e) => {
      e.preventDefault();
      navigateTo('exercise-library');
    };
  }

  const btnSmart = $('set-jump-smartphrases');
  if (btnSmart) {
    btnSmart.onclick = (e) => {
      e.preventDefault();
      navigateTo('smart-phrases');
    };
  }

  // Per-Card and Global Settings Saving Pipeline
  function triggerButtonSaved(btn, text = 'Saved') {
    if (!btn) return;
    const origHtml = btn.innerHTML;
    btn.innerHTML = `
      <svg class="h-3.5 w-3.5 text-emerald-500 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
        <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
      </svg>
      <span class="pointer-events-none text-emerald-600 dark:text-emerald-400 font-bold">✓ ${text}</span>
    `;
    btn.classList.add('ring-2', 'ring-emerald-500/60', 'bg-emerald-50', 'dark:bg-emerald-500/20');
    setTimeout(() => {
      btn.innerHTML = origHtml;
      btn.classList.remove('ring-2', 'ring-emerald-500/60', 'bg-emerald-50', 'dark:bg-emerald-500/20');
    }, 2500);
  }

  async function saveSettingsSection(section, btn) {
    let partial = {};
    if (section === 'demographics') {
      partial = {
        clinic_name: $('set-clinic-name')?.value?.trim() || '',
        clinic_phone: $('set-clinic-phone')?.value?.trim() || '',
        clinic_email: $('set-clinic-email')?.value?.trim() || '',
        clinic_address: $('set-clinic-address')?.value?.trim() || '',
        clinic_abn: $('set-clinic-abn')?.value?.trim() || ''
      };
    } else if (section === 'practitioner') {
      partial = {
        practitioner_name: $('set-practitioner-name')?.value?.trim() || '',
        practitioner_title: $('set-practitioner-title')?.value?.trim() || '',
        provider_number: $('set-provider-number')?.value?.trim() || '',
        reg_number: $('set-reg-number')?.value?.trim() || ''
      };
    } else if (section === 'schedule') {
      const activeDays = [];
      document.querySelectorAll('#set-active-days-container input[type="checkbox"]:checked').forEach(cb => {
        activeDays.push(cb.value);
      });
      partial = {
        work_start: $('set-work-start')?.value || '08:30',
        work_end: $('set-work-end')?.value || '17:30',
        slot_duration: $('set-slot-duration')?.value || '30',
        active_days: JSON.stringify(activeDays),
        lunch_enabled: $('set-lunch-enabled')?.checked ? '1' : '0',
        lunch_start: $('set-lunch-start')?.value || '12:30',
        lunch_duration: $('set-lunch-duration')?.value || '60'
      };
    } else if (section === 'billing') {
      partial = {
        fee_initial: $('set-fee-initial')?.value || '140.00',
        fee_followup: $('set-fee-followup')?.value || '95.00',
        tax_rate: $('set-tax-rate')?.value || '10.0',
        currency_symbol: $('set-currency-symbol')?.value || '$'
      };
    }

    try {
      const saved = await window.api.settings.save(partial);
      clinicSettingsCache = { ...(clinicSettingsCache || {}), ...partial };

      if (partial.clinic_name !== undefined || partial.practitioner_name !== undefined) {
        updateBrandingUI({
          clinicName: partial.clinic_name,
          practitionerName: partial.practitioner_name
        });
      }

      if (section === 'schedule' && window.Diary?.updateScheduleConfig) {
        window.Diary.updateScheduleConfig(partial);
      }

      if (section === 'billing') {
        if ($('label-fee-initial') && partial.fee_initial) $('label-fee-initial').textContent = Number(partial.fee_initial).toFixed(2);
        if ($('label-fee-followup') && partial.fee_followup) $('label-fee-followup').textContent = Number(partial.fee_followup).toFixed(2);
      }

      triggerButtonSaved(btn);
    } catch (err) {
      alert('Failed to save section: ' + err.message);
    }
  }

  // Bind per-card save buttons
  document.querySelectorAll('.btn-save-card').forEach(btn => {
    btn.onclick = () => saveSettingsSection(btn.dataset.card, btn);
  });

  // Master Save All Preferences (Top and Bottom)
  async function saveAllPreferences(btns = []) {
    const activeDays = [];
    document.querySelectorAll('#set-active-days-container input[type="checkbox"]:checked').forEach(cb => {
      activeDays.push(cb.value);
    });

    const prefs = {
      clinic_name: $('set-clinic-name')?.value?.trim() || '',
      clinic_phone: $('set-clinic-phone')?.value?.trim() || '',
      clinic_email: $('set-clinic-email')?.value?.trim() || '',
      clinic_address: $('set-clinic-address')?.value?.trim() || '',
      clinic_abn: $('set-clinic-abn')?.value?.trim() || '',

      practitioner_name: $('set-practitioner-name')?.value?.trim() || '',
      practitioner_title: $('set-practitioner-title')?.value?.trim() || '',
      provider_number: $('set-provider-number')?.value?.trim() || '',
      reg_number: $('set-reg-number')?.value?.trim() || '',

      work_start: $('set-work-start')?.value || '08:30',
      work_end: $('set-work-end')?.value || '17:30',
      slot_duration: $('set-slot-duration')?.value || '30',
      active_days: JSON.stringify(activeDays),

      lunch_enabled: $('set-lunch-enabled')?.checked ? '1' : '0',
      lunch_start: $('set-lunch-start')?.value || '12:30',
      lunch_duration: $('set-lunch-duration')?.value || '60',

      fee_initial: $('set-fee-initial')?.value || '140.00',
      fee_followup: $('set-fee-followup')?.value || '95.00',
      tax_rate: $('set-tax-rate')?.value || '10.0',
      currency_symbol: $('set-currency-symbol')?.value || '$'
    };

    try {
      const saved = await window.api.settings.save(prefs);
      clinicSettingsCache = saved || prefs;

      // Dynamic update of top-left branding across the application
      updateBrandingUI({
        clinicName: prefs.clinic_name,
        practitionerName: prefs.practitioner_name
      });

      // Synchronize calendar schedule dynamically
      if (window.Diary?.updateScheduleConfig) {
        window.Diary.updateScheduleConfig(prefs);
      }

      // Show success indicator
      const feedback = $('set-save-feedback');
      if (feedback) {
        feedback.classList.remove('hidden');
        setTimeout(() => feedback.classList.add('hidden'), 3500);
      }

      // Update fee labels in invoice drawer
      if ($('label-fee-initial')) $('label-fee-initial').textContent = Number(prefs.fee_initial).toFixed(2);
      if ($('label-fee-followup')) $('label-fee-followup').textContent = Number(prefs.fee_followup).toFixed(2);

      btns.forEach(b => {
        if (b) triggerButtonSaved(b, 'All Saved');
      });
    } catch (err) {
      alert('Failed to save settings: ' + err.message);
    }
  }

  const btnSavePrefs = $('set-btn-save-prefs');
  const btnSavePrefsTop = $('set-btn-save-prefs-top');
  const masterSaveBtns = [btnSavePrefs, btnSavePrefsTop].filter(Boolean);
  masterSaveBtns.forEach(btn => {
    btn.onclick = () => saveAllPreferences(masterSaveBtns);
  });

  loadSettingsGeneralPreferences();
}

// ═══════════════════════════════════════════════════════════════════════════
// MEDICO-LEGAL EULA GATEWAY & CLINICAL GOVERNANCE
// ═══════════════════════════════════════════════════════════════════════════

const modalEula         = $('modal-eula-gateway');
const eulaCheckAccept   = $('eula-check-accept');
const eulaInputSignee   = $('eula-input-signee');
const btnEulaConfirm    = $('btn-eula-confirm');
const btnEulaClose      = $('btn-eula-close');
const btnEulaDismissRev = $('btn-eula-dismiss-review');
const eulaGatewayForm   = $('eula-gateway-form');
const eulaReviewFooter  = $('eula-gateway-review-footer');
const eulaReviewMeta    = $('eula-review-meta');
const btnReopenEula     = $('btn-reopen-eula');

function updateEulaStatusCard(status) {
  const badge = $('set-eula-badge');
  const signeeEl = $('set-eula-signee');
  const dateEl = $('set-eula-date');
  if (status && status.accepted) {
    if (badge) {
      badge.textContent = 'Accepted';
      badge.className = 'px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/30';
    }
    if (signeeEl) signeeEl.textContent = status.signee || 'Registered Clinician';
    if (dateEl) dateEl.textContent = status.timestamp ? new Date(status.timestamp).toLocaleString() : 'Active';
  } else {
    if (badge) {
      badge.textContent = 'Pending Sign-Off';
      badge.className = 'px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-500/30';
    }
    if (signeeEl) signeeEl.textContent = 'Unsigned';
    if (dateEl) dateEl.textContent = 'Pending cold-start declaration';
  }
}

async function checkEulaStatusOnStartup() {
  try {
    if (!window.api?.eula) return;
    const status = await window.api.eula.getStatus();
    updateEulaStatusCard(status);
    if (!status || !status.accepted) {
      // First-run blocking gateway mode: unskippable
      if (modalEula) {
        modalEula.classList.remove('hidden');
        modalEula.style.setProperty('display', 'flex', 'important');
      }
      if (btnEulaClose) btnEulaClose.classList.add('hidden');
      if (eulaReviewFooter) eulaReviewFooter.classList.add('hidden');
      if (eulaGatewayForm) eulaGatewayForm.classList.remove('hidden');
    }
  } catch (err) {
    console.error('[EULA] Failed to check status:', err);
  }
}

function updateEulaConfirmButton() {
  if (!btnEulaConfirm) return;
  const isAccepted = !!eulaCheckAccept?.checked;
  const hasSignee = (eulaInputSignee?.value || '').trim().length > 0;
  btnEulaConfirm.disabled = !(isAccepted && hasSignee);
}

eulaCheckAccept?.addEventListener('change', updateEulaConfirmButton);
eulaInputSignee?.addEventListener('input', updateEulaConfirmButton);

btnEulaConfirm?.addEventListener('click', async () => {
  const signee = (eulaInputSignee?.value || '').trim();
  if (!eulaCheckAccept?.checked || !signee) return;
  try {
    btnEulaConfirm.disabled = true;
    btnEulaConfirm.textContent = 'Recording Digital Signature…';
    const status = await window.api.eula.accept(signee);
    modalEula?.classList.add('hidden');
    modalEula?.style.setProperty('display', 'none', 'important');
    updateEulaStatusCard(status);
  } catch (err) {
    alert('Failed to record EULA acceptance: ' + err.message);
    btnEulaConfirm.disabled = false;
    btnEulaConfirm.textContent = 'Sign & Continue →';
  }
});

// Reopen in review mode from Settings
btnReopenEula?.addEventListener('click', async () => {
  const status = await window.api.eula.getStatus();
  if (modalEula) {
    modalEula.classList.remove('hidden');
    modalEula.style.setProperty('display', 'flex', 'important');
  }
  if (btnEulaClose) btnEulaClose.classList.remove('hidden');
  if (eulaGatewayForm) eulaGatewayForm.classList.add('hidden');
  if (eulaReviewFooter) eulaReviewFooter.classList.remove('hidden');
  if (eulaReviewMeta) {
    eulaReviewMeta.textContent = `${status?.signee || 'Clinician'} on ${status?.timestamp ? new Date(status.timestamp).toLocaleString() : 'N/A'}`;
  }
});

function closeEulaReviewModal() {
  modalEula?.classList.add('hidden');
  modalEula?.style.setProperty('display', 'none', 'important');
}

btnEulaClose?.addEventListener('click', closeEulaReviewModal);
btnEulaDismissRev?.addEventListener('click', closeEulaReviewModal);

// Download Signed Medico-Legal & GDPR Declaration PDF
const btnDownloadSignedDec = $('btn-download-signed-declaration');
btnDownloadSignedDec?.addEventListener('click', async () => {
  try {
    btnDownloadSignedDec.disabled = true;
    const origHtml = btnDownloadSignedDec.innerHTML;
    btnDownloadSignedDec.innerHTML = `
      <svg class="w-4 h-4 animate-spin pointer-events-none" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
      </svg>
      <span class="pointer-events-none">Generating Declaration PDF...</span>
    `;
    const res = await (window.api?.legal?.downloadSignedDeclaration
      ? window.api.legal.downloadSignedDeclaration()
      : window.api?.eula?.downloadSignedDeclaration());
    btnDownloadSignedDec.disabled = false;
    btnDownloadSignedDec.innerHTML = origHtml;
  } catch (err) {
    console.error('[Legal] Failed to export signed declaration:', err);
    alert('Failed to generate declaration PDF: ' + (err.message || err));
    if (btnDownloadSignedDec) {
      btnDownloadSignedDec.disabled = false;
      btnDownloadSignedDec.innerHTML = `
        <svg class="w-4 h-4 pointer-events-none shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <span class="pointer-events-none">Download Signed Declaration PDF</span>
      `;
    }
  }
});

// ── Universal Offline Data Backups (Exercises, Research, Smart Phrases) ──────
$('btn-export-exercises-backup')?.addEventListener('click', async () => {
  try {
    const res = await window.api.rehab.exportBackup();
    if (res?.canceled) return;
    if (res?.success) {
      alert(`Exercise Library & Protocols Backup created successfully!\nSaved to: ${res.filePath}`);
    }
  } catch (err) {
    alert('Failed to export Exercise Library backup: ' + err.message);
  }
});

$('btn-import-exercises-backup')?.addEventListener('click', async () => {
  try {
    const res = await window.api.rehab.importBackup();
    if (res?.canceled) return;
    if (res?.success) {
      alert(`Exercise Library & Protocols restored successfully!\nImported/Updated ${res.exCount || 0} exercises and ${res.protoCount || 0} protocols.`);
      await populateExerciseCategoryDropdowns();
      if (typeof loadExerciseLibraryHub === 'function') await loadExerciseLibraryHub();
    }
  } catch (err) {
    alert('Failed to import Exercise Library backup: ' + err.message);
  }
});

$('btn-export-research-backup')?.addEventListener('click', async () => {
  try {
    const res = await window.api.research.exportBackup();
    if (res?.canceled) return;
    if (res?.success) {
      alert(`Research Library Metadata Backup created successfully!\nSaved to: ${res.filePath}`);
    }
  } catch (err) {
    alert('Failed to export Research Library backup: ' + err.message);
  }
});

$('btn-import-research-backup')?.addEventListener('click', async () => {
  try {
    const res = await window.api.research.importBackup();
    if (res?.canceled) return;
    if (res?.success) {
      alert(`Research Library Metadata restored successfully!\nImported/Updated ${res.paperCount || 0} research papers.`);
      if (window.ResearchLibrary?.loadPapers) await window.ResearchLibrary.loadPapers();
    }
  } catch (err) {
    alert('Failed to import Research Library backup: ' + err.message);
  }
});

// ── Smart Phrases Backup & Import Engine ─────────────────────────────────────
$('btn-export-smartphrases-backup')?.addEventListener('click', async () => {
  try {
    const backup = await window.api.smartPhrases.exportBackup();
    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `SmartPhrases_Backup_${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    const phraseCount = backup.smart_phrases?.length ?? backup.phrases?.length ?? 0;
    const catCount = backup.trigger_categories?.length ?? backup.categories?.length ?? 0;
    alert(`Successfully exported ${phraseCount} smart phrases and ${catCount} categories.`);
  } catch (err) {
    alert('Failed to export Smart Phrases backup: ' + err.message);
  }
});

$('btn-import-smartphrases-backup')?.addEventListener('click', () => {
  $('input-import-smartphrases-backup')?.click();
});

$('input-import-smartphrases-backup')?.addEventListener('change', async (e) => {
  const file = e.target.files?.[0];
  if (!file) return;
  try {
    const text = await file.text();
    const backupData = JSON.parse(text);
    const res = await window.api.smartPhrases.importBackup(backupData);
    await loadTriggerCategories();
    await loadSmartPhrasesCache();
    renderSmartPhrasesList();
    alert(`Successfully restored backup! Imported ${res.phrasesImported || 0} smart phrases and ${res.categoriesImported || 0} categories.`);
  } catch (err) {
    alert('Failed to import Smart Phrases backup: ' + (err.message || 'Invalid JSON file'));
  } finally {
    e.target.value = '';
  }
});

// ── Citation Copy Delegation Listener ───────────────────────────────────────
document.addEventListener('click', async (e) => {
  const copyBtn = e.target.closest('.btn-copy-rf-citation');
  if (copyBtn) {
    const citation = copyBtn.dataset.citation;
    if (citation) {
      try {
        await navigator.clipboard.writeText(citation);
        const originalText = copyBtn.textContent;
        copyBtn.textContent = 'Copied! ✓';
        copyBtn.classList.add('bg-emerald-50', 'text-emerald-700', 'border-emerald-300');
        setTimeout(() => {
          copyBtn.textContent = originalText;
          copyBtn.classList.remove('bg-emerald-50', 'text-emerald-700', 'border-emerald-300');
        }, 2000);
      } catch (err) {
        console.error('Failed to copy citation:', err);
      }
    }
  }
});

// ═══════════════════════════════════════════════════════════════════════════
// GLOBAL EVENT DELEGATION LISTENER (ROUTER, TABS, MODALS, HITBOXES)
// ═══════════════════════════════════════════════════════════════════════════
document.addEventListener('click', (e) => {
  const target = e.target?.closest?.('[data-action], [data-nav-view], [data-library-tab], #set-jump-exlib, #set-jump-smartphrases, #btn-new-protocol-template, #btn-close-proto-modal, #btn-cancel-proto-modal, #exlib-tab-protocols, #exlib-tab-exercises, #btn-close-edit-ex, #btn-cancel-edit-ex, #exlib-btn-new-exercise, #sp-insert-table, #btn-insert-table');
  if (!target) return;

  // Immediate guard: If clicked target is inside an inactive/hidden view, discard it immediately
  if (target.closest('.view-pane-hidden, .hidden, [aria-hidden="true"]')) {
    return;
  }

  // 1. Navigation routing
  const navView = target.dataset?.navView || (target.id === 'set-jump-exlib' ? 'exercise-library' : (target.id === 'set-jump-smartphrases' ? 'smart-phrases' : null));
  if (navView) {
    e.preventDefault();
    navigateTo(navView);
    return;
  }

  // 2. Library tab switching
  const libTab = target.dataset?.libraryTab || (target.id === 'exlib-tab-protocols' ? 'protocols' : (target.id === 'exlib-tab-exercises' ? 'exercises' : null));
  if (libTab) {
    e.preventDefault();
    switchExerciseLibraryTab(libTab);
    return;
  }

  // 3. Protocol Template modal triggers
  const action = target.dataset?.action;
  if (action === 'new-protocol-template' || target.id === 'btn-new-protocol-template') {
    e.preventDefault();
    openNewProtocolModal();
    return;
  }
  if (action === 'close-protocol-modal' || target.id === 'btn-close-proto-modal' || target.id === 'btn-cancel-proto-modal') {
    e.preventDefault();
    closeNewProtocolModal();
    return;
  }

  // 4. Exercise modal triggers
  if (action === 'new-exercise' || target.id === 'exlib-btn-new-exercise') {
    e.preventDefault();
    openEditExerciseModal(null);
    return;
  }
  if (action === 'close-exercise-modal' || target.id === 'btn-close-edit-ex' || target.id === 'btn-cancel-edit-ex') {
    e.preventDefault();
    closeEditExerciseModal();
    return;
  }
  if (action === 'edit-exercise') {
    e.preventDefault();
    const id = target.dataset?.id;
    const ex = exlibExercises.find(x => String(x.id) === String(id));
    if (ex) openEditExerciseModal(ex);
    return;
  }
  if (action === 'delete-exercise') {
    e.preventDefault();
    const id = target.dataset?.id;
    const ex = exlibExercises.find(x => String(x.id) === String(id));
    if (ex && confirm(`Delete "${ex.name}" from the exercise database?`)) {
      window.api.rehab.deleteExercise(ex.id)
        .then(() => loadExerciseLibraryHub())
        .catch(err => alert('Failed to delete exercise: ' + err.message));
    }
    return;
  }

  // 5. Table insertion actions
  if (target.id === 'sp-insert-table') {
    e.preventDefault();
    if (typeof insertInSpEditor === 'function') insertInSpEditor(STARTER_TABLE_HTML);
    return;
  }
  if (target.id === 'btn-insert-table') {
    e.preventDefault();
    if (typeof insertAtCursor === 'function') insertAtCursor(STARTER_TABLE_HTML);
    return;
  }
});

// Initialise Invoicing, Exercise Library Hub and Settings View, then enforce initial strict view isolation
initBrandingPipeline();
initInvoicingLedger();
initExerciseLibraryHub();
initSettingsView();
closePatientProfile();
closeClockOverlay();
closeRF();
closeNewPatientModal();
closeNewProtocolModal();
closeEditExerciseModal();
closeInvoiceDrawer();
switchView('dashboard');
checkEulaStatusOnStartup();
