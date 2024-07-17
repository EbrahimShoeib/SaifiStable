'use client'

import { getToken } from "@/services/authServices";
import { createContext, useContext, useEffect, useState } from "react";
import { decodeToken } from "react-jwt";

export type AuthProviderData = {
    isAuth: boolean,
    setIsAuth: (state: boolean) => void,
    decodedUser: any,
    setToken: (state: string) => void,
    token: string
} | undefined;

const Context = createContext<AuthProviderData>(undefined);

function AuthProvider({ children }: { children: React.ReactNode }) {
    const [isAuth, setIsAuth] = useState<boolean>(false);
    const [decodedUser, setDecodedUser] = useState<any>(null);
    const [token, setToken] = useState<string>("");

    useEffect(() => {
        const localToken: string | null = getToken();
        if (localToken) {
            setToken(localToken);
        }
    }, []);

    useEffect(() => {
        if (token) {
            const decoded = decodeToken(token);
            setDecodedUser(decoded);
            if (decoded) {
                setIsAuth(true); 
            }
        } else {
            setDecodedUser(null);
        }
    }, [token]);


    const authProviderData = {
        isAuth,
        setIsAuth,
        decodedUser,
        setToken,
        token
    };

    return (
        <Context.Provider value={authProviderData}>
            {children}
        </Context.Provider>
    );
}

export default AuthProvider;

export const useAuthProvider =() => useContext(Context);
