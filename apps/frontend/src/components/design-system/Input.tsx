import { cn } from '../../../lib/utils';
import { clsx } from 'clsx';
import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  invalid?: boolean;
  unit?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, invalid, disabled, unit, ...props }, ref) => {
    const handleFocus = (e: any) => {
      if (props.type === 'number') {
        e.target.addEventListener('wheel', preventScroll, { passive: false });
      }
    };

    const handleBlur = (e: any) => {
      if (props.type === 'number') {
        e.target.removeEventListener('wheel', preventScroll);
      }
    }

    const preventScroll = (e: any) => {
      e.preventDefault();
    };

    return (
      <>
        <input
          ref={ref}
          disabled={disabled}
          onFocus={handleFocus}
          onBlur={handleBlur}
          className={cn(
            clsx(
              'w-full rounded-md border px-3 py-2 text-sm shadow-sm transition-colors',
              'bg-white text-neutral-900 dark:bg-neutral-800 dark:text-white',
              'focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-2 mb-0',
              invalid
                ? 'border-red-500 focus:ring-red-500 focus:ring-offset-red-100'
                : 'border-neutral-300 dark:border-neutral-700',
              disabled && 'cursor-not-allowed opacity-50',
              className
            )
          )}
          {...props}
        />
        {unit && <span className="-ml-[45px]">{unit}</span>}
      </>
    );
  }
);


Input.displayName = 'Input';
