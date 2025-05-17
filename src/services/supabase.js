import 'react-native-url-polyfill/auto';
import {createClient} from "@supabase/supabase-js";
require('dotenv').config();

const supabaseURL = "https://ybzdbzfebbnobqfvhmev.supabase.co";
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseURL, supabaseAnonKey);
