"use client"

import PageHeader from '@/components/layout/PageHeader'
import Loader from '@/components/layout/Loader'
import NavigationTabs from '@/components/shared/all/NavigationTabs'
import PageContent from '@/components/layout/PageContent'
import PaginationButtons from '@/components/layout/PaginationButtons'
import Table from '@/components/layout/Table'
import { consumedMedicalRoute, medicineMedicalRoute } from '@/constants/api'
import { httpGetServices } from '@/services/httpGetService'
import { priceFormatter } from '@/utils/priceFormatter'
import { useSearchParams } from 'next/navigation'
import React, { Suspense, useState } from 'react'
import { useQuery } from 'react-query'

function ConsumedMedicalItemsPage() {
    const searchParams = useSearchParams()
    const pageNumber = searchParams.get("page") || "1"

    const {data:response,isSuccess,refetch}:any = useQuery({
        queryFn:async () => httpGetServices(`${consumedMedicalRoute}?page=${pageNumber}`),
        queryKey:["medical","consumed",'page',pageNumber]
    })
        
    const isDataHere = Boolean(response?.data?.consumed_medicine) && isSuccess
    
    const [consumedMedicalRes,setConsumedMedicalRes] = useState<any>()

    const tableHeadCells = [
        "horse name",
        "item name",
        "quantity",
        "price",
        "dosage"
    ]

    const tableBodyItemCellKeys = [
        "hourseId",
        "medicineName",
        "quantity",
        "price",
        "dosage"
    ]
    const tableBodyItems = response?.data?.consumed_medicine.map((item:any)=> ({
        ...item,
        price:(<span className="w-full block text-right">
            {priceFormatter(String(item.price))}
        </span>),
        hourseId:item?.hourseId?.hourseName || "no-horse"
    }))
    
    const navigationTabs = [
        {
            href:`medicine`,
            label:"medicine"
        },
        {
            href:`consumed-item`,
            label:"consumed items"
        },
    ]
    return (
        <Suspense>
            <PageHeader
                title={"stables medicine"}
                addNewButtonLabel='add new item'
                linksSearchBox={{
                    searchUrl:consumedMedicalRoute,
                    options:consumedMedicalRes?.data?.consumed_medicine.map((item:any) => ({
                        name:item?.medicineName,
                        href:`/sales/medical/consumed-item/${item?._id}/edit`
                    })),
                    setResponse:setConsumedMedicalRes,
                    placeholder:"search medical item"

                }}
            />
            <div className='h-[calc(100%-80px)] w-full'>
                <PageContent className='overflow-y-hidden pt-10'>
                    <NavigationTabs
                        tabs={navigationTabs}
                    />
                    <Loader isLoading={!isDataHere}>
                        <Table 
                            tableBodyItemCellKeys={tableBodyItemCellKeys} 
                            tableBodyItems={tableBodyItems} 
                            tableHeadCells={tableHeadCells} 
                            isCrud={true}
                            refetch={refetch}
                            route={consumedMedicalRoute}
                        />
                    </Loader>
                </PageContent>
                {
                    isDataHere ? (
                        <PaginationButtons
                            maxPages={response.data.max_pages}
                            currentPage={response.data.current_page}

                        />
                    ): <></>
                }
            </div>
        </Suspense>
    )
}

export default ConsumedMedicalItemsPage