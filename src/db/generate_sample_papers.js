'use strict';

const fs = require('fs');
const path = require('path');

function escapePdfText(str) {
  return (str || '').replace(/\\/g, '\\\\').replace(/\(/g, '\\(').replace(/\)/g, '\\)');
}

function generatePaperPdf({ title, authors, journal, year, category, sections }) {
  const lines = [];
  lines.push({ font: '/F2', size: 15, dy: 0, text: title });
  lines.push({ font: '/F1', size: 9, dy: 20, text: `${authors} — ${journal} (${year})` });
  lines.push({ font: '/F2', size: 9, dy: 15, text: `Clinical Focus: ${category} | Open Access Clinical Reference` });
  lines.push({ font: '/F1', size: 8, dy: 12, text: '__________________________________________________________________________________________' });

  for (const sec of sections) {
    lines.push({ font: '/F2', size: 10, dy: 18, text: sec.heading });
    for (const p of sec.paragraphs) {
      lines.push({ font: '/F1', size: 8.5, dy: 12, text: p });
    }
  }

  lines.push({ font: '/F1', size: 7.5, dy: 24, text: 'SoloPT Clinical Knowledge Engine • Bundled Open-Access Educational Reference • 100% Offline' });

  let contentStream = 'BT\n50 740 Td\n';
  let first = true;
  for (const l of lines) {
    if (!first) {
      contentStream += `0 -${l.dy} Td\n`;
    }
    first = false;
    contentStream += `${l.font} ${l.size} Tf\n`;
    contentStream += `(${escapePdfText(l.text)}) Tj\n`;
  }
  contentStream += 'ET';

  const streamLen = Buffer.byteLength(contentStream);

  const objects = [
    '1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj',
    '2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj',
    '3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R /F2 6 0 R >> >> >>\nendobj',
    `4 0 obj\n<< /Length ${streamLen} >>\nstream\n${contentStream}\nendstream\nendobj`,
    '5 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj',
    '6 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>\nendobj',
    `7 0 obj\n<< /Title (${escapePdfText(title)}) /Author (${escapePdfText(authors)}) /Subject (${escapePdfText(category)}) /CreationDate (D:${year}0101000000Z) >>\nendobj`
  ];

  let body = '%PDF-1.4\n';
  const offsets = [];
  for (let i = 0; i < objects.length; i++) {
    offsets.push(Buffer.byteLength(body));
    body += objects[i] + '\n';
  }

  const xrefOffset = Buffer.byteLength(body);
  body += `xref\n0 ${objects.length + 1}\n`;
  body += '0000000000 65535 f \n';
  for (const offset of offsets) {
    body += `${String(offset).padStart(10, '0')} 00000 n \n`;
  }
  body += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R /Info 7 0 R >>\n`;
  body += `startxref\n${xrefOffset}\n%%EOF\n`;

  return Buffer.from(body);
}

function createSamplePapers() {
  const targetDir = path.join(__dirname, '../../assets/sample_papers');
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  const papers = [
    {
      filename: 'Cook_2016_Continuum_Model_Tendon_Pathology.pdf',
      title: 'Revisiting the continuum model of tendon pathology: what is its merit in clinical practice and research?',
      authors: 'Cook JL, Rio E, Purdam CR, Docking SI',
      journal: 'British Journal of Sports Medicine (BJSM)',
      year: '2016',
      category: 'Tendinopathy',
      sections: [
        {
          heading: '1. The Staged Continuum Paradigm',
          paragraphs: [
            'The continuum model of tendon pathology differentiates load-induced presentation into three continuous stages:',
            '• Reactive Tendinopathy: Acute, non-inflammatory cellular response to tensile or compressive load spike.',
            '• Tendon Disrepair: Focal matrix disruption, chondrocytic cell proliferation, and capillary ingrowth.',
            '• Degenerative Tendinopathy: Disorganized collagen matrix with large areas of cell death and minimal repair capacity.'
          ]
        },
        {
          heading: '2. Clinical Load Management & Treatment Strategies',
          paragraphs: [
            '• Reactive stage priority: Load management. Reduce high-tensile energy-storage activities (jumping, sprinting).',
            '• Isometric holds (5 x 45 seconds at 70% MVC) produce immediate cortical inhibition and reliable analgesic relief.',
            '• Heavy Slow Resistance (HSR) training (3 x weekly, 3-4 sets of 6-8 RM) promotes positive collagen mechanical adaptation.',
            '• Energy storage and release training must be reintroduced progressively before return-to-sport clearance.'
          ]
        }
      ]
    },
    {
      filename: 'Buckthorpe_2019_Optimising_Return_To_Play_ACL.pdf',
      title: 'Optimising return to play after anterior cruciate ligament reconstruction: 10 critical criteria',
      authors: 'Buckthorpe M, Della Villa F, Della Villa S',
      journal: 'British Journal of Sports Medicine (BJSM)',
      year: '2019',
      category: 'Knee / ACL',
      sections: [
        {
          heading: '1. Objective Clearance vs Chronological Time',
          paragraphs: [
            'Chronological time alone (>9-12 months) is necessary for biological graft ligamentisation but insufficient for discharge.',
            'Safe return to sport requires meeting comprehensive objective neuromuscular, functional, and psychological criteria.'
          ]
        },
        {
          heading: '2. The 10 Objective Return-to-Play Criteria',
          paragraphs: [
            '1. Full active knee extension (0 degrees) and symmetrical flexion with zero persistent effusion or joint warmth.',
            '2. Quadriceps strength Limb Symmetry Index (LSI) > 90% (preferably >100% on isokinetic testing).',
            '3. Single-leg hop battery (single hop, triple hop, crossover hop, 6m timed hop) demonstrating LSI > 90%.',
            '4. Qualitative movement assessment: elimination of dynamic knee valgus and trunk collapse on jump landing.',
            '5. Reactive agility and multidirectional deceleration mechanics evaluated under high-speed video recording.',
            '6. High psychological readiness verified via ACL-RSI questionnaire (validated cut-off score > 65).'
          ]
        }
      ]
    },
    {
      filename: 'OSullivan_2020_Cognitive_Functional_Therapy_LBP.pdf',
      title: 'Cognitive functional therapy for disabling low back pain: a multidimensional approach',
      authors: "O'Sullivan PB, Caneiro JP, O'Keeffe M, Smith V, Dankaerts W, Fersum K, O'Sullivan K",
      journal: 'Physical Therapy Journal (PTJ)',
      year: '2020',
      category: 'Spine',
      sections: [
        {
          heading: '1. Biopsychosocial Framing of Persistent Spinal Pain',
          paragraphs: [
            'Persistent non-specific low back pain is driven by complex interactions between structural, psychological, and social factors.',
            'Structural MRI findings (e.g. disc degeneration, mild bulges) are prevalent in asymptomatic individuals and must be contextualized.'
          ]
        },
        {
          heading: '2. Core Dimensions of Cognitive Functional Therapy (CFT)',
          paragraphs: [
            '• Making Sense of Pain: Demystifying spinal mechanics, addressing diagnostic scan anxiety, and breaking fear-avoidance beliefs.',
            '• Exposure with Control: Graded behavioral exposure to avoided movements (lumbar flexion, loaded lifting) while de-tensing muscles.',
            '• Lifestyle Integration: Addressing sleep deficits, systemic stress, physical inactivity, and pacing strategies.'
          ]
        }
      ]
    }
  ];

  for (const p of papers) {
    const filePath = path.join(targetDir, p.filename);
    const pdfBuf = generatePaperPdf(p);
    fs.writeFileSync(filePath, pdfBuf);
    console.log(`[SeedPDF] Generated: ${filePath} (${pdfBuf.length} bytes)`);
  }
}

module.exports = { createSamplePapers };

if (require.main === module) {
  createSamplePapers();
}
