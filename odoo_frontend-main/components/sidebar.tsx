"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  BarChart3,
  Bell,
  Settings,
  PackageOpen,
  ShoppingCart,
  Truck,
  MapPin,
  History,
  Store
} from "lucide-react";
import { cn } from "@/lib/utils";

const routes = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    href: "/dashboard",
    color: "text-white/80",
  },
  {
    label: "Inventory Stock",
    icon: Package,
    href: "/inventory",
    color: "text-white/80",
  },
  {
    label: "Products",
    icon: ShoppingCart,
    href: "/products",
    color: "text-white/80",
  },
  {
    label: "Receipts",
    icon: PackageOpen,
    href: "/operations/receipt",
    color: "text-[#a8dfe1]",
  },
  {
    label: "Deliveries",
    icon: Truck,
    href: "/operations/delivery",
    color: "text-[#a8dfe1]",
  },
  {
    label: "Move History",
    icon: History,
    href: "/move-history",
    color: "text-white/80",
  },
  {
    label: "Locations",
    icon: MapPin,
    href: "/operations/location",
    color: "text-[#a8dfe1]",
  },
  {
    label: "Analytics",
    icon: BarChart3,
    href: "/analytics",
    color: "text-white/80",
  },
  {
    label: "Warehouse Settings",
    icon: Store,
    href: "/settings/warehouse",
    color: "text-white/60",
  }
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="space-y-4 py-4 flex flex-col h-full bg-[#714B67] text-white">
      <div className="px-3 py-2 flex-1">
        <Link href="/dashboard" className="flex items-center pl-3 mb-10">
          <div className="relative w-80 h-20">
            <img
              src="/logo.png"
              alt="Odoo"
              className="object-contain w-full h-full brightness-0 invert"
            />
          </div>
        </Link>
        <div className="space-y-1">
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className={cn(
                "text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:text-white hover:bg-white/10 rounded-lg transition",
                pathname === route.href ? "text-white bg-white/10" : "text-zinc-400"
              )}
            >
              <div className="flex items-center flex-1">
                <route.icon className={cn("h-5 w-5 mr-3", route.color)} />
                {route.label}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

/* cache buster */