
import React from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";

const Exams = () => {
  return (
    <div className="space-y-6 page-transition">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-2xl font-semibold tracking-tight">পরীক্ষা</h2>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>পরীক্ষা ব্যবস্থাপনা</CardTitle>
          <CardDescription>
            মাদ্রাসার পরীক্ষা সংক্রান্ত তথ্য ও ফলাফল
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

export default Exams;
