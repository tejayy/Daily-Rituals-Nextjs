"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { BarChart3, Home } from "lucide-react";

export function Navigation() {
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  return (
    <nav className="fixed top-0 left-0 right-0 border-b border-neutral-200 bg-white z-50">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/" className="font-bold text-neutral-900 text-lg">
            GrowthOS
          </Link>
          <div className="flex items-center gap-6">
            <Link
              href="/"
              className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors text-sm font-medium ${
                isActive("/")
                  ? "text-neutral-900 bg-neutral-100"
                  : "text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50"
              }`}
            >
              <Home className="w-4 h-4" />
              Dashboard
            </Link>
            <Link
              href="/analytics"
              className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors text-sm font-medium ${
                isActive("/analytics")
                  ? "text-neutral-900 bg-neutral-100"
                  : "text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50"
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              Analytics
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
