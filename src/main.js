const { app, BrowserWindow, ipcMain, dialog, shell } = require('electron');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const os = require('os');

// Helper: XML/HTML entity escaping
function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// ── Database & Utilities ───────────────────────────────────────────────────
const db = require('./db/database.js');
const { parsePdfBuffer } = require('./pdfImporter.js');
const { extractPaperMetadata } = require('./researchParser.js');

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
    icon: path.join(__dirname, '../assets/logo.png'),
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
  if (filters && filters.patientId) {
    return db.appointments.listByPatient(Number(filters.patientId));
  }
  if (filters && filters.date) {
    return db.all(`
      SELECT a.*, p.first_name, p.last_name
      FROM appointments a
      LEFT JOIN patients p ON a.patient_id = p.id
      WHERE (date(a.scheduled_at) = ? OR substr(a.scheduled_at, 1, 10) = ?)
        AND a.status != 'cancelled'
      ORDER BY a.scheduled_at ASC
    `, [filters.date, filters.date]);
  }
  return db.all(
    `SELECT a.*, p.first_name, p.last_name FROM appointments a LEFT JOIN patients p ON a.patient_id = p.id ORDER BY a.scheduled_at DESC LIMIT 200`
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

ipcMain.handle('smartPhrases:exportBackup', async () => {
  const saveResult = await dialog.showSaveDialog(mainWindow, {
    title: 'Export Smart Phrases Backup',
    defaultPath: `SmartPhrases_Backup_${new Date().toISOString().slice(0, 10)}.json`,
    filters: [
      { name: 'JSON Backup (*.json)', extensions: ['json'] }
    ]
  });
  if (saveResult.canceled || !saveResult.filePath) {
    return { success: false, canceled: true };
  }
  const data = db.smartPhrases.exportBackup();
  fs.writeFileSync(saveResult.filePath, JSON.stringify(data, null, 2), 'utf8');
  return { success: true, filePath: saveResult.filePath };
});

ipcMain.handle('smartPhrases:importBackup', async () => {
  const openResult = await dialog.showOpenDialog(mainWindow, {
    title: 'Import Smart Phrases Backup',
    filters: [
      { name: 'JSON Backup (*.json)', extensions: ['json'] }
    ],
    properties: ['openFile']
  });
  if (openResult.canceled || !openResult.filePaths.length) {
    return { success: false, canceled: true };
  }
  const raw = fs.readFileSync(openResult.filePaths[0], 'utf8');
  const parsed = JSON.parse(raw);
  const result = db.smartPhrases.importBackup(parsed);
  return { success: true, count: result.count };
});

ipcMain.handle('smartPhrases:updateCategory', (_e, { prefix, label }) => {
  return db.triggerCategories.save(prefix, label);
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
ipcMain.handle('rehab:getCategories', () => {
  return db.rehab.getCategories();
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

ipcMain.handle('rehab:exportBackup', async () => {
  const saveResult = await dialog.showSaveDialog(mainWindow, {
    title: 'Export Exercise Library & Protocols Backup',
    defaultPath: `PhysioClinic_Exercises_Backup_${new Date().toISOString().slice(0, 10)}.json`,
    filters: [
      { name: 'JSON Backup (*.json)', extensions: ['json'] }
    ]
  });
  if (saveResult.canceled || !saveResult.filePath) {
    return { success: false, canceled: true };
  }
  const data = db.rehab.exportBackup();
  fs.writeFileSync(saveResult.filePath, JSON.stringify(data, null, 2), 'utf8');
  return { success: true, filePath: saveResult.filePath };
});

ipcMain.handle('rehab:importBackup', async () => {
  const openResult = await dialog.showOpenDialog(mainWindow, {
    title: 'Import Exercise Library & Protocols Backup',
    filters: [
      { name: 'JSON Backup (*.json)', extensions: ['json'] }
    ],
    properties: ['openFile']
  });
  if (openResult.canceled || !openResult.filePaths.length) {
    return { success: false, canceled: true };
  }
  const raw = fs.readFileSync(openResult.filePaths[0], 'utf8');
  const parsed = JSON.parse(raw);
  const result = db.rehab.importBackup(parsed);
  return { success: true, exCount: result.exCount, protoCount: result.protoCount };
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
  const saved = db.settings.setMultiple(data);
  if (data && (data.clinic_name !== undefined || data.practitioner_name !== undefined)) {
    let logoPath = null;
    let logoBase64 = null;
    try {
      const row = db.get('SELECT logo_path FROM clinic_settings WHERE id = 1');
      if (row && row.logo_path && fs.existsSync(row.logo_path)) {
        logoPath = row.logo_path;
        logoBase64 = `data:image/png;base64,${fs.readFileSync(logoPath).toString('base64')}`;
      }
    } catch (_) {}
    if (mainWindow && !mainWindow.isDestroyed()) {
      mainWindow.webContents.send('branding:updated', {
        logoPath,
        logoBase64,
        clinicName: data.clinic_name !== undefined ? data.clinic_name : (db.settings.get('clinic_name') || ''),
        practitionerName: data.practitioner_name !== undefined ? data.practitioner_name : (db.settings.get('practitioner_name') || '')
      });
    }
  }
  return saved;
});

// ── Domain: Branding & Clinic Logo Pipeline ──────────────────────────────
ipcMain.handle('branding:get', async () => {
  let clinicName = '';
  let logoPath = null;
  try {
    const row = db.get('SELECT clinic_name, logo_path FROM clinic_settings WHERE id = 1');
    if (row) {
      clinicName = row.clinic_name || '';
      logoPath = row.logo_path || null;
    }
  } catch (_) {
    clinicName = db.settings.get('clinic_name') || '';
    logoPath = db.settings.get('logo_path') || null;
  }

  const practitionerName = db.settings.get('practitioner_name') || '';

  let logoBase64 = null;
  let fileExists = false;
  if (logoPath && fs.existsSync(logoPath)) {
    fileExists = true;
    try {
      const buf = fs.readFileSync(logoPath);
      logoBase64 = `data:image/png;base64,${buf.toString('base64')}`;
    } catch (_) {}
  } else {
    logoPath = null;
  }

  return {
    clinicName: clinicName || db.settings.get('clinic_name') || '',
    practitionerName,
    logoPath,
    fileExists,
    logoBase64
  };
});

ipcMain.handle('branding:uploadClinicLogo', async () => {
  const result = await dialog.showOpenDialog(mainWindow, {
    title: 'Select Clinic Logo (PNG)',
    filters: [{ name: 'PNG Images', extensions: ['png'] }],
    properties: ['openFile']
  });

  if (result.canceled || !result.filePaths || result.filePaths.length === 0) {
    return { canceled: true, success: false };
  }

  const sourcePath = result.filePaths[0];
  const brandingDir = path.join(app.getPath('userData'), 'clinic_branding');
  if (!fs.existsSync(brandingDir)) {
    fs.mkdirSync(brandingDir, { recursive: true });
  }

  const destPath = path.join(brandingDir, 'clinic_logo.png');
  fs.copyFileSync(sourcePath, destPath);

  // Update SQLite clinic_settings table (satisfying UPDATE clinic_settings SET logo_path = ? WHERE id = 1)
  try {
    db.run('UPDATE clinic_settings SET logo_path = ? WHERE id = 1', [destPath]);
  } catch (_) {}
  try {
    db.settings.set('logo_path', destPath);
  } catch (_) {}

  let logoBase64 = null;
  try {
    const buf = fs.readFileSync(destPath);
    logoBase64 = `data:image/png;base64,${buf.toString('base64')}`;
  } catch (_) {}

  const clinicName = db.settings.get('clinic_name') || '';
  const practitionerName = db.settings.get('practitioner_name') || '';

  if (mainWindow && !mainWindow.isDestroyed()) {
    mainWindow.webContents.send('branding:updated', {
      logoPath: destPath,
      logoBase64,
      clinicName,
      practitionerName
    });
  }

  return {
    success: true,
    logoPath: destPath,
    logoBase64,
    clinicName,
    practitionerName
  };
});

ipcMain.handle('branding:removeClinicLogo', async () => {
  const brandingDir = path.join(app.getPath('userData'), 'clinic_branding');
  const destPath = path.join(brandingDir, 'clinic_logo.png');

  try {
    if (fs.existsSync(destPath)) {
      fs.unlinkSync(destPath);
    }
  } catch (_) {}

  try {
    db.run('UPDATE clinic_settings SET logo_path = NULL WHERE id = 1');
  } catch (_) {}
  try {
    db.settings.set('logo_path', '');
  } catch (_) {}

  const clinicName = db.settings.get('clinic_name') || '';
  const practitionerName = db.settings.get('practitioner_name') || '';

  if (mainWindow && !mainWindow.isDestroyed()) {
    mainWindow.webContents.send('branding:updated', {
      logoPath: null,
      logoBase64: null,
      clinicName,
      practitionerName
    });
  }

  return { success: true };
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

// ── Phase 9: Medico-Legal EULA Gateway ────────────────────────────────────
ipcMain.handle('eula:getStatus', () => {
  return db.eula.getStatus();
});

ipcMain.handle('eula:accept', (_e, signee) => {
  return db.eula.accept(signee);
});

// ── Medico-Legal & GDPR Signed Statutory Declaration PDF Export ───────────
ipcMain.handle('legal:downloadSignedDeclaration', async () => {
  const eulaStatus = db.eula.getStatus();
  const clinicSettings = db.settings.getAll ? db.settings.getAll() : {};

  const signeeName = (eulaStatus && eulaStatus.signee) ? eulaStatus.signee : (clinicSettings.practitioner_name || 'Licensed Clinician');
  const clinicName = clinicSettings.clinic_name || 'Physiotherapy & Sports Rehabilitation Clinic';
  const clinicAddress = clinicSettings.clinic_address || '';
  const clinicPhone = clinicSettings.clinic_phone || '';
  const clinicEmail = clinicSettings.clinic_email || '';
  const registrationNo = clinicSettings.reg_number || clinicSettings.provider_number || 'HCPC / CSP Registered';
  const timestamp = (eulaStatus && eulaStatus.timestamp) ? eulaStatus.timestamp : new Date().toISOString();
  const hostId = `${os.hostname()} (${os.platform()} ${os.arch()})`;
  const auditString = `${signeeName}|${clinicName}|${registrationNo}|${timestamp}|${hostId}`;
  const auditHash = crypto.createHash('sha256').update(auditString).digest('hex').toUpperCase();

  const safeSigneeFilename = signeeName.replace(/[^a-zA-Z0-9_-]/g, '_');
  const defaultFilename = `Signed_GDPR_Declaration_${safeSigneeFilename}.pdf`;

  const saveResult = await dialog.showSaveDialog(mainWindow, {
    title: 'Download Signed Medico-Legal & GDPR Statutory Declaration',
    defaultPath: defaultFilename,
    filters: [
      { name: 'PDF Documents (*.pdf)', extensions: ['pdf'] }
    ]
  });

  if (saveResult.canceled || !saveResult.filePath) {
    return { success: false, canceled: true };
  }

  const htmlContent = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Medico-Legal &amp; GDPR Statutory Declaration</title>
  <style>
    @page { size: A4 portrait; margin: 18mm 16mm 18mm 16mm; }
    body {
      font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, Roboto, Helvetica, Arial, sans-serif;
      color: #0f172a;
      background: #ffffff;
      margin: 0;
      padding: 0;
      font-size: 10pt;
      line-height: 1.5;
    }
    .header-table { width: 100%; border-bottom: 2px solid #0284c7; padding-bottom: 12px; margin-bottom: 16px; border-collapse: collapse; }
    .header-title { font-size: 15pt; font-weight: 800; color: #0f172a; letter-spacing: -0.02em; }
    .header-subtitle { font-size: 9.5pt; font-weight: 600; color: #0284c7; text-transform: uppercase; letter-spacing: 0.04em; margin-top: 3px; }
    .clinic-meta { text-align: right; font-size: 8.5pt; color: #475569; line-height: 1.4; }
    .clinic-name { font-weight: 700; color: #1e293b; font-size: 9.5pt; }
    
    .badge-bar {
      background: #f0fdf4;
      border: 1px solid #bbf7d0;
      border-radius: 6px;
      padding: 7px 12px;
      margin-bottom: 16px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 8.5pt;
      color: #166534;
    }
    .badge-bar strong { font-weight: 700; }

    .section-title {
      font-size: 10pt;
      font-weight: 700;
      color: #1e293b;
      border-bottom: 1px solid #e2e8f0;
      padding-bottom: 3px;
      margin-top: 14px;
      margin-bottom: 6px;
      text-transform: uppercase;
      letter-spacing: 0.03em;
    }

    p { margin: 0 0 8px 0; text-align: justify; }

    .callout-box {
      background: #f8fafc;
      border-left: 4px solid #0284c7;
      padding: 8px 12px;
      margin: 10px 0;
      font-size: 9pt;
      color: #334155;
    }

    .audit-grid {
      width: 100%;
      border-collapse: collapse;
      margin-top: 16px;
      margin-bottom: 16px;
      background: #f8fafc;
      border: 1px solid #cbd5e1;
      border-radius: 6px;
    }
    .audit-grid td {
      padding: 6px 10px;
      border: 1px solid #e2e8f0;
      font-size: 8.5pt;
      vertical-align: top;
    }
    .audit-label {
      font-weight: 600;
      color: #475569;
      width: 32%;
      background: #f1f5f9;
    }
    .audit-value {
      font-weight: 500;
      color: #0f172a;
      font-family: 'Consolas', 'Courier New', monospace;
    }

    .signature-card {
      margin-top: 18px;
      border: 1px dashed #94a3b8;
      border-radius: 6px;
      padding: 12px 16px;
      background: #ffffff;
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
    }
    .signature-line {
      font-size: 14pt;
      font-family: 'Georgia', serif;
      font-style: italic;
      color: #0369a1;
      font-weight: bold;
      border-bottom: 1px solid #0f172a;
      padding-bottom: 3px;
      min-width: 240px;
      display: inline-block;
    }

    .footer-note {
      margin-top: 22px;
      padding-top: 8px;
      border-top: 1px solid #e2e8f0;
      font-size: 7.5pt;
      color: #64748b;
      text-align: center;
      line-height: 1.4;
    }
  </style>
</head>
<body>
  <table class="header-table">
    <tr>
      <td style="vertical-align: middle;">
        <div class="header-title">MEDICO-LEGAL &amp; GDPR STATUTORY DECLARATION</div>
        <div class="header-subtitle">Data Controller Responsibility &amp; Autonomous Clinical Indemnity</div>
      </td>
      <td class="clinic-meta" style="vertical-align: middle;">
        <div class="clinic-name">${escapeHtml(clinicName)}</div>
        ${clinicAddress ? `<div>${escapeHtml(clinicAddress)}</div>` : ''}
        ${clinicPhone ? `<div>Tel: ${escapeHtml(clinicPhone)}</div>` : ''}
        ${clinicEmail ? `<div>Email: ${escapeHtml(clinicEmail)}</div>` : ''}
      </td>
    </tr>
  </table>

  <div class="badge-bar">
    <div><strong>STATUS:</strong> LEGALLY EXECUTED &amp; CRYPTOGRAPHICALLY PERSISTED</div>
    <div><strong>CANONICAL DATE:</strong> ${escapeHtml(new Date(timestamp).toUTCString())}</div>
  </div>

  <div class="section-title">1. Statutory Data Controller Appointment</div>
  <p>
    This statutory instrument confirms that the undersigned healthcare practitioner, practice, and clinic named herein acts as the sole <strong>Data Controller</strong> pursuant to the United Kingdom General Data Protection Regulation (UK GDPR), the Data Protection Act 2018 (DPA 2018), and equivalent international statutory health information privacy enactments.
  </p>
  <p>
    All special category personal data (Article 9 UK GDPR), including electronic medical records, subjective anamnesis, objective clinical findings, diagnostic assessments, outcome measures, exercise prescriptions, and financial billing items, are stored exclusively within an encrypted, non-replicated local SQLite database on this physical client station. No medical telemetry, patient records, or biometric data are transmitted to any cloud servers, external vendors, or software developers.
  </p>

  <div class="section-title">2. Full Developer Clinical Indemnity &amp; Liability Exclusion</div>
  <div class="callout-box">
    <strong>Zero Developer Liability Affirmation:</strong> The software developers, system architects, and distributors of this application bear zero clinical, diagnostic, therapeutic, or financial liability for patient care, injury, misdiagnosis, contraindication oversight, clinical omission, or data management.
  </div>
  <p>
    The undersigned licensed healthcare professional acknowledges that the clinical decision-support components, red-flag screening algorithms, interactive outcome measures, and rehabilitation exercise databases are assistive aids intended solely for qualified healthcare clinicians. All treatment pathways, differential diagnoses, exercise prescriptions, and clinical decisions remain under the exclusive professional judgment and legal liability of the attending clinician.
  </p>

  <div class="section-title">3. Statutory Verification &amp; Cryptographic Audit Proof</div>
  <table class="audit-grid">
    <tr>
      <td class="audit-label">Authorized Signee / Practitioner</td>
      <td class="audit-value">${escapeHtml(signeeName)}</td>
    </tr>
    <tr>
      <td class="audit-label">Professional Registration</td>
      <td class="audit-value">${escapeHtml(registrationNo)}</td>
    </tr>
    <tr>
      <td class="audit-label">Practice / Healthcare Organization</td>
      <td class="audit-value">${escapeHtml(clinicName)}</td>
    </tr>
    <tr>
      <td class="audit-label">EULA Execution Timestamp (UTC)</td>
      <td class="audit-value">${escapeHtml(timestamp)}</td>
    </tr>
    <tr>
      <td class="audit-label">Execution Host Station UID</td>
      <td class="audit-value">${escapeHtml(hostId)}</td>
    </tr>
    <tr>
      <td class="audit-label">SHA-256 Audit Integrity Hash</td>
      <td class="audit-value" style="font-size: 7.5pt; word-break: break-all;">${auditHash}</td>
    </tr>
  </table>

  <div class="signature-card">
    <div>
      <div style="font-size: 8pt; color: #475569; margin-bottom: 5px; text-transform: uppercase; font-weight: 600;">Practitioner Signature &amp; Affirmation</div>
      <div class="signature-line">${escapeHtml(signeeName)}</div>
      <div style="font-size: 7.5pt; color: #64748b; margin-top: 3px;">Digitally Affirmed &amp; Stored Locally via Secure Station Seal</div>
    </div>
    <div style="text-align: right;">
      <div style="font-size: 7.5pt; color: #0284c7; font-weight: 700; text-transform: uppercase;">100% Offline Local Architecture</div>
      <div style="font-size: 7pt; color: #64748b;">Statutory Retention Compliant: CSP / HCPC / DPA 2018</div>
    </div>
  </div>

  <div class="footer-note">
    Official Medico-Legal Record — Retain this document in your clinical governance compliance archive.<br>
    Generated offline on ${new Date().toLocaleDateString('en-GB')} via Physiotherapy &amp; Sports Clinic Practice Suite.
  </div>
</body>
</html>`;

  const printWin = new BrowserWindow({
    show: false,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true
    }
  });

  const tempHtmlPath = path.join(app.getPath('temp'), `legal_decl_${Date.now()}_${Math.random().toString(36).slice(2)}.html`);
  fs.writeFileSync(tempHtmlPath, htmlContent, 'utf8');

  try {
    await printWin.loadFile(tempHtmlPath);
    await printWin.webContents.executeJavaScript('new Promise(resolve => setTimeout(resolve, 250))');

    const pdfData = await printWin.webContents.printToPDF({
      pageSize: 'A4',
      landscape: false,
      printBackground: true,
      margins: {
        marginType: 'custom',
        top: 0.35,
        bottom: 0.35,
        left: 0.35,
        right: 0.35
      }
    });

    fs.writeFileSync(saveResult.filePath, pdfData);
    shell.showItemInFolder(saveResult.filePath);
    return { success: true, filePath: saveResult.filePath };
  } catch (err) {
    console.error('[Legal PDF Export] Error generating declaration:', err);
    throw err;
  } finally {
    try {
      if (fs.existsSync(tempHtmlPath)) fs.unlinkSync(tempHtmlPath);
    } catch (_) {}
    if (!printWin.isDestroyed()) {
      printWin.close();
    }
  }
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

  const tempHtmlPath = path.join(app.getPath('temp'), `print_${Date.now()}_${Math.random().toString(36).slice(2)}.html`);
  fs.writeFileSync(tempHtmlPath, htmlContent, 'utf8');

  try {
    await printWin.loadFile(tempHtmlPath);
    // Allow offscreen DOM layout & CSS calculation to settle
    await printWin.webContents.executeJavaScript('new Promise(resolve => setTimeout(resolve, 250))');

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
    try {
      if (fs.existsSync(tempHtmlPath)) fs.unlinkSync(tempHtmlPath);
    } catch (_) {}
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
// RESEARCH PAPER LIBRARY IPC HANDLERS
// ═══════════════════════════════════════════════════════════════════════════

ipcMain.handle('research:list', (_e, filters) => {
  return db.researchPapers.getAll(filters || {});
});

ipcMain.handle('research:getById', (_e, id) => {
  return db.researchPapers.getById(id);
});

ipcMain.handle('research:getGroups', () => {
  return db.researchPapers.getGroups();
});

ipcMain.handle('research:addGroup', (_e, name) => {
  return db.researchPapers.addGroup(name);
});

ipcMain.handle('research:exportBackup', async () => {
  const saveResult = await dialog.showSaveDialog(mainWindow, {
    title: 'Export Research Library Metadata Backup',
    defaultPath: `PhysioClinic_Research_Backup_${new Date().toISOString().slice(0, 10)}.json`,
    filters: [
      { name: 'JSON Backup (*.json)', extensions: ['json'] }
    ]
  });
  if (saveResult.canceled || !saveResult.filePath) {
    return { success: false, canceled: true };
  }
  const data = db.researchPapers.exportBackup();
  fs.writeFileSync(saveResult.filePath, JSON.stringify(data, null, 2), 'utf8');
  return { success: true, filePath: saveResult.filePath };
});

ipcMain.handle('research:importBackup', async () => {
  const openResult = await dialog.showOpenDialog(mainWindow, {
    title: 'Import Research Library Metadata Backup',
    filters: [
      { name: 'JSON Backup (*.json)', extensions: ['json'] }
    ],
    properties: ['openFile']
  });
  if (openResult.canceled || !openResult.filePaths.length) {
    return { success: false, canceled: true };
  }
  const raw = fs.readFileSync(openResult.filePaths[0], 'utf8');
  const parsed = JSON.parse(raw);
  const result = db.researchPapers.importBackup(parsed);
  return { success: true, paperCount: result.paperCount };
});

ipcMain.handle('research:toggleFavorite', (_e, id) => {
  return db.researchPapers.toggleFavorite(id);
});

ipcMain.handle('research:setFavorite', (_e, arg1, arg2) => {
  if (typeof arg1 === 'object' && arg1 !== null && 'id' in arg1) {
    return db.researchPapers.setFavorite(arg1.id, arg1.isFavorite !== undefined ? arg1.isFavorite : arg1.isFav);
  }
  return db.researchPapers.setFavorite(arg1, arg2);
});

ipcMain.handle('research:getFavoriteCount', () => {
  return db.researchPapers.getFavoriteCount();
});

ipcMain.handle('research:getCounts', () => {
  return db.researchPapers.getCounts();
});

ipcMain.handle('research:update', (_e, id, data) => {
  return db.researchPapers.update(id, data);
});

ipcMain.handle('research:delete', async (_e, id) => {
  const paper = db.researchPapers.delete(id);
  if (paper && paper.file_path && !paper.file_path.startsWith('internal://')) {
    try { if (fs.existsSync(paper.file_path)) fs.unlinkSync(paper.file_path); } catch (_) {}
  }
  if (paper && paper.thumbnail_path) {
    try { if (fs.existsSync(paper.thumbnail_path)) fs.unlinkSync(paper.thumbnail_path); } catch (_) {}
  }
  return { success: true };
});

ipcMain.handle('research:selectPdf', async () => {
  const res = await dialog.showOpenDialog({
    title: 'Select Research Paper (PDF)',
    filters: [{ name: 'PDF Documents', extensions: ['pdf'] }],
    properties: ['openFile']
  });
  if (res.canceled || !res.filePaths || res.filePaths.length === 0) {
    return { canceled: true };
  }
  return { canceled: false, filePath: res.filePaths[0] };
});

ipcMain.handle('research:parseMetadata', async (_e, filePath) => {
  try {
    if (!fs.existsSync(filePath)) {
      return { success: false, error: 'File does not exist on disk' };
    }
    const buffer = fs.readFileSync(filePath);
    const meta = await extractPaperMetadata(buffer, filePath);
    // Base64 buffer so renderer can render thumbnail in HTML5 Canvas
    const base64 = buffer.toString('base64');
    return {
      success: true,
      filePath,
      fileBase64: base64,
      ...meta
    };
  } catch (err) {
    console.error('[Research] Parse metadata error:', err);
    return { success: false, error: err.message };
  }
});

ipcMain.handle('research:savePaper', async (_e, data) => {
  try {
    const { sourceFilePath, title, authors, publicationDate, groupTag, notes, thumbnailDataUrl } = data;
    if (!sourceFilePath || !fs.existsSync(sourceFilePath)) {
      throw new Error('Source PDF file does not exist');
    }

    const userDir = path.join(app.getPath('userData'), 'research_library');
    if (!fs.existsSync(userDir)) fs.mkdirSync(userDir, { recursive: true });
    const thumbDir = path.join(userDir, 'thumbnails');
    if (!fs.existsSync(thumbDir)) fs.mkdirSync(thumbDir, { recursive: true });

    const safeName = path.basename(sourceFilePath).replace(/[^a-zA-Z0-9._-]/g, '_');
    const destFileName = `paper_${Date.now()}_${safeName}`;
    const destFilePath = path.join(userDir, destFileName);
    fs.copyFileSync(sourceFilePath, destFilePath);

    let thumbPath = null;
    if (thumbnailDataUrl && typeof thumbnailDataUrl === 'string' && thumbnailDataUrl.startsWith('data:image/')) {
      const base64Data = thumbnailDataUrl.replace(/^data:image\/\w+;base64,/, '');
      const thumbFileName = `thumb_${Date.now()}.png`;
      thumbPath = path.join(thumbDir, thumbFileName);
      fs.writeFileSync(thumbPath, Buffer.from(base64Data, 'base64'));
    }

    const newPaper = db.researchPapers.create({
      title: title || path.basename(sourceFilePath, '.pdf'),
      authors: authors || 'Unknown Author',
      publication_date: publicationDate || new Date().getFullYear().toString(),
      group_tag: groupTag || 'General / MSK',
      file_path: destFilePath,
      thumbnail_path: thumbPath,
      is_favorite: 0,
      notes: notes || null
    });

    return { success: true, paper: newPaper };
  } catch (err) {
    console.error('[Research] Save paper error:', err);
    return { success: false, error: err.message };
  }
});

ipcMain.handle('research:openPdf', async (_e, filePath) => {
  if (!filePath) return { success: false, error: 'No file path provided' };
  if (filePath.startsWith('internal://')) {
    return { success: false, isSample: true, message: 'Sample reference benchmark paper.' };
  }
  try {
    const err = await shell.openPath(filePath);
    if (err) return { success: false, error: err };
    return { success: true };
  } catch (e) {
    return { success: false, error: e.message };
  }
});

ipcMain.handle('research:showInFolder', (_e, filePath) => {
  if (!filePath || filePath.startsWith('internal://')) return;
  shell.showItemInFolder(filePath);
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
