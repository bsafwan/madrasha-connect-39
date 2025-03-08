
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type {
  Student,
  Payment,
  Expense,
  Teacher,
  Staff,
  Donation,
  Event,
  TeacherSalary,
  StaffSalary,
  StudentAttendance,
  TeacherAttendance,
  QuranProgress,
  Exam,
  ExamResult,
  Curriculum,
  Syllabus,
  StudyMaterial,
  Timetable,
  FeeStructure,
  WhatsAppNotification
} from "@/types";

// Error handler utility
const handleError = (error: Error, message: string) => {
  console.error(`${message}:`, error);
  toast.error(message);
  throw error;
};

// Generic fetch function
async function fetchData<T>(
  table: string,
  options?: {
    columns?: string;
    filters?: Record<string, any>;
    limit?: number;
    orderBy?: { column: string; ascending?: boolean };
  }
) {
  try {
    let query = supabase
      .from(table)
      .select(options?.columns || '*');

    // Apply filters if provided
    if (options?.filters) {
      Object.entries(options.filters).forEach(([key, value]) => {
        query = query.eq(key, value);
      });
    }

    // Apply order if provided
    if (options?.orderBy) {
      query = query.order(
        options.orderBy.column, 
        { ascending: options.orderBy.ascending ?? false }
      );
    }

    // Apply limit if provided
    if (options?.limit) {
      query = query.limit(options.limit);
    }

    const { data, error } = await query;

    if (error) {
      throw error;
    }

    return data as T[];
  } catch (error) {
    handleError(error as Error, `ডাটা লোড করতে সমস্যা হয়েছে`);
    return [];
  }
}

// Generic create function
async function createItem<T>(table: string, item: Partial<T>): Promise<T | null> {
  try {
    const { data, error } = await supabase
      .from(table)
      .insert([item])
      .select();

    if (error) {
      throw error;
    }

    toast.success(`নতুন আইটেম সফলভাবে তৈরি করা হয়েছে`);
    return data?.[0] as T;
  } catch (error) {
    handleError(error as Error, `আইটেম তৈরি করতে সমস্যা হয়েছে`);
    return null;
  }
}

// Generic update function
async function updateItem<T>(table: string, id: string, item: Partial<T>): Promise<T | null> {
  try {
    const { data, error } = await supabase
      .from(table)
      .update(item)
      .eq('id', id)
      .select();

    if (error) {
      throw error;
    }

    toast.success(`আইটেম সফলভাবে আপডেট করা হয়েছে`);
    return data?.[0] as T;
  } catch (error) {
    handleError(error as Error, `আইটেম আপডেট করতে সমস্যা হয়েছে`);
    return null;
  }
}

// Generic delete function
async function deleteItem(table: string, id: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from(table)
      .delete()
      .eq('id', id);

    if (error) {
      throw error;
    }

    toast.success(`আইটেম সফলভাবে মুছে ফেলা হয়েছে`);
    return true;
  } catch (error) {
    handleError(error as Error, `আইটেম মুছতে সমস্যা হয়েছে`);
    return false;
  }
}

// Students
export const fetchStudents = () => fetchData<Student>('students', { 
  orderBy: { column: 'name' }
});

export const createStudent = (student: Partial<Student>) => 
  createItem<Student>('students', student);

export const updateStudent = (id: string, student: Partial<Student>) => 
  updateItem<Student>('students', id, student);

export const deleteStudent = (id: string) => 
  deleteItem('students', id);

// Payments
export const fetchPayments = (filters?: Record<string, any>) => 
  fetchData<Payment>('payments', { 
    filters, 
    orderBy: { column: 'date', ascending: false }
  });

export const createPayment = (payment: Partial<Payment>) => 
  createItem<Payment>('payments', payment);

export const updatePayment = (id: string, payment: Partial<Payment>) => 
  updateItem<Payment>('payments', id, payment);

export const deletePayment = (id: string) => 
  deleteItem('payments', id);

// Expenses
export const fetchExpenses = (filters?: Record<string, any>) => 
  fetchData<Expense>('expenses', { 
    filters, 
    orderBy: { column: 'date', ascending: false }
  });

export const createExpense = (expense: Partial<Expense>) => 
  createItem<Expense>('expenses', expense);

export const updateExpense = (id: string, expense: Partial<Expense>) => 
  updateItem<Expense>('expenses', id, expense);

export const deleteExpense = (id: string) => 
  deleteItem('expenses', id);

