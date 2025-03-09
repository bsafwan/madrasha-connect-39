
import React from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";

const Attendance = () => {
  return (
    <div className="space-y-6 page-transition">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-2xl font-semibold tracking-tight">উপস্থিতি রেকর্ড</h2>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>উপস্থিতি ব্যবস্থাপনা</CardTitle>
          <CardDescription>
            ছাত্র, শিক্ষক এবং কর্মচারীদের উপস্থিতি রেকর্ড
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

export default Attendance;
