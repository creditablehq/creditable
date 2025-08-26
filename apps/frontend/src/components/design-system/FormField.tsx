import { Label } from './Label';
import React from 'react';

interface FormFieldProps {
  label: string;
  htmlFor: string;
  children: React.ReactNode;
  error?: string;
  helpText?: string;
}

export const FormField = ({ label, htmlFor, children, error, helpText }: FormFieldProps) => {
  return (
    <div className="space-y-1">
      <Label htmlFor={htmlFor} className={error ? 'label-error' : ''}>
        {label}
      </Label>
      {React.isValidElement(children)
        ? React.cloneElement(children as React.ReactElement<any>, {
            'aria-invalid': !!error,
            className: [
              (children as any).props.className || '',
              'input-base',
              error ? 'input-error' : '',
            ]
              .filter(Boolean)
              .join(' '),
          })
        : children}
      {error ? (
        <p className="error-text">{error}</p>
      ) : helpText ? (
        <p className="help-text">{helpText}</p>
      ) : null}
    </div>
  );
};
