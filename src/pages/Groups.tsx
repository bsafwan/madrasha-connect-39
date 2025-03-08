
import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase, formatCurrency, toBengaliNumber } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
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
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UserCircle, CalendarDays, PlusCircle, BookOpen, Eye } from "lucide-react";
import type { Student, StudentGroup, Exam, ExamResult, QuranProgress } from "@/types";

const Groups = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<StudentGroup>("hifz");
  const [students, setStudents] = useState<Student[]>([]);
  const [showAddExamDialog, setShowAddExamDialog] = useState(false);
  const [showAddProgressDialog, setShowAddProgressDialog] = useState(false);
  const [showViewExamDialog, setShowViewExamDialog] = useState(false);
  const [exams, setExams] = useState<Exam[]>([]);
  const [selectedExam, setSelectedExam] = useState<Exam | null>(null);
  const [examResults, setExamResults] = useState<ExamResult[]>([]);
  const [quranProgress, setQuranProgress] = useState<QuranProgress[]>([]);
  
  // Form states
  const [newExam, setNewExam] = useState({
    title: "",
    date: new Date().toISOString().split('T')[0],
  });
  
  const [newProgress, setNewProgress] = useState({
    studentId: "",
    type: "parah",
    progress: "",
  });

  const fetchStudentsInGroup = async (group: StudentGroup) => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('students')
        .select('*')
        .eq('group_name', group)
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

  const fetchExams = async (group: StudentGroup) => {
    try {
      const { data, error } = await supabase
        .from('exams')
        .select('*')
        .eq('group_name', group)
        .order('date', { ascending: false });
      
      if (error) throw error;
      
      const formattedExams: Exam[] = data.map(exam => ({
        id: exam.id,
        title: exam.title,
        date: exam.date,
        group: exam.group_name as StudentGroup
      }));
      
      setExams(formattedExams);
    } catch (error: any) {
      console.error("Error fetching exams:", error);
      toast({
        variant: "destructive",
        title: "ত্রুটি ঘটেছে",
        description: error.message,
      });
    }
  };

  const fetchQuranProgress = async (group: StudentGroup) => {
    try {
      const { data, error } = await supabase
        .from('quran_progress')
        .select(`
          *,
          students!quran_progress_student_id_fkey(name),
          verified_by:users!quran_progress_verified_by_fkey(name)
        `)
        .order('date', { ascending: false })
        .limit(30);
      
      if (error) throw error;
      
      // Filter in JS since we need to join with students first
      const filteredData = data.filter(item => 
        item.students?.group_name === group
      );
      
      const formattedProgress: QuranProgress[] = filteredData.map(item => ({
        id: item.id,
        studentId: item.student_id,
        studentName: item.students?.name || 'অজানা ছাত্র',
        date: item.date,
        type: item.type,
        progress: item.progress,
        verifiedBy: item.verified_by?.name
      }));
      
      setQuranProgress(formattedProgress);
    } catch (error: any) {
      console.error("Error fetching Quran progress:", error);
      toast({
        variant: "destructive",
        title: "ত্রুটি ঘটেছে",
        description: error.message,
      });
    }
  };

  const fetchExamResults = async (examId: string) => {
    try {
      const { data, error } = await supabase
        .from('exam_results')
        .select(`
          *,
          students(name)
        `)
        .eq('exam_id', examId);
      
      if (error) throw error;
      
      const formattedResults: ExamResult[] = data.map(result => ({
        id: result.id,
        examId: result.exam_id,
        studentId: result.student_id,
        studentName: result.students?.name || 'অজানা ছাত্র',
        scores: result.scores as { [key: string]: number },
        total: result.total,
        remarks: result.remarks || ''
      }));
      
      setExamResults(formattedResults);
    } catch (error: any) {
      console.error("Error fetching exam results:", error);
      toast({
        variant: "destructive",
        title: "ত্রুটি ঘটেছে",
        description: error.message,
      });
    }
  };

  useEffect(() => {
    if (activeTab) {
      fetchStudentsInGroup(activeTab);
      fetchExams(activeTab);
      fetchQuranProgress(activeTab);
    }
  }, [activeTab]);

  const getGroupNameBangla = (group: StudentGroup) => {
    switch (group) {
      case 'hifz': return 'হিফজ';
      case 'qaida': return 'কায়দা';
      case 'sifara': return 'সিফারা';
      case 'najera': return 'নাযেরা';
      default: return group;
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('bn-BD', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleExamInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewExam(prev => ({ ...prev, [name]: value }));
  };

  const handleProgressInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewProgress(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (value: string, field: string) => {
    setNewProgress(prev => ({ ...prev, [field]: value }));
  };

  const resetExamForm = () => {
    setNewExam({
      title: "",
      date: new Date().toISOString().split('T')[0],
    });
  };

  const resetProgressForm = () => {
    setNewProgress({
      studentId: "",
      type: "parah",
      progress: "",
    });
  };

  const handleAddExam = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Add new exam
      const { data, error } = await supabase
        .from('exams')
        .insert({
          title: newExam.title,
          date: newExam.date,
          group_name: activeTab
        })
        .select();
      
      if (error) throw error;
      
      toast({
        title: "পরীক্ষা যোগ সফল",
        description: `${getGroupNameBangla(activeTab)} গ্রুপের জন্য পরীক্ষা সফলভাবে যোগ করা হয়েছে।`,
      });
      
      // Refresh exams
      await fetchExams(activeTab);
      setShowAddExamDialog(false);
      resetExamForm();
    } catch (error: any) {
      console.error("Error adding exam:", error);
      toast({
        variant: "destructive",
        title: "ত্রুটি ঘটেছে",
        description: error.message,
      });
    }
  };

  const handleAddProgress = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newProgress.studentId) {
      toast({
        variant: "destructive",
        title: "ছাত্র নির্বাচন করুন",
        description: "অগ্রগতি যোগ করার জন্য একজন ছাত্র নির্বাচন করুন।",
      });
      return;
    }
    
    try {
      // Add new progress
      const { error } = await supabase
        .from('quran_progress')
        .insert({
          student_id: newProgress.studentId,
          type: newProgress.type,
          progress: newProgress.progress,
          verified_by: user?.id
        });
      
      if (error) throw error;
      
      toast({
        title: "অগ্রগতি যোগ সফল",
        description: `ছাত্রের কোরআন অগ্রগতি সফলভাবে যোগ করা হয়েছে।`,
      });
      
      // Refresh progress
      await fetchQuranProgress(activeTab);
      setShowAddProgressDialog(false);
      resetProgressForm();
    } catch (error: any) {
      console.error("Error adding progress:", error);
      toast({
        variant: "destructive",
        title: "ত্রুটি ঘটেছে",
        description: error.message,
      });
    }
  };

  const handleViewExam = (exam: Exam) => {
    setSelectedExam(exam);
    fetchExamResults(exam.id);
    setShowViewExamDialog(true);
  };

  return (
    <div className="space-y-6 page-transition">
      {/* Page header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-2xl font-semibold tracking-tight">গ্রুপ ব্যবস্থাপনা</h2>
        <div className="flex items-center space-x-2">
          <Button onClick={() => setShowAddExamDialog(true)}>
            <CalendarDays className="mr-2 h-4 w-4" /> নতুন পরীক্ষা
          </Button>
          <Button onClick={() => setShowAddProgressDialog(true)}>
            <BookOpen className="mr-2 h-4 w-4" /> কোরআন অগ্রগতি
          </Button>
        </div>
      </div>

      {/* Tabs for groups */}
      <Tabs
        defaultValue="hifz"
        value={activeTab}
        onValueChange={(value) => setActiveTab(value as StudentGroup)}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-4 md:w-auto md:inline-flex">
          <TabsTrigger value="hifz">হিফজ</TabsTrigger>
          <TabsTrigger value="qaida">কায়দা</TabsTrigger>
          <TabsTrigger value="sifara">সিফারা</TabsTrigger>
          <TabsTrigger value="najera">নাযেরা</TabsTrigger>
        </TabsList>
        
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          {/* Students list */}
          <Card className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">ছাত্র তালিকা</h3>
              <span className="text-sm bg-primary/10 text-primary px-2 py-1 rounded-full">
                {toBengaliNumber(students.length)} জন
              </span>
            </div>
            
            <div className="relative w-full overflow-auto max-h-[400px]">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>নাম</TableHead>
                    <TableHead className="hidden md:table-cell">পিতার নাম</TableHead>
                    <TableHead>হোয়াটসঅ্যাপ</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={3} className="text-center py-10">
                        লোড হচ্ছে...
                      </TableCell>
                    </TableRow>
                  ) : students.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={3} className="text-center py-10">
                        কোন ছাত্র পাওয়া যায়নি
                      </TableCell>
                    </TableRow>
                  ) : (
                    students.map((student) => (
                      <TableRow key={student.id}>
                        <TableCell>{student.name}</TableCell>
                        <TableCell className="hidden md:table-cell">{student.fatherName}</TableCell>
                        <TableCell>{student.whatsappNumber}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </Card>

          {/* Exams list */}
          <Card className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">পরীক্ষা সমূহ</h3>
              <Button variant="ghost" size="sm" onClick={() => setShowAddExamDialog(true)}>
                <PlusCircle className="h-4 w-4 mr-1" /> নতুন
              </Button>
            </div>
            
            <div className="relative w-full overflow-auto max-h-[400px]">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>পরীক্ষার নাম</TableHead>
                    <TableHead>তারিখ</TableHead>
                    <TableHead className="text-right">অ্যাকশন</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {exams.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={3} className="text-center py-10">
                        কোন পরীক্ষা পাওয়া যায়নি
                      </TableCell>
                    </TableRow>
                  ) : (
                    exams.map((exam) => (
                      <TableRow key={exam.id}>
                        <TableCell>{exam.title}</TableCell>
                        <TableCell>{formatDate(exam.date)}</TableCell>
                        <TableCell className="text-right">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleViewExam(exam)}
                          >
                            <Eye className="h-4 w-4 mr-1" /> দেখুন
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </Card>
          
          {/* Quran Progress */}
          <Card className="p-6 md:col-span-2">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">কোরআন অগ্রগতি</h3>
              <Button variant="ghost" size="sm" onClick={() => setShowAddProgressDialog(true)}>
                <PlusCircle className="h-4 w-4 mr-1" /> নতুন অগ্রগতি
              </Button>
            </div>
            
            <div className="relative w-full overflow-auto max-h-[400px]">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ছাত্রের নাম</TableHead>
                    <TableHead>তারিখ</TableHead>
                    <TableHead>ধরন</TableHead>
                    <TableHead>অগ্রগতি</TableHead>
                    <TableHead className="hidden md:table-cell">যাচাইকারী</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {quranProgress.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-10">
                        কোন অগ্রগতি রেকর্ড পাওয়া যায়নি
                      </TableCell>
                    </TableRow>
                  ) : (
                    quranProgress.map((progress) => (
                      <TableRow key={progress.id}>
                        <TableCell>{progress.studentName}</TableCell>
                        <TableCell>{formatDate(progress.date)}</TableCell>
                        <TableCell>{progress.type === 'parah' ? 'পারা' : 'সূরা'}</TableCell>
                        <TableCell>{progress.progress}</TableCell>
                        <TableCell className="hidden md:table-cell">{progress.verifiedBy}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </Card>
        </div>
      </Tabs>

      {/* Add Exam Dialog */}
      <Dialog open={showAddExamDialog} onOpenChange={setShowAddExamDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>নতুন পরীক্ষা যোগ করুন</DialogTitle>
            <DialogDescription>
              {getGroupNameBangla(activeTab)} গ্রুপের জন্য একটি নতুন পরীক্ষা যোগ করুন।
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddExam}>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="title">পরীক্ষার নাম</Label>
                <Input
                  id="title"
                  name="title"
                  placeholder="পরীক্ষার নাম লিখুন"
                  value={newExam.title}
                  onChange={handleExamInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="date">তারিখ</Label>
                <Input
                  id="date"
                  name="date"
                  type="date"
                  value={newExam.date}
                  onChange={handleExamInputChange}
                  required
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setShowAddExamDialog(false)}>
                বাতিল করুন
              </Button>
              <Button type="submit">
                পরীক্ষা যোগ করুন
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Add Progress Dialog */}
      <Dialog open={showAddProgressDialog} onOpenChange={setShowAddProgressDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>কোরআন অগ্রগতি যোগ করুন</DialogTitle>
            <DialogDescription>
              ছাত্রের কোরআন অগ্রগতি রেকর্ড করুন।
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddProgress}>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="studentId">ছাত্র নির্বাচন করুন</Label>
                <Select
                  value={newProgress.studentId}
                  onValueChange={(value) => handleSelectChange(value, 'studentId')}
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
              <div className="space-y-2">
                <Label htmlFor="type">অগ্রগতির ধরন</Label>
                <Select
                  value={newProgress.type}
                  onValueChange={(value) => handleSelectChange(value, 'type')}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="ধরন নির্বাচন করুন" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="parah">পারা</SelectItem>
                    <SelectItem value="surah">সূরা</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="progress">অগ্রগতি বিবরণ</Label>
                <Input
                  id="progress"
                  name="progress"
                  placeholder={newProgress.type === 'parah' ? 'উদাহরণ: পারা ৫ শেষ' : 'উদাহরণ: সূরা বাকারা শেষ'}
                  value={newProgress.progress}
                  onChange={handleProgressInputChange}
                  required
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setShowAddProgressDialog(false)}>
                বাতিল করুন
              </Button>
              <Button type="submit">
                অগ্রগতি যোগ করুন
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* View Exam Results Dialog */}
      <Dialog open={showViewExamDialog} onOpenChange={setShowViewExamDialog}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>{selectedExam?.title}</DialogTitle>
            <DialogDescription>
              তারিখ: {selectedExam ? formatDate(selectedExam.date) : ''} | গ্রুপ: {selectedExam ? getGroupNameBangla(selectedExam.group) : ''}
            </DialogDescription>
          </DialogHeader>
          
          <div className="relative w-full overflow-auto max-h-[400px]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ছাত্রের নাম</TableHead>
                  <TableHead>প্রাপ্ত নম্বর</TableHead>
                  <TableHead className="hidden md:table-cell">মন্তব্য</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {examResults.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center py-10">
                      এই পরীক্ষার কোন ফলাফল এখনো যোগ করা হয়নি
                    </TableCell>
                  </TableRow>
                ) : (
                  examResults.map((result) => (
                    <TableRow key={result.id}>
                      <TableCell>{result.studentName}</TableCell>
                      <TableCell>{toBengaliNumber(result.total)}</TableCell>
                      <TableCell className="hidden md:table-cell">{result.remarks}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
          
          <DialogFooter>
            <Button onClick={() => setShowViewExamDialog(false)}>
              ঠিক আছে
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Groups;
