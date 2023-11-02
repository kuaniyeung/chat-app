import "./App.css";

import { useEffect, useState } from "react";
import SignInPage from "./components/SignInPage/SignInPage";
import CreateNewUser from "./components/SignInPage/CreateNewUser";
import { supabase, signInWithEmail } from "./SupabasePlugin";
import { Session } from "@supabase/supabase-js";

interface Chatrooms {
  id: number;
  created_at: string;
}

function App() {
  const [showAddUser, setAddUser] = useState(false);

  console.log("Change Enable Email's Comfirm Email settings back to enabled when project is finalized");

  // -- Work with Supabase sessions+

  // const [session, setSession] = useState<Session | null>(null);

  // useEffect(() => {
  //   supabase.auth.getSession().then(({ data: { session } }) => {
  //     setSession(session);
  //   });

  //   const {
  //     data: { subscription },
  //   } = supabase.auth.onAuthStateChange((_event, session) => {
  //     setSession(session);
  //   });

  //   return () => subscription.unsubscribe();
  // }, []);

  // if (!session) {
  //   return (
  //     <>
  //       <SignInPage
  //         onClick={() => setAddUser(!showAddUser)}
  //         showAdd={showAddUser}
  //       />
  //       {showAddUser && (
  //         <CreateNewUser
  //           onAdd={() => console.log("this")}
  //           closeAdd={() => setAddUser(!showAddUser)}
  //         />
  //       )}
  //     </>
  //   );
  // } else {
  //   return; // app content ;
  // }

  return (
    <>
      <SignInPage
        onClick={() => setAddUser(!showAddUser)}
        showAdd={showAddUser}
      />
      {showAddUser && (
        <CreateNewUser closeAdd={() => setAddUser(!showAddUser)} />
      )}
    </>
  );
}

export default App;
