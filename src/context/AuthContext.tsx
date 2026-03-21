import { createContext, ReactNode, useContext, useEffect, useState } from "react";

export interface UserDetailsInterface {
    id: string;
    name: string;
    email: string;
    token: string;
}

interface AuthContextInterface {
    isLoggedIn: boolean;
    userDetails: UserDetailsInterface | null;
    setUserDetails: React.Dispatch<React.SetStateAction<UserDetailsInterface | null>>;
    logout: () => void;
}

function readStoredAuth(): UserDetailsInterface | null {
    try {
        const stored = localStorage.getItem("auth");
        return stored ? (JSON.parse(stored) as UserDetailsInterface) : null;
    } catch {
        return null;
    }
}

const AuthContext = createContext<AuthContextInterface | null>(null);

export function AuthContextProvider({ children }: { children: ReactNode }) {
    const [userDetails, setUserDetails] = useState<UserDetailsInterface | null>(readStoredAuth);

    const isLoggedIn = userDetails !== null;

    useEffect(() => {
        if (userDetails) {
            localStorage.setItem("auth", JSON.stringify(userDetails));
        } else {
            localStorage.removeItem("auth");
        }
    }, [userDetails]);

    function logout() {
        setUserDetails(null);
    }

    return (
        <AuthContext.Provider value={{ isLoggedIn, userDetails, setUserDetails, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuthContext() {
    return useContext(AuthContext);
}
