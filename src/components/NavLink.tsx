"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

interface NavLinkProps {
  to: string;
  children: React.ReactNode;
  className?: string | ((props: { isActive: boolean }) => string);
  end?: boolean;
  [key: string]: any;
}

const NavLink = ({ to, children, className, end, ...props }: NavLinkProps) => {
  const pathname = usePathname();
  const isActive = end ? pathname === to : pathname.startsWith(to);

  const computedClassName = typeof className === "function"
    ? className({ isActive })
    : className;

  return (
    <Link href={to} className={computedClassName} {...props}>
      {children}
    </Link>
  );
};

export default NavLink;
