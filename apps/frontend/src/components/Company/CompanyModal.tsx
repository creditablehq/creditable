'use client';

import { useState } from 'react';
import { Modal } from '../design-system/Modal';
import { Button } from '../design-system/Button';
import { Input } from '../design-system/Input';
import { FormField } from '../design-system/FormField';
import { Company } from '../../types/Company';
import { Combobox, Label } from '../design-system';

interface CompanyModalProps {
  open: boolean;
  onClose: () => void;
  initialData?: Company;
  onSubmit: (data: Company) => Promise<void>;
}

export function CompanyModal({
  open,
  onClose,
  initialData,
  onSubmit,
}: CompanyModalProps) {
  const [form, setForm] = useState<Company>({
    name: initialData?.name || '',
    email: initialData?.email ?? '',
    phoneNumber: initialData?.phoneNumber ?? '',
    contactName: initialData?.contactName ?? '',
    streetAddress: initialData?.streetAddress ?? '',
    city: initialData?.city ?? '',
    state: initialData?.state ?? '',
    zipCode: initialData?.zipCode ?? '',
    country: 'United States',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formErrors, setFormErrors] = useState({
    name: undefined,
    email: undefined,
    contactName: undefined,
    phoneNumber: undefined,
    streetAddress: undefined,
    city: undefined,
    state: undefined,
    zipCode: undefined,
    country: undefined,
  });

  const handleChange = (field: string, value: any) => {
    if (!value) {
      setFormErrors((prev) => ({ ...prev, [field]: 'Required' }));
    } else {
      setFormErrors((prev) => ({ ...prev, [field]: undefined }));
    }
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError('');
      await onSubmit(form);
      onClose();
    } catch (err: any) {
      console.error(err);
      setError(err?.message ?? 'Failed to save company.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    resetForm();
    setError('');
    onClose();
  };

  const resetForm = () => {
    setForm({
      name: initialData?.name || '',
      email: initialData?.email ?? '',
      phoneNumber: initialData?.phoneNumber ?? '',
      contactName: initialData?.contactName ?? '',
      streetAddress: initialData?.streetAddress ?? '',
      city: initialData?.city ?? '',
      state: initialData?.state ?? '',
      zipCode: initialData?.zipCode ?? '',
      country: 'United States',
    });

    setFormErrors({
      name: undefined,
      email: undefined,
      contactName: undefined,
      phoneNumber: undefined,
      streetAddress: undefined,
      city: undefined,
      state: undefined,
      zipCode: undefined,
      country: undefined,
    });
  };

  const hasErrors = Object.values(formErrors).some(
    (value) => value !== undefined && value !== null
  );

  const isIncomplete = Object.values(form).some((value) => {
    return value === undefined || value === null || value === '';
  });

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title={initialData ? 'Edit Company' : 'New Company'}
    >
      <div className='space-y-4 flex flex-col'>
        <FormField
          label='Company Name'
          htmlFor='company-name'
          error={formErrors?.name}
        >
          <Input
            id='company-name'
            placeholder='Acme Inc.'
            value={form.name}
            onChange={(e) => handleChange('name', e.target.value)}
            disabled={loading}
            className='mt-2'
          />
        </FormField>
        <FormField label='Email' htmlFor='email' error={formErrors?.email}>
          <Input
            id='email'
            placeholder='contact@acme.com'
            value={form.email}
            onChange={(e) => handleChange('email', e.target.value)}
            type='email'
            disabled={loading}
          />
        </FormField>
        <div className='flex gap-4'>
          <FormField
            label='Contact Name'
            htmlFor='contactName'
            error={formErrors?.contactName}
          >
            <Input
              id='contactName'
              placeholder='John Doe'
              value={form.contactName}
              onChange={(e) => handleChange('contactName', e.target.value)}
              type='text'
              disabled={loading}
            />
          </FormField>
          <FormField
            label='Phone Number'
            htmlFor='phoneNumber'
            error={formErrors?.phoneNumber}
          >
            <Input
              id='phoneNumber'
              value={form.phoneNumber}
              type='tel'
              disabled={loading}
              onChange={(e) => handleChange('phoneNumber', e.target.value)}
            />
          </FormField>
        </div>
        <FormField
          label='Street Address'
          htmlFor='streetAddress'
          error={formErrors.streetAddress}
        >
          <Input
            id='streetAddress'
            value={form.streetAddress}
            type='text'
            disabled={loading}
            onChange={(e) => handleChange('streetAddress', e.target.value)}
          />
        </FormField>
        <div className='grid grid-cols-2 gap-4'>
          <div className='space-y-1 w-full'>
            <FormField label='City' htmlFor='city' error={formErrors.city}>
              <Input
                id='city'
                value={form.city}
                type='text'
                disabled={loading}
                onChange={(e) => handleChange('city', e.target.value)}
              />
            </FormField>
          </div>
          <div className='space-y-1 w-full'>
            <Label htmlFor='type'>State</Label>
            <Combobox
              value={form.state}
              onChange={(e) => handleChange('state', e)}
              options={[
                { value: 'AL', label: 'AL' },
                { value: 'AK', label: 'AK' },
                { value: 'AZ', label: 'AZ' },
                { value: 'AR', label: 'AR' },
                { value: 'CA', label: 'CA' },
                { value: 'CO', label: 'CO' },
                { value: 'CT', label: 'CT' },
                { value: 'DE', label: 'DE' },
                { value: 'FL', label: 'FL' },
                { value: 'GA', label: 'GA' },
                { value: 'HI', label: 'HI' },
                { value: 'ID', label: 'ID' },
                { value: 'IL', label: 'IL' },
                { value: 'IN', label: 'IN' },
                { value: 'IA', label: 'IA' },
                { value: 'KS', label: 'KS' },
                { value: 'KY', label: 'KY' },
                { value: 'LA', label: 'LA' },
                { value: 'ME', label: 'ME' },
                { value: 'MD', label: 'MD' },
                { value: 'MA', label: 'MA' },
                { value: 'MI', label: 'MI' },
                { value: 'MN', label: 'MN' },
                { value: 'MS', label: 'MS' },
                { value: 'MO', label: 'MO' },
                { value: 'MT', label: 'MT' },
                { value: 'NE', label: 'NE' },
                { value: 'NV', label: 'NV' },
                { value: 'NH', label: 'NH' },
                { value: 'NJ', label: 'NJ' },
                { value: 'NM', label: 'NM' },
                { value: 'NY', label: 'NY' },
                { value: 'NC', label: 'NC' },
                { value: 'ND', label: 'ND' },
                { value: 'OH', label: 'OH' },
                { value: 'OK', label: 'OK' },
                { value: 'OR', label: 'OR' },
                { value: 'PA', label: 'PA' },
                { value: 'RI', label: 'RI' },
                { value: 'SC', label: 'SC' },
                { value: 'SD', label: 'SD' },
                { value: 'TN', label: 'TN' },
                { value: 'TX', label: 'TX' },
                { value: 'UT', label: 'UT' },
                { value: 'VT', label: 'VT' },
                { value: 'VA', label: 'VA' },
                { value: 'WA', label: 'WA' },
                { value: 'WV', label: 'WV' },
                { value: 'WI', label: 'WI' },
                { value: 'WY', label: 'WY' },
              ]}
              error={formErrors.state}
            />
          </div>
          <div className='space-y-1 w-full'>
            <FormField
              label='Zip Code'
              htmlFor='zipCode'
              error={formErrors.zipCode}
            >
              <Input
                id='zipCode'
                value={form.zipCode}
                type='text'
                disabled={loading}
                onChange={(e) => handleChange('zipCode', e.target.value)}
              />
            </FormField>
          </div>
        </div>

        {error && <p className='text-sm text-red-600'>{error}</p>}

        <div className='flex justify-end gap-2'>
          <Button onClick={handleClose} variant='outline' disabled={loading}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={loading || hasErrors || isIncomplete}
            variant={
              loading || hasErrors || isIncomplete ? 'disabled' : 'default'
            }
          >
            {loading ? 'Saving...' : 'Save'}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
