const { app, BrowserWindow, ipcMain, dialog, shell } = require('electron');
const path = require('path');
const fs = require('fs');

// ── Database & Utilities ───────────────────────────────────────────────────
const db = require('./db/database.js');
const { parsePdfBuffer } = require('./pdfImporter.js');

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
  if (!data || !data.scheduled_at) {
    throw new Error('scheduled_at is required.');
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

// ── PDF Importer (Phase 5) ────────────────────────────────────────────────
async function handlePdfImport() {
  const result = await dialog.showOpenDialog(mainWindow, {
    title: 'Select Clinical Assessment PDF',
    buttonLabel: 'Import PDF',
    filters: [
      { name: 'PDF Documents (*.pdf)', extensions: ['pdf'] },
      { name: 'All Files (*.*)', extensions: ['*'] }
    ],
    properties: ['openFile']
  });

  if (result.canceled || !result.filePaths || result.filePaths.length === 0) {
    return null;
  }

  const filePath = result.filePaths[0];
  const buffer = fs.readFileSync(filePath);
  const parsed = await parsePdfBuffer(buffer, filePath);
  return parsed;
}

ipcMain.handle('smartphrases:importPdfLocal', handlePdfImport);
ipcMain.handle('smartPhrases:importPdfLocal', handlePdfImport);

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

// ── Phase 7: Phased S&C and Rehab Builder ─────────────────────────────────

// Exercises
ipcMain.handle('rehab:listExercises', (_e, category, search) => {
  return db.rehab.listExercises(category, search);
});
ipcMain.handle('rehab:createExercise', (_e, data) => {
  return db.rehab.createExercise(data);
});
ipcMain.handle('rehab:updateExercise', (_e, id, data) => {
  return db.rehab.updateExercise(id, data);
});
ipcMain.handle('rehab:deleteExercise', (_e, id) => {
  return db.rehab.deleteExercise(id);
});

// Templates / Protocols
ipcMain.handle('rehab:listTemplates', () => {
  return db.rehab.listTemplates();
});
ipcMain.handle('rehab:getTemplate', (_e, id) => {
  return db.rehab.getTemplateById(id);
});
ipcMain.handle('rehab:saveTemplate', (_e, data) => {
  return db.rehab.saveTemplate(data);
});
ipcMain.handle('rehab:deleteTemplate', (_e, id) => {
  return db.rehab.deleteTemplate(id);
});

// Patient Programs
ipcMain.handle('rehab:listPrograms', (_e, patientId) => {
  return db.rehab.listPrograms(patientId);
});
ipcMain.handle('rehab:getProgram', (_e, id) => {
  return db.rehab.getProgramById(id);
});
ipcMain.handle('rehab:saveProgram', (_e, data) => {
  return db.rehab.saveProgram(data);
});
ipcMain.handle('rehab:deleteProgram', (_e, id) => {
  return db.rehab.deleteProgram(id);
});

// 100% Offline Patient Take-Home PDF Generator
ipcMain.handle('rehab:exportPdf', async (_e, { htmlContent, defaultFilename }) => {
  const saveResult = await dialog.showSaveDialog(mainWindow, {
    title: 'Export Patient Rehabilitation Program PDF',
    defaultPath: defaultFilename || 'Patient_Rehabilitation_Program.pdf',
    filters: [
      { name: 'PDF Documents (*.pdf)', extensions: ['pdf'] }
    ]
  });

  if (saveResult.canceled || !saveResult.filePath) {
    return { success: false, canceled: true };
  }

  const printWin = new BrowserWindow({
    show: false,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true
    }
  });

  try {
    await printWin.loadURL(`data:text/html;charset=utf-8,${encodeURIComponent(htmlContent)}`);

    const pdfData = await printWin.webContents.printToPDF({
      pageSize: 'A4',
      landscape: false,
      printBackground: true,
      margins: {
        marginType: 'custom',
        top: 0.5,
        bottom: 0.5,
        left: 0.5,
        right: 0.5
      }
    });

    fs.writeFileSync(saveResult.filePath, pdfData);
    return { success: true, filePath: saveResult.filePath };
  } catch (err) {
    console.error('[PDF Export] Error generating PDF:', err);
    throw err;
  } finally {
    if (!printWin.isDestroyed()) {
      printWin.close();
    }
  }
});

