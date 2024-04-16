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
  ResetPassword,
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
import ApiTest from './pages/Test.jsx';
import {HardwareSimulation, HardwareRegister} from './pages/index.jsx';

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
                  <Route path='/supplier-dashboard/products' element={<SupplierRoute><Products /></SupplierRoute>} />
                  <Route path='/supplier-dashboard/products/edit/:id' element={<EditProduct />} />
                  <Route path='/supplier-dashboard/products/add' element={<AddProduct />}/>
                  <Route path='/supplier-dashboard/schedule' element={<Schedule/>} />
                 
                  
                  <Route path='/supplier-dashboard/orders' element={<Orders />} />
                </Route>
                <Route path='/profile' element={<Profile />} />
                <Route path='/register' element={<Register />} />
                <Route path='/forgot-password' element={<ForgotPassword />} />
                <Route path='/reset-password/form/:uidb64/:token' element={<ResetPassword />} />
                <Route path='/payment' element={<Payment />} />
                <Route path='/test' element={<ApiTest />} />
                <Route path='/simulation' element={<HardwareSimulation />} />
                <Route path='/hardware-register' element={<HardwareRegister/>}/>              </Routes>
            </CartContextProvider>
          </CsrfTokenContextProvider>
        </UserContextProvider>
      </Router>
    </>
  );
}

export default App;

