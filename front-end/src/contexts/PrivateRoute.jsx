import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext";
import Loading from "../components/ui/Loading"; // Supondo que você tenha

const PrivateRoute = ({ children, requiredRole }) => {
    // Pega tudo que precisa APENAS do AuthContext
    const { isLoggedIn, authStatus, user } = useAuth();
    const location = useLocation();

    // 1. Se ainda estivermos verificando a sessão (loading), mostre um indicador.
    // Isso evita um "piscar" para a tela de login antes da verificação terminar.
    if (authStatus === 'loading') {
        return <Loading size="lg" />;
    }

    // 2. Se a verificação terminou e o usuário NÃO está logado, redirecione para o login.
    // Guardamos a página que ele tentou acessar para redirecioná-lo de volta após o login.
    if (!isLoggedIn) {
        return <Navigate to="/auth" state={{ from: location }} replace />;
    }
    
    // 3. Se o usuário está logado, mas a rota exige um papel de 'admin' e ele não é,
    // redirecione para a página inicial.
    if (requiredRole && user.role !== requiredRole) {
        return <Navigate to="/" replace />;
    }

    // 4. Se todas as verificações passaram, renderize o componente filho (a página protegida).
    return children;
}

export default PrivateRoute;