import "./App.css";

import { useEffect, useState } from "react";
import SignInPage from "./components/SignInPage/SignInPage";
import CreateNewUser from "./components/SignInPage/CreateNewUser";
import Dashboard from "./components/Dashboard/Dashboard";
import { supabase } from "./SupabasePlugin";
import { useAppSelector, useAppDispatch } from "./app/hooks";
import { retrieveUserData, User } from "./features/user/userSlice";
import {
  getSession,
  retrieveSessionData,
} from "./features/session/sessionSlice";
import LoadingSpinner from "./components/LoadingSpinner";

function App() {
  const [showAddUser, setAddUser] = useState(false);
  const [currentEventOnState, setCurrentEventOnState] = useState<string | null>(
    null
  );
  const session = useAppSelector((state) => state.session.session);
  const user = useAppSelector((state) => state.user.user);
  const contacts = useAppSelector((state) => state.contact.contacts);
  const dispatch = useAppDispatch();

  const setUserData = () => {
    if (Object.keys(user).length === 0 && session) {
      const mapSessionUserToUser = (sessionUser: any): User => {
        return {
          id: sessionUser.id,
          display_name: sessionUser.user_metadata?.display_name,
          email: sessionUser.email,
          created_at: sessionUser.created_at,
        };
      };

      const mappedUser = mapSessionUserToUser(session.user);
      dispatch(retrieveUserData(mappedUser));
    }
  };

  const fetchSession = async () => {
    try {
      await dispatch(getSession()).unwrap();
    } catch (error) {
      console.error("An error occurred while dispatching getSession:", error);
    }
  };

  const toggleAddUser = () => {
    setAddUser((prev) => !prev);
  };

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, sessionOnState) => {
      setCurrentEventOnState(event);

      if (event === "INITIAL_SESSION" && !sessionOnState) fetchSession();

      if (
        (event === "INITIAL_SESSION" && sessionOnState) ||
        event === "SIGNED_IN"
      )
        dispatch(retrieveSessionData(sessionOnState));
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    setUserData();
  }, [session?.access_token]);

  // console.log(
  //   "Change Enable Email's Comfirm Email settings back to enabled when project is finalized"
  // );

  // ------ TESTING ------ //

  // const testEmail = "newuser@test.com";
  // const verifiedContact = {
  //   user_id: 6,
  //   user_email: "test6@email.com",
  //   display_name: "Tester1",
  // };

  // const testing = async () => {
  //   try {
  //     const { data: existingChatrooms, error } = await supabase
  //       .from("chatrooms")
  //       .select("members");

  //     if (error) throw error;

  //     console.log(existingChatrooms);
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };

  // testing();

  // --- RENDER THE COMPONENT --- //

  // Show loading spinner if currentEventOnState is null
  if (currentEventOnState === null) {
    return (
      <div className="flex justify-center items-center h-screen">
        <LoadingSpinner colour={"neutral-content"} />
      </div>
    );
  }

  // Show content if user data is available
  if (Object.keys(user).length) {
    return <Dashboard />;
  }

  // Otherwise show SignInPage and CreateNewUser components
  return (
    <>
      <SignInPage onClick={toggleAddUser} />
      {showAddUser && <CreateNewUser closeAdd={toggleAddUser} />}
    </>
  );
}

export default App;
