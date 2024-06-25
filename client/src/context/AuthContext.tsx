'use client'

import { getToken } from "@/services/authServices"
import { createContext, useContext, useEffect, useLayoutEffect, useState } from "react"

export type AuthProviderData = {
    isAuth: boolean,
    setIsAuth:(state:boolean) => void
} | undefined

const Context = createContext<AuthProviderData>(undefined)
function AuthProvider({children}:Children) {
    
    

    const [isAuth, setIsAuth] = useState<boolean>(false)
    const authProviderData = {
        isAuth,
        setIsAuth
    }
    
    useLayoutEffect(()=>{
        const token :string|null = getToken() 
        if (token) {
            setIsAuth(true)
        }
    },[])
    
    return (
        <Context.Provider value={authProviderData}>
            {children}
        </Context.Provider>
    )
}

export default AuthProvider



export const useAuthProvider = () => useContext(Context);