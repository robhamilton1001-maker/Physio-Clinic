'use strict';

// ══════════════════════════════════════════════════════════════════════════════
//  SOLOPT — RESEARCH PAPER LIBRARY (researchLibrary.js)
//  Offline peer-reviewed paper repository, auto-metadata extraction & bookshelf UI.
//  Exposed as window.ResearchLibrary — called by renderer.js.
// ══════════════════════════════════════════════════════════════════════════════

window.ResearchLibrary = (() => {

  // ── State ───────────────────────────────────────────────────────────────────
  let papers       = [];
  let groups       = [];
  let activeFilter = 'ALL'; // 'ALL', 'FAVORITES', or group name e.g. 'Spine / Lumbar'
  let activeGroup  = 'All';
  let searchQuery  = '';
  let favoriteOnly = false;
  let sortBy       = 'date_uploaded_desc';
  let inited       = false;
  let pdfjsLib     = null;
  let pendingUpload = null; // metadata awaiting review modal confirmation
  let activeDetailPaper = null; // currently opened paper in dedicated detail view
  let cachedTotalCount = 0;
  let cachedFavCount = 0;
  let isClosing = false;

  const $ = id => document.getElementById(id);

  // ── Lazy PDF.js Loader ──────────────────────────────────────────────────────
  async function getPdfJs() {
    if (pdfjsLib) return pdfjsLib;
    try {
      pdfjsLib = await import('../node_modules/pdfjs-dist/build/pdf.min.mjs');
      pdfjsLib.GlobalWorkerOptions.workerSrc = '../node_modules/pdfjs-dist/build/pdf.worker.min.mjs';
      return pdfjsLib;
    } catch (err) {
      console.warn('[ResearchLibrary] PDF.js import fallback:', err);
      return null;
    }
  }

  /** Render Page 1 to PNG Data URL using native HTML5 Canvas */
  async function renderThumbnailFromBase64(base64Data) {
    try {
      const lib = await getPdfJs();
      if (!lib) return null;
      const raw = atob(base64Data);
      const uint8Array = new Uint8Array(raw.length);
      for (let i = 0; i < raw.length; i++) {
        uint8Array[i] = raw.charCodeAt(i);
      }
      const doc = await lib.getDocument({ data: uint8Array }).promise;
      const page = await doc.getPage(1);
      const viewport = page.getViewport({ scale: 0.9 });
      const canvas = document.createElement('canvas');
      canvas.width = viewport.width;
      canvas.height = viewport.height;
      const ctx = canvas.getContext('2d');
      await page.render({ canvasContext: ctx, viewport }).promise;
      return canvas.toDataURL('image/png');
    } catch (err) {
      console.warn('[ResearchLibrary] Thumbnail render error:', err);
      return null;
    }
  }

  // ── Group Styling Helpers ───────────────────────────────────────────────────
  const GROUP_THEMES = {
    'Spine / Lumbar':        { bg: 'from-blue-600/90 to-indigo-900', border: 'border-blue-500/30', badge: 'bg-blue-500/15 text-blue-700 dark:text-blue-300 border-blue-500/30' },
    'Knee / ACL':            { bg: 'from-emerald-600/90 to-teal-900', border: 'border-emerald-500/30', badge: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30' },
    'Shoulder':              { bg: 'from-amber-600/90 to-orange-900', border: 'border-amber-500/30', badge: 'bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30' },
    'Tendon / Tendinopathy': { bg: 'from-rose-600/90 to-red-950', border: 'border-rose-500/30', badge: 'bg-rose-500/15 text-rose-700 dark:text-rose-300 border-rose-500/30' },
    'Pain Science':          { bg: 'from-violet-600/90 to-purple-950', border: 'border-violet-500/30', badge: 'bg-violet-500/15 text-violet-700 dark:text-violet-300 border-violet-500/30' },
    'S&C / Periodization':   { bg: 'from-cyan-600/90 to-slate-900', border: 'border-cyan-500/30', badge: 'bg-cyan-500/15 text-cyan-700 dark:text-cyan-300 border-cyan-500/30' },
    'Hip & Pelvis':          { bg: 'from-indigo-600/90 to-slate-950', border: 'border-indigo-500/30', badge: 'bg-indigo-500/15 text-indigo-700 dark:text-indigo-300 border-indigo-500/30' },
    'Foot & Ankle':          { bg: 'from-teal-600/90 to-slate-900', border: 'border-teal-500/30', badge: 'bg-teal-500/15 text-teal-700 dark:text-teal-300 border-teal-500/30' },
  };

  function getGroupTheme(group) {
    return GROUP_THEMES[group] || {
      bg: 'from-slate-700 to-slate-900',
      border: 'border-slate-500/30',
      badge: 'bg-slate-500/15 text-slate-700 dark:text-slate-300 border-slate-500/30'
    };
  }

  // ── Real-Time Favorites & Total Count Badges ────────────────────────────────
  async function updateFavoritesCountBadge(count) {
    if (typeof count === 'number') {
      cachedFavCount = count;
    } else {
      try {
        if (window.api?.research?.getCounts) {
          const counts = await window.api.research.getCounts();
          cachedTotalCount = counts.total;
          cachedFavCount = counts.favorites;
        } else if (window.api?.research?.getFavoriteCount) {
          cachedFavCount = await window.api.research.getFavoriteCount();
        }
      } catch (err) {
        console.warn('[ResearchLibrary] Failed to query favorite count:', err);
      }
    }

    const favBadge = $('pill-count-favorites');
    if (favBadge) favBadge.textContent = String(cachedFavCount);

    const allBadge = $('pill-count-all');
    if (allBadge && cachedTotalCount > 0) allBadge.textContent = String(cachedTotalCount);
  }

  // ── Set Active Group Filter ─────────────────────────────────────────────────
  async function setActiveGroupFilter(group) {
    if (!group) return;
    activeFilter = group;

    if (group === 'ALL') {
      activeGroup = 'All';
      favoriteOnly = false;
    } else if (group === 'FAVORITES') {
      activeGroup = 'All';
      favoriteOnly = true;
    } else {
      activeGroup = group;
      favoriteOnly = false;
    }

    // Update active pill styling instantly in DOM
    const container = $('research-chips-container');
    if (container) {
      container.querySelectorAll('.btn-group-filter, [data-group-filter]').forEach(btn => {
        const g = btn.dataset.groupFilter || btn.getAttribute('data-group-filter');
        if (g === activeFilter) {
          btn.classList.add('research-chip-active');
        } else {
          btn.classList.remove('research-chip-active');
        }
      });
    }

    // Load papers matching the new filter
    await loadPapers();
  }

  // ── Data Loading ────────────────────────────────────────────────────────────
  async function loadPapers() {
    if (!window.api?.research) return;
    try {
      papers = await window.api.research.list({
        group: activeGroup,
        search: searchQuery,
        favoriteOnly,
        sortBy
      });
      groups = await window.api.research.getGroups();
      if (window.api?.research?.getCounts) {
        const counts = await window.api.research.getCounts();
        cachedTotalCount = counts.total;
        cachedFavCount = counts.favorites;
      }
    } catch (err) {
      console.error('[ResearchLibrary] Failed to load papers:', err);
      papers = [];
    }
    renderHeaderStats();
    renderFilterChips();
    renderBookshelf();
    updateFavoritesCountBadge();
  }

  // ── Render Header Stats ─────────────────────────────────────────────────────
  function renderHeaderStats() {
    const badge = $('research-count-badge');
    if (badge) {
      badge.textContent = `${papers.length} paper${papers.length === 1 ? '' : 's'}`;
    }
  }

  // ── Render Filter Chips Bar ─────────────────────────────────────────────────
  function renderFilterChips() {
    const container = $('research-chips-container');
    if (!container) return;

    const allCount = cachedTotalCount || papers.length;
    const favCount = cachedFavCount;

    let html = `
      <button type="button" class="btn-group-filter research-chip ${activeFilter === 'ALL' ? 'research-chip-active' : ''}" data-group-filter="ALL">
        <span class="pointer-events-none font-medium">All Papers</span>
        <span id="pill-count-all" class="ml-1.5 px-1.5 py-0.5 rounded-full text-[10px] font-semibold bg-slate-200/60 dark:bg-slate-700/60 pointer-events-none">${allCount}</span>
      </button>
      <button type="button" class="btn-group-filter research-chip ${activeFilter === 'FAVORITES' ? 'research-chip-active' : ''}" data-group-filter="FAVORITES">
        <span class="pointer-events-none flex items-center gap-1.5 font-medium">
          <svg class="w-3.5 h-3.5 pointer-events-none text-amber-500 fill-amber-400 stroke-amber-500" viewBox="0 0 24 24" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
          <span>Favorites</span>
        </span>
        <span id="pill-count-favorites" class="ml-1.5 px-1.5 py-0.5 rounded-full text-[10px] font-semibold bg-amber-200/60 dark:bg-amber-900/40 text-amber-800 dark:text-amber-300 pointer-events-none">${favCount}</span>
      </button>
    `;

    // Clinical Group Chips
    groups.forEach(g => {
      const isActive = activeFilter === g;
      html += `
        <button type="button" class="btn-group-filter research-chip ${isActive ? 'research-chip-active' : ''}" data-group-filter="${escapeAttr(g)}">
          <span class="pointer-events-none font-medium">${escapeHtml(g)}</span>
        </button>
      `;
    });

    // Add Group Chip
    html += `
      <button type="button" id="btn-research-add-group"
              class="research-chip text-indigo-600 dark:text-indigo-400 hover:border-indigo-400 border-dashed cursor-pointer">
        <span class="pointer-events-none font-medium">+ Add Group</span>
      </button>
    `;

    container.innerHTML = html;

    const addGroupBtn = $('btn-research-add-group');
    if (addGroupBtn) {
      addGroupBtn.onclick = (e) => {
        e.stopPropagation();
        promptCreateGroup();
      };
    }
  }

  // ── Render Bookshelf Grid ───────────────────────────────────────────────────
  function renderBookshelf() {
    const grid = $('research-grid');
    const emptyState = $('research-empty-state');
    if (!grid) return;

    if (!papers.length) {
      grid.innerHTML = '';
      if (emptyState) emptyState.classList.remove('hidden');
      return;
    }

    if (emptyState) emptyState.classList.add('hidden');

    grid.innerHTML = papers.map(paper => {
      const theme = getGroupTheme(paper.group_tag);
      const isFav = paper.is_favorite === 1;
      const pubYear = paper.publication_date ? paper.publication_date.slice(0, 4) : '';
      const authorsShort = paper.authors ? paper.authors.split(';')[0].split(',')[0].trim() : 'Unknown';
      const metaLine = pubYear ? `${authorsShort} et al. · ${pubYear}` : authorsShort;

      // Cover preview: thumbnail image vs elegant editorial book cover
      const coverHtml = paper.thumbnail_path
        ? `<img src="file://${paper.thumbnail_path}" alt="Cover" class="w-full h-full object-cover object-top select-none pointer-events-none" />`
        : `
          <div class="w-full h-full bg-gradient-to-br ${theme.bg} p-4 flex flex-col justify-between text-white relative overflow-hidden select-none border-l-4 border-l-black/30 shadow-inner pointer-events-none">
            <div class="space-y-1 pointer-events-none">
              <span class="inline-block text-[9px] uppercase tracking-widest font-bold opacity-75 pointer-events-none">${escapeHtml(paper.group_tag || 'Evidence')}</span>
              <h4 class="font-serif text-xs font-semibold leading-snug line-clamp-4 drop-shadow-sm pointer-events-none">${escapeHtml(paper.title)}</h4>
            </div>
            <div class="border-t border-white/20 pt-2 flex items-center justify-between text-[10px] font-medium opacity-85 pointer-events-none">
              <span class="truncate pointer-events-none">${escapeHtml(authorsShort)}</span>
              <span class="font-mono font-bold pointer-events-none">${escapeHtml(pubYear)}</span>
            </div>
          </div>
        `;

      return `
        <div class="research-paper-card research-book-card group cursor-pointer" data-paper-id="${paper.id}">
          <!-- Top Cover Canvas -->
          <div class="research-book-cover relative overflow-hidden pointer-events-none">
            ${coverHtml}

            <!-- Category & Favorite Pill in Header (Non-interactive indicator) -->
            <div class="absolute top-2 left-2 right-2 flex items-center justify-between pointer-events-none z-10">
              <span class="px-2 py-0.5 rounded text-[9px] font-semibold tracking-wide border shadow-sm ${theme.badge} truncate max-w-[130px] pointer-events-none backdrop-blur-sm">
                ${escapeHtml(paper.group_tag || 'General')}
              </span>
              ${isFav ? `
                <span class="p-1 rounded-full bg-slate-900/60 backdrop-blur-sm text-amber-400 drop-shadow pointer-events-none flex items-center justify-center">
                  <svg class="w-3 h-3 pointer-events-none fill-amber-400 stroke-amber-400" viewBox="0 0 24 24" stroke-width="1.5">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                  </svg>
                </span>` : ''}
            </div>

            <!-- Stylish Frosted Hover Overlay (Strict pointer-events: none) -->
            <div class="paper-card-overlay research-cover-overlay pointer-events-none">
              <div class="px-3.5 py-2 rounded-xl bg-indigo-600/90 dark:bg-indigo-600/95 text-white text-xs font-semibold shadow-lg shadow-black/40 flex items-center gap-1.5 border border-white/20 transform translate-y-1 group-hover:translate-y-0 transition-transform duration-200 pointer-events-none select-none">
                <svg class="w-4 h-4 pointer-events-none shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
                </svg>
                <span class="pointer-events-none tracking-wide">View Paper Details</span>
              </div>
            </div>
          </div>

          <!-- Card Typography Footer -->
          <div class="p-3.5 flex flex-col justify-between flex-1 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 pointer-events-none">
            <div class="pointer-events-none">
              <h3 class="font-semibold text-xs text-slate-900 dark:text-slate-100 leading-snug line-clamp-2 pointer-events-none" title="${escapeHtml(paper.title)}">
                ${escapeHtml(paper.title)}
              </h3>
              <p class="text-[11px] text-slate-500 dark:text-slate-400 mt-1 truncate pointer-events-none">
                ${escapeHtml(metaLine)}
              </p>
            </div>
            ${paper.notes ? `<p class="text-[10px] text-slate-400 dark:text-slate-500 mt-2 line-clamp-2 italic border-t border-slate-100 dark:border-slate-800/80 pt-1.5 pointer-events-none">${escapeHtml(paper.notes)}</p>` : ''}
          </div>
        </div>
      `;
    }).join('');
  }

  // ── Favorite Toggle Handler (Instant UI + IPC) ──────────────────────────────
  async function toggleFavoritePaper(paperId, favoriteBtn) {
    if (!paperId) return;
    const numId = Number(paperId);
    let paper = papers.find(p => p.id === numId);
    if (!paper && activeDetailPaper && activeDetailPaper.id === numId) {
      paper = activeDetailPaper;
    }
    const newFav = paper ? (paper.is_favorite === 1 ? 0 : 1) : 1;
    if (paper) paper.is_favorite = newFav;

    // Instant DOM update across all matching favorite buttons for this paper ID
    const starFilledIcon = `<svg class="w-4 h-4 pointer-events-none fill-amber-400 stroke-amber-500" viewBox="0 0 24 24" stroke-width="1.5"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>`;
    const starOutlineIcon = `<svg class="w-4 h-4 pointer-events-none fill-none stroke-current" viewBox="0 0 24 24" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>`;

    document.querySelectorAll(`.btn-favorite-toggle[data-paper-id="${numId}"], .btn-favorite-toggle[data-id="${numId}"]`).forEach(btn => {
      btn.innerHTML = `<span class="pointer-events-none flex items-center justify-center">${newFav === 1 ? starFilledIcon : starOutlineIcon}</span>`;
      btn.title = newFav === 1 ? 'Remove from favorites' : 'Add to favorites';
      if (newFav === 1) {
        btn.classList.remove('text-slate-400');
        btn.classList.add('text-amber-400');
      } else {
        btn.classList.remove('text-amber-400');
        btn.classList.add('text-slate-400');
      }
    });

    if (activeDetailPaper && activeDetailPaper.id === numId) {
      activeDetailPaper.is_favorite = newFav;
      updateDetailFavoriteUI();
    }

    try {
      if (window.api?.research?.setFavorite) {
        await window.api.research.setFavorite(numId, newFav);
      } else if (window.api?.research?.toggleFavorite) {
        await window.api.research.toggleFavorite(numId);
      }
    } catch (err) {
      console.error('[ResearchLibrary] Failed to persist favorite state:', err);
    }

    // If filtering by favorites only and item was un-favorited:
    if (favoriteOnly && newFav === 0) {
      const card = document.querySelector(`.research-paper-card[data-paper-id="${numId}"], .research-book-card[data-paper-id="${numId}"]`);
      if (card) {
        card.remove();
        const badge = $('research-count-badge');
        if (badge) {
          const remaining = document.querySelectorAll('#research-grid .research-paper-card, #research-grid .research-book-card').length;
          badge.textContent = `${remaining} paper${remaining === 1 ? '' : 's'}`;
        }
      }
    }
  }

  // ── Reveal Paper File in OS Explorer ────────────────────────────────────────
  function revealPaperFile(paperId) {
    if (!paperId) return;
    const numId = Number(paperId);
    let paper = papers.find(p => p.id === numId);
    if (!paper && activeDetailPaper && activeDetailPaper.id === numId) paper = activeDetailPaper;
    if (paper?.file_path && window.api?.research?.showInFolder) {
      window.api.research.showInFolder(paper.file_path);
    }
  }

  // ── Delete Paper Handler ────────────────────────────────────────────────────
  async function deletePaperById(paperId) {
    if (!paperId) return;
    const numId = Number(paperId);
    let paper = papers.find(p => p.id === numId);
    if (!paper && activeDetailPaper && activeDetailPaper.id === numId) paper = activeDetailPaper;
    const title = paper?.title || `Paper #${paperId}`;
    if (confirm(`Delete "${title}" from your library? This cannot be undone.`)) {
      if (window.api?.research?.delete) {
        await window.api.research.delete(numId);
      }
      if (activeDetailPaper && activeDetailPaper.id === numId) {
        closePaperDetail();
      } else {
        await loadPapers();
      }
    }
  }

  // ── Open PDF in Desktop Viewer ──────────────────────────────────────────────
  async function openPdfViewer(paper) {
    if (!paper) return;
    const res = await window.api.research.openPdf(paper.file_path);
    if (res?.isSample) {
      alert(`"${paper.title}" is a seeded benchmark clinical reference paper.\n\nUse the "+ Upload Paper" button at the top to add your own local PDF files from disk, which will launch instantly in your OS default desktop reader.`);
    } else if (res?.error) {
      alert(`Could not open PDF: ${res.error}`);
    }
  }

  // ── Open Paper Detail by ID ─────────────────────────────────────────────────
  async function openPaperDetailView(paperId) {
    if (!paperId) return;
    const numId = Number(paperId);
    let paper = papers.find(p => p.id === numId);
    if (!paper && window.api?.research?.getById) {
      try {
        paper = await window.api.research.getById(numId);
      } catch (err) {
        console.warn('[ResearchLibrary] Failed to fetch paper from SQLite:', err);
      }
    }
    if (!paper) {
      console.warn(`[ResearchLibrary] Paper #${paperId} could not be loaded.`);
      return;
    }
    openPaperDetail(paper);
  }

  // ── Dedicated Paper Details & Reader View ───────────────────────────────────
  function openPaperDetail(paper) {
    if (!paper) return;
    activeDetailPaper = paper;

    // Breadcrumb
    const breadcrumb = $('paper-detail-breadcrumb');
    if (breadcrumb) breadcrumb.textContent = paper.title || 'Paper Details';

    // Title input
    const titleInput = $('paper-detail-title-input');
    if (titleInput) titleInput.value = paper.title || '';

    // Metadata
    const authorsEl = $('paper-detail-authors');
    if (authorsEl) authorsEl.textContent = paper.authors || 'Unknown Authors';

    const pubdateEl = $('paper-detail-pubdate');
    if (pubdateEl) pubdateEl.textContent = paper.publication_date || 'N/A';

    const uploadedEl = $('paper-detail-uploaded');
    if (uploadedEl) {
      uploadedEl.textContent = paper.date_uploaded
        ? new Date(paper.date_uploaded).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
        : '—';
    }

    // Cover preview
    const coverBox = $('paper-detail-cover-box');
    if (coverBox) {
      if (paper.thumbnail_path) {
        coverBox.innerHTML = `<img src="file://${paper.thumbnail_path}" alt="Cover" class="w-full h-full object-cover object-top select-none pointer-events-none" />`;
      } else {
        const theme = getGroupTheme(paper.group_tag);
        const authorsShort = paper.authors ? paper.authors.split(';')[0].split(',')[0].trim() : 'Unknown';
        const pubYear = paper.publication_date ? paper.publication_date.slice(0, 4) : '';
        coverBox.innerHTML = `
          <div class="w-full h-full bg-gradient-to-br ${theme.bg} p-6 flex flex-col justify-between text-white relative overflow-hidden select-none border-l-8 border-l-black/30 shadow-inner pointer-events-none">
            <div class="space-y-2">
              <span class="inline-block text-[10px] uppercase tracking-widest font-bold opacity-75">${escapeHtml(paper.group_tag || 'Evidence')}</span>
              <h4 class="font-serif text-sm font-semibold leading-snug drop-shadow-sm">${escapeHtml(paper.title)}</h4>
            </div>
            <div class="border-t border-white/20 pt-3 flex items-center justify-between text-xs font-medium opacity-85">
              <span class="truncate">${escapeHtml(authorsShort)}</span>
              <span class="font-mono font-bold">${escapeHtml(pubYear)}</span>
            </div>
          </div>
        `;
      }
    }

    // Favorite Button UI
    updateDetailFavoriteUI();

    // Group selector
    const groupSelect = $('paper-detail-group-select');
    if (groupSelect) {
      const allKnownGroups = Array.from(new Set(['General', ...groups, paper.group_tag].filter(Boolean))).sort();
      groupSelect.innerHTML = allKnownGroups.map(g => `
        <option value="${escapeAttr(g)}" ${g === paper.group_tag ? 'selected' : ''}>${escapeHtml(g)}</option>
      `).join('');
    }

    // Notes textarea
    const notesInput = $('paper-detail-notes');
    if (notesInput) notesInput.value = paper.notes || '';

    // Switch view to dedicated Paper Detail View
    if (typeof window.switchView === 'function') {
      window.switchView('paper-detail');
    } else {
      const libraryView = $('view-research-library');
      const detailView = $('view-paper-detail');
      if (libraryView) {
        libraryView.classList.add('hidden', 'view-pane-hidden');
        libraryView.style.setProperty('display', 'none', 'important');
        libraryView.style.setProperty('pointer-events', 'none', 'important');
        libraryView.setAttribute('aria-hidden', 'true');
      }
      if (detailView) {
        detailView.classList.remove('hidden', 'view-pane-hidden');
        detailView.style.setProperty('display', 'flex', 'important');
        detailView.style.setProperty('pointer-events', 'auto', 'important');
        detailView.setAttribute('aria-hidden', 'false');
      }
    }
  }

  function updateDetailFavoriteUI() {
    if (!activeDetailPaper) return;
    const isFav = activeDetailPaper.is_favorite === 1;
    const starEl = $('paper-detail-fav-star');
    const labelEl = $('paper-detail-fav-label');
    const favBtn = $('btn-paper-detail-fav');

    const starFilledIcon = `<svg class="w-4 h-4 pointer-events-none fill-amber-400 stroke-amber-500" viewBox="0 0 24 24" stroke-width="1.5"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>`;
    const starOutlineIcon = `<svg class="w-4 h-4 pointer-events-none fill-none stroke-current" viewBox="0 0 24 24" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>`;

    if (starEl) starEl.innerHTML = isFav ? starFilledIcon : starOutlineIcon;
    if (labelEl) labelEl.textContent = isFav ? 'Favorited' : 'Add to Favorites';

    if (favBtn) {
      if (isFav) {
        favBtn.className = 'btn-ghost py-2 px-3.5 rounded-xl border border-amber-300 dark:border-amber-500/40 bg-amber-50/70 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 flex items-center gap-2 text-xs font-semibold cursor-pointer select-none transition-all shadow-sm';
      } else {
        favBtn.className = 'btn-ghost py-2 px-3.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white flex items-center gap-2 text-xs font-semibold cursor-pointer select-none transition-all';
      }
    }
  }

  // ── Flush Debounced Saves on Detail View Exit ───────────────────────────────
  async function flushPendingDetailSaves() {
    if (!activeDetailPaper) return;
    if (titleSaveTimeout) {
      clearTimeout(titleSaveTimeout);
      titleSaveTimeout = null;
      const titleInput = $('paper-detail-title-input');
      const val = titleInput ? titleInput.value.trim() : activeDetailPaper.title;
      if (val && window.api?.research?.update) {
        try { await window.api.research.update(activeDetailPaper.id, { title: val }); } catch (_) {}
      }
    }
    if (notesSaveTimeout) {
      clearTimeout(notesSaveTimeout);
      notesSaveTimeout = null;
      const notesInput = $('paper-detail-notes');
      const val = notesInput ? notesInput.value : activeDetailPaper.notes;
      if (window.api?.research?.update) {
        try { await window.api.research.update(activeDetailPaper.id, { notes: val }); } catch (_) {}
      }
    }
  }

  // ── Return to Bookshelf ─────────────────────────────────────────────────────
  async function closePaperDetail() {
    if (isClosing) return;
    isClosing = true;
    try {
      await flushPendingDetailSaves();
      activeDetailPaper = null;

      if (typeof window.switchView === 'function') {
        window.switchView('research-library');
      } else {
        const bookshelfView = $('view-research-library');
        const detailView = $('view-paper-detail');
        if (detailView) {
          detailView.classList.add('hidden', 'view-pane-hidden');
          detailView.style.setProperty('display', 'none', 'important');
          detailView.style.setProperty('pointer-events', 'none', 'important');
          detailView.setAttribute('aria-hidden', 'true');
        }
        if (bookshelfView) {
          bookshelfView.classList.remove('hidden', 'view-pane-hidden');
          bookshelfView.style.setProperty('display', 'flex', 'important');
          bookshelfView.style.setProperty('pointer-events', 'auto', 'important');
          bookshelfView.setAttribute('aria-hidden', 'false');
        }
      }
      await loadPapers();
    } finally {
      isClosing = false;
    }
  }

  let titleSaveTimeout = null;
  function handleDetailTitleInput(e) {
    if (!activeDetailPaper) return;
    const newTitle = e.target.value.trim();
    if (!newTitle) return;
    activeDetailPaper.title = newTitle;
    clearTimeout(titleSaveTimeout);
    titleSaveTimeout = setTimeout(async () => {
      try {
        await window.api.research.update(activeDetailPaper.id, { title: newTitle });
        const st = $('paper-detail-title-status');
        if (st) {
          st.classList.remove('opacity-0');
          setTimeout(() => st.classList.add('opacity-0'), 1500);
        }
      } catch (err) {
        console.error('[ResearchDetail] Failed to save title:', err);
      }
    }, 400);
  }

  let notesSaveTimeout = null;
  function handleDetailNotesInput(e) {
    if (!activeDetailPaper) return;
    const newNotes = e.target.value;
    activeDetailPaper.notes = newNotes;
    clearTimeout(notesSaveTimeout);
    notesSaveTimeout = setTimeout(async () => {
      try {
        await window.api.research.update(activeDetailPaper.id, { notes: newNotes });
        const st = $('paper-detail-notes-status');
        if (st) {
          st.classList.remove('opacity-0');
          setTimeout(() => st.classList.add('opacity-0'), 1500);
        }
      } catch (err) {
        console.error('[ResearchDetail] Failed to save notes:', err);
      }
    }, 400);
  }

  async function handleDetailGroupChange(e) {
    if (!activeDetailPaper) return;
    const newGroup = e.target.value;
    activeDetailPaper.group_tag = newGroup;
    try {
      await window.api.research.update(activeDetailPaper.id, { group_tag: newGroup });
      if (!activeDetailPaper.thumbnail_path) {
        openPaperDetail(activeDetailPaper);
      }
    } catch (err) {
      console.error('[ResearchDetail] Failed to update group:', err);
    }
  }

  async function handleDetailAddGroup() {
    const inp = $('paper-detail-new-group-input');
    let newGroup = (inp?.value || '').trim();
    if (!newGroup) {
      newGroup = prompt('Enter a new clinical group name (e.g. "Foot & Ankle", "Pediatric MSK", "Post-Op Spinal Fusion"):');
      if (!newGroup || !newGroup.trim()) return;
      newGroup = newGroup.trim();
    }
    if (inp) inp.value = '';

    try {
      if (window.api?.research?.addGroup) {
        await window.api.research.addGroup(newGroup);
      }
    } catch (err) {
      console.warn('[ResearchDetail] Failed to persist group in database:', err);
    }

    if (!groups.includes(newGroup)) {
      groups.push(newGroup);
      groups.sort();
    }

    if (activeDetailPaper) {
      activeDetailPaper.group_tag = newGroup;
      try {
        await window.api.research.update(activeDetailPaper.id, { group_tag: newGroup });
      } catch (err) {
        console.error('[ResearchDetail] Failed to assign paper to group:', err);
      }
      openPaperDetail(activeDetailPaper);
    }

    renderFilterChips();
  }

  async function handleDetailFavoriteToggle() {
    if (!activeDetailPaper) return;
    const newFav = activeDetailPaper.is_favorite === 1 ? 0 : 1;
    activeDetailPaper.is_favorite = newFav;
    updateDetailFavoriteUI();
    try {
      if (window.api?.research?.setFavorite) {
        await window.api.research.setFavorite(activeDetailPaper.id, newFav);
      } else {
        await window.api.research.toggleFavorite(activeDetailPaper.id);
      }
    } catch (err) {
      console.error('[ResearchDetail] Failed to toggle favorite:', err);
    }
    await updateFavoritesCountBadge();
  }

  // ── Upload Paper Workflow (Native Dialog + Offline Pipeline) ────────────────
  async function triggerUploadWorkflow() {
    if (!window.api?.research) return;

    // 1. Open Native Windows PDF File Dialog
    const selectRes = await window.api.research.selectPdf();
    if (selectRes.canceled || !selectRes.filePath) return;

    const filePath = selectRes.filePath;

    // Show review modal with loading skeleton
    openReviewModalLoading();

    // 2. Offline Extraction Pipeline (pdf-parse text, title, authors, keywords)
    const parseRes = await window.api.research.parseMetadata(filePath);
    if (!parseRes || !parseRes.success) {
      alert(`Failed to parse PDF document: ${parseRes?.error || 'Unknown error'}`);
      closeReviewModal();
      return;
    }

    // 3. Render 1st-Page Thumbnail via Canvas
    let thumbDataUrl = null;
    if (parseRes.fileBase64) {
      thumbDataUrl = await renderThumbnailFromBase64(parseRes.fileBase64);
    }

    pendingUpload = {
      sourceFilePath: filePath,
      title: parseRes.title,
      authors: parseRes.authors,
      publicationDate: parseRes.publicationDate,
      groupTag: parseRes.suggestedGroup || 'General / MSK',
      notes: '',
      thumbnailDataUrl: thumbDataUrl
    };

    // 4. Populate Pre-Save Review Modal
    populateReviewModal(pendingUpload);
  }

  function openReviewModalLoading() {
    const modal = $('modal-paper-review');
    const backdrop = $('modal-paper-backdrop');
    if (!modal) return;

    $('rev-loading-state')?.classList.remove('hidden');
    $('rev-form-state')?.classList.add('hidden');

    if (backdrop) {
      backdrop.classList.remove('hidden');
      backdrop.style.setProperty('display', 'block', 'important');
      backdrop.style.setProperty('pointer-events', 'auto', 'important');
    }
    modal.classList.remove('hidden');
    modal.style.setProperty('display', 'flex', 'important');
    modal.style.setProperty('pointer-events', 'auto', 'important');
  }

  function populateReviewModal(data) {
    $('rev-loading-state')?.classList.add('hidden');
    $('rev-form-state')?.classList.remove('hidden');

    $('rev-title').value   = data.title || '';
    $('rev-authors').value = data.authors || '';
    $('rev-date').value    = data.publicationDate || '';
    $('rev-notes').value   = data.notes || '';

    // Populate Group Dropdown
    const select = $('rev-group-select');
    if (select) {
      const distinctGroups = Array.from(new Set([...groups, 'Spine / Lumbar', 'Knee / ACL', 'Shoulder', 'Tendon / Tendinopathy', 'Pain Science', 'S&C / Periodization', 'Hip & Pelvis', 'Foot & Ankle', 'General / MSK', data.groupTag]));
      select.innerHTML = distinctGroups.map(g => `
        <option value="${escapeHtml(g)}" ${g === data.groupTag ? 'selected' : ''}>${escapeHtml(g)}</option>
      `).join('') + `<option value="__NEW__">+ Create New Group…</option>`;
    }

    // Thumbnail Preview on Left
    const thumbContainer = $('rev-thumb-preview');
    if (thumbContainer) {
      if (data.thumbnailDataUrl) {
        thumbContainer.innerHTML = `<img src="${data.thumbnailDataUrl}" class="w-full h-full object-cover rounded-lg shadow-md" />`;
      } else {
        thumbContainer.innerHTML = `
          <div class="w-full h-full rounded-lg bg-indigo-900/30 border border-indigo-500/20 flex flex-col items-center justify-center p-4 text-center">
            <svg class="h-10 w-10 text-indigo-400 mb-2 opacity-60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span class="text-xs text-indigo-300 font-medium">Page 1 Text Document</span>
          </div>
        `;
      }
    }
  }

  function closeReviewModal() {
    const modal = $('modal-paper-review');
    const backdrop = $('modal-paper-backdrop');
    modal?.classList.add('hidden');
    modal?.style.setProperty('display', 'none', 'important');
    modal?.style.setProperty('pointer-events', 'none', 'important');

    if (backdrop) {
      backdrop.classList.add('hidden');
      backdrop.style.setProperty('display', 'none', 'important');
      backdrop.style.setProperty('pointer-events', 'none', 'important');
    }
    pendingUpload = null;
  }

  async function savePendingPaper() {
    if (!pendingUpload) return;

    let group = $('rev-group-select')?.value || 'General / MSK';
    if (group === '__NEW__') {
      const custom = $('rev-group-custom')?.value.trim();
      group = custom || 'General / MSK';
    }

    const payload = {
      sourceFilePath: pendingUpload.sourceFilePath,
      title: $('rev-title')?.value.trim() || pendingUpload.title,
      authors: $('rev-authors')?.value.trim() || pendingUpload.authors,
      publicationDate: $('rev-date')?.value.trim() || pendingUpload.publicationDate,
      groupTag: group,
      notes: $('rev-notes')?.value.trim() || '',
      thumbnailDataUrl: pendingUpload.thumbnailDataUrl
    };

    const saveBtn = $('rev-btn-save');
    if (saveBtn) {
      saveBtn.disabled = true;
      saveBtn.textContent = 'Saving to Library…';
    }

    try {
      const res = await window.api.research.savePaper(payload);
      if (!res || !res.success) {
        alert(`Error saving paper: ${res?.error || 'Unknown error'}`);
      } else {
        closeReviewModal();
        activeGroup = payload.groupTag;
        await loadPapers();
      }
    } catch (err) {
      alert(`Save error: ${err.message}`);
    } finally {
      if (saveBtn) {
        saveBtn.disabled = false;
        saveBtn.textContent = 'Save to Library';
      }
    }
  }

  // ── Add Group Prompt ────────────────────────────────────────────────────────
  async function promptCreateGroup() {
    const newGroup = prompt('Enter a new clinical group name (e.g. "Foot & Ankle", "Pediatric MSK", "Post-Op Lumbar"):');
    if (newGroup && newGroup.trim()) {
      const cleanGroup = newGroup.trim();
      try {
        if (window.api?.research?.addGroup) {
          await window.api.research.addGroup(cleanGroup);
        }
      } catch (err) {
        console.warn('[ResearchLibrary] Failed to persist group in database:', err);
      }
      if (!groups.includes(cleanGroup)) {
        groups.push(cleanGroup);
        groups.sort();
      }
      if (activeDetailPaper) {
        activeDetailPaper.group_tag = cleanGroup;
        try {
          await window.api.research.update(activeDetailPaper.id, { group_tag: cleanGroup });
        } catch (err) {
          console.warn('[ResearchLibrary] Failed to assign paper to group:', err);
        }
        openPaperDetail(activeDetailPaper);
      } else {
        activeGroup = cleanGroup;
        favoriteOnly = false;
        renderFilterChips();
        renderBookshelf();
      }
    }
  }

  // ── HTML Escaping ───────────────────────────────────────────────────────────
  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function escapeAttr(str) {
    return escapeHtml(str);
  }

  // ── Wire UI Listeners (Runs Once) ───────────────────────────────────────────
  function wireUI() {
    // Top "+ Upload Paper" buttons
    $('btn-research-upload')?.addEventListener('click', triggerUploadWorkflow);
    $('btn-research-empty-upload')?.addEventListener('click', triggerUploadWorkflow);

    // Live Search
    let searchTimer;
    $('research-search')?.addEventListener('input', e => {
      clearTimeout(searchTimer);
      searchTimer = setTimeout(() => {
        searchQuery = e.target.value.trim();
        loadPapers();
      }, 150);
    });

    // Clear Search
    $('research-search-clear')?.addEventListener('click', () => {
      const inp = $('research-search');
      if (inp) inp.value = '';
      searchQuery = '';
      loadPapers();
    });

    // Sort Dropdown
    $('research-sort')?.addEventListener('change', e => {
      sortBy = e.target.value;
      loadPapers();
    });

    // Review Modal Close Actions
    $('rev-btn-cancel')?.addEventListener('click', closeReviewModal);
    $('rev-btn-close')?.addEventListener('click', closeReviewModal);
    $('modal-paper-backdrop')?.addEventListener('click', closeReviewModal);

    // Review Modal Custom Group Toggle
    $('rev-group-select')?.addEventListener('change', e => {
      const customWrap = $('rev-group-custom-wrap');
      if (e.target.value === '__NEW__') {
        customWrap?.classList.remove('hidden');
        $('rev-group-custom')?.focus();
      } else {
        customWrap?.classList.add('hidden');
      }
    });

    // Review Modal Save Action
    $('rev-btn-save')?.addEventListener('click', savePendingPaper);

    // Reset Filter Button
    $('research-btn-reset')?.addEventListener('click', () => {
      activeGroup = 'All';
      favoriteOnly = false;
      searchQuery = '';
      const inp = $('research-search');
      if (inp) inp.value = '';
      loadPapers();
    });

    // ── Dedicated Paper Detail & Reader View Listeners ───────────────────────
    $('btn-paper-back-to-bookshelf')?.addEventListener('click', closePaperDetail);
    $('btn-paper-open-pdf')?.addEventListener('click', () => {
      if (activeDetailPaper) openPdfViewer(activeDetailPaper);
    });
    $('btn-paper-top-open')?.addEventListener('click', () => {
      if (activeDetailPaper) openPdfViewer(activeDetailPaper);
    });
    $('btn-paper-reveal-file')?.addEventListener('click', () => {
      if (activeDetailPaper?.file_path) window.api.research.showInFolder(activeDetailPaper.file_path);
    });
    $('btn-paper-detail-fav')?.addEventListener('click', handleDetailFavoriteToggle);
    $('paper-detail-group-select')?.addEventListener('change', handleDetailGroupChange);
    $('btn-paper-detail-add-group')?.addEventListener('click', handleDetailAddGroup);
    $('paper-detail-title-input')?.addEventListener('input', handleDetailTitleInput);
    $('paper-detail-notes')?.addEventListener('input', handleDetailNotesInput);

    // 1. Group / Category Filter Pills Delegation Listener
    document.addEventListener('click', (event) => {
      const filterBtn = event.target.closest('.btn-group-filter, [data-group-filter]');
      if (!filterBtn) return;
      event.preventDefault();
      const selectedGroup = filterBtn.dataset.groupFilter || filterBtn.getAttribute('data-group-filter');
      if (selectedGroup) {
        setActiveGroupFilter(selectedGroup);
      }
    });

    // 2. Bookshelf Card Unified Click-Through Delegation Listener
    document.addEventListener('click', (event) => {
      // Ignore if clicking top filter pills, upload button, search bar, modals, or inside detail view
      if (event.target.closest('.btn-group-filter, [data-group-filter], #research-chips-bar, .library-search-bar, #research-search, #btn-research-upload, #btn-upload-paper, #btn-research-empty-upload, #modal-paper-review, #modal-paper-backdrop')) return;
      if (event.target.closest('#view-paper-detail')) return;

      const paperCard = event.target.closest('.research-paper-card, [data-paper-id]');
      if (!paperCard) return;

      // If click was inside form control or link, ignore
      if (event.target.closest('input, textarea, select, a[href]')) return;

      event.preventDefault();
      const paperId = paperCard.dataset.paperId || paperCard.getAttribute('data-paper-id');
      if (paperId) {
        openPaperDetailView(paperId);
      }
    });
  }

  // ── Public: Activate ────────────────────────────────────────────────────────
  async function activate() {
    if (!inited) {
      wireUI();
      inited = true;
    }
    activeDetailPaper = null;
    await loadPapers();
  }

  return {
    activate,
    triggerUploadWorkflow,
    loadPapers,
    openPaperDetail,
    openPaperDetailView,
    closePaperDetail,
    setActiveGroupFilter,
    updateFavoritesCountBadge,
    toggleFavoritePaper
  };

})();
