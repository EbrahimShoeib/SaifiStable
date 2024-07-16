"use client"

import CafeteriaMenuItemsInputs from "@/components/content/sales/cafeteria/CafeteriaMenuItemInputs"
import PageHeader from "@/components/layout/PageHeader"
import { cafeteriaMenuItemRoute } from "@/constants/api"
import { useFailedPopUp } from "@/hooks/useFailedPopUp"
import { usePopUp } from "@/hooks/usePopUp"
import { useSuccessPopUp } from "@/hooks/useSuccessPopUp"
import { httpGetServices } from "@/services/httpGetService"
import { httpPatchService } from "@/services/httpPatchService"
import { httpPostFormDataService } from "@/services/httpPostFormDataService"
import { getCafeteriaItemType } from "@/utils/getCafeteriaItemType"
import { getIsoDate } from "@/utils/getIsoDate"
import { statusCodeIndicator } from "@/utils/statusCodeIndicator"
import { useParams } from "next/navigation"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { IoMdCheckmarkCircleOutline } from "react-icons/io"
import { MdErrorOutline } from "react-icons/md"
import { useMutation } from "react-query"

function MenuItemEditPage() {
    
    const {menuItemId} = useParams()
    const menuItemIdRoute = `${cafeteriaMenuItemRoute}/${menuItemId}`
    
    const [itemName,setItemName] = useState<string>("")
    const [quantity,setQuantity] = useState<string>("")
    const [type,setType] = useState<NameAndId>(null)
    const [price,setPrice] = useState<string>("")
    const [date,setDate] = useState<string>("")
    const [isLoading,setIsLoading] = useState<boolean>(true)
    const [formDataFile,setFormDataFile] = useState<FormData>()

    const failedPopUp = useFailedPopUp()
    const successPopUp = useSuccessPopUp()
    const router = useRouter()

    useEffect(() => {
        const fetchMenuItem = async () => {
            const {data} = await httpGetServices(menuItemIdRoute)
            console.log(data);

            if (Boolean(data)) {
                setItemName(data.menuItemName)
                setType(getCafeteriaItemType(data.type))
                
                data.date && setDate(getIsoDate(data.date))
                setPrice(data.price)
                setQuantity(data.quantity)
                setIsLoading(false)
            }
            
        }
        fetchMenuItem()
    },[])

    const {mutate} = useMutation({
        mutationFn:async () => httpPatchService(menuItemIdRoute,JSON.stringify({
            menuItemName:itemName,
            quantity,
            type:type?.name,
            price,
            date
        })),
        onSuccess:async(res) => {
            const status = statusCodeIndicator(res.status_code) === "success" 
            
            if (status) {
                successPopUp("item updated successfully")
                if (res?.data?._id) {
                    
                    await handleImageUpload(res?.data?._id)
                }
                router.push("/sales/cafeteria/menu-item")
            }else {
                failedPopUp(res.message)
            }
        },
        onError: () => failedPopUp()
    })
    const handleImageUpload = async (id:string) => {
        if (Boolean(formDataFile)) {
            await httpPostFormDataService(`${cafeteriaMenuItemRoute}/upload-image/${id}`,formDataFile)   
        }
    }
    return (
        <>
            <PageHeader
                title={(
                    <span>
                        stables cafeteria / 
                        <span className="text-primary"> edit menu item</span> 
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
                formDataFile={formDataFile}
                setFormDataFile={setFormDataFile}
                isLoading={isLoading}        
                submitButtonLabel='save menu item'    
            />
        </>
    )
}

export default MenuItemEditPage