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

  // ── Low-level DB helpers ───────────────────────────────────────────────
  // Use these from renderer JS when no higher-level domain method exists yet.

  /** Run a write statement (INSERT / UPDATE / DELETE / DDL). Returns info object. */
  dbRun: (sql, params) => ipcRenderer.invoke('db:run', sql, params),

  /** Fetch a single row. Returns the row object or undefined. */
  dbGet: (sql, params) => ipcRenderer.invoke('db:get', sql, params),

  /** Fetch all matching rows. Returns an array. */
  dbAll: (sql, params) => ipcRenderer.invoke('db:all', sql, params),

  // ── Domain: Patients ──────────────────────────────────────────────────

  patients: {
    /** List all active patients (lightweight), ordered by last name. */
    list: () => ipcRenderer.invoke('patients:list'),

    /**
     * Real-time fuzzy search across first_name, last_name, phone, email.
     * @param {string} query - Raw search string (no wildcards needed).
     * @returns {Promise<Array>} Up to 20 matching patient rows.
     */
    search: (query) => ipcRenderer.invoke('patients:search', query),

    /**
     * Retrieve a full patient profile: patient row + appointments + notes.
     * @param {number} id - Patient primary key.
     * @returns {Promise<Object|null>} Patient object or null if not found.
     */
    getById: (id) => ipcRenderer.invoke('patients:getById', id),

    /**
     * Validate and create a new patient record.
     * @param {Object} data - { first_name, last_name, dob, phone, email, emergency_contact, notes }
     * @returns {Promise<Object>} The newly created patient row.
     * @throws If validation fails (first_name or last_name missing).
     */
    create: (data) => ipcRenderer.invoke('patients:create', data),

    /** Update patient fields by ID. */
    update: (id, data) => ipcRenderer.invoke('patients:update', id, data),

    /** Soft-delete a patient (sets deleted_at timestamp). */
    delete: (id) => ipcRenderer.invoke('patients:delete', id),
  },

  // ── Domain: Appointments ──────────────────────────────────────────────

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

  // ── Domain: Clinical Notes / SOAP ─────────────────────────────────────

  notes: {
    /** List clinical notes for a patient. */
    listByPatient: (patientId) => ipcRenderer.invoke('notes:listByPatient', patientId),
    /** Get a single note by ID. */
    get:    (id)       => ipcRenderer.invoke('notes:get', id),
    /** Save a new SOAP / clinical note. */
    create: (data)     => ipcRenderer.invoke('notes:create', data),
    /** Update an existing note within 24 hours. */
    update: (id, data) => ipcRenderer.invoke('notes:update', id, data),
    /** Append an immutable medico-legal addendum to a note. */
    addAddendum: (noteId, content) => ipcRenderer.invoke('notes:addAddendum', noteId, content),
  },

  // ── Stats ──────────────────────────────────────────────────────────────

  stats: {
    dashboard: (todayISO) => ipcRenderer.invoke('stats:dashboard', todayISO),
  },

  // ── Diary ──────────────────────────────────────────────────────────────

  diary: {
    /**
     * Fetch events within a UTC date range.
     * @param {string} startISO - Inclusive start (ISO 8601).
     * @param {string} endISO   - Exclusive end (ISO 8601).
     * @returns {Promise<Array>}
     */
    getEvents:   (startISO, endISO) => ipcRenderer.invoke('diary:getEvents', startISO, endISO),
    /** Create a new calendar event. Returns the full inserted row. */
    createEvent: (data)             => ipcRenderer.invoke('diary:createEvent', data),
    /** Partial update of an existing event. */
    updateEvent: (id, data)         => ipcRenderer.invoke('diary:updateEvent', id, data),
    /** Soft-cancel an event (sets status = 'cancelled'). */
    deleteEvent: (id)               => ipcRenderer.invoke('diary:deleteEvent', id),
  },

  // ── Domain: Smart Phrases (Phase 5) ───────────────────────────────────

  smartPhrases: {
    list:         (filter)          => ipcRenderer.invoke('smartPhrases:list', filter),
    getById:      (id)              => ipcRenderer.invoke('smartPhrases:getById', id),
    getByTrigger: (fullTrigger)     => ipcRenderer.invoke('smartPhrases:getByTrigger', fullTrigger),
    search:       (prefix, query)   => ipcRenderer.invoke('smartPhrases:search', prefix, query),
    create:       (data)            => ipcRenderer.invoke('smartPhrases:create', data),
    update:       (id, data)        => ipcRenderer.invoke('smartPhrases:update', id, data),
    delete:       (id)              => ipcRenderer.invoke('smartPhrases:delete', id),
  },

  // ── Domain: Trigger Categories ────────────────────────────────────────
  triggerCategories: {
    list:   ()              => ipcRenderer.invoke('triggerCategories:list'),
    save:   (prefix, label) => ipcRenderer.invoke('triggerCategories:save', prefix, label),
    delete: (prefix)        => ipcRenderer.invoke('triggerCategories:delete', prefix),
  },

});
