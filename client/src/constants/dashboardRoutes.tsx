import { ReactNode } from "react"
import { BiSolidPackage } from "react-icons/bi"
import { BsCalendarWeekFill, BsFillCupHotFill } from "react-icons/bs"
import { FaBriefcaseMedical, FaCoffee, FaFileInvoiceDollar } from "react-icons/fa"
import { GiPoliceOfficerHead } from "react-icons/gi"
import { HiMiniUserGroup } from "react-icons/hi2"
import { IoMdSettings } from "react-icons/io"
import { IoTimeSharp } from "react-icons/io5"
import { LiaHorseHeadSolid } from "react-icons/lia"
import { MdGroupAdd, MdInventory2 } from "react-icons/md"

export const InquiryRoutes : DashboardRoute[] = [
    {
        href:"/inquiry/client",
        iconComponent:<HiMiniUserGroup />,
        name:"client"
    },
    {
        href:"/inquiry/horse",
        iconComponent:<LiaHorseHeadSolid />,
        name:"horse"
    },
    {
        href:"/inquiry/instructor",
        iconComponent:<GiPoliceOfficerHead />,
        name:"instructor"
    },
]



export const ManagementRoutes : DashboardRoute[] = [ 

    {
        href:"/management/daily",
        iconComponent:<IoTimeSharp />,
        name:"daily"
    },
    {
        href:"/management/invoice",
        iconComponent:<FaFileInvoiceDollar />,
        name:"invoice"
    },  
    {
        href:"/management/schedule",
        iconComponent:<BsCalendarWeekFill />,
        name:"schedule"
    },
]

export const ProfileRoutes : DashboardRoute[] = [
    {
        href:"/profile/settings",
        iconComponent:<IoMdSettings />,
        name:"settings"
    },
]


export const ResourcesRoutes : DashboardRoute[] = [
    {
        href:"/resources/horses",
        iconComponent:<LiaHorseHeadSolid />,
        name:"horses"
    },
    {
        href:"/resources/clients",
        iconComponent:<HiMiniUserGroup />,
        name:"clients"
    },
    {
        href:"/resources/instructors",
        iconComponent:<GiPoliceOfficerHead />,
        name:"instructors"
    },

]


export const SalesRoutes : DashboardRoute[] = [
    {
        href:"/sales/cafeteria/menu-item",
        iconComponent:<BsFillCupHotFill />,
        name:"cafeteria"
    },
    {
        href:"/sales/inventory/inventory-item",
        iconComponent:<MdInventory2 />,
        name:"inventory"
    },
    {
        href:"/sales/medical/medicine",
        iconComponent:<FaBriefcaseMedical />,
        name:"medical"
    },
    {
        href:"/sales/membership/individual",
        iconComponent:<MdGroupAdd />,
        name:"membership"
    },
    {
        href:"/sales/coffee",
        iconComponent:<FaCoffee />,
        name:"coffee"
    },
    {
        href:"/sales/packages",
        iconComponent:<BiSolidPackage />,
        name:"packages"
    },
]




export type DashboardRoute = {
    href: string,
    iconComponent: ReactNode,
    name:string
}