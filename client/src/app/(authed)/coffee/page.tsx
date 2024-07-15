"use client"

import Input from "@/components/shared/all/Input"
import { authRoute } from "@/constants/api"
import { httpPostService } from "@/services/httpPostService"
import toastify from "@/utils/toastify"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { useMutation } from "react-query"

function Coffee() {
    const [email,setEmail] = useState<string>('')
    const [password,setPassword] = useState<string>('')
    const router = useRouter()

    useEffect(()=>{
        if(localStorage.getItem("coffee_token"))
            router.push("/sales/coffee")
    },[])
    
    const {mutate:login} = useMutation({
        mutationFn:async()=> httpPostService(`${authRoute}/login`,JSON.stringify({
            email,
            password
        })),
        onSuccess:async(response)=> {
            console.log(response);
            
            if (response.data) {
                const {data:{user}} = response
                localStorage.setItem("coffee_token",user.token)
                toastify("logged in successfully ✅")
                router.push("/coffee/controls")
                return
            }
            toastify("email or password might be wrong ❌")
        },
        onError:()=> {
            toastify("error on requesting data please try later")
        }
    })
    

    return (
        <section className='h-screen flex justify-center items-center relative bg-cover bg-[url(/images/farm.png)]'>
        
            <span className='w-full h-screen absolute top-0 left-0 bg-[#383F51] opacity-80'/>


            <div className=' w-[70%]  p-5 sm:w-[450px] bg-smokey-white bg-opacity-30 backdrop-blur-sm rounded-3xl border-2 border-solid border-opacity-30 border-smokey-white'>

                <h6 className='text-smokey-white text-xl'>coffee login</h6>
                <div className='flex flex-col items-center'>
                    <img src="/svgs/logo.svg" className='w-[250px] aspect-square' alt="" />
                
                    <div className='w-full sm:w-4/5 space-y-5'>
                        <Input
                            type='text' 
                            value={email} 
                            setValue={setEmail}
                            className='h-[50px] w-full placeholder:text-dark-grey text-dark-grey p-3 text-xl rounded-xl !bg-zinc-300'
                            placeholder='Email'
                        />
                        <Input 
                            type='password' 
                            value={password}  
                            setValue={setPassword} 
                            className='h-[50px] w-full placeholder:text-dark-grey text-dark-grey p-3 text-xl rounded-xl !bg-zinc-300'
                            placeholder='Password'
                        />

                    </div>

                    <button 
                        className='text-smokey-white text-3xl mt-10 h-[60px] w-full sm:w-3/5 bg-primary rounded-xl mb-20' 
                        onClick={() => login()}
                    >
                        coffee login
                    </button>
                </div>
            </div>
        </section>
    )
}

export default Coffee