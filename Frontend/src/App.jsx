import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Home from './pages/Home/Home.jsx';
import ProductDetail from './pages/ProductDetail/ProductDetail.jsx';
import Profile from './pages/Profile/Profile.jsx';
import UserActivation from './pages/Admin/ActivateUsers.jsx';
import ForgotPassword from './pages/Account/ForgotPassword.jsx';
import NewPasswordForm from './pages/Account/ResetPassword.jsx';
import Register from './pages/Account/RegisterPage.jsx';
import Login from './pages/Account/LoginPage.jsx';
import ProductsPage from './pages/Supplier/SupplierDashboard.jsx';
import {AdminRoute, SupplierRoute} from './Components/index.jsx';
import {UserContextProvider, CsrfTokenContextProvider, CartContextProvider} from './Contexts/index.jsx';
import Orders from './pages/Supplier/Components/Orders.jsx';
import Schedule from './pages/Supplier/Components/Schedule.jsx';

import Cart from './pages/Cart/Cart.jsx';
import Navbar from './pages/Home/Components/Navbar/Navbar.jsx';
import Header from './pages/Home/Components/Header/Header.jsx';
import Payment from './pages/Payment/Payment.jsx';

function App() {
  return (
    <Router>
      <UserContextProvider>
        <CsrfTokenContextProvider>
          <CartContextProvider>
            <Routes>
              <Route path='/' element={<Home />} />
              <Route path='/cart' element={<Cart />} />
              <Route path='/:id' element={<ProductDetail />} />
              <Route path='/login' element={<Login />} />
              <Route
                path='/user-activation'
                element={
                  <AdminRoute>
                    <UserActivation />
                  </AdminRoute>
                }
              />
              <Route>
                {/* <Route path='/SupplierDashboard' element={<SupplierRoute><SupplierDashboard /> </SupplierRoute>} /> */}
                <Route
                  path='/SupplierDashboard'
                  element={
                    <SupplierRoute>
                      <ProductsPage />
                    </SupplierRoute>
                  }
                />
                <Route path='/SupplierDashboard/Schedule' element={<Schedule />} />
                <Route path='/SupplierDashboard/Orders' element={<Orders />} />
              </Route>
              <Route path='/profile' element={<Profile />} />
              <Route path='/register' element={<Register />} />
              <Route path='/forgot-password' element={<ForgotPassword />} />
              <Route path='/reset-password/form/:uidb64/:token' element={<NewPasswordForm />} />
              <Route path='/payment' element={<Payment />} />
            </Routes>
          </CartContextProvider>
        </CsrfTokenContextProvider>
      </UserContextProvider>
    </Router>
  );
}

export default App;
