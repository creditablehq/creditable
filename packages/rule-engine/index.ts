export type DeterminationMethod = 'SIMPLIFIED' | 'ACTUARIAL';
export type CreditabilityStatus = 'CREDITABLE' | 'NON_CREDITABLE' | 'UNKNOWN';

export interface PlanInput {
  name: string;
  year: number;
  type: 'STANDARD' | 'HIGH_DEDUCTIBLE';
  deductible: number;
  moop: number;
  monthlyPremiumRx: number;
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
  annualFillsPerTier: number;
  exposureScalingFactor: number;
  defaultBrandFillCounter: number;
  estimatedAnnualFills: number;
  rxDeductibleAllocation: number;
  t4ExpectedFillScaler: number;
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
    annualFillsPerTier: number;
    exposureScalingFactor: number;
    defaultBrandFillCounter: number;
    estimatedAnnualFills: number;
    rxDeductibleAllocation: number;
    t4ExpectedFillScaler: number;
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
    t1Utilization: 0.65,
    t2Utilization: 0.25,
    t3Utilization: 0.07,
    t4Utilization: 0.03,
    t1FillCost: 20,
    t2FillCost: 100,
    t3FillCost: 250,
    t4FillCost: 5000,
    annualFillsPerTier: 12,
    exposureScalingFactor: 3.5,
    defaultBrandFillCounter: 10,
    estimatedAnnualFills: 42,
    rxDeductibleAllocation: 0.2,
    t4ExpectedFillScaler: 0.5,
  } as ActuarialAssumptions,
};

const ACTUARIAL_COVERAGE_EXPECTATION = 0.72;

/**
 * Simplified rule evaluation for Medicare Part D creditability.
 */
export function evaluatePlan(
  plan: PlanInput | any,
  method: DeterminationMethod,
  actuarialAssumptions: ActuarialAssumptions // TODO: type this
): EvaluationResult {
  const actuarialAssumptionsConfig = {
    ...defaultActuarialConstants.ActuarialAssumptions,
    ...actuarialAssumptions,
  };

  console.log(
    'EVALUATING PLAN WITH PASSED ASSUMPTIONS: ',
    actuarialAssumptionsConfig
  );

  if (method === 'SIMPLIFIED') {
    return evaluateSimplified(plan, actuarialAssumptionsConfig);
  } else if (method === 'ACTUARIAL') {
    return evaluateActuarial(plan, actuarialAssumptionsConfig);
  }

  return {
    method,
    result: 'UNKNOWN',
    actuarialPercentage: 0,
    actuarialAssumptions: {} as ActuarialAssumptions,
    isCreditable: false,
    reasoning: 'Unsupported evaluation method',
  };
}

function evaluateActuarial(
  plan: PlanInput,
  actuarialAssumptions: ActuarialAssumptions
): EvaluationResult {
  const { deductible, moop, monthlyPremiumRx, t1ShareValue } = plan;

  // 🧠 Example rules — replace these with real rules as needed
  const grossCost = calculateGrossCost(actuarialAssumptions);
  const planPays = calculatePlanPays(grossCost, plan, actuarialAssumptions);
  console.log(grossCost, planPays);
  const actuarialPercentage = planPays / grossCost;

  if (actuarialPercentage >= ACTUARIAL_COVERAGE_EXPECTATION) {
    return {
      method: 'ACTUARIAL',
      result: 'CREDITABLE',
      actuarialPercentage: actuarialPercentage,
      actuarialAssumptions: actuarialAssumptions,
      isCreditable: true,
      reasoning:
        'Plan meets simplified thresholds for coverering at least 72% of prescription drug costs.',
    };
  }

  return {
    method: 'ACTUARIAL',
    result: 'NON_CREDITABLE',
    actuarialPercentage: actuarialPercentage,
    actuarialAssumptions: actuarialAssumptions,
    isCreditable: false,
    reasoning:
      'Plan exceeds simplified thresholds or is missing required values.',
  };
}

