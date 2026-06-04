"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Map, 
  CalendarCheck, 
  CarFront, 
  Users,
  LogOut
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

const navItems = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Tours", href: "/admin/tours", icon: Map },
  { name: "Reservas", href: "/admin/reservas", icon: CalendarCheck },
  { name: "Saídas", href: "/admin/saidas", icon: CarFront },
  { name: "Equipa", href: "/admin/users", icon: Users },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  };

  return (
    <div className="w-64 bg-brand-gray border-r border-brand-gray-light h-full flex flex-col">
      <div className="p-6">
        <h2 className="text-2xl font-heading text-brand-orange">Viana Buggy</h2>
        <p className="text-sm text-brand-gray-text">Admin Panel</p>
      </div>

      <nav className="flex-1 px-4 space-y-2 mt-4">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-md transition-colors ${
                isActive 
                  ? "bg-brand-orange/10 text-brand-orange font-medium" 
                  : "text-brand-gray-text hover:bg-brand-gray-light hover:text-brand-white"
              }`}
            >
              <Icon className="w-5 h-5" />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-brand-gray-light">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 w-full rounded-md text-brand-gray-text hover:bg-brand-gray-light hover:text-brand-white transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span>Sair</span>
        </button>
      </div>
    </div>
  );
}
