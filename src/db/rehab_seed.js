'use strict';

/**
 * Phase 7: Phased S&C and Rehab Builder - Seed Library & Protocols
 * Includes high-quality visual exercise cards and multi-week periodized templates.
 */

// SVG vector thumbnails encoded as Data URIs for 100% offline visual richness
const SVG_ICONS = {
  knee: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 48 48' fill='none' stroke='%236366f1' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Ccircle cx='24' cy='10' r='5' fill='%23818cf8' fill-opacity='0.2'/%3E%3Cpath d='M24 15v9l-6 11-4 9'/%3E%3Cpath d='M24 24l8 10 6-2'/%3E%3Ccircle cx='18' cy='35' r='3' fill='%236366f1'/%3E%3C/svg%3E",
  hamstring: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 48 48' fill='none' stroke='%2310b981' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Ccircle cx='14' cy='12' r='4' fill='%2334d399' fill-opacity='0.2'/%3E%3Cpath d='M14 16l8 10-6 12'/%3E%3Cpath d='M22 26l12-3 8 7'/%3E%3Cpath d='M28 24c3 4 5 9 4 15' stroke='%2334d399' stroke-dasharray='2 2'/%3E%3C/svg%3E",
  ankle: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 48 48' fill='none' stroke='%23f59e0b' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M20 6v22l14 8h8'/%3E%3Cpath d='M20 28l-8 4v4h22'/%3E%3Ccircle cx='20' cy='28' r='3.5' fill='%23fbbf24' fill-opacity='0.3'/%3E%3Cpath d='M12 36h22' stroke-width='3'/%3E%3C/svg%3E",
  shoulder: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 48 48' fill='none' stroke='%23ec4899' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Ccircle cx='24' cy='10' r='5' fill='%23f472b6' fill-opacity='0.2'/%3E%3Cpath d='M14 22c3-4 7-6 10-6s7 2 10 6'/%3E%3Cpath d='M14 22l-6 10 8 4'/%3E%3Cpath d='M34 22l8 6-4 10'/%3E%3Ccircle cx='14' cy='22' r='3' fill='%23ec4899'/%3E%3Ccircle cx='34' cy='22' r='3' fill='%23ec4899'/%3E%3C/svg%3E",
  spine: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 48 48' fill='none' stroke='%2306b6d4' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Ccircle cx='24' cy='8' r='3' fill='%2322d3ee'/%3E%3Ccircle cx='24' cy='16' r='3' fill='%2322d3ee'/%3E%3Ccircle cx='24' cy='24' r='3' fill='%2322d3ee'/%3E%3Ccircle cx='24' cy='32' r='3' fill='%2322d3ee'/%3E%3Ccircle cx='24' cy='40' r='3' fill='%2322d3ee'/%3E%3Cpath d='M18 16h12M16 24h16M17 32h14' stroke='%230891b2' stroke-width='2'/%3E%3C/svg%3E",
  strength: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 48 48' fill='none' stroke='%238b5cf6' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Crect x='6' y='18' width='6' height='12' rx='2' fill='%23a78bfa' fill-opacity='0.3'/%3E%3Crect x='36' y='18' width='6' height='12' rx='2' fill='%23a78bfa' fill-opacity='0.3'/%3E%3Crect x='12' y='21' width='4' height='6' rx='1' fill='%238b5cf6'/%3E%3Crect x='32' y='21' width='4' height='6' rx='1' fill='%238b5cf6'/%3E%3Cline x1='16' y1='24' x2='32' y2='24' stroke-width='3'/%3E%3C/svg%3E"
};

