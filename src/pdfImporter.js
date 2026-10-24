'use strict';

const path = require('path');
const { PDFParse } = require('pdf-parse');

/**
 * Escapes HTML characters for safe injection.
 */
function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/**
 * Common boilerplate line filters (copyrights, URLs, emails, citations, headers/footers)
 */
const BOILERPLATE_PATTERNS = [
  /copyright|\(c\)|©|all rights reserved/i,
  /reprinted with permission|reproduced with permission/i,
  /published by|elsevier|springer|wolters kluwer|wiley|blackwell/i,
  /journal of|doi:\s*10\.|issn:\s*\d|isbn:\s*\d/i,
  /https?:\/\/|www\./i,
  /^(?:email|phone|fax|tel|contact|author correspondence|address for correspondence):/i,
  /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/,
  /^(?:page\s+\d+\s+of\s+\d+|page\s+\d+|\-\-\s*\d+\s+of\s+\d+\s*\-\-)$/i,
  /(?:available at|downloaded from|license agreement|terms and conditions)/i
];

/**
 * Known MSK outcome measure acronyms to recognize.
 */
const KNOWN_MSK_ACRONYMS = [
  'LEFS', 'DASH', 'QUICKDASH', 'NDI', 'ODI', 'FABQ', 'KOOS', 'HOOS', 'SPADI', 
  'ASES', 'FAAM', 'FADI', 'IKDC', 'PRWE', 'VISA-A', 'VISA-P', 'WOMAC', 'GROC', 
  'PSFS', 'SANE', 'TUG', 'BERGS', 'TAMPA', 'STarT', 'MHQ', 'WORC', 'OSWESTRY'
];

/**
 * Strips common boilerplate lines from extracted text lines.
 */
function cleanPdfLines(rawText) {
  if (!rawText) return [];
  const lines = rawText.split(/\r?\n/);
  const cleaned = [];

  for (let line of lines) {
    line = line.trim();
    if (!line) continue;

    // Check against boilerplate filters
    const isBoilerplate = BOILERPLATE_PATTERNS.some(pat => pat.test(line));
    if (isBoilerplate) continue;

    cleaned.push(line);
  }

  return cleaned;
}

/**
 * Derives a clean document title from text lines or file name.
 */
