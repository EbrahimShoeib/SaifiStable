"use client"
import InventoryItemInputs from '@/components/content/sales/inventory/InventoryItemInputs'
import PageHeader from '@/components/layout/PageHeader'
import { inventoryItemsRoute } from '@/constants/api'
import { useFailedPopUp } from '@/hooks/useFailedPopUp'
import { usePopUp } from '@/hooks/usePopUp'
import { useSuccessPopUp } from '@/hooks/useSuccessPopUp'
import { httpPostService } from '@/services/httpPostService'
import { statusCodeIndicator } from '@/utils/statusCodeIndicator'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { IoMdCheckmarkCircleOutline } from 'react-icons/io'
import { MdErrorOutline } from 'react-icons/md'
import { useMutation } from 'react-query'

function AddNewInventoryItemPage() {
    const [itemName,setItemName] = useState<string>("")
    const [quantity,setQuantity] = useState<string>("")
    const [type,setType] = useState<NameAndId>(null)
    const [price,setPrice] = useState<string>("")
    //const [date,setDate] = useState<string>("no-date")
    const [description,setDescription] = useState<string>("")
    const [measure,setMeasure] = useState<NameAndId>(null)

    const [isLoading,setIsLoading] = useState<boolean>(false)

    const failedPopUp = useFailedPopUp()
    const successPopUp = useSuccessPopUp()
    const router = useRouter()

    const {mutate} = useMutation({
        mutationFn:async () => httpPostService(inventoryItemsRoute,JSON.stringify({
            itemName,
            quantity,
            type:type?.name,
            price,
            date:"no-date",
            measure:measure?.name,
            itemDescription:description
        })),
        onSuccess:(res) => {
            const status = statusCodeIndicator(res.status_code) === "success" 
            
            if (status) {
                successPopUp("item added successfully")
                router.push("/sales/inventory/inventory-item")
            }else {
                failedPopUp(res.message)
            }
        },
        onError: () => failedPopUp()
    })

    return (
        <>
            <PageHeader
                title={(
                    <span>
                        stables inventory /
                        <span className='text-primary'>add new item</span>
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
                submitButtonLabel='add inventory item'        
            />
        </>
    )
}

export default AddNewInventoryItemPage