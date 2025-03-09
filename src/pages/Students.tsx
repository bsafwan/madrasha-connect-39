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
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchStudents, createStudent, updateStudent, deleteStudent } from "@/services/dataService";
import { formatDateBengali, toBengaliNumber } from "@/integrations/supabase/client";
import { Student } from "@/types";
import { Plus, Edit, Trash2, Search, Filter, User, Phone, Home, Book, Coins } from "lucide-react";

const Students = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterGroup, setFilterGroup] = useState("");
  const [currentStudent, setCurrentStudent] = useState<Student | null>(null);
  const [formData, setFormData] = useState<Partial<Student>>({
    name: "",
    fatherName: "",
    motherName: "",
    whatsappNumber: "",
    address: "",
    group: "hifz",
    monthlyFee: 500,
    active: true,
  });

  // Fetch all students
  const { data: students = [], isLoading } = useQuery({
    queryKey: ["students"],
    queryFn: fetchStudents,
  });

  // Add student mutation
  const addStudentMutation = useMutation({
    mutationFn: (studentData: Omit<Student, "id" | "registrationDate" | "updatedAt">) => {
      const student: Omit<Student, "id" | "registrationDate" | "updatedAt"> = {
        name: studentData.name,
        fatherName: studentData.fatherName,
        motherName: studentData.motherName,
        whatsappNumber: studentData.whatsappNumber,
        address: studentData.address,
        group: studentData.group,
        monthlyFee: studentData.monthlyFee,
        active: studentData.active,
        guardianPhone: studentData.guardianPhone,
        emergencyContact: studentData.emergencyContact,
        birthDate: studentData.birthDate,
        enrollmentNumber: studentData.enrollmentNumber,
        previousEducation: studentData.previousEducation,
        medicalInfo: studentData.medicalInfo
      };
      return createStudent(student);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["students"] });
      setIsAddDialogOpen(false);
      resetForm();
    },
  });

  // Update student mutation
  const updateStudentMutation = useMutation({
    mutationFn: (student: { id: string, data: Partial<Student> }) => updateStudent(student.id, student.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["students"] });
      setIsEditDialogOpen(false);
      resetForm();
    },
  });

  // Delete student mutation
  const deleteStudentMutation = useMutation({
    mutationFn: (id: string) => deleteStudent(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["students"] });
      setIsDeleteDialogOpen(false);
    },
  });

  // Reset form
  const resetForm = () => {
    setFormData({
      name: "",
      fatherName: "",
      motherName: "",
      whatsappNumber: "",
      address: "",
      group: "hifz",
      monthlyFee: 500,
      active: true,
    });
    setCurrentStudent(null);
  };

  // Handle edit button click
  const handleEdit = (student: Student) => {
    setCurrentStudent(student);
    setFormData({
      id: student.id,
      name: student.name,
      fatherName: student.fatherName,
      motherName: student.motherName,
      whatsappNumber: student.whatsappNumber,
      address: student.address,
      group: student.group,
      monthlyFee: student.monthlyFee,
      active: student.active,
      guardianPhone: student.guardianPhone,
      emergencyContact: student.emergencyContact,
      birthDate: student.birthDate,
      enrollmentNumber: student.enrollmentNumber,
      previousEducation: student.previousEducation,
      medicalInfo: student.medicalInfo,
    });
    setIsEditDialogOpen(true);
  };

  // Handle delete button click
  const handleDelete = (student: Student) => {
    setCurrentStudent(student);
    setIsDeleteDialogOpen(true);
  };

  // Handle form input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    if (type === "number") {
      setFormData({ ...formData, [name]: parseFloat(value) });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // Handle checkbox change
  const handleCheckboxChange = (checked: boolean) => {
    setFormData({ ...formData, active: checked });
  };

  // Handle select change
  const handleSelectChange = (value: string) => {
    setFormData({ ...formData, group: value });
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentStudent) {
      updateStudentMutation.mutate({ 
        id: currentStudent.id,
        data: formData
      });
    } else {
      const newStudent: Omit<Student, "id" | "registrationDate" | "updatedAt"> = {
        name: formData.name || "",
        fatherName: formData.fatherName || "",
        motherName: formData.motherName || "",
        whatsappNumber: formData.whatsappNumber || "",
        address: formData.address || "",
        group: formData.group || "hifz",
        monthlyFee: formData.monthlyFee || 500,
        active: formData.active === undefined ? true : formData.active,
        guardianPhone: formData.guardianPhone,
        emergencyContact: formData.emergencyContact,
        birthDate: formData.birthDate,
        enrollmentNumber: formData.enrollmentNumber,
        previousEducation: formData.previousEducation,
        medicalInfo: formData.medicalInfo
      };
      addStudentMutation.mutate(newStudent);
    }
  };

  // Filter students based on search term and group
  const filteredStudents = students.filter((student) => {
    const matchesSearchTerm =
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.fatherName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.whatsappNumber.includes(searchTerm);
    
    const matchesGroup = filterGroup ? student.group === filterGroup : true;
    
    return matchesSearchTerm && matchesGroup;
  });

  // Get unique groups for filter dropdown
  const uniqueGroups = [...new Set(students.map(student => student.group))];

  return (
    <div className="space-y-6 page-transition">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-2xl font-semibold tracking-tight">ছাত্র ব্যবস্থাপনা</h2>
        <Button onClick={() => setIsAddDialogOpen(true)} className="btn-primary">
          <Plus className="mr-2 h-4 w-4" /> নতুন ছাত্র যোগ করুন
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>সকল ছাত্র</CardTitle>
          <CardDescription>মোট {toBengaliNumber(filteredStudents.length)} জন ছাত্র</CardDescription>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mt-4">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="নাম বা নম্বর দিয়ে খুঁজুন"
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="w-full sm:w-48">
              <Select value={filterGroup} onValueChange={setFilterGroup}>
                <SelectTrigger>
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="গ্রুপ বাছাই করুন" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">সকল গ্রুপ</SelectItem>
                  {uniqueGroups.map((group) => (
                    <SelectItem key={group} value={group}>
                      {group === "hifz" ? "হিফজ" : 
                       group === "qaida" ? "কায়দা" : 
                       group === "nazera" ? "নাযেরা" : 
                       group === "sifara" ? "সিফারা" : group}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : filteredStudents.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              কোন ছাত্র পাওয়া যায়নি
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>নাম</TableHead>
                    <TableHead>বাবার নাম</TableHead>
                    <TableHead>গ্রুপ</TableHead>
                    <TableHead>যোগাযোগ</TableHead>
                    <TableHead>মাসিক ফি</TableHead>
                    <TableHead>স্ট্যাটাস</TableHead>
                    <TableHead className="text-right">অ্যাকশন</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredStudents.map((student) => (
                    <TableRow key={student.id}>
                      <TableCell className="font-medium">{student.name}</TableCell>
                      <TableCell>{student.fatherName}</TableCell>
                      <TableCell>
                        {student.group === "hifz" ? "হিফজ" : 
                        student.group === "qaida" ? "কায়দা" : 
                        student.group === "nazera" ? "নাযেরা" : 
                        student.group === "sifara" ? "সিফারা" : student.group}
                      </TableCell>
                      <TableCell>{student.whatsappNumber}</TableCell>
                      <TableCell>৳{toBengaliNumber(student.monthlyFee)}</TableCell>
                      <TableCell>
                        <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          student.active
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}>
                          {student.active ? "সক্রিয়" : "নিষ্ক্রিয়"}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(student)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(student)}
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

      {/* Add Student Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>নতুন ছাত্র যোগ করুন</DialogTitle>
            <DialogDescription>
              নতুন ছাত্রের বিবরণ ফর্মে পূরণ করুন।
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">ছাত্রের নাম</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="enrollmentNumber">ভর্তি নম্বর</Label>
                  <Input
                    id="enrollmentNumber"
                    name="enrollmentNumber"
                    value={formData.enrollmentNumber || ""}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fatherName">বাবার নাম</Label>
                  <Input
                    id="fatherName"
                    name="fatherName"
                    value={formData.fatherName}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="motherName">মায়ের নাম</Label>
                  <Input
                    id="motherName"
                    name="motherName"
                    value={formData.motherName}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="whatsappNumber">হোয়াটসঅ্যাপ নম্বর</Label>
                  <Input
                    id="whatsappNumber"
                    name="whatsappNumber"
                    value={formData.whatsappNumber}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="guardianPhone">অভিভাবকের ফোন নম্বর</Label>
                  <Input
                    id="guardianPhone"
                    name="guardianPhone"
                    value={formData.guardianPhone || ""}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="emergencyContact">জরুরী যোগাযোগ</Label>
                  <Input
                    id="emergencyContact"
                    name="emergencyContact"
                    value={formData.emergencyContact || ""}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="birthDate">জন্ম তারিখ</Label>
                  <Input
                    id="birthDate"
                    name="birthDate"
                    type="date"
                    value={formData.birthDate || ""}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">ঠিকানা</Label>
                <Input
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="group">গ্রুপ</Label>
                  <Select
                    value={formData.group}
                    onValueChange={handleSelectChange}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hifz">হিফজ</SelectItem>
                      <SelectItem value="qaida">কায়দা</SelectItem>
                      <SelectItem value="nazera">নাযেরা</SelectItem>
                      <SelectItem value="sifara">সিফারা</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="monthlyFee">মাসিক ফি (৳)</Label>
                  <Input
                    id="monthlyFee"
                    name="monthlyFee"
                    type="number"
                    value={formData.monthlyFee}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="previousEducation">আগের শিক্ষা (যদি থাকে)</Label>
                <Input
                  id="previousEducation"
                  name="previousEducation"
                  value={formData.previousEducation || ""}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="medicalInfo">মেডিকেল তথ্য (যদি থাকে)</Label>
                <Input
                  id="medicalInfo"
                  name="medicalInfo"
                  value={formData.medicalInfo || ""}
                  onChange={handleChange}
                />
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="active"
                  checked={formData.active}
                  onCheckedChange={handleCheckboxChange}
                />
                <label
                  htmlFor="active"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  সক্রিয় ছাত্র
                </label>
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
              <Button type="submit" disabled={addStudentMutation.isPending}>
                {addStudentMutation.isPending ? "সংরক্ষণ হচ্ছে..." : "সংরক্ষণ করুন"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Student Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>ছাত্রের তথ্য সম্পাদনা করুন</DialogTitle>
            <DialogDescription>
              {currentStudent?.name} এর তথ্য পরিবর্তন করুন।
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">ছাত্রের নাম</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="enrollmentNumber">ভর্তি নম্বর</Label>
                  <Input
                    id="enrollmentNumber"
                    name="enrollmentNumber"
                    value={formData.enrollmentNumber || ""}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fatherName">বাবার নাম</Label>
                  <Input
                    id="fatherName"
                    name="fatherName"
                    value={formData.fatherName}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="motherName">মায়ের নাম</Label>
                  <Input
                    id="motherName"
                    name="motherName"
                    value={formData.motherName}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="whatsappNumber">হোয়াটসঅ্যাপ নম্বর</Label>
                  <Input
                    id="whatsappNumber"
                    name="whatsappNumber"
                    value={formData.whatsappNumber}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="guardianPhone">অভিভাবকের ফোন নম্বর</Label>
                  <Input
                    id="guardianPhone"
                    name="guardianPhone"
                    value={formData.guardianPhone || ""}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="emergencyContact">জরুরী যোগাযোগ</Label>
                  <Input
                    id="emergencyContact"
                    name="emergencyContact"
                    value={formData.emergencyContact || ""}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="birthDate">জন্ম তারিখ</Label>
                  <Input
                    id="birthDate"
                    name="birthDate"
                    type="date"
                    value={formData.birthDate || ""}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">ঠিকানা</Label>
                <Input
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="group">গ্রুপ</Label>
                  <Select
                    value={formData.group}
                    onValueChange={handleSelectChange}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hifz">হিফজ</SelectItem>
                      <SelectItem value="qaida">কায়দা</SelectItem>
                      <SelectItem value="nazera">নাযেরা</SelectItem>
                      <SelectItem value="sifara">সিফারা</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="monthlyFee">মাসিক ফি (৳)</Label>
                  <Input
                    id="monthlyFee"
                    name="monthlyFee"
                    type="number"
                    value={formData.monthlyFee}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="previousEducation">আগের শিক্ষা (যদি থাকে)</Label>
                <Input
                  id="previousEducation"
                  name="previousEducation"
                  value={formData.previousEducation || ""}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="medicalInfo">মেডিকেল তথ্য (যদি থাকে)</Label>
                <Input
                  id="medicalInfo"
                  name="medicalInfo"
                  value={formData.medicalInfo || ""}
                  onChange={handleChange}
                />
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="active"
                  checked={formData.active}
                  onCheckedChange={handleCheckboxChange}
                />
                <label
                  htmlFor="active"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  সক্রিয় ছাত্র
                </label>
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
              <Button type="submit" disabled={updateStudentMutation.isPending}>
                {updateStudentMutation.isPending ? "হালনাগাদ হচ্ছে..." : "হালনাগাদ করুন"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>ছাত্র মুছে ফেলার নিশ্চিতকরণ</DialogTitle>
            <DialogDescription>
              আপনি কি নিশ্চিত যে আপনি {currentStudent?.name} কে মুছে ফেলতে চান?
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
              onClick={() => currentStudent?.id && deleteStudentMutation.mutate(currentStudent.id)}
              disabled={deleteStudentMutation.isPending}
            >
              {deleteStudentMutation.isPending ? "মুছে ফেলা হচ্ছে..." : "মুছে ফেলুন"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Students;
