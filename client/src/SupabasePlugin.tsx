import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;
export const supabase = createClient(supabaseUrl, supabaseKey);

export const addUser = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signUp({
    email: email,
    password: password,
  });

  console.log(data); // Zxcvb@12345

  // user.created_at: "2023-11-01T19:58:28.200308Z";
  // user.email: "test2@test.com";
  // user.id: "ebfefb69-22c1-48e6-9ac3-765dfda5cb98";

  if (error) {
    console.error("Error fetching data:", error);
    return error;
  }

  return data
};

export const signInWithEmail = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: email,
    password: password,
  });

  console.log(data);

  if (error) {
    console.error("Error fetching data:", error);
    return error;
  }

  return data
};
