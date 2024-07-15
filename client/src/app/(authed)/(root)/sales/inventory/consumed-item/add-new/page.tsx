"use client"

import InventoryConsumedInputs from '@/components/content/sales/inventory/InventoryConsumedInputs'
import PageHeader from '@/components/layout/PageHeader'
import { inventoryConsumedItemsRoute } from '@/constants/api'
import { useFailedPopUp } from '@/hooks/useFailedPopUp'
import { useGetHorses } from '@/hooks/useGetHorses'
import { usePopUp } from '@/hooks/usePopUp'
import { useSuccessPopUp } from '@/hooks/useSuccessPopUp'
import { httpPostService } from '@/services/httpPostService'
import { statusCodeIndicator } from '@/utils/statusCodeIndicator'
import { toNameAndId } from '@/utils/toNameAndId'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { IoMdCheckmarkCircleOutline } from 'react-icons/io'
import { MdErrorOutline } from 'react-icons/md'
import { useMutation } from 'react-query'

function AddNewConsumedItemPage() {
    const [itemName,setItemName] = useState<string>("")
    const [quantity,setQuantity] = useState<string>("")
    const [price,setPrice] = useState<string>("")
    //const [date,setDate] = useState<string>("no-date")
    const [measure,setMeasure] = useState<string>("")
    const [horse,setHorse] = useState<NameAndId>(null)

    const [isLoading,setIsLoading] = useState<boolean>(false)

    const failedPopUp = useFailedPopUp()
    const successPopUp = useSuccessPopUp()
    const router = useRouter()

    const {mutate} = useMutation({
        mutationFn:async () => httpPostService(inventoryConsumedItemsRoute,JSON.stringify({
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
                successPopUp("item added successfully")
                router.push("/sales/inventory/consumed-item")
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
                submitButtonLabel='add inventory item'     
            />
        </>
    )
}

export default AddNewConsumedItemPage