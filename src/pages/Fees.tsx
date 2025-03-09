
import React from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";

const Fees = () => {
  return (
    <div className="space-y-6 page-transition">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-2xl font-semibold tracking-tight">ফি ব্যবস্থাপনা</h2>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>ফি স্ট্রাকচার</CardTitle>
          <CardDescription>
            মাদ্রাসার ফি সংক্রান্ত নীতিমালা ও ব্যবস্থাপনা
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

export default Fees;
