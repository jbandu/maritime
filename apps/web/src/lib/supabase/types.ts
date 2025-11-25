// Type definitions for Supabase
// These will be generated from your Supabase project
// For now, we'll use a placeholder

export type Database = {
  public: {
    Tables: {
      [key: string]: {
        Row: Record<string, unknown>;
        Insert: Record<string, unknown>;
        Update: Record<string, unknown>;
      };
    };
  };
};
