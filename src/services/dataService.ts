
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

// Students
export const fetchStudents = async () => {
  try {
    const { data, error } = await supabase
      .from('students')
      .select('*')
      .order('name');

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
    })) as Student[];
  } catch (error) {
    handleError(error as Error, `ডাটা লোড করতে সমস্যা হয়েছে`);
    return [];
  }
};

export const createStudent = async (student: Partial<Student>) => {
  try {
    const { data, error } = await supabase
      .from('students')
      .insert([{
        name: student.name,
        father_name: student.fatherName,
        mother_name: student.motherName,
        whatsapp_number: student.whatsappNumber,
        address: student.address,
        group_name: student.group,
        monthly_fee: student.monthlyFee,
        registration_date: student.registrationDate || new Date().toISOString(),
        active: student.active !== undefined ? student.active : true,
        guardian_phone: student.guardianPhone,
        emergency_contact: student.emergencyContact,
        birth_date: student.birthDate,
        enrollment_number: student.enrollmentNumber,
        previous_education: student.previousEducation,
        medical_info: student.medicalInfo
      }])
      .select();

    if (error) {
      throw error;
    }

    toast.success(`নতুন ছাত্র সফলভাবে তৈরি করা হয়েছে`);
    
    // Transform the DB response to match our Student type
    return data?.[0] ? {
      id: data[0].id,
      name: data[0].name,
      fatherName: data[0].father_name,
      motherName: data[0].mother_name,
      whatsappNumber: data[0].whatsapp_number,
      address: data[0].address,
      group: data[0].group_name,
      monthlyFee: data[0].monthly_fee,
      registrationDate: data[0].registration_date,
      active: data[0].active,
      guardianPhone: data[0].guardian_phone,
      emergencyContact: data[0].emergency_contact,
      birthDate: data[0].birth_date,
      enrollmentNumber: data[0].enrollment_number,
      previousEducation: data[0].previous_education,
      medicalInfo: data[0].medical_info,
      updatedAt: data[0].updated_at
    } as Student : null;
    
  } catch (error) {
    handleError(error as Error, `ছাত্র তৈরি করতে সমস্যা হয়েছে`);
    return null;
  }
};

export const updateStudent = async (id: string, student: Partial<Student>) => {
  try {
    // Transform our Student type to match DB schema
    const updateData: Record<string, any> = {};
    
    if (student.name !== undefined) updateData.name = student.name;
    if (student.fatherName !== undefined) updateData.father_name = student.fatherName;
    if (student.motherName !== undefined) updateData.mother_name = student.motherName;
    if (student.whatsappNumber !== undefined) updateData.whatsapp_number = student.whatsappNumber;
    if (student.address !== undefined) updateData.address = student.address;
    if (student.group !== undefined) updateData.group_name = student.group;
    if (student.monthlyFee !== undefined) updateData.monthly_fee = student.monthlyFee;
    if (student.registrationDate !== undefined) updateData.registration_date = student.registrationDate;
    if (student.active !== undefined) updateData.active = student.active;
    if (student.guardianPhone !== undefined) updateData.guardian_phone = student.guardianPhone;
    if (student.emergencyContact !== undefined) updateData.emergency_contact = student.emergencyContact;
    if (student.birthDate !== undefined) updateData.birth_date = student.birthDate;
    if (student.enrollmentNumber !== undefined) updateData.enrollment_number = student.enrollmentNumber;
    if (student.previousEducation !== undefined) updateData.previous_education = student.previousEducation;
    if (student.medicalInfo !== undefined) updateData.medical_info = student.medicalInfo;
    
    const { data, error } = await supabase
      .from('students')
      .update(updateData)
      .eq('id', id)
      .select();

    if (error) {
      throw error;
    }

    toast.success(`ছাত্র সফলভাবে আপডেট করা হয়েছে`);
    
    // Transform the DB response to match our Student type
    return data?.[0] ? {
      id: data[0].id,
      name: data[0].name,
      fatherName: data[0].father_name,
      motherName: data[0].mother_name,
      whatsappNumber: data[0].whatsapp_number,
      address: data[0].address,
      group: data[0].group_name,
      monthlyFee: data[0].monthly_fee,
      registrationDate: data[0].registration_date,
      active: data[0].active,
      guardianPhone: data[0].guardian_phone,
      emergencyContact: data[0].emergency_contact,
      birthDate: data[0].birth_date,
      enrollmentNumber: data[0].enrollment_number,
      previousEducation: data[0].previous_education,
      medicalInfo: data[0].medical_info,
      updatedAt: data[0].updated_at
    } as Student : null;
    
  } catch (error) {
    handleError(error as Error, `ছাত্র আপডেট করতে সমস্যা হয়েছে`);
    return null;
  }
};

