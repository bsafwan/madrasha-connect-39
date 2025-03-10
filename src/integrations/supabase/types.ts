export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      curriculum: {
        Row: {
          active: boolean
          created_at: string
          description: string | null
          group_name: string
          id: string
          title: string
        }
        Insert: {
          active?: boolean
          created_at?: string
          description?: string | null
          group_name: string
          id?: string
          title: string
        }
        Update: {
          active?: boolean
          created_at?: string
          description?: string | null
          group_name?: string
          id?: string
          title?: string
        }
        Relationships: []
      }
      curriculum_items: {
        Row: {
          created_at: string
          curriculum_id: string
          description: string | null
          duration: string | null
          id: string
          order_number: number
          resources: string | null
          title: string
        }
        Insert: {
          created_at?: string
          curriculum_id: string
          description?: string | null
          duration?: string | null
          id?: string
          order_number: number
          resources?: string | null
          title: string
        }
        Update: {
          created_at?: string
          curriculum_id?: string
          description?: string | null
          duration?: string | null
          id?: string
          order_number?: number
          resources?: string | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "curriculum_items_curriculum_id_fkey"
            columns: ["curriculum_id"]
            isOneToOne: false
            referencedRelation: "curriculum"
            referencedColumns: ["id"]
          },
        ]
      }
      donations: {
        Row: {
          amount: number
          created_at: string
          created_by: string
          date: string
          description: string | null
          donor_contact: string | null
          donor_name: string
          id: string
          status: string
        }
        Insert: {
          amount: number
          created_at?: string
          created_by: string
          date?: string
          description?: string | null
          donor_contact?: string | null
          donor_name: string
          id?: string
          status: string
        }
        Update: {
          amount?: number
          created_at?: string
          created_by?: string
          date?: string
          description?: string | null
          donor_contact?: string | null
          donor_name?: string
          id?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "donations_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      events: {
        Row: {
          created_at: string
          created_by: string
          description: string | null
          end_date: string
          id: string
          location: string | null
          start_date: string
          title: string
        }
        Insert: {
          created_at?: string
          created_by: string
          description?: string | null
          end_date: string
          id?: string
          location?: string | null
          start_date: string
          title: string
        }
        Update: {
          created_at?: string
          created_by?: string
          description?: string | null
          end_date?: string
          id?: string
          location?: string | null
          start_date?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "events_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      exam_results: {
        Row: {
          created_at: string
          exam_id: string
          id: string
          remarks: string | null
          scores: Json
          student_id: string
          total: number
        }
        Insert: {
          created_at?: string
          exam_id: string
          id?: string
          remarks?: string | null
          scores: Json
          student_id: string
          total: number
        }
        Update: {
          created_at?: string
          exam_id?: string
          id?: string
          remarks?: string | null
          scores?: Json
          student_id?: string
          total?: number
        }
        Relationships: [
          {
            foreignKeyName: "exam_results_exam_id_fkey"
            columns: ["exam_id"]
            isOneToOne: false
            referencedRelation: "exams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "exam_results_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      exams: {
        Row: {
          created_at: string
          date: string
          group_name: string
          id: string
          title: string
        }
        Insert: {
          created_at?: string
          date: string
          group_name: string
          id?: string
          title: string
        }
        Update: {
          created_at?: string
          date?: string
          group_name?: string
          id?: string
          title?: string
        }
        Relationships: []
      }
      expenses: {
        Row: {
          amount: number
          category: string
          created_at: string
          created_by: string
          date: string
          description: string | null
          id: string
          payment_method: string | null
          receipt_url: string | null
          status: string
          subcategory: string
          title: string
          updated_at: string
          verified_by: string | null
        }
        Insert: {
          amount: number
          category: string
          created_at?: string
          created_by: string
          date?: string
          description?: string | null
          id?: string
          payment_method?: string | null
          receipt_url?: string | null
          status: string
          subcategory: string
          title: string
          updated_at?: string
          verified_by?: string | null
        }
        Update: {
          amount?: number
          category?: string
          created_at?: string
          created_by?: string
          date?: string
          description?: string | null
          id?: string
          payment_method?: string | null
          receipt_url?: string | null
          status?: string
          subcategory?: string
          title?: string
          updated_at?: string
          verified_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "expenses_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "expenses_verified_by_fkey"
            columns: ["verified_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      fee_structure: {
        Row: {
          admission_fee: number
          annual_fee: number
          created_at: string
          created_by: string
          effective_from: string
          effective_to: string | null
          examination_fee: number
          group_name: string
          id: string
          monthly_fee: number
          other_fees: Json | null
        }
        Insert: {
          admission_fee?: number
          annual_fee?: number
          created_at?: string
          created_by: string
          effective_from: string
          effective_to?: string | null
          examination_fee?: number
          group_name: string
          id?: string
          monthly_fee: number
          other_fees?: Json | null
        }
        Update: {
          admission_fee?: number
          annual_fee?: number
          created_at?: string
          created_by?: string
          effective_from?: string
          effective_to?: string | null
          examination_fee?: number
          group_name?: string
          id?: string
          monthly_fee?: number
          other_fees?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "fee_structure_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      payments: {
        Row: {
          accepted_by: string
          amount: number
          created_at: string
          date: string
          description: string | null
          id: string
          status: string
          student_id: string
          type: string
          updated_at: string
          verified_by: string | null
        }
        Insert: {
          accepted_by: string
          amount: number
          created_at?: string
          date?: string
          description?: string | null
          id?: string
          status: string
          student_id: string
          type: string
          updated_at?: string
          verified_by?: string | null
        }
        Update: {
          accepted_by?: string
          amount?: number
          created_at?: string
          date?: string
          description?: string | null
          id?: string
          status?: string
          student_id?: string
          type?: string
          updated_at?: string
          verified_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payments_accepted_by_fkey"
            columns: ["accepted_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_verified_by_fkey"
            columns: ["verified_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      quran_progress: {
        Row: {
          created_at: string
          date: string
          id: string
          progress: string
          student_id: string
          type: string
          verified_by: string | null
        }
        Insert: {
          created_at?: string
          date?: string
          id?: string
          progress: string
          student_id: string
          type: string
          verified_by?: string | null
        }
        Update: {
          created_at?: string
          date?: string
          id?: string
          progress?: string
          student_id?: string
          type?: string
          verified_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "quran_progress_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quran_progress_verified_by_fkey"
            columns: ["verified_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      staff: {
        Row: {
          active: boolean
          address: string | null
          id: string
          joining_date: string
          name: string
          phone: string
          position: string
          salary: number
        }
        Insert: {
          active?: boolean
          address?: string | null
          id?: string
          joining_date?: string
          name: string
          phone: string
          position: string
          salary: number
        }
        Update: {
          active?: boolean
          address?: string | null
          id?: string
          joining_date?: string
          name?: string
          phone?: string
          position?: string
          salary?: number
        }
        Relationships: []
      }
      staff_salaries: {
        Row: {
          amount: number
          created_at: string
          created_by: string
          id: string
          month: string
          payment_date: string
          staff_id: string
          status: string
          year: number
        }
        Insert: {
          amount: number
          created_at?: string
          created_by: string
          id?: string
          month: string
          payment_date?: string
          staff_id: string
          status: string
          year: number
        }
        Update: {
          amount?: number
          created_at?: string
          created_by?: string
          id?: string
          month?: string
          payment_date?: string
          staff_id?: string
          status?: string
          year?: number
        }
        Relationships: [
          {
            foreignKeyName: "staff_salaries_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "staff_salaries_staff_id_fkey"
            columns: ["staff_id"]
            isOneToOne: false
            referencedRelation: "staff"
            referencedColumns: ["id"]
          },
        ]
      }
      student_assessments: {
        Row: {
          assessment_date: string
          assessment_details: Json
          assessment_type: string
          created_at: string
          created_by: string
          id: string
          remarks: string | null
          student_id: string
        }
        Insert: {
          assessment_date: string
          assessment_details: Json
          assessment_type: string
          created_at?: string
          created_by: string
          id?: string
          remarks?: string | null
          student_id: string
        }
        Update: {
          assessment_date?: string
          assessment_details?: Json
          assessment_type?: string
          created_at?: string
          created_by?: string
          id?: string
          remarks?: string | null
          student_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "student_assessments_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "student_assessments_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      student_attendance: {
        Row: {
          created_at: string
          created_by: string
          date: string
          id: string
          status: string
          student_id: string
        }
        Insert: {
          created_at?: string
          created_by: string
          date: string
          id?: string
          status: string
          student_id: string
        }
        Update: {
          created_at?: string
          created_by?: string
          date?: string
          id?: string
          status?: string
          student_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "student_attendance_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "student_attendance_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      students: {
        Row: {
          active: boolean
          address: string
          assigned_teacher_id: string | null
          birth_date: string | null
          emergency_contact: string | null
          enrollment_number: string | null
          father_name: string
          group_name: string
          guardian_phone: string | null
          id: string
          medical_info: string | null
          monthly_fee: number
          mother_name: string
          name: string
          parent_phone1: string | null
          parent_phone2: string | null
          previous_education: string | null
          registration_date: string
          resign_date: string | null
          resigned: boolean | null
          updated_at: string
          whatsapp_number: string
        }
        Insert: {
          active?: boolean
          address: string
          assigned_teacher_id?: string | null
          birth_date?: string | null
          emergency_contact?: string | null
          enrollment_number?: string | null
          father_name: string
          group_name: string
          guardian_phone?: string | null
          id?: string
          medical_info?: string | null
          monthly_fee: number
          mother_name: string
          name: string
          parent_phone1?: string | null
          parent_phone2?: string | null
          previous_education?: string | null
          registration_date?: string
          resign_date?: string | null
          resigned?: boolean | null
          updated_at?: string
          whatsapp_number: string
        }
        Update: {
          active?: boolean
          address?: string
          assigned_teacher_id?: string | null
          birth_date?: string | null
          emergency_contact?: string | null
          enrollment_number?: string | null
          father_name?: string
          group_name?: string
          guardian_phone?: string | null
          id?: string
          medical_info?: string | null
          monthly_fee?: number
          mother_name?: string
          name?: string
          parent_phone1?: string | null
          parent_phone2?: string | null
          previous_education?: string | null
          registration_date?: string
          resign_date?: string | null
          resigned?: boolean | null
          updated_at?: string
          whatsapp_number?: string
        }
        Relationships: [
          {
            foreignKeyName: "students_assigned_teacher_id_fkey"
            columns: ["assigned_teacher_id"]
            isOneToOne: false
            referencedRelation: "teachers"
            referencedColumns: ["id"]
          },
        ]
      }
      study_materials: {
        Row: {
          created_at: string
          created_by: string
          description: string | null
          file_url: string | null
          group_name: string
          id: string
          title: string
        }
        Insert: {
          created_at?: string
          created_by: string
          description?: string | null
          file_url?: string | null
          group_name: string
          id?: string
          title: string
        }
        Update: {
          created_at?: string
          created_by?: string
          description?: string | null
          file_url?: string | null
          group_name?: string
          id?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "study_materials_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      syllabus: {
        Row: {
          created_at: string
          description: string | null
          group_name: string
          id: string
          title: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          group_name: string
          id?: string
          title: string
        }
        Update: {
          created_at?: string
          description?: string | null
          group_name?: string
          id?: string
          title?: string
        }
        Relationships: []
      }
      syllabus_items: {
        Row: {
          created_at: string
          description: string | null
          id: string
          order_number: number
          syllabus_id: string
          title: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          order_number: number
          syllabus_id: string
          title: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          order_number?: number
          syllabus_id?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "syllabus_items_syllabus_id_fkey"
            columns: ["syllabus_id"]
            isOneToOne: false
            referencedRelation: "syllabus"
            referencedColumns: ["id"]
          },
        ]
      }
      teacher_attendance: {
        Row: {
          created_at: string
          created_by: string
          date: string
          id: string
          status: string
          teacher_id: string
        }
        Insert: {
          created_at?: string
          created_by: string
          date: string
          id?: string
          status: string
          teacher_id: string
        }
        Update: {
          created_at?: string
          created_by?: string
          date?: string
          id?: string
          status?: string
          teacher_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "teacher_attendance_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "teacher_attendance_teacher_id_fkey"
            columns: ["teacher_id"]
            isOneToOne: false
            referencedRelation: "teachers"
            referencedColumns: ["id"]
          },
        ]
      }
      teacher_salaries: {
        Row: {
          amount: number
          created_at: string
          created_by: string
          id: string
          month: string
          payment_date: string
          status: string
          teacher_id: string
          year: number
        }
        Insert: {
          amount: number
          created_at?: string
          created_by: string
          id?: string
          month: string
          payment_date?: string
          status: string
          teacher_id: string
          year: number
        }
        Update: {
          amount?: number
          created_at?: string
          created_by?: string
          id?: string
          month?: string
          payment_date?: string
          status?: string
          teacher_id?: string
          year?: number
        }
        Relationships: [
          {
            foreignKeyName: "teacher_salaries_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "teacher_salaries_teacher_id_fkey"
            columns: ["teacher_id"]
            isOneToOne: false
            referencedRelation: "teachers"
            referencedColumns: ["id"]
          },
        ]
      }
      teachers: {
        Row: {
          active: boolean
          address: string | null
          email: string | null
          id: string
          joining_date: string
          name: string
          phone: string
          qualification: string | null
          salary: number
          specialty: string | null
        }
        Insert: {
          active?: boolean
          address?: string | null
          email?: string | null
          id?: string
          joining_date?: string
          name: string
          phone: string
          qualification?: string | null
          salary: number
          specialty?: string | null
        }
        Update: {
          active?: boolean
          address?: string | null
          email?: string | null
          id?: string
          joining_date?: string
          name?: string
          phone?: string
          qualification?: string | null
          salary?: number
          specialty?: string | null
        }
        Relationships: []
      }
      timetable_slots: {
        Row: {
          created_at: string
          end_time: string
          id: string
          start_time: string
          subject: string
          teacher_id: string | null
          timetable_id: string
        }
        Insert: {
          created_at?: string
          end_time: string
          id?: string
          start_time: string
          subject: string
          teacher_id?: string | null
          timetable_id: string
        }
        Update: {
          created_at?: string
          end_time?: string
          id?: string
          start_time?: string
          subject?: string
          teacher_id?: string | null
          timetable_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "timetable_slots_teacher_id_fkey"
            columns: ["teacher_id"]
            isOneToOne: false
            referencedRelation: "teachers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "timetable_slots_timetable_id_fkey"
            columns: ["timetable_id"]
            isOneToOne: false
            referencedRelation: "timetables"
            referencedColumns: ["id"]
          },
        ]
      }
      timetables: {
        Row: {
          active: boolean
          created_at: string
          day_of_week: string
          group_name: string
          id: string
        }
        Insert: {
          active?: boolean
          created_at?: string
          day_of_week: string
          group_name: string
          id?: string
        }
        Update: {
          active?: boolean
          created_at?: string
          day_of_week?: string
          group_name?: string
          id?: string
        }
        Relationships: []
      }
      users: {
        Row: {
          created_at: string
          email: string
          id: string
          name: string
          password: string
          phone: string
          role: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          name: string
          password: string
          phone: string
          role: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          name?: string
          password?: string
          phone?: string
          role?: string
        }
        Relationships: []
      }
      whatsapp_notifications: {
        Row: {
          content: string
          created_at: string
          id: string
          instance_id: string
          media_url: string | null
          recipient: string
          sent_at: string | null
          status: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          instance_id: string
          media_url?: string | null
          recipient: string
          sent_at?: string | null
          status: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          instance_id?: string
          media_url?: string | null
          recipient?: string
          sent_at?: string | null
          status?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
