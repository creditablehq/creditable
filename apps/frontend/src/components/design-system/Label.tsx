import { cn } from '../../../lib/utils';
import { clsx } from 'clsx';
import React from 'react';

export interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {}

export const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
  ({ className, ...props }, ref) => {
    return (
      <label
        ref={ref}
        className={cn(clsx('text-sm font-medium text-gray-700', className))}
        {...props}
      />
    );
  }
);

Label.displayName = 'Label';
