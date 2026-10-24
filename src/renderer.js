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

const ALL_VIEWS = ['dashboard', 'diary', 'patients', 'smart-phrases', 'programs', 'invoicing', 'settings'];

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

  // Activate smart phrases hub when navigating to it
  if (target === 'smart-phrases' && typeof loadSmartPhrasesHub === 'function') {
    loadSmartPhrasesHub();
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

// ── Excel-Style Interactive Table Calculations & Column Resizing ──────────
function initExcelTables(container, optionalTextarea) {
  if (!container) return;

  // 1. Column Resizers
  container.querySelectorAll('.col-resizer').forEach(resizer => {
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

  // 2. Interactive in-cell calculations & auto-summed rows
  container.querySelectorAll('.excel-table').forEach(table => {
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

      // Update [data-severity-target] (ODI & NDI)
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
        }
      });

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

    recalcTable();
  });
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

const SOAP_TEMPLATE_RICH = `<h3>Subjective</h3>
<ul>
  <li><strong>Presenting complaint &amp; mechanism:</strong> </li>
  <li><strong>Pain score (0-10) &amp; irritability:</strong> </li>
  <li><strong>Aggravating / easing factors:</strong> </li>
  <li><strong>Functional goals:</strong> </li>
</ul>
<h3>Objective</h3>
<ul>
  <li><strong>Posture &amp; movement observation:</strong> </li>
  <li><strong>Active ROM &amp; movement quality:</strong> </li>
  <li><strong>Passive ROM &amp; joint end-feel:</strong> </li>
  <li><strong>Neurological / special tests:</strong> </li>
</ul>
<h3>Assessment</h3>
<ul>
  <li><strong>Clinical diagnostic impression:</strong> </li>
  <li><strong>Contributing impairment factors:</strong> </li>
  <li><strong>Rehabilitation prognosis:</strong> </li>
</ul>
<h3>Plan</h3>
<ul>
  <li><strong>Today's manual / exercise intervention:</strong> </li>
  <li><strong>Home exercise prescription (HEP):</strong> </li>
  <li><strong>Follow-up scheduling:</strong> </li>
</ul>`;

$('btn-insert-soap')?.addEventListener('click', () => insertAtCursor(SOAP_TEMPLATE_RICH));
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
      await window.api.notes.create({
        patient_id: activePortfolioPatientId,
        content: cleanContent,
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
  const code = (pfx === '!' ? rawCode.toUpperCase() : rawCode);
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
    catBackdrop?.classList.remove('opacity-0', 'pointer-events-none');
    catModal?.classList.remove('opacity-0', 'pointer-events-none');
    $('new-cat-prefix-input')?.focus();
  }

  function closeCatModal() {
    catBackdrop?.classList.add('opacity-0', 'pointer-events-none');
    catModal?.classList.add('opacity-0', 'pointer-events-none');
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

  // Quick Table Presets (Rich Excel Tables)
  $('sp-insert-rom')?.addEventListener('click', () => {
    insertInSpEditor(`\n<div class="excel-table-wrap">
  <table class="excel-table">
    <thead>
      <tr>
        <th style="width: 140px;">Joint &amp; Movement<div class="col-resizer"></div></th>
        <th style="width: 100px;">Normative<div class="col-resizer"></div></th>
        <th style="width: 110px;">Active ROM<div class="col-resizer"></div></th>
        <th style="width: 110px;">Passive ROM<div class="col-resizer"></div></th>
        <th style="width: 130px;">End-Feel<div class="col-resizer"></div></th>
        <th>Pain / Restriction Notes<div class="col-resizer"></div></th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td class="font-semibold">Flexion</td>
        <td class="text-slate-400">Normal</td>
        <td><input type="text" class="excel-input text-center" placeholder="°" /></td>
        <td><input type="text" class="excel-input text-center" placeholder="°" /></td>
        <td><input type="text" class="excel-input" placeholder="Firm / stretch" /></td>
        <td><input type="text" class="excel-input text-left" placeholder="Pain-free" /></td>
      </tr>
      <tr>
        <td class="font-semibold">Extension</td>
        <td class="text-slate-400">Normal</td>
        <td><input type="text" class="excel-input text-center" placeholder="°" /></td>
        <td><input type="text" class="excel-input text-center" placeholder="°" /></td>
        <td><input type="text" class="excel-input" placeholder="Firm / bone" /></td>
        <td><input type="text" class="excel-input text-left" placeholder="Pain-free" /></td>
      </tr>
      <tr>
        <td class="font-semibold">Lateral Flexion / Rotation</td>
        <td class="text-slate-400">Normal</td>
        <td><input type="text" class="excel-input text-center" placeholder="°" /></td>
        <td><input type="text" class="excel-input text-center" placeholder="°" /></td>
        <td><input type="text" class="excel-input" placeholder="Tissue stretch" /></td>
        <td><input type="text" class="excel-input text-left" placeholder="Symmetric" /></td>
      </tr>
    </tbody>
  </table>
</div>\n`);
  });

  $('sp-insert-neuro')?.addEventListener('click', () => {
    insertInSpEditor(`\n<div class="excel-table-wrap">
  <table class="excel-table">
    <thead>
      <tr>
        <th style="width: 80px;">Level<div class="col-resizer"></div></th>
        <th style="width: 150px;">Dermatome Sensory<div class="col-resizer"></div></th>
        <th style="width: 150px;">Myotome Key Muscle<div class="col-resizer"></div></th>
        <th style="width: 110px;">Power (0-5)<div class="col-resizer"></div></th>
        <th style="width: 120px;">Reflex (0-4+)<div class="col-resizer"></div></th>
        <th>Clinical Notes<div class="col-resizer"></div></th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td class="font-bold text-center">L4 / C5</td>
        <td>Medial foot / Lateral arm</td>
        <td>Tibialis Anterior / Deltoid</td>
        <td><input type="text" class="excel-input text-center" placeholder="5/5" /></td>
        <td><input type="text" class="excel-input text-center" placeholder="2+" /></td>
        <td><input type="text" class="excel-input" placeholder="Intact" /></td>
      </tr>
      <tr>
        <td class="font-bold text-center">L5 / C6</td>
        <td>Dorsum foot / Thumb</td>
        <td>EHL / Wrist Extensors</td>
        <td><input type="text" class="excel-input text-center" placeholder="5/5" /></td>
        <td><input type="text" class="excel-input text-center" placeholder="2+" /></td>
        <td><input type="text" class="excel-input" placeholder="Intact" /></td>
      </tr>
      <tr>
        <td class="font-bold text-center">S1 / C7</td>
        <td>Lateral foot / Middle finger</td>
        <td>Gastrocs / Triceps</td>
        <td><input type="text" class="excel-input text-center" placeholder="5/5" /></td>
        <td><input type="text" class="excel-input text-center" placeholder="2+" /></td>
        <td><input type="text" class="excel-input" placeholder="Intact" /></td>
      </tr>
    </tbody>
  </table>
</div>\n`);
  });

  $('sp-insert-stability')?.addEventListener('click', () => {
    insertInSpEditor(`\n<div class="excel-table-wrap">
  <table class="excel-table">
    <thead>
      <tr>
        <th style="width: 160px;">Structure Tested<div class="col-resizer"></div></th>
        <th style="width: 160px;">Test Performed<div class="col-resizer"></div></th>
        <th style="width: 130px;">Laxity Grade<div class="col-resizer"></div></th>
        <th style="width: 130px;">Endpoint Quality<div class="col-resizer"></div></th>
        <th>Symptom Reproduction<div class="col-resizer"></div></th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td class="font-semibold">ACL / Collateral</td>
        <td>Lachman / Stress test</td>
        <td><input type="text" class="excel-input text-center" placeholder="Grade 0" /></td>
        <td><input type="text" class="excel-input text-center" placeholder="Crisp &amp; firm" /></td>
        <td><input type="text" class="excel-input" placeholder="Pain-free" /></td>
      </tr>
      <tr>
        <td class="font-semibold">Meniscus / Labrum</td>
        <td>McMurray / Compression</td>
        <td><input type="text" class="excel-input text-center" placeholder="Negative" /></td>
        <td><input type="text" class="excel-input text-center" placeholder="Smooth" /></td>
        <td><input type="text" class="excel-input" placeholder="No click" /></td>
      </tr>
    </tbody>
  </table>
</div>\n`);
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
    const code = (prefix === '!' ? rawCode.toUpperCase() : rawCode);
    
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
           ['@', '!'].includes(char);
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
