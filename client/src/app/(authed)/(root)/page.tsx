"use client"

import DashBoardActionsWidget from '@/components/content/dashboard/DashBoardActionsWidget'
import DashboardCafeteriaWidget from '@/components/content/dashboard/DashboardCafeteriaWidget'
import DashboardChartsWidget from '@/components/content/dashboard/DashboardChartsWidget'
import DashboardInquiryWidget from '@/components/content/dashboard/DashboardInquiryWidget'
import DashboardResourcesWidgets from '@/components/content/dashboard/DashboardResourcesWidgets'
import Loader from '@/components/layout/Loader'
import PageContent from '@/components/layout/PageContent'
import PageHeader from '@/components/layout/PageHeader'
import { dashboardRoute } from '@/constants/api'
import { httpGetServices } from '@/services/httpGetService'
import { useEffect, useState } from 'react'
import { useQuery } from 'react-query'

function Dashboard() {

    const [isLoading,setIsLoading] = useState<boolean>(true)



    const {data:response,isLoading:isDataLoading} = useQuery({
        queryKey:['dashboard'],
        queryFn:async ()=> httpGetServices(dashboardRoute)
    })

    useEffect(()=>{
        !isDataLoading && setIsLoading(false)
    },[isDataLoading])

    const data = response?.data
    const columns:number[] = [
        data?.totalMedicine,
        data?.totalCafeteria,
        data?.totalInventory,
        data?.totalCourse
    ]
    const columnsTotals = columns.reduce((acc,curr) => acc + curr,0)


    return (
        <>
            <PageHeader
                title={"dashboard"}
            />
            <PageContent>
                <Loader isLoading={isLoading}>
                    <div className='w-full flex flex-col h-full p-6'>
                        <DashboardResourcesWidgets
                            clientsQty={data?.totalClients}
                            horsesQty={data?.totalHourse}
                            instructorsQty={data?.totalInstructor}
                        />
                        <div className='my-6 flex gap-4 h-[300px]'>
                            <DashboardChartsWidget
                                columns={columns}
                                total={columnsTotals}
                            />
                            {/* <DashBoardActionsWidget/> */}
                        </div>
                        <div className='w-full flex gap-4 h-[320px] flex-1'>
                            <DashboardCafeteriaWidget
                                cafeterias={data?.latestCafeteriaOrders}
                            />
                            <DashboardInquiryWidget
                                items={data?.mostActiveClients}
                            />
                        </div>
                    </div>
                </Loader>
            </PageContent>
        </>
    )
}

export default Dashboard