"use client"

import PageHeader from "@/components/layout/PageHeader"
import Loader from "@/components/layout/Loader"
import NavigationTabs from "@/components/shared/all/NavigationTabs"
import PageContent from "@/components/layout/PageContent"
import PaginationButtons from "@/components/layout/PaginationButtons"
import Table from "@/components/layout/Table"
import { inventoryConsumedItemsRoute } from "@/constants/api"
import { httpGetServices } from "@/services/httpGetService"
import { priceFormatter } from "@/utils/priceFormatter"
import { useSearchParams } from "next/navigation"
import { Suspense, useState } from "react"
import { useQuery } from "react-query"

function ConsumedItemsInventoryPage() {
    const searchParams = useSearchParams()
    const pageNumber = searchParams.get("page") || "1"

    const {data:response,isSuccess,refetch}:any = useQuery({
        queryFn:async () => httpGetServices(`${inventoryConsumedItemsRoute}?page=${pageNumber}`),
        queryKey:["inventory","consumedItems",'page',pageNumber]
    })
        
    const isDataHere = Boolean(response?.invConsumeItems?.data) && isSuccess

    const [inventoryConsumedRes,setInventoryConsumedRes] = useState<any>()

    const tableHeadCells = [
        "horse name",
        "item name",
        "quantity",
        "price",
        "measure"
    ]

    const tableBodyItemCellKeys = [
        "hourseId",
        "invConsumedItemName",
        "invConsumedQuantity",
        "invConsumedPrice",
        "invConsumedMeasure"
    ]
    const tableBodyItems = response?.invConsumeItems?.data.map((item:any) => ({
        ...item,
        hourseId:item.hourseId?.hourseName || "no-horse",
        invConsumedPrice:(<span className="w-full block text-right">
            {priceFormatter(String(item.invConsumedPrice))}
        </span>)
    }))
    
    
    const navigationTabs = [
        {
            href:`inventory-item`,
            label:"items"
        },
        {
            href:`consumed-item`,
            label:"consumed items"
        },
    ]

    return (
        <Suspense>
            <PageHeader
                title={"stables inventory"}
                addNewButtonLabel="add consumed item"
                linksSearchBox={{
                    searchUrl:inventoryConsumedItemsRoute,
                    options:inventoryConsumedRes?.inventoryItems?.data.map((item:any) => ({
                        name:item?.itemName,
                        href:`/sales/inventory/consumed-item/${item?._id}/edit`
                    })),
                    setResponse:setInventoryConsumedRes,
                    placeholder:"search inventory item"

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
                            route={inventoryConsumedItemsRoute}
                        />
                    </Loader>
                </PageContent>
                {
                    isDataHere ? (
                        <PaginationButtons
                            maxPages={response.invConsumeItems.max_pages}
                            currentPage={response.invConsumeItems.current_page}

                        />
                    ): <></>
                }
            </div>
        </Suspense>
    )
}

export default ConsumedItemsInventoryPage