function deriveTitle(lines, filePath) {
  const baseName = path.basename(filePath, path.extname(filePath));
  const cleanBaseName = baseName
    .replace(/[-_]+/g, ' ')
    .replace(/\b\w/g, c => c.toUpperCase());

  if (lines.length > 0) {
    // Check first 3 lines for a strong title candidate
    for (let i = 0; i < Math.min(4, lines.length); i++) {
      const candidate = lines[i];
      // Skip if it looks like a question number, instruction, or prompt
      if (/^(?:\d+[\.\)]|section|item|please|instructions|patient\s+name|date)/i.test(candidate)) {
        continue;
      }
      if (candidate.length >= 4 && candidate.length <= 100) {
        return candidate.replace(/^[\s#*=-]+|[\s#*=-]+$/g, '');
      }
    }
  }

  return cleanBaseName || 'Imported Clinical Assessment';
}

/**
 * Derives an uppercase keyword code for the smart phrase.
 */
function deriveKeywordCode(title, filePath) {
  const baseName = path.basename(filePath, path.extname(filePath)).toUpperCase();
  const titleUpper = (title || '').toUpperCase();

  // 1. Check for known acronyms in title or filename
  for (const acr of KNOWN_MSK_ACRONYMS) {
    if (titleUpper.includes(acr) || baseName.includes(acr)) {
      return `${acr}_CUSTOM`;
    }
  }

  // 2. Extract leading uppercase token or clean file name
  const fileClean = baseName.replace(/[^A-Z0-9]/g, '_').replace(/_+/g, '_').replace(/^_|_$/g, '');
  if (fileClean.length >= 3) {
    return fileClean.slice(0, 16);
  }

  // 3. Fallback from title
  const words = titleUpper.replace(/[^A-Z0-9\s]/g, '').split(/\s+/).filter(Boolean);
  if (words.length > 0) {
    if (words.length >= 2 && words.length <= 4) {
      return words.map(w => w[0]).join('') + '_CUSTOM';
    }
    return words[0].slice(0, 12) + '_CUSTOM';
  }

  return 'OUTCOME_CUSTOM';
}

/**
 * Scans text for scoring scale definitions (e.g. 0 to 4, 0-5, Likert anchors).
 */
function extractScoringScale(lines) {
  let minScore = 0;
  let maxScore = 5;
  let scaleDesc = '';
  let foundScale = false;

  // Search for scale patterns like "0 = None, 1 = Mild... 4 = Severe"
  const scaleRegex = /(?:scale|options|scoring|ratings?)?[:\s]*([0-9])\s*(?:=|[-–—]|:)\s*([A-Za-z\s]{3,30})/gi;
  const rangeRegex = /(?:(?:scores?|points?|scale|rated?|items?|range)[:\s]*(?:from\s+)?|from\s+|^)(\d+)\s*(?:to|[-–—])\s*(\d+)/i;
  const likertAnchors = [];

  for (const line of lines.slice(0, 25)) {
    let match;
    while ((match = scaleRegex.exec(line)) !== null) {
      likertAnchors.push(`${match[1]} = ${match[2].trim()}`);
    }

    const rangeMatch = line.match(rangeRegex);
    if (rangeMatch) {
      const minVal = parseInt(rangeMatch[1], 10);
      const maxVal = parseInt(rangeMatch[2], 10);
      if (!isNaN(minVal) && !isNaN(maxVal) && maxVal > minVal) {
        minScore = minVal;
        maxScore = maxVal;
        foundScale = true;
      }
    }
  }

  if (likertAnchors.length >= 2) {
    scaleDesc = likertAnchors.slice(0, 5).join(' • ');
    foundScale = true;
  } else if (foundScale) {
    scaleDesc = `${minScore}: Minimum to ${maxScore}: Maximum`;
  } else {
    // Default standard clinical Likert scale
    minScore = 0;
    maxScore = 4;
    scaleDesc = '0: Extreme Difficulty / Severe to 4: No Difficulty / Normal';
  }

  return { minScore, maxScore, scaleDesc, foundScale };
}

/**
 * Extracts cutoff thresholds, MCID, or normative score notes from text lines.
 */
function extractCutoffsAndNotes(lines) {
  const notes = [];
  const cutoffRegex = /(?:cutoff|cut-off|mcid|mdc|normative|score interpretation|interpretation)[:\s]+([^.\n\r]+)/i;

  for (const line of lines) {
    const match = line.match(cutoffRegex);
    if (match) {
      notes.push(match[0].trim());
    }
  }

  return notes.length > 0 ? notes.join(' • ') : 'Standard MSK Impairment Calculation';
}

/**
 * Extracts numbered or structured items/questions from cleaned lines.
 */
function extractQuestions(lines, scaleInfo) {
  const items = [];
  // Regex to match question numbering: e.g. "1. Item", "1) Item", "Item 1:", "Q1.", "Section A:"
  const itemRegex = /^(?:(?:Item|Question|Q|No\.?)\s*)?([0-9]{1,3})[\.\)\:\-]\s*(.*)$/i;
  const sectionRegex = /^(?:Section|Part)\s*([A-Z0-9]+)[\.\:\-]\s*(.*)$/i;

  let currentItem = null;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Check for numbered question
    const itemMatch = line.match(itemRegex);
    const sectionMatch = line.match(sectionRegex);

    if (itemMatch) {
      if (currentItem && currentItem.text.length > 0) {
        items.push(currentItem);
      }
      const num = itemMatch[1];
      const text = itemMatch[2].trim();
      currentItem = {
        number: parseInt(num, 10),
        label: `${num}.`,
        text: text,
        scale: scaleInfo.scaleDesc,
        min: scaleInfo.minScore,
        max: scaleInfo.maxScore,
        defaultScore: scaleInfo.minScore,
        note: `Item ${num}`
      };
    } else if (sectionMatch) {
      if (currentItem && currentItem.text.length > 0) {
        items.push(currentItem);
      }
      const sec = sectionMatch[1];
      const text = sectionMatch[2].trim();
      currentItem = {
        number: items.length + 1,
        label: `Section ${sec}:`,
        text: text || `Section ${sec}`,
        scale: scaleInfo.scaleDesc,
        min: scaleInfo.minScore,
        max: scaleInfo.maxScore,
        defaultScore: scaleInfo.minScore,
        note: `Sec ${sec}`
      };
    } else if (currentItem) {
      // If line continues current question (doesn't look like a new category, cutoff, or header)
      const isHeaderOrFooter = /^(?:total|score|subscale|mcid|mdc|cutoff|normative|interpretation|instructions?|notes?)[:\s]/i.test(line);
      if (line.length > 0 && !isHeaderOrFooter && currentItem.text.length < 200) {
        currentItem.text += (currentItem.text ? ' ' : '') + line;
      }
    }
  }

  if (currentItem && currentItem.text.length > 0) {
    items.push(currentItem);
  }

  // Fallback: If no numbered items were identified, detect bullet points or question marks
  if (items.length < 2) {
    const bulletRegex = /^[\*\-•▪▫►]\s*(.*)$/;
    for (const line of lines) {
      const bMatch = line.match(bulletRegex);
      if (bMatch && bMatch[1].trim().length > 3) {
        items.push({
          number: items.length + 1,
          label: `${items.length + 1}.`,
          text: bMatch[1].trim(),
          scale: scaleInfo.scaleDesc,
          min: scaleInfo.minScore,
          max: scaleInfo.maxScore,
          defaultScore: scaleInfo.minScore,
          note: `Item ${items.length + 1}`
        });
      }
    }
  }

  // Second Fallback: Chunk non-boilerplate sentences if still empty
  if (items.length < 2) {
    const candidateLines = lines.filter(l => l.length > 15 && l.length < 120 && !l.includes(':'));
    candidateLines.slice(0, 15).forEach((line, idx) => {
      items.push({
        number: idx + 1,
        label: `${idx + 1}.`,
        text: line,
        scale: scaleInfo.scaleDesc,
        min: scaleInfo.minScore,
        max: scaleInfo.maxScore,
        defaultScore: scaleInfo.minScore,
        note: `Item ${idx + 1}`
      });
    });
  }

  return items;
}

