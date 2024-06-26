import PageContent from '@/components/layout/PageContent'
import ResourcesDropList from '@/components/shared/resources/ResourcesDropList'
import ResourcesInput from '@/components/shared/resources/ResourcesInput'
import { inventoryMeasures } from '@/constants/inventoryMeasures'
import { inventoryTypes } from '@/constants/inventoryTypes'
import React from 'react'

type InventoryItemInputsProps = {
    handleSubmit: () => void,
    itemName:string,
    setItemName: (newState: string) => void,
    quantity:string,
    setQuantity: (newState: string) => void,
    price:string,
    setPrice: (newState: string) => void,
    measure:NameAndId,
    setMeasure:(newState: NameAndId) => void,
    type:NameAndId,
    setType: (newState:NameAndId) => void,
    isLoading:boolean,
    description:string,
    setDescription:(newState: string) => void,
    submitButtonLabel:string
}
function InventoryItemInputs({
    handleSubmit,
    itemName,
    setItemName,
    quantity,
    setQuantity,
    price,
    setPrice,
    type,
    setType,
    isLoading,
    measure,
    setMeasure,
    description,
    setDescription,
    submitButtonLabel

}:InventoryItemInputsProps) {
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
                <ResourcesDropList
                    listValue={measure}
                    setListValue={setMeasure}
                    options={inventoryMeasures}
                    placeholder='Select Measure'
                    label='Measure'
                />  
                <ResourcesInput
                    value={description} 
                    setValue={setDescription}
                    placeholder="description"
                    label='description'
                    type='text'
                />  
                <ResourcesDropList
                    listValue={type}
                    setListValue={setType}
                    options={inventoryTypes}
                    placeholder='Select Item Type'
                    label='type'
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

export default InventoryItemInputs