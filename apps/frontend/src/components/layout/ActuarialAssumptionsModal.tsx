import { useState } from "react";
import { Button, Input, Label } from "../design-system";
import { Modal } from "../design-system/Modal";

const INITIAL_ASSUMPTIONS_VALUES = {
  t1Utilization: 0.5,
  t2Utilization: 0.3,
  t3Utilization: 0.15,
  t4Utilization: 0.05,
  t1FillCost: 20,
  t2FillCost: 100,
  t3FillCost: 250,
  t4FillCost: 500,
  annualFillsPerTier: 12,
  defaultBrandFillCounter: 10,
  estimatedAnnualFills: 42,
  rxDeductibleAllocation: 0.33,
}

interface ActuarialAssumptionsModalProps {
  open: boolean;
  onClose: () => void;
  planName?: string;
  onSetForPlan?: (data: ActuarialAssumptionsInput) => void;
  initialData?: ActuarialAssumptionsInput;
}

export interface ActuarialAssumptionsInput {
  t1Utilization: number;
  t2Utilization: number;
  t3Utilization: number;
  t4Utilization: number;
  t1FillCost: number;
  t2FillCost: number;
  t3FillCost: number;
  t4FillCost: number;
  annualFillsPerTier: number;
  defaultBrandFillCounter: number;
  estimatedAnnualFills: number;
  rxDeductibleAllocation: number;
}

export function ActuarialAssumptionsModal({open, onClose, planName, onSetForPlan, initialData}: ActuarialAssumptionsModalProps) {
  const [form, setForm] = useState<ActuarialAssumptionsInput>({
    t1Utilization: initialData?.t1Utilization ?? INITIAL_ASSUMPTIONS_VALUES.t1Utilization,
    t2Utilization: initialData?.t2Utilization ?? INITIAL_ASSUMPTIONS_VALUES.t2Utilization,
    t3Utilization: initialData?.t3Utilization ?? INITIAL_ASSUMPTIONS_VALUES.t3Utilization,
    t4Utilization: initialData?.t4Utilization ?? INITIAL_ASSUMPTIONS_VALUES.t4Utilization,
    t1FillCost: initialData?.t1FillCost ?? INITIAL_ASSUMPTIONS_VALUES.t1FillCost,
    t2FillCost: initialData?.t2FillCost ?? INITIAL_ASSUMPTIONS_VALUES.t2FillCost,
    t3FillCost: initialData?.t3FillCost ?? INITIAL_ASSUMPTIONS_VALUES.t3FillCost,
    t4FillCost: initialData?.t4FillCost ?? INITIAL_ASSUMPTIONS_VALUES.t4FillCost,
    annualFillsPerTier: initialData?.annualFillsPerTier ?? INITIAL_ASSUMPTIONS_VALUES.annualFillsPerTier,
    defaultBrandFillCounter: initialData?.defaultBrandFillCounter ?? INITIAL_ASSUMPTIONS_VALUES.defaultBrandFillCounter,
    estimatedAnnualFills: initialData?.estimatedAnnualFills ?? INITIAL_ASSUMPTIONS_VALUES.estimatedAnnualFills,
    rxDeductibleAllocation: initialData?.rxDeductibleAllocation ?? INITIAL_ASSUMPTIONS_VALUES.rxDeductibleAllocation,
  });

  const handleChange = (field: string, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  const handleReset = () => {
    setForm(INITIAL_ASSUMPTIONS_VALUES);
  }

  const handleSetForPlan = () => {
    onSetForPlan?.(form);
    onClose();
  }

  return (
    <Modal open={open} onClose={onClose} title="Actuarial Assumptions">
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-2 p-2">
          <legend className="font-medium text-center">Utilization</legend>
          <Label htmlFor="t1-utilization">Tier 1
            <Input
              id="t1-utilization"
              type="number"
              value={form.t1Utilization}
              onChange={(e) => handleChange('t1Utilization', parseFloat(e.target.value))}
            />
          </Label>
          <Label htmlFor="t1-utilization">Tier 2
            <Input
              id="t2-utilization"
              type="number"
              value={form.t2Utilization}
              onChange={(e) => handleChange('t2Utilization', parseFloat(e.target.value))}
            />
          </Label>
          <Label htmlFor="t3-utilization">Tier 3
            <Input
              id="t3-utilization"
              type="number"
              value={form.t3Utilization}
              onChange={(e) => handleChange('t3Utilization', parseFloat(e.target.value))}
            />
          </Label>
          <Label htmlFor="t4-utilization">Tier 4
            <Input
              id="t4-utilization"
              type="number"
              value={form.t4Utilization}
              onChange={(e) => handleChange('t4Utilization', parseFloat(e.target.value))}
            />
          </Label>
        </div>

        <div className="flex flex-col gap-2 p-2">
          <legend className="font-medium text-center">Fill Cost</legend>
          <Label htmlFor="t1-fill-cost">Tier 1
            <Input
              id="t1-fill-cost"
              type="number"
              value={form.t1FillCost}
              onChange={(e) => handleChange('t1FillCost', parseFloat(e.target.value))}
            />
          </Label>
          <Label htmlFor="t2-fill-cost">Tier 2
            <Input
              id="t2-fill-cost"
              type="number"
              value={form.t2FillCost}
              onChange={(e) => handleChange('t2FillCost', parseFloat(e.target.value))}
            />
          </Label>
          <Label htmlFor="t3-fill-cost">Tier 3
            <Input
              id="t3-fill-cost"
              type="number"
              value={form.t3FillCost}
              onChange={(e) => handleChange('t3FillCost', parseFloat(e.target.value))}
            />
          </Label>
          <Label htmlFor="t4-fill-cost">Tier 4
            <Input
              id="t4-fill-cost"
              type="number"
              value={form.t4FillCost}
              onChange={(e) => handleChange('t4FillCost', parseFloat(e.target.value))}
            />
          </Label>
        </div>

        <div className="flex flex-col gap-2 p-2">
          <legend className="font-medium text-center">Misc.</legend>
          <Label htmlFor="annual-fills">Annual Fills Per Tier
            <Input
              id="annual-fills"
              type="number"
              value={form.annualFillsPerTier}
              onChange={(e) => handleChange('annualFillsPerTier', parseFloat(e.target.value))}
            />
          </Label>
          <Label htmlFor="brand-fill-count">Brand Fill Count
            <Input
              id="brand-fill-count"
              type="number"
              value={form.defaultBrandFillCounter}
              onChange={(e) => handleChange('defaultBrandFillCounter', parseFloat(e.target.value))}
            />
          </Label>
          <Label htmlFor="estimated-annual-fills">Estimated Annual Fills
            <Input
              id="estimated-annual-fills"
              type="number"
              value={form.estimatedAnnualFills}
              onChange={(e) => handleChange('estimatedAnnualFills', parseFloat(e.target.value))}
            />
          </Label>
          <Label htmlFor="rx-deductible-allocation">Rx Deductible Allocation
            <Input
              id="rx-deductible-allocation"
              type="number"
              value={form.rxDeductibleAllocation}
              onChange={(e) => handleChange('rxDeductibleAllocation', parseFloat(e.target.value))}
            />
          </Label>
        </div>
      </div>
      <div className="flex justify-evenly items-center gap-4 mt-6">
        <Button className="w-full" variant="outline" onClick={handleReset}>Reset</Button>
        {planName ? 
          <Button className="w-full" onClick={handleSetForPlan}>Set for {planName !== ' ' ? planName : 'plan'}</Button> :
          <Button className="w-full" onClick={onClose}>Save</Button>
        }
      </div>
    </Modal>
  );
}
