import { BASE_URL } from "@/constants/api"
import { getToken } from "./authServices";


export const httpGetServices = async (url:string) => {

    const token = getToken() as string 
    try {
        const response = await fetch(`${BASE_URL}${url}`, {
            //mode: 'no-cors',

            headers: {
                'Content-Type': 'application/json',
                'token': token
            },
            method: "GET"
        });
        
        return await response.json();
    } catch (error) {
        return {status:"error",error:error,data:null}
    }
}