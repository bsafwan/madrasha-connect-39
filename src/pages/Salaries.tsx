
import React from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";

const Salaries = () => {
  return (
    <div className="space-y-6 page-transition">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-2xl font-semibold tracking-tight">বেতন ব্যবস্থাপনা</h2>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>বেতন রেকর্ড</CardTitle>
          <CardDescription>
            শিক্ষক ও কর্মচারীদের বেতন সংক্রান্ত তথ্য
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

export default Salaries;
