
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center max-w-lg px-6 py-8 glass-card rounded-xl animate-fadeIn">
        <h1 className="text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-700 mb-6">৪০৪</h1>
        <p className="text-2xl font-medium mb-4">পাতাটি খুঁজে পাওয়া যায়নি</p>
        <p className="text-muted-foreground mb-8">আপনি যে পাতাটি খুঁজছেন তা এই সিস্টেমে নেই। অনুগ্রহ করে আবার চেষ্টা করুন।</p>
        <Link to="/">
          <Button className="btn-primary">
            <ArrowLeft className="mr-2 h-4 w-4" />
            হোম পেজে ফিরে যান
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
