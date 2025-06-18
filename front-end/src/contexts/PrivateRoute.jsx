import { Navigate, useLocation } from "react-router-dom"; // Imports routing components from react-router-dom.
import { useAuth } from "./AuthContext"; // Imports the custom authentication hook.
import Loading from "../components/ui/Loading"; // Imports a loading spinner component.

const PrivateRoute = ({ children, requiredRole }) => { // Defines the PrivateRoute component.
    // Gets everything needed ONLY from the AuthContext.
    const { isLoggedIn, authStatus, user } = useAuth(); // Destructures values from the authentication context.
    const location = useLocation(); // Gets the current location object.

    // 1. If we are still checking the session (loading), show an indicator.
    // This prevents a "flash" to the login screen before the check is complete.
    if (authStatus === 'loading') { // Checks if the initial authentication status is still loading.
        return <Loading size="lg" />; // Renders a loading component to prevent layout shifts.
    }

    // 2. If the check is finished and the user is NOT logged in, redirect to login.
    // We save the page they were trying to access to redirect them back after login.
    if (!isLoggedIn) { // Checks if the user is not authenticated.
        return <Navigate to="/auth" state={{ from: location }} replace />; // Navigates to the /auth route, passing the original location in the state.
    }
    
    // 3. If the user is logged in, but the route requires an 'admin' role and they are not,
    // redirect to the home page.
    if (requiredRole && user.role !== requiredRole) { // Checks if a specific role is required and if the user has it.
        return <Navigate to="/" replace />; // If not, navigates to the homepage.
    }

    // 4. If all checks have passed, render the child component (the protected page).
    return children; // Renders the actual page content.
}

export default PrivateRoute; // Exports the PrivateRoute component.