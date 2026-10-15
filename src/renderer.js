'use strict';

// ═══════════════════════════════════════════════════════════════════════════
// UTILITIES
// ═══════════════════════════════════════════════════════════════════════════

/** Simple getElementById shorthand */
const $ = (id) => document.getElementById(id);

/** Debounce: delay fn execution until after `ms` ms of silence */
function debounce(fn, ms) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), ms);
  };
}

// ═══════════════════════════════════════════════════════════════════════════
// THEME ENGINE  (dark / light, persisted to localStorage)
// ═══════════════════════════════════════════════════════════════════════════

const THEME_KEY = 'clinic:theme';

function initTheme() {
  const saved   = localStorage.getItem(THEME_KEY);
  const osDark  = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const isDark  = saved ? saved === 'dark' : osDark;
  applyTheme(isDark, false); // no animation on first load
}

function applyTheme(isDark, animate = true) {
  if (animate) {
    // Briefly disable transitions to avoid FOUC on initial load, but keep
    // them for user-triggered toggles.
    document.documentElement.classList.toggle('dark', isDark);
  } else {
    // Block transitions during initial load
    document.documentElement.classList.add('no-transition');
    document.documentElement.classList.toggle('dark', isDark);
    requestAnimationFrame(() =>
      requestAnimationFrame(() =>
        document.documentElement.classList.remove('no-transition')
      )
    );
  }

  // Update toggle icon visibility
  $('icon-sun').classList.toggle('hidden', !isDark);
  $('icon-moon').classList.toggle('hidden', isDark);
  $('theme-label').textContent = isDark ? 'Light Mode' : 'Dark Mode';
}

function toggleTheme() {
  const isDark = document.documentElement.classList.contains('dark');
  localStorage.setItem(THEME_KEY, isDark ? 'light' : 'dark');
  applyTheme(!isDark, true);
}

$('btn-theme-toggle').addEventListener('click', toggleTheme);
initTheme();

// ═══════════════════════════════════════════════════════════════════════════
// NAVIGATION  (SPA view switching)
// ═══════════════════════════════════════════════════════════════════════════

const ALL_VIEWS = ['dashboard', 'patients', 'programs', 'invoicing', 'settings'];

function switchView(target) {
  ALL_VIEWS.forEach(v => {
    const el = $(`view-${v}`);
    if (!el) return;
    if (v === target) {
      el.classList.remove('hidden');
      el.classList.add('flex');
    } else {
      el.classList.remove('flex');
      el.classList.add('hidden');
    }
  });

  // Update sidebar active states
  document.querySelectorAll('[data-view]').forEach(link => {
    link.className = link.dataset.view === target
      ? 'nav-item-active'
      : 'nav-item';
  });
}

document.querySelectorAll('[data-view]').forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    switchView(link.dataset.view);
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// DIGITAL CLOCK  (ticks every second)
// ═══════════════════════════════════════════════════════════════════════════

function startClock() {
  const hEl   = $('clock-h');
  const mEl   = $('clock-m');
  const sEl   = $('clock-s');
  const dateEl = $('clock-date');

  const pad = n => String(n).padStart(2, '0');

  function tick() {
    const now = new Date();
    hEl.textContent = pad(now.getHours());
    mEl.textContent = pad(now.getMinutes());
    sEl.textContent = pad(now.getSeconds());
    dateEl.textContent = now.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  }

  tick();
  setInterval(tick, 1000);
}

startClock();

// ═══════════════════════════════════════════════════════════════════════════
// OMNI-SEARCH  (Ctrl+K shortcut, debounced query)
// ═══════════════════════════════════════════════════════════════════════════

function initSearch() {
  const input = $('omni-search');

  // Ctrl+K / Cmd+K to focus
  document.addEventListener('keydown', e => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault();
      input.focus();
      input.select();
    }
    if (e.key === 'Escape' && document.activeElement === input) {
      input.value = '';
      input.blur();
    }
  });

  const doSearch = debounce(async (query) => {
    if (!query) return;
    // TODO: wire to window.api.patients.list() with client-side filter
    console.log('[Search]', query);
  }, 300);

  input.addEventListener('input', e => doSearch(e.target.value.trim()));
}

initSearch();

// ═══════════════════════════════════════════════════════════════════════════
// DAILY SCHEDULE  (time-slot grid + drag-and-drop appointment cards)
// ═══════════════════════════════════════════════════════════════════════════

const SCHEDULE_START = 8;   // 08:00
const SCHEDULE_END   = 18;  // 18:00 (exclusive)
const SLOT_INTERVAL  = 30;  // minutes per slot

