import { useEffect, useState } from "react";
import { getMe } from "../api/user";
import PlanCard from "../components/Company/PlanCard";

const Dashboard = () => {
  const [me, setMe] = useState<any | null>(null);
  const [plans, setPlans] = useState<any[] | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = await getMe();
        if (user) setMe(user);
        setPlans(user?.plans?.reverse().slice(0, 5) || []);
      } catch (e) {
        console.error('Error getting user data: ', e);
      }
    }
    
    fetchUserData();
  }, []);

  const updatePlans = (id: string) => {
    setPlans(prevPlans => prevPlans?.filter(plan => plan.id !== id) || null);
  }

  return (
    <div className="text-gray-800">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Dashboard</h2>
      </div>
      <div className="w-full flex flex-row sm:flex-col">
        {plans && plans.length > 0 &&
          <section className="flex flex-col gap-2 bg-white dark:bg-neutral-800 p-4 sm:p-8 rounded-lg shadow-sm border border-neutral-200 dark:border-neutral-700">
            <h3 className="text-lg font-semibold mb-2">Recently Added Plans</h3>
            {plans?.map((plan: any) => {
              return (<PlanCard key={plan?.id} plan={plan} onDelete={updatePlans} />)
            })}
            <p className="mt-4">Don't see a specific plan? <a href="/companies">Try looking for it under a client</a>!</p>
          </section>
        }
      </div>
      {!plans || plans.length === 0 &&
        <div className="flex flex-col gap-4">
          <p>Use this dashboard to access tools for checking plan creditability.</p>
          <p>Start by <a href="/companies">adding a client</a> to test for plan creditability!</p>
        </div>
      }
    </div>
  );
};

export default Dashboard;
