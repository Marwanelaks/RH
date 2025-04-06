"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Users,
  FileText,
  Calendar,
  DollarSign,
  TrendingUp,
  GraduationCap,
  BarChart,
  Settings,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";

const menuItems = [
  {
    title: "Vue d'ensemble",
    href: "/dashboard/hr",
    icon: BarChart,
  },
  {
    title: "Employés",
    href: "/dashboard/employees",
    icon: Users,
  },
  {
    title: "Contrats",
    href: "/dashboard/contracts",
    icon: FileText,
  },
  {
    title: "Congés",
    href: "/dashboard/leaves",
    icon: Calendar,
  },
  {
    title: "Salaires",
    href: "/dashboard/payroll",
    icon: DollarSign,
  },
  {
    title: "Performance",
    href: "/dashboard/performance",
    icon: TrendingUp,
  },
  {
    title: "Formation",
    href: "/dashboard/training",
    icon: GraduationCap,
  },
  {
    title: "Paramètres",
    href: "/dashboard/settings",
    icon: Settings,
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="flex flex-col h-full bg-card border-r">
      <div className="p-6">
        <Link href="/dashboard/hr" className="flex items-center space-x-2">
          <Users className="h-6 w-6 text-primary" />
          <span className="text-xl font-bold">HRManager++</span>
        </Link>
      </div>
      <nav className="flex-1 p-4">
        <ul className="space-y-1">
          {menuItems.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={cn(
                  "flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                  pathname === item.href
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-muted"
                )}
              >
                <item.icon className="h-4 w-4" />
                <span>{item.title}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <div className="p-4 border-t">
        <button className="flex items-center space-x-3 px-3 py-2 w-full rounded-lg text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors">
          <LogOut className="h-4 w-4" />
          <span>Déconnexion</span>
        </button>
      </div>
    </div>
  );
}