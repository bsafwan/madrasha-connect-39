
import React from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";

const Progress = () => {
  return (
    <div className="space-y-6 page-transition">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-2xl font-semibold tracking-tight">অগ্রগতি</h2>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>ছাত্র অগ্রগতি</CardTitle>
          <CardDescription>
            ছাত্রদের পড়াশোনা ও হিফজের অগ্রগতি
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

export default Progress;