export const deleteStudent = async (id: string) => {
  try {
    const { error } = await supabase
      .from('students')
      .delete()
      .eq('id', id);

    if (error) {
      throw error;
    }

    toast.success(`ছাত্র সফলভাবে মুছে ফেলা হয়েছে`);
    return true;
  } catch (error) {
    handleError(error as Error, `ছাত্র মুছতে সমস্যা হয়েছে`);
    return false;
  }
};

// Payments
export const fetchPayments = async (filters?: Record<string, any>) => {
  try {
    let query = supabase
      .from('payments')
      .select('*, students(name)')
      .order('date', { ascending: false });

    // Apply filters if provided
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        query = query.eq(key, value);
      });
    }

    const { data, error } = await query;

    if (error) {
      throw error;
    }

    // Transform DB response to match our Payment type
    return data.map(item => ({
      id: item.id,
      studentId: item.student_id,
      studentName: item.students?.name,
      amount: item.amount,
      date: item.date,
      type: item.type,
      description: item.description || '',
      status: item.status,
      verifiedBy: item.verified_by,
      acceptedBy: item.accepted_by,
      updatedAt: item.updated_at
    })) as Payment[];
  } catch (error) {
    handleError(error as Error, `পেমেন্ট ডাটা লোড করতে সমস্যা হয়েছে`);
    return [];
  }
};

export const createPayment = async (payment: Partial<Payment>) => {
  try {
    const { data, error } = await supabase
      .from('payments')
      .insert([{
        student_id: payment.studentId,
        amount: payment.amount,
        date: payment.date || new Date().toISOString(),
        type: payment.type,
        description: payment.description,
        status: payment.status,
        verified_by: payment.verifiedBy,
        accepted_by: payment.acceptedBy
      }])
      .select();

    if (error) {
      throw error;
    }

    toast.success(`নতুন পেমেন্ট সফলভাবে তৈরি করা হয়েছে`);
    
    // Transform the DB response to match our Payment type
    return data?.[0] ? {
      id: data[0].id,
      studentId: data[0].student_id,
      amount: data[0].amount,
      date: data[0].date,
      type: data[0].type,
      description: data[0].description || '',
      status: data[0].status,
      verifiedBy: data[0].verified_by,
      acceptedBy: data[0].accepted_by,
      updatedAt: data[0].updated_at
    } as Payment : null;
  } catch (error) {
    handleError(error as Error, `পেমেন্ট তৈরি করতে সমস্যা হয়েছে`);
    return null;
  }
};

export const updatePayment = async (id: string, payment: Partial<Payment>) => {
  try {
    // Transform our Payment type to match DB schema
    const updateData: Record<string, any> = {};
    
    if (payment.studentId !== undefined) updateData.student_id = payment.studentId;
    if (payment.amount !== undefined) updateData.amount = payment.amount;
    if (payment.date !== undefined) updateData.date = payment.date;
    if (payment.type !== undefined) updateData.type = payment.type;
    if (payment.description !== undefined) updateData.description = payment.description;
    if (payment.status !== undefined) updateData.status = payment.status;
    if (payment.verifiedBy !== undefined) updateData.verified_by = payment.verifiedBy;
    if (payment.acceptedBy !== undefined) updateData.accepted_by = payment.acceptedBy;
    
    const { data, error } = await supabase
      .from('payments')
      .update(updateData)
      .eq('id', id)
      .select();

    if (error) {
      throw error;
    }

    toast.success(`পেমেন্ট সফলভাবে আপডেট করা হয়েছে`);
    
    // Transform the DB response to match our Payment type
    return data?.[0] ? {
      id: data[0].id,
      studentId: data[0].student_id,
      amount: data[0].amount,
      date: data[0].date,
      type: data[0].type,
      description: data[0].description || '',
      status: data[0].status,
      verifiedBy: data[0].verified_by,
      acceptedBy: data[0].accepted_by,
      updatedAt: data[0].updated_at
    } as Payment : null;
  } catch (error) {
    handleError(error as Error, `পেমেন্ট আপডেট করতে সমস্যা হয়েছে`);
    return null;
  }
};

