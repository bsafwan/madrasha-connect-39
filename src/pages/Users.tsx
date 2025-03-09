
import React from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";

const Users = () => {
  return (
    <div className="space-y-6 page-transition">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-2xl font-semibold tracking-tight">ইউজার ব্যবস্থাপনা</h2>
        <Button className="btn-primary">
          <UserPlus className="mr-2 h-4 w-4" /> নতুন ইউজার যোগ করুন
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>সকল ইউজার</CardTitle>
          <CardDescription>
            সিস্টেম ব্যবহারকারীদের তালিকা ও অনুমতি ব্যবস্থাপনা
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

export default Users;
