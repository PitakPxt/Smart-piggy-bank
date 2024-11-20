import "./index.css";

import Layout from "@components/Layout";
import Login from "@pages/Login";
import Home from "@pages/Home";
import UnlockPin from "@pages/UnlockPin";
import CreateParty from "@pages/CreateParty";
import Profile from "@pages/Profile";
import Otp from "@pages/Otp";
import Forget from "@pages/Forget";
import ForgetPin from "@pages/ForgetPin";
import Register from "@pages/Register";
import ChangePin from "@pages/ChangePin";
import ChangePassLog from "@pages/ChangePassLog";
import Party from "@pages/Party";
import Ranking from "@pages/Ranking";
import UnlockSuccess from "@pages/UnlockSuccess";
import ProtectedRoute from "@components/ProtectedRoute";

import AddFriendModal from "@components/modals/AddFriendModal";
import YourComponent from "@pages/YourComponent";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { SavingProvider } from "./context/SavingContext";

function App() {
  return (
    <SavingProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route path="/" element={<Login />} />
            <Route
              path="home"
              element={
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
              }
            />
            <Route path="register" element={<Register />} />
            <Route path="unlock-pin" element={<UnlockPin />} />
            <Route path="unlock-success" element={<UnlockSuccess />} />
            <Route path="change-pin" element={<ChangePin />} />
            <Route path="forget-pin" element={<ForgetPin />} />
            <Route path="create-party" element={<CreateParty />} />
            <Route path="party" element={<Party />} />
            <Route path="ranking" element={<Ranking />} />
            <Route path="saving" element={<YourComponent />} />
            <Route
              path="profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route path="add-friend" element={<AddFriendModal />} />
            <Route path="reset-password" element={<ChangePassLog />} />
            <Route path="otp" element={<Otp />} />
            <Route path="forget" element={<Forget />} />
            <Route path="unlockpin" element={<UnlockPin />} />
          </Route>
        </Routes>
      </Router>
    </SavingProvider>
  );
}

export default App;