/**
 * Builds the interactive Excel-style table HTML representation.
 */
function generateExcelTableHtml(items, title, code, scaleInfo, cutoffNotes) {
  const calcGroup = code.toLowerCase().replace(/[^a-z0-9]/g, '');
  const itemCount = items.length;
  const maxTotal = itemCount * scaleInfo.maxScore;
  const minTotal = itemCount * scaleInfo.minScore;

  let rowsHtml = '';
  items.forEach((item, idx) => {
    const fullDesc = item.text.startsWith(item.label) ? item.text : `${item.label} ${item.text}`;
    rowsHtml += `      <tr>
        <td>${escapeHtml(fullDesc)}</td>
        <td class="text-slate-500">${escapeHtml(item.scale)}</td>
        <td class="text-center"><input type="number" class="excel-input text-center" data-group="${calcGroup}" min="${item.min}" max="${item.max}" value="${item.defaultScore}" /></td>
        <td><span class="risk-pill risk-neutral">${escapeHtml(item.note || `Item ${idx + 1}`)}</span></td>
      </tr>\n`;
  });

  const totalRowHtml = `      <tr class="excel-total-row">
        <td colspan="2" class="font-bold">
          Total Score: <span class="excel-sum font-mono" data-sum-target="${calcGroup}">${minTotal}</span> &bull; 
          Max Score: <span class="font-mono">${maxTotal}</span> &bull; 
          % Impairment: <span class="excel-percent font-mono text-indigo-600 dark:text-indigo-400" data-percent-target="${calcGroup}" data-max="${maxTotal}">0%</span>
        </td>
        <td class="text-center font-mono font-bold text-indigo-600 dark:text-indigo-400">
          <span class="excel-sum" data-sum-target="${calcGroup}">${minTotal}</span>
        </td>
        <td>
          <span class="risk-pill risk-low">${escapeHtml(cutoffNotes.slice(0, 30))}</span>
        </td>
      </tr>`;

  return `<h3>${escapeHtml(title)}</h3>
<p class="text-xs text-slate-500 mb-2">Instructions: ${escapeHtml(scaleInfo.scaleDesc)}</p>
<div class="excel-table-wrap">
  <table class="excel-table" data-calc-group="${calcGroup}">
    <thead>
      <tr>
        <th style="width: 42%;"><span class="th-text" contenteditable="true">Section / Item Description</span><div class="col-resizer"></div></th>
        <th style="width: 28%;"><span class="th-text" contenteditable="true">Response Scale / Range</span><div class="col-resizer"></div></th>
        <th style="width: 14%;" class="text-center"><span class="th-text" contenteditable="true">Patient Score</span><div class="col-resizer"></div></th>
        <th style="width: 16%;"><span class="th-text" contenteditable="true">Notes / Cutoff</span><div class="col-resizer"></div></th>
      </tr>
    </thead>
    <tbody>
${rowsHtml}${totalRowHtml}
    </tbody>
  </table>
</div>
<p class="text-xs text-slate-400 mt-1">${escapeHtml(cutoffNotes)}. Total score ranges from ${minTotal} to ${maxTotal} points.</p>`;
}

