const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');

// ── Database ────────────────────────────────────────────────────────────────
const db = require('./db/database.js');

// ── Window ──────────────────────────────────────────────────────────────────
let mainWindow = null;

const isDev = process.env.NODE_ENV === 'development';

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1366,
    height: 850,
    minWidth: 1024,
    minHeight: 700,
    show: false,
    frame: true,
    backgroundColor: '#0f172a',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  mainWindow.loadFile(path.join(__dirname, 'index.html'));

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  if (isDev) {
    mainWindow.webContents.openDevTools();
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// ═══════════════════════════════════════════════════════════════════════════
// IPC HANDLERS
// ═══════════════════════════════════════════════════════════════════════════

// ── Low-level pass-through (legacy / ad-hoc queries) ─────────────────────
ipcMain.handle('db:run', (_e, sql, params = []) => db.run(sql, params));
ipcMain.handle('db:get', (_e, sql, params = []) => db.get(sql, params));
ipcMain.handle('db:all', (_e, sql, params = []) => db.all(sql, params));

// ── Patients ──────────────────────────────────────────────────────────────

ipcMain.handle('patients:list', () => {
  return db.patients.list();
});

ipcMain.handle('patients:search', (_e, query) => {
  if (typeof query !== 'string') return [];
  return db.patients.search(query);
});

ipcMain.handle('patients:getById', (_e, id) => {
  if (!Number.isInteger(Number(id))) return null;
  return db.patients.getById(Number(id));
});

ipcMain.handle('patients:create', (_e, data) => {
  // Validate in main process — never trust renderer input
  if (!data || typeof data !== 'object') {
    throw new Error('Invalid patient data payload.');
  }
  // db.patients.create throws with user-facing message on validation failure
  return db.patients.create(data);
});

ipcMain.handle('patients:update', (_e, id, data) => {
  if (!Number.isInteger(Number(id))) throw new Error('Invalid patient ID.');
  return db.patients.update(Number(id), data);
});

ipcMain.handle('patients:delete', (_e, id) => {
  if (!Number.isInteger(Number(id))) throw new Error('Invalid patient ID.');
  return db.patients.delete(Number(id));
});

// ── Appointments ──────────────────────────────────────────────────────────

ipcMain.handle('appointments:list', (_e, filters = {}) => {
  // Simple list; advanced filtering delegated to domain layer in future phase
  if (filters && filters.patientId) {
    return db.appointments.listByPatient(Number(filters.patientId));
  }
  return db.all(
    `SELECT * FROM appointments ORDER BY scheduled_at DESC LIMIT 200`
  );
});

ipcMain.handle('appointments:get', (_e, id) => {
  return db.appointments.getById(Number(id));
});

ipcMain.handle('appointments:create', (_e, data) => {
  if (!data || !data.patient_id || !data.scheduled_at) {
    throw new Error('patient_id and scheduled_at are required.');
  }
  return db.appointments.create(data);
});

ipcMain.handle('appointments:update', (_e, id, data) => {
  return db.appointments.update(Number(id), data);
});

ipcMain.handle('appointments:delete', (_e, id) => {
  return db.run(
    `UPDATE appointments SET status = 'cancelled', updated_at = strftime('%Y-%m-%dT%H:%M:%fZ','now') WHERE id = ?`,
    [Number(id)]
  );
});

// ── Clinical Notes ────────────────────────────────────────────────────────

ipcMain.handle('notes:listByPatient', (_e, patientId) => {
  return db.notes.listByPatient(Number(patientId));
});

ipcMain.handle('notes:get', (_e, id) => {
  return db.notes.getById(Number(id));
});

ipcMain.handle('notes:create', (_e, data) => {
  if (!data || !data.patient_id) throw new Error('patient_id is required.');
  return db.notes.create(data);
});

ipcMain.handle('notes:update', (_e, id, data) => {
  return db.notes.update(Number(id), data);
});

ipcMain.handle('notes:addAddendum', (_e, noteId, content) => {
  return db.notes.addAddendum(Number(noteId), content);
});

// ── Stats ─────────────────────────────────────────────────────────────────

ipcMain.handle('stats:dashboard', (_e, todayISO) => {
  const today = typeof todayISO === 'string' ? todayISO : new Date().toISOString().split('T')[0];
  return db.stats.dashboard(today);
});

// ── Diary ─────────────────────────────────────────────────────────────────

ipcMain.handle('diary:getEvents', (_e, startISO, endISO) => {
  if (typeof startISO !== 'string' || typeof endISO !== 'string') return [];
  return db.diary.getEvents(startISO, endISO);
});

ipcMain.handle('diary:createEvent', (_e, data) => {
  if (!data || typeof data !== 'object') throw new Error('Invalid event payload.');
  if (!data.scheduled_at) throw new Error('scheduled_at is required.');
  return db.diary.createEvent(data);
});

ipcMain.handle('diary:updateEvent', (_e, id, data) => {
  if (!Number.isInteger(Number(id))) throw new Error('Invalid event ID.');
  return db.diary.updateEvent(Number(id), data);
});

ipcMain.handle('diary:deleteEvent', (_e, id) => {
  if (!Number.isInteger(Number(id))) throw new Error('Invalid event ID.');
  return db.diary.deleteEvent(Number(id));
});

// ── Smart Phrases (Phase 5) ───────────────────────────────────────────────

ipcMain.handle('smartPhrases:list', (_e, filter) => {
  return db.smartPhrases.list(filter || {});
});

ipcMain.handle('smartPhrases:getById', (_e, id) => {
  return db.smartPhrases.getById(Number(id));
});

ipcMain.handle('smartPhrases:getByTrigger', (_e, fullTrigger) => {
  return db.smartPhrases.getByTrigger(String(fullTrigger || ''));
});

ipcMain.handle('smartPhrases:search', (_e, prefix, query) => {
  return db.smartPhrases.search(String(prefix || ''), String(query || ''));
});

ipcMain.handle('smartPhrases:create', (_e, data) => {
  return db.smartPhrases.create(data);
});

ipcMain.handle('smartPhrases:update', (_e, id, data) => {
  return db.smartPhrases.update(Number(id), data);
});

ipcMain.handle('smartPhrases:delete', (_e, id) => {
  return db.smartPhrases.delete(Number(id));
});

// ── Trigger Categories ────────────────────────────────────────────────────

ipcMain.handle('triggerCategories:list', () => {
  return db.triggerCategories.list();
});

ipcMain.handle('triggerCategories:save', (_e, prefix, label) => {
  return db.triggerCategories.save(prefix, label);
});

ipcMain.handle('triggerCategories:delete', (_e, prefix) => {
  return db.triggerCategories.delete(prefix);
});

// ═══════════════════════════════════════════════════════════════════════════
// APP LIFECYCLE
// ═══════════════════════════════════════════════════════════════════════════

app.whenReady().then(() => {
  createWindow();
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
