"use client"

import MedicineItemInputs from "@/components/content/sales/medical/MedicineItemInputs"
import PageHeader from "@/components/layout/PageHeader"
import { medicineMedicalRoute } from "@/constants/api"
import { useFailedPopUp } from "@/hooks/useFailedPopUp"
import { usePopUp } from "@/hooks/usePopUp"
import { useSuccessPopUp } from "@/hooks/useSuccessPopUp"
import { httpGetServices } from "@/services/httpGetService"
import { httpPatchService } from "@/services/httpPatchService"
import { getMedicalType } from "@/utils/getMedicalType"
import { statusCodeIndicator } from "@/utils/statusCodeIndicator"
import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { IoMdCheckmarkCircleOutline } from "react-icons/io"
import { MdErrorOutline } from "react-icons/md"
import { useMutation } from "react-query"

function AddNewMedicalMedicinePage() {
    const [itemName,setItemName] = useState<string>('')
    const [quantity,setQuantity] = useState<string>('')
    const [price,setPrice] = useState<string>('')
    const [dosage,setDosage] = useState<string>('')
    const [description,setDescription] = useState<string>('')
    const [type,setType] = useState<NameAndId>(null)

    const [isLoading,setIsLoading] = useState<boolean>(true)
    
    const failedPopUp = useFailedPopUp()
    const successPopUp = useSuccessPopUp()
    const router = useRouter()
    const {medicineId} = useParams()
    const medicineIdRoute = `${medicineMedicalRoute}/${medicineId}`

    const {mutate} = useMutation({
        mutationFn:async () => httpPatchService(medicineIdRoute,JSON.stringify({
            name:itemName,
            quantity,
            type:type?.name,
            price,
            dosage,
            discription:description,
        })),
        onSuccess:(res) => {
            const status = statusCodeIndicator(res.status_code) === "success" 
            
            if (status) {
                successPopUp("item added successfully")
                router.push("/sales/medical/medicine")
            }else {
                failedPopUp(res.message)
            }
        },
        onError: () => failedPopUp()
    })

    useEffect(()=>{
        const fetchMedicine = async () => {
            const medicine = await httpGetServices(medicineIdRoute)
            const data = medicine.data
            if (Boolean(data)) {
                setItemName(data.name)
                setQuantity(data.quantity)
                setPrice(data.price)
                setDosage(data.dosage)
                setDescription(data.discription)
                setType(getMedicalType(data.type))
                setIsLoading(false)
            }
            
        }   
        fetchMedicine()
    },[])

    return (
        <>
            <PageHeader
                title={(
                    <span>
                        stables medical /
                        <span className="text-primary">edit medicine</span>
                    </span>
                )}
                showBackButton={true}
            />
            <MedicineItemInputs
                itemName={itemName}
                setItemName={setItemName}
                quantity={quantity}
                setQuantity={setQuantity}
                price={price}
                setPrice={setPrice}
                description={description}
                setDescription={setDescription}
                type={type}
                setType={setType}
                dosage={dosage}
                setDosage={setDosage}
                handleSubmit={mutate}
                isLoading={isLoading}
                submitButtonLabel="save medicine"
            />
        </>
    )
}

export default AddNewMedicalMedicinePage