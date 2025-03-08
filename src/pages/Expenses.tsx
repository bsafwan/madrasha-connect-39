
import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { formatCurrency, toBengaliNumber, formatDateBengali } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { Expense, ExpenseCategory, ExpenseStatus } from "@/types";
import { Trash2, PlusCircle, CheckCircle, XCircle } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import DataCard from "@/components/DataCard";

const Expenses = () => {
  const { user } = useAuth();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [filteredExpenses, setFilteredExpenses] = useState<Expense[]>([]);
  const [users, setUsers] = useState<{ id: string; name: string }[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [filter, setFilter] = useState("all");

  const [formData, setFormData] = useState({
    title: "",
    amount: 0,
    category: "fixed" as ExpenseCategory,
    subcategory: "",
    description: "",
  });

  const [stats, setStats] = useState({
    totalExpenses: 0,
    verifiedExpenses: 0,
    pendingExpenses: 0,
    rejectedExpenses: 0,
  });

  // Load expenses data
  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        setIsLoading(true);
        const { data: expensesData, error: expensesError } = await supabase
          .from("expenses")
          .select("*")
          .order("date", { ascending: false });

        if (expensesError) throw expensesError;

        const { data: usersData, error: usersError } = await supabase
          .from("users")
          .select("id, name");

        if (usersError) throw usersError;

        setUsers(usersData || []);

        // Add creator and verifier names to expenses
        const expensesWithNames = expensesData?.map((expense) => {
          const creator = usersData?.find((u) => u.id === expense.created_by);
          const verifier = usersData?.find((u) => u.id === expense.verified_by);
          return {
            id: expense.id,
            title: expense.title,
            amount: expense.amount,
            date: expense.date,
            category: expense.category as ExpenseCategory,
            subcategory: expense.subcategory,
            description: expense.description || "",
            status: expense.status as ExpenseStatus,
            createdBy: expense.created_by,
            createdByName: creator?.name || "অজানা",
            verifiedBy: expense.verified_by,
            verifiedByName: verifier?.name || "",
          };
        });

        if (expensesWithNames) {
          setExpenses(expensesWithNames);
          setFilteredExpenses(expensesWithNames);

          // Calculate stats
          const total = expensesWithNames.reduce((sum, exp) => sum + Number(exp.amount), 0);
          const verified = expensesWithNames
            .filter((exp) => exp.status === "verified")
            .reduce((sum, exp) => sum + Number(exp.amount), 0);
          const pending = expensesWithNames
            .filter((exp) => exp.status === "pending")
            .reduce((sum, exp) => sum + Number(exp.amount), 0);
          const rejected = expensesWithNames
            .filter((exp) => exp.status === "rejected")
            .reduce((sum, exp) => sum + Number(exp.amount), 0);

          setStats({
            totalExpenses: total,
            verifiedExpenses: verified,
            pendingExpenses: pending,
            rejectedExpenses: rejected,
          });
        }
      } catch (error) {
        console.error("Error fetching expenses:", error);
        toast({
          variant: "destructive",
          title: "ত্রুটি!",
          description: "খরচের তথ্য লোড করতে সমস্যা হয়েছে।",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchExpenses();
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "amount" ? Number(value) : value,
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFilterChange = (value: string) => {
    setFilter(value);
    if (value === "all") {
      setFilteredExpenses(expenses);
    } else {
      setFilteredExpenses(expenses.filter((exp) => exp.status === value));
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      amount: 0,
      category: "fixed" as ExpenseCategory,
      subcategory: "",
      description: "",
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      const { title, amount, category, subcategory, description } = formData;

      if (!title || amount <= 0 || !subcategory) {
        toast({
          variant: "destructive",
          title: "ফর্ম পূরণ করুন",
          description: "সমস্ত প্রয়োজনীয় তথ্য দিন।",
        });
        return;
      }

      const newExpense = {
        title,
        amount,
        category,
        subcategory,
        description,
        status: "pending" as ExpenseStatus,
        created_by: user.id,
        date: new Date().toISOString(),
      };

      const { data, error } = await supabase.from("expenses").insert(newExpense).select();

      if (error) throw error;

      if (data && data[0]) {
        const createdExpense: Expense = {
          id: data[0].id,
          title: data[0].title,
          amount: data[0].amount,
          date: data[0].date,
          category: data[0].category as ExpenseCategory,
          subcategory: data[0].subcategory,
          description: data[0].description || "",
          status: data[0].status as ExpenseStatus,
          createdBy: data[0].created_by,
          createdByName: user.name,
        };

        setExpenses([createdExpense, ...expenses]);
        if (filter === "all" || filter === "pending") {
          setFilteredExpenses([createdExpense, ...filteredExpenses]);
        }

        setStats({
          ...stats,
          totalExpenses: stats.totalExpenses + amount,
          pendingExpenses: stats.pendingExpenses + amount,
        });

        toast({
          title: "খরচ যোগ করা হয়েছে",
          description: "নতুন খরচ সফলভাবে যোগ করা হয়েছে।",
        });

        resetForm();
        setIsAdding(false);
      }
    } catch (error) {
      console.error("Error adding expense:", error);
      toast({
        variant: "destructive",
        title: "ত্রুটি!",
        description: "খরচ যোগ করতে সমস্যা হয়েছে।",
      });
    }
  };

  const handleUpdateStatus = async (id: string, newStatus: ExpenseStatus) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from("expenses")
        .update({
          status: newStatus,
          verified_by: user.id,
        })
        .eq("id", id);

      if (error) throw error;

      // Update local state
      const updatedExpenses = expenses.map((exp) =>
        exp.id === id
          ? {
              ...exp,
              status: newStatus,
              verifiedBy: user.id,
              verifiedByName: user.name,
            }
          : exp
      );

      setExpenses(updatedExpenses);
      setFilteredExpenses(
        filter === "all"
          ? updatedExpenses
          : updatedExpenses.filter((exp) => exp.status === filter)
      );

      // Update stats
      const expense = expenses.find((exp) => exp.id === id);
      if (expense) {
        const amount = Number(expense.amount);
        const oldStatus = expense.status;

        const newStats = { ...stats };

        // Remove from old status category
        if (oldStatus === "pending") newStats.pendingExpenses -= amount;
        else if (oldStatus === "verified") newStats.verifiedExpenses -= amount;
        else if (oldStatus === "rejected") newStats.rejectedExpenses -= amount;

        // Add to new status category
        if (newStatus === "pending") newStats.pendingExpenses += amount;
        else if (newStatus === "verified") newStats.verifiedExpenses += amount;
        else if (newStatus === "rejected") newStats.rejectedExpenses += amount;

        setStats(newStats);
      }

      toast({
        title: "স্ট্যাটাস আপডেট হয়েছে",
        description: `খরচের স্ট্যাটাস "${newStatus}" তে আপডেট করা হয়েছে।`,
      });
    } catch (error) {
      console.error("Error updating expense status:", error);
      toast({
        variant: "destructive",
        title: "ত্রুটি!",
        description: "স্ট্যাটাস আপডেট করতে সমস্যা হয়েছে।",
      });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase.from("expenses").delete().eq("id", id);

      if (error) throw error;

      // Update local state
      const expenseToRemove = expenses.find((exp) => exp.id === id);
      const updatedExpenses = expenses.filter((exp) => exp.id !== id);
      setExpenses(updatedExpenses);
      setFilteredExpenses(
        filter === "all"
          ? updatedExpenses
          : updatedExpenses.filter((exp) => exp.status === filter)
      );

      // Update stats
      if (expenseToRemove) {
        const amount = Number(expenseToRemove.amount);
        const status = expenseToRemove.status;

        const newStats = { ...stats };
        newStats.totalExpenses -= amount;

        if (status === "pending") newStats.pendingExpenses -= amount;
        else if (status === "verified") newStats.verifiedExpenses -= amount;
        else if (status === "rejected") newStats.rejectedExpenses -= amount;

        setStats(newStats);
      }

      toast({
        title: "খরচ ডিলিট করা হয়েছে",
        description: "খরচ সফলভাবে ডিলিট করা হয়েছে।",
      });
    } catch (error) {
      console.error("Error deleting expense:", error);
      toast({
        variant: "destructive",
        title: "ত্রুটি!",
        description: "খরচ ডিলিট করতে সমস্যা হয়েছে।",
      });
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">খরচ ব্যবস্থাপনা</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <DataCard
          title="মোট খরচ"
          value={formatCurrency(stats.totalExpenses)}
          icon="৳"
          className="bg-blue-50"
        />
        <DataCard
          title="অনুমোদিত খরচ"
          value={formatCurrency(stats.verifiedExpenses)}
          icon="৳"
          className="bg-green-50"
        />
        <DataCard
          title="অপেক্ষমান খরচ"
          value={formatCurrency(stats.pendingExpenses)}
          icon="৳"
          className="bg-yellow-50"
        />
        <DataCard
          title="বাতিল খরচ"
          value={formatCurrency(stats.rejectedExpenses)}
          icon="৳"
          className="bg-red-50"
        />
      </div>

      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">খরচের তালিকা</h2>
        <Button onClick={() => setIsAdding(true)} className="flex items-center gap-2">
          <PlusCircle className="h-4 w-4" /> নতুন খরচ যোগ করুন
        </Button>
      </div>

      <Dialog open={isAdding} onOpenChange={setIsAdding}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>নতুন খরচ যোগ করুন</DialogTitle>
            <DialogDescription>
              নতুন খরচের বিবরণ দিন। সমস্ত তথ্য সঠিকভাবে পূরণ করুন।
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="title">খরচের শিরোনাম</Label>
                <Input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="amount">পরিমাণ (৳)</Label>
                <Input
                  id="amount"
                  name="amount"
                  type="number"
                  min="0"
                  value={formData.amount}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="category">ক্যাটেগরি</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => handleSelectChange("category", value)}
                >
                  <SelectTrigger id="category">
                    <SelectValue placeholder="ক্যাটেগরি নির্বাচন করুন" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fixed">স্থায়ী খরচ</SelectItem>
                    <SelectItem value="dynamic">অস্থায়ী খরচ</SelectItem>
                    <SelectItem value="other">অন্যান্য</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="subcategory">সাব-ক্যাটেগরি</Label>
                <Input
                  id="subcategory"
                  name="subcategory"
                  value={formData.subcategory}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="description">বিবরণ</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" type="button" onClick={() => setIsAdding(false)}>
                বাতিল
              </Button>
              <Button type="submit">সংরক্ষণ করুন</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Tabs defaultValue="all" className="w-full mt-4" onValueChange={handleFilterChange}>
        <TabsList className="grid grid-cols-4 mb-4">
          <TabsTrigger value="all">সমস্ত খরচ</TabsTrigger>
          <TabsTrigger value="pending">অপেক্ষমান</TabsTrigger>
          <TabsTrigger value="verified">অনুমোদিত</TabsTrigger>
          <TabsTrigger value="rejected">বাতিল</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-0">
          <Card className="p-0">
            {isLoading ? (
              <div className="p-4 space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="flex flex-col space-y-3">
                    <Skeleton className="h-6 w-full" />
                    <Skeleton className="h-4 w-4/5" />
                  </div>
                ))}
              </div>
            ) : (
              <Table>
                <TableCaption>মোট {filteredExpenses.length} টি খরচ</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead>শিরোনাম</TableHead>
                    <TableHead>পরিমাণ</TableHead>
                    <TableHead>তারিখ</TableHead>
                    <TableHead>ক্যাটেগরি</TableHead>
                    <TableHead>অবস্থা</TableHead>
                    <TableHead>সম্পাদক</TableHead>
                    <TableHead>কর্ম</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredExpenses.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8">
                        কোন খরচ পাওয়া যায়নি
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredExpenses.map((expense) => (
                      <TableRow key={expense.id}>
                        <TableCell className="font-medium">{expense.title}</TableCell>
                        <TableCell>{formatCurrency(expense.amount)}</TableCell>
                        <TableCell>{formatDateBengali(expense.date)}</TableCell>
                        <TableCell>
                          {expense.category === "fixed"
                            ? "স্থায়ী"
                            : expense.category === "dynamic"
                            ? "অস্থায়ী"
                            : "অন্যান্য"}{" "}
                          ({expense.subcategory})
                        </TableCell>
                        <TableCell>
                          <span
                            className={`px-2 py-1 rounded-full text-xs ${
                              expense.status === "verified"
                                ? "bg-green-100 text-green-800"
                                : expense.status === "pending"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {expense.status === "verified"
                              ? "অনুমোদিত"
                              : expense.status === "pending"
                              ? "অপেক্ষমান"
                              : "বাতিল"}
                          </span>
                        </TableCell>
                        <TableCell>{expense.createdByName}</TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            {expense.status === "pending" && user?.role === "admin" && (
                              <>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleUpdateStatus(expense.id, "verified")}
                                  title="অনুমোদন করুন"
                                >
                                  <CheckCircle className="h-4 w-4 text-green-600" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleUpdateStatus(expense.id, "rejected")}
                                  title="বাতিল করুন"
                                >
                                  <XCircle className="h-4 w-4 text-red-600" />
                                </Button>
                              </>
                            )}
                            {(user?.role === "admin" ||
                              (expense.status === "pending" &&
                                user?.id === expense.createdBy)) && (
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleDelete(expense.id)}
                                title="ডিলিট করুন"
                              >
                                <Trash2 className="h-4 w-4 text-red-600" />
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            )}
          </Card>
        </TabsContent>

        <TabsContent value="pending" className="mt-0">
          <Card className="p-0">
            <Table>
              <TableCaption>
                অপেক্ষমান খরচ -{" "}
                {filteredExpenses.filter((exp) => exp.status === "pending").length} টি
              </TableCaption>
              {/* Same table structure as above */}
              <TableHeader>
                <TableRow>
                  <TableHead>শিরোনাম</TableHead>
                  <TableHead>পরিমাণ</TableHead>
                  <TableHead>তারিখ</TableHead>
                  <TableHead>ক্যাটেগরি</TableHead>
                  <TableHead>সম্পাদক</TableHead>
                  <TableHead>কর্ম</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredExpenses.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      কোন অপেক্ষমান খরচ পাওয়া যায়নি
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredExpenses.map((expense) => (
                    <TableRow key={expense.id}>
                      <TableCell className="font-medium">{expense.title}</TableCell>
                      <TableCell>{formatCurrency(expense.amount)}</TableCell>
                      <TableCell>{formatDateBengali(expense.date)}</TableCell>
                      <TableCell>
                        {expense.category === "fixed"
                          ? "স্থায়ী"
                          : expense.category === "dynamic"
                          ? "অস্থায়ী"
                          : "অন্যান্য"}{" "}
                        ({expense.subcategory})
                      </TableCell>
                      <TableCell>{expense.createdByName}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          {user?.role === "admin" && (
                            <>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleUpdateStatus(expense.id, "verified")}
                                title="অনুমোদন করুন"
                              >
                                <CheckCircle className="h-4 w-4 text-green-600" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleUpdateStatus(expense.id, "rejected")}
                                title="বাতিল করুন"
                              >
                                <XCircle className="h-4 w-4 text-red-600" />
                              </Button>
                            </>
                          )}
                          {(user?.role === "admin" || user?.id === expense.createdBy) && (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDelete(expense.id)}
                              title="ডিলিট করুন"
                            >
                              <Trash2 className="h-4 w-4 text-red-600" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>

        <TabsContent value="verified" className="mt-0">
          <Card className="p-0">
            <Table>
              <TableCaption>
                অনুমোদিত খরচ -{" "}
                {filteredExpenses.filter((exp) => exp.status === "verified").length} টি
              </TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>শিরোনাম</TableHead>
                  <TableHead>পরিমাণ</TableHead>
                  <TableHead>তারিখ</TableHead>
                  <TableHead>ক্যাটেগরি</TableHead>
                  <TableHead>অনুমোদনকারী</TableHead>
                  <TableHead>কর্ম</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredExpenses.filter((exp) => exp.status === "verified").length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      কোন অনুমোদিত খরচ পাওয়া যায়নি
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredExpenses.map(
                    (expense) =>
                      expense.status === "verified" && (
                        <TableRow key={expense.id}>
                          <TableCell className="font-medium">{expense.title}</TableCell>
                          <TableCell>{formatCurrency(expense.amount)}</TableCell>
                          <TableCell>{formatDateBengali(expense.date)}</TableCell>
                          <TableCell>
                            {expense.category === "fixed"
                              ? "স্থায়ী"
                              : expense.category === "dynamic"
                              ? "অস্থায়ী"
                              : "অন্যান্য"}{" "}
                            ({expense.subcategory})
                          </TableCell>
                          <TableCell>{expense.verifiedByName}</TableCell>
                          <TableCell>
                            {user?.role === "admin" && (
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleDelete(expense.id)}
                                title="ডিলিট করুন"
                              >
                                <Trash2 className="h-4 w-4 text-red-600" />
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      )
                  )
                )}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>

        <TabsContent value="rejected" className="mt-0">
          <Card className="p-0">
            <Table>
              <TableCaption>
                বাতিল খরচ - {filteredExpenses.filter((exp) => exp.status === "rejected").length}{" "}
                টি
              </TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>শিরোনাম</TableHead>
                  <TableHead>পরিমাণ</TableHead>
                  <TableHead>তারিখ</TableHead>
                  <TableHead>ক্যাটেগরি</TableHead>
                  <TableHead>বাতিলকারী</TableHead>
                  <TableHead>কর্ম</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredExpenses.filter((exp) => exp.status === "rejected").length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      কোন বাতিল খরচ পাওয়া যায়নি
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredExpenses.map(
                    (expense) =>
                      expense.status === "rejected" && (
                        <TableRow key={expense.id}>
                          <TableCell className="font-medium">{expense.title}</TableCell>
                          <TableCell>{formatCurrency(expense.amount)}</TableCell>
                          <TableCell>{formatDateBengali(expense.date)}</TableCell>
                          <TableCell>
                            {expense.category === "fixed"
                              ? "স্থায়ী"
                              : expense.category === "dynamic"
                              ? "অস্থায়ী"
                              : "অন্যান্য"}{" "}
                            ({expense.subcategory})
                          </TableCell>
                          <TableCell>{expense.verifiedByName}</TableCell>
                          <TableCell>
                            {user?.role === "admin" && (
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleDelete(expense.id)}
                                title="ডিলিট করুন"
                              >
                                <Trash2 className="h-4 w-4 text-red-600" />
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      )
                  )
                )}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Expenses;
