"use client"

import PageContent from '@/components/layout/PageContent'
import PageHeader from '@/components/layout/PageHeader'
import NoDataFound from '@/components/shared/all/NoDataFound'
import { clientsRoute } from '@/constants/api'
import React, { useState } from 'react'

function ClientInquiry() {

    const [clientsRes,setClientsRes] = useState<any>()

   
    return (
        <>
            <PageHeader
                title={"client inquiry"}
                linksSearchBox={{
                    searchUrl:clientsRoute,
                    options:clientsRes?.data?.client.map((item:any) => ({
                        name:item?.username,
                        href:`/inquiry/client/${item?._id}`
                    })),
                    setResponse:setClientsRes,
                    placeholder:"search for client"

                }}
            />
            <PageContent>
                <NoDataFound message='Select or search about client name 
                to display client inquiry'/>
            </PageContent>
        </>
    )
}

export default ClientInquiry