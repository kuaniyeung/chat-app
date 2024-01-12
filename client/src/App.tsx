import { Route, Routes } from "react-router-dom";
import "./App.css";
import Dashboard from "./components/Dashboard/Dashboard";
import NoRouteMatch from "./components/Reusable/NoRouteMatch";
import CreateNewUser from "./components/SignInPage/CreateNewUser";
import Login from "./components/SignInPage/Login";
import RequireAuth from "./components/SignInPage/RequireAuth";
import SignInPage from "./components/SignInPage/SignInPage";
import Chat from "./components/Dashboard/Chat/Chat";
import ContactsTab from "./components/Dashboard/SideBar/ContactsTab";
import ChatroomsTab from "./components/Dashboard/SideBar/ChatroomsTab";

function App() {
  // console.info(
  //   "Change Enable Email's Confirm Email settings back to enabled when project is finalized"
  // );

  return (
    <Routes>
      <Route
        path="/*"
        element={
          <RequireAuth>
            <Dashboard />
          </RequireAuth>
        }
      >
        <Route path="*" element={<NoRouteMatch />} />
      </Route>

      <Route path="signin" element={<SignInPage />} />
      <Route path="login" element={<Login />} />
      <Route path="signup" element={<CreateNewUser />} />
      <Route path="*" element={<NoRouteMatch />} />
    </Routes>
  );
}

export default App;
