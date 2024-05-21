"use client"

import InquiryPageLayout from "@/components/content/inquiry/InquiryPageLayout"
import PageHeader from "@/components/layout/PageHeader"
import { instructorInquiryRoute } from "@/constants/api"
import { httpGetServices } from "@/services/httpGetService"
import { priceFormatter } from "@/utils/priceFormatter"
import { useParams } from "next/navigation"
import { useEffect, useState } from "react"

function InstructorPage() {
    const {instructorId} = useParams()
    const [instructor,setInstructor] = useState<any>(null)
    const [courses,setCourses] = useState<any>([])
    const [isLoading,setIsLoading] = useState<boolean>(true)
    const instructorIdRoute = `${instructorInquiryRoute}/${instructorId}`

    const dataCellsOrder = [
        "courseDate",
        "courseTime",
        "hourseId",
        "clientId",
        "course",
        "status",
        "price",
        "paid",
      
    ]
    const headCells = [
        "course date",
        "course time",
        "horse name",
        "client",
        "course",
        "status",
        "price",
        "payment",
    ]
        
    const tableData = courses

    
    useEffect(()=>{
        const fetchClientInquiry = async () => {
            const res = await httpGetServices(instructorIdRoute)
            const data = res?.data
            console.log(data);
            
            if (Boolean(data)) {
                setInstructor(data?.instructor)
                setCourses(data?.courses)
                setIsLoading(false)
            }
        }
        fetchClientInquiry()
    },[])

    return (
        <>
            <PageHeader
                title="instructor inquiry"
            />
            <InquiryPageLayout
                courses={{
                    data: tableData,
                    headCells:headCells,
                    dataCellsOrder:dataCellsOrder
                }}
                item={{
                    avatarUrl:instructor?.avatar,
                    itemData:instructor,
                    itemDataSubTitles:{
                        age:instructor?.age,
                        gender:instructor?.gender,
                        email:instructor?.email,
                        mobile:instructor?.phoneNumber
                    },
                    role:"instructor",
                    title:instructor?.instractorName
                }}
                isLoading={isLoading}
            />
        </>
    )
}

export default InstructorPage