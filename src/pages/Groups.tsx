
import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { formatCurrency, toBengaliNumber, formatDateBengali } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { Student, StudentGroup, QuranProgress, Exam, ExamResult } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";
import { PlusCircle, Pencil, Trash2 } from "lucide-react";
import DataCard from "@/components/DataCard";

const Groups = () => {
  const { user } = useAuth();
  const [students, setStudents] = useState<Student[]>([]);
  const [quranProgress, setQuranProgress] = useState<QuranProgress[]>([]);
  const [exams, setExams] = useState<Exam[]>([]);
  const [examResults, setExamResults] = useState<ExamResult[]>([]);
  const [users, setUsers] = useState<{ id: string; name: string }[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedGroup, setSelectedGroup] = useState<StudentGroup>("hifz");

  const [statsData, setStatsData] = useState({
    hifz: 0,
    qaida: 0,
    sifara: 0,
    najera: 0,
  });

  const [isAddingExam, setIsAddingExam] = useState(false);
  const [isAddingProgress, setIsAddingProgress] = useState(false);
  const [selectedExam, setSelectedExam] = useState<string>("");

  const [newExam, setNewExam] = useState({
    title: "",
    group: "hifz" as StudentGroup,
  });

  const [newProgress, setNewProgress] = useState({
    studentId: "",
    type: "parah" as "parah" | "surah", // Ensure this is correctly typed
    progress: "",
  });

  const [examResultForm, setExamResultForm] = useState({
    studentId: "",
    scores: { reading: 0, memorization: 0, tajweed: 0 },
    remarks: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);

        // Fetch users for verification names
        const { data: usersData, error: usersError } = await supabase
          .from("users")
          .select("id, name");

        if (usersError) throw usersError;
        setUsers(usersData || []);

        // Fetch students
        const { data: studentsData, error: studentsError } = await supabase
          .from("students")
          .select("*");

        if (studentsError) throw studentsError;

        // Map database fields to our interface
        const mappedStudents: Student[] = studentsData?.map((student) => ({
          id: student.id,
          name: student.name,
          fatherName: student.father_name,
          motherName: student.mother_name,
          parentPhone1: student.parent_phone1 || "",
          parentPhone2: student.parent_phone2 || "",
          whatsappNumber: student.whatsapp_number,
          address: student.address,
          group: student.group_name as StudentGroup,
          monthlyFee: student.monthly_fee,
          registrationDate: student.registration_date,
          active: student.active,
          resigned: student.resigned || false,
          assignedTeacherId: student.assigned_teacher_id || "",
          updatedAt: student.updated_at,
          guardianPhone: student.guardian_phone || "",
          emergencyContact: student.emergency_contact || "",
          birthDate: student.birth_date || "",
          enrollmentNumber: student.enrollment_number || "",
          previousEducation: student.previous_education || "",
          medicalInfo: student.medical_info || "",
          resignDate: student.resign_date || "",
        })) || [];

        setStudents(mappedStudents);

        // Calculate stats
        const stats = {
          hifz: studentsData?.filter((s) => s.group_name === "hifz").length || 0,
          qaida: studentsData?.filter((s) => s.group_name === "qaida").length || 0,
          sifara: studentsData?.filter((s) => s.group_name === "sifara").length || 0,
          najera: studentsData?.filter((s) => s.group_name === "najera").length || 0,
        };
        setStatsData(stats);

        // Fetch Quran progress
        const { data: progressData, error: progressError } = await supabase
          .from("quran_progress")
          .select("*");

        if (progressError) throw progressError;

        const mappedProgress: QuranProgress[] = progressData?.map((progress) => {
          const student = mappedStudents?.find((s) => s.id === progress.student_id);
          return {
            id: progress.id,
            studentId: progress.student_id,
            studentName: student?.name,
            date: progress.date,
            type: progress.type as "parah" | "surah",
            progress: progress.progress,
            verifiedBy: progress.verified_by,
          };
        }) || [];

        setQuranProgress(mappedProgress);

        // Fetch exams
        const { data: examsData, error: examsError } = await supabase
          .from("exams")
          .select("*")
          .order("date", { ascending: false });

        if (examsError) throw examsError;

        const mappedExams: Exam[] = examsData?.map((exam) => ({
          id: exam.id,
          title: exam.title,
          date: exam.date,
          group: exam.group_name as StudentGroup,
        })) || [];

        setExams(mappedExams);

        // Fetch exam results if there are exams
        if (mappedExams.length > 0) {
          const { data: resultsData, error: resultsError } = await supabase
            .from("exam_results")
            .select("*");

          if (resultsError) throw resultsError;

          const mappedResults: ExamResult[] = resultsData?.map((result) => {
            const student = mappedStudents?.find((s) => s.id === result.student_id);
            return {
              id: result.id,
              examId: result.exam_id,
              studentId: result.student_id,
              studentName: student?.name,
              scores: result.scores as { [key: string]: number },
              total: result.total,
              remarks: result.remarks || "",
            };
          }) || [];

          setExamResults(mappedResults);

          // Set initial selected exam if there are exams
          if (mappedExams.length > 0 && !selectedExam) {
            setSelectedExam(mappedExams[0].id);
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        toast({
          variant: "destructive",
          title: "ত্রুটি!",
          description: "ডাটা লোড করতে সমস্যা হয়েছে।",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredStudents = students.filter((student) => student.group === selectedGroup);

  const handleAddExam = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      const examData = {
        title: newExam.title,
        group_name: newExam.group,
        date: new Date().toISOString(),
      };

      const { data, error } = await supabase.from("exams").insert(examData).select();

      if (error) throw error;

      if (data && data[0]) {
        const addedExam: Exam = {
          id: data[0].id,
          title: data[0].title,
          date: data[0].date,
          group: data[0].group_name as StudentGroup,
        };

        setExams([addedExam, ...exams]);
        setSelectedExam(addedExam.id);
        setNewExam({ title: "", group: "hifz" });
        setIsAddingExam(false);

        toast({
          title: "পরীক্ষা যোগ করা হয়েছে",
          description: "নতুন পরীক্ষা সফলভাবে যোগ করা হয়েছে।",
        });
      }
    } catch (error) {
      console.error("Error adding exam:", error);
      toast({
        variant: "destructive",
        title: "ত্রুটি!",
        description: "পরীক্ষা যোগ করতে সমস্যা হয়েছে।",
      });
    }
  };

  const handleAddProgress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      const progressData = {
        student_id: newProgress.studentId,
        type: newProgress.type,
        progress: newProgress.progress,
        date: new Date().toISOString(),
        verified_by: user.id,
      };

      const { data, error } = await supabase.from("quran_progress").insert(progressData).select();

      if (error) throw error;

      if (data && data[0]) {
        const student = students.find((s) => s.id === data[0].student_id);
        const addedProgress: QuranProgress = {
          id: data[0].id,
          studentId: data[0].student_id,
          studentName: student?.name,
          date: data[0].date,
          type: data[0].type as "parah" | "surah",
          progress: data[0].progress,
          verifiedBy: data[0].verified_by,
        };

        setQuranProgress([addedProgress, ...quranProgress]);
        setNewProgress({ studentId: "", type: "parah", progress: "" });
        setIsAddingProgress(false);

        toast({
          title: "প্রগতি যোগ করা হয়েছে",
          description: "নতুন কুরআন প্রগতি সফলভাবে যোগ করা হয়েছে।",
        });
      }
    } catch (error) {
      console.error("Error adding progress:", error);
      toast({
        variant: "destructive",
        title: "ত্রুটি!",
        description: "প্রগতি যোগ করতে সমস্যা হয়েছে।",
      });
    }
  };

  const handleAddExamResult = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedExam) return;

    try {
      const scores = examResultForm.scores;
      const total = Object.values(scores).reduce((sum, score) => sum + score, 0);

      const resultData = {
        exam_id: selectedExam,
        student_id: examResultForm.studentId,
        scores: scores,
        total: total,
        remarks: examResultForm.remarks,
      };

      const { data, error } = await supabase.from("exam_results").insert(resultData).select();

      if (error) throw error;

      if (data && data[0]) {
        const student = students.find((s) => s.id === data[0].student_id);
        const addedResult: ExamResult = {
          id: data[0].id,
          examId: data[0].exam_id,
          studentId: data[0].student_id,
          studentName: student?.name,
          scores: data[0].scores as { [key: string]: number },
          total: data[0].total,
          remarks: data[0].remarks || "",
        };

        setExamResults([...examResults, addedResult]);
        setExamResultForm({
          studentId: "",
          scores: { reading: 0, memorization: 0, tajweed: 0 },
          remarks: "",
        });

        toast({
          title: "ফলাফল যোগ করা হয়েছে",
          description: "পরীক্ষার ফলাফল সফলভাবে যোগ করা হয়েছে।",
        });
      }
    } catch (error) {
      console.error("Error adding exam result:", error);
      toast({
        variant: "destructive",
        title: "ত্রুটি!",
        description: "ফলাফল যোগ করতে সমস্যা হয়েছে।",
      });
    }
  };

  const handleDeleteExam = async (id: string) => {
    try {
      // First delete all related exam results
      const { error: resultsError } = await supabase
        .from("exam_results")
        .delete()
        .eq("exam_id", id);

      if (resultsError) throw resultsError;

      // Then delete the exam
      const { error } = await supabase.from("exams").delete().eq("id", id);

      if (error) throw error;

      const updatedExams = exams.filter((exam) => exam.id !== id);
      setExams(updatedExams);
      
      // Update selected exam if the deleted one was selected
      if (selectedExam === id && updatedExams.length > 0) {
        setSelectedExam(updatedExams[0].id);
      } else if (updatedExams.length === 0) {
        setSelectedExam("");
      }

      // Remove related exam results from state
      setExamResults(examResults.filter((result) => result.examId !== id));

      toast({
        title: "পরীক্ষা ডিলিট করা হয়েছে",
        description: "পরীক্ষা এবং সংশ্লিষ্ট ফলাফল ডিলিট করা হয়েছে।",
      });
    } catch (error) {
      console.error("Error deleting exam:", error);
      toast({
        variant: "destructive",
        title: "ত্রুটি!",
        description: "পরীক্ষা ডিলিট করতে সমস্যা হয়েছে।",
      });
    }
  };

  const handleDeleteProgress = async (id: string) => {
    try {
      const { error } = await supabase.from("quran_progress").delete().eq("id", id);

      if (error) throw error;

      setQuranProgress(quranProgress.filter((progress) => progress.id !== id));

      toast({
        title: "প্রগতি ডিলিট করা হয়েছে",
        description: "কুরআন প্রগতি ডিলিট করা হয়েছে।",
      });
    } catch (error) {
      console.error("Error deleting progress:", error);
      toast({
        variant: "destructive",
        title: "ত্রুটি!",
        description: "প্রগতি ডিলিট করতে সমস্যা হয়েছে।",
      });
    }
  };

  const handleDeleteExamResult = async (id: string) => {
    try {
      const { error } = await supabase.from("exam_results").delete().eq("id", id);

      if (error) throw error;

      setExamResults(examResults.filter((result) => result.id !== id));

      toast({
        title: "ফলাফল ডিলিট করা হয়েছে",
        description: "পরীক্ষার ফলাফল ডিলিট করা হয়েছে।",
      });
    } catch (error) {
      console.error("Error deleting exam result:", error);
      toast({
        variant: "destructive",
        title: "ত্রুটি!",
        description: "ফলাফল ডিলিট করতে সমস্যা হয়েছে।",
      });
    }
  };

  const handleScoreChange = (key: string, value: number) => {
    setExamResultForm((prev) => ({
      ...prev,
      scores: {
        ...prev.scores,
        [key]: value,
      },
    }));
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">গ্রুপ ব্যবস্থাপনা</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <DataCard
          title="হিফজ গ্রুপ"
          value={toBengaliNumber(statsData.hifz)}
          icon="👦"
          className="bg-blue-50"
        />
        <DataCard
          title="কায়দা গ্রুপ"
          value={toBengaliNumber(statsData.qaida)}
          icon="👦"
          className="bg-green-50"
        />
        <DataCard
          title="সিফারা গ্রুপ"
          value={toBengaliNumber(statsData.sifara)}
          icon="👦"
          className="bg-yellow-50"
        />
        <DataCard
          title="নাজেরা গ্রুপ"
          value={toBengaliNumber(statsData.najera)}
          icon="👦"
          className="bg-purple-50"
        />
      </div>

      <TabsList className="mb-6 w-full">
        <TabsTrigger
          value="hifz"
          className={`flex-1 ${selectedGroup === "hifz" ? "bg-blue-100" : ""}`}
          onClick={() => setSelectedGroup("hifz")}
        >
          হিফজ গ্রুপ
        </TabsTrigger>
        <TabsTrigger
          value="qaida"
          className={`flex-1 ${selectedGroup === "qaida" ? "bg-green-100" : ""}`}
          onClick={() => setSelectedGroup("qaida")}
        >
          কায়দা গ্রুপ
        </TabsTrigger>
        <TabsTrigger
          value="sifara"
          className={`flex-1 ${selectedGroup === "sifara" ? "bg-yellow-100" : ""}`}
          onClick={() => setSelectedGroup("sifara")}
        >
          সিফারা গ্রুপ
        </TabsTrigger>
        <TabsTrigger
          value="najera"
          className={`flex-1 ${selectedGroup === "najera" ? "bg-purple-100" : ""}`}
          onClick={() => setSelectedGroup("najera")}
        >
          নাজেরা গ্রুপ
        </TabsTrigger>
      </TabsList>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Students in Group */}
        <Card className="p-4 lg:col-span-1">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">
              {selectedGroup === "hifz"
                ? "হিফজ"
                : selectedGroup === "qaida"
                ? "কায়দা"
                : selectedGroup === "sifara"
                ? "সিফারা"
                : "নাজেরা"}{" "}
              ছাত্রদের তালিকা
            </h2>
          </div>

          {isLoading ? (
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : filteredStudents.length === 0 ? (
            <p className="text-center py-6">এই গ্রুপে কোন ছাত্র নেই</p>
          ) : (
            <div className="space-y-2 max-h-[400px] overflow-y-auto">
              {filteredStudents.map((student) => (
                <div
                  key={student.id}
                  className="p-3 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <p className="font-medium">{student.name}</p>
                  <p className="text-sm text-gray-500">
                    {formatCurrency(student.monthlyFee)} / মাস
                  </p>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Quran Progress */}
        <Card className="p-4 lg:col-span-2">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">কুরআন প্রগতি</h2>
            <Button onClick={() => setIsAddingProgress(true)} className="flex items-center gap-2">
              <PlusCircle className="h-4 w-4" /> নতুন প্রগতি যোগ করুন
            </Button>
          </div>

          <Dialog open={isAddingProgress} onOpenChange={setIsAddingProgress}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>নতুন কুরআন প্রগতি যোগ করুন</DialogTitle>
                <DialogDescription>
                  ছাত্রের কুরআন শিক্ষার প্রগতি রেকর্ড করুন।
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleAddProgress}>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="studentId">ছাত্র</Label>
                    <Select
                      value={newProgress.studentId}
                      onValueChange={(value) =>
                        setNewProgress({ ...newProgress, studentId: value })
                      }
                    >
                      <SelectTrigger id="studentId">
                        <SelectValue placeholder="ছাত্র নির্বাচন করুন" />
                      </SelectTrigger>
                      <SelectContent>
                        {filteredStudents.map((student) => (
                          <SelectItem key={student.id} value={student.id}>
                            {student.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="type">প্রগতির ধরন</Label>
                    <Select
                      value={newProgress.type}
                      onValueChange={(value) =>
                        setNewProgress({
                          ...newProgress,
                          type: value as "parah" | "surah",
                        })
                      }
                    >
                      <SelectTrigger id="type">
                        <SelectValue placeholder="ধরন নির্বাচন করুন" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="parah">পারা</SelectItem>
                        <SelectItem value="surah">সূরা</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="progress">প্রগতির বিবরণ</Label>
                    <Textarea
                      id="progress"
                      value={newProgress.progress}
                      onChange={(e) =>
                        setNewProgress({ ...newProgress, progress: e.target.value })
                      }
                      placeholder="যেমন: পারা ৫ সম্পন্ন করেছে"
                      rows={3}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit">সংরক্ষণ করুন</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>

          {isLoading ? (
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          ) : (
            <div className="max-h-[400px] overflow-y-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ছাত্রের নাম</TableHead>
                    <TableHead>তারিখ</TableHead>
                    <TableHead>ধরন</TableHead>
                    <TableHead>প্রগতি</TableHead>
                    <TableHead className="text-right">কর্ম</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {quranProgress
                    .filter((progress) => {
                      const student = students.find((s) => s.id === progress.studentId);
                      return student?.group === selectedGroup;
                    })
                    .map((progress) => (
                      <TableRow key={progress.id}>
                        <TableCell className="font-medium">{progress.studentName}</TableCell>
                        <TableCell>{formatDateBengali(progress.date)}</TableCell>
                        <TableCell>
                          {progress.type === "parah" ? "পারা" : "সূরা"}
                        </TableCell>
                        <TableCell>{progress.progress}</TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteProgress(progress.id)}
                          >
                            <Trash2 className="h-4 w-4 text-red-600" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}

                  {quranProgress.filter((progress) => {
                    const student = students.find((s) => s.id === progress.studentId);
                    return student?.group === selectedGroup;
                  }).length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-6">
                        এই গ্রুপের জন্য কোন প্রগতি রেকর্ড নেই
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </Card>
      </div>

      {/* Exams Section */}
      <div className="mt-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">পরীক্ষা এবং ফলাফল</h2>
          <Button onClick={() => setIsAddingExam(true)} className="flex items-center gap-2">
            <PlusCircle className="h-4 w-4" /> নতুন পরীক্ষা যোগ করুন
          </Button>
        </div>

        <Dialog open={isAddingExam} onOpenChange={setIsAddingExam}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>নতুন পরীক্ষা যোগ করুন</DialogTitle>
              <DialogDescription>
                গ্রুপের জন্য একটি নতুন পরীক্ষা যোগ করুন।
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAddExam}>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="title">পরীক্ষার শিরোনাম</Label>
                  <Input
                    id="title"
                    value={newExam.title}
                    onChange={(e) => setNewExam({ ...newExam, title: e.target.value })}
                    placeholder="যেমন: মাসিক পরীক্ষা জুন ২০২৩"
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="group">গ্রুপ</Label>
                  <Select
                    value={newExam.group}
                    onValueChange={(value) =>
                      setNewExam({ ...newExam, group: value as StudentGroup })
                    }
                  >
                    <SelectTrigger id="group">
                      <SelectValue placeholder="গ্রুপ নির্বাচন করুন" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hifz">হিফজ</SelectItem>
                      <SelectItem value="qaida">কায়দা</SelectItem>
                      <SelectItem value="sifara">সিফারা</SelectItem>
                      <SelectItem value="najera">নাজেরা</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">সংরক্ষণ করুন</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        <Card className="p-4">
          {isLoading ? (
            <div className="space-y-3">
              <Skeleton className="h-10 w-full mb-4" />
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          ) : exams.length === 0 ? (
            <p className="text-center py-6">কোন পরীক্ষা নেই</p>
          ) : (
            <>
              <div className="flex mb-4 overflow-x-auto pb-2">
                {exams
                  .filter((exam) => exam.group === selectedGroup)
                  .map((exam) => (
                    <button
                      key={exam.id}
                      className={`px-4 py-2 mr-2 whitespace-nowrap rounded-lg text-sm ${
                        selectedExam === exam.id
                          ? "bg-primary text-primary-foreground"
                          : "bg-gray-100"
                      }`}
                      onClick={() => setSelectedExam(exam.id)}
                    >
                      {exam.title}{" "}
                      <span className="text-xs opacity-75">
                        ({formatDateBengali(exam.date)})
                      </span>
                      {user?.role === "admin" && (
                        <button
                          className="ml-2 text-red-500 hover:text-red-700"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteExam(exam.id);
                          }}
                        >
                          <Trash2 className="h-3 w-3 inline" />
                        </button>
                      )}
                    </button>
                  ))}
              </div>

              {selectedExam && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-medium mb-2">ফলাফল যোগ করুন</h3>
                    <form onSubmit={handleAddExamResult} className="space-y-3">
                      <div>
                        <Label htmlFor="examStudentId">ছাত্র</Label>
                        <Select
                          value={examResultForm.studentId}
                          onValueChange={(value) =>
                            setExamResultForm({ ...examResultForm, studentId: value })
                          }
                        >
                          <SelectTrigger id="examStudentId">
                            <SelectValue placeholder="ছাত্র নির্বাচন করুন" />
                          </SelectTrigger>
                          <SelectContent>
                            {filteredStudents.map((student) => (
                              <SelectItem key={student.id} value={student.id}>
                                {student.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="grid grid-cols-3 gap-2">
                        <div>
                          <Label htmlFor="reading">পড়া (স্কোর)</Label>
                          <Input
                            id="reading"
                            type="number"
                            min="0"
                            max="100"
                            value={examResultForm.scores.reading}
                            onChange={(e) =>
                              handleScoreChange("reading", parseInt(e.target.value) || 0)
                            }
                          />
                        </div>
                        <div>
                          <Label htmlFor="memorization">মুখস্থ (স্কোর)</Label>
                          <Input
                            id="memorization"
                            type="number"
                            min="0"
                            max="100"
                            value={examResultForm.scores.memorization}
                            onChange={(e) =>
                              handleScoreChange("memorization", parseInt(e.target.value) || 0)
                            }
                          />
                        </div>
                        <div>
                          <Label htmlFor="tajweed">তাজবীদ (স্কোর)</Label>
                          <Input
                            id="tajweed"
                            type="number"
                            min="0"
                            max="100"
                            value={examResultForm.scores.tajweed}
                            onChange={(e) =>
                              handleScoreChange("tajweed", parseInt(e.target.value) || 0)
                            }
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="remarks">মন্তব্য</Label>
                        <Textarea
                          id="remarks"
                          value={examResultForm.remarks}
                          onChange={(e) =>
                            setExamResultForm({ ...examResultForm, remarks: e.target.value })
                          }
                          rows={2}
                        />
                      </div>

                      <Button type="submit" className="w-full">
                        ফলাফল যোগ করুন
                      </Button>
                    </form>
                  </div>

                  <div>
                    <h3 className="font-medium mb-2">ফলাফল</h3>
                    <div className="max-h-[300px] overflow-y-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>ছাত্রের নাম</TableHead>
                            <TableHead>মোট স্কোর</TableHead>
                            <TableHead className="text-right">কর্ম</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {examResults
                            .filter((result) => result.examId === selectedExam)
                            .map((result) => (
                              <TableRow key={result.id}>
                                <TableCell className="font-medium">
                                  {result.studentName}
                                </TableCell>
                                <TableCell>
                                  {toBengaliNumber(result.total)}
                                  <div className="text-xs text-gray-500">
                                    পড়া: {toBengaliNumber(result.scores.reading)}, মুখস্থ:{" "}
                                    {toBengaliNumber(result.scores.memorization)}, তাজবীদ:{" "}
                                    {toBengaliNumber(result.scores.tajweed)}
                                  </div>
                                  {result.remarks && (
                                    <div className="text-xs italic mt-1">
                                      {result.remarks}
                                    </div>
                                  )}
                                </TableCell>
                                <TableCell className="text-right">
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => handleDeleteExamResult(result.id)}
                                  >
                                    <Trash2 className="h-4 w-4 text-red-600" />
                                  </Button>
                                </TableCell>
                              </TableRow>
                            ))}

                          {examResults.filter((result) => result.examId === selectedExam)
                            .length === 0 && (
                            <TableRow>
                              <TableCell colSpan={3} className="text-center py-4">
                                এই পরীক্ষার জন্য কোন ফলাফল নেই
                              </TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </Card>
      </div>
    </div>
  );
};

export default Groups;