// ── Phase 8: Clinic Settings & Configuration ──────────────────────────────
ipcMain.handle('settings:getAll', () => {
  return db.settings.getAll();
});

ipcMain.handle('settings:get', (_e, key) => {
  return db.settings.get(key);
});

ipcMain.handle('settings:set', (_e, key, value) => {
  return db.settings.set(key, value);
});

ipcMain.handle('settings:save', (_e, data) => {
  return db.settings.setMultiple(data);
});

// ── Phase 8: Invoicing & Billing ──────────────────────────────────────────
ipcMain.handle('invoices:list', (_e, filter) => {
  return db.invoices.list(filter || {});
});

ipcMain.handle('invoices:getById', (_e, id) => {
  return db.invoices.getById(id);
});

ipcMain.handle('invoices:create', (_e, data) => {
  return db.invoices.create(data);
});

ipcMain.handle('invoices:update', (_e, id, data) => {
  return db.invoices.update(id, data);
});

ipcMain.handle('invoices:delete', (_e, id) => {
  return db.invoices.delete(id);
});

ipcMain.handle('invoices:getStats', () => {
  return db.invoices.getStats();
});

// ── Phase 8: Discharge Summary Data ───────────────────────────────────────
ipcMain.handle('patients:getDischargeData', (_e, id) => {
  return db.patients.getDischargeData(id);
});

// ── Phase 8: Universal 100% Offline Local PDF Generator ───────────────────
ipcMain.handle('pdf:generate', async (_e, { htmlContent, defaultFilename, dialogTitle, landscape = false }) => {
  const saveResult = await dialog.showSaveDialog(mainWindow, {
    title: dialogTitle || 'Export Document as PDF',
    defaultPath: defaultFilename || 'Medical_Document.pdf',
    filters: [
      { name: 'PDF Documents (*.pdf)', extensions: ['pdf'] }
    ]
  });

  if (saveResult.canceled || !saveResult.filePath) {
    return { success: false, canceled: true };
  }

  const printWin = new BrowserWindow({
    show: false,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true
    }
  });

  try {
    await printWin.loadURL(`data:text/html;charset=utf-8,${encodeURIComponent(htmlContent)}`);

    const pdfData = await printWin.webContents.printToPDF({
      pageSize: 'A4',
      landscape: !!landscape,
      printBackground: true,
      margins: {
        marginType: 'custom',
        top: 0.4,
        bottom: 0.4,
        left: 0.4,
        right: 0.4
      }
    });

    fs.writeFileSync(saveResult.filePath, pdfData);
    return { success: true, filePath: saveResult.filePath };
  } catch (err) {
    console.error('[PDF Export] Error generating PDF:', err);
    throw err;
  } finally {
    if (!printWin.isDestroyed()) {
      printWin.close();
    }
  }
});

// ── 100% Offline Patient Email Dispatcher with Windows Explorer Reveal ───────
ipcMain.handle('system:openEmailClient', async (_event, { to, subject, body, filePath }) => {
  try {
    const mailtoUrl = `mailto:${encodeURIComponent(to || '')}?subject=${encodeURIComponent(subject || '')}&body=${encodeURIComponent(body || '')}`;
    
    // 1. Open the user's default OS desktop email client (Outlook, Thunderbird, Mail, etc.)
    await shell.openExternal(mailtoUrl);
    
    // 2. If a generated PDF path exists, immediately highlight it in Windows File Explorer
    if (filePath && fs.existsSync(filePath)) {
      shell.showItemInFolder(filePath);
    }
    return { success: true };
  } catch (err) {
    console.error('[Email Dispatcher] Error opening email client:', err);
    return { success: false, error: err.message };
  }
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
