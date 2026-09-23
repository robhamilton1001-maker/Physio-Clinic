const Database = require('better-sqlite3');
const path = require('node:path');

// Store db in the same directory as the app data would go ideally,
// for local dev we'll put it in the project root
const dbPath = path.join(__dirname, '..', 'physio_clinic.db');
const db = new Database(dbPath);

db.pragma('journal_mode = WAL');

// Initialize schema
function initSchema() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS patients (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      first_name TEXT NOT NULL,
      last_name TEXT NOT NULL,
      email TEXT,
      phone TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS appointments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      patient_id INTEGER,
      appointment_date TEXT NOT NULL,
      start_time TEXT NOT NULL,
      end_time TEXT NOT NULL,
      notes TEXT,
      FOREIGN KEY(patient_id) REFERENCES patients(id)
    );

    CREATE TABLE IF NOT EXISTS clinical_notes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      patient_id INTEGER,
      content TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      locked BOOLEAN DEFAULT 0,
      FOREIGN KEY(patient_id) REFERENCES patients(id)
    );

    CREATE TABLE IF NOT EXISTS addendums (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      note_id INTEGER,
      content TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(note_id) REFERENCES clinical_notes(id)
    );

    CREATE TABLE IF NOT EXISTS pt_program_templates (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      program_data TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS patient_programs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      patient_id INTEGER,
      program_data TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(patient_id) REFERENCES patients(id)
    );

    CREATE TABLE IF NOT EXISTS invoices (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      patient_id INTEGER,
      date TEXT NOT NULL,
      amount REAL NOT NULL,
      status TEXT DEFAULT 'pending',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(patient_id) REFERENCES patients(id)
    );

    CREATE TABLE IF NOT EXISTS auto_text_templates (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      shortcut TEXT NOT NULL UNIQUE,
      content TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS clinic_settings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      clinic_name TEXT,
      tax_rate REAL,
      default_service_price REAL,
      logo_path TEXT
    );
  `);

  // Insert default settings if none exist
  const settingsCount = db.prepare('SELECT COUNT(*) as count FROM clinic_settings').get().count;
  if (settingsCount === 0) {
    db.prepare('INSERT INTO clinic_settings (clinic_name, tax_rate, default_service_price) VALUES (?, ?, ?)').run('My Physio Clinic', 0, 100);
  }
}

initSchema();

module.exports = {
  // Patients
  createPatient: (patient) => {
    const stmt = db.prepare('INSERT INTO patients (first_name, last_name, email, phone) VALUES (?, ?, ?, ?)');
    const info = stmt.run(patient.first_name, patient.last_name, patient.email, patient.phone);
    return info.lastInsertRowid;
  },
  getPatients: () => {
    return db.prepare('SELECT * FROM patients ORDER BY last_name, first_name').all();
  },
  searchPatients: (query) => {
    const searchTerm = `%${query}%`;
    return db.prepare('SELECT * FROM patients WHERE first_name LIKE ? OR last_name LIKE ?').all(searchTerm, searchTerm);
  },

  // Appointments
  createAppointment: (appointment) => {
    const stmt = db.prepare('INSERT INTO appointments (patient_id, appointment_date, start_time, end_time, notes) VALUES (?, ?, ?, ?, ?)');
    const info = stmt.run(appointment.patient_id, appointment.appointment_date, appointment.start_time, appointment.end_time, appointment.notes);
    return info.lastInsertRowid;
  },
  getAppointmentsByDate: (date) => {
    return db.prepare('SELECT a.*, p.first_name, p.last_name FROM appointments a LEFT JOIN patients p ON a.patient_id = p.id WHERE a.appointment_date = ? ORDER BY a.start_time').all(date);
  },

  // Clinical Notes
  createNote: (note) => {
    const stmt = db.prepare('INSERT INTO clinical_notes (patient_id, content) VALUES (?, ?)');
    const info = stmt.run(note.patient_id, note.content);
    return info.lastInsertRowid;
  },
  updateNote: (id, content) => {
    // Check if locked - rule enforcement in main.js/UI, but double check here dynamically
    const note = db.prepare('SELECT locked, created_at FROM clinical_notes WHERE id = ?').get(id);
    if (!note) throw new Error('Note not found.');

    const createdDate = new Date(note.created_at);
    const now = new Date();
    const hoursDiff = Math.abs(now - createdDate) / 36e5;

    if (note.locked || hoursDiff > 24) {
      if (!note.locked) {
          // Opportunistically update the flag if we catch it crossing the threshold
          db.prepare('UPDATE clinical_notes SET locked = 1 WHERE id = ?').run(id);
      }
      throw new Error('Note is older than 24 hours and is locked. Please use an addendum.');
    }

    const stmt = db.prepare('UPDATE clinical_notes SET content = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?');
    stmt.run(content, id);
    return true;
  },
  addAddendum: (addendum) => {
    const stmt = db.prepare('INSERT INTO addendums (note_id, content) VALUES (?, ?)');
    const info = stmt.run(addendum.note_id, addendum.content);
    return info.lastInsertRowid;
  },
  getNotesForPatient: (patientId) => {
    const notes = db.prepare('SELECT * FROM clinical_notes WHERE patient_id = ? ORDER BY created_at DESC').all(patientId);
    for (let note of notes) {
      note.addendums = db.prepare('SELECT * FROM addendums WHERE note_id = ? ORDER BY created_at ASC').all(note.id);

      // Check 24-hour lock rule on fetch
      const createdDate = new Date(note.created_at);
      const now = new Date();
      const hoursDiff = Math.abs(now - createdDate) / 36e5;

      if (hoursDiff > 24 && !note.locked) {
          db.prepare('UPDATE clinical_notes SET locked = 1 WHERE id = ?').run(note.id);
          note.locked = 1;
      }
    }
    return notes;
  },

  // PT Programs
  saveProgramTemplate: (template) => {
    const stmt = db.prepare('INSERT INTO pt_program_templates (name, program_data) VALUES (?, ?)');
    const info = stmt.run(template.name, JSON.stringify(template.program_data));
    return info.lastInsertRowid;
  },
  getProgramTemplates: () => {
    const templates = db.prepare('SELECT * FROM pt_program_templates ORDER BY name').all();
    return templates.map(t => ({...t, program_data: JSON.parse(t.program_data)}));
  },

  savePatientProgram: (patientId, programData) => {
    const stmt = db.prepare('INSERT INTO patient_programs (patient_id, program_data) VALUES (?, ?)');
    const info = stmt.run(patientId, JSON.stringify(programData));
    return info.lastInsertRowid;
  },

  getPatientPrograms: (patientId) => {
    const programs = db.prepare('SELECT * FROM patient_programs WHERE patient_id = ? ORDER BY created_at DESC').all(patientId);
    return programs.map(p => ({...p, program_data: JSON.parse(p.program_data)}));
  },

  // Invoices
  createInvoice: (invoice) => {
    const stmt = db.prepare('INSERT INTO invoices (patient_id, date, amount, status) VALUES (?, ?, ?, ?)');
    const info = stmt.run(invoice.patient_id, invoice.date, invoice.amount, invoice.status || 'pending');
    return info.lastInsertRowid;
  },
  getInvoicesForPatient: (patientId) => {
    return db.prepare('SELECT * FROM invoices WHERE patient_id = ? ORDER BY date DESC').all(patientId);
  },

  // Auto-Text
  getAutoTextTemplates: () => {
    return db.prepare('SELECT * FROM auto_text_templates').all();
  },
  createAutoTextTemplate: (template) => {
    const stmt = db.prepare('INSERT INTO auto_text_templates (shortcut, content) VALUES (?, ?)');
    const info = stmt.run(template.shortcut, template.content);
    return info.lastInsertRowid;
  },

  // Settings
  getSettings: () => {
    return db.prepare('SELECT * FROM clinic_settings LIMIT 1').get();
  },
  updateSettings: (settings) => {
    const stmt = db.prepare('UPDATE clinic_settings SET clinic_name = ?, tax_rate = ?, default_service_price = ?, logo_path = ? WHERE id = 1');
    stmt.run(settings.clinic_name, settings.tax_rate, settings.default_service_price, settings.logo_path);
    return true;
  }
};