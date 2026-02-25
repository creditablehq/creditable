// pages/companies/[companyId].tsx
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { PlanFormData } from '../../types/plan';
import { PlanForm } from '../../components/Plans/PlanForm';
import { getPlansByCompany } from '../../api/plans';
import { getCompanyById, updateCompanyById } from '../../api/companies';
import { Modal } from '../../components/design-system/Modal';
import { Button } from '../../components/design-system/Button';
import PlanCard from '../../components/Company/PlanCard';
import { getMe } from '../../api/user';
import { Tooltip } from 'react-tooltip';
import { FileCheck, NotebookPen, Upload } from 'lucide-react';
import { CompanyModal } from '../../components/Company/CompanyModal';
import { Company } from '../../types/Company';
import { UploadModal } from '../../components/layout/UploadModal';
import emailjs from '@emailjs/browser';

const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID ?? '';
const EMAILJS_UPLOAD_COMPLETE_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_UPLOAD_COMPLETE_TEMPLATE ?? '';
const EMIALJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY ?? '';


export default function CompanyDetail() {
  const { companyId } = useParams();
  const [plans, setPlans] = useState<PlanFormData[]>([]);
  const [company, setCompany] = useState<Company | undefined>(undefined);
  const [isAddPlanOpen, setIsAddPlanOpen] = useState(false);
  const [isEditClientOpen, setIsEditClientOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isFileSubmissionSuccessful, setIsFileSubmissionSuccessful] = useState(false);
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

  const handleUpdateCompany = async (data: Company) => {
    if (companyId) {
      const company = await updateCompanyById(companyId, data);
      setCompany(company);
    }
    setIsEditClientOpen(false);
  }

  const sendUploadEmail = () => {
    if (!EMAILJS_SERVICE_ID || !EMAILJS_UPLOAD_COMPLETE_TEMPLATE_ID || !EMIALJS_PUBLIC_KEY) {
      console.error('Error sending automated emails: Invalid Public Key, Service ID, or Template ID.');
      return;
    }

    emailjs
      .send(EMAILJS_SERVICE_ID, EMAILJS_UPLOAD_COMPLETE_TEMPLATE_ID, {
        account: me?.name,
        broker: me?.broker?.name,
        company: company?.name,
      }, EMIALJS_PUBLIC_KEY)
      .catch((err) => {
        console.error('Failed to send file upload email!', err);
      });
  }

  const handleUpload = async () => {
    setIsFileSubmissionSuccessful(true);
    setIsUploadModalOpen(false);
    sendUploadEmail();
  }

  if (loading) return <p>Loading company info...</p>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold">Plans for <span className="text-neutral-700 font-light italic">{company?.name}</span></h1>
          <div
            className="cursor-pointer hover:text-brand"
            onClick={() => setIsEditClientOpen(true)}
          >
            <NotebookPen id="edit-client-info" strokeWidth={1.75} size={20} />
            <Tooltip anchorSelect="#edit-client-info" place="right">Edit Client Info</Tooltip>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Button
            id="add-plan-btn"
            onClick={() => setIsUploadModalOpen(true)}
            variant={disabled ? 'disabled' : 'default'}
            className="flex gap-2"
          >
            <Upload size={20} strokeWidth={1.5} className="cursor-pointer" onClick={() => setIsUploadModalOpen(true)} />
            Upload Plan Documents
          </Button>
          <Button
            id="add-plan-btn"
            onClick={() => setIsAddPlanOpen(true)}
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
      </div>

      {!plans.length && 
        <div className="flex w-full h-56 items-center text-center justify-center">No plans for {company?.name}, try adding some!</div>
      }

      {plans.length > 0 && plans.map((plan: any) => {
        return (<PlanCard key={plan?.id} plan={plan} disabledActions={me.broker?.isPaywalled || false} onDelete={updatePlans} />);
      })}

      <Modal open={isAddPlanOpen} onClose={() => setIsAddPlanOpen(false)} title="Create Plan">
        <PlanForm
          companyId={companyId!}
          onPlanCreated={() => {
            getPlansByCompany(companyId!).then(setPlans);
            getMe().then(setMe);
            setIsAddPlanOpen(false);
          }}
        />
      </Modal>

      <CompanyModal
        open={isEditClientOpen}
        initialData={company}
        onClose={() => setIsEditClientOpen(false)}
        onSubmit={handleUpdateCompany} 
      />

      <UploadModal
        open={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onSubmit={handleUpload}
      />

      <Modal open={isFileSubmissionSuccessful} onClose={() => setIsFileSubmissionSuccessful(false)} title="File Submission Successful!">
        <div className="flex items-center gap-4 px-4">
          <FileCheck size={"64px"} className="text-blue-500" />
          The Creditable team has be notified of your plan upload and will be processed shortly. Thank you!
        </div>
      </Modal>
    </div>
  );
}
