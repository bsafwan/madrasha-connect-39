
import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
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
import { toast } from "sonner";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchUsers, createUser, updateUser, deleteUser } from "@/services/dataService";
import { User } from "@/types";
import { Plus, Edit, Trash2, Search, UserCog, ShieldCheck, Mail, Phone } from "lucide-react";
import PhoneInput from "@/components/PhoneInput";

type UserRole = 'admin' | 'teacher';

interface UserWithUpdateData {
  id: string;
  data: Partial<User>;
}

const Users = () => {
  const { user, isAdmin } = useAuth();
  const queryClient = useQueryClient();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [formData, setFormData] = useState<Partial<User>>({
    name: "",
    email: "",
    phone: "",
    role: "teacher",
    password: "",
  });

  // Fetch all users
  const { data: users = [], isLoading } = useQuery({
    queryKey: ["users"],
    queryFn: fetchUsers,
  });

  // Add user mutation
  const addUserMutation = useMutation({
    mutationFn: (userData: User) => createUser(userData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      setIsAddDialogOpen(false);
      resetForm();
      toast.success("ইউজার সফলভাবে যোগ করা হয়েছে");
    },
    onError: (error) => {
      console.error("Error adding user:", error);
      toast.error("ইউজার যোগ করতে সমস্যা হয়েছে");
    },
  });

  // Update user mutation
  const updateUserMutation = useMutation<User | null, Error, UserWithUpdateData>({
    mutationFn: ({ id, data }: UserWithUpdateData) => updateUser(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      setIsEditDialogOpen(false);
      resetForm();
      toast.success("ইউজার সফলভাবে আপডেট করা হয়েছে");
    },
    onError: (error) => {
      console.error("Error updating user:", error);
      toast.error("ইউজার আপডেট করতে সমস্যা হয়েছে");
    },
  });

  // Delete user mutation
  const deleteUserMutation = useMutation({
    mutationFn: (id: string) => deleteUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      setIsDeleteDialogOpen(false);
      resetForm();
      toast.success("ইউজার সফলভাবে মুছে ফেলা হয়েছে");
    },
    onError: (error) => {
      console.error("Error deleting user:", error);
      toast.error("ইউজার মুছতে সমস্যা হয়েছে");
    },
  });

  // Reset form
  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      phone: "",
      role: "teacher",
      password: "",
    });
    setCurrentUser(null);
  };

  // Handle edit button click
  const handleEdit = (user: User) => {
    setCurrentUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role as UserRole,
    });
    setIsEditDialogOpen(true);
  };

  // Handle delete button click
  const handleDelete = (user: User) => {
    setCurrentUser(user);
    setIsDeleteDialogOpen(true);
  };

  // Handle form input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle phone number change
  const handlePhoneChange = (value: string) => {
    setFormData({ ...formData, phone: value });
  };

  // Handle role change
  const handleRoleChange = (value: string) => {
    setFormData({ ...formData, role: value as UserRole });
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Form validation
    if (!formData.name || !formData.email || !formData.phone) {
      toast.error("অনুগ্রহ করে সব প্রয়োজনীয় ফিল্ড পূরণ করুন");
      return;
    }
    
    if (currentUser) {
      // Update existing user
      updateUserMutation.mutate({ 
        id: currentUser.id, 
        data: {
          name: formData.name,
          phone: formData.phone,
          email: formData.email,
          role: formData.role,
          password: formData.password // Only update password if provided
        }
      });
    } else {
      // Create new user
      if (!formData.password) {
        toast.error("নতুন ইউজারের জন্য পাসওয়ার্ড প্রয়োজন");
        return;
      }
      
      addUserMutation.mutate({
        id: "", // This will be generated on the server
        name: formData.name || "",
        email: formData.email || "",
        phone: formData.phone || "",
        role: formData.role || "teacher",
        password: formData.password || ""
      });
    }
  };

  // Filter users based on search term
  const filteredUsers = users.filter((user) => {
    return (
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.phone.includes(searchTerm)
    );
  });

  // Check if current user is trying to modify their own account
  const isSelfEdit = currentUser?.id === user?.id;

  if (!isAdmin) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-200px)]">
        <div className="text-center space-y-4">
          <ShieldCheck className="mx-auto h-12 w-12 text-red-500" />
          <h2 className="text-2xl font-bold">অনুমতি প্রত্যাখ্যান করা হয়েছে</h2>
          <p className="text-muted-foreground">
            শুধুমাত্র অ্যাডমিন ইউজার এই পৃষ্ঠাটি দেখতে পারেন।
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 page-transition">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-2xl font-semibold tracking-tight">ইউজার ব্যবস্থাপনা</h2>
        <Button onClick={() => setIsAddDialogOpen(true)} className="btn-primary">
          <Plus className="mr-2 h-4 w-4" /> নতুন ইউজার যোগ করুন
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>সকল ইউজার</CardTitle>
          <CardDescription>মোট {users.length} জন ইউজার</CardDescription>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mt-4">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="নাম, ইমেইল বা ফোন নম্বর দিয়ে খুঁজুন"
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              কোন ইউজার পাওয়া যায়নি
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>নাম</TableHead>
                    <TableHead>ইমেইল</TableHead>
                    <TableHead>ফোন</TableHead>
                    <TableHead>রোল</TableHead>
                    <TableHead className="text-right">অ্যাকশন</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.phone}</TableCell>
                      <TableCell>
                        <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          user.role === "admin"
                            ? "bg-purple-100 text-purple-800"
                            : "bg-blue-100 text-blue-800"
                        }`}>
                          {user.role === "admin" ? "অ্যাডমিন" : "শিক্ষক"}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(user)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        {user.id !== '1' && ( // Prevent deleting the first admin user
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(user)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
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

      {/* Add User Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>নতুন ইউজার যোগ করুন</DialogTitle>
            <DialogDescription>
              নতুন ইউজারের বিবরণ ফর্মে পূরণ করুন।
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">নাম*</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">ইমেইল*</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">ফোন নম্বর* (দেশের কোড সহ, + ছাড়া)</Label>
                <PhoneInput
                  value={formData.phone || ""}
                  onChange={handlePhoneChange}
                  placeholder="88017xxxxxxxx"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">রোল*</Label>
                <Select
                  value={formData.role}
                  onValueChange={handleRoleChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="রোল নির্বাচন করুন" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">অ্যাডমিন</SelectItem>
                    <SelectItem value="teacher">শিক্ষক</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">পাসওয়ার্ড*</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
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
              <Button type="submit" disabled={addUserMutation.isPending}>
                {addUserMutation.isPending ? "যোগ করা হচ্ছে..." : "যোগ করুন"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit User Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>ইউজার সম্পাদনা করুন</DialogTitle>
            <DialogDescription>
              {currentUser?.name} এর তথ্য পরিবর্তন করুন।
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">নাম*</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">ইমেইল*</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">ফোন নম্বর* (দেশের কোড সহ, + ছাড়া)</Label>
                <PhoneInput
                  value={formData.phone || ""}
                  onChange={handlePhoneChange}
                  placeholder="88017xxxxxxxx"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">রোল*</Label>
                <Select
                  value={formData.role}
                  onValueChange={handleRoleChange}
                  disabled={isSelfEdit} // Prevent changing own role
                >
                  <SelectTrigger>
                    <SelectValue placeholder="রোল নির্বাচন করুন" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">অ্যাডমিন</SelectItem>
                    <SelectItem value="teacher">শিক্ষক</SelectItem>
                  </SelectContent>
                </Select>
                {isSelfEdit && (
                  <p className="text-xs text-muted-foreground mt-1">
                    আপনি নিজের রোল পরিবর্তন করতে পারবেন না।
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">নতুন পাসওয়ার্ড (পরিবর্তন করতে চাইলে)</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                />
                <p className="text-xs text-muted-foreground">
                  পাসওয়ার্ড পরিবর্তন না করতে চাইলে খালি রাখুন।
                </p>
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
              <Button type="submit" disabled={updateUserMutation.isPending}>
                {updateUserMutation.isPending ? "হালনাগাদ হচ্ছে..." : "হালনাগাদ করুন"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>ইউজার মুছে ফেলার নিশ্চিতকরণ</AlertDialogTitle>
            <AlertDialogDescription>
              আপনি কি নিশ্চিত যে আপনি <span className="font-semibold">{currentUser?.name}</span> কে মুছে ফেলতে চান?
              এই ক্রিয়া অপরিবর্তনীয়।
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>বাতিল</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => currentUser?.id && deleteUserMutation.mutate(currentUser.id)}
              disabled={deleteUserMutation.isPending}
              className="bg-red-600 hover:bg-red-700"
            >
              {deleteUserMutation.isPending ? "মুছে ফেলা হচ্ছে..." : "মুছে ফেলুন"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Users;