export const deletePayment = async (id: string) => {
  try {
    const { error } = await supabase
      .from('payments')
      .delete()
      .eq('id', id);

    if (error) {
      throw error;
    }

    toast.success(`পেমেন্ট সফলভাবে মুছে ফেলা হয়েছে`);
    return true;
  } catch (error) {
    handleError(error as Error, `পেমেন্ট মুছতে সমস্যা হয়েছে`);
    return false;
  }
};

// Expenses
export const fetchExpenses = async (filters?: Record<string, any>) => {
  try {
    let query = supabase
      .from('expenses')
      .select('*, users!expenses_created_by_fkey(name), users!expenses_verified_by_fkey(name)')
      .order('date', { ascending: false });

    // Apply filters if provided
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        query = query.eq(key, value);
      });
    }

    const { data, error } = await query;

    if (error) {
      throw error;
    }

    // Transform DB response to match our Expense type
    return data.map(item => ({
      id: item.id,
      title: item.title,
      amount: item.amount,
      date: item.date,
      category: item.category,
      subcategory: item.subcategory,
      description: item.description || '',
      status: item.status,
      createdBy: item.created_by,
      createdByName: item.users?.name,
      verifiedBy: item.verified_by,
      verifiedByName: item.users?.name,
      receiptUrl: item.receipt_url,
      paymentMethod: item.payment_method,
      updatedAt: item.updated_at
    })) as Expense[];
  } catch (error) {
    handleError(error as Error, `খরচের ডাটা লোড করতে সমস্যা হয়েছে`);
    return [];
  }
};

export const createExpense = async (expense: Partial<Expense>) => {
  try {
    const { data, error } = await supabase
      .from('expenses')
      .insert([{
        title: expense.title,
        amount: expense.amount,
        date: expense.date || new Date().toISOString(),
        category: expense.category,
        subcategory: expense.subcategory,
        description: expense.description,
        status: expense.status,
        created_by: expense.createdBy,
        verified_by: expense.verifiedBy,
        receipt_url: expense.receiptUrl,
        payment_method: expense.paymentMethod
      }])
      .select();

    if (error) {
      throw error;
    }

    toast.success(`নতুন খরচ সফলভাবে তৈরি করা হয়েছে`);
    
    // Transform the DB response to match our Expense type
    return data?.[0] ? {
      id: data[0].id,
      title: data[0].title,
      amount: data[0].amount,
      date: data[0].date,
      category: data[0].category,
      subcategory: data[0].subcategory,
      description: data[0].description || '',
      status: data[0].status,
      createdBy: data[0].created_by,
      verifiedBy: data[0].verified_by,
      receiptUrl: data[0].receipt_url,
      paymentMethod: data[0].payment_method,
      updatedAt: data[0].updated_at
    } as Expense : null;
  } catch (error) {
    handleError(error as Error, `খরচ তৈরি করতে সমস্যা হয়েছে`);
    return null;
  }
};

