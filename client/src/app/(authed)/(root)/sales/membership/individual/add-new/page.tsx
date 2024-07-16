"use client"

import MembershipIndividualInputs from "@/components/content/sales/membership/MembershipIndividualInputs"
import PageHeader from "@/components/layout/PageHeader"
import { individualMembershipRoute } from "@/constants/api"
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

function AddNewIndividualMembershipPage() {
    const [client,setClient] = useState<NameAndId>(null)
    const [clients,setClients] = useState<NameAndId[]|[]>([])
    const [startDate,setStartDate] = useState<string>("")
    const [endDate,setEndDate] = useState<string>("")
    const [status,setStatus] = useState<NameAndId>(null)
    const [membershipType,setMembershipType] = useState<NameAndId>(null)

    const [isLoading,setIsLoading] = useState<boolean>(false)
    const failedPopUp = useFailedPopUp()
    const successPopUp = useSuccessPopUp()
    const router = useRouter()

    const {mutate} = useMutation({
        mutationFn:async () => httpPostService(individualMembershipRoute,JSON.stringify({
            clientId:client?.id,
            membershipType:membershipType?.name,
            status:status?.name,
            startDate,
            endDate
           
        })),
        onSuccess:(res) => {
            const status = statusCodeIndicator(res.status_code) === "success" 
            
            if (status) {
                successPopUp("item added successfully")
                router.push("/sales/membership/individual")
            }else {
                failedPopUp(res.message)
            }
        },
        onError: () => failedPopUp()
    })
    useGetClients({
        onSuccess:(res)=>{
            const clients = toNameAndId(res?.data?.client,"username","_id")            
            setClients(clients)
        }
    })
    return (
        <>
            <PageHeader
                showBackButton={true}
                title={(
                    <span>
                        stables membership /
                        <span className='text-primary'>add individual membership</span>
                    </span>
                )}
            />
            <MembershipIndividualInputs
                client={client}
                setClient={setClient}
                startDate={startDate}
                setStartDate={setStartDate}
                endDate={endDate}
                setEndDate={setEndDate}
                status={status}
                setStatus={setStatus}
                membershipType={membershipType}
                setMembershipType={setMembershipType}
                handleSubmit={mutate}
                isLoading={isLoading}
                submitButtonLabel="add individual membership"
            />
        </>
    )
}

export default AddNewIndividualMembershipPage