'use strict';

const path = require('path');
const { PDFParse } = require('pdf-parse');

/**
 * Heuristically parses an offline research paper PDF and extracts:
 * - Title
 * - Authors
 * - Publication Date / Year
 * - Suggested Clinical Group Tag
 */
async function extractPaperMetadata(buffer, filePath) {
  let text = '';
  let info = {};

  try {
    const parser = new PDFParse({ data: buffer });
    const textRes = await parser.getText();
    text = textRes.text || '';
    if (textRes.info) info = textRes.info;
    await parser.destroy();
  } catch (err) {
    console.warn('[ResearchParser] pdf-parse warning:', err.message);
  }

  const baseName = path.basename(filePath, path.extname(filePath));
  const cleanBaseName = baseName
    .replace(/[-_]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  // 1. Title Extraction
  let title = '';
  if (info && info.Title && typeof info.Title === 'string' && info.Title.trim().length > 6 && !info.Title.toLowerCase().includes('microsoft word') && !info.Title.toLowerCase().includes('untitled')) {
    title = info.Title.trim();
  }

  const lines = text.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
  if (!title && lines.length > 0) {
    // Look in first 8 non-boilerplate lines
    for (let i = 0; i < Math.min(8, lines.length); i++) {
      const line = lines[i];
      if (/^(?:doi|issn|isbn|http|www|page|vol\.|volume|issue|journal|accepted|received|copyright|©)/i.test(line)) continue;
      if (line.length >= 8 && line.length <= 160) {
        title = line.replace(/^[\s#*=-]+|[\s#*=-]+$/g, '');
        break;
      }
    }
  }
  if (!title) {
    title = cleanBaseName.replace(/\b\w/g, c => c.toUpperCase());
  }

  // 2. Authors Extraction
  let authors = '';
  if (info && info.Author && typeof info.Author === 'string' && info.Author.trim().length > 3 && !info.Author.toLowerCase().includes('unknown') && !info.Author.toLowerCase().includes('author')) {
    authors = info.Author.trim();
  }

  if (!authors && lines.length > 1) {
    // Check lines immediately after the title line
    for (let i = 0; i < Math.min(10, lines.length); i++) {
      const line = lines[i];
      if (line === title) continue;
      if (/et al\.|department of|university|clinic|hospital|faculty|school of|division of/i.test(line)) {
        authors = line.replace(/^(?:by\s+|authors?:\s*)/i, '').trim();
        break;
      }
      if (/^[A-Z][a-z]+(?:\s+[A-Z]\.?)?\s+[A-Z][a-z]+(?:,\s+[A-Z][a-z]+(?:\s+[A-Z]\.?)?\s+[A-Z][a-z]+)*$/.test(line)) {
        authors = line;
        break;
      }
    }
  }
  if (!authors) {
    // Try to extract surname from filename if e.g. "Lewis_2016_Shoulder.pdf"
    const authorMatch = cleanBaseName.match(/^([A-Za-z]+)\s*(?:et\s*al\.?)?\s*(\d{4})/i);
    if (authorMatch) {
      authors = `${authorMatch[1]} et al.`;
    }
  }

  // 3. Publication Date / Year Extraction
  let publicationDate = '';
  const firstChunk = text.slice(0, 3000);
  const yearMatch = firstChunk.match(/\b(20[0-2]\d|19[89]\d)\b/) || cleanBaseName.match(/\b(20[0-2]\d|19[89]\d)\b/);
  if (yearMatch) {
    publicationDate = yearMatch[1];
  } else {
    publicationDate = new Date().getFullYear().toString();
  }

  // 4. Heuristic Clinical Group Classification
  const fullLower = text.toLowerCase().slice(0, 10000);
  const titleLower = title.toLowerCase();
  let suggestedGroup = 'General / MSK';

  const groups = [
    { name: 'Spine / Lumbar', keywords: ['spine', 'lumbar', 'cervical', 'thoracic', 'disc', 'radiculopathy', 'back pain', 'sciatica', 'myelopathy', 'cauda equina'] },
    { name: 'Knee / ACL', keywords: ['knee', 'acl', 'patellofemoral', 'meniscus', 'meniscal', 'koos', 'anterior cruciate', 'patellar'] },
    { name: 'Shoulder', keywords: ['shoulder', 'rotator cuff', 'glenohumeral', 'labrum', 'subacromial', 'impingement', 'spadi', 'biceps tendon'] },
    { name: 'Tendon / Tendinopathy', keywords: ['tendon', 'tendinopathy', 'achilles', 'patellar tendon', 'isometric', 'eccentric', 'heavy slow resistance', 'visa-a', 'visa-p'] },
    { name: 'Pain Science', keywords: ['pain neuroscience', 'kinesiophobia', 'catastrophizing', 'central sensitization', 'chronic pain', 'explaining pain', 'biopsychosocial'] },
    { name: 'S&C / Periodization', keywords: ['strength', 'conditioning', 'hypertrophy', 'periodization', 'resistance training', '1rm', 'rate of force development', 'power output'] },
    { name: 'Hip & Pelvis', keywords: ['hip', 'groin', 'femoroacetabular', 'fai', 'labral', 'gluteal', 'trochanteric', 'pelvic'] },
    { name: 'Foot & Ankle', keywords: ['ankle', 'foot', 'plantar', 'fascia', 'fasciopathy', 'sprain', 'syndesmosis', 'inversion'] }
  ];

  let bestScore = 0;
  for (const g of groups) {
    let score = 0;
    for (const kw of g.keywords) {
      if (titleLower.includes(kw)) score += 5;
      if (cleanBaseName.toLowerCase().includes(kw)) score += 4;
      const count = (fullLower.match(new RegExp('\\b' + kw + '\\b', 'g')) || []).length;
      score += Math.min(count, 8);
    }
    if (score > bestScore) {
      bestScore = score;
      suggestedGroup = g.name;
    }
  }

  return {
    title,
    authors: authors || 'Unknown Author',
    publicationDate,
    suggestedGroup
  };
}

module.exports = {
  extractPaperMetadata
};
