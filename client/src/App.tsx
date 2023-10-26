import './App.css'
import { createClient } from "@supabase/supabase-js";
import { useState } from 'react';
import SignInPage from "./components/SignInPage/SignInPage";
import CreateNewUser from './components/SignInPage/CreateNewUser';

const supabaseUrl = "https://rfdtwaqdjpozowckstar.supabase.co";
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);


function App() {
  const [showAddUser, setAddUser] = useState(false);

  return (
    <>
      <SignInPage
        onClick={() => setAddUser(!showAddUser)}
        showAdd={showAddUser}
      />
      {showAddUser && (
        <CreateNewUser
          onAdd={() => console.log("this")}
          closeAdd={() => setAddUser(!showAddUser)}
        />
      )}
    </>
  );
}

export default App
