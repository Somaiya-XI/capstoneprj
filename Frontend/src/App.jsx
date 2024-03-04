import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import Home from './pages/Home/Home.jsx';
import Profile from './pages/Profile/Profile.jsx';
import RequireAuth from './auth/RequireAuth';
import UserActivation from './pages/Admin/ActivateUsers.jsx';
import ForgotPassword from './pages/Account/ForgotPassword.jsx';
import NewPasswordForm from './pages/Account/ResetPassword.jsx';
import Register from './pages/Account/RegisterPage.jsx';
import Login from './pages/Account/LoginPage.jsx';
import ProductsPage from './pages/Supplier/SupplierDashboard.jsx';
import { AdminRoute, SupplierRoute } from './Components/index.jsx';
import Schedule from './pages/Supplier/Components/Schedule.jsx';
import Orders from './pages/Supplier/Components/Orders.jsx';
import {UserContextProvider} from './Contexts/index.jsx';


function App() {
  return (
    <Router>
      <UserContextProvider>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/login' element={<Login />} />
          <Route path='/user-activation' element={<AdminRoute><UserActivation /></AdminRoute>} />
          {/* Supplier Routes */}
          <Route>
            {/* <Route path='/SupplierDashboard' element={<SupplierRoute><SupplierDashboard /> </SupplierRoute>} /> */}
            <Route path='/SupplierDashboard' element={<ProductsPage />} />
            <Route path='/SupplierDashboard/Schedule' element={<Schedule />} />
            <Route path='/SupplierDashboard/Orders' element={<Orders />} />
          </Route>


          <Route path='/profile' element={<Profile />} />
          <Route path='/register' element={<Register />} />
          <Route path='/forgot-password' element={<ForgotPassword />} />
          <Route path='/reset-password/form/:uidb64/:token' element={<NewPasswordForm />} />
        </Routes>{' '}
      </UserContextProvider>
    </Router>
  );
}

export default App;
