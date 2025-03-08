
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

const Index = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Redirect if already logged in
  React.useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    
    try {
      await login(email, password);
      navigate("/dashboard");
    } catch (error) {
      let message = "লগইন ব্যর্থ হয়েছে";
      if (error instanceof Error) {
        message = error.message;
      }
      toast({
        variant: "destructive",
        title: "ত্রুটি!",
        description: message,
      });
    } finally {
      setIsLoggingIn(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left side: Login form */}
      <div className="flex-1 flex items-center justify-center p-8 animate-fadeIn">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-700 mb-2">
              মাদরাসা কানেক্ট
            </h1>
            <p className="text-muted-foreground">
              আপনার মাদরাসা ব্যবস্থাপনা সহজ করুন
            </p>
          </div>

          <div className="glass-card p-8 rounded-2xl">
            <h2 className="text-2xl font-medium mb-6 text-center">
              লগইন করুন
            </h2>
            <form onSubmit={handleLogin}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1" htmlFor="email">
                    ইমেইল
                  </label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="আপনার ইমেইল দিন"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="form-input"
                    autoComplete="email"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1" htmlFor="password">
                    পাসওয়ার্ড
                  </label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="আপনার পাসওয়ার্ড দিন"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="form-input"
                    autoComplete="current-password"
                    required
                  />
                </div>
                <Button 
                  type="submit" 
                  className="w-full btn-primary"
                  disabled={isLoggingIn}
                >
                  {isLoggingIn ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      লগইন হচ্ছে...
                    </>
                  ) : (
                    "লগইন"
                  )}
                </Button>
              </div>
            </form>
            
            <div className="mt-6 text-center text-sm">
              <p className="text-muted-foreground">
                ডেমো একাউন্ট: admin@example.com / password
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Right side: Hero image (hidden on mobile) */}
      <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-primary/90 to-blue-700/90 items-center justify-center text-white p-8">
        <div className="max-w-lg mx-auto">
          <h2 className="text-4xl font-bold mb-6 animate-fadeIn">
            মাদরাসা ব্যবস্থাপনা সহজ করুন আধুনিক প্রযুক্তির মাধ্যমে
          </h2>
          <ul className="space-y-4 animate-slideUp">
            <li className="flex items-center">
              <div className="h-8 w-8 rounded-full bg-white/20 flex items-center justify-center mr-3">
                <span>১</span>
              </div>
              <span>ছাত্র, পেমেন্ট, এবং খরচ ব্যবস্থাপনা</span>
            </li>
            <li className="flex items-center">
              <div className="h-8 w-8 rounded-full bg-white/20 flex items-center justify-center mr-3">
                <span>২</span>
              </div>
              <span>হোয়াটসঅ্যাপ নোটিফিকেশন সিস্টেম</span>
            </li>
            <li className="flex items-center">
              <div className="h-8 w-8 rounded-full bg-white/20 flex items-center justify-center mr-3">
                <span>৩</span>
              </div>
              <span>পরীক্ষা রেজাল্ট ও কোরআন শিক্ষা ট্র্যাকিং</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Index;
