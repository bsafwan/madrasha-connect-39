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
          status: string
          subcategory: string
          title: string
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
          status: string
          subcategory: string
          title: string
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
          status?: string
          subcategory?: string
          title?: string
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
      students: {
        Row: {
          active: boolean
          address: string
          father_name: string
          group_name: string
          id: string
          monthly_fee: number
          mother_name: string
          name: string
          registration_date: string
          whatsapp_number: string
        }
        Insert: {
          active?: boolean
          address: string
          father_name: string
          group_name: string
          id?: string
          monthly_fee: number
          mother_name: string
          name: string
          registration_date?: string
          whatsapp_number: string
        }
        Update: {
          active?: boolean
          address?: string
          father_name?: string
          group_name?: string
          id?: string
          monthly_fee?: number
          mother_name?: string
          name?: string
          registration_date?: string
          whatsapp_number?: string
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
