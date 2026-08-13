export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      import_jobs: {
        Row: {
          id: string;
          user_id: string;
          idempotency_key: string;
          source_provider: "instagram";
          source_username: string;
          status:
            | "awaiting_upload"
            | "queued"
            | "processing"
            | "ready_for_review"
            | "failed"
            | "cancelled";
          media_count: number;
          draft_count: number;
          error_code: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          idempotency_key: string;
          source_provider?: "instagram";
          source_username: string;
          status?:
            | "awaiting_upload"
            | "queued"
            | "processing"
            | "ready_for_review"
            | "failed"
            | "cancelled";
          media_count?: number;
          draft_count?: number;
          error_code?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          source_username?: string;
          status?:
            | "awaiting_upload"
            | "queued"
            | "processing"
            | "ready_for_review"
            | "failed"
            | "cancelled";
          media_count?: number;
          draft_count?: number;
          error_code?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}