export const updateExpense = async (id: string, expense: Partial<Expense>) => {
  try {
    // Transform our Expense type to match DB schema
    const updateData: Record<string, any> = {};
    
    if (expense.title !== undefined) updateData.title = expense.title;
    if (expense.amount !== undefined) updateData.amount = expense.amount;
    if (expense.date !== undefined) updateData.date = expense.date;
    if (expense.category !== undefined) updateData.category = expense.category;
    if (expense.subcategory !== undefined) updateData.subcategory = expense.subcategory;
    if (expense.description !== undefined) updateData.description = expense.description;
    if (expense.status !== undefined) updateData.status = expense.status;
    if (expense.verifiedBy !== undefined) updateData.verified_by = expense.verifiedBy;
    if (expense.receiptUrl !== undefined) updateData.receipt_url = expense.receiptUrl;
    if (expense.paymentMethod !== undefined) updateData.payment_method = expense.paymentMethod;
    
    const { data, error } = await supabase
      .from('expenses')
      .update(updateData)
      .eq('id', id)
      .select();

    if (error) {
      throw error;
    }

    toast.success(`খরচ সফলভাবে আপডেট করা হয়েছে`);
    
    // Transform the DB response to match our Expense type
    return data?.[0] ? {
      id: data[0].id,
      title: data[0].title,
      amount: data[0].amount,
      date: data[0].date,
      category: data[0].category,
      subcategory: data[0].subcategory,
      description: data[0].description || '',
      status: data[0].status,
      createdBy: data[0].created_by,
      verifiedBy: data[0].verified_by,
      receiptUrl: data[0].receipt_url,
      paymentMethod: data[0].payment_method,
      updatedAt: data[0].updated_at
    } as Expense : null;
  } catch (error) {
    handleError(error as Error, `খরচ আপডেট করতে সমস্যা হয়েছে`);
    return null;
  }
};

export const deleteExpense = async (id: string) => {
  try {
    const { error } = await supabase
      .from('expenses')
      .delete()
      .eq('id', id);

    if (error) {
      throw error;
    }

    toast.success(`খরচ সফলভাবে মুছে ফেলা হয়েছে`);
    return true;
  } catch (error) {
    handleError(error as Error, `খরচ মুছতে সমস্যা হয়েছে`);
    return false;
  }
};

// Teachers
export const fetchTeachers = async () => {
  try {
    const { data, error } = await supabase
      .from('teachers')
      .select('*')
      .order('name');

    if (error) {
      throw error;
    }

    // Transform DB response to match our Teacher type
    return data.map(item => ({
      id: item.id,
      name: item.name,
      email: item.email,
      phone: item.phone,
      qualification: item.qualification,
      specialty: item.specialty,
      joiningDate: item.joining_date,
      salary: item.salary,
      address: item.address,
      active: item.active
    })) as Teacher[];
  } catch (error) {
    handleError(error as Error, `শিক্ষকদের ডাটা লোড করতে সমস্যা হয়েছে`);
    return [];
  }
};

export const createTeacher = async (teacher: Partial<Teacher>) => {
  try {
    const { data, error } = await supabase
      .from('teachers')
      .insert([{
        name: teacher.name,
        email: teacher.email,
        phone: teacher.phone,
        qualification: teacher.qualification,
        specialty: teacher.specialty,
        joining_date: teacher.joiningDate || new Date().toISOString(),
        salary: teacher.salary,
        address: teacher.address,
        active: teacher.active !== undefined ? teacher.active : true
      }])
      .select();

    if (error) {
      throw error;
    }

    toast.success(`নতুন শিক্ষক সফলভাবে তৈরি করা হয়েছে`);
    
    // Transform the DB response to match our Teacher type
    return data?.[0] ? {
      id: data[0].id,
      name: data[0].name,
      email: data[0].email,
      phone: data[0].phone,
      qualification: data[0].qualification,
      specialty: data[0].specialty,
      joiningDate: data[0].joining_date,
      salary: data[0].salary,
      address: data[0].address,
      active: data[0].active
    } as Teacher : null;
  } catch (error) {
    handleError(error as Error, `শিক্ষক তৈরি করতে সমস্যা হয়েছে`);
    return null;
  }
};

