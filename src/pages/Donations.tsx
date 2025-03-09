
import React from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

const Donations = () => {
  return (
    <div className="space-y-6 page-transition">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-2xl font-semibold tracking-tight">দান-অনুদান</h2>
        <Button className="btn-primary">
          <PlusCircle className="mr-2 h-4 w-4" /> নতুন দান যোগ করুন
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>দান-অনুদান রেকর্ড</CardTitle>
          <CardDescription>
            মাদ্রাসায় আসা সকল দান-অনুদানের রেকর্ড
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

export default Donations;
