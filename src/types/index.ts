// User types
export type UserRole = "admin" | "teacher";

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  password?: string; // Only used for forms, not stored in client
}

// Student types
export type StudentGroup = "hifz" | "qaida" | "sifara" | "najera" | string;

export interface Student {
  id: string;
  name: string;
  fatherName: string;
  motherName: string;
  parentPhone1: string; // Format: countryCode + number without symbols
  parentPhone2?: string; // Optional second parent number
  whatsappNumber?: string; // Keep existing WhatsApp number
  address?: string; // Made optional as requested
  group: string;
  monthlyFee: number;
  registrationDate: string; // ISO date string
  active: boolean;
  resigned: boolean; // New field to track resignation status
  resignDate?: string; // Date when student resigned
  assignedTeacherId: string; // Teacher assigned to this student
  updatedAt: string;
  guardianPhone?: string;
  emergencyContact?: string;
  birthDate?: string; // ISO date string
  enrollmentNumber?: string;
  previousEducation?: string;
  medicalInfo?: string;
}

// Payment types
export type PaymentStatus = "accepted" | "verified" | "rejected";
export type PaymentType = "monthly" | "event" | "other";

export interface Payment {
  id: string;
  studentId: string;
  studentName?: string; // Added for UI display
  amount: number;
  date: string; // ISO date string
  type: PaymentType;
  description: string;
  status: PaymentStatus;
  verifiedBy?: string;
  acceptedBy: string;
  updatedAt?: string; // ISO date string
}

// Expense types
export type ExpenseStatus = "pending" | "verified" | "rejected";
export type ExpenseCategory = "fixed" | "dynamic" | "other" | string;

export interface Expense {
  id: string;
  title: string;
  amount: number;
  date: string; // ISO date string
  category: ExpenseCategory;
  subcategory: string; // e.g., "electricity", "rent", etc.
  description: string;
  status: ExpenseStatus;
  createdBy: string;
  createdByName?: string; // Added for UI display
  verifiedBy?: string;
  verifiedByName?: string; // Added for UI display
  receiptUrl?: string;
  paymentMethod?: string;
  updatedAt?: string; // ISO date string
}

// Exam and progress types
export interface Exam {
  id: string;
  title: string;
  date: string; // ISO date string
  group: StudentGroup;
}

export interface ExamResult {
  id: string;
  examId: string;
  studentId: string;
  studentName?: string; // Added for UI display
  scores: {
    [key: string]: number; // e.g., {"reading": 90, "tajwid": 45}
  };
  total: number;
  remarks: string;
}

export type QuranProgressType = "parah" | "surah" | string;

export interface QuranProgress {
  id: string;
  studentId: string;
  studentName?: string; // Added for UI display
  date: string; // ISO date string
  type: QuranProgressType;
  progress: string; // e.g., "Completed Parah 5" or "Memorized Surah Al-Baqarah"
  verifiedBy?: string;
}

// Notification types
export interface WhatsAppNotification {
  id: string;
  recipient: string;
  content: string;
  media_url?: string;
  instance_id: string;
  status: "pending" | "sent" | "failed";
  sentAt?: string; // ISO date string
}

// Teacher types
export interface Teacher {
  id: string;
  name: string;
  email?: string;
  phone: string;
  qualification?: string;
  specialty?: string;
  joiningDate: string; // ISO date string
  salary: number;
  address?: string;
  active: boolean;
}

// Staff types
export interface Staff {
  id: string;
  name: string;
  position: string;
  phone: string;
  salary: number;
  joiningDate: string; // ISO date string
  address?: string;
  active: boolean;
}

// Syllabus types
export interface Syllabus {
  id: string;
  title: string;
  description?: string;
  groupName: string;
  createdAt: string; // ISO date string
}

export interface SyllabusItem {
  id: string;
  syllabusId: string;
  title: string;
  description?: string;
  orderNumber: number;
  createdAt: string; // ISO date string
}

// Curriculum types
export interface Curriculum {
  id: string;
  title: string;
  description?: string;
  groupName: string;
  active: boolean;
  createdAt: string; // ISO date string
}

export interface CurriculumItem {
  id: string;
  curriculumId: string;
  title: string;
  description?: string;
  resources?: string;
  duration?: string;
  orderNumber: number;
  createdAt: string; // ISO date string
}

// Timetable types
export interface Timetable {
  id: string;
  dayOfWeek: string;
  groupName: string;
  createdAt: string; // ISO date string
  active: boolean;
}

export interface TimetableSlot {
  id: string;
  timetableId: string;
  startTime: string;
  endTime: string;
  subject: string;
  teacherId?: string;
  createdAt: string; // ISO date string
}

// Attendance types
export type AttendanceStatus = "present" | "absent" | "late" | "excused";

export interface StudentAttendance {
  id: string;
  studentId: string;
  date: string; // ISO date string
  status: AttendanceStatus;
  createdBy: string;
  createdAt: string; // ISO date string
}

export interface TeacherAttendance {
  id: string;
  teacherId: string;
  date: string; // ISO date string
  status: AttendanceStatus;
  createdBy: string;
  createdAt: string; // ISO date string
}

// Event types
export interface Event {
  id: string;
  title: string;
  description?: string;
  startDate: string; // ISO date string
  endDate: string; // ISO date string
  location?: string;
  createdBy: string;
  createdAt: string; // ISO date string
}

// Donation types
export type DonationStatus = "received" | "pending" | "cancelled";

export interface Donation {
  id: string;
  donorName: string;
  donorContact?: string;
  amount: number;
  date: string; // ISO date string
  description?: string;
  status: DonationStatus;
  createdBy: string;
  createdAt: string; // ISO date string
}

// Salary types
export type SalaryStatus = "paid" | "pending" | "cancelled";

export interface TeacherSalary {
  id: string;
  teacherId: string;
  amount: number;
  month: string;
  year: number;
  paymentDate: string; // ISO date string
  status: SalaryStatus;
  createdBy: string;
  createdAt: string; // ISO date string
}

export interface StaffSalary {
  id: string;
  staffId: string;
  amount: number;
  month: string;
  year: number;
  paymentDate: string; // ISO date string
  status: SalaryStatus;
  createdBy: string;
  createdAt: string; // ISO date string
}

// Fee structure types
export interface FeeStructure {
  id: string;
  groupName: string;
  monthlyFee: number;
  admissionFee: number;
  annualFee: number;
  examinationFee: number;
  otherFees?: Record<string, number>;
  effectiveFrom: string; // ISO date string
  effectiveTo?: string; // ISO date string
  createdBy: string;
  createdAt: string; // ISO date string
}

// Study materials types
export interface StudyMaterial {
  id: string;
  title: string;
  description?: string;
  fileUrl?: string;
  groupName: string;
  createdBy: string;
  createdAt: string; // ISO date string
}

// Student assessment types
export interface StudentAssessment {
  id: string;
  studentId: string;
  assessmentType: string;
  assessmentDate: string; // ISO date string
  assessmentDetails: Record<string, any>;
  remarks?: string;
  createdBy: string;
  createdAt: string; // ISO date string
}
