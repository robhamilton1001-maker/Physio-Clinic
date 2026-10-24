'use strict';

/**
 * ══════════════════════════════════════════════════════════════════════════════
 *  PHYSIO CLINIC — PHASED S&C AND REHAB BUILDER (rehabBuilder.js)
 *  3-Tier Periodized Program Builder with Visual Cards & Exercise Library.
 *  Exposed as window.RehabBuilder — called by renderer.js.
 * ══════════════════════════════════════════════════════════════════════════════
 */

window.RehabBuilder = (() => {

  // ── Days of the Week & Categories ───────────────────────────────────────────
  const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const CATEGORIES = [
    'All',
    'Knee & Quadriceps',
    'Hamstrings & Posterior Chain',
    'Foot & Ankle',
    'Shoulder & Rotator Cuff',
    'Spine & Core'
  ];

  // ── State ───────────────────────────────────────────────────────────────────
  let inited = false;
  let exercises = [];
  let templates = [];
  let patients = [];

  let activeWeek = 1;
  let activeDay = 'Mon';
  let activeLibCategory = 'All';
  let replaceTarget = null; // { weekIdx, day, exIdx }

  let program = {
    id: null,
    patient_id: null,
    title: 'New Rehabilitation Protocol',
    duration_weeks: 4,
    weeks: []
  };

  // ── Helper: Blank Program Generator ─────────────────────────────────────────
  function createBlankWeeks(numWeeks) {
    const weeks = [];
    for (let w = 1; w <= numWeeks; w++) {
      const daysObj = {};
      DAYS.forEach(d => { daysObj[d] = []; });
      weeks.push({
        week_num: w,
        title: `Week ${w}`,
        focus: w <= 2 ? 'Early Activation & Tissue Tolerance' : 'Progressive Resistance & Functional Capacity',
        days: daysObj
      });
    }
    return weeks;
  }

  // ── Helper: Format Regimen for Clinical SOAP Note ───────────────────────────
  function formatProgramForSoapNote(prog, weekNum) {
    const w = prog.weeks.find(x => x.week_num === weekNum) || prog.weeks[0];
    if (!w) return '';

    const lines = [];
    lines.push(`### Prescribed Rehabilitation Program: ${prog.title} (Week ${w.week_num})`);
    if (w.focus) lines.push(`*Focus: ${w.focus}*`);
    lines.push('');

    let hasAny = false;
    DAYS.forEach(day => {
      const dayExs = w.days[day] || [];
      if (dayExs.length > 0) {
        hasAny = true;
        lines.push(`**${day}:**`);
        dayExs.forEach(ex => {
          const setsReps = `${ex.sets || 3} sets x ${ex.reps || '10'}`;
          const hold = ex.hold_sec && ex.hold_sec !== '—' ? ` (Hold: ${ex.hold_sec})` : '';
          const wt = ex.weight_kg ? ` [${ex.weight_kg}]` : '';
          const freq = ex.frequency ? ` • ${ex.frequency}` : '';
          const cues = ex.cues ? `\n  - *Cues:* ${ex.cues}` : '';
          lines.push(`- **${ex.name}**: ${setsReps}${hold}${wt}${freq}${cues}`);
        });
        lines.push('');
      }
    });

    if (!hasAny) {
      lines.push('*(No specific exercises prescribed for this week)*');
    }

    return lines.join('\n');
  }

  // ── UI Rendering: Tier 1 (Header & Template Selection) ──────────────────────
  function renderTier1Header() {
    const titleInput = document.getElementById('rb-program-title');
    if (titleInput) titleInput.value = program.title || '';

    const durSelect = document.getElementById('rb-duration-select');
    if (durSelect) durSelect.value = String(program.duration_weeks || 4);

    // Populate Templates dropdown
    const protoSelect = document.getElementById('rb-protocol-select');
    if (protoSelect) {
      protoSelect.innerHTML = '<option value="">Choose Pre-Built Protocol…</option>';
      templates.forEach(t => {
        const opt = document.createElement('option');
        opt.value = t.id;
        opt.textContent = `${t.name} (${t.duration_weeks}w - ${t.category})`;
        protoSelect.appendChild(opt);
      });
    }

    // Populate Patients dropdown
    const patSelect = document.getElementById('rb-patient-select');
    if (patSelect) {
      patSelect.innerHTML = '<option value="">None (Standalone)</option>';
      patients.forEach(p => {
        const opt = document.createElement('option');
        opt.value = p.id;
        opt.textContent = `${p.last_name}, ${p.first_name} (ID #${p.id})`;
        if (program.patient_id && Number(program.patient_id) === Number(p.id)) {
          opt.selected = true;
        }
        patSelect.appendChild(opt);
      });
    }
  }

  // ── UI Rendering: Tier 2 (Weeks & Days Navigation) ──────────────────────────
  function renderTier2Timeline() {
    // Week Tabs
    const weekTabsEl = document.getElementById('rb-week-tabs');
    if (weekTabsEl) {
      weekTabsEl.innerHTML = '';
      for (let w = 1; w <= program.duration_weeks; w++) {
        const btn = document.createElement('button');
        btn.type = 'button';
        const isActive = w === activeWeek;
        btn.className = `px-3 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 ${
          isActive
            ? 'bg-indigo-600 text-white shadow-sm ring-1 ring-indigo-400'
            : 'bg-slate-800 text-slate-300 hover:bg-slate-750 hover:text-white border border-slate-700/60'
        }`;
        btn.innerHTML = `<span>Week ${w}</span>`;
        btn.addEventListener('click', () => {
          activeWeek = w;
          renderTier2Timeline();
          renderTier3Cards();
        });
        weekTabsEl.appendChild(btn);
      }
    }

    // Day Pills
    const dayPillsEl = document.getElementById('rb-day-pills');
    if (dayPillsEl) {
      dayPillsEl.innerHTML = '';
      const currentWeekData = program.weeks[activeWeek - 1] || { days: {} };

      DAYS.forEach(day => {
        const exCount = (currentWeekData.days[day] || []).length;
        const isActive = day === activeDay;
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = `px-2.5 py-1 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 ${
          isActive
            ? 'bg-indigo-600 text-white shadow-sm'
            : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/60'
        }`;
        btn.innerHTML = `
          <span>${day}</span>
          <span class="text-[10px] px-1.5 py-0.2 rounded-full ${
            exCount > 0 ? (isActive ? 'bg-indigo-400/30 text-white' : 'bg-slate-700 text-indigo-300') : 'text-slate-600'
          }">${exCount}</span>
        `;
        btn.addEventListener('click', () => {
          activeDay = day;
          renderTier2Timeline();
          renderTier3Cards();
        });
        dayPillsEl.appendChild(btn);
      });
    }
  }

  // ── UI Rendering: Tier 3 (Visual Exercise Cards) ────────────────────────────
  function renderTier3Cards() {
    const heading = document.getElementById('rb-active-day-heading');
    if (heading) {
      heading.textContent = `Week ${activeWeek} — ${activeDay} Routine`;
    }

    const currentWeekData = program.weeks[activeWeek - 1];
    if (!currentWeekData) return;

    const dayExercises = currentWeekData.days[activeDay] || [];
    const countBadge = document.getElementById('rb-day-count-badge');
    if (countBadge) {
      countBadge.textContent = `${dayExercises.length} exercise${dayExercises.length === 1 ? '' : 's'}`;
    }

    const container = document.getElementById('rb-exercise-cards-container');
    const emptyState = document.getElementById('rb-cards-empty-state');

    if (!container) return;
    container.innerHTML = '';

    if (dayExercises.length === 0) {
      if (emptyState) emptyState.classList.remove('hidden');
      return;
    }

    if (emptyState) emptyState.classList.add('hidden');

    dayExercises.forEach((ex, idx) => {
      const card = document.createElement('div');
      card.className = 'card-exercise bg-slate-900 border border-slate-800 hover:border-slate-700/90 rounded-xl p-4 shadow-lg transition-all space-y-3';

      const thumbSrc = ex.thumbnail_path || "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%236366f1' stroke-width='2'%3E%3Cpath d='M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6'/%3E%3C/svg%3E";

      card.innerHTML = `
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800/80">
          <div class="flex items-center gap-3 min-w-0">
            <!-- Thumbnail / Vector Preview -->
            <div class="h-12 w-12 rounded-lg bg-slate-800/90 border border-slate-700/60 p-1.5 flex items-center justify-center shrink-0 shadow-inner">
              <img src="${thumbSrc}" alt="${ex.name}" class="h-full w-full object-contain" />
            </div>

            <!-- Title & Category -->
            <div class="min-w-0 flex-1">
              <div class="flex items-center gap-2">
                <input type="text" class="card-title-input font-bold text-sm text-slate-100 bg-transparent border-0 focus:ring-1 focus:ring-indigo-500 rounded px-1.5 py-0.5 w-full hover:bg-slate-800/60 transition-colors"
                       value="${escapeAttr(ex.name)}" />
              </div>
              <span class="inline-block px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider rounded-md bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 mt-1">
                ${escapeHtml(ex.category || 'General')}
              </span>
            </div>
          </div>

          <!-- Card Top Actions -->
          <div class="flex items-center gap-1 self-end sm:self-auto shrink-0 bg-slate-800/80 rounded-lg p-1 border border-slate-700/60">
            <button type="button" class="btn-card-replace text-slate-400 hover:text-indigo-400 p-1.5 rounded hover:bg-slate-700/60 transition-colors" title="Quick-Replace Exercise">
              <span class="text-xs">⇄</span>
            </button>
            <button type="button" class="btn-card-up text-slate-400 hover:text-slate-100 p-1.5 rounded hover:bg-slate-700/60 transition-colors ${idx === 0 ? 'opacity-30 pointer-events-none' : ''}" title="Move Up">
              <span class="text-xs">▲</span>
            </button>
            <button type="button" class="btn-card-down text-slate-400 hover:text-slate-100 p-1.5 rounded hover:bg-slate-700/60 transition-colors ${idx === dayExercises.length - 1 ? 'opacity-30 pointer-events-none' : ''}" title="Move Down">
              <span class="text-xs">▼</span>
            </button>
            <button type="button" class="btn-card-dup text-slate-400 hover:text-emerald-400 p-1.5 rounded hover:bg-slate-700/60 transition-colors" title="Duplicate Exercise">
              <span class="text-xs">+</span>
            </button>
            <button type="button" class="btn-card-del text-slate-400 hover:text-rose-400 p-1.5 rounded hover:bg-slate-700/60 transition-colors" title="Delete Exercise">
              <span class="text-xs">🗑️</span>
            </button>
          </div>
        </div>

        <!-- Dosage Chips Grid -->
        <div class="grid grid-cols-2 sm:grid-cols-5 gap-2.5 pt-1">
          <div class="dosage-chip bg-slate-800/60 border border-slate-700/50 rounded-lg p-2">
            <label class="block text-[10px] font-semibold uppercase tracking-wider text-slate-500 mb-1">Sets</label>
            <input type="number" min="1" max="15" class="dosage-sets w-full bg-slate-900 border border-slate-700/80 rounded px-2 py-1 text-xs text-slate-100 font-mono focus:border-indigo-500 focus:outline-none"
                   value="${ex.sets || 3}" />
          </div>

          <div class="dosage-chip bg-slate-800/60 border border-slate-700/50 rounded-lg p-2">
            <label class="block text-[10px] font-semibold uppercase tracking-wider text-slate-500 mb-1">Reps / Tempo</label>
            <input type="text" class="dosage-reps w-full bg-slate-900 border border-slate-700/80 rounded px-2 py-1 text-xs text-slate-100 font-mono focus:border-indigo-500 focus:outline-none"
                   value="${escapeAttr(ex.reps || '10')}" placeholder="10-12" />
          </div>

          <div class="dosage-chip bg-slate-800/60 border border-slate-700/50 rounded-lg p-2">
            <label class="block text-[10px] font-semibold uppercase tracking-wider text-slate-500 mb-1">Hold (sec)</label>
            <input type="text" class="dosage-hold w-full bg-slate-900 border border-slate-700/80 rounded px-2 py-1 text-xs text-slate-100 font-mono focus:border-indigo-500 focus:outline-none"
                   value="${escapeAttr(ex.hold_sec || '—')}" placeholder="45s" />
          </div>

          <div class="dosage-chip bg-slate-800/60 border border-slate-700/50 rounded-lg p-2">
            <label class="block text-[10px] font-semibold uppercase tracking-wider text-slate-500 mb-1">Load / Resistance</label>
            <input type="text" class="dosage-weight w-full bg-slate-900 border border-slate-700/80 rounded px-2 py-1 text-xs text-slate-100 font-mono focus:border-indigo-500 focus:outline-none"
                   value="${escapeAttr(ex.weight_kg || 'Bodyweight')}" placeholder="Band / 10kg" />
          </div>

          <div class="dosage-chip bg-slate-800/60 border border-slate-700/50 rounded-lg p-2 col-span-2 sm:col-span-1">
            <label class="block text-[10px] font-semibold uppercase tracking-wider text-slate-500 mb-1">Frequency</label>
            <input type="text" class="dosage-freq w-full bg-slate-900 border border-slate-700/80 rounded px-2 py-1 text-xs text-slate-100 font-mono focus:border-indigo-500 focus:outline-none"
                   value="${escapeAttr(ex.frequency || '1x/day')}" placeholder="1x/day" />
          </div>
        </div>

        <!-- Coaching Cues & Instructions -->
        <div class="pt-1">
          <input type="text" class="dosage-cues w-full bg-slate-800/50 hover:bg-slate-800 focus:bg-slate-900 border border-slate-700/60 focus:border-indigo-500 rounded-lg px-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none transition-all"
                 value="${escapeAttr(ex.cues || '')}" placeholder="Coaching cues (e.g. Keep shins vertical, 3s eccentric descent, avoid hip drop)..." />
        </div>
      `;

      // Wire inputs
      const titleInp = card.querySelector('.card-title-input');
      titleInp?.addEventListener('input', (e) => { ex.name = e.target.value; });

      const setsInp = card.querySelector('.dosage-sets');
      setsInp?.addEventListener('input', (e) => { ex.sets = parseInt(e.target.value, 10) || 1; });

      const repsInp = card.querySelector('.dosage-reps');
      repsInp?.addEventListener('input', (e) => { ex.reps = e.target.value; });

      const holdInp = card.querySelector('.dosage-hold');
      holdInp?.addEventListener('input', (e) => { ex.hold_sec = e.target.value; });

      const weightInp = card.querySelector('.dosage-weight');
      weightInp?.addEventListener('input', (e) => { ex.weight_kg = e.target.value; });

      const freqInp = card.querySelector('.dosage-freq');
      freqInp?.addEventListener('input', (e) => { ex.frequency = e.target.value; });

      const cuesInp = card.querySelector('.dosage-cues');
      cuesInp?.addEventListener('input', (e) => { ex.cues = e.target.value; });

      // Actions: Reorder up
      card.querySelector('.btn-card-up')?.addEventListener('click', () => {
        if (idx > 0) {
          const temp = dayExercises[idx - 1];
          dayExercises[idx - 1] = dayExercises[idx];
          dayExercises[idx] = temp;
          renderTier3Cards();
        }
      });

      // Actions: Reorder down
      card.querySelector('.btn-card-down')?.addEventListener('click', () => {
        if (idx < dayExercises.length - 1) {
          const temp = dayExercises[idx + 1];
          dayExercises[idx + 1] = dayExercises[idx];
          dayExercises[idx] = temp;
          renderTier3Cards();
        }
      });

      // Actions: Duplicate
      card.querySelector('.btn-card-dup')?.addEventListener('click', () => {
        const cloned = JSON.parse(JSON.stringify(ex));
        cloned.id = `ex_${Math.random().toString(36).slice(2, 9)}`;
        dayExercises.splice(idx + 1, 0, cloned);
        renderTier2Timeline();
        renderTier3Cards();
      });

      // Actions: Delete
      card.querySelector('.btn-card-del')?.addEventListener('click', () => {
        dayExercises.splice(idx, 1);
        renderTier2Timeline();
        renderTier3Cards();
      });

      // Actions: Quick Replace
      card.querySelector('.btn-card-replace')?.addEventListener('click', () => {
        openQuickReplaceModal(activeWeek - 1, activeDay, idx);
      });

      container.appendChild(card);
    });
  }

  // ── UI Rendering: Bottom Exercise Library Tray ──────────────────────────────
  function renderLibraryTray() {
    // 1. Category Chips
    const catChipsEl = document.getElementById('rb-lib-category-chips');
    if (catChipsEl) {
      catChipsEl.innerHTML = '';
      CATEGORIES.forEach(cat => {
        const btn = document.createElement('button');
        btn.type = 'button';
        const isAct = cat === activeLibCategory;
        btn.className = `px-2.5 py-1 text-[11px] font-medium rounded-full shrink-0 transition-colors ${
          isAct
            ? 'bg-indigo-600 text-white'
            : 'bg-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-700/80 border border-slate-700/60'
        }`;
        btn.textContent = cat;
        btn.addEventListener('click', () => {
          activeLibCategory = cat;
          renderLibraryTray();
        });
        catChipsEl.appendChild(btn);
      });
    }

    // 2. Filter & Render Quick-Add Cards
    const searchVal = (document.getElementById('rb-lib-search')?.value || '').toLowerCase().trim();
    const grid = document.getElementById('rb-lib-quick-add-grid');
    if (!grid) return;
    grid.innerHTML = '';

    const filtered = exercises.filter(ex => {
      if (activeLibCategory !== 'All' && ex.category !== activeLibCategory) return false;
      if (searchVal) {
        return ex.name.toLowerCase().includes(searchVal) ||
               (ex.cues && ex.cues.toLowerCase().includes(searchVal)) ||
               (ex.category && ex.category.toLowerCase().includes(searchVal));
      }
      return true;
    });

    if (filtered.length === 0) {
      grid.innerHTML = '<p class="text-xs text-slate-500 py-3 italic">No matching exercises found in library.</p>';
      return;
    }

    filtered.forEach(ex => {
      const card = document.createElement('div');
      card.className = 'quick-add-pill flex-none flex items-center gap-2.5 bg-slate-800/90 hover:bg-slate-800 border border-slate-700/80 hover:border-indigo-500/60 rounded-xl p-2 cursor-pointer transition-all shadow-sm max-w-[240px] group';
      
      const thumbSrc = ex.thumbnail_path || "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%236366f1' stroke-width='2'%3E%3Cpath d='M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6'/%3E%3C/svg%3E";

      card.innerHTML = `
        <div class="h-9 w-9 rounded-lg bg-slate-900 border border-slate-700/60 p-1 flex items-center justify-center shrink-0 group-hover:border-indigo-500/50 transition-colors">
          <img src="${thumbSrc}" alt="${ex.name}" class="h-full w-full object-contain" />
        </div>
        <div class="min-w-0 pr-1">
          <p class="text-xs font-semibold text-slate-200 group-hover:text-indigo-300 truncate transition-colors">${escapeHtml(ex.name)}</p>
          <p class="text-[10px] text-slate-400 font-mono mt-0.5">${ex.default_sets || 3}x${escapeHtml(ex.default_reps || '10')}</p>
        </div>
        <span class="text-slate-500 group-hover:text-indigo-400 text-sm font-bold ml-auto pr-1">+</span>
      `;

      card.addEventListener('click', () => {
        addExerciseToCurrentDay(ex);
      });

      grid.appendChild(card);
    });
  }

  // ── Actions: Add Exercise to Current Day ─────────────────────────────────────
  function addExerciseToCurrentDay(ex) {
    const currentWeekData = program.weeks[activeWeek - 1];
    if (!currentWeekData) return;

    if (!currentWeekData.days[activeDay]) {
      currentWeekData.days[activeDay] = [];
    }

    const newEx = {
      id: `ex_${Math.random().toString(36).slice(2, 9)}`,
      name: ex.name,
      category: ex.category || 'General',
      thumbnail_path: ex.thumbnail_path || null,
      sets: ex.default_sets || 3,
      reps: ex.default_reps || '10',
      hold_sec: ex.default_reps && ex.default_reps.includes('s') ? ex.default_reps : '—',
      weight_kg: 'Bodyweight',
      frequency: '1x/day',
      cues: ex.cues || ''
    };

    currentWeekData.days[activeDay].push(newEx);
    renderTier2Timeline();
    renderTier3Cards();
  }

  // ── Actions: Quick Replace Modal ────────────────────────────────────────────
  function openQuickReplaceModal(weekIdx, day, exIdx) {
    replaceTarget = { weekIdx, day, exIdx };
    const modal = document.getElementById('modal-quick-replace');
    if (!modal) return;

    modal.classList.remove('opacity-0', 'pointer-events-none');

    const searchInput = document.getElementById('modal-replace-search');
    if (searchInput) {
      searchInput.value = '';
      searchInput.focus();
    }

    renderQuickReplaceList('');
  }

  function closeQuickReplaceModal() {
    replaceTarget = null;
    const modal = document.getElementById('modal-quick-replace');
    if (modal) modal.classList.add('opacity-0', 'pointer-events-none');
  }

  function renderQuickReplaceList(query) {
    const listEl = document.getElementById('modal-replace-list');
    if (!listEl) return;
    listEl.innerHTML = '';

    const q = (query || '').toLowerCase().trim();
    const filtered = exercises.filter(ex => {
      if (!q) return true;
      return ex.name.toLowerCase().includes(q) || (ex.category && ex.category.toLowerCase().includes(q));
    });

    if (filtered.length === 0) {
      listEl.innerHTML = '<p class="text-xs text-slate-500 py-4 text-center">No matching replacement exercise found.</p>';
      return;
    }

    filtered.forEach(ex => {
      const item = document.createElement('div');
      item.className = 'flex items-center justify-between p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:border-indigo-500 dark:hover:border-indigo-500 hover:bg-indigo-50/50 dark:hover:bg-slate-800 cursor-pointer transition-all';
      
      const thumbSrc = ex.thumbnail_path || "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%236366f1' stroke-width='2'%3E%3Cpath d='M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6'/%3E%3C/svg%3E";

      item.innerHTML = `
        <div class="flex items-center gap-3">
          <div class="h-8 w-8 rounded bg-slate-100 dark:bg-slate-800 p-1 flex items-center justify-center shrink-0">
            <img src="${thumbSrc}" alt="${ex.name}" class="h-full w-full object-contain" />
          </div>
          <div>
            <p class="text-xs font-semibold text-slate-900 dark:text-slate-100">${escapeHtml(ex.name)}</p>
            <p class="text-[10px] text-slate-500">${escapeHtml(ex.category || 'General')}</p>
          </div>
        </div>
        <span class="text-xs font-semibold text-indigo-600 dark:text-indigo-400">Select ⇄</span>
      `;

      item.addEventListener('click', () => {
        if (replaceTarget) {
          const { weekIdx, day, exIdx } = replaceTarget;
          const targetEx = program.weeks[weekIdx]?.days[day]?.[exIdx];
          if (targetEx) {
            targetEx.name = ex.name;
            targetEx.category = ex.category;
            targetEx.thumbnail_path = ex.thumbnail_path;
            targetEx.cues = ex.cues || targetEx.cues;
            renderTier3Cards();
          }
        }
        closeQuickReplaceModal();
      });

      listEl.appendChild(item);
    });
  }

  // ── Actions: Save as Template Modal ─────────────────────────────────────────
  function openSaveTemplateModal() {
    const modal = document.getElementById('modal-save-template');
    if (!modal) return;

    modal.classList.remove('opacity-0', 'pointer-events-none');
    const nameInput = document.getElementById('modal-template-name-input');
    if (nameInput) {
      nameInput.value = program.title || 'Custom Rehab Protocol';
      nameInput.focus();
    }

    const durDesc = document.getElementById('modal-template-duration-desc');
    if (durDesc) durDesc.textContent = `${program.duration_weeks} Weeks (${program.weeks.length} periodized cycles)`;
  }

  function closeSaveTemplateModal() {
    const modal = document.getElementById('modal-save-template');
    if (modal) modal.classList.add('opacity-0', 'pointer-events-none');
  }

  // ── Event Wiring ────────────────────────────────────────────────────────────
  function wireEvents() {
    // Program title
    document.getElementById('rb-program-title')?.addEventListener('input', (e) => {
      program.title = e.target.value;
    });

    // Duration selector
    document.getElementById('rb-duration-select')?.addEventListener('change', (e) => {
      const newDur = parseInt(e.target.value, 10) || 4;
      if (newDur === program.duration_weeks) return;

      const currentWeeksCount = program.weeks.length;
      if (newDur > currentWeeksCount) {
        for (let w = currentWeeksCount + 1; w <= newDur; w++) {
          const daysObj = {};
          DAYS.forEach(d => { daysObj[d] = []; });
          program.weeks.push({
            week_num: w,
            title: `Week ${w}`,
            focus: 'Progressive Loading & Functional Capacity',
            days: daysObj
          });
        }
      } else if (newDur < currentWeeksCount) {
        program.weeks = program.weeks.slice(0, newDur);
        if (activeWeek > newDur) activeWeek = newDur;
      }

      program.duration_weeks = newDur;
      renderTier2Timeline();
      renderTier3Cards();
    });

    // Auto-Load Protocol Select
    document.getElementById('rb-protocol-select')?.addEventListener('change', async (e) => {
      const tmplId = e.target.value;
      if (!tmplId) return;

      const tmpl = templates.find(t => String(t.id) === String(tmplId));
      if (!tmpl) return;

      try {
        let proto = tmpl.protocol_json;
        if (typeof proto === 'string') proto = JSON.parse(proto);

        program.title = tmpl.name || proto.title || 'Rehab Protocol';
        program.duration_weeks = tmpl.duration_weeks || proto.duration_weeks || 4;
        program.weeks = proto.weeks || createBlankWeeks(program.duration_weeks);

        activeWeek = 1;
        activeDay = 'Mon';

        renderTier1Header();
        renderTier2Timeline();
        renderTier3Cards();
      } catch (err) {
        console.error('[RehabBuilder] Error loading protocol:', err);
        alert('Failed to load protocol: ' + err.message);
      }
    });

    // Patient select dropdown
    document.getElementById('rb-patient-select')?.addEventListener('change', (e) => {
      program.patient_id = e.target.value ? Number(e.target.value) : null;
    });

    // Duplicate Week button
    document.getElementById('rb-btn-duplicate-week')?.addEventListener('click', () => {
      if (activeWeek >= program.duration_weeks) {
        alert(`You are already on the final week (Week ${activeWeek}). Increase the program duration to duplicate further.`);
        return;
      }

      const currentWeekData = program.weeks[activeWeek - 1];
      const targetWeekData = program.weeks[activeWeek]; // 0-indexed for activeWeek + 1

      if (currentWeekData && targetWeekData) {
        // Deep clone days
        const clonedDays = JSON.parse(JSON.stringify(currentWeekData.days));
        targetWeekData.days = clonedDays;
        activeWeek += 1;
        renderTier2Timeline();
        renderTier3Cards();
      }
    });

    // Clear day button
    document.getElementById('rb-btn-clear-day')?.addEventListener('click', () => {
      const currentWeekData = program.weeks[activeWeek - 1];
      if (currentWeekData && currentWeekData.days[activeDay]) {
        if (currentWeekData.days[activeDay].length > 0 && confirm(`Clear all exercises for ${activeDay}?`)) {
          currentWeekData.days[activeDay] = [];
          renderTier2Timeline();
          renderTier3Cards();
        }
      }
    });

    // Add Custom Exercise button
    document.getElementById('rb-btn-add-custom-exercise')?.addEventListener('click', async () => {
      const name = prompt('Enter exercise name:');
      if (!name || !name.trim()) return;

      const cues = prompt('Enter optional coaching cues/instructions:', '') || '';
      const customEx = {
        name: name.trim(),
        category: 'Custom Rehab',
        default_sets: 3,
        default_reps: '10',
        cues: cues.trim()
      };

      try {
        const saved = await window.api.rehab.createExercise(customEx);
        exercises.push(saved);
        addExerciseToCurrentDay(saved);
        renderLibraryTray();
      } catch {
        addExerciseToCurrentDay(customEx);
      }
    });

    // Search in Library Tray
    document.getElementById('rb-lib-search')?.addEventListener('input', () => {
      renderLibraryTray();
    });

    // Save as Template button
    document.getElementById('rb-btn-save-template')?.addEventListener('click', () => {
      openSaveTemplateModal();
    });

    // Save as Template modal confirm
    document.getElementById('btn-confirm-save-template')?.addEventListener('click', async () => {
      const name = (document.getElementById('modal-template-name-input')?.value || '').trim();
      const cat = document.getElementById('modal-template-category-select')?.value || 'General Rehab';

      if (!name) {
        alert('Please enter a template protocol name.');
        return;
      }

      try {
        const payload = {
          name,
          category: cat,
          duration_weeks: program.duration_weeks,
          protocol_json: JSON.stringify({
            title: name,
            duration_weeks: program.duration_weeks,
            weeks: program.weeks
          })
        };

        const saved = await window.api.rehab.saveTemplate(payload);
        templates = await window.api.rehab.listTemplates();
        renderTier1Header();
        closeSaveTemplateModal();
        alert(`Saved protocol template "${saved.name}" to global library!`);
      } catch (err) {
        alert('Failed to save template: ' + err.message);
      }
    });

    document.getElementById('btn-close-save-template')?.addEventListener('click', closeSaveTemplateModal);
    document.getElementById('btn-cancel-save-template')?.addEventListener('click', closeSaveTemplateModal);

    // Assign to Patient button
    document.getElementById('rb-btn-assign-patient')?.addEventListener('click', async () => {
      if (!program.patient_id) {
        const patSelect = document.getElementById('rb-patient-select');
        alert('Please select a patient from the "Patient" dropdown to assign this program.');
        patSelect?.focus();
        return;
      }

      try {
        const payload = {
          id: program.id,
          patient_id: program.patient_id,
          title: program.title || 'Rehabilitation Program',
          duration_weeks: program.duration_weeks,
          schedule_json: JSON.stringify({
            title: program.title,
            duration_weeks: program.duration_weeks,
            weeks: program.weeks
          })
        };

        const saved = await window.api.rehab.saveProgram(payload);
        program.id = saved.id;
        alert(`Program "${saved.title}" successfully assigned to patient (#${saved.patient_id})!`);
      } catch (err) {
        alert('Failed to assign program: ' + err.message);
      }
    });

    // Copy for SOAP Note button
    document.getElementById('rb-btn-copy-note')?.addEventListener('click', async () => {
      const noteText = formatProgramForSoapNote(program, activeWeek);
      if (!noteText) {
        alert('No routine data available to copy.');
        return;
      }

      try {
        await navigator.clipboard.writeText(noteText);
        const btn = document.getElementById('rb-btn-copy-note');
        const origHtml = btn.innerHTML;
        btn.innerHTML = '<span>✅ Copied to Clipboard!</span>';
        setTimeout(() => { btn.innerHTML = origHtml; }, 2000);
      } catch {
        alert('Copied Regimen Text:\n\n' + noteText);
      }
    });

    // Quick replace modal close & search
    document.getElementById('btn-close-quick-replace')?.addEventListener('click', closeQuickReplaceModal);
    document.getElementById('modal-replace-search')?.addEventListener('input', (e) => {
      renderQuickReplaceList(e.target.value);
    });
  }

  // ── Public API: Initialize & Activate ───────────────────────────────────────
  async function activate(patientIdToLoad = null) {
    try {
      // 1. Fetch backend data
      exercises = await window.api.rehab.listExercises();
      templates = await window.api.rehab.listTemplates();
      patients = await window.api.patients.search('');

      // 2. Setup program if opening for specific patient
      if (patientIdToLoad) {
        program.patient_id = Number(patientIdToLoad);
        const patientPrograms = await window.api.rehab.listPrograms(patientIdToLoad);
        if (patientPrograms && patientPrograms.length > 0) {
          const latest = patientPrograms[0];
          program.id = latest.id;
          program.title = latest.title;
          program.duration_weeks = latest.duration_weeks;
          try {
            const sched = typeof latest.schedule_json === 'string' ? JSON.parse(latest.schedule_json) : latest.schedule_json;
            program.weeks = sched.weeks || createBlankWeeks(program.duration_weeks);
          } catch {
            program.weeks = createBlankWeeks(program.duration_weeks);
          }
        } else {
          // New program for this patient
          const targetPat = patients.find(p => Number(p.id) === Number(patientIdToLoad));
          program.id = null;
          program.title = targetPat ? `${targetPat.first_name}'s Rehab Program` : 'Patient Rehab Program';
          program.weeks = createBlankWeeks(program.duration_weeks);
        }
      } else if (!program.weeks || program.weeks.length === 0) {
        // Load first template by default if empty
        if (templates.length > 0) {
          const tmpl = templates[0];
          let proto = tmpl.protocol_json;
          if (typeof proto === 'string') proto = JSON.parse(proto);
          program.title = tmpl.name;
          program.duration_weeks = tmpl.duration_weeks;
          program.weeks = proto.weeks || createBlankWeeks(tmpl.duration_weeks);
        } else {
          program.weeks = createBlankWeeks(program.duration_weeks);
        }
      }

      if (!inited) {
        wireEvents();
        inited = true;
      }

      renderTier1Header();
      renderTier2Timeline();
      renderTier3Cards();
      renderLibraryTray();
    } catch (err) {
      console.error('[RehabBuilder] Activation error:', err);
    }
  }

  // Open builder for specific patient
  function openForPatient(patientId) {
    if (typeof window.switchView === 'function') {
      window.switchView('programs');
    }
    activate(patientId);
  }

  // Escape helpers
  function escapeHtml(str) {
    if (!str) return '';
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }
  function escapeAttr(str) {
    if (!str) return '';
    return String(str).replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  return {
    activate,
    openForPatient,
    getProgram: () => program,
    formatProgramForSoapNote
  };

})();
