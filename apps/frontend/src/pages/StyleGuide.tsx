import { useState } from "react";
import { Button, Combobox, FormField, Input } from "../components/design-system";
import ThemeSwitcher from "../components/ThemeSwitcher";
import { Modal } from "../components/design-system/Modal";
import { Table } from "../components/design-system/Table";

const StyleGuide = () => {
  // Data for Combobox
  const determinationOptions = [
    { label: 'Simplified Determination', value: 'simple' },
    { label: 'Actuarial Determination', value: 'actuarial' },
  ];
  const columns = ['Name', 'Email', 'Role'];
  const data = [
    { Name: 'Alice Johnson', Email: 'alice@example.com', Role: 'Broker' },
    { Name: 'Bob Smith', Email: 'bob@example.com', Role: 'Admin' },
    { Name: 'Carol Lee', Email: 'carol@example.com', Role: 'Support' },
  ];
  const [selectedDetermination, setSelectedDetermination] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  // Example validation on blur or submit
  const error = selectedDetermination === '' ? 'Please select a plan' : '';
  
  return (
    <div className="space-y-12">
      <h1 className="text-3xl font-bold text-brand">🎨 Style Guide – Creditable</h1>

      <ThemeSwitcher />

      {/* Colors */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Color Palette</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <ColorBox name="brand" className="bg-brand" />
          <ColorBox name="brand-dark" className="bg-brand-dark text-white" />
          <ColorBox name="brand-light" className="bg-brand-light" />
          <ColorBox name="neutral-100" className="bg-neutral-100 border" />
          <ColorBox name="neutral-900" className="bg-neutral-900 text-white" />
        </div>
      </section>

      {/* Typography */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Typography</h2>
        <div className="space-y-2">
          <p className="text-3xl font-bold">Heading 1 – 3xl / Bold</p>
          <p className="text-xl font-semibold">Heading 2 – xl / Semibold</p>
          <p className="text-base">Body Text – base</p>
          <p className="text-sm text-neutral-600">Caption – sm / muted</p>
        </div>
      </section>

      {/* Buttons */}
      <section>
        <h2 className="text-xl font-semibold mb-2">Buttons</h2>
        <div className="flex gap-4">
          <Button>Default</Button>
          <Button variant="outline">Outline</Button>
          <Button className="bg-green-600 hover:bg-green-700">Custom</Button>
          <Button variant="disabled">Disabled</Button>
        </div>
      </section>

      {/* Input */}
      <section>
        <h2 className="text-xl font-semibold mb-2">Inputs</h2>
        <div className="space-y-2 max-w-sm">
          <Input placeholder="Default input" />
          <Input placeholder="Disabled input" disabled />
          <Input className="border-red-500" placeholder="Custom styled" />
        </div>
      </section>

      {/* Form Field */}
      <section>
        <h2 className="text-xl font-semibold mb-2">Form Fields</h2>
        <div className="space-y-4 max-w-sm">
          <FormField label="Email" htmlFor="email" helpText="We’ll never share your email.">
            <Input id="email" name="email" placeholder="you@example.com" />
          </FormField>

          <FormField label="Password" htmlFor="password" error="Password is too short">
            <Input id="password" type="password" />
          </FormField>
        </div>
      </section>

      {/* Combobox */}
      <section>
        <h2 className="mb-4 text-xl font-semibold">Combobox</h2>
        <Combobox
          value={selectedDetermination}
          onChange={setSelectedDetermination}
          options={determinationOptions}
          placeholder="Select an option"
          className="w-64"
          error={error}
        />
      </section>

      {/* Modal */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Modal</h2>
        <div className="space-y-4">
          <Button onClick={() => setIsOpen(true)}>Open Modal</Button>

          <Modal
            open={isOpen}
            onClose={() => setIsOpen(false)}
            title="Example Modal"
            footer={
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={() => setIsOpen(false)}>Confirm</Button>
              </div>
            }
          >
            This is the body content of the modal. You can place anything here, including forms or other components.
          </Modal>
        </div>
      </section>

      {/* Table */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Table</h2>
        <Table columns={columns} data={data} />
      </section>
    </div>
  );
};

const ColorBox = ({ name, className }: { name: string; className: string }) => (
  <div className={`h-16 rounded flex items-center justify-center text-sm ${className}`}>
    {name}
  </div>
);

export default StyleGuide;
