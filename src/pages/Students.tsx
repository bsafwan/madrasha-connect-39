
import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase, formatCurrency, toBengaliNumber } from "@/integrations/supabase/client";
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
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Search, Plus, MoreVertical, PenLine, Phone, Trash } from "lucide-react";
import { Student, StudentGroup } from "@/types";

const Students = () => {
  const { user } = useAuth();
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  
  // Form states
  const [newStudent, setNewStudent] = useState({
    name: "",
    fatherName: "",
    motherName: "",
    whatsappNumber: "",
    address: "",
    group: "qaida" as StudentGroup,
    monthlyFee: 500,
    active: true
  });

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('students')
        .select('*')
        .order('name', { ascending: true });
      
      if (error) throw error;
      
      const formattedStudents = data.map(student => ({
        id: student.id,
        name: student.name,
        fatherName: student.father_name,
        motherName: student.mother_name,
        whatsappNumber: student.whatsapp_number,
        address: student.address,
        group: student.group_name as StudentGroup,
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
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const filteredStudents = students.filter(student => 
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.fatherName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.whatsappNumber.includes(searchTerm)
  );

  const resetForm = () => {
    setNewStudent({
      name: "",
      fatherName: "",
      motherName: "",
      whatsappNumber: "",
      address: "",
      group: "qaida" as StudentGroup,
      monthlyFee: 500,
      active: true
    });
    setEditingStudent(null);
  };

  const handleCloseDialog = () => {
    setShowAddDialog(false);
    resetForm();
  };

  const handleEdit = (student: Student) => {
    setEditingStudent(student);
    setNewStudent({
      name: student.name,
      fatherName: student.fatherName,
      motherName: student.motherName,
      whatsappNumber: student.whatsappNumber,
      address: student.address,
      group: student.group,
      monthlyFee: student.monthlyFee,
      active: student.active
    });
    setShowAddDialog(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewStudent(prev => ({ ...prev, [name]: value }));
  };

  const handleSwitchChange = (checked: boolean) => {
    setNewStudent(prev => ({ ...prev, active: checked }));
  };

  const handleSelectChange = (value: string, field: string) => {
    setNewStudent(prev => ({ ...prev, [field]: value }));
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const numericValue = parseFloat(value);
    if (!isNaN(numericValue)) {
      setNewStudent(prev => ({ ...prev, [name]: numericValue }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingStudent) {
        // Update existing student
        const { error } = await supabase
          .from('students')
          .update({
            name: newStudent.name,
            father_name: newStudent.fatherName,
            mother_name: newStudent.motherName,
            whatsapp_number: newStudent.whatsappNumber,
            address: newStudent.address,
            group_name: newStudent.group,
            monthly_fee: newStudent.monthlyFee,
            active: newStudent.active
          })
          .eq('id', editingStudent.id);
        
        if (error) throw error;
        
        toast({
          title: "ছাত্র আপডেট সফল",
          description: `${newStudent.name} এর তথ্য সফলভাবে আপডেট করা হয়েছে।`,
        });
      } else {
        // Add new student
        const { error } = await supabase
          .from('students')
          .insert({
            name: newStudent.name,
            father_name: newStudent.fatherName,
            mother_name: newStudent.motherName,
            whatsapp_number: newStudent.whatsappNumber,
            address: newStudent.address,
            group_name: newStudent.group,
            monthly_fee: newStudent.monthlyFee,
            active: newStudent.active
          });
        
        if (error) throw error;
        
        toast({
          title: "ছাত্র যোগ সফল",
          description: `${newStudent.name} সফলভাবে যোগ করা হয়েছে।`,
        });
      }
      
      // Refresh the student list
      await fetchStudents();
      handleCloseDialog();
    } catch (error: any) {
      console.error("Error saving student:", error);
      toast({
        variant: "destructive",
        title: "ত্রুটি ঘটেছে",
        description: error.message,
      });
    }
  };

  const handleDelete = async (student: Student) => {
    if (!confirm(`আপনি কি নিশ্চিত যে আপনি ${student.name} কে মুছতে চান?`)) {
      return;
    }
    
    try {
      const { error } = await supabase
        .from('students')
        .delete()
        .eq('id', student.id);
      
      if (error) throw error;
      
      toast({
        title: "ছাত্র মুছে ফেলা সফল",
        description: `${student.name} সফলভাবে মুছে ফেলা হয়েছে।`,
      });
      
      await fetchStudents();
    } catch (error: any) {
      console.error("Error deleting student:", error);
      toast({
        variant: "destructive",
        title: "ত্রুটি ঘটেছে",
        description: error.message,
      });
    }
  };

  const getGroupNameBangla = (group: StudentGroup) => {
    switch (group) {
      case 'hifz': return 'হিফজ';
      case 'qaida': return 'কায়দা';
      case 'sifara': return 'সিফারা';
      case 'najera': return 'নাযেরা';
      default: return group;
    }
  };

  return (
    <div className="space-y-6 page-transition">
      {/* Page header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-2xl font-semibold tracking-tight">ছাত্র ব্যবস্থাপনা</h2>
        <div className="flex items-center space-x-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="নাম বা নম্বর দিয়ে খুঁজুন"
              className="w-full pl-8 md:w-[250px] lg:w-[300px]"
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>
          <Button onClick={() => {
            resetForm();
            setShowAddDialog(true);
          }}>
            <Plus className="mr-2 h-4 w-4" /> নতুন ছাত্র
          </Button>
        </div>
      </div>

      {/* Students list */}
      <Card>
        <div className="relative w-full overflow-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>নাম</TableHead>
                <TableHead className="hidden md:table-cell">পিতার নাম</TableHead>
                <TableHead className="hidden md:table-cell">গ্রুপ</TableHead>
                <TableHead>হোয়াটসঅ্যাপ</TableHead>
                <TableHead className="hidden lg:table-cell">মাসিক ফি</TableHead>
                <TableHead className="hidden lg:table-cell">স্ট্যাটাস</TableHead>
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
              ) : filteredStudents.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-10">
                    কোন ছাত্র পাওয়া যায়নি
                  </TableCell>
                </TableRow>
              ) : (
                filteredStudents.map((student) => (
                  <TableRow key={student.id}>
                    <TableCell>{student.name}</TableCell>
                    <TableCell className="hidden md:table-cell">{student.fatherName}</TableCell>
                    <TableCell className="hidden md:table-cell">{getGroupNameBangla(student.group)}</TableCell>
                    <TableCell>{student.whatsappNumber}</TableCell>
                    <TableCell className="hidden lg:table-cell">{formatCurrency(student.monthlyFee)}</TableCell>
                    <TableCell className="hidden lg:table-cell">
                      <span className={`px-2 py-1 rounded-full text-xs ${student.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {student.active ? 'সক্রিয়' : 'নিষ্ক্রিয়'}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>অ্যাকশন</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => handleEdit(student)}>
                            <PenLine className="mr-2 h-4 w-4" />
                            এডিট করুন
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Phone className="mr-2 h-4 w-4" />
                            হোয়াটসঅ্যাপ মেসেজ
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-red-600" onClick={() => handleDelete(student)}>
                            <Trash className="mr-2 h-4 w-4" />
                            মুছে ফেলুন
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </Card>

      {/* Add/Edit Student Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{editingStudent ? 'ছাত্র তথ্য আপডেট করুন' : 'নতুন ছাত্র যোগ করুন'}</DialogTitle>
            <DialogDescription>
              নিচের ফর্মটি পূরণ করুন। সব তথ্য সঠিকভাবে লিখুন।
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">ছাত্রের নাম</Label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="পূর্ণ নাম লিখুন"
                    value={newStudent.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fatherName">পিতার নাম</Label>
                  <Input
                    id="fatherName"
                    name="fatherName"
                    placeholder="পিতার নাম লিখুন"
                    value={newStudent.fatherName}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="motherName">মাতার নাম</Label>
                  <Input
                    id="motherName"
                    name="motherName"
                    placeholder="মাতার নাম লিখুন"
                    value={newStudent.motherName}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="whatsappNumber">হোয়াটসঅ্যাপ নম্বর</Label>
                  <Input
                    id="whatsappNumber"
                    name="whatsappNumber"
                    placeholder="01XXXXXXXXX"
                    value={newStudent.whatsappNumber}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="group">গ্রুপ</Label>
                  <Select
                    value={newStudent.group}
                    onValueChange={(value) => handleSelectChange(value, 'group')}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="গ্রুপ নির্বাচন করুন" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hifz">হিফজ</SelectItem>
                      <SelectItem value="qaida">কায়দা</SelectItem>
                      <SelectItem value="sifara">সিফারা</SelectItem>
                      <SelectItem value="najera">নাযেরা</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="monthlyFee">মাসিক ফি (৳)</Label>
                  <Input
                    id="monthlyFee"
                    name="monthlyFee"
                    type="number"
                    placeholder="500"
                    value={newStudent.monthlyFee}
                    onChange={handleNumberChange}
                    required
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="address">ঠিকানা</Label>
                  <Textarea
                    id="address"
                    name="address"
                    placeholder="বিস্তারিত ঠিকানা লিখুন"
                    value={newStudent.address}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="active"
                    checked={newStudent.active}
                    onCheckedChange={handleSwitchChange}
                  />
                  <Label htmlFor="active">সক্রিয় ছাত্র</Label>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleCloseDialog}>
                বাতিল করুন
              </Button>
              <Button type="submit">
                {editingStudent ? 'আপডেট করুন' : 'যোগ করুন'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Students;
