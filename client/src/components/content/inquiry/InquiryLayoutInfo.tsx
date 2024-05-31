import { BASE_URL, authRoute } from '@/constants/api'
import React from 'react'
import { FaUserCircle } from 'react-icons/fa'

function InquiryLayoutInfo({item}:{item:InquiryLayoutItemInfos}) {
    const {avatarUrl,itemDataSubTitles,role,title} = item
    return (
        <div className="w-full py-5 flex h-[200px] rounded-2xl bg-smokey-white">
                        
            <div className="h-full mr-20 flex flex-col items-center w-fit ml-10">
                <div className="w-[80px] aspect-square text-light-grey overflow-hidden rounded-full border-primary border-2">
                    {
                        Boolean(avatarUrl) ? 
                        (<img
                            className=' w-full block object-cover aspect-square rounded-full overflow-hidden' 
                            src={`${BASE_URL}${avatarUrl}`}/>) :
                        (<FaUserCircle className='w-full h-full'/>)
                    }
                </div>
                <p className="text-dark-grey mt-2 mb-1 break-words text-center max-w-[120px] font-semibold">{title}</p>
                <p className="text-primary text-sm">{role}</p>
            </div>

            <div className="grid gap-x-12 grid-cols-[repeat(2,1fr)]">
                {
                    Object.keys(itemDataSubTitles)?.map((subTitleKey:string,idx:number) => (
                        <div key={idx} className="w-full gap-5 flex  items-center">
                            <p className="text-dark-grey whitespace-nowrap font-semibold">{subTitleKey} : </p>
                            <p className="text-light-grey">{itemDataSubTitles[subTitleKey]}</p> 
                        </div>
                    ))
                }
            </div>

        </div>
    )
}

export default InquiryLayoutInfo