/**
 * Main export: parses a PDF buffer completely offline and constructs a Smart Phrase.
 * 
 * @param {Buffer} buffer - Raw file buffer of the PDF
 * @param {string} filePath - Absolute path to the PDF on disk
 * @returns {Promise<{ success: boolean, title: string, code: string, trigger_prefix: string, category: string, content: string, rawItemCount: number, cutoffNotes: string }>}
 */
async function parsePdfBuffer(buffer, filePath) {
  try {
    const parser = new PDFParse({ data: buffer });
    let text = '';
    let nativeTables = [];

    try {
      const textRes = await parser.getText();
      text = textRes.text || '';

      try {
        const tableRes = await parser.getTable();
        if (tableRes && tableRes.pages) {
          for (const p of tableRes.pages) {
            if (p.tables && p.tables.length > 0) {
              nativeTables.push(...p.tables);
            }
          }
        }
      } catch {
        // getTable optional fallback
      }
    } finally {
      await parser.destroy();
    }

    const cleanedLines = cleanPdfLines(text);
    const title = deriveTitle(cleanedLines, filePath);
    const code = deriveKeywordCode(title, filePath);
    const scaleInfo = extractScoringScale(cleanedLines);
    const cutoffNotes = extractCutoffsAndNotes(cleanedLines);
    const questions = extractQuestions(cleanedLines, scaleInfo);

    const contentHtml = generateExcelTableHtml(questions, title, code, scaleInfo, cutoffNotes);

    return {
      success: true,
      title,
      code,
      trigger_prefix: '!',
      category: 'outcome_measures',
      content: contentHtml,
      rawItemCount: questions.length,
      cutoffNotes
    };
  } catch (err) {
    console.error('[pdfImporter] Failed to parse PDF buffer:', err);
    return {
      success: false,
      error: err.message || 'Failed to parse PDF document'
    };
  }
}

module.exports = {
  parsePdfBuffer,
  cleanPdfLines,
  deriveTitle,
  deriveKeywordCode,
  extractScoringScale,
  extractQuestions,
  generateExcelTableHtml
};
