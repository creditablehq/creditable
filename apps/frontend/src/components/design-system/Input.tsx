import { cn } from '../../../lib/utils';
import { clsx } from 'clsx';
import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  invalid?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, invalid, disabled, ...props }, ref) => {
    return (
      <input
        ref={ref}
        disabled={disabled}
        className={cn(
          clsx(
            'w-full rounded-md border px-3 py-2 text-sm shadow-sm transition-colors',
            'bg-white text-neutral-900 dark:bg-neutral-800 dark:text-white',
            'focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-2',
            invalid
              ? 'border-red-500 focus:ring-red-500 focus:ring-offset-red-100'
              : 'border-neutral-300 dark:border-neutral-700',
            disabled && 'cursor-not-allowed opacity-50',
            className
          )
        )}
        {...props}
      />
    );
  }
);


Input.displayName = 'Input';
