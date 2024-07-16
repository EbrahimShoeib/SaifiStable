"use client"

import Loader from "@/components/layout/Loader"
import PageContent from "@/components/layout/PageContent"
import PageHeader from "@/components/layout/PageHeader"
import PaginationButtons from "@/components/layout/PaginationButtons"
import Table from "@/components/layout/Table"
import { invoiceRoute } from "@/constants/api"
import { httpGetServices } from "@/services/httpGetService"
import { getReadableDate } from "@/utils/getReadableDate"
import Link from "next/link"
import { usePathname, useSearchParams } from "next/navigation"
import { Suspense, useState } from "react"
import { GrAdd } from "react-icons/gr"
import { useQuery } from "react-query"

function InvoicePage() {
            
    const searchParams = useSearchParams()
    const pageNumber = searchParams.get("page") || "1"

    const {data:response,isSuccess}:any = useQuery({
        queryFn:async () => httpGetServices(`${invoiceRoute}?page=${pageNumber}`),
        queryKey:["management","invoice",'page',pageNumber]
        
    })   
    
    const pathname = usePathname()
    const isDataHere = Boolean(response?.data?.client) && isSuccess

    const [invoiceRes,setInvoiceRes] = useState<any>()

    const tableHeadCells = [
        //"invoice id",
        "client name",
        "invoice type",
        "total amount",
        "invoice date",
        "status",
        "client type"   
    ]

    const tableBodyItemCellKeys = [
        //"invoiceId",
        "clientId",
        "invoiceType",
        "totalAmount",   
        "invoiceDate",
        "status",
        "clientType"
    ]

    const tableBodyItems = response?.data?.client?.map((item:any) => ({
        ...item,
        clientId:item?.clientId?.username || "no-client",
        invoiceDate:getReadableDate(item?.invoiceDate)
    }))

    return (
        <Suspense>
            <PageHeader
                title={"Invoices List"}
                linksSearchBox={{
                    searchUrl:invoiceRoute,
                    options:invoiceRes?.data?.client.map((item:any) => ({
                        name:item?.clientId?.username,
                        href:`/management/invoice/${item?._id}/edit`
                    })),
                    setResponse:setInvoiceRes,
                    placeholder:"search schedule item"

                }}
            >
                <Link
                    className='page_header_button' 
                    href={`${pathname}/add-invoice`} 
                >
                    <GrAdd />
                    <span>add invoice</span>
                </Link>
                <Link
                    className='page_header_button' 
                    href={`${pathname}/add-invoice-individual`} 
                >
                    <GrAdd />
                    <span>add individual invoice</span>
                </Link>
            </PageHeader>
            <div  className='h-[calc(100%-80px)] w-full'>
                <PageContent className='overflow-y-hidden pt-10'>
                    <Loader isLoading={!isDataHere}>
                        <Table
                            tableBodyItemCellKeys={tableBodyItemCellKeys} 
                            tableBodyItems={tableBodyItems} 
                            tableHeadCells={tableHeadCells} 
                            isCrud={false}
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

export default InvoicePage