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
  const user = useAppSelector((state) => state.user.user);
  const session = useAppSelector((state) => state.session.session);
  const sessionLoading = useAppSelector((state) => state.session.loading);
  const dispatch = useAppDispatch();
  const mapSessionUserToUser = (sessionUser: any): User => {
    return {
      id: sessionUser.id,
      display_name: sessionUser.user_metadata?.display_name,
      email: sessionUser.email,
      created_at: sessionUser.created_at,
    };
  };

  useEffect(() => {
    async () => {
      try {
        const action = await dispatch(getSession());

        if (getSession.rejected.match(action)) {
          const error = action.payload as { message?: string };

          if (error && "message" in error) {
            console.error(error.message);
            return;
          }
        }
      } catch (error) {
        console.error("An error occurred while dispatching getSession:", error);
      }
    };

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      dispatch(retrieveSessionData(session));
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    getUserData();
  }, [user, session]);

  const getUserData = () => {
    if (Object.keys(user).length === 0 && session) {
      const mappedUser = mapSessionUserToUser(session.user);
      dispatch(retrieveUserData(mappedUser));
    }
  };

  console.log(
    "Change Enable Email's Comfirm Email settings back to enabled when project is finalized"
  );

  console.log(session);
  console.log(user);

  // return  Object.keys(user).length > 0 ? (
  //   sessionLoading ? (
  //     <LoadingSpinner colour={"neutral-content"} />
  //   ) : (
  //     <Dashboard />
  //   )
  // ) : (
  //   <>
  //     <SignInPage
  //       onClick={() => setAddUser(!showAddUser)}
  //     />
  //     {showAddUser && (
  //       <CreateNewUser closeAdd={() => setAddUser(!showAddUser)} />
  //     )}
  //   </>
  // );

  // return sessionLoading ? (
  //   <LoadingSpinner colour={"neutral-content"} />
  // ) : Object.keys(user).length > 0 ? (
  //   <Dashboard />
  // ) : (
  //   <>
  //     <SignInPage onClick={() => setAddUser(!showAddUser)} />
  //     {showAddUser && (
  //       <CreateNewUser closeAdd={() => setAddUser(!showAddUser)} />
  //     )}
  //   </>
  // );

  return Object.keys(user).length > 0 ? (
    <Dashboard />
  ) : (
    <>
      <SignInPage onClick={() => setAddUser(!showAddUser)} />
      {showAddUser && (
        <CreateNewUser closeAdd={() => setAddUser(!showAddUser)} />
      )}
    </>
  );
}

export default App;