/** Demo appointments — replace with real DB data in a future phase */
const DEMO_APPOINTMENTS = [
  {
    id: 1,
    patientName: 'Sarah Mitchell',
    type: 'Initial Assessment',
    hour: 9, minute: 0, duration: 60,
    status: 'confirmed',
  },
  {
    id: 2,
    patientName: 'James Thornton',
    type: 'Follow-up Session',
    hour: 11, minute: 0, duration: 45,
    status: 'confirmed',
  },
  {
    id: 3,
    patientName: 'Emma Rodriguez',
    type: 'Dry Needling',
    hour: 14, minute: 30, duration: 30,
    status: 'pending',
  },
];

function buildSchedule() {
  const container  = $('schedule-container');
  const scheduleDateEl = $('schedule-date');

  // Header date
  scheduleDateEl.textContent = new Date().toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });

  // Build slot rows
  const fragment = document.createDocumentFragment();

  for (let h = SCHEDULE_START; h < SCHEDULE_END; h++) {
    for (let m = 0; m < 60; m += SLOT_INTERVAL) {
      fragment.appendChild(createTimeSlotRow(h, m));
    }
  }

  container.appendChild(fragment);

  // Inject demo appointment cards
  DEMO_APPOINTMENTS.forEach(appt => {
    const slotBody = document.getElementById(slotBodyId(appt.hour, appt.minute));
    if (slotBody) slotBody.appendChild(createAppointmentCard(appt));
  });

  // Add "now" indicator
  addNowIndicator();

  // Scroll to current time
  scrollToNow();
}

/** Canonical slot-body DOM ID */
function slotBodyId(h, m) {
  return `slot-${String(h).padStart(2, '0')}-${String(m).padStart(2, '0')}`;
}

/** Build a single 30-min time-slot row */
function createTimeSlotRow(h, m) {
  const isHourMark = m === 0;
  const timeStr = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;

  const row = document.createElement('div');
  row.className = [
    'flex gap-3 py-1',
    isHourMark
      ? 'border-t border-slate-200 dark:border-slate-800'
      : 'border-t border-dashed border-slate-100 dark:border-slate-800/50',
  ].join(' ');
  row.dataset.time = timeStr;

  // Time label
  const label = document.createElement('span');
  label.className = [
    'w-11 shrink-0 text-right pt-1 font-mono text-[11px] leading-none select-none',
    isHourMark
      ? 'font-medium text-slate-500 dark:text-slate-500'
      : 'text-slate-300 dark:text-slate-700',
  ].join(' ');
  label.textContent = isHourMark ? timeStr : '·';

  // Drop-target body
  const body = document.createElement('div');
  body.id = slotBodyId(h, m);
  body.className = 'flex-1 min-h-[44px] relative rounded-md transition-all duration-100 flex flex-col gap-1';
  body.dataset.time = timeStr;

  // Drag-over → highlight
  body.addEventListener('dragover', e => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    body.classList.add('drop-active');
  });
  body.addEventListener('dragleave', () => body.classList.remove('drop-active'));
  body.addEventListener('drop', e => {
    e.preventDefault();
    body.classList.remove('drop-active');
    const apptId = e.dataTransfer.getData('text/appt-id');
    const card   = document.querySelector(`[data-appt-id="${apptId}"]`);
    if (card && card.parentElement !== body) body.appendChild(card);
  });

  row.appendChild(label);
  row.appendChild(body);
  return row;
}

/** Build a draggable appointment card element */
function createAppointmentCard(appt) {
  const statusText = {
    confirmed: 'Confirmed',
    pending:   'Pending',
    completed: 'Completed',
  };
  const statusDot = {
    confirmed: 'bg-indigo-500',
    pending:   'bg-amber-400',
    completed: 'bg-emerald-500',
  };

  const card = document.createElement('div');
  card.className = `appt-card status-${appt.status}`;
  card.draggable = true;
  card.dataset.apptId = String(appt.id);

  card.innerHTML = `
    <div class="flex items-center justify-between gap-2">
      <span class="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate leading-snug">
        ${appt.patientName}
      </span>
      <span class="flex items-center gap-1 shrink-0">
        <span class="h-1.5 w-1.5 rounded-full ${statusDot[appt.status] ?? 'bg-slate-400'}"></span>
        <span class="text-[10px] font-medium text-slate-500 dark:text-slate-400">
          ${statusText[appt.status] ?? appt.status}
        </span>
      </span>
    </div>
    <span class="text-[11px] text-slate-400 dark:text-slate-500 leading-snug">
      ${appt.type} &middot; ${appt.duration}&thinsp;min
    </span>
  `;

  // Drag events
  card.addEventListener('dragstart', e => {
    e.dataTransfer.setData('text/appt-id', String(appt.id));
    e.dataTransfer.effectAllowed = 'move';
    // Defer adding class so browser can grab snapshot first
    requestAnimationFrame(() => card.classList.add('dragging'));
  });
  card.addEventListener('dragend', () => card.classList.remove('dragging'));

  return card;
}

