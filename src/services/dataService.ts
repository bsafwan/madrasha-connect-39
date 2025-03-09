
import { supabase } from "@/integrations/supabase/client";
import { 
  Student, 
  Payment, 
  Expense, 
  Teacher,
  Staff,
  Donation,
  Event,
  WhatsAppNotification,
  User,
  PaymentType,
  PaymentStatus,
  ExpenseStatus,
  DonationStatus
} from "@/types";
import { toast } from "sonner";

// Error handling utility function
const handleError = (error: Error, customMessage: string) => {
  console.error("API Error:", error);
  toast.error(customMessage || "একটি ত্রুটি হয়েছে");
  throw error;
};

// Generic function to fetch data with explicit table types
const fetchData = async <T>(
  tableName: "students" | "payments" | "expenses" | "teachers" | "staff" | "donations" | "events" | "whatsapp_notifications" | "users",
  orderBy?: string,
  ascending: boolean = true,
  whereClause?: { column: string; value: any }
): Promise<T[]> => {
  try {
    let query = supabase.from(tableName).select("*");
    
    if (whereClause) {
      query = query.eq(whereClause.column, whereClause.value);
    }
    
    if (orderBy) {
      query = query.order(orderBy, { ascending });
    }
    
    const { data, error } = await query;
    
    if (error) {
      throw error;
    }
    
    return data as unknown as T[];
  } catch (error) {
    handleError(error as Error, `ডাটা লোড করতে সমস্যা হয়েছে`);
    return [];
  }
};

// Students
export const fetchStudents = async (): Promise<Student[]> => {
  try {
    const { data, error } = await supabase
      .from("students")
      .select("*")
      .order("name", { ascending: true });

    if (error) {
      throw error;
    }

    // Transform the database response to match our Student type
    return data.map(item => ({
      id: item.id,
      name: item.name,
      fatherName: item.father_name,
      motherName: item.mother_name,
      whatsappNumber: item.whatsapp_number,
      address: item.address,
      group: item.group_name,
      monthlyFee: item.monthly_fee,
      registrationDate: item.registration_date,
      active: item.active,
      guardianPhone: item.guardian_phone,
      emergencyContact: item.emergency_contact,
      birthDate: item.birth_date,
      enrollmentNumber: item.enrollment_number,
      previousEducation: item.previous_education,
      medicalInfo: item.medical_info,
      updatedAt: item.updated_at
    }));
  } catch (error) {
    handleError(error as Error, `ডাটা লোড করতে সমস্যা হয়েছে`);
    return [];
  }
};

export const createStudent = async (student: Omit<Student, "id" | "registrationDate" | "updatedAt">): Promise<Student | null> => {
  try {
    // Convert from camelCase to snake_case for database
    const dbStudent = {
      name: student.name,
      father_name: student.fatherName,
      mother_name: student.motherName,
      whatsapp_number: student.whatsappNumber,
      address: student.address,
      group_name: student.group,
      monthly_fee: student.monthlyFee,
      active: student.active,
      guardian_phone: student.guardianPhone,
      emergency_contact: student.emergencyContact,
      birth_date: student.birthDate,
      enrollment_number: student.enrollmentNumber,
      previous_education: student.previousEducation,
      medical_info: student.medicalInfo
    };

    const { data, error } = await supabase
      .from("students")
      .insert(dbStudent)
      .select()
      .single();

    if (error) {
      throw error;
    }

    // Transform back to our Student type
    return {
      id: data.id,
      name: data.name,
      fatherName: data.father_name,
      motherName: data.mother_name,
      whatsappNumber: data.whatsapp_number,
      address: data.address,
      group: data.group_name,
      monthlyFee: data.monthly_fee,
      registrationDate: data.registration_date,
      active: data.active,
      guardianPhone: data.guardian_phone,
      emergencyContact: data.emergency_contact,
      birthDate: data.birth_date,
      enrollmentNumber: data.enrollment_number,
      previousEducation: data.previous_education,
      medicalInfo: data.medical_info,
      updatedAt: data.updated_at
    };
  } catch (error) {
    handleError(error as Error, `ছাত্র যোগ করতে সমস্যা হয়েছে`);
    return null;
  }
};

