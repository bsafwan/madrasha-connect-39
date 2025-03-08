
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
              <Route path="/students" element={<div className="py-10 text-center">ছাত্র ব্যবস্থাপনা পেজ (বিকাশাধীন)</div>} />
              <Route path="/payments" element={<div className="py-10 text-center">পেমেন্ট ব্যবস্থাপনা পেজ (বিকাশাধীন)</div>} />
              <Route path="/expenses" element={<div className="py-10 text-center">খরচ ব্যবস্থাপনা পেজ (বিকাশাধীন)</div>} />
              <Route path="/groups" element={<div className="py-10 text-center">গ্রুপ ব্যবস্থাপনা পেজ (বিকাশাধীন)</div>} />
              <Route path="/notifications" element={<div className="py-10 text-center">নোটিফিকেশন পেজ (বিকাশাধীন)</div>} />
              <Route path="/users" element={<div className="py-10 text-center">ইউজার ব্যবস্থাপনা পেজ (বিকাশাধীন)</div>} />
              <Route path="/teachers" element={<div className="py-10 text-center">শিক্ষক ব্যবস্থাপনা পেজ (বিকাশাধীন)</div>} />
              <Route path="/staff" element={<div className="py-10 text-center">কর্মচারী ব্যবস্থাপনা পেজ (বিকাশাধীন)</div>} />
              <Route path="/attendance" element={<div className="py-10 text-center">উপস্থিতি ব্যবস্থাপনা পেজ (বিকাশাধীন)</div>} />
              <Route path="/curriculum" element={<div className="py-10 text-center">পাঠ্যক্রম ব্যবস্থাপনা পেজ (বিকাশাধীন)</div>} />
              <Route path="/syllabus" element={<div className="py-10 text-center">সিলেবাস ব্যবস্থাপনা পেজ (বিকাশাধীন)</div>} />
              <Route path="/timetable" element={<div className="py-10 text-center">ক্লাস রুটিন ব্যবস্থাপনা পেজ (বিকাশাধীন)</div>} />
              <Route path="/exams" element={<div className="py-10 text-center">পরীক্ষা ব্যবস্থাপনা পেজ (বিকাশাধীন)</div>} />
              <Route path="/progress" element={<div className="py-10 text-center">ছাত্র প্রগতি ব্যবস্থাপনা পেজ (বিকাশাধীন)</div>} />
              <Route path="/donations" element={<div className="py-10 text-center">অনুদান ব্যবস্থাপনা পেজ (বিকাশাধীন)</div>} />
              <Route path="/salaries" element={<div className="py-10 text-center">বেতন ব্যবস্থাপনা পেজ (বিকাশাধীন)</div>} />
              <Route path="/fees" element={<div className="py-10 text-center">ফি ব্যবস্থাপনা পেজ (বিকাশাধীন)</div>} />
              <Route path="/materials" element={<div className="py-10 text-center">শিক্ষা উপকরণ ব্যবস্থাপনা পেজ (বিকাশাধীন)</div>} />
              <Route path="/events" element={<div className="py-10 text-center">ইভেন্ট ব্যবস্থাপনা পেজ (বিকাশাধীন)</div>} />
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
