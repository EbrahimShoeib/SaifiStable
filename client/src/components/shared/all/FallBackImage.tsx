'use client'

import { checkImgUrl } from "@/utils/chekImgUrl"
import { useEffect, useState } from "react"

type FallBackImageProps = {
    url:string,
    fallback:any,
    className?: string,

}

export const FallBackImage= ({url,fallback,className}:FallBackImageProps) => {
    const [confirmedUrl,setConfirmedUrl] = useState<string>('')


    useEffect(()=>{
        checkImgUrl(url,()=>setConfirmedUrl(url))
    },[url])


    return (
        Boolean(confirmedUrl) ? <img
            className={className}
            src={confirmedUrl}
            alt={fallback}
        /> : fallback
    )
 
}