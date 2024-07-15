"use client"

import CafeteriaConsumedInputs from "@/components/content/sales/cafeteria/CafeteriaConsumedInputs"
import PageHeader from "@/components/layout/PageHeader"
import { cafeteriaConsumedItemRoute } from "@/constants/api"
import { useFailedPopUp } from "@/hooks/useFailedPopUp"
import { useSuccessPopUp } from "@/hooks/useSuccessPopUp"
import { httpGetServices } from "@/services/httpGetService"
import { httpPatchService } from "@/services/httpPatchService"
import { getCafeteriaPayment } from "@/utils/getCafeteriaPayment"
import { getIsoDate } from "@/utils/getIsoDate"
import { statusCodeIndicator } from "@/utils/statusCodeIndicator"
import { useParams } from "next/navigation"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { useMutation } from "react-query"

function EditConsumedItemPage() {

    const [itemName,setItemName] = useState<string>("")
    const [quantity,setQuantity] = useState<string>("")
    const [price,setPrice] = useState<string>("")
    const [payment,setPayment] = useState<NameAndId>(null)
    const [amount,setAmount] = useState<string>('')
    const [client,setClient] = useState<NameAndId>(null)
    const [date,setDate] = useState<string>("")
    const [isLoading,setIsLoading] = useState<boolean>(true)

    const failedPopUp = useFailedPopUp()
    const successPopUp = useSuccessPopUp()
    const router = useRouter()
    const {consumedItemId} = useParams()
    const consumedItemIdRoute = `${cafeteriaConsumedItemRoute}/${consumedItemId}`

    useEffect(() => {
        const fetchConsumedItem = async () => {
            const res = await httpGetServices(consumedItemIdRoute)
            if (Boolean(res.data)) {
                const itemData = res.data
                setItemName(itemData.consumedItemName)
                setQuantity(itemData.consumedQuantity)
                setPayment(getCafeteriaPayment(itemData.consumedPayment))
                
                itemData.date&&setDate(getIsoDate(itemData.date))
                setPrice(itemData.consumedPrice)
                const client = Boolean(itemData.clientId) ? ({
                    name:itemData.clientId.username,
                    id:itemData.clientId._id
                }) : null      
                setClient(client)
                setIsLoading(false)
                setAmount(itemData.amount ?itemData.amount:'')
            }
            
        }
        fetchConsumedItem()
    },[])


    const {mutate} = useMutation({
        mutationFn:async () => httpPatchService(consumedItemIdRoute,JSON.stringify({
            consumedItemName:itemName,
            consumedQuantity:quantity,
            type:"no-type",
            consumedPrice:price,
            date,
            amount,
            clientId:client?.id,
            consumedPayment:payment?.name
        })),
        onSuccess:(res) => {
            const status = statusCodeIndicator(res.status_code) === "success" 
            
            if (status) {
                successPopUp("item updated successfully")
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
                        stables cafeteria / 
                        <span className="text-primary">edit consumed item</span> 
                    </span>
                )}
                showBackButton={true}
            />
            <CafeteriaConsumedInputs
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
                amount={amount}
                setAmount={setAmount}
                setClient={setClient}
                payment={payment}
                setPayment={setPayment}     
                submitButtonLabel="save consumed item"
            />
        </>
    )
}

export default EditConsumedItemPage