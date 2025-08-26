// components/plans/PlanForm.tsx

import { useEffect, useState } from 'react';
import { Input } from '../design-system/Input';
import { FormField } from '../design-system/FormField';
import { Button } from '../design-system/Button';
import { Combobox } from '../design-system/Combobox';
import { PlanFormData } from '../../types/plan';
import { createPlan } from '../../api/plans';
import { Label } from '../design-system';
import { ActuarialAssumptionsInput, ActuarialAssumptionsModal } from '../layout/ActuarialAssumptionsModal';

interface PlanFormProps {
  companyId: string;
  onPlanCreated: (plan: any) => void;
}

export function PlanForm({ companyId, onPlanCreated }: PlanFormProps) {
  const [form, setForm] = useState<PlanFormData>({
    name: '',
    year: new Date().getFullYear(),
    type: 'STANDARD',
    deductible: 0,
    moop: 0,
    monthlyPremiumRx: 0,
    integratedDeductible: false,

    t1CostSharingType: 'COPAY',
    t2CostSharingType: 'COPAY',
    t3CostSharingType: 'COPAY',
    t4CostSharingType: 'COPAY',

    t1ShareValue: 0,
    t2ShareValue: 0,
    t3ShareValue: 0,
    t4ShareValue: 0,

    t1UsesDeductible: false,
    t2UsesDeductible: false,
    t3UsesDeductible: false,
    t4UsesDeductible: false,

    evaluationMethod: 'ACTUARIAL',
    actuarialAssumptions: {} as ActuarialAssumptionsInput,
  });

  const [loading, setLoading] = useState(false);
  const [isActuarialAssumtionsModalOpen, setActuarialAssumptionsModalOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (field: string, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const plan = await createPlan(companyId, form);
      onPlanCreated(plan);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <form className="space-y-6" onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField label="Plan Name" htmlFor="name">
            <Input id="name" value={form.name} onChange={(e) => handleChange('name', e.target.value)} />
          </FormField>
          <FormField label="Plan Year" htmlFor="year">
            <Input
              id="year"
              type="number"
              value={form.year}
              onChange={(e) => handleChange('year', parseInt(e.target.value))}
            />
          </FormField>
          <div className="space-y-1">
            <Label htmlFor="type">Plan Type</Label>
            <Combobox
              value={form.type}
              onChange={(value) => handleChange('type', value)}
              options={[
                { value: 'STANDARD', label: 'Standard' },
                { value: 'HIGH_DEDUCTIBLE', label: 'High Deductible' },
              ]}
            />
          </div>
          <FormField label="Monthly Premium (Rx only)" htmlFor="monthlyPremiumRx">
            <Input
              id="monthlyPremiumRx"
              type="number"
              value={form.monthlyPremiumRx}
              onChange={(e) => handleChange('monthlyPremiumRx', parseFloat(e.target.value))}
            />
          </FormField>
          <FormField label="Deductible" htmlFor="deductible">
            <Input
              id="deductible"
              type="number"
              value={form.deductible}
              onChange={(e) => handleChange('deductible', parseFloat(e.target.value))}
            />
          </FormField>
          <FormField label="MOOP" htmlFor="moop">
            <Input
              id="moop"
              type="number"
              value={form.moop}
              onChange={(e) => handleChange('moop', parseFloat(e.target.value))}
            />
          </FormField>
        </div>

        <fieldset className="space-y-4 border-t pt-6">
          {/* <legend className="text-lg font-medium">Tier Cost Share</legend> */}
          <h3 className="text-lg font-medium">Tier Cost Share</h3>
          {[1, 2, 3, 4].map((tier, i) => (
            <div key={i} className="flex flex-col">
              <fieldset className="border border-solid border-t-black box-border p-4 rounded">
                <legend className="font-medium">Tier {tier}</legend>
                <div key={tier} className="grid sm:grid-cols-3 sm:gap-4 items-center">
                  <Label htmlFor={`t${tier}CostSharingType`}>{`Cost Share Type`}
                    <Combobox
                      value={form[`t${tier}CostSharingType` as keyof PlanFormData] as string}
                      onChange={(value) => handleChange(`t${tier}CostSharingType` as keyof PlanFormData, value)}
                      options={[
                        { value: 'COPAY', label: 'Copay' },
                        { value: 'COINSURANCE', label: 'Coinsurance' },
                      ]}
                    />
                  </Label>
                  <FormField label={`Share Value`} htmlFor={`t${tier}ShareValue`}>
                    <Input
                      id={`t${tier}ShareValue`}
                      type="number"
                      value={form[`t${tier}ShareValue` as keyof PlanFormData] as number}
                      onChange={(e) =>
                        handleChange(`t${tier}ShareValue` as keyof PlanFormData, parseFloat(e.target.value))
                      }
                    />
                  </FormField>
                  <div className="flex items-center sm:mt-4">
                    <FormField label={`Deductible`} htmlFor={`t${tier}UsesDeductible`}>
                      <input
                        id={`t${tier}UsesDeductible`}
                        type="checkbox"
                        checked={form[`t${tier}UsesDeductible` as keyof PlanFormData] as boolean}
                        onChange={(e) =>
                          handleChange(`t${tier}UsesDeductible` as keyof PlanFormData, e.target.checked)
                        }
                        className="ml-2"
                      />
                    </FormField>
                  </div>
                </div>
              </fieldset>
            </div>
          ))}
        </fieldset>

        <FormField label="Integrated Deductible" htmlFor="integratedDeductible">
          <input
            id="integratedDeductible"
            type="checkbox"
            checked={form.integratedDeductible}
            onChange={(e) => handleChange('integratedDeductible', e.target.checked)}
            className="ml-2"
          />
        </FormField>

        <div><b>*Note: </b>Creditability evaluation and report are generated based on industry-standard tier utilization and cost estimates, <span className="text-brand underline cursor-pointer dark:text-brand-dark" onClick={() => setActuarialAssumptionsModalOpen(true)}>editable per plan</span>. These values are defaulted otherwise.</div>

        {error && <p className="text-sm text-red-600">{error}</p>}
        <Button type="submit" disabled={loading} className="float-right">
          {loading ? 'Saving...' : 'Save and Evaluate Plan'}
        </Button>
      </form>
      <ActuarialAssumptionsModal open={isActuarialAssumtionsModalOpen} onClose={() => setActuarialAssumptionsModalOpen(false)} planName={form.name || ' '} onSetForPlan={(e: ActuarialAssumptionsInput) => handleChange('actuarialAssumptions', e)} initialData={form.actuarialAssumptions} />
    </>
  );
}
