import React from 'react';

interface ModalAuthWrapperProps {
  title: string;
  children: React.ReactNode;
  switchModeLabel?: string;
  onSwitchMode: () => void;
}

const ModalAuthWrapper: React.FC<ModalAuthWrapperProps> = ({
  title,
  children,
  switchModeLabel,
  onSwitchMode,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl bg-neutral-100 text-neutral-900 dark:bg-neutral-900 dark:text-neutral-100 p-8 shadow-xl border border-neutral-300 dark:border-neutral-800">
        <h2 className="mb-6 text-2xl font-semibold tracking-tight text-brand text-center">
          {title}
        </h2>
        {children}
        {switchModeLabel && <div className="mt-6 text-center">
          <button
            onClick={onSwitchMode}
            className="text-sm text-brand hover:underline transition-colors"
          >
            {switchModeLabel}
          </button>
        </div>}
      </div>
    </div>
  );
};

export default ModalAuthWrapper;
