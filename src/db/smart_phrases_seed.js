'use strict';

/**
 * Pre-Populated MSK Smart Phrases & Clinical Outcome Measures Library
 * 
 * Group 1: Clinician Shortcuts (Prefix: @)
 * - Regional Assessment Protocols with Excel-style interactive grids
 * - Comprehensive ROM, Neurological Screen, and Ligament Laxity tables
 * 
 * Group 2: MSK Outcome Measures (Strict Prefix: ! & ALL-CAPS codes)
 * - Structured Excel-Style interactive tables with in-cell inputs, resizable columns,
 *   auto-summed totals, percentage calculations, and clinical cutoff indicator pills.
 */

const SEED_SMART_PHRASES = [
  // ═══════════════════════════════════════════════════════════════════════════
  // GROUP 1: CLINICIAN SHORTCUTS (@)
  // ═══════════════════════════════════════════════════════════════════════════

  {
    trigger_prefix: '@',
    code: 'rom-table',
    title: 'Range of Motion (ROM) Interactive Testing Grid',
    category: 'msk_templates',
    content: `### Objective Examination — Range of Motion (ROM)

<div class="excel-table-wrap">
  <table class="excel-table">
    <thead>
      <tr>
        <th style="width: 140px;">Region &amp; Motion<div class="col-resizer"></div></th>
        <th style="width: 100px;">Normative<div class="col-resizer"></div></th>
        <th style="width: 110px;">Active ROM (L)<div class="col-resizer"></div></th>
        <th style="width: 110px;">Active ROM (R)<div class="col-resizer"></div></th>
        <th style="width: 130px;">End-Feel<div class="col-resizer"></div></th>
        <th>Pain / Restriction Notes<div class="col-resizer"></div></th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td class="font-semibold">Cervical Flexion</td>
        <td class="text-slate-400">0 - 50°</td>
        <td><input type="text" class="excel-input text-center" placeholder="°" /></td>
        <td><input type="text" class="excel-input text-center" placeholder="°" /></td>
        <td><input type="text" class="excel-input" placeholder="Tissue stretch" /></td>
        <td><input type="text" class="excel-input text-left" placeholder="Pain-free" /></td>
      </tr>
      <tr>
        <td class="font-semibold">Cervical Extension</td>
        <td class="text-slate-400">0 - 60°</td>
        <td><input type="text" class="excel-input text-center" placeholder="°" /></td>
        <td><input type="text" class="excel-input text-center" placeholder="°" /></td>
        <td><input type="text" class="excel-input" placeholder="Firm" /></td>
        <td><input type="text" class="excel-input text-left" placeholder="Pain-free" /></td>
      </tr>
      <tr>
        <td class="font-semibold">Cervical Rotation</td>
        <td class="text-slate-400">0 - 80°</td>
        <td><input type="text" class="excel-input text-center" placeholder="°" /></td>
        <td><input type="text" class="excel-input text-center" placeholder="°" /></td>
        <td><input type="text" class="excel-input" placeholder="Tissue stretch" /></td>
        <td><input type="text" class="excel-input text-left" placeholder="Symmetric" /></td>
      </tr>
      <tr>
        <td class="font-semibold">Lumbar Flexion</td>
        <td class="text-slate-400">0 - 60° (or fingertip-to-floor)</td>
        <td colspan="2"><input type="text" class="excel-input text-center" placeholder="cm / °" /></td>
        <td><input type="text" class="excel-input" placeholder="Tissue stretch" /></td>
        <td><input type="text" class="excel-input text-left" placeholder="No deviation" /></td>
      </tr>
      <tr>
        <td class="font-semibold">Lumbar Extension</td>
        <td class="text-slate-400">0 - 25°</td>
        <td colspan="2"><input type="text" class="excel-input text-center" placeholder="°" /></td>
        <td><input type="text" class="excel-input" placeholder="Bone / firm" /></td>
        <td><input type="text" class="excel-input text-left" placeholder="Centralizes / clears" /></td>
      </tr>
      <tr>
        <td class="font-semibold">Shoulder Flexion</td>
        <td class="text-slate-400">0 - 180°</td>
        <td><input type="text" class="excel-input text-center" placeholder="°" /></td>
        <td><input type="text" class="excel-input text-center" placeholder="°" /></td>
        <td><input type="text" class="excel-input" placeholder="Firm" /></td>
        <td><input type="text" class="excel-input text-left" placeholder="Scapulohumeral rhythm intact" /></td>
      </tr>
      <tr>
        <td class="font-semibold">Shoulder Abduction</td>
        <td class="text-slate-400">0 - 180°</td>
        <td><input type="text" class="excel-input text-center" placeholder="°" /></td>
        <td><input type="text" class="excel-input text-center" placeholder="°" /></td>
        <td><input type="text" class="excel-input" placeholder="Firm" /></td>
        <td><input type="text" class="excel-input text-left" placeholder="Painful arc 60-120°?" /></td>
      </tr>
      <tr>
        <td class="font-semibold">Hip Flexion</td>
        <td class="text-slate-400">0 - 120°</td>
        <td><input type="text" class="excel-input text-center" placeholder="°" /></td>
        <td><input type="text" class="excel-input text-center" placeholder="°" /></td>
        <td><input type="text" class="excel-input" placeholder="Soft / tissue approx" /></td>
        <td><input type="text" class="excel-input text-left" placeholder="Groin pinch / clear" /></td>
      </tr>
      <tr>
        <td class="font-semibold">Knee Flexion / Ext</td>
        <td class="text-slate-400">0 - 135° / 0°</td>
        <td><input type="text" class="excel-input text-center" placeholder="°" /></td>
        <td><input type="text" class="excel-input text-center" placeholder="°" /></td>
        <td><input type="text" class="excel-input" placeholder="Tissue approx / firm" /></td>
        <td><input type="text" class="excel-input text-left" placeholder="Full extension locked" /></td>
      </tr>
      <tr>
        <td class="font-semibold">Ankle Dorsiflexion</td>
        <td class="text-slate-400">Weight-bearing lunge (≥10 cm)</td>
        <td><input type="text" class="excel-input text-center" placeholder="cm" /></td>
        <td><input type="text" class="excel-input text-center" placeholder="cm" /></td>
        <td><input type="text" class="excel-input" placeholder="Elastic / bone" /></td>
        <td><input type="text" class="excel-input text-left" placeholder="Anterior pinch / Achilles stretch" /></td>
      </tr>
    </tbody>
  </table>
</div>`
  },

  {
    trigger_prefix: '@',
    code: 'neuro-table',
    title: 'Neurological Examination (Upper & Lower Quadrants)',
    category: 'msk_templates',
    content: `### Objective Examination — Neurological Screen

<div class="excel-table-wrap">
  <table class="excel-table">
    <thead>
      <tr>
        <th style="width: 70px;">Level<div class="col-resizer"></div></th>
        <th style="width: 140px;">Dermatome Sensory<div class="col-resizer"></div></th>
        <th style="width: 150px;">Myotome Key Muscle<div class="col-resizer"></div></th>
        <th style="width: 110px;">Power (0-5)<div class="col-resizer"></div></th>
        <th style="width: 130px;">Reflex (0-4+)<div class="col-resizer"></div></th>
        <th>Clinical Notes<div class="col-resizer"></div></th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td class="font-bold text-center">C5</td>
        <td>Lateral upper arm</td>
        <td>Deltoid / Biceps</td>
        <td><input type="text" class="excel-input text-center" placeholder="5/5" /></td>
        <td><input type="text" class="excel-input text-center" placeholder="Biceps (2+)" /></td>
        <td><input type="text" class="excel-input" placeholder="Intact" /></td>
      </tr>
      <tr>
        <td class="font-bold text-center">C6</td>
        <td>Lateral forearm &amp; thumb</td>
        <td>Wrist Extensors / Biceps</td>
        <td><input type="text" class="excel-input text-center" placeholder="5/5" /></td>
        <td><input type="text" class="excel-input text-center" placeholder="Brachiorad (2+)" /></td>
        <td><input type="text" class="excel-input" placeholder="Intact" /></td>
      </tr>
      <tr>
        <td class="font-bold text-center">C7</td>
        <td>Middle finger</td>
        <td>Triceps / Wrist Flexors</td>
        <td><input type="text" class="excel-input text-center" placeholder="5/5" /></td>
        <td><input type="text" class="excel-input text-center" placeholder="Triceps (2+)" /></td>
        <td><input type="text" class="excel-input" placeholder="Intact" /></td>
      </tr>
      <tr>
        <td class="font-bold text-center">C8</td>
        <td>Medial forearm &amp; 5th digit</td>
        <td>Finger Flexors (FDP)</td>
        <td><input type="text" class="excel-input text-center" placeholder="5/5" /></td>
        <td class="text-center text-slate-400">—</td>
        <td><input type="text" class="excel-input" placeholder="Grip strong" /></td>
      </tr>
      <tr>
        <td class="font-bold text-center">T1</td>
        <td>Medial elbow / arm</td>
        <td>Hand Interossei (Abduction)</td>
        <td><input type="text" class="excel-input text-center" placeholder="5/5" /></td>
        <td class="text-center text-slate-400">—</td>
        <td><input type="text" class="excel-input" placeholder="Intact" /></td>
      </tr>
      <tr>
        <td class="font-bold text-center">L2</td>
        <td>Anterior mid-thigh</td>
        <td>Hip Flexors (Iliopsoas)</td>
        <td><input type="text" class="excel-input text-center" placeholder="5/5" /></td>
        <td class="text-center text-slate-400">—</td>
        <td><input type="text" class="excel-input" placeholder="Intact" /></td>
      </tr>
      <tr>
        <td class="font-bold text-center">L3</td>
        <td>Medial distal thigh &amp; knee</td>
        <td>Knee Extensors (Quadriceps)</td>
        <td><input type="text" class="excel-input text-center" placeholder="5/5" /></td>
        <td><input type="text" class="excel-input text-center" placeholder="Patellar (2+)" /></td>
        <td><input type="text" class="excel-input" placeholder="Intact" /></td>
      </tr>
      <tr>
        <td class="font-bold text-center">L4</td>
        <td>Medial malleolus</td>
        <td>Ankle Dorsiflex (Tib Ant)</td>
        <td><input type="text" class="excel-input text-center" placeholder="5/5" /></td>
        <td><input type="text" class="excel-input text-center" placeholder="Patellar (2+)" /></td>
        <td><input type="text" class="excel-input" placeholder="Heel-walk intact" /></td>
      </tr>
      <tr>
        <td class="font-bold text-center">L5</td>
        <td>Dorsum foot &amp; 1st-2nd web</td>
        <td>Great Toe Ext (EHL)</td>
        <td><input type="text" class="excel-input text-center" placeholder="5/5" /></td>
        <td class="text-center text-slate-400">—</td>
        <td><input type="text" class="excel-input" placeholder="Intact" /></td>
      </tr>
      <tr>
        <td class="font-bold text-center">S1</td>
        <td>Lateral border foot &amp; sole</td>
        <td>Plantarflex (Gastrocs/Soleus)</td>
        <td><input type="text" class="excel-input text-center" placeholder="5/5" /></td>
        <td><input type="text" class="excel-input text-center" placeholder="Achilles (2+)" /></td>
        <td><input type="text" class="excel-input" placeholder="Single-leg toe raise x10" /></td>
      </tr>
    </tbody>
  </table>
</div>

**Upper Motor Neuron / Pathological Reflex Screen:**
- Babinski Sign: [ Negative / Down-going plantar response ]
- Hoffman's Sign: [ Negative bilaterally ]
- Clonus: [ Absent / <2 beats ]`
  },

  {
    trigger_prefix: '@',
    code: 'ligament-table',
    title: 'Ligamentous Stability & Laxity Testing Battery',
    category: 'msk_templates',
    content: `### Objective Examination — Ligamentous Stability

<div class="excel-table-wrap">
  <table class="excel-table">
    <thead>
      <tr>
        <th style="width: 140px;">Joint &amp; Ligament<div class="col-resizer"></div></th>
        <th style="width: 150px;">Special Test Performed<div class="col-resizer"></div></th>
        <th style="width: 130px;">Laxity Grade<div class="col-resizer"></div></th>
        <th style="width: 130px;">Endpoint Quality<div class="col-resizer"></div></th>
        <th>Concordant Pain / Reproduction<div class="col-resizer"></div></th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td class="font-semibold">ACL (Anterior Cruciate)</td>
        <td>Lachman Test (30°)</td>
        <td><input type="text" class="excel-input text-center" placeholder="Grade 0 (0-2mm)" /></td>
        <td><input type="text" class="excel-input text-center" placeholder="Crisp &amp; firm" /></td>
        <td><input type="text" class="excel-input" placeholder="Pain-free" /></td>
      </tr>
      <tr>
        <td class="font-semibold">ACL (Anterior Cruciate)</td>
        <td>Anterior Drawer (90°)</td>
        <td><input type="text" class="excel-input text-center" placeholder="Grade 0" /></td>
        <td><input type="text" class="excel-input text-center" placeholder="Crisp &amp; firm" /></td>
        <td><input type="text" class="excel-input" placeholder="Pain-free" /></td>
      </tr>
      <tr>
        <td class="font-semibold">PCL (Posterior Cruciate)</td>
        <td>Posterior Sag &amp; Drawer</td>
        <td><input type="text" class="excel-input text-center" placeholder="Grade 0" /></td>
        <td><input type="text" class="excel-input text-center" placeholder="Firm endpoint" /></td>
        <td><input type="text" class="excel-input" placeholder="Pain-free" /></td>
      </tr>
      <tr>
        <td class="font-semibold">MCL (Medial Collateral)</td>
        <td>Valgus Stress (at 30°)</td>
        <td><input type="text" class="excel-input text-center" placeholder="Grade 0" /></td>
        <td><input type="text" class="excel-input text-center" placeholder="Firm stop" /></td>
        <td><input type="text" class="excel-input" placeholder="Pain-free" /></td>
      </tr>
      <tr>
        <td class="font-semibold">LCL (Lateral Collateral)</td>
        <td>Varus Stress (at 30°)</td>
        <td><input type="text" class="excel-input text-center" placeholder="Grade 0" /></td>
        <td><input type="text" class="excel-input text-center" placeholder="Firm stop" /></td>
        <td><input type="text" class="excel-input" placeholder="Pain-free" /></td>
      </tr>
      <tr>
        <td class="font-semibold">ATFL (Anterior Talofib)</td>
        <td>Anterior Drawer (Ankle)</td>
        <td><input type="text" class="excel-input text-center" placeholder="Grade 0" /></td>
        <td><input type="text" class="excel-input text-center" placeholder="Firm stop" /></td>
        <td><input type="text" class="excel-input" placeholder="Pain-free" /></td>
      </tr>
      <tr>
        <td class="font-semibold">CFL (Calcaneofibular)</td>
        <td>Talar Tilt Test</td>
        <td><input type="text" class="excel-input text-center" placeholder="Grade 0" /></td>
        <td><input type="text" class="excel-input text-center" placeholder="Firm stop" /></td>
        <td><input type="text" class="excel-input" placeholder="Pain-free" /></td>
      </tr>
      <tr>
        <td class="font-semibold">Glenohumeral Anterior</td>
        <td>Apprehension &amp; Relocation</td>
        <td><input type="text" class="excel-input text-center" placeholder="Normal translation" /></td>
        <td><input type="text" class="excel-input text-center" placeholder="Firm capsular" /></td>
        <td><input type="text" class="excel-input" placeholder="No apprehension" /></td>
      </tr>
    </tbody>
  </table>
</div>`
  },

  {
    trigger_prefix: '@',
    code: 'c-spine',
    title: 'Cervical Spine Comprehensive Assessment',
    category: 'msk_templates',
    content: `### Cervical Spine Clinical Examination

**Subjective Overview:**
- Mechanism / Onset: Insidious / Postural / Acute trauma / Whiplash
- Pain Referral: Suboccipital / Interscapular / Upper Extremity / Dermatomal
- Red Flags / VBI Screen: 5 Ds & 3 Ns negative. No gait clumsiness, bilateral paresthesia, or intrinsic hand weakness.

<div class="excel-table-wrap">
  <table class="excel-table">
    <thead>
      <tr>
        <th style="width: 140px;">Cervical Movement<div class="col-resizer"></div></th>
        <th style="width: 100px;">Normative<div class="col-resizer"></div></th>
        <th style="width: 120px;">Observed Range<div class="col-resizer"></div></th>
        <th style="width: 130px;">Pain Provocation<div class="col-resizer"></div></th>
        <th>End-Feel<div class="col-resizer"></div></th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td class="font-semibold">Flexion</td>
        <td class="text-slate-400">0 - 50°</td>
        <td><input type="text" class="excel-input text-center" placeholder="°" /></td>
        <td><input type="text" class="excel-input" placeholder="None" /></td>
        <td><input type="text" class="excel-input" placeholder="Tissue stretch" /></td>
      </tr>
      <tr>
        <td class="font-semibold">Extension</td>
        <td class="text-slate-400">0 - 60°</td>
        <td><input type="text" class="excel-input text-center" placeholder="°" /></td>
        <td><input type="text" class="excel-input" placeholder="None" /></td>
        <td><input type="text" class="excel-input" placeholder="Firm" /></td>
      </tr>
      <tr>
        <td class="font-semibold">Lateral Flexion (L/R)</td>
        <td class="text-slate-400">0 - 45°</td>
        <td><input type="text" class="excel-input text-center" placeholder="° / °" /></td>
        <td><input type="text" class="excel-input" placeholder="Symmetric" /></td>
        <td><input type="text" class="excel-input" placeholder="Tissue stretch" /></td>
      </tr>
      <tr>
        <td class="font-semibold">Rotation (L/R)</td>
        <td class="text-slate-400">0 - 80°</td>
        <td><input type="text" class="excel-input text-center" placeholder="° / °" /></td>
        <td><input type="text" class="excel-input" placeholder="Symmetric" /></td>
        <td><input type="text" class="excel-input" placeholder="Tissue stretch" /></td>
      </tr>
    </tbody>
  </table>
</div>

**Special Cervical Orthopedic Tests:**
- Spurling's Compression Test: [ Negative / Positive with radicular reproduction ]
- Cervical Distraction Test: [ Negative / Positive with symptom relief ]
- Upper Limb Neurodynamic Test (ULTT 1 - Median): [ Negative / Positive ]
- Cervical Flexion-Rotation Test (C1-C2): [ Normal (≥45°) / Restricted ]`
  },

  {
    trigger_prefix: '@',
    code: 'l-spine',
    title: 'Lumbar Spine Comprehensive Assessment',
    category: 'msk_templates',
    content: `### Lumbar Spine Clinical Examination

**Subjective Overview:**
- Onset & Mechanism: Flexion-load / Prolonged sitting / Lifting / Insidious
- Symptom Location: Low back / Buttock / Thigh / Below knee
- Directional Preference: [ Flexion-biased / Extension-biased / Lateral-biased / Unclear ]
- Red Flags: Cauda Equina Syndrome negative (No saddle numbness, bowel/bladder changes, or progressive motor deficit).

<div class="excel-table-wrap">
  <table class="excel-table">
    <thead>
      <tr>
        <th style="width: 140px;">Movement<div class="col-resizer"></div></th>
        <th style="width: 120px;">Observed Range<div class="col-resizer"></div></th>
        <th style="width: 150px;">Repeated Movement Response<div class="col-resizer"></div></th>
        <th>Pain Pattern / Deviation<div class="col-resizer"></div></th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td class="font-semibold">Lumbar Flexion</td>
        <td><input type="text" class="excel-input text-center" placeholder="cm / °" /></td>
        <td><input type="text" class="excel-input" placeholder="Peripheralizes / Centralizes / Nil" /></td>
        <td><input type="text" class="excel-input" placeholder="Pain on return" /></td>
      </tr>
      <tr>
        <td class="font-semibold">Lumbar Extension</td>
        <td><input type="text" class="excel-input text-center" placeholder="°" /></td>
        <td><input type="text" class="excel-input" placeholder="Centralizes / Clears" /></td>
        <td><input type="text" class="excel-input" placeholder="End-range stiffness" /></td>
      </tr>
      <tr>
        <td class="font-semibold">Side Glide (L/R)</td>
        <td><input type="text" class="excel-input text-center" placeholder="Symmetric" /></td>
        <td><input type="text" class="excel-input" placeholder="No change" /></td>
        <td><input type="text" class="excel-input" placeholder="Free" /></td>
      </tr>
    </tbody>
  </table>
</div>

**Radicular & Neurodynamic Tests:**
- Straight Leg Raise (SLR): Left: ___° | Right: ___° (Dorsiflexion sensitization)
- Crossed SLR (Well Leg): [ Negative / Positive for large disk herniation ]
- Slump Test: [ Negative / Positive radicular recreation relieved on neck release ]
- Prone Instability Test: [ Negative / Positive for segmental motor control impairment ]`
  },

  {
    trigger_prefix: '@',
    code: 'shoulder',
    title: 'Shoulder Examination & Rotator Cuff Battery',
    category: 'msk_templates',
    content: `### Shoulder Joint & Rotator Cuff Assessment

**Subjective Overview:**
- Affected Side: [ Left / Right / Bilateral ] | Dominance: [ Right / Left ]
- Aggravators: Overhead activity / Reaching behind back / Sleeping on affected side

<div class="excel-table-wrap">
  <table class="excel-table">
    <thead>
      <tr>
        <th style="width: 150px;">Rotator Cuff Test<div class="col-resizer"></div></th>
        <th style="width: 140px;">Target Structure<div class="col-resizer"></div></th>
        <th style="width: 120px;">Finding<div class="col-resizer"></div></th>
        <th>Strength &amp; Pain Quality<div class="col-resizer"></div></th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td class="font-semibold">Painful Arc</td>
        <td>Subacromial Space</td>
        <td><input type="text" class="excel-input text-center" placeholder="Negative / Positive" /></td>
        <td><input type="text" class="excel-input" placeholder="Pain 60° - 120°" /></td>
      </tr>
      <tr>
        <td class="font-semibold">Hawkins-Kennedy</td>
        <td>Subacromial Impingement</td>
        <td><input type="text" class="excel-input text-center" placeholder="Negative / Positive" /></td>
        <td><input type="text" class="excel-input" placeholder="Concordant anterolateral pain" /></td>
      </tr>
      <tr>
        <td class="font-semibold">Empty Can (Jobe's)</td>
        <td>Supraspinatus Tendon</td>
        <td><input type="text" class="excel-input text-center" placeholder="5/5 Strong / Weak" /></td>
        <td><input type="text" class="excel-input" placeholder="Intact / Painful" /></td>
      </tr>
      <tr>
        <td class="font-semibold">External Rot Lag Sign</td>
        <td>Infraspinatus / Teres Minor</td>
        <td><input type="text" class="excel-input text-center" placeholder="Intact / Lag noted" /></td>
        <td><input type="text" class="excel-input" placeholder="Holds position at 90°" /></td>
      </tr>
      <tr>
        <td class="font-semibold">Belly Press / Lift-Off</td>
        <td>Subscapularis</td>
        <td><input type="text" class="excel-input text-center" placeholder="Intact / Weak" /></td>
        <td><input type="text" class="excel-input" placeholder="No compensatory wrist flexion" /></td>
      </tr>
      <tr>
        <td class="font-semibold">Speed's &amp; Yergason's</td>
        <td>Long Head Biceps</td>
        <td><input type="text" class="excel-input text-center" placeholder="Negative / Positive" /></td>
        <td><input type="text" class="excel-input" placeholder="Bicipital groove tenderness" /></td>
      </tr>
    </tbody>
  </table>
</div>`
  },

  {
    trigger_prefix: '@',
    code: 'knee',
    title: 'Knee Joint & Ligamentous Battery',
    category: 'msk_templates',
    content: `### Knee Joint Clinical Examination

**Subjective Presentation:**
- Mechanism: Non-contact deceleration / Pivot / Direct blow / Insidious overuse
- Effusion Onset: [ None / Immediate <2 hrs / Delayed >12 hrs ]
- Mechanical Symptoms: [ Giving way / Locking / Catching / Denied ]

<div class="excel-table-wrap">
  <table class="excel-table">
    <thead>
      <tr>
        <th style="width: 140px;">Clinical Test<div class="col-resizer"></div></th>
        <th style="width: 140px;">Structure<div class="col-resizer"></div></th>
        <th style="width: 130px;">Result / Grade<div class="col-resizer"></div></th>
        <th>Clinical Notes<div class="col-resizer"></div></th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td class="font-semibold">Lachman Test (30°)</td>
        <td>ACL</td>
        <td><input type="text" class="excel-input text-center" placeholder="Grade 0 / 1+ / 2+ / 3+" /></td>
        <td><input type="text" class="excel-input" placeholder="Firm endpoint" /></td>
      </tr>
      <tr>
        <td class="font-semibold">Posterior Drawer</td>
        <td>PCL</td>
        <td><input type="text" class="excel-input text-center" placeholder="Normal / Grade I-III" /></td>
        <td><input type="text" class="excel-input" placeholder="Tibial plateau step-off intact" /></td>
      </tr>
      <tr>
        <td class="font-semibold">Valgus Stress (30°)</td>
        <td>MCL</td>
        <td><input type="text" class="excel-input text-center" placeholder="Grade 0 (Stable)" /></td>
        <td><input type="text" class="excel-input" placeholder="No medial joint line opening" /></td>
      </tr>
      <tr>
        <td class="font-semibold">Varus Stress (30°)</td>
        <td>LCL</td>
        <td><input type="text" class="excel-input text-center" placeholder="Grade 0 (Stable)" /></td>
        <td><input type="text" class="excel-input" placeholder="Firm lateral stop" /></td>
      </tr>
      <tr>
        <td class="font-semibold">McMurray's Test</td>
        <td>Meniscus (Med / Lat)</td>
        <td><input type="text" class="excel-input text-center" placeholder="Negative / Click + Pain" /></td>
        <td><input type="text" class="excel-input" placeholder="No palpable click or sharp joint pain" /></td>
      </tr>
      <tr>
        <td class="font-semibold">Thessaly Test (20°)</td>
        <td>Meniscus</td>
        <td><input type="text" class="excel-input text-center" placeholder="Negative / Positive" /></td>
        <td><input type="text" class="excel-input" placeholder="Weight-bearing rotation tolerated" /></td>
      </tr>
    </tbody>
  </table>
</div>`
  },

  {
    trigger_prefix: '@',
    code: 'hip',
    title: 'Hip Joint & Groin Assessment',
    category: 'msk_templates',
    content: `### Hip & Groin Clinical Examination

**Subjective Overview:**
- Location: Anterior groin (C-sign) / Lateral trochanteric / Deep buttock
- Aggravators: Prolonged sitting / Deep squatting / Running / Lateral decubitus sleeping

<div class="excel-table-wrap">
  <table class="excel-table">
    <thead>
      <tr>
        <th style="width: 140px;">Special Test<div class="col-resizer"></div></th>
        <th style="width: 150px;">Suspected Pathology<div class="col-resizer"></div></th>
        <th style="width: 120px;">Finding<div class="col-resizer"></div></th>
        <th>Observation / Pain Quality<div class="col-resizer"></div></th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td class="font-semibold">FADIR Test</td>
        <td>FAI / Labral Tear</td>
        <td><input type="text" class="excel-input text-center" placeholder="Negative / Positive" /></td>
        <td><input type="text" class="excel-input" placeholder="Groin pinch reproduction" /></td>
      </tr>
      <tr>
        <td class="font-semibold">FABER (Patrick's)</td>
        <td>Hip Articular vs SIJ</td>
        <td><input type="text" class="excel-input text-center" placeholder="Negative / Positive" /></td>
        <td><input type="text" class="excel-input" placeholder="Anterior hip restriction / Posterior SIJ" /></td>
      </tr>
      <tr>
        <td class="font-semibold">Trendelenburg Test</td>
        <td>Gluteus Medius / Hip Abductors</td>
        <td><input type="text" class="excel-input text-center" placeholder="Negative / Positive drop" /></td>
        <td><input type="text" class="excel-input" placeholder="Pelvis level on 30s single-leg stance" /></td>
      </tr>
      <tr>
        <td class="font-semibold">Thomas Test</td>
        <td>Iliopsoas &amp; Rectus Femoris</td>
        <td><input type="text" class="excel-input text-center" placeholder="Negative / Tight" /></td>
        <td><input type="text" class="excel-input" placeholder="Thigh flat on plinth / Kendall angle" /></td>
      </tr>
    </tbody>
  </table>
</div>`
  },

  {
    trigger_prefix: '@',
    code: 'ankle',
    title: 'Ankle & Foot Complex Assessment',
    category: 'msk_templates',
    content: `### Ankle & Foot Complex Examination

**Ottawa Ankle Rules (Acute Trauma Screen):**
- Bone tenderness along posterior 6cm of lateral malleolus: [ No / Yes ]
- Bone tenderness along posterior 6cm of medial malleolus: [ No / Yes ]
- Inability to bear weight immediately and for 4 steps in clinic: [ Able / Unable ]
- Bone tenderness at base of 5th metatarsal or navicular: [ No / Yes ]
*Ottawa Rules Result:* [ Negative — Radiography not indicated / Positive — Refer for X-ray ]

<div class="excel-table-wrap">
  <table class="excel-table">
    <thead>
      <tr>
        <th style="width: 150px;">Movement / Test<div class="col-resizer"></div></th>
        <th style="width: 110px;">Affected<div class="col-resizer"></div></th>
        <th style="width: 110px;">Unaffected<div class="col-resizer"></div></th>
        <th>Clinical Findings<div class="col-resizer"></div></th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td class="font-semibold">Weight-Bearing Lunge (DF)</td>
        <td><input type="text" class="excel-input text-center" placeholder="cm" /></td>
        <td><input type="text" class="excel-input text-center" placeholder="cm" /></td>
        <td><input type="text" class="excel-input" placeholder="Normative ≥ 10 cm" /></td>
      </tr>
      <tr>
        <td class="font-semibold">Anterior Drawer (ATFL)</td>
        <td><input type="text" class="excel-input text-center" placeholder="Grade 0" /></td>
        <td><input type="text" class="excel-input text-center" placeholder="Grade 0" /></td>
        <td><input type="text" class="excel-input" placeholder="Firm stop / no sulcus sign" /></td>
      </tr>
      <tr>
        <td class="font-semibold">Talar Tilt (CFL)</td>
        <td><input type="text" class="excel-input text-center" placeholder="Grade 0" /></td>
        <td><input type="text" class="excel-input text-center" placeholder="Grade 0" /></td>
        <td><input type="text" class="excel-input" placeholder="Symmetric inversion stop" /></td>
      </tr>
      <tr>
        <td class="font-semibold">Syndesmosis Squeeze</td>
        <td><input type="text" class="excel-input text-center" placeholder="Negative" /></td>
        <td><input type="text" class="excel-input text-center" placeholder="Negative" /></td>
        <td><input type="text" class="excel-input" placeholder="No distal tib-fib separation pain" /></td>
      </tr>
    </tbody>
  </table>
</div>`
  },

  {
    trigger_prefix: '@',
    code: 'treestump',
    title: 'Concise Clinical Review & Re-Assessment',
    category: 'msk_templates',
    content: `**Clinical Re-Assessment Note:**
- Subjective Progress: Patient reports [ improved / unchanged / aggravated ] symptoms since last visit.
- Functional Activities: Walking tolerance increased, stairs manageable without pain.
- Compliance with Home Exercises: [ High (Daily) / Moderate (3-4x/wk) / Poor ]
- Objective Re-Test: Comparable sign demonstrates improved range and motor control.
- Treatment Performed: Manual joint mobilization, soft tissue release, exercise progression.
- Next Session Focus: Eccentric loading progression and sport-specific return.`
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // GROUP 2: PRE-BUILT MSK OUTCOME MEASURES (STRICT PREFIX: ! & ALL-CAPS)
  // ═══════════════════════════════════════════════════════════════════════════

  // ── 1. !FABQ ─────────────────────────────────────────────────────────────
  {
    trigger_prefix: '!',
    code: 'FABQ',
    title: 'Fear-Avoidance Beliefs Questionnaire (FABQ)',
    category: 'outcome_measures',
    content: `### Fear-Avoidance Beliefs Questionnaire (FABQ)

<div class="excel-table-wrap">
  <table class="excel-table" data-calc-group="fabq">
    <thead>
      <tr>
        <th style="width: 50px;" class="text-center">#<div class="col-resizer"></div></th>
        <th>Item Statement (Scored 0 = Completely Disagree to 6 = Completely Agree)<div class="col-resizer"></div></th>
        <th style="width: 100px;" class="text-center">Score (0-6)<div class="col-resizer"></div></th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td class="text-center font-mono text-slate-400">1</td>
        <td>My pain was caused by physical activity. <em>(Information only — not scored)</em></td>
        <td><input type="number" class="excel-input" min="0" max="6" placeholder="0" /></td>
      </tr>
      <tr>
        <td class="text-center font-mono font-semibold">2</td>
        <td>Physical activity makes my pain worse. <em>[Physical Activity]</em></td>
        <td><input type="number" class="excel-input" data-group="fabq-pa" min="0" max="6" placeholder="0" /></td>
      </tr>
      <tr>
        <td class="text-center font-mono font-semibold">3</td>
        <td>Physical activity might harm my back. <em>[Physical Activity]</em></td>
        <td><input type="number" class="excel-input" data-group="fabq-pa" min="0" max="6" placeholder="0" /></td>
      </tr>
      <tr>
        <td class="text-center font-mono font-semibold">4</td>
        <td>I should not do physical activities which (might) make my pain worse. <em>[Physical Activity]</em></td>
        <td><input type="number" class="excel-input" data-group="fabq-pa" min="0" max="6" placeholder="0" /></td>
      </tr>
      <tr>
        <td class="text-center font-mono font-semibold">5</td>
        <td>I cannot do physical activities which (might) make my pain worse. <em>[Physical Activity]</em></td>
        <td><input type="number" class="excel-input" data-group="fabq-pa" min="0" max="6" placeholder="0" /></td>
      </tr>
      <tr class="excel-total-row">
        <td colspan="2" class="font-bold">
          Physical Activity Subscale (Items 2-5 &bull; Max 24 &bull; <span class="risk-pill risk-amber" data-cutoff-target="fabq-pa" data-cutoff-val="15">Cutoff &ge; 15</span>)
        </td>
        <td class="text-center font-mono font-bold text-indigo-600 dark:text-indigo-400">
          <span class="excel-sum" data-sum-target="fabq-pa">0</span> / 24
        </td>
      </tr>
      <tr>
        <td class="text-center font-mono font-semibold">6</td>
        <td>My pain was caused by my work or by an accident at work. <em>[Work]</em></td>
        <td><input type="number" class="excel-input" data-group="fabq-w" min="0" max="6" placeholder="0" /></td>
      </tr>
      <tr>
        <td class="text-center font-mono font-semibold">7</td>
        <td>My work aggravated my pain. <em>[Work]</em></td>
        <td><input type="number" class="excel-input" data-group="fabq-w" min="0" max="6" placeholder="0" /></td>
      </tr>
      <tr>
        <td class="text-center font-mono text-slate-400">8</td>
        <td>I have a claim for compensation for my pain. <em>(Information only — not scored)</em></td>
        <td><input type="number" class="excel-input" min="0" max="6" placeholder="0" /></td>
      </tr>
      <tr>
        <td class="text-center font-mono font-semibold">9</td>
        <td>My work is too heavy for me. <em>[Work]</em></td>
        <td><input type="number" class="excel-input" data-group="fabq-w" min="0" max="6" placeholder="0" /></td>
      </tr>
      <tr>
        <td class="text-center font-mono font-semibold">10</td>
        <td>My work makes or would make my pain worse. <em>[Work]</em></td>
        <td><input type="number" class="excel-input" data-group="fabq-w" min="0" max="6" placeholder="0" /></td>
      </tr>
      <tr>
        <td class="text-center font-mono font-semibold">11</td>
        <td>My work might harm my back. <em>[Work]</em></td>
        <td><input type="number" class="excel-input" data-group="fabq-w" min="0" max="6" placeholder="0" /></td>
      </tr>
      <tr>
        <td class="text-center font-mono font-semibold">12</td>
        <td>I should not do my regular work with my present pain. <em>[Work]</em></td>
        <td><input type="number" class="excel-input" data-group="fabq-w" min="0" max="6" placeholder="0" /></td>
      </tr>
      <tr>
        <td class="text-center font-mono text-slate-400">13</td>
        <td>I cannot do my normal work with my present pain. <em>(Information only — not scored)</em></td>
        <td><input type="number" class="excel-input" min="0" max="6" placeholder="0" /></td>
      </tr>
      <tr>
        <td class="text-center font-mono text-slate-400">14</td>
        <td>I cannot do my normal work till my pain is treated. <em>(Information only — not scored)</em></td>
        <td><input type="number" class="excel-input" min="0" max="6" placeholder="0" /></td>
      </tr>
      <tr>
        <td class="text-center font-mono font-semibold">15</td>
        <td>I do not think that I will be back to my normal work within 3 months. <em>[Work]</em></td>
        <td><input type="number" class="excel-input" data-group="fabq-w" min="0" max="6" placeholder="0" /></td>
      </tr>
      <tr>
        <td class="text-center font-mono text-slate-400">16</td>
        <td>I do not think that I will ever be able to go back to that work. <em>(Information only — not scored)</em></td>
        <td><input type="number" class="excel-input" min="0" max="6" placeholder="0" /></td>
      </tr>
      <tr class="excel-total-row">
        <td colspan="2" class="font-bold">
          Work Subscale (Items 6, 7, 9-12, 15 &bull; Max 42 &bull; <span class="risk-pill risk-red" data-cutoff-target="fabq-w" data-cutoff-val="34">Cutoff &ge; 34</span>)
        </td>
        <td class="text-center font-mono font-bold text-indigo-600 dark:text-indigo-400">
          <span class="excel-sum" data-sum-target="fabq-w">0</span> / 42
        </td>
      </tr>
    </tbody>
  </table>
</div>

**Clinical Interpretation:**
- **FABQ-Physical Activity (≥ 15):** High fear-avoidance beliefs regarding physical movement. Focus on graded exposure and cognitive reassurance.
- **FABQ-Work (≥ 34):** Elevated risk for prolonged occupational disability and poor return-to-work outcomes.`
  },

  // ── 2. !ODI ──────────────────────────────────────────────────────────────
  {
    trigger_prefix: '!',
    code: 'ODI',
    title: 'Oswestry Disability Index (ODI v2.1a)',
    category: 'outcome_measures',
    content: `### Oswestry Disability Index (ODI v2.1a)

<div class="excel-table-wrap">
  <table class="excel-table" data-calc-group="odi">
    <thead>
      <tr>
        <th style="width: 50px;" class="text-center">#<div class="col-resizer"></div></th>
        <th style="width: 220px;">Section / Domain<div class="col-resizer"></div></th>
        <th>Description &amp; Selected Rating<div class="col-resizer"></div></th>
        <th style="width: 100px;" class="text-center">Score (0-5)<div class="col-resizer"></div></th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td class="text-center font-mono">1</td>
        <td class="font-semibold">Pain Intensity</td>
        <td>0: No pain &bull; 1: Very mild &bull; 2: Moderate &bull; 3: Fairly severe &bull; 4: Very severe &bull; 5: Worst imaginable</td>
        <td><input type="number" class="excel-input" data-group="odi" min="0" max="5" placeholder="0" /></td>
      </tr>
      <tr>
        <td class="text-center font-mono">2</td>
        <td class="font-semibold">Personal Care</td>
        <td>0: Normal without pain &bull; 1: Normal with pain &bull; 2: Slow/careful &bull; 3: Need some help &bull; 4: Need daily help &bull; 5: Cannot dress</td>
        <td><input type="number" class="excel-input" data-group="odi" min="0" max="5" placeholder="0" /></td>
      </tr>
      <tr>
        <td class="text-center font-mono">3</td>
        <td class="font-semibold">Lifting</td>
        <td>0: Heavy weights no pain &bull; 1: Heavy with pain &bull; 2: Off table only &bull; 3: Light/medium only &bull; 4: Very light &bull; 5: Cannot lift</td>
        <td><input type="number" class="excel-input" data-group="odi" min="0" max="5" placeholder="0" /></td>
      </tr>
      <tr>
        <td class="text-center font-mono">4</td>
        <td class="font-semibold">Walking</td>
        <td>0: Unlimited &bull; 1: Max 1 mile &bull; 2: Max 1/2 mile &bull; 3: Max 100 yds &bull; 4: Walking stick/crutches &bull; 5: Bedbound</td>
        <td><input type="number" class="excel-input" data-group="odi" min="0" max="5" placeholder="0" /></td>
      </tr>
      <tr>
        <td class="text-center font-mono">5</td>
        <td class="font-semibold">Sitting</td>
        <td>0: Any chair unlimited &bull; 1: Favorite chair only &bull; 2: Max 1 hour &bull; 3: Max 30 mins &bull; 4: Max 10 mins &bull; 5: Prevented sitting</td>
        <td><input type="number" class="excel-input" data-group="odi" min="0" max="5" placeholder="0" /></td>
      </tr>
      <tr>
        <td class="text-center font-mono">6</td>
        <td class="font-semibold">Standing</td>
        <td>0: As long as like &bull; 1: Extra pain &bull; 2: Max 1 hour &bull; 3: Max 30 mins &bull; 4: Max 10 mins &bull; 5: Prevented standing</td>
        <td><input type="number" class="excel-input" data-group="odi" min="0" max="5" placeholder="0" /></td>
      </tr>
      <tr>
        <td class="text-center font-mono">7</td>
        <td class="font-semibold">Sleeping</td>
        <td>0: Never disturbed &bull; 1: Occasionally disturbed &bull; 2: &lt;6 hrs sleep &bull; 3: &lt;4 hrs sleep &bull; 4: &lt;2 hrs sleep &bull; 5: Prevented</td>
        <td><input type="number" class="excel-input" data-group="odi" min="0" max="5" placeholder="0" /></td>
      </tr>
      <tr>
        <td class="text-center font-mono">8</td>
        <td class="font-semibold">Sex Life (if applicable)</td>
        <td>0: Normal, no pain &bull; 1: Normal, extra pain &bull; 2: Nearly normal, painful &bull; 3: Severely restricted &bull; 4: Nearly absent &bull; 5: Prevented</td>
        <td><input type="number" class="excel-input" data-group="odi" min="0" max="5" placeholder="0" /></td>
      </tr>
      <tr>
        <td class="text-center font-mono">9</td>
        <td class="font-semibold">Social Life</td>
        <td>0: Normal &bull; 1: Normal, extra pain &bull; 2: Affects energetic activities &bull; 3: Seldom go out &bull; 4: Restricted to home &bull; 5: None</td>
        <td><input type="number" class="excel-input" data-group="odi" min="0" max="5" placeholder="0" /></td>
      </tr>
      <tr>
        <td class="text-center font-mono">10</td>
        <td class="font-semibold">Traveling</td>
        <td>0: Anywhere no pain &bull; 1: Anywhere extra pain &bull; 2: Painful &gt;2 hrs &bull; 3: Painful &lt;1 hr &bull; 4: Short necessary only &bull; 5: Prevented</td>
        <td><input type="number" class="excel-input" data-group="odi" min="0" max="5" placeholder="0" /></td>
      </tr>
      <tr class="excel-total-row">
        <td colspan="3" class="font-bold">
          Total Score: <span class="excel-sum font-mono" data-sum-target="odi">0</span> / 50 &bull; 
          Disability: <span class="excel-percent font-mono text-indigo-600 dark:text-indigo-400" data-percent-target="odi" data-max="50">0%</span> &bull; 
          Classification: <span class="excel-severity risk-pill risk-low" data-severity-target="odi">Minimal Disability</span>
        </td>
        <td class="text-center font-mono font-bold text-indigo-600 dark:text-indigo-400">
          <span class="excel-sum" data-sum-target="odi">0</span>
        </td>
      </tr>
    </tbody>
  </table>
</div>

**Clinical Interpretation:**
- **0% - 20% (Minimal):** Patient copes with most activities. Ergonomic advice and aerobic fitness.
- **21% - 40% (Moderate):** Pain with sitting, lifting, and standing. Conservative physiotherapy indicated.
- **41% - 60% (Severe):** Activities of daily living significantly impaired.
- **61% - 80% (Crippled):** Back pain impinges on all life dimensions.
- **81% - 100% (Bed-Bound):** Complete functional incapacitation.
- *Minimal Clinically Important Difference (MCID):* **10 - 12 points (or 30% change from baseline)**.`
  },

  // ── 3. !NDI ──────────────────────────────────────────────────────────────
  {
    trigger_prefix: '!',
    code: 'NDI',
    title: 'Neck Disability Index (NDI)',
    category: 'outcome_measures',
    content: `### Neck Disability Index (NDI)

<div class="excel-table-wrap">
  <table class="excel-table" data-calc-group="ndi">
    <thead>
      <tr>
        <th style="width: 50px;" class="text-center">#<div class="col-resizer"></div></th>
        <th style="width: 200px;">Dimension<div class="col-resizer"></div></th>
        <th>Item Criteria (0 = No Disability to 5 = Complete Disability)<div class="col-resizer"></div></th>
        <th style="width: 100px;" class="text-center">Score (0-5)<div class="col-resizer"></div></th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td class="text-center font-mono">1</td>
        <td class="font-semibold">Pain Intensity</td>
        <td>0: No pain &bull; 1: Mild &bull; 2: Moderate &bull; 3: Fairly severe &bull; 4: Very severe &bull; 5: Worst</td>
        <td><input type="number" class="excel-input" data-group="ndi" min="0" max="5" placeholder="0" /></td>
      </tr>
      <tr>
        <td class="text-center font-mono">2</td>
        <td class="font-semibold">Personal Care</td>
        <td>0: Normal without pain &bull; 1: Normal extra pain &bull; 2: Slow/careful &bull; 3: Need help &bull; 4: Daily help &bull; 5: Cannot dress</td>
        <td><input type="number" class="excel-input" data-group="ndi" min="0" max="5" placeholder="0" /></td>
      </tr>
      <tr>
        <td class="text-center font-mono">3</td>
        <td class="font-semibold">Lifting</td>
        <td>0: Heavy weights no pain &bull; 1: Heavy extra pain &bull; 2: Off table only &bull; 3: Light weights &bull; 4: Very light &bull; 5: Cannot lift</td>
        <td><input type="number" class="excel-input" data-group="ndi" min="0" max="5" placeholder="0" /></td>
      </tr>
      <tr>
        <td class="text-center font-mono">4</td>
        <td class="font-semibold">Reading</td>
        <td>0: Unlimited &bull; 1: Slight pain &bull; 2: Moderate pain in 30m &bull; 3: Moderate pain in 10m &bull; 4: Severe pain &bull; 5: Cannot read</td>
        <td><input type="number" class="excel-input" data-group="ndi" min="0" max="5" placeholder="0" /></td>
      </tr>
      <tr>
        <td class="text-center font-mono">5</td>
        <td class="font-semibold">Headaches</td>
        <td>0: None &bull; 1: Slight infrequent &bull; 2: Moderate infrequent &bull; 3: Moderate frequent &bull; 4: Severe frequent &bull; 5: Constant</td>
        <td><input type="number" class="excel-input" data-group="ndi" min="0" max="5" placeholder="0" /></td>
      </tr>
      <tr>
        <td class="text-center font-mono">6</td>
        <td class="font-semibold">Concentration</td>
        <td>0: Normal &bull; 1: Slight difficulty &bull; 2: Moderate difficulty &bull; 3: Fair difficulty &bull; 4: Great difficulty &bull; 5: Cannot concentrate</td>
        <td><input type="number" class="excel-input" data-group="ndi" min="0" max="5" placeholder="0" /></td>
      </tr>
      <tr>
        <td class="text-center font-mono">7</td>
        <td class="font-semibold">Work</td>
        <td>0: Normal &bull; 1: Normal extra effort &bull; 2: Most usual work &bull; 3: Cannot do usual &bull; 4: Hardly any &bull; 5: Cannot work at all</td>
        <td><input type="number" class="excel-input" data-group="ndi" min="0" max="5" placeholder="0" /></td>
      </tr>
      <tr>
        <td class="text-center font-mono">8</td>
        <td class="font-semibold">Driving</td>
        <td>0: Without pain &bull; 1: Moderate pain &bull; 2: Pain on turning &bull; 3: Seldom drive &bull; 4: Hardly ever drive &bull; 5: Cannot drive</td>
        <td><input type="number" class="excel-input" data-group="ndi" min="0" max="5" placeholder="0" /></td>
      </tr>
      <tr>
        <td class="text-center font-mono">9</td>
        <td class="font-semibold">Sleeping</td>
        <td>0: Undisturbed &bull; 1: Mildly disturbed (&lt;1h) &bull; 2: Disturbed (1-2h) &bull; 3: Disturbed (2-3h) &bull; 4: Disturbed (3-5h) &bull; 5: Prevented</td>
        <td><input type="number" class="excel-input" data-group="ndi" min="0" max="5" placeholder="0" /></td>
      </tr>
      <tr>
        <td class="text-center font-mono">10</td>
        <td class="font-semibold">Recreation</td>
        <td>0: All activities &bull; 1: Some neck pain &bull; 2: Most activities &bull; 3: Few activities &bull; 4: Hardly any &bull; 5: Cannot do any</td>
        <td><input type="number" class="excel-input" data-group="ndi" min="0" max="5" placeholder="0" /></td>
      </tr>
      <tr class="excel-total-row">
        <td colspan="3" class="font-bold">
          Total NDI Score: <span class="excel-sum font-mono" data-sum-target="ndi">0</span> / 50 &bull; 
          Disability: <span class="excel-percent font-mono text-indigo-600 dark:text-indigo-400" data-percent-target="ndi" data-max="50">0%</span> &bull; 
          Classification: <span class="excel-severity risk-pill risk-low" data-severity-target="ndi">No Disability</span>
        </td>
        <td class="text-center font-mono font-bold text-indigo-600 dark:text-indigo-400">
          <span class="excel-sum" data-sum-target="ndi">0</span>
        </td>
      </tr>
    </tbody>
  </table>
</div>

**Clinical Grading:**
- **0 - 4:** No disability (0 - 8%)
- **5 - 14:** Mild disability (10 - 28%)
- **15 - 24:** Moderate disability (30 - 48%)
- **25 - 34:** Severe disability (50 - 68%)
- **35 - 50:** Complete disability (70 - 100%)
- *MCID:* **5 points (or 10% change)**.`
  },

  // ── 4. !LEFS ─────────────────────────────────────────────────────────────
  {
    trigger_prefix: '!',
    code: 'LEFS',
    title: 'Lower Extremity Functional Scale (LEFS)',
    category: 'outcome_measures',
    content: `### Lower Extremity Functional Scale (LEFS)

*Scoring: 0 = Extreme difficulty/unable &bull; 1 = Quite a bit &bull; 2 = Moderate &bull; 3 = A little bit &bull; 4 = No difficulty*

<div class="excel-table-wrap">
  <table class="excel-table" data-calc-group="lefs">
    <thead>
      <tr>
        <th style="width: 50px;" class="text-center">#<div class="col-resizer"></div></th>
        <th>Functional Activity<div class="col-resizer"></div></th>
        <th style="width: 100px;" class="text-center">Score (0-4)<div class="col-resizer"></div></th>
      </tr>
    </thead>
    <tbody>
      <tr><td class="text-center font-mono">1</td><td>Any of your usual work, housework, or school activities</td><td><input type="number" class="excel-input" data-group="lefs" min="0" max="4" placeholder="4" /></td></tr>
      <tr><td class="text-center font-mono">2</td><td>Your usual hobbies, recreational, or sporting activities</td><td><input type="number" class="excel-input" data-group="lefs" min="0" max="4" placeholder="4" /></td></tr>
      <tr><td class="text-center font-mono">3</td><td>Getting into or out of the bath</td><td><input type="number" class="excel-input" data-group="lefs" min="0" max="4" placeholder="4" /></td></tr>
      <tr><td class="text-center font-mono">4</td><td>Walking between rooms</td><td><input type="number" class="excel-input" data-group="lefs" min="0" max="4" placeholder="4" /></td></tr>
      <tr><td class="text-center font-mono">5</td><td>Putting on your shoes or socks</td><td><input type="number" class="excel-input" data-group="lefs" min="0" max="4" placeholder="4" /></td></tr>
      <tr><td class="text-center font-mono">6</td><td>Squatting</td><td><input type="number" class="excel-input" data-group="lefs" min="0" max="4" placeholder="4" /></td></tr>
      <tr><td class="text-center font-mono">7</td><td>Lifting an object, like a bag of groceries, from the floor</td><td><input type="number" class="excel-input" data-group="lefs" min="0" max="4" placeholder="4" /></td></tr>
      <tr><td class="text-center font-mono">8</td><td>Performing light activities around your home</td><td><input type="number" class="excel-input" data-group="lefs" min="0" max="4" placeholder="4" /></td></tr>
      <tr><td class="text-center font-mono">9</td><td>Performing heavy activities around your home</td><td><input type="number" class="excel-input" data-group="lefs" min="0" max="4" placeholder="4" /></td></tr>
      <tr><td class="text-center font-mono">10</td><td>Getting into or out of a car</td><td><input type="number" class="excel-input" data-group="lefs" min="0" max="4" placeholder="4" /></td></tr>
      <tr><td class="text-center font-mono">11</td><td>Walking 2 blocks (approx. 400 meters)</td><td><input type="number" class="excel-input" data-group="lefs" min="0" max="4" placeholder="4" /></td></tr>
      <tr><td class="text-center font-mono">12</td><td>Walking a mile (approx. 1.6 km)</td><td><input type="number" class="excel-input" data-group="lefs" min="0" max="4" placeholder="4" /></td></tr>
      <tr><td class="text-center font-mono">13</td><td>Going up or down 10 stairs (about 1 flight)</td><td><input type="number" class="excel-input" data-group="lefs" min="0" max="4" placeholder="4" /></td></tr>
      <tr><td class="text-center font-mono">14</td><td>Standing for 1 hour</td><td><input type="number" class="excel-input" data-group="lefs" min="0" max="4" placeholder="4" /></td></tr>
      <tr><td class="text-center font-mono">15</td><td>Sitting for 1 hour</td><td><input type="number" class="excel-input" data-group="lefs" min="0" max="4" placeholder="4" /></td></tr>
      <tr><td class="text-center font-mono">16</td><td>Running on even ground</td><td><input type="number" class="excel-input" data-group="lefs" min="0" max="4" placeholder="4" /></td></tr>
      <tr><td class="text-center font-mono">17</td><td>Running on uneven ground</td><td><input type="number" class="excel-input" data-group="lefs" min="0" max="4" placeholder="4" /></td></tr>
      <tr><td class="text-center font-mono">18</td><td>Making sharp turns while running fast (cutting)</td><td><input type="number" class="excel-input" data-group="lefs" min="0" max="4" placeholder="4" /></td></tr>
      <tr><td class="text-center font-mono">19</td><td>Hopping</td><td><input type="number" class="excel-input" data-group="lefs" min="0" max="4" placeholder="4" /></td></tr>
      <tr><td class="text-center font-mono">20</td><td>Rolling over in bed</td><td><input type="number" class="excel-input" data-group="lefs" min="0" max="4" placeholder="4" /></td></tr>
      <tr class="excel-total-row">
        <td colspan="2" class="font-bold">
          Total Score: <span class="excel-sum font-mono" data-sum-target="lefs">0</span> / 80 &bull; 
          Functional Level: <span class="excel-percent font-mono text-indigo-600 dark:text-indigo-400" data-percent-target="lefs" data-max="80">0%</span>
        </td>
        <td class="text-center font-mono font-bold text-indigo-600 dark:text-indigo-400">
          <span class="excel-sum" data-sum-target="lefs">0</span> / 80
        </td>
      </tr>
    </tbody>
  </table>
</div>

**Clinical Interpretation:**
- Maximum Score: 80 points (100% normal function). Lower score indicates greater functional limitation.
- *Minimal Detectable Change (MDC90):* **9 points**.
- *Minimal Clinically Important Difference (MCID):* **9 points**.`
  },

  // ── 5. !QUICKDASH ────────────────────────────────────────────────────────
  {
    trigger_prefix: '!',
    code: 'QUICKDASH',
    title: 'QuickDASH Upper Extremity Outcome Measure',
    category: 'outcome_measures',
    content: `### QuickDASH (Disabilities of the Arm, Shoulder and Hand)

*Rating Scale: 1 = No difficulty &bull; 2 = Mild difficulty &bull; 3 = Moderate difficulty &bull; 4 = Severe difficulty &bull; 5 = Unable*

<div class="excel-table-wrap">
  <table class="excel-table" data-calc-group="qdash">
    <thead>
      <tr>
        <th style="width: 50px;" class="text-center">#<div class="col-resizer"></div></th>
        <th>Task / Symptom Statement<div class="col-resizer"></div></th>
        <th style="width: 100px;" class="text-center">Score (1-5)<div class="col-resizer"></div></th>
      </tr>
    </thead>
    <tbody>
      <tr><td class="text-center font-mono">1</td><td>Open a tight or new jar</td><td><input type="number" class="excel-input" data-group="qdash" min="1" max="5" placeholder="1" /></td></tr>
      <tr><td class="text-center font-mono">2</td><td>Do heavy household chores (e.g., wash walls, wash floors)</td><td><input type="number" class="excel-input" data-group="qdash" min="1" max="5" placeholder="1" /></td></tr>
      <tr><td class="text-center font-mono">3</td><td>Carry a shopping bag or briefcase</td><td><input type="number" class="excel-input" data-group="qdash" min="1" max="5" placeholder="1" /></td></tr>
      <tr><td class="text-center font-mono">4</td><td>Wash your back</td><td><input type="number" class="excel-input" data-group="qdash" min="1" max="5" placeholder="1" /></td></tr>
      <tr><td class="text-center font-mono">5</td><td>Use a knife to cut food</td><td><input type="number" class="excel-input" data-group="qdash" min="1" max="5" placeholder="1" /></td></tr>
      <tr><td class="text-center font-mono">6</td><td>Recreational activities with force/impact through arm/hand</td><td><input type="number" class="excel-input" data-group="qdash" min="1" max="5" placeholder="1" /></td></tr>
      <tr><td class="text-center font-mono">7</td><td>Social interference (extent arm interfered with normal social activities)</td><td><input type="number" class="excel-input" data-group="qdash" min="1" max="5" placeholder="1" /></td></tr>
      <tr><td class="text-center font-mono">8</td><td>Work limitation (limited in work or other regular daily activities)</td><td><input type="number" class="excel-input" data-group="qdash" min="1" max="5" placeholder="1" /></td></tr>
      <tr><td class="text-center font-mono">9</td><td>Arm, shoulder or hand pain severity</td><td><input type="number" class="excel-input" data-group="qdash" min="1" max="5" placeholder="1" /></td></tr>
      <tr><td class="text-center font-mono">10</td><td>Tingling (pins and needles) in arm, shoulder or hand</td><td><input type="number" class="excel-input" data-group="qdash" min="1" max="5" placeholder="1" /></td></tr>
      <tr><td class="text-center font-mono">11</td><td>Difficulty sleeping because of pain in arm, shoulder or hand</td><td><input type="number" class="excel-input" data-group="qdash" min="1" max="5" placeholder="1" /></td></tr>
      <tr class="excel-total-row">
        <td colspan="2" class="font-bold">
          QuickDASH Raw Sum: <span class="excel-sum font-mono" data-sum-target="qdash">11</span> (Min 11, Max 55) &bull; 
          Disability Score: <span class="font-mono text-indigo-600 dark:text-indigo-400" data-dash-formula-target="qdash">0.0%</span>
        </td>
        <td class="text-center font-mono font-bold text-indigo-600 dark:text-indigo-400">
          <span class="excel-sum" data-sum-target="qdash">11</span>
        </td>
      </tr>
    </tbody>
  </table>
</div>

**Calculation Formula:**
- *QuickDASH Score = [ (Sum of completed items / n) - 1 ] &times; 25*
- 0 = No disability &bull; 100 = Maximum disability
- *MCID:* **15.9 points**.`
  },

  // ── 6. !DASH ─────────────────────────────────────────────────────────────
  {
    trigger_prefix: '!',
    code: 'DASH',
    title: 'Disabilities of the Arm, Shoulder and Hand (DASH 30-Item)',
    category: 'outcome_measures',
    content: `### DASH (30-Item Full Upper Extremity Questionnaire)

<div class="excel-table-wrap">
  <table class="excel-table" data-calc-group="dash">
    <thead>
      <tr>
        <th style="width: 180px;">Subscale / Domain<div class="col-resizer"></div></th>
        <th style="width: 90px;" class="text-center">Items<div class="col-resizer"></div></th>
        <th style="width: 130px;" class="text-center">Raw Sum (1-5 each)<div class="col-resizer"></div></th>
        <th style="width: 140px;" class="text-center">Transformed (0-100)<div class="col-resizer"></div></th>
        <th>Clinical Status / Notes<div class="col-resizer"></div></th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td class="font-semibold">Core Disability / Symptoms</td>
        <td class="text-center font-mono">30 items</td>
        <td><input type="number" class="excel-input" data-group="dash-core" min="30" max="150" placeholder="30" /></td>
        <td><input type="text" class="excel-input text-center" placeholder="0 - 100%" /></td>
        <td><input type="text" class="excel-input" placeholder="MCID: 10.2 points" /></td>
      </tr>
      <tr>
        <td class="font-semibold">Work Module (Optional)</td>
        <td class="text-center font-mono">4 items</td>
        <td><input type="number" class="excel-input" min="4" max="20" placeholder="4" /></td>
        <td><input type="text" class="excel-input text-center" placeholder="0 - 100%" /></td>
        <td><input type="text" class="excel-input" placeholder="Heavy physical occupational demands" /></td>
      </tr>
      <tr>
        <td class="font-semibold">Sports / Performing Arts</td>
        <td class="text-center font-mono">4 items</td>
        <td><input type="number" class="excel-input" min="4" max="20" placeholder="4" /></td>
        <td><input type="text" class="excel-input text-center" placeholder="0 - 100%" /></td>
        <td><input type="text" class="excel-input" placeholder="Overhead / impact athletics" /></td>
      </tr>
      <tr class="excel-total-row">
        <td colspan="3" class="font-bold">Overall DASH Disability Metric: [ (Sum/30) - 1 ] &times; 25</td>
        <td class="text-center font-mono font-bold text-indigo-600 dark:text-indigo-400">Transformed %</td>
        <td><span class="risk-pill risk-low">Minimal Impairment</span></td>
      </tr>
    </tbody>
  </table>
</div>`
  },

  // ── 7. !KOOS ─────────────────────────────────────────────────────────────
  {
    trigger_prefix: '!',
    code: 'KOOS',
    title: 'Knee Injury and Osteoarthritis Outcome Score (KOOS)',
    category: 'outcome_measures',
    content: `### Knee Injury and Osteoarthritis Outcome Score (KOOS)

*Scoring: 0 to 100 per subscale (0 = Extreme knee problems &bull; 100 = No knee problems)*

<div class="excel-table-wrap">
  <table class="excel-table">
    <thead>
      <tr>
        <th style="width: 200px;">KOOS Subscale Dimension<div class="col-resizer"></div></th>
        <th style="width: 110px;" class="text-center">Baseline (0-100)<div class="col-resizer"></div></th>
        <th style="width: 110px;" class="text-center">Follow-up (0-100)<div class="col-resizer"></div></th>
        <th style="width: 90px;" class="text-center">Change (&Delta;)<div class="col-resizer"></div></th>
        <th>Clinical Status / Target Goal<div class="col-resizer"></div></th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td class="font-semibold">1. Pain (9 items)</td>
        <td><input type="number" class="excel-input" min="0" max="100" placeholder="100" /></td>
        <td><input type="number" class="excel-input" min="0" max="100" placeholder="100" /></td>
        <td><input type="text" class="excel-input text-center" placeholder="+0" /></td>
        <td><input type="text" class="excel-input" placeholder="MCID: 8-10 points" /></td>
      </tr>
      <tr>
        <td class="font-semibold">2. Other Symptoms (7 items)</td>
        <td><input type="number" class="excel-input" min="0" max="100" placeholder="100" /></td>
        <td><input type="number" class="excel-input" min="0" max="100" placeholder="100" /></td>
        <td><input type="text" class="excel-input text-center" placeholder="+0" /></td>
        <td><input type="text" class="excel-input" placeholder="Swelling, clicking, stiffness" /></td>
      </tr>
      <tr>
        <td class="font-semibold">3. ADL Function (17 items)</td>
        <td><input type="number" class="excel-input" min="0" max="100" placeholder="100" /></td>
        <td><input type="number" class="excel-input" min="0" max="100" placeholder="100" /></td>
        <td><input type="text" class="excel-input text-center" placeholder="+0" /></td>
        <td><input type="text" class="excel-input" placeholder="Stairs, rising, walking" /></td>
      </tr>
      <tr>
        <td class="font-semibold">4. Sport &amp; Recreation (5 items)</td>
        <td><input type="number" class="excel-input" min="0" max="100" placeholder="100" /></td>
        <td><input type="number" class="excel-input" min="0" max="100" placeholder="100" /></td>
        <td><input type="text" class="excel-input" placeholder="+0" /></td>
        <td><input type="text" class="excel-input" placeholder="Squatting, jumping, pivoting" /></td>
      </tr>
      <tr>
        <td class="font-semibold">5. Knee-Related QOL (4 items)</td>
        <td><input type="number" class="excel-input" min="0" max="100" placeholder="100" /></td>
        <td><input type="number" class="excel-input" min="0" max="100" placeholder="100" /></td>
        <td><input type="text" class="excel-input text-center" placeholder="+0" /></td>
        <td><input type="text" class="excel-input" placeholder="Awareness, lifestyle modification" /></td>
      </tr>
      <tr class="excel-total-row">
        <td colspan="4" class="font-bold">Subscales must not be aggregated into an unweighted total. Each dimension tracked independently.</td>
        <td class="font-bold text-indigo-600 dark:text-indigo-400">MCID: 8 - 10 pts</td>
      </tr>
    </tbody>
  </table>
</div>`
  },

  // ── 8. !KOOS-PS ──────────────────────────────────────────────────────────
  {
    trigger_prefix: '!',
    code: 'KOOS-PS',
    title: 'KOOS Physical Function Short-Form (KOOS-PS)',
    category: 'outcome_measures',
    content: `### KOOS Physical Function Short-Form (KOOS-PS)

*Scoring: 0 = None &bull; 1 = Mild &bull; 2 = Moderate &bull; 3 = Severe &bull; 4 = Extreme*

<div class="excel-table-wrap">
  <table class="excel-table" data-calc-group="koos-ps">
    <thead>
      <tr>
        <th style="width: 50px;" class="text-center">#<div class="col-resizer"></div></th>
        <th>Physical Function Activity<div class="col-resizer"></div></th>
        <th style="width: 100px;" class="text-center">Score (0-4)<div class="col-resizer"></div></th>
      </tr>
    </thead>
    <tbody>
      <tr><td class="text-center font-mono">1</td><td>Rising from bed</td><td><input type="number" class="excel-input" data-group="koos-ps" min="0" max="4" placeholder="0" /></td></tr>
      <tr><td class="text-center font-mono">2</td><td>Putting on socks / stockings</td><td><input type="number" class="excel-input" data-group="koos-ps" min="0" max="4" placeholder="0" /></td></tr>
      <tr><td class="text-center font-mono">3</td><td>Rising from sitting</td><td><input type="number" class="excel-input" data-group="koos-ps" min="0" max="4" placeholder="0" /></td></tr>
      <tr><td class="text-center font-mono">4</td><td>Bending to floor / picking up an object</td><td><input type="number" class="excel-input" data-group="koos-ps" min="0" max="4" placeholder="0" /></td></tr>
      <tr><td class="text-center font-mono">5</td><td>Twisting / pivoting on your injured knee</td><td><input type="number" class="excel-input" data-group="koos-ps" min="0" max="4" placeholder="0" /></td></tr>
      <tr><td class="text-center font-mono">6</td><td>Kneeling</td><td><input type="number" class="excel-input" data-group="koos-ps" min="0" max="4" placeholder="0" /></td></tr>
      <tr><td class="text-center font-mono">7</td><td>Squatting</td><td><input type="number" class="excel-input" data-group="koos-ps" min="0" max="4" placeholder="0" /></td></tr>
      <tr class="excel-total-row">
        <td colspan="2" class="font-bold">
          Raw Total (0 - 28): <span class="excel-sum font-mono" data-sum-target="koos-ps">0</span> &bull; 
          Interval Score (0-100, where 0 = no difficulty): <span class="font-mono text-indigo-600 dark:text-indigo-400" data-percent-target="koos-ps" data-max="28">0.0</span>
        </td>
        <td class="text-center font-mono font-bold text-indigo-600 dark:text-indigo-400">
          <span class="excel-sum" data-sum-target="koos-ps">0</span> / 28
        </td>
      </tr>
    </tbody>
  </table>
</div>`
  },

  // ── 9. !HOOS ─────────────────────────────────────────────────────────────
  {
    trigger_prefix: '!',
    code: 'HOOS',
    title: 'Hip Disability and Osteoarthritis Outcome Score (HOOS)',
    category: 'outcome_measures',
    content: `### Hip Disability and Osteoarthritis Outcome Score (HOOS)

<div class="excel-table-wrap">
  <table class="excel-table">
    <thead>
      <tr>
        <th style="width: 200px;">HOOS Subscale<div class="col-resizer"></div></th>
        <th style="width: 110px;" class="text-center">Baseline (0-100)<div class="col-resizer"></div></th>
        <th style="width: 110px;" class="text-center">Follow-up (0-100)<div class="col-resizer"></div></th>
        <th style="width: 90px;" class="text-center">Change (&Delta;)<div class="col-resizer"></div></th>
        <th>Clinical Target / Norms<div class="col-resizer"></div></th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td class="font-semibold">1. Pain (10 items)</td>
        <td><input type="number" class="excel-input" min="0" max="100" placeholder="100" /></td>
        <td><input type="number" class="excel-input" min="0" max="100" placeholder="100" /></td>
        <td><input type="text" class="excel-input text-center" placeholder="+0" /></td>
        <td><input type="text" class="excel-input" placeholder="MCID: 9-10 points" /></td>
      </tr>
      <tr>
        <td class="font-semibold">2. Symptoms &amp; Stiffness (5 items)</td>
        <td><input type="number" class="excel-input" min="0" max="100" placeholder="100" /></td>
        <td><input type="number" class="excel-input" min="0" max="100" placeholder="100" /></td>
        <td><input type="text" class="excel-input text-center" placeholder="+0" /></td>
        <td><input type="text" class="excel-input" placeholder="Morning &amp; sitting stiffness" /></td>
      </tr>
      <tr>
        <td class="font-semibold">3. ADL Function (17 items)</td>
        <td><input type="number" class="excel-input" min="0" max="100" placeholder="100" /></td>
        <td><input type="number" class="excel-input" min="0" max="100" placeholder="100" /></td>
        <td><input type="text" class="excel-input text-center" placeholder="+0" /></td>
        <td><input type="text" class="excel-input" placeholder="Stairs, socks, car entry" /></td>
      </tr>
      <tr>
        <td class="font-semibold">4. Sport &amp; Recreation (4 items)</td>
        <td><input type="number" class="excel-input" min="0" max="100" placeholder="100" /></td>
        <td><input type="number" class="excel-input" min="0" max="100" placeholder="100" /></td>
        <td><input type="text" class="excel-input text-center" placeholder="+0" /></td>
        <td><input type="text" class="excel-input" placeholder="Deep squatting, twisting" /></td>
      </tr>
      <tr>
        <td class="font-semibold">5. Hip-Related QOL (4 items)</td>
        <td><input type="number" class="excel-input" min="0" max="100" placeholder="100" /></td>
        <td><input type="number" class="excel-input" min="0" max="100" placeholder="100" /></td>
        <td><input type="text" class="excel-input text-center" placeholder="+0" /></td>
        <td><input type="text" class="excel-input" placeholder="Lifestyle modifications" /></td>
      </tr>
      <tr class="excel-total-row">
        <td colspan="4" class="font-bold">100 indicates best possible hip status &bull; 0 indicates worst possible symptoms</td>
        <td class="font-bold text-indigo-600 dark:text-indigo-400">MCID: 9 - 10 pts</td>
      </tr>
    </tbody>
  </table>
</div>`
  },

  // ── 10. !IKDC ────────────────────────────────────────────────────────────
  {
    trigger_prefix: '!',
    code: 'IKDC',
    title: 'IKDC Subjective Knee Evaluation Form',
    category: 'outcome_measures',
    content: `### IKDC Subjective Knee Evaluation Form

<div class="excel-table-wrap">
  <table class="excel-table" data-calc-group="ikdc">
    <thead>
      <tr>
        <th style="width: 200px;">Domain Section<div class="col-resizer"></div></th>
        <th style="width: 130px;" class="text-center">Items Assessed<div class="col-resizer"></div></th>
        <th style="width: 120px;" class="text-center">Subtotal<div class="col-resizer"></div></th>
        <th>Clinical Finding &amp; Sports Tolerance<div class="col-resizer"></div></th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td class="font-semibold">1. Symptoms &amp; Pain</td>
        <td class="text-center">Pain, swelling, locking, giving way</td>
        <td><input type="number" class="excel-input" data-group="ikdc" min="0" max="40" placeholder="0" /></td>
        <td><input type="text" class="excel-input" placeholder="Giving way on pivoting / cutting" /></td>
      </tr>
      <tr>
        <td class="font-semibold">2. Sports &amp; Daily Activities</td>
        <td class="text-center">Stairs, squatting, jumping, pivoting</td>
        <td><input type="number" class="excel-input" data-group="ikdc" min="0" max="45" placeholder="0" /></td>
        <td><input type="text" class="excel-input" placeholder="Return to competitive athletics" /></td>
      </tr>
      <tr>
        <td class="font-semibold">3. Knee Function Rating</td>
        <td class="text-center">Current knee function (0-10 scale)</td>
        <td><input type="number" class="excel-input" data-group="ikdc" min="0" max="10" placeholder="0" /></td>
        <td><input type="text" class="excel-input" placeholder="Prior to injury level = 10" /></td>
      </tr>
      <tr class="excel-total-row">
        <td colspan="2" class="font-bold">
          Transformed IKDC Score: [ Raw Score / Maximum Possible ] &times; 100
        </td>
        <td class="text-center font-mono font-bold text-indigo-600 dark:text-indigo-400">
          <span class="excel-sum" data-sum-target="ikdc">0</span> / 100
        </td>
        <td class="font-bold text-indigo-600 dark:text-indigo-400">MCID: 11.5 points</td>
      </tr>
    </tbody>
  </table>
</div>`
  },

  // ── 11. !VISA-A ──────────────────────────────────────────────────────────
  {
    trigger_prefix: '!',
    code: 'VISA-A',
    title: 'Victorian Institute of Sport Assessment - Achilles (VISA-A)',
    category: 'outcome_measures',
    content: `### VISA-A (Achilles Tendinopathy Clinical Assessment)

*Score Range: 0 to 100 (100 = completely asymptomatic tendon &bull; &lt;60 = severe impairment)*

<div class="excel-table-wrap">
  <table class="excel-table" data-calc-group="visa-a">
    <thead>
      <tr>
        <th style="width: 50px;" class="text-center">#<div class="col-resizer"></div></th>
        <th>Item Clinical Question<div class="col-resizer"></div></th>
        <th style="width: 110px;" class="text-center">Points (0-10)<div class="col-resizer"></div></th>
      </tr>
    </thead>
    <tbody>
      <tr><td class="text-center font-mono">1</td><td>Morning stiffness duration in Achilles tendon (0 = &gt;2 hrs &bull; 10 = none)</td><td><input type="number" class="excel-input" data-group="visa-a" min="0" max="10" placeholder="10" /></td></tr>
      <tr><td class="text-center font-mono">2</td><td>Pain on stretching / touching tendon (0 = severe &bull; 10 = none)</td><td><input type="number" class="excel-input" data-group="visa-a" min="0" max="10" placeholder="10" /></td></tr>
      <tr><td class="text-center font-mono">3</td><td>Pain after walking flat for 2 hours (0 = severe &bull; 10 = none)</td><td><input type="number" class="excel-input" data-group="visa-a" min="0" max="10" placeholder="10" /></td></tr>
      <tr><td class="text-center font-mono">4</td><td>Pain on first 20-30 steps in the morning (0 = severe &bull; 10 = none)</td><td><input type="number" class="excel-input" data-group="visa-a" min="0" max="10" placeholder="10" /></td></tr>
      <tr><td class="text-center font-mono">5</td><td>Pain on single-leg heel raise on flat (0 = unable &bull; 10 = none)</td><td><input type="number" class="excel-input" data-group="visa-a" min="0" max="10" placeholder="10" /></td></tr>
      <tr><td class="text-center font-mono">6</td><td>Single-leg hops on flat ground (0 = unable &bull; 10 = &ge;10 hops pain-free)</td><td><input type="number" class="excel-input" data-group="visa-a" min="0" max="10" placeholder="10" /></td></tr>
      <tr><td class="text-center font-mono">7</td><td>Current sport / physical activity participation (0 = nil &bull; 10 = full unmodified)</td><td><input type="number" class="excel-input" data-group="visa-a" min="0" max="10" placeholder="10" /></td></tr>
      <tr><td class="text-center font-mono">8</td><td>Sport duration and tendon load tolerance (0 = none &bull; Max 30 points)</td><td><input type="number" class="excel-input" data-group="visa-a" min="0" max="30" placeholder="30" /></td></tr>
      <tr class="excel-total-row">
        <td colspan="2" class="font-bold">
          Total VISA-A Score: <span class="excel-sum font-mono" data-sum-target="visa-a">0</span> / 100 &bull; 
          Status: <span class="risk-pill risk-low" data-cutoff-target="visa-a" data-cutoff-val="60">Asymptomatic / Recovered</span>
        </td>
        <td class="text-center font-mono font-bold text-indigo-600 dark:text-indigo-400">
          <span class="excel-sum" data-sum-target="visa-a">0</span> / 100
        </td>
      </tr>
    </tbody>
  </table>
</div>

**Clinical Cutoffs:**
- **&lt; 60:** Severe tendinopathy impairment. Requires isometric &amp; heavy-slow resistance (HSR) protocol.
- **60 - 89:** Moderate disability. Progressing plyometrics and energy storage.
- **&ge; 90:** Asymptomatic / full athletic participation clearance.
- *MCID:* **12 - 14 points**.`
  },

  // ── 12. !VISA-P ──────────────────────────────────────────────────────────
  {
    trigger_prefix: '!',
    code: 'VISA-P',
    title: 'Victorian Institute of Sport Assessment - Patellar (VISA-P)',
    category: 'outcome_measures',
    content: `### VISA-P (Patellar Tendinopathy / Jumper's Knee)

<div class="excel-table-wrap">
  <table class="excel-table" data-calc-group="visa-p">
    <thead>
      <tr>
        <th style="width: 50px;" class="text-center">#<div class="col-resizer"></div></th>
        <th>Clinical Dimension Statement<div class="col-resizer"></div></th>
        <th style="width: 110px;" class="text-center">Points (0-10)<div class="col-resizer"></div></th>
      </tr>
    </thead>
    <tbody>
      <tr><td class="text-center font-mono">1</td><td>Sitting pain &gt; 2 hours with knees bent</td><td><input type="number" class="excel-input" data-group="visa-p" min="0" max="10" placeholder="10" /></td></tr>
      <tr><td class="text-center font-mono">2</td><td>Pain on descending stairs</td><td><input type="number" class="excel-input" data-group="visa-p" min="0" max="10" placeholder="10" /></td></tr>
      <tr><td class="text-center font-mono">3</td><td>Pain on knee extension with knee straightened</td><td><input type="number" class="excel-input" data-group="visa-p" min="0" max="10" placeholder="10" /></td></tr>
      <tr><td class="text-center font-mono">4</td><td>Pain on full single-leg squat</td><td><input type="number" class="excel-input" data-group="visa-p" min="0" max="10" placeholder="10" /></td></tr>
      <tr><td class="text-center font-mono">5</td><td>Pain on lunging</td><td><input type="number" class="excel-input" data-group="visa-p" min="0" max="10" placeholder="10" /></td></tr>
      <tr><td class="text-center font-mono">6</td><td>Pain on jumping / hopping x 10</td><td><input type="number" class="excel-input" data-group="visa-p" min="0" max="10" placeholder="10" /></td></tr>
      <tr><td class="text-center font-mono">7</td><td>Current sports participation restriction</td><td><input type="number" class="excel-input" data-group="visa-p" min="0" max="10" placeholder="10" /></td></tr>
      <tr><td class="text-center font-mono">8</td><td>Sport duration and load tolerance (Max 30 points)</td><td><input type="number" class="excel-input" data-group="visa-p" min="0" max="30" placeholder="30" /></td></tr>
      <tr class="excel-total-row">
        <td colspan="2" class="font-bold">
          Total VISA-P Score: <span class="excel-sum font-mono" data-sum-target="visa-p">0</span> / 100
        </td>
        <td class="text-center font-mono font-bold text-indigo-600 dark:text-indigo-400">
          <span class="excel-sum" data-sum-target="visa-p">0</span> / 100
        </td>
      </tr>
    </tbody>
  </table>
</div>`
  },

  // ── 13. !FADI ────────────────────────────────────────────────────────────
  {
    trigger_prefix: '!',
    code: 'FADI',
    title: 'Foot and Ankle Disability Index (FADI)',
    category: 'outcome_measures',
    content: `### Foot and Ankle Disability Index (FADI)

<div class="excel-table-wrap">
  <table class="excel-table" data-calc-group="fadi">
    <thead>
      <tr>
        <th style="width: 200px;">FADI Subscale<div class="col-resizer"></div></th>
        <th style="width: 100px;" class="text-center">Items<div class="col-resizer"></div></th>
        <th style="width: 120px;" class="text-center">Raw Score<div class="col-resizer"></div></th>
        <th style="width: 120px;" class="text-center">Max Score<div class="col-resizer"></div></th>
        <th>Calculated Function (%)<div class="col-resizer"></div></th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td class="font-semibold">ADL Subscale</td>
        <td class="text-center font-mono">22 items</td>
        <td><input type="number" class="excel-input" data-group="fadi-adl" min="0" max="88" placeholder="88" /></td>
        <td class="text-center font-mono">88 pts</td>
        <td><span class="font-mono font-semibold" data-percent-target="fadi-adl" data-max="88">100%</span></td>
      </tr>
      <tr>
        <td class="font-semibold">Sports Subscale (FADI Sport)</td>
        <td class="text-center font-mono">8 items</td>
        <td><input type="number" class="excel-input" data-group="fadi-sport" min="0" max="32" placeholder="32" /></td>
        <td class="text-center font-mono">32 pts</td>
        <td><span class="font-mono font-semibold" data-percent-target="fadi-sport" data-max="32">100%</span></td>
      </tr>
      <tr class="excel-total-row">
        <td colspan="2" class="font-bold">Total Combined FADI:</td>
        <td class="text-center font-mono font-bold text-indigo-600 dark:text-indigo-400"><span class="excel-sum" data-sum-target="fadi">0</span></td>
        <td class="text-center font-mono font-bold">120 pts</td>
        <td><span class="risk-pill risk-low">MCID: 8.0 points</span></td>
      </tr>
    </tbody>
  </table>
</div>`
  },

  // ── 14. !FAAM ────────────────────────────────────────────────────────────
  {
    trigger_prefix: '!',
    code: 'FAAM',
    title: 'Foot and Ankle Ability Measure (FAAM)',
    category: 'outcome_measures',
    content: `### Foot and Ankle Ability Measure (FAAM)

<div class="excel-table-wrap">
  <table class="excel-table">
    <thead>
      <tr>
        <th style="width: 200px;">FAAM Subscale<div class="col-resizer"></div></th>
        <th style="width: 100px;" class="text-center">Items<div class="col-resizer"></div></th>
        <th style="width: 120px;" class="text-center">Raw Score<div class="col-resizer"></div></th>
        <th style="width: 120px;" class="text-center">Max Score<div class="col-resizer"></div></th>
        <th>Ability Metric (% &amp; MCID)<div class="col-resizer"></div></th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td class="font-semibold">ADL Subscale</td>
        <td class="text-center font-mono">21 items</td>
        <td><input type="number" class="excel-input" min="0" max="84" placeholder="84" /></td>
        <td class="text-center font-mono">84 pts</td>
        <td><input type="text" class="excel-input" placeholder="MCID: 8 points" /></td>
      </tr>
      <tr>
        <td class="font-semibold">Sports Subscale</td>
        <td class="text-center font-mono">8 items</td>
        <td><input type="number" class="excel-input" min="0" max="32" placeholder="32" /></td>
        <td class="text-center font-mono">32 pts</td>
        <td><input type="text" class="excel-input" placeholder="MCID: 9 points" /></td>
      </tr>
      <tr class="excel-total-row">
        <td colspan="4" class="font-bold">Higher percentage indicates higher level of function (100% = full ability).</td>
        <td class="font-bold text-indigo-600 dark:text-indigo-400">Subscales reported separately</td>
      </tr>
    </tbody>
  </table>
</div>`
  },

  // ── 15. !SPADI ───────────────────────────────────────────────────────────
  {
    trigger_prefix: '!',
    code: 'SPADI',
    title: 'Shoulder Pain and Disability Index (SPADI)',
    category: 'outcome_measures',
    content: `### Shoulder Pain and Disability Index (SPADI)

<div class="excel-table-wrap">
  <table class="excel-table" data-calc-group="spadi">
    <thead>
      <tr>
        <th style="width: 220px;">Subscale Dimension<div class="col-resizer"></div></th>
        <th style="width: 100px;" class="text-center">Items<div class="col-resizer"></div></th>
        <th style="width: 120px;" class="text-center">Sum Score<div class="col-resizer"></div></th>
        <th style="width: 110px;" class="text-center">Max Possible<div class="col-resizer"></div></th>
        <th>Calculated Subscale (%)<div class="col-resizer"></div></th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td class="font-semibold">Pain Subscale</td>
        <td class="text-center font-mono">5 items (0-10)</td>
        <td><input type="number" class="excel-input" data-group="spadi-pain" min="0" max="50" placeholder="0" /></td>
        <td class="text-center font-mono">50</td>
        <td><span class="font-mono font-semibold" data-percent-target="spadi-pain" data-max="50">0%</span></td>
      </tr>
      <tr>
        <td class="font-semibold">Disability Subscale</td>
        <td class="text-center font-mono">8 items (0-10)</td>
        <td><input type="number" class="excel-input" data-group="spadi-dis" min="0" max="80" placeholder="0" /></td>
        <td class="text-center font-mono">80</td>
        <td><span class="font-mono font-semibold" data-percent-target="spadi-dis" data-max="80">0%</span></td>
      </tr>
      <tr class="excel-total-row">
        <td colspan="2" class="font-bold">
          Total SPADI Score: [ (Pain Sum + Disability Sum) / 130 ] &times; 100
        </td>
        <td class="text-center font-mono font-bold text-indigo-600 dark:text-indigo-400">
          <span class="excel-sum" data-sum-target="spadi">0</span>
        </td>
        <td class="text-center font-mono font-bold">130</td>
        <td class="font-bold text-indigo-600 dark:text-indigo-400">
          MCID: 10 - 18 points
        </td>
      </tr>
    </tbody>
  </table>
</div>`
  },

  // ── 16. !ASES ────────────────────────────────────────────────────────────
  {
    trigger_prefix: '!',
    code: 'ASES',
    title: 'American Shoulder and Elbow Surgeons Shoulder Score (ASES)',
    category: 'outcome_measures',
    content: `### American Shoulder and Elbow Surgeons Shoulder Score (ASES)

<div class="excel-table-wrap">
  <table class="excel-table">
    <thead>
      <tr>
        <th style="width: 220px;">ASES Component<div class="col-resizer"></div></th>
        <th style="width: 140px;" class="text-center">Raw Measure<div class="col-resizer"></div></th>
        <th style="width: 130px;" class="text-center">Formula Weight<div class="col-resizer"></div></th>
        <th>Calculated Sub-score (Max 50)<div class="col-resizer"></div></th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td class="font-semibold">Pain Visual Analog (0-10)</td>
        <td><input type="number" class="excel-input" min="0" max="10" placeholder="0" /></td>
        <td class="text-center font-mono text-xs">(10 - VAS) &times; 5</td>
        <td><input type="text" class="excel-input text-center font-mono" placeholder="50.0" /></td>
      </tr>
      <tr>
        <td class="font-semibold">10 Functional Activities (0-30)</td>
        <td><input type="number" class="excel-input" min="0" max="30" placeholder="30" /></td>
        <td class="text-center font-mono text-xs">(Raw Sum / 30) &times; 50</td>
        <td><input type="text" class="excel-input text-center font-mono" placeholder="50.0" /></td>
      </tr>
      <tr class="excel-total-row">
        <td colspan="3" class="font-bold">Total ASES Score (Pain + Function &bull; Max 100):</td>
        <td class="font-bold font-mono text-indigo-600 dark:text-indigo-400">
          <input type="text" class="excel-input font-bold text-center" placeholder="100 / 100" />
        </td>
      </tr>
    </tbody>
  </table>
</div>
*MCID: 6.4 - 9.7 points.*`
  },

  // ── 17. !PRWE ────────────────────────────────────────────────────────────
  {
    trigger_prefix: '!',
    code: 'PRWE',
    title: 'Patient-Rated Wrist Evaluation (PRWE)',
    category: 'outcome_measures',
    content: `### Patient-Rated Wrist Evaluation (PRWE)

<div class="excel-table-wrap">
  <table class="excel-table" data-calc-group="prwe">
    <thead>
      <tr>
        <th style="width: 220px;">Subscale Dimension<div class="col-resizer"></div></th>
        <th style="width: 110px;" class="text-center">Items (0-10)<div class="col-resizer"></div></th>
        <th style="width: 120px;" class="text-center">Subtotal<div class="col-resizer"></div></th>
        <th style="width: 120px;" class="text-center">Weighting<div class="col-resizer"></div></th>
        <th>Subscale Contribution<div class="col-resizer"></div></th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td class="font-semibold">1. Pain Subscale</td>
        <td class="text-center font-mono">5 items</td>
        <td><input type="number" class="excel-input" data-group="prwe-pain" min="0" max="50" placeholder="0" /></td>
        <td class="text-center font-mono">Direct (Max 50)</td>
        <td><span class="font-mono font-semibold" data-sum-target="prwe-pain">0</span> / 50</td>
      </tr>
      <tr>
        <td class="font-semibold">2. Function: Specific Tasks</td>
        <td class="text-center font-mono">6 items</td>
        <td><input type="number" class="excel-input" data-group="prwe-fn-spec" min="0" max="60" placeholder="0" /></td>
        <td class="text-center font-mono" rowspan="2">Sum / 2 (Max 50)</td>
        <td rowspan="2"><span class="font-mono font-semibold">Scaled 0 - 50</span></td>
      </tr>
      <tr>
        <td class="font-semibold">3. Function: Usual Activities</td>
        <td class="text-center font-mono">4 items</td>
        <td><input type="number" class="excel-input" data-group="prwe-fn-usual" min="0" max="40" placeholder="0" /></td>
      </tr>
      <tr class="excel-total-row">
        <td colspan="4" class="font-bold">
          Total PRWE Score: Pain Sum + [ (Specific + Usual Function) / 2 ]
        </td>
        <td class="font-bold text-indigo-600 dark:text-indigo-400">
          MCID: 11.5 points
        </td>
      </tr>
    </tbody>
  </table>
</div>`
  },

  // ── 18. !PREE ────────────────────────────────────────────────────────────
  {
    trigger_prefix: '!',
    code: 'PREE',
    title: 'Patient-Rated Elbow Evaluation (PREE)',
    category: 'outcome_measures',
    content: `### Patient-Rated Elbow Evaluation (PREE)

<div class="excel-table-wrap">
  <table class="excel-table">
    <thead>
      <tr>
        <th style="width: 220px;">PREE Subscale<div class="col-resizer"></div></th>
        <th style="width: 100px;" class="text-center">Items (0-10)<div class="col-resizer"></div></th>
        <th style="width: 120px;" class="text-center">Raw Score<div class="col-resizer"></div></th>
        <th style="width: 120px;" class="text-center">Max Possible<div class="col-resizer"></div></th>
        <th>Clinical Notes<div class="col-resizer"></div></th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td class="font-semibold">Pain Subscale</td>
        <td class="text-center font-mono">5 items</td>
        <td><input type="number" class="excel-input" min="0" max="50" placeholder="0" /></td>
        <td class="text-center font-mono">50 pts</td>
        <td><input type="text" class="excel-input" placeholder="Lateral epicondyle tenderness" /></td>
      </tr>
      <tr>
        <td class="font-semibold">Specific Function</td>
        <td class="text-center font-mono">10 items</td>
        <td><input type="number" class="excel-input" min="0" max="100" placeholder="0" /></td>
        <td class="text-center font-mono">100 pts</td>
        <td><input type="text" class="excel-input" placeholder="Gripping, carrying, turning doorknobs" /></td>
      </tr>
      <tr>
        <td class="font-semibold">Usual Function</td>
        <td class="text-center font-mono">5 items</td>
        <td><input type="number" class="excel-input" min="0" max="50" placeholder="0" /></td>
        <td class="text-center font-mono">50 pts</td>
        <td><input type="text" class="excel-input" placeholder="Personal care, household, work" /></td>
      </tr>
      <tr class="excel-total-row">
        <td colspan="4" class="font-bold">Total PREE Score = Pain + [ (Specific + Usual) / 3 ] (Max 100)</td>
        <td class="font-bold text-indigo-600 dark:text-indigo-400">MCID: 11 points</td>
      </tr>
    </tbody>
  </table>
</div>`
  },

  // ── 19. !RMDQ ────────────────────────────────────────────────────────────
  {
    trigger_prefix: '!',
    code: 'RMDQ',
    title: 'Roland-Morris Disability Questionnaire (RMDQ 24-Item)',
    category: 'outcome_measures',
    content: `### Roland-Morris Disability Questionnaire (RMDQ 24-Item)

*Instructions: Enter 1 for YES (applies today because of back) &bull; 0 for NO*

<div class="excel-table-wrap">
  <table class="excel-table" data-calc-group="rmdq">
    <thead>
      <tr>
        <th style="width: 50px;" class="text-center">#<div class="col-resizer"></div></th>
        <th>Statement Description<div class="col-resizer"></div></th>
        <th style="width: 90px;" class="text-center">Yes/No (1/0)<div class="col-resizer"></div></th>
      </tr>
    </thead>
    <tbody>
      <tr><td class="text-center font-mono">1</td><td>I stay at home most of the time because of my back.</td><td><input type="number" class="excel-input" data-group="rmdq" min="0" max="1" placeholder="0" /></td></tr>
      <tr><td class="text-center font-mono">2</td><td>I change position frequently to try and get my back comfortable.</td><td><input type="number" class="excel-input" data-group="rmdq" min="0" max="1" placeholder="0" /></td></tr>
      <tr><td class="text-center font-mono">3</td><td>I walk more slowly than usual because of my back.</td><td><input type="number" class="excel-input" data-group="rmdq" min="0" max="1" placeholder="0" /></td></tr>
      <tr><td class="text-center font-mono">4</td><td>Because of my back, I am not doing any jobs around the house.</td><td><input type="number" class="excel-input" data-group="rmdq" min="0" max="1" placeholder="0" /></td></tr>
      <tr><td class="text-center font-mono">5</td><td>Because of my back, I use a handrail to get upstairs.</td><td><input type="number" class="excel-input" data-group="rmdq" min="0" max="1" placeholder="0" /></td></tr>
      <tr><td class="text-center font-mono">6</td><td>Because of my back, I lie down to rest more often.</td><td><input type="number" class="excel-input" data-group="rmdq" min="0" max="1" placeholder="0" /></td></tr>
      <tr><td class="text-center font-mono">7</td><td>Because of my back, I have to hold on to something to get out of an easy chair.</td><td><input type="number" class="excel-input" data-group="rmdq" min="0" max="1" placeholder="0" /></td></tr>
      <tr><td class="text-center font-mono">8</td><td>Because of my back, I try to get other people to do things for me.</td><td><input type="number" class="excel-input" data-group="rmdq" min="0" max="1" placeholder="0" /></td></tr>
      <tr><td class="text-center font-mono">9</td><td>I get dressed more slowly than usual because of my back.</td><td><input type="number" class="excel-input" data-group="rmdq" min="0" max="1" placeholder="0" /></td></tr>
      <tr><td class="text-center font-mono">10</td><td>I only stand up for short periods of time because of my back.</td><td><input type="number" class="excel-input" data-group="rmdq" min="0" max="1" placeholder="0" /></td></tr>
      <tr><td class="text-center font-mono">11</td><td>Because of my back, I try not to bend or kneel down.</td><td><input type="number" class="excel-input" data-group="rmdq" min="0" max="1" placeholder="0" /></td></tr>
      <tr><td class="text-center font-mono">12</td><td>I find it difficult to get out of a chair because of my back.</td><td><input type="number" class="excel-input" data-group="rmdq" min="0" max="1" placeholder="0" /></td></tr>
      <tr><td class="text-center font-mono">13</td><td>My back is painful almost all of the time.</td><td><input type="number" class="excel-input" data-group="rmdq" min="0" max="1" placeholder="0" /></td></tr>
      <tr><td class="text-center font-mono">14</td><td>I find it difficult to turn over in bed because of my back.</td><td><input type="number" class="excel-input" data-group="rmdq" min="0" max="1" placeholder="0" /></td></tr>
      <tr><td class="text-center font-mono">15</td><td>My appetite is not very good because of my back.</td><td><input type="number" class="excel-input" data-group="rmdq" min="0" max="1" placeholder="0" /></td></tr>
      <tr><td class="text-center font-mono">16</td><td>I have trouble putting on socks because of the pain in my back.</td><td><input type="number" class="excel-input" data-group="rmdq" min="0" max="1" placeholder="0" /></td></tr>
      <tr><td class="text-center font-mono">17</td><td>I only walk short distances because of my back pain.</td><td><input type="number" class="excel-input" data-group="rmdq" min="0" max="1" placeholder="0" /></td></tr>
      <tr><td class="text-center font-mono">18</td><td>I sleep less well because of my back.</td><td><input type="number" class="excel-input" data-group="rmdq" min="0" max="1" placeholder="0" /></td></tr>
      <tr><td class="text-center font-mono">19</td><td>Because of my back, I get dressed with help from someone else.</td><td><input type="number" class="excel-input" data-group="rmdq" min="0" max="1" placeholder="0" /></td></tr>
      <tr><td class="text-center font-mono">20</td><td>I sit down for most of the day because of my back.</td><td><input type="number" class="excel-input" data-group="rmdq" min="0" max="1" placeholder="0" /></td></tr>
      <tr><td class="text-center font-mono">21</td><td>I avoid heavy jobs around the house because of my back.</td><td><input type="number" class="excel-input" data-group="rmdq" min="0" max="1" placeholder="0" /></td></tr>
      <tr><td class="text-center font-mono">22</td><td>Because of back pain, I am more irritable and bad tempered.</td><td><input type="number" class="excel-input" data-group="rmdq" min="0" max="1" placeholder="0" /></td></tr>
      <tr><td class="text-center font-mono">23</td><td>Because of my back, I go upstairs more slowly than usual.</td><td><input type="number" class="excel-input" data-group="rmdq" min="0" max="1" placeholder="0" /></td></tr>
      <tr><td class="text-center font-mono">24</td><td>I stay in bed most of the time because of my back.</td><td><input type="number" class="excel-input" data-group="rmdq" min="0" max="1" placeholder="0" /></td></tr>
      <tr class="excel-total-row">
        <td colspan="2" class="font-bold">
          Total RMDQ Score: <span class="excel-sum font-mono" data-sum-target="rmdq">0</span> / 24 &bull; 
          Interpretation: <span class="risk-pill risk-low">0 = No Disability &bull; 24 = Maximum Disability</span>
        </td>
        <td class="text-center font-mono font-bold text-indigo-600 dark:text-indigo-400">
          <span class="excel-sum" data-sum-target="rmdq">0</span> / 24
        </td>
      </tr>
    </tbody>
  </table>
</div>
*MCID: 3.5 - 5 points (or 30% reduction from baseline).*`
  },

  // ── 20. !QUEBEC ──────────────────────────────────────────────────────────
  {
    trigger_prefix: '!',
    code: 'QUEBEC',
    title: 'Quebec Back Pain Disability Scale',
    category: 'outcome_measures',
    content: `### Quebec Back Pain Disability Scale

*Scoring: 0 = Not difficult at all &bull; 1 = Minimally &bull; 2 = Somewhat &bull; 3 = Fairly difficult &bull; 4 = Very difficult &bull; 5 = Unable*

<div class="excel-table-wrap">
  <table class="excel-table" data-calc-group="quebec">
    <thead>
      <tr>
        <th style="width: 50px;" class="text-center">#<div class="col-resizer"></div></th>
        <th>Daily Functional Activity<div class="col-resizer"></div></th>
        <th style="width: 100px;" class="text-center">Score (0-5)<div class="col-resizer"></div></th>
      </tr>
    </thead>
    <tbody>
      <tr><td class="text-center font-mono">1</td><td>Get out of bed</td><td><input type="number" class="excel-input" data-group="quebec" min="0" max="5" placeholder="0" /></td></tr>
      <tr><td class="text-center font-mono">2</td><td>Sleep through the night</td><td><input type="number" class="excel-input" data-group="quebec" min="0" max="5" placeholder="0" /></td></tr>
      <tr><td class="text-center font-mono">3</td><td>Turn over in bed</td><td><input type="number" class="excel-input" data-group="quebec" min="0" max="5" placeholder="0" /></td></tr>
      <tr><td class="text-center font-mono">4</td><td>Ride in a car</td><td><input type="number" class="excel-input" data-group="quebec" min="0" max="5" placeholder="0" /></td></tr>
      <tr><td class="text-center font-mono">5</td><td>Stand up for 20-30 minutes</td><td><input type="number" class="excel-input" data-group="quebec" min="0" max="5" placeholder="0" /></td></tr>
      <tr><td class="text-center font-mono">6</td><td>Sit in a chair for several hours</td><td><input type="number" class="excel-input" data-group="quebec" min="0" max="5" placeholder="0" /></td></tr>
      <tr><td class="text-center font-mono">7</td><td>Climb one flight of stairs</td><td><input type="number" class="excel-input" data-group="quebec" min="0" max="5" placeholder="0" /></td></tr>
      <tr><td class="text-center font-mono">8</td><td>Walk a few blocks (300-400m)</td><td><input type="number" class="excel-input" data-group="quebec" min="0" max="5" placeholder="0" /></td></tr>
      <tr><td class="text-center font-mono">9</td><td>Walk several miles / kilometers</td><td><input type="number" class="excel-input" data-group="quebec" min="0" max="5" placeholder="0" /></td></tr>
      <tr><td class="text-center font-mono">10</td><td>Reach up to high shelves</td><td><input type="number" class="excel-input" data-group="quebec" min="0" max="5" placeholder="0" /></td></tr>
      <tr><td class="text-center font-mono">11</td><td>Throw a ball</td><td><input type="number" class="excel-input" data-group="quebec" min="0" max="5" placeholder="0" /></td></tr>
      <tr><td class="text-center font-mono">12</td><td>Run one block (approx. 100m)</td><td><input type="number" class="excel-input" data-group="quebec" min="0" max="5" placeholder="0" /></td></tr>
      <tr><td class="text-center font-mono">13</td><td>Take food out of refrigerator</td><td><input type="number" class="excel-input" data-group="quebec" min="0" max="5" placeholder="0" /></td></tr>
      <tr><td class="text-center font-mono">14</td><td>Make your bed</td><td><input type="number" class="excel-input" data-group="quebec" min="0" max="5" placeholder="0" /></td></tr>
      <tr><td class="text-center font-mono">15</td><td>Put on your socks (or stockings)</td><td><input type="number" class="excel-input" data-group="quebec" min="0" max="5" placeholder="0" /></td></tr>
      <tr><td class="text-center font-mono">16</td><td>Bend over to clean the bathtub</td><td><input type="number" class="excel-input" data-group="quebec" min="0" max="5" placeholder="0" /></td></tr>
      <tr><td class="text-center font-mono">17</td><td>Move a chair</td><td><input type="number" class="excel-input" data-group="quebec" min="0" max="5" placeholder="0" /></td></tr>
      <tr><td class="text-center font-mono">18</td><td>Pull or push heavy doors</td><td><input type="number" class="excel-input" data-group="quebec" min="0" max="5" placeholder="0" /></td></tr>
      <tr><td class="text-center font-mono">19</td><td>Carry two bags of groceries</td><td><input type="number" class="excel-input" data-group="quebec" min="0" max="5" placeholder="0" /></td></tr>
      <tr><td class="text-center font-mono">20</td><td>Carry a heavy suitcase</td><td><input type="number" class="excel-input" data-group="quebec" min="0" max="5" placeholder="0" /></td></tr>
      <tr class="excel-total-row">
        <td colspan="2" class="font-bold">
          Total Quebec Disability Score: <span class="excel-sum font-mono" data-sum-target="quebec">0</span> / 100
        </td>
        <td class="text-center font-mono font-bold text-indigo-600 dark:text-indigo-400">
          <span class="excel-sum" data-sum-target="quebec">0</span> / 100
        </td>
      </tr>
    </tbody>
  </table>
</div>
*MCID: 15 - 20 points (or 30% reduction from baseline).*`
  },

  // ── 21. !STORK ───────────────────────────────────────────────────────────
  {
    trigger_prefix: '!',
    code: 'STORK',
    title: 'Stork Single-Leg Balance Test (Duration Tracking)',
    category: 'outcome_measures',
    content: `### Stork Single-Leg Stance Balance Test

<div class="excel-table-wrap">
  <table class="excel-table">
    <thead>
      <tr>
        <th style="width: 140px;">Condition &amp; Limb<div class="col-resizer"></div></th>
        <th style="width: 110px;" class="text-center">Trial 1 (sec)<div class="col-resizer"></div></th>
        <th style="width: 110px;" class="text-center">Trial 2 (sec)<div class="col-resizer"></div></th>
        <th style="width: 110px;" class="text-center">Trial 3 (sec)<div class="col-resizer"></div></th>
        <th style="width: 110px;" class="text-center">Best Trial<div class="col-resizer"></div></th>
        <th>Age-Matched Normative &bull; Risk<div class="col-resizer"></div></th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td class="font-semibold">Eyes Open (Left)</td>
        <td><input type="number" class="excel-input" placeholder="sec" /></td>
        <td><input type="number" class="excel-input" placeholder="sec" /></td>
        <td><input type="number" class="excel-input" placeholder="sec" /></td>
        <td><input type="text" class="excel-input text-center font-bold" placeholder="sec" /></td>
        <td><input type="text" class="excel-input" placeholder="Norm: 30-40s (18-49y)" /></td>
      </tr>
      <tr>
        <td class="font-semibold">Eyes Open (Right)</td>
        <td><input type="number" class="excel-input" placeholder="sec" /></td>
        <td><input type="number" class="excel-input" placeholder="sec" /></td>
        <td><input type="number" class="excel-input" placeholder="sec" /></td>
        <td><input type="text" class="excel-input text-center font-bold" placeholder="sec" /></td>
        <td><input type="text" class="excel-input" placeholder="Norm: 30-40s (18-49y)" /></td>
      </tr>
      <tr>
        <td class="font-semibold">Eyes Closed (Left)</td>
        <td><input type="number" class="excel-input" placeholder="sec" /></td>
        <td><input type="number" class="excel-input" placeholder="sec" /></td>
        <td><input type="number" class="excel-input" placeholder="sec" /></td>
        <td><input type="text" class="excel-input text-center font-bold" placeholder="sec" /></td>
        <td><input type="text" class="excel-input" placeholder="Norm: >15-20s (18-49y)" /></td>
      </tr>
      <tr>
        <td class="font-semibold">Eyes Closed (Right)</td>
        <td><input type="number" class="excel-input" placeholder="sec" /></td>
        <td><input type="number" class="excel-input" placeholder="sec" /></td>
        <td><input type="number" class="excel-input" placeholder="sec" /></td>
        <td><input type="text" class="excel-input text-center font-bold" placeholder="sec" /></td>
        <td><input type="text" class="excel-input" placeholder="Norm: >15-20s (18-49y)" /></td>
      </tr>
      <tr class="excel-total-row">
        <td colspan="5" class="font-bold">Failure: Foot touches floor, hands leave hips, or non-stance foot moves away from knee.</td>
        <td class="font-bold text-amber-600 dark:text-amber-400">&lt;5s EC = Fall Risk</td>
      </tr>
    </tbody>
  </table>
</div>`
  },

  // ── 22. !NPRS ────────────────────────────────────────────────────────────
  {
    trigger_prefix: '!',
    code: 'NPRS',
    title: 'Numeric Pain Rating Scale (Triple NPRS Grid)',
    category: 'outcome_measures',
    content: `### Numeric Pain Rating Scale (Triple NPRS Grid)

<div class="excel-table-wrap">
  <table class="excel-table" data-calc-group="nprs">
    <thead>
      <tr>
        <th style="width: 220px;">Pain Measurement Dimension<div class="col-resizer"></div></th>
        <th style="width: 140px;" class="text-center">Rating (0 - 10)<div class="col-resizer"></div></th>
        <th style="width: 150px;" class="text-center">Severity Classification<div class="col-resizer"></div></th>
        <th>Clinical Provocation / Context<div class="col-resizer"></div></th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td class="font-semibold">1. Current Pain Level</td>
        <td><input type="number" class="excel-input" data-group="nprs" min="0" max="10" placeholder="0" /></td>
        <td class="text-center"><span class="risk-pill risk-low">Mild (1-3)</span></td>
        <td><input type="text" class="excel-input" placeholder="At rest in clinic" /></td>
      </tr>
      <tr>
        <td class="font-semibold">2. Best (Least) Pain (Past 24h)</td>
        <td><input type="number" class="excel-input" data-group="nprs" min="0" max="10" placeholder="0" /></td>
        <td class="text-center"><span class="risk-pill risk-low">Mild (1-3)</span></td>
        <td><input type="text" class="excel-input" placeholder="With heat / reclining" /></td>
      </tr>
      <tr>
        <td class="font-semibold">3. Worst Pain (Past 24h)</td>
        <td><input type="number" class="excel-input" data-group="nprs" min="0" max="10" placeholder="0" /></td>
        <td class="text-center"><span class="risk-pill risk-high">Severe (7-10)</span></td>
        <td><input type="text" class="excel-input" placeholder="End of work day / sitting >1 hr" /></td>
      </tr>
      <tr class="excel-total-row">
        <td class="font-bold">Average Pain Score (Sum / 3):</td>
        <td class="text-center font-mono font-bold text-indigo-600 dark:text-indigo-400">
          <span class="excel-sum font-mono" data-sum-target="nprs">0</span> / 30
        </td>
        <td class="text-center"><span class="risk-pill risk-amber">MCID: 2.0 pts</span></td>
        <td class="text-slate-500 text-xs">A change of &ge; 2 points (or 30%) represents clinically meaningful difference.</td>
      </tr>
    </tbody>
  </table>
</div>`
  },

  // ── 23. !VAS ─────────────────────────────────────────────────────────────
  {
    trigger_prefix: '!',
    code: 'VAS',
    title: 'Visual Analog Scale (VAS Multi-Region Pain Tracking)',
    category: 'outcome_measures',
    content: `### Visual Analog Scale (VAS Multi-Region Pain Tracking)

<div class="excel-table-wrap">
  <table class="excel-table">
    <thead>
      <tr>
        <th style="width: 180px;">Anatomical Region<div class="col-resizer"></div></th>
        <th style="width: 120px;" class="text-center">Baseline (0-100mm)<div class="col-resizer"></div></th>
        <th style="width: 120px;" class="text-center">Post-Tx (0-100mm)<div class="col-resizer"></div></th>
        <th style="width: 110px;" class="text-center">Difference (&Delta;)<div class="col-resizer"></div></th>
        <th>Clinically Meaningful Change (&ge;15mm)<div class="col-resizer"></div></th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td class="font-semibold">Primary Focus Area</td>
        <td><input type="number" class="excel-input" min="0" max="100" placeholder="mm" /></td>
        <td><input type="number" class="excel-input" min="0" max="100" placeholder="mm" /></td>
        <td><input type="text" class="excel-input text-center" placeholder="-mm" /></td>
        <td><input type="text" class="excel-input" placeholder="MCID Met (≥15mm improvement)" /></td>
      </tr>
      <tr>
        <td class="font-semibold">Secondary Area</td>
        <td><input type="number" class="excel-input" min="0" max="100" placeholder="mm" /></td>
        <td><input type="number" class="excel-input" min="0" max="100" placeholder="mm" /></td>
        <td><input type="text" class="excel-input text-center" placeholder="-mm" /></td>
        <td><input type="text" class="excel-input" placeholder="Stable / resolving" /></td>
      </tr>
    </tbody>
  </table>
</div>`
  },

  // ── 24. !PSFS ────────────────────────────────────────────────────────────
  {
    trigger_prefix: '!',
    code: 'PSFS',
    title: 'Patient-Specific Functional Scale (PSFS)',
    category: 'outcome_measures',
    content: `### Patient-Specific Functional Scale (PSFS)

*Scoring: 0 = Unable to perform activity &bull; 10 = Able to perform at pre-injury level*

<div class="excel-table-wrap">
  <table class="excel-table" data-calc-group="psfs">
    <thead>
      <tr>
        <th style="width: 50px;" class="text-center">#<div class="col-resizer"></div></th>
        <th>Patient-Nominated Functional Activity<div class="col-resizer"></div></th>
        <th style="width: 110px;" class="text-center">Baseline (0-10)<div class="col-resizer"></div></th>
        <th style="width: 110px;" class="text-center">Current (0-10)<div class="col-resizer"></div></th>
        <th style="width: 110px;" class="text-center">Goal Score<div class="col-resizer"></div></th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td class="text-center font-mono">1</td>
        <td><input type="text" class="excel-input text-left" placeholder="e.g. Putting on shoes and socks independently" /></td>
        <td><input type="number" class="excel-input" data-group="psfs-base" min="0" max="10" placeholder="0" /></td>
        <td><input type="number" class="excel-input" data-group="psfs-curr" min="0" max="10" placeholder="0" /></td>
        <td class="text-center font-mono">10</td>
      </tr>
      <tr>
        <td class="text-center font-mono">2</td>
        <td><input type="text" class="excel-input text-left" placeholder="e.g. Walking dog >30 minutes on uneven pavement" /></td>
        <td><input type="number" class="excel-input" data-group="psfs-base" min="0" max="10" placeholder="0" /></td>
        <td><input type="number" class="excel-input" data-group="psfs-curr" min="0" max="10" placeholder="0" /></td>
        <td class="text-center font-mono">10</td>
      </tr>
      <tr>
        <td class="text-center font-mono">3</td>
        <td><input type="text" class="excel-input text-left" placeholder="e.g. Sitting at desk for 1 hour without lower back ache" /></td>
        <td><input type="number" class="excel-input" data-group="psfs-base" min="0" max="10" placeholder="0" /></td>
        <td><input type="number" class="excel-input" data-group="psfs-curr" min="0" max="10" placeholder="0" /></td>
        <td class="text-center font-mono">10</td>
      </tr>
      <tr class="excel-total-row">
        <td colspan="2" class="font-bold">
          Average PSFS Score (Total / Number of Activities):
        </td>
        <td class="text-center font-mono font-bold">
          <span class="excel-sum font-mono" data-sum-target="psfs-base">0</span>
        </td>
        <td class="text-center font-mono font-bold text-indigo-600 dark:text-indigo-400">
          <span class="excel-sum font-mono" data-sum-target="psfs-curr">0</span>
        </td>
        <td class="font-bold text-indigo-600 dark:text-indigo-400">
          MCID: 2.0 pts
        </td>
      </tr>
    </tbody>
  </table>
</div>
*MCID: 2.0 points for individual activity &bull; 1.2 points for overall average score.*`
  },

  // ── 25. !PCS ─────────────────────────────────────────────────────────────
  {
    trigger_prefix: '!',
    code: 'PCS',
    title: 'Pain Catastrophizing Scale (PCS)',
    category: 'outcome_measures',
    content: `### Pain Catastrophizing Scale (PCS)

*Rating Scale: 0 = Not at all &bull; 1 = To a slight degree &bull; 2 = Moderate degree &bull; 3 = Great degree &bull; 4 = All the time*

<div class="excel-table-wrap">
  <table class="excel-table" data-calc-group="pcs">
    <thead>
      <tr>
        <th style="width: 50px;" class="text-center">#<div class="col-resizer"></div></th>
        <th>When I'm in pain...<div class="col-resizer"></div></th>
        <th style="width: 140px;">Subscale Dimension<div class="col-resizer"></div></th>
        <th style="width: 100px;" class="text-center">Score (0-4)<div class="col-resizer"></div></th>
      </tr>
    </thead>
    <tbody>
      <tr><td class="text-center font-mono">1</td><td>I worry all the time about whether the pain will end.</td><td class="text-slate-400">Helplessness</td><td><input type="number" class="excel-input" data-group="pcs-help" min="0" max="4" placeholder="0" /></td></tr>
      <tr><td class="text-center font-mono">2</td><td>I feel I can't go on.</td><td class="text-slate-400">Helplessness</td><td><input type="number" class="excel-input" data-group="pcs-help" min="0" max="4" placeholder="0" /></td></tr>
      <tr><td class="text-center font-mono">3</td><td>It's terrible and I think it's never going to get any better.</td><td class="text-slate-400">Helplessness</td><td><input type="number" class="excel-input" data-group="pcs-help" min="0" max="4" placeholder="0" /></td></tr>
      <tr><td class="text-center font-mono">4</td><td>It's awful and I feel that it overwhelms me.</td><td class="text-slate-400">Helplessness</td><td><input type="number" class="excel-input" data-group="pcs-help" min="0" max="4" placeholder="0" /></td></tr>
      <tr><td class="text-center font-mono">5</td><td>I feel I can't stand it anymore.</td><td class="text-slate-400">Helplessness</td><td><input type="number" class="excel-input" data-group="pcs-help" min="0" max="4" placeholder="0" /></td></tr>
      <tr><td class="text-center font-mono">6</td><td>I become afraid that the pain will get worse.</td><td class="text-slate-400">Magnification</td><td><input type="number" class="excel-input" data-group="pcs-mag" min="0" max="4" placeholder="0" /></td></tr>
      <tr><td class="text-center font-mono">7</td><td>I keep thinking of other painful events.</td><td class="text-slate-400">Magnification</td><td><input type="number" class="excel-input" data-group="pcs-mag" min="0" max="4" placeholder="0" /></td></tr>
      <tr><td class="text-center font-mono">8</td><td>I anxiously want the pain to go away.</td><td class="text-slate-400">Rumination</td><td><input type="number" class="excel-input" data-group="pcs-rum" min="0" max="4" placeholder="0" /></td></tr>
      <tr><td class="text-center font-mono">9</td><td>I can't seem to keep it out of my mind.</td><td class="text-slate-400">Rumination</td><td><input type="number" class="excel-input" data-group="pcs-rum" min="0" max="4" placeholder="0" /></td></tr>
      <tr><td class="text-center font-mono">10</td><td>I keep thinking about how much it hurts.</td><td class="text-slate-400">Rumination</td><td><input type="number" class="excel-input" data-group="pcs-rum" min="0" max="4" placeholder="0" /></td></tr>
      <tr><td class="text-center font-mono">11</td><td>I keep thinking about how badly I want the pain to stop.</td><td class="text-slate-400">Rumination</td><td><input type="number" class="excel-input" data-group="pcs-rum" min="0" max="4" placeholder="0" /></td></tr>
      <tr><td class="text-center font-mono">12</td><td>There's nothing I can do to reduce the intensity of the pain.</td><td class="text-slate-400">Helplessness</td><td><input type="number" class="excel-input" data-group="pcs-help" min="0" max="4" placeholder="0" /></td></tr>
      <tr><td class="text-center font-mono">13</td><td>I wonder whether something serious may happen.</td><td class="text-slate-400">Magnification</td><td><input type="number" class="excel-input" data-group="pcs-mag" min="0" max="4" placeholder="0" /></td></tr>
      <tr class="excel-total-row">
        <td colspan="3" class="font-bold">
          Total PCS Score: <span class="excel-sum font-mono" data-sum-target="pcs">0</span> / 52 &bull; 
          Cutoff: <span class="risk-pill risk-amber" data-cutoff-target="pcs" data-cutoff-val="30">Score &ge; 30 = Clinically Relevant Catastrophizing</span>
        </td>
        <td class="text-center font-mono font-bold text-indigo-600 dark:text-indigo-400">
          <span class="excel-sum" data-sum-target="pcs">0</span> / 52
        </td>
      </tr>
    </tbody>
  </table>
</div>

**Subscales Breakdown:**
- Rumination (Items 8-11 &bull; Max 16)
- Magnification (Items 6, 7, 13 &bull; Max 12)
- Helplessness (Items 1-5, 12 &bull; Max 24)
- **Clinical Cutoff (&ge; 30):** Represents 75th percentile — high risk for pain chronification and delayed recovery.`
  },

  // ── 26. !TSKV ────────────────────────────────────────────────────────────
  {
    trigger_prefix: '!',
    code: 'TSKV',
    title: 'Tampa Scale of Kinesiophobia (TSK-11 Movement Evoked Pain)',
    category: 'outcome_measures',
    content: `### Tampa Scale of Kinesiophobia (TSK-11)

*Rating Scale: 1 = Strongly Disagree &bull; 2 = Disagree &bull; 3 = Agree &bull; 4 = Strongly Agree*

<div class="excel-table-wrap">
  <table class="excel-table" data-calc-group="tskv">
    <thead>
      <tr>
        <th style="width: 50px;" class="text-center">#<div class="col-resizer"></div></th>
        <th>Item Statement<div class="col-resizer"></div></th>
        <th style="width: 100px;" class="text-center">Score (1-4)<div class="col-resizer"></div></th>
      </tr>
    </thead>
    <tbody>
      <tr><td class="text-center font-mono">1</td><td>I am afraid that I might injure myself if I exercise.</td><td><input type="number" class="excel-input" data-group="tskv" min="1" max="4" placeholder="1" /></td></tr>
      <tr><td class="text-center font-mono">2</td><td>If I were to try to overcome it, my pain would increase.</td><td><input type="number" class="excel-input" data-group="tskv" min="1" max="4" placeholder="1" /></td></tr>
      <tr><td class="text-center font-mono">3</td><td>My body is telling me I have something dangerously wrong.</td><td><input type="number" class="excel-input" data-group="tskv" min="1" max="4" placeholder="1" /></td></tr>
      <tr><td class="text-center font-mono">4</td><td>My pain would probably be relieved if I were to exercise. <em>(Reversed)</em></td><td><input type="number" class="excel-input" data-group="tskv" min="1" max="4" placeholder="1" /></td></tr>
      <tr><td class="text-center font-mono">5</td><td>People aren't taking my medical condition seriously enough.</td><td><input type="number" class="excel-input" data-group="tskv" min="1" max="4" placeholder="1" /></td></tr>
      <tr><td class="text-center font-mono">6</td><td>My accident/injury has put my body at risk for the rest of my life.</td><td><input type="number" class="excel-input" data-group="tskv" min="1" max="4" placeholder="1" /></td></tr>
      <tr><td class="text-center font-mono">7</td><td>Pain always means I have injured my body.</td><td><input type="number" class="excel-input" data-group="tskv" min="1" max="4" placeholder="1" /></td></tr>
      <tr><td class="text-center font-mono">8</td><td>Just because something aggravates pain does not make it dangerous. <em>(Reversed)</em></td><td><input type="number" class="excel-input" data-group="tskv" min="1" max="4" placeholder="1" /></td></tr>
      <tr><td class="text-center font-mono">9</td><td>I am afraid that I might injure myself accidentally.</td><td><input type="number" class="excel-input" data-group="tskv" min="1" max="4" placeholder="1" /></td></tr>
      <tr><td class="text-center font-mono">10</td><td>It's not really safe for a person with my condition to be physically active.</td><td><input type="number" class="excel-input" data-group="tskv" min="1" max="4" placeholder="1" /></td></tr>
      <tr><td class="text-center font-mono">11</td><td>I wouldn't have this much pain if there weren't something dangerous.</td><td><input type="number" class="excel-input" data-group="tskv" min="1" max="4" placeholder="1" /></td></tr>
      <tr class="excel-total-row">
        <td colspan="2" class="font-bold">
          Total TSK-11 Score: <span class="excel-sum font-mono" data-sum-target="tskv">11</span> / 44 &bull; 
          High Kinesiophobia: <span class="risk-pill risk-amber" data-cutoff-target="tskv" data-cutoff-val="25">Cutoff &ge; 25</span>
        </td>
        <td class="text-center font-mono font-bold text-indigo-600 dark:text-indigo-400">
          <span class="excel-sum" data-sum-target="tskv">11</span> / 44
        </td>
      </tr>
    </tbody>
  </table>
</div>

**Clinical Interpretation:**
- Scores range from 11 to 44.
- **Score &ge; 25:** High kinesiophobia (fear of movement). Indicator for graded motor imagery and pain neuroscience education.`
  }
];

module.exports = {
  SEED_SMART_PHRASES,
};
