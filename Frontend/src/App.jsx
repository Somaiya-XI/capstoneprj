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
  OrderCreated,
  SettingsLayout,
  OrdersLayout,
  ProductDetail2
} from './url.jsx';
import {Toaster} from 'sonner';
import {AdminRoute, SupplierRoute, RetailerRoute} from "@/Components"
import {Register, Login, UserActivation, ForgotPassword, ResetPassword, Cart, HardwareSimulation, FourOhFour, RetDashboard, BulkView, ProductView, SmartCart, DeviceRegister} from '@/pages';
import {UserContextProvider,CsrfTokenContextProvider,CartContextProvider} from '@/Contexts'

function App() {
  return (
    <>
      <Toaster position='top-right' visibleToasts={1} duration={1500} />
      <Router>
        <UserContextProvider>
          <CsrfTokenContextProvider>
            <CartContextProvider>
              <Routes>
                <Route path='/' element={<Home />} />
                <Route path='/cart' element={<RetailerRoute><Cart /></RetailerRoute>} />
                <Route path='/product/:id' element={<ProductDetail />} />
                <Route path='/supplier_product/:id' element={<ProductDetail2 />} />
                <Route path='/login' element={<Login />} />
                <Route path='/user-activation'element={  <AdminRoute> <UserActivation /></AdminRoute>} />
                <Route>
                  {/* <Route path='/SupplierDashboard' element={<SupplierRoute><SupplierDashboard /> </SupplierRoute>} /> */}
                  <Route path='/supplier-dashboard/products' element={<SupplierRoute><Products /></SupplierRoute>} />
                  <Route path='/supplier-dashboard/products/edit/:id' element={<SupplierRoute><EditProduct /></SupplierRoute>} />
                  <Route path='/supplier-dashboard/products/add' element={<SupplierRoute><AddProduct /></SupplierRoute>} />
                  <Route path='/supplier-dashboard/schedule' element={<SupplierRoute><Schedule /></SupplierRoute>} />
                  <Route path='/supplier-dashboard/orders' element={<SupplierRoute><Orders /></SupplierRoute>} />
                </Route>
                <Route path='/profile' element={<Profile />} />
                <Route path='/register' element={<Register />} />
                <Route path='/forgot-password' element={<ForgotPassword />} />
                <Route path='/reset-password/form/:uidb64/:token' element={<ResetPassword />} />
                <Route path='/payment' element={<RetailerRoute><Payment /></RetailerRoute>} />
                <Route path='/order-created/:id' element={<RetailerRoute><OrderCreated/></RetailerRoute>}/>
                <Route path='/simulation' element={<HardwareSimulation />} />
                <Route path='/retailer-dashboard/smart-dashboard' element={<RetailerRoute><SmartCart /></RetailerRoute>} />
                <Route path='/retailer-dashboard' element={<RetailerRoute><RetDashboard /></RetailerRoute>} />
                <Route path='/retailer-dashboard/settings' element={<RetailerRoute><SettingsLayout/></RetailerRoute>}></Route>
                <Route path='/retailer-dashboard/my-products' element={<RetailerRoute><ProductView/></RetailerRoute>}></Route>
                <Route path='/retailer-dashboard/my-products/view/:product_id' element={<RetailerRoute><BulkView/></RetailerRoute>}></Route>
                <Route path='/retailer-dashboard/orders' element={<RetailerRoute><OrdersLayout/></RetailerRoute>}></Route>
                <Route path='/retailer-dashboard/device-register/' element={<RetailerRoute><DeviceRegister/></RetailerRoute>}></Route>
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