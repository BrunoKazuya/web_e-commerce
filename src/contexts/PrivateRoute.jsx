import { Navigate } from "react-router-dom"
import { useAuth } from "./AuthContext"
import { useUser } from "./UserContext"

const PrivateRoute = ({children, requiredRole}) => {
    const { isLoggedIn } = useAuth()
    const { getUser } = useUser()
    if(!isLoggedIn){
        return <Navigate to={"/auth"} replace/>
    }

    const user = getUser()

    if(requiredRole && user.role != requiredRole){
        return <Navigate to={"/"} replace/>
    }

    return children
}

export default PrivateRoute