"use client"

import Loader from '@/components/layout/Loader';
import NavigationTabs from '@/components/shared/all/NavigationTabs';
import PageContent from '@/components/layout/PageContent';
import PaginationButtons from '@/components/layout/PaginationButtons';
import Table from '@/components/layout/Table';
import { BASE_URL, cafeteriaMenuItemRoute, packagesRoute } from '@/constants/api';
import { httpGetServices } from '@/services/httpGetService';
import { useSearchParams } from 'next/navigation';
import React, { Suspense, useState } from 'react'
import { useQuery } from 'react-query';
import { getReadableDate } from '@/utils/getReadableDate';
import PageHeader from '@/components/layout/PageHeader';
import { priceFormatter } from '@/utils/priceFormatter';
import { FallBackImage } from '@/components/shared/all/FallBackImage';
import { BiSolidImageAlt } from 'react-icons/bi';

function CafeteriaMenuItems() {
    
    const searchParams = useSearchParams()
    const pageNumber = searchParams.get("page") || "1"

    const [cafeteriaMenuitemRes,setCafeteriaMenuitemRes] = useState<any>()

    const {data:response,isSuccess,refetch}:any = useQuery({
        queryFn:async () => httpGetServices(`${cafeteriaMenuItemRoute}?page=${pageNumber}`),
        queryKey:["cafeteria","menuItem",'page',pageNumber]
    })
    
    const isDataHere = Boolean(response?.caveteriaItems?.data) && isSuccess


    const tableHeadCells = [
        "image",
        "menu item name",
        "quantity",
        "type",
        "price",
        "date"
    ]

    const tableBodyItemCellKeys = [
        "img",
        "menuItemName",
        "quantity",
        "type",
        "price",
        "date"
    ]

    const tableBodyItems = response?.caveteriaItems?.data.map((item:any) => ({
        ...item,
        date:item.date&&getReadableDate(item.date)||'no-date',
        price:(<span className='text-right block w-full'>
            {priceFormatter(String(item.price))}
        </span>),
        img:<FallBackImage 
            className='h-[50px] aspect-square object-cover' 
            url={`${BASE_URL}${cafeteriaMenuItemRoute}/upload-image/${item._id}`}
            fallback={<BiSolidImageAlt className='h-[50px] bg-light-grey w-[50px] bg-opacity-40 text-4xl  text-dark-grey opacity-30' />}
        />
    }))

    const navigationTabs = [
        {
            href:"menu-item",
            label:"menu items"
        },
        {
            href:"consumed-item",
            label:"consumed items"
        },
    ]
    return (
        <Suspense>
            <PageHeader
                title={"stables cafeteria"}
                linksSearchBox={{
                    searchUrl:cafeteriaMenuItemRoute,
                    options:cafeteriaMenuitemRes?.caveteriaItems?.data.map((item:any) => ({
                        name:item?.menuItemName,
                        href:`/sales/cafeteria/menu-item/${item?._id}/edit`
                    })),
                    setResponse:setCafeteriaMenuitemRes,
                    placeholder:"search cafeteria item"

                }}
                addNewButtonLabel='add new item'
            />
            <div  className='h-[calc(100%-80px)] w-full'>
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
                            route={cafeteriaMenuItemRoute}
                        />
                    </Loader>
                </PageContent>
                {
                    isDataHere ? (
                        <PaginationButtons
                            maxPages={response.caveteriaItems.max_pages}
                            currentPage={response.caveteriaItems.current_page}

                        />
                    ): <></>
                }
            </div>
        </Suspense>
    )
}

export default CafeteriaMenuItems