export const updateStudent = async (id: string, student: Partial<Student>): Promise<Student | null> => {
  try {
    // Convert from camelCase to snake_case for database
    const dbStudent: Record<string, any> = {};
    
    if (student.name !== undefined) dbStudent.name = student.name;
    if (student.fatherName !== undefined) dbStudent.father_name = student.fatherName;
    if (student.motherName !== undefined) dbStudent.mother_name = student.motherName;
    if (student.whatsappNumber !== undefined) dbStudent.whatsapp_number = student.whatsappNumber;
    if (student.address !== undefined) dbStudent.address = student.address;
    if (student.group !== undefined) dbStudent.group_name = student.group;
    if (student.monthlyFee !== undefined) dbStudent.monthly_fee = student.monthlyFee;
    if (student.active !== undefined) dbStudent.active = student.active;
    if (student.guardianPhone !== undefined) dbStudent.guardian_phone = student.guardianPhone;
    if (student.emergencyContact !== undefined) dbStudent.emergency_contact = student.emergencyContact;
    if (student.birthDate !== undefined) dbStudent.birth_date = student.birthDate;
    if (student.enrollmentNumber !== undefined) dbStudent.enrollment_number = student.enrollmentNumber;
    if (student.previousEducation !== undefined) dbStudent.previous_education = student.previousEducation;
    if (student.medicalInfo !== undefined) dbStudent.medical_info = student.medicalInfo;

    const { data, error } = await supabase
      .from("students")
      .update(dbStudent)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      throw error;
    }

    // Transform back to our Student type
    return {
      id: data.id,
      name: data.name,
      fatherName: data.father_name,
      motherName: data.mother_name,
      whatsappNumber: data.whatsapp_number,
      address: data.address,
      group: data.group_name,
      monthlyFee: data.monthly_fee,
      registrationDate: data.registration_date,
      active: data.active,
      guardianPhone: data.guardian_phone,
      emergencyContact: data.emergency_contact,
      birthDate: data.birth_date,
      enrollmentNumber: data.enrollment_number,
      previousEducation: data.previous_education,
      medicalInfo: data.medical_info,
      updatedAt: data.updated_at
    };
  } catch (error) {
    handleError(error as Error, `ছাত্র আপডেট করতে সমস্যা হয়েছে`);
    return null;
  }
};

// Add the deleteStudent function
export const deleteStudent = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from("students")
      .delete()
      .eq("id", id);

    if (error) {
      throw error;
    }

    return true;
  } catch (error) {
    handleError(error as Error, `ছাত্র মুছতে সমস্যা হয়েছে`);
    return false;
  }
};

// Payments
export const fetchPayments = async (): Promise<Payment[]> => {
  try {
    const { data, error } = await supabase
      .from("payments")
      .select("*, students(name)")
      .order("date", { ascending: false });

    if (error) {
      throw error;
    }

    return data.map(item => ({
      id: item.id,
      studentId: item.student_id,
      studentName: item.students?.name || "",
      amount: item.amount,
      date: item.date,
      type: item.type as PaymentType,
      description: item.description,
      status: item.status as PaymentStatus,
      acceptedBy: item.accepted_by,
      verifiedBy: item.verified_by,
      updatedAt: item.updated_at
    }));
  } catch (error) {
    handleError(error as Error, `পেমেন্ট ডাটা লোড করতে সমস্যা হয়েছে`);
    return [];
  }
};

export const createPayment = async (payment: Omit<Payment, "id" | "updatedAt" | "studentName">): Promise<Payment | null> => {
  try {
    const dbPayment = {
      student_id: payment.studentId,
      amount: payment.amount,
      date: payment.date,
      type: payment.type,
      description: payment.description,
      status: payment.status,
      accepted_by: payment.acceptedBy,
      verified_by: payment.verifiedBy
    };

    const { data, error } = await supabase
      .from("payments")
      .insert(dbPayment)
      .select("*, students(name)")
      .single();

    if (error) {
      throw error;
    }

    return {
      id: data.id,
      studentId: data.student_id,
      studentName: data.students?.name || "",
      amount: data.amount,
      date: data.date,
      type: data.type as PaymentType,
      description: data.description,
      status: data.status as PaymentStatus,
      acceptedBy: data.accepted_by,
      verifiedBy: data.verified_by,
      updatedAt: data.updated_at
    };
  } catch (error) {
    handleError(error as Error, `পেমেন্ট যোগ করতে সমস্যা হয়েছে`);
    return null;
  }
};

