import { cn } from "../../../lib/utils";

type CardProps = {
  children: React.ReactNode;
  className?: string;
};

export function Card({ children, className }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-gray-200 shadow-sm bg-white",
        className
      )}
    >
      {children}
    </div>
  );
}
