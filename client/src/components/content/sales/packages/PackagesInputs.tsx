'use client'
import PageContent from "@/components/layout/PageContent"
import ResourcesDropList from "@/components/shared/resources/ResourcesDropList"
import ResourcesInput from "@/components/shared/resources/ResourcesInput"
import { packageCategories } from "@/constants/packageCategories"
import { packageStatuses } from "@/constants/packageStatuses"
import { packagesLessons } from "@/constants/packagesLessons"


type PackagesInputsProps = {
    handleSubmit:() => void,
    isLoading:boolean,
    category:NameAndId,
    setCategory:(newState:NameAndId) => void,
    lessons:NameAndId,
    setLessons:(newState:NameAndId) => void,
    startDate:string,
    setStartDate:(newState:string) => void,
    endDate:string,
    setEndDate:(newState:string) => void,
    status:NameAndId,
    setStatus:(newState:NameAndId) => void,
    name:string,
    setName:(newState:string) => void,
    submitButtonLabel:string
}
function PackagesInputs({
    handleSubmit,
    isLoading,
    category,
    setCategory,
    lessons,
    setLessons,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    status,
    setStatus,
    name,
    setName,
    submitButtonLabel

}:PackagesInputsProps) {
    return (
        <PageContent>
            <div className='max-w-[600px] flex flex-col gap-10 my-16 mx-8'>

                
                <ResourcesDropList
                    listValue={category} 
                    setListValue={setCategory}
                    options={packageCategories}
                    placeholder="select Item Category"
                    label='category'
                />
                <ResourcesDropList
                    listValue={lessons} 
                    setListValue={setLessons}
                    placeholder="select Lessons"
                    label='Lessons'
                    options={packagesLessons}
                />
                <ResourcesInput
                    value={startDate} 
                    setValue={setStartDate}
                    placeholder="Enter Start Date"
                    label='start date'
                    type='datetime-local'
                />
                <ResourcesInput
                    value={name} 
                    setValue={setName}
                    placeholder="Enter name "
                    label='name'
                    type='text'
                />
                <ResourcesInput
                    value={endDate} 
                    setValue={setEndDate}
                    placeholder="Enter end Date"
                    label='end date'
                    type='datetime-local'
                />
                <ResourcesDropList
                    listValue={status} 
                    setListValue={setStatus}
                    options={packageStatuses}
                    placeholder="select Item Status"
                    label='status'
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

export default PackagesInputs