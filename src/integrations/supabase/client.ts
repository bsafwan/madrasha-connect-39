
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://xebdyuqczuvelfdjcsjl.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhlYmR5dXFjenV2ZWxmZGpjc2psIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE0NTc4MTYsImV4cCI6MjA1NzAzMzgxNn0.yajyc5Z1pQk7HWr1AIDp1PitvBIHNqAc34lgtWNa5yo";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);

// Utility function to format number as Bengali currency
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('bn-BD', {
    style: 'currency',
    currency: 'BDT',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount).replace('BDT', '৳');
};

// Convert English numbers to Bengali
export const toBengaliNumber = (num: number | string): string => {
  const bengaliDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  return String(num).replace(/[0-9]/g, match => bengaliDigits[parseInt(match)]);
};

// Format date to Bengali
export const formatDateBengali = (dateStr: string): string => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('bn-BD', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};
