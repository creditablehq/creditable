'use client';

import { useState } from 'react';
import { Modal } from '../design-system/Modal';
import { Button } from '../design-system/Button';
import { Input } from '../design-system/Input';
import { FormField } from '../design-system/FormField';
import { BrokerFormInput } from '../../types/BrokerForm';

interface BrokerModalProps {
  open: boolean;
  onClose: () => void;
  initialData?: { id: string; name: string };
  onSubmit: (data: BrokerFormInput) => Promise<void>;
}

export function BrokerModal({
  open,
  onClose,
  initialData,
  onSubmit,
}: BrokerModalProps) {
  const [form, setForm] = useState<BrokerFormInput>({
    name: '',
    totalPlans: 0,
    userName: '',
    email: '',
    password: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (field: string, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    if (!form.name.trim()) {
      setError('Broker name is required.');
      return;
    }

    try {
      setLoading(true);
      setError('');
      await onSubmit(form);
      onClose();
      setForm({
        name: '',
        totalPlans: 0,
        userName: '',
        email: '',
        password: '',
    });
    } catch (err) {
      console.error(err);
      setError('Failed to save Broker.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title={initialData ? 'Edit Broker' : 'New Broker'}>
      <div className="space-y-4">
        <div className="flex flex-col gap-4">
          <FormField
            label="Broker Name"
            htmlFor="broker-name"
            error={error}
          >
            <Input
              id="broker-name"
              placeholder="Acme Inc."
              value={form.name}
              onChange={(e) => handleChange('name', e.target.value)}
              disabled={loading}
              className="mt-2"
            />
          </FormField>

          <FormField
            label="Plans"
            htmlFor="plans"
            error={error}
          >
            <Input
              id="plans"
              placeholder="0"
              type="number"
              value={form.totalPlans}
              onChange={(e) => handleChange('totalPlans', parseInt(e.target.value))}
              disabled={loading}
              className="mt-2"
            />
          </FormField>
        </div>

        <div className='flex flex-col gap-4 mt-6'>
          <legend className="text-[16px] font-medium">
            Managing User Account
          </legend>
          <FormField
            label="Name"
            htmlFor="name"
            error={error}
          >
            <Input
              id="name"
              placeholder="John Smith"
              value={form.userName}
              onChange={(e) => handleChange('userName', e.target.value)}
              disabled={loading}
              className="mt-2"
            />
          </FormField>
          <FormField
            label="Email"
            htmlFor="email"
            error={error}
          >
            <Input
              id="email"
              type="email"
              placeholder="john.smith@broker.com"
              value={form.email}
              onChange={(e) => handleChange('email', e.target.value)}
              disabled={loading}
              className="mt-2"
            />
          </FormField>
          <FormField
            label="Temporary Password"
            htmlFor="password"
            error={error}
          >
            <Input
              id="password"
              // type="password"
              value={form.password}
              onChange={(e) => handleChange('password', e.target.value)}
              disabled={loading}
              className="mt-2"
            />
          </FormField>
        </div>

        <div className="flex justify-end gap-2 mt-6">
          <Button onClick={onClose} variant="outline" disabled={loading}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? 'Saving...' : 'Save'}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
