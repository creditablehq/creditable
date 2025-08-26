// pages/companies/[companyId].tsx
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { PlanFormData } from '../../types/plan';
import { PlanForm } from '../../components/Plans/PlanForm';
import { PlansTable } from '../../components/Plans/PlansTable';
import { getPlansByCompany } from '../../api/plans';
import { getCompanyById } from '../../api/companies';
import { Modal } from '../../components/design-system/Modal';
import { Button } from '../../components/design-system/Button';
import PlanCard from '../../components/Company/PlanCard';

export default function CompanyDetail() {
  const { companyId } = useParams();
  const [plans, setPlans] = useState<PlanFormData[]>([]);
  const [company, setCompany] = useState<any>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function initCompanyInfo() {
      getCompanyById(companyId!).then(setCompany);
      getPlansByCompany(companyId!).then(setPlans);
    }

    initCompanyInfo();
    setTimeout(() => {
      setLoading(false);
    }, 500)
  }, [companyId]);

  if (loading) return <p>Loading company info...</p>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Plans for <span className="text-neutral-700 font-light italic">{company?.name}</span></h1>
        <Button onClick={() => setIsOpen(true)}>+ Add Plan</Button>
      </div>

      {!plans.length && 
        <div className="flex w-full h-56 items-center text-center justify-center">No plans for {company?.name}, try adding some!</div>
      }

      {plans.length > 0 && plans.map((plan: any) => {
        return (<PlanCard key={plan?.id} plan={plan} />);
      })}

      <Modal open={isOpen} onClose={() => setIsOpen(false)} title="Create Plan">
        <PlanForm
          companyId={companyId!}
          onPlanCreated={() => {
            getPlansByCompany(companyId!).then(setPlans);
            setIsOpen(false);
          }}
        />
      </Modal>
    </div>
  );
}