const SEED_EXERCISES = [
  // ── Knee & Quadriceps ─────────────────────────────────────────────────────
  {
    name: "Spanish Squat (Isometric)",
    category: "Knee & Quadriceps",
    default_sets: 4,
    default_reps: "45s hold",
    thumbnail_path: SVG_ICONS.knee,
    cues: "Keep shins strictly vertical; band fixed behind knees; sink to 70-90° knee flexion; drive quads into band; chest upright."
  },
  {
    name: "Poliquin Step-Up",
    category: "Knee & Quadriceps",
    default_sets: 3,
    default_reps: "12 reps",
    thumbnail_path: SVG_ICONS.knee,
    cues: "Elevate heel on 30° slant block; track knee forward over 2nd toe; lightly tap opposite heel without pushing off; 3s eccentric."
  },
  {
    name: "Terminal Knee Extension (TKE)",
    category: "Knee & Quadriceps",
    default_sets: 3,
    default_reps: "15 reps",
    thumbnail_path: SVG_ICONS.knee,
    cues: "Heavy band looped behind popliteal fossa; squeeze vastus medialis oblique (VMO) to lock into full extension; hold 2s peak."
  },
  {
    name: "Leg Extension (Isometric 60°)",
    category: "Knee & Quadriceps",
    default_sets: 4,
    default_reps: "30s hold",
    thumbnail_path: SVG_ICONS.knee,
    cues: "Lock pad above ankles; maintain 60° flexion angle to minimize patellofemoral joint stress while maximizing quad recruitment."
  },
  {
    name: "Bulgarian Split Squat",
    category: "Knee & Quadriceps",
    default_sets: 3,
    default_reps: "8-10 reps",
    thumbnail_path: SVG_ICONS.strength,
    cues: "Rear laces on bench; front foot grounded; drop back knee towards floor; slight forward torso lean to load front glute and quad."
  },
  {
    name: "Wall Sit with Adductor Squeeze",
    category: "Knee & Quadriceps",
    default_sets: 3,
    default_reps: "40s hold",
    thumbnail_path: SVG_ICONS.knee,
    cues: "Thighs parallel to floor; squeeze yoga block or ball firmly between knees; keep lumbar spine flat against wall."
  },

  // ── Hamstring & Posterior Chain ───────────────────────────────────────────
  {
    name: "Nordic Hamstring Curl",
    category: "Hamstrings & Posterior Chain",
    default_sets: 3,
    default_reps: "6 reps",
    thumbnail_path: SVG_ICONS.hamstring,
    cues: "Ankles securely anchored; hips locked in neutral extension; control forward fall with hamstrings as far as possible; catch and push."
  },
  {
    name: "Slider Hamstring Curl (Bilateral)",
    category: "Hamstrings & Posterior Chain",
    default_sets: 3,
    default_reps: "10-12 reps",
    thumbnail_path: SVG_ICONS.hamstring,
    cues: "Bridge hips high; slide heels out smoothly over 3 seconds; curl heels back toward glutes while maintaining hip height."
  },
  {
    name: "Barbell Romanian Deadlift (RDL)",
    category: "Hamstrings & Posterior Chain",
    default_sets: 3,
    default_reps: "8 reps",
    thumbnail_path: SVG_ICONS.strength,
    cues: "Hinge at hips; bar skims shins; soft knee bend; flat thoracic spine; drive hips forward through glutes at lockout."
  },
  {
    name: "Single-Leg Glute Bridge with Hold",
    category: "Hamstrings & Posterior Chain",
    default_sets: 3,
    default_reps: "12 reps",
    thumbnail_path: SVG_ICONS.hamstring,
    cues: "Opposite knee hugged to chest to eliminate lumbar arching; drive working heel into ground; hold 3s peak glute contraction."
  },

  // ── Foot & Ankle ──────────────────────────────────────────────────────────
  {
    name: "Achilles Eccentric Heel Drop (Alfredson)",
    category: "Foot & Ankle",
    default_sets: 3,
    default_reps: "15 reps",
    thumbnail_path: SVG_ICONS.ankle,
    cues: "Rise up on both feet; transfer full load to symptomatic leg; lower slowly below step level over 3-4 seconds; repeat straight & bent knee."
  },
  {
    name: "Seated Soleus Calf Raise",
    category: "Foot & Ankle",
    default_sets: 4,
    default_reps: "12 reps",
    thumbnail_path: SVG_ICONS.ankle,
    cues: "Knee bent at 90° to bias soleus over gastrocnemius; pause 2s in full deep dorsiflexion; press through big toe."
  },
  {
    name: "Bilateral Isometric Calf Raise on Step",
    category: "Foot & Ankle",
    default_sets: 5,
    default_reps: "45s hold",
    thumbnail_path: SVG_ICONS.ankle,
    cues: "Hold mid-range plantarflexion; high load for tendon stiffness; maintain equal weight distribution across 1st-5th MTPs."
  },
  {
    name: "Tibialis Anterior Toe Raises",
    category: "Foot & Ankle",
    default_sets: 3,
    default_reps: "20 reps",
    thumbnail_path: SVG_ICONS.ankle,
    cues: "Lean back against wall; heels 12 inches forward; dorsiflex toes as high as possible toward shins; slow lowering."
  },

  // ── Shoulder & Rotator Cuff ───────────────────────────────────────────────
  {
    name: "Side-Lying Shoulder External Rotation",
    category: "Shoulder & Rotator Cuff",
    default_sets: 3,
    default_reps: "12-15 reps",
    thumbnail_path: SVG_ICONS.shoulder,
    cues: "Towel roll between elbow and ribcage; elbow locked at 90°; rotate forearm upward against gravity; no body twisting."
  },
  {
    name: "Serratus Wall Slide with Foam Roller",
    category: "Shoulder & Rotator Cuff",
    default_sets: 3,
    default_reps: "10 reps",
    thumbnail_path: SVG_ICONS.shoulder,
    cues: "Mini-band around wrists; forearms on roller; slide upward into slight Y-position; push chest away from wall (protraction)."
  },
  {
    name: "Prone Y-T-W Scapular Retractions",
    category: "Shoulder & Rotator Cuff",
    default_sets: 3,
    default_reps: "8 each",
    thumbnail_path: SVG_ICONS.shoulder,
    cues: "Prone on bench or floor; thumbs pointing to ceiling; initiate lift with lower and middle trapezius; avoid shrugging."
  },
  {
    name: "Face Pull with External Rotation",
    category: "Shoulder & Rotator Cuff",
    default_sets: 3,
    default_reps: "12 reps",
    thumbnail_path: SVG_ICONS.strength,
    cues: "Pull band/cable toward eyes; rotate knuckles backward at finish; squeeze rear delts and rhomboids; brace core."
  },
  {
    name: "Kettlebell Arm-Bar (Thoracic Stability)",
    category: "Shoulder & Rotator Cuff",
    default_sets: 3,
    default_reps: "30s hold",
    thumbnail_path: SVG_ICONS.shoulder,
    cues: "Lock eye on kettlebell; pack humerus deep into glenoid socket; rotate top leg over to ground; breathe into ribcage."
  },

  // ── Spine, Core & Pelvis ──────────────────────────────────────────────────
  {
    name: "McGill Curl-Up",
    category: "Spine & Core",
    default_sets: 3,
    default_reps: "10s holds (5-4-3 pyramid)",
    thumbnail_path: SVG_ICONS.spine,
    cues: "Hands under natural lumbar curve; one knee bent; lift head and shoulders 1 inch as a rigid unit; do not flatten back."
  },
  {
    name: "Bird-Dog with Isometric Hold",
    category: "Spine & Core",
    default_sets: 3,
    default_reps: "8 reps (5s hold)",
    thumbnail_path: SVG_ICONS.spine,
    cues: "Opposite arm and heel reach; level pelvic bowl; don't let lumbar spine sag or rotate; clenched fist and flexed foot."
  },
  {
    name: "Side Plank (Knee / Full Lever)",
    category: "Spine & Core",
    default_sets: 3,
    default_reps: "30-45s hold",
    thumbnail_path: SVG_ICONS.spine,
    cues: "Elbow stacked under shoulder; lift hips high; straight line from ear to ankle; glutes and obliques actively engaged."
  },
  {
    name: "Pallof Press (Anti-Rotation)",
    category: "Spine & Core",
    default_sets: 3,
    default_reps: "10 reps (3s hold)",
    thumbnail_path: SVG_ICONS.spine,
    cues: "Athletic quarter-squat stance; press handle straight out from sternum; resist rotational pull; maintain square torso."
  },
  {
    name: "Dead Bug (Contralateral Reach)",
    category: "Spine & Core",
    default_sets: 3,
    default_reps: "10 reps each",
    thumbnail_path: SVG_ICONS.spine,
    cues: "Exhale through mouth; keep lower ribs down and back glued to floor; reach opposite arm and heel without arching."
  }
];

