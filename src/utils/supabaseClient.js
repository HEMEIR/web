// supabaseClient.js
import { createClient } from '@supabase/supabase-js';

// 创建Supabase客户端
const supabaseUrl = 'https://your-supabase-url.supabase.co';
const supabaseAnonKey = 'your-supabase-anon-key';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default supabase;