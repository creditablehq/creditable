'use client';

import { ReactNode, useContext, useEffect, useState } from 'react';
import { getBrokers } from '../../api/brokers';
import { Table } from '../design-system/Table';
import { AuthContext } from '../../contexts/AuthContext';

interface ExtractedBrokerData extends Record<string, ReactNode> {
  id: string,
  Name: string,
  Users: number,
  Plans: number,
  'Broker Since': string,
};

export function BrokersTable({ newBroker }: any) {
  const [brokers, setBrokers] = useState<ExtractedBrokerData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const auth = useContext(AuthContext);

  useEffect(() => {
    async function fetchBrokers() {
      try {
        setLoading(true);
        if (!auth?.token) return;
        const data = await getBrokers();
        const brokers = mapBrokers(data);
        setBrokers(brokers);
      } catch (err) {
        console.error(err);
        setError('Error loading companies');
      } finally {
        setLoading(false);
      }
    }

    fetchBrokers();
  }, []);

  useEffect(() => {
    if (newBroker) {
      setLoading(true);
      const mappedBrokers = mapBrokers([...brokers, newBroker])
      setBrokers(mappedBrokers);
      setLoading(false);
    }
  }, [newBroker])

  const mapBrokers = (brokers: any[]) => {
    return brokers?.map(b => {
      let extractedBroker: ExtractedBrokerData = {
        id: b?.id,
        Name: b?.name,
        Users: b?.users?.length ?? 0,
        Plans: b?.planLimit,
        'Broker Since': new Date(b?.createdAt).toLocaleDateString('en-US', { month: '2-digit', day: 'numeric', year: 'numeric' }),
      };
      return extractedBroker;
    })
  };

  if (loading) return <p>Loading brokers...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    brokers &&
    <Table
      columns={['Name', 'Users', 'Plans', 'Broker Since']}
      data={brokers}
      emptyMessage='No clients.'
    />
  );
}
