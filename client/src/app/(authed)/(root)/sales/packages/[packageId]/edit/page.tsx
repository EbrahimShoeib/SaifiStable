"use client"

import PackagesInputs from '@/components/content/sales/packages/PackagesInputs'
import PageHeader from '@/components/layout/PageHeader'
import { packagesRoute } from '@/constants/api'
import { useFailedPopUp } from '@/hooks/useFailedPopUp'
import { useGetClients } from '@/hooks/useGetClients'
import { useSuccessPopUp } from '@/hooks/useSuccessPopUp'
import { httpGetServices } from '@/services/httpGetService'
import { httpPatchService } from '@/services/httpPatchService'
import { getIsoDate } from '@/utils/getIsoDate'
import { getPackageCategory } from '@/utils/getPackageCategory'
import { getPackageLesson } from '@/utils/getPackageLesson'
import { getPackageStatus } from '@/utils/getPackageStatus'
import { statusCodeIndicator } from '@/utils/statusCodeIndicator'
import { toNameAndId } from '@/utils/toNameAndId'
import { useParams, useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { useMutation } from 'react-query'

function PackageEditPage() {
    const [startDate,setStartDate] = useState<string>("")
    const [endDate,setEndDate] = useState<string>("")
    const [lessons,setLessons] = useState<NameAndId>(null)

    const [status,setStatus] = useState<NameAndId>(null)
    const [category,setCategory] = useState<NameAndId>(null)

    const [name,setName] = useState<string>("")

    const [isLoading,setIsLoading] = useState<boolean>(true)

    const failedPopUp = useFailedPopUp()
    const successPopUp = useSuccessPopUp()
    const router = useRouter()
    const {packageId} = useParams()
    const packageIdRoute = `${packagesRoute}/${packageId}`

    const {mutate} = useMutation({
        mutationFn:async () => httpPatchService(packageIdRoute,JSON.stringify({
            category:category?.name||"no-category",
            lessons:lessons?.name,
            startDate,
            endDate,
            status:status?.name,
            name
        })),
        onSuccess:(res) => {
            const status = statusCodeIndicator(res.status_code) === "success" 
            
            if (status) {
                successPopUp("package updated successfully")
                router.push("/sales/packages")
            }else {
                failedPopUp(res.message)
            }
        },
        onError: () => failedPopUp()
    })



    useEffect(()=>{
        const fetchPackageItem = async () => {
            const res = await httpGetServices(packageIdRoute)
            console.log(res);
            
            const itemData = res?.Packages?.data
            
            if (Boolean(itemData)) {
                setCategory(getPackageCategory(itemData?.category))
                setStatus(getPackageStatus(itemData?.status))
                setName(itemData?.name)
                setStartDate(getIsoDate(itemData?.startDate))
                setEndDate(getIsoDate(itemData?.endDate))
                const lesson = itemData?.lessons ? getPackageLesson(itemData?.lessons) :null
                setLessons(lesson)
                setIsLoading(false)
            }
        }
        fetchPackageItem()
    },[])


    return (
        <>
            <PageHeader
                title={(
                    <span>
                        stables packages /
                        <span className='text-primary'>edit package</span>
                    </span>
                )}
                showBackButton={true}
            />
            <PackagesInputs
                category={category}
                setCategory={setCategory}
                name={name}
                setName={setName}
                setEndDate={setEndDate}
                setLessons={setLessons}
                setStartDate={setStartDate}
                setStatus={setStatus}
                startDate={startDate}
                status={status}
                endDate={endDate}
                handleSubmit={mutate}
                isLoading={isLoading}
                lessons={lessons}
                submitButtonLabel="save package"
            />
        </>
    )
}

export default PackageEditPage