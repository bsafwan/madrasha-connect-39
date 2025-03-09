
import React, { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

const Teachers = () => {
  return (
    <div className="space-y-6 page-transition">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-2xl font-semibold tracking-tight">শিক্ষক ব্যবস্থাপনা</h2>
        <Button className="btn-primary">
          <PlusCircle className="mr-2 h-4 w-4" /> নতুন শিক্ষক যোগ করুন
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>সকল শিক্ষক</CardTitle>
          <CardDescription>
            মাদ্রাসার সকল শিক্ষকের তালিকা এবং বিবরণ
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-10 text-muted-foreground">
            শীঘ্রই আসছে
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Teachers;
