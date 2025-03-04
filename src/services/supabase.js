import 'react-native-url-polyfill/auto';
import {createClient} from "@supabase/supabase-js";

const supabaseURL = "https://ybzdbzfebbnobqfvhmev.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InliemRiemZlYmJub2JxZnZobWV2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDAwOTAyNzcsImV4cCI6MjA1NTY2NjI3N30.MwpyMOJKJ5Qzlr9DDEGzkU2EanVs2ZmIU7wJpWSFrog"

export const supabase = createClient(supabaseURL, supabaseAnonKey);
