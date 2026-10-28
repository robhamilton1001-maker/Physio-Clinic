'use strict';

const path = require('path');
const fs = require('fs');

/**
 * ══════════════════════════════════════════════════════════════════════════════
 *  SOLOPT — CLINICAL DATABASE SEEDING SUITE (seeds.js)
 *  Pre-populates a realistic 1-week clinical caseload, complete patient charts,
 *  SOAP notes, example rehabilitation protocol, and bundled research PDFs.
 * ══════════════════════════════════════════════════════════════════════════════
 */

function getMondayOfCurrentWeek(refDate = new Date()) {
  const d = new Date(refDate);
  const day = d.getDay(); // 0 is Sunday, 1 is Monday...
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  const monday = new Date(d.setDate(diff));
  monday.setHours(0, 0, 0, 0);
  return monday;
}

function formatIsoTime(mondayDate, dayOffset, hours, minutes) {
  const dt = new Date(mondayDate);
  dt.setDate(mondayDate.getDate() + dayOffset);
  dt.setHours(hours, minutes, 0, 0);
  return dt.toISOString();
}

function formatDateOnly(mondayDate, dayOffset) {
  const dt = new Date(mondayDate);
  dt.setDate(mondayDate.getDate() + dayOffset);
  return dt.toISOString().slice(0, 10);
}

