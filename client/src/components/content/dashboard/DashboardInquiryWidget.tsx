import { BASE_URL, authRoute } from '@/constants/api'
import React from 'react'

type DashboardInquiryWidgetProps = {
    items:any[]
}
function DashboardInquiryWidget({
    items
}:DashboardInquiryWidgetProps) {

    

    
    return (
        <div className='h-full flex gap-5 flex-col w-1/2 bg-white border border-dark-grey border-opacity-30 rounded-lg p-4 '>
            
            <div className='w-full items-end flex gap-2'>
                <p className='text-dark-grey text-opacity-80 text-2xl font-semibold'>Inquiry</p>
                <p className='text-light-grey text-opacity-70'>{"(the most activity)"}</p>
            </div>
            <div className='flex w-full flex-1 gap-5'>

                <div className='flex-1 items-center flex gap-4'>
                    {
                        items?.map((item:any,idx:number)=>{
                            
                            const infos = {
                                gender:item?.gender ,
                                courses:item?.courses?.length,
                                age:item?.age
                            }

                            return(
                                <div key={idx} className='h-full w-1/3 text-sm flex flex-col '>

                                    <p className='text-center w-full mb-1 text-lg text-light-grey semibold'>client</p>

                                    <div className='h-[200px] w-full items-center flex p-2 flex-col bg-light-grey rounded-lg bg-opacity-5 border-2 border-dark-grey border-opacity-10'>
                                        <div className='w-8 aspect-square flex justify-center items-center overflow-hidden rounded-full bg-light-grey bg-opacity-40 '>
                                            <img src={`${BASE_URL}${authRoute}${item?.avatar}`} className=' w-full h-full' alt="avatar" />
                                        </div>
                                        <p className='text-primary mt-2 mb-1 text-center'>{item?.username}</p>

                                        
                                        <div className='flex w-full divide-y-[1px] divide-dark-grey divide-opacity-40 flex-1 flex-col'>
                                            {
                                                (Object.keys(infos) as Array<keyof typeof infos>).map((key: keyof typeof infos, idx: number) => (
                                                    <div key={idx} className='flex w-full text-[12px] py-1 justify-between'>
                                                        <span className='text-dark-grey text-opacity-50 '>{key}</span>
                                                        <span className='text-primary'>{infos[key]}</span>
                                                    </div>
                                                ))
                                            }

                                        </div>
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>
            </div>
        </div>
    )
}

export default DashboardInquiryWidget