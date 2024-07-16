"use client"

import DailyPageInputs from "@/components/content/managment/daily/DailyPageInputs"
import PageHeader from "@/components/layout/PageHeader"
import { dailyRoute } from "@/constants/api"
import { useFailedPopUp } from "@/hooks/useFailedPopUp"
import { useGetClients } from "@/hooks/useGetClients"
import { useGetHorses } from "@/hooks/useGetHorses"
import { useGetInstructors } from "@/hooks/useGetInstructors"
import { useSuccessPopUp } from "@/hooks/useSuccessPopUp"
import { httpPostService } from "@/services/httpPostService"
import { statusCodeIndicator } from "@/utils/statusCodeIndicator"
import { toNameAndId } from "@/utils/toNameAndId"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useMutation } from "react-query"

function DailyAddClassPage() {

    const [date,setDate] = useState<string>('')
    const [time,setTime] = useState<string>('')
    const [note,setNote] = useState<string>('')
    const [arena,setArena] = useState<string>('')
    const [price,setPrice] = useState<string>('')
    const [membershipStatus,setMembershipStatus] = useState<NameAndId>(null)
    const [client,setClient] = useState<NameAndId>(null)
    const [instructor,setInstructor] = useState<NameAndId>(null)
    const [horse,setHorse] = useState<NameAndId>(null)
    const [membership,setMembership] = useState<NameAndId>(null)
    const [payment,setPayment] = useState<NameAndId>(null)
    const [course,setCourse] = useState<NameAndId>(null)

    const [isLoading,setIsLoading] = useState<boolean>(false)

    const body = {
        courseDate:date,
        courseTime:time,
        note,
        arena,
        price,
        status:membershipStatus?.name,
        clientId:client?.id,
        instractorId:instructor?.id,
        hourseId:horse?.id,
        membership:membership?.name,
        paid:payment?.name,
        course:course?.id,
    }
    
   

 

    const failedPopUp = useFailedPopUp()
    const successPopUp = useSuccessPopUp()
    const router = useRouter()

    
    const {mutate} = useMutation({
        mutationFn:async () => httpPostService(dailyRoute,JSON.stringify(body)),
        onSuccess:async(res)=> {
            const status = statusCodeIndicator(res.status_code) === "success" 
            console.log(res);
            
            if (status) {
                successPopUp("class added successfully")
                router.push("/management/daily")
            
            }else {
                failedPopUp(res.message)
            }
        },
        onError:()=> {
            failedPopUp()
        }
    })

    return (
        <>
            <PageHeader
                title={(
                    <span>
                        daily entry / 
                        <span className="text-primary">add class</span> 
                    </span>
                )}
                showBackButton={true}
            />
            <DailyPageInputs
                isLoading={isLoading}
                date={date}
                setDate={setDate}
                time={time}
                setTime={setTime}
                note={note}
                setNote={setNote}
                arena={arena}
                setArena={setArena}
                membershipStatus={membershipStatus}
                setMembershipStatus={setMembershipStatus}
                client={client}
                setClient={setClient}
                instructor={instructor}
                setInstructor={setInstructor}
                membership={membership}
                setMembership={setMembership}
                payment={payment}
                setPayment={setPayment}
                horse={horse}
                setHorse={setHorse}
                onSubmit={mutate}
                price={price}
                setPrice={setPrice}
                submitButtonLabel="add class"
                course={course}
                setCourse={setCourse}
            />
        </>
    )
}

export default DailyAddClassPage