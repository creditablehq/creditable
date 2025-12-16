export type DeterminationMethod = 'SIMPLIFIED' | 'ACTUARIAL';
export type CreditabilityStatus = 'CREDITABLE' | 'NON_CREDITABLE' | 'UNKNOWN';

export interface PlanInput {
  name: string;
  year: number;
  type: 'STANDARD' | 'HIGH_DEDUCTIBLE';
  deductible: number;
  moop: number;
  integratedDeductible: boolean;

  t1CostSharingType: 'COPAY' | 'COINSURANCE';
  t2CostSharingType: 'COPAY' | 'COINSURANCE';
  t3CostSharingType: 'COPAY' | 'COINSURANCE';
  t4CostSharingType: 'COPAY' | 'COINSURANCE';

  t1ShareValue: number;
  t2ShareValue: number;
  t3ShareValue: number;
  t4ShareValue: number;

  t1UsesDeductible: boolean;
  t2UsesDeductible: boolean;
  t3UsesDeductible: boolean;
  t4UsesDeductible: boolean;

  t1CapValue: number;
  t2CapValue: number;
  t3CapValue: number;
  t4CapValue: number;
}

// response type
export interface EvaluationResult {
  method: DeterminationMethod;
  result: CreditabilityStatus;
  actuarialPercentage: number;
  actuarialAssumptions: ActuarialAssumptions;
  isCreditable: boolean;
  reasoning: string;
}

export interface ActuarialAssumptions {
  t1Utilization: number;
  t2Utilization: number;
  t3Utilization: number;
  t4Utilization: number;
  t1FillCost: number;
  t2FillCost: number;
  t3FillCost: number;
  t4FillCost: number;
  estimatedAnnualFills: number;
  rxDeductibleAllocation: number;
}

export interface ActuarialConstants {
  planYear: 2024 | 2025 | 2026;
  CMS: {
    cmsDeductible: number;
    cmsMoop: number;
    cmsAVThreshold: number;
    targetGrossCost: number;
  };
  ActuarialAssumptions: {
    t1Utilization: number;
    t2Utilization: number;
    t3Utilization: number;
    t4Utilization: number;
    t1FillCost: number;
    t2FillCost: number;
    t3FillCost: number;
    t4FillCost: number;
    estimatedAnnualFills: number;
    rxDeductibleAllocation: number;
  };
}

const defaultActuarialConstants: ActuarialConstants = {
  planYear: 2025,
  CMS: {
    cmsDeductible: 610,
    cmsMoop: 2100,
    cmsAVThreshold: 0.72,
    targetGrossCost: 5500,
  },
  ActuarialAssumptions: {
    t1Utilization: 0.722,
    t2Utilization: 0.227,
    t3Utilization: 0.036,
    t4Utilization: 0.016,
    t1FillCost: 27,
    t2FillCost: 130,
    t3FillCost: 325,
    t4FillCost: 6000,
    estimatedAnnualFills: 45,
    rxDeductibleAllocation: 0.2,
  } as ActuarialAssumptions,
};

const ACTUARIAL_COVERAGE_EXPECTATION = 0.72;

export function evaluatePlan(
  plan: PlanInput,
  method: DeterminationMethod,
  actuarialAssumptions: ActuarialAssumptions
): EvaluationResult {
  const mergedAssumptions = {
    ...defaultActuarialConstants.ActuarialAssumptions,
    ...actuarialAssumptions,
  };
  console.log('HERE', mergedAssumptions, method);
  if (method === 'SIMPLIFIED') {
    return evaluateSimplified(plan, mergedAssumptions);
  }

  if (method === 'ACTUARIAL') {
    return evaluateActuarial(plan, mergedAssumptions);
  }

  return {
    method,
    result: 'UNKNOWN',
    actuarialPercentage: 0,
    actuarialAssumptions: mergedAssumptions,
    isCreditable: false,
    reasoning: 'Unsupported evaluation method',
  };
}

function evaluateActuarial(
  plan: PlanInput,
  assumptions: ActuarialAssumptions
): EvaluationResult {
  const grossCost = calculateGrossCost(assumptions);
  const planPays = calculatePlanPays(grossCost, plan, assumptions);
  const actuarialPercentage = planPays / grossCost;

  const isCreditable = actuarialPercentage >= ACTUARIAL_COVERAGE_EXPECTATION;

  console.log(
    `Calculated AV %: ${actuarialPercentage}\nPlan Pays: ${planPays}\nGross Cost: ${grossCost}`
  );

  return {
    method: 'ACTUARIAL',
    result: isCreditable ? 'CREDITABLE' : 'NON_CREDITABLE',
    actuarialPercentage,
    actuarialAssumptions: assumptions,
    isCreditable,
    reasoning: isCreditable
      ? 'Plan meets actuarial requirements (≥72%).'
      : 'Plan fails actuarial requirement (<72%).',
  };
}

function evaluateSimplified(
  plan: PlanInput,
  actuarialAssumptions: ActuarialAssumptions
): EvaluationResult {
  const averageTierShare =
    (plan.t1ShareValue +
      plan.t2ShareValue +
      plan.t3ShareValue +
      plan.t4ShareValue) /
    4;

  if (averageTierShare <= 40) {
    return {
      method: 'SIMPLIFIED',
      result: 'CREDITABLE',
      actuarialPercentage: 0,
      actuarialAssumptions: actuarialAssumptions,
      isCreditable: true,
      reasoning:
        'Based on average tier share, the plan is likely actuarially equivalent or better.',
    };
  }

  return {
    method: 'SIMPLIFIED',
    result: 'NON_CREDITABLE',
    actuarialPercentage: 0,
    actuarialAssumptions: actuarialAssumptions,
    isCreditable: false,
    reasoning:
      'Actuarial modeling indicates the plan does not meet creditability thresholds.',
  };
}

