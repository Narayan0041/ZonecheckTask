import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "url"; 
const SUPABASE_ANON_KEY = "anon"; // from Supabase Dashboard -> Project Settings -> API

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

