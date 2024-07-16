"use client"

import PageHeader from '@/components/layout/PageHeader'
import Loader from '@/components/layout/Loader'
import PageContent from '@/components/layout/PageContent'
import PaginationButtons from '@/components/layout/PaginationButtons'
import Table from '@/components/layout/Table'
import { dailyRoute } from '@/constants/api'
import { httpGetServices } from '@/services/httpGetService'
import { getReadableDate } from '@/utils/getReadableDate'
import { priceFormatter } from '@/utils/priceFormatter'
import { useSearchParams } from 'next/navigation'
import React, { Suspense, useState } from 'react'
import { useQuery } from 'react-query'

function DailyPage() {
        
    const searchParams = useSearchParams()
    const pageNumber = searchParams.get("page") || "1"

    const {data:response,isSuccess,refetch}:any = useQuery({
        queryFn:async () => httpGetServices(`${dailyRoute}?page=${pageNumber}`),
        queryKey:["management","daily",'page',pageNumber]
    })

    console.log(response);
    

    const isDataHere = Boolean(response?.Daily?.data) && isSuccess

    const [dailyRes,setDailyRes] = useState<any>()

    const tableHeadCells = [
        "course date",
        "course time",
        "client name",
        "horse name",
        "course",
        "price",
        "status",
        "arena",
        "instructor name",
        "membership",
        "paid",
        "note"  
    ]

    const tableBodyItemCellKeys = [
        "courseDate",
        "courseTime",   
        "clientId",
        "hourseId",
        "course",
        "price",
        "status",
        "arena",
        "instractorId",
        "membership",
        "paid",
        "note"
    ]

    const tableBodyItems = response?.Daily?.data.map((item:any) => ({
        ...item,
        courseDate:getReadableDate(item.courseDate),
        price:(<span className='text-right block w-full'>
            {priceFormatter(String(item.price))}
        </span>),
        clientId:item?.clientId?.username ||"no-client",
        hourseId:item?.hourseId?.hourseName ||"no-horse",
        instractorId:item?.instractorId?.instractorName ||"no-instructor",
        course:item?.course?.name || "no-course",

    }))   

    return (
        <Suspense>
            <PageHeader
                title={"daily entry"}
                addNewButtonLabel='add class'
                linksSearchBox={{
                    searchUrl:dailyRoute,
                    options:dailyRes?.Daily?.data.map((item:any) => ({
                        name:item?.clientId?.username,
                        href:`/management/daily/${item?._id}/edit`
                    })),
                    setResponse:setDailyRes,
                    placeholder:"search daily item"

                }}
            />
            <div className='h-[calc(100%-80px)] w-full'>
                <PageContent className='overflow-y-hidden pt-10'>
                    <Loader isLoading={!isDataHere}>
                        <Table
                            tableBodyItemCellKeys={tableBodyItemCellKeys} 
                            tableBodyItems={tableBodyItems} 
                            tableHeadCells={tableHeadCells} 
                            isCrud={true}
                            refetch={refetch}
                            route={dailyRoute}
                        />
                    </Loader>
                </PageContent>
                {
                    isDataHere ? (
                        <PaginationButtons
                            maxPages={response.Daily.max_pages}
                            currentPage={response.Daily.current_page}
                        />
                    ): <></>
                }
            </div>
        </Suspense>
    )
}

export default DailyPage