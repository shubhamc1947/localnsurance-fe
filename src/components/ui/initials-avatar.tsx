import { cn } from "@/lib/utils";

const COLORS = [
  "bg-blue-500", "bg-green-500", "bg-orange-500", "bg-purple-500",
  "bg-pink-500", "bg-teal-500", "bg-indigo-500", "bg-red-500",
];

function getColor(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return COLORS[Math.abs(hash) % COLORS.length];
}

interface InitialsAvatarProps {
  name: string;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

const sizeClasses = {
  sm: "w-8 h-8 text-xs",
  md: "w-10 h-10 text-sm",
  lg: "w-12 h-12 text-base",
  xl: "w-24 h-24 text-2xl",
};

export function InitialsAvatar({ name, size = "md", className }: InitialsAvatarProps) {
  const parts = (name || "?").split(" ").filter(Boolean);
  const initials = parts.length >= 2
    ? `${parts[0][0]}${parts[1][0]}`.toUpperCase()
    : (parts[0]?.[0] || "?").toUpperCase();

  return (
    <div className={cn(
      "rounded-full flex items-center justify-center text-white font-semibold shrink-0",
      getColor(name),
      sizeClasses[size],
      className
    )}>
      {initials}
    </div>
  );
}
