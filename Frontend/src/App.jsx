import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import {
  Products,
  AddProduct,
  EditProduct,
  Schedule,
  Orders,
  Home,
  ProductDetail,
  Profile,
  Payment,
  OrderCreated
} from './url.jsx';
import {Toaster} from 'sonner';
import ApiTest from './pages/Test.jsx';
import {AdminRoute, SupplierRoute, RetailerRoute} from "@/Components"
import {Register, Login, UserActivation, ForgotPassword, ResetPassword, Cart, HardwareSimulation, DeviceRegister, FourOhFour, RetDashboard, BulkView, ProductView} from '@/pages';
import {UserContextProvider,CsrfTokenContextProvider,CartContextProvider} from '@/Contexts'

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
                <Route path='/product/:id' element={<ProductDetail />} />
                <Route path='/login' element={<Login />} />
                <Route path='/user-activation'element={  <AdminRoute> <UserActivation /></AdminRoute>} />
                <Route>
                  {/* <Route path='/SupplierDashboard' element={<SupplierRoute><SupplierDashboard /> </SupplierRoute>} /> */}
                  <Route path='/supplier-dashboard/products' element={<SupplierRoute><Products /></SupplierRoute>} />
                  <Route path='/supplier-dashboard/products/edit/:id' element={<EditProduct />} />
                  <Route path='/supplier-dashboard/products/add' element={<AddProduct />} />
                  <Route path='/supplier-dashboard/schedule' element={<Schedule />} />
                  <Route path='/supplier-dashboard/orders' element={<Orders />} />
                </Route>
                <Route path='/profile' element={<Profile />} />
                <Route path='/register' element={<Register />} />
                <Route path='/forgot-password' element={<ForgotPassword />} />
                <Route path='/reset-password/form/:uidb64/:token' element={<ResetPassword />} />
                <Route path='/payment' element={<RetailerRoute><Payment /></RetailerRoute>} />
                <Route path='/order-created' element={<OrderCreated/>}/>
                <Route path='/test' element={<ApiTest />} />
                <Route path='/simulation' element={<HardwareSimulation />} />
                <Route path='/retailer-dashboard/device-register' element={<DeviceRegister />} />
                <Route path='/retailer-dashboard' element={<RetDashboard />} />
                <Route path='/retailer-dashboard/my-products' element={<ProductView/>}></Route>
                <Route path='/retailer-dashboard/my-products/view/:product_id' element={<BulkView/>}></Route>
                <Route path='/*' element={<FourOhFour></FourOhFour>}></Route>
              </Routes>
            </CartContextProvider>
          </CsrfTokenContextProvider>
        </UserContextProvider>
      </Router>
    </>
  );
}

export default App;
