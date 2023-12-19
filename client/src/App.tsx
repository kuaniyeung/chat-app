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
