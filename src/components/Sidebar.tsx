
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import {
  LayoutDashboard,
  Users,
  CreditCard,
  BookOpen,
  FileText,
  Settings,
  UserCircle,
  Bell,
} from "lucide-react";

interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  href: string;
  active?: boolean;
  allowedRoles?: string[];
}

const SidebarItem = ({
  icon,
  label,
  href,
  active,
  allowedRoles = ["admin", "teacher"],
}: SidebarItemProps) => {
  const { user } = useAuth();
  
  if (!user || !allowedRoles.includes(user.role)) return null;

  return (
    <Link
      to={href}
      className={cn(
        "flex items-center rounded-lg px-3 py-2 text-sm transition-all duration-300 ease-apple group hover-lift",
        active
          ? "bg-primary text-primary-foreground"
          : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
      )}
    >
      <div className="mr-2 h-5 w-5">{icon}</div>
      <span>{label}</span>
    </Link>
  );
};

const Sidebar = () => {
  const location = useLocation();
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div className="flex h-full w-64 flex-col border-r border-border/50 bg-sidebar">
      <div className="flex flex-col flex-1 overflow-y-auto py-6 px-3">
        {/* App Logo */}
        <div className="flex h-16 shrink-0 items-center justify-center px-4">
          <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-700">
            মাদরাসা কানেক্ট
          </h2>
        </div>

        {/* Navigation Links */}
        <nav className="mt-8 flex flex-1 flex-col space-y-1 px-2">
          <SidebarItem
            icon={<LayoutDashboard />}
            label="ড্যাশবোর্ড"
            href="/dashboard"
            active={location.pathname === "/dashboard"}
          />
          <SidebarItem
            icon={<Users />}
            label="ছাত্র ব্যবস্থাপনা"
            href="/students"
            active={location.pathname.startsWith("/students")}
          />
          <SidebarItem
            icon={<CreditCard />}
            label="পেমেন্ট"
            href="/payments"
            active={location.pathname.startsWith("/payments")}
          />
          <SidebarItem
            icon={<FileText />}
            label="খরচ ব্যবস্থাপনা"
            href="/expenses"
            active={location.pathname.startsWith("/expenses")}
          />
          <SidebarItem
            icon={<BookOpen />}
            label="গ্রুপ ব্যবস্থাপনা"
            href="/groups"
            active={location.pathname.startsWith("/groups")}
          />
          <SidebarItem
            icon={<Bell />}
            label="নোটিফিকেশন"
            href="/notifications"
            active={location.pathname.startsWith("/notifications")}
          />
          {user.role === "admin" && (
            <>
              <SidebarItem
                icon={<UserCircle />}
                label="ইউজার ব্যবস্থাপনা"
                href="/users"
                active={location.pathname.startsWith("/users")}
                allowedRoles={["admin"]}
              />
              <SidebarItem
                icon={<Settings />}
                label="সেটিংস"
                href="/settings"
                active={location.pathname.startsWith("/settings")}
                allowedRoles={["admin"]}
              />
            </>
          )}
        </nav>

        {/* User Info */}
        <div className="mt-auto px-2 py-2">
          <div className="flex items-center justify-start rounded-lg px-3 py-2 text-sm text-sidebar-foreground">
            <div className="flex flex-col">
              <span className="font-medium">{user.name}</span>
              <span className="text-xs text-muted-foreground">
                {user.role === "admin" ? "অ্যাডমিন" : "শিক্ষক"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
