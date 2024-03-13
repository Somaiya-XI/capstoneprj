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
  UserContextProvider,
  CsrfTokenContextProvider,
  CartContextProvider,
  Payment,

} from './url.jsx';
import {Toaster} from 'sonner';

function App() {
  return (
    <>
      <Toaster position='top-right' visibleToasts='1' duration={1500} />
      <Router>
        <UserContextProvider>
          <CsrfTokenContextProvider>
            <CartContextProvider>
              <Routes>
                <Route path='/' element={<Home />} />
                <Route path='/cart' element={<Cart />} />
                <Route path='/:id' element={<ProductDetail />} />
                <Route path='/login' element={<Login />} />
                <Route path='/user-activation'element={  <AdminRoute> <UserActivation /></AdminRoute>} />
                <Route>
                  {/* <Route path='/SupplierDashboard' element={<SupplierRoute><SupplierDashboard /> </SupplierRoute>} /> */}
                  <Route path='/SupplierDashboard/Products' element={<SupplierRoute><Products /></SupplierRoute>} />
                  <Route path='/SupplierDashboard/Edit' element={<EditProduct />} />
                  <Route path='/SupplierDashboard/Add' element={<AddProduct />}/>
                  <Route path='/SupplierDashboard/Schedule'element={<SupplierRoute><Schedule /></SupplierRoute>} />
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
    </>
  );
}

export default App;

