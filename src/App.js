import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./login";
import Dashboard from "./Dashboard";
import LoginWithFaceId from "./login/loginFaceId";
function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/login-with-faceid" element={<LoginWithFaceId />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
