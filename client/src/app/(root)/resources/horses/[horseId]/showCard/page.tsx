'use client'

import PageContent from "@/components/layout/PageContent"
import PageHeader from "@/components/layout/PageHeader"
import PaginationButtons from "@/components/layout/PaginationButtons"
import ResourcesCard from "@/components/shared/resources/ResourcesCard"
import { BASE_URL, clientImageUploadRoute, horsesImageUploadRoute, horsesRoute } from "@/constants/api"
import { httpGetServices } from "@/services/httpGetService"
import { useParams } from "next/navigation"
import { Suspense, useState } from "react"
import { useQuery } from "react-query"

function ShowCard() {
    const {horseId} = useParams()
    const [horsesRes,setHorsesRes] = useState<any>()
    const {data:response,isSuccess} = useQuery({
        queryKey:["horses",horseId],
        queryFn:async () => httpGetServices(`${horsesRoute}/${horseId}`)
    })

    const isDataHere = Boolean(response?.data) && isSuccess

    const horse = response?.data
    

    return (
        <Suspense>
            <div className='w-full h-[calc(100%-80px)]'>
                <PageHeader
                    title={"stables horses"}
                    linksSearchBox={{
                        searchUrl:horsesRoute,
                        options:horsesRes?.data?.hourse.map((item:any) => ({
                            name:item?.hourseName,
                            href:`/resources/horses/${item?._id}/showCard`
                        })),
                        setResponse:setHorsesRes,
                        placeholder:"search horse"
                    }}
                    addNewButtonURL="/resources/horses/add-new"
                    addNewButtonLabel='add new horse'
                />
                <PageContent>
                    <div className="w-full h-full flex p-10 items-cente px-[calc(50%-115px)]">
                        {
                            isDataHere && <ResourcesCard
                            route={horsesRoute}
                            titles={{
                                age:horse.age,
                                gender:horse.gender
                            }}
                            title={horse.hourseName}
                            _id={horse._id}
                            imgUrl={`${BASE_URL}${horsesImageUploadRoute}/${horse._id}`}
                            inquiryRoute={'horse'}
                            deleteRedirectURL="/resources/horses"
                            editPageURL={`/resources/horses/${horseId}/edit`}
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