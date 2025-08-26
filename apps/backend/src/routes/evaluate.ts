import { Router } from 'express';
import { ActuarialAssumptions, evaluatePlan } from '../rule-engine';
import { DeterminationMethod } from '@prisma/client';

const router = Router() as Router;

router.post('/', (req, res) => {
  const { plan, method }: { plan: any; method?: DeterminationMethod } =
    req.body;
  console.log(req.body);

  if (!plan) {
    return res.status(400).json({ message: 'Missing plan input' });
  }

  const result = evaluatePlan(
    plan,
    method || 'ACTUARIAL',
    {} as ActuarialAssumptions
  );
  return res.json(result);
});

export default router;
