import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import Home from './pages/Home';
import Signup from './pages/Signup';
import Signin from './pages/Signin';
import Profile from './pages/Profile/Profile.jsx';
import Unauthorized from './pages/Unauthorized';
import RequireAuth from './pages/RequireAuth';
import UserActivation from './pages/ActivateUsers';

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/user-activation' element={<UserActivation />} />
        <Route path='/profile' element={<Profile />} />
        <Route path='/' element={<Home />} />
        <Route path='/signup' element={<Signup />} />
        <Route path='/signin' element={<Signin />} />
      
        {/* <Route element={<RequireAuth />}></Route> */}

        
      </Routes>
    </Router>
  );
}

export default App;
