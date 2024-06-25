'use client'

import PageContent from "@/components/layout/PageContent"
import PageHeader from "@/components/layout/PageHeader"
import PaginationButtons from "@/components/layout/PaginationButtons"
import ResourcesCard from "@/components/shared/resources/ResourcesCard"
import { BASE_URL, clientImageUploadRoute, clientsRoute } from "@/constants/api"
import { httpGetServices } from "@/services/httpGetService"
import { useParams } from "next/navigation"
import { Suspense, useState } from "react"
import { useQuery } from "react-query"

function ShowCard() {
    const {clientId} = useParams()
    const [clientsRes,setClientsRes] = useState<any>()
    const {data:response,isSuccess} = useQuery({
        queryKey:["clients",clientId],
        queryFn:async () => httpGetServices(`${clientsRoute}/${clientId}`)
    })

    const isDataHere = Boolean(response?.data) && isSuccess

    const client = response?.data
    

    return (
        <Suspense>
            <div className='w-full h-[calc(100%-80px)]'>
                <PageHeader
                    title={"stables clients"}
                    linksSearchBox={{
                        searchUrl:clientsRoute,
                        options:clientsRes?.data?.hourse.map((item:any) => ({
                            name:item?.hourseName,
                            href:`/resources/clients/${item?._id}/showCard`
                        })),
                        setResponse:setClientsRes,
                        placeholder:"search client"
                    }}
                    addNewButtonLabel='add new client'
                />
                <PageContent>
                    <div className="w-full h-full flex p-10 items-cente px-[calc(50%-115px)]">
                        {
                            isDataHere && <ResourcesCard
                            route={clientsRoute}
                            titles={{
                                email:client.email,
                                mobile:client.phone
                            }}
                            title={client.username}
                            _id={client._id}
                            imgUrl={`${BASE_URL}${clientImageUploadRoute}/${client._id}`}
                            inquiryRoute={'client'}
                            deleteRedirectURL="/resources/clients"
                            editPageURL={`/resources/clients/${clientId}/edit`}
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