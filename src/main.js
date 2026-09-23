const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('node:path');
const db = require('./db');
const fs = require('node:fs');
const os = require('node:os');

let mainWindow;

function createWindow () {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true
    }
  });

  mainWindow.loadFile(path.join(__dirname, 'index.html'));
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// IPC Handlers - Database Operations

// Patients
ipcMain.handle('db:createPatient', (event, patient) => {
  return db.createPatient(patient);
});
ipcMain.handle('db:getPatients', () => {
  return db.getPatients();
});
ipcMain.handle('db:searchPatients', (event, query) => {
  return db.searchPatients(query);
});

// Appointments
ipcMain.handle('db:createAppointment', (event, appointment) => {
  return db.createAppointment(appointment);
});
ipcMain.handle('db:getAppointmentsByDate', (event, date) => {
  return db.getAppointmentsByDate(date);
});

// Clinical Notes
ipcMain.handle('db:createNote', (event, note) => {
  return db.createNote(note);
});
ipcMain.handle('db:updateNote', (event, id, content) => {
  return db.updateNote(id, content);
});
ipcMain.handle('db:addAddendum', (event, addendum) => {
  return db.addAddendum(addendum);
});
ipcMain.handle('db:getNotesForPatient', (event, patientId) => {
  return db.getNotesForPatient(patientId);
});

// PT Programs
ipcMain.handle('db:saveProgramTemplate', (event, template) => {
  return db.saveProgramTemplate(template);
});
ipcMain.handle('db:getProgramTemplates', () => {
  return db.getProgramTemplates();
});
ipcMain.handle('db:savePatientProgram', (event, patientId, programData) => {
  return db.savePatientProgram(patientId, programData);
});
ipcMain.handle('db:getPatientPrograms', (event, patientId) => {
  return db.getPatientPrograms(patientId);
});

// Invoices
ipcMain.handle('db:createInvoice', (event, invoice) => {
  return db.createInvoice(invoice);
});
ipcMain.handle('db:getInvoicesForPatient', (event, patientId) => {
  return db.getInvoicesForPatient(patientId);
});

// Auto-Text Templates
ipcMain.handle('db:getAutoTextTemplates', () => {
  return db.getAutoTextTemplates();
});
ipcMain.handle('db:createAutoTextTemplate', (event, template) => {
  return db.createAutoTextTemplate(template);
});

// Clinic Settings
ipcMain.handle('db:getSettings', () => {
  return db.getSettings();
});
ipcMain.handle('db:updateSettings', (event, settings) => {
  return db.updateSettings(settings);
});

// File System - read image to Base64
ipcMain.handle('fs:readImageAsBase64', (event, filePath) => {
    try {
        if (!filePath) return null;
        const ext = path.extname(filePath).toLowerCase();
        let mimeType = 'image/png';
        if (ext === '.jpg' || ext === '.jpeg') mimeType = 'image/jpeg';
        else if (ext === '.svg') mimeType = 'image/svg+xml';
        else if (ext === '.gif') mimeType = 'image/gif';

        const bitmap = fs.readFileSync(filePath);
        return `data:${mimeType};base64,${bitmap.toString('base64')}`;
    } catch (e) {
        console.error("Failed to read image:", e);
        return null;
    }
});

// IPC Handler for PDF generation
ipcMain.handle('pdf:generate', async (event, htmlContent, filenamePrefix = 'export') => {
    // Create a hidden BrowserWindow to render the HTML
    let printWindow = new BrowserWindow({
        show: false,
        webPreferences: {
            nodeIntegration: false
        }
    });

    // Load the HTML content
    const dataUrl = 'data:text/html;charset=utf-8,' + encodeURIComponent(htmlContent);
    await printWindow.loadURL(dataUrl);

    try {
        const pdfData = await printWindow.webContents.printToPDF({
            marginsType: 0,
            printBackground: true,
            printSelectionOnly: false,
            landscape: false,
            pageSize: 'A4'
        });

        // Save to Downloads folder or Desktop for demonstration
        const downloadsPath = path.join(os.homedir(), 'Downloads');
        const filename = `${filenamePrefix}_${Date.now()}.pdf`;
        const filePath = path.join(downloadsPath, filename);

        fs.writeFileSync(filePath, pdfData);
        printWindow.close();

        return { success: true, path: filePath };
    } catch (error) {
        printWindow.close();
        console.error("Failed to generate PDF:", error);
        return { success: false, error: error.message };
    }
});