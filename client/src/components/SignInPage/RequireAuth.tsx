import { User } from "@supabase/supabase-js";
import { ReactNode, useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { supabase } from "../../SupabasePlugin";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
  getSession,
  retrieveSessionData,
} from "../../features/session/sessionSlice";
import { retrieveUserData } from "../../features/user/userSlice";
import LoadingSpinner from "../Reusable/LoadingSpinner";

interface Props {
  children: ReactNode;
}

const RequireAuth: React.FC<Props> = ({ children }) => {
  // Global states in Redux
  const session = useAppSelector((state) => state.session.session);
  const user = useAppSelector((state) => state.user.user);
  const dispatch = useAppDispatch();

  // Local states
  const [currentEventOnState, setCurrentEventOnState] = useState<string | null>(
    null
  );
  const location = useLocation();

  const setUserData = () => {
    if (Object.keys(user).length === 0 && session) {
      const mapSessionUserToUser = (sessionUser: User) => {
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

  // Show loading spinner if currentEventOnState is null
  if (currentEventOnState === null) {
    return (
      <div className="flex justify-center items-center h-screen">
        <LoadingSpinner size={"lg"} colour={"neutral-content"} />
      </div>
    );
  }

  //   Show SignInPage and CreateNewUser components if user data is unavailable
  if (!user.id) {
    return <Navigate to="/signin" state={{ path: location.pathname }} />;
  }

  return children;
};

export default RequireAuth;