export const updateTeacher = async (id: string, teacher: Partial<Teacher>) => {
  try {
    // Transform our Teacher type to match DB schema
    const updateData: Record<string, any> = {};
    
    if (teacher.name !== undefined) updateData.name = teacher.name;
    if (teacher.email !== undefined) updateData.email = teacher.email;
    if (teacher.phone !== undefined) updateData.phone = teacher.phone;
    if (teacher.qualification !== undefined) updateData.qualification = teacher.qualification;
    if (teacher.specialty !== undefined) updateData.specialty = teacher.specialty;
    if (teacher.joiningDate !== undefined) updateData.joining_date = teacher.joiningDate;
    if (teacher.salary !== undefined) updateData.salary = teacher.salary;
    if (teacher.address !== undefined) updateData.address = teacher.address;
    if (teacher.active !== undefined) updateData.active = teacher.active;
    
    const { data, error } = await supabase
      .from('teachers')
      .update(updateData)
      .eq('id', id)
      .select();

    if (error) {
      throw error;
    }

    toast.success(`শিক্ষক সফলভাবে আপডেট করা হয়েছে`);
    
    // Transform the DB response to match our Teacher type
    return data?.[0] ? {
      id: data[0].id,
      name: data[0].name,
      email: data[0].email,
      phone: data[0].phone,
      qualification: data[0].qualification,
      specialty: data[0].specialty,
      joiningDate: data[0].joining_date,
      salary: data[0].salary,
      address: data[0].address,
      active: data[0].active
    } as Teacher : null;
  } catch (error) {
    handleError(error as Error, `শিক্ষক আপডেট করতে সমস্যা হয়েছে`);
    return null;
  }
};

export const deleteTeacher = async (id: string) => {
  try {
    const { error } = await supabase
      .from('teachers')
      .delete()
      .eq('id', id);

    if (error) {
      throw error;
    }

    toast.success(`শিক্ষক সফলভাবে মুছে ফেলা হয়েছে`);
    return true;
  } catch (error) {
    handleError(error as Error, `শিক্ষক মুছতে সমস্যা হয়েছে`);
    return false;
  }
};

// Staff
export const fetchStaff = async () => {
  try {
    const { data, error } = await supabase
      .from('staff')
      .select('*')
      .order('name');

    if (error) {
      throw error;
    }

    // Transform DB response to match our Staff type
    return data.map(item => ({
      id: item.id,
      name: item.name,
      position: item.position,
      phone: item.phone,
      salary: item.salary,
      joiningDate: item.joining_date,
      address: item.address,
      active: item.active
    })) as Staff[];
  } catch (error) {
    handleError(error as Error, `স্টাফদের ডাটা লোড করতে সমস্যা হয়েছে`);
    return [];
  }
};

export const createStaff = async (staff: Partial<Staff>) => {
  try {
    const { data, error } = await supabase
      .from('staff')
      .insert([{
        name: staff.name,
        position: staff.position,
        phone: staff.phone,
        salary: staff.salary,
        joining_date: staff.joiningDate || new Date().toISOString(),
        address: staff.address,
        active: staff.active !== undefined ? staff.active : true
      }])
      .select();

    if (error) {
      throw error;
    }

    toast.success(`নতুন স্টাফ সফলভাবে তৈরি করা হয়েছে`);
    
    // Transform the DB response to match our Staff type
    return data?.[0] ? {
      id: data[0].id,
      name: data[0].name,
      position: data[0].position,
      phone: data[0].phone,
      salary: data[0].salary,
      joiningDate: data[0].joining_date,
      address: data[0].address,
      active: data[0].active
    } as Staff : null;
  } catch (error) {
    handleError(error as Error, `স্টাফ তৈরি করতে সমস্যা হয়েছে`);
    return null;
  }
};

