"use client"

import Input from '@/components/shared/all/Input'
import useLogin from '@/hooks/useLogin'
import React, { useState } from 'react'


function LoginPage() {

    const [email,setEmail] = useState<string>('')
    const [password,setPassword] = useState<string>('')

   
    
    const login = useLogin(email,password)
    

    return (
        <section className='h-screen flex justify-center items-center relative bg-cover bg-[url(/images/farm.png)]'>
        
            <span className='w-full h-screen absolute top-0 left-0 bg-[#383F51] opacity-80'/>


            <div className=' w-[70%]  p-5 sm:w-[450px] bg-smokey-white bg-opacity-30 backdrop-blur-sm rounded-3xl border-2 border-solid border-opacity-30 border-smokey-white'>

                <h6 className='text-smokey-white text-xl'>welcome back</h6>
                <div className='flex flex-col items-center'>
                    <img src="/svgs/logo.svg" className='w-[250px] aspect-square' alt="" />
                
                    {/* <div className="flex w-full sm:w-4/5 mb-5 justify-between items-center">
                        <div>
                            <label className='mr-2' htmlFor="admin">login as admin</label>
                            <input className='accent-primary' type="radio" name="status" id="admin" />
                        </div>
                        <div>
                            <label className='mr-2' htmlFor="user">login as user</label>
                            <input className='accent-primary' type="radio" name="status" id="user" />
                        </div>
                    </div> */}
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
                        login
                    </button>
                </div>
            </div>
        </section>
    )
}



export default LoginPage