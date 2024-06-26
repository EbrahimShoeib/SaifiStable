"use client"
import InquiryPageLayout from '@/components/content/inquiry/InquiryPageLayout'
import PageHeader from '@/components/layout/PageHeader'
import Table from '@/components/layout/Table'
import { clientImageUploadRoute, clientInquiryRoute } from '@/constants/api'
import { httpGetServices } from '@/services/httpGetService'
import { getReadableDate } from '@/utils/getReadableDate'
import { priceFormatter } from '@/utils/priceFormatter'
import { useParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'

function ClientPage() {

    const {clientId} = useParams()
    const [client,setClient] = useState<any>(null)
    const [courses,setCourses] = useState<any>([])
    const [isLoading,setIsLoading] = useState<boolean>(true)
    const [memberships,setMemberships] = useState<any>([])
    const [cafeterias,setCafeterias] = useState<any>([])
    const clientIdRoute = `${clientInquiryRoute}/${clientId}`

    const dataCellsOrder = [
        "courseDate",
        "courseTime",
        "hourseId",
        "instractorId",
        "course",
        "status",
        "price",
        "paid",
      
    ]
    const headCells = [
        "course date",
        "course time",
        "horse name",
        "instructor",
        "course",
        "status",
        "price",
        "payment",
    ]
        
    const tableData = courses

    const subTables = [
        {
            table:<Table
                isCrud={false}
                tableBodyItemCellKeys={["consumedItemName","consumedQuantity","consumedPayment","consumedPrice"]}
                tableHeadCells={["item name","quantity","payment","price"]}
                tableBodyItems={cafeterias.map((item:any) => ({
                    price:<span className='text-right'>
                        {priceFormatter(item.consumedPrice)}
                        </span>,
                    ...item
                }))}
            />,
            title:"cafeteria"
        },
        {
            table:<Table
                isCrud={false}
                tableBodyItemCellKeys={["membershipType","startDate","endDate","status"]}
                tableHeadCells={["membership type","start date","end date","status"]}
                tableBodyItems={memberships.map((item:any) => ({
                    ...item,
                    startDate:getReadableDate(item?.startDate),
                    endDate:getReadableDate(item?.endDate),
                }))}
            />,
            title:"membership"
        },

    ]
    
    useEffect(()=>{
        const fetchClientInquiry = async () => {
            const res = await httpGetServices(clientIdRoute)
            const data = res?.data
            console.log(data);
            
            if (Boolean(data)) {
                setMemberships(data?.membershipStatus)
                setCafeterias(data?.cafateria)
                setClient(data?.client)
                setCourses(data?.courses)
                setIsLoading(false)
            }
        }
        fetchClientInquiry()
    },[])

    return (
        <>
            <PageHeader
                title="Client inquiry"
            />
            <InquiryPageLayout
                courses={{
                    data: tableData,
                    headCells:headCells,
                    dataCellsOrder:dataCellsOrder
                }}
                item={{
                    avatarUrl:`${clientImageUploadRoute}/${client?._id}`,
                    itemData:client,
                    itemDataSubTitles:{
                        email:client?.email||'no-email',
                        mobile:client?.phone||'no-mobile',
                        gender:client?.gender||'no-gender',
                        age:client?.age||'no-age',
                        "horse id":client?.hourseId?.hourseId
                    },
                    role:"client",
                    title:client?.username
                }}
                isLoading={isLoading}
                subTables={subTables}
            />
        </>
    )
}

export default ClientPage