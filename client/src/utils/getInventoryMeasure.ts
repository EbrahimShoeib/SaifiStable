import { inventoryMeasures } from "@/constants/inventoryMeasures"

export const getInventoryMeasures = (measure:string) => {
    return inventoryMeasures
    .filter((currMeasure:NameAndId)=> currMeasure?.name.toLowerCase() === measure.toLowerCase())[0]
}