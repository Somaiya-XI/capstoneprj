import {useLocation, Navigate, Outlet} from 'react-router-dom'
import useAuth from "../hooks/useAuth"

const RequireAuth = () => {
    // whether the user is logged in or nah
    const {auth} = useAuth();
    const location = useLocation();

    return (
        auth?.user
            ?<Outlet/>
            // replace the signin in their navigation history to their location they came from
            : <Navigate to="/signin" state={{from: location}} replace />
    )
}

export default RequireAuth;