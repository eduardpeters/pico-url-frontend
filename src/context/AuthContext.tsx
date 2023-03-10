import { createContext, ReactNode, useContext, useState } from "react";

interface UserDetailsInterface {
    id: string;
    name: string;
    email: string;
    token: string;
}

interface AuthContextInterface {
    isLoggedIn: boolean;
    setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
    userDetails: UserDetailsInterface | null;
    setUserDetails: React.Dispatch<React.SetStateAction<UserDetailsInterface | null>>;

}

const AuthContext = createContext<AuthContextInterface | null>(null);

export function AuthContextProvider({ children }: { children: ReactNode}) {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userDetails, setUserDetails] = useState<UserDetailsInterface | null>(null);

    return (
        <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn, userDetails, setUserDetails }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuthContext() {
    return useContext(AuthContext);
}