"use client";

import { AuthProviderData, useAuthProvider } from "@/context/AuthContext";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

function IsAuthLayout({ children }: { children: React.ReactNode }) {
    const auth: AuthProviderData = useAuthProvider();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        if (!auth?.isAuth && pathname !== '/login') {
            router.push("/login");
        } else if (auth?.isAuth) {
            if (pathname === '/coffee' && auth?.decodedUser?.isAdmin === true) {
                router.push('/');
            } else if (pathname !== '/coffee' && pathname !== "/login" && auth?.decodedUser?.isAdmin === false) {
                router.push('/coffee');
            }
        }
    }, [pathname]);

    useEffect(()=>{
        console.log(auth?.isAuth&& pathname === "/login")
        if (auth?.isAuth&& pathname === "/login") {
            if (auth?.decodedUser?.isAdmin === true)
                router.push('/')
            else 
                router.push("/coffee")
        }else if (!auth?.isAuth) {
            router.push('/login')
        }
    },[auth])
    
    return (
        <>
            {children}
        </>
    );
}

export default IsAuthLayout;
