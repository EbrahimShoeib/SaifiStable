'use client'
import PageContent from '@/components/layout/PageContent'
import SearchBox from '@/components/shared/all/SearchBox'
import ResourcesDropList from '@/components/shared/resources/ResourcesDropList'
import ResourcesImageInput from '@/components/shared/resources/ResourcesImageInput'
import ResourcesInput from '@/components/shared/resources/ResourcesInput'
import { clientsRoute, horseCategoriesRoute, horsesRoute } from '@/constants/api'
import { genders } from '@/constants/genders'
import { toNameAndId } from '@/utils/toNameAndId'
import React, { useState } from 'react'

type HorsePageInputsProps = {
    name:string,
    setName:(state:string)=>void,
    note:string,
    setNote:(state:string)=>void,
    age:string,
    setAge:(state:string)=>void,
    isLoading:boolean,
    gender:NameAndId,
    setGender:(state:NameAndId)=>void
    groom:NameAndId,
    setGroom:(state:NameAndId)=>void,
    client:NameAndId,
    setClient:(state:NameAndId)=>void,
    handleSubmit: ()=> void,
    horseCategory:NameAndId,
    setHorseCategory:(state:NameAndId)=>void,
    formDataFile:FormData|undefined,
    setFormDataFile:(state:FormData)=> void,
    submitButtonLabel:string,
    id:string,
    setId:(state:string)=>void

}
function HorsePageInputs({
    name,
    setName,
    note,
    setNote,
    age,
    setAge,
    isLoading,
    gender,
    setGender,
    groom,
    setGroom,
    client,
    setClient,
    handleSubmit,
    horseCategory,
    setHorseCategory,
    formDataFile,
    setFormDataFile,
    submitButtonLabel,
    id,
    setId

}:HorsePageInputsProps) {

    const [clientsRes,setClientsRes] = useState<any>()
    const [horsesRes,setHorsesRes] = useState<any>()
    const [horseCategoriesRes,setHorseCategoriesRes] = useState<any>()

    return (
        <PageContent>   
            <div className='max-w-[600px] flex flex-col gap-5 my-16 mx-8'>
                <ResourcesInput
                    value={name} 
                    setValue={setName}
                    placeholder="Enter horse Name"
                    label='horse name'
                    type='text'
                />
                <ResourcesInput
                    value={id} 
                    setValue={setId}
                    placeholder="Enter horse id"
                    label='horse id'
                    type='text'
                />
                <ResourcesInput
                    value={note} 
                    setValue={setNote}
                    placeholder="Enter Note"
                    label='Note'
                    type='text'
                />
                <ResourcesInput
                    value={age} 
                    setValue={setAge}
                    placeholder="Enter horse Age"
                    label='age'
                    type='number'
                />
                <ResourcesDropList
                    listValue={gender}
                    setListValue={setGender}
                    options={genders}
                    placeholder='Select horse Gender'
                    label='gender'
                />
                <SearchBox
                    label={'select groom'}
                    options={toNameAndId(horsesRes?.data?.hourse,'hourseName',"_id")}
                    searchUrl={horsesRoute}
                    setResponse={setHorsesRes}
                    listValue={groom}
                    setListValue={setGroom}
                    placeholder='select groom'
                />
                <SearchBox
                    label={'select client'}
                    options={toNameAndId(clientsRes?.data?.client,'username',"_id")}
                    searchUrl={clientsRoute}
                    setResponse={setClientsRes}
                    listValue={client}
                    setListValue={setClient}
                    placeholder='select client'
                />
                <ResourcesImageInput
                    label='photo' 
                    formDataFile={formDataFile} 
                    setFormDataFile={setFormDataFile}
                />
                <SearchBox
                    label={'select category'}
                    options={toNameAndId(horseCategoriesRes?.data,'displayName',"_id")}
                    searchUrl={horseCategoriesRoute}
                    setResponse={setHorseCategoriesRes}
                    listValue={horseCategory}
                    placeholder='select horse category'
                    setListValue={setHorseCategory}
                />
            </div>
            <div className='w-full flex justify-center'>
                <button onClick={handleSubmit} disabled={isLoading} className='w-[350px] text-primary duration-300 hover:bg-primary hover:text-smokey-white font-semibold text-2xl capitalize rounded-2xl h-[60px] border border-primary'>
                    {submitButtonLabel}
                </button>
            </div>
    
        </PageContent>
    )
}

export default HorsePageInputs
