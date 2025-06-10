import { cn } from '../../../lib/utils'; // components/Button.tsx
import { clsx } from 'clsx';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'disabled';
}

export function Button({ className, variant = 'default', ...props }: ButtonProps) {
  return (
    <button
      className={cn(clsx(
        'inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-medium transition-colors',
        'focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-2',
        {
          'bg-brand text-white hover:bg-brand-dark': variant === 'default',
          'border border-brand text-brand hover:bg-brand-light': variant === 'outline',
          'border border-muted-100 text-muted-100 dark:border-muted-900 dark:text-muted-900 cursor-not-allowed': variant === 'disabled',
          'cursor-pointer': variant !== 'disabled',
        },
        className
      ))}
      disabled={variant === 'disabled'}
      {...props}
    />
  );
}
