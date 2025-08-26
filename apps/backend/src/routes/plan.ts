// routes/plan.ts

import { Router } from 'express';
import { prisma } from '../lib/prisma';
import { authMiddleware } from '../middleware/auth'; // assumes JWT-based auth middleware
import PDFDocument from 'pdfkit';
import { Evaluation } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const router = Router();

router.use(authMiddleware);

router.get('/:id/report', async (req, res) => {
  try {
    const planId = req.params.id;
    const plan = await prisma.plan.findUnique({
      where: { id: planId },
      include: { evaluations: true, company: true },
    });

    if (!plan) {
      return res.status(404).send('Plan not found.');
    }

    const doc = new PDFDocument({ margin: 50 });
    const evaluation = plan.evaluations.at(-1);

    const logoBuffer = fs.readFileSync(
      path.join(__dirname, 'creditable_transparent.png')
    );

    addWatermark(doc, logoBuffer);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="plan-report-${planId}.pdf"`
    );
    doc.pipe(res);

    doc.image(logoBuffer, 40, 10, { width: 100 });
    doc
      .moveDown(4)
      .fontSize(20)
      .font('Helvetica-Bold')
      .text('Creditable Coverage Determination Report', { align: 'center' });
    doc.moveDown();

    // Plan Overview
    doc
      .fontSize(12)
      .font('Helvetica-Bold')
      .text('Plan Name: ', { continued: true })
      .font('Helvetica')
      .text(`${plan.name}`);
    doc
      .font('Helvetica-Bold')
      .text('Company: ', { continued: true })
      .font('Helvetica')
      .text(`${plan.company.name}`);
    doc
      .font('Helvetica-Bold')
      .text('Plan Year: ', { continued: true })
      .font('Helvetica')
      .text(`${plan.year}`);
    doc
      .font('Helvetica-Bold')
      .text('Date Tested: ', { continued: true })
      .font('Helvetica')
      .text(`${evaluation?.createdAt.toUTCString()}`);

    doc.moveDown();
    doc
      .moveTo(50, doc.y)
      .lineWidth(1)
      .strokeColor('#cccccc')
      .lineTo(doc.page.width - 50, doc.y)
      .stroke();
    doc.moveDown(2);

    // Plan Summary
    doc.fontSize(14).font('Helvetica-Bold').text('Plan Summary Results');
    doc.moveDown();

    doc
      .fontSize(12)
      .text('Type: ', { continued: true })
      .font('Helvetica')
      .text(`${plan.type}`);
    doc
      .font('Helvetica-Bold')
      .text('Deductible: ', { continued: true })
      .font('Helvetica')
      .text(`${plan.deductible}`);
    doc
      .font('Helvetica-Bold')
      .text('Monthly Premium: ', { continued: true })
      .font('Helvetica')
      .text(`${plan.monthlyPremiumRx}`);
    doc
      .font('Helvetica-Bold')
      .text('MOOP: ', { continued: true })
      .font('Helvetica')
      .text(`${plan.moop}`);
    doc.moveDown();

    doc.fontSize(16).text('Creditability Determination', {
      underline: true,
      align: 'center',
    });
    addDetermination(doc, evaluation as Evaluation);

    doc
      .font('Helvetica-Bold')
      .text('Projected Plan Pays (Actuarial Percentage): ', { continued: true })
      .font('Helvetica')
      .text(`${(evaluation?.actuarialValue || 0) * 100}%`);
    doc
      .font('Helvetica-Bold')
      .text('Test Applied: ', { continued: true })
      .font('Helvetica')
      .text(`CMS ${plan.year} ${evaluation?.method} Method`);
    doc
      .font('Helvetica-Bold')
      .text('Model Basis: ', { continued: true })
      .font('Helvetica')
      .text(`CMS-aligned exposure modeling (based on 42 fills/year)`);
    doc
      .font('Helvetica-Bold')
      .text('Assumptions: ', { continued: true })
      .font('Helvetica')
      .text(
        `Industry-standard tier utilization and cost estimates, editable per plan sponsor`
      );

    addFooter(doc);

    doc.end();
  } catch (error) {
    console.error('[GET /plans/:id/report', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

function addWatermark(
  doc: PDFKit.PDFDocument,
  logoBuffer: Buffer<ArrayBufferLike>
) {
  const { width, height } = doc.page;
  const logoWidth = 300; // scale as needed
  const x = (width - logoWidth) / 2;
  const y = (height - logoWidth) / 2;

  doc.opacity(0.1); // light transparency
  doc.image(logoBuffer, x, y, { width: logoWidth });
  doc.opacity(1); // reset for normal content
}

function addDetermination(doc: PDFKit.PDFDocument, evaluation: Evaluation) {
  const bgColor = evaluation.isCreditable ? '#d4edda' : '#f8d7da'; // greenish / reddish
  const borderColor = evaluation.isCreditable ? '#155724' : '#721c24';
  const textColor = borderColor;

  // Box dimensions
  const boxWidth = doc.page.width - 100; // 50px margin each side
  const boxHeight = 60;
  const x = 50;
  const y = doc.y + 10;

  // Draw filled rectangle
  doc.save();
  doc.rect(x, y, boxWidth, boxHeight).fill(bgColor);

  // Draw border
  doc
    .lineWidth(2)
    .strokeColor(borderColor)
    .rect(x, y, boxWidth, boxHeight)
    .stroke();

  // Add text centered inside box
  doc
    .fillColor(textColor)
    .fontSize(18)
    .font('Helvetica-Bold')
    .text(
      `Plan is ${evaluation.isCreditable ? 'Creditable' : 'Non-Creditable'}`,
      x,
      y + 20,
      { width: boxWidth, align: 'center' }
    );
  doc.restore();

  doc
    .fontSize(12)
    .fillColor('black')
    .text(evaluation.reasoning || '', { align: 'center' });

  doc.moveDown(3); // add space after box
}

function addFooter(doc: PDFKit.PDFDocument) {
  doc.moveDown(4);
  doc.fontSize(10).font('Helvetica-Bold').text('Disclaimer');
  doc.moveDown(1);
  doc
    .fontSize(8)
    .font('Helvetica')
    .text(
      'This report is generated using Creditable’s proprietary modeling tool built to align with CMS guidance under 42 CFR §423.56. All actuarial assumptions (e.g., tier cost, utilization rates, exposure modeling) are industry-standard and editable within the platform. Results are based on representative modeling, not claims data, and are intended solely to assist plan sponsors or their representatives in determining creditable coverage status.'
    );
  doc.moveDown();
  doc
    .font('Helvetica-Bold')
    .text('Important: ', { continued: true })
    .font('Helvetica')
    .text(
      'Final responsibility for creditable coverage determination rests with the plan sponsor. This report does not constitute formal actuarial certification or legal advice. Documentation should be retained for audit purposes.'
    );
}

export default router;
