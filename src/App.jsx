import "./index.css";

import Layout from "@components/Layout";
import Login from "@pages/Login";
import Home from "@pages/Home";
import UnlockPin from "@pages/UnlockPin";
import CreateParty from "@pages/CreateParty";
import Profile from "@pages/Profile";
import Otp from "@pages/Otp";
import Forget from "@pages/Forget";
import Regisret from "@pages/Regisret";
import ChangePassLog from "@pages/ChangePassLog";
import FriendPartyModal from "@components/modals/FriendPartyModal";
import AddFriendModal from "@components/modals/AddFriendModal";
import YourComponent from "@pages/YourComponent";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="register" element={<Regisret />} />
          <Route path="login" element={<Login />} />
          <Route path="unlock-pin" element={<UnlockPin />} />
          <Route path="create-party" element={<CreateParty />} />
          {/* <Route path="Community" element={<Community />} /> */}
          <Route path="saving" element={<YourComponent />} />
          <Route path="profile" element={<Profile />} />
          <Route path="add-friend" element={<AddFriendModal />} />
          <Route path="changepasslog" element={<ChangePassLog />} />
          <Route path="otp" element={<Otp />} />
          <Route path="home" element={<Home />} />
          <Route path="forget" element={<Forget />} />
        </Route>
      </Routes>
    </Router>
    // <Layout></Layout>
  );
}

export default App;
