import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import Home from './pages/Home';
import Signup from './pages/Signup';
import Signin from './pages/Signin';
import Profile from './pages/Profile/Profile.jsx';
import Unauthorized from './pages/Unauthorized';
import RequireAuth from './auth/RequireAuth';



function App() {
  return (
    <Router>
        <Routes>
       
        <Route path='/signup' element={<Signup />} />
          <Route path='/signin' element={<Signin />} />
          <Route path='/unauth' element={<Unauthorized/>} /> 
          <Route path="/profile" element={<Profile />} />
          <Route path='/' element={<Home />} />
          <Route path='/user-activation' element={<UserActivation />} />
          <Route element={<RequireAuth/>}>
          {/* Simply after you're done place the pages that requires authentication here */}
          </Route>


        </Routes>
      </Router>
  );
}

export default App;
