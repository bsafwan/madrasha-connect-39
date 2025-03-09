
import React, { useState } from "react";
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
  fetchNotifications, 
  createNotification, 
  updateNotification, 
  deleteNotification,
  fetchStudents
} from "@/services/dataService";
import { formatDateBengali } from "@/integrations/supabase/client";
import { WhatsAppNotification, Student } from "@/types";
import { 
  Plus, 
  Edit, 
  Trash2, 
  Search, 
  Bell,
  Send,
  FileText,
  Image,
  AlertCircle,
  CheckCircle,
  XCircle,
  ExternalLink,
  RefreshCcw
} from "lucide-react";

const Notifications = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [currentNotification, setCurrentNotification] = useState<WhatsAppNotification | null>(null);
  const [formData, setFormData] = useState<Partial<WhatsAppNotification>>({
    recipient: "",
    content: "",
    media_url: "",
    instance_id: "default",
    status: "pending"
  });
  const [recipientType, setRecipientType] = useState<"individual" | "group">("individual");
  const [selectedGroup, setSelectedGroup] = useState<string>("");

  // Fetch notifications
  const { data: notifications = [], isLoading: isLoadingNotifications } = useQuery({
    queryKey: ["notifications"],
    queryFn: fetchNotifications,
  });

  // Fetch all students for recipient selection
  const { data: students = [], isLoading: isLoadingStudents } = useQuery({
    queryKey: ["students"],
    queryFn: fetchStudents,
  });

  // Add notification mutation
  const addNotificationMutation = useMutation({
    mutationFn: createNotification,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      setIsAddDialogOpen(false);
      resetForm();
      toast.success("নোটিফিকেশন সফলভাবে তৈরি করা হয়েছে");
    },
  });

  // Update notification (resend) mutation
  const updateNotificationMutation = useMutation({
    mutationFn: (notification: Partial<WhatsAppNotification>) => 
      updateNotification(notification.id as string, { status: "pending" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      toast.success("নোটিফিকেশন আবার পাঠানো হচ্ছে");
    },
  });

  // Delete notification mutation
  const deleteNotificationMutation = useMutation({
    mutationFn: (id: string) => deleteNotification(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      setIsDeleteDialogOpen(false);
      toast.success("নোটিফিকেশন সফলভাবে মুছে ফেলা হয়েছে");
    },
  });

  // Reset form
  const resetForm = () => {
    setFormData({
      recipient: "",
      content: "",
      media_url: "",
      instance_id: "default",
      status: "pending"
    });
    setCurrentNotification(null);
    setRecipientType("individual");
    setSelectedGroup("");
  };

  // Handle view notification details
  const handleView = (notification: WhatsAppNotification) => {
    setCurrentNotification(notification);
    setIsViewDialogOpen(true);
  };

  // Handle resend notification
  const handleResend = (notification: WhatsAppNotification) => {
    if (notification.status === "failed") {
      updateNotificationMutation.mutate({ id: notification.id });
    }
  };

  // Handle delete notification
  const handleDelete = (notification: WhatsAppNotification) => {
    setCurrentNotification(notification);
    setIsDeleteDialogOpen(true);
  };

  // Handle form input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle recipient type change
  const handleRecipientTypeChange = (value: string) => {
    setRecipientType(value as "individual" | "group");
    setFormData({ ...formData, recipient: "" });
  };

  // Handle group selection change
  const handleGroupChange = (value: string) => {
    setSelectedGroup(value);
    
    // Prepare comma-separated list of student WhatsApp numbers in this group
    const studentsInGroup = students
      .filter(student => student.group === value && student.active)
      .map(student => student.whatsappNumber);
    
    setFormData({ ...formData, recipient: studentsInGroup.join(",") });
  };

  // Handle individual recipient selection
  const handleRecipientChange = (value: string) => {
    setFormData({ ...formData, recipient: value });
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.recipient) {
      toast.error("প্রাপক নির্বাচন করুন");
      return;
    }
    
    if (!formData.content) {
      toast.error("মেসেজ লিখুন");
      return;
    }
    
    addNotificationMutation.mutate(formData);
  };

  // Filter notifications based on search term and status
  const filteredNotifications = notifications.filter((notification) => {
    const matchesSearchTerm =
      notification.recipient.includes(searchTerm) ||
      notification.content.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter ? notification.status === statusFilter : true;
    
    return matchesSearchTerm && matchesStatus;
  });

  // Get notification status display
  const getStatusDisplay = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <div className="flex items-center text-amber-600">
            <AlertCircle className="h-4 w-4 mr-1" />
            <span>অপেক্ষমান</span>
          </div>
        );
      case "sent":
        return (
          <div className="flex items-center text-green-600">
            <CheckCircle className="h-4 w-4 mr-1" />
            <span>পাঠানো হয়েছে</span>
          </div>
        );
      case "failed":
        return (
          <div className="flex items-center text-red-600">
            <XCircle className="h-4 w-4 mr-1" />
            <span>ব্যর্থ হয়েছে</span>
          </div>
        );
      default:
        return status;
    }
  };

  // Get unique student groups for the dropdown
  const uniqueGroups = [...new Set(students.map(student => student.group))];

  return (
    <div className="space-y-6 page-transition">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-2xl font-semibold tracking-tight">হোয়াটসঅ্যাপ নোটিফিকেশন</h2>
        <Button onClick={() => setIsAddDialogOpen(true)} className="btn-primary">
          <Plus className="mr-2 h-4 w-4" /> নতুন নোটিফিকেশন পাঠান
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>সকল নোটিফিকেশন</CardTitle>
          <CardDescription>
            হোয়াটসঅ্যাপের মাধ্যমে পাঠানো নোটিফিকেশন এবং মেসেজসমূহ
          </CardDescription>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mt-4">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="মেসেজ বা নম্বর দিয়ে খুঁজুন"
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="w-full sm:w-48">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="স্ট্যাটাস" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">সকল স্ট্যাটাস</SelectItem>
                  <SelectItem value="pending">অপেক্ষমান</SelectItem>
                  <SelectItem value="sent">পাঠানো হয়েছে</SelectItem>
                  <SelectItem value="failed">ব্যর্থ হয়েছে</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoadingNotifications ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : filteredNotifications.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              কোন নোটিফিকেশন পাওয়া যায়নি
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>প্রাপক</TableHead>
                    <TableHead>মেসেজ</TableHead>
                    <TableHead>পাঠানোর সময়</TableHead>
                    <TableHead>স্ট্যাটাস</TableHead>
                    <TableHead className="text-right">অ্যাকশন</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredNotifications.map((notification) => (
                    <TableRow key={notification.id}>
                      <TableCell>
                        {notification.recipient.includes(",") 
                          ? `${notification.recipient.split(",").length} জন প্রাপক` 
                          : notification.recipient}
                      </TableCell>
                      <TableCell className="max-w-[300px] truncate">
                        {notification.content}
                      </TableCell>
                      <TableCell>
                        {notification.sentAt 
                          ? formatDateBengali(notification.sentAt)
                          : "পাঠানো হয়নি"}
                      </TableCell>
                      <TableCell>{getStatusDisplay(notification.status)}</TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleView(notification)}
                        >
                          <FileText className="h-4 w-4" />
                        </Button>
                        {notification.status === "failed" && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleResend(notification)}
                          >
                            <RefreshCcw className="h-4 w-4" />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(notification)}
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

      {/* Add Notification Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>নতুন হোয়াটসঅ্যাপ মেসেজ</DialogTitle>
            <DialogDescription>
              হোয়াটসঅ্যাপের মাধ্যমে ছাত্রদের বা অভিভাবকদের মেসেজ পাঠান।
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="recipientType">প্রাপক টাইপ</Label>
                <Select value={recipientType} onValueChange={handleRecipientTypeChange}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="individual">একজন</SelectItem>
                    <SelectItem value="group">গ্রুপ অনুযায়ী</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {recipientType === "individual" ? (
                <div className="space-y-2">
                  <Label htmlFor="recipient">প্রাপক নম্বর</Label>
                  <Select 
                    value={formData.recipient || ""} 
                    onValueChange={handleRecipientChange}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="প্রাপক নির্বাচন করুন" />
                    </SelectTrigger>
                    <SelectContent>
                      {students
                        .filter(student => student.active)
                        .map((student) => (
                          <SelectItem key={student.id} value={student.whatsappNumber}>
                            {student.name} ({student.whatsappNumber})
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
              ) : (
                <div className="space-y-2">
                  <Label htmlFor="group">গ্রুপ</Label>
                  <Select value={selectedGroup} onValueChange={handleGroupChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="গ্রুপ নির্বাচন করুন" />
                    </SelectTrigger>
                    <SelectContent>
                      {uniqueGroups.map((group) => (
                        <SelectItem key={group} value={group}>
                          {group === "hifz" ? "হিফজ" : 
                          group === "qaida" ? "কায়দা" : 
                          group === "nazera" ? "নাযেরা" : 
                          group === "sifara" ? "সিফারা" : group}
                          {" "}
                          ({students.filter(s => s.group === group && s.active).length} জন)
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="content">মেসেজ</Label>
                <Textarea
                  id="content"
                  name="content"
                  value={formData.content}
                  onChange={handleChange}
                  placeholder="মেসেজের বিষয়বস্তু লিখুন"
                  className="min-h-[120px]"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="media_url">মিডিয়া লিংক (ঐচ্ছিক)</Label>
                <Input
                  id="media_url"
                  name="media_url"
                  value={formData.media_url || ""}
                  onChange={handleChange}
                  placeholder="ছবি বা ফাইলের URL (যদি থাকে)"
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
              <Button type="submit" disabled={addNotificationMutation.isPending}>
                {addNotificationMutation.isPending ? "পাঠানো হচ্ছে..." : "পাঠান"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* View Notification Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>নোটিফিকেশন বিস্তারিত</DialogTitle>
            <DialogDescription>
              হোয়াটসঅ্যাপ মেসেজের বিস্তারিত তথ্য
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-2">
              <div className="font-medium">প্রাপক:</div>
              <div className="col-span-3">
                {currentNotification?.recipient.includes(",") 
                  ? `${currentNotification?.recipient.split(",").length} জন প্রাপক` 
                  : currentNotification?.recipient}
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-2">
              <div className="font-medium">স্ট্যাটাস:</div>
              <div className="col-span-3">
                {currentNotification?.status === "pending" && "অপেক্ষমান"}
                {currentNotification?.status === "sent" && "পাঠানো হয়েছে"}
                {currentNotification?.status === "failed" && "ব্যর্থ হয়েছে"}
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-2">
              <div className="font-medium">সময়:</div>
              <div className="col-span-3">
                {currentNotification?.sentAt 
                  ? formatDateBengali(currentNotification.sentAt)
                  : "পাঠানো হয়নি"}
              </div>
            </div>
            <div className="grid grid-cols-4 items-start gap-2">
              <div className="font-medium">মেসেজ:</div>
              <div className="col-span-3 whitespace-pre-wrap">
                {currentNotification?.content}
              </div>
            </div>
            {currentNotification?.media_url && (
              <div className="grid grid-cols-4 items-start gap-2">
                <div className="font-medium">মিডিয়া:</div>
                <div className="col-span-3">
                  <a 
                    href={currentNotification.media_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-primary flex items-center"
                  >
                    <Image className="h-4 w-4 mr-1" />
                    মিডিয়া দেখুন <ExternalLink className="h-3 w-3 ml-1" />
                  </a>
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button onClick={() => setIsViewDialogOpen(false)}>
              বন্ধ করুন
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>নোটিফিকেশন মুছে ফেলার নিশ্চিতকরণ</DialogTitle>
            <DialogDescription>
              আপনি কি নিশ্চিত যে আপনি এই নোটিফিকেশনটি মুছে ফেলতে চান?
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
              onClick={() => currentNotification?.id && deleteNotificationMutation.mutate(currentNotification.id)}
              disabled={deleteNotificationMutation.isPending}
            >
              {deleteNotificationMutation.isPending ? "মুছে ফেলা হচ্ছে..." : "মুছে ফেলুন"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Notifications;
