"use client"

import PageHeader from "@/components/layout/PageHeader";
import Loader from "@/components/layout/Loader";
import NavigationTabs from "@/components/shared/all/NavigationTabs";
import PageContent from "@/components/layout/PageContent";
import PaginationButtons from "@/components/layout/PaginationButtons";
import Table from "@/components/layout/Table";
import { inventoryItemsRoute } from "@/constants/api";
import { httpGetServices } from "@/services/httpGetService";
import { priceFormatter } from "@/utils/priceFormatter";
import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { useQuery } from "react-query";

function InventoryItemsPage() {
    const searchParams = useSearchParams()
    const pageNumber = searchParams.get("page") || "1"

    const {data:response,isSuccess,refetch}:any = useQuery({
        queryFn:async () => httpGetServices(`${inventoryItemsRoute}?page=${pageNumber}`),
        queryKey:["inventory","items",'page',pageNumber]
    })
        
    const isDataHere = Boolean(response?.inventoryItems?.data) && isSuccess

    const [inventoryItemsRes,setInventoryItemsRes] = useState<any>()

    const tableHeadCells = [
        "item name",
        "quantity",
        "item description",
        "type",
        "price",
        "measure"
    ]

    const tableBodyItemCellKeys = [
        "itemName",
        "quantity",
        "itemDescription",
        "type",
        "price",
        "measure"
    ]
    const tableBodyItems = response?.inventoryItems?.data.map((item:any)=> ({
        ...item,
        price:(<span className="w-full block text-right">
            {priceFormatter(String(item.price))}
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
                addNewButtonLabel='add new item'
                linksSearchBox={{
                    searchUrl:inventoryItemsRoute,
                    options:inventoryItemsRes?.inventoryItems?.data.map((item:any) => ({
                        name:item?.itemName,
                        href:`/sales/inventory/inventory-item/${item?._id}/edit`
                    })),
                    setResponse:setInventoryItemsRes,
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
                            route={inventoryItemsRoute}
                        />
                    </Loader>
                </PageContent>
                {
                    isDataHere ? (
                        <PaginationButtons
                            maxPages={response.inventoryItems.max_pages}
                            currentPage={response.inventoryItems.current_page}

                        />
                    ): <></>
                }
            </div>
        </Suspense>
    )
}

export default InventoryItemsPage