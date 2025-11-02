import { useState } from "react";
import { UserFormData } from "../../types/User";
import { Button, FormField, Input } from "../design-system";
import { createUser } from "../../api/user";

interface PlanFormProps {
  brokerId: string;
  onUserCreated: (user: any) => void;
}

export function AddUserForm({ brokerId, onUserCreated }: PlanFormProps) {
  const [form, setForm] = useState<UserFormData>({
    name: '',
    email: '',
    role: 'BROKER',
    brokerId: brokerId
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const handleChange = (field: string, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.name.trim()) {
      setError('User name is required.');
      return;
    }

    if (!form.email.trim()) {
      setError('User email is required.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const user = await createUser(form);
      onUserCreated(user);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <form className="space-y-6" onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 gap-4">
          <FormField label="User Name" htmlFor="name">
            <Input
              id="name"
              value={form.name}
              type="text"
              disabled={loading}
              onChange={(e) => handleChange('name', e.target.value)} 
            />
          </FormField>
          <FormField label="Email" htmlFor="email">
            <Input
              id="email"
              value={form.email}
              type="email"
              disabled={loading}
              onChange={(e) => handleChange('email', e.target.value)}
            />
          </FormField>
        {error && <p className="text-sm text-red-600">{error}</p>}
        </div>

        <Button type="submit" disabled={loading} className="float-right">
          {loading ? 'Creating user...' : 'Create User'}
        </Button>
      </form>
    </>
  );
}
