"use client"

import InventoryConsumedInputs from "@/components/content/sales/inventory/InventoryConsumedInputs"
import PageHeader from "@/components/layout/PageHeader"
import { inventoryConsumedItemsRoute } from "@/constants/api"
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

function EditInvConsumedItemPage() {
    const [itemName,setItemName] = useState<string>("")
    const [quantity,setQuantity] = useState<string>("")
    const [price,setPrice] = useState<string>("")
    //const [date,setDate] = useState<string>("no-date")
    const [measure,setMeasure] = useState<string>("")
    const [horse,setHorse] = useState<NameAndId>(null)
    const {consumedInventoryItemId} = useParams()
    const inventoryConsumedItemIdRoute = `${inventoryConsumedItemsRoute}/${consumedInventoryItemId}`

    const [isLoading,setIsLoading] = useState<boolean>(true)

    const failedPopUp = useFailedPopUp()
    const successPopUp = useSuccessPopUp()
    const router = useRouter()

    const {mutate} = useMutation({
        mutationFn:async () => httpPatchService(inventoryConsumedItemIdRoute,JSON.stringify({
            invConsumedItemName:itemName,
            invConsumedQuantity:quantity,
            invConsumedPrice:price,
            date:"no-date",
            invConsumedMeasure:measure,
            hourseId:horse?.id
        })),
        onSuccess:(res) => {
            const status = statusCodeIndicator(res.status_code) === "success" 
            
            if (status) {
                successPopUp("item updated successfully")
                router.push("/sales/inventory/consumed-item")
            }else {
                failedPopUp(res.message)
            }
        },
        onError: () => failedPopUp()
    })

    useEffect(()=>{
        const fetchInvConsumedItemData =async () => {
            const consumedItemData = await httpGetServices(inventoryConsumedItemIdRoute)
            if (Boolean(consumedItemData.data)) {
                const itemData = consumedItemData.data
                setItemName(itemData.invConsumedItemName)
                setQuantity(itemData.invConsumedQuantity)
                setPrice(itemData.invConsumedPrice)
                setMeasure(itemData.invConsumedMeasure)
                const horse =  Boolean(itemData.hourseId) ? ({
                    name:itemData.hourseId.hourseName,
                    id:itemData.hourseId._id
                }) : null
                setHorse(horse)
                setIsLoading(false)   
            }
        }
        fetchInvConsumedItemData()
    },[])


    return (
        <>
            <PageHeader
                title={(
                    <span>
                        stables inventory /
                        <span className='text-primary'>edit consumed item</span>
                    </span>
                )}
                showBackButton={true}
            />
            <InventoryConsumedInputs
                handleSubmit={mutate}
                itemName={itemName}
                setItemName={setItemName}
                quantity={quantity}
                setQuantity={setQuantity}
                price={price}
                setPrice={setPrice}
                isLoading={isLoading} 
                measure={measure}
                setMeasure={setMeasure}
                horse={horse}
                setHorse={setHorse}
                submitButtonLabel='save inventory item'     
            />
        </>
    )
}

export default EditInvConsumedItemPage