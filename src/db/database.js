'use strict';

const path = require('path');
const { app } = require('electron');
const Database = require('better-sqlite3');

// ── Resolve the path to the persistent DB file ────────────────────────────
// app.getPath('userData') resolves to:
//   Windows : C:\Users\<user>\AppData\Roaming\physio-clinic-app
//   macOS   : ~/Library/Application Support/physio-clinic-app
//   Linux   : ~/.config/physio-clinic-app
const DB_PATH = path.join(app.getPath('userData'), 'clinic_data.db');

// ── Open / create the database ────────────────────────────────────────────
const db = new Database(DB_PATH, {
  // verbose: console.log, // Uncomment for SQL query logging during development
});

// Enable WAL mode for better concurrent read performance and crash safety.
db.pragma('journal_mode = WAL');
// Enforce foreign-key constraints.
db.pragma('foreign_keys = ON');

// ── Schema initialisation ─────────────────────────────────────────────────
// Using a single transaction so the schema is atomic – either all tables
// exist or none do.
db.transaction(() => {

  // -- Patients -------------------------------------------------------------
  db.exec(`
    CREATE TABLE IF NOT EXISTS patients (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      first_name  TEXT    NOT NULL,
      last_name   TEXT    NOT NULL,
      dob         TEXT,                -- ISO 8601 date string: YYYY-MM-DD
      phone       TEXT,
      email       TEXT,
      address     TEXT,
      notes       TEXT,
      created_at  TEXT    NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
      updated_at  TEXT    NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
      deleted_at  TEXT                 -- NULL = active, set = soft-deleted
    );
  `);

  // -- Appointments ---------------------------------------------------------
  db.exec(`
    CREATE TABLE IF NOT EXISTS appointments (
      id            INTEGER PRIMARY KEY AUTOINCREMENT,
      patient_id    INTEGER NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
      scheduled_at  TEXT    NOT NULL,  -- ISO 8601 datetime
      duration_min  INTEGER NOT NULL DEFAULT 60,
      type          TEXT    NOT NULL DEFAULT 'Initial Assessment',
      status        TEXT    NOT NULL DEFAULT 'scheduled',
                                       -- scheduled | completed | cancelled | no-show
      room          TEXT,
      therapist     TEXT,
      notes         TEXT,
      created_at    TEXT    NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
      updated_at    TEXT    NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
    );
  `);

  // -- Clinical Notes (SOAP) ------------------------------------------------
  db.exec(`
    CREATE TABLE IF NOT EXISTS clinical_notes (
      id              INTEGER PRIMARY KEY AUTOINCREMENT,
      patient_id      INTEGER NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
      appointment_id  INTEGER REFERENCES appointments(id) ON DELETE SET NULL,
      subjective      TEXT,
      objective       TEXT,
      assessment      TEXT,
      plan            TEXT,
      created_at      TEXT    NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
      updated_at      TEXT    NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
    );
  `);

  // -- Indexes --------------------------------------------------------------
  db.exec(`
    CREATE INDEX IF NOT EXISTS idx_appointments_patient   ON appointments(patient_id);
    CREATE INDEX IF NOT EXISTS idx_appointments_scheduled ON appointments(scheduled_at);
    CREATE INDEX IF NOT EXISTS idx_notes_patient          ON clinical_notes(patient_id);
    CREATE INDEX IF NOT EXISTS idx_patients_name          ON patients(last_name, first_name);
  `);

})();

console.log(`[DB] SQLite database initialised at: ${DB_PATH}`);

// ── Export wrapped helpers ────────────────────────────────────────────────
// Wrappers around the raw better-sqlite3 sync API that main.js can call
// from async ipcMain.handle() handlers without blocking the event loop via
// Electron's built-in off-thread handling.

module.exports = {
  /** Execute a write statement. Returns { changes, lastInsertRowid }. */
  run(sql, params = []) {
    return db.prepare(sql).run(params);
  },

  /** Fetch a single row object, or undefined if not found. */
  get(sql, params = []) {
    return db.prepare(sql).get(params);
  },

  /** Fetch all matching row objects as an array. */
  all(sql, params = []) {
    return db.prepare(sql).all(params);
  },

  /** Expose the raw db instance for advanced use (transactions, etc.). */
  raw: db,
};