export const updateStaff = async (id: string, staff: Partial<Staff>) => {
  try {
    // Transform our Staff type to match DB schema
    const updateData: Record<string, any> = {};
    
    if (staff.name !== undefined) updateData.name = staff.name;
    if (staff.position !== undefined) updateData.position = staff.position;
    if (staff.phone !== undefined) updateData.phone = staff.phone;
    if (staff.salary !== undefined) updateData.salary = staff.salary;
    if (staff.joiningDate !== undefined) updateData.joining_date = staff.joiningDate;
    if (staff.address !== undefined) updateData.address = staff.address;
    if (staff.active !== undefined) updateData.active = staff.active;
    
    const { data, error } = await supabase
      .from('staff')
      .update(updateData)
      .eq('id', id)
      .select();

    if (error) {
      throw error;
    }

    toast.success(`স্টাফ সফলভাবে আপডেট করা হয়েছে`);
    
    // Transform the DB response to match our Staff type
    return data?.[0] ? {
      id: data[0].id,
      name: data[0].name,
      position: data[0].position,
      phone: data[0].phone,
      salary: data[0].salary,
      joiningDate: data[0].joining_date,
      address: data[0].address,
      active: data[0].active
    } as Staff : null;
  } catch (error) {
    handleError(error as Error, `স্টাফ আপডেট করতে সমস্যা হয়েছে`);
    return null;
  }
};

export const deleteStaff = async (id: string) => {
  try {
    const { error } = await supabase
      .from('staff')
      .delete()
      .eq('id', id);

    if (error) {
      throw error;
    }

    toast.success(`স্টাফ সফলভাবে মুছে ফেলা হয়েছে`);
    return true;
  } catch (error) {
    handleError(error as Error, `স্টাফ মুছতে সমস্যা হয়েছে`);
    return false;
  }
};

// Donations
export const fetchDonations = async () => {
  try {
    const { data, error } = await supabase
      .from('donations')
      .select('*')
      .order('date', { ascending: false });

    if (error) {
      throw error;
    }

    // Transform DB response to match our Donation type
    return data.map(item => ({
      id: item.id,
      donorName: item.donor_name,
      donorContact: item.donor_contact,
      amount: item.amount,
      date: item.date,
      description: item.description,
      status: item.status,
      createdBy: item.created_by,
      createdAt: item.created_at
    })) as Donation[];
  } catch (error) {
    handleError(error as Error, `ডোনেশন ডাটা লোড করতে সমস্যা হয়েছে`);
    return [];
  }
};

export const createDonation = async (donation: Partial<Donation>) => {
  try {
    const { data, error } = await supabase
      .from('donations')
      .insert([{
        donor_name: donation.donorName,
        donor_contact: donation.donorContact,
        amount: donation.amount,
        date: donation.date || new Date().toISOString(),
        description: donation.description,
        status: donation.status,
        created_by: donation.createdBy,
        created_at: donation.createdAt || new Date().toISOString()
      }])
      .select();

    if (error) {
      throw error;
    }

    toast.success(`নতুন ডোনেশন সফলভাবে তৈরি করা হয়েছে`);
    
    // Transform the DB response to match our Donation type
    return data?.[0] ? {
      id: data[0].id,
      donorName: data[0].donor_name,
      donorContact: data[0].donor_contact,
      amount: data[0].amount,
      date: data[0].date,
      description: data[0].description,
      status: data[0].status,
      createdBy: data[0].created_by,
      createdAt: data[0].created_at
    } as Donation : null;
  } catch (error) {
    handleError(error as Error, `ডোনেশন তৈরি করতে সমস্যা হয়েছে`);
    return null;
  }
};

export const updateDonation = async (id: string, donation: Partial<Donation>) => {
  try {
    // Transform our Donation type to match DB schema
    const updateData: Record<string, any> = {};
    
    if (donation.donorName !== undefined) updateData.donor_name = donation.donorName;
    if (donation.donorContact !== undefined) updateData.donor_contact = donation.donorContact;
    if (donation.amount !== undefined) updateData.amount = donation.amount;
    if (donation.date !== undefined) updateData.date = donation.date;
    if (donation.description !== undefined) updateData.description = donation.description;
    if (donation.status !== undefined) updateData.status = donation.status;
    
    const { data, error } = await supabase
      .from('donations')
      .update(updateData)
      .eq('id', id)
      .select();

    if (error) {
      throw error;
    }

    toast.success(`ডোনেশন সফলভাবে আপডেট করা হয়েছে`);
    
    // Transform the DB response to match our Donation type
    return data?.[0] ? {
      id: data[0].id,
      donorName: data[0].donor_name,
      donorContact: data[0].donor_contact,
      amount: data[0].amount,
      date: data[0].date,
      description: data[0].description,
      status: data[0].status,
      createdBy: data[0].created_by,
      createdAt: data[0].created_at
    } as Donation : null;
  } catch (error) {
    handleError(error as Error, `ডোনেশন আপডেট করতে সমস্যা হয়েছে`);
    return null;
  }
};

