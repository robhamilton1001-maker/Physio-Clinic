'use strict';

/**
 * Phase 7: Exhaustive Offline Exercise Library & Protocols (262+ Movements)
 * Covering Strength & Conditioning, Orthopaedic Rehabilitation, and Gym Movements.
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
  }
];

// Helper to construct repetitive week blocks
function createWeekSchedule(daySchedule, durationWeeks = 4, focusPrefix = 'Phase Progression') {
  const weeks = [];
  const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  for (let w = 1; w <= durationWeeks; w++) {
    const daysObj = {};
    for (const d of DAYS) {
      if (daySchedule[d]) {
        daysObj[d] = JSON.parse(JSON.stringify(daySchedule[d]));
      } else {
        daysObj[d] = [];
      }
    }
    weeks.push({
      week_num: w,
      title: `Week ${w}`,
      focus: `${focusPrefix} (Week ${w} of ${durationWeeks})`,
      days: daysObj
    });
  }
  return weeks;
}

const SEED_TEMPLATES = [
  {
    "name": "ACL Reconstruction Phase 1: Weeks 1-4",
    "category": "Knee / Post-Op",
    "duration_weeks": 4,
    "protocol_json": "{\"title\":\"ACL Reconstruction Phase 1 (Weeks 1-4)\",\"description\":\"Restoration of full passive extension, quadriceps reactivation, swelling reduction, and progressive early loading.\",\"duration_weeks\":4,\"weeks\":[{\"week_num\":1,\"title\":\"Week 1\",\"focus\":\"Early Activation & Tissue Tolerance\",\"days\":{\"Mon\":[{\"id\":\"ex_etk4wda\",\"name\":\"Spanish Squat (Isometric)\",\"category\":\"Knee & Quad\",\"sets\":4,\"reps\":\"45s hold\",\"hold_sec\":\"45s\",\"weight_kg\":\"Heavy Band\",\"frequency\":\"2x/day\",\"cues\":\"Focus on knee extension drive into band; shins vertical.\",\"notes\":\"ACL Post-Op Recovery Protocol (Week 1)\"},{\"id\":\"ex_ij4lnbu\",\"name\":\"Terminal Knee Extension (TKE)\",\"category\":\"Knee & Quad\",\"sets\":3,\"reps\":\"15 reps\",\"hold_sec\":\"2s\",\"weight_kg\":\"Medium Band\",\"frequency\":\"2x/day\",\"cues\":\"Lock vastus medialis at full extension.\",\"notes\":\"ACL Post-Op Recovery Protocol (Week 1)\"},{\"id\":\"ex_jww0z89\",\"name\":\"Slider Hamstring Curl (Bilateral)\",\"category\":\"Hamstring & Posterior Chain\",\"sets\":3,\"reps\":\"10 reps\",\"hold_sec\":\"—\",\"weight_kg\":\"Bodyweight\",\"frequency\":\"1x/day\",\"cues\":\"Bridge hips high, slow 3s eccentric descent.\",\"notes\":\"ACL Post-Op Recovery Protocol (Week 1)\"}],\"Tue\":[],\"Wed\":[{\"id\":\"ex_b24d71y\",\"name\":\"Leg Extension (Isometric 60°)\",\"category\":\"Knee & Quad\",\"sets\":4,\"reps\":\"30s hold\",\"hold_sec\":\"30s\",\"weight_kg\":\"Bodyweight / 5kg\",\"frequency\":\"1x/day\",\"cues\":\"Target quad motor units at 60° knee flexion.\",\"notes\":\"ACL Post-Op Recovery Protocol (Week 1)\"},{\"id\":\"ex_ainqszk\",\"name\":\"Single-Leg Glute Bridge with Hold\",\"category\":\"Hamstring & Posterior Chain\",\"sets\":3,\"reps\":\"12 reps\",\"hold_sec\":\"3s\",\"weight_kg\":\"Bodyweight\",\"frequency\":\"1x/day\",\"cues\":\"Keep pelvis level; drive heel down.\",\"notes\":\"ACL Post-Op Recovery Protocol (Week 1)\"},{\"id\":\"ex_mneg0vo\",\"name\":\"Bilateral Isometric Calf Raise on Step\",\"category\":\"Foot, Ankle & Calf\",\"sets\":4,\"reps\":\"45s hold\",\"hold_sec\":\"45s\",\"weight_kg\":\"Bodyweight\",\"frequency\":\"1x/day\",\"cues\":\"Mid-range plantarflexion hold.\",\"notes\":\"ACL Post-Op Recovery Protocol (Week 1)\"}],\"Thu\":[],\"Fri\":[{\"id\":\"ex_ugkjxfw\",\"name\":\"Spanish Squat (Isometric)\",\"category\":\"Knee & Quad\",\"sets\":4,\"reps\":\"45s hold\",\"hold_sec\":\"45s\",\"weight_kg\":\"Heavy Band\",\"frequency\":\"2x/day\",\"cues\":\"Drive quad expansion without patellar pain.\",\"notes\":\"ACL Post-Op Recovery Protocol (Week 1)\"},{\"id\":\"ex_d61dccq\",\"name\":\"Poliquin Step-Up\",\"category\":\"Knee & Quad\",\"sets\":3,\"reps\":\"10 reps\",\"hold_sec\":\"—\",\"weight_kg\":\"Slant Board\",\"frequency\":\"1x/day\",\"cues\":\"Track knee over 2nd toe; light heel touch.\",\"notes\":\"ACL Post-Op Recovery Protocol (Week 1)\"},{\"id\":\"ex_ksaotoy\",\"name\":\"Wall Sit with Adductor Squeeze\",\"category\":\"Knee & Quad\",\"sets\":3,\"reps\":\"30s hold\",\"hold_sec\":\"30s\",\"weight_kg\":\"Foam Block\",\"frequency\":\"1x/day\",\"cues\":\"Squeeze block firmly between knees.\",\"notes\":\"ACL Post-Op Recovery Protocol (Week 1)\"}],\"Sat\":[],\"Sun\":[]}},{\"week_num\":2,\"title\":\"Week 2\",\"focus\":\"Early Activation & Tissue Tolerance\",\"days\":{\"Mon\":[{\"id\":\"ex_z5v1l5u\",\"name\":\"Spanish Squat (Isometric)\",\"category\":\"Knee & Quad\",\"sets\":4,\"reps\":\"45s hold\",\"hold_sec\":\"45s\",\"weight_kg\":\"Heavy Band\",\"frequency\":\"2x/day\",\"cues\":\"Focus on knee extension drive into band; shins vertical.\",\"notes\":\"ACL Post-Op Recovery Protocol (Week 2)\"},{\"id\":\"ex_n0stftf\",\"name\":\"Terminal Knee Extension (TKE)\",\"category\":\"Knee & Quad\",\"sets\":3,\"reps\":\"15 reps\",\"hold_sec\":\"2s\",\"weight_kg\":\"Medium Band\",\"frequency\":\"2x/day\",\"cues\":\"Lock vastus medialis at full extension.\",\"notes\":\"ACL Post-Op Recovery Protocol (Week 2)\"},{\"id\":\"ex_v6k4s2p\",\"name\":\"Slider Hamstring Curl (Bilateral)\",\"category\":\"Hamstring & Posterior Chain\",\"sets\":3,\"reps\":\"10 reps\",\"hold_sec\":\"—\",\"weight_kg\":\"Bodyweight\",\"frequency\":\"1x/day\",\"cues\":\"Bridge hips high, slow 3s eccentric descent.\",\"notes\":\"ACL Post-Op Recovery Protocol (Week 2)\"}],\"Tue\":[],\"Wed\":[{\"id\":\"ex_kd9omk8\",\"name\":\"Leg Extension (Isometric 60°)\",\"category\":\"Knee & Quad\",\"sets\":4,\"reps\":\"30s hold\",\"hold_sec\":\"30s\",\"weight_kg\":\"Bodyweight / 5kg\",\"frequency\":\"1x/day\",\"cues\":\"Target quad motor units at 60° knee flexion.\",\"notes\":\"ACL Post-Op Recovery Protocol (Week 2)\"},{\"id\":\"ex_782bfwy\",\"name\":\"Single-Leg Glute Bridge with Hold\",\"category\":\"Hamstring & Posterior Chain\",\"sets\":3,\"reps\":\"12 reps\",\"hold_sec\":\"3s\",\"weight_kg\":\"Bodyweight\",\"frequency\":\"1x/day\",\"cues\":\"Keep pelvis level; drive heel down.\",\"notes\":\"ACL Post-Op Recovery Protocol (Week 2)\"},{\"id\":\"ex_1n49y39\",\"name\":\"Bilateral Isometric Calf Raise on Step\",\"category\":\"Foot, Ankle & Calf\",\"sets\":4,\"reps\":\"45s hold\",\"hold_sec\":\"45s\",\"weight_kg\":\"Bodyweight\",\"frequency\":\"1x/day\",\"cues\":\"Mid-range plantarflexion hold.\",\"notes\":\"ACL Post-Op Recovery Protocol (Week 2)\"}],\"Thu\":[],\"Fri\":[{\"id\":\"ex_j8qucda\",\"name\":\"Spanish Squat (Isometric)\",\"category\":\"Knee & Quad\",\"sets\":4,\"reps\":\"45s hold\",\"hold_sec\":\"45s\",\"weight_kg\":\"Heavy Band\",\"frequency\":\"2x/day\",\"cues\":\"Drive quad expansion without patellar pain.\",\"notes\":\"ACL Post-Op Recovery Protocol (Week 2)\"},{\"id\":\"ex_7btez01\",\"name\":\"Poliquin Step-Up\",\"category\":\"Knee & Quad\",\"sets\":3,\"reps\":\"10 reps\",\"hold_sec\":\"—\",\"weight_kg\":\"Slant Board\",\"frequency\":\"1x/day\",\"cues\":\"Track knee over 2nd toe; light heel touch.\",\"notes\":\"ACL Post-Op Recovery Protocol (Week 2)\"},{\"id\":\"ex_plof1v1\",\"name\":\"Wall Sit with Adductor Squeeze\",\"category\":\"Knee & Quad\",\"sets\":3,\"reps\":\"30s hold\",\"hold_sec\":\"30s\",\"weight_kg\":\"Foam Block\",\"frequency\":\"1x/day\",\"cues\":\"Squeeze block firmly between knees.\",\"notes\":\"ACL Post-Op Recovery Protocol (Week 2)\"}],\"Sat\":[],\"Sun\":[]}},{\"week_num\":3,\"title\":\"Week 3\",\"focus\":\"Progressive Resistance & Functional Capacity\",\"days\":{\"Mon\":[{\"id\":\"ex_goj37bb\",\"name\":\"Spanish Squat (Isometric)\",\"category\":\"Knee & Quad\",\"sets\":5,\"reps\":\"45s hold\",\"hold_sec\":\"45s\",\"weight_kg\":\"Heavy Band\",\"frequency\":\"2x/day\",\"cues\":\"Focus on knee extension drive into band; shins vertical.\",\"notes\":\"ACL Post-Op Recovery Protocol (Week 3)\"},{\"id\":\"ex_0q8d3kc\",\"name\":\"Terminal Knee Extension (TKE)\",\"category\":\"Knee & Quad\",\"sets\":4,\"reps\":\"15 reps\",\"hold_sec\":\"2s\",\"weight_kg\":\"Medium Band\",\"frequency\":\"2x/day\",\"cues\":\"Lock vastus medialis at full extension.\",\"notes\":\"ACL Post-Op Recovery Protocol (Week 3)\"},{\"id\":\"ex_5yfawgb\",\"name\":\"Slider Hamstring Curl (Bilateral)\",\"category\":\"Hamstring & Posterior Chain\",\"sets\":4,\"reps\":\"10 reps\",\"hold_sec\":\"—\",\"weight_kg\":\"Bodyweight\",\"frequency\":\"1x/day\",\"cues\":\"Bridge hips high, slow 3s eccentric descent.\",\"notes\":\"ACL Post-Op Recovery Protocol (Week 3)\"}],\"Tue\":[],\"Wed\":[{\"id\":\"ex_joo1lwp\",\"name\":\"Leg Extension (Isometric 60°)\",\"category\":\"Knee & Quad\",\"sets\":5,\"reps\":\"30s hold\",\"hold_sec\":\"30s\",\"weight_kg\":\"Bodyweight / 5kg\",\"frequency\":\"1x/day\",\"cues\":\"Target quad motor units at 60° knee flexion.\",\"notes\":\"ACL Post-Op Recovery Protocol (Week 3)\"},{\"id\":\"ex_uxoq041\",\"name\":\"Single-Leg Glute Bridge with Hold\",\"category\":\"Hamstring & Posterior Chain\",\"sets\":4,\"reps\":\"12 reps\",\"hold_sec\":\"3s\",\"weight_kg\":\"Bodyweight\",\"frequency\":\"1x/day\",\"cues\":\"Keep pelvis level; drive heel down.\",\"notes\":\"ACL Post-Op Recovery Protocol (Week 3)\"},{\"id\":\"ex_d2vs42d\",\"name\":\"Bilateral Isometric Calf Raise on Step\",\"category\":\"Foot, Ankle & Calf\",\"sets\":5,\"reps\":\"45s hold\",\"hold_sec\":\"45s\",\"weight_kg\":\"Bodyweight\",\"frequency\":\"1x/day\",\"cues\":\"Mid-range plantarflexion hold.\",\"notes\":\"ACL Post-Op Recovery Protocol (Week 3)\"}],\"Thu\":[],\"Fri\":[{\"id\":\"ex_d4nwoeu\",\"name\":\"Spanish Squat (Isometric)\",\"category\":\"Knee & Quad\",\"sets\":5,\"reps\":\"45s hold\",\"hold_sec\":\"45s\",\"weight_kg\":\"Heavy Band\",\"frequency\":\"2x/day\",\"cues\":\"Drive quad expansion without patellar pain.\",\"notes\":\"ACL Post-Op Recovery Protocol (Week 3)\"},{\"id\":\"ex_mqvf3g6\",\"name\":\"Poliquin Step-Up\",\"category\":\"Knee & Quad\",\"sets\":4,\"reps\":\"10 reps\",\"hold_sec\":\"—\",\"weight_kg\":\"Slant Board\",\"frequency\":\"1x/day\",\"cues\":\"Track knee over 2nd toe; light heel touch.\",\"notes\":\"ACL Post-Op Recovery Protocol (Week 3)\"},{\"id\":\"ex_9lu82fy\",\"name\":\"Wall Sit with Adductor Squeeze\",\"category\":\"Knee & Quad\",\"sets\":4,\"reps\":\"30s hold\",\"hold_sec\":\"30s\",\"weight_kg\":\"Foam Block\",\"frequency\":\"1x/day\",\"cues\":\"Squeeze block firmly between knees.\",\"notes\":\"ACL Post-Op Recovery Protocol (Week 3)\"}],\"Sat\":[],\"Sun\":[]}},{\"week_num\":4,\"title\":\"Week 4\",\"focus\":\"Progressive Resistance & Functional Capacity\",\"days\":{\"Mon\":[{\"id\":\"ex_dkfzodv\",\"name\":\"Spanish Squat (Isometric)\",\"category\":\"Knee & Quad\",\"sets\":5,\"reps\":\"45s hold\",\"hold_sec\":\"45s\",\"weight_kg\":\"Heavy Band\",\"frequency\":\"2x/day\",\"cues\":\"Focus on knee extension drive into band; shins vertical.\",\"notes\":\"ACL Post-Op Recovery Protocol (Week 4)\"},{\"id\":\"ex_h6ste3m\",\"name\":\"Terminal Knee Extension (TKE)\",\"category\":\"Knee & Quad\",\"sets\":4,\"reps\":\"15 reps\",\"hold_sec\":\"2s\",\"weight_kg\":\"Medium Band\",\"frequency\":\"2x/day\",\"cues\":\"Lock vastus medialis at full extension.\",\"notes\":\"ACL Post-Op Recovery Protocol (Week 4)\"},{\"id\":\"ex_vqbryvk\",\"name\":\"Slider Hamstring Curl (Bilateral)\",\"category\":\"Hamstring & Posterior Chain\",\"sets\":4,\"reps\":\"10 reps\",\"hold_sec\":\"—\",\"weight_kg\":\"Bodyweight\",\"frequency\":\"1x/day\",\"cues\":\"Bridge hips high, slow 3s eccentric descent.\",\"notes\":\"ACL Post-Op Recovery Protocol (Week 4)\"}],\"Tue\":[],\"Wed\":[{\"id\":\"ex_tnxw3il\",\"name\":\"Leg Extension (Isometric 60°)\",\"category\":\"Knee & Quad\",\"sets\":5,\"reps\":\"30s hold\",\"hold_sec\":\"30s\",\"weight_kg\":\"Bodyweight / 5kg\",\"frequency\":\"1x/day\",\"cues\":\"Target quad motor units at 60° knee flexion.\",\"notes\":\"ACL Post-Op Recovery Protocol (Week 4)\"},{\"id\":\"ex_bntty9k\",\"name\":\"Single-Leg Glute Bridge with Hold\",\"category\":\"Hamstring & Posterior Chain\",\"sets\":4,\"reps\":\"12 reps\",\"hold_sec\":\"3s\",\"weight_kg\":\"Bodyweight\",\"frequency\":\"1x/day\",\"cues\":\"Keep pelvis level; drive heel down.\",\"notes\":\"ACL Post-Op Recovery Protocol (Week 4)\"},{\"id\":\"ex_96tsqbq\",\"name\":\"Bilateral Isometric Calf Raise on Step\",\"category\":\"Foot, Ankle & Calf\",\"sets\":5,\"reps\":\"45s hold\",\"hold_sec\":\"45s\",\"weight_kg\":\"Bodyweight\",\"frequency\":\"1x/day\",\"cues\":\"Mid-range plantarflexion hold.\",\"notes\":\"ACL Post-Op Recovery Protocol (Week 4)\"}],\"Thu\":[],\"Fri\":[{\"id\":\"ex_wxgztzv\",\"name\":\"Spanish Squat (Isometric)\",\"category\":\"Knee & Quad\",\"sets\":5,\"reps\":\"45s hold\",\"hold_sec\":\"45s\",\"weight_kg\":\"Heavy Band\",\"frequency\":\"2x/day\",\"cues\":\"Drive quad expansion without patellar pain.\",\"notes\":\"ACL Post-Op Recovery Protocol (Week 4)\"},{\"id\":\"ex_1zmj0yi\",\"name\":\"Poliquin Step-Up\",\"category\":\"Knee & Quad\",\"sets\":4,\"reps\":\"10 reps\",\"hold_sec\":\"—\",\"weight_kg\":\"Slant Board\",\"frequency\":\"1x/day\",\"cues\":\"Track knee over 2nd toe; light heel touch.\",\"notes\":\"ACL Post-Op Recovery Protocol (Week 4)\"},{\"id\":\"ex_ldvb1ca\",\"name\":\"Wall Sit with Adductor Squeeze\",\"category\":\"Knee & Quad\",\"sets\":4,\"reps\":\"30s hold\",\"hold_sec\":\"30s\",\"weight_kg\":\"Foam Block\",\"frequency\":\"1x/day\",\"cues\":\"Squeeze block firmly between knees.\",\"notes\":\"ACL Post-Op Recovery Protocol (Week 4)\"}],\"Sat\":[],\"Sun\":[]}}]}"
  },
  {
    "name": "Achilles Tendinopathy Heavy Slow Resistance",
    "category": "Foot & Ankle",
    "duration_weeks": 6,
    "protocol_json": "{\"title\":\"Achilles Midportion Tendinopathy Loading (Weeks 1-6)\",\"description\":\"Heavy Slow Resistance (HSR) protocol combined with Alfredson eccentrics to stimulate collagen remodeling and tendon stiffness.\",\"duration_weeks\":6,\"weeks\":[{\"week_num\":1,\"title\":\"Week 1\",\"focus\":\"Early Activation & Tissue Tolerance\",\"days\":{\"Mon\":[],\"Tue\":[{\"id\":\"ex_9c7wtsy\",\"name\":\"Bilateral Isometric Calf Raise on Step\",\"category\":\"Foot, Ankle & Calf\",\"sets\":5,\"reps\":\"45s hold\",\"hold_sec\":\"45s\",\"weight_kg\":\"Bodyweight / +10kg\",\"frequency\":\"1x/day\",\"cues\":\"Analgesic isometric hold; 2 minutes rest between sets.\",\"notes\":\"Achilles HSR Protocol (Week 1)\"},{\"id\":\"ex_8ybpxju\",\"name\":\"Single-Leg Eccentric Heel Drop (Alfredson)\",\"category\":\"Foot, Ankle & Calf\",\"sets\":3,\"reps\":\"15 reps\",\"hold_sec\":\"3s ecc\",\"weight_kg\":\"Bodyweight\",\"frequency\":\"1x/day\",\"cues\":\"Lower heel past step edge over 3 seconds; knee straight.\",\"notes\":\"Achilles HSR Protocol (Week 1)\"},{\"id\":\"ex_z3k4vtk\",\"name\":\"Seated Calf Raise (Soleus)\",\"category\":\"Foot, Ankle & Calf\",\"sets\":3,\"reps\":\"12 reps\",\"hold_sec\":\"2s pause\",\"weight_kg\":\"Dumbbell on knees\",\"frequency\":\"1x/day\",\"cues\":\"Deep stretch into dorsiflexion, explosive plantarflexion.\",\"notes\":\"Achilles HSR Protocol (Week 1)\"}],\"Wed\":[],\"Thu\":[{\"id\":\"ex_z05q9cb\",\"name\":\"Bilateral Isometric Calf Raise on Step\",\"category\":\"Foot, Ankle & Calf\",\"sets\":5,\"reps\":\"45s hold\",\"hold_sec\":\"45s\",\"weight_kg\":\"Bodyweight / +10kg\",\"frequency\":\"1x/day\",\"cues\":\"Analgesic isometric hold.\",\"notes\":\"Achilles HSR Protocol (Week 1)\"},{\"id\":\"ex_yrh3ibg\",\"name\":\"Tibialis Anterior Heel Raises (Wall Lean)\",\"category\":\"Foot, Ankle & Calf\",\"sets\":3,\"reps\":\"20 reps\",\"hold_sec\":\"1s\",\"weight_kg\":\"Bodyweight\",\"frequency\":\"1x/day\",\"cues\":\"Full dorsiflexion against wall.\",\"notes\":\"Achilles HSR Protocol (Week 1)\"},{\"id\":\"ex_tt8953m\",\"name\":\"Bent-Knee Eccentric Heel Drop (Soleus Focus)\",\"category\":\"Foot, Ankle & Calf\",\"sets\":3,\"reps\":\"15 reps\",\"hold_sec\":\"3s ecc\",\"weight_kg\":\"Bodyweight\",\"frequency\":\"1x/day\",\"cues\":\"Knee bent at 30° to target soleus tendon.\",\"notes\":\"Achilles HSR Protocol (Week 1)\"}],\"Fri\":[],\"Sat\":[{\"id\":\"ex_91zozmn\",\"name\":\"Bilateral Isometric Calf Raise on Step\",\"category\":\"Foot, Ankle & Calf\",\"sets\":5,\"reps\":\"45s hold\",\"hold_sec\":\"45s\",\"weight_kg\":\"+15kg Barbell\",\"frequency\":\"1x/day\",\"cues\":\"Progressive tendon loading.\",\"notes\":\"Achilles HSR Protocol (Week 1)\"},{\"id\":\"ex_kmmj497\",\"name\":\"Seated Calf Raise (Soleus)\",\"category\":\"Foot, Ankle & Calf\",\"sets\":4,\"reps\":\"10 reps\",\"hold_sec\":\"3s pause\",\"weight_kg\":\"+15kg DB\",\"frequency\":\"1x/day\",\"cues\":\"Control lowering.\",\"notes\":\"Achilles HSR Protocol (Week 1)\"},{\"id\":\"ex_19fxzub\",\"name\":\"Single-Leg Eccentric Heel Drop (Alfredson)\",\"category\":\"Foot, Ankle & Calf\",\"sets\":3,\"reps\":\"15 reps\",\"hold_sec\":\"3s ecc\",\"weight_kg\":\"+5kg Backpack\",\"frequency\":\"1x/day\",\"cues\":\"Eccentric tempo strictly enforced.\",\"notes\":\"Achilles HSR Protocol (Week 1)\"}],\"Sun\":[]}},{\"week_num\":2,\"title\":\"Week 2\",\"focus\":\"Early Activation & Tissue Tolerance\",\"days\":{\"Mon\":[],\"Tue\":[{\"id\":\"ex_o6kszjl\",\"name\":\"Bilateral Isometric Calf Raise on Step\",\"category\":\"Foot, Ankle & Calf\",\"sets\":5,\"reps\":\"45s hold\",\"hold_sec\":\"45s\",\"weight_kg\":\"Bodyweight / +10kg\",\"frequency\":\"1x/day\",\"cues\":\"Analgesic isometric hold; 2 minutes rest between sets.\",\"notes\":\"Achilles HSR Protocol (Week 2)\"},{\"id\":\"ex_fanfv4o\",\"name\":\"Single-Leg Eccentric Heel Drop (Alfredson)\",\"category\":\"Foot, Ankle & Calf\",\"sets\":3,\"reps\":\"15 reps\",\"hold_sec\":\"3s ecc\",\"weight_kg\":\"Bodyweight\",\"frequency\":\"1x/day\",\"cues\":\"Lower heel past step edge over 3 seconds; knee straight.\",\"notes\":\"Achilles HSR Protocol (Week 2)\"},{\"id\":\"ex_yrgg4lc\",\"name\":\"Seated Calf Raise (Soleus)\",\"category\":\"Foot, Ankle & Calf\",\"sets\":3,\"reps\":\"12 reps\",\"hold_sec\":\"2s pause\",\"weight_kg\":\"Dumbbell on knees\",\"frequency\":\"1x/day\",\"cues\":\"Deep stretch into dorsiflexion, explosive plantarflexion.\",\"notes\":\"Achilles HSR Protocol (Week 2)\"}],\"Wed\":[],\"Thu\":[{\"id\":\"ex_mhbl7mv\",\"name\":\"Bilateral Isometric Calf Raise on Step\",\"category\":\"Foot, Ankle & Calf\",\"sets\":5,\"reps\":\"45s hold\",\"hold_sec\":\"45s\",\"weight_kg\":\"Bodyweight / +10kg\",\"frequency\":\"1x/day\",\"cues\":\"Analgesic isometric hold.\",\"notes\":\"Achilles HSR Protocol (Week 2)\"},{\"id\":\"ex_3a2xpb1\",\"name\":\"Tibialis Anterior Heel Raises (Wall Lean)\",\"category\":\"Foot, Ankle & Calf\",\"sets\":3,\"reps\":\"20 reps\",\"hold_sec\":\"1s\",\"weight_kg\":\"Bodyweight\",\"frequency\":\"1x/day\",\"cues\":\"Full dorsiflexion against wall.\",\"notes\":\"Achilles HSR Protocol (Week 2)\"},{\"id\":\"ex_7fxqsr9\",\"name\":\"Bent-Knee Eccentric Heel Drop (Soleus Focus)\",\"category\":\"Foot, Ankle & Calf\",\"sets\":3,\"reps\":\"15 reps\",\"hold_sec\":\"3s ecc\",\"weight_kg\":\"Bodyweight\",\"frequency\":\"1x/day\",\"cues\":\"Knee bent at 30° to target soleus tendon.\",\"notes\":\"Achilles HSR Protocol (Week 2)\"}],\"Fri\":[],\"Sat\":[{\"id\":\"ex_a5db5lb\",\"name\":\"Bilateral Isometric Calf Raise on Step\",\"category\":\"Foot, Ankle & Calf\",\"sets\":5,\"reps\":\"45s hold\",\"hold_sec\":\"45s\",\"weight_kg\":\"+15kg Barbell\",\"frequency\":\"1x/day\",\"cues\":\"Progressive tendon loading.\",\"notes\":\"Achilles HSR Protocol (Week 2)\"},{\"id\":\"ex_ae29f40\",\"name\":\"Seated Calf Raise (Soleus)\",\"category\":\"Foot, Ankle & Calf\",\"sets\":4,\"reps\":\"10 reps\",\"hold_sec\":\"3s pause\",\"weight_kg\":\"+15kg DB\",\"frequency\":\"1x/day\",\"cues\":\"Control lowering.\",\"notes\":\"Achilles HSR Protocol (Week 2)\"},{\"id\":\"ex_zi4uoml\",\"name\":\"Single-Leg Eccentric Heel Drop (Alfredson)\",\"category\":\"Foot, Ankle & Calf\",\"sets\":3,\"reps\":\"15 reps\",\"hold_sec\":\"3s ecc\",\"weight_kg\":\"+5kg Backpack\",\"frequency\":\"1x/day\",\"cues\":\"Eccentric tempo strictly enforced.\",\"notes\":\"Achilles HSR Protocol (Week 2)\"}],\"Sun\":[]}},{\"week_num\":3,\"title\":\"Week 3\",\"focus\":\"Progressive Resistance & Functional Capacity\",\"days\":{\"Mon\":[],\"Tue\":[{\"id\":\"ex_1jkgrx5\",\"name\":\"Bilateral Isometric Calf Raise on Step\",\"category\":\"Foot, Ankle & Calf\",\"sets\":5,\"reps\":\"45s hold\",\"hold_sec\":\"45s\",\"weight_kg\":\"Bodyweight / +10kg\",\"frequency\":\"1x/day\",\"cues\":\"Analgesic isometric hold; 2 minutes rest between sets.\",\"notes\":\"Achilles HSR Protocol (Week 3)\"},{\"id\":\"ex_iuk3csv\",\"name\":\"Single-Leg Eccentric Heel Drop (Alfredson)\",\"category\":\"Foot, Ankle & Calf\",\"sets\":4,\"reps\":\"15 reps\",\"hold_sec\":\"3s ecc\",\"weight_kg\":\"Bodyweight\",\"frequency\":\"1x/day\",\"cues\":\"Lower heel past step edge over 3 seconds; knee straight.\",\"notes\":\"Achilles HSR Protocol (Week 3)\"},{\"id\":\"ex_3iw8lqm\",\"name\":\"Seated Calf Raise (Soleus)\",\"category\":\"Foot, Ankle & Calf\",\"sets\":4,\"reps\":\"12 reps\",\"hold_sec\":\"2s pause\",\"weight_kg\":\"Dumbbell on knees\",\"frequency\":\"1x/day\",\"cues\":\"Deep stretch into dorsiflexion, explosive plantarflexion.\",\"notes\":\"Achilles HSR Protocol (Week 3)\"}],\"Wed\":[],\"Thu\":[{\"id\":\"ex_5hr9m0d\",\"name\":\"Bilateral Isometric Calf Raise on Step\",\"category\":\"Foot, Ankle & Calf\",\"sets\":5,\"reps\":\"45s hold\",\"hold_sec\":\"45s\",\"weight_kg\":\"Bodyweight / +10kg\",\"frequency\":\"1x/day\",\"cues\":\"Analgesic isometric hold.\",\"notes\":\"Achilles HSR Protocol (Week 3)\"},{\"id\":\"ex_vtqtjg1\",\"name\":\"Tibialis Anterior Heel Raises (Wall Lean)\",\"category\":\"Foot, Ankle & Calf\",\"sets\":4,\"reps\":\"20 reps\",\"hold_sec\":\"1s\",\"weight_kg\":\"Bodyweight\",\"frequency\":\"1x/day\",\"cues\":\"Full dorsiflexion against wall.\",\"notes\":\"Achilles HSR Protocol (Week 3)\"},{\"id\":\"ex_n7oqtmv\",\"name\":\"Bent-Knee Eccentric Heel Drop (Soleus Focus)\",\"category\":\"Foot, Ankle & Calf\",\"sets\":4,\"reps\":\"15 reps\",\"hold_sec\":\"3s ecc\",\"weight_kg\":\"Bodyweight\",\"frequency\":\"1x/day\",\"cues\":\"Knee bent at 30° to target soleus tendon.\",\"notes\":\"Achilles HSR Protocol (Week 3)\"}],\"Fri\":[],\"Sat\":[{\"id\":\"ex_c1iraz1\",\"name\":\"Bilateral Isometric Calf Raise on Step\",\"category\":\"Foot, Ankle & Calf\",\"sets\":5,\"reps\":\"45s hold\",\"hold_sec\":\"45s\",\"weight_kg\":\"+15kg Barbell\",\"frequency\":\"1x/day\",\"cues\":\"Progressive tendon loading.\",\"notes\":\"Achilles HSR Protocol (Week 3)\"},{\"id\":\"ex_jag46st\",\"name\":\"Seated Calf Raise (Soleus)\",\"category\":\"Foot, Ankle & Calf\",\"sets\":5,\"reps\":\"10 reps\",\"hold_sec\":\"3s pause\",\"weight_kg\":\"+15kg DB\",\"frequency\":\"1x/day\",\"cues\":\"Control lowering.\",\"notes\":\"Achilles HSR Protocol (Week 3)\"},{\"id\":\"ex_l106sjv\",\"name\":\"Single-Leg Eccentric Heel Drop (Alfredson)\",\"category\":\"Foot, Ankle & Calf\",\"sets\":4,\"reps\":\"15 reps\",\"hold_sec\":\"3s ecc\",\"weight_kg\":\"+5kg Backpack\",\"frequency\":\"1x/day\",\"cues\":\"Eccentric tempo strictly enforced.\",\"notes\":\"Achilles HSR Protocol (Week 3)\"}],\"Sun\":[]}},{\"week_num\":4,\"title\":\"Week 4\",\"focus\":\"Progressive Resistance & Functional Capacity\",\"days\":{\"Mon\":[],\"Tue\":[{\"id\":\"ex_a0v4yi0\",\"name\":\"Bilateral Isometric Calf Raise on Step\",\"category\":\"Foot, Ankle & Calf\",\"sets\":5,\"reps\":\"45s hold\",\"hold_sec\":\"45s\",\"weight_kg\":\"Bodyweight / +10kg\",\"frequency\":\"1x/day\",\"cues\":\"Analgesic isometric hold; 2 minutes rest between sets.\",\"notes\":\"Achilles HSR Protocol (Week 4)\"},{\"id\":\"ex_kss99qk\",\"name\":\"Single-Leg Eccentric Heel Drop (Alfredson)\",\"category\":\"Foot, Ankle & Calf\",\"sets\":4,\"reps\":\"15 reps\",\"hold_sec\":\"3s ecc\",\"weight_kg\":\"Bodyweight\",\"frequency\":\"1x/day\",\"cues\":\"Lower heel past step edge over 3 seconds; knee straight.\",\"notes\":\"Achilles HSR Protocol (Week 4)\"},{\"id\":\"ex_gb350ik\",\"name\":\"Seated Calf Raise (Soleus)\",\"category\":\"Foot, Ankle & Calf\",\"sets\":4,\"reps\":\"12 reps\",\"hold_sec\":\"2s pause\",\"weight_kg\":\"Dumbbell on knees\",\"frequency\":\"1x/day\",\"cues\":\"Deep stretch into dorsiflexion, explosive plantarflexion.\",\"notes\":\"Achilles HSR Protocol (Week 4)\"}],\"Wed\":[],\"Thu\":[{\"id\":\"ex_n0w22d0\",\"name\":\"Bilateral Isometric Calf Raise on Step\",\"category\":\"Foot, Ankle & Calf\",\"sets\":5,\"reps\":\"45s hold\",\"hold_sec\":\"45s\",\"weight_kg\":\"Bodyweight / +10kg\",\"frequency\":\"1x/day\",\"cues\":\"Analgesic isometric hold.\",\"notes\":\"Achilles HSR Protocol (Week 4)\"},{\"id\":\"ex_zib9kxe\",\"name\":\"Tibialis Anterior Heel Raises (Wall Lean)\",\"category\":\"Foot, Ankle & Calf\",\"sets\":4,\"reps\":\"20 reps\",\"hold_sec\":\"1s\",\"weight_kg\":\"Bodyweight\",\"frequency\":\"1x/day\",\"cues\":\"Full dorsiflexion against wall.\",\"notes\":\"Achilles HSR Protocol (Week 4)\"},{\"id\":\"ex_7tutofx\",\"name\":\"Bent-Knee Eccentric Heel Drop (Soleus Focus)\",\"category\":\"Foot, Ankle & Calf\",\"sets\":4,\"reps\":\"15 reps\",\"hold_sec\":\"3s ecc\",\"weight_kg\":\"Bodyweight\",\"frequency\":\"1x/day\",\"cues\":\"Knee bent at 30° to target soleus tendon.\",\"notes\":\"Achilles HSR Protocol (Week 4)\"}],\"Fri\":[],\"Sat\":[{\"id\":\"ex_scpq0ca\",\"name\":\"Bilateral Isometric Calf Raise on Step\",\"category\":\"Foot, Ankle & Calf\",\"sets\":5,\"reps\":\"45s hold\",\"hold_sec\":\"45s\",\"weight_kg\":\"+15kg Barbell\",\"frequency\":\"1x/day\",\"cues\":\"Progressive tendon loading.\",\"notes\":\"Achilles HSR Protocol (Week 4)\"},{\"id\":\"ex_we5rmmm\",\"name\":\"Seated Calf Raise (Soleus)\",\"category\":\"Foot, Ankle & Calf\",\"sets\":5,\"reps\":\"10 reps\",\"hold_sec\":\"3s pause\",\"weight_kg\":\"+15kg DB\",\"frequency\":\"1x/day\",\"cues\":\"Control lowering.\",\"notes\":\"Achilles HSR Protocol (Week 4)\"},{\"id\":\"ex_010b40s\",\"name\":\"Single-Leg Eccentric Heel Drop (Alfredson)\",\"category\":\"Foot, Ankle & Calf\",\"sets\":4,\"reps\":\"15 reps\",\"hold_sec\":\"3s ecc\",\"weight_kg\":\"+5kg Backpack\",\"frequency\":\"1x/day\",\"cues\":\"Eccentric tempo strictly enforced.\",\"notes\":\"Achilles HSR Protocol (Week 4)\"}],\"Sun\":[]}},{\"week_num\":5,\"title\":\"Week 5\",\"focus\":\"Progressive Resistance & Functional Capacity\",\"days\":{\"Mon\":[],\"Tue\":[{\"id\":\"ex_0lo41vg\",\"name\":\"Bilateral Isometric Calf Raise on Step\",\"category\":\"Foot, Ankle & Calf\",\"sets\":5,\"reps\":\"45s hold\",\"hold_sec\":\"45s\",\"weight_kg\":\"Bodyweight / +10kg\",\"frequency\":\"1x/day\",\"cues\":\"Analgesic isometric hold; 2 minutes rest between sets.\",\"notes\":\"Achilles HSR Protocol (Week 5)\"},{\"id\":\"ex_wkdcgrf\",\"name\":\"Single-Leg Eccentric Heel Drop (Alfredson)\",\"category\":\"Foot, Ankle & Calf\",\"sets\":4,\"reps\":\"15 reps\",\"hold_sec\":\"3s ecc\",\"weight_kg\":\"Bodyweight\",\"frequency\":\"1x/day\",\"cues\":\"Lower heel past step edge over 3 seconds; knee straight.\",\"notes\":\"Achilles HSR Protocol (Week 5)\"},{\"id\":\"ex_8ebco6v\",\"name\":\"Seated Calf Raise (Soleus)\",\"category\":\"Foot, Ankle & Calf\",\"sets\":4,\"reps\":\"12 reps\",\"hold_sec\":\"2s pause\",\"weight_kg\":\"Dumbbell on knees\",\"frequency\":\"1x/day\",\"cues\":\"Deep stretch into dorsiflexion, explosive plantarflexion.\",\"notes\":\"Achilles HSR Protocol (Week 5)\"}],\"Wed\":[],\"Thu\":[{\"id\":\"ex_ukugjim\",\"name\":\"Bilateral Isometric Calf Raise on Step\",\"category\":\"Foot, Ankle & Calf\",\"sets\":5,\"reps\":\"45s hold\",\"hold_sec\":\"45s\",\"weight_kg\":\"Bodyweight / +10kg\",\"frequency\":\"1x/day\",\"cues\":\"Analgesic isometric hold.\",\"notes\":\"Achilles HSR Protocol (Week 5)\"},{\"id\":\"ex_ydxaiz9\",\"name\":\"Tibialis Anterior Heel Raises (Wall Lean)\",\"category\":\"Foot, Ankle & Calf\",\"sets\":4,\"reps\":\"20 reps\",\"hold_sec\":\"1s\",\"weight_kg\":\"Bodyweight\",\"frequency\":\"1x/day\",\"cues\":\"Full dorsiflexion against wall.\",\"notes\":\"Achilles HSR Protocol (Week 5)\"},{\"id\":\"ex_1wrgjcy\",\"name\":\"Bent-Knee Eccentric Heel Drop (Soleus Focus)\",\"category\":\"Foot, Ankle & Calf\",\"sets\":4,\"reps\":\"15 reps\",\"hold_sec\":\"3s ecc\",\"weight_kg\":\"Bodyweight\",\"frequency\":\"1x/day\",\"cues\":\"Knee bent at 30° to target soleus tendon.\",\"notes\":\"Achilles HSR Protocol (Week 5)\"}],\"Fri\":[],\"Sat\":[{\"id\":\"ex_hcuo9kn\",\"name\":\"Bilateral Isometric Calf Raise on Step\",\"category\":\"Foot, Ankle & Calf\",\"sets\":5,\"reps\":\"45s hold\",\"hold_sec\":\"45s\",\"weight_kg\":\"+15kg Barbell\",\"frequency\":\"1x/day\",\"cues\":\"Progressive tendon loading.\",\"notes\":\"Achilles HSR Protocol (Week 5)\"},{\"id\":\"ex_b5hmihx\",\"name\":\"Seated Calf Raise (Soleus)\",\"category\":\"Foot, Ankle & Calf\",\"sets\":5,\"reps\":\"10 reps\",\"hold_sec\":\"3s pause\",\"weight_kg\":\"+15kg DB\",\"frequency\":\"1x/day\",\"cues\":\"Control lowering.\",\"notes\":\"Achilles HSR Protocol (Week 5)\"},{\"id\":\"ex_63jaiya\",\"name\":\"Single-Leg Eccentric Heel Drop (Alfredson)\",\"category\":\"Foot, Ankle & Calf\",\"sets\":4,\"reps\":\"15 reps\",\"hold_sec\":\"3s ecc\",\"weight_kg\":\"+5kg Backpack\",\"frequency\":\"1x/day\",\"cues\":\"Eccentric tempo strictly enforced.\",\"notes\":\"Achilles HSR Protocol (Week 5)\"}],\"Sun\":[]}},{\"week_num\":6,\"title\":\"Week 6\",\"focus\":\"Progressive Resistance & Functional Capacity\",\"days\":{\"Mon\":[],\"Tue\":[{\"id\":\"ex_kuo023y\",\"name\":\"Bilateral Isometric Calf Raise on Step\",\"category\":\"Foot, Ankle & Calf\",\"sets\":5,\"reps\":\"45s hold\",\"hold_sec\":\"45s\",\"weight_kg\":\"Bodyweight / +10kg\",\"frequency\":\"1x/day\",\"cues\":\"Analgesic isometric hold; 2 minutes rest between sets.\",\"notes\":\"Achilles HSR Protocol (Week 6)\"},{\"id\":\"ex_16u25mq\",\"name\":\"Single-Leg Eccentric Heel Drop (Alfredson)\",\"category\":\"Foot, Ankle & Calf\",\"sets\":4,\"reps\":\"15 reps\",\"hold_sec\":\"3s ecc\",\"weight_kg\":\"Bodyweight\",\"frequency\":\"1x/day\",\"cues\":\"Lower heel past step edge over 3 seconds; knee straight.\",\"notes\":\"Achilles HSR Protocol (Week 6)\"},{\"id\":\"ex_5ul8yu3\",\"name\":\"Seated Calf Raise (Soleus)\",\"category\":\"Foot, Ankle & Calf\",\"sets\":4,\"reps\":\"12 reps\",\"hold_sec\":\"2s pause\",\"weight_kg\":\"Dumbbell on knees\",\"frequency\":\"1x/day\",\"cues\":\"Deep stretch into dorsiflexion, explosive plantarflexion.\",\"notes\":\"Achilles HSR Protocol (Week 6)\"}],\"Wed\":[],\"Thu\":[{\"id\":\"ex_kx0ruri\",\"name\":\"Bilateral Isometric Calf Raise on Step\",\"category\":\"Foot, Ankle & Calf\",\"sets\":5,\"reps\":\"45s hold\",\"hold_sec\":\"45s\",\"weight_kg\":\"Bodyweight / +10kg\",\"frequency\":\"1x/day\",\"cues\":\"Analgesic isometric hold.\",\"notes\":\"Achilles HSR Protocol (Week 6)\"},{\"id\":\"ex_9ahuxwl\",\"name\":\"Tibialis Anterior Heel Raises (Wall Lean)\",\"category\":\"Foot, Ankle & Calf\",\"sets\":4,\"reps\":\"20 reps\",\"hold_sec\":\"1s\",\"weight_kg\":\"Bodyweight\",\"frequency\":\"1x/day\",\"cues\":\"Full dorsiflexion against wall.\",\"notes\":\"Achilles HSR Protocol (Week 6)\"},{\"id\":\"ex_5brdowr\",\"name\":\"Bent-Knee Eccentric Heel Drop (Soleus Focus)\",\"category\":\"Foot, Ankle & Calf\",\"sets\":4,\"reps\":\"15 reps\",\"hold_sec\":\"3s ecc\",\"weight_kg\":\"Bodyweight\",\"frequency\":\"1x/day\",\"cues\":\"Knee bent at 30° to target soleus tendon.\",\"notes\":\"Achilles HSR Protocol (Week 6)\"}],\"Fri\":[],\"Sat\":[{\"id\":\"ex_w0vuwot\",\"name\":\"Bilateral Isometric Calf Raise on Step\",\"category\":\"Foot, Ankle & Calf\",\"sets\":5,\"reps\":\"45s hold\",\"hold_sec\":\"45s\",\"weight_kg\":\"+15kg Barbell\",\"frequency\":\"1x/day\",\"cues\":\"Progressive tendon loading.\",\"notes\":\"Achilles HSR Protocol (Week 6)\"},{\"id\":\"ex_qaip92c\",\"name\":\"Seated Calf Raise (Soleus)\",\"category\":\"Foot, Ankle & Calf\",\"sets\":5,\"reps\":\"10 reps\",\"hold_sec\":\"3s pause\",\"weight_kg\":\"+15kg DB\",\"frequency\":\"1x/day\",\"cues\":\"Control lowering.\",\"notes\":\"Achilles HSR Protocol (Week 6)\"},{\"id\":\"ex_4m46wu4\",\"name\":\"Single-Leg Eccentric Heel Drop (Alfredson)\",\"category\":\"Foot, Ankle & Calf\",\"sets\":4,\"reps\":\"15 reps\",\"hold_sec\":\"3s ecc\",\"weight_kg\":\"+5kg Backpack\",\"frequency\":\"1x/day\",\"cues\":\"Eccentric tempo strictly enforced.\",\"notes\":\"Achilles HSR Protocol (Week 6)\"}],\"Sun\":[]}}]}"
  },
  {
    "name": "Subacromial Shoulder Rehab & Cuff Progression",
    "category": "Shoulder",
    "duration_weeks": 6,
    "protocol_json": "{\"title\":\"Subacromial Impingement & Rotator Cuff Progression (Weeks 1-6)\",\"description\":\"Restores scapulohumeral rhythm, lower trapezius/serratus anterior recruitment, and progressive rotator cuff capacity.\",\"duration_weeks\":6,\"weeks\":[{\"week_num\":1,\"title\":\"Week 1\",\"focus\":\"Early Activation & Tissue Tolerance\",\"days\":{\"Mon\":[{\"id\":\"ex_xbxh2bp\",\"name\":\"Side-Lying Shoulder External Rotation\",\"category\":\"Shoulder & Rotator Cuff\",\"sets\":3,\"reps\":\"15 reps\",\"hold_sec\":\"2s\",\"weight_kg\":\"1-2 kg DB\",\"frequency\":\"1x/day\",\"cues\":\"Towel under elbow; clean rotation without compensation.\",\"notes\":\"Subacromial Decompression & Rotator Cuff Protocol (Week 1)\"},{\"id\":\"ex_vt9ux04\",\"name\":\"Serratus Wall Slide with Foam Roller\",\"category\":\"Shoulder & Scapula\",\"sets\":3,\"reps\":\"10 reps\",\"hold_sec\":\"2s\",\"weight_kg\":\"Mini-Band\",\"frequency\":\"1x/day\",\"cues\":\"Protract scapulae into upward rotation.\",\"notes\":\"Subacromial Decompression & Rotator Cuff Protocol (Week 1)\"},{\"id\":\"ex_eyufbog\",\"name\":\"Prone Y-Raise (Lower Trapezius)\",\"category\":\"Shoulder & Scapula\",\"sets\":3,\"reps\":\"10 reps\",\"hold_sec\":\"2s\",\"weight_kg\":\"Bodyweight\",\"frequency\":\"1x/day\",\"cues\":\"Initiate from lower trap; thumbs to ceiling.\",\"notes\":\"Subacromial Decompression & Rotator Cuff Protocol (Week 1)\"}],\"Tue\":[],\"Wed\":[{\"id\":\"ex_f7etqun\",\"name\":\"Face Pull with External Rotation\",\"category\":\"Shoulder & Scapula\",\"sets\":3,\"reps\":\"12 reps\",\"hold_sec\":\"2s\",\"weight_kg\":\"Resistance Band\",\"frequency\":\"1x/day\",\"cues\":\"Pull to eye level, rotate forearms back.\",\"notes\":\"Subacromial Decompression & Rotator Cuff Protocol (Week 1)\"},{\"id\":\"ex_0vf2q4x\",\"name\":\"Cable External Rotation (at 0° Abduction)\",\"category\":\"Shoulder & Scapula\",\"sets\":3,\"reps\":\"12 reps\",\"hold_sec\":\"3s\",\"weight_kg\":\"Cable\",\"frequency\":\"1x/day\",\"cues\":\"Control eccentric lowering over 3s.\",\"notes\":\"Subacromial Decompression & Rotator Cuff Protocol (Week 1)\"},{\"id\":\"ex_a7h3z4x\",\"name\":\"Kettlebell Arm-Bar (Thoracic Mobility & Cuff)\",\"category\":\"Shoulder & Scapula\",\"sets\":3,\"reps\":\"30s hold\",\"hold_sec\":\"30s\",\"weight_kg\":\"4-6 kg KB\",\"frequency\":\"1x/day\",\"cues\":\"Pack shoulder blade down and back.\",\"notes\":\"Subacromial Decompression & Rotator Cuff Protocol (Week 1)\"}],\"Thu\":[],\"Fri\":[{\"id\":\"ex_0wymu5y\",\"name\":\"Serratus Wall Slide with Foam Roller\",\"category\":\"Shoulder & Scapula\",\"sets\":3,\"reps\":\"12 reps\",\"hold_sec\":\"2s\",\"weight_kg\":\"Mini-Band\",\"frequency\":\"1x/day\",\"cues\":\"Active upward rotation.\",\"notes\":\"Subacromial Decompression & Rotator Cuff Protocol (Week 1)\"},{\"id\":\"ex_tya9a3u\",\"name\":\"Push-Up to Plus (Serratus Anterior)\",\"category\":\"Shoulder & Scapula\",\"sets\":3,\"reps\":\"12 reps\",\"hold_sec\":\"2s\",\"weight_kg\":\"Bodyweight\",\"frequency\":\"1x/day\",\"cues\":\"High elbow position.\",\"notes\":\"Subacromial Decompression & Rotator Cuff Protocol (Week 1)\"},{\"id\":\"ex_dhbnbl4\",\"name\":\"Prone T-Raise (Middle Trapezius & Rhomboids)\",\"category\":\"Shoulder & Scapula\",\"sets\":3,\"reps\":\"12 reps\",\"hold_sec\":\"2s\",\"weight_kg\":\"1kg plates\",\"frequency\":\"1x/day\",\"cues\":\"Keep neck relaxed.\",\"notes\":\"Subacromial Decompression & Rotator Cuff Protocol (Week 1)\"}],\"Sat\":[],\"Sun\":[]}},{\"week_num\":2,\"title\":\"Week 2\",\"focus\":\"Early Activation & Tissue Tolerance\",\"days\":{\"Mon\":[{\"id\":\"ex_d2hhagq\",\"name\":\"Side-Lying Shoulder External Rotation\",\"category\":\"Shoulder & Rotator Cuff\",\"sets\":3,\"reps\":\"15 reps\",\"hold_sec\":\"2s\",\"weight_kg\":\"1-2 kg DB\",\"frequency\":\"1x/day\",\"cues\":\"Towel under elbow; clean rotation without compensation.\",\"notes\":\"Subacromial Decompression & Rotator Cuff Protocol (Week 2)\"},{\"id\":\"ex_ex5ygzz\",\"name\":\"Serratus Wall Slide with Foam Roller\",\"category\":\"Shoulder & Scapula\",\"sets\":3,\"reps\":\"10 reps\",\"hold_sec\":\"2s\",\"weight_kg\":\"Mini-Band\",\"frequency\":\"1x/day\",\"cues\":\"Protract scapulae into upward rotation.\",\"notes\":\"Subacromial Decompression & Rotator Cuff Protocol (Week 2)\"},{\"id\":\"ex_5pcf6ki\",\"name\":\"Prone Y-Raise (Lower Trapezius)\",\"category\":\"Shoulder & Scapula\",\"sets\":3,\"reps\":\"10 reps\",\"hold_sec\":\"2s\",\"weight_kg\":\"Bodyweight\",\"frequency\":\"1x/day\",\"cues\":\"Initiate from lower trap; thumbs to ceiling.\",\"notes\":\"Subacromial Decompression & Rotator Cuff Protocol (Week 2)\"}],\"Tue\":[],\"Wed\":[{\"id\":\"ex_a8mr8xi\",\"name\":\"Face Pull with External Rotation\",\"category\":\"Shoulder & Scapula\",\"sets\":3,\"reps\":\"12 reps\",\"hold_sec\":\"2s\",\"weight_kg\":\"Resistance Band\",\"frequency\":\"1x/day\",\"cues\":\"Pull to eye level, rotate forearms back.\",\"notes\":\"Subacromial Decompression & Rotator Cuff Protocol (Week 2)\"},{\"id\":\"ex_dbpy2j5\",\"name\":\"Cable External Rotation (at 0° Abduction)\",\"category\":\"Shoulder & Scapula\",\"sets\":3,\"reps\":\"12 reps\",\"hold_sec\":\"3s\",\"weight_kg\":\"Cable\",\"frequency\":\"1x/day\",\"cues\":\"Control eccentric lowering over 3s.\",\"notes\":\"Subacromial Decompression & Rotator Cuff Protocol (Week 2)\"},{\"id\":\"ex_626u6k2\",\"name\":\"Kettlebell Arm-Bar (Thoracic Mobility & Cuff)\",\"category\":\"Shoulder & Scapula\",\"sets\":3,\"reps\":\"30s hold\",\"hold_sec\":\"30s\",\"weight_kg\":\"4-6 kg KB\",\"frequency\":\"1x/day\",\"cues\":\"Pack shoulder blade down and back.\",\"notes\":\"Subacromial Decompression & Rotator Cuff Protocol (Week 2)\"}],\"Thu\":[],\"Fri\":[{\"id\":\"ex_8wnak20\",\"name\":\"Serratus Wall Slide with Foam Roller\",\"category\":\"Shoulder & Scapula\",\"sets\":3,\"reps\":\"12 reps\",\"hold_sec\":\"2s\",\"weight_kg\":\"Mini-Band\",\"frequency\":\"1x/day\",\"cues\":\"Active upward rotation.\",\"notes\":\"Subacromial Decompression & Rotator Cuff Protocol (Week 2)\"},{\"id\":\"ex_1895idd\",\"name\":\"Push-Up to Plus (Serratus Anterior)\",\"category\":\"Shoulder & Scapula\",\"sets\":3,\"reps\":\"12 reps\",\"hold_sec\":\"2s\",\"weight_kg\":\"Bodyweight\",\"frequency\":\"1x/day\",\"cues\":\"High elbow position.\",\"notes\":\"Subacromial Decompression & Rotator Cuff Protocol (Week 2)\"},{\"id\":\"ex_8kxjzee\",\"name\":\"Prone T-Raise (Middle Trapezius & Rhomboids)\",\"category\":\"Shoulder & Scapula\",\"sets\":3,\"reps\":\"12 reps\",\"hold_sec\":\"2s\",\"weight_kg\":\"1kg plates\",\"frequency\":\"1x/day\",\"cues\":\"Keep neck relaxed.\",\"notes\":\"Subacromial Decompression & Rotator Cuff Protocol (Week 2)\"}],\"Sat\":[],\"Sun\":[]}},{\"week_num\":3,\"title\":\"Week 3\",\"focus\":\"Progressive Resistance & Functional Capacity\",\"days\":{\"Mon\":[{\"id\":\"ex_i32w8sk\",\"name\":\"Side-Lying Shoulder External Rotation\",\"category\":\"Shoulder & Rotator Cuff\",\"sets\":4,\"reps\":\"15 reps\",\"hold_sec\":\"2s\",\"weight_kg\":\"1-2 kg DB\",\"frequency\":\"1x/day\",\"cues\":\"Towel under elbow; clean rotation without compensation.\",\"notes\":\"Subacromial Decompression & Rotator Cuff Protocol (Week 3)\"},{\"id\":\"ex_djjitsq\",\"name\":\"Serratus Wall Slide with Foam Roller\",\"category\":\"Shoulder & Scapula\",\"sets\":4,\"reps\":\"10 reps\",\"hold_sec\":\"2s\",\"weight_kg\":\"Mini-Band\",\"frequency\":\"1x/day\",\"cues\":\"Protract scapulae into upward rotation.\",\"notes\":\"Subacromial Decompression & Rotator Cuff Protocol (Week 3)\"},{\"id\":\"ex_xqy7qm8\",\"name\":\"Prone Y-Raise (Lower Trapezius)\",\"category\":\"Shoulder & Scapula\",\"sets\":4,\"reps\":\"10 reps\",\"hold_sec\":\"2s\",\"weight_kg\":\"Bodyweight\",\"frequency\":\"1x/day\",\"cues\":\"Initiate from lower trap; thumbs to ceiling.\",\"notes\":\"Subacromial Decompression & Rotator Cuff Protocol (Week 3)\"}],\"Tue\":[],\"Wed\":[{\"id\":\"ex_skpcc7r\",\"name\":\"Face Pull with External Rotation\",\"category\":\"Shoulder & Scapula\",\"sets\":4,\"reps\":\"12 reps\",\"hold_sec\":\"2s\",\"weight_kg\":\"Resistance Band\",\"frequency\":\"1x/day\",\"cues\":\"Pull to eye level, rotate forearms back.\",\"notes\":\"Subacromial Decompression & Rotator Cuff Protocol (Week 3)\"},{\"id\":\"ex_a4b8swz\",\"name\":\"Cable External Rotation (at 0° Abduction)\",\"category\":\"Shoulder & Scapula\",\"sets\":4,\"reps\":\"12 reps\",\"hold_sec\":\"3s\",\"weight_kg\":\"Cable\",\"frequency\":\"1x/day\",\"cues\":\"Control eccentric lowering over 3s.\",\"notes\":\"Subacromial Decompression & Rotator Cuff Protocol (Week 3)\"},{\"id\":\"ex_b9bgfr9\",\"name\":\"Kettlebell Arm-Bar (Thoracic Mobility & Cuff)\",\"category\":\"Shoulder & Scapula\",\"sets\":4,\"reps\":\"30s hold\",\"hold_sec\":\"30s\",\"weight_kg\":\"4-6 kg KB\",\"frequency\":\"1x/day\",\"cues\":\"Pack shoulder blade down and back.\",\"notes\":\"Subacromial Decompression & Rotator Cuff Protocol (Week 3)\"}],\"Thu\":[],\"Fri\":[{\"id\":\"ex_y49jda9\",\"name\":\"Serratus Wall Slide with Foam Roller\",\"category\":\"Shoulder & Scapula\",\"sets\":4,\"reps\":\"12 reps\",\"hold_sec\":\"2s\",\"weight_kg\":\"Mini-Band\",\"frequency\":\"1x/day\",\"cues\":\"Active upward rotation.\",\"notes\":\"Subacromial Decompression & Rotator Cuff Protocol (Week 3)\"},{\"id\":\"ex_5d7qbx5\",\"name\":\"Push-Up to Plus (Serratus Anterior)\",\"category\":\"Shoulder & Scapula\",\"sets\":4,\"reps\":\"12 reps\",\"hold_sec\":\"2s\",\"weight_kg\":\"Bodyweight\",\"frequency\":\"1x/day\",\"cues\":\"High elbow position.\",\"notes\":\"Subacromial Decompression & Rotator Cuff Protocol (Week 3)\"},{\"id\":\"ex_az9tpad\",\"name\":\"Prone T-Raise (Middle Trapezius & Rhomboids)\",\"category\":\"Shoulder & Scapula\",\"sets\":4,\"reps\":\"12 reps\",\"hold_sec\":\"2s\",\"weight_kg\":\"1kg plates\",\"frequency\":\"1x/day\",\"cues\":\"Keep neck relaxed.\",\"notes\":\"Subacromial Decompression & Rotator Cuff Protocol (Week 3)\"}],\"Sat\":[],\"Sun\":[]}},{\"week_num\":4,\"title\":\"Week 4\",\"focus\":\"Progressive Resistance & Functional Capacity\",\"days\":{\"Mon\":[{\"id\":\"ex_9pzd7pz\",\"name\":\"Side-Lying Shoulder External Rotation\",\"category\":\"Shoulder & Rotator Cuff\",\"sets\":4,\"reps\":\"15 reps\",\"hold_sec\":\"2s\",\"weight_kg\":\"1-2 kg DB\",\"frequency\":\"1x/day\",\"cues\":\"Towel under elbow; clean rotation without compensation.\",\"notes\":\"Subacromial Decompression & Rotator Cuff Protocol (Week 4)\"},{\"id\":\"ex_0bnifvn\",\"name\":\"Serratus Wall Slide with Foam Roller\",\"category\":\"Shoulder & Scapula\",\"sets\":4,\"reps\":\"10 reps\",\"hold_sec\":\"2s\",\"weight_kg\":\"Mini-Band\",\"frequency\":\"1x/day\",\"cues\":\"Protract scapulae into upward rotation.\",\"notes\":\"Subacromial Decompression & Rotator Cuff Protocol (Week 4)\"},{\"id\":\"ex_bxw67b5\",\"name\":\"Prone Y-Raise (Lower Trapezius)\",\"category\":\"Shoulder & Scapula\",\"sets\":4,\"reps\":\"10 reps\",\"hold_sec\":\"2s\",\"weight_kg\":\"Bodyweight\",\"frequency\":\"1x/day\",\"cues\":\"Initiate from lower trap; thumbs to ceiling.\",\"notes\":\"Subacromial Decompression & Rotator Cuff Protocol (Week 4)\"}],\"Tue\":[],\"Wed\":[{\"id\":\"ex_84rl156\",\"name\":\"Face Pull with External Rotation\",\"category\":\"Shoulder & Scapula\",\"sets\":4,\"reps\":\"12 reps\",\"hold_sec\":\"2s\",\"weight_kg\":\"Resistance Band\",\"frequency\":\"1x/day\",\"cues\":\"Pull to eye level, rotate forearms back.\",\"notes\":\"Subacromial Decompression & Rotator Cuff Protocol (Week 4)\"},{\"id\":\"ex_cpojulk\",\"name\":\"Cable External Rotation (at 0° Abduction)\",\"category\":\"Shoulder & Scapula\",\"sets\":4,\"reps\":\"12 reps\",\"hold_sec\":\"3s\",\"weight_kg\":\"Cable\",\"frequency\":\"1x/day\",\"cues\":\"Control eccentric lowering over 3s.\",\"notes\":\"Subacromial Decompression & Rotator Cuff Protocol (Week 4)\"},{\"id\":\"ex_d0jb4eg\",\"name\":\"Kettlebell Arm-Bar (Thoracic Mobility & Cuff)\",\"category\":\"Shoulder & Scapula\",\"sets\":4,\"reps\":\"30s hold\",\"hold_sec\":\"30s\",\"weight_kg\":\"4-6 kg KB\",\"frequency\":\"1x/day\",\"cues\":\"Pack shoulder blade down and back.\",\"notes\":\"Subacromial Decompression & Rotator Cuff Protocol (Week 4)\"}],\"Thu\":[],\"Fri\":[{\"id\":\"ex_wnun5tb\",\"name\":\"Serratus Wall Slide with Foam Roller\",\"category\":\"Shoulder & Scapula\",\"sets\":4,\"reps\":\"12 reps\",\"hold_sec\":\"2s\",\"weight_kg\":\"Mini-Band\",\"frequency\":\"1x/day\",\"cues\":\"Active upward rotation.\",\"notes\":\"Subacromial Decompression & Rotator Cuff Protocol (Week 4)\"},{\"id\":\"ex_15rut4q\",\"name\":\"Push-Up to Plus (Serratus Anterior)\",\"category\":\"Shoulder & Scapula\",\"sets\":4,\"reps\":\"12 reps\",\"hold_sec\":\"2s\",\"weight_kg\":\"Bodyweight\",\"frequency\":\"1x/day\",\"cues\":\"High elbow position.\",\"notes\":\"Subacromial Decompression & Rotator Cuff Protocol (Week 4)\"},{\"id\":\"ex_qwcq56x\",\"name\":\"Prone T-Raise (Middle Trapezius & Rhomboids)\",\"category\":\"Shoulder & Scapula\",\"sets\":4,\"reps\":\"12 reps\",\"hold_sec\":\"2s\",\"weight_kg\":\"1kg plates\",\"frequency\":\"1x/day\",\"cues\":\"Keep neck relaxed.\",\"notes\":\"Subacromial Decompression & Rotator Cuff Protocol (Week 4)\"}],\"Sat\":[],\"Sun\":[]}},{\"week_num\":5,\"title\":\"Week 5\",\"focus\":\"Progressive Resistance & Functional Capacity\",\"days\":{\"Mon\":[{\"id\":\"ex_2tn4i17\",\"name\":\"Side-Lying Shoulder External Rotation\",\"category\":\"Shoulder & Rotator Cuff\",\"sets\":4,\"reps\":\"15 reps\",\"hold_sec\":\"2s\",\"weight_kg\":\"1-2 kg DB\",\"frequency\":\"1x/day\",\"cues\":\"Towel under elbow; clean rotation without compensation.\",\"notes\":\"Subacromial Decompression & Rotator Cuff Protocol (Week 5)\"},{\"id\":\"ex_lwd20dd\",\"name\":\"Serratus Wall Slide with Foam Roller\",\"category\":\"Shoulder & Scapula\",\"sets\":4,\"reps\":\"10 reps\",\"hold_sec\":\"2s\",\"weight_kg\":\"Mini-Band\",\"frequency\":\"1x/day\",\"cues\":\"Protract scapulae into upward rotation.\",\"notes\":\"Subacromial Decompression & Rotator Cuff Protocol (Week 5)\"},{\"id\":\"ex_xsjl0zq\",\"name\":\"Prone Y-Raise (Lower Trapezius)\",\"category\":\"Shoulder & Scapula\",\"sets\":4,\"reps\":\"10 reps\",\"hold_sec\":\"2s\",\"weight_kg\":\"Bodyweight\",\"frequency\":\"1x/day\",\"cues\":\"Initiate from lower trap; thumbs to ceiling.\",\"notes\":\"Subacromial Decompression & Rotator Cuff Protocol (Week 5)\"}],\"Tue\":[],\"Wed\":[{\"id\":\"ex_ivqsf2a\",\"name\":\"Face Pull with External Rotation\",\"category\":\"Shoulder & Scapula\",\"sets\":4,\"reps\":\"12 reps\",\"hold_sec\":\"2s\",\"weight_kg\":\"Resistance Band\",\"frequency\":\"1x/day\",\"cues\":\"Pull to eye level, rotate forearms back.\",\"notes\":\"Subacromial Decompression & Rotator Cuff Protocol (Week 5)\"},{\"id\":\"ex_gl8sm17\",\"name\":\"Cable External Rotation (at 0° Abduction)\",\"category\":\"Shoulder & Scapula\",\"sets\":4,\"reps\":\"12 reps\",\"hold_sec\":\"3s\",\"weight_kg\":\"Cable\",\"frequency\":\"1x/day\",\"cues\":\"Control eccentric lowering over 3s.\",\"notes\":\"Subacromial Decompression & Rotator Cuff Protocol (Week 5)\"},{\"id\":\"ex_1pwhomv\",\"name\":\"Kettlebell Arm-Bar (Thoracic Mobility & Cuff)\",\"category\":\"Shoulder & Scapula\",\"sets\":4,\"reps\":\"30s hold\",\"hold_sec\":\"30s\",\"weight_kg\":\"4-6 kg KB\",\"frequency\":\"1x/day\",\"cues\":\"Pack shoulder blade down and back.\",\"notes\":\"Subacromial Decompression & Rotator Cuff Protocol (Week 5)\"}],\"Thu\":[],\"Fri\":[{\"id\":\"ex_kb2let4\",\"name\":\"Serratus Wall Slide with Foam Roller\",\"category\":\"Shoulder & Scapula\",\"sets\":4,\"reps\":\"12 reps\",\"hold_sec\":\"2s\",\"weight_kg\":\"Mini-Band\",\"frequency\":\"1x/day\",\"cues\":\"Active upward rotation.\",\"notes\":\"Subacromial Decompression & Rotator Cuff Protocol (Week 5)\"},{\"id\":\"ex_q370vlj\",\"name\":\"Push-Up to Plus (Serratus Anterior)\",\"category\":\"Shoulder & Scapula\",\"sets\":4,\"reps\":\"12 reps\",\"hold_sec\":\"2s\",\"weight_kg\":\"Bodyweight\",\"frequency\":\"1x/day\",\"cues\":\"High elbow position.\",\"notes\":\"Subacromial Decompression & Rotator Cuff Protocol (Week 5)\"},{\"id\":\"ex_tcerkuz\",\"name\":\"Prone T-Raise (Middle Trapezius & Rhomboids)\",\"category\":\"Shoulder & Scapula\",\"sets\":4,\"reps\":\"12 reps\",\"hold_sec\":\"2s\",\"weight_kg\":\"1kg plates\",\"frequency\":\"1x/day\",\"cues\":\"Keep neck relaxed.\",\"notes\":\"Subacromial Decompression & Rotator Cuff Protocol (Week 5)\"}],\"Sat\":[],\"Sun\":[]}},{\"week_num\":6,\"title\":\"Week 6\",\"focus\":\"Progressive Resistance & Functional Capacity\",\"days\":{\"Mon\":[{\"id\":\"ex_mjf314w\",\"name\":\"Side-Lying Shoulder External Rotation\",\"category\":\"Shoulder & Rotator Cuff\",\"sets\":4,\"reps\":\"15 reps\",\"hold_sec\":\"2s\",\"weight_kg\":\"1-2 kg DB\",\"frequency\":\"1x/day\",\"cues\":\"Towel under elbow; clean rotation without compensation.\",\"notes\":\"Subacromial Decompression & Rotator Cuff Protocol (Week 6)\"},{\"id\":\"ex_ur5ahbp\",\"name\":\"Serratus Wall Slide with Foam Roller\",\"category\":\"Shoulder & Scapula\",\"sets\":4,\"reps\":\"10 reps\",\"hold_sec\":\"2s\",\"weight_kg\":\"Mini-Band\",\"frequency\":\"1x/day\",\"cues\":\"Protract scapulae into upward rotation.\",\"notes\":\"Subacromial Decompression & Rotator Cuff Protocol (Week 6)\"},{\"id\":\"ex_m5kp7vp\",\"name\":\"Prone Y-Raise (Lower Trapezius)\",\"category\":\"Shoulder & Scapula\",\"sets\":4,\"reps\":\"10 reps\",\"hold_sec\":\"2s\",\"weight_kg\":\"Bodyweight\",\"frequency\":\"1x/day\",\"cues\":\"Initiate from lower trap; thumbs to ceiling.\",\"notes\":\"Subacromial Decompression & Rotator Cuff Protocol (Week 6)\"}],\"Tue\":[],\"Wed\":[{\"id\":\"ex_dlxmky1\",\"name\":\"Face Pull with External Rotation\",\"category\":\"Shoulder & Scapula\",\"sets\":4,\"reps\":\"12 reps\",\"hold_sec\":\"2s\",\"weight_kg\":\"Resistance Band\",\"frequency\":\"1x/day\",\"cues\":\"Pull to eye level, rotate forearms back.\",\"notes\":\"Subacromial Decompression & Rotator Cuff Protocol (Week 6)\"},{\"id\":\"ex_0x0wgxl\",\"name\":\"Cable External Rotation (at 0° Abduction)\",\"category\":\"Shoulder & Scapula\",\"sets\":4,\"reps\":\"12 reps\",\"hold_sec\":\"3s\",\"weight_kg\":\"Cable\",\"frequency\":\"1x/day\",\"cues\":\"Control eccentric lowering over 3s.\",\"notes\":\"Subacromial Decompression & Rotator Cuff Protocol (Week 6)\"},{\"id\":\"ex_tt00ks0\",\"name\":\"Kettlebell Arm-Bar (Thoracic Mobility & Cuff)\",\"category\":\"Shoulder & Scapula\",\"sets\":4,\"reps\":\"30s hold\",\"hold_sec\":\"30s\",\"weight_kg\":\"4-6 kg KB\",\"frequency\":\"1x/day\",\"cues\":\"Pack shoulder blade down and back.\",\"notes\":\"Subacromial Decompression & Rotator Cuff Protocol (Week 6)\"}],\"Thu\":[],\"Fri\":[{\"id\":\"ex_0ytogw1\",\"name\":\"Serratus Wall Slide with Foam Roller\",\"category\":\"Shoulder & Scapula\",\"sets\":4,\"reps\":\"12 reps\",\"hold_sec\":\"2s\",\"weight_kg\":\"Mini-Band\",\"frequency\":\"1x/day\",\"cues\":\"Active upward rotation.\",\"notes\":\"Subacromial Decompression & Rotator Cuff Protocol (Week 6)\"},{\"id\":\"ex_om259uy\",\"name\":\"Push-Up to Plus (Serratus Anterior)\",\"category\":\"Shoulder & Scapula\",\"sets\":4,\"reps\":\"12 reps\",\"hold_sec\":\"2s\",\"weight_kg\":\"Bodyweight\",\"frequency\":\"1x/day\",\"cues\":\"High elbow position.\",\"notes\":\"Subacromial Decompression & Rotator Cuff Protocol (Week 6)\"},{\"id\":\"ex_bikylm4\",\"name\":\"Prone T-Raise (Middle Trapezius & Rhomboids)\",\"category\":\"Shoulder & Scapula\",\"sets\":4,\"reps\":\"12 reps\",\"hold_sec\":\"2s\",\"weight_kg\":\"1kg plates\",\"frequency\":\"1x/day\",\"cues\":\"Keep neck relaxed.\",\"notes\":\"Subacromial Decompression & Rotator Cuff Protocol (Week 6)\"}],\"Sat\":[],\"Sun\":[]}}]}"
  },
  {
    "name": "Lumbar Spine Stabilization & McGill Big 3",
    "category": "Spine & Core",
    "duration_weeks": 4,
    "protocol_json": "{\"title\":\"Lumbar Spine Stabilization & McGill Big 3 (Weeks 1-4)\",\"description\":\"Low-back sparing core endurance protocol designed to spare spinal discs while maximizing torso stiffness.\",\"duration_weeks\":4,\"weeks\":[{\"week_num\":1,\"title\":\"Week 1\",\"focus\":\"Early Activation & Tissue Tolerance\",\"days\":{\"Mon\":[{\"id\":\"ex_br7orbe\",\"name\":\"McGill Curl-Up\",\"category\":\"Spine & Core\",\"sets\":3,\"reps\":\"10s hold\",\"hold_sec\":\"10s\",\"weight_kg\":\"Bodyweight\",\"frequency\":\"1x/day\",\"cues\":\"Hands under lumbar arch; lift chest 1 inch.\",\"notes\":\"McGill Spinal Stability Protocol (Week 1)\"},{\"id\":\"ex_6fhqezy\",\"name\":\"Bird-Dog with Isometric Hold\",\"category\":\"Spine & Core\",\"sets\":3,\"reps\":\"8 reps\",\"hold_sec\":\"5s\",\"weight_kg\":\"Bodyweight\",\"frequency\":\"1x/day\",\"cues\":\"Opposite arm/leg reach; zero lumbar motion.\",\"notes\":\"McGill Spinal Stability Protocol (Week 1)\"},{\"id\":\"ex_goxl7h0\",\"name\":\"Side Plank (Knee / Full Lever)\",\"category\":\"Spine & Core\",\"sets\":3,\"reps\":\"30s hold\",\"hold_sec\":\"30s\",\"weight_kg\":\"Bodyweight\",\"frequency\":\"1x/day\",\"cues\":\"Elbow under shoulder; straight torso.\",\"notes\":\"McGill Spinal Stability Protocol (Week 1)\"}],\"Tue\":[],\"Wed\":[{\"id\":\"ex_e65acgf\",\"name\":\"Pallof Press (Anti-Rotation)\",\"category\":\"Spine & Core\",\"sets\":3,\"reps\":\"10 reps\",\"hold_sec\":\"3s\",\"weight_kg\":\"Cable / Band\",\"frequency\":\"1x/day\",\"cues\":\"Resist rotation; hold arms locked out 3s.\",\"notes\":\"McGill Spinal Stability Protocol (Week 1)\"},{\"id\":\"ex_4czvwat\",\"name\":\"Bird-Dog with Isometric Hold\",\"category\":\"Spine & Core\",\"sets\":3,\"reps\":\"10 reps\",\"hold_sec\":\"5s\",\"weight_kg\":\"Bodyweight\",\"frequency\":\"1x/day\",\"cues\":\"Neutral spine endurance.\",\"notes\":\"McGill Spinal Stability Protocol (Week 1)\"},{\"id\":\"ex_xvgxn5m\",\"name\":\"Dead Bug (Contralateral Reach)\",\"category\":\"Spine & Core\",\"sets\":3,\"reps\":\"10 reps\",\"hold_sec\":\"2s\",\"weight_kg\":\"Bodyweight\",\"frequency\":\"1x/day\",\"cues\":\"Ribs depressed, lumbar flat to floor.\",\"notes\":\"McGill Spinal Stability Protocol (Week 1)\"}],\"Thu\":[],\"Fri\":[{\"id\":\"ex_lq9sylz\",\"name\":\"McGill Curl-Up\",\"category\":\"Spine & Core\",\"sets\":3,\"reps\":\"10s hold\",\"hold_sec\":\"10s\",\"weight_kg\":\"Bodyweight\",\"frequency\":\"1x/day\",\"cues\":\"5-4-3 rep descending pyramid.\",\"notes\":\"McGill Spinal Stability Protocol (Week 1)\"},{\"id\":\"ex_kxq2jee\",\"name\":\"Side Plank (Knee / Full Lever)\",\"category\":\"Spine & Core\",\"sets\":3,\"reps\":\"40s hold\",\"hold_sec\":\"40s\",\"weight_kg\":\"Bodyweight\",\"frequency\":\"1x/day\",\"cues\":\"Build lateral core endurance.\",\"notes\":\"McGill Spinal Stability Protocol (Week 1)\"},{\"id\":\"ex_b42gfx2\",\"name\":\"Pallof Press (Anti-Rotation)\",\"category\":\"Spine & Core\",\"sets\":3,\"reps\":\"12 reps\",\"hold_sec\":\"3s\",\"weight_kg\":\"Band\",\"frequency\":\"1x/day\",\"cues\":\"Square hips and athletic stance.\",\"notes\":\"McGill Spinal Stability Protocol (Week 1)\"}],\"Sat\":[],\"Sun\":[]}},{\"week_num\":2,\"title\":\"Week 2\",\"focus\":\"Early Activation & Tissue Tolerance\",\"days\":{\"Mon\":[{\"id\":\"ex_cq80hxj\",\"name\":\"McGill Curl-Up\",\"category\":\"Spine & Core\",\"sets\":3,\"reps\":\"10s hold\",\"hold_sec\":\"10s\",\"weight_kg\":\"Bodyweight\",\"frequency\":\"1x/day\",\"cues\":\"Hands under lumbar arch; lift chest 1 inch.\",\"notes\":\"McGill Spinal Stability Protocol (Week 2)\"},{\"id\":\"ex_1b3591v\",\"name\":\"Bird-Dog with Isometric Hold\",\"category\":\"Spine & Core\",\"sets\":3,\"reps\":\"8 reps\",\"hold_sec\":\"5s\",\"weight_kg\":\"Bodyweight\",\"frequency\":\"1x/day\",\"cues\":\"Opposite arm/leg reach; zero lumbar motion.\",\"notes\":\"McGill Spinal Stability Protocol (Week 2)\"},{\"id\":\"ex_938e52x\",\"name\":\"Side Plank (Knee / Full Lever)\",\"category\":\"Spine & Core\",\"sets\":3,\"reps\":\"30s hold\",\"hold_sec\":\"30s\",\"weight_kg\":\"Bodyweight\",\"frequency\":\"1x/day\",\"cues\":\"Elbow under shoulder; straight torso.\",\"notes\":\"McGill Spinal Stability Protocol (Week 2)\"}],\"Tue\":[],\"Wed\":[{\"id\":\"ex_2zgykdo\",\"name\":\"Pallof Press (Anti-Rotation)\",\"category\":\"Spine & Core\",\"sets\":3,\"reps\":\"10 reps\",\"hold_sec\":\"3s\",\"weight_kg\":\"Cable / Band\",\"frequency\":\"1x/day\",\"cues\":\"Resist rotation; hold arms locked out 3s.\",\"notes\":\"McGill Spinal Stability Protocol (Week 2)\"},{\"id\":\"ex_kl6jyo5\",\"name\":\"Bird-Dog with Isometric Hold\",\"category\":\"Spine & Core\",\"sets\":3,\"reps\":\"10 reps\",\"hold_sec\":\"5s\",\"weight_kg\":\"Bodyweight\",\"frequency\":\"1x/day\",\"cues\":\"Neutral spine endurance.\",\"notes\":\"McGill Spinal Stability Protocol (Week 2)\"},{\"id\":\"ex_80zo6ak\",\"name\":\"Dead Bug (Contralateral Reach)\",\"category\":\"Spine & Core\",\"sets\":3,\"reps\":\"10 reps\",\"hold_sec\":\"2s\",\"weight_kg\":\"Bodyweight\",\"frequency\":\"1x/day\",\"cues\":\"Ribs depressed, lumbar flat to floor.\",\"notes\":\"McGill Spinal Stability Protocol (Week 2)\"}],\"Thu\":[],\"Fri\":[{\"id\":\"ex_wqk1drs\",\"name\":\"McGill Curl-Up\",\"category\":\"Spine & Core\",\"sets\":3,\"reps\":\"10s hold\",\"hold_sec\":\"10s\",\"weight_kg\":\"Bodyweight\",\"frequency\":\"1x/day\",\"cues\":\"5-4-3 rep descending pyramid.\",\"notes\":\"McGill Spinal Stability Protocol (Week 2)\"},{\"id\":\"ex_uswcptg\",\"name\":\"Side Plank (Knee / Full Lever)\",\"category\":\"Spine & Core\",\"sets\":3,\"reps\":\"40s hold\",\"hold_sec\":\"40s\",\"weight_kg\":\"Bodyweight\",\"frequency\":\"1x/day\",\"cues\":\"Build lateral core endurance.\",\"notes\":\"McGill Spinal Stability Protocol (Week 2)\"},{\"id\":\"ex_ynxw3ss\",\"name\":\"Pallof Press (Anti-Rotation)\",\"category\":\"Spine & Core\",\"sets\":3,\"reps\":\"12 reps\",\"hold_sec\":\"3s\",\"weight_kg\":\"Band\",\"frequency\":\"1x/day\",\"cues\":\"Square hips and athletic stance.\",\"notes\":\"McGill Spinal Stability Protocol (Week 2)\"}],\"Sat\":[],\"Sun\":[]}},{\"week_num\":3,\"title\":\"Week 3\",\"focus\":\"Progressive Resistance & Functional Capacity\",\"days\":{\"Mon\":[{\"id\":\"ex_za4gqt2\",\"name\":\"McGill Curl-Up\",\"category\":\"Spine & Core\",\"sets\":4,\"reps\":\"10s hold\",\"hold_sec\":\"10s\",\"weight_kg\":\"Bodyweight\",\"frequency\":\"1x/day\",\"cues\":\"Hands under lumbar arch; lift chest 1 inch.\",\"notes\":\"McGill Spinal Stability Protocol (Week 3)\"},{\"id\":\"ex_h3bsxmx\",\"name\":\"Bird-Dog with Isometric Hold\",\"category\":\"Spine & Core\",\"sets\":4,\"reps\":\"8 reps\",\"hold_sec\":\"5s\",\"weight_kg\":\"Bodyweight\",\"frequency\":\"1x/day\",\"cues\":\"Opposite arm/leg reach; zero lumbar motion.\",\"notes\":\"McGill Spinal Stability Protocol (Week 3)\"},{\"id\":\"ex_gazkekt\",\"name\":\"Side Plank (Knee / Full Lever)\",\"category\":\"Spine & Core\",\"sets\":4,\"reps\":\"30s hold\",\"hold_sec\":\"30s\",\"weight_kg\":\"Bodyweight\",\"frequency\":\"1x/day\",\"cues\":\"Elbow under shoulder; straight torso.\",\"notes\":\"McGill Spinal Stability Protocol (Week 3)\"}],\"Tue\":[],\"Wed\":[{\"id\":\"ex_bqq9sb6\",\"name\":\"Pallof Press (Anti-Rotation)\",\"category\":\"Spine & Core\",\"sets\":4,\"reps\":\"10 reps\",\"hold_sec\":\"3s\",\"weight_kg\":\"Cable / Band\",\"frequency\":\"1x/day\",\"cues\":\"Resist rotation; hold arms locked out 3s.\",\"notes\":\"McGill Spinal Stability Protocol (Week 3)\"},{\"id\":\"ex_clkdvw5\",\"name\":\"Bird-Dog with Isometric Hold\",\"category\":\"Spine & Core\",\"sets\":4,\"reps\":\"10 reps\",\"hold_sec\":\"5s\",\"weight_kg\":\"Bodyweight\",\"frequency\":\"1x/day\",\"cues\":\"Neutral spine endurance.\",\"notes\":\"McGill Spinal Stability Protocol (Week 3)\"},{\"id\":\"ex_uz9k6kx\",\"name\":\"Dead Bug (Contralateral Reach)\",\"category\":\"Spine & Core\",\"sets\":4,\"reps\":\"10 reps\",\"hold_sec\":\"2s\",\"weight_kg\":\"Bodyweight\",\"frequency\":\"1x/day\",\"cues\":\"Ribs depressed, lumbar flat to floor.\",\"notes\":\"McGill Spinal Stability Protocol (Week 3)\"}],\"Thu\":[],\"Fri\":[{\"id\":\"ex_hsljrzn\",\"name\":\"McGill Curl-Up\",\"category\":\"Spine & Core\",\"sets\":4,\"reps\":\"10s hold\",\"hold_sec\":\"10s\",\"weight_kg\":\"Bodyweight\",\"frequency\":\"1x/day\",\"cues\":\"5-4-3 rep descending pyramid.\",\"notes\":\"McGill Spinal Stability Protocol (Week 3)\"},{\"id\":\"ex_1wlaecy\",\"name\":\"Side Plank (Knee / Full Lever)\",\"category\":\"Spine & Core\",\"sets\":4,\"reps\":\"40s hold\",\"hold_sec\":\"40s\",\"weight_kg\":\"Bodyweight\",\"frequency\":\"1x/day\",\"cues\":\"Build lateral core endurance.\",\"notes\":\"McGill Spinal Stability Protocol (Week 3)\"},{\"id\":\"ex_jwjz7h1\",\"name\":\"Pallof Press (Anti-Rotation)\",\"category\":\"Spine & Core\",\"sets\":4,\"reps\":\"12 reps\",\"hold_sec\":\"3s\",\"weight_kg\":\"Band\",\"frequency\":\"1x/day\",\"cues\":\"Square hips and athletic stance.\",\"notes\":\"McGill Spinal Stability Protocol (Week 3)\"}],\"Sat\":[],\"Sun\":[]}},{\"week_num\":4,\"title\":\"Week 4\",\"focus\":\"Progressive Resistance & Functional Capacity\",\"days\":{\"Mon\":[{\"id\":\"ex_7ahef46\",\"name\":\"McGill Curl-Up\",\"category\":\"Spine & Core\",\"sets\":4,\"reps\":\"10s hold\",\"hold_sec\":\"10s\",\"weight_kg\":\"Bodyweight\",\"frequency\":\"1x/day\",\"cues\":\"Hands under lumbar arch; lift chest 1 inch.\",\"notes\":\"McGill Spinal Stability Protocol (Week 4)\"},{\"id\":\"ex_q4kxhao\",\"name\":\"Bird-Dog with Isometric Hold\",\"category\":\"Spine & Core\",\"sets\":4,\"reps\":\"8 reps\",\"hold_sec\":\"5s\",\"weight_kg\":\"Bodyweight\",\"frequency\":\"1x/day\",\"cues\":\"Opposite arm/leg reach; zero lumbar motion.\",\"notes\":\"McGill Spinal Stability Protocol (Week 4)\"},{\"id\":\"ex_v0g80jr\",\"name\":\"Side Plank (Knee / Full Lever)\",\"category\":\"Spine & Core\",\"sets\":4,\"reps\":\"30s hold\",\"hold_sec\":\"30s\",\"weight_kg\":\"Bodyweight\",\"frequency\":\"1x/day\",\"cues\":\"Elbow under shoulder; straight torso.\",\"notes\":\"McGill Spinal Stability Protocol (Week 4)\"}],\"Tue\":[],\"Wed\":[{\"id\":\"ex_987w1jp\",\"name\":\"Pallof Press (Anti-Rotation)\",\"category\":\"Spine & Core\",\"sets\":4,\"reps\":\"10 reps\",\"hold_sec\":\"3s\",\"weight_kg\":\"Cable / Band\",\"frequency\":\"1x/day\",\"cues\":\"Resist rotation; hold arms locked out 3s.\",\"notes\":\"McGill Spinal Stability Protocol (Week 4)\"},{\"id\":\"ex_0h01rwh\",\"name\":\"Bird-Dog with Isometric Hold\",\"category\":\"Spine & Core\",\"sets\":4,\"reps\":\"10 reps\",\"hold_sec\":\"5s\",\"weight_kg\":\"Bodyweight\",\"frequency\":\"1x/day\",\"cues\":\"Neutral spine endurance.\",\"notes\":\"McGill Spinal Stability Protocol (Week 4)\"},{\"id\":\"ex_pzp2q9j\",\"name\":\"Dead Bug (Contralateral Reach)\",\"category\":\"Spine & Core\",\"sets\":4,\"reps\":\"10 reps\",\"hold_sec\":\"2s\",\"weight_kg\":\"Bodyweight\",\"frequency\":\"1x/day\",\"cues\":\"Ribs depressed, lumbar flat to floor.\",\"notes\":\"McGill Spinal Stability Protocol (Week 4)\"}],\"Thu\":[],\"Fri\":[{\"id\":\"ex_19i697m\",\"name\":\"McGill Curl-Up\",\"category\":\"Spine & Core\",\"sets\":4,\"reps\":\"10s hold\",\"hold_sec\":\"10s\",\"weight_kg\":\"Bodyweight\",\"frequency\":\"1x/day\",\"cues\":\"5-4-3 rep descending pyramid.\",\"notes\":\"McGill Spinal Stability Protocol (Week 4)\"},{\"id\":\"ex_zssnbwu\",\"name\":\"Side Plank (Knee / Full Lever)\",\"category\":\"Spine & Core\",\"sets\":4,\"reps\":\"40s hold\",\"hold_sec\":\"40s\",\"weight_kg\":\"Bodyweight\",\"frequency\":\"1x/day\",\"cues\":\"Build lateral core endurance.\",\"notes\":\"McGill Spinal Stability Protocol (Week 4)\"},{\"id\":\"ex_vsouubx\",\"name\":\"Pallof Press (Anti-Rotation)\",\"category\":\"Spine & Core\",\"sets\":4,\"reps\":\"12 reps\",\"hold_sec\":\"3s\",\"weight_kg\":\"Band\",\"frequency\":\"1x/day\",\"cues\":\"Square hips and athletic stance.\",\"notes\":\"McGill Spinal Stability Protocol (Week 4)\"}],\"Sat\":[],\"Sun\":[]}}]}"
  },
  {
    "name": "Patellofemoral Pain Syndrome (PFPS) Loading",
    "category": "Knee / Anterior Pain",
    "duration_weeks": 4,
    "protocol_json": "{\"title\":\"Patellofemoral Pain Syndrome (PFPS) Quad & Hip Protocol (Weeks 1-4)\",\"description\":\"Proximal hip abductor strengthening paired with targeted quadriceps isometrics to optimize patellar tracking and load tolerance.\",\"duration_weeks\":4,\"weeks\":[{\"week_num\":1,\"title\":\"Week 1\",\"focus\":\"Early Activation & Tissue Tolerance\",\"days\":{\"Mon\":[{\"id\":\"ex_shfmh19\",\"name\":\"Spanish Squat (Isometric)\",\"category\":\"Knee & Quad\",\"sets\":4,\"reps\":\"45s hold\",\"hold_sec\":\"45s\",\"weight_kg\":\"Heavy Band\",\"frequency\":\"1x/day\",\"cues\":\"Pain-free quadriceps loading.\",\"notes\":\"PFPS Quad & Hip Rehabilitation Protocol (Week 1)\"},{\"id\":\"ex_br7db16\",\"name\":\"Wall Sit with Adductor Squeeze\",\"category\":\"Knee & Quad\",\"sets\":3,\"reps\":\"40s hold\",\"hold_sec\":\"40s\",\"weight_kg\":\"Foam Block\",\"frequency\":\"1x/day\",\"cues\":\"Engage adductor-vastus medialis synergy.\",\"notes\":\"PFPS Quad & Hip Rehabilitation Protocol (Week 1)\"},{\"id\":\"ex_t9rmdmt\",\"name\":\"Single-Leg Glute Bridge with Hold\",\"category\":\"Hamstring & Posterior Chain\",\"sets\":3,\"reps\":\"12 reps\",\"hold_sec\":\"3s\",\"weight_kg\":\"Bodyweight\",\"frequency\":\"1x/day\",\"cues\":\"Hip extension strength.\",\"notes\":\"PFPS Quad & Hip Rehabilitation Protocol (Week 1)\"}],\"Tue\":[],\"Wed\":[],\"Thu\":[{\"id\":\"ex_ap8k2pd\",\"name\":\"Poliquin Step-Up\",\"category\":\"Knee & Quad\",\"sets\":3,\"reps\":\"12 reps\",\"hold_sec\":\"—\",\"weight_kg\":\"Slant Block\",\"frequency\":\"1x/day\",\"cues\":\"Slow controlled knee over toes.\",\"notes\":\"PFPS Quad & Hip Rehabilitation Protocol (Week 1)\"},{\"id\":\"ex_075kzca\",\"name\":\"Side Plank (Knee / Full Lever)\",\"category\":\"Spine & Core\",\"sets\":3,\"reps\":\"30s hold\",\"hold_sec\":\"30s\",\"weight_kg\":\"Bodyweight\",\"frequency\":\"1x/day\",\"cues\":\"Abductor & oblique endurance.\",\"notes\":\"PFPS Quad & Hip Rehabilitation Protocol (Week 1)\"},{\"id\":\"ex_wjvg3dd\",\"name\":\"Bulgarian Split Squat\",\"category\":\"Knee & Quad\",\"sets\":3,\"reps\":\"8 reps\",\"hold_sec\":\"—\",\"weight_kg\":\"Bodyweight\",\"frequency\":\"1x/day\",\"cues\":\"Keep front knee tracking over 2nd toe.\",\"notes\":\"PFPS Quad & Hip Rehabilitation Protocol (Week 1)\"}],\"Fri\":[],\"Sat\":[{\"id\":\"ex_r72ar84\",\"name\":\"Spanish Squat (Isometric)\",\"category\":\"Knee & Quad\",\"sets\":4,\"reps\":\"45s hold\",\"hold_sec\":\"45s\",\"weight_kg\":\"Band\",\"frequency\":\"1x/day\",\"cues\":\"Deep isometric quad burn.\",\"notes\":\"PFPS Quad & Hip Rehabilitation Protocol (Week 1)\"},{\"id\":\"ex_wn3b859\",\"name\":\"Leg Extension (Isometric 60°)\",\"category\":\"Knee & Quad\",\"sets\":3,\"reps\":\"30s hold\",\"hold_sec\":\"30s\",\"weight_kg\":\"5kg DB\",\"frequency\":\"1x/day\",\"cues\":\"60° angle to minimize joint reaction force.\",\"notes\":\"PFPS Quad & Hip Rehabilitation Protocol (Week 1)\"},{\"id\":\"ex_qwct6v2\",\"name\":\"Poliquin Step-Up\",\"category\":\"Knee & Quad\",\"sets\":3,\"reps\":\"12 reps\",\"hold_sec\":\"—\",\"weight_kg\":\"Slant Block\",\"frequency\":\"1x/day\",\"cues\":\"Smooth eccentric control.\",\"notes\":\"PFPS Quad & Hip Rehabilitation Protocol (Week 1)\"}],\"Sun\":[]}},{\"week_num\":2,\"title\":\"Week 2\",\"focus\":\"Early Activation & Tissue Tolerance\",\"days\":{\"Mon\":[{\"id\":\"ex_xkidnqm\",\"name\":\"Spanish Squat (Isometric)\",\"category\":\"Knee & Quad\",\"sets\":4,\"reps\":\"45s hold\",\"hold_sec\":\"45s\",\"weight_kg\":\"Heavy Band\",\"frequency\":\"1x/day\",\"cues\":\"Pain-free quadriceps loading.\",\"notes\":\"PFPS Quad & Hip Rehabilitation Protocol (Week 2)\"},{\"id\":\"ex_xy2pgtv\",\"name\":\"Wall Sit with Adductor Squeeze\",\"category\":\"Knee & Quad\",\"sets\":3,\"reps\":\"40s hold\",\"hold_sec\":\"40s\",\"weight_kg\":\"Foam Block\",\"frequency\":\"1x/day\",\"cues\":\"Engage adductor-vastus medialis synergy.\",\"notes\":\"PFPS Quad & Hip Rehabilitation Protocol (Week 2)\"},{\"id\":\"ex_mwvbvtv\",\"name\":\"Single-Leg Glute Bridge with Hold\",\"category\":\"Hamstring & Posterior Chain\",\"sets\":3,\"reps\":\"12 reps\",\"hold_sec\":\"3s\",\"weight_kg\":\"Bodyweight\",\"frequency\":\"1x/day\",\"cues\":\"Hip extension strength.\",\"notes\":\"PFPS Quad & Hip Rehabilitation Protocol (Week 2)\"}],\"Tue\":[],\"Wed\":[],\"Thu\":[{\"id\":\"ex_kd6jel5\",\"name\":\"Poliquin Step-Up\",\"category\":\"Knee & Quad\",\"sets\":3,\"reps\":\"12 reps\",\"hold_sec\":\"—\",\"weight_kg\":\"Slant Block\",\"frequency\":\"1x/day\",\"cues\":\"Slow controlled knee over toes.\",\"notes\":\"PFPS Quad & Hip Rehabilitation Protocol (Week 2)\"},{\"id\":\"ex_7foqvfw\",\"name\":\"Side Plank (Knee / Full Lever)\",\"category\":\"Spine & Core\",\"sets\":3,\"reps\":\"30s hold\",\"hold_sec\":\"30s\",\"weight_kg\":\"Bodyweight\",\"frequency\":\"1x/day\",\"cues\":\"Abductor & oblique endurance.\",\"notes\":\"PFPS Quad & Hip Rehabilitation Protocol (Week 2)\"},{\"id\":\"ex_h5vcqe4\",\"name\":\"Bulgarian Split Squat\",\"category\":\"Knee & Quad\",\"sets\":3,\"reps\":\"8 reps\",\"hold_sec\":\"—\",\"weight_kg\":\"Bodyweight\",\"frequency\":\"1x/day\",\"cues\":\"Keep front knee tracking over 2nd toe.\",\"notes\":\"PFPS Quad & Hip Rehabilitation Protocol (Week 2)\"}],\"Fri\":[],\"Sat\":[{\"id\":\"ex_br7wusl\",\"name\":\"Spanish Squat (Isometric)\",\"category\":\"Knee & Quad\",\"sets\":4,\"reps\":\"45s hold\",\"hold_sec\":\"45s\",\"weight_kg\":\"Band\",\"frequency\":\"1x/day\",\"cues\":\"Deep isometric quad burn.\",\"notes\":\"PFPS Quad & Hip Rehabilitation Protocol (Week 2)\"},{\"id\":\"ex_6o8pdg8\",\"name\":\"Leg Extension (Isometric 60°)\",\"category\":\"Knee & Quad\",\"sets\":3,\"reps\":\"30s hold\",\"hold_sec\":\"30s\",\"weight_kg\":\"5kg DB\",\"frequency\":\"1x/day\",\"cues\":\"60° angle to minimize joint reaction force.\",\"notes\":\"PFPS Quad & Hip Rehabilitation Protocol (Week 2)\"},{\"id\":\"ex_an3pu3k\",\"name\":\"Poliquin Step-Up\",\"category\":\"Knee & Quad\",\"sets\":3,\"reps\":\"12 reps\",\"hold_sec\":\"—\",\"weight_kg\":\"Slant Block\",\"frequency\":\"1x/day\",\"cues\":\"Smooth eccentric control.\",\"notes\":\"PFPS Quad & Hip Rehabilitation Protocol (Week 2)\"}],\"Sun\":[]}},{\"week_num\":3,\"title\":\"Week 3\",\"focus\":\"Progressive Resistance & Functional Capacity\",\"days\":{\"Mon\":[{\"id\":\"ex_r7vfmyc\",\"name\":\"Spanish Squat (Isometric)\",\"category\":\"Knee & Quad\",\"sets\":5,\"reps\":\"45s hold\",\"hold_sec\":\"45s\",\"weight_kg\":\"Heavy Band\",\"frequency\":\"1x/day\",\"cues\":\"Pain-free quadriceps loading.\",\"notes\":\"PFPS Quad & Hip Rehabilitation Protocol (Week 3)\"},{\"id\":\"ex_i81nrqf\",\"name\":\"Wall Sit with Adductor Squeeze\",\"category\":\"Knee & Quad\",\"sets\":4,\"reps\":\"40s hold\",\"hold_sec\":\"40s\",\"weight_kg\":\"Foam Block\",\"frequency\":\"1x/day\",\"cues\":\"Engage adductor-vastus medialis synergy.\",\"notes\":\"PFPS Quad & Hip Rehabilitation Protocol (Week 3)\"},{\"id\":\"ex_dn7jn2l\",\"name\":\"Single-Leg Glute Bridge with Hold\",\"category\":\"Hamstring & Posterior Chain\",\"sets\":4,\"reps\":\"12 reps\",\"hold_sec\":\"3s\",\"weight_kg\":\"Bodyweight\",\"frequency\":\"1x/day\",\"cues\":\"Hip extension strength.\",\"notes\":\"PFPS Quad & Hip Rehabilitation Protocol (Week 3)\"}],\"Tue\":[],\"Wed\":[],\"Thu\":[{\"id\":\"ex_sfygs48\",\"name\":\"Poliquin Step-Up\",\"category\":\"Knee & Quad\",\"sets\":4,\"reps\":\"12 reps\",\"hold_sec\":\"—\",\"weight_kg\":\"Slant Block\",\"frequency\":\"1x/day\",\"cues\":\"Slow controlled knee over toes.\",\"notes\":\"PFPS Quad & Hip Rehabilitation Protocol (Week 3)\"},{\"id\":\"ex_82dmyw0\",\"name\":\"Side Plank (Knee / Full Lever)\",\"category\":\"Spine & Core\",\"sets\":4,\"reps\":\"30s hold\",\"hold_sec\":\"30s\",\"weight_kg\":\"Bodyweight\",\"frequency\":\"1x/day\",\"cues\":\"Abductor & oblique endurance.\",\"notes\":\"PFPS Quad & Hip Rehabilitation Protocol (Week 3)\"},{\"id\":\"ex_2wrmbll\",\"name\":\"Bulgarian Split Squat\",\"category\":\"Knee & Quad\",\"sets\":4,\"reps\":\"8 reps\",\"hold_sec\":\"—\",\"weight_kg\":\"Bodyweight\",\"frequency\":\"1x/day\",\"cues\":\"Keep front knee tracking over 2nd toe.\",\"notes\":\"PFPS Quad & Hip Rehabilitation Protocol (Week 3)\"}],\"Fri\":[],\"Sat\":[{\"id\":\"ex_869xyxq\",\"name\":\"Spanish Squat (Isometric)\",\"category\":\"Knee & Quad\",\"sets\":5,\"reps\":\"45s hold\",\"hold_sec\":\"45s\",\"weight_kg\":\"Band\",\"frequency\":\"1x/day\",\"cues\":\"Deep isometric quad burn.\",\"notes\":\"PFPS Quad & Hip Rehabilitation Protocol (Week 3)\"},{\"id\":\"ex_r3ug09r\",\"name\":\"Leg Extension (Isometric 60°)\",\"category\":\"Knee & Quad\",\"sets\":4,\"reps\":\"30s hold\",\"hold_sec\":\"30s\",\"weight_kg\":\"5kg DB\",\"frequency\":\"1x/day\",\"cues\":\"60° angle to minimize joint reaction force.\",\"notes\":\"PFPS Quad & Hip Rehabilitation Protocol (Week 3)\"},{\"id\":\"ex_7sns0cz\",\"name\":\"Poliquin Step-Up\",\"category\":\"Knee & Quad\",\"sets\":4,\"reps\":\"12 reps\",\"hold_sec\":\"—\",\"weight_kg\":\"Slant Block\",\"frequency\":\"1x/day\",\"cues\":\"Smooth eccentric control.\",\"notes\":\"PFPS Quad & Hip Rehabilitation Protocol (Week 3)\"}],\"Sun\":[]}},{\"week_num\":4,\"title\":\"Week 4\",\"focus\":\"Progressive Resistance & Functional Capacity\",\"days\":{\"Mon\":[{\"id\":\"ex_vzytvnq\",\"name\":\"Spanish Squat (Isometric)\",\"category\":\"Knee & Quad\",\"sets\":5,\"reps\":\"45s hold\",\"hold_sec\":\"45s\",\"weight_kg\":\"Heavy Band\",\"frequency\":\"1x/day\",\"cues\":\"Pain-free quadriceps loading.\",\"notes\":\"PFPS Quad & Hip Rehabilitation Protocol (Week 4)\"},{\"id\":\"ex_lvyl1o9\",\"name\":\"Wall Sit with Adductor Squeeze\",\"category\":\"Knee & Quad\",\"sets\":4,\"reps\":\"40s hold\",\"hold_sec\":\"40s\",\"weight_kg\":\"Foam Block\",\"frequency\":\"1x/day\",\"cues\":\"Engage adductor-vastus medialis synergy.\",\"notes\":\"PFPS Quad & Hip Rehabilitation Protocol (Week 4)\"},{\"id\":\"ex_jxagh4i\",\"name\":\"Single-Leg Glute Bridge with Hold\",\"category\":\"Hamstring & Posterior Chain\",\"sets\":4,\"reps\":\"12 reps\",\"hold_sec\":\"3s\",\"weight_kg\":\"Bodyweight\",\"frequency\":\"1x/day\",\"cues\":\"Hip extension strength.\",\"notes\":\"PFPS Quad & Hip Rehabilitation Protocol (Week 4)\"}],\"Tue\":[],\"Wed\":[],\"Thu\":[{\"id\":\"ex_qjem2s7\",\"name\":\"Poliquin Step-Up\",\"category\":\"Knee & Quad\",\"sets\":4,\"reps\":\"12 reps\",\"hold_sec\":\"—\",\"weight_kg\":\"Slant Block\",\"frequency\":\"1x/day\",\"cues\":\"Slow controlled knee over toes.\",\"notes\":\"PFPS Quad & Hip Rehabilitation Protocol (Week 4)\"},{\"id\":\"ex_n6yrt6g\",\"name\":\"Side Plank (Knee / Full Lever)\",\"category\":\"Spine & Core\",\"sets\":4,\"reps\":\"30s hold\",\"hold_sec\":\"30s\",\"weight_kg\":\"Bodyweight\",\"frequency\":\"1x/day\",\"cues\":\"Abductor & oblique endurance.\",\"notes\":\"PFPS Quad & Hip Rehabilitation Protocol (Week 4)\"},{\"id\":\"ex_6t3ip4c\",\"name\":\"Bulgarian Split Squat\",\"category\":\"Knee & Quad\",\"sets\":4,\"reps\":\"8 reps\",\"hold_sec\":\"—\",\"weight_kg\":\"Bodyweight\",\"frequency\":\"1x/day\",\"cues\":\"Keep front knee tracking over 2nd toe.\",\"notes\":\"PFPS Quad & Hip Rehabilitation Protocol (Week 4)\"}],\"Fri\":[],\"Sat\":[{\"id\":\"ex_gkbqucl\",\"name\":\"Spanish Squat (Isometric)\",\"category\":\"Knee & Quad\",\"sets\":5,\"reps\":\"45s hold\",\"hold_sec\":\"45s\",\"weight_kg\":\"Band\",\"frequency\":\"1x/day\",\"cues\":\"Deep isometric quad burn.\",\"notes\":\"PFPS Quad & Hip Rehabilitation Protocol (Week 4)\"},{\"id\":\"ex_0rajqu9\",\"name\":\"Leg Extension (Isometric 60°)\",\"category\":\"Knee & Quad\",\"sets\":4,\"reps\":\"30s hold\",\"hold_sec\":\"30s\",\"weight_kg\":\"5kg DB\",\"frequency\":\"1x/day\",\"cues\":\"60° angle to minimize joint reaction force.\",\"notes\":\"PFPS Quad & Hip Rehabilitation Protocol (Week 4)\"},{\"id\":\"ex_mqd86zp\",\"name\":\"Poliquin Step-Up\",\"category\":\"Knee & Quad\",\"sets\":4,\"reps\":\"12 reps\",\"hold_sec\":\"—\",\"weight_kg\":\"Slant Block\",\"frequency\":\"1x/day\",\"cues\":\"Smooth eccentric control.\",\"notes\":\"PFPS Quad & Hip Rehabilitation Protocol (Week 4)\"}],\"Sun\":[]}}]}"
  }
];

module.exports = {
  SEED_EXERCISES,
  SEED_TEMPLATES
};
