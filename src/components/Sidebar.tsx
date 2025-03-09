
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
  Calendar,
  GraduationCap,
  UserCog,
  CalendarClock,
  BookText,
  BookOpenText,
  Timer,
  BookMarked,
  TrendingUp,
  HeartHandshake,
  DollarSign,
  Receipt,
  FileBox,
  Landmark
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
            icon={<GraduationCap />}
            label="শিক্ষকগণ"
            href="/teachers"
            active={location.pathname.startsWith("/teachers")}
          />
          <SidebarItem
            icon={<UserCog />}
            label="কর্মচারীগণ"
            href="/staff"
            active={location.pathname.startsWith("/staff")}
          />
          <SidebarItem
            icon={<CalendarClock />}
            label="উপস্থিতি"
            href="/attendance"
            active={location.pathname.startsWith("/attendance")}
          />
          <SidebarItem
            icon={<BookText />}
            label="পাঠ্যক্রম"
            href="/curriculum"
            active={location.pathname.startsWith("/curriculum")}
          />
          <SidebarItem
            icon={<BookOpenText />}
            label="সিলেবাস"
            href="/syllabus"
            active={location.pathname.startsWith("/syllabus")}
          />
          <SidebarItem
            icon={<Timer />}
            label="সময়সূচি"
            href="/timetable"
            active={location.pathname.startsWith("/timetable")}
          />
          <SidebarItem
            icon={<BookMarked />}
            label="পরীক্ষা"
            href="/exams"
            active={location.pathname.startsWith("/exams")}
          />
          <SidebarItem
            icon={<TrendingUp />}
            label="কোরআন প্রোগ্রেস"
            href="/progress"
            active={location.pathname.startsWith("/progress")}
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
            icon={<HeartHandshake />}
            label="অনুদান"
            href="/donations"
            active={location.pathname.startsWith("/donations")}
          />
          <SidebarItem
            icon={<DollarSign />}
            label="বেতন"
            href="/salaries"
            active={location.pathname.startsWith("/salaries")}
          />
          <SidebarItem
            icon={<Receipt />}
            label="ফি সম্পর্কিত"
            href="/fees"
            active={location.pathname.startsWith("/fees")}
          />
          <SidebarItem
            icon={<BookOpen />}
            label="গ্রুপ ব্যবস্থাপনা"
            href="/groups"
            active={location.pathname.startsWith("/groups")}
          />
          <SidebarItem
            icon={<FileBox />}
            label="শিক্ষা উপকরণ"
            href="/materials"
            active={location.pathname.startsWith("/materials")}
          />
          <SidebarItem
            icon={<Calendar />}
            label="ইভেন্ট"
            href="/events"
            active={location.pathname.startsWith("/events")}
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
