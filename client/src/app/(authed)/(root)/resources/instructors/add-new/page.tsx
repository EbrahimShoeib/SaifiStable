"use client"

import InstructorPageInputs from "@/components/content/resources/instructors/InstructorPageInputs"
import PageHeader from "@/components/layout/PageHeader"
import { instructorsImageUploadRoute, instructorsRoute } from "@/constants/api"
import { useFailedPopUp } from "@/hooks/useFailedPopUp"
import { usePopUp } from "@/hooks/usePopUp"
import { useSuccessPopUp } from "@/hooks/useSuccessPopUp"
import { httpPostFormDataService } from "@/services/httpPostFormDataService"
import { httpPostService } from "@/services/httpPostService"
import { statusCodeIndicator } from "@/utils/statusCodeIndicator"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { IoMdCheckmarkCircleOutline } from "react-icons/io"
import { MdErrorOutline } from "react-icons/md"
import { useMutation } from "react-query"

function AddNewInstructorPage() {
    const [name,setName] = useState<string>('')
    const [email,setEmail] = useState<string>('')
    const [phone,setPhone] = useState<string>('')
    const [age,setAge] = useState<string>('')
    const [gender,setGender] = useState<NameAndId>(null)
    const [formDataFile,setFormDataFile] = useState<FormData>()
    const [isLoading,setIsLoading] = useState<boolean>(false)

    const failedPopUp = useFailedPopUp()
    const successPopUp = useSuccessPopUp()
    const router = useRouter()

    const body = {
        instractorName:name,
        email,
        gender:gender?.name,
        phoneNumber:phone,
        age,
    }

    const {mutate} = useMutation({
        mutationFn:async () => httpPostService(instructorsRoute,JSON.stringify(body)),
        mutationKey:["addNewInstructor"],
        onSuccess:async(res)=> {
            const status = statusCodeIndicator(res.status_code) === "success" 
            
            
            if (status) {
                successPopUp("instructor added successfully")
                if (res?.data?._id) {
                    await handleImageUpload(res?.data?._id)
                }
                router.push("/resources/instructors")
            }else {
                failedPopUp("failed to add instructor")
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
                        <span className='text-primary'>add new instructor</span>
                    </span>
                )}
                showBackButton={true}
            />
        
            <InstructorPageInputs
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
                handleSubmit={mutate}
                isLoading={isLoading}
                formDataFile={formDataFile}
                setFormDataFile={setFormDataFile}
                submitButtonLabel="add new instructor"
            />
        </>
    )
}

export default AddNewInstructorPage