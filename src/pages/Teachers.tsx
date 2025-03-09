
import React, { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchTeachers, createTeacher, updateTeacher, deleteTeacher } from "@/services/dataService";
import { formatCurrency, toBengaliNumber } from "@/integrations/supabase/client";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { 
  PlusCircle, 
  Edit, 
  Trash2, 
  Eye, 
  X,
  Check,
  Loader2
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Teacher } from "@/types";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

const Teachers = () => {
  const { user, isAdmin } = useAuth();
  const queryClient = useQueryClient();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);
  const [formData, setFormData] = useState<Omit<Teacher, "id" | "joiningDate">>({
    name: "",
    phone: "",
    email: "",
    address: "",
    qualification: "",
    specialty: "",
    salary: 0,
    active: true
  });

  const { data: teachers = [], isLoading } = useQuery({
    queryKey: ["teachers"],
    queryFn: fetchTeachers,
  });

  // Create teacher mutation
  const createTeacherMutation = useMutation({
    mutationFn: createTeacher,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teachers"] });
      toast.success("শিক্ষক সফলভাবে যোগ করা হয়েছে");
      setIsAddDialogOpen(false);
      resetForm();
    },
    onError: (error) => {
      console.error("Error creating teacher:", error);
      toast.error("শিক্ষক যোগ করতে সমস্যা হয়েছে");
    }
  });

  // Update teacher mutation
  const updateTeacherMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Teacher> }) => 
      updateTeacher(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teachers"] });
      toast.success("শিক্ষকের তথ্য সফলভাবে আপডেট করা হয়েছে");
      setIsEditDialogOpen(false);
    },
    onError: (error) => {
      console.error("Error updating teacher:", error);
      toast.error("শিক্ষকের তথ্য আপডেট করতে সমস্যা হয়েছে");
    }
  });

  // Delete teacher mutation
  const deleteTeacherMutation = useMutation({
    mutationFn: (id: string) => deleteTeacher(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teachers"] });
      toast.success("শিক্ষক সফলভাবে মুছে ফেলা হয়েছে");
      setIsDeleteDialogOpen(false);
      setSelectedTeacher(null);
    },
    onError: (error) => {
      console.error("Error deleting teacher:", error);
      toast.error("শিক্ষক মুছে ফেলতে সমস্যা হয়েছে");
    }
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === "salary" ? Number(value) : value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createTeacherMutation.mutate(formData);
  };

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedTeacher) {
      updateTeacherMutation.mutate({
        id: selectedTeacher.id,
        data: formData
      });
    }
  };

  const handleDelete = () => {
    if (selectedTeacher) {
      deleteTeacherMutation.mutate(selectedTeacher.id);
    }
  };

  const openViewDialog = (teacher: Teacher) => {
    setSelectedTeacher(teacher);
    setIsViewDialogOpen(true);
  };

  const openEditDialog = (teacher: Teacher) => {
    setSelectedTeacher(teacher);
    setFormData({
      name: teacher.name,
      phone: teacher.phone,
      email: teacher.email || "",
      address: teacher.address || "",
      qualification: teacher.qualification || "",
      specialty: teacher.specialty || "",
      salary: teacher.salary,
      active: teacher.active
    });
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (teacher: Teacher) => {
    setSelectedTeacher(teacher);
    setIsDeleteDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({
      name: "",
      phone: "",
      email: "",
      address: "",
      qualification: "",
      specialty: "",
      salary: 0,
      active: true
    });
  };

  const openAddDialog = () => {
    resetForm();
    setIsAddDialogOpen(true);
  };

  return (
    <div className="space-y-6 page-transition">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-2xl font-semibold tracking-tight">শিক্ষকগণ</h2>
        {isAdmin && (
          <Button className="btn-primary" onClick={openAddDialog}>
            <PlusCircle className="mr-2 h-4 w-4" /> নতুন শিক্ষক যোগ করুন
          </Button>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>শিক্ষকদের তালিকা</CardTitle>
          <CardDescription>
            মাদ্রাসার সকল শিক্ষকের তথ্য
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : teachers.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground">
              কোন শিক্ষক যোগ করা হয়নি
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>নাম</TableHead>
                    <TableHead>ফোন</TableHead>
                    <TableHead>যোগ্যতা</TableHead>
                    <TableHead>বিশেষত্ব</TableHead>
                    {isAdmin && <TableHead>বেতন</TableHead>}
                    <TableHead>অবস্থা</TableHead>
                    <TableHead className="text-right">কার্যক্রম</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {teachers.map((teacher) => (
                    <TableRow key={teacher.id}>
                      <TableCell className="font-medium">{teacher.name}</TableCell>
                      <TableCell>{teacher.phone}</TableCell>
                      <TableCell>{teacher.qualification || '-'}</TableCell>
                      <TableCell>{teacher.specialty || '-'}</TableCell>
                      {isAdmin && <TableCell>{formatCurrency(teacher.salary)}</TableCell>}
                      <TableCell>
                        {teacher.active ? (
                          <span className="text-green-600">সক্রিয়</span>
                        ) : (
                          <span className="text-red-600">নিষ্ক্রিয়</span>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button 
                            variant="outline" 
                            size="icon" 
                            onClick={() => openViewDialog(teacher)}
                            title="বিস্তারিত দেখুন"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          {isAdmin && (
                            <>
                              <Button 
                                variant="outline" 
                                size="icon" 
                                onClick={() => openEditDialog(teacher)}
                                title="সম্পাদনা করুন"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="outline" 
                                size="icon" 
                                onClick={() => openDeleteDialog(teacher)}
                                title="মুছে ফেলুন"
                                className="text-red-500 hover:text-red-700"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add Teacher Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>নতুন শিক্ষক যোগ করুন</DialogTitle>
            <DialogDescription>
              নতুন শিক্ষকের তথ্য নিচের ফর্মে পূরণ করুন।
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">নাম <span className="text-red-500">*</span></Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">ফোন নম্বর <span className="text-red-500">*</span></Label>
                  <Input
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">ইমেইল</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">ঠিকানা</Label>
                <Textarea
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="qualification">যোগ্যতা</Label>
                  <Input
                    id="qualification"
                    name="qualification"
                    value={formData.qualification}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="specialty">বিশেষত্ব</Label>
                  <Input
                    id="specialty"
                    name="specialty"
                    value={formData.specialty}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="salary">বেতন <span className="text-red-500">*</span></Label>
                  <Input
                    id="salary"
                    name="salary"
                    type="number"
                    value={formData.salary}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2 flex items-center pt-8">
                  <Label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      name="active"
                      checked={formData.active}
                      onChange={(e) => setFormData({...formData, active: e.target.checked})}
                      className="h-4 w-4"
                    />
                    সক্রিয়
                  </Label>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                বাতিল
              </Button>
              <Button 
                type="submit" 
                disabled={createTeacherMutation.isPending}
              >
                {createTeacherMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    সংরক্ষণ হচ্ছে...
                  </>
                ) : "সংরক্ষণ করুন"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* View Teacher Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>শিক্ষকের বিস্তারিত তথ্য</DialogTitle>
          </DialogHeader>
          {selectedTeacher && (
            <div className="py-4">
              <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                <div className="font-medium">নাম:</div>
                <div>{selectedTeacher.name}</div>
                
                <div className="font-medium">ফোন:</div>
                <div>{selectedTeacher.phone}</div>
                
                {selectedTeacher.email && (
                  <>
                    <div className="font-medium">ইমেইল:</div>
                    <div>{selectedTeacher.email}</div>
                  </>
                )}
                
                {selectedTeacher.address && (
                  <>
                    <div className="font-medium">ঠিকানা:</div>
                    <div>{selectedTeacher.address}</div>
                  </>
                )}
                
                {selectedTeacher.qualification && (
                  <>
                    <div className="font-medium">যোগ্যতা:</div>
                    <div>{selectedTeacher.qualification}</div>
                  </>
                )}
                
                {selectedTeacher.specialty && (
                  <>
                    <div className="font-medium">বিশেষত্ব:</div>
                    <div>{selectedTeacher.specialty}</div>
                  </>
                )}
                
                {isAdmin && (
                  <>
                    <div className="font-medium">বেতন:</div>
                    <div>{formatCurrency(selectedTeacher.salary)}</div>
                  </>
                )}
                
                <div className="font-medium">যোগদানের তারিখ:</div>
                <div>{new Date(selectedTeacher.joiningDate).toLocaleDateString('bn-BD')}</div>
                
                <div className="font-medium">অবস্থা:</div>
                <div>
                  {selectedTeacher.active ? (
                    <span className="text-green-600">সক্রিয়</span>
                  ) : (
                    <span className="text-red-600">নিষ্ক্রিয়</span>
                  )}
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setIsViewDialogOpen(false)}>
              ঠিক আছে
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Teacher Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>শিক্ষকের তথ্য সম্পাদনা করুন</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleUpdate}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-name">নাম <span className="text-red-500">*</span></Label>
                  <Input
                    id="edit-name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-phone">ফোন নম্বর <span className="text-red-500">*</span></Label>
                  <Input
                    id="edit-phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-email">ইমেইল</Label>
                <Input
                  id="edit-email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-address">ঠিকানা</Label>
                <Textarea
                  id="edit-address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-qualification">যোগ্যতা</Label>
                  <Input
                    id="edit-qualification"
                    name="qualification"
                    value={formData.qualification}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-specialty">বিশেষত্ব</Label>
                  <Input
                    id="edit-specialty"
                    name="specialty"
                    value={formData.specialty}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-salary">বেতন <span className="text-red-500">*</span></Label>
                  <Input
                    id="edit-salary"
                    name="salary"
                    type="number"
                    value={formData.salary}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2 flex items-center pt-8">
                  <Label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      name="active"
                      checked={formData.active}
                      onChange={(e) => setFormData({...formData, active: e.target.checked})}
                      className="h-4 w-4"
                    />
                    সক্রিয়
                  </Label>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                বাতিল
              </Button>
              <Button 
                type="submit" 
                disabled={updateTeacherMutation.isPending}
              >
                {updateTeacherMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    আপডেট হচ্ছে...
                  </>
                ) : "আপডেট করুন"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>শিক্ষক মুছে ফেলার নিশ্চিতকরণ</DialogTitle>
            <DialogDescription>
              আপনি কি নিশ্চিত যে আপনি এই শিক্ষককে মুছে ফেলতে চান? এই কাজটি ফিরিয়ে নেওয়া যাবে না।
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            {selectedTeacher && (
              <p className="font-medium">
                শিক্ষকের নাম: <span className="text-red-500">{selectedTeacher.name}</span>
              </p>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              <X className="mr-2 h-4 w-4" /> বাতিল
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleDelete}
              disabled={deleteTeacherMutation.isPending}
            >
              {deleteTeacherMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  মুছে ফেলা হচ্ছে...
                </>
              ) : (
                <>
                  <Check className="mr-2 h-4 w-4" /> নিশ্চিত করুন
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Teachers;