// Helper to assemble full progressive protocol JSON
function createWeekSchedule(exercisesByDay, durationWeeks, progressiveNotes) {
  const weeks = [];
  const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  for (let w = 1; w <= durationWeeks; w++) {
    const weekSchedule = {};
    daysOfWeek.forEach(day => {
      const baseExercises = exercisesByDay[day] || [];
      weekSchedule[day] = baseExercises.map(ex => {
        // Adjust sets / reps across weeks for periodization
        let sets = ex.sets || 3;
        let reps = ex.reps || "10";
        if (w >= 3 && typeof sets === 'number') sets = Math.min(5, sets + 1);

        return {
          id: ex.id || `ex_${Math.random().toString(36).slice(2, 9)}`,
          name: ex.name,
          category: ex.category || "General",
          thumbnail_path: ex.thumbnail_path || SVG_ICONS.knee,
          sets: sets,
          reps: reps,
          hold_sec: ex.hold_sec || (ex.reps && ex.reps.includes('s') ? ex.reps : "—"),
          weight_kg: ex.weight_kg || (w >= 3 ? "Light DB / Band" : "Bodyweight"),
          frequency: ex.frequency || "1x/day",
          cues: ex.cues || "",
          notes: progressiveNotes ? `${progressiveNotes} (Week ${w})` : ""
        };
      });
    });

    weeks.push({
      week_num: w,
      title: `Week ${w}`,
      focus: w <= 2 ? "Early Activation & Load Tolerance" : "Progressive Resistance & Functional Capacity",
      days: weekSchedule
    });
  }

  return weeks;
}

