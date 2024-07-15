"use client"

import MedicalConsumedInputs from "@/components/content/sales/medical/MedicalConsumedInputs"
import PageHeader from "@/components/layout/PageHeader"
import { consumedMedicalRoute } from "@/constants/api"
import { useFailedPopUp } from "@/hooks/useFailedPopUp"
import { useSuccessPopUp } from "@/hooks/useSuccessPopUp"
import { httpPostService } from "@/services/httpPostService"
import { statusCodeIndicator } from "@/utils/statusCodeIndicator"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useMutation } from "react-query"

function AddConsumedMedicalItemPage() {
    const [itemName,setItemName] = useState<string>('')
    const [horse,setHorse] = useState<NameAndId>(null)
    const [price,setPrice] = useState<string>('')
    const [quantity,setQuantity] = useState<string>('')
    const [dosage,setDosage] = useState<string>('')
    const [description,setDescription] = useState<string>('')
    

    const [isLoading,setIsLoading] = useState<boolean>(false)
    
    const failedPopUp = useFailedPopUp()
    const successPopUp = useSuccessPopUp()
    const router = useRouter()

    const {mutate} = useMutation({
        mutationFn:async () => httpPostService(consumedMedicalRoute,JSON.stringify({
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
                successPopUp("item added successfully")
                router.push("/sales/medical/consumed-item")
            }else {
                failedPopUp(res.message)
            }
        },
        onError: () =>failedPopUp()
    })

    return (
        <>
            <PageHeader
                title={(
                    <span>
                        stables medical /
                        <span className="text-primary">add consumed</span>
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
                submitButtonLabel="add consumed item"
                
            />
        </>
    )
}

export default AddConsumedMedicalItemPage