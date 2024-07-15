"use client"

import MedicalConsumedInputs from "@/components/content/sales/medical/MedicalConsumedInputs"
import PageHeader from "@/components/layout/PageHeader"
import { consumedMedicalRoute } from "@/constants/api"
import { useFailedPopUp } from "@/hooks/useFailedPopUp"
import { useGetHorses } from "@/hooks/useGetHorses"
import { usePopUp } from "@/hooks/usePopUp"
import { useSuccessPopUp } from "@/hooks/useSuccessPopUp"
import { httpGetServices } from "@/services/httpGetService"
import { httpPatchService } from "@/services/httpPatchService"
import { statusCodeIndicator } from "@/utils/statusCodeIndicator"
import { toNameAndId } from "@/utils/toNameAndId"
import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { IoMdCheckmarkCircleOutline } from "react-icons/io"
import { MdErrorOutline } from "react-icons/md"
import { useMutation } from "react-query"

function EditConsumedMedicalItem() {
    const [itemName,setItemName] = useState<string>('')
    const [horse,setHorse] = useState<NameAndId>(null)
    const [price,setPrice] = useState<string>('')
    const [quantity,setQuantity] = useState<string>('')
    const [dosage,setDosage] = useState<string>('')
    const [description,setDescription] = useState<string>('')
    

    const [isLoading,setIsLoading] = useState<boolean>(true)
    
    const failedPopUp = useFailedPopUp()
    const successPopUp = useSuccessPopUp()
    const router = useRouter()
    const {consumedId} = useParams()
    const consumedMedicalItemRoute = `${consumedMedicalRoute}/${consumedId}`

    const {mutate} = useMutation({
        mutationFn:async () => httpPatchService(consumedMedicalItemRoute,JSON.stringify({
            hourseId:horse?.id,
            quantity,
            price,
            dosage,
            discription:description,
            medicineName:itemName
        })),
        onSuccess:(res) => {
            const status = statusCodeIndicator(res.status_code) === "success" 
            
            if (status) {
                successPopUp("item updated successfully")
                router.push("/sales/medical/consumed-item")
            }else {
                failedPopUp(res.message)
            }
        },
        onError: () => failedPopUp()
    })
  
    useEffect(()=>{
        const fetchConsumedMedicalItemData = async () => {
            const res = await httpGetServices(consumedMedicalItemRoute)
            
            const itemData = res?.data
            if (Boolean(itemData)) {
                setItemName(itemData.medicineName)
                const horse = itemData.hourseId ? (
                    {
                        name:itemData.hourseId.hourseName,
                        id:itemData.hourseId._id
                    }
                ) : null
                setHorse(horse)
                setPrice(itemData.price)
                setQuantity(itemData.quantity)
                setDescription(itemData.discription)
                setDosage(itemData.dosage)
                setIsLoading(false)
            }
        }
        fetchConsumedMedicalItemData()
    },[])

    return (
        <>
            <PageHeader
                title={(
                    <span>
                        stables medical /
                        <span className="text-primary">edit consumed</span>
                    </span>
                )}
                showBackButton={true}
            />
            <MedicalConsumedInputs
                itemName={itemName}
                setItemName={setItemName}
                quantity={quantity}
                setQuantity={setQuantity}
                price={price}
                setPrice={setPrice}
                description={description}
                horse={horse}
                setHorse={setHorse}
                setDescription={setDescription}
                dosage={dosage}
                setDosage={setDosage}
                handleSubmit={mutate}
                isLoading={isLoading}
                submitButtonLabel="save consumed item"
                
            />
        </>
    )
}

export default EditConsumedMedicalItem