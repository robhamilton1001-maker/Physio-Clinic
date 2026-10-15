'use strict';

const { contextBridge, ipcRenderer } = require('electron');

/**
 * Secure bridge between the renderer (index.html / renderer JS) and the
 * main process (main.js). Only the explicitly listed methods are accessible
 * in the renderer via `window.api.*`.
 *
 * Architecture rules:
 *  - Never expose `ipcRenderer` itself – only specific invoke wrappers.
 *  - Never expose `require` or any Node built-in.
 *  - All DB writes/reads must flow through named IPC channels handled in main.js.
 */
contextBridge.exposeInMainWorld('api', {

  // ── Low-level DB helpers ──────────────────────────────────────────────
  // Use these from renderer JS when no higher-level domain method exists yet.

  /** Run a write statement (INSERT / UPDATE / DELETE / DDL). Returns info object. */
  dbRun: (sql, params) => ipcRenderer.invoke('db:run', sql, params),

  /** Fetch a single row. Returns the row object or undefined. */
  dbGet: (sql, params) => ipcRenderer.invoke('db:get', sql, params),

  /** Fetch all matching rows. Returns an array. */
  dbAll: (sql, params) => ipcRenderer.invoke('db:all', sql, params),

  // ── Domain: Patients ──────────────────────────────────────────────────
  // Placeholder – implement IPC channels in main.js and wire here.

  patients: {
    /** List all patients, ordered by last name. */
    list:   ()       => ipcRenderer.invoke('patients:list'),
    /** Get a single patient by ID. */
    get:    (id)     => ipcRenderer.invoke('patients:get', id),
    /** Create a new patient record. Returns { lastInsertRowid }. */
    create: (data)   => ipcRenderer.invoke('patients:create', data),
    /** Update patient fields by ID. */
    update: (id, data) => ipcRenderer.invoke('patients:update', id, data),
    /** Soft-delete a patient (sets deleted_at timestamp). */
    delete: (id)     => ipcRenderer.invoke('patients:delete', id),
  },

  // ── Domain: Appointments ─────────────────────────────────────────────

  appointments: {
    /** List appointments, optionally filtered by { patientId, date }. */
    list:   (filters) => ipcRenderer.invoke('appointments:list', filters),
    /** Get a single appointment by ID. */
    get:    (id)      => ipcRenderer.invoke('appointments:get', id),
    /** Create a new appointment. */
    create: (data)    => ipcRenderer.invoke('appointments:create', data),
    /** Update appointment fields. */
    update: (id, data) => ipcRenderer.invoke('appointments:update', id, data),
    /** Cancel / delete appointment. */
    delete: (id)      => ipcRenderer.invoke('appointments:delete', id),
  },

  // ── Domain: Notes / SOAP ─────────────────────────────────────────────

  notes: {
    /** List clinical notes for a patient. */
    listByPatient: (patientId) => ipcRenderer.invoke('notes:listByPatient', patientId),
    /** Get a single note by ID. */
    get:    (id)   => ipcRenderer.invoke('notes:get', id),
    /** Save a new SOAP note. */
    create: (data) => ipcRenderer.invoke('notes:create', data),
    /** Update an existing note. */
    update: (id, data) => ipcRenderer.invoke('notes:update', id, data),
  },

});
