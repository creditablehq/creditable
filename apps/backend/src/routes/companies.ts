// apps/backend/src/routes/companies.ts
import { Router } from 'express';
import { prisma } from '../lib/prisma';
import { authMiddleware } from '../middleware/auth'; // assumes JWT-based auth middleware
import { evaluatePlan } from '../../../../packages/rule-engine';

const router = Router();

// Apply auth middleware to all company routes
router.use(authMiddleware);

// GET /companies - list all companies for this broker
router.get('/', async (req, res) => {
  try {
    const companies = await prisma.company.findMany({
      where: {
        brokerId: req?.user?.brokerId,
      },
      include: {
        user: true,
        plans: true,
      },
      orderBy: { createdAt: 'desc' },
    });
    res.json(companies);
  } catch (error) {
    console.error('[GET /companies]', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// POST /companies - create new company
router.post('/', async (req, res) => {
  const user = req.user;
  const { name } = req.body;

  if (!user?.brokerId) {
    return res.status(403).json({ message: 'Broker access required' });
  }

  if (!name || name.trim().length === 0) {
    return res.status(400).json({ message: 'Company name is required' });
  }

  const company = await prisma.company.create({
    data: {
      name: name.trim(),
      brokerId: user.brokerId,
      userId: user.id,
    },
  });

  res.status(201).json(company);
});

// GET /companies/:id - fetch a single company if it belongs to the broker
router.get('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const company = await prisma.company.findFirst({
      where: {
        id,
        brokerId: req?.user?.brokerId,
      },
    });

    if (!company) return res.status(404).json({ message: 'Company not found' });

    res.json(company);
  } catch (error) {
    console.error(`[GET /companies/${id}]`, error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// PUT /companies/:id - update a company if it belongs to the broker
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  try {
    const company = await prisma.company.findFirst({
      where: {
        id,
        brokerId: req?.user?.brokerId,
      },
    });

    if (!company) return res.status(404).json({ message: 'Company not found' });

    const updated = await prisma.company.update({
      where: { id },
      data: { name },
    });

    res.json(updated);
  } catch (error) {
    console.error(`[PUT /companies/${id}]`, error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// DELETE /companies/:id - delete a company if it belongs to the broker
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const company = await prisma.company.findFirst({
      where: {
        id,
        brokerId: req?.user?.brokerId,
      },
    });

    if (!company) return res.status(404).json({ message: 'Company not found' });

    await prisma.company.delete({ where: { id } });
    res.status(204).send();
  } catch (error) {
    console.error(`[DELETE /companies/${id}]`, error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// GET /api/companies/:companyId/plans
router.get('/:companyId/plans', async (req, res) => {
  const { companyId } = req.params;

  try {
    const plans = await prisma.plan.findMany({
      where: { companyId },
      include: {
        evaluations: true,
      },
      orderBy: { year: 'desc' },
    });

    res.json(plans);
  } catch (error) {
    console.error(`[GET /${companyId}/plans]`, error);
    res.status(500).json({ message: 'Failed to fetch plans' });
  }
});

// Create Plan for a Company
router.post('/:companyId/plans', async (req, res) => {
  const { companyId } = req.params;
  const {
    name,
    year,
    type,
    deductible,
    moop,
    monthlyPremiumRx,
    integratedDeductible,
    t1CostSharingType,
    t2CostSharingType,
    t3CostSharingType,
    t4CostSharingType,
    t1ShareValue,
    t2ShareValue,
    t3ShareValue,
    t4ShareValue,
    t1UsesDeductible,
    t2UsesDeductible,
    t3UsesDeductible,
    t4UsesDeductible,
    evaluationMethod,
    actuarialAssumptions,
  } = req.body;
  const { id } = req.user || {};

  try {
    const company = await prisma.company.findUnique({
      where: { id: companyId },
    });
    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }

    const evaluation = evaluationMethod
      ? evaluatePlan(req.body, evaluationMethod, actuarialAssumptions)
      : undefined;

    const filteredEvaluation = evaluation !== undefined ? [evaluation] : [];

    const plan = await prisma.plan.create({
      data: {
        name,
        year,
        type,
        deductible,
        moop,
        monthlyPremiumRx,
        integratedDeductible,
        t1CostSharingType,
        t2CostSharingType,
        t3CostSharingType,
        t4CostSharingType,
        t1ShareValue,
        t2ShareValue,
        t3ShareValue,
        t4ShareValue,
        t1UsesDeductible,
        t2UsesDeductible,
        t3UsesDeductible,
        t4UsesDeductible,
        evaluations: {
          create: filteredEvaluation.map((e) => ({
            method: e.method,
            actuarialValue: e.actuarialPercentage,
            actuarialAssumptions: e.actuarialAssumptions,
            isCreditable: e.isCreditable,
            result: e.result,
            reasoning: e.reasoning,
          })),
        },
        company: {
          connect: { id: companyId },
        },
        user: {
          connect: { id },
        },
      },
    });

    return res.status(201).json(plan);
  } catch (error) {
    console.error(`[POST /${companyId}/plans]`, error);
    return res.status(500).json({ message: 'Failed to create plan' });
  }
});

export default router;
