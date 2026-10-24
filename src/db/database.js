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
      created_at        TEXT    NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
      updated_at        TEXT    NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
      deleted_at        TEXT                    -- NULL = active, set = soft-deleted
    );
  `);

  // Add emergency_contact to any existing DB that predates this column
  // (safe no-op if the column already exists — SQLite throws, we catch)
  try {
    db.exec(`ALTER TABLE patients ADD COLUMN emergency_contact TEXT;`);
  } catch (_) { /* column already exists — ignore */ }

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
  `);

  // -- Phase 3 columns (safe migrations for existing databases) ------------
  [
    `ALTER TABLE appointments ADD COLUMN event_type   TEXT    DEFAULT 'clinical_fup'`,
    `ALTER TABLE appointments ADD COLUMN title        TEXT`,
    `ALTER TABLE appointments ADD COLUMN end_time     TEXT`,
    `ALTER TABLE appointments ADD COLUMN is_recurring INTEGER DEFAULT 0`,
  ].forEach(sql => { try { db.exec(sql); } catch (_) { /* column exists */ } });

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
  // Check if #ROM-CERVICAL exists in DB and DASH has updated th-text
  const sampleAssessment = db.prepare("SELECT id FROM smart_phrases WHERE trigger_prefix = '#' AND code = 'ROM-CERVICAL' LIMIT 1").get();
  const sampleTh = db.prepare("SELECT content FROM smart_phrases WHERE trigger_prefix = '!' AND code = 'DASH' LIMIT 1").get();
  const needsReseed = !sampleAssessment || (sampleTh && !sampleTh.content.includes('th-text'));

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

// ── Prepared statements ───────────────────────────────────────────────────
// Pre-compiled once at startup for maximum performance on hot paths.

const stmts = {
  // Patients
  patientCreate: db.prepare(`
    INSERT INTO patients (first_name, last_name, dob, phone, email, emergency_contact, notes)
    VALUES (@first_name, @last_name, @dob, @phone, @email, @emergency_contact, @notes)
  `),

  patientSearch: db.prepare(`
    SELECT id, first_name, last_name, phone, email, dob, created_at
    FROM   patients
    WHERE  deleted_at IS NULL
      AND  (
            first_name        LIKE @q
         OR last_name         LIKE @q
         OR (first_name || ' ' || last_name) LIKE @q
         OR phone             LIKE @q
         OR email             LIKE @q
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
           emergency_contact = @emergency_contact,
           notes             = @notes,
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
    INSERT INTO appointments (patient_id, scheduled_at, duration_min, type, status, room, therapist, notes)
    VALUES (@patient_id, @scheduled_at, @duration_min, @type, @status, @room, @therapist, @notes)
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
    WHERE  date(scheduled_at) = ? AND status != 'cancelled'
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
      emergency_contact: (data.emergency_contact || '').trim() || null,
      notes:             (data.notes             || '').trim() || null,
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

  list()           { return stmts.patientList.all(); },
  update(id, data) { return stmts.patientUpdate.run({ ...data, id }); },
  delete(id)       { return stmts.patientSoftDelete.run(id); },
};

const appointments = {
  create(data) { return stmts.appointmentCreate.run(data); },
  getById(id)  { return stmts.appointmentById.get(id); },
  update(id, data) { return stmts.appointmentUpdate.run({ ...data, id }); },
  listByPatient(patientId) { return stmts.appointmentsByPatient.all(patientId); },
};

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
      const createdMs = new Date(note.created_at).getTime();
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
    const ageMs = now - new Date(note.created_at).getTime();
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

    const ageMs = Date.now() - new Date(note.created_at).getTime();
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
    return {
      totalPatients: stmts.countPatients.get().n,
      todayAppts:    stmts.countTodayAppts.get(todayISO).n,
      totalNotes:    stmts.countNotes.get().n,
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
      const info = db.prepare(`
        INSERT INTO appointments
          (patient_id, event_type, title, scheduled_at, end_time,
           duration_min, is_recurring, status, type, notes)
        VALUES
          (@patient_id, @event_type, @title, @scheduled_at, @end_time,
           @duration_min, @is_recurring, @status, @type, @notes)
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
        'duration_min','is_recurring','status','type','notes',
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
