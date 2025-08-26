"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.evaluatePlan = evaluatePlan;
const defaultActuarialConstants = {
    planYear: 2025,
    CMS: {
        cmsDeductible: 590,
        cmsMoop: 2000,
        cmsAVThreshold: 0.6,
        targetGrossCost: 2800,
    },
    ActuarialAssumptions: {
        t1Utilization: 0.5,
        t2Utilization: 0.3,
        t3Utilization: 0.15,
        t4Utilization: 0.05,
        t1FillCost: 20,
        t2FillCost: 100,
        t3FillCost: 250,
        t4FillCost: 500,
        annualFillsPerTier: 12,
        exposureScalingFactor: 3.5,
        defaultBrandFillCounter: 10,
        estimatedAnnualFills: 42,
        rxDeductibleAllocation: 0.33,
    },
};
const ACTUARIAL_COVERAGE_EXPECTATION = 0.72;
/**
 * Simplified rule evaluation for Medicare Part D creditability.
 */
function evaluatePlan(plan, method) {
    if (method === 'SIMPLIFIED') {
        return evaluateSimplified(plan);
    }
    else if (method === 'ACTUARIAL') {
        return evaluateActuarial(plan);
    }
    return {
        method,
        result: 'UNKNOWN',
        isCreditable: false,
        reasoning: 'Unsupported evaluation method',
    };
}
function evaluateSimplified(plan) {
    const { deductible, moop, monthlyPremiumRx, t1ShareValue } = plan;
    // 🧠 Example rules — replace these with real rules as needed
    const grossCost = calculateGrossCost();
    const planPays = calculatePlanPays(grossCost, plan);
    const actuarialPercentage = planPays / grossCost;
    if (actuarialPercentage >= ACTUARIAL_COVERAGE_EXPECTATION) {
        return {
            method: 'SIMPLIFIED',
            result: 'CREDITABLE',
            isCreditable: true,
            reasoning: 'Plan meets simplified thresholds for coverering at least 72% of prescription drug costs.',
        };
    }
    return {
        method: 'SIMPLIFIED',
        result: 'NON_CREDITABLE',
        isCreditable: false,
        reasoning: 'Plan exceeds simplified thresholds or is missing required values.',
    };
}
function evaluateActuarial(plan) {
    // Placeholder logic:
    const averageTierShare = (plan.t1ShareValue +
        plan.t2ShareValue +
        plan.t3ShareValue +
        plan.t4ShareValue) /
        4;
    if (averageTierShare <= 40) {
        return {
            method: 'ACTUARIAL',
            result: 'CREDITABLE',
            isCreditable: true,
            reasoning: 'Based on average tier share, the plan is likely actuarially equivalent or better.',
        };
    }
    return {
        method: 'ACTUARIAL',
        result: 'NON_CREDITABLE',
        isCreditable: false,
        reasoning: 'Actuarial modeling indicates the plan does not meet creditability thresholds.',
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
function calculateGrossCost() {
    const { t1FillCost, t2FillCost, t3FillCost, t4FillCost, t1Utilization, t2Utilization, t3Utilization, t4Utilization, estimatedAnnualFills, } = defaultActuarialConstants.ActuarialAssumptions;
    return (estimatedAnnualFills *
        [
            t1Utilization * t1FillCost,
            t2Utilization * t2FillCost,
            t3Utilization * t3FillCost,
            t4Utilization * t4FillCost,
        ].reduce((acc, curr) => acc + curr, 0));
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
 * TnFills = estimatedTotalFills * TnUtil
 *
 */
function calculatePlanPays(grossCost, plan) {
    const actuarialAssumptions = defaultActuarialConstants.ActuarialAssumptions;
    const { t1ShareValue, t2ShareValue, t3ShareValue, t4ShareValue, moop } = plan;
    const { t1Utilization, t2Utilization, t3Utilization, t4Utilization, estimatedAnnualFills, } = defaultActuarialConstants.ActuarialAssumptions;
    const fillCost = [
        actuarialAssumptions.t1FillCost,
        actuarialAssumptions.t2FillCost,
        actuarialAssumptions.t3FillCost,
        actuarialAssumptions.t4FillCost,
    ];
    let tnMemberPays = [];
    let fillsWithShareValue = [
        estimatedAnnualFills * t1Utilization * t1ShareValue,
        estimatedAnnualFills * t2Utilization * t2ShareValue,
        estimatedAnnualFills * t3Utilization * t3ShareValue,
        estimatedAnnualFills * t4Utilization * t4ShareValue,
    ];
    for (let i = 0; i < 4; i++) {
        let n = i + 1;
        const costShareType = `t${n}CostSharingType`;
        if (plan[costShareType] === 'COINSURANCE') {
            tnMemberPays.push(Math.min(fillsWithShareValue[i] * fillCost[i], moop));
        }
        else {
            tnMemberPays.push(Math.min(fillsWithShareValue[i], moop));
        }
    }
    const totalMemberPays = tnMemberPays.reduce((arr, curr) => arr + curr, 0);
    return grossCost - totalMemberPays;
}
/**
 * AV% = Plan Pays /  Gross Cost
 */
