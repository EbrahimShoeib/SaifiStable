'use client'

import { AuthProviderData, useAuthProvider } from "@/context/AuthContext"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

function ProtectLogin({children}:Children) {
    // const auth :AuthProviderData = useAuthProvider()
    // const router = useRouter()
    // useEffect(()=>{
    //     if (auth?.isAuth) {
    //         if (auth.decodedUser.isAdmin === true)
    //             router.push('/')
    //         else 
    //             router.push("/coffee")
    //     }
    // },[auth])
    return (
        <>
            {children}
        </>
    )
}

export default ProtectLogin