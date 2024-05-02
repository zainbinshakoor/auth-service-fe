import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./login";
import Dashboard from "./Dashboard";
import LoginWithFaceId from "./login/loginFaceId";
import SignupWithFaceId from "./signup/Singup";
function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/login-with-faceid" element={<LoginWithFaceId />} />
          <Route path="/signup" element={<SignupWithFaceId />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
