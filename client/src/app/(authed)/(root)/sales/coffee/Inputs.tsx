'use client'
import PageContent from '@/components/layout/PageContent'
import SearchBox from '@/components/shared/all/SearchBox'
import ResourcesDropList from '@/components/shared/resources/ResourcesDropList'
import ResourcesInput from '@/components/shared/resources/ResourcesInput'
import { cafeteriaMenuItemRoute, clientsRoute } from '@/constants/api'
import { cafeteriaPayments } from '@/constants/cafeteriaPayments'
import { toNameAndId } from '@/utils/toNameAndId'
import React, { useState } from 'react'


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

    return (
        <PageContent>
            <div className='max-w-[600px] flex flex-col gap-10 my-16 mx-8'>

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
                <ResourcesInput
                    value={price} 
                    setValue={setPrice}
                    placeholder="price"
                    label='price'
                    type='number'
                />      
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
            <div className='w-full flex justify-center'>
                <button
                    onClick={handleSubmit} 
                    disabled={isLoading} 
                    className='w-[350px] text-primary duration-300 hover:bg-primary hover:text-smokey-white font-semibold text-2xl capitalize rounded-2xl h-[60px] border border-primary'>
                    {submitButtonLabel}
                </button>
            </div>
        </PageContent>
    )
}

export default Inputs