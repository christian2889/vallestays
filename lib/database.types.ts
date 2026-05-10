export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      properties: {
        Row: {
          address: string
          average_rating: number | null
          bathrooms: number
          bedrooms: number
          beds: number
          cancellation_policy: string | null
          check_in_instructions: string | null
          check_in_instructions_es: string | null
          check_in_time: string | null
          check_out_time: string | null
          city: string
          cleaning_fee: number | null
          cohost_enabled: boolean | null
          country: string | null
          created_at: string | null
          currency: string | null
          description: string
          description_es: string | null
          destination_id: string | null
          guesty_id: string | null
          host_id: string
          id: string
          instant_booking: boolean | null
          is_featured: boolean | null
          last_synced_at: string | null
          latitude: number | null
          longitude: number | null
          max_guests: number
          max_nights: number | null
          min_nights: number | null
          price_per_night: number
          price_usd: number | null
          property_type: string
          review_count: number | null
          service_fee_percent: number | null
          site: string
          slug: string
          state: string | null
          status: string | null
          title: string
          title_es: string | null
          updated_at: string | null
          weekend_price: number | null
        }
        Insert: Partial<Database["public"]["Tables"]["properties"]["Row"]> & {
          address: string
          city: string
          description: string
          host_id: string
          price_per_night: number
          property_type: string
          slug: string
          title: string
        }
        Update: Partial<Database["public"]["Tables"]["properties"]["Row"]>
      }
      property_images: {
        Row: {
          alt_text: string | null
          created_at: string | null
          id: string
          is_primary: boolean | null
          property_id: string
          sort_order: number | null
          url: string
        }
        Insert: Partial<Database["public"]["Tables"]["property_images"]["Row"]> & {
          property_id: string
          url: string
        }
        Update: Partial<Database["public"]["Tables"]["property_images"]["Row"]>
      }
      destinations: {
        Row: {
          created_at: string | null
          description: string | null
          description_es: string | null
          id: string
          image_url: string | null
          name: string
          name_es: string
          site: string
          slug: string
        }
        Insert: Partial<Database["public"]["Tables"]["destinations"]["Row"]> & {
          name: string
          name_es: string
          slug: string
        }
        Update: Partial<Database["public"]["Tables"]["destinations"]["Row"]>
      }
      bookings: {
        Row: {
          check_in: string
          check_out: string
          cleaning_fee: number | null
          created_at: string | null
          currency: string | null
          discount_amount: number | null
          guest_id: string
          guest_notes: string | null
          guests_count: number
          host_id: string
          host_payout: number
          id: string
          nights: number
          payment_method: string | null
          payment_status: string | null
          price_per_night: number
          property_id: string
          service_fee: number
          site: string
          status: string | null
          subtotal: number
          total_price: number
          updated_at: string | null
        }
        Insert: {
          check_in: string
          check_out: string
          cleaning_fee?: number | null
          currency?: string | null
          discount_amount?: number | null
          guest_id: string
          guest_notes?: string | null
          guests_count?: number
          host_id: string
          host_payout: number
          id?: string
          nights: number
          payment_method?: string | null
          payment_status?: string | null
          price_per_night: number
          property_id: string
          service_fee: number
          site?: string
          status?: string | null
          subtotal: number
          total_price: number
        }
        Update: Partial<Database["public"]["Tables"]["bookings"]["Insert"]>
      }
      leads: {
        Row: {
          assigned_to: string | null
          check_in: string | null
          check_out: string | null
          created_at: string | null
          email: string
          guests_count: number | null
          id: string
          name: string
          notes: string | null
          phone: string | null
          property_id: string | null
          site: string
          source: string
          status: string
          updated_at: string | null
        }
        Insert: {
          assigned_to?: string | null
          check_in?: string | null
          check_out?: string | null
          email: string
          guests_count?: number | null
          id?: string
          name: string
          notes?: string | null
          phone?: string | null
          property_id?: string | null
          site?: string
          source?: string
          status?: string
        }
        Update: Partial<Database["public"]["Tables"]["leads"]["Insert"]>
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string | null
          email: string
          full_name: string | null
          id: string
          phone: string | null
          preferred_language: string | null
          role: string
        }
        Insert: Partial<Database["public"]["Tables"]["profiles"]["Row"]> & {
          email: string
          id: string
        }
        Update: Partial<Database["public"]["Tables"]["profiles"]["Row"]>
      }
    }
    Views: { [_ in never]: never }
    Functions: { [_ in never]: never }
    Enums: { [_ in never]: never }
    CompositeTypes: { [_ in never]: never }
  }
}

export type DBProperty = Database["public"]["Tables"]["properties"]["Row"]
export type DBPropertyImage = Database["public"]["Tables"]["property_images"]["Row"]
export type DBDestination = Database["public"]["Tables"]["destinations"]["Row"]
export type DBBooking = Database["public"]["Tables"]["bookings"]["Row"]
export type DBBookingInsert = Database["public"]["Tables"]["bookings"]["Insert"]
export type DBLeadInsert = Database["public"]["Tables"]["leads"]["Insert"]
