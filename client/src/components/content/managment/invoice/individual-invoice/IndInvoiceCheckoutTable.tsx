'use client'
import Loader from '@/components/layout/Loader'
import DropDownList from '@/components/shared/all/DropDownList'
import Input from '@/components/shared/all/Input'
import SearchBox from '@/components/shared/all/SearchBox'
import { horsesRoute } from '@/constants/api'
import { getPercentAmt } from '@/utils/getPercentageAmt'
import { toNameAndId } from '@/utils/toNameAndId'
import React, { useState } from 'react'


type IndInvoiceCheckoutTableProps = {
    horse:NameAndId,
    setHorse:(newHorse:NameAndId)=>void,
    checkoutDate:string,
    setCheckoutDate:(newDate:string)=>void,
    debit:string,
    setDebit:(newPrice:string)=>void,
    description:string,
    setDescription:(newDescription:string)=>void,
    courses:any[],
    discount:string,
    setDiscount:(newState:string)=> void,
    isClientCoursesLoading:boolean,
    coursesTotal:number
}
function IndInvoiceCheckoutTable({
    horse,
    setHorse,
    checkoutDate,
    debit,
    description,
    setCheckoutDate,
    setDebit,
    setDescription,
    courses,
    discount,
    setDiscount,
    isClientCoursesLoading,
    coursesTotal
}:IndInvoiceCheckoutTableProps) {
    const [horsesRes,setHorsesRes] = useState<any>()
    
    const taxRate = 16

    const subtotal = coursesTotal + +debit
    const taxAmount = subtotal * (taxRate / 100);
    const amountAfterTax = subtotal + taxAmount;
    const discountAmount = amountAfterTax * (+discount / 100);
    const totalAmount = amountAfterTax - discountAmount;

    const cells = [
        {
            title:"lessons",
            value:courses?.length
        },
        {
            title:"discount (%)",
            value:<Input
                    type='number'
                    value={discount}
                    setValue={setDiscount}
                    className='input w-[60px] !border-0 p-1 h-[20px] bg-smokey-white'
                />
        },
        {
            title:"Sub-Total",
            value:subtotal.toFixed(2)
        },
        {
            title:"tax 16(%)",
            value:taxAmount.toFixed(2),
        },
        {
            title:"Total",
            value:totalAmount.toFixed(2)
        }
    ]

    return (
        <div className='w-full flex flex-1 flex-col justify-between'>
            <div>
                <div className='h-[50px] px-2 grid items-center grid-cols-[repeat(4,1fr)] rounded-full bg-dark-grey'>
                    {
                        [
                            "date",
                            "description",
                            "horse name",
                            "debit"
                        ].map((cell:string,idx:number)=> (
                            <p className='text-lg pl-5 text-smokey-white' key={idx}>
                                {cell}
                            </p>
                        ))
                    }
                </div>
                <div className='grid items-center grid-cols-[repeat(4,1fr)] gap-5 border-b py-5 border-dark-grey border-opacity-40 '>
                    <Input
                        type='date'
                        setValue={setCheckoutDate}
                        value={checkoutDate}
                        className='input w-[170px]'
                        placeholder='date'
                    />
                    <Input
                        type='text'
                        setValue={setDescription}
                        value={description}
                        className='input w-[170px]'
                        placeholder='description'
                    />
                    <div className='w-[170px]'>
                        <SearchBox
                            listValue={horse}
                            searchUrl={horsesRoute}
                            setListValue={setHorse}
                            options={toNameAndId(horsesRes?.data?.hourse,'hourseName','_id')}
                            setResponse={setHorsesRes}
                            placeholder='search for horse'
                        />
                    </div>
                    <Input
                        type='number'
                        setValue={setDebit}
                        value={debit}
                        className='input w-[170px]'
                        placeholder='debit'
                    />
                </div>

            </div>
            <div className='h-[150px] bg-light-grey bg-opacity-30 rounded-2xl'>
                <Loader isLoading={isClientCoursesLoading}>
                    <div className='items-center p-7 grid grid-cols-[repeat(5,1fr)]'>
                        {
                            cells.map((cell:any,idx:number)=> (
                                <div key={idx} className='flex w-full h-[70px] gap-6 flex-col items-center'>
                                    <p>{cell.title}</p>
                                    <div>{cell.value}</div>
                                </div>
                            )) 
                        }
                    </div>
                </Loader>
            </div>
        </div>
    )
}

export default IndInvoiceCheckoutTable
