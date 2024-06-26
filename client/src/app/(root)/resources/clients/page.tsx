"use client"
import ClientsPageContent from '@/components/content/resources/clients/ClientsPageContent'
import Loader from '@/components/layout/Loader'
import PageHeader from '@/components/layout/PageHeader'
import PaginationButtons from '@/components/layout/PaginationButtons'
import { clientsRoute } from '@/constants/api'
import { useGetClients } from '@/hooks/useGetClients'
import { toNameAndId } from '@/utils/toNameAndId'
import { useSearchParams } from 'next/navigation'
import React, { Suspense, useState } from 'react'

function ClientsPage() {

    const searchParams = useSearchParams()
    const pageNumber = searchParams.get("page") || "1"
    

    const {response,isSuccess,refetch}:any = useGetClients({
        pagination:`?page=${pageNumber}`,
        queryKey:['page',pageNumber]

    })
    

    const isDataHere = Boolean(response?.data?.client) && isSuccess

    const [clientsRes,setClientsRes] = useState<any>()
    
    return (
        <Suspense>
            <div className='w-full h-[calc(100%-80px)]'>
                <PageHeader
                    title={"stables clients"}
                    linksSearchBox={{
                        searchUrl:clientsRoute,
                        options:clientsRes?.data?.client.map((item:any) => ({
                            name:item?.username,
                            href:`/resources/clients/${item?._id}/showCard`
                        })),
                        setResponse:setClientsRes,
                        placeholder:"search client"
                    }}
                    addNewButtonURL={`/resources/clients/add-new`}
                    addNewButtonLabel='add new client'
                />
                <ClientsPageContent 
                    refetch={refetch}
                    isDataHere={isDataHere} 
                    response={response}
                />
            </div>
            {
                isDataHere ? (
                    <PaginationButtons
                        maxPages={response.data.max_pages}
                        currentPage={response.data.current_page}
                    />
                ): <></>
            }
        </Suspense>
    )
}

export default ClientsPage