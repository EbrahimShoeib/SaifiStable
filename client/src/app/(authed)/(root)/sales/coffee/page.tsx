"use client"

import PageHeader from "@/components/layout/PageHeader"
import { cafeteriaConsumedItemRoute } from "@/constants/api"
import { useFailedPopUp } from "@/hooks/useFailedPopUp"
import { useSuccessPopUp } from "@/hooks/useSuccessPopUp"
import { httpPostService } from "@/services/httpPostService"
import { statusCodeIndicator } from "@/utils/statusCodeIndicator"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { useMutation } from "react-query"
import Inputs from "./Inputs"

function CoffeeControls() {

    const router = useRouter()
    useEffect(()=>{
        if(!localStorage.getItem("coffee_token"))
            router.push("/coffee")
    },[])
    const [itemName,setItemName] = useState<NameAndId>(null)
    const [quantity,setQuantity] = useState<string>("")
    const [price,setPrice] = useState<string>("")
    const [payment,setPayment] = useState<NameAndId>(null)
    const [client,setClient] = useState<NameAndId>(null)
    const [amount,setAmount] = useState<string>("")
    const [date,setDate] = useState<string>("")
    const [isLoading,setIsLoading] = useState<boolean>(false)

    const failedPopUp = useFailedPopUp()
    const successPopUp = useSuccessPopUp()

    const {mutate} = useMutation({
        mutationFn:async () => httpPostService(cafeteriaConsumedItemRoute,JSON.stringify({
            consumedItemName:itemName?.name,
            consumedQuantity:quantity,
            consumedPrice:price,
            date,
            type:"no-type",
            clientId:client?.id,
            consumedPayment:payment?.name,
            amount
        })),
        onSuccess:(res) => {
            const status = statusCodeIndicator(res.status_code) === "success" 
            
            if (status) {
                successPopUp("item added successfully")
                router.push("/sales/cafeteria/consumed-item")
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
                        stables coffee / 
                        <span className="text-primary"> add coffee</span> 
                    </span>
                )}
                showBackButton={true}
            />
            <Inputs
                handleSubmit={mutate}
                itemName={itemName}
                setItemName={setItemName}
                quantity={quantity}
                setQuantity={setQuantity}
                price={price}
                setPrice={setPrice}
                date={date}
                setDate={setDate}
                isLoading={isLoading}
                client={client}
                setClient={setClient}
                payment={payment}
                amount={amount}
                setAmount={setAmount}
                setPayment={setPayment}     
                submitButtonLabel="submit"
            />
        </>
    )
}

export default CoffeeControls