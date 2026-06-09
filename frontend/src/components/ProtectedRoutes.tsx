import { Navigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import type { ReactNode } from "react"

type Props = {
    children: ReactNode
}

const ProtectedRoutes = ({ children }: Props) => {
    const { token, isLoading } = useAuth();
    if (isLoading) {
        return (
            <div className="w-full min-h-[80vh] flex items-center justify-center bg-[#faf7f2]">
                <div className="flex flex-col items-center gap-3">
                    <div className="w-8 h-8 border-[3px] border-[#E67A62] border-t-transparent rounded-full animate-spin" />
                    <span className="text-sm font-medium text-zinc-500">Loading...</span>
                </div>
            </div>
        );
    }

    if (!token) {
        return <Navigate to="/signin" replace />
    }

    return children;
}

export default ProtectedRoutes;