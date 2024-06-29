
import PageContent from "@/components/layout/PageContent"
import ResourcesDropList from "@/components/shared/resources/ResourcesDropList"
import ResourcesImageInput from "@/components/shared/resources/ResourcesImageInput"
import ResourcesInput from "@/components/shared/resources/ResourcesInput"
import { cafeteriaItemsTypes } from "@/constants/cafeteriaItemsTypes"


type CafeteriaMenuItemsInputsProps = {
    handleSubmit: () => void,
    itemName:string,
    setItemName: (newState: string) => void,
    quantity:string,
    setQuantity: (newState: string) => void,
    price:string,
    setPrice: (newState: string) => void,
    date:string,
    setDate: (newState:string) => void,
    type:NameAndId,
    setType: (newState:NameAndId) => void,
    isLoading:boolean,
    submitButtonLabel:string,
    formDataFile:FormData|undefined,
    setFormDataFile: (newState: FormData) => void
}

function CafeteriaMenuItemsInputs({
    handleSubmit,
    itemName,
    setItemName,
    quantity,
    setQuantity,
    price,
    setPrice,
    date,
    setDate,
    type,
    setType,
    isLoading,
    submitButtonLabel,
    formDataFile,
    setFormDataFile

}:CafeteriaMenuItemsInputsProps) {

    return (
        <PageContent>
            <div className='max-w-[600px] flex flex-col gap-10 my-16 mx-8'>

                <ResourcesInput
                    value={itemName} 
                    setValue={setItemName}
                    placeholder="Enter Item Name"
                    label='item name'
                    type='text'
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
                    placeholder="Date"
                    label='Date'
                    type="datetime-local"
                />
                <ResourcesDropList
                    listValue={type}
                    setListValue={setType}
                    options={cafeteriaItemsTypes}
                    placeholder='Select Item Type'
                    label='type'
                />
                <ResourcesImageInput
                    formDataFile={formDataFile}
                    setFormDataFile={setFormDataFile}
                    label="image"
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

export default CafeteriaMenuItemsInputs