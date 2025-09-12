import { ActuarialAssumptionsInput } from '../components/layout/ActuarialAssumptionsModal';

export interface PlanFormData {
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

  t1CapValue: number;
  t2CapValue: number;
  t3CapValue: number;
  t4CapValue: number;

  evaluationMethod: 'ACTUARIAL' | 'SIMPLIFIED';

  actuarialAssumptions: ActuarialAssumptionsInput;
}
