import { cn } from "../../../lib/utils";

type CardContentProps = {
  children: React.ReactNode;
  className?: string;
};

export function CardContent({ children, className }: CardContentProps) {
  return (
    <div className={cn("p-4", className)}>
      {children}
    </div>
  );
}