// Add the updatePayment function
export const updatePayment = async (id: string, payment: Partial<Payment>): Promise<Payment | null> => {
  try {
    const dbPayment: Record<string, any> = {};
    
    if (payment.studentId !== undefined) dbPayment.student_id = payment.studentId;
    if (payment.amount !== undefined) dbPayment.amount = payment.amount;
    if (payment.date !== undefined) dbPayment.date = payment.date;
    if (payment.type !== undefined) dbPayment.type = payment.type;
    if (payment.description !== undefined) dbPayment.description = payment.description;
    if (payment.status !== undefined) dbPayment.status = payment.status;
    if (payment.acceptedBy !== undefined) dbPayment.accepted_by = payment.acceptedBy;
    if (payment.verifiedBy !== undefined) dbPayment.verified_by = payment.verifiedBy;

    const { data, error } = await supabase
      .from("payments")
      .update(dbPayment)
      .eq("id", id)
      .select("*, students(name)")
      .single();

    if (error) {
      throw error;
    }

    return {
      id: data.id,
      studentId: data.student_id,
      studentName: data.students?.name || "",
      amount: data.amount,
      date: data.date,
      type: data.type as PaymentType,
      description: data.description,
      status: data.status as PaymentStatus,
      acceptedBy: data.accepted_by,
      verifiedBy: data.verified_by,
      updatedAt: data.updated_at
    };
  } catch (error) {
    handleError(error as Error, `পেমেন্ট আপডেট করতে সমস্যা হয়েছে`);
    return null;
  }
};

// Add the deletePayment function
export const deletePayment = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from("payments")
      .delete()
      .eq("id", id);

    if (error) {
      throw error;
    }

    return true;
  } catch (error) {
    handleError(error as Error, `পেমেন্ট মুছতে সমস্যা হয়েছে`);
    return false;
  }
};

// Expenses
export const fetchExpenses = async (): Promise<Expense[]> => {
  try {
    const { data, error } = await supabase
      .from("expenses")
      .select("*")
      .order("date", { ascending: false });

    if (error) {
      throw error;
    }

    return data.map(item => ({
      id: item.id,
      title: item.title,
      amount: item.amount,
      date: item.date,
      category: item.category as "fixed" | "dynamic" | "other" | string,
      subcategory: item.subcategory,
      description: item.description,
      status: item.status as ExpenseStatus,
      paymentMethod: item.payment_method,
      receiptUrl: item.receipt_url,
      createdBy: item.created_by,
      verifiedBy: item.verified_by,
      updatedAt: item.updated_at
    }));
  } catch (error) {
    handleError(error as Error, `খরচের ডাটা লোড করতে সমস্যা হয়েছে`);
    return [];
  }
};

export const createExpense = async (expense: Omit<Expense, "id" | "updatedAt">): Promise<Expense | null> => {
  try {
    const dbExpense = {
      title: expense.title,
      amount: expense.amount,
      date: expense.date,
      category: expense.category,
      subcategory: expense.subcategory,
      description: expense.description,
      status: expense.status,
      payment_method: expense.paymentMethod,
      receipt_url: expense.receiptUrl,
      created_by: expense.createdBy,
      verified_by: expense.verifiedBy
    };

    const { data, error } = await supabase
      .from("expenses")
      .insert(dbExpense)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return {
      id: data.id,
      title: data.title,
      amount: data.amount,
      date: data.date,
      category: data.category as "fixed" | "dynamic" | "other" | string,
      subcategory: data.subcategory,
      description: data.description,
      status: data.status as ExpenseStatus,
      paymentMethod: data.payment_method,
      receiptUrl: data.receipt_url,
      createdBy: data.created_by,
      verifiedBy: data.verified_by,
      updatedAt: data.updated_at
    };
  } catch (error) {
    handleError(error as Error, `খরচ যোগ করতে সমস্যা হয়েছে`);
    return null;
  }
};

// Teachers
export const fetchTeachers = async (): Promise<Teacher[]> => {
  try {
    const { data, error } = await supabase
      .from("teachers")
      .select("*")
      .order("name", { ascending: true });

    if (error) {
      throw error;
    }

    return data.map(item => ({
      id: item.id,
      name: item.name,
      phone: item.phone,
      email: item.email || "",
      address: item.address || "",
      qualification: item.qualification || "",
      specialty: item.specialty || "",
      salary: item.salary,
      joiningDate: item.joining_date,
      active: item.active
    }));
  } catch (error) {
    handleError(error as Error, `শিক্ষকের ডাটা লোড করতে সমস্যা হয়েছে`);
    return [];
  }
};

// Staff
export const fetchStaff = async (): Promise<Staff[]> => {
  try {
    const { data, error } = await supabase
      .from("staff")
      .select("*")
      .order("name", { ascending: true });

    if (error) {
      throw error;
    }

    return data.map(item => ({
      id: item.id,
      name: item.name,
      position: item.position,
      phone: item.phone,
      address: item.address || "",
      salary: item.salary,
      joiningDate: item.joining_date,
      active: item.active
    }));
  } catch (error) {
    handleError(error as Error, `কর্মচারীর ডাটা লোড করতে সমস্যা হয়েছে`);
    return [];
  }
};

