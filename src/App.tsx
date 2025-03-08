
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
              <Route path="/settings" element={<div className="py-10 text-center">সেটিংস পেজ (বিকাশাধীন)</div>} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
