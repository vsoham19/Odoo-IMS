"use client";

import { Button } from "./ui/button";
import { Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import { Sidebar } from "./sidebar";

export function Navbar() {
  return (
    <div className="flex items-center p-4 h-16 bg-white border-b shadow-sm">
      <div className="flex md:hidden">
        <Sheet>
          <SheetTrigger className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors hover:bg-gray-100 hover:text-gray-900 h-9 w-9">
            <Menu className="h-5 w-5" />
          </SheetTrigger>
          <SheetContent side="left" className="p-0 border-none bg-[#714B67]">
            <Sidebar />
          </SheetContent>
        </Sheet>
      </div>
      <div className="hidden md:flex items-center">
        <div className="relative w-80 h-20">
          <img
            src="/logo.png"
            alt="Odoo"
            className="object-contain w-full h-full"
          />
        </div>
      </div>

      <div className="flex w-full justify-end items-center gap-x-4">
        {/* User profile & Logout removed temporarily as login page is disabled */}
      </div>
    </div>
  );
}

/* cache buster */