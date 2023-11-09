import "./App.css";

import { useEffect, useState } from "react";
import SignInPage from "./components/SignInPage/SignInPage";
import CreateNewUser from "./components/SignInPage/CreateNewUser";
import Dashboard from "./components/Dashboard/Dashboard";
import { supabase } from "./SupabasePlugin";
import { Session } from "@supabase/supabase-js";
import { useAppSelector } from "./app/hooks";

function App() {
  const [showAddUser, setAddUser] = useState(false);
  const [session, setSession] = useState<Session | null>(null);
  const user = useAppSelector((state) => state.user.user);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  console.log(
    "Change Enable Email's Comfirm Email settings back to enabled when project is finalized"
  );

  // TESTING SUPABASE
  const test = async (id: string,name: string, email: string) => {
    const { error } = await supabase
      .from("users")
      .upsert([
        {
          id: id,
          display_name: name,
          email,
        },
      ])
      .select();
    if (error) {
      console.log(error);
    }
  };
  // test("asd213","Name", "asd@asd.com");

  return session ? (
    <Dashboard />
  ) : (
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
