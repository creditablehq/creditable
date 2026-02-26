import { useState } from "react";
import { Button, Label } from "../design-system";
import { Modal } from "../design-system/Modal";
import { uploadFileToGoogleDrive } from "../../api/drive";
import { FileQuestionMark } from "lucide-react";

interface UploadModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: () => void;
}

export interface UploadFormInput {
  file: any;
}

export function UploadModal({open, onClose, onSubmit}: UploadModalProps) {
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const handleUpload = async () => {
    if (!file) return;

    const res = await uploadFileToGoogleDrive(file);

    if (res?.fileId) {
      handleReset();
      onSubmit();
    } else {
      setError('File upload failed. Please try again.');
    }

    setIsUploading(false);
  };

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const selectedFile = e.target.files?.[0] ?? null;
    setFile(selectedFile);
    setError('');
  };

  const handleReset = () => {
    setError('');
    setFile(null);
    if (!file) onClose();
  }

  const onFileSubmission = async () => {
    setIsUploading(true);
    handleUpload();
  }

  return (
    <Modal open={open} onClose={onClose} title="Upload a Plan!">
      <div className="rounded-md bg-blue-200 p-4 flex gap-2 items-center text-blue-800">
        <FileQuestionMark size={"48px"} strokeWidth={1.25} />
        This will upload to our drives for a Creditable representative to input your plans.
      </div>
      <div className="space-y-1 mt-4">
        <Label htmlFor="upload">File Upload</Label>
        <p className="mt-1 text-sm text-gray-500">
          PDF or DOCX up to 10MB
        </p>
        <label className="flex cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-gray-300 px-4 py-6 text-center transition hover:bg-gray-50">
          <input
            type="file"
            onChange={handleFileChange}
            className="hidden"
            accept=".pdf, .docx"
          />
          <span className="text-sm text-gray-600">
            {file ? file.name : "Click to select a file"}
          </span>
          {!file && (
            <span className="mt-1 text-xs text-gray-400">
              or drag and drop
            </span>
          )}
        </label>
        {error && <span className="text-red-600 text-sm">{error}</span>}
      </div>
      <div className="flex justify-evenly items-center gap-4 mt-6">
        <Button className="w-full" onClick={handleReset} variant={isUploading ? 'disabled' : 'outline'}>
          {file ? 'Reset' : 'Cancel'}
        </Button>
        <Button className="w-full" onClick={onFileSubmission} variant={file ? 'default' : 'disabled'}>
          Submit
        </Button>
      </div>
    </Modal>
  );
}
