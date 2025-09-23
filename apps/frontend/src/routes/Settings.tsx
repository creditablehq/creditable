import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Button, FormField, Input, Label } from "../components/design-system";
import { updateUser } from "../api/auth";

interface UserSettingsFormInput {
  email: string;
  name: string;
  password: string;
  newPassword: string;
}

export function Settings() {
  // const [user, setUser] = useState(undefined);
  const { user, setUser, setToken } = useAuth();
  const [form, setForm] = useState<UserSettingsFormInput>({
    email: user.email,
    name: user.name,
    password: '',
    newPassword: '',
  });
  const [hasChanged, setChanged] = useState(false);
  const [isDisabled, setDisabled] = useState(true);
  const [error, setError] = useState("");

  const prevFormValues = {
    email: user.email,
    name: user.name,
  }

  useEffect(() => {
    const checkForChanges = () => {
      if (prevFormValues.email !== form.email || prevFormValues.name !== form.name || form.newPassword) {
        setChanged(true);
      } else {
        setChanged(false);
      }

      if (form.password.length === 0 && hasChanged) {
        setDisabled(true);
        setError("Password required to update user settings.");
      } else {
        setDisabled(false);
        setError("");
      }
    }

    checkForChanges();
  }, [form, hasChanged]);


  const handleChange = (field: string, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  const resetSettings = () => {
    handleChange('email', prevFormValues.email);
    handleChange('name', prevFormValues.name);
    handleChange('newPassword', '');
  }

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    try {
      const { token, updatedUser } = await updateUser(user.id, form);
      setToken(token);
      setUser(updatedUser);
      prevFormValues.email = updatedUser?.email;
      prevFormValues.name = updatedUser?.name;
      resetSettings();
    } catch (err) {
      console.error(err);
      setError("Invalid password");
    }
  }

  return (
    <div className="flex flex-col gap-4 w-1/2 justify-center">
      <legend className="font-medium">User Settings</legend>
      <Label htmlFor="email">Email
        <Input
          id="email"
          value={form.email}
          onChange={(e) => handleChange('email', e.target.value)}
        />
      </Label>
      <Label htmlFor="name">Name
        <Input
          id="name"
          value={form.name}
          onChange={(e) => handleChange('name', e.target.value)}
        />
      </Label>
      <FormField label="Password" htmlFor="password" error={error}>
        <Input
          id="password"
          value={form.password}
          type="password"
          name="password"
          required
          onChange={(e) => handleChange('password', e.target.value)}
        />
      </FormField>
      <Label htmlFor="newPassword">New Password
        <Input
          id="newPassword"
          value={form.newPassword}
          type="password"
          name="newPassword"
          onChange={(e) => handleChange('newPassword', e.target.value)}
        />
      </Label>
      <Label htmlFor="name">Role
        <Input
          id="role"
          value={user.role}
          disabled
        />
      </Label>
      {hasChanged &&
        <div className="flex gap-4">
          <Button
            className="w-1/2"
            variant="outline"
            onClick={resetSettings}
          >
            Reset
          </Button>
          <Button
            className="w-1/2"
            variant={isDisabled ? "disabled" : "default"}
            onClick={handleSubmit}
          >
            Save
          </Button>
        </div>
      }
    </div>
  );
}
