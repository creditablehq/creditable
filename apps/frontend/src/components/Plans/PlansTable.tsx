import { useContext, useEffect, useState } from 'react';
import { getPlansByCompany } from '../../api/plans';
import { Table } from '../design-system/Table';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';

interface PlansTableProps {
  companyId: string;
}

export function PlansTable({ companyId }: PlansTableProps) {
  const [plans, setPlans] = useState([]);
  const [error, setError] = useState<string | null>(null);
  const auth = useContext(AuthContext);
  const navigate = useNavigate();

  console.log('Plans Table mounted', import.meta.env.VITE_API_BASE_URL);

  useEffect(() => {
    console.log('useEffect triggered with token: ', auth?.token);
    async function fetchPlans() {
      try {
        const data = await getPlansByCompany(companyId);
        setPlans(data);
      } catch (err: any) {
        setError(err.message);
      }
    }

    fetchPlans();
  }, [companyId, auth?.token]);

  if (error) return <p className="text-red-500">{error}</p>;
  if (!plans.length) return <p className="text-sm text-neutral-500">No plans found.</p>;

  return (
    <Table 
      columns={['name', 'year', 'type', 'deductible']}
      data={plans}
      emptyMessage='No plans.'
      onRowClick={(row: any) => navigate(`/companies/${row?.id!}`)}
    />
  );
}
