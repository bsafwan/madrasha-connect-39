import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
} from "@/components/ui/dialog";
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
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  fetchPayments, 
  createPayment, 
  updatePayment, 
  deletePayment,
  fetchStudents 
} from "@/services/dataService";
import { formatDateBengali, toBengaliNumber, formatCurrency } from "@/integrations/supabase/client";
import { Payment, PaymentStatus, PaymentType, Student } from "@/types";
import { 
  Plus, 
  Edit, 
  Trash2, 
  Search, 
  Filter, 
  CreditCard, 
  Calendar, 
  UserCheck,
  AlertCircle,
  CheckCircle,
  XCircle
} from "lucide-react";

const Payments = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<PaymentStatus | "">("");
  const [typeFilter, setTypeFilter] = useState<PaymentType | "">("");
  const [currentPayment, setCurrentPayment] = useState<Payment | null>(null);
  const [formData, setFormData] = useState<Partial<Payment>>({
    studentId: "",
    amount: 0,
    date: new Date().toISOString().split("T")[0],
    type: "monthly",
    description: "",
    status: "accepted",
    acceptedBy: user?.id || "",
  });

  // Fetch all payments
  const { data: payments = [], isLoading: isLoadingPayments } = useQuery({
    queryKey: ["payments"],
    queryFn: fetchPayments,
  });

  // Fetch all students
  const { data: students = [], isLoading: isLoadingStudents } = useQuery({
    queryKey: ["students"],
    queryFn: fetchStudents,
  });

  // Add payment mutation
  const addPaymentMutation = useMutation({
    mutationFn: (paymentData: Omit<Payment, "id" | "updatedAt" | "createdAt" | "studentName">) => createPayment(paymentData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payments"] });
      setIsAddDialogOpen(false);
      resetForm();
    },
  });

  // Update payment mutation
  const updatePaymentMutation = useMutation({
    mutationFn: (payment: { id: string, data: Partial<Payment> }) => updatePayment(payment.id, payment.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payments"] });
      setIsEditDialogOpen(false);
      resetForm();
    },
  });

  // Delete payment mutation
  const deletePaymentMutation = useMutation({
    mutationFn: (id: string) => deletePayment(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payments"] });
      setIsDeleteDialogOpen(false);
    },
  });

  // Reset form
  const resetForm = () => {
    setFormData({
      studentId: "",
      amount: 0,
      date: new Date().toISOString().split("T")[0],
      type: "monthly",
      description: "",
      status: "accepted",
      acceptedBy: user?.id || "",
    });
    setCurrentPayment(null);
  };

  // Handle edit button click
  const handleEdit = (payment: Payment) => {
    setCurrentPayment(payment);
    setFormData({
      id: payment.id,
      studentId: payment.studentId,
      amount: payment.amount,
      date: payment.date.split("T")[0],
      type: payment.type,
      description: payment.description || "",
      status: payment.status,
      acceptedBy: payment.acceptedBy,
      verifiedBy: payment.verifiedBy,
    });
    setIsEditDialogOpen(true);
  };

  // Handle delete button click
  const handleDelete = (payment: Payment) => {
    setCurrentPayment(payment);
    setIsDeleteDialogOpen(true);
  };

  // Handle form input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    if (type === "number") {
      setFormData({ ...formData, [name]: parseFloat(value) });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // Handle select change
  const handleSelectChange = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value });
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Find the selected student to add studentName
    const selectedStudent = students.find(student => student.id === formData.studentId);
    
    if (currentPayment) {
      updatePaymentMutation.mutate({ 
        id: currentPayment.id,
        data: {
          ...formData,
          // Ensure required fields are present for update
          type: formData.type || currentPayment.type,
          status: formData.status || currentPayment.status,
        }
      });
    } else {
      // Ensure required fields are present for create
      const newPayment: Omit<Payment, "id" | "updatedAt" | "createdAt" | "studentName"> = {
        studentId: formData.studentId || "",
        amount: formData.amount || 0,
        date: formData.date || new Date().toISOString(),
        type: formData.type || "monthly",
        description: formData.description || "",
        status: formData.status || "accepted",
        acceptedBy: formData.acceptedBy || user?.id || "",
        verifiedBy: formData.verifiedBy
      };
      
      addPaymentMutation.mutate(newPayment);
    }
  };

  // Filter payments based on search term and filters
  const filteredPayments = payments.filter((payment) => {
    const studentName = students.find(s => s.id === payment.studentId)?.name || "";
    
    const matchesSearchTerm =
      studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.id.includes(searchTerm);
    
    const matchesStatus = statusFilter ? payment.status === statusFilter : true;
    const matchesType = typeFilter ? payment.type === typeFilter : true;
    
    return matchesSearchTerm && matchesStatus && matchesType;
  });

  // Find student name by id
  const getStudentName = (studentId: string) => {
    return students.find(student => student.id === studentId)?.name || "Unknown";
  };

  // Get payment status display
  const getStatusDisplay = (status: PaymentStatus) => {
    switch (status) {
      case "accepted":
        return (
          <div className="flex items-center text-amber-600">
            <AlertCircle className="h-4 w-4 mr-1" />
            <span>গৃহীত</span>
          </div>
        );
      case "verified":
        return (
          <div className="flex items-center text-green-600">
            <CheckCircle className="h-4 w-4 mr-1" />
            <span>যাচাইকৃত</span>
          </div>
        );
      case "rejected":
        return (
          <div className="flex items-center text-red-600">
            <XCircle className="h-4 w-4 mr-1" />
            <span>বাতিল</span>
          </div>
        );
      default:
        return status;
    }
  };

  // Get payment type display
  const getTypeDisplay = (type: PaymentType) => {
    switch (type) {
      case "monthly":
        return "মাসিক ফি";
      case "event":
        return "ইভেন্ট ফি";
      case "other":
        return "অন্যান্য";
      default:
        return type;
    }
  };

  return (
    <div className="space-y-6 page-transition">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-2xl font-semibold tracking-tight">পেমেন্ট ব্যবস্থাপনা</h2>
        <Button onClick={() => setIsAddDialogOpen(true)} className="btn-primary">
          <Plus className="mr-2 h-4 w-4" /> নতুন পেমেন্ট রেকর্ড করুন
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>সকল পেমেন্ট</CardTitle>
          <CardDescription>মোট {toBengaliNumber(filteredPayments.length)} টি পেমেন্ট</CardDescription>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mt-4">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="ছাত্রের নাম দিয়ে খুঁজুন"
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as PaymentStatus | "")}>
                <SelectTrigger className="w-[130px]">
                  <SelectValue placeholder="স্ট্যাটাস" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">সকল স্ট্যাটাস</SelectItem>
                  <SelectItem value="accepted">গৃহীত</SelectItem>
                  <SelectItem value="verified">যাচাইকৃত</SelectItem>
                  <SelectItem value="rejected">বাতিল</SelectItem>
                </SelectContent>
              </Select>

              <Select value={typeFilter} onValueChange={(value) => setTypeFilter(value as PaymentType | "")}>
                <SelectTrigger className="w-[130px]">
                  <SelectValue placeholder="পেমেন্ট টাইপ" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">সকল টাইপ</SelectItem>
                  <SelectItem value="monthly">মাসিক ফি</SelectItem>
                  <SelectItem value="event">ইভেন্ট ফি</SelectItem>
                  <SelectItem value="other">অন্যান্য</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoadingPayments ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : filteredPayments.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              কোন পেমেন্ট পাওয়া যায়নি
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ছাত্রের নাম</TableHead>
                    <TableHead>টাইপ</TableHead>
                    <TableHead>তারিখ</TableHead>
                    <TableHead>পরিমাণ</TableHead>
                    <TableHead>বিবরণ</TableHead>
                    <TableHead>স্ট্যাটাস</TableHead>
                    <TableHead className="text-right">অ্যাকশন</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPayments.map((payment) => (
                    <TableRow key={payment.id}>
                      <TableCell className="font-medium">
                        {getStudentName(payment.studentId)}
                      </TableCell>
                      <TableCell>{getTypeDisplay(payment.type)}</TableCell>
                      <TableCell>{formatDateBengali(payment.date)}</TableCell>
                      <TableCell>{formatCurrency(payment.amount)}</TableCell>
                      <TableCell className="max-w-[200px] truncate">{payment.description}</TableCell>
                      <TableCell>{getStatusDisplay(payment.status)}</TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(payment)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(payment)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add Payment Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>নতুন পেমেন্ট রেকর্ড করুন</DialogTitle>
            <DialogDescription>
              নতুন পেমেন্টের বিবরণ ফর্মে পূরণ করুন।
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="studentId">ছাত্র</Label>
                <Select 
                  value={formData.studentId} 
                  onValueChange={(value) => handleSelectChange("studentId", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="ছাত্র নির্বাচন করুন" />
                  </SelectTrigger>
                  <SelectContent>
                    {students
                      .filter(student => student.active)
                      .map((student) => (
                        <SelectItem key={student.id} value={student.id}>
                          {student.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="amount">পরিমাণ (৳)</Label>
                  <Input
                    id="amount"
                    name="amount"
                    type="number"
                    value={formData.amount}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="date">তারিখ</Label>
                  <Input
                    id="date"
                    name="date"
                    type="date"
                    value={formData.date}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="type">পেমেন্টের ধরণ</Label>
                <Select 
                  value={formData.type as string} 
                  onValueChange={(value) => handleSelectChange("type", value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="monthly">মাসিক ফি</SelectItem>
                    <SelectItem value="event">ইভেন্ট ফি</SelectItem>
                    <SelectItem value="other">অন্যান্য</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">বিবরণ</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="পেমেন্টের বিস্তারিত বিবরণ দিন"
                  className="min-h-[100px]"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">স্ট্যাটাস</Label>
                <Select 
                  value={formData.status as string} 
                  onValueChange={(value) => handleSelectChange("status", value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="accepted">গৃহীত</SelectItem>
                    <SelectItem value="verified">যাচাইকৃত</SelectItem>
                    <SelectItem value="rejected">বাতিল</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsAddDialogOpen(false);
                  resetForm();
                }}
              >
                বাতিল
              </Button>
              <Button type="submit" disabled={addPaymentMutation.isPending}>
                {addPaymentMutation.isPending ? "সংরক্ষণ হচ্ছে..." : "সংরক্ষণ করুন"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Payment Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>পেমেন্ট সম্পাদনা করুন</DialogTitle>
            <DialogDescription>
              পেমেন্টের তথ্য পরিবর্তন করুন।
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="studentId">ছাত্র</Label>
                <Select 
                  value={formData.studentId} 
                  onValueChange={(value) => handleSelectChange("studentId", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="ছাত্র নির্বাচন করুন" />
                  </SelectTrigger>
                  <SelectContent>
                    {students.map((student) => (
                      <SelectItem key={student.id} value={student.id}>
                        {student.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="amount">পরিমাণ (৳)</Label>
                  <Input
                    id="amount"
                    name="amount"
                    type="number"
                    value={formData.amount}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="date">তারিখ</Label>
                  <Input
                    id="date"
                    name="date"
                    type="date"
                    value={formData.date}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="type">পেমেন্টের ধরণ</Label>
                <Select 
                  value={formData.type as string} 
                  onValueChange={(value) => handleSelectChange("type", value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="monthly">মাসিক ফি</SelectItem>
                    <SelectItem value="event">ইভেন্ট ফি</SelectItem>
                    <SelectItem value="other">অন্যান্য</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">বিবরণ</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description || ""}
                  onChange={handleChange}
                  placeholder="পেমেন্টের বিস্তারিত বিবরণ দিন"
                  className="min-h-[100px]"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">স্ট্যাটাস</Label>
                <Select 
                  value={formData.status as string} 
                  onValueChange={(value) => handleSelectChange("status", value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="accepted">গৃহীত</SelectItem>
                    <SelectItem value="verified">যাচাইকৃত</SelectItem>
                    <SelectItem value="rejected">বাতিল</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsEditDialogOpen(false);
                  resetForm();
                }}
              >
                বাতিল
              </Button>
              <Button type="submit" disabled={updatePaymentMutation.isPending}>
                {updatePaymentMutation.isPending ? "হালনাগাদ হচ্ছে..." : "হালনাগাদ করুন"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>পেমেন্ট মুছে ফেলার নিশ্চিতকরণ</DialogTitle>
            <DialogDescription>
              আপনি কি নিশ্চিত যে আপনি এই পেমেন্ট রেকর্ডটি মুছে ফেলতে চান?
              এই ক্রিয়া অপরিবর্তনীয়।
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              বাতিল
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={() => currentPayment?.id && deletePaymentMutation.mutate(currentPayment.id)}
              disabled={deletePaymentMutation.isPending}
            >
              {deletePaymentMutation.isPending ? "মুছে ফেলা হচ্ছে..." : "মুছে ফেলুন"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Payments;
