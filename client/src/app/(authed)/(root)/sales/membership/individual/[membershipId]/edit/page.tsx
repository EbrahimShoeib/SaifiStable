"use client"

import MembershipIndividualInputs from '@/components/content/sales/membership/MembershipIndividualInputs'
import PageHeader from '@/components/layout/PageHeader'
import { individualMembershipRoute } from '@/constants/api'
import { useFailedPopUp } from '@/hooks/useFailedPopUp'
import { useGetClients } from '@/hooks/useGetClients'
import { usePopUp } from '@/hooks/usePopUp'
import { useSuccessPopUp } from '@/hooks/useSuccessPopUp'
import { httpGetServices } from '@/services/httpGetService'
import { httpPatchService } from '@/services/httpPatchService'
import { getIsoDate } from '@/utils/getIsoDate'
import { getMembershipStatus } from '@/utils/getMembershipStatus'
import { getMembershipType } from '@/utils/getMembershipType'
import { statusCodeIndicator } from '@/utils/statusCodeIndicator'
import { toNameAndId } from '@/utils/toNameAndId'
import { useParams, useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { IoMdCheckmarkCircleOutline } from 'react-icons/io'
import { MdErrorOutline } from 'react-icons/md'
import { useMutation } from 'react-query'

function EditIndividualMembershipPage() {
    const [client,setClient] = useState<NameAndId>(null)
    const [startDate,setStartDate] = useState<string>("")
    const [endDate,setEndDate] = useState<string>("")
    const [status,setStatus] = useState<NameAndId>(null)
    const [membershipType,setMembershipType] = useState<NameAndId>(null)
    const {membershipId} = useParams()
    const individualMembershipIdRoute = `${individualMembershipRoute}/${membershipId}`

    const [isLoading,setIsLoading] = useState<boolean>(true)
    const failedPopUp = useFailedPopUp()
    const successPopUp = useSuccessPopUp()
    const router = useRouter()

    const {mutate} = useMutation({
        mutationFn:async () => httpPatchService(individualMembershipIdRoute,JSON.stringify({
            clientId:client?.id,
            membershipType:membershipType?.name,
            status:status?.name,
            startDate,
            endDate
           
        })),
        onSuccess:(res) => {
            const status = statusCodeIndicator(res.status_code) === "success" 
            
            if (status) {
                successPopUp("item updated successfully")
                router.push("/sales/membership/individual")
            }else {
                failedPopUp(res.message)
            }
        },
        onError: () => failedPopUp()
    })


    useEffect(()=>{
        const fetchMembershipData = async () => {
            const membership = await httpGetServices(individualMembershipIdRoute)
            const data = membership.data
            
            if (Boolean(data)) {
                const client = Boolean(data.clientId) ? ({
                    name:data.clientId.username,
                    id:data.clientId._id
                }) : null
                setClient(client)
                data.startDate&&setStartDate(getIsoDate(data.startDate))
                data.endDate&&setEndDate(getIsoDate(data.endDate))
                setStatus(getMembershipStatus(data.status))
                setMembershipType(getMembershipType(data.membershipType))
                setIsLoading(false)
            }
            
        }
        fetchMembershipData()
    },[])
    return (
        <>
            <PageHeader
                showBackButton={true}
                title={(
                    <span>
                        stables membership /
                        <span className='text-primary'>edit individual membership</span>
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
                submitButtonLabel="save individual membership"
            />
        </>
    )
}

export default EditIndividualMembershipPage