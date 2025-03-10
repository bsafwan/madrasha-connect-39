
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
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
import { fetchStudents, createStudent, updateStudent, deleteStudent, fetchTeachers } from "@/services/dataService";
import { formatDateBengali, toBengaliNumber } from "@/integrations/supabase/client";
import { Student, Teacher } from "@/types";
import { Plus, Edit, Trash2, Search, Filter, User, Phone, Home, Book, Coins, X, ArrowUpDown } from "lucide-react";
import PhoneInput from "@/components/PhoneInput";

const Students = () => {
  const { user, isAdmin } = useAuth();
  const queryClient = useQueryClient();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isResignDialogOpen, setIsResignDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterGroup, setFilterGroup] = useState("");
  const [filterTeacher, setFilterTeacher] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [sortField, setSortField] = useState("name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [currentStudent, setCurrentStudent] = useState<Student | null>(null);
  const [formData, setFormData] = useState<Partial<Student>>({
    name: "",
    fatherName: "",
    motherName: "",
    parentPhone1: "",
    parentPhone2: "",
    whatsappNumber: "",
    address: "",
    group: "hifz",
    monthlyFee: 500,
    active: true,
    resigned: false,
    assignedTeacherId: "",
  });

  // Fetch all students
  const { data: students = [], isLoading: isLoadingStudents } = useQuery({
    queryKey: ["students"],
    queryFn: fetchStudents,
  });

  // Fetch all teachers for assignment
  const { data: teachers = [], isLoading: isLoadingTeachers } = useQuery({
    queryKey: ["teachers"],
    queryFn: fetchTeachers,
  });

  // Filter out admin users from the teachers list for assignment
  const availableTeachers = teachers.filter(teacher => teacher.active);

  // Add student mutation
  const addStudentMutation = useMutation({
    mutationFn: (studentData: Omit<Student, "id" | "registrationDate" | "updatedAt">) => {
      return createStudent(studentData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["students"] });
      setIsAddDialogOpen(false);
      resetForm();
      toast.success("ছাত্র সফলভাবে যোগ করা হয়েছে");
    },
    onError: (error) => {
      console.error("Error adding student:", error);
      toast.error("ছাত্র যোগ করতে সমস্যা হয়েছে");
    },
  });

  // Update student mutation
  const updateStudentMutation = useMutation({
    mutationFn: (student: { id: string, data: Partial<Student> }) => updateStudent(student.id, student.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["students"] });
      setIsEditDialogOpen(false);
      setIsResignDialogOpen(false);
      resetForm();
      toast.success("ছাত্রের তথ্য সফলভাবে হালনাগাদ করা হয়েছে");
    },
    onError: (error) => {
      console.error("Error updating student:", error);
      toast.error("ছাত্রের তথ্য হালনাগাদ করতে সমস্যা হয়েছে");
    },
  });

  // Delete student mutation
  const deleteStudentMutation = useMutation({
    mutationFn: (id: string) => deleteStudent(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["students"] });
      setIsDeleteDialogOpen(false);
      toast.success("ছাত্র সফলভাবে মুছে ফেলা হয়েছে");
    },
    onError: (error) => {
      console.error("Error deleting student:", error);
      toast.error("ছাত্র মুছতে সমস্যা হয়েছে");
    },
  });

  // Reset form
  const resetForm = () => {
    setFormData({
      name: "",
      fatherName: "",
      motherName: "",
      parentPhone1: "",
      parentPhone2: "",
      whatsappNumber: "",
      address: "",
      group: "hifz",
      monthlyFee: 500,
      active: true,
      resigned: false,
      assignedTeacherId: "",
    });
    setCurrentStudent(null);
  };

  // Handle edit button click
  const handleEdit = (student: Student) => {
    if (!isAdmin) {
      toast.error("শুধুমাত্র অ্যাডমিন ছাত্রের তথ্য সম্পাদনা করতে পারেন");
      return;
    }
    
    setCurrentStudent(student);
    setFormData({
      id: student.id,
      name: student.name,
      fatherName: student.fatherName,
      motherName: student.motherName,
      parentPhone1: student.parentPhone1 || "",
      parentPhone2: student.parentPhone2 || "",
      whatsappNumber: student.whatsappNumber || "",
      address: student.address || "",
      group: student.group,
      monthlyFee: student.monthlyFee,
      active: student.active,
      resigned: student.resigned || false,
      assignedTeacherId: student.assignedTeacherId || "",
      guardianPhone: student.guardianPhone,
      emergencyContact: student.emergencyContact,
      birthDate: student.birthDate,
      enrollmentNumber: student.enrollmentNumber,
      previousEducation: student.previousEducation,
      medicalInfo: student.medicalInfo,
    });
    setIsEditDialogOpen(true);
  };

  // Handle resign button click
  const handleResign = (student: Student) => {
    if (!isAdmin) {
      toast.error("শুধুমাত্র অ্যাডমিন ছাত্রকে অবসর দিতে পারেন");
      return;
    }
    
    setCurrentStudent(student);
    setFormData({
      id: student.id,
      resigned: true,
      resignDate: new Date().toISOString().split('T')[0],
      active: false,
    });
    setIsResignDialogOpen(true);
  };

  // Handle delete button click
  const handleDelete = (student: Student) => {
    if (!isAdmin) {
      toast.error("শুধুমাত্র অ্যাডমিন ছাত্র মুছতে পারেন");
      return;
    }
    
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

  // Handle phone number change
  const handlePhoneChange = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value });
  };

  // Handle checkbox change
  const handleCheckboxChange = (name: string, checked: boolean) => {
    setFormData({ ...formData, [name]: checked });
  };

  // Handle select change
  const handleSelectChange = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value });
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.name || !formData.fatherName || !formData.motherName || !formData.parentPhone1 || !formData.assignedTeacherId) {
      toast.error("সব প্রয়োজনীয় ক্ষেত্র পূরণ করুন");
      return;
    }
    
    // Validate phone number format
    const phoneRegex = /^\d+$/;
    if (!phoneRegex.test(formData.parentPhone1 || "")) {
      toast.error("অবৈধ ফোন নম্বর ফরম্যাট। শুধুমাত্র সংখ্যা ব্যবহার করুন, কোনো বিশেষ চিহ্ন বা ফাঁকা স্থান নয়");
      return;
    }
    
    if (formData.parentPhone2 && !phoneRegex.test(formData.parentPhone2)) {
      toast.error("অবৈধ দ্বিতীয় ফোন নম্বর ফরম্যাট। শুধুমাত্র সংখ্যা ব্যবহার করুন");
      return;
    }

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
        parentPhone1: formData.parentPhone1 || "",
        parentPhone2: formData.parentPhone2,
        whatsappNumber: formData.whatsappNumber,
        address: formData.address,
        group: formData.group || "hifz",
        monthlyFee: formData.monthlyFee || 500,
        active: formData.active === undefined ? true : formData.active,
        resigned: formData.resigned || false,
        assignedTeacherId: formData.assignedTeacherId || "",
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

  // Handle resign confirmation
  const handleResignConfirm = () => {
    if (currentStudent) {
      updateStudentMutation.mutate({
        id: currentStudent.id,
        data: {
          resigned: true,
          resignDate: new Date().toISOString().split('T')[0],
          active: false
        }
      });
    }
  };

  // Handle sorting
  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  // Apply sorting to students
  const sortedStudents = [...students].sort((a, b) => {
    let valueA: any;
    let valueB: any;

    // Extract values based on the field
    switch (sortField) {
      case "name":
        valueA = a.name;
        valueB = b.name;
        break;
      case "fatherName":
        valueA = a.fatherName;
        valueB = b.fatherName;
        break;
      case "monthlyFee":
        valueA = a.monthlyFee;
        valueB = b.monthlyFee;
        break;
      default:
        valueA = a.name;
        valueB = b.name;
    }

    // Compare values
    if (valueA < valueB) return sortDirection === "asc" ? -1 : 1;
    if (valueA > valueB) return sortDirection === "asc" ? 1 : -1;
    return 0;
  });

  // Filter students based on search term, group, teacher, and status
  const filteredStudents = sortedStudents.filter((student) => {
    const matchesSearchTerm =
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.fatherName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (student.parentPhone1 && student.parentPhone1.includes(searchTerm)) ||
      (student.parentPhone2 && student.parentPhone2.includes(searchTerm));
    
    const matchesGroup = filterGroup ? student.group === filterGroup : true;
    
    const matchesTeacher = filterTeacher ? student.assignedTeacherId === filterTeacher : true;
    
    const matchesStatus = 
      filterStatus === "active" ? student.active === true && student.resigned !== true :
      filterStatus === "inactive" ? student.active === false :
      filterStatus === "resigned" ? student.resigned === true :
      true;
    
    return matchesSearchTerm && matchesGroup && matchesTeacher && matchesStatus;
  });

  // Get unique groups for filter dropdown
  const uniqueGroups = [...new Set(students.map(student => student.group))];

  // Find teacher name by ID
  const getTeacherName = (teacherId: string) => {
    const teacher = teachers.find(t => t.id === teacherId);
    return teacher ? teacher.name : "অনির্দিষ্ট";
  };

  return (
    <div className="space-y-6 page-transition">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-2xl font-semibold tracking-tight">ছাত্র ব্যবস্থাপনা</h2>
        {isAdmin && (
          <Button onClick={() => setIsAddDialogOpen(true)} className="btn-primary">
            <Plus className="mr-2 h-4 w-4" /> নতুন ছাত্র যোগ করুন
          </Button>
        )}
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
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 w-full sm:w-auto">
              <Select value={filterGroup} onValueChange={setFilterGroup}>
                <SelectTrigger>
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="গ্রুপ" />
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
              
              <Select value={filterTeacher} onValueChange={setFilterTeacher}>
                <SelectTrigger>
                  <User className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="শিক্ষক" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">সকল শিক্ষক</SelectItem>
                  {availableTeachers.map((teacher) => (
                    <SelectItem key={teacher.id} value={teacher.id}>
                      {teacher.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger>
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="স্টেটাস" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">সকল স্টেটাস</SelectItem>
                  <SelectItem value="active">সক্রিয়</SelectItem>
                  <SelectItem value="inactive">নিষ্ক্রিয়</SelectItem>
                  <SelectItem value="resigned">অবসরপ্রাপ্ত</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoadingStudents || isLoadingTeachers ? (
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
                    <TableHead className="cursor-pointer" onClick={() => handleSort("name")}>
                      নাম
                      {sortField === "name" && (
                        <ArrowUpDown className={`ml-2 h-4 w-4 inline ${sortDirection === "desc" ? "rotate-180" : ""}`} />
                      )}
                    </TableHead>
                    <TableHead className="cursor-pointer" onClick={() => handleSort("fatherName")}>
                      বাবার নাম
                      {sortField === "fatherName" && (
                        <ArrowUpDown className={`ml-2 h-4 w-4 inline ${sortDirection === "desc" ? "rotate-180" : ""}`} />
                      )}
                    </TableHead>
                    <TableHead>ফোন নম্বর</TableHead>
                    <TableHead>শিক্ষক</TableHead>
                    <TableHead>গ্রুপ</TableHead>
                    <TableHead className="cursor-pointer" onClick={() => handleSort("monthlyFee")}>
                      মাসিক ফি
                      {sortField === "monthlyFee" && (
                        <ArrowUpDown className={`ml-2 h-4 w-4 inline ${sortDirection === "desc" ? "rotate-180" : ""}`} />
                      )}
                    </TableHead>
                    <TableHead>স্ট্যাটাস</TableHead>
                    <TableHead className="text-right">অ্যাকশন</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredStudents.map((student) => (
                    <TableRow key={student.id}>
                      <TableCell className="font-medium">{student.name}</TableCell>
                      <TableCell>{student.fatherName}</TableCell>
                      <TableCell>{student.parentPhone1}</TableCell>
                      <TableCell>{getTeacherName(student.assignedTeacherId)}</TableCell>
                      <TableCell>
                        {student.group === "hifz" ? "হিফজ" : 
                        student.group === "qaida" ? "কায়দা" : 
                        student.group === "nazera" ? "নাযেরা" : 
                        student.group === "sifara" ? "সিফারা" : student.group}
                      </TableCell>
                      <TableCell>৳{toBengaliNumber(student.monthlyFee)}</TableCell>
                      <TableCell>
                        <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          student.resigned
                            ? "bg-yellow-100 text-yellow-800"
                            : student.active
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}>
                          {student.resigned ? "অবসরপ্রাপ্ত" : student.active ? "সক্রিয়" : "নিষ্ক্রিয়"}
                        </div>
                      </TableCell>
                      <TableCell className="text-right space-x-1">
                        {isAdmin && (
                          <>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEdit(student)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            
                            {!student.resigned && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleResign(student)}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            )}
                            
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(student)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </>
                        )}
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
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
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
                  <Label htmlFor="name">ছাত্রের নাম*</Label>
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
                  <Label htmlFor="fatherName">বাবার নাম*</Label>
                  <Input
                    id="fatherName"
                    name="fatherName"
                    value={formData.fatherName}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="motherName">মায়ের নাম*</Label>
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
                  <Label htmlFor="parentPhone1">অভিভাবকের প্রথম ফোন নম্বর* (দেশের কোড সহ, + ছাড়া)</Label>
                  <PhoneInput
                    value={formData.parentPhone1 || ""}
                    onChange={(value) => handlePhoneChange("parentPhone1", value)}
                    placeholder="88017xxxxxxxx"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="parentPhone2">অভিভাবকের দ্বিতীয় ফোন নম্বর (দেশের কোড সহ, + ছাড়া)</Label>
                  <PhoneInput
                    value={formData.parentPhone2 || ""}
                    onChange={(value) => handlePhoneChange("parentPhone2", value)}
                    placeholder="88017xxxxxxxx"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="whatsappNumber">হোয়াটসঅ্যাপ নম্বর (যদি থাকে)</Label>
                  <PhoneInput
                    value={formData.whatsappNumber || ""}
                    onChange={(value) => handlePhoneChange("whatsappNumber", value)}
                    placeholder="88017xxxxxxxx"
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
                  value={formData.address || ""}
                  onChange={handleChange}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="group">গ্রুপ*</Label>
                  <Select
                    value={formData.group}
                    onValueChange={(value) => handleSelectChange("group", value)}
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
                  <Label htmlFor="monthlyFee">মাসিক ফি (৳)*</Label>
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
                <Label htmlFor="assignedTeacherId">নির্ধারিত শিক্ষক*</Label>
                <Select
                  value={formData.assignedTeacherId}
                  onValueChange={(value) => handleSelectChange("assignedTeacherId", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="একজন শিক্ষক নির্বাচন করুন" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableTeachers.map((teacher) => (
                      <SelectItem key={teacher.id} value={teacher.id}>
                        {teacher.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
                  onCheckedChange={(checked) => handleCheckboxChange("active", checked === true)}
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
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
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
                  <Label htmlFor="name">ছাত্রের নাম*</Label>
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
                  <Label htmlFor="fatherName">বাবার নাম*</Label>
                  <Input
                    id="fatherName"
                    name="fatherName"
                    value={formData.fatherName}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="motherName">মায়ের নাম*</Label>
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
                  <Label htmlFor="parentPhone1">অভিভাবকের প্রথম ফোন নম্বর* (দেশের কোড সহ, + ছাড়া)</Label>
                  <PhoneInput
                    value={formData.parentPhone1 || ""}
                    onChange={(value) => handlePhoneChange("parentPhone1", value)}
                    placeholder="88017xxxxxxxx"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="parentPhone2">অভিভাবকের দ্বিতীয় ফোন নম্বর (দেশের কোড সহ, + ছাড়া)</Label>
                  <PhoneInput
                    value={formData.parentPhone2 || ""}
                    onChange={(value) => handlePhoneChange("parentPhone2", value)}
                    placeholder="88017xxxxxxxx"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="whatsappNumber">হোয়াটসঅ্যাপ নম্বর (যদি থাকে)</Label>
                  <PhoneInput
                    value={formData.whatsappNumber || ""}
                    onChange={(value) => handlePhoneChange("whatsappNumber", value)}
                    placeholder="88017xxxxxxxx"
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
                  value={formData.address || ""}
                  onChange={handleChange}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="group">গ্রুপ*</Label>
                  <Select
                    value={formData.group}
                    onValueChange={(value) => handleSelectChange("group", value)}
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
                  <Label htmlFor="monthlyFee">মাসিক ফি (৳)*</Label>
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
                <Label htmlFor="assignedTeacherId">নির্ধারিত শিক্ষক*</Label>
                <Select
                  value={formData.assignedTeacherId}
                  onValueChange={(value) => handleSelectChange("assignedTeacherId", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="একজন শিক্ষক নির্বাচন করুন" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableTeachers.map((teacher) => (
                      <SelectItem key={teacher.id} value={teacher.id}>
                        {teacher.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
                  onCheckedChange={(checked) => handleCheckboxChange("active", checked === true)}
                />
                <label
                  htmlFor="active"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  সক্রিয় ছাত্র
                </label>
              </div>
              {formData.resigned && (
                <div className="rounded-md bg-yellow-50 p-4">
                  <div className="flex">
                    <div className="text-yellow-800">
                      <p className="text-sm font-medium">
                        এই ছাত্র অবসরপ্রাপ্ত হিসেবে চিহ্নিত করা হয়েছে {formData.resignDate ? `(${formData.resignDate})` : ''}
                      </p>
                    </div>
                  </div>
                </div>
              )}
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

      {/* Resign Student Dialog */}
      <AlertDialog open={isResignDialogOpen} onOpenChange={setIsResignDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>ছাত্রকে অবসর দেওয়ার নিশ্চিতকরণ</AlertDialogTitle>
            <AlertDialogDescription>
              আপনি কি নিশ্চিত যে আপনি {currentStudent?.name} কে অবসর দিতে চান?
              এই ছাত্র অবসরপ্রাপ্ত হিসেবে চিহ্নিত করা হবে এবং ভবিষ্যতে সক্রিয় হিসেবে গণ্য করা হবে না।
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setIsResignDialogOpen(false)}>
              বাতিল
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleResignConfirm}
              disabled={updateStudentMutation.isPending}
            >
              {updateStudentMutation.isPending ? "প্রক্রিয়াধীন..." : "নিশ্চিত করুন"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>ছাত্র মুছে ফেলার নিশ্চিতকরণ</AlertDialogTitle>
            <AlertDialogDescription>
              আপনি কি নিশ্চিত যে আপনি {currentStudent?.name} কে মুছে ফেলতে চান?
              এই ক্রিয়া অপরিবর্তনীয়।
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setIsDeleteDialogOpen(false)}>
              বাতিল
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => currentStudent?.id && deleteStudentMutation.mutate(currentStudent.id)}
              disabled={deleteStudentMutation.isPending}
              className="bg-red-600 hover:bg-red-700"
            >
              {deleteStudentMutation.isPending ? "মুছে ফেলা হচ্ছে..." : "মুছে ফেলুন"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Students;
