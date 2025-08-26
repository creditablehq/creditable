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
/**
 * Simplified rule evaluation for Medicare Part D creditability.
 */
export declare function evaluatePlan(plan: PlanInput | any, method: DeterminationMethod, actuarialAssumptions: ActuarialAssumptions): EvaluationResult;
