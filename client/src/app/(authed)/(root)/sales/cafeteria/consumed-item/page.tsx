"use client"

import Loader from '@/components/layout/Loader'
import NavigationTabs from '@/components/shared/all/NavigationTabs'
import PageContent from '@/components/layout/PageContent'
import PaginationButtons from '@/components/layout/PaginationButtons'
import Table from '@/components/layout/Table'
import { cafeteriaConsumedItemRoute, cafeteriaRoute } from '@/constants/api'
import { httpGetServices } from '@/services/httpGetService'
import { useSearchParams } from 'next/navigation'
import React, { Suspense, useState } from 'react'
import { useQuery } from "react-query";
import { getReadableDate } from '@/utils/getReadableDate'
import PageHeader from '@/components/layout/PageHeader'
import { priceFormatter } from '@/utils/priceFormatter'

function CafeteriaConsumedItems() {

    const searchParams = useSearchParams()
    const pageNumber = searchParams.get("page") || "1"
    
    const [cafeteriaConsumedRes,setCafeteriaConsumedRes] = useState<any>()

    const {data:response,isSuccess,refetch}:any = useQuery({
        queryFn:async () => httpGetServices(`${cafeteriaConsumedItemRoute}?page=${pageNumber}`),
        queryKey:["cafeteria","consumedItems",'page',pageNumber]
    })
    
    const isDataHere = Boolean(response?.caveteriaItems?.data) && isSuccess


    const tableHeadCells = [
        "item name",
        "client",
        "quantity",
        "price",
        "payment",
        "date",
        "amount"
    ]

    const tableBodyItemCellKeys = [
        "consumedItemName",
        "clientId",
        "consumedQuantity",
        "consumedPrice",
        "consumedPayment",
        "date",
        "amount"
    ]
    const tableBodyItems = response?.caveteriaItems?.data.map((item:any) => ({
        ...item,
        clientId:item.clientId?.username || "no-client",
        date:item.date&&getReadableDate(item.date)||'no-date',
        consumedPrice:(<span className='w-full block text-right'>
            {priceFormatter(String(item.consumedPrice))}
        </span>),
        
    }))
    
    const navigationTabs = [
        {
            href:"menu-item",
            label:"menu items"
        },
        {
            href:"consumed-item",
            label:"consumed items"
        },
    ]
    return (
        <Suspense>
            <PageHeader
                title={"stables cafeteria"}
                addNewButtonLabel='add new item'
                linksSearchBox={{
                    searchUrl:cafeteriaConsumedItemRoute,
                    options:cafeteriaConsumedRes?.caveteriaItems?.data.map((item:any) => ({
                        name:item?.consumedItemName,
                        href:`/sales/cafeteria/consumed-item/${item?._id}/edit`
                    })),
                    setResponse:setCafeteriaConsumedRes,
                    placeholder:"search cafeteria item"

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
                            route={cafeteriaConsumedItemRoute}
                        />
                    </Loader>
                </PageContent>
                {
                    isDataHere ? (
                        <PaginationButtons
                            maxPages={response.caveteriaItems.max_pages}
                            currentPage={response.caveteriaItems.current_page}

                        />
                    ): <></>
                }
            </div>
        </Suspense>
    )
}

export default CafeteriaConsumedItems