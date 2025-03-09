
import React from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";

const Curriculum = () => {
  return (
    <div className="space-y-6 page-transition">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-2xl font-semibold tracking-tight">পাঠ্যক্রম</h2>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>পাঠ্যক্রম ব্যবস্থাপনা</CardTitle>
          <CardDescription>
            মাদ্রাসার পাঠ্যক্রম ও কোর্স সামগ্রী
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

export default Curriculum;
