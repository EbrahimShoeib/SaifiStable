'use client'
import MembershipFamilyInputs from '@/components/content/sales/membership/MembershipFamilyInputs'
import PageHeader from '@/components/layout/PageHeader'
import { familyMembershipRoute } from '@/constants/api'
import { useFailedPopUp } from '@/hooks/useFailedPopUp'
import { useSuccessPopUp } from '@/hooks/useSuccessPopUp'
import { httpPostService } from '@/services/httpPostService'
import { statusCodeIndicator } from '@/utils/statusCodeIndicator'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { useMutation } from 'react-query'

function AddNewFamilyMembershipPage() {
    const [startDate,setStartDate] = useState<string>("")
    const [endDate,setEndDate] = useState<string>("")
    const [familyName,setFamilyName] = useState<string>("")
    const [members,setMembers] = useState<NameAndId>(null)
    const [relationMember,setRelationMember] = useState<NameAndId>(null)
    const [status,setStatus] = useState<NameAndId>(null)
    const [membershipType,setMembershipType] = useState<NameAndId>(null)

    const [isLoading,setIsLoading] = useState<boolean>(false)
    const failedPopUp = useFailedPopUp()
    const successPopUp = useSuccessPopUp()
    const router = useRouter()
    const isFamilyEnumSelected =  membershipType?.name === 'family'

    const {mutate} = useMutation({
        mutationFn:async () => httpPostService(familyMembershipRoute,JSON.stringify({
            famillyName:familyName,
            membershipType:membershipType?.name,
            status:status?.name,
            startDate,
            endDate,
            members:members?.id,
            clientId:isFamilyEnumSelected? relationMember?.id : null


           
        })),
        onSuccess:(res) => {
            const status = statusCodeIndicator(res.status_code) === "success" 
            
            if (status) {
                successPopUp("item added successfully")
                router.push("/sales/membership/family")
            }else {
                failedPopUp(res.message)
            }
        },
        onError: () => failedPopUp()
    })

    return (
        <>
            <PageHeader
                showBackButton={true}
                title={(
                    <span>
                        stables membership /
                        <span className='text-primary'>add family membership</span>
                    </span>
                )}
            />
            <MembershipFamilyInputs
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
                familyName={familyName}
                setFamilyName={setFamilyName}
                members={members}
                setMembers={setMembers}
                isFamilyEnumSelected={isFamilyEnumSelected}
                relationMember={relationMember}
                setRelationMember={setRelationMember}
                submitButtonLabel='add family membership'
            />
        </>
    )
}

export default AddNewFamilyMembershipPage