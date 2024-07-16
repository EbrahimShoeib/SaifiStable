"use client"

import { AuthProviderData, useAuthProvider } from "@/context/AuthContext"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

function IsAuthTemplate({children}:Children) {
    const auth :AuthProviderData = useAuthProvider()
    const router = useRouter()
    useEffect(()=>{
        if (!auth?.isAuth) {
            return router.push("/login")
        }
    },[auth?.isAuth])
    return (
        <>
            {children}
        </>
    )
}

export default IsAuthTemplate