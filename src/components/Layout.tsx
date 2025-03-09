
import React, { useState } from "react";
import { Outlet, Route, Routes, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

// Import components
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import Dashboard from "@/pages/Dashboard";
import Students from "@/pages/Students";
import Teachers from "@/pages/Teachers";
import Staff from "@/pages/Staff";
import Attendance from "@/pages/Attendance";
import Curriculum from "@/pages/Curriculum";
import Syllabus from "@/pages/Syllabus";
import Timetable from "@/pages/Timetable";
import Exams from "@/pages/Exams";
import Progress from "@/pages/Progress";
import Payments from "@/pages/Payments";
import Expenses from "@/pages/Expenses";
import Donations from "@/pages/Donations";
import Salaries from "@/pages/Salaries";
import Fees from "@/pages/Fees";
import Groups from "@/pages/Groups";
import Materials from "@/pages/Materials";
import Events from "@/pages/Events";
import Notifications from "@/pages/Notifications";
import Users from "@/pages/Users";
import Settings from "@/pages/Settings";
import NotFound from "@/pages/NotFound";
import Index from "@/pages/Index";

export default function Layout() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Redirect to login if not authenticated
  React.useEffect(() => {
    if (!user) {
      navigate("/");
    }
  }, [user, navigate]);

  if (!user) return <Index />;

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Sidebar for larger screens */}
      <div className="hidden md:flex h-full">
        <Sidebar />
      </div>

      {/* Mobile sidebar */}
      <div
        className={cn(
          "fixed inset-0 z-40 md:hidden transform transition-transform duration-300 ease-apple",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="relative flex h-full w-full max-w-xs flex-1 flex-col bg-sidebar pt-5 pb-4">
          <div className="absolute top-0 right-0 -mr-12 pt-2">
            <button
              type="button"
              className="ml-1 flex h-10 w-10 items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              onClick={() => setSidebarOpen(false)}
            >
              <span className="sr-only">সাইডবার বন্ধ করুন</span>
              <X className="h-6 w-6 text-white" aria-hidden="true" />
            </button>
          </div>
          <Sidebar />
        </div>
        <div className="w-14 flex-shrink-0" aria-hidden="true"></div>
      </div>

      {/* Main content area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header
          toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          showToggle={true}
        />

        <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 md:p-6 bg-background">
          <div className="mx-auto w-full max-w-7xl">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/students" element={<Students />} />
              <Route path="/teachers" element={<Teachers />} />
              <Route path="/staff" element={<Staff />} />
              <Route path="/attendance" element={<Attendance />} />
              <Route path="/curriculum" element={<Curriculum />} />
              <Route path="/syllabus" element={<Syllabus />} />
              <Route path="/timetable" element={<Timetable />} />
              <Route path="/exams" element={<Exams />} />
              <Route path="/progress" element={<Progress />} />
              <Route path="/payments" element={<Payments />} />
              <Route path="/expenses" element={<Expenses />} />
              <Route path="/donations" element={<Donations />} />
              <Route path="/salaries" element={<Salaries />} />
              <Route path="/fees" element={<Fees />} />
              <Route path="/groups" element={<Groups />} />
              <Route path="/materials" element={<Materials />} />
              <Route path="/events" element={<Events />} />
              <Route path="/notifications" element={<Notifications />} />
              <Route path="/users" element={<Users />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </main>
      </div>
    </div>
  );
}
