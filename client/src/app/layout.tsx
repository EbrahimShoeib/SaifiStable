
import type { Metadata } from "next";

import "../styles/globals.css";
import ReactQueryProvider from "@/components/providers/ReactQueryProvider";
import AuthProvider from "@/context/AuthContext";
import ReactToastifyProvider from "@/components/providers/ReactToastifyProvider";
import PopUpProvider from "@/context/PopUpContext";
import { Poppins } from 'next/font/google'



export const metadata: Metadata = {
    title: "Saifi Stable",
    description: "horses stable web application and system",
};



const poppins = Poppins({weight:"400",preload:false})

export default function RootLayout({children}:RootLayoutProps) {
    return (
        <html lang="en">
            <body className={poppins.className}>

                <ReactQueryProvider>
                        <AuthProvider>
                            <PopUpProvider>
                                <ReactToastifyProvider>
                                    {children}
                                </ReactToastifyProvider>
                            </PopUpProvider>
                        </AuthProvider>
                </ReactQueryProvider>
            </body>
        </html>
    );
}