// Donations
export const fetchDonations = async (): Promise<Donation[]> => {
  try {
    const { data, error } = await supabase
      .from("donations")
      .select("*")
      .order("date", { ascending: false });

    if (error) {
      throw error;
    }

    return data.map(item => ({
      id: item.id,
      donorName: item.donor_name,
      donorContact: item.donor_contact || "",
      amount: item.amount,
      date: item.date,
      description: item.description || "",
      status: item.status as DonationStatus,
      createdBy: item.created_by
    }));
  } catch (error) {
    handleError(error as Error, `দানের ডাটা লোড করতে সমস্যা হয়েছে`);
    return [];
  }
};

// Events
export const fetchEvents = async (): Promise<Event[]> => {
  try {
    const { data, error } = await supabase
      .from("events")
      .select("*")
      .order("start_date", { ascending: false });

    if (error) {
      throw error;
    }

    return data.map(item => ({
      id: item.id,
      title: item.title,
      description: item.description || "",
      startDate: item.start_date,
      endDate: item.end_date,
      location: item.location || "",
      createdBy: item.created_by,
      createdAt: item.created_at
    }));
  } catch (error) {
    handleError(error as Error, `ইভেন্টের ডাটা লোড করতে সমস্যা হয়েছে`);
    return [];
  }
};

// WhatsApp Notifications
export const fetchNotifications = async (): Promise<WhatsAppNotification[]> => {
  try {
    const { data, error } = await supabase
      .from("whatsapp_notifications")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      throw error;
    }

    return data.map(item => ({
      id: item.id,
      recipient: item.recipient,
      content: item.content,
      media_url: item.media_url || "",
      status: item.status as "pending" | "sent" | "failed",
      instance_id: item.instance_id,
      sentAt: item.sent_at
    }));
  } catch (error) {
    handleError(error as Error, `নোটিফিকেশন ডাটা লোড করতে সমস্যা হয়েছে`);
    return [];
  }
};

export const createNotification = async (notification: Omit<WhatsAppNotification, "id" | "sentAt">): Promise<WhatsAppNotification | null> => {
  try {
    const dbNotification = {
      recipient: notification.recipient,
      content: notification.content,
      media_url: notification.media_url,
      status: notification.status,
      instance_id: notification.instance_id
    };

    const { data, error } = await supabase
      .from("whatsapp_notifications")
      .insert(dbNotification)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return {
      id: data.id,
      recipient: data.recipient,
      content: data.content,
      media_url: data.media_url || "",
      status: data.status as "pending" | "sent" | "failed",
      instance_id: data.instance_id,
      sentAt: data.sent_at
    };
  } catch (error) {
    handleError(error as Error, `নোটিফিকেশন যোগ করতে সমস্যা হয়েছে`);
    return null;
  }
};

export const updateNotification = async (id: string, updates: Partial<WhatsAppNotification>): Promise<WhatsAppNotification | null> => {
  try {
    const dbUpdates: Record<string, any> = {};
    
    if (updates.recipient !== undefined) dbUpdates.recipient = updates.recipient;
    if (updates.content !== undefined) dbUpdates.content = updates.content;
    if (updates.media_url !== undefined) dbUpdates.media_url = updates.media_url;
    if (updates.status !== undefined) dbUpdates.status = updates.status;
    if (updates.instance_id !== undefined) dbUpdates.instance_id = updates.instance_id;
    if (updates.sentAt !== undefined) dbUpdates.sent_at = updates.sentAt;

    const { data, error } = await supabase
      .from("whatsapp_notifications")
      .update(dbUpdates)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return {
      id: data.id,
      recipient: data.recipient,
      content: data.content,
      media_url: data.media_url || "",
      status: data.status as "pending" | "sent" | "failed",
      instance_id: data.instance_id,
      sentAt: data.sent_at
    };
  } catch (error) {
    handleError(error as Error, `নোটিফিকেশন আপডেট করতে সমস্যা হয়েছে`);
    return null;
  }
};

export const deleteNotification = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from("whatsapp_notifications")
      .delete()
      .eq("id", id);

    if (error) {
      throw error;
    }

    return true;
  } catch (error) {
    handleError(error as Error, `নোটিফিকেশন মুছতে সমস্যা হয়েছে`);
    return false;
  }
};

// Users
export const fetchUsers = async (): Promise<User[]> => {
  try {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .order("name", { ascending: true });

    if (error) {
      throw error;
    }

    return data as User[];
  } catch (error) {
    handleError(error as Error, `ইউজার ডাটা লোড করতে সমস্যা হয়েছে`);
    return [];
  }
};
