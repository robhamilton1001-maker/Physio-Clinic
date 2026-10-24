'use strict';

/**
 * Pre-Populated MSK Smart Phrases Library
 * 
 * Group 1: Clinician Shortcuts (Prefix: @)
 * - Regional Assessment Protocols & Comprehensive Markdown Tables
 * 
 * Group 2: MSK Outcome Measures (Strict Prefix: !)
 * - Spine, Lower Limb, Upper Limb, Pain & Psychosocial instruments
 *   with full question items, scoring guides, and interpretation rubrics.
 */

const SEED_SMART_PHRASES = [
  // ═══════════════════════════════════════════════════════════════════════════
  // GROUP 1: CLINICIAN SHORTCUTS (@)
  // ═══════════════════════════════════════════════════════════════════════════

  {
    trigger_prefix: '@',
    code: 'c-spine',
    title: 'Cervical Spine Comprehensive Assessment',
    category: 'msk_templates',
    content: `### Cervical Spine Clinical Examination

**Subjective Overview:**
- Mechanism / Onset: 
- Pain Location & Referral: (Neck / Trapezius / Interscapular / Upper Extremity)
- Symptom Nature: (Dull ache / Sharp / Burning / Paresthesia)
- 24-Hour Pattern: (Morning stiffness / Aggravated with prolonged posture)
- Red Flags / VBI Screen: 5 Ds & 3 Ns negative. No gait clumsiness, bilateral paresthesia, or intrinsic hand weakness.

**Range of Motion (Active):**
| Cervical Motion | Range (Normal) | Pain / Limitation | End-Feel |
|:----------------|:---------------|:------------------|:---------|
| Flexion         | 0 - 50°        |                   | Tissue stretch |
| Extension       | 0 - 60°        |                   | Bone-to-bone / firm |
| Side Flex (L)   | 0 - 45°        |                   | Tissue stretch |
| Side Flex (R)   | 0 - 45°        |                   | Tissue stretch |
| Rotation (L)    | 0 - 80°        |                   | Tissue stretch |
| Rotation (R)    | 0 - 80°        |                   | Tissue stretch |

**Neurological Screen (C5 - T1):**
| Level | Dermatome (Light Touch) | Myotome (Motor Power) | Deep Tendon Reflex |
|:------|:------------------------|:----------------------|:-------------------|
| C5    | Lateral upper arm       | Deltoid (5/5)         | Biceps (2+)        |
| C6    | Lateral forearm / thumb | Biceps / Wrist Ext(5/5)| Brachioradialis(2+)|
| C7    | Middle finger           | Triceps / Wrist Flx(5/5)| Triceps (2+)      |
| C8    | Medial forearm / 5th digit| Finger Flexors (5/5) | -                  |
| T1    | Medial elbow / arm      | Finger Interossei(5/5)| -                  |

**Special Orthopedic Tests:**
- Spurling's Test (Compression): [ Negative / Positive with radicular reproduction ]
- Cervical Distraction Test: [ Negative / Positive with symptom relief ]
- Upper Limb Neurodynamic Test (ULTT 1 - Median): [ Negative / Positive ]
- Shoulder Abduction Test (Bakody's): [ Negative / Relief noted ]
- Cervical Flexion-Rotation Test (C1-C2): [ Normal (45°) / Restricted ]

**Clinical Impression:**
- Primary Impairment: 
- Contributing Factors: 
- Care Plan: Manual cervical mobilization, postural re-education, deep neck flexor activation, HEP.`
  },

  {
    trigger_prefix: '@',
    code: 'l-spine',
    title: 'Lumbar Spine Comprehensive Assessment',
    category: 'msk_templates',
    content: `### Lumbar Spine Clinical Examination

**Subjective Overview:**
- Onset & Mechanism: 
- Symptom Location: (Low back / Buttock / Thigh / Below knee)
- Directional Preference: (Flexion-biased / Extension-biased / Unclear)
- Red Flag Screening: Cauda Equina Syndrome negative (No saddle numbness, bowel/bladder changes, or progressive bilateral motor deficit).

**Lumbar Range of Motion:**
| Motion           | Observed Range | Pain Provocation | Repeated Movement Response |
|:-----------------|:---------------|:-----------------|:---------------------------|
| Flexion          |                |                  | [ Peripheralizes / Centralizes / No Change ] |
| Extension        |                |                  | [ Peripheralizes / Centralizes / No Change ] |
| Side Glide / L   |                |                  |                            |
| Side Glide / R   |                |                  |                            |

**Neurological Screen (L2 - S1):**
| Level | Dermatome Sensation    | Myotome Motor Strength | Reflex             |
|:------|:-----------------------|:-----------------------|:-------------------|
| L2    | Anterior mid-thigh     | Hip Flexion (5/5)      | -                  |
| L3    | Medial knee            | Knee Extension (5/5)   | Patellar (2+)      |
| L4    | Medial malleolus       | Ankle Dorsiflexion(5/5)| Patellar (2+)      |
| L5    | Dorsum foot / Great toe| Extensor Hallucis(5/5) | Medial Hamstring   |
| S1    | Lateral foot / Heel    | Plantarflexion (5/5)   | Achilles (2+)      |

**Neurodynamic & Orthopedic Provocation:**
- Straight Leg Raise (SLR): Left: ___° (Reproduction of concordant radicular pain? Y/N) | Right: ___°
- Crossed SLR: [ Negative / Positive ]
- Slump Test: [ Negative / Positive, sensitized by ankle dorsiflexion ]
- Prone Instability Test: [ Negative / Positive for segmental motor control deficit ]
- Sacroiliac Joint Provocation Cluster (Laslett): [ 0/4 / 1/4 / 2+/4 ]

**Clinical Impression & Working Plan:**
- Diagnostic Category: (Derangement / Dysfunction / Postural / Motor control impairment)
- Action: Prescription of directional exercise, core endurance, patient education.`
  },

  {
    trigger_prefix: '@',
    code: 'shoulder',
    title: 'Shoulder Examination & Rotator Cuff Battery',
    category: 'msk_templates',
    content: `### Shoulder Joint & Rotator Cuff Assessment

**Subjective Presentation:**
- Side: [ Left / Right / Bilateral ] | Hand Dominance: [ Left / Right ]
- Symptom Onset: (Overhead activity / Acute trauma / Insidious)
- Night Pain: [ None / Present when lying on affected side ]
- Mechanical Symptoms: (Clicking / Catching / Apprehension / Weakness)

**Active & Passive Range of Motion:**
| Motion                | Active ROM (Affected) | Passive ROM | Contralateral Active |
|:----------------------|:----------------------|:------------|:---------------------|
| Forward Flexion       |                       |             |                      |
| Abduction             |                       |             |                      |
| External Rot (at 0°)  |                       |             |                      |
| Internal Rot (behind back)|                  |             |                      |
| Scapular Dyskinesis   | [ None / Type I (Inferior) / Type II (Medial) / Type III (Superior) ] |

**Rotator Cuff & Subacromial Impingement Cluster:**
- Painful Arc (60° - 120°): [ Negative / Positive ]
- Hawkins-Kennedy Test: [ Negative / Positive ]
- Neer Impingement Test: [ Negative / Positive ]
- Empty Can (Jobe's / Supraspinatus): [ 5/5 Strong & Pain-Free / Weak / Painful ]
- External Rotation Lag Sign (Infraspinatus): [ Intact / Lag noted ]
- Hornblower's Sign (Teres Minor): [ Negative / Positive ]
- Belly Press / Lift-Off Test (Subscapularis): [ Intact / Weakness / Compensatory wrist flexion ]

**Biceps & Labral Tests:**
- Speed's Test: [ Negative / Positive ]
- O'Brien's Active Compression (SLAP): [ Negative / Pain deep in joint relieved in supination ]
- Crank Test: [ Negative / Positive ]

**Glenohumeral Laxity & Stability:**
- Anterior Apprehension & Relocation: [ Negative / Positive ]
- Sulcus Sign: [ Grade 0 (<1cm) / Grade 1 (1-2cm) / Grade 2 (>2cm) ]

**Impression:** [ Subacromial pain syndrome / Rotator cuff tendinopathy / Adhesive capsulitis / Labral pathology ]`
  },

  {
    trigger_prefix: '@',
    code: 'knee',
    title: 'Knee Joint & Ligamentous Battery',
    category: 'msk_templates',
    content: `### Knee Joint Clinical Examination

**Subjective:**
- Mechanism: (Non-contact pivot / Direct blow / Hyperflexion / Insidious)
- Immediate Swelling: (Within 2 hours = hemarthrosis / Delayed > 12 hours)
- Instability / Giving Way: [ Denied / Present on stairs or pivoting ]
- Locking / Catching: [ Denied / Mechanical block to full extension ]

**Knee Range of Motion & Swelling:**
| Metric         | Affected Knee | Unaffected Knee |
|:---------------|:--------------|:----------------|
| Active Flexion |               |                 |
| Active Extension|              |                 |
| Knee Effusion  | [ None / Trace / 1+ (milked medial wave) / 2+ / 3+ (large tense) ] |

**Ligamentous Stability Tests:**
| Structure Tested | Test Performed | Laxity Grade | Endpoint Quality |
|:-----------------|:---------------|:-------------|:-----------------|
| Anterior Cruciate (ACL) | Lachman Test (30°) | [ 0 / 1+ (3-5mm) / 2+ (5-10mm) / 3+ (>10mm) ] | [ Crisp / Soft / Absent ] |
| Anterior Cruciate (ACL) | Anterior Drawer (90°) | [ Normal / Increased excursion ] |                  |
| Posterior Cruciate (PCL)| Posterior Sag & Drawer | [ Normal / Grade I / Grade II / Grade III ] |    |
| Medial Collateral (MCL) | Valgus Stress (at 30°) | [ Grade I (Pain, no laxity) / Grade II / III ] |  |
| Lateral Collateral (LCL)| Varus Stress (at 30°)  | [ Grade I / Grade II / Grade III ] |              |

**Meniscal & Patellofemoral Tests:**
- Joint Line Tenderness: [ Lateral / Medial / Absent ]
- McMurray's Test: [ Negative / Click & pain reproduced ]
- Thessaly's Test (at 20° weight-bearing): [ Negative / Positive ]
- Patellofemoral Compression & Glide: [ Normal tracking / Crepitus / Hypomobile / Hypermobile ]
- Patellar Apprehension Test: [ Negative / Guarding present ]

**Clinical Impression:** 
- Structural Findings: 
- Functional Deficit: `
  },

  {
    trigger_prefix: '@',
    code: 'hip',
    title: 'Hip Joint & Groin Assessment',
    category: 'msk_templates',
    content: `### Hip & Groin Clinical Examination

**Subjective Overview:**
- Location: (Anterior groin / Lateral trochanteric / Deep buttock)
- Aggravating Factors: (Prolonged sitting / Deep squatting / Running / Lateral sleeping)
- Clicking / Catching sensation: [ Present / Absent ]

**Hip Range of Motion:**
| Motion               | Affected Side | Unaffected Side | Pain Provocation |
|:---------------------|:--------------|:----------------|:-----------------|
| Flexion (Supine)     | 0 - 120°      |                 |                  |
| Extension (Prone)    | 0 - 20°       |                 |                  |
| Internal Rot (at 90°)| 0 - 35°       |                 |                  |
| External Rot (at 90°)| 0 - 45°       |                 |                  |
| Abduction            | 0 - 45°       |                 |                  |

**Special Tests for FAI, Labrum & Tendinopathy:**
- FADIR (Flexion, Adduction, Internal Rotation): [ Negative / Concordant groin pain (FAI / Labral) ]
- FABER / Patrick's Test: [ Negative / Anterior hip pain / Posterior SIJ pain ]
- Resisted Hip Flexion (Stinchfield Test): [ Strong / Weak / Painful ]
- Resisted Hip Abduction & Single-Leg Stance: [ Trendelenburg sign / Greater trochanteric pain ]
- Thomas Test: [ Iliopsoas tightness / Rectus femoris tightness (Kendall angle) / Normal ]
- Ober's Test: [ IT Band / Gluteus Medius restriction / Normal ]

**Impression:** [ Femoroacetabular Impingement / Greater Trochanteric Pain Syndrome / Hip Osteoarthritis / Adductor Strain ]`
  },

  {
    trigger_prefix: '@',
    code: 'ankle',
    title: 'Ankle & Foot Complex Assessment',
    category: 'msk_templates',
    content: `### Ankle & Foot Complex Examination

**Acute Trauma Screen (Ottawa Ankle & Foot Rules):**
- Bone tenderness along posterior 6cm of lateral malleolus: [ No / Yes ]
- Bone tenderness along posterior 6cm of medial malleolus: [ No / Yes ]
- Inability to bear weight immediately and for 4 steps in clinic: [ Able / Unable ]
- Bone tenderness at base of 5th metatarsal: [ No / Yes ]
- Bone tenderness at navicular: [ No / Yes ]
*Ottawa Rules Result:* [ Negative (X-ray not indicated) / Positive (Refer for Radiography) ]

**Range of Motion & Weight-Bearing Lunge:**
| Motion / Test               | Affected Side | Unaffected Side |
|:----------------------------|:--------------|:----------------|
| Weight-Bearing Lunge (DF)   | ___ cm        | ___ cm          |
| Passive Dorsiflexion (Knee Ext)| ___°       | ___°            |
| Plantarflexion              | ___°          | ___°            |
| Inversion                   | ___°          | ___°            |
| Eversion                    | ___°          | ___°            |

**Ligamentous & Tendon Testing:**
- Anterior Drawer Test (ATFL): [ Negative / Increased translation / Soft endpoint ]
- Talar Tilt Test (CFL): [ Negative / Increased inversion laxity ]
- Squeeze Test (Syndesmosis / High Ankle): [ Negative / Pain at distal tibiofibular joint ]
- External Rotation Stress Test (Kleiger): [ Negative / Positive ]
- Thompson's Calf Squeeze Test (Achilles Rupture): [ Normal plantarflexion / Absent (Urgent Surgical Referral) ]
- Royal London Hospital Test (Achilles Tendinopathy): [ Tenderness decreases in full DF ]

**Impression:** [ Lateral ligament sprain (Grade I/II/III) / Syndesmotic sprain / Midportion Achilles tendinopathy / Plantar fasciopathy ]`
  },

  {
    trigger_prefix: '@',
    code: 'rom-table',
    title: 'Standard Range of Motion Testing Table',
    category: 'msk_templates',
    content: `| Joint / Movement | Active ROM | Passive ROM | End-Feel | Pain Provocation (0-10) |
|:-----------------|:-----------|:------------|:---------|:------------------------|
| Flexion          |            |             | Firm     | 0/10                    |
| Extension        |            |             | Hard     | 0/10                    |
| Lateral Flex (L) |            |             | Elastic  | 0/10                    |
| Lateral Flex (R) |            |             | Elastic  | 0/10                    |
| Rotation (L)     |            |             | Firm     | 0/10                    |
| Rotation (R)     |            |             | Firm     | 0/10                    |`
  },

  {
    trigger_prefix: '@',
    code: 'neuro-table',
    title: 'Full Cervical & Lumbar Neurological Screen Grid',
    category: 'msk_templates',
    content: `| Spinal Level | Sensory Dermatome | Motor Myotome (MRC 0-5) | Deep Tendon Reflex |
|:-------------|:------------------|:------------------------|:-------------------|
| **C5**       | Lateral deltoid   | Shoulder Abduction: 5/5 | Biceps: 2+ (Normal)|
| **C6**       | Dorsal thumb/forearm| Wrist Extension: 5/5  | Brachioradialis: 2+|
| **C7**       | Middle finger     | Elbow Extension: 5/5    | Triceps: 2+        |
| **C8**       | Medial border hand| Thumb Extension: 5/5    | -                  |
| **T1**       | Medial forearm    | Finger Abduction: 5/5   | -                  |
| **L2**       | Anterior thigh    | Hip Flexion: 5/5        | -                  |
| **L3**       | Medial knee       | Knee Extension: 5/5     | Patellar: 2+       |
| **L4**       | Medial malleolus  | Ankle Dorsiflexion: 5/5 | Patellar: 2+       |
| **L5**       | Great toe dorsum  | Extensor Hallucis: 5/5  | Med Hamstring: 2+  |
| **S1**       | Lateral foot      | Ankle Plantarflexion:5/5| Achilles: 2+       |`
  },

  {
    trigger_prefix: '@',
    code: 'ligament-table',
    title: 'Ligament Laxity & Joint Stability Testing Grid',
    category: 'msk_templates',
    content: `| Anatomical Structure | Clinical Provocation Test | Laxity Grade (0-3) | Endpoint Sensation | Patient Symptoms |
|:---------------------|:--------------------------|:-------------------|:-------------------|:-----------------|
| Anterior Cruciate    | Lachman Test (30° flexion)| Grade 0 (Normal)   | Crisp, solid stop  | Pain-free        |
| Posterior Cruciate   | Posterior Drawer (90°)    | Grade 0 (Normal)   | Firm endpoint      | Pain-free        |
| Medial Collateral    | Valgus Stress (30°)       | Grade 0 (Normal)   | Distinct endpoint  | Pain-free        |
| Lateral Collateral   | Varus Stress (30°)        | Grade 0 (Normal)   | Distinct endpoint  | Pain-free        |
| Anterior Talofibular | Anterior Drawer (Ankle)   | Grade 0 (Normal)   | Firm stop          | Pain-free        |`
  },

  {
    trigger_prefix: '@',
    code: 'treestump',
    title: 'Concise Clinical Review & Re-Assessment',
    category: 'msk_templates',
    content: `**Clinical Re-Assessment Note:**
- Subjective Progress: Patient reports [ improved / unchanged / aggravated ] symptoms since last visit.
- Functional Activities: 
- Compliance with Home Exercises: [ High / Moderate / Poor ]
- Objective Re-Test: Comparable sign demonstrates [ increased ROM / decreased pain / improved motor control ].
- Treatment Performed: Manual therapy, neurodynamic mobilization, exercise progression.
- Next Session Focus: `
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // GROUP 2: PRE-BUILT MSK OUTCOME MEASURES STRICTLY (!)
  // ═══════════════════════════════════════════════════════════════════════════

  // ── Spine & Trunk ──────────────────────────────────────────────────────────

  {
    trigger_prefix: '!',
    code: 'odi',
    title: 'Oswestry Disability Index (ODI v2.1a)',
    category: 'outcome_measures',
    content: `### Oswestry Disability Index (ODI v2.1a)

| Section | Domain / Item | Score (0 - 5) |
|:--------|:--------------|:--------------|
| 1       | Pain Intensity | [ 0: None | 1: Mild | 2: Moderate | 3: Moderately Severe | 4: Very Severe | 5: Worst Imaginable ] |
| 2       | Personal Care (Washing, Dressing) | [ 0: Normal without pain | 1: Normal with pain | 2: Slow/careful | 3: Need some help | 4: Need help daily | 5: Cannot dress/wash ] |
| 3       | Lifting | [ 0: Heavy weights without pain | 1: Heavy weights with pain | 2: Off table only | 3: Light/medium weights | 4: Very light weights | 5: Cannot lift ] |
| 4       | Walking | [ 0: Unlimited | 1: No more than 1 mile | 2: No more than 1/2 mile | 3: No more than 100 yards | 4: With stick/crutches | 5: Bedbound ] |
| 5       | Sitting | [ 0: Any chair as long as like | 1: Favorite chair only | 2: Max 1 hour | 3: Max 30 minutes | 4: Max 10 minutes | 5: Prevented from sitting ] |
| 6       | Standing | [ 0: As long as like | 1: Extra pain | 2: Max 1 hour | 3: Max 30 minutes | 4: Max 10 minutes | 5: Prevented from standing ] |
| 7       | Sleeping | [ 0: Never disturbed | 1: Occasionally disturbed | 2: <6 hours sleep | 3: <4 hours sleep | 4: <2 hours sleep | 5: Prevented completely ] |
| 8       | Sex Life (if applicable) | [ 0: Normal, no pain | 1: Normal with extra pain | 2: Nearly normal but painful | 3: Severely restricted | 4: Nearly absent | 5: Prevented ] |
| 9       | Social Life | [ 0: Normal | 1: Normal with extra pain | 2: Affects energetic activities | 3: Seldom go out | 4: Restricted to home | 5: None ] |
| 10      | Traveling | [ 0: Anywhere without pain | 1: Anywhere with extra pain | 2: Painful >2 hours | 3: Painful <1 hour | 4: Short necessary journeys only | 5: Prevented ] |

**Score Calculation:**
- Raw Total: ____ / 50
- Percentage Disability: **____ %**  *(Formula: Raw Score / [Number of completed sections * 5] * 100)*

**Clinical Interpretation:**
- **0% - 20% (Minimal Disability):** Patient can cope with most living activities. Usually requires conservative advice, ergonomics, and aerobic fitness.
- **21% - 40% (Moderate Disability):** Experiencing pain with sitting, lifting, and standing. Travel and social life are difficult. Personal care managed independently.
- **41% - 60% (Severe Disability):** Pain remains main problem, activities of daily living impaired. Thorough clinical investigation indicated.
- **61% - 80% (Crippled):** Back pain impinges on all aspects of life. Immediate intervention required.
- **81% - 100% (Bed-Bound):** Patient is either bed-bound or exaggerating symptoms.
- *Minimal Clinically Important Difference (MCID):* **10 - 12 points (or 30% change from baseline)**.`
  },

  {
    trigger_prefix: '!',
    code: 'ndi',
    title: 'Neck Disability Index (NDI)',
    category: 'outcome_measures',
    content: `### Neck Disability Index (NDI)

| Section | Dimension | Score (0 - 5) |
|:--------|:----------|:--------------|
| 1       | Pain Intensity | [ 0: No pain | 1: Very mild | 2: Moderate | 3: Fairly severe | 4: Very severe | 5: Worst ] |
| 2       | Personal Care | [ 0: Normal without pain | 1: Normal with extra pain | 2: Slow & careful | 3: Need some help | 4: Need help daily | 5: Cannot dress ] |
| 3       | Lifting | [ 0: Heavy weights without pain | 1: Heavy weights with pain | 2: Off table only | 3: Light weights only | 4: Very light weights | 5: Cannot lift ] |
| 4       | Reading | [ 0: Unlimited reading | 1: Slight neck pain | 2: Moderate pain in 30min | 3: Moderate pain in 10min | 4: Severe pain prevents | 5: Cannot read ] |
| 5       | Headaches | [ 0: None | 1: Slight, infrequent | 2: Moderate, infrequent | 3: Moderate, frequent | 4: Severe, frequent | 5: Constant ] |
| 6       | Concentration | [ 0: Normal | 1: Slight difficulty | 2: Moderate difficulty | 3: Fair degree of difficulty | 4: Great difficulty | 5: Cannot concentrate ] |
| 7       | Work | [ 0: Normal | 1: Normal with extra effort | 2: Most usual work | 3: Cannot do usual work | 4: Hardly any work | 5: Cannot work at all ] |
| 8       | Driving | [ 0: Without neck pain | 1: Moderate pain | 2: Moderate pain on turns | 3: Seldom drive due to pain | 4: Hardly ever drive | 5: Cannot drive at all ] |
| 9       | Sleeping | [ 0: Undisturbed | 1: Mildly disturbed (<1hr) | 2: Disturbed (1-2hrs) | 3: Disturbed (2-3hrs) | 4: Disturbed (3-5hrs) | 5: Completely disturbed ] |
| 10      | Recreation | [ 0: All activities | 1: Some neck pain | 2: Most activities | 3: Few activities | 4: Hardly any | 5: Cannot do any ] |

**Score:**
- Total Score: **____ / 50** (**____ %**)

**Clinical Grading:**
- **0 - 4:** No disability (0 - 8%)
- **5 - 14:** Mild disability (10 - 28%)
- **15 - 24:** Moderate disability (30 - 48%)
- **25 - 34:** Severe disability (50 - 68%)
- **35 - 50:** Complete disability (70 - 100%)
- *MCID:* **5 points (or 10% change)**.`
  },

  {
    trigger_prefix: '!',
    code: 'rmdq',
    title: 'Roland-Morris Disability Questionnaire (RMDQ)',
    category: 'outcome_measures',
    content: `### Roland-Morris Low Back Pain Disability Questionnaire (RMDQ)
*Instructions: Check (x) every statement that describes the patient today because of their back.*

- [ ] 1. I stay at home most of the time because of my back.
- [ ] 2. I change position frequently to try and get my back comfortable.
- [ ] 3. I walk more slowly than usual because of my back.
- [ ] 4. Because of my back, I am not doing any jobs that I usually do around the house.
- [ ] 5. Because of my back, I use a handrail to get upstairs.
- [ ] 6. Because of my back, I lie down to rest more often.
- [ ] 7. Because of my back, I have to hold on to something to get out of an easy chair.
- [ ] 8. Because of my back, I try to get other people to do things for me.
- [ ] 9. I get dressed more slowly than usual because of my back.
- [ ] 10. I only stand up for short periods of time because of my back.
- [ ] 11. Because of my back, I try not to bend or kneel down.
- [ ] 12. I find it difficult to get out of a chair because of my back.
- [ ] 13. My back is painful almost all of the time.
- [ ] 14. I find it difficult to turn over in bed because of my back.
- [ ] 15. My appetite is not very good because of my back.
- [ ] 16. I have trouble putting on my socks (or stockings) because of the pain in my back.
- [ ] 17. I only walk short distances because of my back pain.
- [ ] 18. I sleep less well because of my back.
- [ ] 19. Because of my back pain, I get dressed with help from someone else.
- [ ] 20. I sit down for most of the day because of my back.
- [ ] 21. I avoid heavy jobs around the house because of my back.
- [ ] 22. Because of back pain, I am more irritable and bad tempered with people than usual.
- [ ] 23. Because of my back, I go upstairs more slowly than usual.
- [ ] 24. I stay in bed most of the time because of my back.

**Total RMDQ Score:** **____ / 24**
- *Interpretation:* 0 = No disability; 24 = Maximum disability.
- *MCID:* **3.5 - 5 points (or 30% improvement from baseline)**.`
  },

  {
    trigger_prefix: '!',
    code: 'quebec',
    title: 'Quebec Back Pain Disability Scale',
    category: 'outcome_measures',
    content: `### Quebec Back Pain Disability Scale

*Scoring: 0 = Not difficult at all | 1 = Minimally difficult | 2 = Somewhat difficult | 3 = Fairly difficult | 4 = Very difficult | 5 = Unable to do*

| Item | Activity | Score (0-5) |
|:-----|:---------|:------------|
| 1    | Get out of bed | [ ] |
| 2    | Sleep through the night | [ ] |
| 3    | Turn over in bed | [ ] |
| 4    | Ride in a car | [ ] |
| 5    | Stand up for 20-30 minutes | [ ] |
| 6    | Sit in a chair for several hours | [ ] |
| 7    | Climb one flight of stairs | [ ] |
| 8    | Walk a few blocks (300-400m) | [ ] |
| 9    | Walk several miles / kilometers | [ ] |
| 10   | Reach up to high shelves | [ ] |
| 11   | Throw a ball | [ ] |
| 12   | Run one block | [ ] |
| 13   | Take food out of the refrigerator | [ ] |
| 14   | Make your bed | [ ] |
| 15   | Put on your socks / pantyhose | [ ] |
| 16   | Bend over to clean a bathtub | [ ] |
| 17   | Move a chair | [ ] |
| 18   | Pull or push heavy doors | [ ] |
| 19   | Carry two bags of groceries | [ ] |
| 20   | Lift and carry a heavy suitcase | [ ] |

**Total Quebec Score:** **____ / 100**
- *MCID:* **15 - 20 points**.`
  },

  {
    trigger_prefix: '!',
    code: 'stork',
    title: 'STarT Back Screening Tool (Keele University)',
    category: 'outcome_measures',
    content: `### STarT Back Screening Tool (Prognostic Triage)

1. My back pain has spread down my leg(s) at some point in the last 2 weeks: [ Disagree: 0 | Agree: 1 ]
2. I have had pain in the shoulder or neck at some point in the last 2 weeks: [ Disagree: 0 | Agree: 1 ]
3. I only walk short distances because of my back pain: [ Disagree: 0 | Agree: 1 ]
4. In the last 2 weeks, I have dressed more slowly than usual because of back pain: [ Disagree: 0 | Agree: 1 ]
*Psychosocial Subscore Items:*
5. It's not really safe for a person with a condition like mine to be physically active: [ Disagree: 0 | Agree: 1 ]
6. Worrying thoughts have been going through my mind a lot of the time: [ Disagree: 0 | Agree: 1 ]
7. I feel that my back pain is terrible and it's never going to get any better: [ Disagree: 0 | Agree: 1 ]
8. In general I have not enjoyed all the things I used to enjoy: [ Disagree: 0 | Agree: 1 ]
9. Overall, how bothersome has your back pain been in the last 2 weeks?
   [ Not at all: 0 | Slightly: 0 | Moderately: 0 | Very much: 1 | Extremely: 1 ]

**Scoring Summary:**
- Total Score (Items 1 - 9): **____ / 9**
- Psychosocial Subscore (Items 5 - 9): **____ / 5**

**Stratified Care Pathway:**
- **Low Risk (Total Score <= 3):** Favorable prognosis. Suitable for primary care reassurance, education, and advice to stay active without intensive therapy.
- **Medium Risk (Total Score >= 4, Psychosocial Subscore <= 3):** Physical impairments predominant. Evidence-based physiotherapy (exercise therapy, manual therapy, directional preference).
- **High Risk (Psychosocial Subscore >= 4 regardless of total):** Psychologically informed physiotherapy (cognitive-behavioral approach, graded exposure, addressing catastrophic thinking and fear-avoidance).`
  },

  // ── Lower Limb ─────────────────────────────────────────────────────────────

  {
    trigger_prefix: '!',
    code: 'lefs',
    title: 'Lower Extremity Functional Scale (LEFS)',
    category: 'outcome_measures',
    content: `### Lower Extremity Functional Scale (LEFS)

*Scoring: 0 = Extreme difficulty / unable | 1 = Quite a bit of difficulty | 2 = Moderate difficulty | 3 = A little bit of difficulty | 4 = No difficulty*

| Item | Functional Activity | Score (0 - 4) |
|:-----|:--------------------|:--------------|
| 1    | Any of your usual work, housework, or school activities | [ ] |
| 2    | Your usual hobbies, recreational, or sporting activities | [ ] |
| 3    | Getting into or out of the bath | [ ] |
| 4    | Walking between rooms | [ ] |
| 5    | Putting on your shoes or socks | [ ] |
| 6    | Squatting | [ ] |
| 7    | Lifting an object, like a bag of groceries from the floor | [ ] |
| 8    | Performing light activities around your home | [ ] |
| 9    | Performing heavy activities around your home | [ ] |
| 10   | Getting into or out of a car | [ ] |
| 11   | Walking 2 blocks | [ ] |
| 12   | Walking a mile | [ ] |
| 13   | Going up or down 10 stairs (about 1 flight) | [ ] |
| 14   | Standing for 1 hour | [ ] |
| 15   | Sitting for 1 hour | [ ] |
| 16   | Running on even ground | [ ] |
| 17   | Running on uneven ground | [ ] |
| 18   | Making sharp turns while running fast | [ ] |
| 19   | Hopping | [ ] |
| 20   | Rolling over in bed | [ ] |

**Scoring & Interpretation:**
- Total LEFS Score: **____ / 80**
- Functional Percentage: **____ %**  *(Formula: Total / 80 * 100)*
- *Minimal Clinically Important Difference (MCID):* **9 points**.`
  },

  {
    trigger_prefix: '!',
    code: 'koos',
    title: 'Knee Injury and Osteoarthritis Outcome Score (KOOS)',
    category: 'outcome_measures',
    content: `### Knee Injury and Osteoarthritis Outcome Score (KOOS)

**Subscale Summary (Each normalized 0 - 100, where 100 = No problems):**
- **1. Pain (9 items):** Score: ____ / 100
- **2. Other Symptoms (7 items):** Score: ____ / 100
- **3. Activities of Daily Living - ADL (17 items):** Score: ____ / 100
- **4. Sport & Recreation Function (5 items):** Score: ____ / 100
- **5. Knee-Related Quality of Life - QOL (4 items):** Score: ____ / 100

*Subscale Calculation Formula:*
\`100 - (Mean of subscale raw scores * 25)\`

**Clinical Interpretation:**
- *MCID for individual subscales:* **8 - 10 points**.`
  },

  {
    trigger_prefix: '!',
    code: 'koos-ps',
    title: 'KOOS Physical Function Shortform (KOOS-PS)',
    category: 'outcome_measures',
    content: `### KOOS Physical Function Shortform (KOOS-PS)
*Scoring: 0 = None | 1 = Mild | 2 = Moderate | 3 = Severe | 4 = Extreme*

1. Rising from bed: [ ]
2. Putting on socks/stockings: [ ]
3. Rising from sitting: [ ]
4. Bending to floor / pick up an object: [ ]
5. Twisting / pivoting on your injured knee: [ ]
6. Kneeling: [ ]
7. Squatting: [ ]

**Raw Sum:** ____ / 28
**Converted Interval Score (0 - 100):** **____ / 100** *(100 = No difficulty)*
- *MCID:* **10 points**.`
  },

  {
    trigger_prefix: '!',
    code: 'ikdc',
    title: 'IKDC Subjective Knee Evaluation Form',
    category: 'outcome_measures',
    content: `### International Knee Documentation Committee (IKDC) Subjective Knee Form

- Symptoms (Pain, Stiffness, Swelling, Giving Way): Raw subtotal: ____
- Sports Activities (Running, Cutting, Decelerating): Raw subtotal: ____
- Current Knee Function (0 to 10 scale): ____

**IKDC Scaled Score:** **____ / 100**
*(Formula: [Sum of answered items / Maximum possible score] * 100)*
- *Interpretation:* Higher score indicates higher level of function and lower level of symptoms.
- *MCID:* **11.5 points**.`
  },

  {
    trigger_prefix: '!',
    code: 'visa-a',
    title: 'VISA-A (Achilles Tendinopathy Questionnaire)',
    category: 'outcome_measures',
    content: `### Victorian Institute of Sport Assessment - Achilles (VISA-A)

1. Morning stiffness in the Achilles region (0 - 10): [ ___ ]
2. Pain when stretching the Achilles over the edge of a step (0 - 10): [ ___ ]
3. Pain walking on flat ground for 30 minutes (0 - 10): [ ___ ]
4. Pain during or immediately after taking stairs (0 - 10): [ ___ ]
5. Pain with single-leg heel raises on flat ground (0 - 10): [ ___ ]
6. Single-leg hops on spot before pain limits you (0 - 10): [ ___ ]
7. Are you currently participating in sporting activity? (0 - 10): [ ___ ]
8. Full sport question tier (A, B, or C - max 30): [ ___ ]

**Total VISA-A Score:** **____ / 100**
- **100 =** Asymptomatic, full sporting capacity.
- **< 80 =** Clinically significant tendon pathology and loading limitation.
- *MCID:* **12 - 14 points**.`
  },

  {
    trigger_prefix: '!',
    code: 'visa-p',
    title: 'VISA-P (Patellar Tendinopathy / Jumper\'s Knee)',
    category: 'outcome_measures',
    content: `### Victorian Institute of Sport Assessment - Patellar (VISA-P)

1. Sitting for 2 hours with knees bent causes knee pain (0 - 10): [ ___ ]
2. Walking down stairs due to knee pain (0 - 10): [ ___ ]
3. Pain in knee joint after giving a strong squat (0 - 10): [ ___ ]
4. Pain during or after single-leg decline squat (0 - 10): [ ___ ]
5. Pain during or after jumping / lunging (0 - 10): [ ___ ]
6. Number of lunges / hops possible before pain stops you (0 - 10): [ ___ ]
7. Current modified training status (0 - 10): [ ___ ]
8. Full competition sporting tier (max 30): [ ___ ]

**Total VISA-P Score:** **____ / 100**
- *Interpretation:* Score < 80 indicates significant patellar tendon loading deficits.
- *MCID:* **13 points**.`
  },

  {
    trigger_prefix: '!',
    code: 'fadi',
    title: 'Foot and Ankle Disability Index (FADI)',
    category: 'outcome_measures',
    content: `### Foot and Ankle Disability Index (FADI)

- Activities of Daily Living Subscale (22 items, 0 - 4): Raw: ____ / 88
- FADI Sport Subscale (4 items, 0 - 4): Raw: ____ / 16

**Total Score:** **____ / 104** (**____ %**)
- *MCID:* **8 points**.`
  },

  {
    trigger_prefix: '!',
    code: 'faam',
    title: 'Foot and Ankle Ability Measure (FAAM)',
    category: 'outcome_measures',
    content: `### Foot and Ankle Ability Measure (FAAM)

- **ADL Subscale (21 items):** Score: **____ / 84** (**____ %**)
- **Sports Subscale (8 items):** Score: **____ / 32** (**____ %**)

**Clinical Significance:**
- *MCID (ADL):* **8 points**
- *MCID (Sport):* **9 points**.`
  },

  {
    trigger_prefix: '!',
    code: 'hoos',
    title: 'Hip Disability and Osteoarthritis Outcome Score (HOOS)',
    category: 'outcome_measures',
    content: `### Hip Disability and Osteoarthritis Outcome Score (HOOS)

**Subscale Scores (0 - 100, where 100 = No symptoms):**
- 1. Symptoms: **____ / 100**
- 2. Pain: **____ / 100**
- 3. Activities of Daily Living (ADL): **____ / 100**
- 4. Sport & Recreation: **____ / 100**
- 5. Hip-Related Quality of Life (QOL): **____ / 100**

- *MCID:* **8 - 10 points per subscale**.`
  },

  // ── Upper Limb ─────────────────────────────────────────────────────────────

  {
    trigger_prefix: '!',
    code: 'quickdash',
    title: 'QuickDASH (Disabilities of Arm, Shoulder & Hand)',
    category: 'outcome_measures',
    content: `### QuickDASH Outcome Measure
*Scoring: 1 = No difficulty | 2 = Mild | 3 = Moderate | 4 = Severe | 5 = Unable*

1. Open a tight or new jar: [ ]
2. Do heavy household chores (wash walls, wash floors): [ ]
3. Carry a shopping bag or briefcase: [ ]
4. Wash your back: [ ]
5. Use a knife to cut food: [ ]
6. Recreational activities requiring force/impact (golf, tennis, hammering): [ ]
7. During the past week, to what extent did arm/shoulder/hand interfere with social activities? [ ]
8. During the past week, were you limited in your work or other activities? [ ]
9. Arm, shoulder, or hand pain severity: [ ]
10. Tingling (pins and needles) in arm, shoulder, or hand: [ ]
11. Difficulty sleeping because of pain: [ ]

**QuickDASH Disability/Symptom Score:** **____ / 100**
*(Formula: [((Sum of 11 items / 11) - 1)] * 25)*
- *Interpretation:* 0 = No disability; 100 = Most severe disability.
- *MCID:* **11 points**.`
  },

  {
    trigger_prefix: '!',
    code: 'dash',
    title: 'Full DASH Questionnaire (30 Items)',
    category: 'outcome_measures',
    content: `### Full Disabilities of the Arm, Shoulder and Hand (DASH)

- Total completed items (30 items, scored 1 - 5): Raw Sum = ____
- **DASH Disability Score:** **____ / 100**
*(Formula: [((Sum of n responses / n) - 1)] * 25, where n >= 27)*
- High score indicates greater disability.
- *MCID:* **10 - 15 points**.`
  },

  {
    trigger_prefix: '!',
    code: 'spadi',
    title: 'Shoulder Pain and Disability Index (SPADI)',
    category: 'outcome_measures',
    content: `### Shoulder Pain and Disability Index (SPADI)

**Pain Subscale (5 items, 0-10):**
1. At its worst: [ ]
2. When lying on involved side: [ ]
3. Reaching for something on high shelf: [ ]
4. Touching back of neck: [ ]
5. Pushing with involved arm: [ ]
*Pain Total: ____ / 50*

**Disability Subscale (8 items, 0-10):**
1. Washing your hair: [ ]
2. Washing your back: [ ]
3. Putting on undershirt / jumper: [ ]
4. Putting on button-down shirt: [ ]
5. Putting on pants: [ ]
6. Placing an object on high shelf: [ ]
7. Carrying heavy object (10 lbs): [ ]
8. Removing something from back pocket: [ ]
*Disability Total: ____ / 80*

**Total SPADI Score:** **____ %**
*(Formula: [Total points scored / 130] * 100)*
- *MCID:* **8 - 13 points**.`
  },

  {
    trigger_prefix: '!',
    code: 'ases',
    title: 'American Shoulder and Elbow Surgeons (ASES)',
    category: 'outcome_measures',
    content: `### American Shoulder and Elbow Surgeons (ASES) Score

- Pain VAS (0 = no pain, 10 = worst): [ ___ ]
  *Pain Score:* (10 - VAS) * 5 = **____ / 50**
- Functional Activities (10 ADL items, scored 0 - 3): Raw sum = [ ___ ]
  *Function Score:* (Raw sum * 5) / 3 = **____ / 50**

**Total ASES Score:** **____ / 100**  *(Pain Score + Function Score)*
- *MCID:* **6.4 - 12 points**.`
  },

  {
    trigger_prefix: '!',
    code: 'pree',
    title: 'Patient-Rated Elbow Evaluation (PREE)',
    category: 'outcome_measures',
    content: `### Patient-Rated Elbow Evaluation (PREE)

- Pain Subscale (5 items, 0-10): Score: **____ / 50**
- Specific Function (10 items, 0-10) + Usual Function (5 items, 0-10):
  *Function Score:* Raw sum / 3 = **____ / 50**

**Total PREE Score:** **____ / 100**  *(Pain + Function)*
- *Interpretation:* 0 = No pain/disability; 100 = Severe pain and disability.`
  },

  {
    trigger_prefix: '!',
    code: 'prwe',
    title: 'Patient-Rated Wrist Evaluation (PRWE)',
    category: 'outcome_measures',
    content: `### Patient-Rated Wrist Evaluation (PRWE)

- **Pain Subscale (5 items, 0-10):** Score: **____ / 50**
- **Specific Activities (6 items, 0-10):** Subtotal: ____
- **Usual Activities (4 items, 0-10):** Subtotal: ____
  *Function Score:* (Specific + Usual sum) / 2 = **____ / 50**

**Total PRWE Score:** **____ / 100**  *(Pain Score + Function Score)*
- *MCID:* **11.5 points**.`
  },

  // ── Pain & Psychosocial ───────────────────────────────────────────────────

  {
    trigger_prefix: '!',
    code: 'nprs',
    title: 'Numeric Pain Rating Scale (NPRS)',
    category: 'outcome_measures',
    content: `### Numeric Pain Rating Scale (NPRS)
*(0 = No pain at all | 10 = Worst imaginable pain)*

- Current Pain Level: **[ ___ / 10 ]**
- Best Pain Level (Past 24 Hours): **[ ___ / 10 ]**
- Worst Pain Level (Past 24 Hours): **[ ___ / 10 ]**
- Average Pain Level: **[ ___ / 10 ]**

**Pain Classification:**
- Mild: 1 - 3 / 10
- Moderate: 4 - 6 / 10
- Severe: 7 - 10 / 10
- *Minimal Clinically Important Difference (MCID):* **2.0 points (or 30% reduction)**.`
  },

  {
    trigger_prefix: '!',
    code: 'vas',
    title: 'Visual Analogue Scale for Pain (VAS)',
    category: 'outcome_measures',
    content: `### Visual Analogue Scale for Pain (VAS 0 - 100 mm)

- Pain Score: **____ mm**  *(Measured on 100mm horizontal line from 'No Pain' to 'Worst Pain')*
- Anchor Band:
  - 0 - 4 mm: No pain
  - 5 - 44 mm: Mild pain
  - 45 - 74 mm: Moderate pain
  - 75 - 100 mm: Severe pain
- *MCID:* **14 - 20 mm**.`
  },

  {
    trigger_prefix: '!',
    code: 'psfs',
    title: 'Patient-Specific Functional Scale (PSFS)',
    category: 'outcome_measures',
    content: `### Patient-Specific Functional Scale (PSFS)
*Scoring: 0 = Unable to perform activity | 10 = Able to perform at pre-injury level*

| # | Nominated Functional Activity | Baseline Score | Current Score | Follow-up |
|:--|:------------------------------|:---------------|:--------------|:----------|
| 1 |                               | [   / 10 ]     | [   / 10 ]    | [   / 10 ]|
| 2 |                               | [   / 10 ]     | [   / 10 ]    | [   / 10 ]|
| 3 |                               | [   / 10 ]     | [   / 10 ]    | [   / 10 ]|
| 4 |                               | [   / 10 ]     | [   / 10 ]    | [   / 10 ]|
| 5 |                               | [   / 10 ]     | [   / 10 ]    | [   / 10 ]|

**Average Functional Score:** **____ / 10**
- *MCID:* **2.0 points for average score (or 3.0 points for single activity)**.`
  },

  {
    trigger_prefix: '!',
    code: 'fabq',
    title: 'Fear-Avoidance Beliefs Questionnaire (FABQ)',
    category: 'outcome_measures',
    content: `### Fear-Avoidance Beliefs Questionnaire (FABQ)
*Scoring: 0 = Completely disagree to 6 = Completely agree*

**1. Physical Activity Subscale (FABQ-PA):**
- Items 2, 3, 4, 5 scored (Max 24): **____ / 24**
- *Cutoff:* **>= 15 points** indicates elevated fear-avoidance beliefs regarding physical activity.

**2. Work Subscale (FABQ-W):**
- Items 6, 7, 9, 10, 11, 12, 15 scored (Max 42): **____ / 42**
- *Cutoff:* **>= 34 points** indicates strong risk of prolonged work disability and poor return-to-work trajectory.`
  },

  {
    trigger_prefix: '!',
    code: 'pcs',
    title: 'Pain Catastrophizing Scale (PCS)',
    category: 'outcome_measures',
    content: `### Pain Catastrophizing Scale (PCS)
*(13 items scored 0 = Not at all to 4 = All the time | Max 52)*

- **Rumination (Items 8, 9, 10, 11):** ____ / 16  *(I can't keep it out of my mind)*
- **Magnification (Items 6, 7, 13):** ____ / 12  *(I wonder whether something serious may happen)*
- **Helplessness (Items 1, 2, 3, 4, 5, 12):** ____ / 24  *(There is nothing I can do to reduce pain)*

**Total PCS Score:** **____ / 52**
- *Clinical Cutoff:* **>= 30 points** represents a clinically relevant, high degree of pain catastrophizing (top 25th percentile). Targeted cognitive-functional therapy strongly recommended.`
  },

  {
    trigger_prefix: '!',
    code: 'tskv',
    title: 'Tampa Scale for Kinesiophobia (TSK-17)',
    category: 'outcome_measures',
    content: `### Tampa Scale for Kinesiophobia (TSK-17)
*(17 items scored 1 = Strongly disagree to 4 = Strongly agree)*
*Note: Items 4, 8, 12, 16 are negatively worded and scored inversely (4=1, 3=2, 2=3, 1=4).*

**Total TSK Score:** **____ / 68**  *(Range 17 - 68)*
- *Cutoff:* **>= 37 points** indicates high kinesiophobia (fear of movement and re-injury).
- Associated with prolonged pain behaviors, functional impairment, and avoidance of rehabilitation loading.`
  }
];

module.exports = {
  SEED_SMART_PHRASES
};
