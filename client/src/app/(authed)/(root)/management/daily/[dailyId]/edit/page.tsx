"use client"
import DailyPageInputs from '@/components/content/managment/daily/DailyPageInputs'
import PageHeader from '@/components/layout/PageHeader'
import { dailyRoute } from '@/constants/api'
import { useFailedPopUp } from '@/hooks/useFailedPopUp'
import { useGetClients } from '@/hooks/useGetClients'
import { useGetHorses } from '@/hooks/useGetHorses'
import { useGetInstructors } from '@/hooks/useGetInstructors'
import { useSuccessPopUp } from '@/hooks/useSuccessPopUp'
import { httpGetServices } from '@/services/httpGetService'
import { httpPatchService } from '@/services/httpPatchService'
import { getCafeteriaPayment } from '@/utils/getCafeteriaPayment'
import { getMembershipStatus } from '@/utils/getMembershipStatus'
import { getMembershipType } from '@/utils/getMembershipType'
import { statusCodeIndicator } from '@/utils/statusCodeIndicator'
import { toNameAndId } from '@/utils/toNameAndId'
import { useParams } from 'next/navigation'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { useMutation } from 'react-query'

function EditDailyClassPage() {
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

    const [isLoading,setIsLoading] = useState<boolean>(true)
    const {dailyId} = useParams()
    const dailyIdRoute = `${dailyRoute}/${dailyId}`

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
        mutationFn:async () => httpPatchService(dailyIdRoute,JSON.stringify(body)),
        onSuccess:async(res)=> {
            const status = statusCodeIndicator(res.status_code) === "success" 
            
            if (status) {
                successPopUp("class updated successfully")
                router.push("/management/daily")
            
            }else {
                failedPopUp(res.message)
            }
        },
        onError:()=> {
            failedPopUp()
        }
    })

    useEffect(()=>{
        const fetchDailyData = async () => {
            const res = await httpGetServices(dailyIdRoute)
            const data = res.data
            if (Boolean(data)) {
                setDate(data?.courseDate)
                setTime(data?.courseTime)
                setNote(data?.note)
                setArena(data?.arena)
                console.log(data);
                
                setPrice(data?.price)
                setMembershipStatus(getMembershipStatus(data?.status))
                const client = Boolean(data?.clientId) ? ({
                    name:data?.clientId?.username,
                    id:data?.clientId?._id
                }) : null
                setClient(client)
                const instructor = Boolean(data?.instractorId) ? ({
                    name:data?.instractorId?.instractorName,
                    id:data?.instractorId?._id
                }) : null
                setInstructor(instructor)
                const horse = Boolean(data?.hourseId) ? ({
                    name:data?.hourseId?.hourseName,
                    id:data?.hourseId?._id
                }) : null
                const course = Boolean(data?.course) ? ({
                    name:data?.course?.name,
                    id:data?.course?._id
                }) : null
                setCourse(course)
                setHorse(horse)
                setMembership(getMembershipType(data?.membership))
                setPayment(getCafeteriaPayment(data?.paid))
                setIsLoading(false)
            }
        }
        fetchDailyData()
    },[])


    return (
        <>
            <PageHeader
                title={(
                    <span>
                        daily entry / 
                        <span className="text-primary">edit class</span> 
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
                submitButtonLabel="edit class"
                course={course}
                setCourse={setCourse}
                
            />
        </>
    )
}

export default EditDailyClassPage