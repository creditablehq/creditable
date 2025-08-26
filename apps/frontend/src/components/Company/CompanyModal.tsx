'use client';

import { useState } from 'react';
import { Modal } from '../design-system/Modal';
import { Button } from '../design-system/Button';
import { Input } from '../design-system/Input';
import { FormField } from '../design-system/FormField';

interface CompanyModalProps {
  open: boolean;
  onClose: () => void;
  initialData?: { id: string; name: string };
  onSubmit: (data: { id?: string; name: string }) => Promise<void>;
}

export function CompanyModal({
  open,
  onClose,
  initialData,
  onSubmit,
}: CompanyModalProps) {
  const [name, setName] = useState(initialData?.name || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    if (!name.trim()) {
      setError('Company name is required.');
      return;
    }

    try {
      setLoading(true);
      setError('');
      await onSubmit({ name });
      onClose();
      setName('');
    } catch (err) {
      console.error(err);
      setError('Failed to save company.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title={initialData ? 'Edit Company' : 'New Company'}>
      <div className="space-y-4">
        <FormField
          label="Company Name"
          htmlFor="company-name"
          error={error}
        >
          <Input
            id="company-name"
            placeholder="Acme Inc."
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={loading}
            className="mt-2"
          />
        </FormField>

        <div className="flex justify-end gap-2">
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
