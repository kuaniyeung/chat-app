import { Route, Routes } from "react-router-dom";
import "./App.css";
import Dashboard from "./components/Dashboard/Dashboard";
import NoRouteMatch from "./components/Reusable/NoRouteMatch";
import CreateNewUser from "./components/SignInPage/CreateNewUser";
import Login from "./components/SignInPage/Login";
import RequireAuth from "./components/SignInPage/RequireAuth";
import SignInPage from "./components/SignInPage/SignInPage";

function App() {

  // console.info(
  //   "Change Enable Email's Comfirm Email settings back to enabled when project is finalized"
  // );

  // ------ TESTING ------ //

  // const testUser = {
  //   id: "c2025409-fd94-4211-9a54-c39d6d45e1f8",
  //   email: "test@test.com",
  //   display_name: "Mememe",
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

  // const testing = async () => {
  //   try {
  //     const { data: contactsData, error } = await supabase
  //       .from("contacts")
  //       .select(
  //         "contact_id, contacts_contact_id_fkey!inner(display_name)"
  //       )
  //       .eq("user_id", testUser.id);

  //     if (error) throw error;

  //     // console.log(contactsData);
  //     const formattedContacts = contactsData.map((contact) => {
  //       return {
  //         id: contact.contact_id,
  //         display_name: contact.contacts_contact_id_fkey.display_name,
  //       };
  //     });

  //     console.log(formattedContacts);
  //   } catch (error) {
  //     return console.error(error);
  //   }
  // };

  // testing();

  // console.log(contacts);

  return (
    <Routes>
      <Route
        path="/"
        element={
          <RequireAuth>
            <Dashboard />
          </RequireAuth>
        }
      />
      <Route path="signin" element={<SignInPage />} />
      <Route path="login" element={<Login />} />
      <Route path="signup" element={<CreateNewUser />} />
      <Route path="*" element={<NoRouteMatch />} />
    </Routes>
  );
}

export default App;
