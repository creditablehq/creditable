import { cn } from "../../../lib/utils";

type BadgeProps = {
  children: React.ReactNode;
  id?: string;
  variant?: "default" | "success" | "destructive" | "secondary";
  className?: string;
};

export function Badge({ children, id, variant = "default", className }: BadgeProps) {
  const variantStyles = {
    default: "bg-gray-200 text-gray-800",
    success: "bg-green-100 text-green-800",
    destructive: "bg-red-100 text-red-800",
    secondary: "bg-blue-100 text-blue-800",
  };

  return (
    <span
      id={id}
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
        variantStyles[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
