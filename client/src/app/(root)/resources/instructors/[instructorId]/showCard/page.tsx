'use client'

import PageContent from '@/components/layout/PageContent'
import PageHeader from '@/components/layout/PageHeader'
import PaginationButtons from '@/components/layout/PaginationButtons'
import ResourcesCard from '@/components/shared/resources/ResourcesCard'
import { BASE_URL, instructorsImageUploadRoute, instructorsRoute } from '@/constants/api'
import { httpGetServices } from '@/services/httpGetService'
import { useParams } from 'next/navigation'
import React, { Suspense, useState } from 'react'
import { useQuery } from 'react-query'

function ShowCard() {
    const {instructorId} = useParams()
    const [instructorsRes,setInstructorsRes] = useState<any>()
    const {data:response,isSuccess} = useQuery({
        queryKey:["instructors",instructorId],
        queryFn:async () => httpGetServices(`${instructorsRoute}/${instructorId}`)
    })

    const isDataHere = Boolean(response?.data) && isSuccess

    const instructor = response?.data
    

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
                    addNewButtonURL="/resources/instructors/add-new"
                    addNewButtonLabel='add new instructor'
                />
                <PageContent>
                    <div className="w-full h-full flex p-10 items-cente px-[calc(50%-115px)]">
                        {
                            isDataHere && <ResourcesCard
                            route={instructorsRoute}
                            titles={{
                                email:instructor.email,
                                mobile:instructor.phoneNumber
                            }}
                            title={instructor.instractorName}
                            _id={instructor._id}
                            imgUrl={`${BASE_URL}${instructorsImageUploadRoute}/${instructor._id}`}
                            inquiryRoute={'instructor'}
                            deleteRedirectURL="/resources/instructors"
                            editPageURL={`/resources/instructors/${instructorId}/edit`}
                        />
                        }
                    </div>
                </PageContent>
            </div>
            {
                true ? (
                    <PaginationButtons
                        maxPages={0}
                        currentPage={1}
                    />
                ): <></>
            }
        </Suspense>
    )   
}

export default ShowCard