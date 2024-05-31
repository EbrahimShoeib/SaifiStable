"use client"

import { BASE_URL, authRoute } from '@/constants/api'
import { getUser } from '@/services/authServices'
import { checkImgUrl } from '@/utils/chekImgUrl'
import Link from 'next/link'
import React, { useEffect, useRef, useState } from 'react'
import { FaUserCircle } from 'react-icons/fa'
import { IoMdSettings } from 'react-icons/io'
import { TiArrowSortedDown } from 'react-icons/ti'

type AvatarImageProps = {
    avatar:any
}

const AvatarImage = ({avatar}:AvatarImageProps) => {

    const [avatarUrl,setAvatarUrl] = useState<string>('')


    useEffect(()=>{
        checkImgUrl(avatar,()=>setAvatarUrl(avatar))
    },[avatar])

    return (
        <div className='w-[30px] flex justify-center items-center bg-dark-grey aspect-square overflow-hidden rounded-full '>
            {
                Boolean(avatarUrl) ?
                (<img 
                    className='w-full h-full object-cover' 
                    src={avatarUrl} 
                    alt="img" 
                />) :
                (<FaUserCircle className='w-full h-full uppercase text-zinc-400'/>)
            }
        </div>
    )
}

function Avatar() {

    const [user,setUser] = useState<any>({})

    useEffect(()=>{
        setUser(getUser())
    },[])
    
    const avatar = `${BASE_URL}${authRoute}/uploads/${user?._id}`
   
    return (
        <>
            
            <div className='relative avatar'>
                <div className='flex h-[40px] items-center gap-2'>
                    <AvatarImage avatar={avatar}/>
                    <TiArrowSortedDown className='text-xl text-primary' />
                </div>
                
                <div className='avatar_infos w-[250px] hidden flex-col p-3 absolute shadow-xl top-[40px] right-0 z-50 h-[200px] bg-smokey-white rounded-2xl'>
                    
                    <div className='flex-1 flex-col flex justify-center items-center'>
                        <div className='w-fit h-fit rounded-full border-2 border-primary'>
                            <AvatarImage avatar={avatar}/>
                        </div>
                        <p className='font-bold text-dark-grey mt-2 text-lg truncate '>{user?.fullName}</p>
                        <p className='text-primary text-sm'>{user?.isAdmin && "admin"}</p>
                    </div>

                    <div className='h-[40px] flex pt-3 items-center border-t border-t-light-grey border-opacity-40'>
                        <Link href="/profile/settings" className='text-dark-grey flex items-center gap-2 text-lg'>
                            <IoMdSettings/>
                            settings
                        </Link>
                    </div>
                </div>
               
            </div>
        </>
    )
}

export default Avatar