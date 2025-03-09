
import React from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";

const Timetable = () => {
  return (
    <div className="space-y-6 page-transition">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-2xl font-semibold tracking-tight">রুটিন</h2>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>ক্লাস রুটিন</CardTitle>
          <CardDescription>
            মাদ্রাসার বিভিন্ন শ্রেণীর ক্লাস রুটিন
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

export default Timetable;