// Teachers
export const fetchTeachers = () => 
  fetchData<Teacher>('teachers', { orderBy: { column: 'name' } });

export const createTeacher = (teacher: Partial<Teacher>) => 
  createItem<Teacher>('teachers', teacher);

export const updateTeacher = (id: string, teacher: Partial<Teacher>) => 
  updateItem<Teacher>('teachers', id, teacher);

export const deleteTeacher = (id: string) => 
  deleteItem('teachers', id);

// Staff
export const fetchStaff = () => 
  fetchData<Staff>('staff', { orderBy: { column: 'name' } });

export const createStaff = (staff: Partial<Staff>) => 
  createItem<Staff>('staff', staff);

export const updateStaff = (id: string, staff: Partial<Staff>) => 
  updateItem<Staff>('staff', id, staff);

export const deleteStaff = (id: string) => 
  deleteItem('staff', id);

// Donations
export const fetchDonations = () => 
  fetchData<Donation>('donations', { 
    orderBy: { column: 'date', ascending: false }
  });

export const createDonation = (donation: Partial<Donation>) => 
  createItem<Donation>('donations', donation);

export const updateDonation = (id: string, donation: Partial<Donation>) => 
  updateItem<Donation>('donations', id, donation);

export const deleteDonation = (id: string) => 
  deleteItem('donations', id);

// Events
export const fetchEvents = () => 
  fetchData<Event>('events', { 
    orderBy: { column: 'start_date' }
  });

export const createEvent = (event: Partial<Event>) => 
  createItem<Event>('events', event);

export const updateEvent = (id: string, event: Partial<Event>) => 
  updateItem<Event>('events', id, event);

export const deleteEvent = (id: string) => 
  deleteItem('events', id);

// Teacher Salaries
export const fetchTeacherSalaries = (filters?: Record<string, any>) => 
  fetchData<TeacherSalary>('teacher_salaries', { 
    filters, 
    orderBy: { column: 'payment_date', ascending: false }
  });

export const createTeacherSalary = (salary: Partial<TeacherSalary>) => 
  createItem<TeacherSalary>('teacher_salaries', salary);

export const updateTeacherSalary = (id: string, salary: Partial<TeacherSalary>) => 
  updateItem<TeacherSalary>('teacher_salaries', id, salary);

export const deleteTeacherSalary = (id: string) => 
  deleteItem('teacher_salaries', id);

// Staff Salaries
export const fetchStaffSalaries = (filters?: Record<string, any>) => 
  fetchData<StaffSalary>('staff_salaries', { 
    filters, 
    orderBy: { column: 'payment_date', ascending: false }
  });

export const createStaffSalary = (salary: Partial<StaffSalary>) => 
  createItem<StaffSalary>('staff_salaries', salary);

export const updateStaffSalary = (id: string, salary: Partial<StaffSalary>) => 
  updateItem<StaffSalary>('staff_salaries', id, salary);

export const deleteStaffSalary = (id: string) => 
  deleteItem('staff_salaries', id);

// Student Attendance
export const fetchStudentAttendance = (filters?: Record<string, any>) => 
  fetchData<StudentAttendance>('student_attendance', { 
    filters, 
    orderBy: { column: 'date', ascending: false }
  });

export const createStudentAttendance = (attendance: Partial<StudentAttendance>) => 
  createItem<StudentAttendance>('student_attendance', attendance);

export const updateStudentAttendance = (id: string, attendance: Partial<StudentAttendance>) => 
  updateItem<StudentAttendance>('student_attendance', id, attendance);

export const deleteStudentAttendance = (id: string) => 
  deleteItem('student_attendance', id);

// Teacher Attendance
export const fetchTeacherAttendance = (filters?: Record<string, any>) => 
  fetchData<TeacherAttendance>('teacher_attendance', { 
    filters, 
    orderBy: { column: 'date', ascending: false }
  });

export const createTeacherAttendance = (attendance: Partial<TeacherAttendance>) => 
  createItem<TeacherAttendance>('teacher_attendance', attendance);

export const updateTeacherAttendance = (id: string, attendance: Partial<TeacherAttendance>) => 
  updateItem<TeacherAttendance>('teacher_attendance', id, attendance);

export const deleteTeacherAttendance = (id: string) => 
  deleteItem('teacher_attendance', id);

// Quran Progress
export const fetchQuranProgress = (filters?: Record<string, any>) => 
  fetchData<QuranProgress>('quran_progress', { 
    filters, 
    orderBy: { column: 'date', ascending: false }
  });

