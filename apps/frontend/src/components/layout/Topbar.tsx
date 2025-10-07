import { TicketPlus } from "lucide-react";
import { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { FeedbackModal } from "./FeedbackModal";
import { Modal } from "../design-system/Modal";

const Topbar = ({ onMenuClick }: { onMenuClick?: () => void }) => {
  const { user } = useAuth();
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
  const [isThankYouModalOpen, setIsThankYouModalOpen] = useState(false);

  const handleFeedbackSubmission = () => {
    setIsFeedbackModalOpen(false);
    setIsThankYouModalOpen(true);

    setTimeout(() => {
      setIsThankYouModalOpen(false);
    }, 3500);
  }

  return (
    <header className="flex items-center justify-between px-4 py-3 border-b border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 shadow-sm">
      <div className="flex gap-2">
        <button
          className="sm:hidden text-brand self-baseline"
          onClick={onMenuClick}
        >
          ☰
        </button>
        <h1 className="sm:invisible text-lg font-semibold">Creditable</h1>
      </div>
      <div className="flex flex-row gap-3 items-center text-center">
        <TicketPlus size={20} strokeWidth={1.5} className="cursor-pointer" onClick={() => setIsFeedbackModalOpen(true)} />
        <div className="text-sm">Welcome, {user?.name?.split(" ")[0] ?? 'Broker'}</div>
      </div>
      <FeedbackModal open={isFeedbackModalOpen} onClose={() => setIsFeedbackModalOpen(false)} onSubmit={handleFeedbackSubmission} />
      <Modal open={isThankYouModalOpen} onClose={() => setIsThankYouModalOpen(false)} title="Thank you for your feedback!">
        Thank you for submitting your feedback! Your feedback is valuable to improving and ensuring that you have an <span className="text-[#447DDE]">in-creditable</span> testing experience.
      </Modal>
    </header>

  );
};

export default Topbar;
