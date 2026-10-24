'use strict';

/**
 * ══════════════════════════════════════════════════════════════════════════════
 *  PHYSIO CLINIC — PHASED S&C AND REHAB BUILDER (rehabBuilder.js)
 *  Open Sandbox Canvas, HTML5 Drag-and-Drop Day Swapping, Professional PDF Engine.
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
    <span class="font-bold text-slate-800 dark:text-slate-200">Prescribed Program: ${escapeHtml(prog.title || 'Rehabilitation Routine')} (Week ${w.week_num})</span>
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

  // ── Helper: 100% Offline Patient Take-Home PDF Document Generator ───────────
  function generatePatientPdfHtml(prog, patientInfo = null) {
    const clinicName = 'PhysioClinic Practice Suite';
    const practitioner = 'Lead Musculoskeletal Physiotherapist, MCSP, HCPC';
    const today = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
    const patName = patientInfo ? `${patientInfo.first_name} ${patientInfo.last_name}` : 'Home Patient';
    const patDob = patientInfo && patientInfo.dob ? new Date(patientInfo.dob).toLocaleDateString('en-GB') : '—';
    const progTitle = prog.title || 'Personalized Rehabilitation Routine';
    const duration = prog.duration_weeks || 4;

    let daysTablesHtml = '';
    const DAY_LABELS = {
      Mon: 'Monday', Tue: 'Tuesday', Wed: 'Wednesday', Thu: 'Thursday',
      Fri: 'Friday', Sat: 'Saturday', Sun: 'Sunday'
    };

    (prog.weeks || []).forEach(w => {
      let weekHasExercises = false;
      let weekDaysHtml = '';

      DAYS.forEach(day => {
        const exs = (w.days && w.days[day]) || [];
        if (exs.length > 0) {
          weekHasExercises = true;
          let rows = '';
          exs.forEach(ex => {
            rows += `
              <tr style="border-bottom: 1px solid #e2e8f0;">
                <td style="padding: 7px 10px; font-weight: 600; color: #0f172a; border-right: 1px solid #e2e8f0; font-size: 11px;">
                  ${escapeHtml(ex.name)}
                  <div style="font-size: 9px; font-weight: 500; color: #64748b; text-transform: uppercase; margin-top: 2px;">${escapeHtml(ex.category || 'Rehab')}</div>
                </td>
                <td style="padding: 7px 10px; text-align: center; font-family: monospace; font-weight: 600; border-right: 1px solid #e2e8f0; font-size: 11px;">
                  ${ex.sets || 3}
                </td>
                <td style="padding: 7px 10px; text-align: center; font-family: monospace; border-right: 1px solid #e2e8f0; font-size: 11px;">
                  ${escapeHtml(ex.reps || '10')}
                </td>
                <td style="padding: 7px 10px; text-align: center; font-family: monospace; border-right: 1px solid #e2e8f0; font-size: 11px;">
                  ${escapeHtml(ex.hold_sec || '—')}
                </td>
                <td style="padding: 7px 10px; text-align: center; font-family: monospace; border-right: 1px solid #e2e8f0; font-size: 11px;">
                  ${escapeHtml(ex.weight_kg || 'Bodyweight')}
                </td>
                <td style="padding: 7px 10px; text-align: center; font-size: 11px;">
                  ${escapeHtml(ex.frequency || '1x/day')}
                </td>
              </tr>
              ${ex.cues ? `
              <tr style="background-color: #f8fafc; border-bottom: 1.5px solid #cbd5e1;">
                <td colspan="6" style="padding: 5px 10px 7px 10px; font-size: 10px; color: #334155; font-style: italic; line-height: 1.4;">
                  <strong style="font-style: normal; color: #475569;">Technique &amp; Overload Guidance:</strong> ${escapeHtml(ex.cues)}
                </td>
              </tr>` : ''}
            `;
          });

          weekDaysHtml += `
            <div style="margin-top: 14px; margin-bottom: 16px; page-break-inside: avoid;">
              <div style="background: #f1f5f9; padding: 6px 12px; border: 1px solid #cbd5e1; border-bottom: none; border-radius: 6px 6px 0 0; display: flex; justify-content: space-between; align-items: center;">
                <span style="font-size: 12px; font-weight: 700; color: #1e293b; text-transform: uppercase; letter-spacing: 0.5px;">${DAY_LABELS[day]} Routine</span>
                <span style="font-size: 10px; color: #64748b; font-weight: 600;">${exs.length} Exercise${exs.length === 1 ? '' : 's'}</span>
              </div>
              <table style="width: 100%; border-collapse: collapse; border: 1px solid #cbd5e1; background: #ffffff;">
                <thead>
                  <tr style="background: #e2e8f0; border-bottom: 1.5px solid #94a3b8; font-size: 10px; text-transform: uppercase; color: #334155; letter-spacing: 0.5px;">
                    <th style="padding: 6px 10px; text-align: left; width: 34%; border-right: 1px solid #cbd5e1;">Exercise</th>
                    <th style="padding: 6px 10px; text-align: center; width: 10%; border-right: 1px solid #cbd5e1;">Sets</th>
                    <th style="padding: 6px 10px; text-align: center; width: 15%; border-right: 1px solid #cbd5e1;">Reps / Tempo</th>
                    <th style="padding: 6px 10px; text-align: center; width: 12%; border-right: 1px solid #cbd5e1;">Hold</th>
                    <th style="padding: 6px 10px; text-align: center; width: 14%; border-right: 1px solid #cbd5e1;">Load / Band</th>
                    <th style="padding: 6px 10px; text-align: center; width: 15%;">Frequency</th>
                  </tr>
                </thead>
                <tbody>
                  ${rows}
                </tbody>
              </table>
            </div>
          `;
        }
      });

      if (weekHasExercises) {
        daysTablesHtml += `
          <div style="margin-top: 22px; page-break-before: ${w.week_num > 1 ? 'always' : 'auto'};">
            <div style="border-bottom: 2px solid #0f172a; padding-bottom: 4px; margin-bottom: 8px; display: flex; justify-content: space-between; align-items: baseline;">
              <h2 style="font-size: 15px; font-weight: 800; color: #0f172a; margin: 0; text-transform: uppercase; letter-spacing: 0.5px;">
                Week ${w.week_num}: ${escapeHtml(w.title || 'Phase Protocol')}
              </h2>
              ${w.focus ? `<span style="font-size: 11px; font-style: italic; color: #475569;">Focus: ${escapeHtml(w.focus)}</span>` : ''}
            </div>
            ${weekDaysHtml}
          </div>
        `;
      }
    });

    return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <title>${escapeHtml(progTitle)} - Patient Exercise Program</title>
  <style>
    @page {
      size: A4 portrait;
      margin: 15mm 12mm;
    }
    * {
      box-sizing: border-box;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif;
      margin: 0;
      padding: 0;
      color: #0f172a;
      background: #ffffff !important;
      line-height: 1.4;
    }
    table {
      page-break-inside: auto;
    }
    tr {
      page-break-inside: avoid;
      page-break-after: auto;
    }
  </style>
</head>
<body>
  <!-- Clinical Letterhead -->
  <div style="border-bottom: 3px solid #0f172a; padding-bottom: 12px; margin-bottom: 14px; display: flex; justify-content: space-between; align-items: flex-start;">
    <div>
      <h1 style="font-size: 20px; font-weight: 900; letter-spacing: -0.5px; margin: 0; color: #0f172a; text-transform: uppercase;">
        ${escapeHtml(clinicName)}
      </h1>
      <p style="font-size: 11px; color: #475569; margin: 2px 0 0 0; font-weight: 500;">
        ${escapeHtml(practitioner)}
      </p>
    </div>
    <div style="text-align: right; font-size: 10px; color: #475569; line-height: 1.4;">
      <div><strong>Issue Date:</strong> ${today}</div>
      <div><strong>Document Ref:</strong> PT-DOC-${Date.now().toString(36).toUpperCase()}</div>
      <div><strong>Protocol Scope:</strong> Home &amp; Clinic Rehabilitation</div>
    </div>
  </div>

  <!-- Patient Demographics Banner -->
  <div style="background: #f8fafc; border: 1.5px solid #cbd5e1; border-radius: 6px; padding: 10px 14px; margin-bottom: 14px; display: grid; grid-template-columns: 2fr 1fr 2fr 1fr; gap: 8px; font-size: 11px;">
    <div><span style="color: #64748b; text-transform: uppercase; font-size: 9px; font-weight: 700; display: block;">Patient Name</span><strong style="font-size: 13px; color: #0f172a;">${escapeHtml(patName)}</strong></div>
    <div><span style="color: #64748b; text-transform: uppercase; font-size: 9px; font-weight: 700; display: block;">Date of Birth</span><strong>${escapeHtml(patDob)}</strong></div>
    <div><span style="color: #64748b; text-transform: uppercase; font-size: 9px; font-weight: 700; display: block;">Rehabilitation Plan</span><strong>${escapeHtml(progTitle)}</strong></div>
    <div><span style="color: #64748b; text-transform: uppercase; font-size: 9px; font-weight: 700; display: block;">Program Duration</span><strong>${duration} Weeks</strong></div>
  </div>

  <!-- Prescription Guidance Notice -->
  <div style="background: #f1f5f9; border-left: 4px solid #4f46e5; padding: 7px 12px; margin-bottom: 16px; font-size: 10px; color: #334155; line-height: 1.4;">
    <strong>Clinical Instruction:</strong> Perform prescribed dosages with controlled tempo. Maintain smooth diaphragmatic breathing. Expected discomfort should remain below 4/10 on the VAS pain scale and settle within 24 hours. Contact your practitioner immediately if sharp pain, joint swelling, or neurological symptoms occur.
  </div>

  <!-- Program Schedule Tables -->
  ${daysTablesHtml}

  <!-- Footer -->
  <div style="margin-top: 24px; padding-top: 10px; border-top: 1px solid #cbd5e1; font-size: 9px; color: #64748b; display: flex; justify-content: space-between; align-items: center;">
    <span>PhysioClinic Practice Suite • 100% Offline Clinical Record &amp; Home Prescription</span>
    <span>Page 1 • Strictly Confidential Medical Prescription</span>
  </div>
</body>
</html>`;
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

  // ── UI Rendering: Tier 2 (Weeks & Drag-and-Drop Days Navigation) ────────────
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

    // Day Pills with HTML5 Drag-and-Drop Day Swapping
    const dayPillsEl = document.getElementById('rb-day-pills');
    if (dayPillsEl) {
      dayPillsEl.innerHTML = '';
      const currentWeekData = program.weeks[activeWeek - 1] || { days: {} };

      DAYS.forEach(day => {
        const exCount = (currentWeekData.days[day] || []).length;
        const isActive = day === activeDay;
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.draggable = true;
        btn.dataset.day = day;
        btn.className = `px-2.5 py-1 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 cursor-grab active:cursor-grabbing select-none ${
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

        // Drag and Drop Day Swapping
        btn.addEventListener('dragstart', (e) => {
          e.dataTransfer.setData('text/plain', day);
          e.dataTransfer.effectAllowed = 'move';
          btn.classList.add('opacity-40');
        });

        btn.addEventListener('dragend', () => {
          btn.classList.remove('opacity-40');
          document.querySelectorAll('#rb-day-pills button').forEach(el => {
            el.classList.remove('ring-2', 'ring-indigo-500', 'bg-indigo-50', 'dark:bg-indigo-500/20');
          });
        });

        btn.addEventListener('dragover', (e) => {
          e.preventDefault();
          e.dataTransfer.dropEffect = 'move';
          btn.classList.add('ring-2', 'ring-indigo-500', 'bg-indigo-50', 'dark:bg-indigo-500/20');
        });

        btn.addEventListener('dragleave', () => {
          btn.classList.remove('ring-2', 'ring-indigo-500', 'bg-indigo-50', 'dark:bg-indigo-500/20');
        });

        btn.addEventListener('drop', (e) => {
          e.preventDefault();
          btn.classList.remove('ring-2', 'ring-indigo-500', 'bg-indigo-50', 'dark:bg-indigo-500/20');
          const sourceDay = e.dataTransfer.getData('text/plain');
          const targetDay = day;

          if (sourceDay && targetDay && sourceDay !== targetDay) {
            const curWeek = program.weeks[activeWeek - 1];
            if (curWeek && curWeek.days) {
              const sourceList = curWeek.days[sourceDay] || [];
              const targetList = curWeek.days[targetDay] || [];
              curWeek.days[sourceDay] = targetList;
              curWeek.days[targetDay] = sourceList;
              activeDay = targetDay;
              renderTier2Timeline();
              renderTier3Cards();
            }
          }
        });

        dayPillsEl.appendChild(btn);
      });
    }
  }

  // ── UI Rendering: Tier 3 (Visual Exercise Cards with SVG Controls) ───────────
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

          <!-- Card Controls: Pure SVG Icons (No Emojis) -->
          <div class="flex items-center gap-1 self-end sm:self-auto shrink-0 bg-slate-50 dark:bg-slate-800 rounded-lg p-1 border border-slate-200 dark:border-slate-700">
            <button type="button" class="btn-card-replace text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 p-1.5 rounded hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors" title="Swap / Replace Exercise">
              <svg class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
              </svg>
            </button>
            <button type="button" class="btn-card-up text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 p-1.5 rounded hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors ${idx === 0 ? 'opacity-30 pointer-events-none' : ''}" title="Move Up">
              <svg class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
              </svg>
            </button>
            <button type="button" class="btn-card-down text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 p-1.5 rounded hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors ${idx === dayExercises.length - 1 ? 'opacity-30 pointer-events-none' : ''}" title="Move Down">
              <svg class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
              </svg>
            </button>
            <button type="button" class="btn-card-dup text-slate-500 hover:text-emerald-600 dark:hover:text-emerald-400 p-1.5 rounded hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors" title="Duplicate Exercise">
              <svg class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 011.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 00-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 01-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5a3.375 3.375 0 00-3.375-3.375H9.75" />
              </svg>
            </button>
            <button type="button" class="btn-card-del text-slate-500 hover:text-rose-600 dark:hover:text-rose-400 p-1.5 rounded hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors" title="Delete Exercise">
              <svg class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
              </svg>
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
          <button type="button" class="btn-primary !py-1 !px-2 !text-[11px] shadow-sm">Add</button>
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

    // Close inline search
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

    activeWeek = destWeekNum;
    activeDay = destDay;

    renderTier2Timeline();
    renderTier3Cards();
    closeShiftDayModal();
  }

  // ── Quick Replace Modal ─────────────────────────────────────────────────────
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
        <span class="text-xs font-semibold text-indigo-600 dark:text-indigo-400 shrink-0">Select</span>
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

  // ── PDF Export Action ───────────────────────────────────────────────────────
  async function exportPatientPdf() {
    let patientInfo = null;
    if (program.patient_id) {
      patientInfo = patients.find(p => Number(p.id) === Number(program.patient_id));
    }

    const htmlContent = generatePatientPdfHtml(program, patientInfo);
    const sanitizedTitle = (program.title || 'Rehab_Program').replace(/[^a-zA-Z0-9_-]/g, '_');
    const defaultFilename = `${sanitizedTitle}_TakeHome_Prescription.pdf`;

    const btn = document.getElementById('rb-btn-export-pdf');
    const origHtml = btn ? btn.innerHTML : '';
    if (btn) btn.innerHTML = '<span>Exporting PDF…</span>';

    try {
      const result = await window.api.rehab.exportPdf(htmlContent, defaultFilename);
      if (result && result.success) {
        if (btn) btn.innerHTML = '<span>PDF Saved!</span>';
        setTimeout(() => { if (btn) btn.innerHTML = origHtml; }, 2500);
      } else {
        if (btn) btn.innerHTML = origHtml;
      }
    } catch (err) {
      console.error('[RehabBuilder] PDF Export error:', err);
      alert('Failed to export PDF: ' + err.message);
      if (btn) btn.innerHTML = origHtml;
    }
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

    // Move / Copy Day Routine button (Modal fallback)
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
        btn.innerHTML = '<span>Table Copied!</span>';
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

    // Export Patient PDF button
    document.getElementById('rb-btn-export-pdf')?.addEventListener('click', exportPatientPdf);

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
    generateExcelTableForProgram,
    generatePatientPdfHtml,
    exportPatientPdf
  };

})();
