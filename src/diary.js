'use strict';

// ══════════════════════════════════════════════════════════════════════════════
//  PHYSIO CLINIC — MASTER DIARY  (diary.js)
//  True-to-scale interactive calendar grid.
//  Exposed as window.Diary — called by renderer.js when the diary view opens.
// ══════════════════════════════════════════════════════════════════════════════

window.Diary = (() => {

  // ── Grid constants ──────────────────────────────────────────────────────────
  let DAY_START    = 7;                         // 07:00 (configurable via clinic_settings)
  let DAY_END      = 19;                        // 19:00 (configurable via clinic_settings)
  const UNIT_MIN   = 15;                        // minutes per grid step
  const UNIT_PX    = 20;                        // px per 15-min unit
  const HOUR_PX    = (60 / UNIT_MIN) * UNIT_PX; // 80px per hour
  let TOTAL_PX     = (DAY_END - DAY_START) * HOUR_PX; // dynamically calculated

  // Recurring non-clinical lunch break default (Phase 8)
  let lunchConfig = {
    enabled: true,
    startMin: 12 * 60 + 30, // 12:30
    endMin: 13 * 60 + 30    // 13:30
  };

  // ── Event type config ───────────────────────────────────────────────────────
  const EV = {
    clinical_np:     { color:'#6366f1', bg:'rgba(99,102,241,0.16)',  label:'Initial Assessment', dur: 60  },
    clinical_fup:    { color:'#3b82f6', bg:'rgba(59,130,246,0.16)',  label:'Follow-up',           dur: 30  },
    clinical_review: { color:'#8b5cf6', bg:'rgba(139,92,246,0.16)', label:'Review',              dur: 45  },
    lunch:           { color:'#d97706', bg:'rgba(217,119,6,0.13)',   label:'Lunch',               dur: 60  },
    admin:           { color:'#64748b', bg:'rgba(100,116,139,0.18)', label:'Admin / CPD',         dur: 60  },
    meeting:         { color:'#0d9488', bg:'rgba(13,148,136,0.16)',  label:'Meeting',             dur: 60  },
    leave:           { color:'#f43f5e', bg:'rgba(244,63,94,0.13)',   label:'Leave',               dur: 480 },
    reminder:        { color:'#ca8a04', bg:'rgba(202,138,4,0.13)',   label:'Reminder',            dur: 15  },
  };
  const isClinical = t => ['clinical_np','clinical_fup','clinical_review'].includes(t);

  // ── State ───────────────────────────────────────────────────────────────────
  let view       = 'week';
  let weekDays   = 5;
  let anchor     = new Date();       // pivot date for navigation
  let events     = [];               // loaded from SQLite
  let inited     = false;
  let drawState  = null;             // drag-to-draw
  let moveState  = null;             // drag existing block
  let resizeState = null;            // resize block bottom handle
  let previewEvId = null;            // id shown in appointment preview card

  // ── DOM helpers ─────────────────────────────────────────────────────────────
  const $   = id => document.getElementById(id);
  const pad = n  => String(n).padStart(2, '0');

  // ── Time math ───────────────────────────────────────────────────────────────

  function snap(min)        { return Math.round(min / UNIT_MIN) * UNIT_MIN; }
  function minToPx(min)     { return (min / UNIT_MIN) * UNIT_PX; }
  function pxToMin(px)      { return snap((px / UNIT_PX) * UNIT_MIN); }
  function clamp(min)       { return Math.max(DAY_START*60, Math.min(DAY_END*60, min)); }
  function hhmm(totalMin)   { return `${pad(Math.floor(totalMin/60))}:${pad(totalMin%60)}`; }
  function parseHHMM(s)     { const [h,m] = (s||'00:00').split(':').map(Number); return h*60+m; }

  function isoDate(d) {
    return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`;
  }

  /** Build an ISO-8601 datetime string from a date string + total-minutes-from-midnight */
  function toISO(dateStr, totalMin) {
    const [y,mo,d] = dateStr.split('-').map(Number);
    const h = Math.floor(totalMin / 60), m = totalMin % 60;
    return new Date(y, mo-1, d, h, m).toISOString();
  }

  /** Parse scheduled_at / end_time → { date, startMin, endMin, dur } */
  function parseEvent(ev) {
    const st    = new Date(ev.scheduled_at);
    const date  = isoDate(st);
    const startMin = st.getHours()*60 + st.getMinutes();
    let   endMin;
    if (ev.end_time) {
      const et = new Date(ev.end_time);
      endMin = et.getHours()*60 + et.getMinutes();
    } else {
      endMin = startMin + (ev.duration_min || 30);
    }
    return { date, startMin, endMin, dur: endMin - startMin };
  }

  // ── Navigation helpers ───────────────────────────────────────────────────────

  function visibleDays() {
    if (view === 'day') return [new Date(anchor)];
    const d = new Date(anchor);
    const dow = d.getDay();
    d.setDate(d.getDate() - (dow === 0 ? 6 : dow - 1)); // Monday
    return Array.from({length: weekDays}, (_, i) => {
      const x = new Date(d);
      x.setDate(d.getDate() + i);
      return x;
    });
  }

  // ── Grid construction ────────────────────────────────────────────────────────

  function buildGrid() {
    const days    = visibleDays();
    const today   = isoDate(new Date());
    const colsEl  = $('diary-columns');
    const hdrEl   = $('diary-col-headers');
    const gutEl   = $('diary-gutter');
    if (!colsEl || !hdrEl || !gutEl) return;

    // ── Column headers ──
    hdrEl.style.gridTemplateColumns = `repeat(${days.length}, 1fr)`;
    hdrEl.innerHTML = days.map(d => {
      const iso = isoDate(d);
      const isT = iso === today;
      return `
        <div class="diary-col-hdr${isT ? ' is-today' : ''}" data-date="${iso}">
          <span class="diary-dow">${d.toLocaleDateString('en-AU',{weekday:'short'})}</span>
          <span class="diary-dnum${isT ? ' today-num' : ''}">${d.getDate()}</span>
        </div>`;
    }).join('');

    // ── Update date label ──
    updateLabel(days);

    // ── Time gutter ──
    gutEl.innerHTML = '';
    gutEl.style.height = `${TOTAL_PX}px`;
    for (let h = DAY_START; h <= DAY_END; h++) {
      const lbl = document.createElement('div');
      lbl.className = 'diary-hour-lbl';
      lbl.style.top = `${(h - DAY_START) * HOUR_PX}px`;
      if (h < DAY_END) lbl.textContent = `${pad(h)}:00`;
      gutEl.appendChild(lbl);
    }

    // ── Day columns ──
    colsEl.innerHTML = '';
    colsEl.style.gridTemplateColumns = `repeat(${days.length}, 1fr)`;
    colsEl.style.height = `${TOTAL_PX}px`;

    days.forEach((day, ci) => {
      const col = document.createElement('div');
      col.className = 'diary-col';
      col.dataset.date   = isoDate(day);
      col.dataset.colIdx = String(ci);

      // Background grid lines
      for (let h = DAY_START; h < DAY_END; h++) {
        const base = (h - DAY_START) * HOUR_PX;
        addLine(col, base,            'diary-line-hour');
        addLine(col, base + HOUR_PX/2,'diary-line-half');
        addLine(col, base + HOUR_PX/4,'diary-line-qtr');
        addLine(col, base + HOUR_PX*3/4,'diary-line-qtr');
      }
      // Final hour line
      addLine(col, TOTAL_PX, 'diary-line-hour');

      // Recurring non-clinical lunch break band (Phase 8)
      if (lunchConfig.enabled && lunchConfig.startMin < DAY_END * 60 && lunchConfig.endMin > DAY_START * 60) {
        const effStart = Math.max(DAY_START * 60, lunchConfig.startMin);
        const effEnd = Math.min(DAY_END * 60, lunchConfig.endMin);
        if (effEnd > effStart) {
          const lTop = minToPx(effStart - DAY_START * 60);
          const lH = minToPx(effEnd - effStart);
          const lunchEl = document.createElement('div');
          lunchEl.className = 'diary-lunch-block';
          lunchEl.style.top = `${lTop}px`;
          lunchEl.style.height = `${lH}px`;
          lunchEl.innerHTML = `
            <div class="diary-lunch-label">
              <svg class="h-3 w-3 inline mr-1 text-amber-500/80 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              <span>Lunch Break (${hhmm(lunchConfig.startMin)} – ${hhmm(lunchConfig.endMin)})</span>
            </div>
          `;
          col.appendChild(lunchEl);
        }
      }

      // "Now" band highlight for today
      if (isoDate(day) === today) col.classList.add('is-today-col');

      attachColDragDraw(col, day);
      colsEl.appendChild(col);
    });

    renderEvents();
    renderNowLine();
  }

  function addLine(col, topPx, cls) {
    const el = document.createElement('div');
    el.className = cls;
    el.style.top = `${topPx}px`;
    col.appendChild(el);
  }

  // ── "Now" indicator ──────────────────────────────────────────────────────────

  function renderNowLine() {
    const today  = isoDate(new Date());
    const colsEl = $('diary-columns');
    if (!colsEl) return;
    const todayCol = colsEl.querySelector(`[data-date="${today}"]`);
    if (!todayCol) return;

    // Remove old
    todayCol.querySelectorAll('.diary-now-line').forEach(el => el.remove());

    const now    = new Date();
    const totalM = now.getHours()*60 + now.getMinutes();
    if (totalM < DAY_START*60 || totalM >= DAY_END*60) return;

    const topPx = minToPx(totalM - DAY_START*60);
    const line  = document.createElement('div');
    line.className = 'diary-now-line';
    line.style.top = `${topPx}px`;

    const dot = document.createElement('div');
    dot.className = 'diary-now-dot';
    dot.style.top = `${topPx - 4}px`;

    todayCol.appendChild(line);
    todayCol.appendChild(dot);
  }

  // ── Event block rendering ────────────────────────────────────────────────────

  function renderEvents() {
    const colsEl  = $('diary-columns');
    if (!colsEl) return;
    const days    = visibleDays().map(isoDate);

    colsEl.querySelectorAll('.diary-ev').forEach(el => el.remove());

    events.forEach(ev => {
      const { date, startMin, endMin, dur } = parseEvent(ev);
      const ci = days.indexOf(date);
      if (ci === -1) return;
      const col = colsEl.children[ci];
      if (!col) return;

      const cfg    = EV[ev.event_type] || EV.clinical_fup;
      const topPx  = minToPx(startMin - DAY_START*60);
      const htPx   = Math.max(UNIT_PX, minToPx(dur));
      const name   = ev.first_name
        ? `${ev.first_name} ${ev.last_name}`
        : (ev.title || cfg.label);

      const block = document.createElement('div');
      block.className    = 'diary-ev';
      block.dataset.evId = String(ev.id);
      block.style.cssText = `top:${topPx}px;height:${htPx}px;background:${cfg.bg};border-left:3px solid ${cfg.color};`;

      block.innerHTML = `
        <div class="diary-ev-inner">
          <div class="diary-ev-title" style="color:${cfg.color}">${name}</div>
          ${dur >= 30 ? `<div class="diary-ev-meta">${hhmm(startMin)}–${hhmm(endMin)}${isClinical(ev.event_type) ? ' · '+cfg.label : ''}</div>` : ''}
        </div>
        <div class="diary-ev-resize" data-ev-id="${ev.id}"></div>`;

      block.addEventListener('mousedown', e => {
        if (e.target.classList.contains('diary-ev-resize')) {
          e.stopPropagation();
          startResize(e, block, ev, col);
        } else {
          e.stopPropagation();
          startBlockMove(e, block, ev, col, ci);
        }
      });

      block.addEventListener('click', e => {
        e.stopPropagation();
        if (moveState?.moved || resizeState) return;
        showApptPreview(ev, e);
      });

      col.appendChild(block);
    });
  }

  // ── Drag-to-draw ─────────────────────────────────────────────────────────────

  function attachColDragDraw(col, day) {
    col.addEventListener('mousedown', e => {
      if (e.button !== 0) return;
      if (e.target.closest('.diary-ev')) return;
      e.preventDefault();

      const yInCol   = getY(e, col);
      const startMin = clamp(snap(DAY_START*60 + pxToMin(Math.max(0, yInCol))));

      const preview = document.createElement('div');
      preview.className  = 'diary-draw-preview';
      preview.style.top  = `${minToPx(startMin - DAY_START*60)}px`;
      preview.style.height = `${UNIT_PX}px`;
      col.appendChild(preview);

      drawState = { col, day, startMin, endMin: startMin + UNIT_MIN, preview, moved: false, startY: e.clientY };

      const onMove = e2 => {
        const y2   = getY(e2, col);
        const raw  = clamp(snap(DAY_START*60 + pxToMin(Math.max(0, y2))));
        const end  = Math.max(drawState.startMin + UNIT_MIN, raw);
        drawState.endMin = end;
        drawState.moved  = Math.abs(e2.clientY - drawState.startY) > 6;
        preview.style.height   = `${Math.max(UNIT_PX, minToPx(end - drawState.startMin))}px`;
        preview.textContent    = `${hhmm(drawState.startMin)} – ${hhmm(end)}`;
      };

      const onUp = () => {
        document.removeEventListener('mousemove', onMove);
        if (preview.parentNode) preview.remove();
        const { startMin, endMin, moved } = drawState;
        drawState = null;
        openEventDrawer({
          date:     isoDate(day),
          startMin: startMin,
          endMin:   moved ? endMin : startMin + 30,
        });
      };

      document.addEventListener('mousemove', onMove, { passive: true });
      document.addEventListener('mouseup',   onUp,   { once: true });
    });
  }

  // ── Block move ───────────────────────────────────────────────────────────────

  function startBlockMove(e, block, ev, origCol, origCI) {
    if (e.button !== 0) return;
    e.preventDefault();

    const { startMin, endMin } = parseEvent(ev);
    const dur = endMin - startMin;
    const yInCol = getY(e, origCol);
    const clickOffset = pxToMin(yInCol) - (startMin - DAY_START*60);

    moveState = {
      block, ev, origCol, origCI, dur, startMin,
      clickOffset, moved: false,
      startX: e.clientX, startY: e.clientY,
      curCol: origCol, curDate: origCol.dataset.date,
    };
    block.classList.add('ev-dragging');

    const onMove = e2 => {
      if (!moveState) return;
      if (!moveState.moved && (Math.abs(e2.clientX - moveState.startX) > 5 || Math.abs(e2.clientY - moveState.startY) > 5)) {
        moveState.moved = true;
      }
      if (!moveState.moved) return;

      // Find target column
      const colsEl = $('diary-columns');
      let targetCol = moveState.curCol;
      if (colsEl) {
        Array.from(colsEl.querySelectorAll('.diary-col')).forEach(c => {
          const r = c.getBoundingClientRect();
          if (e2.clientX >= r.left && e2.clientX <= r.right) targetCol = c;
        });
      }

      const y2       = getY(e2, targetCol);
      const rawMin   = DAY_START*60 + pxToMin(Math.max(0, y2)) - moveState.clickOffset;
      const newStart = clamp(snap(rawMin));
      const newEnd   = Math.min(DAY_END*60, newStart + moveState.dur);

      block.style.top    = `${minToPx(newStart - DAY_START*60)}px`;
      block.style.height = `${minToPx(moveState.dur)}px`;
      block.dataset.pendingStart = String(newStart);
      block.dataset.pendingDate  = targetCol.dataset.date;
      moveState.curCol  = targetCol;
      moveState.curDate = targetCol.dataset.date;
      if (targetCol !== block.parentElement) targetCol.appendChild(block);
    };

    const onUp = async () => {
      document.removeEventListener('mousemove', onMove);
      if (!moveState) return;
      const { moved, block: blk, ev: e2, dur } = moveState;
      blk.classList.remove('ev-dragging');

      if (moved && blk.dataset.pendingStart) {
        const newStart = Number(blk.dataset.pendingStart);
        const newDate  = blk.dataset.pendingDate;
        const newEnd   = newStart + dur;
        try {
          await window.api.diary.updateEvent(e2.id, {
            scheduled_at: toISO(newDate, newStart),
            end_time:     toISO(newDate, newEnd),
            duration_min: dur,
          });
        } catch (err) { console.error('[Diary] Move failed:', err); }
        await loadEvents();
      }
      moveState = null;
    };

    document.addEventListener('mousemove', onMove, { passive: true });
    document.addEventListener('mouseup',   onUp,   { once: true });
  }

  // ── Block resize ─────────────────────────────────────────────────────────────

  function startResize(e, block, ev, col) {
    e.preventDefault();
    const { startMin, endMin } = parseEvent(ev);

    resizeState = {
      block, ev, col, startMin, origEndMin: endMin,
      startY: e.clientY,
    };
    block.classList.add('ev-resizing');

    const onMove = e2 => {
      if (!resizeState) return;
      const dy    = e2.clientY - resizeState.startY;
      const added = pxToMin(dy);
      const newEnd = clamp(snap(resizeState.origEndMin + added));
      const newDur = Math.max(UNIT_MIN, newEnd - resizeState.startMin);
      resizeState.pendingEnd = resizeState.startMin + newDur;
      block.style.height = `${minToPx(newDur)}px`;
    };

    const onUp = async () => {
      document.removeEventListener('mousemove', onMove);
      if (!resizeState) return;
      const { block: blk, ev: e2, startMin, pendingEnd, col: c } = resizeState;
      blk.classList.remove('ev-resizing');
      if (pendingEnd && pendingEnd !== resizeState.origEndMin) {
        const newDur = pendingEnd - startMin;
        const startDT = new Date(e2.scheduled_at);
        const endDT   = new Date(startDT.getTime() + newDur * 60000);
        try {
          await window.api.diary.updateEvent(e2.id, {
            duration_min: newDur,
            end_time:     endDT.toISOString(),
          });
        } catch (err) { console.error('[Diary] Resize failed:', err); }
        await loadEvents();
      }
      resizeState = null;
    };

    document.addEventListener('mousemove', onMove, { passive: true });
    document.addEventListener('mouseup',   onUp,   { once: true });
  }

  // ── Y-in-column helper ───────────────────────────────────────────────────────

  function getY(e, col) {
    // getBoundingClientRect() already accounts for scroll position
    return e.clientY - col.getBoundingClientRect().top;
  }

  // ── Load events from DB ──────────────────────────────────────────────────────

  async function loadEvents() {
    const days = visibleDays();
    if (!days.length) return;
    const startISO = new Date(days[0]).toISOString();
    const endDay   = new Date(days[days.length - 1]);
    endDay.setDate(endDay.getDate() + 1);
    try {
      events = await window.api.diary.getEvents(startISO, endDay.toISOString());
    } catch (err) {
      console.error('[Diary] Load events failed:', err);
      events = [];
    }
    renderEvents();
    renderNowLine();
    updateDashboardSchedule();
  }

  // ── Navigation ───────────────────────────────────────────────────────────────

  function navigate(delta) {
    const d = new Date(anchor);
    d.setDate(d.getDate() + delta * (view === 'day' ? 1 : weekDays));
    anchor = d;
    buildGrid();
    loadEvents();
  }

  function goToday() {
    anchor = new Date();
    buildGrid();
    loadEvents();
  }

  function setView(v) {
    view = v;
    $('diary-view-day')?.classList.toggle('diary-view-active', v === 'day');
    $('diary-view-week')?.classList.toggle('diary-view-active', v === 'week');
    buildGrid();
    loadEvents();
  }

  function updateLabel(days) {
    const el = $('diary-date-label');
    if (!el) return;
    if (view === 'day') {
      el.textContent = days[0].toLocaleDateString('en-AU', {
        weekday:'long', day:'numeric', month:'long', year:'numeric'
      });
    } else {
      const a = days[0], b = days[days.length-1];
      el.textContent = a.getMonth() === b.getMonth()
        ? a.toLocaleDateString('en-AU', {month:'long', year:'numeric'})
        : `${a.toLocaleDateString('en-AU',{month:'short'})} – ${b.toLocaleDateString('en-AU',{month:'short',year:'numeric'})}`;
    }
  }

  // ── Event Drawer ─────────────────────────────────────────────────────────────

  function openEventDrawer(cfg = {}) {
    const drawer   = $('ev-drawer');
    const backdrop = $('ev-backdrop');
    if (!drawer) return;

    // Populate
    populateDrawer(cfg);

    if (backdrop) {
      backdrop.classList.remove('hidden', 'opacity-0', 'pointer-events-none');
      backdrop.classList.add('opacity-100', 'pointer-events-auto');
      backdrop.style.setProperty('display', 'block', 'important');
      backdrop.style.setProperty('pointer-events', 'auto', 'important');
    }
    drawer.classList.remove('hidden', 'translate-x-full');
    drawer.style.setProperty('display', 'flex', 'important');
    drawer.style.setProperty('pointer-events', 'auto', 'important');
    setTimeout(() => {
      const first = drawer.querySelector('input:not([type=hidden]):not([disabled])');
      if (first) first.focus();
    }, 80);
  }

  function closeEventDrawer() {
    const drawer = $('ev-drawer');
    const bd = $('ev-backdrop');

    drawer?.classList.add('hidden', 'translate-x-full');
    drawer?.style.setProperty('display', 'none', 'important');
    drawer?.style.setProperty('pointer-events', 'none', 'important');

    if (bd) {
      bd.classList.remove('opacity-100', 'pointer-events-auto');
      bd.classList.add('hidden', 'opacity-0', 'pointer-events-none');
      bd.style.setProperty('display', 'none', 'important');
      bd.style.setProperty('pointer-events', 'none', 'important');
    }
    $('ev-patient-dropdown')?.classList.add('hidden');
  }

  function populateDrawer(cfg) {
    const isEdit = !!cfg.id;
    const et     = cfg.event_type || 'clinical_fup';

    $('ev-drawer-title').textContent = isEdit ? 'Edit Event' : 'New Event';
    $('ev-event-id').value    = cfg.id    || '';
    $('ev-patient-id').value  = cfg.patient_id || '';
    $('ev-event-type').value  = et;

    // Mode
    const clinical = isClinical(et);
    setDrawerMode(clinical ? 'clinical' : 'nonclinical');

    // Date / time
    const dateVal = cfg.date || isoDate(new Date());
    $('ev-date').value       = dateVal;
    $('ev-start-time').value = cfg.startMin != null ? hhmm(cfg.startMin) : '09:00';
    $('ev-end-time').value   = cfg.endMin   != null ? hhmm(cfg.endMin)   : hhmm((cfg.startMin||540)+30);

    // Patient name in search field
    const patSearchEl = $('ev-patient-search');
    if (patSearchEl) {
      patSearchEl.value = (cfg.first_name && cfg.last_name)
        ? `${cfg.first_name} ${cfg.last_name}` : '';
    }

    // Title (non-clinical)
    const titleEl = $('ev-title');
    if (titleEl) titleEl.value = cfg.title || (isEdit ? '' : (EV[et]?.label || ''));

    // Notes
    const notesEl = $('ev-notes');
    if (notesEl) notesEl.value = cfg.notes || '';

    // Delete btn
    const delBtn = $('ev-delete-btn');
    if (delBtn) delBtn.classList.toggle('hidden', !isEdit);

    updateDurationBadge();

    // Highlight preset buttons
    highlightPreset('[data-appt-type]', `[data-appt-type="${et}"]`);
    highlightPreset('[data-nc-type]',   `[data-nc-type="${et}"]`);
  }

  function setDrawerMode(mode) {
    $('ev-clinical-section')?.classList.toggle('hidden',    mode !== 'clinical');
    $('ev-nonclinical-section')?.classList.toggle('hidden', mode !== 'nonclinical');
    $('ev-mode-clinical')?.classList.toggle('ev-mode-active',    mode === 'clinical');
    $('ev-mode-nonclinical')?.classList.toggle('ev-mode-active', mode !== 'clinical');
  }

  function highlightPreset(allSel, activeSel) {
    document.querySelectorAll(allSel).forEach(b =>
      b.classList.toggle('ev-preset-active', b.matches(activeSel))
    );
  }

  function updateDurationBadge() {
    const sm = parseHHMM($('ev-start-time')?.value);
    const em = parseHHMM($('ev-end-time')?.value);
    const d  = Math.max(0, em - sm);
    const badge = $('ev-duration-badge');
    if (badge) badge.textContent = d ? `${d} min` : '';
  }

  function applyApptPreset(type) {
    $('ev-event-type').value = type;
    const cfg  = EV[type];
    if (!cfg) return;
    const sm   = parseHHMM($('ev-start-time')?.value || '09:00');
    const newE = Math.min(DAY_END*60, sm + cfg.dur);
    if ($('ev-end-time')) $('ev-end-time').value = hhmm(newE);
    updateDurationBadge();
  }

  // ── Drawer: patient search ────────────────────────────────────────────────────

  function initDrawerPatientSearch() {
    const input  = $('ev-patient-search');
    const drop   = $('ev-patient-dropdown');
    const hidId  = $('ev-patient-id');
    if (!input || !drop) return;

    let timer;
    input.addEventListener('input', () => {
      clearTimeout(timer);
      timer = setTimeout(async () => {
        const q = input.value.trim();
        if (!q) { drop.classList.add('hidden'); return; }
        try {
          const res = await window.api.patients.search(q);
          if (!res.length) {
            drop.innerHTML = `<div class="px-4 py-3 text-xs text-slate-400 dark:text-slate-600">No patients found.</div>`;
          } else {
            drop.innerHTML = res.map(p => `
              <div class="ev-pat-row" data-id="${p.id}" data-name="${p.first_name} ${p.last_name}">
                <span class="ev-pat-av">${p.first_name[0]}${p.last_name[0]}</span>
                <span>
                  <span class="block text-sm font-medium text-slate-900 dark:text-slate-100">${p.first_name} ${p.last_name}</span>
                  <span class="block text-xs text-slate-400 dark:text-slate-600">${p.phone || p.email || ''}</span>
                </span>
              </div>`).join('');
            drop.querySelectorAll('.ev-pat-row').forEach(el => {
              el.addEventListener('click', () => {
                input.value = el.dataset.name;
                if (hidId) hidId.value = el.dataset.id;
                drop.classList.add('hidden');
              });
            });
          }
          drop.classList.remove('hidden');
        } catch (err) { console.error('[Diary] Pat search:', err); }
      }, 200);
    });

    document.addEventListener('mousedown', e => {
      if (!drop.contains(e.target) && e.target !== input) drop.classList.add('hidden');
    });
  }

  // ── Drawer: form submit ───────────────────────────────────────────────────────

  async function submitDrawer() {
    const startTimeVal = $('ev-start-time')?.value || '09:00';
    const endTimeVal   = $('ev-end-time')?.value   || '09:30';
    const dateVal      = $('ev-date')?.value       || isoDate(new Date());
    const et           = $('ev-event-type')?.value || 'clinical_fup';
    const patId        = $('ev-patient-id')?.value || null;
    const titleVal     = $('ev-title')?.value      || '';
    const notesVal     = $('ev-notes')?.value      || '';
    const evId         = $('ev-event-id')?.value   || null;

    const sm   = parseHHMM(startTimeVal);
    const em   = parseHHMM(endTimeVal);
    const dur  = Math.max(UNIT_MIN, em - sm);

    const showErr = msg => {
      const el = $('ev-error');
      const tx = $('ev-error-text');
      if (el) { el.classList.remove('hidden'); el.classList.add('flex'); }
      if (tx)  tx.textContent = msg;
    };
    const hideErr = () => {
      const el = $('ev-error'); if (el) { el.classList.add('hidden'); el.classList.remove('flex'); }
    };
    hideErr();

    if (isClinical(et) && !patId) {
      showErr('Please select a patient for clinical appointments.');
      $('ev-patient-search')?.focus();
      return;
    }

    const payload = {
      patient_id:   patId ? Number(patId) : null,
      event_type:   et,
      title:        titleVal || EV[et]?.label || et,
      scheduled_at: toISO(dateVal, sm),
      end_time:     toISO(dateVal, em),
      duration_min: dur,
      is_recurring: 0,
      status:       'scheduled',
      type:         EV[et]?.label || et,
      notes:        notesVal || null,
    };

    const btn  = $('ev-submit');
    const lbl  = $('ev-submit-label');
    const spin = $('ev-spinner');
    if (btn)  btn.disabled = true;
    if (lbl)  lbl.textContent = 'Saving…';
    if (spin) spin.classList.remove('hidden');

    try {
      if (evId) {
        await window.api.diary.updateEvent(Number(evId), payload);
      } else {
        await window.api.diary.createEvent(payload);
      }
      closeEventDrawer();
      await loadEvents();
    } catch (err) {
      showErr(err.message || 'Failed to save. Please try again.');
    } finally {
      if (btn)  btn.disabled = false;
      if (lbl)  lbl.textContent = 'Save';
      if (spin) spin.classList.add('hidden');
    }
  }

  async function deleteEvent() {
    const id = $('ev-event-id')?.value;
    if (!id) return;
    if (!confirm('Delete this event? This cannot be undone.')) return;
    try {
      await window.api.diary.deleteEvent(Number(id));
      closeEventDrawer();
      await loadEvents();
    } catch (err) { console.error('[Diary] Delete:', err); }
  }

  // ── Appointment preview card ─────────────────────────────────────────────────

  function showApptPreview(ev, mouseEvent) {
    const card = $('appt-preview');
    if (!card) return;
    previewEvId = ev.id;

    const { startMin, endMin } = parseEvent(ev);
    const cfg  = EV[ev.event_type] || EV.clinical_fup;
    const name = ev.first_name ? `${ev.first_name} ${ev.last_name}` : (ev.title || cfg.label);

    $('ap-title').textContent = name;
    $('ap-time').textContent  = `${hhmm(startMin)} – ${hhmm(endMin)} · ${endMin-startMin} min · ${cfg.label}`;

    const notesEl = $('ap-notes');
    if (ev.notes) {
      notesEl.textContent = ev.notes;
      notesEl.classList.remove('hidden');
    } else {
      notesEl.classList.add('hidden');
    }

    // Show "Open Patient Portfolio" only for clinical events
    const profileBtn = $('ap-open-profile');
    if (profileBtn) profileBtn.classList.toggle('hidden', !isClinical(ev.event_type) || !ev.patient_id);

    // Position card near click
    const rect = document.documentElement.getBoundingClientRect();
    let left = mouseEvent.clientX + 12;
    let top  = mouseEvent.clientY - 40;
    if (left + 290 > window.innerWidth)  left = mouseEvent.clientX - 302;
    if (top + 180  > window.innerHeight) top  = window.innerHeight - 185;
    card.style.left = `${Math.max(8, left)}px`;
    card.style.top  = `${Math.max(8, top)}px`;
    card.classList.remove('hidden');
  }

  function closeApptPreview() {
    $('appt-preview')?.classList.add('hidden');
    previewEvId = null;
  }

  // ── Dashboard schedule mirror ─────────────────────────────────────────────────

  function updateDashboardSchedule() {
    // Refresh the dashboard schedule appointment count pill
    const pill = $('appt-count');
    if (pill) {
      const today = isoDate(new Date());
      const count = events.filter(ev => {
        try { return isoDate(new Date(ev.scheduled_at)) === today && ev.status !== 'cancelled'; }
        catch { return false; }
      }).length;
      pill.textContent = String(count);
    }
  }

  // ── Wire drawer UI (runs once) ────────────────────────────────────────────────

  function wireUI() {
    // Mode toggle
    $('ev-mode-clinical')?.addEventListener('click', () => {
      setDrawerMode('clinical');
      $('ev-event-type').value = 'clinical_fup';
      applyApptPreset('clinical_fup');
    });
    $('ev-mode-nonclinical')?.addEventListener('click', () => {
      setDrawerMode('nonclinical');
      $('ev-event-type').value = 'admin';
      applyApptPreset('admin');
    });

    // Appointment type presets
    document.querySelectorAll('[data-appt-type]').forEach(btn => {
      btn.addEventListener('click', () => {
        const t = btn.dataset.apptType;
        applyApptPreset(t);
        highlightPreset('[data-appt-type]', `[data-appt-type="${t}"]`);
      });
    });

    // Non-clinical presets
    document.querySelectorAll('[data-nc-type]').forEach(btn => {
      btn.addEventListener('click', () => {
        const t = btn.dataset.ncType;
        $('ev-event-type').value = t;
        const titleEl = $('ev-title');
        if (titleEl) titleEl.value = EV[t]?.label || '';
        applyApptPreset(t);
        highlightPreset('[data-nc-type]', `[data-nc-type="${t}"]`);
      });
    });

    // Time changes → update badge
    [$('ev-start-time'), $('ev-end-time')].forEach(el => {
      el?.addEventListener('change', updateDurationBadge);
    });

    // Drawer: close
    $('ev-close')?.addEventListener('click',   closeEventDrawer);
    $('ev-cancel')?.addEventListener('click',  closeEventDrawer);
    $('ev-backdrop')?.addEventListener('click', closeEventDrawer);

    // Drawer: form submit
    $('ev-form')?.addEventListener('submit', e => { e.preventDefault(); submitDrawer(); });

    // Drawer: delete
    $('ev-delete-btn')?.addEventListener('click', deleteEvent);

    // Drawer: new patient quick-link
    $('ev-new-patient-link')?.addEventListener('click', () => {
      closeEventDrawer();
      if (typeof openNewPatientModal === 'function') openNewPatientModal();
    });

    // Toolbar buttons
    $('diary-prev')?.addEventListener('click',      () => navigate(-1));
    $('diary-next')?.addEventListener('click',      () => navigate(1));
    $('diary-today')?.addEventListener('click',     goToday);
    $('diary-view-day')?.addEventListener('click',  () => setView('day'));
    $('diary-view-week')?.addEventListener('click', () => setView('week'));
    $('diary-book-btn')?.addEventListener('click', () => openEventDrawer({
      date: isoDate(anchor), startMin: 9*60, endMin: 9*60+30,
    }));

    // Appointment preview card
    $('ap-close')?.addEventListener('click', closeApptPreview);
    $('ap-edit-btn')?.addEventListener('click', () => {
      if (previewEvId == null) return;
      closeApptPreview();
      const ev = events.find(e => e.id === previewEvId);
      if (ev) { const p = parseEvent(ev); openEventDrawer({...ev, ...p}); }
    });
    $('ap-open-profile')?.addEventListener('click', () => {
      if (previewEvId == null) return;
      const ev = events.find(e => e.id === previewEvId);
      closeApptPreview();
      if (ev?.patient_id && typeof openPatientProfile === 'function') {
        openPatientProfile(ev.patient_id);
      }
    });

    // Patient search in drawer
    initDrawerPatientSearch();

    // Global Esc also closes drawer
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') { closeEventDrawer(); closeApptPreview(); }
    });

    // Close preview on outside click
    document.addEventListener('click', e => {
      const card = $('appt-preview');
      if (card && !card.classList.contains('hidden') && !card.contains(e.target)) {
        closeApptPreview();
      }
    });

    // Auto-refresh now-line every minute
    setInterval(renderNowLine, 60000);
  }

  // ── Public: Schedule Configuration & Dynamic Hours (Phase 8) ───────────────
  async function updateScheduleConfig(cfg) {
    if (!cfg && window.api?.settings) {
      try {
        cfg = await window.api.settings.getAll();
      } catch (err) {
        console.warn('[Diary] Failed to fetch settings for schedule config:', err);
      }
    }
    if (!cfg) return;

    if (cfg.work_start) {
      const startM = parseHHMM(cfg.work_start);
      DAY_START = Math.max(0, Math.floor(startM / 60));
    }
    if (cfg.work_end) {
      const endM = parseHHMM(cfg.work_end);
      DAY_END = Math.min(24, Math.ceil(endM / 60));
      if (DAY_END <= DAY_START) DAY_END = DAY_START + 8;
    }
    TOTAL_PX = (DAY_END - DAY_START) * HOUR_PX;

    lunchConfig.enabled = cfg.lunch_enabled === '1' || cfg.lunch_enabled === true || cfg.lunch_enabled === 'true';
    if (cfg.lunch_start) {
      const lStart = parseHHMM(cfg.lunch_start);
      const dur = Number(cfg.lunch_duration) || 60;
      lunchConfig.startMin = lStart;
      lunchConfig.endMin = lStart + dur;
    }

    if (cfg.active_days) {
      try {
        const days = typeof cfg.active_days === 'string' ? JSON.parse(cfg.active_days) : cfg.active_days;
        if (Array.isArray(days) && days.length > 0) {
          weekDays = Math.max(1, Math.min(7, days.length));
        }
      } catch (_) {}
    }

    buildGrid();
    await loadEvents();
  }

  // ── Public: activate ─────────────────────────────────────────────────────────

  async function activate() {
    if (!inited) {
      wireUI();
      inited = true;
    }
    anchor = new Date();
    if (window.api?.settings) {
      try {
        const cfg = await window.api.settings.getAll();
        if (cfg) {
          if (cfg.work_start) {
            const startM = parseHHMM(cfg.work_start);
            DAY_START = Math.max(0, Math.floor(startM / 60));
          }
          if (cfg.work_end) {
            const endM = parseHHMM(cfg.work_end);
            DAY_END = Math.min(24, Math.ceil(endM / 60));
            if (DAY_END <= DAY_START) DAY_END = DAY_START + 8;
          }
          TOTAL_PX = (DAY_END - DAY_START) * HOUR_PX;

          lunchConfig.enabled = cfg.lunch_enabled === '1' || cfg.lunch_enabled === true || cfg.lunch_enabled === 'true';
          if (cfg.lunch_start) {
            const lStart = parseHHMM(cfg.lunch_start);
            const dur = Number(cfg.lunch_duration) || 60;
            lunchConfig.startMin = lStart;
            lunchConfig.endMin = lStart + dur;
          }

          if (cfg.active_days) {
            try {
              const days = typeof cfg.active_days === 'string' ? JSON.parse(cfg.active_days) : cfg.active_days;
              if (Array.isArray(days) && days.length > 0) {
                weekDays = Math.max(1, Math.min(7, days.length));
              }
            } catch (_) {}
          }
        }
      } catch (_) {}
    }
    buildGrid();
    await loadEvents();

    // Scroll to 07:30 (half-unit before 08:00 so context is visible)
    const scrollEl = $('diary-scroll');
    if (scrollEl) scrollEl.scrollTop = HOUR_PX;
  }

  // Expose only what renderer.js needs
  return { activate, openEventDrawer, updateScheduleConfig };

})();
