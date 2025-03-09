
import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle,
  CardFooter 
} from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  UserPlus, 
  Edit2, 
  Trash2, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  UserCog,
  Key 
} from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { fetchUsers, createUser, updateUser, deleteUser } from "@/services/dataService";
import { User, UserRole } from "@/types";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

// Form schema
const userFormSchema = z.object({
  name: z.string().min(2, {
    message: "নাম অন্তত ২টি অক্ষর হতে হবে",
  }),
  email: z.string().email({
    message: "সঠিক ইমেইল এড্রেস দিন",
  }),
  phone: z.string().min(11, {
    message: "সঠিক ফোন নম্বর দিন",
  }),
  role: z.enum(["admin", "teacher"], {
    required_error: "রোল নির্বাচন করুন",
  }),
  password: z.string().min(6, {
    message: "পাসওয়ার্ড অন্তত ৬টি অক্ষর হতে হবে",
  }),
});

// Password change schema
const passwordChangeSchema = z.object({
  password: z.string().min(6, {
    message: "পাসওয়ার্ড অন্তত ৬টি অক্ষর হতে হবে",
  }),
});

const Users = () => {
  const { user, isAdmin } = useAuth();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [passwordChangeOpen, setPasswordChangeOpen] = useState(false);
  const [userToChangePassword, setUserToChangePassword] = useState<User | null>(null);
  
  const queryClient = useQueryClient();
  
  // Query users
  const { data: users = [], isLoading } = useQuery({
    queryKey: ['users'],
    queryFn: fetchUsers,
  });
  
  // Form for creating/editing users
  const form = useForm<z.infer<typeof userFormSchema>>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      role: "teacher",
      password: "",
    },
  });
  
  // Form for changing password
  const passwordForm = useForm<z.infer<typeof passwordChangeSchema>>({
    resolver: zodResolver(passwordChangeSchema),
    defaultValues: {
      password: "",
    },
  });
  
  // Set form values when editing
  useEffect(() => {
    if (editingUser) {
      form.reset({
        name: editingUser.name,
        email: editingUser.email,
        phone: editingUser.phone,
        role: editingUser.role,
        password: "", // Don't prefill password when editing
      });
    }
  }, [editingUser, form]);
  
  // Mutations
  const createUserMutation = useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success("ইউজার সফলভাবে তৈরি করা হয়েছে");
      setIsFormOpen(false);
      form.reset();
    },
    onError: (error) => {
      toast.error("ইউজার তৈরি করতে সমস্যা হয়েছে");
      console.error(error);
    },
  });
  
  const updateUserMutation = useMutation({
    mutationFn: updateUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success("ইউজার সফলভাবে আপডেট করা হয়েছে");
      setIsFormOpen(false);
      setEditingUser(null);
      form.reset();
    },
    onError: (error) => {
      toast.error("ইউজার আপডেট করতে সমস্যা হয়েছে");
      console.error(error);
    },
  });
  
  const deleteUserMutation = useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success("ইউজার সফলভাবে মুছে ফেলা হয়েছে");
      setDeleteConfirmOpen(false);
      setUserToDelete(null);
    },
    onError: (error) => {
      toast.error("ইউজার মুছতে সমস্যা হয়েছে");
      console.error(error);
    },
  });
  
  const changePasswordMutation = useMutation({
    mutationFn: ({ id, password }: { id: string; password: string }) => 
      updateUser(id, { password }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success("পাসওয়ার্ড সফলভাবে পরিবর্তন করা হয়েছে");
      setPasswordChangeOpen(false);
      setUserToChangePassword(null);
      passwordForm.reset();
    },
    onError: (error) => {
      toast.error("পাসওয়ার্ড পরিবর্তন করতে সমস্যা হয়েছে");
      console.error(error);
    },
  });
  
  // Submit handlers
  const onSubmit = (data: z.infer<typeof userFormSchema>) => {
    if (editingUser) {
      updateUserMutation.mutate({ id: editingUser.id, user: data });
    } else {
      createUserMutation.mutate(data);
    }
  };
  
  const onPasswordChange = (data: z.infer<typeof passwordChangeSchema>) => {
    if (userToChangePassword) {
      changePasswordMutation.mutate({ 
        id: userToChangePassword.id, 
        password: data.password 
      });
    }
  };
  
  // Handle new user button
  const handleNewUser = () => {
    setEditingUser(null);
    form.reset({
      name: "",
      email: "",
      phone: "",
      role: "teacher",
      password: "",
    });
    setIsFormOpen(true);
  };
  
  // Handle edit user
  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setIsFormOpen(true);
  };
  
  // Handle delete user
  const handleDeleteUser = (user: User) => {
    setUserToDelete(user);
    setDeleteConfirmOpen(true);
  };
  
  // Handle change password
  const handleChangePassword = (user: User) => {
    setUserToChangePassword(user);
    passwordForm.reset({ password: "" });
    setPasswordChangeOpen(true);
  };
  
  // Return early if not admin
  if (!isAdmin) {
    return (
      <div className="space-y-6 page-transition">
        <h2 className="text-2xl font-semibold tracking-tight">ইউজার ব্যবস্থাপনা</h2>
        <Card>
          <CardHeader>
            <CardTitle>সীমিত অ্যাকসেস</CardTitle>
            <CardDescription>
              আপনার এই পৃষ্ঠার জন্য অনুমতি নেই
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center text-muted-foreground p-4">
              <AlertTriangle className="mr-2 h-5 w-5" />
              <p>শুধুমাত্র অ্যাডমিন ইউজাররা এই পৃষ্ঠা দেখতে পারেন</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 page-transition">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-2xl font-semibold tracking-tight">ইউজার ব্যবস্থাপনা</h2>
        <Button className="btn-primary" onClick={handleNewUser}>
          <UserPlus className="mr-2 h-4 w-4" /> নতুন ইউজার যোগ করুন
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>সকল ইউজার</CardTitle>
          <CardDescription>
            সিস্টেম ব্যবহারকারীদের তালিকা ও অনুমতি ব্যবস্থাপনা
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-4">লোড হচ্ছে...</div>
          ) : users.length === 0 ? (
            <div className="text-center py-4 text-muted-foreground">
              কোনো ইউজার পাওয়া যায়নি
            </div>
          ) : (
            <div className="overflow-auto">
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
                  {users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.phone}</TableCell>
                      <TableCell>
                        {user.role === 'admin' ? 'অ্যাডমিন' : 'শিক্ষক'}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleChangePassword(user)}
                          >
                            <Key className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditUser(user)}
                          >
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-destructive hover:text-destructive"
                            onClick={() => handleDeleteUser(user)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
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

      {/* Create/Edit User Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {editingUser ? 'ইউজার আপডেট করুন' : 'নতুন ইউজার যোগ করুন'}
            </DialogTitle>
            <DialogDescription>
              {editingUser
                ? 'ইউজারের তথ্য পরিবর্তন করে সেভ বাটনে ক্লিক করুন'
                : 'নতুন ইউজার তৈরি করতে ফর্মটি পূরণ করুন'}
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>নাম</FormLabel>
                    <FormControl>
                      <Input placeholder="ইউজারের নাম" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>ইমেইল</FormLabel>
                    <FormControl>
                      <Input placeholder="ইমেইল ঠিকানা" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>ফোন</FormLabel>
                    <FormControl>
                      <Input placeholder="ফোন নম্বর" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>ইউজার রোল</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="রোল নির্বাচন করুন" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="admin">অ্যাডমিন</SelectItem>
                        <SelectItem value="teacher">শিক্ষক</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {!editingUser && (
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>পাসওয়ার্ড</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="পাসওয়ার্ড দিন"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsFormOpen(false)}
                >
                  বাতিল
                </Button>
                <Button type="submit">
                  {editingUser ? 'আপডেট করুন' : 'যোগ করুন'}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-destructive flex items-center">
              <AlertTriangle className="mr-2 h-5 w-5" />
              ইউজার মুছতে নিশ্চিত করুন
            </DialogTitle>
            <DialogDescription>
              এই ক্রিয়াটি অপরিবর্তনীয়। এটি সম্পন্ন করলে {userToDelete?.name} কে সিস্টেম থেকে স্থায়ীভাবে মুছে ফেলা হবে।
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p>আপনি কি নিশ্চিত যে আপনি এই ইউজারকে মুছতে চান?</p>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setDeleteConfirmOpen(false)}
            >
              বাতিল
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={() => userToDelete && deleteUserMutation.mutate(userToDelete.id)}
            >
              ইউজার মুছুন
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Change Password Dialog */}
      <Dialog open={passwordChangeOpen} onOpenChange={setPasswordChangeOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              <UserCog className="inline-block mr-2 h-5 w-5" />
              পাসওয়ার্ড পরিবর্তন করুন
            </DialogTitle>
            <DialogDescription>
              {userToChangePassword?.name} এর জন্য নতুন পাসওয়ার্ড সেট করুন
            </DialogDescription>
          </DialogHeader>
          <Form {...passwordForm}>
            <form onSubmit={passwordForm.handleSubmit(onPasswordChange)} className="space-y-4">
              <FormField
                control={passwordForm.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>নতুন পাসওয়ার্ড</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="নতুন পাসওয়ার্ড দিন"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setPasswordChangeOpen(false)}
                >
                  বাতিল
                </Button>
                <Button type="submit">
                  পাসওয়ার্ড পরিবর্তন করুন
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Users;
