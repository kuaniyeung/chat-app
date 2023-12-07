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
import { Contact } from "./features/contact/contactSlice";
import { Chatroom } from "./features/chatroom/chatroomSlice";

function App() {
  const [showAddUser, setAddUser] = useState(false);
  const [currentEventOnState, setCurrentEventOnState] = useState<string | null>(
    null
  );
  const session = useAppSelector((state) => state.session.session);
  const user = useAppSelector((state) => state.user.user);
  const contacts = useAppSelector((state) => state.contact.contacts);
  const chatrooms = useAppSelector((state) => state.chatroom.chatrooms);
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
  // const membersOfCurrentChatrooms = chatrooms.map(
  //       (chatroom) => chatroom.members
  //     );

  //     const objectsEqual = (c1: Contact, c2: Contact): boolean => {
  //       return c1.id === c2.id && c1.display_name === c2.display_name;
  //     };

  //     const arraysEqual = (a1: Contact[], a2: Contact[]) => {
  //       const sortedA1 = [...a1].sort((o1, o2) => o1.id.localeCompare(o2.id));
  //       const sortedA2 = [...a2].sort((o1, o2) => o1.id.localeCompare(o2.id));

  //       return (
  //         sortedA1.length === sortedA2.length &&
  //         sortedA1.every((o, idx) => objectsEqual(o, sortedA2[idx]))
  //       );
  //     };

  //     // Validate if new chatroom exists

  //     try {
  //       const doesChatroomExist = membersOfCurrentChatrooms.some((chatroom) =>
  //         arraysEqual(payload.members, chatroom)
  //       );

  //       if (doesChatroomExist) throw new Error("Chatroom already exists");
  //     } catch (error) {
  //       return console.error(error)
  //     }

  //     // Add new chatroom

  //     let newChatroom: Chatroom = { id: null, name: "", members: [] };

  //     try {
  //       const { data, error } = await supabase
  //         .from("chatrooms")
  //         .insert([{ name: payload.name }])
  //         .select("id, name");

  //       if (error) throw error;

  //       newChatroom = { ...newChatroom, id: data[0].id, name: data[0].name };
  //     } catch (error) {
  //        return console.error(error)
  //     }

  //     // Add new chatroom members

  //     try {
  //       const promises: Promise<Contact>[] = payload.members.map(async (member: any) => {
  //         const { data, error } = await supabase
  //           .from("chatrooms_members")
  //           .insert([{ chatroom_id: newChatroom.id, member_id: member.id }])
  //           .select("member_id, users!inner(display_name)");

  //         console.log(data);

  //         return {id: data?[0].member_id,
  //         display_name: data?[0].users[0].display_name}
  //       });

  //             try {
  //         newChatroom.members = await Promise.all(promises);
  //       } catch (error) {
  //          return console.error(error)
  //       }
  //     } catch (error) {
  //        return console.error(error)
  //     }
  //   };

  // const testing2 = async () => {
  //   // Add new chatroom

  //   let newChatroom: Chatroom = { id: null, name: "", members: [] };

  //   try {
  //     const { data, error } = await supabase
  //       .from("chatrooms")
  //       .insert([{ name: payload.name }])
  //       .select("id, name");

  //     if (error) throw error;

  //     newChatroom = { ...newChatroom, id: data[0].id, name: data[0].name };
  //   } catch (error) {
  //     return console.error(error);
  //   }

  //   try {
  //     const promises: Promise<
  //       | {
  //           member_id: any;
  //           users: {
  //             display_name: any;
  //           }[];
  //         }[]
  //       | null
  //     >[] = payload.members.map(async (member: any) => {
  //       const { data, error } = await supabase
  //         .from("chatrooms_members")
  //         .insert([{ chatroom_id: newChatroom.id, member_id: member.id }]);

  //       if (error) throw error;

  //       return data;
  //     });

  //     try {
  //       await Promise.all(promises);
  //     } catch (error) {
  //       return console.error(error);
  //     }

  //     newChatroom = { ...newChatroom, members: payload.members };
  //     console.log(newChatroom);
  //     return newChatroom;
  //   } catch (error) {
  //     return console.error(error);
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
