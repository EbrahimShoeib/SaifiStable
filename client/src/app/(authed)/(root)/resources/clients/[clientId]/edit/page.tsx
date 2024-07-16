"use client"
import { clientImageUploadRoute, clientsRoute } from '@/constants/api';
import { httpGetServices } from '@/services/httpGetService';
import { getGender } from '@/utils/getGender';
import { useParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react'
import { getMembershipStatus } from '@/utils/getMembershipStatus';
import { httpPatchService } from '@/services/httpPatchService';
import { getMembershipType } from '@/utils/getMembershipType';
import { statusCodeIndicator } from '@/utils/statusCodeIndicator';
import { usePopUp } from '@/hooks/usePopUp';
import { useMutation } from 'react-query';
import { MdErrorOutline } from 'react-icons/md';
import { IoMdCheckmarkCircleOutline } from 'react-icons/io';
import { useRouter } from 'next/navigation';
import PageHeader from '@/components/layout/PageHeader';
import { httpPostFormDataService } from '@/services/httpPostFormDataService';
import ClientPageInputs from '@/components/content/resources/clients/ClientPageInputs';
import { useFailedPopUp } from '@/hooks/useFailedPopUp';
import { useSuccessPopUp } from '@/hooks/useSuccessPopUp';

function ClientEditPage() {

    const [name,setName] = useState<string>('')
    const [email,setEmail] = useState<string>('')
    const [phone,setPhone] = useState<string>('')
    const [age,setAge] = useState<string>('')
    const [gender,setGender] = useState<NameAndId>(null)
    const [membershipStatus,setMembershipStatus] = useState<NameAndId>(null)
    const [membershipType,setMembershipType] = useState<NameAndId>(null)
    const [formDataFile,setFormDataFile] = useState<FormData>()
    const [horse,setHorse] = useState<NameAndId>(null)

    const [isLoading,setIsLoading] = useState<boolean>(true)


    const {clientId} = useParams()
    const clientRoute = `${clientsRoute}/${clientId}`
    const failedPopUp = useFailedPopUp()
    const successPopUp = useSuccessPopUp()

    const router = useRouter()
    useEffect(()=>{
        const fetchClient = async() => {
            const {data} = await httpGetServices(clientRoute)
            if (data) {
                const {username,email,phone,age,gender,membershipStatus,membershipType} = data
                setName(username)
                setEmail(email)
                setPhone(phone)
                setAge(age)
                setGender(getGender(gender))
                setMembershipStatus(getMembershipStatus(membershipStatus))
                setMembershipType(getMembershipType(membershipType))
                setIsLoading(false)
                const horse = data.hourseId ? {
                    id:data.hourseId._id,
                    name:data.hourseId.hourseName
                }: null
                setHorse(horse)
            }
        }
        fetchClient()
    },[])
  
    const {mutate} = useMutation({
        mutationFn:async () => httpPatchService(clientRoute,JSON.stringify(
            {
                username:name,
                email,
                phone,
                age,
                hourseId:horse?.id,
                gender:gender?.name,
                membershipStatus:membershipStatus?.name||null,
                membershipType:membershipType?.name||null
            }
        )),
        mutationKey:["updateClient"],
        onSuccess:async(res)=> {
            const status = statusCodeIndicator(res.status_code) === "success" 
            
            if (status) {
                successPopUp("client updated successfully")
                if (Boolean(res?.data?._id)) {
                    await handleImageUpload(res?.data?._id)
                }
                router.push("/resources/clients")
            }else {
                failedPopUp(res.message)
            }
        },
        onError:()=> {
            failedPopUp()
        }
    })

    const handleImageUpload = async (clientId:string) => {
        if (Boolean(formDataFile)) {
            await httpPostFormDataService(`${clientImageUploadRoute}/${clientId}`,formDataFile)   
        }
    }
    return (
        <Suspense>
            <PageHeader
                title={(
                    <span>
                        stables clients /
                        <span className='text-primary'>edit client</span>
                    </span>
                )}
                showBackButton={true}
            />
            <ClientPageInputs
                isLoading={isLoading}
                handleSubmit={mutate}
                name={name}
                setName={setName}
                email={email}
                setEmail={setEmail}
                phone={phone}
                setPhone={setPhone}
                age={age}
                setAge={setAge}
                gender={gender}
                setGender={setGender}
                membershipStatus={membershipStatus}
                setMembershipStatus={setMembershipStatus}
                membershipType={membershipType}
                setMembershipType={setMembershipType}
                formDataFile={formDataFile}
                horse={horse}
                setHorse={setHorse}
                setFormDataFile={setFormDataFile}
                submitButtonLabel="save client data"
            />
        </Suspense>
    )
}

export default ClientEditPage