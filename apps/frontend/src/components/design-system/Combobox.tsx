'use client';

import { useState, Fragment } from 'react';
import { ComboboxButton, ComboboxOption, ComboboxOptions, Combobox as HUICombobox } from '@headlessui/react';
import { Check, ChevronsUpDown } from 'lucide-react';
import { cn } from '../../../lib/utils';

interface ComboboxOption {
  label: string;
  value: string;
}

interface ComboboxProps {
  value: string;
  onChange: (value: string) => void;
  options: ComboboxOption[];
  placeholder?: string;
  className?: string;
  error?: string;
  disabled?: boolean;
}

export function Combobox({
  value,
  onChange,
  options,
  placeholder = 'Select an option',
  className,
  error,
  disabled = false,
}: ComboboxProps) {
  const [query, setQuery] = useState('');

  const filteredOptions =
    query === ''
      ? options
      : options.filter((option) =>
          option.label.toLowerCase().includes(query.toLowerCase())
        );

  const selectedOption = options.find((o) => o.value === value);

  return (
    <div className={className}>
      <HUICombobox value={value} onChange={onChange} disabled={disabled}>
        <div className="relative">
          <HUICombobox.Input
            className={cn(
              'w-full cursor-pointer rounded-md border bg-white px-4 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-brand dark:bg-neutral-900',
              error
                ? 'border-red-600 focus:ring-red-600 dark:border-red-600'
                : 'border-neutral-300 dark:border-neutral-700',
              disabled && 'cursor-not-allowed bg-neutral-100 dark:bg-neutral-800'
            )}
            displayValue={(val: string) =>
              options.find((opt) => opt.value === val)?.label || ''
            }
            onChange={(event) => setQuery(event.target.value)}
            placeholder={placeholder}
            autoComplete="off"
          />
          <ComboboxButton className="absolute inset-y-0 right-0 flex items-center pr-2">
            <ChevronsUpDown
              className={cn(
                'h-5 w-5 text-neutral-400',
                disabled && 'text-neutral-300'
              )}
              aria-hidden="true"
            />
          </ComboboxButton>

          {filteredOptions.length > 0 && (
            <ComboboxOptions className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md border border-neutral-200 bg-white py-1 text-sm shadow-lg focus:outline-none dark:border-neutral-700 dark:bg-neutral-900">
              {filteredOptions.map((option) => (
                <ComboboxOption
                  key={option.value}
                  value={option.value}
                  as={Fragment}
                >
                  {({ focus, selected }) => (
                    <li
                      className={cn(
                        'relative cursor-pointer select-none px-4 py-2 transition-colors',
                        focus ? 'bg-brand-light text-brand' : '',
                        selected ? 'font-medium' : 'font-normal'
                      )}
                    >
                      <span className="block truncate">{option.label}</span>
                      {selected && (
                        <span className="absolute inset-y-0 right-4 flex items-center text-brand">
                          <Check className="h-4 w-4" />
                        </span>
                      )}
                    </li>
                  )}
                </ComboboxOption>
              ))}
            </ComboboxOptions>
          )}
        </div>
      </HUICombobox>
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
}
