export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      groups: {
        Row: {
          id: string
          code: string
          name: string
          pin_hash: string
          created_at: string
        }
        Insert: {
          id?: string
          code: string
          name: string
          pin_hash: string
          created_at?: string
        }
        Update: {
          id?: string
          code?: string
          name?: string
          pin_hash?: string
          created_at?: string
        }
      }
      tournaments: {
        Row: {
          id: string
          group_id: string
          created_at: string
          buy_in: number
          bounty: number | null
          rake: number
          prize_pool: number
          bounty_pool: number | null
          regular_pool: number | null
          payouts_json: Json | null
          currency?: string | null
          name?: string | null
        }
        Insert: {
          id?: string
          group_id: string
          created_at?: string
          buy_in: number
          bounty?: number | null
          rake?: number
          prize_pool: number
          bounty_pool?: number | null
          regular_pool?: number | null
          payouts_json?: Json | null
          currency?: string | null
          name?: string | null
        }
        Update: {
          id?: string
          group_id?: string
          created_at?: string
          buy_in?: number
          bounty?: number | null
          rake?: number
          prize_pool?: number
          bounty_pool?: number | null
          regular_pool?: number | null
          payouts_json?: Json | null
          currency?: string | null
          name?: string | null
        }
      }
      participants: {
        Row: {
          id: string
          tournament_id: string
          name: string
          buy_ins: number
          place: number | null
          won_amount: number
        }
        Insert: {
          id?: string
          tournament_id: string
          name: string
          buy_ins?: number
          place?: number | null
          won_amount?: number
        }
        Update: {
          id?: string
          tournament_id?: string
          name?: string
          buy_ins?: number
          place?: number | null
          won_amount?: number
        }
      }
      known_names: {
        Row: {
          group_id: string
          name: string
        }
        Insert: {
          group_id: string
          name: string
        }
        Update: {
          group_id?: string
          name?: string
        }
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
  }
}

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (Database["public"]["Tables"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"])
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database["public"]["Tables"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (Database["public"]["Tables"])
  ? (Database["public"]["Tables"][PublicTableNameOrOptions]) extends {
      Row: infer R
    }
    ? R
    : never
  : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
  ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
      Insert: infer I
    }
    ? I
    : never
  : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
  ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
      Update: infer U
    }
    ? U
    : never
  : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof Database["public"]["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof Database["public"]["Enums"]
  ? Database["public"]["Enums"][PublicEnumNameOrOptions]
  : never