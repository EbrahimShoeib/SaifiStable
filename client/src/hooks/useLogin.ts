import { BASE_URL } from "@/constants/api";
import { AuthProviderData, useAuthProvider } from "@/context/AuthContext";
import { setToken, setUser } from "@/services/authServices";
import { httpPostService } from "@/services/httpPostService";
import toastify from "@/utils/toastify";
import { useMutation } from "react-query";


const authRoute = `/auth/login`

const login = async (email:string,password:string) => {

    const body = JSON.stringify({
        email,
        password
    })

    const loginData = await httpPostService(authRoute,body)

    return loginData;
}
function useLogin(email: string, password: string) {

    const auth:AuthProviderData = useAuthProvider()    
    const {mutate} = useMutation({
        mutationFn:async()=>login(email,password),
        onSuccess:async(response)=> {
            //console.log(response);
            
            if (response.data) {
                const {data:{user}} = response
                setToken(user.token)
                setUser(user)                
                auth?.setToken(user.token)
                toastify("logged in successfully ✅")
                
                return
            }
            toastify("email or password might be wrong ❌")
        },
        onError:()=> {
            toastify("error on requesting data please try later")
        }
    })

    return mutate
}
export default useLogin