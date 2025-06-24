import { Navigate } from "react-router-dom";
import { useAutCtx } from "./AuthProvider";

export default function AuthenticatedRoute({ children }) {
    const { autenticado } = useAutCtx();

    if (!autenticado) {
        return <Navigate to="/login" replace />;
    } 
    return children;
}
