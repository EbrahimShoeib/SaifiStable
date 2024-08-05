"use client"

import { authRoute, BASE_URL, cafeteriaConsumedItemRoute, getAdminRoute } from "@/constants/api"
import { useFailedPopUp } from "@/hooks/useFailedPopUp"
import { useSuccessPopUp } from "@/hooks/useSuccessPopUp"
import { httpPostService } from "@/services/httpPostService"
import { statusCodeIndicator } from "@/utils/statusCodeIndicator"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { useMutation, useQuery } from "react-query"
import Inputs from "./Inputs"
import { httpGetServices } from "@/services/httpGetService"
import { GiCoffeeCup } from "react-icons/gi"
import { useLogout } from "@/hooks/useLogout"
import { BiSolidDoorOpen } from "react-icons/bi"
import { AuthProviderData, useAuthProvider } from "@/context/AuthContext"

function CoffeeControls() {

    const auth:AuthProviderData = useAuthProvider()
    const router = useRouter()
   
    const [itemName,setItemName] = useState<NameAndId>(null)
    const [quantity,setQuantity] = useState<string>("")
    const [price,setPrice] = useState<string>("0")
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
            }else {
                failedPopUp(res.message)
            }
        },
        onError: () => failedPopUp()
    })
    const adminToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2MzY0OTg1N2FhN2VmNDE4YjdlZTI0YiIsImlzQWRtaW4iOnRydWUsImlhdCI6MTcxNDg0NTUzN30.GNHI4Fg58_Sgusc90y91JMFdFHDF_th2iM2ZSLVUf8g'

    const {data:res,isLoading:isUserLoading,refetch} = useQuery({
        queryFn:async()=> {
            const res = fetch(`${BASE_URL}${authRoute}/get-user/${auth?.decodedUser?.id}`,{
                headers:{
                    token:adminToken
                }
            })
            return (await res).json()
        },
        queryKey:['get','admin']
    })
    useEffect(()=>{refetch()},[auth])
    const logout = useLogout()




    const today = new Date();
    const year = today.getFullYear();
    const month = +String(today.getMonth() + 1).padStart(2, '0'); +1
    const day = +String(today.getDate()).padStart(2, '0');
    
    return (

        <>

            <main className="w-full h-full px-20 ">
                <div className="w-full flex items-center justify-between h-[80px]">
                    <h3 
                        style={{WebkitTextStroke:"var(--smokey-white) .25px"}} 
                        className="text-smokey-white w-fit tracking-wider text-xl">
                        Cafeteria
                    </h3>
                    <div className="flex items-center gap-5">
                        <button onClick={logout} className='border-primary gap-3 w-[200px] capitalize duration-300 hover:bg-primary hover:text-smokey-white py-1 border-solid border flex justify-center items-center rounded-2xl text-primary font-semibold'>
                            <BiSolidDoorOpen  className="text-xl"/>
                            <span>log out</span>
                        </button>
                        <div className="h-[35px] aspect-square bg-zinc-300 rounded-full"></div>   
                    </div>
                </div>
                <div className="w-full h-[200px] overflow-hidden flex items-center justify-between mb-10  rounded-2xl bg-smokey-white">
                    <div className="p-10 flex items-center gap-20">
                        <div className="h-full flex flex-col items-center justify-center gap-2">
                            <div className="w-[85px] flex justify-center items-center border-2 border-primary aspect-square rounded-full">
                                <GiCoffeeCup className="text-5xl text-dark-grey"/>
                            </div>
                        <p className="capitalize text-dark-grey font-extrabold">{(res?.data&&res?.data[' fullName'])||"no-user"}</p>
                            <p className="text-primary text-sm">Employee</p>
                        </div>

                        <div className="flex text-dark-grey/70 font-semibold justify-center flex-col gap-3">
                            <p>Email : {res?.data?.email||"no-email"}</p>
                            <p>Date : {`${year}/${month}/${day}`}</p>
                        </div>  
                    </div>
                    <img className="aspect-square h-[260px]" src='/svgs/logo.svg' alt="" />
                </div>
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
                    submitButtonLabel="add consumed item"
                />
            </main>
        </>
    )
}

export default CoffeeControls
