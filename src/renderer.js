'use strict';

// ── Navigation ────────────────────────────────────────────────────────────
const views = ['dashboard', 'patients', 'appointments', 'notes'];

const navLinks = document.querySelectorAll('[data-view]');
const pageTitle = document.getElementById('page-title');

navLinks.forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const target = link.dataset.view;
    switchView(target);
  });
});

function switchView(viewName) {
  // Hide all views
  views.forEach(v => {
    document.getElementById(`view-${v}`).classList.add('hidden');
  });
  // Show target view
  document.getElementById(`view-${viewName}`).classList.remove('hidden');

  // Update active nav styling
  navLinks.forEach(link => {
    if (link.dataset.view === viewName) {
      link.className = 'nav-item-active';
    } else {
      link.className = 'nav-item';
    }
  });

  // Update page title (capitalize first letter)
  const titles = {
    dashboard: 'Dashboard',
    patients: 'Patients',
    appointments: 'Appointments',
    notes: 'Clinical Notes',
  };
  pageTitle.textContent = titles[viewName] ?? viewName;
}

// ── Current date display ─────────────────────────────────────────────────
function updateDate() {
  const now = new Date();
  document.getElementById('current-date').textContent = now.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}
updateDate();

// ── Dashboard stats ───────────────────────────────────────────────────────
async function loadDashboardStats() {
  try {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    const weekEnd = new Date();
    weekEnd.setDate(weekEnd.getDate() + 7);

    const [patientCount, todayCount, weekCount, noteCount] = await Promise.all([
      window.api.dbGet('SELECT COUNT(*) as n FROM patients WHERE deleted_at IS NULL'),
      window.api.dbGet(
        `SELECT COUNT(*) as n FROM appointments
         WHERE scheduled_at >= ? AND scheduled_at <= ? AND status != 'cancelled'`,
        [todayStart.toISOString(), todayEnd.toISOString()]
      ),
      window.api.dbGet(
        `SELECT COUNT(*) as n FROM appointments
         WHERE scheduled_at >= ? AND scheduled_at <= ? AND status != 'cancelled'`,
        [todayStart.toISOString(), weekEnd.toISOString()]
      ),
      window.api.dbGet('SELECT COUNT(*) as n FROM clinical_notes'),
    ]);

    document.getElementById('stat-patients').textContent = patientCount?.n ?? 0;
    document.getElementById('stat-today').textContent    = todayCount?.n   ?? 0;
    document.getElementById('stat-week').textContent     = weekCount?.n    ?? 0;
    document.getElementById('stat-notes').textContent    = noteCount?.n    ?? 0;
  } catch (err) {
    console.error('[Renderer] Failed to load dashboard stats:', err);
  }
}

// ── New Patient button ────────────────────────────────────────────────────
document.getElementById('btn-new-patient').addEventListener('click', () => {
  switchView('patients');
});

// ── Init ──────────────────────────────────────────────────────────────────
loadDashboardStats();
