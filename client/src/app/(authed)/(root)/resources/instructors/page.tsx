"use client"

import InstructorsPageContent from '@/components/content/resources/instructors/InstructorsPageContent'
import PageHeader from '@/components/layout/PageHeader'
import PaginationButtons from '@/components/layout/PaginationButtons'
import { instructorsRoute } from '@/constants/api'
import { useGetInstructors } from '@/hooks/useGetInstructors'
import { httpGetServices } from '@/services/httpGetService'
import { toNameAndId } from '@/utils/toNameAndId'
import { useSearchParams } from 'next/navigation'
import React, { Suspense, useState } from 'react'
import { useQuery } from 'react-query'

function InstructorsPage() {


    const searchParams = useSearchParams()
    const pageNumber = searchParams.get("page") || "1"


    const {data:response,isSuccess,refetch} = useQuery({
        queryKey:["instructors","page",pageNumber],
        queryFn:async () => httpGetServices(`${instructorsRoute}?page=${pageNumber}`)
    })
    useGetInstructors({
        pagination:`?page=${pageNumber}`,
        queryKey:["page"]
    })

    const isDataHere = Boolean(response?.data?.instractor) && isSuccess

    const [instructorsRes,setInstructorsRes] = useState<any>()
    
    return (
        <Suspense>
            <div className='w-full h-[calc(100%-80px)]'>
                <PageHeader
                    title={"stables instructors"}
                    linksSearchBox={{
                        searchUrl:instructorsRoute,
                        options:instructorsRes?.data?.instractor.map((item:any) => ({
                            name:item?.instractorName,
                            href:`/resources/instructors/${item?._id}/showCard`
                        })),
                        setResponse:setInstructorsRes,
                        placeholder:"search instructor"
                    }}
                    addNewButtonLabel='add new instructor'
                />
                
                <InstructorsPageContent
                    isDataHere={isDataHere} 
                    response={response}
                    refetch={refetch}
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
export default InstructorsPage