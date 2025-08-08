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
      users: {
        Row: {
          id: string
          email: string
          name: string | null
          company: string | null
          phone: string | null
          website: string | null
          industry: string | null
          city: string | null
          created_at: string
          updated_at: string
          is_admin: boolean
          credits: number
          gdpr_consent: boolean
          gdpr_date: string | null
        }
        Insert: {
          id: string
          email: string
          name?: string | null
          company?: string | null
          phone?: string | null
          website?: string | null
          industry?: string | null
          city?: string | null
          is_admin?: boolean
          credits?: number
          gdpr_consent?: boolean
          gdpr_date?: string | null
        }
        Update: {
          email?: string
          name?: string | null
          company?: string | null
          phone?: string | null
          website?: string | null
          industry?: string | null
          city?: string | null
          credits?: number
          gdpr_consent?: boolean
          gdpr_date?: string | null
        }
      }
      analyses: {
        Row: {
          id: string
          user_id: string
          website_url: string
          target_keyword: string | null
          status: 'pending' | 'processing' | 'completed' | 'error'
          overall_score: number | null
          title_score: number | null
          h1_score: number | null
          meta_score: number | null
          content_score: number | null
          technical_score: number | null
          crawl_data: Json | null
          improvements: Json | null
          content_ideas: Json | null
          error_message: string | null
          pages_crawled: number
          processing_time_seconds: number | null
          openai_tokens_used: number
          created_at: string
        }
        Insert: {
          user_id: string
          website_url: string
          target_keyword?: string | null
          status?: 'pending' | 'processing' | 'completed' | 'error'
          overall_score?: number | null
          title_score?: number | null
          h1_score?: number | null
          meta_score?: number | null
          content_score?: number | null
          technical_score?: number | null
          crawl_data?: Json | null
          improvements?: Json | null
          content_ideas?: Json | null
          error_message?: string | null
          pages_crawled?: number
          processing_time_seconds?: number | null
          openai_tokens_used?: number
        }
        Update: {
          status?: 'pending' | 'processing' | 'completed' | 'error'
          overall_score?: number | null
          title_score?: number | null
          h1_score?: number | null
          meta_score?: number | null
          content_score?: number | null
          technical_score?: number | null
          crawl_data?: Json | null
          improvements?: Json | null
          content_ideas?: Json | null
          error_message?: string | null
          pages_crawled?: number
          processing_time_seconds?: number | null
          openai_tokens_used?: number
        }
      }
      contact_requests: {
        Row: {
          id: string
          name: string
          email: string
          company: string
          website: string | null
          message: string
          status: 'new' | 'contacted' | 'completed'
          created_at: string
        }
        Insert: {
          name: string
          email: string
          company: string
          website?: string | null
          message: string
          status?: 'new' | 'contacted' | 'completed'
        }
        Update: {
          status?: 'new' | 'contacted' | 'completed'
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      decrement_credits: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
    }
    Enums: {
      [_ in never]: never
    }
  }
}