/** Adds a thin "now" marker line at the current time slot */
function addNowIndicator() {
  const now   = new Date();
  const h     = now.getHours();
  const m     = now.getMinutes() < SLOT_INTERVAL ? 0 : SLOT_INTERVAL;

  if (h < SCHEDULE_START || h >= SCHEDULE_END) return;

  const body = document.getElementById(slotBodyId(h, m));
  if (!body) return;

  const indicator = document.createElement('div');
  indicator.className = [
    'absolute -top-px left-0 right-0 h-px z-10',
    'bg-indigo-500 dark:bg-indigo-400',
  ].join(' ');

  // Small dot on the left
  const dot = document.createElement('span');
  dot.className = [
    'absolute -left-1 -top-[3px] h-[7px] w-[7px] rounded-full',
    'bg-indigo-500 dark:bg-indigo-400',
  ].join(' ');
  indicator.appendChild(dot);

  body.style.position = 'relative';
  body.prepend(indicator);
}

/** Scroll the schedule panel to bring current time into view */
function scrollToNow() {
  const now  = new Date();
  const h    = now.getHours();
  const m    = now.getMinutes() < SLOT_INTERVAL ? 0 : SLOT_INTERVAL;

  if (h < SCHEDULE_START || h >= SCHEDULE_END) return;

  // Scroll to one slot above current time for context
  const prevH = m === 0 ? h - 1 : h;
  const prevM = m === 0 ? 30    : 0;

  const targetH = prevH >= SCHEDULE_START ? prevH : h;
  const targetM = prevH >= SCHEDULE_START ? prevM : m;
  const row = document.getElementById(slotBodyId(targetH, targetM));

  if (row) {
    row.scrollIntoView({ block: 'start', behavior: 'instant' });
  }
}

buildSchedule();

// ═══════════════════════════════════════════════════════════════════════════
// SCRATCHPAD  (auto-saved to localStorage)
// ═══════════════════════════════════════════════════════════════════════════

const SCRATCH_KEY = 'clinic:scratchpad';

function initScratchpad() {
  const el        = $('scratchpad');
  const savedEl   = $('scratchpad-saved');

  // Restore saved content
  el.value = localStorage.getItem(SCRATCH_KEY) ?? '';

  const save = debounce(() => {
    localStorage.setItem(SCRATCH_KEY, el.value);
    // Flash "Saved" indicator
    savedEl.style.opacity = '1';
    clearTimeout(savedEl._fadeTimer);
    savedEl._fadeTimer = setTimeout(() => { savedEl.style.opacity = '0'; }, 1800);
  }, 600);

  el.addEventListener('input', save);
}

initScratchpad();

// ═══════════════════════════════════════════════════════════════════════════
// QUICK STATS  (pulled from SQLite via IPC bridge)
// ═══════════════════════════════════════════════════════════════════════════

async function loadStats() {
  try {
    const todayISO = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

    const [patients, todayAppts, notes] = await Promise.all([
      window.api.dbGet(
        `SELECT COUNT(*) AS n FROM patients WHERE deleted_at IS NULL`
      ),
      window.api.dbGet(
        `SELECT COUNT(*) AS n FROM appointments
         WHERE date(scheduled_at) = ? AND status != 'cancelled'`,
        [todayISO]
      ),
      window.api.dbGet(
        `SELECT COUNT(*) AS n FROM clinical_notes`
      ),
    ]);

    $('stat-total-patients').textContent = patients?.n   ?? 0;
    $('stat-today-appts').textContent    = todayAppts?.n ?? 0;
    $('stat-notes').textContent          = notes?.n      ?? 0;

    // Also sync the schedule header pill
    $('appt-count').textContent = DEMO_APPOINTMENTS.length;

  } catch (err) {
    console.error('[Stats] Failed to load dashboard stats:', err);
  }
}

loadStats();

// ═══════════════════════════════════════════════════════════════════════════
// NEW APPOINTMENT button
// ═══════════════════════════════════════════════════════════════════════════

$('btn-new-appt').addEventListener('click', () => {
  // TODO: open a modal / slide-over in a future phase
  console.log('[UI] New appointment requested');
});
