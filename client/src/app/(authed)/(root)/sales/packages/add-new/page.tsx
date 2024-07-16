"use client"

import PackagesInputs from "@/components/content/sales/packages/PackagesInputs"
import PageHeader from "@/components/layout/PageHeader"
import { packagesRoute } from "@/constants/api"
import { useFailedPopUp } from "@/hooks/useFailedPopUp"
import { useGetClients } from "@/hooks/useGetClients"
import { usePopUp } from "@/hooks/usePopUp"
import { useSuccessPopUp } from "@/hooks/useSuccessPopUp"
import { httpPostService } from "@/services/httpPostService"
import { statusCodeIndicator } from "@/utils/statusCodeIndicator"
import { toNameAndId } from "@/utils/toNameAndId"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { IoMdCheckmarkCircleOutline } from "react-icons/io"
import { MdErrorOutline } from "react-icons/md"
import { useMutation } from "react-query"

function AddNewPackagePage() {
    const [startDate,setStartDate] = useState<string>("")
    const [endDate,setEndDate] = useState<string>("")
    const [lessons,setLessons] = useState<NameAndId>(null)

    const [status,setStatus] = useState<NameAndId>(null)
    const [category,setCategory] = useState<NameAndId>(null)

    const [name,setName] = useState<string>("")

    const [isLoading,setIsLoading] = useState<boolean>(false)

    const failedPopUp = useFailedPopUp()
    const successPopUp = useSuccessPopUp()
    const router = useRouter()

    const {mutate} = useMutation({
        mutationFn:async () => httpPostService(packagesRoute,JSON.stringify({
            category:category?.name||"no-category",
            lessons:lessons?.name,
            startDate,
            endDate,
            status:status?.name,
            name
        })),
        onSuccess:async (res) => {
            const status = statusCodeIndicator(res.status_code) === "success" 
            console.log(res);

            if (status) {
                successPopUp("package added successfully")
                router.push("/sales/packages")
            }else {
                failedPopUp(res.message)
            }
        },
        onError: () => failedPopUp()
    })

   

    return (
        <>
            <PageHeader
                title={(
                    <span>
                        stables packages /
                        <span className='text-primary'>add new item</span>
                    </span>
                )}
                showBackButton={true}
            />
            <PackagesInputs
                category={category}
                setCategory={setCategory}
                setName={setName}
                name={name}
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
                submitButtonLabel="add new package"
            />
        </>
    )
}

export default AddNewPackagePage