function seedDatabase(db, options = {}) {
  const {
    force = false,
    userDataPath = path.join(process.env.APPDATA || process.env.HOME || '.', 'SoloPT'),
    assetsPath = path.join(__dirname, '../../assets/sample_papers')
  } = options;

  // ── Seeder Guard ──────────────────────────────────────────────────────────
  const countRow = db.prepare('SELECT COUNT(*) AS count FROM patients WHERE deleted_at IS NULL').get();
  const patientCount = countRow ? countRow.count : 0;
  const hasLegacyMock = db.prepare("SELECT id FROM patients WHERE first_name = 'Jom' AND last_name = 'Doughnut'").get();

  if (!force && patientCount > 0 && !hasLegacyMock) {
    console.log(`[Seeds] Existing clinical patients (${patientCount}) detected. Seeding skipped.`);
    return { seeded: false, reason: 'patients_exist' };
  }

  console.log('[Seeds] Initializing SoloPT comprehensive 1-week clinical demo dataset...');

  // If upgrading from legacy placeholder data, clean old mock test records
  if (hasLegacyMock) {
    try {
      db.prepare("DELETE FROM appointments WHERE patient_id IN (SELECT id FROM patients WHERE first_name IN ('Jon', 'Jom', 'Emma') AND national_id IN ('943 476 5919', '842 195 4421', '731 884 1092'))").run();
      db.prepare("DELETE FROM notes WHERE patient_id IN (SELECT id FROM patients WHERE first_name IN ('Jon', 'Jom', 'Emma'))").run();
      db.prepare("DELETE FROM clinical_notes WHERE patient_id IN (SELECT id FROM patients WHERE first_name IN ('Jon', 'Jom', 'Emma'))").run();
      db.prepare("DELETE FROM invoices WHERE invoice_number IN ('INV-2026-001', 'INV-2026-002', 'INV-2026-003', 'INV-2026-004')").run();
      db.prepare("DELETE FROM patients WHERE first_name IN ('Jon', 'Jom', 'Emma') AND national_id IN ('943 476 5919', '842 195 4421', '731 884 1092')").run();
    } catch (cleanErr) {
      console.warn('[Seeds] Legacy cleanup notice:', cleanErr.message);
    }
  }

  const tx = db.transaction(() => {

    // ── 1. Pre-Populated Patients (5 Realistic MSK Profiles) ────────────────
    const insertPatient = db.prepare(`
      INSERT OR REPLACE INTO patients (id, first_name, last_name, dob, phone, email, address, emergency_contact, primary_diagnosis, national_id, notes, created_at, updated_at)
      VALUES (@id, @first_name, @last_name, @dob, @phone, @email, @address, @emergency_contact, @primary_diagnosis, @national_id, @notes, @created_at, @updated_at)
    `);

    const patientsData = [
      {
        id: 1,
        first_name: 'Jon',
        last_name: 'Doe',
        dob: '1988-04-12',
        phone: '07700 900123',
        email: 'jon.doe@example.com',
        address: '14 Victoria Road, London',
        emergency_contact: 'David Doe (Brother) — 07700 900124',
        primary_diagnosis: 'Subacromial Shoulder Impingement / Rotator Cuff Tendinopathy',
        national_id: '943 476 5919',
        notes: 'Overhead gym loading aggravating right shoulder. Referred by GP for conservative physiotherapy management.',
        created_at: new Date(Date.now() - 14 * 86400000).toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: 2,
        first_name: 'Sarah',
        last_name: 'Jenkins',
        dob: '1995-09-24',
        phone: '07700 900456',
        email: 'sarah.j@example.com',
        address: '82 High Street, Manchester',
        emergency_contact: 'Mark Jenkins (Spouse) — 07700 900457',
        primary_diagnosis: 'Mid-portion Achilles Tendinopathy (Running overuse)',
        national_id: '842 195 4421',
        notes: 'Half-marathon training volume spike. Responding well to progressive Heavy Slow Resistance (HSR) loading.',
        created_at: new Date(Date.now() - 21 * 86400000).toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: 3,
        first_name: 'Marcus',
        last_name: 'Vance',
        dob: '1979-11-03',
        phone: '07700 900789',
        email: 'marcus.v@example.com',
        address: "45 St Mary's Road, Birmingham",
        emergency_contact: 'Elena Vance (Wife) — 07700 900790',
        primary_diagnosis: 'Acute L5/S1 Lumbar Radiculopathy / Disc Herniation',
        national_id: '619 382 7104',
        notes: 'Acute onset lower back and right S1 dermatomal pain following deadlifting. CES red flags negative.',
        created_at: new Date(Date.now() - 7 * 86400000).toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: 4,
        first_name: 'Emma',
        last_name: 'Watson-Reid',
        dob: '2002-06-18',
        phone: '07700 900321',
        email: 'emma.wr@example.com',
        address: '12 College Close, Cambridge',
        emergency_contact: 'Fiona Watson-Reid (Mother) — 07700 900322',
        primary_diagnosis: 'Right Anterior Cruciate Ligament (ACL) Reconstruction (Month 4 Return-to-Sport Rehab)',
        national_id: '731 884 1092',
        notes: 'Hamstring autograft ACL-R. In Phase 2 hypertrophy, neuromuscular control, and linear running re-introduction.',
        created_at: new Date(Date.now() - 60 * 86400000).toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: 5,
        first_name: 'David',
        last_name: 'Miller',
        dob: '1964-01-15',
        phone: '07700 900654',
        email: 'dmiller@example.com',
        address: '7 The Oaks, Bath',
        emergency_contact: 'Susan Miller (Wife) — 07700 900655',
        primary_diagnosis: 'Bilateral Knee Osteoarthritis (Conservative Management)',
        national_id: '528 940 3317',
        notes: 'Longstanding bilateral medial compartment knee pain. Focus on quadriceps strengthening and low-impact conditioning.',
        created_at: new Date(Date.now() - 30 * 86400000).toISOString(),
        updated_at: new Date().toISOString()
      }
    ];

    for (const pat of patientsData) {
      insertPatient.run(pat);
    }
    console.log(`[Seeds] Seeded ${patientsData.length} patient demographic profiles.`);

    // ── 2. Completed Clinical SOAP Notes (Patient History Charting) ─────────
    const insertSoap = db.prepare(`
      INSERT INTO clinical_notes (patient_id, appointment_id, subjective, objective, assessment, plan, created_at, updated_at)
      VALUES (@patient_id, @appointment_id, @subjective, @objective, @assessment, @plan, @created_at, @updated_at)
    `);

    const insertMedNote = db.prepare(`
      INSERT INTO notes (patient_id, content, created_at, updated_at, is_locked)
      VALUES (@patient_id, @content, @created_at, @updated_at, @is_locked)
    `);

    const soapNotes = [
      {
        patient_id: 1, // Jon Doe
        created_at: new Date(Date.now() - 7 * 86400000).toISOString(),
        subjective: '3-month history of anterolateral right shoulder pain, aggravated by overhead lifting and sleeping on right side. No history of acute trauma. Denies cervical radicular symptoms, numbness, or paresthesias.',
        objective: "Active shoulder abduction limited to 110° due to painful arc (70°–120°). Hawkins-Kennedy and Neer's impingement tests positive. Empty Can test reproduces concordant pain; external rotation strength Grade 4/5. Cervical spine screening clear.",
        assessment: 'Subacromial shoulder impingement / reactive supraspinatus tendinopathy secondary to overhead loading spike.',
        plan: 'Rotator cuff isometric loading, scapular upward rotation drills, load management for gym bench/press work. Review in 10 days.',
        title: 'Initial Comprehensive MSK Assessment'
      },
      {
        patient_id: 2, // Sarah Jenkins
        created_at: new Date(Date.now() - 2 * 86400000).toISOString(),
        subjective: 'Morning stiffness down from 30 minutes to under 10 minutes. Minimal pain during day-to-day walking, mild tenderness post-5km jog.',
        objective: 'Tenderness to palpation 3cm proximal to calcaneal insertion localized to mid-portion. Single-leg heel raise: 25 reps bilaterally with symmetrical control. Hop test asymptomatic.',
        assessment: 'Resolving mid-portion Achilles tendinopathy demonstrating positive mechanical adaptation to progressive isometric and heavy slow resistance (HSR) loading.',
        plan: 'Progress straight into Phase 2 plyometric integration and return-to-speed drills. Continue calf seated/standing HSR 3x weekly.',
        title: 'Follow-Up Rehabilitation Consultation'
      },
      {
        patient_id: 3, // Marcus Vance
        created_at: new Date(Date.now() - 5 * 86400000).toISOString(),
        subjective: 'Acute onset sharp right gluteal and posterior thigh pain radiating down to lateral foot following deadlifting. Aggravated by prolonged sitting and spinal flexion. Bowel/bladder function normal, no saddle numbness.',
        objective: 'Straight Leg Raise (SLR) positive on right at 35° reproducing concordant shooting pain. Slump test positive right. S1 reflex diminished right compared to left. Lumbar extension tolerated with directional preference centralization.',
        assessment: 'Acute L5/S1 disc herniation with right S1 radiculopathy and positive directional preference into lumbar extension. Cauda Equina Syndrome screened negative.',
        plan: 'Repeated prone lumbar extensions (McKenzie protocol) 10 reps every 2 hours. Activity pacing, avoid prolonged slouched sitting. GP analgesia optimization. Review in 5 days.',
        title: 'Initial Spinal Triage & Directional Preference'
      },
      {
        patient_id: 4, // Emma Watson-Reid
        created_at: new Date(Date.now() - 4 * 86400000).toISOString(),
        subjective: 'Month 4 post-op right ACL reconstruction (hamstring autograft). Reports zero joint effusion following gym sessions. Keen to begin return-to-running progression.',
        objective: 'Knee extension: 0° symmetrical. Knee flexion: 135° symmetrical. Quadriceps limb symmetry index (LSI) on hand-held dynamometry: 86%. Y-Balance test anterior reach within 4cm symmetry.',
        assessment: 'Right ACL reconstruction progressing on track through Month 4 criteria. Ready for straight-line treadmill running onboarding and Phase 2 progressive loading.',
        plan: 'Commence 70/30 walk-to-jog protocol. Continue progressive barbell RDLs, Spanish squats, and single-leg press. Review in 14 days.',
        title: 'Phase 2 S&C Return-to-Sport Review'
      },
      {
        patient_id: 5, // David Miller
        created_at: new Date(Date.now() - 3 * 86400000).toISOString(),
        subjective: 'Gradual bilateral knee stiffness and medial joint line achiness over the past 6 months, worse after prolonged standing and descending stairs. Morning stiffness resolves in 15 minutes.',
        objective: 'Bilateral medial knee joint line tenderness. Knee flexion 120° bilateral with mild crepitus. Quadriceps strength 4+/5 bilateral. Ligamentous stability intact. Functional 30-second sit-to-stand: 12 reps.',
        assessment: 'Bilateral medial compartment knee osteoarthritis, mild-to-moderate functional impairment. Good candidate for progressive neuromuscular exercise prescription.',
        plan: 'Prescribe non-impact stationary cycling and closed-chain quadriceps strengthening (wall sits, step-ups). Weight management and pacing education. Review in 3 weeks.',
        title: 'Initial Knee OA Assessment & Exercise Prescription'
      }
    ];

    for (const note of soapNotes) {
      insertSoap.run({
        patient_id: note.patient_id,
        appointment_id: null,
        subjective: note.subjective,
        objective: note.objective,
        assessment: note.assessment,
        plan: note.plan,
        created_at: note.created_at,
        updated_at: note.created_at
      });

      const formattedContent = `### ${note.title}

**Subjective:**
${note.subjective}

**Objective:**
${note.objective}

**Assessment:**
${note.assessment}

**Plan:**
${note.plan}

<div class="mt-4 pt-2 border-t border-slate-300 dark:border-slate-700 text-xs text-slate-500 dark:text-slate-400 font-mono italic">Electronically Signed by: SoloPT Lead Physiotherapist | SoloPT Clinic | Recorded: ${new Date(note.created_at).toLocaleDateString('en-GB')}</div>`;

      insertMedNote.run({
        patient_id: note.patient_id,
        content: formattedContent,
        created_at: note.created_at,
        updated_at: note.created_at,
        is_locked: 1
      });
    }
    console.log(`[Seeds] Seeded ${soapNotes.length} completed SOAP clinical notes.`);

    // ── 3. Loaded 1-Week Diary Schedule (Realistic Clinical Caseload) ─────────
    const monday = getMondayOfCurrentWeek();
    const insertAppt = db.prepare(`
      INSERT INTO appointments (patient_id, scheduled_at, duration_min, type, status, room, therapist, notes, event_type, title, end_time, is_clinical, created_at, updated_at)
      VALUES (@patient_id, @scheduled_at, @duration_min, @type, @status, @room, @therapist, @notes, @event_type, @title, @end_time, @is_clinical, @created_at, @updated_at)
    `);

    // 11 realistic appointments across Monday – Saturday (offset 0 to 5)
    // Non-overlapping with 12:30 - 13:30 daily lunch break block
    const appts = [
      // Monday (dayOffset 0)
      {
        dayOffset: 0, hours: 9, minutes: 0, duration: 60,
        patient_id: 1, type: 'Initial Comprehensive Consultation', event_type: 'clinical_np',
        status: 'Completed', notes: 'Initial shoulder assessment & isometric loading setup'
      },
      {
        dayOffset: 0, hours: 11, minutes: 0, duration: 45,
        patient_id: 2, type: 'Follow-up Rehabilitation & Manual Therapy', event_type: 'clinical_fup',
        status: 'Completed', notes: 'Achilles tendon loading review and shockwave'
      },
      {
        dayOffset: 0, hours: 14, minutes: 30, duration: 60,
        patient_id: 3, type: 'Initial Comprehensive Consultation', event_type: 'clinical_np',
        status: 'Completed', notes: 'Lumbar spine radiculopathy triage and directional preference'
      },

      // Tuesday (dayOffset 1)
      {
        dayOffset: 1, hours: 10, minutes: 0, duration: 45,
        patient_id: 4, type: 'Follow-up Rehabilitation & Manual Therapy', event_type: 'clinical_fup',
        status: 'Attended', notes: 'ACL Month 4 strength benchmark test'
      },
      {
        dayOffset: 1, hours: 14, minutes: 0, duration: 60,
        patient_id: 5, type: 'Initial Comprehensive Consultation', event_type: 'clinical_np',
        status: 'Attended', notes: 'Knee OA baseline assessment & exercise prescription'
      },

      // Wednesday (dayOffset 2)
      {
        dayOffset: 2, hours: 9, minutes: 30, duration: 60,
        patient_id: 2, type: 'Return to Running Biomechanical Assessment', event_type: 'clinical_review',
        status: 'Attended', notes: 'Treadmill video gait analysis and strike pattern'
      },
      {
        dayOffset: 2, hours: 11, minutes: 0, duration: 30,
        patient_id: 1, type: 'Follow-up Rehabilitation & Manual Therapy', event_type: 'clinical_fup',
        status: 'Attended', notes: 'Rotator cuff progression & scapular motor control'
      },

      // Thursday (dayOffset 3)
      {
        dayOffset: 3, hours: 10, minutes: 30, duration: 45,
        patient_id: 3, type: 'Follow-up Rehabilitation & Manual Therapy', event_type: 'clinical_fup',
        status: 'Confirmed', notes: 'Spinal mobilization and McKenzie progression'
      },
      {
        dayOffset: 3, hours: 15, minutes: 0, duration: 60,
        patient_id: 4, type: 'Return to Running Biomechanical Assessment', event_type: 'clinical_review',
        status: 'Confirmed', notes: 'Straight-line running readiness on track'
      },

      // Friday (dayOffset 4)
      {
        dayOffset: 4, hours: 9, minutes: 0, duration: 45,
        patient_id: 5, type: 'Follow-up Rehabilitation & Manual Therapy', event_type: 'clinical_fup',
        status: 'Confirmed', notes: 'Knee functional capacity review and progression'
      },
      {
        dayOffset: 4, hours: 14, minutes: 0, duration: 60,
        patient_id: 1, type: 'Follow-up Rehabilitation & Manual Therapy', event_type: 'clinical_fup',
        status: 'Confirmed', notes: 'Subsequent strength review'
      },

      // Saturday (dayOffset 5)
      {
        dayOffset: 5, hours: 10, minutes: 0, duration: 45,
        patient_id: 2, type: 'Follow-up Rehabilitation & Manual Therapy', event_type: 'clinical_fup',
        status: 'Confirmed', notes: 'End-of-week calf capacity test'
      }
    ];

    for (const ap of appts) {
      const scheduledAt = formatIsoTime(monday, ap.dayOffset, ap.hours, ap.minutes);
      const endTime = formatIsoTime(monday, ap.dayOffset, ap.hours, ap.minutes + ap.duration);
      insertAppt.run({
        patient_id: ap.patient_id,
        scheduled_at: scheduledAt,
        duration_min: ap.duration,
        type: ap.type,
        status: ap.status,
        room: 'Room 1',
        therapist: 'Lead Physiotherapist',
        notes: ap.notes,
        event_type: ap.event_type,
        title: ap.type,
        end_time: endTime,
        is_clinical: 1,
        created_at: new Date(Date.now() - 3 * 86400000).toISOString(),
        updated_at: new Date().toISOString()
      });
    }
    console.log(`[Seeds] Seeded ${appts.length} appointments across current clinical week (${monday.toISOString().slice(0, 10)}).`);

    // ── 4. Invoicing & Billing Ledger (1-Week Cohort) ────────────────────────
    const insertInv = db.prepare(`
      INSERT OR REPLACE INTO invoices (id, invoice_number, patient_id, issue_date, due_date, status, subtotal, tax_rate, tax_amount, total, payment_method, notes, created_at, updated_at)
      VALUES (@id, @invoice_number, @patient_id, @issue_date, @due_date, @status, @subtotal, @tax_rate, @tax_amount, @total, @payment_method, @notes, @created_at, @updated_at)
    `);

    const insertInvItem = db.prepare(`
      INSERT INTO invoice_items (invoice_id, description, quantity, unit_price, total)
      VALUES (@invoice_id, @description, @quantity, @unit_price, @total)
    `);

    const invoicesData = [
      {
        id: 1,
        invoice_number: 'INV-2026-001',
        patient_id: 1, // Jon Doe
        issue_date: formatDateOnly(monday, 0),
        due_date: formatDateOnly(monday, 14),
        status: 'Paid',
        subtotal: 140.00,
        tax_rate: 0.0,
        tax_amount: 0.00,
        total: 140.00,
        payment_method: 'Credit/Debit Card',
        notes: 'Initial Assessment & Comprehensive Shoulder Consultation',
        items: [
          { description: 'Initial Comprehensive MSK Assessment (60 min)', quantity: 1, unit_price: 140.00, total: 140.00 }
        ]
      },
      {
        id: 2,
        invoice_number: 'INV-2026-002',
        patient_id: 2, // Sarah Jenkins
        issue_date: formatDateOnly(monday, 0),
        due_date: formatDateOnly(monday, 14),
        status: 'Paid',
        subtotal: 75.00,
        tax_rate: 0.0,
        tax_amount: 0.00,
        total: 75.00,
        payment_method: 'Bank Transfer',
        notes: 'Follow-up Rehab & Radial Shockwave Therapy',
        items: [
          { description: 'Follow-up Rehabilitation Consultation (30 min)', quantity: 1, unit_price: 50.00, total: 50.00 },
          { description: 'Radial Shockwave Therapy (ESWT) Modality', quantity: 1, unit_price: 25.00, total: 25.00 }
        ]
      },
      {
        id: 3,
        invoice_number: 'INV-2026-003',
        patient_id: 3, // Marcus Vance
        issue_date: formatDateOnly(monday, 1),
        due_date: formatDateOnly(monday, 8),
        status: 'Pending',
        subtotal: 132.00,
        tax_rate: 0.0,
        tax_amount: 0.00,
        total: 132.00,
        payment_method: 'Electronic Funds Transfer',
        notes: 'Follow-up & Spinal Mobilisation (Due within 7 days)',
        items: [
          { description: 'Follow-up Rehabilitation & Manual Therapy (45 min)', quantity: 1, unit_price: 95.00, total: 95.00 },
          { description: 'Spinal Traction & Mobilisation Adjunct', quantity: 1, unit_price: 37.00, total: 37.00 }
        ]
      },
      {
        id: 4,
        invoice_number: 'INV-2026-004',
        patient_id: 5, // David Miller
        issue_date: formatDateOnly(monday, -14),
        due_date: formatDateOnly(monday, -7),
        status: 'Overdue',
        subtotal: 75.00,
        tax_rate: 0.0,
        tax_amount: 0.00,
        total: 75.00,
        payment_method: 'Credit/Debit Card',
        notes: 'Knee OA Exercise Prescription & Guidance (Flagged follow-up)',
        items: [
          { description: 'Knee OA Exercise Prescription & Program Design', quantity: 1, unit_price: 75.00, total: 75.00 }
        ]
      }
    ];

    for (const inv of invoicesData) {
      insertInv.run({
        id: inv.id,
        invoice_number: inv.invoice_number,
        patient_id: inv.patient_id,
        issue_date: inv.issue_date,
        due_date: inv.due_date,
        status: inv.status,
        subtotal: inv.subtotal,
        tax_rate: inv.tax_rate,
        tax_amount: inv.tax_amount,
        total: inv.total,
        payment_method: inv.payment_method,
        notes: inv.notes,
        created_at: new Date(inv.issue_date).toISOString(),
        updated_at: new Date().toISOString()
      });

      for (const item of inv.items) {
        insertInvItem.run({
          invoice_id: inv.id,
          description: item.description,
          quantity: item.quantity,
          unit_price: item.unit_price,
          total: item.total
        });
      }
    }
    console.log(`[Seeds] Seeded ${invoicesData.length} itemized clinical invoices.`);

    // ── 5. Single Example Exercise Plan Template ────────────────────────────
    const sampleExercises = [
      {
        name: 'Barbell Romanian Deadlift (RDL)',
        category: 'Hamstring & Posterior Chain',
        default_sets: 3,
        default_reps: '8 @ RPE 7',
        cues: 'Soft knee bend, hinge through posterior chain, keep bar path tight to shins.'
      },
      {
        name: 'Spanish Squat Isometric Hold',
        category: 'Knee & Quad',
        default_sets: 4,
        default_reps: '45s hold',
        cues: 'Upright torso, shin vertical, drive knees outward into band tension.'
      },
      {
        name: 'Single-Leg Leg Press',
        category: 'Knee & Quad',
        default_sets: 3,
        default_reps: '10-12 reps',
        cues: '3-second eccentric tempo, controlled knee tracking over 2nd toe.'
      },
      {
        name: 'Drop Jump to Stick Landing',
        category: 'Plyometrics & RFD',
        default_sets: 3,
        default_reps: '6 reps',
        cues: 'Soft landing, quiet foot strike, avoid knee valgus.'
      }
    ];

    const insertEx = db.prepare(`
      INSERT OR IGNORE INTO exercise_library (name, category, default_sets, default_reps, thumbnail_path, cues)
      VALUES (@name, @category, @default_sets, @default_reps, NULL, @cues)
    `);

    for (const ex of sampleExercises) {
      insertEx.run(ex);
    }

    // Build 12-week protocol weeks array
    const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const weeksArray = [];
    for (let w = 1; w <= 12; w++) {
      const daysObj = {};
      DAYS.forEach(d => { daysObj[d] = []; });

      // Prescribe movements on Mon, Wed, Fri
      ['Mon', 'Wed', 'Fri'].forEach(d => {
        daysObj[d] = [
          {
            name: 'Barbell Romanian Deadlift (RDL)',
            sets: 3,
            reps: '8 @ RPE 7',
            weight_kg: 'RPE 7',
            hold_sec: '—',
            cues: 'Soft knee bend, hinge through posterior chain, keep bar path tight to shins.'
          },
          {
            name: 'Spanish Squat Isometric Hold',
            sets: 4,
            reps: '45s hold',
            weight_kg: 'Heavy Loop Band',
            hold_sec: '45s',
            cues: 'Upright torso, shin vertical, drive knees outward into band tension.'
          },
          {
            name: 'Single-Leg Leg Press',
            sets: 3,
            reps: '10-12 reps',
            weight_kg: 'Moderate',
            hold_sec: '3s eccentric',
            cues: '3-second eccentric tempo, controlled knee tracking over 2nd toe.'
          },
          {
            name: 'Drop Jump to Stick Landing',
            sets: 3,
            reps: '6 reps',
            weight_kg: 'Bodyweight',
            hold_sec: '2s stick',
            cues: 'Soft landing, quiet foot strike, avoid knee valgus.'
          }
        ];
      });

      weeksArray.push({
        week_num: w,
        title: `Week ${w}`,
        focus: w <= 4 ? 'Phase 2A: Hypertrophy & Patellar Tendon Tolerance' : (w <= 8 ? 'Phase 2B: Unilateral Strength & Deceleration' : 'Phase 2C: Rate of Force Development & Hop Symmetry'),
        days: daysObj
      });
    }

    const templateName = '[EXAMPLE] 12-Week Post-Op ACL Reconstruction Protocol (Phase 2: Strength & Neuromuscular)';
    const protocolJson = JSON.stringify({
      title: templateName,
      category: 'Knee / Lower Limb',
      description: 'Official demonstration rehabilitation template for testing SoloPT program assignment and export workflows. Demonstrates progressive loading parameters, clinical cues, and target rep schemes.',
      duration_weeks: 12,
      weeks: weeksArray
    });

    db.prepare(`
      INSERT OR REPLACE INTO pt_templates (name, category, duration_weeks, protocol_json)
      VALUES (?, ?, ?, ?)
    `).run(templateName, 'Knee / Lower Limb', 12, protocolJson);

    // Assign to Patient 4 (Emma Watson-Reid, Month 4 ACL Rehab)
    db.prepare(`
      INSERT INTO pt_programs (patient_id, title, duration_weeks, schedule_json, created_at)
      VALUES (?, ?, ?, ?, ?)
    `).run(4, templateName, 12, protocolJson, new Date().toISOString());

    console.log('[Seeds] Seeded example 12-Week ACL Reconstruction protocol template and assigned to Emma Watson-Reid.');

    // ── 6. Bundled Research Library Papers ──────────────────────────────────
    const targetPapersDir = path.join(userDataPath, 'research_library');
    if (!fs.existsSync(targetPapersDir)) {
      fs.mkdirSync(targetPapersDir, { recursive: true });
    }

    // Seed research groups
    const insertGroup = db.prepare('INSERT OR IGNORE INTO research_groups (name) VALUES (?)');
    ['Tendinopathy', 'Knee / ACL', 'Spine', 'General / MSK'].forEach(g => insertGroup.run(g));

    // Research paper specifications
    const bundledPapers = [
      {
        filename: 'Cook_2016_Continuum_Model_Tendon_Pathology.pdf',
        title: 'Revisiting the continuum model of tendon pathology: what is its merit in clinical practice and research?',
        authors: 'Cook JL, Rio E, Purdam CR, Docking SI',
        publication_date: '2016',
        group_tag: 'Tendinopathy',
        is_favorite: 1,
        notes: 'Foundational load-management framework for staging reactive vs degenerative tendons.'
      },
      {
        filename: 'Buckthorpe_2019_Optimising_Return_To_Play_ACL.pdf',
        title: 'Optimising return to play after anterior cruciate ligament reconstruction: 10 critical criteria',
        authors: 'Buckthorpe M, Della Villa F, Della Villa S',
        publication_date: '2019',
        group_tag: 'Knee / ACL',
        is_favorite: 0,
        notes: 'Key objective return-to-sport metrics: limb symmetry index >90%, psychological readiness.'
      },
      {
        filename: 'OSullivan_2020_Cognitive_Functional_Therapy_LBP.pdf',
        title: 'Cognitive functional therapy for disabling low back pain: a multidimensional approach',
        authors: "O'Sullivan PB, Caneiro JP, O'Keeffe M, Smith V, Dankaerts W, Fersum K, O'Sullivan K",
        publication_date: '2020',
        group_tag: 'Spine',
        is_favorite: 1,
        notes: 'Multi-dimensional approach targeting movement avoidance, belief restructuring, and graded exposure.'
      }
    ];

    const insertPaper = db.prepare(`
      INSERT OR REPLACE INTO research_papers (title, authors, publication_date, group_tag, file_path, thumbnail_path, is_favorite, notes, date_uploaded)
      VALUES (@title, @authors, @publication_date, @group_tag, @file_path, @thumbnail_path, @is_favorite, @notes, @date_uploaded)
    `);

    for (const p of bundledPapers) {
      const sourceFile = path.join(assetsPath, p.filename);
      const destFile = path.join(targetPapersDir, p.filename);

      if (fs.existsSync(sourceFile)) {
        try {
          fs.copyFileSync(sourceFile, destFile);
        } catch (copyErr) {
          console.warn(`[Seeds] Could not copy paper PDF ${p.filename}:`, copyErr.message);
        }
      }

      insertPaper.run({
        title: p.title,
        authors: p.authors,
        publication_date: p.publication_date,
        group_tag: p.group_tag,
        file_path: fs.existsSync(destFile) ? destFile : sourceFile,
        thumbnail_path: null,
        is_favorite: p.is_favorite,
        notes: p.notes,
        date_uploaded: new Date().toISOString()
      });
    }
    console.log(`[Seeds] Seeded ${bundledPapers.length} bundled clinical research papers with local PDF linking.`);

  });

  tx();
  console.log('[Seeds] SoloPT demo dataset seeding completed successfully.');
  return { seeded: true };
}

module.exports = {
  seedDatabase,
  getMondayOfCurrentWeek
};
