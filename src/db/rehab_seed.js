'use strict';

/**
 * Exhaustive Offline Gross Exercise Library (374+ Atomic Movements)
 * 100% Standalone Individual Exercises. ZERO Pre-Loaded Protocols.
 */

const SEED_EXERCISES = [
  {
    "name": "Spanish Squat (Isometric)",
    "category": "Knee & Quad",
    "default_sets": 4,
    "default_reps": "45s hold",
    "cues": "Shins strictly vertical, heavy band behind knees, 70-90° knee angle, drive quads into band, chest tall."
  },
  {
    "name": "Barbell Back Squat",
    "category": "Knee & Quad",
    "default_sets": 4,
    "default_reps": "6-8 reps",
    "cues": "Bar tight across upper traps, mid-foot balance, knees track over toes, break parallel with neutral spine."
  },
  {
    "name": "Barbell Front Squat",
    "category": "Knee & Quad",
    "default_sets": 3,
    "default_reps": "8-10 reps",
    "cues": "High elbow rack position, vertical torso, drive out of the hole through mid-foot, elbows up throughout."
  },
  {
    "name": "Goblet Squat (Kettlebell / DB)",
    "category": "Knee & Quad",
    "default_sets": 3,
    "default_reps": "10-12 reps",
    "cues": "Hold bell close to sternum, elbows between knees at bottom, full hip opening, controlled 3s descent."
  },
  {
    "name": "Bulgarian Split Squat",
    "category": "Knee & Quad",
    "default_sets": 3,
    "default_reps": "8-10 reps",
    "cues": "Rear laces on bench, front knee tracks over 2nd toe, drop back knee straight down, slight torso pitch."
  },
  {
    "name": "Leg Extension (Machine)",
    "category": "Knee & Quad",
    "default_sets": 3,
    "default_reps": "12-15 reps",
    "cues": "Pad snug above ankles, smooth concentric, 2s peak contraction, control lowering for full quad fatigue."
  },
  {
    "name": "Leg Extension (Isometric 60°)",
    "category": "Knee & Quad",
    "default_sets": 4,
    "default_reps": "30s hold",
    "cues": "Lock knee angle at 60° flexion to maximize rectus femoris/VMO recruitment while sparing patellar tendon."
  },
  {
    "name": "Poliquin Step-Up",
    "category": "Knee & Quad",
    "default_sets": 3,
    "default_reps": "12 reps",
    "cues": "Heel elevated on 30° slant wedge, drive knee forward over toes, light contralateral heel tap, 3s eccentric."
  },
  {
    "name": "Petersen Step-Up",
    "category": "Knee & Quad",
    "default_sets": 3,
    "default_reps": "12-15 reps",
    "cues": "Start on balls of foot with heel raised, press through ball of foot to full extension, focus on VMO squeeze."
  },
  {
    "name": "Terminal Knee Extension (TKE)",
    "category": "Knee & Quad",
    "default_sets": 3,
    "default_reps": "15 reps",
    "cues": "Band looped behind knee crease, squeeze vastus medialis to lock knee straight against resistance, 2s pause."
  },
  {
    "name": "Wall Sit with Adductor Squeeze",
    "category": "Knee & Quad",
    "default_sets": 3,
    "default_reps": "40s hold",
    "cues": "Thighs parallel to floor, squeeze yoga block/ball between knees, lower back pressed flat into wall."
  },
  {
    "name": "Single-Leg Wall Sit (Iso Hold)",
    "category": "Knee & Quad",
    "default_sets": 3,
    "default_reps": "25s hold",
    "cues": "Lift one leg straight ahead, 90° knee angle on stance leg, level pelvis, breathe steadily."
  },
  {
    "name": "Leg Press (45-Degree Sled)",
    "category": "Knee & Quad",
    "default_sets": 3,
    "default_reps": "10-12 reps",
    "cues": "Feet shoulder-width on platform, keep sacrum firmly glued to seat, avoid knee collapse at bottom."
  },
  {
    "name": "Sissy Squat (Bodyweight / Rig)",
    "category": "Knee & Quad",
    "default_sets": 3,
    "default_reps": "8-10 reps",
    "cues": "Hips and torso in straight line, knees push forward past toes as heels rise, intense rectus femoris stretch."
  },
  {
    "name": "Dumbbell Walking Lunges",
    "category": "Knee & Quad",
    "default_sets": 3,
    "default_reps": "10 steps/leg",
    "cues": "Long strides, back knee touches floor gently, maintain upright posture, drive forward off front heel."
  },
  {
    "name": "Reverse Lunge (Barbell / DB)",
    "category": "Knee & Quad",
    "default_sets": 3,
    "default_reps": "10 reps/leg",
    "cues": "Step backward smoothly, keep 80% weight on front leg, decelerate impact, knee friendly alternative."
  },
  {
    "name": "Step-Down (Lateral Box)",
    "category": "Knee & Quad",
    "default_sets": 3,
    "default_reps": "10 reps",
    "cues": "Stand on 6-inch box, hinge hips back and reach lateral foot down to floor without bouncing, control pelvic tilt."
  },
  {
    "name": "Reverse Nordic Curl (Bodyweight)",
    "category": "Knee & Quad",
    "default_sets": 3,
    "default_reps": "6-8 reps",
    "cues": "Kneel tall, glutes squeezed, lean backwards from knees keeping straight line from knees to shoulders."
  },
  {
    "name": "Cyclist Squat (Heels Elevated)",
    "category": "Knee & Quad",
    "default_sets": 3,
    "default_reps": "12 reps",
    "cues": "Heels 2-3 inches elevated on wedge, narrow stance, deep knee flexion, maximum quad isolation."
  },
  {
    "name": "Cossack Squat",
    "category": "Knee & Quad",
    "default_sets": 3,
    "default_reps": "8 reps/side",
    "cues": "Wide stance, squat deeply over one leg while other leg stays extended with toes up, upright spine."
  },
  {
    "name": "Hack Squat (Machine)",
    "category": "Knee & Quad",
    "default_sets": 3,
    "default_reps": "10-12 reps",
    "cues": "Shoulders locked into pads, feet mid-plate, descend to 90°+, drive smoothly without knee snap."
  },
  {
    "name": "Straight Leg Raise (Quad Set)",
    "category": "Knee & Quad",
    "default_sets": 3,
    "default_reps": "15 reps",
    "cues": "Supine, lock knee in full extension by squeezing quad, lift leg 12 inches, hold 2s, slow descent."
  },
  {
    "name": "Romanian Deadlift (Barbell RDL)",
    "category": "Hamstring & Posterior Chain",
    "default_sets": 4,
    "default_reps": "8 reps",
    "cues": "Soft knee unlock, hinge hips back towards wall, bar skims thighs/shins, maintain neutral thoracic spine."
  },
  {
    "name": "Dumbbell Romanian Deadlift",
    "category": "Hamstring & Posterior Chain",
    "default_sets": 3,
    "default_reps": "10-12 reps",
    "cues": "DBs tracking close to shins, push hips far back, squeeze hamstrings and glutes through lockout."
  },
  {
    "name": "Conventional Barbell Deadlift",
    "category": "Hamstring & Posterior Chain",
    "default_sets": 4,
    "default_reps": "5 reps",
    "cues": "Bar over mid-foot, lats engaged, take slack out of bar, drive floor away with legs, lock out tall."
  },
  {
    "name": "Trap Bar Deadlift (High / Low Handle)",
    "category": "Hamstring & Posterior Chain",
    "default_sets": 4,
    "default_reps": "6-8 reps",
    "cues": "Neutral grip, upright torso, drive through heels, distributed knee and hip hinge mechanics."
  },
  {
    "name": "Nordic Hamstring Curl",
    "category": "Hamstring & Posterior Chain",
    "default_sets": 3,
    "default_reps": "5-6 reps",
    "cues": "Ankles braced securely, hips locked straight, resist forward descent as long as possible, push back up."
  },
  {
    "name": "Slider Hamstring Curl (Bilateral)",
    "category": "Hamstring & Posterior Chain",
    "default_sets": 3,
    "default_reps": "10-12 reps",
    "cues": "Glute bridge hold, slide heels out smoothly over 3 seconds, curl heels back without dropping hips."
  },
  {
    "name": "Single-Leg Slider Hamstring Curl",
    "category": "Hamstring & Posterior Chain",
    "default_sets": 3,
    "default_reps": "6-8 reps",
    "cues": "Bridge up on one leg, slide out under eccentric control, keep pelvis stable and level."
  },
  {
    "name": "Prone Lying Leg Curl (Machine)",
    "category": "Hamstring & Posterior Chain",
    "default_sets": 3,
    "default_reps": "10-12 reps",
    "cues": "Hips stay glued to pad, pull heels to glutes, pause 1s at peak contraction, 3s controlled eccentric."
  },
  {
    "name": "Seated Leg Curl (Machine)",
    "category": "Hamstring & Posterior Chain",
    "default_sets": 3,
    "default_reps": "10-12 reps",
    "cues": "Backrest adjusted so knees align with pivot, thighs clamped firmly, deep hamstring stretch at top."
  },
  {
    "name": "Single-Leg Romanian Deadlift (SL-RDL)",
    "category": "Hamstring & Posterior Chain",
    "default_sets": 3,
    "default_reps": "8 reps/leg",
    "cues": "Reach back heel straight to wall, square hips toward floor, maintain straight line from head to heel."
  },
  {
    "name": "Barbell Good Morning",
    "category": "Hamstring & Posterior Chain",
    "default_sets": 3,
    "default_reps": "8-10 reps",
    "cues": "Bar on upper back, hinge hips back with slight knee bend, stop when torso is near parallel to floor."
  },
  {
    "name": "Swiss Ball Hamstring Rollout",
    "category": "Hamstring & Posterior Chain",
    "default_sets": 3,
    "default_reps": "12 reps",
    "cues": "Heels dug into ball, bridge hips high, pull ball towards buttocks while maintaining full hip bridge."
  },
  {
    "name": "Banded Hamstring Kickback",
    "category": "Hamstring & Posterior Chain",
    "default_sets": 3,
    "default_reps": "15 reps",
    "cues": "Loop band around foot, drive leg back and slightly up, hold peak contraction for 2s."
  },
  {
    "name": "Glute-Ham Developer (GHD) Raise",
    "category": "Hamstring & Posterior Chain",
    "default_sets": 3,
    "default_reps": "6-8 reps",
    "cues": "Knees just behind pad, lower body horizontal, pull through hamstrings and calves to return upright."
  },
  {
    "name": "Back Hyperextension (45-Degree)",
    "category": "Hamstring & Posterior Chain",
    "default_sets": 3,
    "default_reps": "12-15 reps",
    "cues": "Hips clear of pad, hinge forward from hips, squeeze glutes and hamstrings to return to neutral line."
  },
  {
    "name": "Single-Leg Glute Bridge with Hold",
    "category": "Hamstring & Posterior Chain",
    "default_sets": 3,
    "default_reps": "12 reps",
    "cues": "Drive through stance heel, keep opposite knee hugged to chest to lock lumbar spine, 3s peak hold."
  },
  {
    "name": "Kettlebell Swing (Hip Hinge)",
    "category": "Hamstring & Posterior Chain",
    "default_sets": 4,
    "default_reps": "15-20 reps",
    "cues": "Explosive hip extension, bell floats to chest height, avoid squatting, lock knees and glutes at snap."
  },
  {
    "name": "Stiff-Leg Deadlift (from Deficit)",
    "category": "Hamstring & Posterior Chain",
    "default_sets": 3,
    "default_reps": "8 reps",
    "cues": "Stand on 2-inch plate, minimal knee flexion, emphasize deep hamstring eccentric stretch, flat back."
  },
  {
    "name": "Cable Pull-Through",
    "category": "Hamstring & Posterior Chain",
    "default_sets": 3,
    "default_reps": "12-15 reps",
    "cues": "Face away from low pulley, reach rope through legs with hip hinge, stand tall and squeeze glutes hard."
  },
  {
    "name": "Standing Single-Leg Hamstring Curl (Machine)",
    "category": "Hamstring & Posterior Chain",
    "default_sets": 3,
    "default_reps": "10-12 reps",
    "cues": "Pad behind Achilles, curl heel upward without arching lumbar spine, isolate unilateral hamstring."
  },
  {
    "name": "Sumo Deadlift",
    "category": "Hamstring & Posterior Chain",
    "default_sets": 4,
    "default_reps": "5 reps",
    "cues": "Wide stance, toes flared 45°, vertical shins, spread the floor with feet, chest proud off floor."
  },
  {
    "name": "Nordic Fall & Catch (Regression)",
    "category": "Hamstring & Posterior Chain",
    "default_sets": 3,
    "default_reps": "6 reps",
    "cues": "Controlled forward lean to 45°, catch smoothly on hands in pushup position, press back up."
  },
  {
    "name": "Barbell Hip Thrust",
    "category": "Glute & Hip",
    "default_sets": 4,
    "default_reps": "8-10 reps",
    "cues": "Upper back on bench, barbell over hips with pad, drive heels into floor, posterior pelvic tilt at top."
  },
  {
    "name": "Single-Leg Hip Thrust (Bench)",
    "category": "Glute & Hip",
    "default_sets": 3,
    "default_reps": "10-12 reps",
    "cues": "One foot grounded, opposite knee at 90°, full glute extension at top, level anterior superior iliac spines."
  },
  {
    "name": "B-Stance Hip Thrust (Kickstand)",
    "category": "Glute & Hip",
    "default_sets": 3,
    "default_reps": "10 reps/side",
    "cues": "90% weight on working heel, non-working foot on toes slightly ahead, deep glute burn."
  },
  {
    "name": "Cable Glute Kickback",
    "category": "Glute & Hip",
    "default_sets": 3,
    "default_reps": "12-15 reps",
    "cues": "Ankle strap on low pulley, slight torso lean, kick leg back and out 30° in line with glute fibers, 2s hold."
  },
  {
    "name": "Side-Lying Clamshell (with Band)",
    "category": "Glute & Hip",
    "default_sets": 3,
    "default_reps": "15 reps",
    "cues": "Knees bent 90°, feet glued together, rotate top knee up without letting pelvis roll backward."
  },
  {
    "name": "Copenhagen Adductor Plank",
    "category": "Glute & Hip",
    "default_sets": 3,
    "default_reps": "25-30s hold",
    "cues": "Top ankle/knee on bench, side plank on forearm, lift bottom leg to bench, brace groin and lateral core."
  },
  {
    "name": "Copenhagen Adductor Dynamic Lifts",
    "category": "Glute & Hip",
    "default_sets": 3,
    "default_reps": "10 reps",
    "cues": "Top leg resting on bench, dip hips towards floor and drive back up through top adductor strength."
  },
  {
    "name": "Lateral Band Walk (Monster Walk)",
    "category": "Glute & Hip",
    "default_sets": 3,
    "default_reps": "15 steps each way",
    "cues": "Mini-band around forefeet or ankles, athletic quarter-squat, step laterally without dragging feet."
  },
  {
    "name": "Forward / Backward Banded Monster Walk",
    "category": "Glute & Hip",
    "default_sets": 3,
    "default_reps": "12 steps forward/back",
    "cues": "Wide base, maintain tension on band, push out against knees with every diagonal step."
  },
  {
    "name": "Seated Hip Abduction (Machine)",
    "category": "Glute & Hip",
    "default_sets": 3,
    "default_reps": "15 reps",
    "cues": "Sit slightly forward on seat, push pads apart forcefully, 2s isometric hold at wide peak, slow return."
  },
  {
    "name": "Seated Hip Adduction (Machine)",
    "category": "Glute & Hip",
    "default_sets": 3,
    "default_reps": "12-15 reps",
    "cues": "Full adductor stretch at wide position, squeeze pads together smoothly, touch gently without slamming."
  },
  {
    "name": "Fire Hydrant (Quadruped Abduction)",
    "category": "Glute & Hip",
    "default_sets": 3,
    "default_reps": "12 reps/side",
    "cues": "On hands and knees, lift bent knee out to side like a hydrant, keep shoulders and spine motionless."
  },
  {
    "name": "Side-Lying Hip Abduction (Straight Leg)",
    "category": "Glute & Hip",
    "default_sets": 3,
    "default_reps": "15 reps",
    "cues": "Lie on side, top leg straight with toes angled slightly downward, lift leg toward ceiling behind midline."
  },
  {
    "name": "Standing Cable Hip Abduction",
    "category": "Glute & Hip",
    "default_sets": 3,
    "default_reps": "12-15 reps",
    "cues": "Ankle cuff attached to low pulley, sweep leg out laterally, stabilize trunk on pillar."
  },
  {
    "name": "Frog Pumps (Supine Glute Bridge)",
    "category": "Glute & Hip",
    "default_sets": 3,
    "default_reps": "25 reps",
    "cues": "Soles of feet together, knees flared wide, bridge hips up and squeeze glutes hard at top."
  },
  {
    "name": "Glute Bridge (Two-Leg Floor)",
    "category": "Glute & Hip",
    "default_sets": 3,
    "default_reps": "15 reps",
    "cues": "Feet hip-width, drive heels down, tuck tailbone to fully contract glutes without hyperextending back."
  },
  {
    "name": "Step-Up with Hip Drive",
    "category": "Glute & Hip",
    "default_sets": 3,
    "default_reps": "10 reps/side",
    "cues": "Drive up onto 18-inch box, explode through stance glute, bring opposite knee to chest in sprinters pose."
  },
  {
    "name": "Curtsy Lunge (Dumbbell)",
    "category": "Glute & Hip",
    "default_sets": 3,
    "default_reps": "10 reps/side",
    "cues": "Step back diagonally behind front leg, sink hip down, drive up through front glute medius."
  },
  {
    "name": "Single-Leg Airplane (Hip Rotation)",
    "category": "Glute & Hip",
    "default_sets": 3,
    "default_reps": "8 reps/side",
    "cues": "Hinged single-leg stance, rotate pelvic bowl open then closed over femur, building deep hip rotator control."
  },
  {
    "name": "Hip Thrust with Mini-Band",
    "category": "Glute & Hip",
    "default_sets": 3,
    "default_reps": "12 reps",
    "cues": "Band above knees, push knees outward against band while driving hips up to full extension."
  },
  {
    "name": "Standing Calf Raise (Barbell / Machine)",
    "category": "Foot, Ankle & Calf",
    "default_sets": 4,
    "default_reps": "10-12 reps",
    "cues": "Knees locked straight to isolate gastrocnemius, full 3s stretch at bottom, explosive rise onto big toe."
  },
  {
    "name": "Seated Calf Raise (Soleus)",
    "category": "Foot, Ankle & Calf",
    "default_sets": 4,
    "default_reps": "12-15 reps",
    "cues": "Knees at 90° angle, pads on lower thighs, pause 2s in deep dorsiflexion, press into maximum plantarflexion."
  },
  {
    "name": "Single-Leg Eccentric Heel Drop (Alfredson)",
    "category": "Foot, Ankle & Calf",
    "default_sets": 3,
    "default_reps": "15 reps",
    "cues": "Raise on two feet, shift full weight to injured leg, lower heel below step edge over 3-4s, straight knee."
  },
  {
    "name": "Bent-Knee Eccentric Heel Drop (Soleus Focus)",
    "category": "Foot, Ankle & Calf",
    "default_sets": 3,
    "default_reps": "15 reps",
    "cues": "Knee bent 30°, lower heel slowly below step level, targets mid-portion/insertional soleus tendon fibers."
  },
  {
    "name": "Bilateral Isometric Calf Raise on Step",
    "category": "Foot, Ankle & Calf",
    "default_sets": 5,
    "default_reps": "45s hold",
    "cues": "Hold mid-range plantarflexion with heavy load, analgesia for reactive Achilles tendinopathy."
  },
  {
    "name": "Single-Leg Isometric Calf Hold",
    "category": "Foot, Ankle & Calf",
    "default_sets": 4,
    "default_reps": "30-40s hold",
    "cues": "Balance on ball of single foot at 50% max height, load with DB, maintain stable arch."
  },
  {
    "name": "Tibialis Anterior Heel Raises (Wall Lean)",
    "category": "Foot, Ankle & Calf",
    "default_sets": 3,
    "default_reps": "20 reps",
    "cues": "Lean buttocks on wall, heels 12 inches out, flex toes towards shins as high as possible, 2s peak hold."
  },
  {
    "name": "Tibialis Anterior Dumbbell Toe Raise",
    "category": "Foot, Ankle & Calf",
    "default_sets": 3,
    "default_reps": "15 reps",
    "cues": "Sit on bench with heels over edge, strap DB/kettlebell over toes, dorsiflex through full ankle range."
  },
  {
    "name": "Ankle Eversion with Resistance Band",
    "category": "Foot, Ankle & Calf",
    "default_sets": 3,
    "default_reps": "15 reps",
    "cues": "Band wrapped around lateral forefoot, sweep foot outward into eversion targeting peroneus longus/brevis."
  },
  {
    "name": "Ankle Inversion with Resistance Band",
    "category": "Foot, Ankle & Calf",
    "default_sets": 3,
    "default_reps": "15 reps",
    "cues": "Band wrapped around medial forefoot, pull foot inward into inversion targeting tibialis posterior."
  },
  {
    "name": "Single-Leg Balance on Foam Pad / Airex",
    "category": "Foot, Ankle & Calf",
    "default_sets": 3,
    "default_reps": "45s hold",
    "cues": "Soft knee bend, spread toes wide, maintain arch dome, keep eyes fixed on stable horizon point."
  },
  {
    "name": "Short Foot Exercise (Arch Domination)",
    "category": "Foot, Ankle & Calf",
    "default_sets": 3,
    "default_reps": "10 reps (5s hold)",
    "cues": "Draw 1st MTP towards heel without curling toes, lift medial longitudinal arch actively."
  },
  {
    "name": "Toe Spreading & Big Toe Independent Lift",
    "category": "Foot, Ankle & Calf",
    "default_sets": 3,
    "default_reps": "12 reps",
    "cues": "Press 4 lateral toes down while lifting big toe; reverse and press big toe down while lifting lateral 4."
  },
  {
    "name": "Pogo Hops (Ankle Stiffness / Plyometric)",
    "category": "Foot, Ankle & Calf",
    "default_sets": 3,
    "default_reps": "20 contacts",
    "cues": "Spring off balls of feet with stiff ankles, minimal knee bend, maximize rebound height and Achilles recoil."
  },
  {
    "name": "Single-Leg Pogo Hops",
    "category": "Foot, Ankle & Calf",
    "default_sets": 3,
    "default_reps": "10 contacts/leg",
    "cues": "Rhythmic rapid hops on single ball of foot, quick ground contact time, reactive tendon stiffness."
  },
  {
    "name": "Towel Curls (Intrinsic Foot Strengthening)",
    "category": "Foot, Ankle & Calf",
    "default_sets": 3,
    "default_reps": "3 towel lengths",
    "cues": "Seated on chair, bunch up a towel across floor using only the toes, pull entire length under foot."
  },
  {
    "name": "Farmers Walk on Toes (Calf & Grip)",
    "category": "Foot, Ankle & Calf",
    "default_sets": 3,
    "default_reps": "30 meters",
    "cues": "Hold heavy dumbbells at sides, walk on tiptoes with high heels, maintain tall upright posture."
  },
  {
    "name": "Calf Stretch on Slant Board (Gastroc)",
    "category": "Foot, Ankle & Calf",
    "default_sets": 3,
    "default_reps": "45s hold",
    "cues": "Foot on 30° slant board, knee fully locked, heel firmly planted, lean forward until deep calf stretch."
  },
  {
    "name": "Ankle Dorsiflexion Mobilization (Knee to Wall)",
    "category": "Foot, Ankle & Calf",
    "default_sets": 3,
    "default_reps": "12 pulses",
    "cues": "Foot 4 inches from wall, drive knee forward over 2nd toe until knee touches wall, heel stays flat."
  },
  {
    "name": "Single-Leg Calf Raise (Bodyweight / Deficit)",
    "category": "Foot, Ankle & Calf",
    "default_sets": 3,
    "default_reps": "12-15 reps",
    "cues": "Stand on step with one foot, lower heel fully below step edge, push straight up to highest point."
  },
  {
    "name": "Barbell Standing Overhead Press (OHP)",
    "category": "Shoulder & Scapula",
    "default_sets": 4,
    "default_reps": "6-8 reps",
    "cues": "Forearms vertical, head pulls back to clear bar, press straight overhead, shrug up and push head through."
  },
  {
    "name": "Seated Dumbbell Shoulder Press",
    "category": "Shoulder & Scapula",
    "default_sets": 3,
    "default_reps": "8-10 reps",
    "cues": "Bench at 75-80°, dumbbells at ear level, press upward in slight inward arc, avoid flared elbows."
  },
  {
    "name": "Dumbbell Lateral Raise",
    "category": "Shoulder & Scapula",
    "default_sets": 4,
    "default_reps": "12-15 reps",
    "cues": "Lead with elbows, slight forward torso lean, raise in scapular plane (30° forward), pinkies level."
  },
  {
    "name": "Cable Lateral Raise (Behind Back / Low)",
    "category": "Shoulder & Scapula",
    "default_sets": 3,
    "default_reps": "15 reps",
    "cues": "Cable across body from low pulley, constant tension on lateral delt, smooth controlled 3s lowering."
  },
  {
    "name": "Face Pull with External Rotation",
    "category": "Shoulder & Scapula",
    "default_sets": 4,
    "default_reps": "12-15 reps",
    "cues": "Rope to eye height, pull to bridge of nose, rotate hands back into high double-biceps pose, squeeze rear delts."
  },
  {
    "name": "Cable External Rotation (at 0° Abduction)",
    "category": "Shoulder & Scapula",
    "default_sets": 3,
    "default_reps": "12-15 reps",
    "cues": "Towel rolled between elbow and ribs, elbow locked at 90°, rotate forearm outward, infraspinatus focus."
  },
  {
    "name": "Cable Internal Rotation (at 0° Abduction)",
    "category": "Shoulder & Scapula",
    "default_sets": 3,
    "default_reps": "12-15 reps",
    "cues": "Towel roll between elbow and ribs, pull forearm across stomach, subscapularis recruitment."
  },
  {
    "name": "Side-Lying Shoulder External Rotation",
    "category": "Shoulder & Scapula",
    "default_sets": 3,
    "default_reps": "12-15 reps",
    "cues": "Lie on side with light dumbbell (1-3kg), rotate forearm up against gravity, hold 2s at peak."
  },
  {
    "name": "Serratus Wall Slide with Foam Roller",
    "category": "Shoulder & Scapula",
    "default_sets": 3,
    "default_reps": "10-12 reps",
    "cues": "Forearms on roller with mini-band, slide up to Y-position, actively push chest away from wall (protraction)."
  },
  {
    "name": "Push-Up to Plus (Serratus Anterior)",
    "category": "Shoulder & Scapula",
    "default_sets": 3,
    "default_reps": "12-15 reps",
    "cues": "In top plank position, push chest away from floor by protracting scapulae, hold 2s, avoid elbow flexion."
  },
  {
    "name": "Prone Y-Raise (Lower Trapezius)",
    "category": "Shoulder & Scapula",
    "default_sets": 3,
    "default_reps": "10-12 reps",
    "cues": "Prone on 30° incline bench, thumbs pointing to ceiling, arms at 45° angle, initiate from lower trap."
  },
  {
    "name": "Prone T-Raise (Middle Trapezius & Rhomboids)",
    "category": "Shoulder & Scapula",
    "default_sets": 3,
    "default_reps": "12 reps",
    "cues": "Prone, arms straight out at 90°, thumbs up, squeeze shoulder blades together without shrugging neck."
  },
  {
    "name": "Prone W-Raise / Retraction with ER",
    "category": "Shoulder & Scapula",
    "default_sets": 3,
    "default_reps": "12 reps",
    "cues": "Elbows bent in W-shape, retract scapulae and rotate forearms up, hold peak contraction 2 seconds."
  },
  {
    "name": "Lu Raises (Full Range Lateral Raise)",
    "category": "Shoulder & Scapula",
    "default_sets": 3,
    "default_reps": "10-12 reps",
    "cues": "Light plates, raise laterally all the way until weights touch overhead, full scapular upward rotation."
  },
  {
    "name": "Dumbbell Rear Delt Fly (Prone / Incline)",
    "category": "Shoulder & Scapula",
    "default_sets": 3,
    "default_reps": "15 reps",
    "cues": "Chest on incline bench, pull elbows wide and high, focus on posterior deltoid, control eccentric."
  },
  {
    "name": "Kettlebell Arm-Bar (Thoracic Mobility & Cuff)",
    "category": "Shoulder & Scapula",
    "default_sets": 3,
    "default_reps": "30s hold/side",
    "cues": "Pack shoulder blade down, look directly at kettlebell, rotate pelvis and leg over to floor."
  },
  {
    "name": "Half-Kneeling Landmine Press",
    "category": "Shoulder & Scapula",
    "default_sets": 3,
    "default_reps": "8-10 reps/side",
    "cues": "Opposite knee forward, press bar upward at 45° angle, reach long at top for upward rotation."
  },
  {
    "name": "Scapular Pull-Up (Depression / Retraction)",
    "category": "Shoulder & Scapula",
    "default_sets": 3,
    "default_reps": "8-10 reps",
    "cues": "Dead hang from bar, without bending elbows pull shoulder blades down and back, hold 2s at top."
  },
  {
    "name": "Overhead Dumbbell Shrugs (Upper Trapezius)",
    "category": "Shoulder & Scapula",
    "default_sets": 3,
    "default_reps": "12 reps",
    "cues": "Arms locked out overhead in slight V, shrug shoulders straight up towards ears, safe neck mechanics."
  },
  {
    "name": "External Rotation at 90° Abduction (Cables)",
    "category": "Shoulder & Scapula",
    "default_sets": 3,
    "default_reps": "10-12 reps",
    "cues": "Arm abducted 90°, rotate forearm from horizontal to vertical, rotator cuff endurance for throwing."
  },
  {
    "name": "Full Can Exercise (Supraspinatus)",
    "category": "Shoulder & Scapula",
    "default_sets": 3,
    "default_reps": "12 reps",
    "cues": "Thumbs pointed up, raise dumbbells at 30° in scapular plane to shoulder height, no compensation."
  },
  {
    "name": "Bottoms-Up Kettlebell Carry",
    "category": "Shoulder & Scapula",
    "default_sets": 3,
    "default_reps": "25 meters/arm",
    "cues": "Hold kettlebell upside down by handle, elbow at 90°, grip tight, stabilizes rotator cuff dynamically."
  },
  {
    "name": "Band Dislocates (Shoulder Pass-Throughs)",
    "category": "Shoulder & Scapula",
    "default_sets": 2,
    "default_reps": "15 reps",
    "cues": "Wide grip on resistance band, sweep straight arms from front all the way behind back smoothly."
  },
  {
    "name": "Arnold Press (Dumbbell)",
    "category": "Shoulder & Scapula",
    "default_sets": 3,
    "default_reps": "10 reps",
    "cues": "Start with palms facing chest, rotate outwards as you press overhead, finish with palms forward."
  },
  {
    "name": "Prone Trap-3 Raise (on Incline)",
    "category": "Shoulder & Scapula",
    "default_sets": 3,
    "default_reps": "10 reps",
    "cues": "Chest on 45° incline, raise dumbbell straight forward with thumb up, isolates lower trapezius."
  },
  {
    "name": "Barbell Bench Press (Flat)",
    "category": "Chest & Triceps",
    "default_sets": 4,
    "default_reps": "6-8 reps",
    "cues": "Feet driven into floor, scapulae retracted into bench, lower bar to sternum with 45° elbow angle."
  },
  {
    "name": "Incline Dumbbell Bench Press",
    "category": "Chest & Triceps",
    "default_sets": 4,
    "default_reps": "8-10 reps",
    "cues": "30-degree incline, deep stretch across upper clavicular pecs, press dumbbells up in controlled arc."
  },
  {
    "name": "Flat Dumbbell Bench Press",
    "category": "Chest & Triceps",
    "default_sets": 3,
    "default_reps": "10 reps",
    "cues": "Deep chest stretch, dumbbells touch lightly at top, maintain stable arch and retracted shoulder blades."
  },
  {
    "name": "Parallel Bar Dips (Bodyweight / Weighted)",
    "category": "Chest & Triceps",
    "default_sets": 3,
    "default_reps": "8-10 reps",
    "cues": "Lean torso 15° forward for chest bias, descend until upper arms are parallel to floor, press to lockout."
  },
  {
    "name": "Standard Push-Up (Full ROM)",
    "category": "Chest & Triceps",
    "default_sets": 3,
    "default_reps": "15-20 reps",
    "cues": "Rigid plank body, chest touches floor, elbows tucked 45°, push floor away into full scapular protraction."
  },
  {
    "name": "Deficit Push-Up (Hands on Blocks / Plates)",
    "category": "Chest & Triceps",
    "default_sets": 3,
    "default_reps": "12 reps",
    "cues": "Hands on 3-inch blocks, descend deeper than floor level for extreme pectoral stretch, explosive press."
  },
  {
    "name": "Cable Chest Fly (High-to-Low)",
    "category": "Chest & Triceps",
    "default_sets": 3,
    "default_reps": "12-15 reps",
    "cues": "Pulleys high, step forward, sweep hands down and together in front of hips, squeeze lower pecs."
  },
  {
    "name": "Cable Chest Fly (Low-to-High)",
    "category": "Chest & Triceps",
    "default_sets": 3,
    "default_reps": "12-15 reps",
    "cues": "Pulleys low, scoop hands upward and together to chin level, targets clavicular head."
  },
  {
    "name": "Pec Deck Machine Fly",
    "category": "Chest & Triceps",
    "default_sets": 3,
    "default_reps": "12-15 reps",
    "cues": "Elbows slightly bent, bring pads together with strong 2s squeeze, control opening under tension."
  },
  {
    "name": "Close-Grip Barbell Bench Press",
    "category": "Chest & Triceps",
    "default_sets": 3,
    "default_reps": "8-10 reps",
    "cues": "Hands shoulder-width apart, elbows tucked tight to ribs, emphasizes triceps overload."
  },
  {
    "name": "Tricep Rope Pushdowns (Cable)",
    "category": "Chest & Triceps",
    "default_sets": 4,
    "default_reps": "12-15 reps",
    "cues": "Elbows pinned to sides, push rope down and spread handles apart at bottom, full triceps lockout."
  },
  {
    "name": "Straight Bar Tricep Cable Pushdowns",
    "category": "Chest & Triceps",
    "default_sets": 3,
    "default_reps": "12 reps",
    "cues": "Overhand grip, press bar down until elbows fully locked, control eccentric return to chest height."
  },
  {
    "name": "Skull Crushers (EZ-Bar Lying Extension)",
    "category": "Chest & Triceps",
    "default_sets": 3,
    "default_reps": "10-12 reps",
    "cues": "Upper arms angled slightly back toward forehead, lower bar to hairline, extend forearms without elbow flare."
  },
  {
    "name": "Overhead Dumbbell Tricep Extension",
    "category": "Chest & Triceps",
    "default_sets": 3,
    "default_reps": "10-12 reps",
    "cues": "Hold single heavy DB with both hands overhead, lower behind head for deep tricep stretch, extend straight up."
  },
  {
    "name": "Cable Overhead Tricep Extension (Rope)",
    "category": "Chest & Triceps",
    "default_sets": 3,
    "default_reps": "12-15 reps",
    "cues": "Pulley set mid-height, face away, extend rope over head, heavy stretch on triceps long head."
  },
  {
    "name": "Single-Arm Cable Tricep Kickback",
    "category": "Chest & Triceps",
    "default_sets": 3,
    "default_reps": "15 reps",
    "cues": "No attachment, hold rubber ball, elbow high, extend arm completely straight behind torso."
  },
  {
    "name": "Diamond Push-Ups",
    "category": "Chest & Triceps",
    "default_sets": 3,
    "default_reps": "12 reps",
    "cues": "Thumbs and index fingers touching under sternum in diamond shape, elbows track close to body."
  },
  {
    "name": "Floor Press (Barbell / Dumbbell)",
    "category": "Chest & Triceps",
    "default_sets": 3,
    "default_reps": "8-10 reps",
    "cues": "Lie on floor, triceps touch ground lightly without bouncing, eliminates leg drive for pure pressing strength."
  },
  {
    "name": "Incline Dumbbell Fly",
    "category": "Chest & Triceps",
    "default_sets": 3,
    "default_reps": "12 reps",
    "cues": "Slight bend in elbows, open arms wide to shoulder depth, hug a large tree on return."
  },
  {
    "name": "Bench Dips (Bodyweight / Feet Elevated)",
    "category": "Chest & Triceps",
    "default_sets": 3,
    "default_reps": "15 reps",
    "cues": "Hands on bench edge, lower hips straight down to 90° elbow bend, push up through palms."
  },
  {
    "name": "Pull-Up (Overhand Grip)",
    "category": "Back & Biceps",
    "default_sets": 4,
    "default_reps": "6-8 reps",
    "cues": "Hands just outside shoulders, initiate by driving shoulder blades down, pull chest to bar, dead hang."
  },
  {
    "name": "Chin-Up (Underhand Supinated Grip)",
    "category": "Back & Biceps",
    "default_sets": 3,
    "default_reps": "8-10 reps",
    "cues": "Palms facing you, full elbow extension at bottom, pull chin cleared over bar, heavy bicep/lat loading."
  },
  {
    "name": "Neutral Grip Pull-Up",
    "category": "Back & Biceps",
    "default_sets": 3,
    "default_reps": "8-10 reps",
    "cues": "Palms facing each other, shoulder friendly, drive elbows down to ribs, full stretch at bottom."
  },
  {
    "name": "Barbell Pendlay Row",
    "category": "Back & Biceps",
    "default_sets": 4,
    "default_reps": "6-8 reps",
    "cues": "Torso strictly parallel to floor, bar resets on floor each rep, explosive pull to lower sternum."
  },
  {
    "name": "Single-Arm Dumbbell Row",
    "category": "Back & Biceps",
    "default_sets": 3,
    "default_reps": "10-12 reps",
    "cues": "One knee on bench, pull dumbbell to hip pocket leading with elbow, avoid excessive torso twisting."
  },
  {
    "name": "Chest-Supported T-Bar Row",
    "category": "Back & Biceps",
    "default_sets": 3,
    "default_reps": "10-12 reps",
    "cues": "Chest supported on pad eliminates lumbar strain, pull elbows back, squeeze mid-back rhomboids."
  },
  {
    "name": "Lat Pulldown (Wide Grip)",
    "category": "Back & Biceps",
    "default_sets": 4,
    "default_reps": "10-12 reps",
    "cues": "Thighs locked under pads, pull bar to clavicle with slight backward lean, 2s squeeze, slow eccentric."
  },
  {
    "name": "Lat Pulldown (Close-Grip V-Bar)",
    "category": "Back & Biceps",
    "default_sets": 3,
    "default_reps": "10-12 reps",
    "cues": "V-handle attached, pull to upper abdomen, flare elbows out slightly, deep lat stretch at top."
  },
  {
    "name": "Seated Cable Row",
    "category": "Back & Biceps",
    "default_sets": 4,
    "default_reps": "10-12 reps",
    "cues": "Feet braced, upright posture, pull handle to belly button, retract scapulae, avoid rocking momentum."
  },
  {
    "name": "Straight-Arm Lat Pulldown (Cable)",
    "category": "Back & Biceps",
    "default_sets": 3,
    "default_reps": "12-15 reps",
    "cues": "Slight forward hip hinge, elbows soft, sweep bar down to thighs in wide arc, isolate lats."
  },
  {
    "name": "Incline Dumbbell Bicep Curl",
    "category": "Back & Biceps",
    "default_sets": 3,
    "default_reps": "10-12 reps",
    "cues": "Bench at 45-60°, arms hang straight down, curl up while supinating wrists, intense stretch on long head."
  },
  {
    "name": "Barbell Bicep Curl (Standing)",
    "category": "Back & Biceps",
    "default_sets": 3,
    "default_reps": "8-10 reps",
    "cues": "Shoulder-width grip, elbows pinned to sides, curl bar to shoulder height without swinging hips."
  },
  {
    "name": "Dumbbell Hammer Curl",
    "category": "Back & Biceps",
    "default_sets": 3,
    "default_reps": "10-12 reps",
    "cues": "Neutral grip with palms facing each other, curls dumbbell to shoulder, targets brachioradialis/brachialis."
  },
  {
    "name": "EZ-Bar Preacher Curl",
    "category": "Back & Biceps",
    "default_sets": 3,
    "default_reps": "10-12 reps",
    "cues": "Armpits snug on preacher pad, curl EZ-bar up, control descent without hyperextending elbows at bottom."
  },
  {
    "name": "Concentration Curl (Dumbbell)",
    "category": "Back & Biceps",
    "default_sets": 3,
    "default_reps": "12 reps",
    "cues": "Seated, tricep braced against inner thigh, isolate bicep peak contraction with complete control."
  },
  {
    "name": "Bayesian Cable Bicep Curl",
    "category": "Back & Biceps",
    "default_sets": 3,
    "default_reps": "12-15 reps",
    "cues": "Face away from low pulley, arm extended behind torso, curl forward for full lengthened-state resistance."
  },
  {
    "name": "Barbell Shrugs (Traps)",
    "category": "Back & Biceps",
    "default_sets": 4,
    "default_reps": "12-15 reps",
    "cues": "Overhand grip, shrug shoulders straight up toward ears, 2s peak hold, avoid rolling shoulders."
  },
  {
    "name": "Dumbbell Incline Seal Row",
    "category": "Back & Biceps",
    "default_sets": 3,
    "default_reps": "10 reps",
    "cues": "Prone on high flat/incline bench, row dumbbells up until elbows pass torso, pure upper back pulling."
  },
  {
    "name": "Inverted Bodyweight Row (TRX / Smith Bar)",
    "category": "Back & Biceps",
    "default_sets": 3,
    "default_reps": "12 reps",
    "cues": "Hang under bar with straight body, pull chest to bar while keeping glutes squeezed and neck neutral."
  },
  {
    "name": "Spider Curl (Prone Incline)",
    "category": "Back & Biceps",
    "default_sets": 3,
    "default_reps": "12 reps",
    "cues": "Chest on vertical side of preacher bench, arms hang vertical, curl bar upward eliminating shoulder motion."
  },
  {
    "name": "Pallof Press (Anti-Rotation)",
    "category": "Spine & Core",
    "default_sets": 3,
    "default_reps": "10 reps (3s hold)",
    "cues": "Athletic stance, press cable handle straight out from chest, resist rotation, hold 3s with core braced."
  },
  {
    "name": "McGill Curl-Up",
    "category": "Spine & Core",
    "default_sets": 3,
    "default_reps": "10s holds (5-4-3)",
    "cues": "Hands under natural lumbar curve, one knee bent, lift head and shoulders 1 inch as rigid unit, zero neck poke."
  },
  {
    "name": "Bird-Dog with Isometric Hold",
    "category": "Spine & Core",
    "default_sets": 3,
    "default_reps": "8 reps (5s hold)",
    "cues": "Opposite arm and heel reach, level pelvic bowl, clenched fist and flexed foot, zero lumbar sag or twist."
  },
  {
    "name": "Side Plank (Knee / Full Lever)",
    "category": "Spine & Core",
    "default_sets": 3,
    "default_reps": "30-45s hold",
    "cues": "Elbow under shoulder, hips lifted high and forward, straight line from ear to ankle, brace obliques."
  },
  {
    "name": "Dead Bug (Contralateral Reach)",
    "category": "Spine & Core",
    "default_sets": 3,
    "default_reps": "10 reps/side",
    "cues": "Exhale through pursed lips, keep lower back glued to floor, reach opposite arm and heel without arching."
  },
  {
    "name": "Ab Wheel Rollout",
    "category": "Spine & Core",
    "default_sets": 3,
    "default_reps": "8-10 reps",
    "cues": "Kneel on pad, tuck pelvis into posterior tilt, roll wheel out maintaining hollow body, pull back with abs."
  },
  {
    "name": "Hanging Knee / Leg Raise",
    "category": "Spine & Core",
    "default_sets": 3,
    "default_reps": "10-12 reps",
    "cues": "Dead hang from bar, curl pelvis upward as knees/legs raise, avoid swinging momentum, slow lowering."
  },
  {
    "name": "Cable Woodchopper (Diagonal High-to-Low)",
    "category": "Spine & Core",
    "default_sets": 3,
    "default_reps": "10 reps/side",
    "cues": "Pull cable diagonally down across body, pivot back foot, initiate power from hips and obliques."
  },
  {
    "name": "Cable Woodchopper (Diagonal Low-to-High)",
    "category": "Spine & Core",
    "default_sets": 3,
    "default_reps": "10 reps/side",
    "cues": "Pull cable diagonally up and across body, rotate through thoracic spine, control return."
  },
  {
    "name": "Back Hyperextension with Hold",
    "category": "Spine & Core",
    "default_sets": 3,
    "default_reps": "12 reps (3s hold)",
    "cues": "45-degree bench, extend spine to neutral line, hold 3s squeezing multifidus and erector spinae."
  },
  {
    "name": "Farmers Walk (Bilateral Heavy)",
    "category": "Spine & Core",
    "default_sets": 3,
    "default_reps": "30 meters",
    "cues": "Heavy dumbbells or kettlebells at sides, chest proud, short quick strides, absolute torso rigidity."
  },
  {
    "name": "Suitcase Carry (Unilateral Heavy)",
    "category": "Spine & Core",
    "default_sets": 3,
    "default_reps": "25 meters/side",
    "cues": "Hold heavy dumbbell in one hand only, keep shoulders and hips perfectly level, resist lateral tilt."
  },
  {
    "name": "Prone Forearm Plank with Saw",
    "category": "Spine & Core",
    "default_sets": 3,
    "default_reps": "45s hold",
    "cues": "Forearms grounded, shift body forward and back on toes, maintain active hollow-body position."
  },
  {
    "name": "RKC Plank (Maximum Tension)",
    "category": "Spine & Core",
    "default_sets": 3,
    "default_reps": "15s maximum effort",
    "cues": "Pull elbows toward toes, squeeze fists, glutes, and quads at 100% intensity for 15 seconds."
  },
  {
    "name": "Hollow Body Hold",
    "category": "Spine & Core",
    "default_sets": 3,
    "default_reps": "30s hold",
    "cues": "Lower back pressed into ground, arms overhead, legs 6 inches off floor, hold tight banana shape."
  },
  {
    "name": "Stir-the-Pot (Swiss Ball Plank)",
    "category": "Spine & Core",
    "default_sets": 3,
    "default_reps": "10 circles each way",
    "cues": "Forearms on exercise ball in plank, make small circles with elbows while keeping pelvis rock steady."
  },
  {
    "name": "Reverse Hyperextension (Machine / Bench)",
    "category": "Spine & Core",
    "default_sets": 3,
    "default_reps": "12-15 reps",
    "cues": "Torso on pad, lift legs behind body using glutes and erectors, decompresses lumbar spine."
  },
  {
    "name": "Copenhagen Plank with Hip Dip",
    "category": "Spine & Core",
    "default_sets": 3,
    "default_reps": "8 reps/side",
    "cues": "Side plank with top foot on bench, lower hip toward floor and lift back up, dynamic adductor core."
  },
  {
    "name": "Russian Twist (Medicine Ball)",
    "category": "Spine & Core",
    "default_sets": 3,
    "default_reps": "20 twists total",
    "cues": "Seated V-sit with heels elevated, rotate torso side to side touching ball to floor, brace abs."
  },
  {
    "name": "Prone Cobra (Thoracic Extension)",
    "category": "Spine & Core",
    "default_sets": 3,
    "default_reps": "10 reps (5s hold)",
    "cues": "Prone on floor, rotate thumbs out, lift chest and arms while keeping chin tucked, activate lower traps."
  },
  {
    "name": "Cat-Camel Spinal Flossing",
    "category": "Spine & Core",
    "default_sets": 2,
    "default_reps": "10 cycles",
    "cues": "Quadruped, oscillate smoothly between flexion and extension with rhythmic breathing, low-load flossing."
  },
  {
    "name": "Spanish Squat",
    "category": "Knee & Quad",
    "default_sets": 4,
    "default_reps": "45s hold",
    "cues": "Band behind knees anchored to rig, vertical shins, sit back to 70-90° knee angle, load quads isometrically."
  },
  {
    "name": "Wall Sit (Bilateral / Single-Leg)",
    "category": "Knee & Quad",
    "default_sets": 4,
    "default_reps": "30-45s hold",
    "cues": "Thighs parallel to floor, back flat against wall, progress from bilateral to single-leg for high tendon loading."
  },
  {
    "name": "Leg Extension (Isometric & Full ROM)",
    "category": "Knee & Quad",
    "default_sets": 3,
    "default_reps": "12-15 reps (or 30s hold)",
    "cues": "Perform 30s isometric hold at 60° flexion, followed by full ROM controlled concentric and 3s eccentric."
  },
  {
    "name": "Reverse Sissy Squat",
    "category": "Knee & Quad",
    "default_sets": 3,
    "default_reps": "10-12 reps",
    "cues": "Kneeling on pad, hips locked in full extension, lean back maintaining rigid knee-to-shoulder line, quad eccentric burn."
  },
  {
    "name": "Poliquin Step",
    "category": "Knee & Quad",
    "default_sets": 3,
    "default_reps": "12-15 reps",
    "cues": "Elevated heel on 30° slant block, forward knee translation over toes, light contralateral heel touch, no push-off."
  },
  {
    "name": "Terminal Knee Extension (TKE) with band",
    "category": "Knee & Quad",
    "default_sets": 3,
    "default_reps": "15-20 reps",
    "cues": "Heavy resistance band looped behind popliteal crease, contract VMO and lock knee straight against tension, 2s peak squeeze."
  },
  {
    "name": "Step-Ups (Dumbbell / Box)",
    "category": "Knee & Quad",
    "default_sets": 3,
    "default_reps": "10-12 reps",
    "cues": "Lead foot fully planted on box, drive straight up through mid-foot, eliminate trailing leg bounce, control descent."
  },
  {
    "name": "Pendulum Squat (Machine)",
    "category": "Knee & Quad",
    "default_sets": 3,
    "default_reps": "8-10 reps",
    "cues": "Arcing knee path provides continuous tension on rectus femoris and VMO; smooth eccentric, pause at deep knee flexion."
  },
  {
    "name": "Belt Squat (Rig / Machine)",
    "category": "Knee & Quad",
    "default_sets": 4,
    "default_reps": "10-12 reps",
    "cues": "Hip-loaded belt eliminates spinal compression, allowing high-volume quad hypertrophy with neutral lumbar posture."
  },
  {
    "name": "Backward Sled Drag",
    "category": "Knee & Quad",
    "default_sets": 4,
    "default_reps": "40 meters",
    "cues": "Toe-to-heel strike walking backward against sled resistance, continuous concentric quadriceps loading, patellar tendon therapeutic."
  },
  {
    "name": "Zercher Squat (Barbell)",
    "category": "Knee & Quad",
    "default_sets": 3,
    "default_reps": "6-8 reps",
    "cues": "Barbell cradled in elbow crooks, fists to chin, vertical torso, deep hip flexion with tremendous anterior core and quad activation."
  },
  {
    "name": "Safety Squat Bar (SSB) Squat",
    "category": "Knee & Quad",
    "default_sets": 4,
    "default_reps": "6-8 reps",
    "cues": "Cambered bar shifts center of gravity forward, forcing thoracic extension and high quad recruitment without shoulder strain."
  },
  {
    "name": "Landmine Hack Squat",
    "category": "Knee & Quad",
    "default_sets": 3,
    "default_reps": "10-12 reps",
    "cues": "Lean back against landmine sleeve on shoulders, feet forward, descend deep with knees translating over toes safely."
  },
  {
    "name": "Romanian Deadlift (Barbell & Dumbbell)",
    "category": "Hamstring & Posterior Chain",
    "default_sets": 4,
    "default_reps": "8-10 reps",
    "cues": "Soft knees, hinge back through hips, bar stays glued to shins, feel intense hamstring stretch at mid-shin, neutral cervical spine."
  },
  {
    "name": "Single-Leg RDL (Dumbbell / Kettlebell)",
    "category": "Hamstring & Posterior Chain",
    "default_sets": 3,
    "default_reps": "8-10 reps",
    "cues": "Stand on one leg, hinge at hip while kicking rear leg straight back, hips remain level with floor, feel glute/hamstring tension."
  },
  {
    "name": "Slider Leg Curls (Bilateral & Single-Leg)",
    "category": "Hamstring & Posterior Chain",
    "default_sets": 3,
    "default_reps": "10-12 reps",
    "cues": "Heels on furniture sliders, bridge hips up into extension, curl heels to glutes while keeping hips elevated throughout."
  },
  {
    "name": "45° Hyperextension (Hamstring & Glute Focus)",
    "category": "Hamstring & Posterior Chain",
    "default_sets": 3,
    "default_reps": "12-15 reps",
    "cues": "Pad just below anterior superior iliac spine, slight thoracic rounding, hinge from hips and contract hamstrings to horizontal."
  },
  {
    "name": "Good Mornings (Barbell & Band)",
    "category": "Hamstring & Posterior Chain",
    "default_sets": 3,
    "default_reps": "10-12 reps",
    "cues": "Bar across upper traps, soft knees, push pelvis backward until torso reaches near 45-60°, explode forward squeezing glutes."
  },
  {
    "name": "Deficit Conventional Deadlift",
    "category": "Hamstring & Posterior Chain",
    "default_sets": 3,
    "default_reps": "5-6 reps",
    "cues": "Standing on 1-2 inch plate, increased range of motion demands greater off-the-floor hamstring and quad recruitment."
  },
  {
    "name": "Snatch-Grip Deadlift",
    "category": "Hamstring & Posterior Chain",
    "default_sets": 3,
    "default_reps": "6-8 reps",
    "cues": "Wide snatch grip forces lower hip starting position and extensive upper back and posterior chain tension."
  },
  {
    "name": "Single-Leg 45° Hyperextension",
    "category": "Hamstring & Posterior Chain",
    "default_sets": 3,
    "default_reps": "10-12 reps",
    "cues": "One foot locked in pad, isolate unilateral hamstring and gluteus maximus, control the 3s eccentric descent."
  },
  {
    "name": "B-Stance Romanian Deadlift",
    "category": "Hamstring & Posterior Chain",
    "default_sets": 3,
    "default_reps": "10 reps",
    "cues": "Lead foot carries 85% of weight, rear toe acts as kickstand kickback, pure unilateral hamstring hinge without balance limitation."
  },
  {
    "name": "Banded Good Morning",
    "category": "Hamstring & Posterior Chain",
    "default_sets": 3,
    "default_reps": "15-20 reps",
    "cues": "Heavy resistance band under feet and around neck, smooth rhythmic hinging against accommodating resistance, low spinal load."
  },
  {
    "name": "Jefferson Curl (Spinal Segmental Loading)",
    "category": "Hamstring & Posterior Chain",
    "default_sets": 3,
    "default_reps": "8 slow reps",
    "cues": "Standing on box, tuck chin, articulate spine down vertebra by vertebra into full flexion, pause at bottom, roll up with glutes."
  },
  {
    "name": "Single-Leg Hip Thrust",
    "category": "Glute & Hip",
    "default_sets": 3,
    "default_reps": "10-12 reps",
    "cues": "Elevate non-working knee toward chest, drive working heel through floor to full hip lockout without lumbar hyperextension."
  },
  {
    "name": "Cable Hip Abduction",
    "category": "Glute & Hip",
    "default_sets": 3,
    "default_reps": "12-15 reps",
    "cues": "Ankle cuff attached to low pulley, stand tall, abduct leg out to 30-40° leading slightly with heel to target gluteus medius."
  },
  {
    "name": "Cable Kickback (Glute Isolation)",
    "category": "Glute & Hip",
    "default_sets": 3,
    "default_reps": "12-15 reps",
    "cues": "Slight torso forward pitch, kick working heel back and up on a 45° diagonal angle, pause 2s at peak glute contraction."
  },
  {
    "name": "Side-Lying Clamshell with Mini-Band",
    "category": "Glute & Hip",
    "default_sets": 3,
    "default_reps": "15-20 reps",
    "cues": "Hips and knees at 45-60°, feet glued together, rotate top knee upward without letting pelvis roll backward, engage deep rotators."
  },
  {
    "name": "Banded Lateral Walk (Monster Walk)",
    "category": "Glute & Hip",
    "default_sets": 3,
    "default_reps": "15 steps each way",
    "cues": "Mini-band around forefeet or ankles, maintain quarter squat, step wide keeping toes pointed forward, continuous abduction tension."
  },
  {
    "name": "Copenhagen Adductor Plank (Short & Long Lever)",
    "category": "Glute & Hip",
    "default_sets": 3,
    "default_reps": "20-30s hold",
    "cues": "Top leg on bench (knee for short lever, ankle for long lever), lift lower body into side plank, adductor eccentric and isometric capacity."
  },
  {
    "name": "Adductor Machine (Seated)",
    "category": "Glute & Hip",
    "default_sets": 3,
    "default_reps": "12-15 reps",
    "cues": "Sit tall against backrest, squeeze knee pads smoothly together to touch, pause 2s, control opening against weight stack."
  },
  {
    "name": "Seated Hip Abductor Machine",
    "category": "Glute & Hip",
    "default_sets": 3,
    "default_reps": "15-20 reps",
    "cues": "Lean slightly forward from hips to bias superior gluteus medius/minimus fibers, drive pads outward, slow 3s eccentric return."
  },
  {
    "name": "FAI Hip Mobilization with Band",
    "category": "Glute & Hip",
    "default_sets": 3,
    "default_reps": "60s hold",
    "cues": "Heavy band anchored low pulling lateral-posterior at hip joint crease, quadruped rocking or half-kneeling to clear anterior impingement."
  },
  {
    "name": "Hip 90/90 Internal & External Rotation PAILs/RAILs",
    "category": "Glute & Hip",
    "default_sets": 3,
    "default_reps": "2 mins mobility",
    "cues": "Both legs at 90° angles on floor, isometric push into floor for 10s followed by active pull into deeper end-range rotation."
  },
  {
    "name": "B-Stance Hip Thrust (Dumbbell / Barbell)",
    "category": "Glute & Hip",
    "default_sets": 3,
    "default_reps": "10-12 reps",
    "cues": "Primary working leg grounded, secondary foot shifted forward on heel for light stabilization, max glute output."
  },
  {
    "name": "Side Plank with Hip Abduction",
    "category": "Glute & Hip",
    "default_sets": 3,
    "default_reps": "10 reps / 20s hold",
    "cues": "Side plank from elbow and bottom knee or foot; lift top leg into 30° abduction without rotating pelvis, intense lateral stability."
  },
  {
    "name": "Standing Barbell Calf Raise",
    "category": "Foot, Ankle & Calf",
    "default_sets": 4,
    "default_reps": "10-12 reps",
    "cues": "Balls of feet on block, full deep stretch at bottom for 2s, explode onto big toe ball, 2s peak contraction at top."
  },
  {
    "name": "Seated Soleus Calf Raise",
    "category": "Foot, Ankle & Calf",
    "default_sets": 4,
    "default_reps": "12-15 reps",
    "cues": "Knees bent 90° isolates soleus from gastrocnemius, full controlled stretch under load, 3s eccentric cadence."
  },
  {
    "name": "Single-Leg Eccentric Heel Drop (Alfredson Protocol)",
    "category": "Foot, Ankle & Calf",
    "default_sets": 3,
    "default_reps": "15 reps",
    "cues": "Rise up on both feet, remove unaffected foot, lower working heel over edge of step on 3-4s slow eccentric, straight & bent knee."
  },
  {
    "name": "Tibialis Anterior Raise (Weighted / Band)",
    "category": "Foot, Ankle & Calf",
    "default_sets": 3,
    "default_reps": "15-20 reps",
    "cues": "Heels resting on 4-inch elevated block or back against wall, dorsiflex ankles pulling toes toward shins, pause 2s at top."
  },
  {
    "name": "Ankle Inversion / Eversion with Band",
    "category": "Foot, Ankle & Calf",
    "default_sets": 3,
    "default_reps": "15 reps each",
    "cues": "Resistance band looped around forefoot, isolate subtalar joint movement without tibial internal/external rotation compensation."
  },
  {
    "name": "Short Foot Exercise / Intrinsic Foot Doming",
    "category": "Foot, Ankle & Calf",
    "default_sets": 3,
    "default_reps": "10 x 5s hold",
    "cues": "Ground big toe ball, little toe ball, and heel; draw metatarsal heads toward heel to elevate medial longitudinal arch without curling toes."
  },
  {
    "name": "Single-Leg Balance on Airex Pad",
    "category": "Foot, Ankle & Calf",
    "default_sets": 3,
    "default_reps": "30-45s hold",
    "cues": "Barefoot on compliant foam surface, slight knee flexion, level hips, maintain gaze fixed on non-moving target, reactive ankle stability."
  },
  {
    "name": "Deficit Standing Calf Raise (Full ROM)",
    "category": "Foot, Ankle & Calf",
    "default_sets": 3,
    "default_reps": "12 reps",
    "cues": "Maximum achievable dorsiflexion stretch on ledge, 3s pause at bottom, full triple-extension at ankle peak."
  },
  {
    "name": "Single-Leg Soleus Wall Sit (Isometric)",
    "category": "Foot, Ankle & Calf",
    "default_sets": 3,
    "default_reps": "30s hold",
    "cues": "Knee at 90° against wall, lift working heel into 3-inch plantarflexion and hold steady against bodyweight."
  },
  {
    "name": "Ankle Dorsiflexion Band Distraction Mobilization",
    "category": "Foot, Ankle & Calf",
    "default_sets": 3,
    "default_reps": "15 dynamic lunges",
    "cues": "Heavy band positioned below malleoli over anterior talus pulling posteriorly while lunging knee over toes to resolve anterior impingement."
  },
  {
    "name": "Great Toe Extension & Flexion Isolation",
    "category": "Foot, Ankle & Calf",
    "default_sets": 3,
    "default_reps": "15 reps",
    "cues": "Plant 4 lesser toes firmly on ground while elevating hallux independently; then reverse planting hallux and elevating 4 lesser toes."
  },
  {
    "name": "Barbell Overhead Press (Strict OHP)",
    "category": "Shoulder & Scapula",
    "default_sets": 4,
    "default_reps": "6-8 reps",
    "cues": "Full-body tension, glutes and abs locked, bar clears chin, press overhead into active scapular upward rotation and shrug."
  },
  {
    "name": "Cable Lateral Raise (Behind the Back)",
    "category": "Shoulder & Scapula",
    "default_sets": 3,
    "default_reps": "12-15 reps",
    "cues": "Cable set to wrist height behind back, continuous abduction tension from zero to 90 degrees, isolates lateral deltoid."
  },
  {
    "name": "Face Pulls with External Rotation",
    "category": "Shoulder & Scapula",
    "default_sets": 4,
    "default_reps": "15 reps",
    "cues": "Pull rope attachment toward forehead, rotate hands back into high-five position, hold 2s peak contraction of lower traps and infraspinatus."
  },
  {
    "name": "Y-TW Raises (Prone / Incline)",
    "category": "Shoulder & Scapula",
    "default_sets": 3,
    "default_reps": "8 reps each letter",
    "cues": "Perform consecutive Y raises (lower traps), T raises (middle traps), and W retractions with external rotation for comprehensive scapular strength."
  },
  {
    "name": "Push-Up to Plus (Serratus Activation)",
    "category": "Shoulder & Scapula",
    "default_sets": 3,
    "default_reps": "12-15 reps",
    "cues": "Perform standard push-up, at the top aggressively push the floor away to spread shoulder blades apart into maximal protraction."
  },
  {
    "name": "Shoulder Horn Rotation (Cuff Strength)",
    "category": "Shoulder & Scapula",
    "default_sets": 3,
    "default_reps": "12-15 reps",
    "cues": "Elbows supported at 90° abduction, rotate dumbbells upward to vertical, slow 3s eccentric return, pure infraspinatus/teres minor loading."
  },
  {
    "name": "Bradford Press (Front-to-Back Overhead)",
    "category": "Shoulder & Scapula",
    "default_sets": 3,
    "default_reps": "10 reps",
    "cues": "Barbell presses just high enough to clear crown, transfers from clavicle to behind neck under continuous deltoid tension."
  },
  {
    "name": "Barbell Flat Bench Press",
    "category": "Chest & Triceps",
    "default_sets": 4,
    "default_reps": "6-8 reps",
    "cues": "Shoulder blades retracted and depressed into bench, arch maintained, touch lower sternum with tuck, drive through heels."
  },
  {
    "name": "Flat Dumbbell Press",
    "category": "Chest & Triceps",
    "default_sets": 3,
    "default_reps": "10-12 reps",
    "cues": "Deep chest stretch at bottom of rep, press up in a slight inward converging arc without clanking dumbbells at the top."
  },
  {
    "name": "Weighted Dips (Parallel Bars)",
    "category": "Chest & Triceps",
    "default_sets": 3,
    "default_reps": "6-8 reps",
    "cues": "Forward torso pitch to target sternal pec fibers, lower until shoulders are below elbows, press out cleanly without shrugging."
  },
  {
    "name": "Machine Chest Fly (Pec Deck)",
    "category": "Chest & Triceps",
    "default_sets": 3,
    "default_reps": "12-15 reps",
    "cues": "Chest tall, slight elbow bend maintained, bring pads together for 2s peak contraction, deep controlled stretch."
  },
  {
    "name": "Cable Crossover (High-to-Low)",
    "category": "Chest & Triceps",
    "default_sets": 3,
    "default_reps": "12-15 reps",
    "cues": "Cables set at top pulley, step forward into staggered stance, pull downward and inward crossing hands at hip level, squeeze lower pec."
  },
  {
    "name": "Deficit Push-Ups (Hand on Plates / Blocks)",
    "category": "Chest & Triceps",
    "default_sets": 3,
    "default_reps": "12-15 reps",
    "cues": "Hands elevated on 3-4 inch blocks, descend chest past hand level for maximal pectoralis fiber stretch, press out strong."
  },
  {
    "name": "Incline Barbell Bench Press",
    "category": "Chest & Triceps",
    "default_sets": 4,
    "default_reps": "8-10 reps",
    "cues": "Bench angled 30-45°, lower bar to upper clavicular notch, drive elbows under bar, press in straight vertical path."
  },
  {
    "name": "Neutral Grip Weighted Pull-Up",
    "category": "Back & Biceps",
    "default_sets": 4,
    "default_reps": "5-8 reps",
    "cues": "Parallel handles shoulder-width, full dead hang at bottom, drive elbows down to ribs, chest to bar, controlled eccentric."
  },
  {
    "name": "Overhand Lat Pulldown",
    "category": "Back & Biceps",
    "default_sets": 4,
    "default_reps": "8-10 reps",
    "cues": "Grip slightly wider than shoulders, lean back 10-15°, pull bar to clavicle driving elbows downward into back pockets, control return."
  },
  {
    "name": "Pendlay Row (Dead Stop Barbell)",
    "category": "Back & Biceps",
    "default_sets": 4,
    "default_reps": "6-8 reps",
    "cues": "Torso strictly horizontal to floor, bar rests on floor between each rep, explosive row to sternum without hip bobbing."
  },
  {
    "name": "Incline Dumbbell Row (Prone Chest Supported)",
    "category": "Back & Biceps",
    "default_sets": 3,
    "default_reps": "10-12 reps",
    "cues": "Prone on 45° incline bench, row dumbbells with elbows flared at 45° to maximize rhomboids, mid-traps, and rear deltoid recruitment."
  },
  {
    "name": "Cable Seated Cable Row (Close Grip)",
    "category": "Back & Biceps",
    "default_sets": 3,
    "default_reps": "10-12 reps",
    "cues": "V-bar handle, chest upright, full arm extension with slight scapular protraction, pull to navel with full scapular retraction."
  },
  {
    "name": "Face Pull (High Cable Pulley)",
    "category": "Back & Biceps",
    "default_sets": 4,
    "default_reps": "15 reps",
    "cues": "Cable set to eye level, pull thumbs back toward ears with high elbows, contract upper back, posture corrective."
  },
  {
    "name": "Meadows Row (Single-Arm Landmine)",
    "category": "Back & Biceps",
    "default_sets": 3,
    "default_reps": "10-12 reps",
    "cues": "Standing perpendicular to landmine sleeve, overhand grip on collar, row elbow flared out to target lower and upper lat shelf."
  },
  {
    "name": "Seal Row (Prone Bench Dumbbell Row)",
    "category": "Back & Biceps",
    "default_sets": 4,
    "default_reps": "8-10 reps",
    "cues": "Lying completely flat face down on elevated bench, zero momentum, pull dumbbells until weights touch bench underside, full upper back retraction."
  },
  {
    "name": "Kroc Row (High-Rep Heavy Dumbbell)",
    "category": "Back & Biceps",
    "default_sets": 2,
    "default_reps": "20-25 reps",
    "cues": "Heavy dumbbell unilateral row with slight natural body English; builds savage grip, lat thickness, and rhomboid endurance."
  },
  {
    "name": "Skull Crushers (EZ-Bar / DB Lying Extension)",
    "category": "Chest & Triceps",
    "default_sets": 3,
    "default_reps": "10-12 reps",
    "cues": "Lying on flat bench, arms tilted slightly back from vertical (75°), lower bar to forehead/crown, extend forearms without elbow flare."
  },
  {
    "name": "Tricep Rope Pushdowns",
    "category": "Chest & Triceps",
    "default_sets": 3,
    "default_reps": "12-15 reps",
    "cues": "Elbows pinned to sides, push rope down and spread hands apart aggressively at the bottom for maximal lateral head triceps squeeze."
  },
  {
    "name": "Overhead Cable Tricep Extension",
    "category": "Chest & Triceps",
    "default_sets": 3,
    "default_reps": "12-15 reps",
    "cues": "High or low pulley facing away, extend elbows fully overhead, targets the long head of the triceps in its stretched position."
  },
  {
    "name": "Incline Dumbbell Curl (Long Head Stretch)",
    "category": "Back & Biceps",
    "default_sets": 3,
    "default_reps": "10-12 reps",
    "cues": "Bench set to 45-60°, arms hang fully behind torso, curl upward with full supination, deep stretch on biceps long head at bottom."
  },
  {
    "name": "Barbell Bicep Curl (Standing Strict)",
    "category": "Back & Biceps",
    "default_sets": 3,
    "default_reps": "8-10 reps",
    "cues": "Shoulder-width underhand grip, elbows pinned to flanks, curl bar in smooth arc without swinging torso, 3s lowering."
  },
  {
    "name": "Hammer Curl (Dumbbell / Cable Rope)",
    "category": "Back & Biceps",
    "default_sets": 3,
    "default_reps": "10-12 reps",
    "cues": "Neutral grip (palms facing each other), curl upward targeting the brachialis and brachioradialis for forearm and arm thickness."
  },
  {
    "name": "Reverse EZ-Bar Curl",
    "category": "Back & Biceps",
    "default_sets": 3,
    "default_reps": "12-15 reps",
    "cues": "Overhand pronated grip on cambered EZ-bar, curls emphasize brachioradialis and wrist extensors, beneficial for tennis elbow rehab."
  },
  {
    "name": "Preacher Curl (EZ-Bar / Machine)",
    "category": "Back & Biceps",
    "default_sets": 3,
    "default_reps": "10-12 reps",
    "cues": "Triceps flat against preacher pad, full elbow extension without hyperextending, curl upward to eliminate any shoulder involvement."
  },
  {
    "name": "JM Press (Smith Machine / Barbell)",
    "category": "Chest & Triceps",
    "default_sets": 3,
    "default_reps": "8-10 reps",
    "cues": "Hybrid between close-grip bench and skull crusher; lower bar toward throat/upper chest, elbows forward, press with triceps."
  },
  {
    "name": "Zottman Curl (Supinated Up / Pronated Down)",
    "category": "Back & Biceps",
    "default_sets": 3,
    "default_reps": "10 reps",
    "cues": "Curl dumbbells upward with supinated palms, rotate 180° at top to overhand grip, and lower slowly on 3s eccentric."
  },
  {
    "name": "McGill Bird-Dog",
    "category": "Spine & Core",
    "default_sets": 3,
    "default_reps": "6 reps x 8s hold",
    "cues": "Quadruped position, kick opposite arm and leg out horizontally without lumbar extension or pelvic rotation, clench fists and glutes."
  },
  {
    "name": "McGill Side Plank",
    "category": "Spine & Core",
    "default_sets": 3,
    "default_reps": "4 x 10s hold",
    "cues": "Forearm on floor, top foot in front of bottom foot, bridge hips up and forward, neutral spine, targets quadratus lumborum endurance."
  },
  {
    "name": "Pallof Press (Static & Dynamic)",
    "category": "Spine & Core",
    "default_sets": 3,
    "default_reps": "10 reps (or 30s hold)",
    "cues": "Athletic stance perpendicular to cable stack, press handle straight out from chest, resist rotational torque, lock ribcage to pelvis."
  },
  {
    "name": "Ab Wheel Rollout (from Knees / Feet)",
    "category": "Spine & Core",
    "default_sets": 3,
    "default_reps": "8-10 reps",
    "cues": "Posterior pelvic tilt, roll wheel forward maintaining rigid neutral/slightly rounded spine, pull back through lats and rectus abdominis."
  },
  {
    "name": "Deadbug (Contralateral Reach)",
    "category": "Spine & Core",
    "default_sets": 3,
    "default_reps": "12 alternating reps",
    "cues": "Supine, press lumbar spine flat into floor, lower opposite arm and leg toward floor while maintaining total abdominal bracing."
  },
  {
    "name": "Farmer's Carry (Heavy Bilateral)",
    "category": "Spine & Core",
    "default_sets": 4,
    "default_reps": "30-40 meters",
    "cues": "Heavy dumbbells or trap bar, stand tall, pack shoulders, walk with smooth short controlled strides, crushing grip and core stability."
  },
  {
    "name": "Suitcase Carry (Heavy Unilateral)",
    "category": "Spine & Core",
    "default_sets": 3,
    "default_reps": "30 meters per side",
    "cues": "Heavy weight in one hand only, maintain strictly vertical posture without side leaning, intense quadratus lumborum and oblique demand."
  },
  {
    "name": "Copenhagen Plank (Adductor & Core)",
    "category": "Spine & Core",
    "default_sets": 3,
    "default_reps": "20-30s hold",
    "cues": "Side plank position with top foot on bench, lower foot suspended beneath, high demand on adductors and lateral core chain."
  },
  {
    "name": "Stir-the-Pot (Swiss Ball Forearm Plank)",
    "category": "Spine & Core",
    "default_sets": 3,
    "default_reps": "8 circles each direction",
    "cues": "Forearms on Swiss ball in plank, rotate forearms in small controlled circles while keeping hips and lumbar spine rock solid."
  },
  {
    "name": "RKC Plank (Max Tension Isometric)",
    "category": "Spine & Core",
    "default_sets": 3,
    "default_reps": "3 x 15s max effort",
    "cues": "Forearm plank, actively pull elbows toward toes and toes toward elbows, squeeze glutes, quads, and fists at 100% maximal tension."
  },
  {
    "name": "Half-Kneeling Cable Woodchopper (Diagonal Chop)",
    "category": "Spine & Core",
    "default_sets": 3,
    "default_reps": "10-12 reps",
    "cues": "Cable high to low, chop diagonally across torso without letting hips rotate; eccentric anti-rotation control."
  },
  {
    "name": "Half-Kneeling Cable Lift (Diagonal Lift)",
    "category": "Spine & Core",
    "default_sets": 3,
    "default_reps": "10-12 reps",
    "cues": "Cable low to high, lift handle diagonally upward across chest to overhead, brace core against rotational extension."
  },
  {
    "name": "Low Bar Back Squat (Powerlifting)",
    "category": "Powerlifting & SBD",
    "default_sets": 4,
    "default_reps": "5-6 reps",
    "cues": "Bar rests on posterior deltoids, hip hinge initiates descent, knees track over midfoot, maintain tight upper back and upright torso angle."
  },
  {
    "name": "High Bar Olympic Back Squat",
    "category": "Powerlifting & SBD",
    "default_sets": 4,
    "default_reps": "6-8 reps",
    "cues": "Bar sits high on upper trapezius, vertical spine descent, deep hip and knee flexion with forward knee travel over toes."
  },
  {
    "name": "Safety Squat Bar (SSB) Squat",
    "category": "Powerlifting & SBD",
    "default_sets": 4,
    "default_reps": "6-8 reps",
    "cues": "Hold handles lightly, fight the camber pulling you forward, engage upper back and core, vertical torso descent."
  },
  {
    "name": "Pin Squat (Bottom-Up Concentric)",
    "category": "Powerlifting & SBD",
    "default_sets": 4,
    "default_reps": "3-5 reps",
    "cues": "Descend to safety pins set just above parallel, dead stop for 1 second without releasing core tightness, explode upward."
  },
  {
    "name": "Box Squat (Static-Overcoming)",
    "category": "Powerlifting & SBD",
    "default_sets": 4,
    "default_reps": "5 reps",
    "cues": "Hinge back to sit on box, break hip-knee momentum while maintaining core brace, drive through mid-foot to stand."
  },
  {
    "name": "2-Second Paused Squat",
    "category": "Powerlifting & SBD",
    "default_sets": 4,
    "default_reps": "4-6 reps",
    "cues": "Full depth at parallel, hold motionless in the hole for 2 full seconds without bouncing, drive up with max velocity."
  },
  {
    "name": "Tempo Squat (3-1-0 Concentric Drive)",
    "category": "Powerlifting & SBD",
    "default_sets": 3,
    "default_reps": "6 reps",
    "cues": "3 seconds eccentric descent, 1 second pause at parallel, explode upward with zero deceleration at top."
  },
  {
    "name": "Tempo Squat (4-2-0 Hypertrophy & Control)",
    "category": "Powerlifting & SBD",
    "default_sets": 3,
    "default_reps": "5 reps",
    "cues": "4 full seconds lowering, 2 full seconds pause at parallel, powerful drive without hip shift or torso drift."
  },
  {
    "name": "Spanish Squat (Heavy Band Isometric)",
    "category": "Powerlifting & SBD",
    "default_sets": 4,
    "default_reps": "45s hold",
    "cues": "Heavy looped band behind knee joint line, vertical shins, sit back to 70-90° knee angle, drive quads into band resistance."
  },
  {
    "name": "Front Squat (Clean Grip / Cross-Arm)",
    "category": "Powerlifting & SBD",
    "default_sets": 4,
    "default_reps": "6-8 reps",
    "cues": "Elbows high and parallel to floor, upright spine, push knees wide and drive out of the hole maintaining high chest."
  },
  {
    "name": "Goblet Squat with Kettlebell / Dumbbell",
    "category": "Powerlifting & SBD",
    "default_sets": 3,
    "default_reps": "10-12 reps",
    "cues": "Hold weight tight at sternum, drop hips between heels, elbows tap medial knees, maintain neutral spine."
  },
  {
    "name": "Bulgarian Split Squat (Loaded DB)",
    "category": "Powerlifting & SBD",
    "default_sets": 3,
    "default_reps": "8-10 reps",
    "cues": "Rear foot laces on flat bench, front knee tracks 2nd toe, drop rear knee straight down, slight forward torso incline."
  },
  {
    "name": "Belt Squat (Spine Sparing)",
    "category": "Powerlifting & SBD",
    "default_sets": 4,
    "default_reps": "10-12 reps",
    "cues": "Load suspended through pelvis eliminating spinal axial loading, push knees forward and wide, full quadriceps focus."
  },
  {
    "name": "Competition Grip Flat Bench Press",
    "category": "Powerlifting & SBD",
    "default_sets": 4,
    "default_reps": "5 reps",
    "cues": "Scapulae retracted and depressed, arch within legal parameters, lower to sternum, 1s pause, press back over shoulders."
  },
  {
    "name": "Close Grip Bench Press (Triceps & Lockout)",
    "category": "Powerlifting & SBD",
    "default_sets": 3,
    "default_reps": "8-10 reps",
    "cues": "Hands shoulder-width apart, elbows tucked at 30-45°, touch lower chest, drive to full lockout."
  },
  {
    "name": "Spoto Press (1-Inch Off Chest Pause)",
    "category": "Powerlifting & SBD",
    "default_sets": 4,
    "default_reps": "5-6 reps",
    "cues": "Lower bar to hover exactly 1 inch above sternum, pause for 2 seconds under maximal muscular tension, press without touching chest."
  },
  {
    "name": "2-Board / 3-Board Bench Press",
    "category": "Powerlifting & SBD",
    "default_sets": 4,
    "default_reps": "4-6 reps",
    "cues": "Overload triceps and lockout strength, touch boards smoothly with soft rebound, explode to locked elbows."
  },
  {
    "name": "Pin Press (Chest Level Bench)",
    "category": "Powerlifting & SBD",
    "default_sets": 4,
    "default_reps": "4-5 reps",
    "cues": "Bar rests on safety pins just touching chest, press concentrically from dead stop without pre-stretch tension."
  },
  {
    "name": "Pin Press (Mid-Range Lockout)",
    "category": "Powerlifting & SBD",
    "default_sets": 4,
    "default_reps": "4-6 reps",
    "cues": "Pins set at 90° elbow flexion sticking point, drive bar from complete rest to full lockout."
  },
  {
    "name": "Larsen Press (Feet-Up Bench Press)",
    "category": "Powerlifting & SBD",
    "default_sets": 3,
    "default_reps": "8-10 reps",
    "cues": "Legs extended straight off end of bench with zero leg drive, brace core tight, controlled bar path to chest."
  },
  {
    "name": "Incline Barbell Bench Press (30-Degree)",
    "category": "Powerlifting & SBD",
    "default_sets": 3,
    "default_reps": "8-10 reps",
    "cues": "Set incline to 30°, lower bar to clavicular head of pectoralis major, elbows 45° to torso, smooth lockout."
  },
  {
    "name": "Floor Press with Dumbbells",
    "category": "Powerlifting & SBD",
    "default_sets": 3,
    "default_reps": "10-12 reps",
    "cues": "Lie on floor with knees bent, lower dumbbells until triceps rest gently on floor, pause 1s, press to top."
  },
  {
    "name": "Floor Press with Barbell",
    "category": "Powerlifting & SBD",
    "default_sets": 4,
    "default_reps": "6-8 reps",
    "cues": "Eliminates shoulder hyperextension, triceps tap floor softly, drive upward to full elbow extension."
  },
  {
    "name": "3-Second Paused Bench Press",
    "category": "Powerlifting & SBD",
    "default_sets": 4,
    "default_reps": "4-5 reps",
    "cues": "Lower bar to chest, maintain full leg drive and lat tightness motionless for 3 seconds, explosive press."
  },
  {
    "name": "Deficit Push-Ups on Blocks / Parallettes",
    "category": "Powerlifting & SBD",
    "default_sets": 3,
    "default_reps": "12-15 reps",
    "cues": "Hands elevated on blocks, lower chest below hand level for deep pectoral stretch, protract scapulae at top."
  },
  {
    "name": "Band-Resisted Push-Ups",
    "category": "Powerlifting & SBD",
    "default_sets": 3,
    "default_reps": "10-12 reps",
    "cues": "Resistance band looped across upper back and held in palms, accelerate into lockout against increasing band tension."
  },
  {
    "name": "Conventional Deadlift (Barbell)",
    "category": "Powerlifting & SBD",
    "default_sets": 4,
    "default_reps": "5 reps",
    "cues": "Feet hip-width, bar over midfoot, engage lats, push floor away through heels, lock hips and knees simultaneously."
  },
  {
    "name": "Sumo Deadlift (Barbell)",
    "category": "Powerlifting & SBD",
    "default_sets": 4,
    "default_reps": "5 reps",
    "cues": "Wide stance, toes pointed outward, vertical shins and torso, push knees out over toes, open hips through floor."
  },
  {
    "name": "Deficit Deadlift (1-2 Inch Platform)",
    "category": "Powerlifting & SBD",
    "default_sets": 4,
    "default_reps": "4-6 reps",
    "cues": "Stand on 1-2 inch rubber mat, requires deeper hip hinge and quad drive off the floor, preserve lumbar neutral."
  },
  {
    "name": "Paused Deadlift (1-Inch Off Floor)",
    "category": "Powerlifting & SBD",
    "default_sets": 4,
    "default_reps": "3-4 reps",
    "cues": "Pull bar 1 inch off floor, hold rock steady for 2 seconds without spinal rounding, complete pull to lockout."
  },
  {
    "name": "Paused Deadlift (Below Knee Pause)",
    "category": "Powerlifting & SBD",
    "default_sets": 4,
    "default_reps": "3-5 reps",
    "cues": "Pull bar to tibial tuberosity, pause 2 seconds maintaining lat tightness and hip position, finish pull."
  },
  {
    "name": "Block / Rack Pulls (Below Knee)",
    "category": "Powerlifting & SBD",
    "default_sets": 4,
    "default_reps": "5-6 reps",
    "cues": "Bar elevated on 3-4 inch blocks, focuses on glute and hamstring lockout power without excessive shear."
  },
  {
    "name": "Block / Rack Pulls (Mid-Shin)",
    "category": "Powerlifting & SBD",
    "default_sets": 4,
    "default_reps": "5 reps",
    "cues": "Bar elevated to mid-shin level, practice initial wedge and leg drive with reduced range of motion."
  },
  {
    "name": "Romanian Deadlift (Barbell RDL)",
    "category": "Powerlifting & SBD",
    "default_sets": 4,
    "default_reps": "8-10 reps",
    "cues": "Slight knee bend fixed in place, hinge hips straight back, lower bar along thighs to mid-shin, squeeze glutes to stand."
  },
  {
    "name": "Snatch Grip Romanian Deadlift (RDL)",
    "category": "Powerlifting & SBD",
    "default_sets": 3,
    "default_reps": "8-10 reps",
    "cues": "Wide grip challenges upper back, lats, and deep hamstring stretch, hips pushed back while spine stays rigid."
  },
  {
    "name": "Trap Bar Deadlift (High Handle)",
    "category": "Powerlifting & SBD",
    "default_sets": 4,
    "default_reps": "6-8 reps",
    "cues": "Stand inside hex bar, grab elevated handles, upright torso posture, equal quad and posterior chain recruitment."
  },
  {
    "name": "Trap Bar Deadlift (Low Handle)",
    "category": "Powerlifting & SBD",
    "default_sets": 4,
    "default_reps": "5-6 reps",
    "cues": "Hex bar flipped to low handles, full range hip hinge from floor with reduced lumbar shear compared to straight bar."
  },
  {
    "name": "Single-Leg Stiff-Legged Deadlift (Dumbbell)",
    "category": "Powerlifting & SBD",
    "default_sets": 3,
    "default_reps": "10 reps per side",
    "cues": "Single stance leg with micro-bend, contralateral hip hinges back, dumbbell tracks down shin, level pelvis."
  },
  {
    "name": "Pelvic Clocks (12 to 6 / 3 to 9 Tilt)",
    "category": "Clinical Pilates & Motor Control",
    "default_sets": 3,
    "default_reps": "10 reps each axis",
    "cues": "Supine hook-lying, isolate subtle pelvic tilting from 12 oclock (posterior tilt) to 6 oclock (anterior tilt) and lateral clock faces."
  },
  {
    "name": "Deadbug (Bilateral Arm & Leg Lowering)",
    "category": "Clinical Pilates & Motor Control",
    "default_sets": 3,
    "default_reps": "8-10 reps",
    "cues": "Tabletop 90/90, imprint lumbar spine against floor, lower both arms and feet toward floor without arching lower back."
  },
  {
    "name": "Deadbug (Contralateral Reach & Hold)",
    "category": "Clinical Pilates & Motor Control",
    "default_sets": 3,
    "default_reps": "10 reps per side",
    "cues": "Opposite arm and leg reach away simultaneously, exhale into abdominal brace, maintain absolute pelvic stability."
  },
  {
    "name": "Bird-Dog with Isometric End-Range Hold",
    "category": "Clinical Pilates & Motor Control",
    "default_sets": 3,
    "default_reps": "8 reps with 5s hold",
    "cues": "Quadruped position, reach opposite arm and leg in line with spine, avoid lumbar hyperextension, hold 5 seconds."
  },
  {
    "name": "The Hundred (Level 1: Knees Bent)",
    "category": "Clinical Pilates & Motor Control",
    "default_sets": 1,
    "default_reps": "100 pumps (10 breath cycles)",
    "cues": "Head and shoulders curled off mat, knees bent at 90°, pump arms vigorously 6 inches, inhale 5 counts, exhale 5 counts."
  },
  {
    "name": "The Hundred (Level 2: Legs Tabletop)",
    "category": "Clinical Pilates & Motor Control",
    "default_sets": 1,
    "default_reps": "100 pumps (10 breath cycles)",
    "cues": "Shins parallel to ceiling in tabletop, imprint spine, pump stiff arms from shoulders with rhythmic breathing."
  },
  {
    "name": "The Hundred (Level 3: Extended Legs 45°)",
    "category": "Clinical Pilates & Motor Control",
    "default_sets": 1,
    "default_reps": "100 pumps (10 breath cycles)",
    "cues": "Legs extended straight at 45° Pilates V, draw navel to spine, maintain stable pelvis throughout 100 arm pumps."
  },
  {
    "name": "Single Leg Stretch (Pilates Mat)",
    "category": "Clinical Pilates & Motor Control",
    "default_sets": 3,
    "default_reps": "10 reps per side",
    "cues": "Head curled up, draw one knee into chest with outside hand on ankle, opposite leg extended at 45°, switch smoothly."
  },
  {
    "name": "Double Leg Stretch (Pilates Mat)",
    "category": "Clinical Pilates & Motor Control",
    "default_sets": 3,
    "default_reps": "8-10 reps",
    "cues": "Hug both knees into chest, inhale reach arms overhead and legs long at 45°, exhale circle arms wide and hug knees."
  },
  {
    "name": "Swimming (Prone Lumbar & Glute Extension)",
    "category": "Clinical Pilates & Motor Control",
    "default_sets": 3,
    "default_reps": "30s flutter",
    "cues": "Prone, lift arms, chest, and legs, flutter alternate limbs in rapid paddling motion, elongate spine from toes to crown."
  },
  {
    "name": "Side-Kick Series: Front & Back",
    "category": "Clinical Pilates & Motor Control",
    "default_sets": 3,
    "default_reps": "10 reps per side",
    "cues": "Side-lying with banana body curve, top leg hip height, kick forward twice with flexed foot, sweep back with pointed foot."
  },
  {
    "name": "Side-Kick Series: Up & Down Lateral",
    "category": "Clinical Pilates & Motor Control",
    "default_sets": 3,
    "default_reps": "10 reps per side",
    "cues": "Lift top leg straight up towards ceiling with pointed toe, flex foot and resist lowering back to hip level."
  },
  {
    "name": "Side-Kick Series: Small Controlled Circles",
    "category": "Clinical Pilates & Motor Control",
    "default_sets": 3,
    "default_reps": "10 circles each dir",
    "cues": "Top leg at hip height, draw small crisp tennis-ball sized circles clockwise then counter-clockwise without torso sway."
  },
  {
    "name": "Spine Stretch Forward (Thoracic Articulation)",
    "category": "Clinical Pilates & Motor Control",
    "default_sets": 3,
    "default_reps": "6-8 reps",
    "cues": "Seated tall with legs extended mat-width, peel spine forward over thighs vertebra by vertebra, pull navel back."
  },
  {
    "name": "The Saw (Rotational Thoracic Mobility)",
    "category": "Clinical Pilates & Motor Control",
    "default_sets": 3,
    "default_reps": "6 reps per side",
    "cues": "Seated wide arms out, rotate torso, saw pinky finger past opposite pinky toe, ground opposite sitting bone."
  },
  {
    "name": "Transversus Abdominis (TrA) Drawing-in Maneuver",
    "category": "Clinical Pilates & Motor Control",
    "default_sets": 3,
    "default_reps": "10 x 10s hold",
    "cues": "Gentle 20-30% submaximal contraction of deep lower abdomen between ASIS spines without breath-holding or rib flaring."
  },
  {
    "name": "Bridging with Ball Squeeze (Adductor/Pelvic Floor)",
    "category": "Clinical Pilates & Motor Control",
    "default_sets": 3,
    "default_reps": "12 reps with 3s hold",
    "cues": "Small Pilates ball between knees, squeeze ball firmly, peel spine off mat to neutral bridge, align ribs and pelvis."
  },
  {
    "name": "Single-Leg Pelvic Bridge with Level Hips",
    "category": "Clinical Pilates & Motor Control",
    "default_sets": 3,
    "default_reps": "10 reps per side",
    "cues": "Lift one leg straight, press stance heel down, raise hips to bridge ensuring ASIS spines remain perfectly horizontal."
  },
  {
    "name": "Clamshell with Neutral Pelvic Spine",
    "category": "Clinical Pilates & Motor Control",
    "default_sets": 3,
    "default_reps": "15 reps per side",
    "cues": "Side-lying, knees 90°, feet glued, open top knee like a clamshell without rolling top hip backward, isolate gluteus medius."
  },
  {
    "name": "Quadruped Rocking (Deep Hip Flexion & Neutral Spine)",
    "category": "Clinical Pilates & Motor Control",
    "default_sets": 3,
    "default_reps": "10-12 reps",
    "cues": "On hands and knees, push hips back toward heels maintaining lumbar lordosis without rounding or tucking pelvis."
  },
  {
    "name": "Prone Press-Up / Cobra (McKenzie Lumbar Extension)",
    "category": "Clinical Pilates & Motor Control",
    "default_sets": 3,
    "default_reps": "10 reps with 2s hold",
    "cues": "Hands under shoulders, press chest up extending lumbar spine while keeping hips and pelvis completely relaxed on floor."
  },
  {
    "name": "Quadruped Thoracic Thread-the-Needle",
    "category": "Clinical Pilates & Motor Control",
    "default_sets": 3,
    "default_reps": "8 reps per side",
    "cues": "Reach one arm underneath torso across the floor with palm up, lower shoulder to ground, open arm to ceiling on return."
  },
  {
    "name": "Ankle Pumps (DVT Prophylaxis & Circulation)",
    "category": "Post-Op Knee (TKR)",
    "default_sets": 3,
    "default_reps": "20-30 reps/hr",
    "cues": "Vigorously pump feet up into dorsiflexion and down into plantarflexion to promote venous return and prevent DVT."
  },
  {
    "name": "Isometric Quad Sets (Towel Roll under Knee)",
    "category": "Post-Op Knee (TKR)",
    "default_sets": 3,
    "default_reps": "15 x 5s hold",
    "cues": "Towel roll beneath knee joint, drive back of knee down into towel while pulling toes back to fire vastus medialis."
  },
  {
    "name": "Isometric Gluteal Squeezes",
    "category": "Post-Op Knee (TKR)",
    "default_sets": 3,
    "default_reps": "15 x 5s hold",
    "cues": "Supine or seated, squeeze buttocks together firmly for 5 seconds without holding breath, release smoothly."
  },
  {
    "name": "Active-Assisted Heel Slides (Towel / Strap Assist)",
    "category": "Post-Op Knee (TKR)",
    "default_sets": 3,
    "default_reps": "10-12 reps",
    "cues": "Loop towel around foot, gently pull foot toward buttocks to comfortable stretch, hold 3s at max flexion, slide back."
  },
  {
    "name": "Terminal Knee Extension (TKE) over Foam Roll",
    "category": "Post-Op Knee (TKR)",
    "default_sets": 3,
    "default_reps": "12-15 reps",
    "cues": "Foam roll under distal thigh, lift heel off bed until knee is completely locked straight, hold 2s peak contraction."
  },
  {
    "name": "Seated Active Knee Extension (0-90°)",
    "category": "Post-Op Knee (TKR)",
    "default_sets": 3,
    "default_reps": "12 reps",
    "cues": "Sit tall in high chair, kick surgical leg straight out to full extension against gravity, pause 2s at top, lower slowly."
  },
  {
    "name": "Passive Knee Extension Hangs (Towel under Heel)",
    "category": "Post-Op Knee (TKR)",
    "default_sets": 3,
    "default_reps": "5-10 min hang",
    "cues": "Place rolled towel strictly beneath heel with knee unsupported, allow gravity to gently stretch knee into 0° extension."
  },
  {
    "name": "Straight Leg Raise (SLR) with Zero Extensor Lag",
    "category": "Post-Op Knee (TKR)",
    "default_sets": 3,
    "default_reps": "10-12 reps",
    "cues": "Lock knee 100% straight before lifting leg 8-10 inches off bed; if knee sags or lags, return to quad sets."
  },
  {
    "name": "Seated Long Arc Quads (0-90° Active)",
    "category": "Post-Op Knee (TKR)",
    "default_sets": 3,
    "default_reps": "12-15 reps",
    "cues": "Seated upright, extend knee from 90° flexion to 0° full extension with light ankle weight or resistance, 3s descent."
  },
  {
    "name": "Short Arc Quads over Bolster",
    "category": "Post-Op Knee (TKR)",
    "default_sets": 3,
    "default_reps": "15 reps",
    "cues": "Bolster under knee, lift heel to straighten leg through terminal 30 degrees, pause 2s, control lowering."
  },
  {
    "name": "Forward Step-Ups (4-Inch Aerobic Block)",
    "category": "Post-Op Knee (TKR)",
    "default_sets": 3,
    "default_reps": "10 reps per side",
    "cues": "Step onto low 4-inch block with surgical leg, press through heel to stand tall, do not push off trailing foot."
  },
  {
    "name": "Controlled Step-Downs (Eccentric Quad Control)",
    "category": "Post-Op Knee (TKR)",
    "default_sets": 3,
    "default_reps": "10 reps per side",
    "cues": "Stand on step, lower non-surgical heel gently to floor in front over 3 seconds, control surgical knee alignment."
  },
  {
    "name": "Stationary Bike (Pedal Rocking to Full Revolutions)",
    "category": "Post-Op Knee (TKR)",
    "default_sets": 1,
    "default_reps": "10-15 minutes",
    "cues": "Rock pedals back and forth to end-range flexion, progress to slow full revolutions with zero pedal resistance."
  },
  {
    "name": "Mini Squats (0-45° Wall Supported)",
    "category": "Post-Op Knee (TKR)",
    "default_sets": 3,
    "default_reps": "12 reps",
    "cues": "Back supported against smooth wall or holding sturdy handrail, squat down to 45° knee flexion, push back up."
  },
  {
    "name": "Standing Bilateral Calf Raises (Flat Ground)",
    "category": "Post-Op Knee (TKR)",
    "default_sets": 3,
    "default_reps": "15-20 reps",
    "cues": "Hands lightly on counter, rise high onto balls of both feet, hold 1s at apex, lower heels slowly to floor."
  },
  {
    "name": "Supported Forward Lunges (Chair / Rail Assist)",
    "category": "Post-Op Knee (TKR)",
    "default_sets": 3,
    "default_reps": "8-10 reps per side",
    "cues": "Step forward holding firm support, drop back knee straight down, keep front knee tracking over 2nd toe."
  },
  {
    "name": "Sled Leg Press (Bilateral Light Resistance)",
    "category": "Post-Op Knee (TKR)",
    "default_sets": 3,
    "default_reps": "12-15 reps",
    "cues": "Feet shoulder-width on footplate, smooth concentric press to soft lockout, slow 3s eccentric return to 90°."
  },
  {
    "name": "Sled Leg Press (Unilateral Light Load)",
    "category": "Post-Op Knee (TKR)",
    "default_sets": 3,
    "default_reps": "10-12 reps per leg",
    "cues": "Single leg placed centrally, press through midfoot, control descent to 80-90° flexion without hip rotation."
  },
  {
    "name": "Wall Sits (60° Knee Flexion Hold)",
    "category": "Post-Op Knee (TKR)",
    "default_sets": 3,
    "default_reps": "30-45s hold",
    "cues": "Slide down wall to comfortable 60° knee angle, press lumbar spine flat into wall, equal weight distribution."
  },
  {
    "name": "Rocker / Balance Board Bilateral Stance",
    "category": "Post-Op Knee (TKR)",
    "default_sets": 3,
    "default_reps": "45s hold",
    "cues": "Stand on board near support wall, maintain level platform without edges tapping ground, micro-adjust balance."
  },
  {
    "name": "Single-Leg Stance Balance (Firm Ground)",
    "category": "Post-Op Knee (TKR)",
    "default_sets": 3,
    "default_reps": "30s hold per leg",
    "cues": "Stand on surgical leg with hands ready near rail, maintain level pelvis and soft knee, focus eyes on static target."
  },
  {
    "name": "Ankle Pumps (THR DVT Prevention & Circulation)",
    "category": "Post-Op Hip (THR)",
    "default_sets": 3,
    "default_reps": "25 reps/hr",
    "cues": "Full range dorsiflexion and plantarflexion in bed to stimulate calf muscle pump and reduce thromboembolism risk."
  },
  {
    "name": "Supine Isometric Quad Sets (THR Bed Level)",
    "category": "Post-Op Hip (THR)",
    "default_sets": 3,
    "default_reps": "15 x 5s hold",
    "cues": "Tighten thigh muscles, press knee flat into mattress, hold 5 seconds, keep toes pointing straight toward ceiling."
  },
  {
    "name": "Supine Isometric Glute Sets (THR)",
    "category": "Post-Op Hip (THR)",
    "default_sets": 3,
    "default_reps": "15 x 5s hold",
    "cues": "Contract buttocks together firmly for 5 seconds without holding breath, promote gluteal re-activation."
  },
  {
    "name": "Supine Heel Slides (<90° Safe Hip Flexion)",
    "category": "Post-Op Hip (THR)",
    "default_sets": 3,
    "default_reps": "10-12 reps",
    "cues": "Slide heel toward buttocks strictly avoiding hip flexion beyond 90 degrees (Posterior Hip Precaution)."
  },
  {
    "name": "Supine Hip Abduction (Slider Board Assist)",
    "category": "Post-Op Hip (THR)",
    "default_sets": 3,
    "default_reps": "12-15 reps",
    "cues": "Slide surgical leg out to side on plastic sheet/slider, return to midline without crossing legs past center."
  },
  {
    "name": "High Seated Active Knee Extensions (THR)",
    "category": "Post-Op Hip (THR)",
    "default_sets": 3,
    "default_reps": "12 reps",
    "cues": "Seated on elevated firm chair with hips higher than knees, kick foot out straight to lock knee, hold 2s."
  },
  {
    "name": "Standing Hip Extension (Supported by Walker / Rail)",
    "category": "Post-Op Hip (THR)",
    "default_sets": 3,
    "default_reps": "10-12 reps",
    "cues": "Stand upright holding rail, extend surgical leg backward from hip without arching lower back, hold 2s."
  },
  {
    "name": "Standing Hip Abduction (Supported by Walker / Rail)",
    "category": "Post-Op Hip (THR)",
    "default_sets": 3,
    "default_reps": "10-12 reps",
    "cues": "Stand tall with toes facing forward, lift surgical leg out to side 20-30°, avoid trunk side-bending."
  },
  {
    "name": "Standing Bilateral Weight Shifts (Symmetrical Loading)",
    "category": "Post-Op Hip (THR)",
    "default_sets": 3,
    "default_reps": "15 reps each side",
    "cues": "Hands lightly on counter, gently transfer body weight from good leg to surgical leg, achieve 50/50 balance."
  },
  {
    "name": "Supine Bridging (Bilateral, Neutral Spine)",
    "category": "Post-Op Hip (THR)",
    "default_sets": 3,
    "default_reps": "10-12 reps",
    "cues": "Knees bent to 70°, lift pelvis off bed by driving heels down, maintain neutral pelvis without hyperextension."
  },
  {
    "name": "Clamshells (Unresisted within Precautions <45°)",
    "category": "Post-Op Hip (THR)",
    "default_sets": 3,
    "default_reps": "12-15 reps per side",
    "cues": "Side-lying, knees bent, open top knee gently to 35-40° without rolling pelvis backward, strictly unresisted initially."
  },
  {
    "name": "Forward Step-Ups (Low 4-Inch Step)",
    "category": "Post-Op Hip (THR)",
    "default_sets": 3,
    "default_reps": "10 reps per leg",
    "cues": "Step up with surgical leg onto low step, press through heel, bring trailing foot up, step down smoothly."
  },
  {
    "name": "Side-Stepping (Bodyweight, Wide Base, No Crossover)",
    "category": "Post-Op Hip (THR)",
    "default_sets": 3,
    "default_reps": "10 steps each dir",
    "cues": "Step sideways across room maintaining wide base of support, never cross surgical leg across midline."
  },
  {
    "name": "Sit-to-Stand (Elevated Firm Chair with Armrests)",
    "category": "Post-Op Hip (THR)",
    "default_sets": 3,
    "default_reps": "8-10 reps",
    "cues": "Scoot to edge of tall chair, surgical foot slightly forward, use armrests to press up, stand fully upright."
  },
  {
    "name": "Upright Stationary Cycling (High Saddle, Zero Resistance)",
    "category": "Post-Op Hip (THR)",
    "default_sets": 1,
    "default_reps": "10-15 minutes",
    "cues": "Saddle adjusted high to prevent hip flexion >90°, gentle continuous pedaling with minimal resistance."
  },
  {
    "name": "Composite Tendon Glides: Straight Fist",
    "category": "Hand Therapy & Intrinsic Drills",
    "default_sets": 3,
    "default_reps": "10 reps with 3s hold",
    "cues": "MCP joints flex to 90° while PIP and DIP joints remain completely straight; targets maximum FDS excursion."
  },
  {
    "name": "Composite Tendon Glides: Hook Fist (Claw Fist)",
    "category": "Hand Therapy & Intrinsic Drills",
    "default_sets": 3,
    "default_reps": "10 reps with 3s hold",
    "cues": "MCP joints extended straight while PIP and DIP joints flex fully; maximizes differential glide between FDP and FDS."
  },
  {
    "name": "Composite Tendon Glides: Tabletop Fist (Lumbrical Position)",
    "category": "Hand Therapy & Intrinsic Drills",
    "default_sets": 3,
    "default_reps": "10 reps with 3s hold",
    "cues": "MCP joints flexed to 90° with interphalangeal joints extended straight; isolates intrinsic lumbricals and interossei."
  },
  {
    "name": "Composite Tendon Glides: Full Composite Fist",
    "category": "Hand Therapy & Intrinsic Drills",
    "default_sets": 3,
    "default_reps": "10 reps with 3s hold",
    "cues": "Fingertips curl into deep palm, thumb wraps outside fingers, full excursion of flexor digitorum profundus (FDP)."
  },
  {
    "name": "Median Nerve Glides (Butler Neurodynamic Progression)",
    "category": "Hand Therapy & Intrinsic Drills",
    "default_sets": 3,
    "default_reps": "8-10 cycles",
    "cues": "Wrist neutral fist -> fingers extended -> wrist/fingers extended -> thumb extended -> forearm supinated -> gentle thumb stretch."
  },
  {
    "name": "Ulnar Nerve Glides (Elbow Flexion & Wrist Extension)",
    "category": "Hand Therapy & Intrinsic Drills",
    "default_sets": 3,
    "default_reps": "8-10 cycles",
    "cues": "Wrist and fingers extended, bend elbow bringing hand upside down by ear (waiter / mask position), oscillate smoothly."
  },
  {
    "name": "Radial Nerve Slider / Tensioner (Thumb-in-Fist & Pronation)",
    "category": "Hand Therapy & Intrinsic Drills",
    "default_sets": 3,
    "default_reps": "8-10 cycles",
    "cues": "Shoulder depressed and extended, elbow straight, pronate forearm, flex wrist and tuck thumb into fist, oscillate neck."
  },
  {
    "name": "Theraputty Power Grip Squeeze",
    "category": "Hand Therapy & Intrinsic Drills",
    "default_sets": 3,
    "default_reps": "15 reps",
    "cues": "Squeeze ball of putty into fist using all digits, hold 3s peak contraction, roll putty back into ball between sets."
  },
  {
    "name": "Theraputty Key Pinch (Thumb Lateral Pinch)",
    "category": "Hand Therapy & Intrinsic Drills",
    "default_sets": 3,
    "default_reps": "12-15 reps",
    "cues": "Place roll of putty between thumb pad and radial side of index middle phalanx, pinch down firmly like turning a key."
  },
  {
    "name": "Theraputty Tip Pinch (Pad-to-Pad Pinch)",
    "category": "Hand Therapy & Intrinsic Drills",
    "default_sets": 3,
    "default_reps": "12 reps each finger",
    "cues": "Pinch putty between thumb pad and individual fingertips (index, middle, ring, little) forming rounded O shape."
  },
  {
    "name": "Theraputty Finger Extension Wrap (Extensor Digitorum)",
    "category": "Hand Therapy & Intrinsic Drills",
    "default_sets": 3,
    "default_reps": "12-15 reps",
    "cues": "Wrap pancake of putty around curled fingertips, spread and extend fingers outward against resistance."
  },
  {
    "name": "Theraputty Interossei Scissor Spread",
    "category": "Hand Therapy & Intrinsic Drills",
    "default_sets": 3,
    "default_reps": "12 reps between digits",
    "cues": "Place cylinder of putty between adjacent fingers, squeeze fingers together like scissors to strengthen palmar interossei."
  },
  {
    "name": "Finger Band Resisted Extensions (Rubber Band)",
    "category": "Hand Therapy & Intrinsic Drills",
    "default_sets": 3,
    "default_reps": "15-20 reps",
    "cues": "Looped elastic band around fingertips, open hand wide extending fingers and thumb against resistance, pause 1s."
  },
  {
    "name": "Tyler Twist with FlexBar (Tennis Elbow / Lateral Epicondyle)",
    "category": "Hand Therapy & Intrinsic Drills",
    "default_sets": 3,
    "default_reps": "15 reps",
    "cues": "Grasp FlexBar in wrist extension on affected side, twist with unaffected hand, extend both arms forward, slowly untwist with affected wrist."
  },
  {
    "name": "Reverse Tyler Twist with FlexBar (Golfer Elbow / Medial Epicondyle)",
    "category": "Hand Therapy & Intrinsic Drills",
    "default_sets": 3,
    "default_reps": "15 reps",
    "cues": "Grasp FlexBar in wrist flexion on affected side, twist with unaffected hand, extend arms, slowly resist eccentric extension into flexion."
  },
  {
    "name": "Forearm Pronation / Supination Drill (Asymmetric DB / Hammer)",
    "category": "Hand Therapy & Intrinsic Drills",
    "default_sets": 3,
    "default_reps": "12-15 reps each dir",
    "cues": "Elbow bent to 90° tucked at ribs, hold hammer or off-center dumbbell by bottom of handle, rotate slowly into full pronation and supination."
  }
,
{
  "name": "Barbell Power Clean (Floor to Front Rack)",
  "category": "Olympic Weightlifting",
  "default_sets": 3,
  "default_reps": "3-5 reps",
  "cues": "Triple extension through ankles, knees, and hips. Pull bar close to body and quickly rotate elbows under into a quarter squat front rack."
},
{
  "name": "Hang Power Clean (Above Knee)",
  "category": "Olympic Weightlifting",
  "default_sets": 3,
  "default_reps": "3-5 reps",
  "cues": "Hinge to above patella, jump and shrug aggressively, snap elbows through into solid front rack catch."
},
{
  "name": "Push Press (Dip & Drive)",
  "category": "Olympic Weightlifting",
  "default_sets": 4,
  "default_reps": "5 reps",
  "cues": "Vertical torso dip of 2-3 inches, explosive leg drive through heels, punch bar directly overhead into locked-out thoracic extension."
},
{
  "name": "Split Jerk (Barbell Overhead Catch)",
  "category": "Olympic Weightlifting",
  "default_sets": 3,
  "default_reps": "2-3 reps",
  "cues": "Dip and drive vertically, drop quickly underneath into front/back split foot position, back knee bent, bar locked overhead behind ears."
},
{
  "name": "Hang Power Snatch (Wide Grip Hip Extension)",
  "category": "Olympic Weightlifting",
  "default_sets": 4,
  "default_reps": "3 reps",
  "cues": "Wide hook grip, hinge from hips above knees, explosive vertical hip extension, catch in quarter squat overhead with active shoulders."
},
{
  "name": "Overhead Squat (Barbell Wide Grip)",
  "category": "Olympic Weightlifting",
  "default_sets": 3,
  "default_reps": "5 reps",
  "cues": "Press bar overhead with wide snatch grip, push up into bar to engage serratus and traps, descend into full deep squat keeping bar over midfoot."
},
{
  "name": "Snatch High Pull (Triple Extension)",
  "category": "Olympic Weightlifting",
  "default_sets": 3,
  "default_reps": "3-5 reps",
  "cues": "Violent extension of hips and knees, shrug shoulders up to ears, elbows high and outside while keeping bar close to chest."
},
{
  "name": "Clean High Pull (Power Position)",
  "category": "Olympic Weightlifting",
  "default_sets": 3,
  "default_reps": "3-5 reps",
  "cues": "Explosive triple extension from the power position, guide barbell vertically with high elbows, maintaining upright posture without leaning back."
},
{
  "name": "Kettlebell Swing (Russian / Eye-Level)",
  "category": "CrossFit & Conditioning",
  "default_sets": 3,
  "default_reps": "15-20 reps",
  "cues": "Hip hinge dominant, snap glutes to standing plank, let bell float weightless to eye level without using shoulders to lift."
},
{
  "name": "Kettlebell Swing (American / Overhead)",
  "category": "CrossFit & Conditioning",
  "default_sets": 3,
  "default_reps": "15 reps",
  "cues": "Hinge deeply, generate violent hip drive to carry kettlebell directly overhead in line with spine, arms fully extended at top."
},
{
  "name": "Wall Ball Shot (Target at 9/10 ft)",
  "category": "CrossFit & Conditioning",
  "default_sets": 3,
  "default_reps": "15-20 reps",
  "cues": "Hold medicine ball at chest, descend into full hip crease below parallel squat, explode upward and throw ball to wall target on extension."
},
{
  "name": "Box Jump with Step Down",
  "category": "CrossFit & Conditioning",
  "default_sets": 3,
  "default_reps": "10-12 reps",
  "cues": "Two-foot explosive takeoff, land softly with knees tracking over toes, stand to full hip extension, step down one foot at a time to protect Achilles."
},
{
  "name": "Thruster (Front Squat into Overhead Press)",
  "category": "CrossFit & Conditioning",
  "default_sets": 3,
  "default_reps": "8-10 reps",
  "cues": "Full depth front squat, explode out of hole transferring leg drive directly into fluid overhead lockout in one continuous movement."
},
{
  "name": "Toes-to-Bar (Hanging Kip or Strict)",
  "category": "CrossFit & Conditioning",
  "default_sets": 3,
  "default_reps": "8-12 reps",
  "cues": "Hang from pull-up bar, initiate hollow-to-arch tension, compress core and kick both feet together until toes contact bar between hands."
},
{
  "name": "Kettlebell Farmer's Walk (Heavy Bilateral Carry)",
  "category": "CrossFit & Conditioning",
  "default_sets": 4,
  "default_reps": "30-40 meters",
  "cues": "Deadlift heavy kettlebells at sides, brace core with tall neutral spine, walk with short deliberate heel-to-toe strides without swaying."
},
{
  "name": "Depth Jump / Drop Jump (Fast Stretch-Shortening Cycle)",
  "category": "Plyometrics & RFD",
  "default_sets": 3,
  "default_reps": "5 reps",
  "cues": "Step off 30cm box, land on balls of feet with minimal ground contact time (<0.2s), explode immediately upward into maximum vertical jump."
},
{
  "name": "Broad Jump (Horizontal Power & Deceleration)",
  "category": "Plyometrics & RFD",
  "default_sets": 3,
  "default_reps": "5-6 reps",
  "cues": "Load hips and swing arms back, leap forward horizontally for maximum distance, land softly in stable bilateral quarter squat sticking the landing."
},
{
  "name": "Lateral Bounds / Skater Hops (Frontal Plane RFD)",
  "category": "Plyometrics & RFD",
  "default_sets": 3,
  "default_reps": "6-8 reps / side",
  "cues": "Push off single leg sideways, fly laterally through air, land softly on opposite leg absorbing force through hip and knee, stick each landing for 1s."
},
{
  "name": "Rotational Medicine Ball Scoop Slam",
  "category": "Plyometrics & RFD",
  "default_sets": 3,
  "default_reps": "8 reps / side",
  "cues": "Pivot rear foot and rotate hips, whip non-bouncing slam ball across torso and spike into wall or floor with maximum rotational velocity."
},
{
  "name": "Overhead Medicine Ball Slam (Triple Flexion Power)",
  "category": "Plyometrics & RFD",
  "default_sets": 3,
  "default_reps": "10 reps",
  "cues": "Reach tall onto toes with ball overhead, aggressively pull down with lats and abdominals, slamming ball into ground directly ahead of feet."
},
{
  "name": "Continuous Hurdle Hops (Linear Reactivity)",
  "category": "Plyometrics & RFD",
  "default_sets": 3,
  "default_reps": "5 hurdles",
  "cues": "Jump cleanly over mini hurdles with rapid ground contact, keeping stiff ankles and knees tracking straight ahead."
},
{
  "name": "Strict Pull-Up (Overhand Grip)",
  "category": "Calisthenics & Bodyweight",
  "default_sets": 3,
  "default_reps": "6-10 reps",
  "cues": "Full dead hang with engaged scaps, pull chest to bar with elbows driving down to back pockets, lower smoothly under control to full extension."
},
{
  "name": "Strict Dip (Parallel Bars)",
  "category": "Calisthenics & Bodyweight",
  "default_sets": 3,
  "default_reps": "8-12 reps",
  "cues": "Support on bars with locked elbows, lower torso with forward lean until shoulders are below elbows, press back up to lockout."
},
{
  "name": "Push-Up (Strict Military Form)",
  "category": "Calisthenics & Bodyweight",
  "default_sets": 3,
  "default_reps": "15-20 reps",
  "cues": "Rigid plank line from crown to heels, tuck elbows to 45 degrees, lower chest until touching floor, push ground away into full scapular protraction."
},
{
  "name": "Inverted Row / Bodyweight Row (Rings or Bar)",
  "category": "Calisthenics & Bodyweight",
  "default_sets": 3,
  "default_reps": "10-12 reps",
  "cues": "Hang horizontally beneath bar, maintain tight glutes and abs, retract shoulder blades and pull chest to bar, pause 1s at top."
},
{
  "name": "Pistol Squat (Single-Leg Full Squat)",
  "category": "Calisthenics & Bodyweight",
  "default_sets": 3,
  "default_reps": "5 reps / leg",
  "cues": "Stand on one leg with opposite leg extended forward horizontally, descend into deep single-leg squat with heel flat on floor, drive up through midfoot."
},
{
  "name": "Hollow Body Hold (Gymnastic Abdominal Hollow)",
  "category": "Calisthenics & Bodyweight",
  "default_sets": 3,
  "default_reps": "30-45 sec hold",
  "cues": "Lie supine, press lumbar spine flat against ground, lift legs 6 inches and reach arms overhead by ears, hold rigid banana shape without arching back."
},
{
  "name": "L-Sit on Parallel Bars / Floor",
  "category": "Calisthenics & Bodyweight",
  "default_sets": 3,
  "default_reps": "15-20 sec hold",
  "cues": "Depress scapulae actively into bars, lift legs straight out at 90 degrees parallel to ground, engage quads and hip flexors."
},
{
  "name": "Downward-Facing Dog (Adho Mukha Svanasana)",
  "category": "Yoga & Mobility",
  "default_sets": 3,
  "default_reps": "30-60 sec hold",
  "cues": "Press firmly through hands and fingers, lift hips high and back into inverted V shape, pedal heels toward floor, lengthen spine."
},
{
  "name": "Upward-Facing Dog / Cobra (Bhujangasana)",
  "category": "Yoga & Mobility",
  "default_sets": 3,
  "default_reps": "5 breaths",
  "cues": "Press tops of feet and palms into floor, extend elbows and lift chest upward, roll shoulders back and down away from ears."
},
{
  "name": "Pigeon Pose (Eka Pada Rajakapotasana - Piriformis / Hip Opener)",
  "category": "Yoga & Mobility",
  "default_sets": 2,
  "default_reps": "60-90 sec / side",
  "cues": "Bring one shin forward across mat, extend rear leg straight back, square hips toward floor, fold forward over front shin as tolerated."
},
{
  "name": "Child's Pose with Lateral Lat Reach (Balasana)",
  "category": "Yoga & Mobility",
  "default_sets": 2,
  "default_reps": "60 sec hold",
  "cues": "Knees wide, big toes touching, sit hips back onto heels, reach arms far forward, walk hands to one side to open opposite lat and rib cage."
},
{
  "name": "Warrior II (Virabhadrasana II - Hip Strength & Mobility)",
  "category": "Yoga & Mobility",
  "default_sets": 3,
  "default_reps": "30-45 sec / side",
  "cues": "Wide stance, front knee bent 90 degrees directly over ankle, back leg straight and grounded, reach arms parallel to floor, gaze over front fingers."
},
{
  "name": "Cat-Cow Segmental Spinal Articulation",
  "category": "Yoga & Mobility",
  "default_sets": 2,
  "default_reps": "10-12 cycles",
  "cues": "Hands under shoulders, knees under hips. Inhale to drop belly and lift chest (Cow), exhale to round spine up towards ceiling tucking chin and pelvis (Cat)."
},
{
  "name": "Thread the Needle (Thoracic Rotation & Posterior Shoulder Stretch)",
  "category": "Yoga & Mobility",
  "default_sets": 2,
  "default_reps": "8-10 reps / side",
  "cues": "From quadruped, reach one arm under torso across opposite side resting back of shoulder and temple on floor, hold or pulse dynamically."
}
];

// Pre-loaded multi-week protocols strictly omitted per workflow architecture
const SEED_TEMPLATES = [];

module.exports = {
  SEED_EXERCISES,
  SEED_TEMPLATES
};
