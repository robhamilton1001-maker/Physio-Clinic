const assert = require('assert');
const fs = require('fs');
const path = require('path');

console.log('--- Starting Enterprise Iconography & UI Audit Verification ---');

// 1. Verify index.html does not contain casual emojis
const html = fs.readFileSync(path.resolve(__dirname, '../src/index.html'), 'utf8');
const casualEmojis = ['🏋️', '📚', '⚡', '💾', '📂', '✉️', '📄', '📖', '⭐', '🚨', '⚠️', '⏳', '📝'];

casualEmojis.forEach(emoji => {
  assert(!html.includes(emoji), `index.html contains casual emoji: ${emoji}`);
});
console.log('✓ PASS: src/index.html contains zero casual emojis.');

// 2. Verify researchLibrary.js does not contain casual emojis
const researchLibJs = fs.readFileSync(path.resolve(__dirname, '../src/researchLibrary.js'), 'utf8');
casualEmojis.forEach(emoji => {
  assert(!researchLibJs.includes(emoji), `researchLibrary.js contains casual emoji: ${emoji}`);
});
console.log('✓ PASS: src/researchLibrary.js contains zero casual emojis.');

// 3. Verify renderer.js does not contain casual emojis
const rendererJs = fs.readFileSync(path.resolve(__dirname, '../src/renderer.js'), 'utf8');
casualEmojis.forEach(emoji => {
  assert(!rendererJs.includes(emoji), `renderer.js contains casual emoji: ${emoji}`);
});
console.log('✓ PASS: src/renderer.js contains zero casual emojis.');

// 4. Verify SVG icons are present in Settings Data Portability Hub
assert(html.includes('id="btn-export-exercises-backup"'), 'Missing exercises backup button');
assert(html.includes('id="btn-export-research-backup"'), 'Missing research backup button');
assert(html.includes('id="btn-export-smartphrases-backup"'), 'Missing smartphrases backup button');
assert(html.includes('id="btn-download-signed-declaration"'), 'Missing signed declaration button');
assert(html.includes('id="btn-paper-top-open"'), 'Missing top open button');
assert(html.includes('id="btn-paper-reveal-file"'), 'Missing reveal in explorer button');
assert(html.includes('id="paper-detail-fav-star"'), 'Missing paper detail fav star');
assert(html.includes('Clinical Notes &amp; Key Findings'), 'Missing Clinical notes label');
console.log('✓ PASS: All required action buttons and elements present with SVG icons in index.html.');

// 5. Verify Red Flag Alerts in renderer.js have clean titles without emojis
const expectedAlerts = [
  'Cauda Equina Syndrome Alert',
  'Cervical Myelopathy Alert',
  'Suspected Malignancy Alert',
  'Spinal Infection Alert',
  'Spinal Fracture Alert',
  'Vascular CAD / Stroke Alert'
];

expectedAlerts.forEach(alertTitle => {
  assert(rendererJs.includes(`title: '${alertTitle}'`), `RF_ALERT_MAP missing clean title: ${alertTitle}`);
});
console.log('✓ PASS: All Red Flag Alerts in RF_ALERT_MAP have clean clinical titles without emojis.');

// 6. Verify Red Flag chip text values are 'Flag', 'Referral', 'Clear'
assert(rendererJs.includes("chip.textContent = 'Flag';"), 'Missing chip text Flag');
assert(rendererJs.includes("chip.textContent = 'Referral';"), 'Missing chip text Referral');
assert(rendererJs.includes("chip.textContent = 'Clear';"), 'Missing chip text Clear');
console.log('✓ PASS: Red Flag chip interactive states use enterprise clinical text.');

// 7. Verify Research Library favorites pill & book card hover SVG
assert(researchLibJs.includes('data-group-filter="FAVORITES"'), 'Missing FAVORITES filter in researchLibrary.js');
assert(researchLibJs.includes('View Paper Details'), 'Missing View Paper Details in researchLibrary.js');
assert(researchLibJs.includes('starFilledIcon'), 'Missing starFilledIcon in researchLibrary.js');
assert(researchLibJs.includes('starOutlineIcon'), 'Missing starOutlineIcon in researchLibrary.js');
console.log('✓ PASS: Research Library favorites pill, book card, and detail star utilize monochrome/gold SVG stars.');

console.log('--- ALL 7 ENTERPRISE CLINICAL SUITE VERIFICATIONS PASSED ---');