export const deleteDonation = async (id: string) => {
  try {
    const { error } = await supabase
      .from('donations')
      .delete()
      .eq('id', id);

    if (error) {
      throw error;
    }

    toast.success(`ডোনেশন সফলভাবে মুছে ফেলা হয়েছে`);
    return true;
  } catch (error) {
    handleError(error as Error, `ডোনেশন মুছতে সমস্যা হয়েছে`);
    return false;
  }
};

// Events
export const fetchEvents = async () => {
  try {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .order('start_date');

    if (error) {
      throw error;
    }

    // Transform DB response to match our Event type
    return data.map(item => ({
      id: item.id,
      title: item.title,
      description: item.description,
      startDate: item.start_date,
      endDate: item.end_date,
      location: item.location,
      createdBy: item.created_by,
      createdAt: item.created_at
    })) as Event[];
  } catch (error) {
    handleError(error as Error, `ইভেন্ট ডাটা লোড করতে সমস্যা হয়েছে`);
    return [];
  }
};

export const createEvent = async (event: Partial<Event>) => {
  try {
    const { data, error } = await supabase
      .from('events')
      .insert([{
        title: event.title,
        description: event.description,
        start_date: event.startDate,
        end_date: event.endDate,
        location: event.location,
        created_by: event.createdBy,
        created_at: event.createdAt || new Date().toISOString()
      }])
      .select();

    if (error) {
      throw error;
    }

    toast.success(`নতুন ইভেন্ট সফলভাবে তৈরি করা হয়েছে`);
    
    // Transform the DB response to match our Event type
    return data?.[0] ? {
      id: data[0].id,
      title: data[0].title,
      description: data[0].description,
      startDate: data[0].start_date,
      endDate: data[0].end_date,
      location: data[0].location,
      createdBy: data[0].created_by,
      createdAt: data[0].created_at
    } as Event : null;
  } catch (error) {
    handleError(error as Error, `ইভেন্ট তৈরি করতে সমস্যা হয়েছে`);
    return null;
  }
};

export const updateEvent = async (id: string, event: Partial<Event>) => {
  try {
    // Transform our Event type to match DB schema
    const updateData: Record<string, any> = {};
    
    if (event.title !== undefined) updateData.title = event.title;
    if (event.description !== undefined) updateData.description = event.description;
    if (event.startDate !== undefined) updateData.start_date = event.startDate;
    if (event.endDate !== undefined) updateData.end_date = event.endDate;
    if (event.location !== undefined) updateData.location = event.location;
    
    const { data, error } = await supabase
      .from('events')
      .update(updateData)
      .eq('id', id)
      .select();

    if (error) {
      throw error;
    }

    toast.success(`ইভেন্ট সফলভাবে আপডেট করা হয়েছে`);
    
    // Transform the DB response to match our Event type
    return data?.[0] ? {
      id: data[0].id,
      title: data[0].title,
      description: data[0].description,
      startDate: data[0].start_date,
      endDate: data[0].end_date,
      location: data[0].location,
      createdBy: data[0].created_by,
      createdAt: data[0].created_at
    } as Event : null;
  } catch (error) {
    handleError(error as Error, `ইভেন্ট আপডেট করতে সমস্যা হয়েছে`);
    return null;
  }
};

export const deleteEvent = async (id: string) => {
  try {
    const { error } = await supabase
      .from('events')
      .delete()
      .eq('id', id);

    if (error) {
      throw error;
    }

    toast.success(`ইভেন্ট সফলভাবে মুছে ফেলা হয়েছে`);
    return true;
  } catch (error) {
    handleError(error as Error, `ইভেন্ট মুছতে সমস্যা হয়েছে`);
    return false;
  }
};

