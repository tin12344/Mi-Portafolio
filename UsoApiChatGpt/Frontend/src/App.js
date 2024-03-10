import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import Admin from "./Pages/Admin"
import User from "./Pages/User"
import AdminUser from "./Pages/AdminUser"
import UserEditPrompts from "./Pages/UserEditPrompts";
import UserEditMaintencePrompts from "./Pages/UserEditMaintencePrompts";
import UserImagePrompt from "./Pages/UserImagePrompt";
import UserImageMaintencePrompts from "./Pages/UserImageMaintencePrompts";
import UserCompletionPrompt from "./Pages/UserCompletionPrompt";
import UserCompletionMaintancePrompt from "./Pages/UserCompletionMaintancePrompt";
import TableUserAdmin from "./Components/TableUserAdmin";
import Verification from "./Components/Verification";
import VerificationEmail from "./Components/VerificationEmail";
import UserProfile from "./Components/UserProfile";
import SendEmailPassword from "./Components/SendEmailPassword";
import ResetPassword from "./Components/ResetPassword";

function App() {

  let stayLogged = sessionStorage.getItem("auth") === "true";

  const [isLogged, setIsLogged] = useState(stayLogged);
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={isLogged ? <User setIsLogged={setIsLogged} /> : <Login setIsLogged={setIsLogged} />}
        />
        <Route path="/register" element={<Register />} />
        <Route path="/verification" element={<Verification />} />
        <Route path="/verificationEmail" element={<VerificationEmail />} />
        <Route path="/sendEmailPassword" element={<SendEmailPassword />}/>
        <Route path="/resetPassword" element={<ResetPassword />}/>
        {isLogged &&
          <>
            <Route path="/user" element={<User setIsLogged={setIsLogged} />} />
            <Route path="/UserEditPrompts" element={<UserEditPrompts setIsLogged={setIsLogged} />} />
            <Route path="/userEditMaintencePrompts" element={<UserEditMaintencePrompts setIsLogged={setIsLogged} />} />
            <Route path="/userImagePrompt" element={<UserImagePrompt setIsLogged={setIsLogged} />} />
            <Route path="/userImageMaintencePrompt" element={<UserImageMaintencePrompts setIsLogged={setIsLogged} />} />
            <Route path="/userCompletionPrompt" element={<UserCompletionPrompt setIsLogged={setIsLogged} />} />
            <Route path="/userCompletionMaintancePrompt" element={<UserCompletionMaintancePrompt setIsLogged={setIsLogged} />} />
            <Route path="/admin" element={<Admin setIsLogged={setIsLogged} />} />
            <Route path="/adminUser" element={<AdminUser setIsLogged={setIsLogged} />} />
            <Route path="/userProfile" element={<UserProfile setIsLogged={setIsLogged} />} />
            <Route path="/tableUserAdmin" element={<TableUserAdmin setIsLogged={setIsLogged} />} />
          </>
        }
      </Routes>
    </BrowserRouter>
  );
}

export default App;
