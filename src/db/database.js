'use strict';

const path = require('path');
const { app } = require('electron');
const Database = require('better-sqlite3');

// ── Resolve the path to the persistent DB file ────────────────────────────
// app.getPath('userData') resolves to:
//   Windows : C:\Users\<user>\AppData\Roaming\physio-clinic-app
//   macOS   : ~/Library/Application Support/physio-clinic-app
//   Linux   : ~/.config/physio-clinic-app
const userDataPath = (app && typeof app.getPath === 'function')
  ? app.getPath('userData')
  : path.join(process.env.APPDATA || process.env.HOME || '.', 'physio-clinic-app');
const DB_PATH = path.join(userDataPath, 'clinic_data.db');

// ── Open / create the database ────────────────────────────────────────────
const db = new Database(DB_PATH, {
  // verbose: console.log, // Uncomment for SQL query logging during development
});

// Enable WAL mode for better concurrent read performance and crash safety.
db.pragma('journal_mode = WAL');
// Enforce foreign-key constraints.
db.pragma('foreign_keys = ON');

// ── Schema initialisation ─────────────────────────────────────────────────
// Single transaction — schema is atomic: all tables exist or none do.
db.transaction(() => {

  // -- Patients -------------------------------------------------------------
  db.exec(`
    CREATE TABLE IF NOT EXISTS patients (
      id                INTEGER PRIMARY KEY AUTOINCREMENT,
      first_name        TEXT    NOT NULL,
      last_name         TEXT    NOT NULL,
      dob               TEXT,                   -- ISO 8601: YYYY-MM-DD
      phone             TEXT,
      email             TEXT,
      address           TEXT,
      emergency_contact TEXT,                   -- Free-text: "Name — Relationship — Phone"
      notes             TEXT,
      primary_diagnosis TEXT,
      national_id       TEXT,
      created_at        TEXT    NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
      updated_at        TEXT    NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
      deleted_at        TEXT                    -- NULL = active, set = soft-deleted
    );
  `);

  // Add columns to any existing DB that predates them
  try { db.exec(`ALTER TABLE patients ADD COLUMN emergency_contact TEXT;`); } catch (_) { /* ignore */ }
  try { db.exec(`ALTER TABLE patients ADD COLUMN primary_diagnosis TEXT;`); } catch (_) { /* ignore */ }
  try { db.exec(`ALTER TABLE patients ADD COLUMN national_id TEXT;`); } catch (_) { /* ignore */ }

  // -- Appointments ---------------------------------------------------------
  db.exec(`
    CREATE TABLE IF NOT EXISTS appointments (
      id            INTEGER PRIMARY KEY AUTOINCREMENT,
      patient_id    INTEGER REFERENCES patients(id) ON DELETE CASCADE,
      scheduled_at  TEXT    NOT NULL,  -- ISO 8601 datetime
      duration_min  INTEGER NOT NULL DEFAULT 60,
      type          TEXT    NOT NULL DEFAULT 'Initial Assessment',
      status        TEXT    NOT NULL DEFAULT 'scheduled',
                                       -- scheduled | completed | cancelled | no-show
      room          TEXT,
      therapist     TEXT,
      notes         TEXT,
      created_at    TEXT    NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
      updated_at    TEXT    NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
      is_clinical   INTEGER NOT NULL DEFAULT 1
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

  // -- Phase 4: Medico-Legal Notes & Addendums ---------------------------------
  db.exec(`
    CREATE TABLE IF NOT EXISTS notes (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      patient_id  INTEGER NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
      content     TEXT    NOT NULL,
      created_at  TEXT    NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
      updated_at  TEXT    NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
      is_locked   INTEGER NOT NULL DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS addendums (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      note_id     INTEGER NOT NULL REFERENCES notes(id) ON DELETE CASCADE,
      content     TEXT    NOT NULL,
      timestamp   TEXT    NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
    );
  `);

  // -- Phase 5: Dynamic Smart Phrases & Trigger Categories -------------------
  db.exec(`
    CREATE TABLE IF NOT EXISTS smart_phrases (
      id              INTEGER PRIMARY KEY AUTOINCREMENT,
      trigger_prefix  TEXT    NOT NULL,
      code            TEXT    NOT NULL,
      full_trigger    TEXT    GENERATED ALWAYS AS (trigger_prefix || code) VIRTUAL UNIQUE,
      title           TEXT    NOT NULL,
      content         TEXT    NOT NULL,
      category        TEXT    DEFAULT 'general',
      created_at      TEXT    NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
      updated_at      TEXT    NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
    );

    CREATE TABLE IF NOT EXISTS trigger_categories (
      id              INTEGER PRIMARY KEY AUTOINCREMENT,
      prefix          TEXT    NOT NULL UNIQUE,
      label           TEXT    NOT NULL,
      created_at      TEXT    NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
    );

    -- Phase 7: Phased S&C and Rehab Builder --------------------------------
    CREATE TABLE IF NOT EXISTS exercise_library (
      id              INTEGER PRIMARY KEY AUTOINCREMENT,
      name            TEXT    NOT NULL,
      category        TEXT    DEFAULT 'General',
      default_sets    INTEGER DEFAULT 3,
      default_reps    TEXT    DEFAULT '10',
      thumbnail_path  TEXT,
      cues            TEXT
    );

    CREATE VIEW IF NOT EXISTS exercises AS SELECT * FROM exercise_library;

    CREATE TABLE IF NOT EXISTS pt_programs (
      id              INTEGER PRIMARY KEY AUTOINCREMENT,
      patient_id      INTEGER REFERENCES patients(id) ON DELETE SET NULL,
      title           TEXT    NOT NULL,
      duration_weeks  INTEGER DEFAULT 4,
      schedule_json   TEXT    NOT NULL,
      created_at      TEXT    NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
    );

    CREATE TABLE IF NOT EXISTS pt_templates (
      id              INTEGER PRIMARY KEY AUTOINCREMENT,
      name            TEXT    NOT NULL,
      category        TEXT    DEFAULT 'Rehab',
      duration_weeks  INTEGER DEFAULT 4,
      protocol_json   TEXT    NOT NULL
    );

    CREATE VIEW IF NOT EXISTS protocols AS SELECT * FROM pt_templates;

    -- Phase 8: Clinic Settings & Invoicing ---------------------------------
    CREATE TABLE IF NOT EXISTS clinic_settings (
      key   TEXT PRIMARY KEY,
      value TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS invoices (
      id              INTEGER PRIMARY KEY AUTOINCREMENT,
      invoice_number  TEXT    NOT NULL UNIQUE,
      patient_id      INTEGER NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
      issue_date      TEXT    NOT NULL,
      due_date        TEXT    NOT NULL,
      status          TEXT    NOT NULL DEFAULT 'Pending',
      subtotal        REAL    NOT NULL DEFAULT 0.0,
      tax_rate        REAL    NOT NULL DEFAULT 10.0,
      tax_amount      REAL    NOT NULL DEFAULT 0.0,
      total           REAL    NOT NULL DEFAULT 0.0,
      payment_method  TEXT    DEFAULT 'Credit/Debit Card',
      notes           TEXT,
      created_at      TEXT    NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
      updated_at      TEXT    NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
    );

    CREATE TABLE IF NOT EXISTS invoice_items (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      invoice_id  INTEGER NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,
      description TEXT    NOT NULL,
      quantity    INTEGER NOT NULL DEFAULT 1,
      unit_price  REAL    NOT NULL DEFAULT 0.0,
      total       REAL    NOT NULL DEFAULT 0.0
    );

    CREATE TABLE IF NOT EXISTS research_papers (
      id                INTEGER PRIMARY KEY AUTOINCREMENT,
      title             TEXT NOT NULL,
      authors           TEXT,
      publication_date  TEXT,
      date_uploaded     DATETIME DEFAULT CURRENT_TIMESTAMP,
      group_tag         TEXT DEFAULT 'General',
      file_path         TEXT NOT NULL,
      thumbnail_path    TEXT,
      is_favorite       INTEGER DEFAULT 0,
      notes             TEXT
    );

    CREATE TABLE IF NOT EXISTS research_groups (
      id         INTEGER PRIMARY KEY AUTOINCREMENT,
      name       TEXT NOT NULL UNIQUE,
      created_at TEXT DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
    );

    -- Phase 9: Legal Disclaimer & First-Run EULA Gateway --------------------
    CREATE TABLE IF NOT EXISTS settings (
      id                      INTEGER PRIMARY KEY DEFAULT 1,
      eula_accepted           INTEGER DEFAULT 0,
      eula_accepted_timestamp TEXT,
      eula_signee             TEXT
    );
  `);

  try { db.exec(`INSERT OR IGNORE INTO settings (id, eula_accepted) VALUES (1, 0);`); } catch (_) {}

  // -- Clinic Settings Branding & Columns migration -------------------------
  [
    `ALTER TABLE clinic_settings ADD COLUMN id INTEGER`,
    `ALTER TABLE clinic_settings ADD COLUMN logo_path TEXT`,
    `ALTER TABLE clinic_settings ADD COLUMN clinic_name TEXT`
  ].forEach(sql => { try { db.exec(sql); } catch (_) {} });

  try {
    const existingRow = db.prepare('SELECT id FROM clinic_settings WHERE id = 1').get();
    const cNameRow = db.prepare("SELECT value FROM clinic_settings WHERE key = 'clinic_name'").get();
    const lPathRow = db.prepare("SELECT value FROM clinic_settings WHERE key = 'logo_path'").get();
    const currentName = cNameRow ? cNameRow.value : '';
    const currentLogo = lPathRow ? lPathRow.value : null;

    if (!existingRow) {
      db.prepare(`
        INSERT OR REPLACE INTO clinic_settings (key, value, id, clinic_name, logo_path)
        VALUES ('logo_path', coalesce(?, ''), 1, ?, ?)
      `).run(currentLogo, currentName, currentLogo);
    }
  } catch (_) {}

  try {
    db.exec(`
      CREATE TRIGGER IF NOT EXISTS trg_clinic_settings_sync_logo
      AFTER UPDATE OF logo_path ON clinic_settings
      WHEN NEW.id = 1
      BEGIN
        UPDATE clinic_settings SET value = coalesce(NEW.logo_path, '') WHERE key = 'logo_path';
      END;
    `);
  } catch (_) {}

  // -- Phase 3 columns & nullable patient_id migration ----------------------
  [
    `ALTER TABLE appointments ADD COLUMN event_type   TEXT    DEFAULT 'clinical_fup'`,
    `ALTER TABLE appointments ADD COLUMN title        TEXT`,
    `ALTER TABLE appointments ADD COLUMN end_time     TEXT`,
    `ALTER TABLE appointments ADD COLUMN is_recurring INTEGER DEFAULT 0`,
    `ALTER TABLE appointments ADD COLUMN is_clinical   INTEGER DEFAULT 1`,
  ].forEach(sql => { try { db.exec(sql); } catch (_) { /* column exists */ } });

  try {
    const apptInfo = db.prepare("PRAGMA table_info(appointments)").all();
    const patCol = apptInfo.find(c => c.name === 'patient_id');
    if (patCol && patCol.notnull === 1) {
      db.exec(`
        PRAGMA foreign_keys = OFF;
        CREATE TABLE appointments_v2 (
          id            INTEGER PRIMARY KEY AUTOINCREMENT,
          patient_id    INTEGER REFERENCES patients(id) ON DELETE CASCADE,
          scheduled_at  TEXT    NOT NULL,
          duration_min  INTEGER NOT NULL DEFAULT 60,
          type          TEXT    NOT NULL DEFAULT 'Initial Assessment',
          status        TEXT    NOT NULL DEFAULT 'scheduled',
          room          TEXT,
          therapist     TEXT,
          notes         TEXT,
          created_at    TEXT    NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
          updated_at    TEXT    NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
          event_type    TEXT    DEFAULT 'clinical_fup',
          title         TEXT,
          end_time      TEXT,
          is_recurring  INTEGER DEFAULT 0,
          is_clinical   INTEGER DEFAULT 1
        );
        INSERT INTO appointments_v2 (id, patient_id, scheduled_at, duration_min, type, status, room, therapist, notes, created_at, updated_at, event_type, title, end_time, is_recurring, is_clinical)
          SELECT id, patient_id, scheduled_at, duration_min, type, status, room, therapist, notes, created_at, updated_at,
                 COALESCE(event_type, 'clinical_fup'), title, end_time, COALESCE(is_recurring, 0),
                 CASE WHEN event_type IN ('lunch', 'admin', 'meeting', 'leave', 'reminder') OR patient_id IS NULL THEN 0 ELSE 1 END
          FROM appointments;
        DROP TABLE appointments;
        ALTER TABLE appointments_v2 RENAME TO appointments;
        CREATE INDEX IF NOT EXISTS idx_appointments_patient   ON appointments(patient_id);
        CREATE INDEX IF NOT EXISTS idx_appointments_scheduled ON appointments(scheduled_at);
        CREATE INDEX IF NOT EXISTS idx_appointments_end       ON appointments(end_time);
        PRAGMA foreign_keys = ON;
      `);
    }
  } catch (err) {
    console.error('[DB] Appointments nullable migration error:', err);
  }

  // -- Indexes --------------------------------------------------------------
  db.exec(`
    CREATE INDEX IF NOT EXISTS idx_appointments_patient   ON appointments(patient_id);
    CREATE INDEX IF NOT EXISTS idx_appointments_scheduled ON appointments(scheduled_at);
    CREATE INDEX IF NOT EXISTS idx_notes_patient          ON clinical_notes(patient_id);
    CREATE INDEX IF NOT EXISTS idx_patients_name          ON patients(last_name, first_name);
    CREATE INDEX IF NOT EXISTS idx_patients_email         ON patients(email);
    CREATE INDEX IF NOT EXISTS idx_patients_phone         ON patients(phone);
    CREATE INDEX IF NOT EXISTS idx_appointments_end       ON appointments(end_time);
    CREATE INDEX IF NOT EXISTS idx_p4_notes_patient       ON notes(patient_id);
    CREATE INDEX IF NOT EXISTS idx_p4_notes_created       ON notes(created_at);
    CREATE INDEX IF NOT EXISTS idx_p4_addendums_note      ON addendums(note_id);
    CREATE INDEX IF NOT EXISTS idx_sp_prefix              ON smart_phrases(trigger_prefix);
    CREATE INDEX IF NOT EXISTS idx_sp_code                ON smart_phrases(code);
    CREATE INDEX IF NOT EXISTS idx_sp_full                ON smart_phrases(full_trigger);
    CREATE INDEX IF NOT EXISTS idx_pt_programs_patient   ON pt_programs(patient_id);
    CREATE INDEX IF NOT EXISTS idx_exercise_lib_cat      ON exercise_library(category);
    CREATE INDEX IF NOT EXISTS idx_pt_templates_cat      ON pt_templates(category);
    CREATE INDEX IF NOT EXISTS idx_invoices_patient      ON invoices(patient_id);
    CREATE INDEX IF NOT EXISTS idx_invoices_status       ON invoices(status);
    CREATE INDEX IF NOT EXISTS idx_invoices_date         ON invoices(issue_date);
    CREATE INDEX IF NOT EXISTS idx_inv_items_inv         ON invoice_items(invoice_id);
    CREATE INDEX IF NOT EXISTS idx_research_group        ON research_papers(group_tag);
    CREATE INDEX IF NOT EXISTS idx_research_fav          ON research_papers(is_favorite);
    CREATE INDEX IF NOT EXISTS idx_research_date         ON research_papers(date_uploaded);
  `);

})();

console.log(`[DB] SQLite database initialised at: ${DB_PATH}`);

// ── Seed Trigger Categories ───────────────────────────────────────────────
try {
  // Enforce cleanup of unwanted categories
  db.prepare("DELETE FROM trigger_categories WHERE prefix IN ('.', '?')").run();
  db.prepare("DELETE FROM smart_phrases WHERE trigger_prefix IN ('.', '?')").run();

  const insertCat = db.prepare('INSERT OR IGNORE INTO trigger_categories (prefix, label) VALUES (?, ?)');
  insertCat.run('@', 'Shortcuts');
  insertCat.run('!', 'MSK Measures');
  insertCat.run('#', 'Clinical Assessments');
} catch (catErr) {
  console.warn('[DB] Trigger categories seed warning:', catErr.message);
}

// ── Seed & Upgrade Smart Phrases Library ──────────────────────────────────
try {
  const { SEED_SMART_PHRASES } = require('./smart_phrases_seed');
  // Check if #ROM-CERVICAL and #CRANIAL-NERVES exist in DB and full library is seeded
  const sampleAssessment = db.prepare("SELECT id FROM smart_phrases WHERE trigger_prefix = '#' AND code = 'ROM-CERVICAL' LIMIT 1").get();
  const sampleCranial = db.prepare("SELECT id FROM smart_phrases WHERE trigger_prefix = '#' AND code = 'CRANIAL-NERVES' LIMIT 1").get();
  const sampleCES = db.prepare("SELECT id FROM smart_phrases WHERE trigger_prefix = '#' AND code = 'CES-SCREENING' LIMIT 1").get();
  const sampleRedFlags = db.prepare("SELECT id FROM smart_phrases WHERE trigger_prefix = '#' AND code = 'REDFLAGS-FULL' LIMIT 1").get();
  const sampleTh = db.prepare("SELECT content FROM smart_phrases WHERE trigger_prefix = '!' AND code = 'DASH' LIMIT 1").get();
  const samplePhq = db.prepare("SELECT id FROM smart_phrases WHERE trigger_prefix = '!' AND code = 'PHQ9' LIMIT 1").get();
  const currentCount = db.prepare('SELECT COUNT(*) AS count FROM smart_phrases').get()?.count || 0;
  const needsReseed = !sampleAssessment || !sampleCranial || !sampleCES || !sampleRedFlags || !samplePhq || currentCount < SEED_SMART_PHRASES.length || (sampleTh && !sampleTh.content.includes('th-text'));

  if (needsReseed) {
    console.log('[DB] Synchronizing # Clinical Assessments and updated MSK smart phrases...');
    db.prepare("DELETE FROM smart_phrases WHERE trigger_prefix IN ('@', '!', '#')").run();
  }

  const countRow = db.prepare('SELECT COUNT(*) AS count FROM smart_phrases').get();
  if (!countRow || countRow.count === 0 || needsReseed) {
    const insertSP = db.prepare(`
      INSERT OR REPLACE INTO smart_phrases (trigger_prefix, code, title, content, category)
      VALUES (@trigger_prefix, @code, @title, @content, @category)
    `);
    const seedTx = db.transaction((phrases) => {
      for (const sp of phrases) {
        insertSP.run(sp);
      }
    });
    seedTx(SEED_SMART_PHRASES);
    console.log(`[DB] Synchronized ${SEED_SMART_PHRASES.length} MSK & Clinical Assessment smart phrases into database.`);
  }
} catch (seedErr) {
  console.warn('[DB] Smart phrases seed warning:', seedErr.message);
}

// ── Seed Exercise Library (Phase 7 / Gross Exercise Library - 370+ Movements) ───
try {
  const { SEED_EXERCISES } = require('./rehab_seed');

  // Ensure compatibility alias view 'exercises' pointing to 'exercise_library'
  db.exec('CREATE VIEW IF NOT EXISTS exercises AS SELECT * FROM exercise_library;');

  const exCount = db.prepare('SELECT COUNT(*) AS count FROM exercise_library').get();
  if (!exCount || exCount.count < 400) {
    db.prepare('DELETE FROM exercise_library').run();
    const insertEx = db.prepare(`
      INSERT INTO exercise_library (name, category, default_sets, default_reps, thumbnail_path, cues)
      VALUES (@name, @category, @default_sets, @default_reps, @thumbnail_path, @cues)
    `);
    const seedExTx = db.transaction((exercises) => {
      for (const ex of exercises) {
        insertEx.run({
          name: ex.name,
          category: ex.category || 'General',
          default_sets: ex.default_sets || 3,
          default_reps: ex.default_reps || '10',
          thumbnail_path: ex.thumbnail_path || null,
          cues: ex.cues || ''
        });
      }
    });
    seedExTx(SEED_EXERCISES);
    console.log(`[DB] Seeded ${SEED_EXERCISES.length} individual atomic exercises into exercise_library.`);
  }

  // Ensure protocols / templates list is completely clean for clinician authoring (Zero pre-bundled protocols)
  try {
    db.prepare(`
      DELETE FROM pt_templates 
      WHERE name IN (
        'ACL Reconstruction Phase 1: Weeks 1-4',
        'Achilles Tendinopathy Loading',
        'Achilles Tendinopathy Heavy Slow Resistance',
        'Subacromial Shoulder Rehab',
        'Subacromial Shoulder Rehab & Cuff Progression',
        'Chronic Lumbar Motor Control & Stability',
        'Lateral Ankle Sprain Phase 2',
        'Patellofemoral Pain Syndrome (PFPS) Loading'
      )
    `).run();
  } catch (_) {}
} catch (rehabSeedErr) {
  console.warn('[DB] Rehab seed warning:', rehabSeedErr.message);
}

// ── Seed Practice Settings (Phase 8 - Clean Defaults) ─────────────────────
try {
  const defaultSettings = [
    ['clinic_name', ''],
    ['practitioner_name', ''],
    ['practitioner_title', ''],
    ['provider_number', ''],
    ['reg_number', ''],
    ['clinic_phone', ''],
    ['clinic_email', ''],
    ['clinic_address', ''],
    ['clinic_abn', ''],
    ['work_start', '08:30'],
    ['work_end', '17:30'],
    ['slot_duration', '30'],
    ['active_days', '["Mon","Tue","Wed","Thu","Fri"]'],
    ['lunch_enabled', '1'],
    ['lunch_start', '12:30'],
    ['lunch_duration', '60'],
    ['fee_initial', '0.00'],
    ['fee_followup', '0.00'],
    ['tax_rate', '0.0'],
    ['currency_symbol', '£']
  ];
  const insertSetting = db.prepare('INSERT OR IGNORE INTO clinic_settings (key, value) VALUES (?, ?)');
  for (const [k, v] of defaultSettings) {
    insertSetting.run(k, v);
  }

  // Purge legacy mock/dummy clinician data from existing installations
  db.prepare(`UPDATE clinic_settings SET value = '' WHERE key = 'practitioner_name' AND value LIKE '%Sarah Jenkins%'`).run();
  db.prepare(`UPDATE clinic_settings SET value = '' WHERE key = 'practitioner_title' AND value = 'Senior Orthopaedic Physiotherapist'`).run();
  db.prepare(`UPDATE clinic_settings SET value = '' WHERE key = 'clinic_name' AND value LIKE '%Antigravity Sports%'`).run();
  db.prepare(`UPDATE clinic_settings SET value = '' WHERE key = 'clinic_address' AND value LIKE '%Medical Centre Way%'`).run();
  db.prepare(`UPDATE clinic_settings SET value = '' WHERE key = 'provider_number' AND value = 'PRV-8829103A'`).run();
  db.prepare(`UPDATE clinic_settings SET value = '' WHERE key = 'reg_number' AND value = 'AHPRA-PHY00019283'`).run();
  db.prepare(`UPDATE clinic_settings SET value = '' WHERE key = 'clinic_phone' AND value = '+61 (02) 9876 5432'`).run();
  db.prepare(`UPDATE clinic_settings SET value = '' WHERE key = 'clinic_email' AND value = 'reception@antigravityphysio.com.au'`).run();
  db.prepare(`UPDATE clinic_settings SET value = '' WHERE key = 'clinic_abn' AND value = 'ABN 88 123 456 789'`).run();
  db.prepare(`UPDATE clinic_settings SET value = '0.00' WHERE key = 'fee_initial' AND value = '140.00'`).run();
  db.prepare(`UPDATE clinic_settings SET value = '0.00' WHERE key = 'fee_followup' AND value = '95.00'`).run();
  db.prepare(`UPDATE clinic_settings SET value = '0.0' WHERE key = 'tax_rate' AND value = '10.0'`).run();
  db.prepare(`UPDATE clinic_settings SET value = '£' WHERE key = 'currency_symbol' AND value = '$'`).run();
} catch (setErr) {
  console.warn('[DB] Settings seed warning:', setErr.message);
}

// Seed clinical patients if missing (e.g. Emma Rodriguez id:3)
try {
  const insertPat = db.prepare(`
    INSERT OR IGNORE INTO patients (id, first_name, last_name, dob, phone, email, address, emergency_contact, primary_diagnosis, national_id)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  insertPat.run(1, 'Jon', 'Doe', '1988-03-14', '07700 900123', 'jon.doe@example.com', '14 Victoria Road, London', 'David Doe (Brother) — 07700 900124', 'L4-L5 Lumbar Disc Herniation with Radiculopathy', '943 476 5919');
  insertPat.run(2, 'Jom', 'Doughnut', '1975-08-22', '07700 900456', 'jom.doughnut@example.com', '82 High Street, Manchester', 'Claire Doughnut (Wife) — 07700 900457', 'Post-Op Right ACL Reconstruction (Hamstring Graft)', '842 195 4421');
  insertPat.run(3, 'Emma', 'Rodriguez', '1992-11-05', '07700 900789', 'emma.rodriguez@example.com', '27 Park Lane, Bristol', 'Carlos Rodriguez (Brother) — 07700 900790', 'Cervicogenic Headache & Upper Trapezius Trigger Points', '731 884 1092');
} catch (pErr) {
  console.warn('[DB] Patient seed warning:', pErr.message);
}

// ── Prepared statements ───────────────────────────────────────────────────
// Pre-compiled once at startup for maximum performance on hot paths.

const stmts = {
  // Patients
  patientCreate: db.prepare(`
    INSERT INTO patients (first_name, last_name, dob, phone, email, address, emergency_contact, notes, primary_diagnosis, national_id)
    VALUES (@first_name, @last_name, @dob, @phone, @email, @address, @emergency_contact, @notes, @primary_diagnosis, @national_id)
  `),

  patientSearch: db.prepare(`
    SELECT id, first_name, last_name, phone, email, dob, address, emergency_contact, primary_diagnosis, national_id, created_at
    FROM   patients
    WHERE  deleted_at IS NULL
      AND  (
            first_name        LIKE @q
         OR last_name         LIKE @q
         OR (first_name || ' ' || last_name) LIKE @q
         OR phone             LIKE @q
         OR email             LIKE @q
         OR national_id       LIKE @q
         OR primary_diagnosis LIKE @q
           )
    ORDER  BY last_name, first_name
    LIMIT  20
  `),

  patientById: db.prepare(`
    SELECT * FROM patients WHERE id = ? AND deleted_at IS NULL
  `),

  patientUpdate: db.prepare(`
    UPDATE patients
    SET    first_name        = @first_name,
           last_name         = @last_name,
           dob               = @dob,
           phone             = @phone,
           email             = @email,
           address           = @address,
           emergency_contact = @emergency_contact,
           notes             = @notes,
           primary_diagnosis = @primary_diagnosis,
           national_id       = @national_id,
           updated_at        = strftime('%Y-%m-%dT%H:%M:%fZ', 'now')
    WHERE  id = @id AND deleted_at IS NULL
  `),

  patientSoftDelete: db.prepare(`
    UPDATE patients
    SET    deleted_at = strftime('%Y-%m-%dT%H:%M:%fZ', 'now'),
           updated_at = strftime('%Y-%m-%dT%H:%M:%fZ', 'now')
    WHERE  id = ? AND deleted_at IS NULL
  `),

  patientList: db.prepare(`
    SELECT id, first_name, last_name, phone, email, dob, created_at
    FROM   patients
    WHERE  deleted_at IS NULL
    ORDER  BY last_name, first_name
  `),

  // Appointments for a patient
  appointmentsByPatient: db.prepare(`
    SELECT * FROM appointments
    WHERE  patient_id = ?
    ORDER  BY scheduled_at DESC
  `),

  // Notes for a patient
  notesByPatient: db.prepare(`
    SELECT * FROM clinical_notes
    WHERE  patient_id = ?
    ORDER  BY created_at DESC
  `),

  // Appointments (generic)
  appointmentCreate: db.prepare(`
    INSERT INTO appointments (patient_id, scheduled_at, duration_min, type, status, room, therapist, notes, event_type, title, end_time, is_clinical)
    VALUES (@patient_id, @scheduled_at, @duration_min, @type, @status, @room, @therapist, @notes, @event_type, @title, @end_time, @is_clinical)
  `),

  appointmentById: db.prepare(`SELECT * FROM appointments WHERE id = ?`),

  appointmentUpdate: db.prepare(`
    UPDATE appointments
    SET    scheduled_at = @scheduled_at,
           duration_min = @duration_min,
           type         = @type,
           status       = @status,
           room         = @room,
           therapist    = @therapist,
           notes        = @notes,
           updated_at   = strftime('%Y-%m-%dT%H:%M:%fZ', 'now')
    WHERE  id = @id
  `),

  // Clinical notes
  noteCreate: db.prepare(`
    INSERT INTO clinical_notes (patient_id, appointment_id, subjective, objective, assessment, plan)
    VALUES (@patient_id, @appointment_id, @subjective, @objective, @assessment, @plan)
  `),

  noteById: db.prepare(`SELECT * FROM clinical_notes WHERE id = ?`),

  noteUpdate: db.prepare(`
    UPDATE clinical_notes
    SET    subjective = @subjective, objective = @objective,
           assessment = @assessment, plan = @plan,
           updated_at = strftime('%Y-%m-%dT%H:%M:%fZ', 'now')
    WHERE  id = @id
  `),

  // Stats
  countPatients: db.prepare(`SELECT COUNT(*) AS n FROM patients WHERE deleted_at IS NULL`),
  countTodayAppts: db.prepare(`
    SELECT COUNT(*) AS n FROM appointments
    WHERE (date(scheduled_at) = ? OR substr(scheduled_at, 1, 10) = ?) AND status != 'cancelled'
  `),
  countNotes: db.prepare(`SELECT ((SELECT COUNT(*) FROM notes) + (SELECT COUNT(*) FROM clinical_notes)) AS n`),
};

// ── Domain modules ──────────────────────────────────────────────────────────

const patients = {
  /**
   * Validate and insert a new patient.
   * Returns the full patient row including its new id.
   * Throws a descriptive Error if validation fails.
   */
  create(data) {
    const first_name = (data.first_name || '').trim();
    const last_name  = (data.last_name  || '').trim();
    if (!first_name) throw new Error('First name is required.');
    if (!last_name)  throw new Error('Last name is required.');

    const info = stmts.patientCreate.run({
      first_name,
      last_name,
      dob:               (data.dob               || '').trim() || null,
      phone:             (data.phone             || '').trim() || null,
      email:             (data.email             || '').trim().toLowerCase() || null,
      address:           (data.address           || '').trim() || null,
      emergency_contact: (data.emergency_contact || '').trim() || null,
      notes:             (data.notes             || '').trim() || null,
      primary_diagnosis: (data.primary_diagnosis || '').trim() || null,
      national_id:       (data.national_id       || '').trim() || null,
    });

    return stmts.patientById.get(info.lastInsertRowid);
  },

  /**
   * Fuzzy search across name, phone, email.
   * Returns up to 20 lightweight rows (no linked records).
   */
  search(query) {
    const q = `%${(query || '').trim()}%`;
    return stmts.patientSearch.all({ q });
  },

  /**
   * Fetch a patient's full profile: patient row + appointments + clinical notes + upcoming appt.
   * Returns null if not found or soft-deleted.
   */
  getById(id) {
    const patient = stmts.patientById.get(id);
    if (!patient) return null;
    patient.appointments   = stmts.appointmentsByPatient.all(id);
    
    // Phase 4: Next scheduled appointment (future, non-cancelled)
    patient.next_appointment = db.prepare(`
      SELECT * FROM appointments
      WHERE  patient_id = ?
        AND  scheduled_at >= strftime('%Y-%m-%dT%H:%M:%fZ', 'now')
        AND  status != 'cancelled'
      ORDER  BY scheduled_at ASC
      LIMIT  1
    `).get(id) || null;

    // Phase 4: Clinical notes feed with addendums and 24h locking status
    patient.notes = notes.listByPatient(id);
    patient.clinical_notes = patient.notes; // backward-compat
    return patient;
  },

  /**
   * Phase 8: Comprehensive discharge packet data
   * Compiles demographics, notes history, ROM/measure outcomes, and rehab programs.
   */
  getDischargeData(id) {
    const patient = this.getById(id);
    if (!patient) return null;
    const programs = db.prepare('SELECT * FROM pt_programs WHERE patient_id = ? ORDER BY id DESC').all(Number(id));
    return { patient, programs };
  },

  list()           { return stmts.patientList.all(); },
  update(id, data) {
    const existing = stmts.patientById.get(id);
    if (!existing) throw new Error(`Patient not found: ${id}`);
    stmts.patientUpdate.run({
      id: Number(id),
      first_name:        data.first_name !== undefined ? (data.first_name || '').trim() : existing.first_name,
      last_name:         data.last_name !== undefined ? (data.last_name || '').trim() : existing.last_name,
      dob:               data.dob !== undefined ? ((data.dob || '').trim() || null) : existing.dob,
      phone:             data.phone !== undefined ? ((data.phone || '').trim() || null) : existing.phone,
      email:             data.email !== undefined ? ((data.email || '').trim().toLowerCase() || null) : existing.email,
      address:           data.address !== undefined ? ((data.address || '').trim() || null) : existing.address,
      emergency_contact: data.emergency_contact !== undefined ? ((data.emergency_contact || '').trim() || null) : existing.emergency_contact,
      notes:             data.notes !== undefined ? ((data.notes || '').trim() || null) : existing.notes,
      primary_diagnosis: data.primary_diagnosis !== undefined ? ((data.primary_diagnosis || '').trim() || null) : existing.primary_diagnosis,
      national_id:       data.national_id !== undefined ? ((data.national_id || '').trim() || null) : existing.national_id,
    });
    return stmts.patientById.get(id);
  },
  delete(id)       { return stmts.patientSoftDelete.run(id); },
};

const appointments = {
  create(data) {
    const isClin = data.is_clinical !== undefined ? Number(data.is_clinical) : (data.patient_id ? 1 : 0);
    return stmts.appointmentCreate.run({
      patient_id:   data.patient_id ?? null,
      scheduled_at: data.scheduled_at,
      duration_min: data.duration_min ?? 60,
      type:         data.type ?? 'Initial Assessment',
      status:       data.status ?? 'scheduled',
      room:         data.room ?? null,
      therapist:    data.therapist ?? null,
      notes:        data.notes ?? null,
      event_type:   data.event_type ?? (isClin ? 'clinical_fup' : 'admin'),
      title:        data.title ?? null,
      end_time:     data.end_time ?? null,
      is_clinical:  isClin,
    });
  },
  getById(id)  { return stmts.appointmentById.get(id); },
  update(id, data) { return stmts.appointmentUpdate.run({ ...data, id }); },
  listByPatient(patientId) { return stmts.appointmentsByPatient.all(patientId); },
};

function parseUtcDate(dateStr) {
  if (!dateStr) return new Date();
  if (typeof dateStr === 'string') {
    if (dateStr.endsWith('Z') || dateStr.includes('+')) return new Date(dateStr);
    return new Date(dateStr.replace(' ', 'T') + 'Z');
  }
  return new Date(dateStr);
}

const notes = {
  /**
   * List all notes for a patient, sorted newest to oldest.
   * Evaluates 24-hour medico-legal locking and attaches unalterable addendums.
   */
  listByPatient(patientId) {
    const rows = db.prepare(`
      SELECT * FROM notes
      WHERE  patient_id = ?
      ORDER  BY created_at DESC
    `).all(patientId);

    const now = Date.now();
    const TWENTY_FOUR_HOURS_MS = 24 * 60 * 60 * 1000;

    const addendumsStmt = db.prepare(`
      SELECT * FROM addendums
      WHERE  note_id = ?
      ORDER  BY timestamp ASC
    `);

    const sealStmt = db.prepare(`
      UPDATE notes SET is_locked = 1 WHERE id = ? AND is_locked = 0
    `);

    return rows.map(note => {
      const createdMs = parseUtcDate(note.created_at).getTime();
      const ageMs = now - createdMs;
      const isPast24h = ageMs >= TWENTY_FOUR_HOURS_MS;
      const isLocked = note.is_locked === 1 || isPast24h;

      if (isPast24h && note.is_locked === 0) {
        sealStmt.run(note.id);
        note.is_locked = 1;
      } else {
        note.is_locked = isLocked ? 1 : 0;
      }

      const msRemaining = Math.max(0, TWENTY_FOUR_HOURS_MS - ageMs);
      note.hours_remaining = isLocked ? 0 : Math.round((msRemaining / (1000 * 60 * 60)) * 10) / 10;
      note.minutes_remaining = isLocked ? 0 : Math.floor(msRemaining / (1000 * 60));
      note.addendums = addendumsStmt.all(note.id);
      return note;
    });
  },

  getById(id) {
    const note = db.prepare(`SELECT * FROM notes WHERE id = ?`).get(id);
    if (!note) return null;

    const now = Date.now();
    const ageMs = now - parseUtcDate(note.created_at).getTime();
    const isPast24h = ageMs >= 24 * 60 * 60 * 1000;
    note.is_locked = (note.is_locked === 1 || isPast24h) ? 1 : 0;

    note.addendums = db.prepare(`
      SELECT * FROM addendums WHERE note_id = ? ORDER BY timestamp ASC
    `).all(id);
    return note;
  },

  create(data) {
    const patient_id = Number(data.patient_id);
    const content = (data.content || '').trim();
    if (!patient_id) throw new Error('patient_id is required.');
    if (!content) throw new Error('Note content cannot be empty.');

    const info = db.prepare(`
      INSERT INTO notes (patient_id, content, created_at, updated_at, is_locked)
      VALUES (?, ?, strftime('%Y-%m-%dT%H:%M:%fZ', 'now'), strftime('%Y-%m-%dT%H:%M:%fZ', 'now'), 0)
    `).run(patient_id, content);

    return this.getById(info.lastInsertRowid);
  },

  /**
   * In-place update within 24 hours.
   * Medico-legal audit compliance: strictly rejected if created_at >= 24 hours.
   */
  update(id, data) {
    const note = db.prepare(`SELECT * FROM notes WHERE id = ?`).get(id);
    if (!note) throw new Error('Note not found.');

    const ageMs = Date.now() - parseUtcDate(note.created_at).getTime();
    if (note.is_locked === 1 || ageMs >= 24 * 60 * 60 * 1000) {
      db.prepare(`UPDATE notes SET is_locked = 1 WHERE id = ?`).run(id);
      throw new Error('Medico-legal lock: Notes older than 24 hours are permanently sealed. Direct editing is disabled. Please add an addendum.');
    }

    const content = (data.content || '').trim();
    if (!content) throw new Error('Note content cannot be empty.');

    db.prepare(`
      UPDATE notes
      SET    content = ?,
             updated_at = strftime('%Y-%m-%dT%H:%M:%fZ', 'now')
      WHERE  id = ?
    `).run(content, id);

    return this.getById(id);
  },

  /**
   * Append-only addendum to a note with unalterable timestamp.
   */
  addAddendum(noteId, content) {
    const nId = Number(noteId);
    const text = (content || '').trim();
    if (!nId) throw new Error('note_id is required.');
    if (!text) throw new Error('Addendum text cannot be empty.');

    const note = db.prepare(`SELECT id FROM notes WHERE id = ?`).get(nId);
    if (!note) throw new Error('Note not found.');

    const info = db.prepare(`
      INSERT INTO addendums (note_id, content, timestamp)
      VALUES (?, ?, strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
    `).run(nId, text);

    return db.prepare(`SELECT * FROM addendums WHERE id = ?`).get(info.lastInsertRowid);
  },
};

const stats = {
  dashboard(todayISO) {
    const activeRow = db.prepare(`
      SELECT COUNT(DISTINCT patient_id) AS activeCount
      FROM appointments
      WHERE (date(scheduled_at) = ? OR substr(scheduled_at, 1, 10) = ?)
        AND is_clinical = 1
        AND status != 'cancelled'
        AND patient_id IS NOT NULL
    `).get(todayISO, todayISO);

    return {
      activePatients: activeRow ? activeRow.activeCount : 0,
      totalPatients:  stmts.countPatients.get().n,
      todayAppts:     stmts.countTodayAppts.get(todayISO, todayISO).n,
      totalNotes:     stmts.countNotes.get().n,
    };
  },
};

const smartPhrases = {
  list(filter = {}) {
    let sql = 'SELECT * FROM smart_phrases WHERE 1=1';
    const params = [];
    if (filter.category && filter.category !== 'all') {
      sql += ' AND category = ?';
      params.push(filter.category);
    }
    if (filter.prefix) {
      sql += ' AND trigger_prefix = ?';
      params.push(filter.prefix);
    }
    if (filter.search) {
      const q = `%${filter.search.trim()}%`;
      sql += ' AND (title LIKE ? OR code LIKE ? OR full_trigger LIKE ? OR content LIKE ?)';
      params.push(q, q, q, q);
    }
    sql += ' ORDER BY trigger_prefix ASC, code ASC';
    return db.prepare(sql).all(...params);
  },

  getById(id) {
    return db.prepare('SELECT * FROM smart_phrases WHERE id = ?').get(id);
  },

  getByTrigger(fullTrigger) {
    return db.prepare('SELECT * FROM smart_phrases WHERE full_trigger = ?').get(fullTrigger);
  },

  search(prefix, query) {
    const q = `%${(query || '').trim()}%`;
    return db.prepare(`
      SELECT id, trigger_prefix, code, full_trigger, title, category,
             substr(content, 1, 150) as snippet
      FROM   smart_phrases
      WHERE  trigger_prefix = ?
        AND  (code LIKE ? OR title LIKE ?)
      ORDER  BY code ASC
      LIMIT  15
    `).all(prefix, q, q);
  },

  create(data) {
    const trigger_prefix = (data.trigger_prefix || '@').trim();
    let rawCode = (data.code || '').trim().replace(/\s+/g, '-');
    const code = (trigger_prefix === '!' || trigger_prefix === '#' ? rawCode.toUpperCase() : rawCode);
    const title = (data.title || '').trim();
    const content = (data.content || '').trim();
    const category = (data.category || 'general').trim();

    if (!code) throw new Error('Trigger keyword code is required.');
    if (!title) throw new Error('Title is required.');
    if (!content) throw new Error('Content cannot be empty.');

    const info = db.prepare(`
      INSERT INTO smart_phrases (trigger_prefix, code, title, content, category)
      VALUES (?, ?, ?, ?, ?)
    `).run(trigger_prefix, code, title, content, category);

    return this.getById(info.lastInsertRowid);
  },

  update(id, data) {
    const sp = this.getById(id);
    if (!sp) throw new Error('Smart phrase not found.');

    const trigger_prefix = (data.trigger_prefix !== undefined ? data.trigger_prefix : sp.trigger_prefix).trim();
    let rawCode = (data.code !== undefined ? data.code.trim().replace(/\s+/g, '-') : sp.code);
    const code = (trigger_prefix === '!' || trigger_prefix === '#' ? rawCode.toUpperCase() : rawCode);
    const title = (data.title !== undefined ? data.title : sp.title).trim();
    const content = (data.content !== undefined ? data.content : sp.content).trim();
    const category = (data.category !== undefined ? data.category : sp.category).trim();

    if (!code) throw new Error('Trigger keyword code cannot be empty.');
    if (!title) throw new Error('Title cannot be empty.');
    if (!content) throw new Error('Content cannot be empty.');

    db.prepare(`
      UPDATE smart_phrases
      SET    trigger_prefix = ?,
             code           = ?,
             title          = ?,
             content        = ?,
             category       = ?,
             updated_at     = strftime('%Y-%m-%dT%H:%M:%fZ', 'now')
      WHERE  id = ?
    `).run(trigger_prefix, code, title, content, category, id);

    return this.getById(id);
  },

  delete(id) {
    return db.prepare('DELETE FROM smart_phrases WHERE id = ?').run(id);
  },

  exportBackup() {
    return {
      exported_at: new Date().toISOString(),
      app_version: '1.0.0',
      trigger_categories: triggerCategories.list(),
      smart_phrases: this.list()
    };
  },

  importBackup(backupData) {
    const phrases = backupData?.smart_phrases || backupData?.phrases;
    const categories = backupData?.trigger_categories || backupData?.categories;
    if (!backupData || !Array.isArray(phrases)) {
      throw new Error('Invalid backup file format: missing smart_phrases array.');
    }
    const importTx = db.transaction(() => {
      if (Array.isArray(categories)) {
        const catStmt = db.prepare(`
          INSERT INTO trigger_categories (prefix, label) VALUES (?, ?)
          ON CONFLICT(prefix) DO UPDATE SET label = excluded.label
        `);
        for (const cat of categories) {
          if (cat.prefix && cat.label) {
            catStmt.run(cat.prefix.trim(), cat.label.trim());
          }
        }
      }
      const spStmt = db.prepare(`
        INSERT INTO smart_phrases (trigger_prefix, code, title, content, category)
        VALUES (@trigger_prefix, @code, @title, @content, @category)
        ON CONFLICT(full_trigger) DO UPDATE SET
          title = excluded.title,
          content = excluded.content,
          category = excluded.category,
          updated_at = strftime('%Y-%m-%dT%H:%M:%fZ', 'now')
      `);
      let count = 0;
      for (const sp of phrases) {
        if (sp.trigger_prefix && sp.code && sp.title) {
          spStmt.run({
            trigger_prefix: sp.trigger_prefix.trim(),
            code: sp.code.trim().toUpperCase(),
            title: sp.title.trim(),
            content: sp.content || '',
            category: sp.category || 'general'
          });
          count++;
        }
      }
      return { success: true, count, phrasesImported: count, categoriesImported: Array.isArray(categories) ? categories.length : 0 };
    });
    return importTx();
  }
};

// ── Domain: Trigger Categories ────────────────────────────────────────────
const triggerCategories = {
  list() {
    return db.prepare('SELECT id, prefix, label, created_at FROM trigger_categories ORDER BY id ASC').all();
  },
  save(prefix, label) {
    if (!prefix || !prefix.trim()) throw new Error('Prefix symbol cannot be empty.');
    if (!label || !label.trim()) throw new Error('Category label cannot be empty.');
    const p = prefix.trim();
    const l = label.trim();
    const existing = db.prepare('SELECT * FROM trigger_categories WHERE prefix = ?').get(p);
    if (existing) {
      db.prepare('UPDATE trigger_categories SET label = ? WHERE prefix = ?').run(l, p);
      return db.prepare('SELECT * FROM trigger_categories WHERE prefix = ?').get(p);
    } else {
      const info = db.prepare('INSERT INTO trigger_categories (prefix, label) VALUES (?, ?)').run(p, l);
      return db.prepare('SELECT * FROM trigger_categories WHERE id = ?').get(info.lastInsertRowid);
    }
  },
  delete(prefix) {
    if (prefix === '@' || prefix === '!' || prefix === '#') {
      throw new Error('Default system prefixes (@, !, and #) cannot be deleted.');
    }
    return db.prepare('DELETE FROM trigger_categories WHERE prefix = ?').run(prefix);
  }
};

// ── Domain: Phased S&C and Rehab Builder (Phase 7) ────────────────────────
const rehab = {
  // Exercise Library
  getCategories() {
    const rows = db.prepare("SELECT DISTINCT category FROM exercises WHERE category IS NOT NULL AND trim(category) != '' ORDER BY category ASC").all();
    return rows.map(r => r.category);
  },

  listExercises(category, search) {
    let sql = 'SELECT * FROM exercise_library';
    const params = [];
    const where = [];

    if (category && category !== 'All') {
      where.push('category = ?');
      params.push(category);
    }
    if (search && search.trim()) {
      where.push('(name LIKE ? OR cues LIKE ? OR category LIKE ?)');
      const q = `%${search.trim()}%`;
      params.push(q, q, q);
    }
    if (where.length > 0) {
      sql += ' WHERE ' + where.join(' AND ');
    }
    sql += ' ORDER BY category ASC, name ASC';
    return db.prepare(sql).all(...params);
  },

  getExerciseById(id) {
    return db.prepare('SELECT * FROM exercise_library WHERE id = ?').get(Number(id));
  },

  createExercise(data) {
    const info = db.prepare(`
      INSERT INTO exercise_library (name, category, default_sets, default_reps, thumbnail_path, cues)
      VALUES (@name, @category, @default_sets, @default_reps, @thumbnail_path, @cues)
    `).run({
      name: data.name,
      category: data.category || 'General',
      default_sets: data.default_sets || 3,
      default_reps: data.default_reps || '10',
      thumbnail_path: data.thumbnail_path || null,
      cues: data.cues || ''
    });
    return db.prepare('SELECT * FROM exercise_library WHERE id = ?').get(info.lastInsertRowid);
  },

  updateExercise(id, data) {
    db.prepare(`
      UPDATE exercise_library
      SET name = @name, category = @category, default_sets = @default_sets, default_reps = @default_reps, cues = @cues
      WHERE id = @id
    `).run({
      id: Number(id),
      name: data.name,
      category: data.category || 'General',
      default_sets: data.default_sets || 3,
      default_reps: data.default_reps || '10',
      cues: data.cues || ''
    });
    return this.getExerciseById(Number(id));
  },

  deleteExercise(id) {
    return db.prepare('DELETE FROM exercise_library WHERE id = ?').run(Number(id));
  },

  // Protocols / Templates
  listTemplates() {
    return db.prepare('SELECT id, name, category, duration_weeks, protocol_json FROM pt_templates ORDER BY name ASC').all();
  },

  getTemplateById(id) {
    return db.prepare('SELECT * FROM pt_templates WHERE id = ?').get(Number(id));
  },

  saveTemplate(data) {
    const protocolJson = typeof data.protocol_json === 'string' ? data.protocol_json : JSON.stringify(data.protocol_json);
    if (data.id) {
      db.prepare(`
        UPDATE pt_templates
        SET name = @name, category = @category, duration_weeks = @duration_weeks, protocol_json = @protocol_json
        WHERE id = @id
      `).run({
        id: Number(data.id),
        name: data.name,
        category: data.category || 'Rehab',
        duration_weeks: data.duration_weeks || 4,
        protocol_json: protocolJson
      });
      return db.prepare('SELECT * FROM pt_templates WHERE id = ?').get(Number(data.id));
    } else {
      const info = db.prepare(`
        INSERT INTO pt_templates (name, category, duration_weeks, protocol_json)
        VALUES (@name, @category, @duration_weeks, @protocol_json)
      `).run({
        name: data.name,
        category: data.category || 'Rehab',
        duration_weeks: data.duration_weeks || 4,
        protocol_json: protocolJson
      });
      return db.prepare('SELECT * FROM pt_templates WHERE id = ?').get(info.lastInsertRowid);
    }
  },

  deleteTemplate(id) {
    return db.prepare('DELETE FROM pt_templates WHERE id = ?').run(Number(id));
  },

  // Patient Programs
  listPrograms(patientId) {
    if (patientId) {
      return db.prepare(`
        SELECT p.*, pat.first_name, pat.last_name
        FROM pt_programs p
        LEFT JOIN patients pat ON p.patient_id = pat.id
        WHERE p.patient_id = ?
        ORDER BY p.created_at DESC
      `).all(Number(patientId));
    }
    return db.prepare(`
      SELECT p.*, pat.first_name, pat.last_name
      FROM pt_programs p
      LEFT JOIN patients pat ON p.patient_id = pat.id
      ORDER BY p.created_at DESC
    `).all();
  },

  getProgramById(id) {
    return db.prepare(`
      SELECT p.*, pat.first_name, pat.last_name
      FROM pt_programs p
      LEFT JOIN patients pat ON p.patient_id = pat.id
      WHERE p.id = ?
    `).get(Number(id));
  },

  saveProgram(data) {
    const schedJson = typeof data.schedule_json === 'string' ? data.schedule_json : JSON.stringify(data.schedule_json);
    if (data.id) {
      db.prepare(`
        UPDATE pt_programs
        SET patient_id = @patient_id, title = @title, duration_weeks = @duration_weeks, schedule_json = @schedule_json
        WHERE id = @id
      `).run({
        id: Number(data.id),
        patient_id: data.patient_id ? Number(data.patient_id) : null,
        title: data.title,
        duration_weeks: data.duration_weeks || 4,
        schedule_json: schedJson
      });
      return this.getProgramById(Number(data.id));
    } else {
      const info = db.prepare(`
        INSERT INTO pt_programs (patient_id, title, duration_weeks, schedule_json)
        VALUES (@patient_id, @title, @duration_weeks, @schedule_json)
      `).run({
        patient_id: data.patient_id ? Number(data.patient_id) : null,
        title: data.title,
        duration_weeks: data.duration_weeks || 4,
        schedule_json: schedJson
      });
      return this.getProgramById(info.lastInsertRowid);
    }
  },

  deleteProgram(id) {
    return db.prepare('DELETE FROM pt_programs WHERE id = ?').run(Number(id));
  },

  exportBackup() {
    const exercises = db.prepare('SELECT id, name, category, default_sets, default_reps, thumbnail_path, cues FROM exercise_library ORDER BY category ASC, name ASC').all();
    const protocols = db.prepare('SELECT id, name, category, duration_weeks, protocol_json FROM pt_templates ORDER BY name ASC').all();
    return {
      exported_at: new Date().toISOString(),
      app_version: '1.0.0',
      exercises,
      protocols
    };
  },

  importBackup(backupData) {
    const exercises = backupData?.exercises || [];
    const protocols = backupData?.protocols || [];
    if (!Array.isArray(exercises) && !Array.isArray(protocols)) {
      throw new Error('Invalid backup format: expected exercises or protocols array.');
    }
    let exCount = 0;
    let protoCount = 0;
    const checkEx = db.prepare('SELECT id FROM exercise_library WHERE LOWER(name) = LOWER(?) LIMIT 1');
    const insertEx = db.prepare(`
      INSERT INTO exercise_library (name, category, default_sets, default_reps, thumbnail_path, cues)
      VALUES (@name, @category, @default_sets, @default_reps, @thumbnail_path, @cues)
    `);
    const updateEx = db.prepare(`
      UPDATE exercise_library
      SET category = @category, default_sets = @default_sets, default_reps = @default_reps, cues = @cues
      WHERE id = @id
    `);

    const checkProto = db.prepare('SELECT id FROM pt_templates WHERE LOWER(name) = LOWER(?) LIMIT 1');
    const insertProto = db.prepare(`
      INSERT INTO pt_templates (name, category, duration_weeks, protocol_json)
      VALUES (@name, @category, @duration_weeks, @protocol_json)
    `);
    const updateProto = db.prepare(`
      UPDATE pt_templates
      SET category = @category, duration_weeks = @duration_weeks, protocol_json = @protocol_json
      WHERE id = @id
    `);

    const tx = db.transaction(() => {
      for (const ex of exercises) {
        if (!ex.name) continue;
        const existing = checkEx.get(ex.name);
        const payload = {
          id: existing?.id,
          name: ex.name,
          category: ex.category || 'General',
          default_sets: ex.default_sets || 3,
          default_reps: String(ex.default_reps || '10'),
          thumbnail_path: ex.thumbnail_path || null,
          cues: ex.cues || ''
        };
        if (existing) {
          updateEx.run(payload);
        } else {
          insertEx.run(payload);
        }
        exCount++;
      }

      for (const pr of protocols) {
        if (!pr.name) continue;
        const existing = checkProto.get(pr.name);
        const pJson = typeof pr.protocol_json === 'string' ? pr.protocol_json : JSON.stringify(pr.protocol_json || {});
        const payload = {
          id: existing?.id,
          name: pr.name,
          category: pr.category || 'Rehab',
          duration_weeks: pr.duration_weeks || 4,
          protocol_json: pJson
        };
        if (existing) {
          updateProto.run(payload);
        } else {
          insertProto.run(payload);
        }
        protoCount++;
      }
    });

    tx();
    return { exCount, protoCount };
  }
};

// ── Domain: Clinic Settings & Preferences (Phase 8) ────────────────────────
const settings = {
  getAll() {
    const rows = db.prepare('SELECT key, value FROM clinic_settings').all();
    const result = {};
    rows.forEach(r => { result[r.key] = r.value; });
    try {
      const row1 = db.prepare('SELECT clinic_name, logo_path FROM clinic_settings WHERE id = 1').get();
      if (row1) {
        if (row1.clinic_name !== undefined && !result.clinic_name) result.clinic_name = row1.clinic_name;
        if (row1.logo_path !== undefined) result.logo_path = row1.logo_path;
      }
    } catch (_) {}
    return result;
  },

  get(key) {
    if (key === 'logo_path') {
      try {
        const row1 = db.prepare('SELECT logo_path FROM clinic_settings WHERE id = 1').get();
        if (row1 && row1.logo_path !== undefined) return row1.logo_path;
      } catch (_) {}
    }
    const row = db.prepare('SELECT value FROM clinic_settings WHERE key = ?').get(key);
    return row ? row.value : null;
  },

  set(key, value) {
    const res = db.prepare(`
      INSERT INTO clinic_settings (key, value) VALUES (?, ?)
      ON CONFLICT(key) DO UPDATE SET value = excluded.value
    `).run(key, String(value || ''));

    if (key === 'logo_path') {
      try {
        db.prepare('UPDATE clinic_settings SET logo_path = ? WHERE id = 1').run(value || null);
      } catch (_) {}
    } else if (key === 'clinic_name') {
      try {
        db.prepare('UPDATE clinic_settings SET clinic_name = ? WHERE id = 1').run(value || '');
      } catch (_) {}
    }
    return res;
  },

  setMultiple(obj) {
    const stmt = db.prepare(`
      INSERT INTO clinic_settings (key, value) VALUES (?, ?)
      ON CONFLICT(key) DO UPDATE SET value = excluded.value
    `);
    const tx = db.transaction((data) => {
      for (const [k, v] of Object.entries(data)) {
        if (v !== undefined && v !== null) {
          stmt.run(k, String(v));
          if (k === 'clinic_name') {
            try { db.prepare('UPDATE clinic_settings SET clinic_name = ? WHERE id = 1').run(String(v)); } catch (_) {}
          } else if (k === 'logo_path') {
            try { db.prepare('UPDATE clinic_settings SET logo_path = ? WHERE id = 1').run(v || null); } catch (_) {}
          }
        }
      }
    });
    tx(obj);
    return this.getAll();
  }
};

// ── Domain: Invoicing & Billing (Phase 8) ───────────────────────────────────
const invoices = {
  list(filter = {}) {
    let sql = `
      SELECT i.*, p.first_name, p.last_name, p.email, p.phone,
             (SELECT COUNT(*) FROM invoice_items WHERE invoice_id = i.id) as item_count
      FROM invoices i
      JOIN patients p ON i.patient_id = p.id
      WHERE 1=1
    `;
    const params = [];
    if (filter.status && filter.status !== 'All') {
      sql += ' AND i.status = ?';
      params.push(filter.status);
    }
    if (filter.search) {
      sql += ' AND (i.invoice_number LIKE ? OR p.first_name LIKE ? OR p.last_name LIKE ? OR (p.first_name || \' \' || p.last_name) LIKE ? OR i.notes LIKE ?)';
      const s = `%${filter.search}%`;
      params.push(s, s, s, s, s);
    }
    sql += ' ORDER BY i.id DESC';
    return db.prepare(sql).all(...params);
  },

  getById(id) {
    const inv = db.prepare(`
      SELECT i.*, p.first_name, p.last_name, p.dob, p.email, p.phone, p.address
      FROM invoices i
      JOIN patients p ON i.patient_id = p.id
      WHERE i.id = ?
    `).get(Number(id));
    if (!inv) return null;
    inv.items = db.prepare('SELECT * FROM invoice_items WHERE invoice_id = ? ORDER BY id ASC').all(Number(id));
    return inv;
  },

  create(data) {
    const tx = db.transaction(() => {
      const year = new Date().getFullYear();
      let invNum = data.invoice_number;
      if (!invNum) {
        const countRow = db.prepare("SELECT COUNT(*) as c FROM invoices WHERE invoice_number LIKE ?").get(`INV-${year}-%`);
        const nextNum = (countRow?.c || 0) + 1;
        invNum = `INV-${year}-${String(nextNum).padStart(3, '0')}`;
      }

      const info = db.prepare(`
        INSERT INTO invoices (
          invoice_number, patient_id, issue_date, due_date, status,
          subtotal, tax_rate, tax_amount, total, payment_method, notes
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        invNum,
        Number(data.patient_id),
        data.issue_date || new Date().toISOString().slice(0, 10),
        data.due_date || new Date(Date.now() + 14 * 86400000).toISOString().slice(0, 10),
        data.status || 'Pending',
        Number(data.subtotal) || 0,
        Number(data.tax_rate) !== undefined ? Number(data.tax_rate) : 10,
        Number(data.tax_amount) || 0,
        Number(data.total) || 0,
        data.payment_method || 'Credit/Debit Card',
        data.notes || null
      );

      const invoiceId = info.lastInsertRowid;
      if (Array.isArray(data.items) && data.items.length > 0) {
        const itemStmt = db.prepare(`
          INSERT INTO invoice_items (invoice_id, description, quantity, unit_price, total)
          VALUES (?, ?, ?, ?, ?)
        `);
        for (const it of data.items) {
          const qty = Number(it.quantity) || 1;
          const up = Number(it.unit_price) || 0;
          const tot = it.total !== undefined ? Number(it.total) : (qty * up);
          itemStmt.run(invoiceId, it.description || 'Clinical Service', qty, up, tot);
        }
      }
      return invoiceId;
    });

    const newId = tx();
    return this.getById(newId);
  },

  update(id, data) {
    const fields = ['status', 'payment_method', 'notes', 'due_date'];
    const sets = [];
    const vals = [];
    fields.forEach(f => {
      if (data[f] !== undefined) {
        sets.push(`${f} = ?`);
        vals.push(data[f]);
      }
    });
    if (sets.length > 0) {
      sets.push("updated_at = strftime('%Y-%m-%dT%H:%M:%fZ', 'now')");
      vals.push(Number(id));
      db.prepare(`UPDATE invoices SET ${sets.join(', ')} WHERE id = ?`).run(...vals);
    }
    return this.getById(Number(id));
  },

  delete(id) {
    return db.prepare('DELETE FROM invoices WHERE id = ?').run(Number(id));
  },

  getStats() {
    const row = db.prepare(`
      SELECT
        COUNT(*) as total_count,
        COALESCE(SUM(total), 0) as total_invoiced,
        COALESCE(SUM(CASE WHEN status = 'Paid' THEN total ELSE 0 END), 0) as total_paid,
        COALESCE(SUM(CASE WHEN status = 'Pending' AND date(due_date) >= date('now') THEN total ELSE 0 END), 0) as total_pending,
        COALESCE(SUM(CASE WHEN status = 'Overdue' OR (status = 'Pending' AND date(due_date) < date('now')) THEN total ELSE 0 END), 0) as total_overdue
      FROM invoices
    `).get();
    return row;
  }
};

// ── Seed Sample Invoices (Phase 8) ─────────────────────────────────────────
try {
  const invCount = db.prepare('SELECT COUNT(*) as count FROM invoices').get();
  const firstPatient = db.prepare('SELECT id FROM patients LIMIT 1').get();
  if ((!invCount || invCount.count === 0) && firstPatient) {
    const pId = firstPatient.id;
    const inv1 = invoices.create({
      invoice_number: 'INV-2026-001',
      patient_id: pId,
      issue_date: '2026-10-10',
      due_date: '2026-10-24',
      status: 'Paid',
      subtotal: 140.00,
      tax_rate: 10.0,
      tax_amount: 14.00,
      total: 154.00,
      payment_method: 'Credit/Debit Card',
      notes: 'Initial MSK consultation and rehabilitation program onboarding.',
      items: [
        { description: 'Initial Comprehensive MSK Assessment (60 min)', quantity: 1, unit_price: 140.00, total: 140.00 }
      ]
    });
    const inv2 = invoices.create({
      invoice_number: 'INV-2026-002',
      patient_id: pId,
      issue_date: '2026-10-18',
      due_date: '2026-11-01',
      status: 'Pending',
      subtotal: 120.00,
      tax_rate: 10.0,
      tax_amount: 12.00,
      total: 132.00,
      payment_method: 'Private Health Insurance / HICAPS',
      notes: 'Follow-up manual therapy and dry needling.',
      items: [
        { description: 'Subsequent Treatment Consultation (30 min)', quantity: 1, unit_price: 95.00, total: 95.00 },
        { description: 'Dry Needling Consumables & Modality', quantity: 1, unit_price: 25.00, total: 25.00 }
      ]
    });
    const inv3 = invoices.create({
      invoice_number: 'INV-2026-003',
      patient_id: pId,
      issue_date: '2026-09-20',
      due_date: '2026-10-04',
      status: 'Overdue',
      subtotal: 180.00,
      tax_rate: 10.0,
      tax_amount: 18.00,
      total: 198.00,
      payment_method: 'Electronic Funds Transfer',
      notes: 'Biomechanical gait analysis & video assessment.',
      items: [
        { description: 'Biomechanical Video Gait Analysis', quantity: 1, unit_price: 180.00, total: 180.00 }
      ]
    });
    console.log('[DB] Seeded 3 sample invoices.');
  }
} catch (invErr) {
  console.warn('[DB] Invoices seed warning:', invErr.message);
}

// ── Research Papers Module ────────────────────────────────────────────────
const researchPapers = {
  getAll({ group, search, favoriteOnly, sortBy } = {}) {
    let sql = 'SELECT * FROM research_papers WHERE 1=1';
    const params = [];

    if (group && group !== 'All') {
      sql += ' AND group_tag = ?';
      params.push(group);
    }

    if (favoriteOnly) {
      sql += ' AND is_favorite = 1';
    }

    if (search && search.trim()) {
      const q = `%${search.trim()}%`;
      sql += ' AND (title LIKE ? OR authors LIKE ? OR group_tag LIKE ? OR notes LIKE ?)';
      params.push(q, q, q, q);
    }

    switch (sortBy) {
      case 'date_uploaded_asc':
        sql += ' ORDER BY date_uploaded ASC';
        break;
      case 'pub_year_desc':
        sql += ' ORDER BY publication_date DESC, id DESC';
        break;
      case 'pub_year_asc':
        sql += ' ORDER BY publication_date ASC, id ASC';
        break;
      case 'title_asc':
        sql += ' ORDER BY title COLLATE NOCASE ASC';
        break;
      case 'title_desc':
        sql += ' ORDER BY title COLLATE NOCASE DESC';
        break;
      case 'authors_asc':
        sql += ' ORDER BY authors COLLATE NOCASE ASC';
        break;
      case 'date_uploaded_desc':
      default:
        sql += ' ORDER BY date_uploaded DESC, id DESC';
        break;
    }

    return db.prepare(sql).all(...params);
  },

  getById(id) {
    return db.prepare('SELECT * FROM research_papers WHERE id = ?').get(Number(id));
  },

  create(data) {
    const info = db.prepare(`
      INSERT INTO research_papers (title, authors, publication_date, group_tag, file_path, thumbnail_path, is_favorite, notes)
      VALUES (@title, @authors, @publication_date, @group_tag, @file_path, @thumbnail_path, @is_favorite, @notes)
    `).run({
      title: data.title,
      authors: data.authors || null,
      publication_date: data.publication_date || null,
      group_tag: data.group_tag || 'General',
      file_path: data.file_path,
      thumbnail_path: data.thumbnail_path || null,
      is_favorite: data.is_favorite ? 1 : 0,
      notes: data.notes || null,
    });
    return this.getById(info.lastInsertRowid);
  },

  update(id, data) {
    const ALLOWED = ['title', 'authors', 'publication_date', 'group_tag', 'file_path', 'thumbnail_path', 'is_favorite', 'notes'];
    const sets = [];
    const values = [];
    ALLOWED.forEach(k => {
      if (Object.prototype.hasOwnProperty.call(data, k)) {
        sets.push(`${k} = ?`);
        values.push(data[k]);
      }
    });
    if (!sets.length) return this.getById(id);
    db.prepare(`UPDATE research_papers SET ${sets.join(', ')} WHERE id = ?`).run([...values, Number(id)]);
    return this.getById(id);
  },

  toggleFavorite(id) {
    db.prepare('UPDATE research_papers SET is_favorite = CASE WHEN is_favorite = 1 THEN 0 ELSE 1 END WHERE id = ?').run(Number(id));
    return this.getById(id);
  },

  setFavorite(id, isFav) {
    db.prepare('UPDATE research_papers SET is_favorite = ? WHERE id = ?').run(isFav ? 1 : 0, Number(id));
    return this.getById(id);
  },

  delete(id) {
    const paper = this.getById(id);
    db.prepare('DELETE FROM research_papers WHERE id = ?').run(Number(id));
    return paper;
  },

  getFavoriteCount() {
    const row = db.prepare('SELECT COUNT(*) AS favCount FROM research_papers WHERE is_favorite = 1').get();
    return row?.favCount || 0;
  },

  getCounts() {
    const row = db.prepare(`
      SELECT 
        COUNT(*) AS totalCount,
        COALESCE(SUM(CASE WHEN is_favorite = 1 THEN 1 ELSE 0 END), 0) AS favCount
      FROM research_papers
    `).get();
    return {
      total: row?.totalCount || 0,
      favorites: row?.favCount || 0
    };
  },

  getGroups() {
    const fromPapers = db.prepare("SELECT DISTINCT group_tag AS name FROM research_papers WHERE group_tag IS NOT NULL AND trim(group_tag) != ''").all().map(r => r.name);
    let fromGroups = [];
    try {
      fromGroups = db.prepare("SELECT name FROM research_groups ORDER BY name ASC").all().map(r => r.name);
    } catch (_) {}
    const defaultList = ['Spine / Lumbar', 'Knee / ACL', 'Shoulder', 'Tendon / Tendinopathy', 'Pain Science', 'S&C / Periodization', 'Hip & Pelvis', 'Foot & Ankle', 'General / MSK'];
    const all = Array.from(new Set([...defaultList, ...fromPapers, ...fromGroups])).filter(Boolean).sort();
    return all;
  },

  addGroup(name) {
    const clean = (name || '').trim();
    if (!clean) return this.getGroups();
    try {
      db.prepare("INSERT OR IGNORE INTO research_groups (name) VALUES (?)").run(clean);
    } catch (_) {}
    return this.getGroups();
  },

  exportBackup() {
    const papers = db.prepare('SELECT title, authors, publication_date, date_uploaded, group_tag, file_path, thumbnail_path, is_favorite, notes FROM research_papers ORDER BY id ASC').all();
    const groups = this.getGroups();
    return {
      exported_at: new Date().toISOString(),
      app_version: '1.0.0',
      groups,
      papers
    };
  },

  importBackup(backupData) {
    const papers = backupData?.papers || [];
    const groups = backupData?.groups || [];
    if (!Array.isArray(papers)) {
      throw new Error('Invalid backup format: missing papers array.');
    }
    let paperCount = 0;
    const checkPaper = db.prepare('SELECT id FROM research_papers WHERE LOWER(title) = LOWER(?) LIMIT 1');
    const insertPaper = db.prepare(`
      INSERT INTO research_papers (title, authors, publication_date, group_tag, file_path, thumbnail_path, is_favorite, notes)
      VALUES (@title, @authors, @publication_date, @group_tag, @file_path, @thumbnail_path, @is_favorite, @notes)
    `);
    const updatePaper = db.prepare(`
      UPDATE research_papers
      SET authors = @authors, publication_date = @publication_date, group_tag = @group_tag,
          thumbnail_path = COALESCE(@thumbnail_path, thumbnail_path), is_favorite = @is_favorite, notes = @notes
      WHERE id = @id
    `);

    const tx = db.transaction(() => {
      if (Array.isArray(groups)) {
        for (const g of groups) {
          if (typeof g === 'string' && g.trim()) {
            this.addGroup(g.trim());
          }
        }
      }

      for (const p of papers) {
        if (!p.title) continue;
        const existing = checkPaper.get(p.title);
        const payload = {
          id: existing?.id,
          title: p.title,
          authors: p.authors || null,
          publication_date: p.publication_date || null,
          group_tag: p.group_tag || 'General / MSK',
          file_path: p.file_path || 'internal://imported',
          thumbnail_path: p.thumbnail_path || null,
          is_favorite: p.is_favorite ? 1 : 0,
          notes: p.notes || null
        };
        if (existing) {
          updatePaper.run(payload);
        } else {
          insertPaper.run(payload);
        }
        paperCount++;
      }
    });

    tx();
    return { paperCount };
  }
};

// Purge any benchmark research papers so library starts 100% empty for user uploads
try {
  db.prepare("DELETE FROM research_papers WHERE file_path LIKE 'internal://seeded%'").run();
} catch (err) {
  console.warn('[DB] Research papers cleanup error:', err.message);
}

// ── Domain: Legal Disclaimer & EULA Gateway ────────────────────────────────
const eula = {
  getStatus() {
    try {
      const row = db.prepare('SELECT eula_accepted, eula_accepted_timestamp, eula_signee FROM settings WHERE id = 1').get();
      return {
        accepted: row ? Boolean(row.eula_accepted) : false,
        timestamp: row ? row.eula_accepted_timestamp : null,
        signee: row ? row.eula_signee : null
      };
    } catch (_) {
      return { accepted: false, timestamp: null, signee: null };
    }
  },
  accept(signee) {
    const timestamp = new Date().toISOString();
    const cleanSignee = (signee || 'Licensed Clinician').trim();
    db.prepare(`
      INSERT INTO settings (id, eula_accepted, eula_accepted_timestamp, eula_signee)
      VALUES (1, 1, @timestamp, @signee)
      ON CONFLICT(id) DO UPDATE SET
        eula_accepted = 1,
        eula_accepted_timestamp = @timestamp,
        eula_signee = @signee
    `).run({ timestamp, signee: cleanSignee });
    return { success: true, timestamp, signee: cleanSignee };
  }
};

// ── Low-level helpers (kept for backward-compat with db:run/get/all IPC) ──
module.exports = {
  run(sql, params = []) { return db.prepare(sql).run(params); },
  get(sql, params = []) { return db.prepare(sql).get(params); },
  all(sql, params = []) { return db.prepare(sql).all(params); },
  raw: db,

  // Domain modules
  patients,
  appointments,
  notes,
  stats,
  smartPhrases,
  triggerCategories,
  rehab,
  exercises: rehab,
  settings,
  eula,
  invoices,
  researchPapers,

  // ── Diary domain ──────────────────────────────────────────────────────
  diary: {
    /**
     * Fetch all non-cancelled appointments whose scheduled_at falls within
     * [startISO, endISO), joined with patient names.
     */
    getEvents(startISO, endISO) {
      return db.prepare(`
        SELECT a.*,
               p.first_name, p.last_name
        FROM   appointments a
        LEFT   JOIN patients p ON a.patient_id = p.id
        WHERE  a.status != 'cancelled'
          AND  a.scheduled_at >= ?
          AND  a.scheduled_at <  ?
        ORDER  BY a.scheduled_at
      `).all(startISO, endISO);
    },

    /** Insert a new event row. Returns the full inserted row. */
    createEvent(data) {
      const isClin = data.is_clinical !== undefined
        ? Number(data.is_clinical)
        : (['clinical_np', 'clinical_fup', 'clinical_review'].includes(data.event_type) ? 1 : 0);
      const info = db.prepare(`
        INSERT INTO appointments
          (patient_id, event_type, title, scheduled_at, end_time,
           duration_min, is_recurring, status, type, notes, is_clinical)
        VALUES
          (@patient_id, @event_type, @title, @scheduled_at, @end_time,
           @duration_min, @is_recurring, @status, @type, @notes, @is_clinical)
      `).run({
        patient_id:   data.patient_id   ?? null,
        event_type:   data.event_type   ?? 'clinical_fup',
        title:        data.title        ?? null,
        scheduled_at: data.scheduled_at,
        end_time:     data.end_time     ?? null,
        duration_min: data.duration_min ?? 30,
        is_recurring: data.is_recurring ?? 0,
        status:       data.status       ?? 'scheduled',
        type:         data.type         ?? data.event_type ?? 'clinical_fup',
        notes:        data.notes        ?? null,
        is_clinical:  isClin,
      });
      return db.prepare(`
        SELECT a.*, p.first_name, p.last_name
        FROM   appointments a
        LEFT   JOIN patients p ON a.patient_id = p.id
        WHERE  a.id = ?
      `).get(info.lastInsertRowid);
    },

    /** Partial update — only touches the supplied fields. */
    updateEvent(id, data) {
      const ALLOWED = [
        'patient_id','event_type','title','scheduled_at','end_time',
        'duration_min','is_recurring','status','type','notes','is_clinical',
      ];
      const sets   = [];
      const values = [];
      ALLOWED.forEach(k => {
        if (Object.prototype.hasOwnProperty.call(data, k)) {
          sets.push(`${k} = ?`);
          values.push(data[k] ?? null);
        }
      });
      if (!sets.length) return { changes: 0 };
      sets.push(`updated_at = strftime('%Y-%m-%dT%H:%M:%fZ','now')`);
      return db.prepare(
        `UPDATE appointments SET ${sets.join(', ')} WHERE id = ?`
      ).run([...values, id]);
    },

    /** Soft-cancel (not a hard delete so history is preserved). */
    deleteEvent(id) {
      return db.prepare(`
        UPDATE appointments
        SET    status     = 'cancelled',
               updated_at = strftime('%Y-%m-%dT%H:%M:%fZ','now')
        WHERE  id = ?
      `).run(id);
    },
  },
};
