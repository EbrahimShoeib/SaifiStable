import { useAuthProvider } from "@/context/AuthContext"
import { removeToken, removeUser } from "@/services/authServices"
import toastify from "@/utils/toastify"

export const useLogout = () => {
    const auth = useAuthProvider()
    const logoutFunc = () => {
        removeToken()
        removeUser()
        auth?.setIsAuth(false)
        auth?.setToken("")
        
        toastify("logged out successfully ✅")
    }
    return logoutFunc
}