// WhatsApp Notifications
export const fetchNotifications = async (filters?: Record<string, any>) => {
  try {
    let query = supabase
      .from('whatsapp_notifications')
      .select('*')
      .order('created_at', { ascending: false });

    // Apply filters if provided
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        query = query.eq(key, value);
      });
    }

    const { data, error } = await query;

    if (error) {
      throw error;
    }

    // Transform DB response to match our WhatsAppNotification type
    return data.map(item => ({
      id: item.id,
      recipient: item.recipient,
      content: item.content,
      media_url: item.media_url,
      instance_id: item.instance_id,
      status: item.status,
      sentAt: item.sent_at
    })) as WhatsAppNotification[];
  } catch (error) {
    handleError(error as Error, `নোটিফিকেশন ডাটা লোড করতে সমস্যা হয়েছে`);
    return [];
  }
};

export const createNotification = async (notification: Partial<WhatsAppNotification>) => {
  try {
    const { data, error } = await supabase
      .from('whatsapp_notifications')
      .insert([{
        recipient: notification.recipient,
        content: notification.content,
        media_url: notification.media_url,
        instance_id: notification.instance_id,
        status: notification.status,
        sent_at: notification.sentAt
      }])
      .select();

    if (error) {
      throw error;
    }

    toast.success(`নতুন নোটিফিকেশন সফলভাবে তৈরি করা হয়েছে`);
    
    // Transform the DB response to match our WhatsAppNotification type
    return data?.[0] ? {
      id: data[0].id,
      recipient: data[0].recipient,
      content: data[0].content,
      media_url: data[0].media_url,
      instance_id: data[0].instance_id,
      status: data[0].status,
      sentAt: data[0].sent_at
    } as WhatsAppNotification : null;
  } catch (error) {
    handleError(error as Error, `নোটিফিকেশন তৈরি করতে সমস্যা হয়েছে`);
    return null;
  }
};

export const updateNotification = async (id: string, notification: Partial<WhatsAppNotification>) => {
  try {
    // Transform our WhatsAppNotification type to match DB schema
    const updateData: Record<string, any> = {};
    
    if (notification.recipient !== undefined) updateData.recipient = notification.recipient;
    if (notification.content !== undefined) updateData.content = notification.content;
    if (notification.media_url !== undefined) updateData.media_url = notification.media_url;
    if (notification.instance_id !== undefined) updateData.instance_id = notification.instance_id;
    if (notification.status !== undefined) updateData.status = notification.status;
    if (notification.sentAt !== undefined) updateData.sent_at = notification.sentAt;
    
    const { data, error } = await supabase
      .from('whatsapp_notifications')
      .update(updateData)
      .eq('id', id)
      .select();

    if (error) {
      throw error;
    }

    toast.success(`নোটিফিকেশন সফলভাবে আপডেট করা হয়েছে`);
    
    // Transform the DB response to match our WhatsAppNotification type
    return data?.[0] ? {
      id: data[0].id,
      recipient: data[0].recipient,
      content: data[0].content,
      media_url: data[0].media_url,
      instance_id: data[0].instance_id,
      status: data[0].status,
      sentAt: data[0].sent_at
    } as WhatsAppNotification : null;
  } catch (error) {
    handleError(error as Error, `নোটিফিকেশন আপডেট করতে সমস্যা হয়েছে`);
    return null;
  }
};

export const deleteNotification = async (id: string) => {
  try {
    const { error } = await supabase
      .from('whatsapp_notifications')
      .delete()
      .eq('id', id);

    if (error) {
      throw error;
    }

    toast.success(`নোটিফিকেশন সফলভাবে মুছে ফেলা হয়েছে`);
    return true;
  } catch (error) {
    handleError(error as Error, `নোটিফিকেশন মুছতে সমস্যা হয়েছে`);
    return false;
  }
};
