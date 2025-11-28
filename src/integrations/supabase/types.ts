export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export type Database = {
    // Allows to automatically instantiate createClient with right options
    // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
    __InternalSupabase: {
        PostgrestVersion: "13.0.5"
    }
    public: {
        Tables: {
            classes: {
                Row: {
                    category: string
                    created_at: string
                    current_students: number | null
                    description: string
                    id: string
                    image_url: string | null
                    location: string
                    max_students: number | null
                    price: number
                    schedule: string
                    teacher_id: string
                    title: string
                    updated_at: string
                }
                Insert: {
                    category: string
                    created_at?: string
                    current_students?: number | null
                    description: string
                    id?: string
                    image_url?: string | null
                    location: string
                    max_students?: number | null
                    price: number
                    schedule: string
                    teacher_id: string
                    title: string
                    updated_at?: string
                }
                Update: {
                    category?: string
                    created_at?: string
                    current_students?: number | null
                    description?: string
                    id?: string
                    image_url?: string | null
                    location?: string
                    max_students?: number | null
                    price?: number
                    schedule?: string
                    teacher_id?: string
                    title?: string
                    updated_at?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "classes_teacher_id_fkey"
                        columns: ["teacher_id"]
                        isOneToOne: false
                        referencedRelation: "profiles"
                        referencedColumns: ["id"]
                    },
                ]
            }
            profiles: {
                Row: {
                    bio: string | null
                    contact: string | null
                    created_at: string
                    id: string
                    name: string
                    profile_image: string | null
                    role: Database["public"]["Enums"]["user_role"]
                    updated_at: string
                }
                Insert: {
                    bio?: string | null
                    contact?: string | null
                    created_at?: string
                    id: string
                    name: string
                    profile_image?: string | null
                    role?: Database["public"]["Enums"]["user_role"]
                    updated_at?: string
                }
                Update: {
                    bio?: string | null
                    contact?: string | null
                    created_at?: string
                    id?: string
                    name?: string
                    profile_image?: string | null
                    role?: Database["public"]["Enums"]["user_role"]
                    updated_at?: string
                }
                Relationships: []
            }
            reservations: {
                Row: {
                    class_id: string
                    created_at: string
                    id: string
                    status: Database["public"]["Enums"]["reservation_status"]
                    student_id: string
                    updated_at: string
                }
                Insert: {
                    class_id: string
                    created_at?: string
                    id?: string
                    status?: Database["public"]["Enums"]["reservation_status"]
                    student_id: string
                    updated_at?: string
                }
                Update: {
                    class_id?: string
                    created_at?: string
                    id?: string
                    status?: Database["public"]["Enums"]["reservation_status"]
                    student_id?: string
                    updated_at?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "reservations_class_id_fkey"
                        columns: ["class_id"]
                        isOneToOne: false
                        referencedRelation: "classes"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "reservations_student_id_fkey"
                        columns: ["student_id"]
                        isOneToOne: false
                        referencedRelation: "profiles"
                        referencedColumns: ["id"]
                    },
                ]
            }
            reviews: {
                Row: {
                    class_id: string
                    comment: string | null
                    created_at: string
                    id: string
                    rating: number
                    student_id: string
                    updated_at: string
                }
                Insert: {
                    class_id: string
                    comment?: string | null
                    created_at?: string
                    id?: string
                    rating: number
                    student_id: string
                    updated_at?: string
                }
                Update: {
                    class_id?: string
                    comment?: string | null
                    created_at?: string
                    id?: string
                    rating?: number
                    student_id?: string
                    updated_at?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "reviews_class_id_fkey"
                        columns: ["class_id"]
                        isOneToOne: false
                        referencedRelation: "classes"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "reviews_student_id_fkey"
                        columns: ["student_id"]
                        isOneToOne: false
                        referencedRelation: "profiles"
                        referencedColumns: ["id"]
                    },
                ]
            }
        }
        Views: {
            [_ in never]: never
        }
        Functions: {
            [_ in never]: never
        }
        Enums: {
            reservation_status: "reserved" | "canceled" | "completed"
            user_role: "teacher" | "student" | "admin"
        }
        CompositeTypes: {
            [_ in never]: never
        }
    }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
    DefaultSchemaTableNameOrOptions extends
            | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
        | { schema: keyof DatabaseWithoutInternals },
    TableName extends DefaultSchemaTableNameOrOptions extends {
            schema: keyof DatabaseWithoutInternals
        }
        ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
            DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
        : never = never,
> = DefaultSchemaTableNameOrOptions extends {
        schema: keyof DatabaseWithoutInternals
    }
    ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
            Row: infer R
        }
        ? R
        : never
    : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
            DefaultSchema["Views"])
        ? (DefaultSchema["Tables"] &
            DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
                Row: infer R
            }
            ? R
            : never
        : never

export type TablesInsert<
    DefaultSchemaTableNameOrOptions extends
            | keyof DefaultSchema["Tables"]
        | { schema: keyof DatabaseWithoutInternals },
    TableName extends DefaultSchemaTableNameOrOptions extends {
            schema: keyof DatabaseWithoutInternals
        }
        ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
        : never = never,
> = DefaultSchemaTableNameOrOptions extends {
        schema: keyof DatabaseWithoutInternals
    }
    ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
            Insert: infer I
        }
        ? I
        : never
    : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
        ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
                Insert: infer I
            }
            ? I
            : never
        : never

export type TablesUpdate<
    DefaultSchemaTableNameOrOptions extends
            | keyof DefaultSchema["Tables"]
        | { schema: keyof DatabaseWithoutInternals },
    TableName extends DefaultSchemaTableNameOrOptions extends {
            schema: keyof DatabaseWithoutInternals
        }
        ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
        : never = never,
> = DefaultSchemaTableNameOrOptions extends {
        schema: keyof DatabaseWithoutInternals
    }
    ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
            Update: infer U
        }
        ? U
        : never
    : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
        ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
                Update: infer U
            }
            ? U
            : never
        : never

export type Enums<
    DefaultSchemaEnumNameOrOptions extends
            | keyof DefaultSchema["Enums"]
        | { schema: keyof DatabaseWithoutInternals },
    EnumName extends DefaultSchemaEnumNameOrOptions extends {
            schema: keyof DatabaseWithoutInternals
        }
        ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
        : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
        schema: keyof DatabaseWithoutInternals
    }
    ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
    : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
        ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
        : never

export type CompositeTypes<
    PublicCompositeTypeNameOrOptions extends
            | keyof DefaultSchema["CompositeTypes"]
        | { schema: keyof DatabaseWithoutInternals },
    CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
            schema: keyof DatabaseWithoutInternals
        }
        ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
        : never = never,
> = PublicCompositeTypeNameOrOptions extends {
        schema: keyof DatabaseWithoutInternals
    }
    ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
    : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
        ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
        : never

export const Constants = {
    public: {
        Enums: {
            reservation_status: ["reserved", "canceled", "completed"],
            user_role: ["teacher", "student", "admin"],
        },
    },
} as const