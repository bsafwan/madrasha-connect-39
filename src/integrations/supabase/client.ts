
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://xebdyuqczuvelfdjcsjl.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhlYmR5dXFjenV2ZWxmZGpjc2psIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE0NTc4MTYsImV4cCI6MjA1NzAzMzgxNn0.yajyc5Z1pQk7HWr1AIDp1PitvBIHNqAc34lgtWNa5yo";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
