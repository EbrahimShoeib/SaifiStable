"use client"

import ClientPageInputs from '@/components/content/resources/clients/ClientPageInputs'
import PageHeader from '@/components/layout/PageHeader'
import { clientImageUploadRoute, clientsRoute } from '@/constants/api'
import { useFailedPopUp } from '@/hooks/useFailedPopUp'
import { useSuccessPopUp } from '@/hooks/useSuccessPopUp'
import { httpPostFormDataService } from '@/services/httpPostFormDataService'
import { httpPostService } from '@/services/httpPostService'
import { statusCodeIndicator } from '@/utils/statusCodeIndicator'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { useMutation } from 'react-query'

function AddNewClientPage() {

    const [name,setName] = useState<string>('')
    const [email,setEmail] = useState<string>('')
    const [phone,setPhone] = useState<string>('')
    const [age,setAge] = useState<string>('')
    const [gender,setGender] = useState<NameAndId>(null)
    const [horse,setHorse] = useState<NameAndId>(null)

    const [membershipStatus,setMembershipStatus] = useState<NameAndId>(null)
    const [membershipType,setMembershipType] = useState<NameAndId>(null)
    const [formDataFile,setFormDataFile] = useState<FormData>()
    const [isLoading,setIsLoading] = useState<boolean>(false)

    const body = {
        username:name,
        email,
        gender:gender?.name,
        membershipStatus:membershipStatus?.name,
        membershipType:membershipType?.name,
        phone,
        hourseId:horse?.id,
        age,
    }
    const failedPopUp = useFailedPopUp()
    const successPopUp = useSuccessPopUp()
    const router = useRouter()

    const {mutate} = useMutation({
        mutationFn:async () => httpPostService(clientsRoute,JSON.stringify(body)),
        mutationKey:["addNewClient"],
        onSuccess:async(res)=> {
            const status = statusCodeIndicator(res.status_code) === "success" 
            console.log(res);
            
            if (status) {
                successPopUp("client added successfully")
                if (Boolean(res?.data?._id)) {
                    await handleImageUpload(res?.data?._id)
                }
                router.push("/resources/clients")
            
            }else {
                failedPopUp(res.message)
            }
        },
        onError:()=> {
            failedPopUp()
        }
    })

    const handleImageUpload = async (clientId:string) => {
        if (Boolean(formDataFile)) {
            await httpPostFormDataService(`${clientImageUploadRoute}/${clientId}`,formDataFile)   
        }
    }
    return (
        <>
            <PageHeader
                title={(
                    <span>
                        stables clients /
                        <span className='text-primary'>add new client</span>
                    </span>
                )}
                showBackButton={true}
            />
            <ClientPageInputs
                name={name}
                setName={setName}
                email={email}
                setEmail={setEmail}
                phone={phone}
                setPhone={setPhone}
                age={age}
                setAge={setAge}
                gender={gender}
                setGender={setGender}
                membershipStatus={membershipStatus}
                setMembershipStatus={setMembershipStatus}
                membershipType={membershipType}
                setMembershipType={setMembershipType}
                handleSubmit={mutate}
                formDataFile={formDataFile}
                setFormDataFile={setFormDataFile}
                isLoading={isLoading}
                horse={horse}
                setHorse={setHorse}
                submitButtonLabel="add new client"
            />
        </>
    )
}

export default AddNewClientPage