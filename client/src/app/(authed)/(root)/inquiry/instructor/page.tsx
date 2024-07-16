"use client"

import PageContent from '@/components/layout/PageContent'
import PageHeader from '@/components/layout/PageHeader'
import NoDataFound from '@/components/shared/all/NoDataFound'
import { instructorsRoute } from '@/constants/api'
import React, { useState } from 'react'

function InstructorInquiry() {

    const [instructorsRes,setInstructorsRes] = useState<any>()

  


    return (
        <>
            <PageHeader
                title={"instructor inquiry"}
                linksSearchBox={{
                    searchUrl:instructorsRoute,
                    options:instructorsRes?.data?.instractor.map((item:any) => ({
                        name:item?.instractorName,
                        href:`/inquiry/instructor/${item?._id}`
                    })),
                    setResponse:setInstructorsRes,
                    placeholder:"search for instructor"

                }}
            />
            <PageContent>
                <NoDataFound message='Select or search about Instructor name 
                to display instructor inquiry'/>
            </PageContent>
        </>
    )
}

export default InstructorInquiry