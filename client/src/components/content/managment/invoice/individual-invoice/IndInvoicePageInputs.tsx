'use client'
import DropDownList from '@/components/shared/all/DropDownList'
import Input from '@/components/shared/all/Input'
import SearchBox from '@/components/shared/all/SearchBox'
import { clientsRoute } from '@/constants/api'
import { toNameAndId } from '@/utils/toNameAndId'
import React, { useState } from 'react'

type IndInvoicePageInputsProps = { 
    client: NameAndId,
    setClient: (newState: NameAndId) => void,
    setStartDate: (newState: string) => void,
    startDate: string,
    endDate: string,
    setEndDate: (newState: string) => void,
}
function IndInvoicePageInputs({
    
    client,
    setClient,
    setStartDate,
    startDate,
    endDate,
    setEndDate
}:IndInvoicePageInputsProps) {

    const [clientsRes,setClientsRes] = useState<any>()

    return (
        <div className='w-full h-[100px] items-center flex'>
            <img src="/svgs/logo.svg" className='h-full block aspect-square' alt="logo" />
            <div className='flex-1 flex justify-between ml-5 h-[30px]'>


                <div className='w-[200px] '>
                    {/* <DropDownList
                        options={clients}
                        setListValue={setClient}
                        listValue={client}
                        placeholder='client name'
                        placeholderClassName='w-full font-semibold h-full rounded-lg text-dark-grey p-4 border border-dark-grey border-opacity-40'
                    /> */}
                    <SearchBox
                        listValue={client}
                        searchUrl={clientsRoute}
                        setListValue={setClient}
                        options={toNameAndId(clientsRes?.data?.client,'username','_id')}
                        setResponse={setClientsRes}
                        placeholder='search for client'
                    />
                </div>

                <div className='w-fit gap-5 flex'>
                    <div className='flex items-center gap-1'>
                        <p className=' text-dark-grey text-sm font-semibold'>start date</p>
                        <Input
                            setValue={setStartDate}
                            value={startDate}
                            type='date'
                            className='w-[150px] text-sm h-[30px] rounded-lg text-dark-grey p-4 border border-solid border-dark-grey border-opacity-40'
                        />
                    </div>

                    <div className='flex items-center gap-1'>
                        <p className=' text-dark-grey text-sm font-semibold'>end date</p>
                        <Input 
                            setValue={setEndDate}
                            value={endDate}
                            type='date'
                            className='w-[150px] text-sm h-[30px] rounded-lg text-dark-grey p-4 border border-solid border-dark-grey border-opacity-40'
                        />
                    </div>
                </div>

            </div>
        
        </div>
    )
}

export default IndInvoicePageInputs