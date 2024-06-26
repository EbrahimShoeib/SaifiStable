import { membershipFamilyTypes } from "@/constants/membershipFamilyTypes"

export const getMembershipFamilyType = (membership:string) => {
    if (Boolean(membership))
    return membershipFamilyTypes.filter((currType:NameAndId) =>
        currType?.name?.toLowerCase() === membership?.toLowerCase())[0]
    return null
}