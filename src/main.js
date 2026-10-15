'use strict';

const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');

// ── Database ───────────────────────────────────────────────────────────────
// Import AFTER app is ready so app.getPath('userData') is available.
let db;
function getDb() {
  if (!db) {
    db = require('./db/database');
  }
  return db;
}

// ── Window creation ────────────────────────────────────────────────────────
function createWindow() {
  const win = new BrowserWindow({
    width: 1280,
    height: 850,
    minWidth: 1280,
    minHeight: 850,
    show: false, // Shown after 'ready-to-show' to avoid flash
    backgroundColor: '#f9fafb',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,   // Renderer is isolated from Node
      nodeIntegration: false,   // No Node access in renderer
      sandbox: false,           // Required for preload to use require()
    },
  });

  win.loadFile(path.join(__dirname, 'index.html'));

  win.once('ready-to-show', () => {
    win.show();
  });

  // Open DevTools in development
  if (process.env.NODE_ENV === 'development') {
    win.webContents.openDevTools();
  }

  return win;
}

// ── App lifecycle ──────────────────────────────────────────────────────────
app.whenReady().then(() => {
  // Initialize DB on startup
  getDb();
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

// ── IPC Handlers ───────────────────────────────────────────────────────────
// All database/system operations are registered here and exposed through
// preload.js. The renderer process can never call Node APIs directly.

// --- Generic query helpers (for future modules to call) ---
ipcMain.handle('db:run', (_event, sql, params = []) => {
  return getDb().run(sql, params);
});

ipcMain.handle('db:get', (_event, sql, params = []) => {
  return getDb().get(sql, params);
});

ipcMain.handle('db:all', (_event, sql, params = []) => {
  return getDb().all(sql, params);
});
