import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;
export const supabase = createClient(supabaseUrl, supabaseKey);

// export const getLastMessageByChatroom = async (chatroomId: number) => {
//   try {
//     const { data: message, error } = await supabase
//       .from("messages")
//       .select("id, content, sender_display_name, chatroom_id, created_at")
//       .eq("chatroom_id", chatroomId)
//       .order("created_at", { ascending: false })
//       .limit(1);

//     if (error) throw error;

//     return message[0]?.content || "";
//   } catch (error) {
//     return console.error(error);
//   }
// };
