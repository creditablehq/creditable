// routes/plan.ts

import { Router } from 'express';
import { prisma } from '../lib/prisma';
import { authMiddleware } from '../middleware/auth'; // assumes JWT-based auth middleware
import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';

const router = Router() as Router;

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
      path.join(
        __dirname,
        '..',
        '..',
        'public',
        'images',
        'creditable_transparent.png'
      )
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
    doc.fontSize(14).font('Helvetica-Bold').text('Plan Information');
    doc.moveDown();

    doc
      .fontSize(12)
      .font('Helvetica-Bold')
      .text('Plan Name: ', { continued: true })
      .font('Helvetica')
      .text(`${plan?.name || 'N/A'}`);
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
    doc.fontSize(14).font('Helvetica-Bold').text('Plan Summary');
    doc.moveDown();

    doc
      .fontSize(12)
      .text('Type: ', { continued: true })
      .font('Helvetica')
      .text(`${capitalize(plan.type)}`);
    doc
      .font('Helvetica-Bold')
      .text('Deductible: ', { continued: true })
      .font('Helvetica')
      .text(`$${plan.deductible}`);
    doc
      .font('Helvetica-Bold')
      .text('MOOP: ', { continued: true })
      .font('Helvetica')
      .text(`$${plan.moop}`);
    doc
      .font('Helvetica-Bold')
      .text('Integrated Deductible: ', { continued: true })
      .font('Helvetica')
      .text(`${plan.integratedDeductible ? 'Yes' : 'No'}`);
    doc.moveDown();

    doc
      .moveTo(50, doc.y)
      .lineWidth(1)
      .strokeColor('#cccccc')
      .lineTo(doc.page.width - 50, doc.y)
      .stroke();
    doc.moveDown(2);

    // doc.fontSize(16).text('Creditability Determination', {
    //   underline: true,
    //   align: 'center',
    // });
    // addDetermination(doc, evaluation as Evaluation);

    doc
      .font('Helvetica-Bold')
      .text('Determination: ', { continued: true })
      .font('Helvetica')
      .fillColor(evaluation?.isCreditable ? '#228B22' : '#FF0000')
      .text(`${evaluation?.isCreditable ? 'Creditable' : 'Not Creditable'}`)
      .fillColor('black');

    doc
      .font('Helvetica-Bold')
      .text('Expected Plan Payment: ', { continued: true })
      .font('Helvetica')
      .text(`${((evaluation?.actuarialValue || 0) * 100).toFixed(1)}%`);

    doc
      .moveDown(2)
      .text('This plan has been determined to be ', { continued: true })
      .font('Helvetica-Bold')
      .fillColor(evaluation?.isCreditable ? '#228B22' : '#FF0000')
      .text(`${evaluation?.isCreditable ? 'Creditable' : 'NOT Creditable '}`, {
        continued: true,
      })
      .fillColor('black')
      .font('Helvetica')
      .text(
        ' Coverage under Medicare Part D rules. Based on the modeled results this plan is expected to pay ',
        { continued: true }
      )
      .font('Helvetica-Bold')
      .text(`${((evaluation?.actuarialValue || 0) * 100).toFixed(1)}% `, {
        continued: true,
      })
      .font('Helvetica')
      .text('of prescription drug costs which ', { continued: true })
      .font('Helvetica-Bold')
      .text(`${evaluation?.isCreditable ? 'does' : 'does not'}`, {
        continued: true,
      })
      .font('Helvetica')
      .text(
        'meet or exceed CMS’s creditable coverage threshold for the applicable plan year.'
      );

    doc
      .moveDown(2)
      .moveTo(50, doc.y)
      .lineWidth(1)
      .strokeColor('#cccccc')
      .lineTo(doc.page.width - 50, doc.y)
      .stroke();

    addFooter(doc);

    doc.end();
  } catch (error) {
    console.error('[GET] /plans/:id/report', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  const { name } = req?.body?.name;
  const brokerId = req?.user?.brokerId;

  try {
    const plan = await prisma.plan.findFirst({
      where: {
        id,
        name,
      },
    });

    if (!plan) return res.status(404).json({ message: 'Plan not found' });

    const deletedPlan = await prisma.plan.delete({ where: { id } });

    if (deletedPlan) {
      if (brokerId) {
        await prisma.broker.update({
          where: { id: brokerId },
          data: {
            currentPlanCount: {
              decrement: 1,
            },
          },
        });
      }
      res.status(204).send();
    } else {
      res.status(404).json({ message: `Could not find plan: ${id}` });
    }
  } catch (error) {
    console.error(`[DELETE /companies/${id}]`, error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

function addWatermark(
  doc: PDFKit.PDFDocument,
  logoBuffer: Buffer<ArrayBufferLike>
) {
  const { width, height } = doc.page;
  const logoWidth = 600; // scale as needed
  const x = (width - logoWidth) / 2;
  const y = (height - logoWidth) / 2;

  doc.save();
  doc.opacity(0.1); // light transparency
  doc
    .translate(x + width / 2, y + height / 2)
    .rotate(-45)
    .image(logoBuffer, -width / 3, -height / 2, { width: logoWidth })
    .restore();
  doc.opacity(1); // reset for normal content
}

function addFooter(doc: PDFKit.PDFDocument) {
  doc.moveDown(4);
  doc.fontSize(10).font('Helvetica-Bold').text('Disclaimer');
  doc.moveDown(1);
  doc
    .fontSize(8)
    .font('Helvetica')
    .text(
      'This report has been prepared using Creditable’s calculation methodology in alignment with CMS guidance under 42 CFR §423.56 for determining Medicare Part D creditable coverage. The calculations are based on standardized assumptions regarding drug utilization, tier mix, and cost per fill that are widely accepted in the industry and permitted by CMS. These assumptions are transparent and fully editable within the platform; however, they do not constitute CMS-mandated safe harbors. No individual claims data or certification is required for employer-sponsored plans, and this report does not constitute legal advice or a formal actuarial opinion. The ultimate responsibility for the creditable coverage determination, and for providing required notices to Medicare-eligible individuals and disclosures to CMS, rests with the plan sponsor. This report is intended solely as a compliance support tool and should be retained with the plan’s records for audit purposes. All assumptions and calculation logic are documentd within the Creditable platform and available for audit upon request.'
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

function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1).toLocaleLowerCase();
}

export default router;
