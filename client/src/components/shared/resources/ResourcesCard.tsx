"use client"

import { BASE_URL, authRoute } from '@/constants/api'
import { usePopUp } from '@/hooks/usePopUp'
import { httpDeleteService } from '@/services/httpDeleteService'
import { checkImgUrl } from '@/utils/chekImgUrl'
import Link from 'next/link'
import {  usePathname } from 'next/navigation'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { BiSolidImageAlt } from 'react-icons/bi'
import { BsQuestionCircle } from 'react-icons/bs'
import { FaTrash } from 'react-icons/fa'
import { HiMiniArrowLongRight } from 'react-icons/hi2'
import { IoMdCheckmarkCircleOutline } from 'react-icons/io'
import { MdErrorOutline } from 'react-icons/md'
import { RiPencilFill } from 'react-icons/ri'
import { useMutation } from 'react-query'
import { FallBackImage } from '../all/FallBackImage'

export type ResourcesCardProps = {
    imgUrl: string,
    title:string,
    titles:any,
    _id:string,
    route:string,
    refetch?: () => void,
    inquiryRoute:string,
    deleteRedirectURL:string,
    editPageURL:string,
}
function ResourcesCard({imgUrl,editPageURL,deleteRedirectURL,title,titles,_id,route,refetch,inquiryRoute}:ResourcesCardProps) {
    
    const titlesKeys = Object.keys(titles)    
    const pathName = usePathname()
    const popUp = usePopUp()
    const router = useRouter()

    

    const {mutate} = useMutation({
        mutationFn: async () => httpDeleteService(`${route}/${_id}`),
        
        onSuccess:async () => {
            refetch && refetch()
            router.push(deleteRedirectURL)
            popUp({
                popUpIcon:<IoMdCheckmarkCircleOutline/>,
                popUpMessage:"item deleted successfully",
                popUpType:"alert",
                showPopUp:true,
                popUpTitle:"item deleted",
            })
        },
        onError:async () => {
            popUp({
                popUpIcon:<MdErrorOutline />,
                popUpMessage:"error on deleting item, please try again",
                popUpType:"alert",
                showPopUp:true,
                popUpTitle:"error on item deleting",
            })
        }
    })

  

    const handleDelete = () => {
        popUp({
            popUpIcon:<BsQuestionCircle />,
            popUpMessage:"are you sure about deleting this item ?",
            popUpResolveFunc:mutate,
            popUpType:"confirm",
            showPopUp:true,
            popUpTitle:"delete item",
        })
    }

    
    return (
        <div className='h-[340px] duration-300 hover:shadow-lg hover:!border-opacity-10 border-opacity-40 border border-dark-grey text-center items-center justify-between w-full flex flex-col  rounded-3xl'>
            <div className='h-[150px] w-full px-4 pt-4'>
                <div className={`w-full h-full  rounded-2xl overflow-hidden`}>
                    
                        
                    
                    <FallBackImage
                        fallback={<BiSolidImageAlt className='w-full bg-light-grey bg-opacity-40 text-4xl h-full text-dark-grey opacity-30' />}
                        url={imgUrl} 
                        className='w-full bg-light-grey h-[180px] object-cover'
                    />
                    
                </div>
            </div>

            <div className='w-full p-4'>
                <div>
                    <p className='my-3 truncate text-md text-dark-grey font-semibold'>{title}</p>
                </div>

                <div className='text-md w-full'>
                    {
                        titlesKeys.map((key,idx)=> (
                            <div className='overflow-hidden flex justify-center gap-1' key={idx}>
                                <div className='text-zinc-400 w-max'>{key} : </div>
                                <span className='text-dark-grey truncate  max-w-[130px]'> {titles[key]}</span>
                            </div>
                        ))
                    }
                </div>
            </div>

            <div className='h-[50px] relative border-t py-2 px-4 border-dark-grey border-opacity-40 w-full flex justify-between items-center'>
            
                <div className='w-fit gap-2 flex items-center text-dark-grey h-[20px] justify-between'>
                   
                    <button className='hover:text-red-500 text-md duration-300' onClick={handleDelete}>
                        <FaTrash/>
                    </button>
                    <span className='h-[30px] w-[1.25px] bg-dark-grey opacity-40'/>
                    <Link className='hover:text-primary text-2xl duration-300' href={editPageURL}>
                        <RiPencilFill />
                    </Link>
                </div>

                <Link href={`/inquiry/${inquiryRoute}/${_id}`} className='flex h-[30px] w-[110px] justify-center gap-2 capitalize items-center text-sm p-2 rounded-lg border text-primary border-primary duration-300 hover:bg-primary hover:text-smokey-white'>
                    <span>see more</span>
                    <HiMiniArrowLongRight className='text-sm'/>

                </Link>
            </div>
        </div>
    )
}

export default ResourcesCard