function evaluateSimplified(
  plan: PlanInput,
  actuarialAssumptions: ActuarialAssumptions
): EvaluationResult {
  // Placeholder logic:
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

/**
 * Gross Cost =
 *    [T1FillCost...T4FillCost]
 *    AM3:AP3 (T1Fills...T4Fills) (TnFills = TnUtil% * EstTotalFills)
 *    Sum(TnFills * TnFillCost)
 *    Ex: SumProduct([20 100 250 500], [.5 * 42, .3 * 42, .15 * 42, .05 * 42])
 *          = SumProduct([20, 100, 250, 500], [21, 12.6, 6.3, 2.1])
 *          = Sum([420, 1260, 1575, 1050])
 *          = 4305
 */
function calculateGrossCost(
  actuarialAssumptions: ActuarialAssumptions
): number {
  const {
    t1FillCost,
    t2FillCost,
    t3FillCost,
    t4FillCost,
    t1Utilization,
    t2Utilization,
    t3Utilization,
    t4Utilization,
    estimatedAnnualFills,
  } = actuarialAssumptions;
  return (
    estimatedAnnualFills *
    [
      t1Utilization * t1FillCost,
      t2Utilization * t2FillCost,
      t3Utilization * t3FillCost,
      t4Utilization * t4FillCost * actuarialAssumptions.t4ExpectedFillScaler,
    ].reduce((acc, curr) => acc + curr, 0)
  );
}

/**
 * Plan Pays =
 *      [Gross Cost - Total Member Pays]
 *
 * Total Member Pays =
 *      Sum([T1MemberPays...T4MemberPays])
 *
 * Tn Member Pays = MIN (
 *                    If (TnCostShare = "coinsurance") {
 *                        TnFills * TnShareValue * TnFillCost
 *                    } else {
 *                        TnFills * TnShareValue
 *                    },
 *                    MOOP
 *                  )
 *
 *
 *
 * TnFills = estimatedTotalFills * TnUtil
 *
 */
function calculatePlanPays(
  grossCost: number,
  plan: PlanInput,
  actuarialAssumptions: ActuarialAssumptions
): number {
  const { t1ShareValue, t2ShareValue, t3ShareValue, t4ShareValue, moop } = plan;
  const {
    t1Utilization,
    t2Utilization,
    t3Utilization,
    t4Utilization,
    estimatedAnnualFills,
  } = actuarialAssumptions;
  const fillCost = [
    actuarialAssumptions.t1FillCost,
    actuarialAssumptions.t2FillCost,
    actuarialAssumptions.t3FillCost,
    actuarialAssumptions.t4FillCost,
  ];

  // let tnMemberPays = [];
  let tnMemberTotalCost = calculateTnMemberTotalCost(
    plan,
    actuarialAssumptions
  );

  // for (let i = 0; i < 4; i++) {
  //   let n = i + 1;
  //   const costShareType = `t${n}CostSharingType` as keyof PlanInput;
  //   if (plan[costShareType] === 'COINSURANCE') {
  //     tnMemberPays.push(Math.min(tnMemberTotalCost[i] * fillCost[i], moop));
  //   } else {
  //     tnMemberPays.push(Math.min(tnMemberTotalCost[i], moop));
  //   }
  // }

  const totalMemberPays = tnMemberTotalCost.reduce(
    (arr, curr) => arr + curr,
    0
  );
  console.log('======== MEMBER COST ==========', totalMemberPays);

  console.log('plan pays: ', grossCost, tnMemberTotalCost, totalMemberPays);

  return grossCost - totalMemberPays;
}

/**
 * AV% = Plan Pays /  Gross Cost
 */

function calculateTnMemberTotalCost(
  plan: PlanInput,
  actuarialAssumptions: ActuarialAssumptions
): number[] {
  const effectiveDeductible = plan.integratedDeductible
    ? plan.deductible * actuarialAssumptions.rxDeductibleAllocation
    : plan.deductible;
  const estimatedAnnualFills = actuarialAssumptions.estimatedAnnualFills;
  const tnFillTotal = [
    actuarialAssumptions.t1Utilization * estimatedAnnualFills,
    actuarialAssumptions.t2Utilization * estimatedAnnualFills,
    actuarialAssumptions.t3Utilization * estimatedAnnualFills,
    actuarialAssumptions.t4Utilization *
      estimatedAnnualFills *
      actuarialAssumptions.t4ExpectedFillScaler,
  ];
  const fillCost = [
    actuarialAssumptions.t1FillCost,
    actuarialAssumptions.t2FillCost,
    actuarialAssumptions.t3FillCost,
    actuarialAssumptions.t4FillCost,
  ];

  let tnMemberTotalCost = Array.from({ length: 4 }) as number[];
  let memberTierRunningTotal = 0;

  tnMemberTotalCost.forEach((cost, i) => {
    const n = i + 1;
    const usesDeductible = `t${n}UsesDeductible` as keyof PlanInput;
    const tnEffectiveDeductible = plan[usesDeductible]
      ? effectiveDeductible
      : 0;

    if (!usesDeductible) {
      cost = tnFillTotal[i] * fillCost[i];
    } else {
      if (tnEffectiveDeductible >= tnFillTotal[i] * fillCost[i]) {
        cost = tnFillTotal[i] * fillCost[i];
      } else {
        const tnShareType = `t${n}CostSharingType` as keyof PlanInput;
        const tnShareValueKey = `t${n}ShareValue` as keyof PlanInput;
        const tnShareValue = plan[tnShareValueKey] as number;
        const remainingDeductible = Math.max(
          0,
          tnEffectiveDeductible - memberTierRunningTotal
        );
        if (plan[tnShareType] === 'COPAY') {
          cost = remainingDeductible + tnFillTotal[i] * tnShareValue;
        } else {
          cost =
            remainingDeductible +
            (tnFillTotal[i] * fillCost[i] - remainingDeductible) * tnShareValue;
          console.log('cost 330', tnEffectiveDeductible);
        }
      }
    }
    console.log('cost === ', cost);
    tnMemberTotalCost[i] = cost;
    memberTierRunningTotal += cost;
  });

  return tnMemberTotalCost;
}
