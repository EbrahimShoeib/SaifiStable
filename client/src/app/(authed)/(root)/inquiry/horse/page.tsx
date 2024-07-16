"use client"

import PageContent from '@/components/layout/PageContent'
import PageHeader from '@/components/layout/PageHeader'
import NoDataFound from '@/components/shared/all/NoDataFound'
import { horsesRoute } from '@/constants/api'
import React, { useState } from 'react'

function HorseInquiry() {

    const [horsesRes,setHorsesRes] = useState<any>()

    return (
        <>
            <PageHeader
                title={"horse inquiry"}
                linksSearchBox={{
                    searchUrl:horsesRoute,
                    options:horsesRes?.data?.hourse.map((item:any) => ({
                        name:item?.hourseName,
                        href:`/inquiry/horse/${item?._id}`
                    })),
                    setResponse:setHorsesRes,
                    placeholder:"search for horse"

                }}
            />
            <PageContent>
                <NoDataFound message='Select or search about horse name 
                to display horse inquiry'/>
            </PageContent>
        </>
    )
}

export default HorseInquiry