export const createQuranProgress = (progress: Partial<QuranProgress>) => 
  createItem<QuranProgress>('quran_progress', progress);

export const updateQuranProgress = (id: string, progress: Partial<QuranProgress>) => 
  updateItem<QuranProgress>('quran_progress', id, progress);

export const deleteQuranProgress = (id: string) => 
  deleteItem('quran_progress', id);

// Exams
export const fetchExams = (filters?: Record<string, any>) => 
  fetchData<Exam>('exams', { 
    filters, 
    orderBy: { column: 'date', ascending: false }
  });

export const createExam = (exam: Partial<Exam>) => 
  createItem<Exam>('exams', exam);

export const updateExam = (id: string, exam: Partial<Exam>) => 
  updateItem<Exam>('exams', id, exam);

export const deleteExam = (id: string) => 
  deleteItem('exams', id);

// Exam Results
export const fetchExamResults = (filters?: Record<string, any>) => 
  fetchData<ExamResult>('exam_results', { filters });

export const createExamResult = (result: Partial<ExamResult>) => 
  createItem<ExamResult>('exam_results', result);

export const updateExamResult = (id: string, result: Partial<ExamResult>) => 
  updateItem<ExamResult>('exam_results', id, result);

export const deleteExamResult = (id: string) => 
  deleteItem('exam_results', id);

// Curriculum
export const fetchCurricula = (filters?: Record<string, any>) => 
  fetchData<Curriculum>('curriculum', { filters });

export const createCurriculum = (curriculum: Partial<Curriculum>) => 
  createItem<Curriculum>('curriculum', curriculum);

export const updateCurriculum = (id: string, curriculum: Partial<Curriculum>) => 
  updateItem<Curriculum>('curriculum', id, curriculum);

export const deleteCurriculum = (id: string) => 
  deleteItem('curriculum', id);

// Syllabus
export const fetchSyllabi = (filters?: Record<string, any>) => 
  fetchData<Syllabus>('syllabus', { filters });

export const createSyllabus = (syllabus: Partial<Syllabus>) => 
  createItem<Syllabus>('syllabus', syllabus);

export const updateSyllabus = (id: string, syllabus: Partial<Syllabus>) => 
  updateItem<Syllabus>('syllabus', id, syllabus);

export const deleteSyllabus = (id: string) => 
  deleteItem('syllabus', id);

// Study Materials
export const fetchStudyMaterials = (filters?: Record<string, any>) => 
  fetchData<StudyMaterial>('study_materials', { filters });

export const createStudyMaterial = (material: Partial<StudyMaterial>) => 
  createItem<StudyMaterial>('study_materials', material);

export const updateStudyMaterial = (id: string, material: Partial<StudyMaterial>) => 
  updateItem<StudyMaterial>('study_materials', id, material);

export const deleteStudyMaterial = (id: string) => 
  deleteItem('study_materials', id);

// Timetables
export const fetchTimetables = (filters?: Record<string, any>) => 
  fetchData<Timetable>('timetables', { filters });

export const createTimetable = (timetable: Partial<Timetable>) => 
  createItem<Timetable>('timetables', timetable);

export const updateTimetable = (id: string, timetable: Partial<Timetable>) => 
  updateItem<Timetable>('timetables', id, timetable);

export const deleteTimetable = (id: string) => 
  deleteItem('timetables', id);

// Fee Structures
export const fetchFeeStructures = (filters?: Record<string, any>) => 
  fetchData<FeeStructure>('fee_structure', { filters });

export const createFeeStructure = (feeStructure: Partial<FeeStructure>) => 
  createItem<FeeStructure>('fee_structure', feeStructure);

export const updateFeeStructure = (id: string, feeStructure: Partial<FeeStructure>) => 
  updateItem<FeeStructure>('fee_structure', id, feeStructure);

export const deleteFeeStructure = (id: string) => 
  deleteItem('fee_structure', id);

// WhatsApp Notifications
export const fetchNotifications = (filters?: Record<string, any>) => 
  fetchData<WhatsAppNotification>('whatsapp_notifications', { 
    filters, 
    orderBy: { column: 'created_at', ascending: false }
  });

export const createNotification = (notification: Partial<WhatsAppNotification>) => 
  createItem<WhatsAppNotification>('whatsapp_notifications', notification);

export const updateNotification = (id: string, notification: Partial<WhatsAppNotification>) => 
  updateItem<WhatsAppNotification>('whatsapp_notifications', id, notification);

export const deleteNotification = (id: string) => 
  deleteItem('whatsapp_notifications', id);
