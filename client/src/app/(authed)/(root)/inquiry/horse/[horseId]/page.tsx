"use client"

import InquiryPageLayout from '@/components/content/inquiry/InquiryPageLayout'
import PageHeader from '@/components/layout/PageHeader'
import { horseInquiryRoute, horsesImageUploadRoute } from '@/constants/api'
import { httpGetServices } from '@/services/httpGetService'
import { priceFormatter } from '@/utils/priceFormatter'
import { useParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'

function HorsePage() {
    
    const {horseId} = useParams()
    const [horse,setHorse] = useState<any>(null)
    const [courses,setCourses] = useState<any>([])
    const [isLoading,setIsLoading] = useState<boolean>(true)
    const horseIdRoute = `${horseInquiryRoute}/${horseId}`

    const dataCellsOrder = [
        "courseDate",
        "courseTime",
        "clientId",
        "instractorId",
        "course",
        "status",
        "price",
        "paid",
      
    ]
    const headCells = [
        "course date",
        "course time",
        "client name",
        "instructor",
        "course",
        "status",
        "price",
        "payment",
    ]
        
    const tableData = courses

    
    useEffect(()=>{
        const fetchClientInquiry = async () => {
            const res = await httpGetServices(horseIdRoute)
            const data = res?.data
            console.log(data);
            
            if (Boolean(data)) {
                setHorse(data.hourse)
                setCourses(data?.courses)
                setIsLoading(false)
            }
        }
        fetchClientInquiry()
    },[])

    return (
        <>
            <PageHeader
                title="horse inquiry"
            />
            <InquiryPageLayout
                courses={{
                    data: tableData,
                    headCells:headCells,
                    dataCellsOrder:dataCellsOrder
                }}
                item={{
                    avatarUrl:`${horsesImageUploadRoute}/${horse?._id}`,
                    itemData:horse,
                    itemDataSubTitles:{
                        age:horse?.age || 'no-age',
                        gender:horse?.gender || 'no-gender',
                        note:horse?.note || 'no-note',
                        id:horse?.id || 'no-id'
                    },
                    role:"horse",
                    title:horse?.hourseName
                }}
                isLoading={isLoading}
            />
        </>
    )
}

export default HorsePage