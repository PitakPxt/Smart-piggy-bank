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
import FriendParty from "@components/modals/FriendPartyModal";
import AddFriendModal from "@components/modals/AddFriendModal";
import YourComponent from "@pages/YourComponent";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { SavingProvider } from "./context/SavingContext";
import { useUserAuth } from "./context/AuthContext";

function App() {
  const { user } = useUserAuth();

  return (
    <SavingProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route
              path="/"
              element={user ? <Navigate to="/home" replace /> : <Login />}
            />
            <Route path="home" element={<Home />} />
            <Route path="register" element={<Register />} />
            <Route
              path="unlock-pin"
              element={
                <ProtectedRoute>
                  <UnlockPin />
                </ProtectedRoute>
              }
            />
            <Route
              path="unlock-success"
              element={
                <ProtectedRoute>
                  <UnlockSuccess />
                </ProtectedRoute>
              }
            />
            <Route
              path="change-pin"
              element={
                <ProtectedRoute>
                  <ChangePin />
                </ProtectedRoute>
              }
            />
            <Route
              path="forget-pin"
              element={
                <ProtectedRoute>
                  <ForgetPin />
                </ProtectedRoute>
              }
            />
            <Route
              path="create-party"
              element={
                <ProtectedRoute>
                  <CreateParty />
                </ProtectedRoute>
              }
            />
            <Route
              path="party"
              element={
                <ProtectedRoute>
                  <Party />
                </ProtectedRoute>
              }
            />
            <Route
              path="ranking"
              element={
                <ProtectedRoute>
                  <Ranking />
                </ProtectedRoute>
              }
            />
            <Route
              path="saving"
              element={
                <ProtectedRoute>
                  <YourComponent />
                </ProtectedRoute>
              }
            />
            <Route
              path="profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route
              path="add-friend"
              element={
                <ProtectedRoute>
                  <AddFriendModal />
                </ProtectedRoute>
              }
            />
            <Route path="reset-password" element={<ChangePassLog />} />
            <Route
              path="otp"
              element={
                <ProtectedRoute>
                  <Otp />
                </ProtectedRoute>
              }
            />
            <Route path="forget" element={<Forget />} />
            <Route
              path="unlockpin"
              element={
                <ProtectedRoute>
                  <UnlockPin />
                </ProtectedRoute>
              }
            />
            <Route
              path="friend-party"
              element={
                <ProtectedRoute>
                  <FriendParty />
                </ProtectedRoute>
              }
            />
          </Route>
        </Routes>
      </Router>
    </SavingProvider>
  );
}

export default App;
