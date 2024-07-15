"use client"

import InstructorPageInputs from '@/components/content/resources/instructors/InstructorPageInputs'
import PageHeader from '@/components/layout/PageHeader'
import { instructorsImageUploadRoute, instructorsRoute } from '@/constants/api'
import { useFailedPopUp } from '@/hooks/useFailedPopUp'
import { usePopUp } from '@/hooks/usePopUp'
import { useSuccessPopUp } from '@/hooks/useSuccessPopUp'
import { httpGetServices } from '@/services/httpGetService'
import { httpPatchService } from '@/services/httpPatchService'
import { httpPostFormDataService } from '@/services/httpPostFormDataService'
import { getGender } from '@/utils/getGender'
import { statusCodeIndicator } from '@/utils/statusCodeIndicator'
import { useParams, useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { IoMdCheckmarkCircleOutline } from 'react-icons/io'
import { MdErrorOutline } from 'react-icons/md'
import { useMutation } from 'react-query'

function InstructorEditPage() {
    const [name,setName] = useState<string>('')
    const [email,setEmail] = useState<string>('')
    const [phone,setPhone] = useState<string>('')
    const [age,setAge] = useState<string>('')
    const [gender,setGender] = useState<NameAndId>(null)
    const [formDataFile,setFormDataFile] = useState<FormData>()
    const [isLoading,setIsLoading] = useState<boolean>(true)

    const failedPopUp = useFailedPopUp()
    const successPopUp = useSuccessPopUp()
    const router = useRouter()
    const {instructorId} = useParams()

    const instructorIdRoute = `${instructorsRoute}/${instructorId}`

    const body = {
        instractorName:name,
        email,
        gender:gender?.name,
        phoneNumber:phone,
        age,
    }

    useEffect(()=>{
        const fetchInstructor = async () => {
            const res = await httpGetServices(instructorIdRoute)
            if (statusCodeIndicator(res.status_code) === "success") {
                setName(res.data.instractorName)
                setEmail(res.data.email)
                setPhone(res.data.phoneNumber)
                setAge(res.data.age)
                setGender(getGender(res.data.gender))
                setIsLoading(false)
            }
            
        }
        fetchInstructor()
    },[])

    const {mutate} = useMutation({
        mutationFn:async () => httpPatchService(instructorIdRoute,JSON.stringify(body)),
        mutationKey:["updateInstructor"],
        onSuccess:async(res)=> {
            const status = statusCodeIndicator(res.status_code) === "success" 
            
            if (status) {
                successPopUp("instructor updated successfully")
                if (res?.data?._id) {
                    await handleImageUpload(res?.data?._id)
                }
                router.push("/resources/instructors")
            }else {
                failedPopUp(res.message)
            }
        },
        onError:()=> failedPopUp()
    })

    const handleImageUpload = async (id:string) => {
        if (Boolean(formDataFile)) {
            await httpPostFormDataService(`${instructorsImageUploadRoute}/${id}`,formDataFile)   
        }
    }

    return (
        <>
            <PageHeader
                title={(
                    <span>
                        stables instructors /
                        <span className='text-primary'>edit instructor</span>
                    </span>
                )}
                showBackButton={true}
            />
            <InstructorPageInputs
                email={email}
                setAge={setAge}
                setEmail={setEmail}
                setGender={setGender}
                setPhone={setPhone}
                setName={setName}
                name={name}
                phone={phone}
                age={age}
                gender={gender}
                handleSubmit={mutate}
                formDataFile={formDataFile}
                setFormDataFile={setFormDataFile}
                isLoading={isLoading}
                submitButtonLabel='save instructor data'
            />
        </>
    )
}

export default InstructorEditPage