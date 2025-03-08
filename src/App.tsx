
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import Layout from "./components/Layout";
import Settings from "./pages/Settings";
import Students from "./pages/Students";
import Payments from "./pages/Payments";
import Expenses from "./pages/Expenses";
import Groups from "./pages/Groups";
import Notifications from "./pages/Notifications";
import Teachers from "./pages/Teachers";
import Staff from "./pages/Staff";
import Attendance from "./pages/Attendance";
import Curriculum from "./pages/Curriculum";
import Syllabus from "./pages/Syllabus";
import Timetable from "./pages/Timetable";
import Exams from "./pages/Exams";
import Progress from "./pages/Progress";
import Donations from "./pages/Donations";
import Salaries from "./pages/Salaries";
import Fees from "./pages/Fees";
import Materials from "./pages/Materials";
import Events from "./pages/Events";
import Users from "./pages/Users";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route element={<Layout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/students" element={<Students />} />
              <Route path="/payments" element={<Payments />} />
              <Route path="/expenses" element={<Expenses />} />
              <Route path="/groups" element={<Groups />} />
              <Route path="/notifications" element={<Notifications />} />
              <Route path="/users" element={<Users />} />
              <Route path="/teachers" element={<Teachers />} />
              <Route path="/staff" element={<Staff />} />
              <Route path="/attendance" element={<Attendance />} />
              <Route path="/curriculum" element={<Curriculum />} />
              <Route path="/syllabus" element={<Syllabus />} />
              <Route path="/timetable" element={<Timetable />} />
              <Route path="/exams" element={<Exams />} />
              <Route path="/progress" element={<Progress />} />
              <Route path="/donations" element={<Donations />} />
              <Route path="/salaries" element={<Salaries />} />
              <Route path="/fees" element={<Fees />} />
              <Route path="/materials" element={<Materials />} />
              <Route path="/events" element={<Events />} />
              <Route path="/settings" element={<Settings />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
