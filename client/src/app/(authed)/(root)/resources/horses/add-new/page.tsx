"use client"

import HorsePageInputs from "@/components/content/resources/horses/HorsesPageInputs"
import PageHeader from "@/components/layout/PageHeader"
import { horsesRoute, horseCategoriesRoute, horsesImageUploadRoute } from "@/constants/api"
import { useFailedPopUp } from "@/hooks/useFailedPopUp"
import { useGetClients } from "@/hooks/useGetClients"
import { useGetHorses } from "@/hooks/useGetHorses"
import { useSuccessPopUp } from "@/hooks/useSuccessPopUp"
import { httpGetServices } from "@/services/httpGetService"
import { httpPostFormDataService } from "@/services/httpPostFormDataService"
import { httpPostService } from "@/services/httpPostService"
import { statusCodeIndicator } from "@/utils/statusCodeIndicator"
import { toNameAndId } from "@/utils/toNameAndId"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { useMutation, useQuery } from "react-query"

function AddNewHorsePage() {
    
    const [name,setName] = useState<string>('')
    const [note,setNote] = useState<string>('')
    const [client,setClient] = useState<NameAndId>(null)
    const [age,setAge] = useState<string>('')
    const [gender,setGender] = useState<NameAndId>(null)
    const [groom,setGroom] = useState<NameAndId>(null)
    const [horseCategory,setHorseCategory] = useState<NameAndId>(null)
    const [formDataFile,setFormDataFile] = useState<FormData>()
    const [isLoading,setIsLoading] = useState<boolean>(false)
    const [id,setId] = useState<string>('')

    const failedPopUp = useFailedPopUp()
    const successPopUp = useSuccessPopUp()
    const router = useRouter()


    const {mutate} = useMutation({
        mutationFn:async () => httpPostService(horsesRoute,JSON.stringify({
            hourseName:name,
            note,
            clientId:client?.id,
            age,
            gender:gender?.name,
            groom:groom?.id,
            catigoryId:horseCategory?.id,
            id
        })),
        mutationKey:["addNewHorse"],
        onSuccess:async (res) => {
            const status = statusCodeIndicator(res.status_code) === "success" 
            
            if (status) {
                successPopUp("horse added successfully")
                if (res?.data?._id) {
                    await handleImageUpload(res?.data?._id)
                }
                router.push("/resources/horses")
            }else {
                failedPopUp(res.message)
            }
        }, onError:() => {
            failedPopUp()

        }
    })



  

    const handleImageUpload = async (id:string) => {
        if (Boolean(formDataFile)) {
            await httpPostFormDataService(`${horsesImageUploadRoute}/${id}`,formDataFile)   
        }
    }
    return (
        <>
            <PageHeader
                title={(
                    <span>
                        stables horses / 
                        <span className="text-primary">add new horse</span>
                    </span>
                )}
                showBackButton={true}
            />
            <HorsePageInputs
                isLoading={isLoading}
                name={name}
                setName={setName}
                client={client}
                setClient={setClient}
                age={age}
                setAge={setAge}
                gender={gender}
                setGender={setGender}
                groom={groom}
                setGroom={setGroom}
                note={note}
                setNote={setNote}
                handleSubmit={mutate}
                horseCategory={horseCategory}
                setHorseCategory={setHorseCategory}
                formDataFile={formDataFile}
                setFormDataFile={setFormDataFile}
                submitButtonLabel="add new horse"
                id={id}
                setId={setId}
            />
        </>
    )
}

export default AddNewHorsePage