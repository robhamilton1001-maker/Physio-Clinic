'use strict';

/**
 * Phase 7: Exhaustive Offline Exercise Library & Protocols (165+ Movements)
 * Covering Strength & Conditioning, Orthopaedic Rehabilitation, and Gym Movements.
 */

const SEED_EXERCISES = [
  // ═══════════════════════════════════════════════════════════════════════════
  // 1. KNEE & QUADRICEPS (22 exercises)
  // ═══════════════════════════════════════════════════════════════════════════
  {
    name: "Spanish Squat (Isometric)",
    category: "Knee & Quad",
    default_sets: 4,
    default_reps: "45s hold",
    cues: "Shins strictly vertical, heavy band behind knees, 70-90° knee angle, drive quads into band, chest tall."
  },
  {
    name: "Barbell Back Squat",
    category: "Knee & Quad",
    default_sets: 4,
    default_reps: "6-8 reps",
    cues: "Bar tight across upper traps, mid-foot balance, knees track over toes, break parallel with neutral spine."
  },
  {
    name: "Barbell Front Squat",
    category: "Knee & Quad",
    default_sets: 3,
    default_reps: "8-10 reps",
    cues: "High elbow rack position, vertical torso, drive out of the hole through mid-foot, elbows up throughout."
  },
  {
    name: "Goblet Squat (Kettlebell / DB)",
    category: "Knee & Quad",
    default_sets: 3,
    default_reps: "10-12 reps",
    cues: "Hold bell close to sternum, elbows between knees at bottom, full hip opening, controlled 3s descent."
  },
  {
    name: "Bulgarian Split Squat",
    category: "Knee & Quad",
    default_sets: 3,
    default_reps: "8-10 reps",
    cues: "Rear laces on bench, front knee tracks over 2nd toe, drop back knee straight down, slight torso pitch."
  },
  {
    name: "Leg Extension (Machine)",
    category: "Knee & Quad",
    default_sets: 3,
    default_reps: "12-15 reps",
    cues: "Pad snug above ankles, smooth concentric, 2s peak contraction, control lowering for full quad fatigue."
  },
  {
    name: "Leg Extension (Isometric 60°)",
    category: "Knee & Quad",
    default_sets: 4,
    default_reps: "30s hold",
    cues: "Lock knee angle at 60° flexion to maximize rectus femoris/VMO recruitment while sparing patellar tendon."
  },
  {
    name: "Poliquin Step-Up",
    category: "Knee & Quad",
    default_sets: 3,
    default_reps: "12 reps",
    cues: "Heel elevated on 30° slant wedge, drive knee forward over toes, light contralateral heel tap, 3s eccentric."
  },
  {
    name: "Petersen Step-Up",
    category: "Knee & Quad",
    default_sets: 3,
    default_reps: "12-15 reps",
    cues: "Start on balls of foot with heel raised, press through ball of foot to full extension, focus on VMO squeeze."
  },
  {
    name: "Terminal Knee Extension (TKE)",
    category: "Knee & Quad",
    default_sets: 3,
    default_reps: "15 reps",
    cues: "Band looped behind knee crease, squeeze vastus medialis to lock knee straight against resistance, 2s pause."
  },
  {
    name: "Wall Sit with Adductor Squeeze",
    category: "Knee & Quad",
    default_sets: 3,
    default_reps: "40s hold",
    cues: "Thighs parallel to floor, squeeze yoga block/ball between knees, lower back pressed flat into wall."
  },
  {
    name: "Single-Leg Wall Sit (Iso Hold)",
    category: "Knee & Quad",
    default_sets: 3,
    default_reps: "25s hold",
    cues: "Lift one leg straight ahead, 90° knee angle on stance leg, level pelvis, breathe steadily."
  },
  {
    name: "Leg Press (45-Degree Sled)",
    category: "Knee & Quad",
    default_sets: 3,
    default_reps: "10-12 reps",
    cues: "Feet shoulder-width on platform, keep sacrum firmly glued to seat, avoid knee collapse at bottom."
  },
  {
    name: "Sissy Squat (Bodyweight / Rig)",
    category: "Knee & Quad",
    default_sets: 3,
    default_reps: "8-10 reps",
    cues: "Hips and torso in straight line, knees push forward past toes as heels rise, intense rectus femoris stretch."
  },
  {
    name: "Dumbbell Walking Lunges",
    category: "Knee & Quad",
    default_sets: 3,
    default_reps: "10 steps/leg",
    cues: "Long strides, back knee touches floor gently, maintain upright posture, drive forward off front heel."
  },
  {
    name: "Reverse Lunge (Barbell / DB)",
    category: "Knee & Quad",
    default_sets: 3,
    default_reps: "10 reps/leg",
    cues: "Step backward smoothly, keep 80% weight on front leg, decelerate impact, knee friendly alternative."
  },
  {
    name: "Step-Down (Lateral Box)",
    category: "Knee & Quad",
    default_sets: 3,
    default_reps: "10 reps",
    cues: "Stand on 6-inch box, hinge hips back and reach lateral foot down to floor without bouncing, control pelvic tilt."
  },
  {
    name: "Reverse Nordic Curl (Bodyweight)",
    category: "Knee & Quad",
    default_sets: 3,
    default_reps: "6-8 reps",
    cues: "Kneel tall, glutes squeezed, lean backwards from knees keeping straight line from knees to shoulders."
  },
  {
    name: "Cyclist Squat (Heels Elevated)",
    category: "Knee & Quad",
    default_sets: 3,
    default_reps: "12 reps",
    cues: "Heels 2-3 inches elevated on wedge, narrow stance, deep knee flexion, maximum quad isolation."
  },
  {
    name: "Cossack Squat",
    category: "Knee & Quad",
    default_sets: 3,
    default_reps: "8 reps/side",
    cues: "Wide stance, squat deeply over one leg while other leg stays extended with toes up, upright spine."
  },
  {
    name: "Hack Squat (Machine)",
    category: "Knee & Quad",
    default_sets: 3,
    default_reps: "10-12 reps",
    cues: "Shoulders locked into pads, feet mid-plate, descend to 90°+, drive smoothly without knee snap."
  },
  {
    name: "Straight Leg Raise (Quad Set)",
    category: "Knee & Quad",
    default_sets: 3,
    default_reps: "15 reps",
    cues: "Supine, lock knee in full extension by squeezing quad, lift leg 12 inches, hold 2s, slow descent."
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 2. HAMSTRING & POSTERIOR CHAIN (22 exercises)
  // ═══════════════════════════════════════════════════════════════════════════
  {
    name: "Romanian Deadlift (Barbell RDL)",
    category: "Hamstring & Posterior Chain",
    default_sets: 4,
    default_reps: "8 reps",
    cues: "Soft knee unlock, hinge hips back towards wall, bar skims thighs/shins, maintain neutral thoracic spine."
  },
  {
    name: "Dumbbell Romanian Deadlift",
    category: "Hamstring & Posterior Chain",
    default_sets: 3,
    default_reps: "10-12 reps",
    cues: "DBs tracking close to shins, push hips far back, squeeze hamstrings and glutes through lockout."
  },
  {
    name: "Conventional Barbell Deadlift",
    category: "Hamstring & Posterior Chain",
    default_sets: 4,
    default_reps: "5 reps",
    cues: "Bar over mid-foot, lats engaged, take slack out of bar, drive floor away with legs, lock out tall."
  },
  {
    name: "Trap Bar Deadlift (High / Low Handle)",
    category: "Hamstring & Posterior Chain",
    default_sets: 4,
    default_reps: "6-8 reps",
    cues: "Neutral grip, upright torso, drive through heels, distributed knee and hip hinge mechanics."
  },
  {
    name: "Nordic Hamstring Curl",
    category: "Hamstring & Posterior Chain",
    default_sets: 3,
    default_reps: "5-6 reps",
    cues: "Ankles braced securely, hips locked straight, resist forward descent as long as possible, push back up."
  },
  {
    name: "Slider Hamstring Curl (Bilateral)",
    category: "Hamstring & Posterior Chain",
    default_sets: 3,
    default_reps: "10-12 reps",
    cues: "Glute bridge hold, slide heels out smoothly over 3 seconds, curl heels back without dropping hips."
  },
  {
    name: "Single-Leg Slider Hamstring Curl",
    category: "Hamstring & Posterior Chain",
    default_sets: 3,
    default_reps: "6-8 reps",
    cues: "Bridge up on one leg, slide out under eccentric control, keep pelvis stable and level."
  },
  {
    name: "Prone Lying Leg Curl (Machine)",
    category: "Hamstring & Posterior Chain",
    default_sets: 3,
    default_reps: "10-12 reps",
    cues: "Hips stay glued to pad, pull heels to glutes, pause 1s at peak contraction, 3s controlled eccentric."
  },
  {
    name: "Seated Leg Curl (Machine)",
    category: "Hamstring & Posterior Chain",
    default_sets: 3,
    default_reps: "10-12 reps",
    cues: "Backrest adjusted so knees align with pivot, thighs clamped firmly, deep hamstring stretch at top."
  },
  {
    name: "Single-Leg Romanian Deadlift (SL-RDL)",
    category: "Hamstring & Posterior Chain",
    default_sets: 3,
    default_reps: "8 reps/leg",
    cues: "Reach back heel straight to wall, square hips toward floor, maintain straight line from head to heel."
  },
  {
    name: "Barbell Good Morning",
    category: "Hamstring & Posterior Chain",
    default_sets: 3,
    default_reps: "8-10 reps",
    cues: "Bar on upper back, hinge hips back with slight knee bend, stop when torso is near parallel to floor."
  },
  {
    name: "Swiss Ball Hamstring Rollout",
    category: "Hamstring & Posterior Chain",
    default_sets: 3,
    default_reps: "12 reps",
    cues: "Heels dug into ball, bridge hips high, pull ball towards buttocks while maintaining full hip bridge."
  },
  {
    name: "Banded Hamstring Kickback",
    category: "Hamstring & Posterior Chain",
    default_sets: 3,
    default_reps: "15 reps",
    cues: "Loop band around foot, drive leg back and slightly up, hold peak contraction for 2s."
  },
  {
    name: "Glute-Ham Developer (GHD) Raise",
    category: "Hamstring & Posterior Chain",
    default_sets: 3,
    default_reps: "6-8 reps",
    cues: "Knees just behind pad, lower body horizontal, pull through hamstrings and calves to return upright."
  },
  {
    name: "Back Hyperextension (45-Degree)",
    category: "Hamstring & Posterior Chain",
    default_sets: 3,
    default_reps: "12-15 reps",
    cues: "Hips clear of pad, hinge forward from hips, squeeze glutes and hamstrings to return to neutral line."
  },
  {
    name: "Single-Leg Glute Bridge with Hold",
    category: "Hamstring & Posterior Chain",
    default_sets: 3,
    default_reps: "12 reps",
    cues: "Drive through stance heel, keep opposite knee hugged to chest to lock lumbar spine, 3s peak hold."
  },
  {
    name: "Kettlebell Swing (Hip Hinge)",
    category: "Hamstring & Posterior Chain",
    default_sets: 4,
    default_reps: "15-20 reps",
    cues: "Explosive hip extension, bell floats to chest height, avoid squatting, lock knees and glutes at snap."
  },
  {
    name: "Stiff-Leg Deadlift (from Deficit)",
    category: "Hamstring & Posterior Chain",
    default_sets: 3,
    default_reps: "8 reps",
    cues: "Stand on 2-inch plate, minimal knee flexion, emphasize deep hamstring eccentric stretch, flat back."
  },
  {
    name: "Cable Pull-Through",
    category: "Hamstring & Posterior Chain",
    default_sets: 3,
    default_reps: "12-15 reps",
    cues: "Face away from low pulley, reach rope through legs with hip hinge, stand tall and squeeze glutes hard."
  },
  {
    name: "Standing Single-Leg Hamstring Curl (Machine)",
    category: "Hamstring & Posterior Chain",
    default_sets: 3,
    default_reps: "10-12 reps",
    cues: "Pad behind Achilles, curl heel upward without arching lumbar spine, isolate unilateral hamstring."
  },
  {
    name: "Sumo Deadlift",
    category: "Hamstring & Posterior Chain",
    default_sets: 4,
    default_reps: "5 reps",
    cues: "Wide stance, toes flared 45°, vertical shins, spread the floor with feet, chest proud off floor."
  },
  {
    name: "Nordic Fall & Catch (Regression)",
    category: "Hamstring & Posterior Chain",
    default_sets: 3,
    default_reps: "6 reps",
    cues: "Controlled forward lean to 45°, catch smoothly on hands in pushup position, press back up."
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 3. GLUTE & HIP (20 exercises)
  // ═══════════════════════════════════════════════════════════════════════════
  {
    name: "Barbell Hip Thrust",
    category: "Glute & Hip",
    default_sets: 4,
    default_reps: "8-10 reps",
    cues: "Upper back on bench, barbell over hips with pad, drive heels into floor, posterior pelvic tilt at top."
  },
  {
    name: "Single-Leg Hip Thrust (Bench)",
    category: "Glute & Hip",
    default_sets: 3,
    default_reps: "10-12 reps",
    cues: "One foot grounded, opposite knee at 90°, full glute extension at top, level anterior superior iliac spines."
  },
  {
    name: "B-Stance Hip Thrust (Kickstand)",
    category: "Glute & Hip",
    default_sets: 3,
    default_reps: "10 reps/side",
    cues: "90% weight on working heel, non-working foot on toes slightly ahead, deep glute burn."
  },
  {
    name: "Cable Glute Kickback",
    category: "Glute & Hip",
    default_sets: 3,
    default_reps: "12-15 reps",
    cues: "Ankle strap on low pulley, slight torso lean, kick leg back and out 30° in line with glute fibers, 2s hold."
  },
  {
    name: "Side-Lying Clamshell (with Band)",
    category: "Glute & Hip",
    default_sets: 3,
    default_reps: "15 reps",
    cues: "Knees bent 90°, feet glued together, rotate top knee up without letting pelvis roll backward."
  },
  {
    name: "Copenhagen Adductor Plank",
    category: "Glute & Hip",
    default_sets: 3,
    default_reps: "25-30s hold",
    cues: "Top ankle/knee on bench, side plank on forearm, lift bottom leg to bench, brace groin and lateral core."
  },
  {
    name: "Copenhagen Adductor Dynamic Lifts",
    category: "Glute & Hip",
    default_sets: 3,
    default_reps: "10 reps",
    cues: "Top leg resting on bench, dip hips towards floor and drive back up through top adductor strength."
  },
  {
    name: "Lateral Band Walk (Monster Walk)",
    category: "Glute & Hip",
    default_sets: 3,
    default_reps: "15 steps each way",
    cues: "Mini-band around forefeet or ankles, athletic quarter-squat, step laterally without dragging feet."
  },
  {
    name: "Forward / Backward Banded Monster Walk",
    category: "Glute & Hip",
    default_sets: 3,
    default_reps: "12 steps forward/back",
    cues: "Wide base, maintain tension on band, push out against knees with every diagonal step."
  },
  {
    name: "Seated Hip Abduction (Machine)",
    category: "Glute & Hip",
    default_sets: 3,
    default_reps: "15 reps",
    cues: "Sit slightly forward on seat, push pads apart forcefully, 2s isometric hold at wide peak, slow return."
  },
  {
    name: "Seated Hip Adduction (Machine)",
    category: "Glute & Hip",
    default_sets: 3,
    default_reps: "12-15 reps",
    cues: "Full adductor stretch at wide position, squeeze pads together smoothly, touch gently without slamming."
  },
  {
    name: "Fire Hydrant (Quadruped Abduction)",
    category: "Glute & Hip",
    default_sets: 3,
    default_reps: "12 reps/side",
    cues: "On hands and knees, lift bent knee out to side like a hydrant, keep shoulders and spine motionless."
  },
  {
    name: "Side-Lying Hip Abduction (Straight Leg)",
    category: "Glute & Hip",
    default_sets: 3,
    default_reps: "15 reps",
    cues: "Lie on side, top leg straight with toes angled slightly downward, lift leg toward ceiling behind midline."
  },
  {
    name: "Standing Cable Hip Abduction",
    category: "Glute & Hip",
    default_sets: 3,
    default_reps: "12-15 reps",
    cues: "Ankle cuff attached to low pulley, sweep leg out laterally, stabilize trunk on pillar."
  },
  {
    name: "Frog Pumps (Supine Glute Bridge)",
    category: "Glute & Hip",
    default_sets: 3,
    default_reps: "25 reps",
    cues: "Soles of feet together, knees flared wide, bridge hips up and squeeze glutes hard at top."
  },
  {
    name: "Glute Bridge (Two-Leg Floor)",
    category: "Glute & Hip",
    default_sets: 3,
    default_reps: "15 reps",
    cues: "Feet hip-width, drive heels down, tuck tailbone to fully contract glutes without hyperextending back."
  },
  {
    name: "Step-Up with Hip Drive",
    category: "Glute & Hip",
    default_sets: 3,
    default_reps: "10 reps/side",
    cues: "Drive up onto 18-inch box, explode through stance glute, bring opposite knee to chest in sprinters pose."
  },
  {
    name: "Curtsy Lunge (Dumbbell)",
    category: "Glute & Hip",
    default_sets: 3,
    default_reps: "10 reps/side",
    cues: "Step back diagonally behind front leg, sink hip down, drive up through front glute medius."
  },
  {
    name: "Single-Leg Airplane (Hip Rotation)",
    category: "Glute & Hip",
    default_sets: 3,
    default_reps: "8 reps/side",
    cues: "Hinged single-leg stance, rotate pelvic bowl open then closed over femur, building deep hip rotator control."
  },
  {
    name: "Hip Thrust with Mini-Band",
    category: "Glute & Hip",
    default_sets: 3,
    default_reps: "12 reps",
    cues: "Band above knees, push knees outward against band while driving hips up to full extension."
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 4. FOOT, ANKLE & CALF (20 exercises)
  // ═══════════════════════════════════════════════════════════════════════════
  {
    name: "Standing Calf Raise (Barbell / Machine)",
    category: "Foot, Ankle & Calf",
    default_sets: 4,
    default_reps: "10-12 reps",
    cues: "Knees locked straight to isolate gastrocnemius, full 3s stretch at bottom, explosive rise onto big toe."
  },
  {
    name: "Seated Calf Raise (Soleus)",
    category: "Foot, Ankle & Calf",
    default_sets: 4,
    default_reps: "12-15 reps",
    cues: "Knees at 90° angle, pads on lower thighs, pause 2s in deep dorsiflexion, press into maximum plantarflexion."
  },
  {
    name: "Single-Leg Eccentric Heel Drop (Alfredson)",
    category: "Foot, Ankle & Calf",
    default_sets: 3,
    default_reps: "15 reps",
    cues: "Raise on two feet, shift full weight to injured leg, lower heel below step edge over 3-4s, straight knee."
  },
  {
    name: "Bent-Knee Eccentric Heel Drop (Soleus Focus)",
    category: "Foot, Ankle & Calf",
    default_sets: 3,
    default_reps: "15 reps",
    cues: "Knee bent 30°, lower heel slowly below step level, targets mid-portion/insertional soleus tendon fibers."
  },
  {
    name: "Bilateral Isometric Calf Raise on Step",
    category: "Foot, Ankle & Calf",
    default_sets: 5,
    default_reps: "45s hold",
    cues: "Hold mid-range plantarflexion with heavy load, analgesia for reactive Achilles tendinopathy."
  },
  {
    name: "Single-Leg Isometric Calf Hold",
    category: "Foot, Ankle & Calf",
    default_sets: 4,
    default_reps: "30-40s hold",
    cues: "Balance on ball of single foot at 50% max height, load with DB, maintain stable arch."
  },
  {
    name: "Tibialis Anterior Heel Raises (Wall Lean)",
    category: "Foot, Ankle & Calf",
    default_sets: 3,
    default_reps: "20 reps",
    cues: "Lean buttocks on wall, heels 12 inches out, flex toes towards shins as high as possible, 2s peak hold."
  },
  {
    name: "Tibialis Anterior Dumbbell Toe Raise",
    category: "Foot, Ankle & Calf",
    default_sets: 3,
    default_reps: "15 reps",
    cues: "Sit on bench with heels over edge, strap DB/kettlebell over toes, dorsiflex through full ankle range."
  },
  {
    name: "Ankle Eversion with Resistance Band",
    category: "Foot, Ankle & Calf",
    default_sets: 3,
    default_reps: "15 reps",
    cues: "Band wrapped around lateral forefoot, sweep foot outward into eversion targeting peroneus longus/brevis."
  },
  {
    name: "Ankle Inversion with Resistance Band",
    category: "Foot, Ankle & Calf",
    default_sets: 3,
    default_reps: "15 reps",
    cues: "Band wrapped around medial forefoot, pull foot inward into inversion targeting tibialis posterior."
  },
  {
    name: "Single-Leg Balance on Foam Pad / Airex",
    category: "Foot, Ankle & Calf",
    default_sets: 3,
    default_reps: "45s hold",
    cues: "Soft knee bend, spread toes wide, maintain arch dome, keep eyes fixed on stable horizon point."
  },
  {
    name: "Short Foot Exercise (Arch Domination)",
    category: "Foot, Ankle & Calf",
    default_sets: 3,
    default_reps: "10 reps (5s hold)",
    cues: "Draw 1st MTP towards heel without curling toes, lift medial longitudinal arch actively."
  },
  {
    name: "Toe Spreading & Big Toe Independent Lift",
    category: "Foot, Ankle & Calf",
    default_sets: 3,
    default_reps: "12 reps",
    cues: "Press 4 lateral toes down while lifting big toe; reverse and press big toe down while lifting lateral 4."
  },
  {
    name: "Pogo Hops (Ankle Stiffness / Plyometric)",
    category: "Foot, Ankle & Calf",
    default_sets: 3,
    default_reps: "20 contacts",
    cues: "Spring off balls of feet with stiff ankles, minimal knee bend, maximize rebound height and Achilles recoil."
  },
  {
    name: "Single-Leg Pogo Hops",
    category: "Foot, Ankle & Calf",
    default_sets: 3,
    default_reps: "10 contacts/leg",
    cues: "Rhythmic rapid hops on single ball of foot, quick ground contact time, reactive tendon stiffness."
  },
  {
    name: "Towel Curls (Intrinsic Foot Strengthening)",
    category: "Foot, Ankle & Calf",
    default_sets: 3,
    default_reps: "3 towel lengths",
    cues: "Seated on chair, bunch up a towel across floor using only the toes, pull entire length under foot."
  },
  {
    name: "Farmers Walk on Toes (Calf & Grip)",
    category: "Foot, Ankle & Calf",
    default_sets: 3,
    default_reps: "30 meters",
    cues: "Hold heavy dumbbells at sides, walk on tiptoes with high heels, maintain tall upright posture."
  },
  {
    name: "Calf Stretch on Slant Board (Gastroc)",
    category: "Foot, Ankle & Calf",
    default_sets: 3,
    default_reps: "45s hold",
    cues: "Foot on 30° slant board, knee fully locked, heel firmly planted, lean forward until deep calf stretch."
  },
  {
    name: "Ankle Dorsiflexion Mobilization (Knee to Wall)",
    category: "Foot, Ankle & Calf",
    default_sets: 3,
    default_reps: "12 pulses",
    cues: "Foot 4 inches from wall, drive knee forward over 2nd toe until knee touches wall, heel stays flat."
  },
  {
    name: "Single-Leg Calf Raise (Bodyweight / Deficit)",
    category: "Foot, Ankle & Calf",
    default_sets: 3,
    default_reps: "12-15 reps",
    cues: "Stand on step with one foot, lower heel fully below step edge, push straight up to highest point."
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 5. SHOULDER & SCAPULA (25 exercises)
  // ═══════════════════════════════════════════════════════════════════════════
  {
    name: "Barbell Standing Overhead Press (OHP)",
    category: "Shoulder & Scapula",
    default_sets: 4,
    default_reps: "6-8 reps",
    cues: "Forearms vertical, head pulls back to clear bar, press straight overhead, shrug up and push head through."
  },
  {
    name: "Seated Dumbbell Shoulder Press",
    category: "Shoulder & Scapula",
    default_sets: 3,
    default_reps: "8-10 reps",
    cues: "Bench at 75-80°, dumbbells at ear level, press upward in slight inward arc, avoid flared elbows."
  },
  {
    name: "Dumbbell Lateral Raise",
    category: "Shoulder & Scapula",
    default_sets: 4,
    default_reps: "12-15 reps",
    cues: "Lead with elbows, slight forward torso lean, raise in scapular plane (30° forward), pinkies level."
  },
  {
    name: "Cable Lateral Raise (Behind Back / Low)",
    category: "Shoulder & Scapula",
    default_sets: 3,
    default_reps: "15 reps",
    cues: "Cable across body from low pulley, constant tension on lateral delt, smooth controlled 3s lowering."
  },
  {
    name: "Face Pull with External Rotation",
    category: "Shoulder & Scapula",
    default_sets: 4,
    default_reps: "12-15 reps",
    cues: "Rope to eye height, pull to bridge of nose, rotate hands back into high double-biceps pose, squeeze rear delts."
  },
  {
    name: "Cable External Rotation (at 0° Abduction)",
    category: "Shoulder & Scapula",
    default_sets: 3,
    default_reps: "12-15 reps",
    cues: "Towel rolled between elbow and ribs, elbow locked at 90°, rotate forearm outward, infraspinatus focus."
  },
  {
    name: "Cable Internal Rotation (at 0° Abduction)",
    category: "Shoulder & Scapula",
    default_sets: 3,
    default_reps: "12-15 reps",
    cues: "Towel roll between elbow and ribs, pull forearm across stomach, subscapularis recruitment."
  },
  {
    name: "Side-Lying Shoulder External Rotation",
    category: "Shoulder & Scapula",
    default_sets: 3,
    default_reps: "12-15 reps",
    cues: "Lie on side with light dumbbell (1-3kg), rotate forearm up against gravity, hold 2s at peak."
  },
  {
    name: "Serratus Wall Slide with Foam Roller",
    category: "Shoulder & Scapula",
    default_sets: 3,
    default_reps: "10-12 reps",
    cues: "Forearms on roller with mini-band, slide up to Y-position, actively push chest away from wall (protraction)."
  },
  {
    name: "Push-Up to Plus (Serratus Anterior)",
    category: "Shoulder & Scapula",
    default_sets: 3,
    default_reps: "12-15 reps",
    cues: "In top plank position, push chest away from floor by protracting scapulae, hold 2s, avoid elbow flexion."
  },
  {
    name: "Prone Y-Raise (Lower Trapezius)",
    category: "Shoulder & Scapula",
    default_sets: 3,
    default_reps: "10-12 reps",
    cues: "Prone on 30° incline bench, thumbs pointing to ceiling, arms at 45° angle, initiate from lower trap."
  },
  {
    name: "Prone T-Raise (Middle Trapezius & Rhomboids)",
    category: "Shoulder & Scapula",
    default_sets: 3,
    default_reps: "12 reps",
    cues: "Prone, arms straight out at 90°, thumbs up, squeeze shoulder blades together without shrugging neck."
  },
  {
    name: "Prone W-Raise / Retraction with ER",
    category: "Shoulder & Scapula",
    default_sets: 3,
    default_reps: "12 reps",
    cues: "Elbows bent in W-shape, retract scapulae and rotate forearms up, hold peak contraction 2 seconds."
  },
  {
    name: "Lu Raises (Full Range Lateral Raise)",
    category: "Shoulder & Scapula",
    default_sets: 3,
    default_reps: "10-12 reps",
    cues: "Light plates, raise laterally all the way until weights touch overhead, full scapular upward rotation."
  },
  {
    name: "Dumbbell Rear Delt Fly (Prone / Incline)",
    category: "Shoulder & Scapula",
    default_sets: 3,
    default_reps: "15 reps",
    cues: "Chest on incline bench, pull elbows wide and high, focus on posterior deltoid, control eccentric."
  },
  {
    name: "Kettlebell Arm-Bar (Thoracic Mobility & Cuff)",
    category: "Shoulder & Scapula",
    default_sets: 3,
    default_reps: "30s hold/side",
    cues: "Pack shoulder blade down, look directly at kettlebell, rotate pelvis and leg over to floor."
  },
  {
    name: "Half-Kneeling Landmine Press",
    category: "Shoulder & Scapula",
    default_sets: 3,
    default_reps: "8-10 reps/side",
    cues: "Opposite knee forward, press bar upward at 45° angle, reach long at top for upward rotation."
  },
  {
    name: "Scapular Pull-Up (Depression / Retraction)",
    category: "Shoulder & Scapula",
    default_sets: 3,
    default_reps: "8-10 reps",
    cues: "Dead hang from bar, without bending elbows pull shoulder blades down and back, hold 2s at top."
  },
  {
    name: "Overhead Dumbbell Shrugs (Upper Trapezius)",
    category: "Shoulder & Scapula",
    default_sets: 3,
    default_reps: "12 reps",
    cues: "Arms locked out overhead in slight V, shrug shoulders straight up towards ears, safe neck mechanics."
  },
  {
    name: "External Rotation at 90° Abduction (Cables)",
    category: "Shoulder & Scapula",
    default_sets: 3,
    default_reps: "10-12 reps",
    cues: "Arm abducted 90°, rotate forearm from horizontal to vertical, rotator cuff endurance for throwing."
  },
  {
    name: "Full Can Exercise (Supraspinatus)",
    category: "Shoulder & Scapula",
    default_sets: 3,
    default_reps: "12 reps",
    cues: "Thumbs pointed up, raise dumbbells at 30° in scapular plane to shoulder height, no compensation."
  },
  {
    name: "Bottoms-Up Kettlebell Carry",
    category: "Shoulder & Scapula",
    default_sets: 3,
    default_reps: "25 meters/arm",
    cues: "Hold kettlebell upside down by handle, elbow at 90°, grip tight, stabilizes rotator cuff dynamically."
  },
  {
    name: "Band Dislocates (Shoulder Pass-Throughs)",
    category: "Shoulder & Scapula",
    default_sets: 2,
    default_reps: "15 reps",
    cues: "Wide grip on resistance band, sweep straight arms from front all the way behind back smoothly."
  },
  {
    name: "Arnold Press (Dumbbell)",
    category: "Shoulder & Scapula",
    default_sets: 3,
    default_reps: "10 reps",
    cues: "Start with palms facing chest, rotate outwards as you press overhead, finish with palms forward."
  },
  {
    name: "Prone Trap-3 Raise (on Incline)",
    category: "Shoulder & Scapula",
    default_sets: 3,
    default_reps: "10 reps",
    cues: "Chest on 45° incline, raise dumbbell straight forward with thumb up, isolates lower trapezius."
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 6. CHEST & TRICEPS (20 exercises)
  // ═══════════════════════════════════════════════════════════════════════════
  {
    name: "Barbell Bench Press (Flat)",
    category: "Chest & Triceps",
    default_sets: 4,
    default_reps: "6-8 reps",
    cues: "Feet driven into floor, scapulae retracted into bench, lower bar to sternum with 45° elbow angle."
  },
  {
    name: "Incline Dumbbell Bench Press",
    category: "Chest & Triceps",
    default_sets: 4,
    default_reps: "8-10 reps",
    cues: "30-degree incline, deep stretch across upper clavicular pecs, press dumbbells up in controlled arc."
  },
  {
    name: "Flat Dumbbell Bench Press",
    category: "Chest & Triceps",
    default_sets: 3,
    default_reps: "10 reps",
    cues: "Deep chest stretch, dumbbells touch lightly at top, maintain stable arch and retracted shoulder blades."
  },
  {
    name: "Parallel Bar Dips (Bodyweight / Weighted)",
    category: "Chest & Triceps",
    default_sets: 3,
    default_reps: "8-10 reps",
    cues: "Lean torso 15° forward for chest bias, descend until upper arms are parallel to floor, press to lockout."
  },
  {
    name: "Standard Push-Up (Full ROM)",
    category: "Chest & Triceps",
    default_sets: 3,
    default_reps: "15-20 reps",
    cues: "Rigid plank body, chest touches floor, elbows tucked 45°, push floor away into full scapular protraction."
  },
  {
    name: "Deficit Push-Up (Hands on Blocks / Plates)",
    category: "Chest & Triceps",
    default_sets: 3,
    default_reps: "12 reps",
    cues: "Hands on 3-inch blocks, descend deeper than floor level for extreme pectoral stretch, explosive press."
  },
  {
    name: "Cable Chest Fly (High-to-Low)",
    category: "Chest & Triceps",
    default_sets: 3,
    default_reps: "12-15 reps",
    cues: "Pulleys high, step forward, sweep hands down and together in front of hips, squeeze lower pecs."
  },
  {
    name: "Cable Chest Fly (Low-to-High)",
    category: "Chest & Triceps",
    default_sets: 3,
    default_reps: "12-15 reps",
    cues: "Pulleys low, scoop hands upward and together to chin level, targets clavicular head."
  },
  {
    name: "Pec Deck Machine Fly",
    category: "Chest & Triceps",
    default_sets: 3,
    default_reps: "12-15 reps",
    cues: "Elbows slightly bent, bring pads together with strong 2s squeeze, control opening under tension."
  },
  {
    name: "Close-Grip Barbell Bench Press",
    category: "Chest & Triceps",
    default_sets: 3,
    default_reps: "8-10 reps",
    cues: "Hands shoulder-width apart, elbows tucked tight to ribs, emphasizes triceps overload."
  },
  {
    name: "Tricep Rope Pushdowns (Cable)",
    category: "Chest & Triceps",
    default_sets: 4,
    default_reps: "12-15 reps",
    cues: "Elbows pinned to sides, push rope down and spread handles apart at bottom, full triceps lockout."
  },
  {
    name: "Straight Bar Tricep Cable Pushdowns",
    category: "Chest & Triceps",
    default_sets: 3,
    default_reps: "12 reps",
    cues: "Overhand grip, press bar down until elbows fully locked, control eccentric return to chest height."
  },
  {
    name: "Skull Crushers (EZ-Bar Lying Extension)",
    category: "Chest & Triceps",
    default_sets: 3,
    default_reps: "10-12 reps",
    cues: "Upper arms angled slightly back toward forehead, lower bar to hairline, extend forearms without elbow flare."
  },
  {
    name: "Overhead Dumbbell Tricep Extension",
    category: "Chest & Triceps",
    default_sets: 3,
    default_reps: "10-12 reps",
    cues: "Hold single heavy DB with both hands overhead, lower behind head for deep tricep stretch, extend straight up."
  },
  {
    name: "Cable Overhead Tricep Extension (Rope)",
    category: "Chest & Triceps",
    default_sets: 3,
    default_reps: "12-15 reps",
    cues: "Pulley set mid-height, face away, extend rope over head, heavy stretch on triceps long head."
  },
  {
    name: "Single-Arm Cable Tricep Kickback",
    category: "Chest & Triceps",
    default_sets: 3,
    default_reps: "15 reps",
    cues: "No attachment, hold rubber ball, elbow high, extend arm completely straight behind torso."
  },
  {
    name: "Diamond Push-Ups",
    category: "Chest & Triceps",
    default_sets: 3,
    default_reps: "12 reps",
    cues: "Thumbs and index fingers touching under sternum in diamond shape, elbows track close to body."
  },
  {
    name: "Floor Press (Barbell / Dumbbell)",
    category: "Chest & Triceps",
    default_sets: 3,
    default_reps: "8-10 reps",
    cues: "Lie on floor, triceps touch ground lightly without bouncing, eliminates leg drive for pure pressing strength."
  },
  {
    name: "Incline Dumbbell Fly",
    category: "Chest & Triceps",
    default_sets: 3,
    default_reps: "12 reps",
    cues: "Slight bend in elbows, open arms wide to shoulder depth, hug a large tree on return."
  },
  {
    name: "Bench Dips (Bodyweight / Feet Elevated)",
    category: "Chest & Triceps",
    default_sets: 3,
    default_reps: "15 reps",
    cues: "Hands on bench edge, lower hips straight down to 90° elbow bend, push up through palms."
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 7. BACK & BICEPS (20 exercises)
  // ═══════════════════════════════════════════════════════════════════════════
  {
    name: "Pull-Up (Overhand Grip)",
    category: "Back & Biceps",
    default_sets: 4,
    default_reps: "6-8 reps",
    cues: "Hands just outside shoulders, initiate by driving shoulder blades down, pull chest to bar, dead hang."
  },
  {
    name: "Chin-Up (Underhand Supinated Grip)",
    category: "Back & Biceps",
    default_sets: 3,
    default_reps: "8-10 reps",
    cues: "Palms facing you, full elbow extension at bottom, pull chin cleared over bar, heavy bicep/lat loading."
  },
  {
    name: "Neutral Grip Pull-Up",
    category: "Back & Biceps",
    default_sets: 3,
    default_reps: "8-10 reps",
    cues: "Palms facing each other, shoulder friendly, drive elbows down to ribs, full stretch at bottom."
  },
  {
    name: "Barbell Pendlay Row",
    category: "Back & Biceps",
    default_sets: 4,
    default_reps: "6-8 reps",
    cues: "Torso strictly parallel to floor, bar resets on floor each rep, explosive pull to lower sternum."
  },
  {
    name: "Single-Arm Dumbbell Row",
    category: "Back & Biceps",
    default_sets: 3,
    default_reps: "10-12 reps",
    cues: "One knee on bench, pull dumbbell to hip pocket leading with elbow, avoid excessive torso twisting."
  },
  {
    name: "Chest-Supported T-Bar Row",
    category: "Back & Biceps",
    default_sets: 3,
    default_reps: "10-12 reps",
    cues: "Chest supported on pad eliminates lumbar strain, pull elbows back, squeeze mid-back rhomboids."
  },
  {
    name: "Lat Pulldown (Wide Grip)",
    category: "Back & Biceps",
    default_sets: 4,
    default_reps: "10-12 reps",
    cues: "Thighs locked under pads, pull bar to clavicle with slight backward lean, 2s squeeze, slow eccentric."
  },
  {
    name: "Lat Pulldown (Close-Grip V-Bar)",
    category: "Back & Biceps",
    default_sets: 3,
    default_reps: "10-12 reps",
    cues: "V-handle attached, pull to upper abdomen, flare elbows out slightly, deep lat stretch at top."
  },
  {
    name: "Seated Cable Row",
    category: "Back & Biceps",
    default_sets: 4,
    default_reps: "10-12 reps",
    cues: "Feet braced, upright posture, pull handle to belly button, retract scapulae, avoid rocking momentum."
  },
  {
    name: "Straight-Arm Lat Pulldown (Cable)",
    category: "Back & Biceps",
    default_sets: 3,
    default_reps: "12-15 reps",
    cues: "Slight forward hip hinge, elbows soft, sweep bar down to thighs in wide arc, isolate lats."
  },
  {
    name: "Incline Dumbbell Bicep Curl",
    category: "Back & Biceps",
    default_sets: 3,
    default_reps: "10-12 reps",
    cues: "Bench at 45-60°, arms hang straight down, curl up while supinating wrists, intense stretch on long head."
  },
  {
    name: "Barbell Bicep Curl (Standing)",
    category: "Back & Biceps",
    default_sets: 3,
    default_reps: "8-10 reps",
    cues: "Shoulder-width grip, elbows pinned to sides, curl bar to shoulder height without swinging hips."
  },
  {
    name: "Dumbbell Hammer Curl",
    category: "Back & Biceps",
    default_sets: 3,
    default_reps: "10-12 reps",
    cues: "Neutral grip with palms facing each other, curls dumbbell to shoulder, targets brachioradialis/brachialis."
  },
  {
    name: "EZ-Bar Preacher Curl",
    category: "Back & Biceps",
    default_sets: 3,
    default_reps: "10-12 reps",
    cues: "Armpits snug on preacher pad, curl EZ-bar up, control descent without hyperextending elbows at bottom."
  },
  {
    name: "Concentration Curl (Dumbbell)",
    category: "Back & Biceps",
    default_sets: 3,
    default_reps: "12 reps",
    cues: "Seated, tricep braced against inner thigh, isolate bicep peak contraction with complete control."
  },
  {
    name: "Bayesian Cable Bicep Curl",
    category: "Back & Biceps",
    default_sets: 3,
    default_reps: "12-15 reps",
    cues: "Face away from low pulley, arm extended behind torso, curl forward for full lengthened-state resistance."
  },
  {
    name: "Barbell Shrugs (Traps)",
    category: "Back & Biceps",
    default_sets: 4,
    default_reps: "12-15 reps",
    cues: "Overhand grip, shrug shoulders straight up toward ears, 2s peak hold, avoid rolling shoulders."
  },
  {
    name: "Dumbbell Incline Seal Row",
    category: "Back & Biceps",
    default_sets: 3,
    default_reps: "10 reps",
    cues: "Prone on high flat/incline bench, row dumbbells up until elbows pass torso, pure upper back pulling."
  },
  {
    name: "Inverted Bodyweight Row (TRX / Smith Bar)",
    category: "Back & Biceps",
    default_sets: 3,
    default_reps: "12 reps",
    cues: "Hang under bar with straight body, pull chest to bar while keeping glutes squeezed and neck neutral."
  },
  {
    name: "Spider Curl (Prone Incline)",
    category: "Back & Biceps",
    default_sets: 3,
    default_reps: "12 reps",
    cues: "Chest on vertical side of preacher bench, arms hang vertical, curl bar upward eliminating shoulder motion."
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 8. SPINE & CORE (21 exercises)
  // ═══════════════════════════════════════════════════════════════════════════
  {
    name: "Pallof Press (Anti-Rotation)",
    category: "Spine & Core",
    default_sets: 3,
    default_reps: "10 reps (3s hold)",
    cues: "Athletic stance, press cable handle straight out from chest, resist rotation, hold 3s with core braced."
  },
  {
    name: "McGill Curl-Up",
    category: "Spine & Core",
    default_sets: 3,
    default_reps: "10s holds (5-4-3)",
    cues: "Hands under natural lumbar curve, one knee bent, lift head and shoulders 1 inch as rigid unit, zero neck poke."
  },
  {
    name: "Bird-Dog with Isometric Hold",
    category: "Spine & Core",
    default_sets: 3,
    default_reps: "8 reps (5s hold)",
    cues: "Opposite arm and heel reach, level pelvic bowl, clenched fist and flexed foot, zero lumbar sag or twist."
  },
  {
    name: "Side Plank (Knee / Full Lever)",
    category: "Spine & Core",
    default_sets: 3,
    default_reps: "30-45s hold",
    cues: "Elbow under shoulder, hips lifted high and forward, straight line from ear to ankle, brace obliques."
  },
  {
    name: "Dead Bug (Contralateral Reach)",
    category: "Spine & Core",
    default_sets: 3,
    default_reps: "10 reps/side",
    cues: "Exhale through pursed lips, keep lower back glued to floor, reach opposite arm and heel without arching."
  },
  {
    name: "Ab Wheel Rollout",
    category: "Spine & Core",
    default_sets: 3,
    default_reps: "8-10 reps",
    cues: "Kneel on pad, tuck pelvis into posterior tilt, roll wheel out maintaining hollow body, pull back with abs."
  },
  {
    name: "Hanging Knee / Leg Raise",
    category: "Spine & Core",
    default_sets: 3,
    default_reps: "10-12 reps",
    cues: "Dead hang from bar, curl pelvis upward as knees/legs raise, avoid swinging momentum, slow lowering."
  },
  {
    name: "Cable Woodchopper (Diagonal High-to-Low)",
    category: "Spine & Core",
    default_sets: 3,
    default_reps: "10 reps/side",
    cues: "Pull cable diagonally down across body, pivot back foot, initiate power from hips and obliques."
  },
  {
    name: "Cable Woodchopper (Diagonal Low-to-High)",
    category: "Spine & Core",
    default_sets: 3,
    default_reps: "10 reps/side",
    cues: "Pull cable diagonally up and across body, rotate through thoracic spine, control return."
  },
  {
    name: "Back Hyperextension with Hold",
    category: "Spine & Core",
    default_sets: 3,
    default_reps: "12 reps (3s hold)",
    cues: "45-degree bench, extend spine to neutral line, hold 3s squeezing multifidus and erector spinae."
  },
  {
    name: "Farmers Walk (Bilateral Heavy)",
    category: "Spine & Core",
    default_sets: 3,
    default_reps: "30 meters",
    cues: "Heavy dumbbells or kettlebells at sides, chest proud, short quick strides, absolute torso rigidity."
  },
  {
    name: "Suitcase Carry (Unilateral Heavy)",
    category: "Spine & Core",
    default_sets: 3,
    default_reps: "25 meters/side",
    cues: "Hold heavy dumbbell in one hand only, keep shoulders and hips perfectly level, resist lateral tilt."
  },
  {
    name: "Prone Forearm Plank with Saw",
    category: "Spine & Core",
    default_sets: 3,
    default_reps: "45s hold",
    cues: "Forearms grounded, shift body forward and back on toes, maintain active hollow-body position."
  },
  {
    name: "RKC Plank (Maximum Tension)",
    category: "Spine & Core",
    default_sets: 3,
    default_reps: "15s maximum effort",
    cues: "Pull elbows toward toes, squeeze fists, glutes, and quads at 100% intensity for 15 seconds."
  },
  {
    name: "Hollow Body Hold",
    category: "Spine & Core",
    default_sets: 3,
    default_reps: "30s hold",
    cues: "Lower back pressed into ground, arms overhead, legs 6 inches off floor, hold tight banana shape."
  },
  {
    name: "Stir-the-Pot (Swiss Ball Plank)",
    category: "Spine & Core",
    default_sets: 3,
    default_reps: "10 circles each way",
    cues: "Forearms on exercise ball in plank, make small circles with elbows while keeping pelvis rock steady."
  },
  {
    name: "Reverse Hyperextension (Machine / Bench)",
    category: "Spine & Core",
    default_sets: 3,
    default_reps: "12-15 reps",
    cues: "Torso on pad, lift legs behind body using glutes and erectors, decompresses lumbar spine."
  },
  {
    name: "Copenhagen Plank with Hip Dip",
    category: "Spine & Core",
    default_sets: 3,
    default_reps: "8 reps/side",
    cues: "Side plank with top foot on bench, lower hip toward floor and lift back up, dynamic adductor core."
  },
  {
    name: "Russian Twist (Medicine Ball)",
    category: "Spine & Core",
    default_sets: 3,
    default_reps: "20 twists total",
    cues: "Seated V-sit with heels elevated, rotate torso side to side touching ball to floor, brace abs."
  },
  {
    name: "Prone Cobra (Thoracic Extension)",
    category: "Spine & Core",
    default_sets: 3,
    default_reps: "10 reps (5s hold)",
    cues: "Prone on floor, rotate thumbs out, lift chest and arms while keeping chin tucked, activate lower traps."
  },
  {
    name: "Cat-Camel Spinal Flossing",
    category: "Spine & Core",
    default_sets: 2,
    default_reps: "10 cycles",
    cues: "Quadruped, oscillate smoothly between flexion and extension with rhythmic breathing, low-load flossing."
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
        let sets = ex.sets || 3;
        let reps = ex.reps || "10";
        if (w >= 3 && typeof sets === 'number') sets = Math.min(5, sets + 1);

        return {
          id: ex.id || `ex_${Math.random().toString(36).slice(2, 9)}`,
          name: ex.name,
          category: ex.category || "General",
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
      focus: w <= 2 ? "Early Activation & Tissue Tolerance" : "Progressive Resistance & Functional Capacity",
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
          { name: "Spanish Squat (Isometric)", category: "Knee & Quad", sets: 4, reps: "45s hold", hold_sec: "45s", weight_kg: "Heavy Band", frequency: "2x/day", cues: "Focus on knee extension drive into band; shins vertical." },
          { name: "Terminal Knee Extension (TKE)", category: "Knee & Quad", sets: 3, reps: "15 reps", hold_sec: "2s", weight_kg: "Medium Band", frequency: "2x/day", cues: "Lock vastus medialis at full extension." },
          { name: "Slider Hamstring Curl (Bilateral)", category: "Hamstring & Posterior Chain", sets: 3, reps: "10 reps", hold_sec: "—", weight_kg: "Bodyweight", frequency: "1x/day", cues: "Bridge hips high, slow 3s eccentric descent." }
        ],
        Wed: [
          { name: "Leg Extension (Isometric 60°)", category: "Knee & Quad", sets: 4, reps: "30s hold", hold_sec: "30s", weight_kg: "Bodyweight / 5kg", frequency: "1x/day", cues: "Target quad motor units at 60° knee flexion." },
          { name: "Single-Leg Glute Bridge with Hold", category: "Hamstring & Posterior Chain", sets: 3, reps: "12 reps", hold_sec: "3s", weight_kg: "Bodyweight", frequency: "1x/day", cues: "Keep pelvis level; drive heel down." },
          { name: "Bilateral Isometric Calf Raise on Step", category: "Foot, Ankle & Calf", sets: 4, reps: "45s hold", hold_sec: "45s", weight_kg: "Bodyweight", frequency: "1x/day", cues: "Mid-range plantarflexion hold." }
        ],
        Fri: [
          { name: "Spanish Squat (Isometric)", category: "Knee & Quad", sets: 4, reps: "45s hold", hold_sec: "45s", weight_kg: "Heavy Band", frequency: "2x/day", cues: "Drive quad expansion without patellar pain." },
          { name: "Poliquin Step-Up", category: "Knee & Quad", sets: 3, reps: "10 reps", hold_sec: "—", weight_kg: "Slant Board", frequency: "1x/day", cues: "Track knee over 2nd toe; light heel touch." },
          { name: "Wall Sit with Adductor Squeeze", category: "Knee & Quad", sets: 3, reps: "30s hold", hold_sec: "30s", weight_kg: "Foam Block", frequency: "1x/day", cues: "Squeeze block firmly between knees." }
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
          { name: "Bilateral Isometric Calf Raise on Step", category: "Foot, Ankle & Calf", sets: 5, reps: "45s hold", hold_sec: "45s", weight_kg: "Bodyweight / +10kg", frequency: "1x/day", cues: "Analgesic isometric hold; 2 minutes rest between sets." },
          { name: "Single-Leg Eccentric Heel Drop (Alfredson)", category: "Foot, Ankle & Calf", sets: 3, reps: "15 reps", hold_sec: "3s ecc", weight_kg: "Bodyweight", frequency: "1x/day", cues: "Lower heel past step edge over 3 seconds; knee straight." },
          { name: "Seated Calf Raise (Soleus)", category: "Foot, Ankle & Calf", sets: 3, reps: "12 reps", hold_sec: "2s pause", weight_kg: "Dumbbell on knees", frequency: "1x/day", cues: "Deep stretch into dorsiflexion, explosive plantarflexion." }
        ],
        Thu: [
          { name: "Bilateral Isometric Calf Raise on Step", category: "Foot, Ankle & Calf", sets: 5, reps: "45s hold", hold_sec: "45s", weight_kg: "Bodyweight / +10kg", frequency: "1x/day", cues: "Analgesic isometric hold." },
          { name: "Tibialis Anterior Heel Raises (Wall Lean)", category: "Foot, Ankle & Calf", sets: 3, reps: "20 reps", hold_sec: "1s", weight_kg: "Bodyweight", frequency: "1x/day", cues: "Full dorsiflexion against wall." },
          { name: "Bent-Knee Eccentric Heel Drop (Soleus Focus)", category: "Foot, Ankle & Calf", sets: 3, reps: "15 reps", hold_sec: "3s ecc", weight_kg: "Bodyweight", frequency: "1x/day", cues: "Knee bent at 30° to target soleus tendon." }
        ],
        Sat: [
          { name: "Bilateral Isometric Calf Raise on Step", category: "Foot, Ankle & Calf", sets: 5, reps: "45s hold", hold_sec: "45s", weight_kg: "+15kg Barbell", frequency: "1x/day", cues: "Progressive tendon loading." },
          { name: "Seated Calf Raise (Soleus)", category: "Foot, Ankle & Calf", sets: 4, reps: "10 reps", hold_sec: "3s pause", weight_kg: "+15kg DB", frequency: "1x/day", cues: "Control lowering." },
          { name: "Single-Leg Eccentric Heel Drop (Alfredson)", category: "Foot, Ankle & Calf", sets: 3, reps: "15 reps", hold_sec: "3s ecc", weight_kg: "+5kg Backpack", frequency: "1x/day", cues: "Eccentric tempo strictly enforced." }
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
          { name: "Side-Lying Shoulder External Rotation", category: "Shoulder & Rotator Cuff", sets: 3, reps: "15 reps", hold_sec: "2s", weight_kg: "1-2 kg DB", frequency: "1x/day", cues: "Towel under elbow; clean rotation without compensation." },
          { name: "Serratus Wall Slide with Foam Roller", category: "Shoulder & Scapula", sets: 3, reps: "10 reps", hold_sec: "2s", weight_kg: "Mini-Band", frequency: "1x/day", cues: "Protract scapulae into upward rotation." },
          { name: "Prone Y-Raise (Lower Trapezius)", category: "Shoulder & Scapula", sets: 3, reps: "10 reps", hold_sec: "2s", weight_kg: "Bodyweight", frequency: "1x/day", cues: "Initiate from lower trap; thumbs to ceiling." }
        ],
        Wed: [
          { name: "Face Pull with External Rotation", category: "Shoulder & Scapula", sets: 3, reps: "12 reps", hold_sec: "2s", weight_kg: "Resistance Band", frequency: "1x/day", cues: "Pull to eye level, rotate forearms back." },
          { name: "Cable External Rotation (at 0° Abduction)", category: "Shoulder & Scapula", sets: 3, reps: "12 reps", hold_sec: "3s", weight_kg: "Cable", frequency: "1x/day", cues: "Control eccentric lowering over 3s." },
          { name: "Kettlebell Arm-Bar (Thoracic Mobility & Cuff)", category: "Shoulder & Scapula", sets: 3, reps: "30s hold", hold_sec: "30s", weight_kg: "4-6 kg KB", frequency: "1x/day", cues: "Pack shoulder blade down and back." }
        ],
        Fri: [
          { name: "Serratus Wall Slide with Foam Roller", category: "Shoulder & Scapula", sets: 3, reps: "12 reps", hold_sec: "2s", weight_kg: "Mini-Band", frequency: "1x/day", cues: "Active upward rotation." },
          { name: "Push-Up to Plus (Serratus Anterior)", category: "Shoulder & Scapula", sets: 3, reps: "12 reps", hold_sec: "2s", weight_kg: "Bodyweight", frequency: "1x/day", cues: "High elbow position." },
          { name: "Prone T-Raise (Middle Trapezius & Rhomboids)", category: "Shoulder & Scapula", sets: 3, reps: "12 reps", hold_sec: "2s", weight_kg: "1kg plates", frequency: "1x/day", cues: "Keep neck relaxed." }
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
          { name: "McGill Curl-Up", category: "Spine & Core", sets: 3, reps: "10s hold", hold_sec: "10s", weight_kg: "Bodyweight", frequency: "1x/day", cues: "Hands under lumbar arch; lift chest 1 inch." },
          { name: "Bird-Dog with Isometric Hold", category: "Spine & Core", sets: 3, reps: "8 reps", hold_sec: "5s", weight_kg: "Bodyweight", frequency: "1x/day", cues: "Opposite arm/leg reach; zero lumbar motion." },
          { name: "Side Plank (Knee / Full Lever)", category: "Spine & Core", sets: 3, reps: "30s hold", hold_sec: "30s", weight_kg: "Bodyweight", frequency: "1x/day", cues: "Elbow under shoulder; straight torso." }
        ],
        Wed: [
          { name: "Pallof Press (Anti-Rotation)", category: "Spine & Core", sets: 3, reps: "10 reps", hold_sec: "3s", weight_kg: "Cable / Band", frequency: "1x/day", cues: "Resist rotation; hold arms locked out 3s." },
          { name: "Bird-Dog with Isometric Hold", category: "Spine & Core", sets: 3, reps: "10 reps", hold_sec: "5s", weight_kg: "Bodyweight", frequency: "1x/day", cues: "Neutral spine endurance." },
          { name: "Dead Bug (Contralateral Reach)", category: "Spine & Core", sets: 3, reps: "10 reps", hold_sec: "2s", weight_kg: "Bodyweight", frequency: "1x/day", cues: "Ribs depressed, lumbar flat to floor." }
        ],
        Fri: [
          { name: "McGill Curl-Up", category: "Spine & Core", sets: 3, reps: "10s hold", hold_sec: "10s", weight_kg: "Bodyweight", frequency: "1x/day", cues: "5-4-3 rep descending pyramid." },
          { name: "Side Plank (Knee / Full Lever)", category: "Spine & Core", sets: 3, reps: "40s hold", hold_sec: "40s", weight_kg: "Bodyweight", frequency: "1x/day", cues: "Build lateral core endurance." },
          { name: "Pallof Press (Anti-Rotation)", category: "Spine & Core", sets: 3, reps: "12 reps", hold_sec: "3s", weight_kg: "Band", frequency: "1x/day", cues: "Square hips and athletic stance." }
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
          { name: "Spanish Squat (Isometric)", category: "Knee & Quad", sets: 4, reps: "45s hold", hold_sec: "45s", weight_kg: "Heavy Band", frequency: "1x/day", cues: "Pain-free quadriceps loading." },
          { name: "Wall Sit with Adductor Squeeze", category: "Knee & Quad", sets: 3, reps: "40s hold", hold_sec: "40s", weight_kg: "Foam Block", frequency: "1x/day", cues: "Engage adductor-vastus medialis synergy." },
          { name: "Single-Leg Glute Bridge with Hold", category: "Hamstring & Posterior Chain", sets: 3, reps: "12 reps", hold_sec: "3s", weight_kg: "Bodyweight", frequency: "1x/day", cues: "Hip extension strength." }
        ],
        Thu: [
          { name: "Poliquin Step-Up", category: "Knee & Quad", sets: 3, reps: "12 reps", hold_sec: "—", weight_kg: "Slant Block", frequency: "1x/day", cues: "Slow controlled knee over toes." },
          { name: "Side Plank (Knee / Full Lever)", category: "Spine & Core", sets: 3, reps: "30s hold", hold_sec: "30s", weight_kg: "Bodyweight", frequency: "1x/day", cues: "Abductor & oblique endurance." },
          { name: "Bulgarian Split Squat", category: "Knee & Quad", sets: 3, reps: "8 reps", hold_sec: "—", weight_kg: "Bodyweight", frequency: "1x/day", cues: "Keep front knee tracking over 2nd toe." }
        ],
        Sat: [
          { name: "Spanish Squat (Isometric)", category: "Knee & Quad", sets: 4, reps: "45s hold", hold_sec: "45s", weight_kg: "Band", frequency: "1x/day", cues: "Deep isometric quad burn." },
          { name: "Leg Extension (Isometric 60°)", category: "Knee & Quad", sets: 3, reps: "30s hold", hold_sec: "30s", weight_kg: "5kg DB", frequency: "1x/day", cues: "60° angle to minimize joint reaction force." },
          { name: "Poliquin Step-Up", category: "Knee & Quad", sets: 3, reps: "12 reps", hold_sec: "—", weight_kg: "Slant Block", frequency: "1x/day", cues: "Smooth eccentric control." }
        ]
      }, 4, "PFPS Quad & Hip Rehabilitation Protocol")
    })
  }
];

module.exports = {
  SEED_EXERCISES,
  SEED_TEMPLATES
};
