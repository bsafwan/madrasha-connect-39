
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const Index = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error("ইমেইল এবং পাসওয়ার্ড উভয়ই প্রয়োজন");
      return;
    }
    
    setIsLoading(true);
    
    try {
      await login(email, password);
      navigate("/dashboard");
    } catch (error) {
      console.error("Login error:", error);
      // Error is already shown by the useAuth hook
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-700">
            মাদরাসা কানেক্ট
          </h1>
          <p className="text-muted-foreground mt-2">
            মাদরাসা ব্যবস্থাপনায় ডিজিটাল সমাধান
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>লগইন করুন</CardTitle>
            <CardDescription>
              আপনার অ্যাকাউন্টে প্রবেশ করতে ইমেইল ও পাসওয়ার্ড দিন
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleLogin}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">ইমেইল</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="আপনার ইমেইল ঠিকানা"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">পাসওয়ার্ড</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="আপনার পাসওয়ার্ড"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button
                type="submit"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? "লগইন হচ্ছে..." : "লগইন করুন"}
              </Button>
            </CardFooter>
          </form>
        </Card>
        
        <div className="mt-4 text-center text-sm text-muted-foreground">
          <p>ডেমো অ্যাকাউন্ট: admin@example.com / admin123</p>
        </div>
      </div>
    </div>
  );
};

export default Index;
