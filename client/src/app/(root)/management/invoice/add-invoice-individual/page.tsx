"use client"

import IndInvoiceCheckoutTable from '@/components/content/managment/invoice/individual-invoice/IndInvoiceCheckoutTable'
import IndInvoicePageFooter from '@/components/content/managment/invoice/individual-invoice/IndInvoicePageFooter'
import IndInvoicePageInputs from '@/components/content/managment/invoice/individual-invoice/IndInvoicePageInputs'
import Loader from '@/components/layout/Loader'
import PageContent from '@/components/layout/PageContent'
import PageHeader from '@/components/layout/PageHeader'
import { packagesRoute } from '@/constants/api'
import { useGetClients } from '@/hooks/useGetClients'
import { useGetHorses } from '@/hooks/useGetHorses'
import { httpGetServices } from '@/services/httpGetService'
import createInvoice from '@/utils/createInvoice'
import { toNameAndId } from '@/utils/toNameAndId'
import React, { useEffect, useState } from 'react'
import { downloadPDFResume } from '../util/downloadPdf'




function AddIndividualInvoicePage() {
    const [startDate,setStartDate] = useState<string>("")
    const [endDate,setEndDate] = useState<string>("")
    const [checkoutDate,setCheckoutDate] = useState<string>("")
    const [debit,setDebit] = useState<string>("")
    const [description,setDescription] = useState<string>("")
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [client,setClient] = useState<NameAndId>(null)
    const [horse,setHorse] = useState<NameAndId>(null)
    const [discount,setDiscount] = useState<string>("")
    const [courses,setCourses] = useState<any[]|[]>([])
    const [isClientCoursesLoading,setIsClientCoursesLoading] = useState<boolean>(Boolean(client))
    

    let total:number = courses?.
    map(curr => +curr?.price)?.
    reduce((acc:any,curr:any)=> acc + curr,0)

    const handleSubmit = () => {
        if (client && horse) {
            // createInvoice({
            //     startDate,
            //     endDate,
            //     clientName:client?.name,
            //     horseName:horse?.name,
            //     checkoutDate,
            //     debit:+debit,
            //     description,
            //     discount:+discount,
            //     totalPrice:coursesTotal,
            //     courses
            // })
            const taxRate = 16

            const subtotal = total + +debit
            const taxAmount = subtotal * (taxRate / 100);
            const amountAfterTax = subtotal + taxAmount;
            const discountAmount = amountAfterTax * (+discount / 100);
            const totalAmount = amountAfterTax - discountAmount;
            const grandTotal = subtotal + taxAmount - discountAmount;

            downloadPDFResume({
                clientName:client?.name,
                discount:+discount,
                grandTotal,
                tax:taxAmount,
                courses,
                endDate,
                startDate,
                subtotal,
                totalLessons:total
            })
        }
    } 
    console.log(courses);

    useEffect(()=> {
        const fetchClientCourses = async () => {
            Boolean(client) && setIsClientCoursesLoading(true)
            const res = await httpGetServices(`${packagesRoute}/course/${client?.id}`)
            const data = res?.Courses?.data  
            if (Boolean(data)) {
                setCourses(data)
                setIsClientCoursesLoading(false)
            }
        }
        fetchClientCourses()
    },[client])

    return (
        <>
            <PageHeader
                title={(
                    <span>
                        daily entry / 
                        <span className="text-primary">add individual invoice</span>
                    </span>
                )}
                showBackButton={true}
            />
            <PageContent className='p-8 flex flex-col justify-between'>
                <Loader isLoading={isLoading}>
                    <div id='invoice' className='w-full h-full flex flex-col'>
                        <IndInvoicePageInputs
                            client={client}
                            setClient={setClient}
                            startDate={startDate}
                            setStartDate={setStartDate}
                            endDate={endDate}
                            setEndDate={setEndDate}
                        />

                        <IndInvoiceCheckoutTable  
                            horse={horse}
                            setHorse={setHorse}
                            checkoutDate={checkoutDate}
                            setCheckoutDate={setCheckoutDate}
                            debit={debit}
                            setDebit={setDebit}
                            description={description}
                            setDescription={setDescription}
                            discount={discount}
                            setDiscount={setDiscount}
                            courses={courses}
                            isClientCoursesLoading={isClientCoursesLoading}
                            coursesTotal={total}
                            
                        />
                        <IndInvoicePageFooter
                            isLoading={isLoading}
                            submitButtonFunc={handleSubmit}
                        />
                    </div>
                </Loader>
            </PageContent>
        </>
    )
}

export default AddIndividualInvoicePage