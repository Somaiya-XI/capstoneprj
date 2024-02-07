import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import Home from "./pages/Home";
import Signup from "./pages/Signup";
import Signin from "./pages/Signin";
import ProtectedRoute from "./auth/ProtectedRoutes";
import Profile from "./pages/Profile/Profile.jsx";

function App() {
  return (
    <>
      <Router>
        <Routes>
          {/* <Route path='/' element={<ProtectedRoute><Home /></ProtectedRoute>} /> */}
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/signin" element={<Signin />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
