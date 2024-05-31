"use client"

import ImageUploadInput from '@/components/shared/all/ImageUploadInput'
import Input from '@/components/shared/all/Input'
import Loader from '@/components/layout/Loader'
import PageContent from '@/components/layout/PageContent'
import React, { useEffect, useState } from 'react'
import { BiSolidPencil } from 'react-icons/bi'
import { FaUserCircle } from 'react-icons/fa'
import { checkImgUrl } from '@/utils/chekImgUrl'

type setInputState = (newState:string) => void

type SettingsPageContentProps = {
    avatar:string,
    email:string,
    setEmail:setInputState,
    fullName:string,
    setAddress:setInputState,
    address:string,
    setFullName:setInputState,
    mobile:string,
    setMobile:setInputState,
    handleAdminUpdate:(e:any)=> void,
    setImage:(newState:FormData) => void,
    image:FormData|undefined,
    isLoading:boolean,
    setAvatar:(newState:string) => void
}



function SettingsPageContent({
    avatar,
    email,
    setEmail,
    fullName,
    setAddress,
    address,
    setFullName,
    mobile,
    setMobile,
    handleAdminUpdate,
    setImage,
    image,
    isLoading,
    setAvatar
}:SettingsPageContentProps) {

    const changeAvatar = (file:Blob) => {
        const reader = new FileReader()
        reader.onload = (e:any) => {
            const result = e.target.result
            result && setAvatar(result)
        }

        file && reader.readAsDataURL(file)
    }
    

    const [avatarUrl,setAvatarUrl] = useState<string>('')

    useEffect(()=>{
        checkImgUrl(avatar,()=>setAvatarUrl(avatar))
    },[avatar])

    const inputs:Input[] = [
        {
            value:fullName,
            placeholder:"edit full name",
            type:"text",
            label:"full name   :",
            setValue:setFullName,
        },
        {
            value:email,
            placeholder:"edit email",
            type:"text",
            label:"email           :",
            setValue:setEmail,
        },
        {
            value:address,
            placeholder:"edit address",
            type:"text",
            label:"address      :",
            setValue:setAddress,
        },
        {
            value:mobile,
            placeholder:"edit mobile",
            type:"number",
            label:"mobile         :",
            setValue:setMobile,
        },
    ]

    return (
        <PageContent>
            <Loader isLoading={isLoading}>
                <div className=' flex flex-col w-full'>
                    
                    <div className='h-[250px] flex-col gap-5 w-full flex justify-end items-center'>
                        
                        <div className='border-primary border-4 relative aspect-square rounded-full w-[120px]'>
                            <ImageUploadInput onChange={changeAvatar} formDataFile={image} setFormDataFile={setImage}>
                                {
                                    Boolean(avatarUrl) ? 
                                    (<img 
                                        className=' w-full block object-cover aspect-square rounded-full overflow-hidden' src={avatarUrl}/>
                                    ) :
                                    (<FaUserCircle className='w-full text-light-grey h-full'/>)
                                }
                                
                            </ImageUploadInput>
                            <span className='bg-smokey-white text-primary  border-[3px] border-primary rounded-full flex justify-center items-center w-[25px] left-3/4 bottom-0 aspect-square absolute '>
                                <BiSolidPencil />
                            </span>
                        </div>
                        <p className='font-bold text-dark-grey text-2xl'>{fullName}</p>
                    </div>

                    <div className='w-full p-16 gap-x-20 gap-y-7 grid grid-cols-[repeat(2,minmax(300px,1fr))] flex-1'>
                        

                        {
                            inputs.map((input:Input,idx:number) => (
                                <div key={idx}>
                                    <Input
                                        value={input.value} 
                                        placeholder={input.placeholder}
                                        type={input.type}
                                        label={input.label}
                                        setValue={input.setValue}
                                        labelClassName='text-md text-dark-grey font-semibold'
                                        className='border w-full border-solid placeholder:text-dark-grey placeholder:text-opacity-45 border-dark-grey border-opacity-40 rounded-lg text-md h-[35px] bg-transparent p-3'
                                    />
                                </div>
                            ))
                        }
                    </div>

                    <button
                        className='w-[350px] mx-auto mb-[70px] text-2xl rounded-2xl duration-300 hover:text-smokey-white hover:bg-primary h-[60px] border capitalize border-primary text-primary font-semibold'
                        onClick={handleAdminUpdate}
                    >
                        save
                    </button>
                </div>
            </Loader>
        </PageContent>
    )
}

export default SettingsPageContent


