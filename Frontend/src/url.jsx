import Products from './pages/Supplier/Components/Products';
import AddProduct from './pages/Supplier/Components/AddProduct';
import EditProduct from './pages/Supplier/Components/EditProduct';
import Schedule from './pages/Supplier/Components/Schedule';
import Orders from './pages/Supplier/Components/Orders';

import Home from './pages/Home/Home.jsx';
import ProductDetail from './pages/ProductDetail/ProductDetail.jsx';
import Profile from './pages/Profile/Profile.jsx';
import UserActivation from './pages/Admin/ActivateUsers.jsx';

import {Register, Login, ForgotPassword, ResetPassword} from './pages/index.jsx';

import {AdminRoute, SupplierRoute} from './Components/index.jsx';
import {UserContextProvider, CsrfTokenContextProvider, CartContextProvider} from './Contexts/index.jsx';
import Payment from './pages/Payment/Payment.jsx';

import Cart from './pages/Cart/Cart.jsx';
import Navbar from './pages/Home/Components/Navbar/Navbar.jsx';
import Header from './pages/Home/Components/Header/Header.jsx';

export {
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
};
