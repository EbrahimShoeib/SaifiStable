"use client"

import PageHeader from "@/components/layout/PageHeader"
import Loader from "@/components/layout/Loader"
import NavigationTabs from "@/components/shared/all/NavigationTabs"
import PageContent from "@/components/layout/PageContent"
import PaginationButtons from "@/components/layout/PaginationButtons"
import Table from "@/components/layout/Table"
import { familyMembershipRoute } from "@/constants/api"
import { httpGetServices } from "@/services/httpGetService"
import { useSearchParams } from "next/navigation"
import { Suspense } from "react"
import { useQuery } from "react-query"

function FamilyMembershipPage() {
    const searchParams = useSearchParams()
    const pageNumber = searchParams.get("page") || "1"

    const {data:response,isSuccess,refetch}:any = useQuery({
        queryFn:async () => httpGetServices(`${familyMembershipRoute}?page=${pageNumber}`),
        queryKey:["membership","family",'page',pageNumber]
    })
        console.log(response);
        
    const isDataHere = Boolean(response?.familyMembership?.data) && isSuccess


    const tableHeadCells = [
        "family name",
        "members",
        "membership type",
        "start date",
        "end date",
        "status"
    ]

    const tableBodyItemCellKeys = [
        "famillyName",
        "members",
        "membershipTtpe",
        "startDate",
        "endDate",
        "status"

    ]

    const tableBodyItems = response?.familyMembership?.data.map((item:any) => ({
        ...item,
        status:(<span className={item.status.toLowerCase() === "active" ? "text-green-500" : "text-red-500"}>
            {item.status}
        </span>)
    }))
    
    
    const navigationTabs = [
        {
            href:`individual`,
            label:"individual"
        },
        {
            href:`family`,
            label:"family"
        },
    ]

    return (
        <Suspense>
            <PageHeader
                title={"stables membership"}
                addNewButtonLabel="add family membership"
            />
            <div className='h-[calc(100%-80px)] w-full'>
                <PageContent className='overflow-y-hidden pt-10'>
                    <NavigationTabs
                        tabs={navigationTabs}
                    />
                    <Loader isLoading={!isDataHere}>
                        <Table 
                            tableBodyItemCellKeys={tableBodyItemCellKeys} 
                            tableBodyItems={tableBodyItems} 
                            tableHeadCells={tableHeadCells} 
                            isCrud={true}
                            refetch={refetch}
                            route={familyMembershipRoute}
                        />
                    </Loader>
                </PageContent>
                {
                    isDataHere ? (
                        <PaginationButtons
                            maxPages={response.familyMembership.max_pages}
                            currentPage={response.familyMembership.current_page}

                        />
                    ): <></>
                }
            </div>
        </Suspense>
    )
}

export default FamilyMembershipPage