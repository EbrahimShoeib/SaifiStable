"use client"
import HorsePageInputs from '@/components/content/resources/horses/HorsesPageInputs'
import PageHeader from '@/components/layout/PageHeader'
import { horseCategoriesRoute, horsesImageUploadRoute, horsesRoute } from '@/constants/api'
import { useFailedPopUp } from '@/hooks/useFailedPopUp'
import { useGetClients } from '@/hooks/useGetClients'
import { useGetHorses } from '@/hooks/useGetHorses'
import { useSuccessPopUp } from '@/hooks/useSuccessPopUp'
import { httpGetServices } from '@/services/httpGetService'
import { httpPatchService } from '@/services/httpPatchService'
import { httpPostFormDataService } from '@/services/httpPostFormDataService'
import { getClientById } from '@/utils/getClientById'
import { getGender } from '@/utils/getGender'
import { getHorseById } from '@/utils/getHorseById'
import { getHorseCategoryById } from '@/utils/getHorseCategoryById'
import { statusCodeIndicator } from '@/utils/statusCodeIndicator'
import { toNameAndId } from '@/utils/toNameAndId'
import { useParams } from 'next/navigation'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { useMutation, useQuery } from 'react-query'

function HorseEditPage() {

    const {horseId} = useParams()
    const horseIdRoute = `${horsesRoute}/${horseId}`

    
        
    const [name,setName] = useState<string>('')
    const [note,setNote] = useState<string>('')
    const [client,setClient] = useState<NameAndId>(null)
    const [age,setAge] = useState<string>('')
    const [gender,setGender] = useState<NameAndId>(null)
    const [groom,setGroom] = useState<NameAndId>(null)
    const [horseCategory,setHorseCategory] = useState<NameAndId>(null)
    const [isLoading,setIsLoading] = useState<boolean>(true)
    const [formDataFile,setFormDataFile] = useState<FormData>()
    const [id,setId] = useState<string>('')

    const router = useRouter()
    const failedPopUp = useFailedPopUp()
    const successPopUp = useSuccessPopUp()


    useEffect(()=>{
        const fetchClient = async () => {
            const res = await httpGetServices(horseIdRoute)
            if (statusCodeIndicator(res.statusCode) === "success") {

                const data = res.data
                if (data) {
                    console.log(data);
                    
                    setName(data.hourseName)
                    setNote(data.note)
                    let category = await getHorseCategoryById(data.catigoryId[0])
                    category = Boolean(category) ? ({
                        name:category.displayName,
                        id:category._id
                    }) : null
                    setHorseCategory(category)
                    
                    let client = await getClientById(data.clientId)
                    client = client ? ({
                        name:client.username,
                        id:client._id
                    }) : null
                    
                    setClient(client)
                    
                    let horse = await getHorseById(data.groom)
                    horse = horse ?( {
                        name:horse?.hourseName,
                        id:horse?._id
                    }) : null 
                    setGroom(horse)
                    setAge(data.age)
                    setGender(getGender(data?.gender))
                    setNote(data.note)
                    data.id&&setId(data?.id)
                    setIsLoading(false)
                }
               
            }
            
        }
        fetchClient()
    },[])

    const {mutate}= useMutation({
        mutationFn:async () => httpPatchService(horseIdRoute,JSON.stringify({
            hourseName:name,
            note,
            clientId:client?.id,
            age,
            gender:gender?.name,
            groom:groom?.id,
            catigoryId:horseCategory?.id,
            id
        })),
        onSuccess:async (res) => {
            const status = statusCodeIndicator(res.status_code) === "success" 
            
            if (status) {
                successPopUp("horse updated successfully")
                if (res?.data?._id) {                    
                    await handleImageUpload(res?.data?._id)
                }
                router.push("/resources/horses")
            }else {
                failedPopUp(res.message)
            }
        },
        onError:() => failedPopUp()
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
                        <span className="text-primary">edit horse</span>
                    </span>
                )}
                showBackButton={true}
            />
            <HorsePageInputs
                name={name}
                isLoading={isLoading}
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
                submitButtonLabel='save horse data'
                id={id}
                setId={setId}
            />
        </>
    )
}

export default HorseEditPage