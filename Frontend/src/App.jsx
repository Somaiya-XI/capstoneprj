import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import Home from './pages/Home';
import Profile from './pages/Profile/Profile.jsx';
import Unauthorized from './pages/Unauthorized';
import RequireAuth from './auth/RequireAuth';
import UserActivation from './pages/Admin/ActivateUsers.jsx';
import ForgotPassword from './pages/Account/ForgotPassword.jsx';
import NewPasswordForm from './pages/Account/ResetPassword.jsx';
import Register from './pages/Account/RegisterPage.jsx';
import Login from './pages/Account/LoginPage.jsx';

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/user-activation' element={<UserActivation />} />
        <Route path='/profile' element={<Profile />} />
        <Route path='/' element={<Home />} />
        <Route path='/register' element={<Register />} />
        <Route path='/login' element={<Login />} />{' '}
        <Route path='/forgot-password' element={<ForgotPassword />} />
        <Route
          path='/reset-password/form/:uidb64/:token'
          element={<NewPasswordForm />}
        />{' '}
        {/* <Route element={<RequireAuth />}></Route> */}
      </Routes>
    </Router>
  );
}

export default App;
