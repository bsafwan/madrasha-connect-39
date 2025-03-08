
import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase, formatCurrency, toBengaliNumber, formatDateBengali } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
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
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Textarea } from "@/components/ui/textarea";
import { Search, Plus, MoreVertical, CheckCircle, XCircle, Calendar } from "lucide-react";
import type { Expense, ExpenseCategory } from "@/types";

const Expenses = () => {
  const { user } = useAuth();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  
  // Dynamic subcategory options
  const subcategoryOptions = {
    fixed: [
      { value: "rent", label: "হল ভাড়া" },
      { value: "electricity", label: "বিদ্যুৎ বিল" },
      { value: "water", label: "পানি বিল" },
      { value: "internet", label: "ইন্টারনেট বিল" },
      { value: "salary", label: "বেতন" },
    ],
    dynamic: [
      { value: "books", label: "বই-পুস্তক" },
      { value: "stationary", label: "স্টেশনারি" },
      { value: "repairs", label: "মেরামত" },
      { value: "furniture", label: "আসবাবপত্র" },
      { value: "cleaning", label: "পরিষ্কার পরিচ্ছন্নতা" },
    ],
    other: [
      { value: "event", label: "অনুষ্ঠান" },
      { value: "emergency", label: "জরুরি" },
      { value: "miscellaneous", label: "বিবিধ" },
    ]
  };
  
  // Form states
  const [newExpense, setNewExpense] = useState({
    title: "",
    amount: 0,
    category: "fixed" as ExpenseCategory,
    subcategory: "rent",
    description: "",
  });

  const fetchExpenses = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('expenses')
        .select(`
          *,
          created_by_user:users!expenses_created_by_fkey(name),
          verified_by_user:users!expenses_verified_by_fkey(name)
        `)
        .order('date', { ascending: false });
      
      if (activeTab !== "all") {
        query = query.eq('status', activeTab);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      
      const formattedExpenses = data.map(expense => ({
        id: expense.id,
        title: expense.title,
        amount: expense.amount,
        date: expense.date,
        category: expense.category as ExpenseCategory,
        subcategory: expense.subcategory,
        description: expense.description || '',
        status: expense.status as "pending" | "verified" | "rejected",
        createdBy: expense.created_by,
        createdByName: expense.created_by_user?.name || 'অজানা',
        verifiedBy: expense.verified_by,
        verifiedByName: expense.verified_by_user?.name,
      }));
      
      setExpenses(formattedExpenses);
    } catch (error: any) {
      console.error("Error fetching expenses:", error);
      toast({
        variant: "destructive",
        title: "ত্রুটি ঘটেছে",
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, [activeTab]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const filteredExpenses = expenses.filter(expense => 
    expense.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    expense.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    getSubcategoryLabel(expense.subcategory, expense.category).toLowerCase().includes(searchTerm.toLowerCase())
  );

  const resetForm = () => {
    setNewExpense({
      title: "",
      amount: 0,
      category: "fixed",
      subcategory: "rent",
      description: "",
    });
  };

  const handleCloseDialog = () => {
    setShowAddDialog(false);
    resetForm();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewExpense(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (value: string, field: string) => {
    if (field === 'category') {
      // When category changes, set the first subcategory of that category
      const firstSubcategory = subcategoryOptions[value as ExpenseCategory][0].value;
      setNewExpense(prev => ({ 
        ...prev, 
        [field]: value,
        subcategory: firstSubcategory
      }));
    } else {
      setNewExpense(prev => ({ ...prev, [field]: value }));
    }
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const numericValue = parseFloat(value);
    if (!isNaN(numericValue)) {
      setNewExpense(prev => ({ ...prev, [name]: numericValue }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newExpense.amount <= 0) {
      toast({
        variant: "destructive",
        title: "অবৈধ পরিমাণ",
        description: "অবশ্যই ০ টাকার বেশি পরিমাণ দিতে হবে।",
      });
      return;
    }
    
    try {
      // Add new expense
      const { error } = await supabase
        .from('expenses')
        .insert({
          title: newExpense.title,
          amount: newExpense.amount,
          category: newExpense.category,
          subcategory: newExpense.subcategory,
          description: newExpense.description,
          status: 'pending',
          created_by: user?.id,
        });
      
      if (error) throw error;
      
      toast({
        title: "খরচ যোগ সফল",
        description: `খরচ সফলভাবে রেকর্ড করা হয়েছে।`,
      });
      
      // Refresh the expense list
      await fetchExpenses();
      handleCloseDialog();
    } catch (error: any) {
      console.error("Error saving expense:", error);
      toast({
        variant: "destructive",
        title: "ত্রুটি ঘটেছে",
        description: error.message,
      });
    }
  };

  const handleVerify = async (expense: Expense) => {
    try {
      const { error } = await supabase
        .from('expenses')
        .update({
          status: 'verified',
          verified_by: user?.id,
        })
        .eq('id', expense.id);
      
      if (error) throw error;
      
      toast({
        title: "খরচ অনুমোদিত হয়েছে",
        description: `"${expense.title}" খরচটি অনুমোদিত হয়েছে।`,
      });
      
      await fetchExpenses();
    } catch (error: any) {
      console.error("Error verifying expense:", error);
      toast({
        variant: "destructive",
        title: "ত্রুটি ঘটেছে",
        description: error.message,
      });
    }
  };

  const handleReject = async (expense: Expense) => {
    if (!confirm(`আপনি কি নিশ্চিত যে আপনি "${expense.title}" খরচটি বাতিল করতে চান?`)) {
      return;
    }
    
    try {
      const { error } = await supabase
        .from('expenses')
        .update({
          status: 'rejected',
          verified_by: user?.id,
        })
        .eq('id', expense.id);
      
      if (error) throw error;
      
      toast({
        title: "খরচ বাতিল করা হয়েছে",
        description: `"${expense.title}" খরচটি বাতিল করা হয়েছে।`,
      });
      
      await fetchExpenses();
    } catch (error: any) {
      console.error("Error rejecting expense:", error);
      toast({
        variant: "destructive",
        title: "ত্রুটি ঘটেছে",
        description: error.message,
      });
    }
  };

  const getCategoryLabel = (category: ExpenseCategory) => {
    switch (category) {
      case 'fixed': return 'নিয়মিত খরচ';
      case 'dynamic': return 'অনিয়মিত খরচ';
      case 'other': return 'অন্যান্য';
      default: return category;
    }
  };

  const getSubcategoryLabel = (subcategory: string, category: ExpenseCategory) => {
    const option = subcategoryOptions[category].find(opt => opt.value === subcategory);
    return option ? option.label : subcategory;
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'verified':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusName = (status: string) => {
    switch (status) {
      case 'pending':
        return 'অপেক্ষমান';
      case 'verified':
        return 'অনুমোদিত';
      case 'rejected':
        return 'বাতিল';
      default:
        return status;
    }
  };

  return (
    <div className="space-y-6 page-transition">
      {/* Page header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-2xl font-semibold tracking-tight">খরচ ব্যবস্থাপনা</h2>
        <div className="flex items-center space-x-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="খরচের নাম খুঁজুন"
              className="w-full pl-8 md:w-[250px] lg:w-[300px]"
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>
          <Button onClick={() => {
            resetForm();
            setShowAddDialog(true);
          }}>
            <Plus className="mr-2 h-4 w-4" /> নতুন খরচ
          </Button>
        </div>
      </div>

      {/* Tabs for filtering */}
      <Tabs
        defaultValue="all"
        value={activeTab}
        onValueChange={(value) => setActiveTab(value)}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-3 md:w-auto md:inline-flex">
          <TabsTrigger value="all">সকল খরচ</TabsTrigger>
          <TabsTrigger value="pending">অপেক্ষমান</TabsTrigger>
          <TabsTrigger value="verified">অনুমোদিত</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Expenses list */}
      <Card>
        <div className="relative w-full overflow-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>খরচের নাম</TableHead>
                <TableHead>পরিমাণ</TableHead>
                <TableHead className="hidden md:table-cell">তারিখ</TableHead>
                <TableHead className="hidden md:table-cell">ক্যাটাগরি</TableHead>
                <TableHead className="hidden lg:table-cell">স্ট্যাটাস</TableHead>
                <TableHead className="hidden lg:table-cell">তৈরি করেছেন</TableHead>
                <TableHead className="text-right">অ্যাকশন</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-10">
                    লোড হচ্ছে...
                  </TableCell>
                </TableRow>
              ) : filteredExpenses.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-10">
                    কোন খরচ পাওয়া যায়নি
                  </TableCell>
                </TableRow>
              ) : (
                filteredExpenses.map((expense) => (
                  <TableRow key={expense.id}>
                    <TableCell>{expense.title}</TableCell>
                    <TableCell>{formatCurrency(expense.amount)}</TableCell>
                    <TableCell className="hidden md:table-cell">{formatDateBengali(expense.date)}</TableCell>
                    <TableCell className="hidden md:table-cell">
                      {getSubcategoryLabel(expense.subcategory, expense.category)}
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      <span className={`px-2 py-1 rounded-full text-xs ${getStatusBadgeClass(expense.status)}`}>
                        {getStatusName(expense.status)}
                      </span>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">{expense.createdByName}</TableCell>
                    <TableCell className="text-right">
                      {expense.status === 'pending' && user?.role === 'admin' && (
                        <div className="flex justify-end space-x-1">
                          <Button variant="ghost" size="icon" onClick={() => handleVerify(expense)} title="অনুমোদন করুন">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleReject(expense)} title="বাতিল করুন">
                            <XCircle className="h-4 w-4 text-red-600" />
                          </Button>
                        </div>
                      )}
                      {(expense.status !== 'pending' || user?.role !== 'admin') && (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>বিস্তারিত তথ্য</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="flex flex-col items-start">
                              <span className="text-xs text-muted-foreground">ক্যাটাগরি:</span>
                              <span>{getCategoryLabel(expense.category)} / {getSubcategoryLabel(expense.subcategory, expense.category)}</span>
                            </DropdownMenuItem>
                            {expense.description && (
                              <DropdownMenuItem className="flex flex-col items-start">
                                <span className="text-xs text-muted-foreground">বিবরণ:</span>
                                <span>{expense.description}</span>
                              </DropdownMenuItem>
                            )}
                            {expense.verifiedByName && (
                              <DropdownMenuItem className="flex flex-col items-start">
                                <span className="text-xs text-muted-foreground">অনুমোদনকারী:</span>
                                <span>{expense.verifiedByName}</span>
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </Card>

      {/* Add Expense Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>নতুন খরচ যোগ করুন</DialogTitle>
            <DialogDescription>
              খরচ রেকর্ড করতে নিচের ফর্মটি পূরণ করুন।
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="title">খরচের নাম</Label>
                <Input
                  id="title"
                  name="title"
                  placeholder="খরচের নাম লিখুন"
                  value={newExpense.title}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="amount">পরিমাণ (৳)</Label>
                <Input
                  id="amount"
                  name="amount"
                  type="number"
                  value={newExpense.amount}
                  onChange={handleNumberChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">ক্যাটাগরি</Label>
                <Select
                  value={newExpense.category}
                  onValueChange={(value) => handleSelectChange(value, 'category')}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="ক্যাটাগরি নির্বাচন করুন" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fixed">নিয়মিত খরচ</SelectItem>
                    <SelectItem value="dynamic">অনিয়মিত খরচ</SelectItem>
                    <SelectItem value="other">অন্যান্য</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="subcategory">সাব-ক্যাটাগরি</Label>
                <Select
                  value={newExpense.subcategory}
                  onValueChange={(value) => handleSelectChange(value, 'subcategory')}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="সাব-ক্যাটাগরি নির্বাচন করুন" />
                  </SelectTrigger>
                  <SelectContent>
                    {subcategoryOptions[newExpense.category].map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">বিবরণ (ঐচ্ছিক)</Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="খরচের বিবরণ লিখুন"
                  value={newExpense.description}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleCloseDialog}>
                বাতিল করুন
              </Button>
              <Button type="submit">
                খরচ রেকর্ড করুন
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Expenses;