const SEED_TEMPLATES = [
  // ── Protocol 1: ACL Reconstruction Phase 1 ────────────────────────────────
  {
    name: "ACL Reconstruction Phase 1: Weeks 1-4",
    category: "Knee / Post-Op",
    duration_weeks: 4,
    protocol_json: JSON.stringify({
      title: "ACL Reconstruction Phase 1 (Weeks 1-4)",
      description: "Restoration of full passive extension, quadriceps reactivation, swelling reduction, and progressive early loading.",
      duration_weeks: 4,
      weeks: createWeekSchedule({
        Mon: [
          { name: "Spanish Squat (Isometric)", category: "Knee & Quadriceps", thumbnail_path: SVG_ICONS.knee, sets: 4, reps: "45s hold", hold_sec: "45s", weight_kg: "Heavy Band", frequency: "2x/day", cues: "Focus on knee extension drive into band; shins vertical." },
          { name: "Terminal Knee Extension (TKE)", category: "Knee & Quadriceps", thumbnail_path: SVG_ICONS.knee, sets: 3, reps: "15 reps", hold_sec: "2s", weight_kg: "Medium Band", frequency: "2x/day", cues: "Lock vastus medialis at full extension." },
          { name: "Slider Hamstring Curl (Bilateral)", category: "Hamstrings & Posterior Chain", thumbnail_path: SVG_ICONS.hamstring, sets: 3, reps: "10 reps", hold_sec: "—", weight_kg: "Bodyweight", frequency: "1x/day", cues: "Bridge hips high, slow 3s eccentric descent." }
        ],
        Wed: [
          { name: "Leg Extension (Isometric 60°)", category: "Knee & Quadriceps", thumbnail_path: SVG_ICONS.knee, sets: 4, reps: "30s hold", hold_sec: "30s", weight_kg: "Bodyweight / 5kg", frequency: "1x/day", cues: "Target quad motor units at 60° knee flexion." },
          { name: "Single-Leg Glute Bridge with Hold", category: "Hamstrings & Posterior Chain", thumbnail_path: SVG_ICONS.hamstring, sets: 3, reps: "12 reps", hold_sec: "3s", weight_kg: "Bodyweight", frequency: "1x/day", cues: "Keep pelvis level; drive heel down." },
          { name: "Bilateral Isometric Calf Raise on Step", category: "Foot & Ankle", thumbnail_path: SVG_ICONS.ankle, sets: 4, reps: "45s hold", hold_sec: "45s", weight_kg: "Bodyweight", frequency: "1x/day", cues: "Mid-range plantarflexion hold." }
        ],
        Fri: [
          { name: "Spanish Squat (Isometric)", category: "Knee & Quadriceps", thumbnail_path: SVG_ICONS.knee, sets: 4, reps: "45s hold", hold_sec: "45s", weight_kg: "Heavy Band", frequency: "2x/day", cues: "Drive quad expansion without patellar pain." },
          { name: "Poliquin Step-Up", category: "Knee & Quadriceps", thumbnail_path: SVG_ICONS.knee, sets: 3, reps: "10 reps", hold_sec: "—", weight_kg: "Slant Board", frequency: "1x/day", cues: "Track knee over 2nd toe; light heel touch." },
          { name: "Wall Sit with Adductor Squeeze", category: "Knee & Quadriceps", thumbnail_path: SVG_ICONS.knee, sets: 3, reps: "30s hold", hold_sec: "30s", weight_kg: "Foam Block", frequency: "1x/day", cues: "Squeeze block firmly between knees." }
        ]
      }, 4, "ACL Post-Op Recovery Protocol")
    })
  },

  // ── Protocol 2: Achilles Tendinopathy Loading ──────────────────────────────
  {
    name: "Achilles Tendinopathy Heavy Slow Resistance",
    category: "Foot & Ankle",
    duration_weeks: 6,
    protocol_json: JSON.stringify({
      title: "Achilles Midportion Tendinopathy Loading (Weeks 1-6)",
      description: "Heavy Slow Resistance (HSR) protocol combined with Alfredson eccentrics to stimulate collagen remodeling and tendon stiffness.",
      duration_weeks: 6,
      weeks: createWeekSchedule({
        Tue: [
          { name: "Bilateral Isometric Calf Raise on Step", category: "Foot & Ankle", thumbnail_path: SVG_ICONS.ankle, sets: 5, reps: "45s hold", hold_sec: "45s", weight_kg: "Bodyweight / +10kg", frequency: "1x/day", cues: "Analgesic isometric hold; 2 minutes rest between sets." },
          { name: "Achilles Eccentric Heel Drop (Alfredson)", category: "Foot & Ankle", thumbnail_path: SVG_ICONS.ankle, sets: 3, reps: "15 reps", hold_sec: "3s ecc", weight_kg: "Bodyweight", frequency: "1x/day", cues: "Lower heel past step edge over 3 seconds; knee straight." },
          { name: "Seated Soleus Calf Raise", category: "Foot & Ankle", thumbnail_path: SVG_ICONS.ankle, sets: 3, reps: "12 reps", hold_sec: "2s pause", weight_kg: "Dumbbell on knees", frequency: "1x/day", cues: "Deep stretch into dorsiflexion, explosive plantarflexion." }
        ],
        Thu: [
          { name: "Bilateral Isometric Calf Raise on Step", category: "Foot & Ankle", thumbnail_path: SVG_ICONS.ankle, sets: 5, reps: "45s hold", hold_sec: "45s", weight_kg: "Bodyweight / +10kg", frequency: "1x/day", cues: "Analgesic isometric hold." },
          { name: "Tibialis Anterior Toe Raises", category: "Foot & Ankle", thumbnail_path: SVG_ICONS.ankle, sets: 3, reps: "20 reps", hold_sec: "1s", weight_kg: "Bodyweight", frequency: "1x/day", cues: "Full dorsiflexion against wall." },
          { name: "Achilles Eccentric Heel Drop (Alfredson)", category: "Foot & Ankle", thumbnail_path: SVG_ICONS.ankle, sets: 3, reps: "15 reps", hold_sec: "3s ecc", weight_kg: "Bodyweight", frequency: "1x/day", cues: "Knee bent at 30° to target soleus tendon." }
        ],
        Sat: [
          { name: "Bilateral Isometric Calf Raise on Step", category: "Foot & Ankle", thumbnail_path: SVG_ICONS.ankle, sets: 5, reps: "45s hold", hold_sec: "45s", weight_kg: "+15kg Barbell", frequency: "1x/day", cues: "Progressive tendon loading." },
          { name: "Seated Soleus Calf Raise", category: "Foot & Ankle", thumbnail_path: SVG_ICONS.ankle, sets: 4, reps: "10 reps", hold_sec: "3s pause", weight_kg: "+15kg DB", frequency: "1x/day", cues: "Control lowering." },
          { name: "Achilles Eccentric Heel Drop (Alfredson)", category: "Foot & Ankle", thumbnail_path: SVG_ICONS.ankle, sets: 3, reps: "15 reps", hold_sec: "3s ecc", weight_kg: "+5kg Backpack", frequency: "1x/day", cues: "Eccentric tempo strictly enforced." }
        ]
      }, 6, "Achilles HSR Protocol")
    })
  },

  // ── Protocol 3: Subacromial Shoulder Rehab & Cuff Progression ─────────────
  {
    name: "Subacromial Shoulder Rehab & Cuff Progression",
    category: "Shoulder",
    duration_weeks: 6,
    protocol_json: JSON.stringify({
      title: "Subacromial Impingement & Rotator Cuff Progression (Weeks 1-6)",
      description: "Restores scapulohumeral rhythm, lower trapezius/serratus anterior recruitment, and progressive rotator cuff capacity.",
      duration_weeks: 6,
      weeks: createWeekSchedule({
        Mon: [
          { name: "Side-Lying Shoulder External Rotation", category: "Shoulder & Rotator Cuff", thumbnail_path: SVG_ICONS.shoulder, sets: 3, reps: "15 reps", hold_sec: "2s", weight_kg: "1-2 kg DB", frequency: "1x/day", cues: "Towel under elbow; clean rotation without compensation." },
          { name: "Serratus Wall Slide with Foam Roller", category: "Shoulder & Rotator Cuff", thumbnail_path: SVG_ICONS.shoulder, sets: 3, reps: "10 reps", hold_sec: "2s", weight_kg: "Mini-Band", frequency: "1x/day", cues: "Protract scapulae into upward rotation." },
          { name: "Prone Y-T-W Scapular Retractions", category: "Shoulder & Rotator Cuff", thumbnail_path: SVG_ICONS.shoulder, sets: 3, reps: "8 each", hold_sec: "2s", weight_kg: "Bodyweight", frequency: "1x/day", cues: "Initiate from mid/lower trap; thumbs to ceiling." }
        ],
        Wed: [
          { name: "Face Pull with External Rotation", category: "Shoulder & Rotator Cuff", thumbnail_path: SVG_ICONS.strength, sets: 3, reps: "12 reps", hold_sec: "2s", weight_kg: "Resistance Band", frequency: "1x/day", cues: "Pull to eye level, rotate forearms back." },
          { name: "Side-Lying Shoulder External Rotation", category: "Shoulder & Rotator Cuff", thumbnail_path: SVG_ICONS.shoulder, sets: 3, reps: "12 reps", hold_sec: "3s", weight_kg: "2-3 kg DB", frequency: "1x/day", cues: "Control eccentric lowering over 3s." },
          { name: "Kettlebell Arm-Bar (Thoracic Stability)", category: "Shoulder & Rotator Cuff", thumbnail_path: SVG_ICONS.shoulder, sets: 3, reps: "30s hold", hold_sec: "30s", weight_kg: "4-6 kg KB", frequency: "1x/day", cues: "Pack shoulder blade down and back." }
        ],
        Fri: [
          { name: "Serratus Wall Slide with Foam Roller", category: "Shoulder & Rotator Cuff", thumbnail_path: SVG_ICONS.shoulder, sets: 3, reps: "12 reps", hold_sec: "2s", weight_kg: "Mini-Band", frequency: "1x/day", cues: "Active upward rotation." },
          { name: "Face Pull with External Rotation", category: "Shoulder & Rotator Cuff", thumbnail_path: SVG_ICONS.strength, sets: 3, reps: "15 reps", hold_sec: "2s", weight_kg: "Cable / Band", frequency: "1x/day", cues: "High elbow position." },
          { name: "Prone Y-T-W Scapular Retractions", category: "Shoulder & Rotator Cuff", thumbnail_path: SVG_ICONS.shoulder, sets: 3, reps: "10 each", hold_sec: "2s", weight_kg: "1kg plates", frequency: "1x/day", cues: "Keep neck relaxed." }
        ]
      }, 6, "Subacromial Decompression & Rotator Cuff Protocol")
    })
  },

  // ── Protocol 4: Lumbar Spine Stabilization & McGill Big 3 ─────────────────
  {
    name: "Lumbar Spine Stabilization & McGill Big 3",
    category: "Spine & Core",
    duration_weeks: 4,
    protocol_json: JSON.stringify({
      title: "Lumbar Spine Stabilization & McGill Big 3 (Weeks 1-4)",
      description: "Low-back sparing core endurance protocol designed to spare spinal discs while maximizing torso stiffness.",
      duration_weeks: 4,
      weeks: createWeekSchedule({
        Mon: [
          { name: "McGill Curl-Up", category: "Spine & Core", thumbnail_path: SVG_ICONS.spine, sets: 3, reps: "10s hold", hold_sec: "10s", weight_kg: "Bodyweight", frequency: "1x/day", cues: "Hands under lumbar arch; lift chest 1 inch." },
          { name: "Bird-Dog with Isometric Hold", category: "Spine & Core", thumbnail_path: SVG_ICONS.spine, sets: 3, reps: "8 reps", hold_sec: "5s", weight_kg: "Bodyweight", frequency: "1x/day", cues: "Opposite arm/leg reach; zero lumbar motion." },
          { name: "Side Plank (Knee / Full Lever)", category: "Spine & Core", thumbnail_path: SVG_ICONS.spine, sets: 3, reps: "30s hold", hold_sec: "30s", weight_kg: "Bodyweight", frequency: "1x/day", cues: "Elbow under shoulder; straight torso." }
        ],
        Wed: [
          { name: "Pallof Press (Anti-Rotation)", category: "Spine & Core", thumbnail_path: SVG_ICONS.spine, sets: 3, reps: "10 reps", hold_sec: "3s", weight_kg: "Cable / Band", frequency: "1x/day", cues: "Resist rotation; hold arms locked out 3s." },
          { name: "Bird-Dog with Isometric Hold", category: "Spine & Core", thumbnail_path: SVG_ICONS.spine, sets: 3, reps: "10 reps", hold_sec: "5s", weight_kg: "Bodyweight", frequency: "1x/day", cues: "Neutral spine endurance." },
          { name: "Dead Bug (Contralateral Reach)", category: "Spine & Core", thumbnail_path: SVG_ICONS.spine, sets: 3, reps: "10 reps", hold_sec: "2s", weight_kg: "Bodyweight", frequency: "1x/day", cues: "Ribs depressed, lumbar flat to floor." }
        ],
        Fri: [
          { name: "McGill Curl-Up", category: "Spine & Core", thumbnail_path: SVG_ICONS.spine, sets: 3, reps: "10s hold", hold_sec: "10s", weight_kg: "Bodyweight", frequency: "1x/day", cues: "5-4-3 rep descending pyramid." },
          { name: "Side Plank (Knee / Full Lever)", category: "Spine & Core", thumbnail_path: SVG_ICONS.spine, sets: 3, reps: "40s hold", hold_sec: "40s", weight_kg: "Bodyweight", frequency: "1x/day", cues: "Build lateral core endurance." },
          { name: "Pallof Press (Anti-Rotation)", category: "Spine & Core", thumbnail_path: SVG_ICONS.spine, sets: 3, reps: "12 reps", hold_sec: "3s", weight_kg: "Band", frequency: "1x/day", cues: "Square hips and athletic stance." }
        ]
      }, 4, "McGill Spinal Stability Protocol")
    })
  },

  // ── Protocol 5: Patellofemoral Pain Syndrome Loading ──────────────────────
  {
    name: "Patellofemoral Pain Syndrome (PFPS) Loading",
    category: "Knee / Anterior Pain",
    duration_weeks: 4,
    protocol_json: JSON.stringify({
      title: "Patellofemoral Pain Syndrome (PFPS) Quad & Hip Protocol (Weeks 1-4)",
      description: "Proximal hip abductor strengthening paired with targeted quadriceps isometrics to optimize patellar tracking and load tolerance.",
      duration_weeks: 4,
      weeks: createWeekSchedule({
        Mon: [
          { name: "Spanish Squat (Isometric)", category: "Knee & Quadriceps", thumbnail_path: SVG_ICONS.knee, sets: 4, reps: "45s hold", hold_sec: "45s", weight_kg: "Heavy Band", frequency: "1x/day", cues: "Pain-free quadriceps loading." },
          { name: "Wall Sit with Adductor Squeeze", category: "Knee & Quadriceps", thumbnail_path: SVG_ICONS.knee, sets: 3, reps: "40s hold", hold_sec: "40s", weight_kg: "Foam Block", frequency: "1x/day", cues: "Engage adductor-vastus medialis synergy." },
          { name: "Single-Leg Glute Bridge with Hold", category: "Hamstrings & Posterior Chain", thumbnail_path: SVG_ICONS.hamstring, sets: 3, reps: "12 reps", hold_sec: "3s", weight_kg: "Bodyweight", frequency: "1x/day", cues: "Hip extension strength." }
        ],
        Thu: [
          { name: "Poliquin Step-Up", category: "Knee & Quadriceps", thumbnail_path: SVG_ICONS.knee, sets: 3, reps: "12 reps", hold_sec: "—", weight_kg: "Slant Block", frequency: "1x/day", cues: "Slow controlled knee over toes." },
          { name: "Side Plank (Knee / Full Lever)", category: "Spine & Core", thumbnail_path: SVG_ICONS.spine, sets: 3, reps: "30s hold", hold_sec: "30s", weight_kg: "Bodyweight", frequency: "1x/day", cues: "Abductor & oblique endurance." },
          { name: "Bulgarian Split Squat", category: "Knee & Quadriceps", thumbnail_path: SVG_ICONS.strength, sets: 3, reps: "8 reps", hold_sec: "—", weight_kg: "Bodyweight", frequency: "1x/day", cues: "Keep front knee tracking over 2nd toe." }
        ],
        Sat: [
          { name: "Spanish Squat (Isometric)", category: "Knee & Quadriceps", thumbnail_path: SVG_ICONS.knee, sets: 4, reps: "45s hold", hold_sec: "45s", weight_kg: "Band", frequency: "1x/day", cues: "Deep isometric quad burn." },
          { name: "Leg Extension (Isometric 60°)", category: "Knee & Quadriceps", thumbnail_path: SVG_ICONS.knee, sets: 3, reps: "30s hold", hold_sec: "30s", weight_kg: "5kg DB", frequency: "1x/day", cues: "60° angle to minimize joint reaction force." },
          { name: "Poliquin Step-Up", category: "Knee & Quadriceps", thumbnail_path: SVG_ICONS.knee, sets: 3, reps: "12 reps", hold_sec: "—", weight_kg: "Slant Block", frequency: "1x/day", cues: "Smooth eccentric control." }
        ]
      }, 4, "PFPS Quad & Hip Rehabilitation Protocol")
    })
  }
];

module.exports = {
  SEED_EXERCISES,
  SEED_TEMPLATES,
  SVG_ICONS
};
