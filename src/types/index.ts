
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
  whatsappNumber: string;
  address: string;
  group: StudentGroup;
  monthlyFee: number;
  registrationDate: string; // ISO date string
  active: boolean;
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
