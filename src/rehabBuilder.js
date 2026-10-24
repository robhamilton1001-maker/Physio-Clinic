'use strict';

/**
 * ══════════════════════════════════════════════════════════════════════════════
 *  PHYSIO CLINIC — PHASED S&C AND REHAB BUILDER (rehabBuilder.js)
 *  Open Sandbox Canvas, Massive Local Exercise Library & Interactive Tables.
 *  Exposed as window.RehabBuilder — consumed by renderer.js.
 * ══════════════════════════════════════════════════════════════════════════════
 */

window.RehabBuilder = (() => {

  // ── Days of the Week & Categories ───────────────────────────────────────────
  const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const CATEGORIES = [
    'All',
    'Knee & Quadriceps',
    'Hamstrings & Posterior Chain',
    'Glute & Hip',
    'Foot, Ankle & Calf',
    'Shoulder & Scapula',
    'Chest & Triceps',
    'Back & Biceps',
    'Spine & Core',
    'Custom Rehab'
  ];

  // ── State ───────────────────────────────────────────────────────────────────
  let inited = false;
  let exercises = [];
  let templates = [];
  let patients = [];

  let activeWeek = 1;
  let activeDay = 'Mon';
  let activeInlineCategory = 'All';
  let replaceTarget = null; // { weekIdx, day, exIdx }

  // Blank canvas sandbox default
  let program = {
    id: null,
    patient_id: null,
    title: 'Untitled Program',
    duration_weeks: 4,
    weeks: createBlankWeeks(4)
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

  // ── Helper: Generate Interactive Excel Table for Clinical Note ──────────────
  function generateExcelTableForProgram(prog, weekNum = 1) {
    const w = (prog.weeks || []).find(x => x.week_num === weekNum) || (prog.weeks && prog.weeks[0]);
    if (!w) return '';

    let rowsHtml = '';
    let hasAny = false;

    DAYS.forEach(day => {
      const dayExs = (w.days && w.days[day]) || [];
      if (dayExs.length > 0) {
        hasAny = true;
        dayExs.forEach(ex => {
          const setsVal = ex.sets || 3;
          const repsVal = ex.reps || '10';
          const loadVal = ex.weight_kg || 'Bodyweight';
          const restNotes = [
            ex.hold_sec && ex.hold_sec !== '—' ? `Hold: ${ex.hold_sec}` : '',
            ex.frequency && ex.frequency !== '—' ? ex.frequency : '',
            ex.cues || ''
          ].filter(Boolean).join(' • ');

          rowsHtml += `
            <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
              <td class="p-2 border border-slate-300 dark:border-slate-700 font-medium">
                ${escapeHtml(ex.name)} <span class="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400">(${day})</span>
              </td>
              <td class="p-2 border border-slate-300 dark:border-slate-700 text-center font-mono" contenteditable="true">${setsVal}</td>
              <td class="p-2 border border-slate-300 dark:border-slate-700 text-center font-mono" contenteditable="true">${escapeHtml(repsVal)}</td>
              <td class="p-2 border border-slate-300 dark:border-slate-700 text-center font-mono" contenteditable="true">${escapeHtml(loadVal)}</td>
              <td class="p-2 border border-slate-300 dark:border-slate-700" contenteditable="true">${escapeHtml(restNotes)}</td>
            </tr>`;
        });
      }
    });

    if (!hasAny) {
      rowsHtml = `
        <tr>
          <td colspan="5" class="p-4 text-center text-slate-400 dark:text-slate-500 italic border border-slate-300 dark:border-slate-700">
            No specific exercises prescribed for Week ${weekNum}
          </td>
        </tr>`;
    }

    const tableHtml = `
<div class="excel-table-container my-3 rounded-lg border border-slate-300 dark:border-slate-700 overflow-hidden shadow-sm">
  <div class="px-3 py-2 bg-slate-100 dark:bg-slate-800 border-b border-slate-300 dark:border-slate-700 flex items-center justify-between text-xs">
    <span class="font-bold text-slate-800 dark:text-slate-200">🏋️ Prescribed Program: ${escapeHtml(prog.title || 'Rehabilitation Routine')} (Week ${w.week_num})</span>
    <span class="text-[10px] text-slate-500 font-mono">${DAYS.filter(d => (w.days[d] || []).length > 0).join(', ')}</span>
  </div>
  <table class="excel-table w-full border-collapse text-xs text-left">
    <thead>
      <tr class="bg-slate-50 dark:bg-slate-850 text-slate-700 dark:text-slate-300 font-semibold border-b border-slate-300 dark:border-slate-700">
        <th class="p-2 border border-slate-300 dark:border-slate-700">Exercise</th>
        <th class="p-2 border border-slate-300 dark:border-slate-700 text-center w-16">Sets</th>
        <th class="p-2 border border-slate-300 dark:border-slate-700 text-center w-28">Reps / Tempo</th>
        <th class="p-2 border border-slate-300 dark:border-slate-700 text-center w-28">Load</th>
        <th class="p-2 border border-slate-300 dark:border-slate-700">Rest / Notes</th>
      </tr>
    </thead>
    <tbody>
      ${rowsHtml}
    </tbody>
  </table>
</div>
`;
    return tableHtml.trim();
  }

  // ── Helper: Generate Markdown/Plaintext Fallback for SOAP Note ──────────────
  function formatProgramForSoapNote(prog, weekNum) {
    const w = (prog.weeks || []).find(x => x.week_num === weekNum) || (prog.weeks && prog.weeks[0]);
    if (!w) return '';

    const lines = [];
    lines.push(`### Prescribed Rehabilitation Program: ${prog.title} (Week ${w.week_num})`);
    if (w.focus) lines.push(`*Focus: ${w.focus}*`);
    lines.push('');

    let hasAny = false;
    DAYS.forEach(day => {
      const dayExs = (w.days && w.days[day]) || [];
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
      protoSelect.innerHTML = '<option value="">Load Pre-Built Template…</option>';
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
            : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
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
            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700/60'
        }`;
        btn.innerHTML = `
          <span>${day}</span>
          <span class="text-[10px] px-1.5 py-0.2 rounded-full ${
            exCount > 0 ? (isActive ? 'bg-indigo-400/30 text-white' : 'bg-slate-200 dark:bg-slate-700 text-indigo-700 dark:text-indigo-300 font-bold') : 'text-slate-400 dark:text-slate-600'
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
    } else {
      if (emptyState) emptyState.classList.add('hidden');
    }

    dayExercises.forEach((ex, idx) => {
      const card = document.createElement('div');
      card.className = 'card-exercise bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 rounded-xl p-4 shadow-sm transition-all space-y-3';
      card.dataset.index = idx;

      card.innerHTML = `
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
          <div class="flex items-center gap-2.5 min-w-0 flex-1">
            <span class="flex h-6 w-6 items-center justify-center rounded-md bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-bold text-xs shrink-0 select-none">
              ${idx + 1}
            </span>
            <div class="min-w-0 flex-1">
              <input type="text" class="card-title-input font-bold text-sm text-slate-900 dark:text-slate-100 bg-transparent border-0 focus:ring-1 focus:ring-indigo-500 rounded px-1.5 py-0.5 w-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                     value="${escapeAttr(ex.name)}" />
            </div>
            <span class="shrink-0 inline-flex items-center px-2 py-0.5 text-[10px] uppercase font-semibold rounded-md bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-500/30">
              ${escapeHtml(ex.category || 'General')}
            </span>
          </div>

          <!-- Card Controls (Zero broken images!) -->
          <div class="flex items-center gap-1 self-end sm:self-auto shrink-0 bg-slate-50 dark:bg-slate-800 rounded-lg p-1 border border-slate-200 dark:border-slate-700">
            <button type="button" class="btn-card-replace text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 p-1.5 rounded hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors" title="Swap / Replace Exercise">
              <span class="text-xs">⇄</span>
            </button>
            <button type="button" class="btn-card-up text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 p-1.5 rounded hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors ${idx === 0 ? 'opacity-30 pointer-events-none' : ''}" title="Move Up">
              <span class="text-xs">▲</span>
            </button>
            <button type="button" class="btn-card-down text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 p-1.5 rounded hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors ${idx === dayExercises.length - 1 ? 'opacity-30 pointer-events-none' : ''}" title="Move Down">
              <span class="text-xs">▼</span>
            </button>
            <button type="button" class="btn-card-dup text-slate-500 hover:text-emerald-600 dark:hover:text-emerald-400 p-1.5 rounded hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors" title="Duplicate Exercise">
              <span class="text-xs">+</span>
            </button>
            <button type="button" class="btn-card-del text-slate-500 hover:text-rose-600 dark:hover:text-rose-400 p-1.5 rounded hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors" title="Delete Exercise">
              <span class="text-xs">🗑️</span>
            </button>
          </div>
        </div>

        <!-- Dosage Inputs (Tab-navigable: Sets -> Reps -> Hold -> Load -> Frequency -> Cues) -->
        <div class="grid grid-cols-2 sm:grid-cols-5 gap-2.5 pt-1">
          <div class="dosage-chip bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 rounded-lg p-2">
            <label class="block text-[10px] font-semibold uppercase tracking-wider text-slate-500 mb-1">Sets</label>
            <input type="number" min="1" max="15" tabindex="${idx * 10 + 1}"
                   class="dosage-sets w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded px-2 py-1 text-xs text-slate-900 dark:text-slate-100 font-mono focus:border-indigo-500 focus:outline-none"
                   value="${ex.sets || 3}" />
          </div>

          <div class="dosage-chip bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 rounded-lg p-2">
            <label class="block text-[10px] font-semibold uppercase tracking-wider text-slate-500 mb-1">Reps / Tempo</label>
            <input type="text" tabindex="${idx * 10 + 2}"
                   class="dosage-reps w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded px-2 py-1 text-xs text-slate-900 dark:text-slate-100 font-mono focus:border-indigo-500 focus:outline-none"
                   value="${escapeAttr(ex.reps || '10')}" placeholder="10-12" />
          </div>

          <div class="dosage-chip bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 rounded-lg p-2">
            <label class="block text-[10px] font-semibold uppercase tracking-wider text-slate-500 mb-1">Hold (sec)</label>
            <input type="text" tabindex="${idx * 10 + 3}"
                   class="dosage-hold w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded px-2 py-1 text-xs text-slate-900 dark:text-slate-100 font-mono focus:border-indigo-500 focus:outline-none"
                   value="${escapeAttr(ex.hold_sec || '—')}" placeholder="45s" />
          </div>

          <div class="dosage-chip bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 rounded-lg p-2">
            <label class="block text-[10px] font-semibold uppercase tracking-wider text-slate-500 mb-1">Load / Res.</label>
            <input type="text" tabindex="${idx * 10 + 4}"
                   class="dosage-weight w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded px-2 py-1 text-xs text-slate-900 dark:text-slate-100 font-mono focus:border-indigo-500 focus:outline-none"
                   value="${escapeAttr(ex.weight_kg || 'Bodyweight')}" placeholder="Band / 10kg" />
          </div>

          <div class="dosage-chip bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 rounded-lg p-2 col-span-2 sm:col-span-1">
            <label class="block text-[10px] font-semibold uppercase tracking-wider text-slate-500 mb-1">Frequency</label>
            <input type="text" tabindex="${idx * 10 + 5}"
                   class="dosage-freq w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded px-2 py-1 text-xs text-slate-900 dark:text-slate-100 font-mono focus:border-indigo-500 focus:outline-none"
                   value="${escapeAttr(ex.frequency || '1x/day')}" placeholder="1x/day" />
          </div>
        </div>

        <!-- Full-Width Coaching Cues & Instructions -->
        <div class="pt-1">
          <input type="text" tabindex="${idx * 10 + 6}"
                 class="dosage-cues w-full bg-slate-50 dark:bg-slate-800/50 hover:bg-white dark:hover:bg-slate-800 focus:bg-white dark:focus:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:border-indigo-500 rounded-lg px-3 py-1.5 text-xs text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none transition-all"
                 value="${escapeAttr(ex.cues || '')}" placeholder="Coaching cues (e.g. Keep shins vertical, 3s eccentric descent, avoid hip drop)..." />
        </div>
      `;

      // Wire live inputs
      card.querySelector('.card-title-input')?.addEventListener('input', (e) => { ex.name = e.target.value; });
      card.querySelector('.dosage-sets')?.addEventListener('input', (e) => { ex.sets = parseInt(e.target.value, 10) || 1; });
      card.querySelector('.dosage-reps')?.addEventListener('input', (e) => { ex.reps = e.target.value; });
      card.querySelector('.dosage-hold')?.addEventListener('input', (e) => { ex.hold_sec = e.target.value; });
      card.querySelector('.dosage-weight')?.addEventListener('input', (e) => { ex.weight_kg = e.target.value; });
      card.querySelector('.dosage-freq')?.addEventListener('input', (e) => { ex.frequency = e.target.value; });
      card.querySelector('.dosage-cues')?.addEventListener('input', (e) => { ex.cues = e.target.value; });

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

      // Actions: Swap / Replace
      card.querySelector('.btn-card-replace')?.addEventListener('click', () => {
        openQuickReplaceModal(activeWeek - 1, activeDay, idx);
      });

      container.appendChild(card);
    });
  }

  // ── Inline Exercise Adder Component ─────────────────────────────────────────
  function initInlineAdder() {
    const btnOpen = document.getElementById('rb-btn-open-inline-adder');
    const searchBox = document.getElementById('rb-inline-search-box');
    const searchInp = document.getElementById('rb-inline-search-input');
    const btnClose = document.getElementById('rb-btn-close-inline-search');

    if (btnOpen) {
      btnOpen.addEventListener('click', () => {
        if (searchBox) {
          searchBox.classList.remove('hidden');
          renderInlineCategoryPills();
          renderInlineSuggestions('');
          if (searchInp) {
            searchInp.value = '';
            searchInp.focus();
          }
        }
      });
    }

    if (btnClose) {
      btnClose.addEventListener('click', () => {
        if (searchBox) searchBox.classList.add('hidden');
      });
    }

    if (searchInp) {
      searchInp.addEventListener('input', (e) => {
        renderInlineSuggestions(e.target.value);
      });

      searchInp.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          const query = searchInp.value.trim();
          if (!query) return;

          // Check if top suggestion matches or if we should add custom
          const suggestionsEl = document.getElementById('rb-inline-suggestions');
          const firstItem = suggestionsEl?.querySelector('.inline-sugg-item');
          if (firstItem && firstItem.dataset.id) {
            const exId = firstItem.dataset.id;
            const ex = exercises.find(x => String(x.id) === String(exId));
            if (ex) {
              addExerciseAndFocus(ex);
              return;
            }
          }

          // Otherwise create custom exercise on the fly
          const customEx = {
            id: `cust_${Date.now()}`,
            name: query,
            category: 'Custom Rehab',
            sets: 3,
            reps: '10',
            hold_sec: '—',
            weight_kg: 'Bodyweight',
            frequency: '1x/day',
            cues: ''
          };
          addExerciseAndFocus(customEx);
        } else if (e.key === 'Escape') {
          searchBox?.classList.add('hidden');
        }
      });
    }
  }

  function renderInlineCategoryPills() {
    const pillsContainer = document.getElementById('rb-inline-cat-pills');
    if (!pillsContainer) return;
    pillsContainer.innerHTML = '';

    CATEGORIES.forEach(cat => {
      const btn = document.createElement('button');
      btn.type = 'button';
      const isAct = cat === activeInlineCategory;
      btn.className = `px-2 py-0.5 rounded-full shrink-0 font-medium transition-colors ${
        isAct
          ? 'bg-indigo-600 text-white shadow-sm'
          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
      }`;
      btn.textContent = cat;
      btn.addEventListener('click', () => {
        activeInlineCategory = cat;
        renderInlineCategoryPills();
        const searchInp = document.getElementById('rb-inline-search-input');
        renderInlineSuggestions(searchInp ? searchInp.value : '');
      });
      pillsContainer.appendChild(btn);
    });
  }

  function renderInlineSuggestions(query) {
    const suggContainer = document.getElementById('rb-inline-suggestions');
    if (!suggContainer) return;
    suggContainer.innerHTML = '';

    const q = (query || '').toLowerCase().trim();
    const filtered = exercises.filter(ex => {
      if (activeInlineCategory !== 'All' && ex.category !== activeInlineCategory) return false;
      if (!q) return true;
      return (ex.name && ex.name.toLowerCase().includes(q)) ||
             (ex.cues && ex.cues.toLowerCase().includes(q)) ||
             (ex.category && ex.category.toLowerCase().includes(q));
    });

    if (filtered.length === 0) {
      if (q) {
        suggContainer.innerHTML = `
          <div class="p-3 text-center text-xs text-slate-500">
            No exact matches for "<span class="font-semibold text-slate-700 dark:text-slate-300">${escapeHtml(q)}</span>".
            <div class="mt-1 text-indigo-600 dark:text-indigo-400 font-medium">Press Enter to add as custom exercise.</div>
          </div>`;
      } else {
        suggContainer.innerHTML = `<div class="p-3 text-center text-xs text-slate-500 italic">No exercises found in this category.</div>`;
      }
      return;
    }

    filtered.slice(0, 30).forEach(ex => {
      const item = document.createElement('div');
      item.className = 'inline-sugg-item flex items-center justify-between p-2.5 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer transition-colors';
      item.dataset.id = ex.id;

      item.innerHTML = `
        <div class="min-w-0 flex-1 pr-2">
          <div class="flex items-center gap-2">
            <span class="text-xs font-semibold text-slate-900 dark:text-slate-100 truncate">${escapeHtml(ex.name)}</span>
            <span class="inline-flex px-1.5 py-0.2 text-[9px] uppercase font-semibold rounded bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400">
              ${escapeHtml(ex.category || 'General')}
            </span>
          </div>
          ${ex.cues ? `<p class="text-[11px] text-slate-400 truncate mt-0.5">${escapeHtml(ex.cues)}</p>` : ''}
        </div>
        <div class="flex items-center gap-2 shrink-0">
          <span class="text-[11px] font-mono text-slate-400">${ex.default_sets || 3}x${escapeHtml(ex.default_reps || '10')}</span>
          <button type="button" class="btn-primary !py-1 !px-2 !text-[11px] shadow-sm">+ Add</button>
        </div>
      `;

      item.addEventListener('click', () => {
        addExerciseAndFocus(ex);
      });

      suggContainer.appendChild(item);
    });
  }

  function addExerciseAndFocus(ex) {
    const currentWeekData = program.weeks[activeWeek - 1];
    if (!currentWeekData) return;

    if (!currentWeekData.days[activeDay]) {
      currentWeekData.days[activeDay] = [];
    }

    const newEx = {
      id: `ex_${Math.random().toString(36).slice(2, 9)}`,
      name: ex.name,
      category: ex.category || 'General',
      sets: ex.default_sets || ex.sets || 3,
      reps: ex.default_reps || ex.reps || '10',
      hold_sec: (ex.default_reps && ex.default_reps.includes('s')) ? ex.default_reps : (ex.hold_sec || '—'),
      weight_kg: ex.weight_kg || 'Bodyweight',
      frequency: ex.frequency || '1x/day',
      cues: ex.cues || ''
    };

    currentWeekData.days[activeDay].push(newEx);
    renderTier2Timeline();
    renderTier3Cards();

    // Close inline search or keep ready
    const searchBox = document.getElementById('rb-inline-search-box');
    if (searchBox) searchBox.classList.add('hidden');

    // Immediately focus into Sets input of newly added card
    requestAnimationFrame(() => {
      const container = document.getElementById('rb-exercise-cards-container');
      const lastCard = container?.lastElementChild;
      if (lastCard) {
        lastCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        const setsInput = lastCard.querySelector('.dosage-sets');
        if (setsInput) {
          setsInput.focus();
          setsInput.select();
        }
      }
    });
  }

  // ── Move / Copy Day Routine Modal ───────────────────────────────────────────
  function openShiftDayModal() {
    const modal = document.getElementById('modal-shift-day');
    if (!modal) return;

    modal.classList.remove('opacity-0', 'pointer-events-none');

    const sourceLabel = document.getElementById('shift-source-label');
    if (sourceLabel) {
      sourceLabel.textContent = `Source: Week ${activeWeek} — ${activeDay} (${(program.weeks[activeWeek - 1]?.days[activeDay] || []).length} exercises)`;
    }

    // Populate destination weeks dropdown
    const weekSelect = document.getElementById('shift-dest-week');
    if (weekSelect) {
      weekSelect.innerHTML = '';
      for (let w = 1; w <= program.duration_weeks; w++) {
        const opt = document.createElement('option');
        opt.value = w;
        opt.textContent = `Week ${w}`;
        if (w === activeWeek) opt.selected = true;
        weekSelect.appendChild(opt);
      }
    }

    // Destination day
    const daySelect = document.getElementById('shift-dest-day');
    if (daySelect) {
      const nextDayIdx = (DAYS.indexOf(activeDay) + 1) % DAYS.length;
      daySelect.value = DAYS[nextDayIdx];
    }
  }

  function closeShiftDayModal() {
    const modal = document.getElementById('modal-shift-day');
    if (modal) modal.classList.add('opacity-0', 'pointer-events-none');
  }

  function applyShiftDay() {
    const opRadio = document.querySelector('input[name="shift-op"]:checked');
    const isMove = opRadio && opRadio.value === 'move';

    const destWeekNum = parseInt(document.getElementById('shift-dest-week')?.value, 10) || activeWeek;
    const destDay = document.getElementById('shift-dest-day')?.value || activeDay;
    const mode = document.getElementById('shift-mode')?.value || 'append';

    const sourceWeek = program.weeks[activeWeek - 1];
    const destWeek = program.weeks[destWeekNum - 1];

    if (!sourceWeek || !destWeek) {
      alert('Invalid week selected.');
      return;
    }

    const sourceExercises = sourceWeek.days[activeDay] || [];
    if (sourceExercises.length === 0) {
      alert(`There are no exercises in ${activeDay} to copy or move.`);
      closeShiftDayModal();
      return;
    }

    // Clone source exercises
    const cloned = JSON.parse(JSON.stringify(sourceExercises)).map(x => ({
      ...x,
      id: `ex_${Math.random().toString(36).slice(2, 9)}`
    }));

    if (!destWeek.days[destDay]) {
      destWeek.days[destDay] = [];
    }

    if (mode === 'replace') {
      destWeek.days[destDay] = cloned;
    } else {
      destWeek.days[destDay] = destWeek.days[destDay].concat(cloned);
    }

    if (isMove && (activeWeek !== destWeekNum || activeDay !== destDay)) {
      sourceWeek.days[activeDay] = [];
    }

    // Switch view to target day & week
    activeWeek = destWeekNum;
    activeDay = destDay;

    renderTier2Timeline();
    renderTier3Cards();
    closeShiftDayModal();
  }

  // ── Quick Replace Modal (No broken image icons!) ────────────────────────────
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
      return (ex.name && ex.name.toLowerCase().includes(q)) ||
             (ex.category && ex.category.toLowerCase().includes(q));
    });

    if (filtered.length === 0) {
      listEl.innerHTML = '<p class="text-xs text-slate-500 py-4 text-center">No matching replacement exercise found.</p>';
      return;
    }

    filtered.slice(0, 30).forEach(ex => {
      const item = document.createElement('div');
      item.className = 'flex items-center justify-between p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:border-indigo-500 dark:hover:border-indigo-500 hover:bg-indigo-50/50 dark:hover:bg-slate-800 cursor-pointer transition-all';

      item.innerHTML = `
        <div class="flex items-center gap-2.5 min-w-0">
          <div class="min-w-0">
            <p class="text-xs font-semibold text-slate-900 dark:text-slate-100 truncate">${escapeHtml(ex.name)}</p>
            <span class="inline-flex px-1.5 py-0.2 text-[9px] uppercase font-semibold rounded bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 mt-0.5">
              ${escapeHtml(ex.category || 'General')}
            </span>
          </div>
        </div>
        <span class="text-xs font-semibold text-indigo-600 dark:text-indigo-400 shrink-0">Select ⇄</span>
      `;

      item.addEventListener('click', () => {
        if (replaceTarget) {
          const { weekIdx, day, exIdx } = replaceTarget;
          const targetEx = program.weeks[weekIdx]?.days[day]?.[exIdx];
          if (targetEx) {
            targetEx.name = ex.name;
            targetEx.category = ex.category;
            targetEx.cues = ex.cues || targetEx.cues;
            renderTier3Cards();
          }
        }
        closeQuickReplaceModal();
      });

      listEl.appendChild(item);
    });
  }

  // ── Save as Template Modal ──────────────────────────────────────────────────
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

    // Duration selector (1 to 12 weeks)
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

    // Pre-Built Template selector (Load on demand)
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
      const targetWeekData = program.weeks[activeWeek];

      if (currentWeekData && targetWeekData) {
        const clonedDays = JSON.parse(JSON.stringify(currentWeekData.days));
        targetWeekData.days = clonedDays;
        activeWeek += 1;
        renderTier2Timeline();
        renderTier3Cards();
      }
    });

    // Move / Copy Day Routine button
    document.getElementById('rb-btn-shift-day')?.addEventListener('click', openShiftDayModal);
    document.getElementById('btn-close-shift-day')?.addEventListener('click', closeShiftDayModal);
    document.getElementById('btn-cancel-shift-day')?.addEventListener('click', closeShiftDayModal);
    document.getElementById('btn-confirm-shift-day')?.addEventListener('click', applyShiftDay);

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

    // Save as Template button
    document.getElementById('rb-btn-save-template')?.addEventListener('click', openSaveTemplateModal);
    document.getElementById('btn-close-save-template')?.addEventListener('click', closeSaveTemplateModal);
    document.getElementById('btn-cancel-save-template')?.addEventListener('click', closeSaveTemplateModal);

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

    // Copy as Note Table button
    document.getElementById('rb-btn-copy-note')?.addEventListener('click', async () => {
      const tableHtml = generateExcelTableForProgram(program, activeWeek);
      const plainFallback = formatProgramForSoapNote(program, activeWeek);

      if (!tableHtml) {
        alert('No routine data available to copy.');
        return;
      }

      try {
        const blobHtml = new Blob([tableHtml], { type: 'text/html' });
        const blobText = new Blob([plainFallback], { type: 'text/plain' });
        const item = new ClipboardItem({
          'text/html': blobHtml,
          'text/plain': blobText
        });
        await navigator.clipboard.write([item]);

        const btn = document.getElementById('rb-btn-copy-note');
        const origHtml = btn.innerHTML;
        btn.innerHTML = '<span>✅ Table Copied to Clipboard!</span>';
        setTimeout(() => { btn.innerHTML = origHtml; }, 2000);
      } catch (e) {
        try {
          await navigator.clipboard.writeText(plainFallback);
          alert('Copied Regimen Text to Clipboard.');
        } catch {
          alert('Could not write to clipboard.');
        }
      }
    });

    // Quick replace modal close & search
    document.getElementById('btn-close-quick-replace')?.addEventListener('click', closeQuickReplaceModal);
    document.getElementById('modal-replace-search')?.addEventListener('input', (e) => {
      renderQuickReplaceList(e.target.value);
    });

    // Inline Adder
    initInlineAdder();
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
          program.duration_weeks = 4;
          program.weeks = createBlankWeeks(4);
        }
      } else if (!program.weeks || program.weeks.length === 0) {
        // Open clean blank canvas by default (no forced template)
        program = {
          id: null,
          patient_id: null,
          title: 'Untitled Program',
          duration_weeks: 4,
          weeks: createBlankWeeks(4)
        };
      }

      if (!inited) {
        wireEvents();
        inited = true;
      }

      renderTier1Header();
      renderTier2Timeline();
      renderTier3Cards();
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

  // Load a specific program by data object
  function loadProgramData(progData) {
    if (!progData) return;
    try {
      program.id = progData.id || null;
      program.patient_id = progData.patient_id || null;
      program.title = progData.title || 'Rehabilitation Routine';
      program.duration_weeks = progData.duration_weeks || 4;

      const sched = typeof progData.schedule_json === 'string' ? JSON.parse(progData.schedule_json) : progData.schedule_json;
      program.weeks = sched?.weeks || createBlankWeeks(program.duration_weeks);

      activeWeek = 1;
      activeDay = 'Mon';

      if (typeof window.switchView === 'function') {
        window.switchView('programs');
      }

      renderTier1Header();
      renderTier2Timeline();
      renderTier3Cards();
    } catch (err) {
      console.error('[RehabBuilder] loadProgramData error:', err);
    }
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
    loadProgramData,
    getProgram: () => program,
    formatProgramForSoapNote,
    generateExcelTableForProgram
  };

})();
