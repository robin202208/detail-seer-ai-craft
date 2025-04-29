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
      admin_users: {
        Row: {
          created_at: string
          id: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          user_id?: string | null
        }
        Relationships: []
      }
      agent_conversations: {
        Row: {
          created_at: string | null
          id: string
          title: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          title: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          title?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      agents: {
        Row: {
          capabilities: string[] | null
          created_at: string | null
          description: string | null
          id: string
          name: string
          system_prompt: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          capabilities?: string[] | null
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          system_prompt: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          capabilities?: string[] | null
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          system_prompt?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      ai_conversations: {
        Row: {
          created_at: string | null
          id: string
          title: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          title?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          title?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      ai_messages: {
        Row: {
          content: string
          conversation_id: string | null
          created_at: string | null
          id: string
          role: string
        }
        Insert: {
          content: string
          conversation_id?: string | null
          created_at?: string | null
          id?: string
          role: string
        }
        Update: {
          content?: string
          conversation_id?: string | null
          created_at?: string | null
          id?: string
          role?: string
        }
        Relationships: [
          {
            foreignKeyName: "ai_messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "ai_conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      ai_models: {
        Row: {
          api_key_required: boolean
          created_at: string
          description: string | null
          endpoint: string | null
          id: string
          model_type: string
          name: string
          provider: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          api_key_required?: boolean
          created_at?: string
          description?: string | null
          endpoint?: string | null
          id?: string
          model_type: string
          name: string
          provider: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          api_key_required?: boolean
          created_at?: string
          description?: string | null
          endpoint?: string | null
          id?: string
          model_type?: string
          name?: string
          provider?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      api_keys: {
        Row: {
          created_at: string
          id: string
          key_value: string
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          key_value: string
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          key_value?: string
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      bookings: {
        Row: {
          attendees: number
          created_at: string
          date: string
          end_time: string
          id: string
          room_id: string
          start_time: string
          status: string
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          attendees?: number
          created_at?: string
          date: string
          end_time: string
          id?: string
          room_id: string
          start_time: string
          status?: string
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          attendees?: number
          created_at?: string
          date?: string
          end_time?: string
          id?: string
          room_id?: string
          start_time?: string
          status?: string
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "bookings_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "rooms"
            referencedColumns: ["id"]
          },
        ]
      }
      cart_items: {
        Row: {
          created_at: string | null
          id: string
          product_id: string
          quantity: number
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          product_id: string
          quantity?: number
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          product_id?: string
          quantity?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "cart_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_history: {
        Row: {
          answer: string
          created_at: string
          id: string
          knowledge_base_id: string | null
          question: string
          user_id: string | null
        }
        Insert: {
          answer: string
          created_at?: string
          id?: string
          knowledge_base_id?: string | null
          question: string
          user_id?: string | null
        }
        Update: {
          answer?: string
          created_at?: string
          id?: string
          knowledge_base_id?: string | null
          question?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "chat_history_knowledge_base_id_fkey"
            columns: ["knowledge_base_id"]
            isOneToOne: false
            referencedRelation: "knowledge_bases"
            referencedColumns: ["id"]
          },
        ]
      }
      conversation_messages: {
        Row: {
          agent_id: string | null
          content: string
          conversation_id: string | null
          created_at: string | null
          id: string
          metadata: Json | null
          role: string
        }
        Insert: {
          agent_id?: string | null
          content: string
          conversation_id?: string | null
          created_at?: string | null
          id?: string
          metadata?: Json | null
          role: string
        }
        Update: {
          agent_id?: string | null
          content?: string
          conversation_id?: string | null
          created_at?: string | null
          id?: string
          metadata?: Json | null
          role?: string
        }
        Relationships: [
          {
            foreignKeyName: "conversation_messages_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "agents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "conversation_messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "agent_conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      crawl_configs: {
        Row: {
          created_at: string
          get_comments: boolean
          get_user_ids: boolean
          id: string
          max_results: number
          platform: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          get_comments?: boolean
          get_user_ids?: boolean
          id?: string
          max_results?: number
          platform: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          get_comments?: boolean
          get_user_ids?: boolean
          id?: string
          max_results?: number
          platform?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      crawl_results: {
        Row: {
          created_at: string
          data: Json
          id: string
          platform: string
          source_url: string
          status: string
          target_type: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          data: Json
          id?: string
          platform: string
          source_url: string
          status?: string
          target_type: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          data?: Json
          id?: string
          platform?: string
          source_url?: string
          status?: string
          target_type?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      daily_fortunes: {
        Row: {
          created_at: string | null
          date: string
          hexagram_name: string
          hexagram_number: number
          id: string
          interpretation: string
        }
        Insert: {
          created_at?: string | null
          date: string
          hexagram_name: string
          hexagram_number: number
          id?: string
          interpretation: string
        }
        Update: {
          created_at?: string | null
          date?: string
          hexagram_name?: string
          hexagram_number?: number
          id?: string
          interpretation?: string
        }
        Relationships: []
      }
      data_analytics: {
        Row: {
          created_at: string | null
          data_type: string
          description: string | null
          id: string
          metrics: Json | null
          title: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          data_type: string
          description?: string | null
          id?: string
          metrics?: Json | null
          title: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          data_type?: string
          description?: string | null
          id?: string
          metrics?: Json | null
          title?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      data_processing_results: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          input_data: Json
          name: string
          operation_type: string
          result_data: Json
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          input_data: Json
          name: string
          operation_type: string
          result_data: Json
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          input_data?: Json
          name?: string
          operation_type?: string
          result_data?: Json
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      data_sets: {
        Row: {
          created_at: string | null
          data: Json
          description: string | null
          id: string
          name: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          data: Json
          description?: string | null
          id?: string
          name: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          data?: Json
          description?: string | null
          id?: string
          name?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      demo_requests: {
        Row: {
          company: string
          created_at: string
          email: string
          id: string
          job_title: string
          name: string
          needs: string | null
          phone: string
          status: string
          updated_at: string
        }
        Insert: {
          company: string
          created_at?: string
          email: string
          id?: string
          job_title: string
          name: string
          needs?: string | null
          phone: string
          status?: string
          updated_at?: string
        }
        Update: {
          company?: string
          created_at?: string
          email?: string
          id?: string
          job_title?: string
          name?: string
          needs?: string | null
          phone?: string
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      documents: {
        Row: {
          content: string | null
          created_at: string
          embedding: string | null
          file_path: string | null
          file_size: number | null
          file_type: string | null
          id: string
          knowledge_base_id: string | null
          title: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          content?: string | null
          created_at?: string
          embedding?: string | null
          file_path?: string | null
          file_size?: number | null
          file_type?: string | null
          id?: string
          knowledge_base_id?: string | null
          title: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          content?: string | null
          created_at?: string
          embedding?: string | null
          file_path?: string | null
          file_size?: number | null
          file_type?: string | null
          id?: string
          knowledge_base_id?: string | null
          title?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "documents_knowledge_base_id_fkey"
            columns: ["knowledge_base_id"]
            isOneToOne: false
            referencedRelation: "knowledge_bases"
            referencedColumns: ["id"]
          },
        ]
      }
      event_registrations: {
        Row: {
          created_at: string | null
          event_id: string
          id: string
          status: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          event_id: string
          id?: string
          status?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          event_id?: string
          id?: string
          status?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "event_registrations_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "event_registrations_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      events: {
        Row: {
          capacity: number | null
          created_at: string | null
          description: string | null
          event_date: string
          id: string
          image_url: string | null
          location: string | null
          price: number | null
          status: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          capacity?: number | null
          created_at?: string | null
          description?: string | null
          event_date: string
          id?: string
          image_url?: string | null
          location?: string | null
          price?: number | null
          status?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          capacity?: number | null
          created_at?: string | null
          description?: string | null
          event_date?: string
          id?: string
          image_url?: string | null
          location?: string | null
          price?: number | null
          status?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      file_analysis: {
        Row: {
          created_at: string
          file_name: string
          id: string
          processed_chunks: number | null
          result: string | null
          status: string | null
          total_chunks: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          file_name: string
          id?: string
          processed_chunks?: number | null
          result?: string | null
          status?: string | null
          total_chunks: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          file_name?: string
          id?: string
          processed_chunks?: number | null
          result?: string | null
          status?: string | null
          total_chunks?: number
          updated_at?: string
        }
        Relationships: []
      }
      files: {
        Row: {
          content_type: string | null
          created_at: string | null
          file_path: string
          filename: string
          id: string
          size: number | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          content_type?: string | null
          created_at?: string | null
          file_path: string
          filename: string
          id?: string
          size?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          content_type?: string | null
          created_at?: string | null
          file_path?: string
          filename?: string
          id?: string
          size?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      fine_tuning_jobs: {
        Row: {
          created_at: string
          description: string | null
          id: string
          model_id: string
          name: string
          parameters: Json | null
          status: string
          training_file: string | null
          updated_at: string
          user_id: string | null
          validation_file: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          model_id: string
          name: string
          parameters?: Json | null
          status?: string
          training_file?: string | null
          updated_at?: string
          user_id?: string | null
          validation_file?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          model_id?: string
          name?: string
          parameters?: Json | null
          status?: string
          training_file?: string | null
          updated_at?: string
          user_id?: string | null
          validation_file?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fine_tuning_jobs_model_id_fkey"
            columns: ["model_id"]
            isOneToOne: false
            referencedRelation: "ai_models"
            referencedColumns: ["id"]
          },
        ]
      }
      industry_conversations: {
        Row: {
          ai_response: string
          created_at: string
          id: string
          industry: string
          user_query: string
        }
        Insert: {
          ai_response: string
          created_at?: string
          id?: string
          industry: string
          user_query: string
        }
        Update: {
          ai_response?: string
          created_at?: string
          id?: string
          industry?: string
          user_query?: string
        }
        Relationships: []
      }
      industry_leads: {
        Row: {
          business_needs: string[]
          company_name: string
          company_size: string
          contact_email: string | null
          contact_name: string
          contact_phone: string | null
          contact_title: string
          created_at: string
          id: string
          industry: string
          interest_level: number
          region: string
          updated_at: string
        }
        Insert: {
          business_needs: string[]
          company_name: string
          company_size: string
          contact_email?: string | null
          contact_name: string
          contact_phone?: string | null
          contact_title: string
          created_at?: string
          id?: string
          industry: string
          interest_level: number
          region: string
          updated_at?: string
        }
        Update: {
          business_needs?: string[]
          company_name?: string
          company_size?: string
          contact_email?: string | null
          contact_name?: string
          contact_phone?: string | null
          contact_title?: string
          created_at?: string
          id?: string
          industry?: string
          interest_level?: number
          region?: string
          updated_at?: string
        }
        Relationships: []
      }
      industry_market_data: {
        Row: {
          consumer_preferences: string[]
          created_at: string
          entry_barriers: string[]
          growth_rate: number
          id: string
          industry: string
          key_trends: string[]
          market_size: number
          region: string
          regulations: string[]
          updated_at: string
        }
        Insert: {
          consumer_preferences: string[]
          created_at?: string
          entry_barriers: string[]
          growth_rate: number
          id?: string
          industry: string
          key_trends: string[]
          market_size: number
          region: string
          regulations: string[]
          updated_at?: string
        }
        Update: {
          consumer_preferences?: string[]
          created_at?: string
          entry_barriers?: string[]
          growth_rate?: number
          id?: string
          industry?: string
          key_trends?: string[]
          market_size?: number
          region?: string
          regulations?: string[]
          updated_at?: string
        }
        Relationships: []
      }
      investor_contacts: {
        Row: {
          created_at: string
          id: string
          investor_id: string
          message: string
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          investor_id: string
          message: string
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          investor_id?: string
          message?: string
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "investor_contacts_investor_id_fkey"
            columns: ["investor_id"]
            isOneToOne: false
            referencedRelation: "investors"
            referencedColumns: ["id"]
          },
        ]
      }
      investors: {
        Row: {
          contact_email: string | null
          contact_phone: string | null
          created_at: string
          description: string
          focus_industries: string[] | null
          id: string
          investment_stage: string[]
          investment_type: string[]
          location: string | null
          logo_url: string | null
          max_investment: number | null
          min_investment: number | null
          name: string
          updated_at: string
          user_id: string | null
          website: string | null
        }
        Insert: {
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string
          description: string
          focus_industries?: string[] | null
          id?: string
          investment_stage: string[]
          investment_type: string[]
          location?: string | null
          logo_url?: string | null
          max_investment?: number | null
          min_investment?: number | null
          name: string
          updated_at?: string
          user_id?: string | null
          website?: string | null
        }
        Update: {
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string
          description?: string
          focus_industries?: string[] | null
          id?: string
          investment_stage?: string[]
          investment_type?: string[]
          location?: string | null
          logo_url?: string | null
          max_investment?: number | null
          min_investment?: number | null
          name?: string
          updated_at?: string
          user_id?: string | null
          website?: string | null
        }
        Relationships: []
      }
      knowledge_bases: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      life_consultations: {
        Row: {
          created_at: string
          id: string
          points_spent: number
          question: string
          response: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          points_spent?: number
          question: string
          response: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          points_spent?: number
          question?: string
          response?: string
          user_id?: string | null
        }
        Relationships: []
      }
      member_levels: {
        Row: {
          created_at: string
          description: string | null
          discount_percent: number
          id: number
          max_booking_days: number
          name: string
          price: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          discount_percent?: number
          id?: number
          max_booking_days?: number
          name: string
          price: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          discount_percent?: number
          id?: number
          max_booking_days?: number
          name?: string
          price?: number
          updated_at?: string
        }
        Relationships: []
      }
      membership_benefits: {
        Row: {
          benefit: string
          created_at: string
          description: string | null
          id: string
          level: Database["public"]["Enums"]["member_level"]
        }
        Insert: {
          benefit: string
          created_at?: string
          description?: string | null
          id?: string
          level: Database["public"]["Enums"]["member_level"]
        }
        Update: {
          benefit?: string
          created_at?: string
          description?: string | null
          id?: string
          level?: Database["public"]["Enums"]["member_level"]
        }
        Relationships: []
      }
      memberships: {
        Row: {
          created_at: string
          end_date: string | null
          id: string
          level: Database["public"]["Enums"]["member_level"]
          points: number
          start_date: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          end_date?: string | null
          id?: string
          level?: Database["public"]["Enums"]["member_level"]
          points?: number
          start_date?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          end_date?: string | null
          id?: string
          level?: Database["public"]["Enums"]["member_level"]
          points?: number
          start_date?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "memberships_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      order_items: {
        Row: {
          created_at: string | null
          id: string
          order_id: string
          product_id: string
          quantity: number
          unit_price: number
        }
        Insert: {
          created_at?: string | null
          id?: string
          order_id: string
          product_id: string
          quantity: number
          unit_price: number
        }
        Update: {
          created_at?: string | null
          id?: string
          order_id?: string
          product_id?: string
          quantity?: number
          unit_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          created_at: string | null
          delivery_address: string | null
          delivery_name: string | null
          delivery_phone: string | null
          id: string
          status: string | null
          total_amount: number
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          delivery_address?: string | null
          delivery_name?: string | null
          delivery_phone?: string | null
          id?: string
          status?: string | null
          total_amount: number
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          delivery_address?: string | null
          delivery_name?: string | null
          delivery_phone?: string | null
          id?: string
          status?: string | null
          total_amount?: number
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "orders_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      payments: {
        Row: {
          amount: number
          created_at: string
          id: string
          payment_for: string
          payment_method: string
          reference_id: string | null
          status: string
          transaction_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          id?: string
          payment_for: string
          payment_method: string
          reference_id?: string | null
          status?: string
          transaction_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          id?: string
          payment_for?: string
          payment_method?: string
          reference_id?: string | null
          status?: string
          transaction_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      point_redemptions: {
        Row: {
          created_at: string
          id: string
          item_id: string
          points_spent: number
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          item_id: string
          points_spent: number
          status: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          item_id?: string
          points_spent?: number
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "point_redemptions_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "point_shop_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "point_redemptions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      point_shop_items: {
        Row: {
          created_at: string
          description: string | null
          id: string
          image_url: string | null
          name: string
          points_required: number
          stock: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          name: string
          points_required: number
          stock?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          name?: string
          points_required?: number
          stock?: number
          updated_at?: string
        }
        Relationships: []
      }
      point_transactions: {
        Row: {
          created_at: string
          description: string
          id: string
          points: number
          type: string
          user_id: string
        }
        Insert: {
          created_at?: string
          description: string
          id?: string
          points: number
          type: string
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string
          id?: string
          points?: number
          type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "point_transactions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          category: string
          created_at: string | null
          description: string | null
          id: string
          image_url: string | null
          name: string
          price: number
          stock_quantity: number
          updated_at: string | null
        }
        Insert: {
          category: string
          created_at?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          name: string
          price: number
          stock_quantity?: number
          updated_at?: string | null
        }
        Update: {
          category?: string
          created_at?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          name?: string
          price?: number
          stock_quantity?: number
          updated_at?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          id: string
          updated_at: string | null
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          id: string
          updated_at?: string | null
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          id?: string
          updated_at?: string | null
          username?: string | null
        }
        Relationships: []
      }
      prompt_templates: {
        Row: {
          content: string
          created_at: string
          description: string | null
          id: string
          name: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          content: string
          created_at?: string
          description?: string | null
          id?: string
          name: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          content?: string
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      rooms: {
        Row: {
          amenities: string[] | null
          capacity: number
          created_at: string
          id: string
          image_url: string | null
          location: string
          name: string
          updated_at: string
        }
        Insert: {
          amenities?: string[] | null
          capacity: number
          created_at?: string
          id?: string
          image_url?: string | null
          location: string
          name: string
          updated_at?: string
        }
        Update: {
          amenities?: string[] | null
          capacity?: number
          created_at?: string
          id?: string
          image_url?: string | null
          location?: string
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      saved_requests: {
        Row: {
          body: string | null
          created_at: string | null
          folder: string | null
          headers: Json | null
          id: string
          method: string
          name: string
          updated_at: string | null
          url: string
          user_id: string
        }
        Insert: {
          body?: string | null
          created_at?: string | null
          folder?: string | null
          headers?: Json | null
          id?: string
          method: string
          name: string
          updated_at?: string | null
          url: string
          user_id: string
        }
        Update: {
          body?: string | null
          created_at?: string | null
          folder?: string | null
          headers?: Json | null
          id?: string
          method?: string
          name?: string
          updated_at?: string | null
          url?: string
          user_id?: string
        }
        Relationships: []
      }
      search_history: {
        Row: {
          created_at: string
          id: string
          query: string
          results: Json | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          query: string
          results?: Json | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          query?: string
          results?: Json | null
          user_id?: string | null
        }
        Relationships: []
      }
      signal_applications: {
        Row: {
          applied_at: string | null
          created_at: string | null
          id: string
          signal_id: number
          status: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          applied_at?: string | null
          created_at?: string | null
          id?: string
          signal_id: number
          status?: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          applied_at?: string | null
          created_at?: string | null
          id?: string
          signal_id?: number
          status?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "signal_applications_signal_id_fkey"
            columns: ["signal_id"]
            isOneToOne: false
            referencedRelation: "trading_signals"
            referencedColumns: ["id"]
          },
        ]
      }
      subscribers: {
        Row: {
          created_at: string
          email: string
          id: string
          stripe_customer_id: string | null
          subscribed: boolean
          subscription_end: string | null
          subscription_tier: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          stripe_customer_id?: string | null
          subscribed?: boolean
          subscription_end?: string | null
          subscription_tier?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          stripe_customer_id?: string | null
          subscribed?: boolean
          subscription_end?: string | null
          subscription_tier?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      time_slots: {
        Row: {
          booking_id: string | null
          created_at: string
          date: string
          end_time: string
          id: string
          is_available: boolean
          room_id: string
          start_time: string
        }
        Insert: {
          booking_id?: string | null
          created_at?: string
          date: string
          end_time: string
          id?: string
          is_available?: boolean
          room_id: string
          start_time: string
        }
        Update: {
          booking_id?: string | null
          created_at?: string
          date?: string
          end_time?: string
          id?: string
          is_available?: boolean
          room_id?: string
          start_time?: string
        }
        Relationships: [
          {
            foreignKeyName: "time_slots_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "time_slots_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "rooms"
            referencedColumns: ["id"]
          },
        ]
      }
      trading_signals: {
        Row: {
          confidence: number
          created_at: string | null
          entry_price: number
          expected_profit: number
          id: number
          pair: string
          risk_reward_ratio: number
          stop_loss: number
          target_price: number
          timestamp: string
          type: string
          updated_at: string | null
        }
        Insert: {
          confidence: number
          created_at?: string | null
          entry_price: number
          expected_profit: number
          id?: number
          pair: string
          risk_reward_ratio: number
          stop_loss: number
          target_price: number
          timestamp?: string
          type: string
          updated_at?: string | null
        }
        Update: {
          confidence?: number
          created_at?: string | null
          entry_price?: number
          expected_profit?: number
          id?: number
          pair?: string
          risk_reward_ratio?: number
          stop_loss?: number
          target_price?: number
          timestamp?: string
          type?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      trading_strategies: {
        Row: {
          content: string
          created_at: string
          description: string | null
          id: string
          name: string
          subscription_required: boolean
          updated_at: string
        }
        Insert: {
          content: string
          created_at?: string
          description?: string | null
          id?: string
          name: string
          subscription_required?: boolean
          updated_at?: string
        }
        Update: {
          content?: string
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          subscription_required?: boolean
          updated_at?: string
        }
        Relationships: []
      }
      transactions: {
        Row: {
          amount: number
          created_at: string
          currency: string
          id: string
          status: string
          stripe_session_id: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          amount: number
          created_at?: string
          currency?: string
          id?: string
          status?: string
          stripe_session_id?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          amount?: number
          created_at?: string
          currency?: string
          id?: string
          status?: string
          stripe_session_id?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      travel_conversations: {
        Row: {
          created_at: string
          id: string
          messages: Json
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          messages?: Json
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          messages?: Json
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      travel_plans: {
        Row: {
          created_at: string
          days: number
          destination: string
          end_date: string | null
          id: string
          plan_content: string | null
          start_date: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          days: number
          destination: string
          end_date?: string | null
          id?: string
          plan_content?: string | null
          start_date?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          days?: number
          destination?: string
          end_date?: string | null
          id?: string
          plan_content?: string | null
          start_date?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      usage_metrics: {
        Row: {
          created_at: string
          date: string
          id: string
          model_id: string
          request_count: number
          tokens_used: number
          user_id: string | null
        }
        Insert: {
          created_at?: string
          date?: string
          id?: string
          model_id: string
          request_count?: number
          tokens_used?: number
          user_id?: string | null
        }
        Update: {
          created_at?: string
          date?: string
          id?: string
          model_id?: string
          request_count?: number
          tokens_used?: number
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "usage_metrics_model_id_fkey"
            columns: ["model_id"]
            isOneToOne: false
            referencedRelation: "ai_models"
            referencedColumns: ["id"]
          },
        ]
      }
      user_configs: {
        Row: {
          api_key: string | null
          base_url: string | null
          created_at: string | null
          default_headers: Json | null
          id: string
          theme: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          api_key?: string | null
          base_url?: string | null
          created_at?: string | null
          default_headers?: Json | null
          id?: string
          theme?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          api_key?: string | null
          base_url?: string | null
          created_at?: string | null
          default_headers?: Json | null
          id?: string
          theme?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_health_data: {
        Row: {
          age: number | null
          blood_pressure: string | null
          created_at: string
          exercise_hours: number | null
          heart_rate: number | null
          height: number | null
          id: string
          sleep_hours: number | null
          updated_at: string
          user_id: string | null
          weight: number | null
        }
        Insert: {
          age?: number | null
          blood_pressure?: string | null
          created_at?: string
          exercise_hours?: number | null
          heart_rate?: number | null
          height?: number | null
          id?: string
          sleep_hours?: number | null
          updated_at?: string
          user_id?: string | null
          weight?: number | null
        }
        Update: {
          age?: number | null
          blood_pressure?: string | null
          created_at?: string
          exercise_hours?: number | null
          heart_rate?: number | null
          height?: number | null
          id?: string
          sleep_hours?: number | null
          updated_at?: string
          user_id?: string | null
          weight?: number | null
        }
        Relationships: []
      }
      user_memberships: {
        Row: {
          created_at: string
          end_date: string
          id: string
          level_id: number
          payment_id: string | null
          start_date: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          end_date: string
          id?: string
          level_id: number
          payment_id?: string | null
          start_date?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          end_date?: string
          id?: string
          level_id?: number
          payment_id?: string | null
          start_date?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_memberships_level_id_fkey"
            columns: ["level_id"]
            isOneToOne: false
            referencedRelation: "member_levels"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: string
          user_id?: string
        }
        Relationships: []
      }
      workflows: {
        Row: {
          connections: Json
          created_at: string
          description: string | null
          id: string
          is_public: boolean
          name: string
          nodes: Json
          updated_at: string
          user_id: string | null
        }
        Insert: {
          connections: Json
          created_at?: string
          description?: string | null
          id?: string
          is_public?: boolean
          name: string
          nodes: Json
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          connections?: Json
          created_at?: string
          description?: string | null
          id?: string
          is_public?: boolean
          name?: string
          nodes?: Json
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      binary_quantize: {
        Args: { "": string } | { "": unknown }
        Returns: unknown
      }
      halfvec_avg: {
        Args: { "": number[] }
        Returns: unknown
      }
      halfvec_out: {
        Args: { "": unknown }
        Returns: unknown
      }
      halfvec_send: {
        Args: { "": unknown }
        Returns: string
      }
      halfvec_typmod_in: {
        Args: { "": unknown[] }
        Returns: number
      }
      hnsw_bit_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      hnsw_halfvec_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      hnsw_sparsevec_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      hnswhandler: {
        Args: { "": unknown }
        Returns: unknown
      }
      ivfflat_bit_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      ivfflat_halfvec_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      ivfflathandler: {
        Args: { "": unknown }
        Returns: unknown
      }
      l2_norm: {
        Args: { "": unknown } | { "": unknown }
        Returns: number
      }
      l2_normalize: {
        Args: { "": string } | { "": unknown } | { "": unknown }
        Returns: string
      }
      sparsevec_out: {
        Args: { "": unknown }
        Returns: unknown
      }
      sparsevec_send: {
        Args: { "": unknown }
        Returns: string
      }
      sparsevec_typmod_in: {
        Args: { "": unknown[] }
        Returns: number
      }
      vector_avg: {
        Args: { "": number[] }
        Returns: string
      }
      vector_dims: {
        Args: { "": string } | { "": unknown }
        Returns: number
      }
      vector_norm: {
        Args: { "": string }
        Returns: number
      }
      vector_out: {
        Args: { "": string }
        Returns: unknown
      }
      vector_send: {
        Args: { "": string }
        Returns: string
      }
      vector_typmod_in: {
        Args: { "": unknown[] }
        Returns: number
      }
    }
    Enums: {
      member_level: "bronze" | "silver" | "gold" | "platinum"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      member_level: ["bronze", "silver", "gold", "platinum"],
    },
  },
} as const
