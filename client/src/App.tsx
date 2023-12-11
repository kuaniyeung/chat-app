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
import LoadingSpinner from "./components/Reusable/LoadingSpinner";
import { Contact, addNewContact } from "./features/contact/contactSlice";
import { Chatroom } from "./features/chatroom/chatroomSlice";

function App() {
  // Global states in Redux
  const session = useAppSelector((state) => state.session.session);
  const user = useAppSelector((state) => state.user.user);
  const contacts = useAppSelector((state) => state.contact.contacts);
  const chatrooms = useAppSelector((state) => state.chatroom.chatrooms);
  const dispatch = useAppDispatch();

  // Local states
  const [showAddUser, setAddUser] = useState(false);
  const [currentEventOnState, setCurrentEventOnState] = useState<string | null>(
    null
  );

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

  // console.info(
  //   "Change Enable Email's Comfirm Email settings back to enabled when project is finalized"
  // );

  // ------ TESTING ------ //

  // const testUser = {
  //   id: "10d54f73-1223-420f-bb13-497a62c3ff73",
  //   email: "test@test.com",
  //   display_name: "Asdf",
  // };

  // const verifiedContact = {
  //   id: "060a8a80-df76-44a1-a5b5-e3b29f65a87b",
  //   display_name: "Contact1",
  // };

  // const payload = {
  //   name: "Testing room",
  //   members: [
  //     { id: "060a8a80-df76-44a1-a5b5-e3b29f65a87b", display_name: "Contact1" },
  //     { id: "f57aa67f-3c2e-4616-a74a-73e3030e9367", display_name: "TestAgain" },
  //   ],
  // };

  //   const testing = async () => {
  //     try {
  //       const action = await dispatch(
  //         addNewContact({ displayName: "NewUser" })
  //       );
  //       if (addNewContact.rejected.match(action)) {
  //         const error = action.payload as { message?: string };
  //         if (error && "message" in error) throw error;
  //       }
  //     } catch (error) {
  //       console.error(
  //         "An error occurred while dispatching addNewContact:",
  //         error
  //       );
  //     }
  //     return;
  //   };

  // testing();

  // console.log(contacts);

  // --- RENDER THE COMPONENT --- //

  // Show loading spinner if currentEventOnState is null
  if (currentEventOnState === null) {
    return (
      <div className="flex justify-center items-center h-screen">
        <LoadingSpinner size={"lg"} colour={"neutral-content"} />
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
