import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://bzreyfimfjtjgzfoirqv.supabase.co"; 
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ6cmV5ZmltZmp0amd6Zm9pcnF2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc4MjQwNTcsImV4cCI6MjA3MzQwMDA1N30.YG9E66i3uCAlEEXTtMGIgtaV6wp23cixMt8tExF2uoI"; // from Supabase Dashboard -> Project Settings -> API

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

