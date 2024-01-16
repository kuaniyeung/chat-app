import { Route, Routes } from "react-router-dom";
import "./App.css";
import Chat from "./components/Dashboard/Chat/Chat";
import Dashboard from "./components/Dashboard/Dashboard";
import ContactInfo from "./components/Dashboard/SideBar/ContactInfo";
import NoRouteMatch from "./components/Reusable/NoRouteMatch";
import CreateNewUser from "./components/SignInPage/CreateNewUser";
import Login from "./components/SignInPage/Login";
import RequireAuth from "./components/SignInPage/RequireAuth";
import SignInPage from "./components/SignInPage/SignInPage";

function App() {

  return (
    <Routes>
      <Route
        path="/"
        element={
          <RequireAuth>
            <Dashboard />
          </RequireAuth>
        }
      >
        <Route path="chatrooms/:chatroomId" element={<Chat />} />
        <Route path="contacts/:contactId" element={<ContactInfo />} />
      </Route>

      <Route path="signin" element={<SignInPage />} />
      <Route path="login" element={<Login />} />
      <Route path="signup" element={<CreateNewUser />} />
      <Route path="*" element={<NoRouteMatch />} />
    </Routes>
  );
}

export default App;
