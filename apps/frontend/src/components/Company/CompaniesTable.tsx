'use client';

import { ReactNode, useContext, useEffect, useState } from 'react';
import { getCompanies } from '../../api/companies';
import { Table } from '../design-system/Table';
import { AuthContext } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

interface ExtractedClientData extends Record<string, ReactNode> {
  id: string,
  Name: string,
  Plans: number,
  'Created By': string,
  'Client Since': string,
};

export function CompaniesTable() {
  const [companies, setCompanies] = useState<ExtractedClientData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const auth = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchCompanies() {
      try {
        setLoading(true);
        if (!auth?.token) return;
        const data = await getCompanies();
        const newClients = mapClient(data);
        setCompanies(newClients);
      } catch (err) {
        console.error(err);
        setError('Error loading companies');
      } finally {
        setLoading(false);
      }
    }

    fetchCompanies();
  }, []);

  const mapClient = (clients: any[]) => {
    return clients?.map(c => {
      let extratedClient: ExtractedClientData = {
        id: c.id,
        Name: c.name,
        Plans: c?.plans?.length,
        'Created By': c?.user?.name,
        'Client Since': new Date(c?.createdAt).toLocaleDateString('en-US', { month: '2-digit', day: 'numeric', year: 'numeric' }),
      };
      return extratedClient;
    })
  };

  if (loading) return <p>Loading companies...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    companies &&
    <Table
      columns={['Name', 'Plans', 'Created By', 'Client Since']}
      data={companies}
      emptyMessage='No clients.'
      onRowClick={(row: any) => navigate(`/companies/${row?.id!}`)}
    />
  );
}
