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

  const testUser = {
    id: "10d54f73-1223-420f-bb13-497a62c3ff73",
    email: "test@test.com",
    display_name: "Asdf",
  };
  const verifiedContact = {
    id: "060a8a80-df76-44a1-a5b5-e3b29f65a87b",
    email: "testtoday@test.com",
    display_name: "Contact1",
  };

  // const testing = async () => {
  //   let chatrooms;

  //   // Check existing chatrooms

  //   try {
  //     const { data: chatroomsData, error } = await supabase
  //       .from("chatrooms_members")
  //       .select("chatroom_id, chatrooms!inner(name)")
  //       .eq("member_id", testUser.id);

  //     if (error) throw error;

  //     console.log(chatroomsData);

  //     if (chatroomsData.length === 0) return;

  //     chatrooms = chatroomsData.map((chatroomData) => ({
  //       id: chatroomData.chatroom_id,
  //       name: chatroomData.chatrooms.name,
  //       members: [],
  //     }));
  //   } catch (error) {
  //     console.error(error);
  //   }

  //   // Check existing members in chatrooms

  //   try {
  //     const promises: Promise<{
  //       id: any;
  //       name: any;
  //       members: Array<{ id: any; display_name: any }> | undefined;
  //     } | null>[] = (chatrooms ?? []).map(async (chatroom) => {
  //       const { data } = await supabase
  //         .from("chatrooms_members")
  //         .select("member_id, users!inner(display_name)")
  //         .eq("chatroom_id", chatroom.id);

  //       return {
  //         id: chatroom.id,
  //         name: chatroom.name,
  //         members: data?.map((member) => ({
  //           id: member.member_id,
  //           display_name: member.users.display_name,
  //         })),
  //       };
  //     });

  //     try {
  //       chatrooms = await Promise.all(promises);
  //     } catch (error) {
  //       console.error(error);
  //     }

  //     console.log(chatrooms);
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };

  // const testing2 = async () => {
  //   try {
  //     const { data: contactsData, error } = await supabase.rpc(
  //       "get_contact2s",
  //       {
  //         p_contact1_id: testUser.id,
  //       }
  //     );

  //     if (error) throw error;

  //     console.log(contactsData);
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };

  // testing();

  // testing2();

  // console.log(contacts);

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
