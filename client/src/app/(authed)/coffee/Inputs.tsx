'use client'
import PageContent from '@/components/layout/PageContent'
import SearchBox from '@/components/shared/all/SearchBox'
import ResourcesDropList from '@/components/shared/resources/ResourcesDropList'
import ResourcesInput from '@/components/shared/resources/ResourcesInput'
import { cafeteriaMenuItemRoute, clientsRoute } from '@/constants/api'
import { cafeteriaPayments } from '@/constants/cafeteriaPayments'
import { toNameAndId } from '@/utils/toNameAndId'
import React, { useEffect, useState } from 'react'


type InputsProps = {
    handleSubmit: () => void,
    itemName:NameAndId,
    setItemName: (newState: NameAndId) => void,
    quantity:string,
    setQuantity: (newState: string) => void,
    price:string,
    setPrice: (newState: string) => void,
    date:string,
    setDate: (newState:string) => void,
    isLoading:boolean,
    client:NameAndId,
    setClient:(newState:NameAndId) => void,
    payment:NameAndId,
    setPayment:(newState:NameAndId) => void,
    submitButtonLabel:string,
    amount:string,
    setAmount:(newState:string)=> void
}

function Inputs({
    handleSubmit,
    itemName,
    setItemName,
    quantity,
    setQuantity,
    price,
    setPrice,
    date,
    setDate,
    isLoading,
    client,
    setClient,
    setPayment,
    payment,
    submitButtonLabel,
    amount,
    setAmount

}:InputsProps) {

    const [clientsRes,setClientsRes] = useState<any>()
    const [menuItemsRes,setMenuItemsRes] = useState<any>()

    useEffect(()=>{
        const item = menuItemsRes?.caveteriaItems?.data?.find((ele:any) => ele._id === itemName?.id)
        if (item && item?.price)
            setPrice(`${item.price}`)
    },[itemName])

    return (
        <>
            <div className='w-full bg-smokey-white rounded-2xl'>

                <div className="px-10 py-5">
                    <p className='text-xl font-semibold text-primary'>cafe</p>
                </div>

                <span className='w-full block h-[2px] bg-dark-grey/55'/>

                <div className='w-full grid gap-x-8 p-10 gap-y-4 grid-cols-[repeat(auto-fit,minmax(300px,1fr))]'>

                    <SearchBox
                        label={'item name'}
                        options={toNameAndId(menuItemsRes?.caveteriaItems.data,'menuItemName',"_id")}
                        searchUrl={cafeteriaMenuItemRoute}
                        setResponse={setMenuItemsRes}
                        listValue={itemName}
                        placeholder='select item name'
                        setListValue={setItemName}
                    />
                    <ResourcesInput
                        value={quantity} 
                        setValue={setQuantity}
                        placeholder="Quantity"
                        label='quantity'
                        type='number'
                    />
                    <div className='flex w-full gap-5 items-center justify-between'>
                        <div className='w-[150px] text-md font-semibold flex justify-between items-center'>
                            <span>price</span>
                            <span>:</span>
                        </div>
                        <div className='flex-1 ml-3 font-semibold text-sm'>{price} JOD</div>
                    </div>
                    <ResourcesInput
                        value={date} 
                        setValue={setDate}
                        placeholder="date"
                        label='date'
                        type="datetime-local"
                    />
                    <ResourcesInput
                        value={amount} 
                        setValue={setAmount}
                        placeholder="amount"
                        label='amount'
                        type="number"
                    />  

                    <ResourcesDropList
                        listValue={payment}
                        setListValue={setPayment}
                        options={cafeteriaPayments}
                        placeholder='Select Payment'
                        label='payment'
                    />
                    <SearchBox
                        label={'select client'}
                        options={toNameAndId(clientsRes?.data?.client,'username',"_id")}
                        searchUrl={clientsRoute}
                        setResponse={setClientsRes}
                        listValue={client}
                        placeholder='select client'
                        setListValue={setClient}
                    />
                </div>
                
            </div>
            <div className='w-full flex justify-end'>
                <button
                    onClick={handleSubmit} 
                    disabled={isLoading} 
                    className=' bg-[rgb(185_132_28)] text-sm capitalize rounded-md mt-5 p-2 px-8 text-smokey-white'>
                    submit order
                </button>
            </div>
        </>
    )
}

export default Inputs