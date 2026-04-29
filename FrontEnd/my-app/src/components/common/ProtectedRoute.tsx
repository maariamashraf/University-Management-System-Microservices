import { Navigate } from "react-router-dom";
import { getToken } from "../../Services/authService";

interface ProtectedRouteProps {
    children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
    if (!getToken()) {
        return <Navigate to="/" replace />;
    }

    return children;
}
