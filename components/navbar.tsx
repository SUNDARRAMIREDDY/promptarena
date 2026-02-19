"use client";

import Link from "next/link";
import { useAuth } from "@/components/auth-provider";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkles, LogOut, LayoutDashboard, Shield, User } from "lucide-react";

export function Navbar() {
  const { user, isAdmin, logout } = useAuth();

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        <Link href={user ? (isAdmin ? "/admin" : "/dashboard") : "/"} className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
            <Sparkles className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-lg font-semibold text-foreground">
            PromptArena
          </span>
        </Link>

        {user && (
          <nav className="flex items-center gap-3">
            {isAdmin && (
              <Button variant="ghost" size="sm" asChild>
                <Link href="/admin" className="flex items-center gap-1.5">
                  <Shield className="h-4 w-4" />
                  <span className="hidden sm:inline">Admin</span>
                </Link>
              </Button>
            )}

            <Button variant="ghost" size="sm" asChild>
              <Link href="/dashboard" className="flex items-center gap-1.5">
                <LayoutDashboard className="h-4 w-4" />
                <span className="hidden sm:inline">Dashboard</span>
              </Link>
            </Button>

            <div className="flex items-center gap-2 rounded-full border border-border px-3 py-1.5">
              <User className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium text-foreground">
                {user.name}
              </span>
              <Badge
                variant={isAdmin ? "default" : "secondary"}
                className="text-[10px] px-1.5 py-0"
              >
                {user.role}
              </Badge>
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={logout}
              className="text-muted-foreground hover:text-foreground"
            >
              <LogOut className="h-4 w-4" />
              <span className="sr-only">Logout</span>
            </Button>
          </nav>
        )}
      </div>
    </header>
  );
}
