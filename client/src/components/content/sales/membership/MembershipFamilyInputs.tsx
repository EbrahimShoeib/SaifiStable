import PageContent from "@/components/layout/PageContent"
import SearchBox from "@/components/shared/all/SearchBox"
import ResourcesDropList from "@/components/shared/resources/ResourcesDropList"
import ResourcesInput from "@/components/shared/resources/ResourcesInput"
import { clientsRoute } from "@/constants/api"
import { memberShipStatuses } from "@/constants/memberShipStatuses"
import { memberShipTypes } from "@/constants/memberShipTypes"
import { membershipFamilyTypes } from "@/constants/membershipFamilyTypes"
import { toNameAndId } from "@/utils/toNameAndId"
import { useState } from "react"

type MembershipFamilyInputsProps = {
    startDate:string,
    setStartDate:(newState:string)=> void,
    endDate:string,
    setEndDate:(newState:string)=> void,
    status:NameAndId,
    setStatus:(newState:NameAndId)=> void,
    membershipType:NameAndId,
    setMembershipType:(newState:NameAndId)=> void,
    handleSubmit:()=> void,
    isLoading:boolean,
    familyName:string,
    setFamilyName:(newState:string)=> void,
    members:NameAndId,
    setMembers:(newState:NameAndId)=> void,
    submitButtonLabel:string
}

function MembershipFamilyInputs({
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    status,
    setStatus,
    membershipType,
    setMembershipType,
    handleSubmit,
    isLoading,
    familyName,
    setFamilyName,
    members,
    setMembers,
    submitButtonLabel
}:MembershipFamilyInputsProps) {


    const [clientsRes,setClientsRes] = useState<any>()

    return (
        <PageContent>
            <div className='max-w-[600px] flex flex-col gap-10 my-16 mx-8'>
                <ResourcesInput
                    value={familyName} 
                    setValue={setFamilyName}
                    placeholder="enter family name"
                    label='family name'
                    type='text'
                />
                <SearchBox
                    options={toNameAndId(clientsRes?.data?.client,'username','_id')}
                    searchUrl={clientsRoute}
                    setListValue={setMembers}
                    setResponse={setClientsRes}
                    label='members'
                    listValue={members}
                    placeholder='enter client name'
                />
      
                <ResourcesDropList
                    listValue={status} 
                    setListValue={setStatus}
                    placeholder="Enter membership status"
                    label='membership status'
                    options={memberShipStatuses}
                />
                <ResourcesInput
                    value={startDate} 
                    setValue={setStartDate}
                    placeholder="enter start date"
                    label='start date'
                    type='datetime-local'
                />
                <ResourcesInput
                    value={endDate} 
                    setValue={setEndDate}
                    placeholder="enter end date"
                    label='end date'
                    type='datetime-local'
                />
                <ResourcesDropList
                    listValue={membershipType} 
                    setListValue={setMembershipType}
                    placeholder="select membership type"
                    label='membership type'
                    options={membershipFamilyTypes}
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

export default MembershipFamilyInputs