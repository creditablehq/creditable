// routes/plan.ts

import { Router } from 'express';
import { prisma } from '../lib/prisma';
import { authMiddleware } from '../middleware/auth'; // assumes JWT-based auth middleware
import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';
import { Prisma } from '@prisma/client';

type PlanWithCompany = Prisma.PlanGetPayload<{ include: { company: true } }>;

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

router.get('/:id/notice', async (req, res) => {
  try {
    const planId = req.params.id;
    const plan = await prisma.plan.findUnique({
      where: { id: planId },
      include: { evaluations: true, company: true },
    });

    if (!plan) return res.status(404).send('Plan not found.');

    const FOOTER_HEIGHT = 100;

    const doc = new PDFDocument({
      size: 'LETTER',
      margins: {
        top: 55,
        bottom: 50 + FOOTER_HEIGHT,
        left: 50,
        right: 50,
      },
      bufferPages: true, // needed to draw footer after all pages
    });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="plan-notice-${planId}.pdf"`
    );
    doc.pipe(res);

    const evaluation = plan.evaluations.at(-1);

    // Generate main content
    if (evaluation?.isCreditable) {
      generateCreditableNotice(doc, plan);
    } else {
      generateNonCreditableNotice(doc, plan);
    }

    function drawFooter(
      doc: PDFKit.PDFDocument,
      footerText: string,
      formCode: string,
      updatedDate: string
    ) {
      const pages = doc.bufferedPageRange();

      for (let i = 0; i < pages.count; i++) {
        doc.switchToPage(i);

        const footerX = doc.page.margins.left;
        const footerY = doc.page.height - FOOTER_HEIGHT - 25;
        const footerWidth =
          doc.page.width - doc.page.margins.left - doc.page.margins.right;
        const footerHeight = FOOTER_HEIGHT;

        const headerFontSize = 9;
        const bodyFontSize = 8;
        const padding = 4;

        // --- Draw header manually in one line ---
        doc.font('Helvetica-Bold').fontSize(headerFontSize);

        // Left text
        doc.text(formCode, footerX, footerY + padding, {
          lineBreak: false,
        });

        // Right text: calculate starting X to align at right margin
        const rightTextWidth = doc.widthOfString(updatedDate);
        doc.text(
          updatedDate,
          footerX + footerWidth - rightTextWidth,
          footerY + padding,
          {
            lineBreak: false,
          }
        );

        // --- Draw footer body below header ---
        const headerHeight = Math.max(
          doc.heightOfString(formCode, { width: footerWidth }),
          doc.heightOfString(updatedDate, { width: footerWidth })
        );

        const bodyY = footerY + headerHeight + padding + 10;
        const bodyHeight = footerHeight - headerHeight - padding;

        doc.font('Helvetica').fontSize(bodyFontSize);
        doc.text(footerText, footerX, bodyY, {
          width: footerWidth,
          height: bodyHeight,
          ellipsis: true,
          lineGap: 2,
          align: 'left',
        });
      }
    }

    const footerText =
      'According to the Paperwork Reduction Act of 1995, no persons are required to respond to a collection of information unless it displays a valid OMB control number. The valid OMB control number for this information collection is 0938-0990. The time required to complete this information collection is estimated to average 8 hours per response initially, including the time to review instructions, search existing data resources, gather the data needed, and complete and review the information collection. If you have comments concerning the accuracy of the time estimate(s) or suggestions for improving this form, please write to: CMS, 7500 Security Boulevard, Attn: PRA Reports Clearance Officer, Mail Stop C4-26-05, Baltimore, Maryland 21244-1850.';
    const code = 'CMS Form 10182-CC';
    const updated = 'Updated: April 1, 2011';
    drawFooter(doc, footerText, code, updated);

    doc.end();
  } catch (error) {
    console.error('[GET] /plans/:id/notice', error);
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

function generateCreditableNotice(
  doc: PDFKit.PDFDocument,
  plan: PlanWithCompany
) {
  doc
    .fontSize(20)
    .font('Helvetica-Bold')
    .text(`Important Notice from ${plan.company?.name}`, { align: 'center' });
  doc.moveDown();

  // First Section
  ensureSpace(doc, 180);
  doc
    .fontSize(14)
    .font('Helvetica-Bold')
    .text('About Your Prescription Drug Coverage and Medicare', {
      align: 'center',
    })
    .moveDown()
    .fontSize(12)
    .font('Helvetica')
    .text(
      'Please read this notice carefully and keep it where you can find it. This notice has information about your current prescription drug coverage with ',
      { continued: true }
    )
    .font('Helvetica-Bold')
    .text(`${plan.company.name || 'your employer'}`, {
      continued: true,
    })
    .font('Helvetica')
    .text(' and about your options under ', { continued: true })
    .font('Helvetica-Bold')
    .text('Medicare’s prescription drug coverage.')
    .moveDown()
    .font('Helvetica')
    .text(
      'This information can help you decide whether or not you want to join a Medicare drug plan. If you are considering joining, you should compare your current coverage — including which drugs are covered and at what cost — with the coverage and costs of the plans offering Medicare prescription drug coverage in your area.'
    )
    .moveDown()
    .text(
      'Information about where you can get help to make decisions about your prescription drug coverage is at the end of this notice.'
    )
    .moveDown(2);

  // Second Section
  ensureSpace(doc, 180);
  doc
    .fontSize(16)
    .font('Helvetica-Bold')
    .text(
      'There are two important things you need to know about your current coverage and Medicare’s prescription drug coverage:'
    )
    .moveDown()
    .fontSize(12)
    .font('Helvetica')
    .text('1. ', {
      paragraphGap: 10,
      indent: 10,
      indentAllLines: true,
      continued: true,
    })
    .font('Helvetica-Bold')
    .text('Medicare prescription drug coverage ', {
      continued: true,
      indentAllLines: false,
    })
    .font('Helvetica')
    .text('became available in 2006 to everyone with Medicare.', {
      indentAllLines: false,
    });

  bulletParagraph(doc, [
    { text: 'You can get this coverage if you join a ', bold: false },
    { text: 'Medicare Prescription Drug Plan ', bold: true },
    { text: 'or a ', bold: false },
    { text: 'Medicare Advantage Plan ', bold: true },
    {
      text: '(like an HMO or PPO) that offers prescription drug coverage.',
      bold: false,
    },
  ]);

  bulletParagraph(doc, [
    {
      text: 'All Medicare drug plans provide at least a standard level of coverage set by Medicare.',
      bold: false,
    },
  ]);

  bulletParagraph(doc, [
    {
      text: 'Some plans may also offer more coverage for a higher monthly premium.',
      bold: false,
    },
  ]);

  doc
    .moveDown(0.5)
    .text('2. ', {
      paragraphGap: 10,
      indent: 10,
      indentAllLines: true,
      continued: true,
    })
    .font('Helvetica-Bold')
    .text(`${plan.company.name}`, { continued: true, indentAllLines: false })
    .font('Helvetica')
    .text(
      ' has determined that the prescription drug coverage offered by the ',
      { continued: true, indentAllLines: false }
    )
    .font('Helvetica-Bold')
    .text(`${plan.name}`, { continued: true, indentAllLines: false })
    .font('Helvetica')
    .text(
      ' is, on average for all plan participants, expected to pay out as much as standard Medicare prescription drug coverage pays and is therefore considered ',
      { continued: true, indentAllLines: false }
    )
    .font('Helvetica-Bold')
    .text('Creditable Coverage.')
    .font('Helvetica')
    .text(
      'Because your existing coverage is Creditable Coverage, you can keep this coverage and ',
      { continued: true, indent: 10, indentAllLines: true }
    )
    .font('Helvetica-Bold')
    .text('not pay a higher premium (a penalty) ', {
      continued: true,
      indentAllLines: false,
    })
    .font('Helvetica')
    .text('if you later decide to join a Medicare drug plan.')
    .moveDown(2);

  // Third Section
  ensureSpace(doc, 120);
  doc
    .fontSize(16)
    .font('Helvetica-Bold')
    .text('When Can You Join a Medicare Drug Plan?')
    .moveDown()
    .fontSize(12)
    .font('Helvetica')
    .text('You can join a Medicare drug plan:')
    .moveDown();

  bulletParagraph(doc, [
    { text: 'When you first become eligible for Medicare, and', bold: false },
  ]);

  bulletParagraph(doc, [
    { text: 'Each year from', bold: false },
    { text: ' October 15 to December 7.', bold: true },
  ]);

  doc
    .moveDown()
    .font('Helvetica')
    .text(
      'If you lose your current creditable prescription drug coverage, through no fault of your own, you will also be eligible for a ',
      { continued: true }
    )
    .font('Helvetica-Bold')
    .text('two (2) month Special Enrollment Period (SEP) ', { continued: true })
    .font('Helvetica')
    .text('to join a Medicare drug plan.')
    .moveDown(2);

  // Fourth Section
  ensureSpace(doc, 80);
  doc
    .fontSize(16)
    .font('Helvetica-Bold')
    .text(
      'What Happens to Your Current Coverage If You Join a Medicare Drug Plan?'
    )
    .moveDown()
    .fontSize(12)
    .font('Helvetica')
    .text('If you decide to join a Medicare drug plan, your current ', {
      continued: true,
    })
    .font('Helvetica-Bold')
    .text(`${plan.company.name}`, { continued: true })
    .font('Helvetica')
    .text(' coverage ', { continued: true })
    .font('Helvetica-Bold')
    .text('will [or will not] ', { continued: true })
    .font('Helvetica')
    .text('be affected. ')
    .moveDown()
    .text(
      'If you do decide to join a Medicare drug plan and drop your current ',
      {
        continued: true,
      }
    )
    .font('Helvetica-Bold')
    .text(`${plan.company.name}`, { continued: true })
    .font('Helvetica')
    .text(' coverage, be aware that you and your dependents ', {
      continued: true,
    })
    .font('Helvetica-Bold')
    .text('will [or will not] ', { continued: true })
    .font('Helvetica-Oblique')
    .text('(Medigap issuers must insert “will not”) ', { continued: true })
    .font('Helvetica')
    .text('be able to get this coverage back.')
    .moveDown(2);

  // Fifth Section
  ensureSpace(doc, 100);
  doc
    .fontSize(16)
    .font('Helvetica-Bold')
    .text(
      'When Will You Pay a Higher Premium (Penalty) to Join a Medicare Drug Plan?'
    )
    .moveDown()
    .fontSize(12)
    .font('Helvetica')
    .text(
      'You should know that if you drop or lose your current coverage with ',
      { continued: true }
    )
    .font('Helvetica-Bold')
    .text(plan.company.name, { continued: true })
    .font('Helvetica')
    .text(' and don’t join a Medicare drug plan within ', { continued: true })
    .font('Helvetica-Bold')
    .text('63 continuous days ', { continued: true })
    .font('Helvetica')
    .text(
      'after your current coverage ends, you may pay a higher premium (a penalty) to join a Medicare drug plan later.'
    )
    .moveDown();

  bulletParagraph(doc, [
    { text: 'If you go ', bold: false },
    { text: '63 continuous days or longer ', bold: true },
    {
      text: 'without creditable prescription drug coverage, your monthly premium may go up by ',
      bold: false,
    },
    {
      text: 'at least 1% of the Medicare base beneficiary premium per month ',
      bold: true,
    },
    { text: 'for every month you did not have that coverage.', bold: false },
  ]);

  bulletParagraph(doc, [
    {
      text: 'Example: If you go 19 months without creditable coverage, your premium may be ',
      bold: false,
    },
    { text: '19% higher ', bold: true },
    {
      text: 'than the Medicare base beneficiary premium.',
      bold: false,
    },
  ]);

  bulletParagraph(doc, [
    {
      text: 'You may have to pay this higher premium as long as you have Medicare prescription drug coverage, and you may have to wait until the following October to join.',
      bold: false,
    },
  ]);

  doc.moveDown(2);

  // Sixth Section
  ensureSpace(doc, 80);
  doc
    .fontSize(16)
    .font('Helvetica-Bold')
    .text('For More Information About This Notice or Your Current Coverage')
    .moveDown()
    .fontSize(12)
    .font('Helvetica')
    .text('Contact the person listed below for further information, or call ', {
      continued: true,
    })
    .font('Helvetica-Bold')
    .text(plan.company.contactName ?? '[Insert Alternative Contact]', {
      continued: true,
    })
    .font('Helvetica')
    .text(' at ', { continued: true })
    .font('Helvetica-Bold')
    .text((plan.company.phoneNumber ?? '[(XXX) XXX-XXXX]') + '.')
    .moveDown()
    .font('Helvetica')
    .text(
      'You’ll receive this notice each year, before the next period you can join a Medicare drug plan, and if your coverage through ',
      {
        indent: 10,
        indentAllLines: true,
        continued: true,
      }
    )
    .font('Helvetica-Bold')
    .text(plan.company.name, { continued: true, indentAllLines: false })
    .font('Helvetica')
    .text(' changes. You may also request a copy of this notice at any time.')
    .moveDown(2);

  // Seventh Section
  ensureSpace(doc, 120);
  doc
    .fontSize(16)
    .font('Helvetica-Bold')
    .text(
      'For More Information About Your Options Under Medicare Prescription Drug Coverage'
    )
    .moveDown()
    .fontSize(12)
    .font('Helvetica')
    .text(
      'More detailed information about Medicare plans that offer prescription drug coverage is in the ',
      { continued: true }
    )
    .font('Helvetica-Bold')
    .text('“Medicare & You” handbook', { continued: true })
    .font('Helvetica')
    .text(
      ', mailed annually by Medicare. You may also be contacted directly by Medicare drug plans.'
    )
    .moveDown()
    .text('For more information about Medicare prescription drug coverage:')
    .moveDown();

  bulletParagraph(doc, [
    { text: 'Visit ', bold: false },
    { text: 'www.medicare.gov', bold: true, link: 'www.medicare.gov' },
  ]);

  bulletParagraph(doc, [
    {
      text: 'Call your ',
      bold: false,
    },
    { text: 'State Health Insurance Assistance Program ', bold: true },
    {
      text: '(see the inside back cover of “Medicare & You” for their phone number)',
      bold: false,
    },
  ]);

  bulletParagraph(doc, [
    {
      text: 'Call ',
      bold: false,
    },
    {
      text: '1-800-MEDICARE (1-800-633-4227) ',
      bold: true,
    },
    {
      text: ' |  TTY users: ',
      bold: false,
    },
    {
      text: '1-877-486-2048',
      bold: true,
    },
  ]);

  doc
    .font('Helvetica')
    .text(
      'If you have limited income and resources, extra help paying for Medicare prescription drug coverage is available.'
    )
    .text('For details, visit ', { continued: true })
    .text('www.socialsecurity.gov', {
      continued: true,
      link: 'www.socialsecurity.gov',
    })
    .text(' or call ', { continued: true })
    .font('Helvetica-Bold')
    .text('1-800-772-1213', { continued: true })
    .font('Helvetica')
    .text(' (TTY: ', { continued: true })
    .font('Helvetica-Bold')
    .text('1-800-325-0778', { continued: true })
    .font('Helvetica')
    .text(').')
    .moveDown(2);

  // Eighth Section
  ensureSpace(doc, 60);
  doc
    .fontSize(16)
    .font('Helvetica-Bold')
    .text('Keep This Notice')
    .moveDown()
    .fontSize(12)
    .font('Helvetica')
    .text(
      'You may be required to provide a copy of this notice when you join a Medicare drug plan to show whether or not you have maintained creditable coverage — which determines if you will pay a higher premium (penalty).'
    );
}

function generateNonCreditableNotice(
  doc: PDFKit.PDFDocument,
  plan: PlanWithCompany
) {
  doc
    .fontSize(20)
    .font('Helvetica-Bold')
    .text(`Important Notice from ${plan.company?.name}`, { align: 'center' });
  doc.moveDown();

  // First Section
  ensureSpace(doc, 180);
  doc
    .fontSize(14)
    .font('Helvetica-Bold')
    .text('About Your Prescription Drug Coverage and Medicare', {
      align: 'center',
    })
    .moveDown()
    .fontSize(12)
    .font('Helvetica')
    .text(
      'Please read this notice carefully and keep it where you can find it. This notice has information about your current prescription drug coverage with ',
      { continued: true }
    )
    .font('Helvetica-Bold')
    .text(`${plan.company.name || 'your employer'}`, {
      continued: true,
    })
    .font('Helvetica')
    .text(' and about your options under ', { continued: true })
    .font('Helvetica-Bold')
    .text('Medicare’s prescription drug coverage.')
    .moveDown()
    .font('Helvetica')
    .text(
      'This information can help you decide whether or not you want to join a Medicare drug plan. If you are considering joining, you should compare your current coverage — including which drugs are covered and at what cost — with the coverage and costs of the plans offering Medicare prescription drug coverage in your area.'
    )
    .moveDown()
    .text(
      'Information about where you can get help to make decisions about your prescription drug coverage is at the end of this notice.'
    )
    .moveDown(2);

  // Second Section
  ensureSpace(doc, 180);
  doc
    .fontSize(16)
    .font('Helvetica-Bold')
    .text(
      'There are two important things you need to know about your current coverage and Medicare’s prescription drug coverage:'
    )
    .moveDown()
    .fontSize(12)
    .font('Helvetica')
    .text('1. ', {
      paragraphGap: 10,
      continued: true,
      indent: 10,
      indentAllLines: true,
    })
    .font('Helvetica-Bold')
    .text('Medicare prescription drug coverage ', {
      continued: true,
      indentAllLines: false,
    })
    .font('Helvetica')
    .text('became available in 2006 to everyone with Medicare.', {
      indentAllLines: false,
    });

  bulletParagraph(doc, [
    { text: 'You can get this coverage if you join a ', bold: false },
    { text: 'Medicare Prescription Drug Plan ', bold: true },
    { text: 'or a ', bold: false },
    { text: 'Medicare Advantage Plan ', bold: true },
    {
      text: '(like an HMO or PPO) that offers prescription drug coverage.',
      bold: false,
    },
  ]);

  bulletParagraph(doc, [
    {
      text: 'All Medicare drug plans provide at least a standard level of coverage set by Medicare.',
      bold: false,
    },
  ]);

  bulletParagraph(doc, [
    {
      text: 'Some plans may also offer more coverage for a higher monthly premium.',
      bold: false,
    },
  ]);

  doc
    .moveDown(0.5)
    .text('2. ', {
      paragraphGap: 10,
      continued: true,
      indent: 10,
      indentAllLines: true,
    })
    .font('Helvetica-Bold')
    .text(`${plan.company.name}`, { continued: true, indentAllLines: false })
    .font('Helvetica')
    .text(
      ' has determined that the prescription drug coverage offered by the ',
      { continued: true, indentAllLines: false }
    )
    .font('Helvetica-Bold')
    .text(`${plan.name}`, { continued: true, indentAllLines: false })
    .font('Helvetica')
    .text(' is, on average for all plan participants,', {
      continued: true,
      indentAllLines: false,
    })
    .font('Helvetica-Bold')
    .text(' expected to pay out less than', {
      continued: true,
      indentAllLines: false,
    })
    .font('Helvetica')
    .text(
      ' standard Medicare prescription drug coverage pays and is therefore considered ',
      { continued: true, indentAllLines: false }
    )
    .font('Helvetica-Bold')
    .text('Non-Creditable Coverage.', { indentAllLines: false })
    .font('Helvetica')
    .text('Because your existing coverage is ', {
      continued: true,
      indent: 10,
      indentAllLines: true,
    })
    .font('Helvetica-Bold')
    .text('Non-Creditable, ', { continued: true, indentAllLines: false })
    .font('Helvetica')
    .text('you may ', { continued: true, indentAllLines: false })
    .font('Helvetica-Bold')
    .text('pay a higher premium (a penalty) ', {
      continued: true,
      indentAllLines: false,
    })
    .font('Helvetica')
    .text(
      'if you later decide to join a Medicare drug plan later and go 63 days or longer without Creditable Coverage.',
      { indentAllLines: false }
    )
    .moveDown(2);

  // Third Section
  ensureSpace(doc, 120);
  doc
    .fontSize(16)
    .font('Helvetica-Bold')
    .text('When Can You Join a Medicare Drug Plan?')
    .moveDown()
    .fontSize(12)
    .font('Helvetica')
    .text('You can join a Medicare drug plan:')
    .moveDown();

  bulletParagraph(doc, [
    { text: 'When you first become eligible for Medicare, and', bold: false },
  ]);

  bulletParagraph(doc, [
    { text: 'Each year from', bold: false },
    { text: ' October 15 to December 7.', bold: true },
  ]);

  doc
    .moveDown()
    .font('Helvetica')
    .text(
      'If you lose your current creditable prescription drug coverage, through no fault of your own, you will also be eligible for a ',
      { continued: true }
    )
    .font('Helvetica-Bold')
    .text('two (2) month Special Enrollment Period (SEP) ', { continued: true })
    .font('Helvetica')
    .text('to join a Medicare drug plan.')
    .moveDown(2);

  // Fourth Section
  ensureSpace(doc, 80);
  doc
    .fontSize(16)
    .font('Helvetica-Bold')
    .text(
      'What Happens to Your Current Coverage If You Join a Medicare Drug Plan?'
    )
    .moveDown()
    .fontSize(12)
    .font('Helvetica')
    .text('If you decide to join a Medicare drug plan, your current ', {
      continued: true,
    })
    .font('Helvetica-Bold')
    .text(`${plan.company.name}`, { continued: true })
    .font('Helvetica')
    .text(' coverage ', { continued: true })
    .font('Helvetica-Bold')
    .text('will [or will not] ', { continued: true })
    .font('Helvetica')
    .text('be affected. ')
    .moveDown()
    .text(
      'If you do decide to join a Medicare drug plan and drop your current ',
      {
        continued: true,
      }
    )
    .font('Helvetica-Bold')
    .text(`${plan.company.name}`, { continued: true })
    .font('Helvetica')
    .text(' coverage, be aware that you and your dependents ', {
      continued: true,
    })
    .font('Helvetica-Bold')
    .text('will [or will not] ', { continued: true })
    .font('Helvetica-Oblique')
    .text('(Medigap issuers must insert “will not”) ', { continued: true })
    .font('Helvetica')
    .text('be able to get this coverage back.')
    .moveDown(2);

  // Fifth Section
  ensureSpace(doc, 100);
  doc
    .fontSize(16)
    .font('Helvetica-Bold')
    .text(
      'When Will You Pay a Higher Premium (Penalty) to Join a Medicare Drug Plan?'
    )
    .moveDown()
    .fontSize(12)
    .font('Helvetica')
    .text('If you drop or lose your current coverage with ', {
      continued: true,
    })
    .font('Helvetica-Bold')
    .text(plan.company.name, { continued: true })
    .font('Helvetica')
    .text(' and don’t join a Medicare drug plan within ', { continued: true })
    .font('Helvetica-Bold')
    .text('63 continuous days ', { continued: true })
    .font('Helvetica')
    .text('after your current coverage ends, you may pay a ', {
      continued: true,
    })
    .font('Helvetica-Bold')
    .text('late-enrollment penalty ', { continued: true })
    .font('Helvetica')
    .text('when you join a Medicare drug plan later.')
    .moveDown();

  bulletParagraph(doc, [
    {
      text: 'For each month you go without Creditable Coverage, your monthly premium may increase by ',
      bold: false,
    },
    {
      text: 'at least 1% of the Medicare base beneficiary premium.',
      bold: true,
    },
  ]);

  bulletParagraph(doc, [
    {
      text: 'Example: If you go 19 months without creditable coverage, your premium may be ',
      bold: false,
    },
    { text: 'at least 19% higher ', bold: true },
    {
      text: 'than the Medicare base beneficiary premium.',
      bold: false,
    },
  ]);

  bulletParagraph(doc, [
    {
      text: 'You may have to pay this higher premium as long as you have Medicare prescription drug coverage, and you may have to wait until the next enrollment period (October 15 – December 7) to join.',
      bold: false,
    },
  ]);

  doc.moveDown(2);

  // Sixth Section
  ensureSpace(doc, 80);
  doc
    .fontSize(16)
    .font('Helvetica-Bold')
    .text('For More Information About This Notice or Your Current Coverage')
    .moveDown()
    .fontSize(12)
    .font('Helvetica')
    .text('Contact the person listed below for further information, or call ', {
      continued: true,
    })
    .font('Helvetica-Bold')
    .text(plan.company.contactName ?? '[Insert Alternative Contact]', {
      continued: true,
    })
    .font('Helvetica')
    .text(' at ', { continued: true })
    .font('Helvetica-Bold')
    .text((plan.company.phoneNumber ?? '[(XXX) XXX-XXXX]') + '.')
    .moveDown()
    .font('Helvetica')
    .text(
      'You’ll receive this notice each year, before the next period you can join a Medicare drug plan, and if your coverage through ',
      {
        indent: 10,
        indentAllLines: true,
        continued: true,
      }
    )
    .font('Helvetica-Bold')
    .text(plan.company.name, { continued: true, indentAllLines: false })
    .font('Helvetica')
    .text(' changes. You may also request a copy of this notice at any time.')
    .moveDown(2);

  // Seventh Section
  ensureSpace(doc, 120);
  doc
    .fontSize(16)
    .font('Helvetica-Bold')
    .text(
      'For More Information About Your Options Under Medicare Prescription Drug Coverage'
    )
    .moveDown()
    .fontSize(12)
    .font('Helvetica')
    .text(
      'More detailed information about Medicare plans that offer prescription drug coverage is in the ',
      { continued: true }
    )
    .font('Helvetica-Bold')
    .text('“Medicare & You” handbook', { continued: true })
    .font('Helvetica')
    .text(
      ', mailed annually by Medicare. You may also be contacted directly by Medicare drug plans.'
    )
    .moveDown()
    .text('For more information about Medicare prescription drug coverage:')
    .moveDown();

  bulletParagraph(doc, [
    { text: 'Visit ', bold: false },
    { text: 'www.medicare.gov', bold: true, link: 'www.medicare.gov' },
  ]);

  bulletParagraph(doc, [
    {
      text: 'Call your ',
      bold: false,
    },
    { text: 'State Health Insurance Assistance Program ', bold: true },
    {
      text: '(see the inside back cover of “Medicare & You” for their phone number)',
      bold: false,
    },
  ]);

  bulletParagraph(doc, [
    {
      text: 'Call ',
      bold: false,
    },
    {
      text: '1-800-MEDICARE (1-800-633-4227) ',
      bold: true,
    },
    {
      text: ' |  TTY users: ',
      bold: false,
    },
    {
      text: '1-877-486-2048',
      bold: true,
    },
  ]);

  doc
    .font('Helvetica')
    .text(
      'If you have limited income and resources, extra help paying for Medicare prescription drug coverage is available.'
    )
    .text('For details, visit ', { continued: true })
    .text('www.socialsecurity.gov', {
      continued: true,
      link: 'www.socialsecurity.gov',
    })
    .text(' or call ', { continued: true })
    .font('Helvetica-Bold')
    .text('1-800-772-1213', { continued: true })
    .font('Helvetica')
    .text(' (TTY: ', { continued: true })
    .font('Helvetica-Bold')
    .text('1-800-325-0778', { continued: true })
    .font('Helvetica')
    .text(').')
    .moveDown(2);

  // Eighth Section
  ensureSpace(doc, 60);
  doc
    .fontSize(16)
    .font('Helvetica-Bold')
    .text('Keep This Notice')
    .moveDown()
    .fontSize(12)
    .font('Helvetica')
    .text(
      'You may be required to provide a copy of this notice when you join a Medicare drug plan to show whether or not you have maintained creditable coverage — which determines if you will pay a higher premium (penalty).'
    );
}

function ensureSpace(doc: PDFKit.PDFDocument, neededHeight: number) {
  const FOOTER_HEIGHT = 50;

  const remaining = doc.page.height - doc.y - doc.page.margins.bottom;
  if (remaining < neededHeight + FOOTER_HEIGHT) {
    doc.addPage();
  }
}

function bulletParagraph(doc: PDFKit.PDFDocument, parts: any[]) {
  const startX = doc.x;
  const y = doc.y;

  // Draw bullet
  doc.save();
  doc.circle(startX + 20, y + 4, 2).stroke();
  doc.restore();

  // Set indent for text
  const indent = startX + 40;
  doc.x = indent;

  // Write text fragments
  for (let i = 0; i < parts.length; i++) {
    const p = parts[i];
    doc.font(p.bold ? 'Helvetica-Bold' : 'Helvetica');
    doc.text(p.text, {
      continued: i < parts.length - 1,
      link: p.link || null,
    });
  }

  // Finish the line
  doc.text('');

  // Controlled spacing — small and predictable
  doc.moveDown(0.25);

  // Reset left margin
  doc.x = startX;
}

function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1).toLocaleLowerCase();
}

export default router;
