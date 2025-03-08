
import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

const Settings = () => {
  const { user } = useAuth();
  const [whatsappApiKey, setWhatsappApiKey] = useState("");
  const [whatsappInstanceId, setWhatsappInstanceId] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const saveWhatsAppSettings = async () => {
    if (!whatsappApiKey || !whatsappInstanceId) {
      toast({
        variant: "destructive",
        title: "সকল তথ্য দিন",
        description: "হোয়াটসঅ্যাপ এপিআই কী এবং ইনস্ট্যান্স আইডি দিতে হবে।",
      });
      return;
    }

    setIsLoading(true);
    try {
      // In a real app, you would store these in a settings table or as secrets
      // For this demo, we'll just show a success message
      toast({
        title: "সেটিংস সংরক্ষিত",
        description: "হোয়াটসঅ্যাপ সেটিংস সফলভাবে সংরক্ষিত হয়েছে।",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "সেটিংস সংরক্ষণ ব্যর্থ",
        description: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 page-transition">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-2xl font-semibold tracking-tight">সেটিংস</h2>
      </div>

      <Tabs defaultValue="whatsapp" className="w-full">
        <TabsList className="grid w-full md:w-auto grid-cols-2 md:grid-cols-3">
          <TabsTrigger value="whatsapp">হোয়াটসঅ্যাপ সেটিংস</TabsTrigger>
          <TabsTrigger value="general">সাধারণ সেটিংস</TabsTrigger>
          <TabsTrigger value="system">সিস্টেম তথ্য</TabsTrigger>
        </TabsList>
        
        <TabsContent value="whatsapp" className="space-y-4">
          <Card className="p-6">
            <h3 className="text-lg font-medium mb-4">হোয়াটসঅ্যাপ ইন্টিগ্রেশন সেটিংস</h3>
            <div className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="apiKey">এপিআই কী</Label>
                <Input 
                  id="apiKey" 
                  placeholder="হোয়াটসঅ্যাপ এপিআই কী" 
                  value={whatsappApiKey}
                  onChange={(e) => setWhatsappApiKey(e.target.value)}
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="instanceId">ইনস্ট্যান্স আইডি</Label>
                <Input 
                  id="instanceId" 
                  placeholder="হোয়াটসঅ্যাপ ইনস্ট্যান্স আইডি" 
                  value={whatsappInstanceId}
                  onChange={(e) => setWhatsappInstanceId(e.target.value)}
                />
              </div>
              
              <Button 
                className="w-full md:w-auto" 
                onClick={saveWhatsAppSettings}
                disabled={isLoading}
              >
                {isLoading ? "সংরক্ষণ হচ্ছে..." : "সেটিংস সংরক্ষণ করুন"}
              </Button>
            </div>
          </Card>
        </TabsContent>
        
        <TabsContent value="general" className="space-y-4">
          <Card className="p-6">
            <h3 className="text-lg font-medium mb-4">সাধারণ সেটিংস</h3>
            <p className="text-muted-foreground">
              এখানে সিস্টেমের সাধারণ সেটিংস পরিবর্তন করতে পারবেন।
            </p>
            <div className="mt-4">
              <Button variant="outline">সেটিংস পরিবর্তন করুন</Button>
            </div>
          </Card>
        </TabsContent>
        
        <TabsContent value="system" className="space-y-4">
          <Card className="p-6">
            <h3 className="text-lg font-medium mb-4">সিস্টেম তথ্য</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium">ডাটাবেস সংযোগঃ</p>
                  <p className="text-lg text-green-500">সক্রিয়</p>
                </div>
                <div>
                  <p className="text-sm font-medium">সিস্টেম ভার্সনঃ</p>
                  <p className="text-lg">১.০.০</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium">লগইন ব্যবহারকারীঃ</p>
                  <p className="text-lg">{user?.name}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">রোলঃ</p>
                  <p className="text-lg">{user?.role === 'admin' ? 'এডমিন' : 'শিক্ষক'}</p>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
