// pages/companies/[companyId].tsx
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { PlanFormData } from '../../types/plan';
import { PlanForm } from '../../components/Plans/PlanForm';
import { getPlansByCompany } from '../../api/plans';
import { getCompanyById } from '../../api/companies';
import { Modal } from '../../components/design-system/Modal';
import { Button } from '../../components/design-system/Button';
import PlanCard from '../../components/Company/PlanCard';
import { getMe } from '../../api/user';
import { Tooltip } from 'react-tooltip';

export default function CompanyDetail() {
  const { companyId } = useParams();
  const [plans, setPlans] = useState<PlanFormData[]>([]);
  const [company, setCompany] = useState<any>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [me, setMe] = useState<any>(null);
  const [disabled, setDisabled] = useState(false);

  useEffect(() => {
    async function initCompanyInfo() {
      getCompanyById(companyId!).then(setCompany);
      getPlansByCompany(companyId!).then(setPlans);
      getMe().then(setMe);
    }

    initCompanyInfo();
    setTimeout(() => {
      setLoading(false);
    }, 500)
  }, [companyId]);

  useEffect(() => {
    setDisabled(me?.broker?.currentPlanCount >= me?.broker?.planLimit)
  }, [me])

  const updatePlans = (id: string) => {
    setPlans(prevPlans => prevPlans?.filter(plan => plan?.id !== id) || null);
  }

  if (loading) return <p>Loading company info...</p>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Plans for <span className="text-neutral-700 font-light italic">{company?.name}</span></h1>
        <Button
          id="add-plan-btn"
          onClick={() => setIsOpen(true)}
          variant={disabled ? 'disabled' : 'default'}
        >
          + Add Plan
        </Button>
        { disabled &&
          <Tooltip anchorSelect="#add-plan-btn" place="bottom">
            Plan limit reached. Contact to increase plan maximum.
          </Tooltip>
        }
      </div>

      {!plans.length && 
        <div className="flex w-full h-56 items-center text-center justify-center">No plans for {company?.name}, try adding some!</div>
      }

      {plans.length > 0 && plans.map((plan: any) => {
        return (<PlanCard key={plan?.id} plan={plan} onDelete={updatePlans} />);
      })}

      <Modal open={isOpen} onClose={() => setIsOpen(false)} title="Create Plan">
        <PlanForm
          companyId={companyId!}
          onPlanCreated={() => {
            getPlansByCompany(companyId!).then(setPlans);
            getMe().then(setMe);
            setIsOpen(false);
          }}
        />
      </Modal>
    </div>
  );
}
