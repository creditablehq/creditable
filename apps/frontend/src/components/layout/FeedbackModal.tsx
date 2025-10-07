import { useState } from "react";
import { Button, Combobox, Label } from "../design-system";
import { Modal } from "../design-system/Modal";
import { Textarea } from "@headlessui/react";
import clsx from "clsx";
import { createSupportTicket } from "../../api/supportTickets";

interface FeedbackModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: () => void;
}

export interface FeedbackFormInput {
  type: string;
  message: string;
}

export function FeedbackModal({open, onClose, onSubmit}: FeedbackModalProps) {
  const [form, setForm] = useState<FeedbackFormInput>({
    type: 'FEATURE_REQUEST',
    message: ''
  });

  const handleChange = (field: string, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  const handleReset = () => {
    setForm({
      type: '',
      message: ''
    });
  }

  const handleSendFeedback = async () => {
    await createSupportTicket(form);
    handleReset();
    onSubmit();
  }

  return (
    <Modal open={open} onClose={onClose} title="Give us your thoughts!">
        Thank you for using our platform! Your feedback is valuable to improving and ensuring that you have an <span className="text-[#447DDE]">in-creditable</span> testing experience.
      <div className="space-y-1 mt-4">
        <Label htmlFor="type">Inquiry Type</Label>
        <Combobox
          value={form.type}
          className="mt-1"
          onChange={(value) => handleChange('type', value)}
          options={[
            { value: 'FEATURE_REQUEST', label: 'Feature Request' },
            { value: 'BUG', label: 'Report a bug' },
          ]}
        />
        <Label htmlFor="value">
          Message
          <Textarea
            id="message"
            value={form.message}
            onChange={(e) => handleChange('message', e.target.value)}
            className={clsx(
              'w-full rounded-md border px-3 py-2 text-sm shadow-sm transition-colors',
              'bg-white text-neutral-900 dark:bg-neutral-800 dark:text-white',
              'focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-2 mb-0',
              'border-neutral-300 dark:border-neutral-700 mt-1'
            )}
          ></Textarea>
        </Label>
      </div>
      <div className="flex justify-evenly items-center gap-4 mt-6">
        <Button className="w-full" variant="outline" onClick={handleReset}>
          Reset
        </Button>
        <Button className="w-full" onClick={handleSendFeedback} variant={form.message && form.type ? 'default' : 'disabled'}>
          Submit
        </Button>
      </div>
    </Modal>
  );
}
