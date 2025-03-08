
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
import { Search, Plus, MoreVertical, CheckCircle, XCircle, Filter } from "lucide-react";
import type { Payment, PaymentType, Student } from "@/types";

const Payments = () => {
  const { user } = useAuth();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  
  // Form states
  const [newPayment, setNewPayment] = useState({
    studentId: "",
    amount: 500,
    type: "monthly" as PaymentType,
    description: "",
  });

  const fetchStudents = async () => {
    try {
      const { data, error } = await supabase
        .from('students')
        .select('*')
        .eq('active', true)
        .order('name', { ascending: true });
      
      if (error) throw error;
      
      const formattedStudents = data.map(student => ({
        id: student.id,
        name: student.name,
        fatherName: student.father_name,
        motherName: student.mother_name,
        whatsappNumber: student.whatsapp_number,
        address: student.address,
        group: student.group_name,
        monthlyFee: student.monthly_fee,
        registrationDate: student.registration_date,
        active: student.active
      }));
      
      setStudents(formattedStudents);
    } catch (error: any) {
      console.error("Error fetching students:", error);
      toast({
        variant: "destructive",
        title: "ত্রুটি ঘটেছে",
        description: error.message,
      });
    }
  };

  const fetchPayments = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('payments')
        .select(`
          *,
          students(name),
          accepted_by:users!payments_accepted_by_fkey(name),
          verified_by:users!payments_verified_by_fkey(name)
        `)
        .order('date', { ascending: false });
      
      if (activeTab !== "all") {
        query = query.eq('status', activeTab);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      
      const formattedPayments = data.map(payment => ({
        id: payment.id,
        studentId: payment.student_id,
        studentName: payment.students?.name || 'অজানা ছাত্র',
        amount: payment.amount,
        date: payment.date,
        type: payment.type as PaymentType,
        description: payment.description || '',
        status: payment.status as "accepted" | "verified" | "rejected",
        verifiedBy: payment.verified_by?.name,
        acceptedBy: payment.accepted_by?.name || 'অজানা',
      }));
      
      setPayments(formattedPayments);
    } catch (error: any) {
      console.error("Error fetching payments:", error);
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
    fetchStudents();
    fetchPayments();
  }, []);

  useEffect(() => {
    fetchPayments();
  }, [activeTab]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const filteredPayments = payments.filter(payment => 
    payment.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    payment.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const resetForm = () => {
    setNewPayment({
      studentId: "",
      amount: 500,
      type: "monthly",
      description: "",
    });
  };

  const handleCloseDialog = () => {
    setShowAddDialog(false);
    resetForm();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewPayment(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (value: string, field: string) => {
    setNewPayment(prev => ({ ...prev, [field]: value }));
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const numericValue = parseFloat(value);
    if (!isNaN(numericValue)) {
      setNewPayment(prev => ({ ...prev, [name]: numericValue }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newPayment.studentId) {
      toast({
        variant: "destructive",
        title: "ছাত্র নির্বাচন করুন",
        description: "পেমেন্ট যোগ করার জন্য একজন ছাত্র নির্বাচন করুন।",
      });
      return;
    }
    
    try {
      // Add new payment
      const { error } = await supabase
        .from('payments')
        .insert({
          student_id: newPayment.studentId,
          amount: newPayment.amount,
          type: newPayment.type,
          description: newPayment.description,
          status: 'accepted',
          accepted_by: user?.id,
        });
      
      if (error) throw error;
      
      toast({
        title: "পেমেন্ট যোগ সফল",
        description: `পেমেন্ট সফলভাবে রেকর্ড করা হয়েছে।`,
      });
      
      // Refresh the payment list
      await fetchPayments();
      handleCloseDialog();
    } catch (error: any) {
      console.error("Error saving payment:", error);
      toast({
        variant: "destructive",
        title: "ত্রুটি ঘটেছে",
        description: error.message,
      });
    }
  };

  const handleVerify = async (payment: Payment) => {
    try {
      const { error } = await supabase
        .from('payments')
        .update({
          status: 'verified',
          verified_by: user?.id,
        })
        .eq('id', payment.id);
      
      if (error) throw error;
      
      toast({
        title: "পেমেন্ট ভেরিফাই করা হয়েছে",
        description: `${payment.studentName} এর ${formatCurrency(payment.amount)} টাকার পেমেন্ট ভেরিফাই করা হয়েছে।`,
      });
      
      await fetchPayments();
    } catch (error: any) {
      console.error("Error verifying payment:", error);
      toast({
        variant: "destructive",
        title: "ত্রুটি ঘটেছে",
        description: error.message,
      });
    }
  };

  const handleReject = async (payment: Payment) => {
    if (!confirm(`আপনি কি নিশ্চিত যে আপনি ${payment.studentName} এর ${formatCurrency(payment.amount)} টাকার পেমেন্ট বাতিল করতে চান?`)) {
      return;
    }
    
    try {
      const { error } = await supabase
        .from('payments')
        .update({
          status: 'rejected',
          verified_by: user?.id,
        })
        .eq('id', payment.id);
      
      if (error) throw error;
      
      toast({
        title: "পেমেন্ট বাতিল করা হয়েছে",
        description: `${payment.studentName} এর ${formatCurrency(payment.amount)} টাকার পেমেন্ট বাতিল করা হয়েছে।`,
      });
      
      await fetchPayments();
    } catch (error: any) {
      console.error("Error rejecting payment:", error);
      toast({
        variant: "destructive",
        title: "ত্রুটি ঘটেছে",
        description: error.message,
      });
    }
  };

  const getPaymentTypeBangla = (type: PaymentType) => {
    switch (type) {
      case 'monthly': return 'মাসিক ফি';
      case 'event': return 'ইভেন্ট ফি';
      case 'other': return 'অন্যান্য';
      default: return type;
    }
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'accepted':
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
      case 'accepted':
        return 'গ্রহণ করা হয়েছে';
      case 'verified':
        return 'যাচাইকৃত';
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
        <h2 className="text-2xl font-semibold tracking-tight">পেমেন্ট ব্যবস্থাপনা</h2>
        <div className="flex items-center space-x-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="ছাত্রের নাম খুঁজুন"
              className="w-full pl-8 md:w-[250px] lg:w-[300px]"
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>
          <Button onClick={() => {
            resetForm();
            setShowAddDialog(true);
          }}>
            <Plus className="mr-2 h-4 w-4" /> নতুন পেমেন্ট
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
          <TabsTrigger value="all">সকল পেমেন্ট</TabsTrigger>
          <TabsTrigger value="accepted">অপেক্ষমান</TabsTrigger>
          <TabsTrigger value="verified">যাচাইকৃত</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Payments list */}
      <Card>
        <div className="relative w-full overflow-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ছাত্রের নাম</TableHead>
                <TableHead>পরিমাণ</TableHead>
                <TableHead className="hidden md:table-cell">তারিখ</TableHead>
                <TableHead className="hidden md:table-cell">ধরন</TableHead>
                <TableHead className="hidden lg:table-cell">স্ট্যাটাস</TableHead>
                <TableHead className="hidden lg:table-cell">গ্রহণকারী</TableHead>
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
              ) : filteredPayments.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-10">
                    কোন পেমেন্ট পাওয়া যায়নি
                  </TableCell>
                </TableRow>
              ) : (
                filteredPayments.map((payment) => (
                  <TableRow key={payment.id}>
                    <TableCell>{payment.studentName}</TableCell>
                    <TableCell>{formatCurrency(payment.amount)}</TableCell>
                    <TableCell className="hidden md:table-cell">{formatDateBengali(payment.date)}</TableCell>
                    <TableCell className="hidden md:table-cell">{getPaymentTypeBangla(payment.type)}</TableCell>
                    <TableCell className="hidden lg:table-cell">
                      <span className={`px-2 py-1 rounded-full text-xs ${getStatusBadgeClass(payment.status)}`}>
                        {getStatusName(payment.status)}
                      </span>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">{payment.acceptedBy}</TableCell>
                    <TableCell className="text-right">
                      {payment.status === 'accepted' && user?.role === 'admin' && (
                        <div className="flex justify-end space-x-1">
                          <Button variant="ghost" size="icon" onClick={() => handleVerify(payment)} title="ভেরিফাই করুন">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleReject(payment)} title="বাতিল করুন">
                            <XCircle className="h-4 w-4 text-red-600" />
                          </Button>
                        </div>
                      )}
                      {(payment.status === 'verified' || payment.status === 'rejected' || user?.role !== 'admin') && (
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
                              <span className="text-xs text-muted-foreground">ধরন:</span>
                              <span>{getPaymentTypeBangla(payment.type)}</span>
                            </DropdownMenuItem>
                            {payment.description && (
                              <DropdownMenuItem className="flex flex-col items-start">
                                <span className="text-xs text-muted-foreground">বিবরণ:</span>
                                <span>{payment.description}</span>
                              </DropdownMenuItem>
                            )}
                            {payment.verifiedBy && (
                              <DropdownMenuItem className="flex flex-col items-start">
                                <span className="text-xs text-muted-foreground">যাচাইকারী:</span>
                                <span>{payment.verifiedBy}</span>
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

      {/* Add Payment Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>নতুন পেমেন্ট যোগ করুন</DialogTitle>
            <DialogDescription>
              ছাত্রের পেমেন্ট রেকর্ড করতে নিচের ফর্মটি পূরণ করুন।
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="studentId">ছাত্র নির্বাচন করুন</Label>
                <Select
                  value={newPayment.studentId}
                  onValueChange={(value) => handleSelectChange(value, 'studentId')}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="ছাত্র নির্বাচন করুন" />
                  </SelectTrigger>
                  <SelectContent>
                    {students.map((student) => (
                      <SelectItem key={student.id} value={student.id}>
                        {student.name} ({formatCurrency(student.monthlyFee)})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="amount">পরিমাণ (৳)</Label>
                <Input
                  id="amount"
                  name="amount"
                  type="number"
                  value={newPayment.amount}
                  onChange={handleNumberChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="type">পেমেন্টের ধরন</Label>
                <Select
                  value={newPayment.type}
                  onValueChange={(value) => handleSelectChange(value, 'type')}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="পেমেন্টের ধরন নির্বাচন করুন" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="monthly">মাসিক ফি</SelectItem>
                    <SelectItem value="event">ইভেন্ট ফি</SelectItem>
                    <SelectItem value="other">অন্যান্য</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">বিবরণ (ঐচ্ছিক)</Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="পেমেন্টের বিবরণ লিখুন"
                  value={newPayment.description}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleCloseDialog}>
                বাতিল করুন
              </Button>
              <Button type="submit">
                পেমেন্ট রেকর্ড করুন
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Payments;
