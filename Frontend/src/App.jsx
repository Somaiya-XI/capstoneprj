import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import {
  Products,
  AddProduct,
  EditProduct,
  Schedule,
  Orders,
  Home,
  ProductDetail,
  Profile,
  UserActivation,
  ForgotPassword,
  NewPasswordForm,
  Register,
  Login,
  AdminRoute,
  SupplierRoute,
  Cart,
  Navbar,
  Header,
  UserContextProvider
} from './url.jsx';


function App() {
  return (
    <Router>
      <UserContextProvider>
        <Routes>
          <Route path='/' element={<><Header><Navbar /></Header><Home /></>} />
          <Route path='/cart' element={<> <Header>  <Navbar /></Header> <Cart /></>} />
          <Route path='/:id' element={<ProductDetail />} />
          <Route path='/login' element={<Login />} />
          <Route path="/user-activation" element={<AdminRoute><UserActivation /></AdminRoute>} />
          <Route>
            {/* <Route path='/SupplierDashboard' element={<SupplierRoute><SupplierDashboard /> </SupplierRoute>} /> */}
            <Route path='/SupplierDashboard/Products' element={<Products />} />
            <Route path='/SupplierDashboard/Schedule' element={<Schedule />} />
            <Route path='/SupplierDashboard/Orders' element={<Orders />} />
            <Route path='/SupplierDashboard/Add' element={<AddProduct />} />
            <Route path='/SupplierDashboard/Edit' element={<EditProduct />} />
          </Route>
          <Route path='/profile' element={<Profile />} />
          <Route path='/register' element={<Register />} />
          <Route path='/forgot-password' element={<ForgotPassword />} />
          <Route path='/reset-password/form/:uidb64/:token' element={<NewPasswordForm />} />
        </Routes>
      </UserContextProvider>
    </Router>
  );
}

export default App;
