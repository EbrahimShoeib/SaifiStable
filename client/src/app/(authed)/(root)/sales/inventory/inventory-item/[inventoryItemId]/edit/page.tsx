"use client"

import InventoryItemInputs from "@/components/content/sales/inventory/InventoryItemInputs"
import PageHeader from "@/components/layout/PageHeader"
import { inventoryItemsRoute } from "@/constants/api"
import { useFailedPopUp } from "@/hooks/useFailedPopUp"
import { usePopUp } from "@/hooks/usePopUp"
import { useSuccessPopUp } from "@/hooks/useSuccessPopUp"
import { httpGetServices } from "@/services/httpGetService"
import { httpPatchService } from "@/services/httpPatchService"
import { getInventoryMeasures } from "@/utils/getInventoryMeasure"
import { getInventoryType } from "@/utils/getInventoryType"
import { statusCodeIndicator } from "@/utils/statusCodeIndicator"
import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { IoMdCheckmarkCircleOutline } from "react-icons/io"
import { MdErrorOutline } from "react-icons/md"
import { useMutation } from "react-query"

function EditInventoryItemPage() {
    const [itemName,setItemName] = useState<string>("")
    const [quantity,setQuantity] = useState<string>("")
    const [type,setType] = useState<NameAndId>(null)
    const [price,setPrice] = useState<string>("")
    //const [date,setDate] = useState<string>("no-date")
    const [description,setDescription] = useState<string>("")
    const [measure,setMeasure] = useState<NameAndId>(null)

    const [isLoading,setIsLoading] = useState<boolean>(true)

    const failedPopUp = useFailedPopUp()
    const successPopUp = useSuccessPopUp()
    const router = useRouter()
    const {inventoryItemId} = useParams()
    const inventoryItemIdRoute = `${inventoryItemsRoute}/${inventoryItemId}`

    const {mutate} = useMutation({
        mutationFn:async () => httpPatchService(inventoryItemIdRoute,JSON.stringify({
            itemName,
            quantity,
            type:type?.name,
            price,
            //date:"no-date",
            measure:measure?.name,
            itemDescription:description
        })),
        onSuccess:(res) => {
            const status = statusCodeIndicator(res.status_code) === "success" 
            
            if (status) {
                successPopUp("item updated successfully")
                router.push("/sales/inventory/inventory-item")
            }else {
                failedPopUp(res.message)
            }
        },
        onError: () => failedPopUp()
    })


    useEffect(() => {
        const fetchInvItemData = async () => {
            const inventoryItemData = await httpGetServices(inventoryItemIdRoute)
            if (Boolean(inventoryItemData.data)) {
                const data = inventoryItemData.data                
                setItemName(data.itemName)
                setQuantity(data.quantity)
                setType(getInventoryType(data.type))
                setPrice(data.price)
                //setDate(data.date)
                setDescription(data.itemDescription)
                setMeasure(getInventoryMeasures(data.measure)||null)
                setIsLoading(false)
            }
            
        }   
        fetchInvItemData()
    },[])

    return (
        <>
            <PageHeader
                title={(
                    <span>
                        stables inventory /
                        <span className='text-primary'>edit item</span>
                    </span>
                )}
                showBackButton={true}
            />
            <InventoryItemInputs
                handleSubmit={mutate}
                itemName={itemName}
                setItemName={setItemName}
                quantity={quantity}
                setQuantity={setQuantity}
                price={price}
                setPrice={setPrice}
                type={type}
                setType={setType}
                isLoading={isLoading}
                measure={measure}
                setMeasure={setMeasure}
                description={description}
                setDescription={setDescription}  
                submitButtonLabel='save inventory item'        
            />
        </>
    )
}

export default EditInventoryItemPage