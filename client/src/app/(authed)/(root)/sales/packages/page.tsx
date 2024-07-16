"use client"

import PageHeader from "@/components/layout/PageHeader"
import Loader from "@/components/layout/Loader"
import PageContent from "@/components/layout/PageContent"
import PaginationButtons from "@/components/layout/PaginationButtons"
import Table from "@/components/layout/Table"
import { packagesRoute } from "@/constants/api"
import { httpGetServices } from "@/services/httpGetService"
import { getReadableDate } from "@/utils/getReadableDate"
import { useSearchParams } from "next/navigation"
import { Suspense, useState } from "react"
import { useQuery } from "react-query"

function PackagesPage() {
    const searchParams = useSearchParams()
    const pageNumber = searchParams.get("page") || "1"

    const {data:response,isSuccess,refetch}:any = useQuery({
        queryFn:async () => httpGetServices(`${packagesRoute}?page=${pageNumber}`),
        queryKey:["packages",'page',pageNumber]
    })
        
    const isDataHere = Boolean(response?.Packages?.data) && isSuccess

    const [packagesRes,setPackagesRes] = useState<any>()

    const tableHeadCells = [
        "name",
        "category",
        "lessons",
        "start date",
        "end date",
        "status"
    ]

    const tableBodyItemCellKeys = [
        "name",
        "category",
        "lessons",
        "startDate",
        "endDate",
        "status"
    ]

    const tableBodyItems = response?.Packages?.data.map((item:any) => ({
        ...item,
        startDate:getReadableDate(item.startDate),
        endDate:getReadableDate(item.endDate),
    }))
    
    
   

    return (
        <Suspense>
            <PageHeader
                title={"stables package"}
                addNewButtonLabel="add package"
                linksSearchBox={{
                    searchUrl:packagesRoute,
                    options:packagesRes?.Packages?.data.map((item:any) => ({
                        name:item?.name,
                        href:`/sales/packages/${item?._id}/edit`
                    })),
                    setResponse:setPackagesRes,
                    placeholder:"search package item"

                }}
            />
            <div className='h-[calc(100%-80px)] w-full'>
                <PageContent className='overflow-y-hidden pt-5'>
                    <Loader isLoading={!isDataHere}>
                        <Table 
                            tableBodyItemCellKeys={tableBodyItemCellKeys} 
                            tableBodyItems={tableBodyItems} 
                            tableHeadCells={tableHeadCells} 
                            isCrud={true}
                            refetch={refetch}
                            route={packagesRoute}
                        />
                    </Loader>
                </PageContent>
                {
                    isDataHere ? (
                        <PaginationButtons
                            maxPages={response.Packages.max_pages}
                            currentPage={response.Packages.current_page}

                        />
                    ): <></>
                }
            </div>
        </Suspense>
    )
}

export default PackagesPage