function calculateGrossCost(a: ActuarialAssumptions): number {
  const t4Util = a.t4Utilization;
  const t1Cost = a.t1Utilization * a.t1FillCost;
  const t2Cost = a.t2Utilization * a.t2FillCost;
  const t3Cost = a.t3Utilization * a.t3FillCost;
  const t4Cost = a.t4Utilization * a.t4FillCost;

  console.log(`T1-4 Cost: ${t1Cost} | ${t2Cost} | ${t3Cost} | ${t4Cost}`);

  return (
    a.estimatedAnnualFills *
    [
      a.t1Utilization * a.t1FillCost,
      a.t2Utilization * a.t2FillCost,
      a.t3Utilization * a.t3FillCost,
      t4Util * a.t4FillCost,
    ].reduce((s, x) => s + x, 0)
  );
}

function calculatePlanPays(
  grossCost: number,
  plan: PlanInput,
  assumptions: ActuarialAssumptions
): number {
  const memberCosts = calculateTierMemberCosts(plan, assumptions);
  const memberTotal = memberCosts.reduce((sum, x) => sum + x, 0);
  console.log(`Tier Member Cost: ${memberCosts}\nMember Total ${memberTotal}`);
  return grossCost - memberTotal;
}

function calculateTierMemberCosts(
  plan: PlanInput,
  a: ActuarialAssumptions
): number[] {
  const fills = [
    a.t1Utilization * a.estimatedAnnualFills,
    a.t2Utilization * a.estimatedAnnualFills,
    a.t3Utilization * a.estimatedAnnualFills,
    a.t4Utilization * a.estimatedAnnualFills,
  ];

  const costs = [a.t1FillCost, a.t2FillCost, a.t3FillCost, a.t4FillCost];

  const gross = fills.map((f, i) => f * costs[i]);

  let remainingDed = plan.integratedDeductible
    ? plan.deductible * a.rxDeductibleAllocation
    : plan.deductible;

  remainingDed = propagateDeductibleThroughTiers(
    plan,
    fills,
    gross,
    remainingDed
  );

  console.log(`Remaining Ded: ${remainingDed}`);

  const t4MemberPays = calculateTier4MemberCost(
    plan,
    fills[3],
    costs[3],
    gross[3],
    remainingDed
  );

  const t1 = calculateTierMemberCost(
    plan,
    fills[0],
    gross[0],
    plan.t1UsesDeductible,
    0
  );
  const t2 = calculateTierMemberCost(
    plan,
    fills[1],
    gross[1],
    plan.t2UsesDeductible,
    1
  );
  const t3 = calculateTierMemberCost(
    plan,
    fills[2],
    gross[2],
    plan.t3UsesDeductible,
    2
  );

  console.log(
    `T1 Member Cost: ${t1}\nT2 Member Pays: ${t2}\nT3 Member Pays: ${t3}\nT4 Member Pays: ${t4MemberPays}`
  );

  return [t1, t2, t3, t4MemberPays];
}

function propagateDeductibleThroughTiers(
  plan: PlanInput,
  fills: number[],
  gross: number[],
  ded: number
): number {
  if (plan.t1UsesDeductible) {
    const t1Consumed = Math.min(gross[0], ded);
    ded -= t1Consumed;
  }

  if (plan.t2UsesDeductible) {
    const t2Consumed = Math.min(gross[1], ded);
    ded -= t2Consumed;
  }

  if (plan.t3UsesDeductible) {
    const t3Consumed = Math.min(gross[2], ded);
    ded -= t3Consumed;
  }

  return ded;
}

function calculateTierMemberCost(
  plan: PlanInput,
  fills: number,
  gross: number,
  usesDed: boolean,
  tierIndex: number
): number {
  const tier = tierIndex + 1;

  const tnCostShareTypeKey = `t${tier}CostSharingType` as keyof PlanInput;
  const tnShareValueKey = `t${tier}ShareValue` as keyof PlanInput;

  const shareType = plan[tnCostShareTypeKey] as 'COPAY' | 'COINSURANCE';
  const shareValue = plan[tnShareValueKey] as number;

  if (usesDed) {
    return Math.min(gross, plan.deductible);
  }

  if (shareType === 'COPAY') {
    return fills * shareValue;
  }

  return gross * shareValue;
}

function calculateTier4MemberCost(
  plan: PlanInput,
  fills: number,
  costPerFill: number,
  gross: number,
  remainingDed: number
): number {
  const usesDed = plan.t4UsesDeductible;
  const costType = plan.t4CostSharingType.toLowerCase();
  const costValue = plan.t4ShareValue;
  const capValue = plan.t4CapValue ?? 0;

  if (!usesDed) {
    if (costType === 'copay') {
      return fills * costValue;
    }

    const coinsUncapped = gross * costValue;
    const capLimit = capValue > 0 ? fills * capValue : Infinity;
    return Math.min(coinsUncapped, capLimit);
  }

  if (remainingDed >= gross) {
    return gross;
  }

  const dedApplied = Math.min(remainingDed, gross);
  const residual = gross - dedApplied;

  if (costType === 'copay') {
    const fillsAbsorbed = dedApplied / costPerFill;
    const remainingFills = fills - fillsAbsorbed;
    const copayAmount = remainingFills * costValue;
    return dedApplied + copayAmount;
  }

  const coinsUncapped = residual * costValue;
  const capLimit = capValue > 0 ? fills * capValue : Infinity;
  const coinsCapped = Math.min(coinsUncapped, capLimit);

  return dedApplied + coinsCapped;
}
