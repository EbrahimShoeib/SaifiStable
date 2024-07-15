"use client"

import InvoicePageInputs from '@/components/content/managment/invoice/InvoicePageInputs'
import PageHeader from '@/components/layout/PageHeader'
import { invoiceRoute } from '@/constants/api'
import { useFailedPopUp } from '@/hooks/useFailedPopUp'
import { useGetClients } from '@/hooks/useGetClients'
import { useSuccessPopUp } from '@/hooks/useSuccessPopUp'
import { httpPostService } from '@/services/httpPostService'
import { statusCodeIndicator } from '@/utils/statusCodeIndicator'
import { toNameAndId } from '@/utils/toNameAndId'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { useMutation } from 'react-query'

function AddInvoicePage() {
  
    const [invoiceType,setInvoiceType] = useState<string>("")
    const [invoiceId,setInvoiceId] = useState<string>("")
    const [client,setClient] = useState<NameAndId>(null)
    const [clientType,setClientType] = useState<NameAndId>(null)
    const [totalAmount,setTotalAmount] = useState<string>("")
    const [date,setDate] = useState<string>("")
    const [membershipStatus,setMembershipStatus] = useState<NameAndId>(null)

    const [isLoading,setIsLoading] = useState<boolean>(false)

    const body = {
        invoiceType,
        totalAmount,
        invoiceDate:date,
        status:membershipStatus?.name,
        clientType:clientType?.name,
        clientId:client?.id
    }


    const successPopUp = useSuccessPopUp()
    const failedPopUp = useFailedPopUp()
    const router = useRouter()


    const {mutate} = useMutation({
        mutationFn:async () => httpPostService(invoiceRoute,JSON.stringify(body)),
        onSuccess:async(res)=> {
            const status = statusCodeIndicator(res.status_code) === "success" 
            console.log(res);
            
            if (status) {
                successPopUp("invoice added successfully")
                router.push("/management/invoice")
            
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
                        <span className="text-primary">add invoice</span>
                    </span>
                )}
                showBackButton={true}
            />
            <InvoicePageInputs
                isLoading={isLoading}
                client={client}
                setClient={setClient}
                clientType={clientType}
                setClientType={setClientType}
                totalAmount={totalAmount}
                setTotalAmount={setTotalAmount}
                date={date}
                setDate={setDate}
                membershipStatus={membershipStatus}
                setMembershipStatus={setMembershipStatus}
                invoiceId={invoiceId}
                onSubmit={mutate}
                setInvoiceId={setInvoiceId}
                submitButtonLabel='add invoice'
                invoiceType={invoiceType}
                setInvoiceType={setInvoiceType}
            />
        </>
    )
}

export default AddInvoicePage