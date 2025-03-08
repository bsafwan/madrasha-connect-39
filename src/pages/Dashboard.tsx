
import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import { 
  Users, 
  CreditCard, 
  FileText, 
  BookOpen,
  ArrowUpRight,
  ArrowDownRight,
  TrendingUp
} from "lucide-react";
import DataCard from "@/components/DataCard";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

// Mock data for dashboard
const paymentData = [
  { month: "Jan", amount: 5000 },
  { month: "Feb", amount: 4500 },
  { month: "Mar", amount: 6000 },
  { month: "Apr", amount: 8000 },
  { month: "May", amount: 7500 },
  { month: "Jun", amount: 9000 },
];

const expenseData = [
  { category: "হল ভাড়া", amount: 3000 },
  { category: "বিদ্যুৎ", amount: 800 },
  { category: "গ্যাস", amount: 500 },
  { category: "শিক্ষক বেতন", amount: 5000 },
  { category: "অন্যান্য", amount: 1200 },
];

const studentGroups = [
  { name: "হিফজ", count: 25 },
  { name: "কায়দা", count: 35 },
  { name: "নাযেরা", count: 20 },
  { name: "সিফারা", count: 30 },
];

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-6 page-transition">
      {/* Page header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-2xl font-semibold tracking-tight">ড্যাশবোর্ড</h2>
        <div className="flex items-center">
          <span className="text-sm text-muted-foreground mr-2">
            আজকের তারিখ:
          </span>
          <span className="text-sm font-medium">
            {new Date().toLocaleDateString("bn-BD", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </span>
        </div>
      </div>

      {/* Stats overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <DataCard
          title="মোট ছাত্র"
          value="১১০"
          icon={<Users className="h-5 w-5" />}
          trend={{ value: 12, isPositive: true }}
          className="animate-slideUp"
        />
        <DataCard
          title="এ মাসের আয়"
          value="৳১৫,০০০"
          icon={<CreditCard className="h-5 w-5" />}
          trend={{ value: 8, isPositive: true }}
          className="animate-slideUp"
          description="মাসিক ফি + অতিরিক্ত ফি"
        />
        <DataCard
          title="এ মাসের খরচ"
          value="৳১০,৫০০"
          icon={<FileText className="h-5 w-5" />}
          trend={{ value: 5, isPositive: false }}
          className="animate-slideUp"
          description="সকল খরচ মিলিয়ে"
        />
        <DataCard
          title="বকেয়া পেমেন্ট"
          value="৩৬"
          icon={<BookOpen className="h-5 w-5" />}
          className="animate-slideUp"
          description="৩৬ জন ছাত্রের"
        />
      </div>

      {/* Charts */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Payment trends */}
        <Card className="p-6 hover-lift">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">পেমেন্ট ট্রেন্ড</h3>
            <div className="flex items-center text-sm text-green-500 font-medium">
              <TrendingUp className="h-4 w-4 mr-1" />
              <span>২১% বৃদ্ধি</span>
            </div>
          </div>
          <div className="h-[300px] mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={paymentData}
                margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
              >
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  axisLine={false}
                  dy={10}
                />
                <YAxis
                  tickFormatter={(value) => `৳${value}`}
                  tickLine={false}
                  axisLine={false}
                  dx={-10}
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="rounded-lg border bg-background p-2 shadow-sm">
                          <div className="grid grid-cols-2 gap-2">
                            <div className="flex flex-col">
                              <span className="text-[0.70rem] uppercase text-muted-foreground">
                                মাস
                              </span>
                              <span className="font-bold text-foreground">
                                {payload[0].payload.month}
                              </span>
                            </div>
                            <div className="flex flex-col">
                              <span className="text-[0.70rem] uppercase text-muted-foreground">
                                পরিমাণ
                              </span>
                              <span className="font-bold text-foreground">
                                ৳{payload[0].value}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="amount"
                  stroke="hsl(var(--primary))"
                  fill="hsl(var(--primary) / 0.2)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Expense breakdown */}
        <Card className="p-6 hover-lift">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">খরচের বিবরণ</h3>
            <div className="flex items-center text-sm text-muted-foreground font-medium">
              <span>এ মাসের</span>
            </div>
          </div>
          <div className="h-[300px] mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={expenseData}
                margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
                layout="vertical"
              >
                <XAxis type="number" hide />
                <YAxis
                  dataKey="category"
                  type="category"
                  axisLine={false}
                  tickLine={false}
                  width={100}
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="rounded-lg border bg-background p-2 shadow-sm">
                          <div className="grid grid-cols-2 gap-2">
                            <div className="flex flex-col">
                              <span className="text-[0.70rem] uppercase text-muted-foreground">
                                খাত
                              </span>
                              <span className="font-bold text-foreground">
                                {payload[0].payload.category}
                              </span>
                            </div>
                            <div className="flex flex-col">
                              <span className="text-[0.70rem] uppercase text-muted-foreground">
                                পরিমাণ
                              </span>
                              <span className="font-bold text-foreground">
                                ৳{payload[0].value}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar
                  dataKey="amount"
                  fill="hsl(var(--primary))"
                  radius={[4, 4, 4, 4]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Student groups and actions */}
      <div className="grid gap-4 md:grid-cols-3">
        {/* Student groups */}
        <Card className="md:col-span-2 p-6 hover-lift">
          <h3 className="text-lg font-medium mb-4">ছাত্র গ্রুপ</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {studentGroups.map((group) => (
              <div
                key={group.name}
                className="flex flex-col p-4 border rounded-lg bg-background hover:border-primary/50 transition-all"
              >
                <span className="text-sm text-muted-foreground mb-1">
                  {group.name}
                </span>
                <span className="text-2xl font-medium">{group.count} জন</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Quick actions */}
        <Card className="p-6 hover-lift">
          <h3 className="text-lg font-medium mb-4">দ্রুত কাজ</h3>
          <div className="space-y-2">
            <Button className="w-full justify-between btn-primary">
              নতুন ছাত্র যোগ করুন <ArrowUpRight className="h-4 w-4" />
            </Button>
            <Button className="w-full justify-between" variant="outline">
              পেমেন্ট রেকর্ড করুন <ArrowUpRight className="h-4 w-4" />
            </Button>
            <Button className="w-full justify-between" variant="outline">
              খরচ যোগ করুন <ArrowDownRight className="h-4 w-4" />
            </Button>
            <Button className="w-full justify-between" variant="outline">
              ফি রিমাইন্ডার পাঠান <ArrowUpRight className="h-4 w-4" />
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
