
import React from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UploadCloud } from "lucide-react";

const Materials = () => {
  return (
    <div className="space-y-6 page-transition">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-2xl font-semibold tracking-tight">শিক্ষা উপকরণ</h2>
        <Button className="btn-primary">
          <UploadCloud className="mr-2 h-4 w-4" /> নতুন উপকরণ আপলোড করুন
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>শিক্ষা উপকরণ</CardTitle>
          <CardDescription>
            পাঠ্যপুস্তক, নোট, ও শিক্ষা উপকরণসমূহ
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

export default Materials;
