"use client"

import React from 'react'
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useMutation } from "react-query"
import { cafeteriaConsumedItemRoute, cafeteriaMenuItemRoute, } from '@/constants/api'
import { httpPostService } from '@/services/httpPostService'
import { statusCodeIndicator } from '@/utils/statusCodeIndicator'
import PageHeader from '@/components/layout/PageHeader'
import CafeteriaMenuItemsInputs from '@/components/content/sales/cafeteria/CafeteriaMenuItemInputs'
import { useFailedPopUp } from '@/hooks/useFailedPopUp'
import { useSuccessPopUp } from '@/hooks/useSuccessPopUp'
import { httpPostFormDataService } from '@/services/httpPostFormDataService'

function AddNewMenuItemPage() {
    const [itemName,setItemName] = useState<string>("")
    const [quantity,setQuantity] = useState<string>("")
    const [type,setType] = useState<NameAndId>(null)
    const [price,setPrice] = useState<string>("")
    const [date,setDate] = useState<string>("")
    const [isLoading,setIsLoading] = useState<boolean>(false)
    const [formDataFile,setFormDataFile] = useState<FormData>()

    const failedPopUp = useFailedPopUp()
    const successPopUp = useSuccessPopUp()
    const router = useRouter()

    const {mutate} = useMutation({
        mutationFn:async () => httpPostService(cafeteriaMenuItemRoute,JSON.stringify({
            menuItemName:itemName,
            quantity,
            type:type?.name,
            price,
            date
        })),
        onSuccess:async(res) => {
            const status = statusCodeIndicator(res.status_code) === "success" 
            
            if (status) {
                successPopUp("item added successfully")
                if (res?.data?._id) {
                    
                    await handleImageUpload(res?.data?._id)
                }
                //router.push("/sales/cafeteria/menu-item")
            }else {
                failedPopUp(res.message)
            }
        },
        onError: () => failedPopUp()
    })
    const handleImageUpload = async (id:string) => {
        if (Boolean(formDataFile)) {
            await httpPostFormDataService(`${cafeteriaMenuItemRoute}/${id}`,formDataFile)   
        }
    }
    

    return (
        <>
            <PageHeader
                title={(
                    <span>
                        stables cafeteria / 
                        <span className="text-primary"> add menu item</span> 
                    </span>
                )}
                showBackButton={true}
            />
            <CafeteriaMenuItemsInputs
                handleSubmit={mutate}
                itemName={itemName}
                setItemName={setItemName}
                quantity={quantity}
                setQuantity={setQuantity}
                price={price}
                setPrice={setPrice}
                date={date}
                setDate={setDate}
                type={type}
                setType={setType}
                isLoading={isLoading}        
                formDataFile={formDataFile}
                setFormDataFile={setFormDataFile}
                submitButtonLabel='add menu item'    
            />
        </>
    )
}

export default AddNewMenuItemPage