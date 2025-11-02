import { useEffect, useState } from "react"
import { getBrokerById, getBrokers } from "../../api/brokers"
import { useNavigate, useParams } from "react-router-dom"
import { ArrowLeftCircle, UserPlus } from "lucide-react";
import { Broker } from "../../types/Broker";
import clsx from "clsx";
import { Button } from "../../components/design-system";
import { Modal } from "../../components/design-system/Modal";
import { AddUserForm } from "../../components/Broker/AddUserForm";
import { User } from "../../types/User";

export default function BrokerDetail() {
  const { brokerId } = useParams();
  const [loading, setLoading] = useState(true);
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [broker, setBroker] = useState<Broker | undefined>(undefined);

  const navigate = useNavigate();

  useEffect(() => {
    async function initBrokerInfo() {
      getBrokerById(brokerId!).then(setBroker);
    }

    initBrokerInfo().finally(() => {
      setLoading(false);
    });
  }, []);

  const calculatedUtilizationPercentage = () => {
    return ((broker?.currentPlanCount || 0) / (broker?.planLimit || 0)) * 100;
  }

  const calculatedBrokerAge = () => {
    if (broker?.createdAt) {
      const today = new Date();
      const createdAt = new Date(broker.createdAt);

      let years = today.getFullYear() - createdAt.getFullYear();
      let months = today.getMonth() - createdAt.getMonth();

      if (months < 0 || (months === 0 && today.getDate() < createdAt.getDate())) {
        years--;
        months += 12;
      }
      return `${years > 0 ? `${years} year${years > 1 ? 's' : ''} and ` : ''} ${months} month${months > 1 ? 's' : ''}`;
    }
  }

  const handleUserCreate = (user: User) => {
    setBroker(prev => {
      if (!prev) return prev;
      return { ...prev, users: [...prev.users, user] }
    });
    setIsAddUserOpen(false);
  }

  if (loading) return <p>Loading broker info...</p>;

  return (
    <div className="space-y-6">
      <div 
        className="flex gap-1 mb-4 text-neutral-400 hover:text-brand hover:cursor-pointer"
        onClick={() => navigate('/brokers')}
      >
        <ArrowLeftCircle strokeWidth={1.25} />
        <span>Back</span>
      </div>
      <div className="flex justify-between items-center">
        <div className="items-center">
          <h1 className="text-2xl text-neutral-700 font-semibold italic">{broker?.name}</h1>
          <p className="text-xs text-neutral-400 font-light italic">{ broker?.id }</p>
        </div>
      </div>

      <div className="flex gap-4 justify-items-stretch w-full overflow-hidden flex-wrap">
        <section className="flex flex-col flex-1 gap-2 bg-white w-fit dark:bg-neutral-800 p-4 sm:p-8 rounded-lg shadow-sm border border-neutral-200 dark:border-neutral-700">
          <h3 className="text-lg font-semibold mb-2">Plans</h3>
          <div>Plans Created:
            <span 
              className={clsx('ml-1 font-bold transition-colors duration-300', {
                'text-emerald-500': calculatedUtilizationPercentage() < 75,
                'text-amber-500': calculatedUtilizationPercentage() >= 75 && calculatedUtilizationPercentage() < 90,
                'text-red-500': calculatedUtilizationPercentage() >= 90,
              })}
            >{ broker?.currentPlanCount }</span>
          </div>
          <div>Plan Limit:
            <span className="ml-1 font-bold">{ broker?.planLimit }</span>
          </div>
        </section>

        <section className="flex flex-col flex-1 gap-2 bg-white w-fit dark:bg-neutral-800 p-4 sm:p-8 rounded-lg shadow-sm border border-neutral-200 dark:border-neutral-700">
          <h3 className="text-lg font-semibold mb-2">Age</h3>
          <div>Broker Since:
            <span 
              className="ml-1 font-bold transition-colors duration-300"
            >{ broker?.createdAt && new Date(broker.createdAt).toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' }) }</span>
          </div>
          <div>Broker Age:
            <span className="ml-1 font-bold">{ calculatedBrokerAge() }</span>
          </div>
        </section>

        <section className="flex flex-col flex-1 gap-2 bg-white w-fit dark:bg-neutral-800 p-4 sm:p-8 rounded-lg shadow-sm border border-neutral-200 dark:border-neutral-700">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-semibold">Users</h3>
            <Button 
              onClick={() => setIsAddUserOpen(true)}
            >
              + Add User
            </Button>
          </div>
          {broker?.users && broker?.users.length > 0 && broker?.users.map(user => {
            return (
              <div className="grid grid-cols-3 gap-4 min-w-max" key={user?.id}>
                <div>{ user?.name }</div>
                <div>{ user?.email }</div>
                <div className="justify-self-end">{ user?.role }</div>
              </div>
            );
          })}
        </section>
      </div>

      <Modal open={isAddUserOpen} onClose={() => setIsAddUserOpen(false)} title={`Add User to ${broker?.name}`}>
        <AddUserForm brokerId={broker?.id!} onUserCreated={handleUserCreate} />
      </Modal>
    </div>
  )
}
