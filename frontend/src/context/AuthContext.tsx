import { createContext, useState, useContext, type ReactNode, useEffect } from "react";
import { fetchWithAuth } from "../lib/api";

export interface User {
    _id: string,
    name: string,
    email: string,
    credits: number
}

interface AuthContextType {
    user: User | null,
    token: string | null,
    login: (token: string) => void;
    logout: () => void;
    refreshUser: () => Promise<void>;
    isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

type Props = {
    children: ReactNode
}

export function AuthProvider({ children }: Props) {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(localStorage.getItem("token"));
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadUser = async () => {
            if (!token) {
                setIsLoading(false)
                return
            }
            try {
                const response = await fetchWithAuth("/auth/me")
                if (!response.ok) {
                    throw new Error("Failed to refresh user")
                }
                const data = await response.json();
                if (data.user) {
                    setUser(data.user);
                } else {
                    setToken(null)
                    localStorage.removeItem("token")
                    setUser(null)
                }
            } catch (error) {
                console.error("Failed to refresh user:", error);
            } finally {
                setIsLoading(false);
            }
        }
        loadUser()
    }, [token])

    const login = (token: string) => {
        setToken(token);
        localStorage.setItem("token", token);
    };

    const logout = () => {
        setToken(null);
        setUser(null);
        localStorage.removeItem("token");
    };

    const refreshUser = async () => {
        try {
            setIsLoading(true);
            const response = await fetchWithAuth("/auth/me")

            if (!response.ok) {
                throw new Error("Failed to refresh user")
            }

            const data = await response.json();
            if (data.user) {
                setUser(data.user);
            }

        } catch (error) {
            console.error("Failed to refresh user:", error);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <AuthContext.Provider value={{ user, token, login, logout, refreshUser, isLoading }}>
            {children}
        </AuthContext.Provider>
    )

}

export const useAuth = () => {
    const context = useContext(AuthContext)
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider")
    }
    return context
}