"use client"
import React, { Suspense, useEffect, useState } from 'react'
import Avatar from '../shared/all/Avatar'
import Link from 'next/link'
import { GrAdd } from 'react-icons/gr'
import BackButton from '../shared/all/BackButton'
import { usePathname } from 'next/navigation'
import SearchBox from '../shared/all/SearchBox'
import LinksSearchBox from '../shared/all/LinksSearchBox'


type PageHeaderProps = {
    addNewButtonLabel?:string,
    title:any,
    showBackButton?:boolean,
    children?:any,
    linksSearchBox?:LinksSearchBox,
    addNewButtonURL?:string,
}
function PageHeader({linksSearchBox,addNewButtonURL,children,addNewButtonLabel,title,showBackButton}:PageHeaderProps) {

    const pathname = usePathname()
    
    return (
        <Suspense>
            {
                true && (
                    <div className='w-full flex items-center h-[80px]'>
                        <div className='w-full flex justify-between items-center'>
                            <div className='flex items-center gap-5'>
                                {
                                    showBackButton ? (<BackButton/>) : <></>
                                }
                                <h4 className='text-smokey-white text-xl'>{title}</h4>
                            </div>

                            <div className='flex items-center h-[30px] text-sm gap-5'>
                                
                                

                                {
                                    Boolean(linksSearchBox) ? (
                                        <div className='h-[30px]'>
                                            <LinksSearchBox
                                                options={linksSearchBox?.options||[]}
                                                label={linksSearchBox?.label||''}
                                                searchUrl={linksSearchBox?.searchUrl||''}
                                                setResponse={linksSearchBox?.setResponse}
                                                placeholder={linksSearchBox?.placeholder}
                                                BoxClassName='!bg-transparent placeholder:text-smokey-white !h-[30px] !border-primary rounded-lg !border !text-smokey-white'
                                            />
                                        </div>
                                    ) : <></>
                                }

                                {
                                    Boolean(addNewButtonLabel) ? (
                                        <Link
                                            className='page_header_button' 
                                            href={addNewButtonURL?addNewButtonURL:`${pathname}/add-new`} 
                                        >
                                            <GrAdd />
                                            <span>{addNewButtonLabel}</span>
                                        </Link>
                                    ) :<></>
                                }
                                {Boolean(children) && children}
                                <Avatar/>
                            </div>
                        </div>
                    </div>
                )
            }
        </Suspense>
    )
}

export default PageHeader