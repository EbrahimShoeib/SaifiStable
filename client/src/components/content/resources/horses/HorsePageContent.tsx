import PageContent from '@/components/layout/PageContent'
import Loader from '@/components/layout/Loader'
import ResourcesCard from '@/components/shared/resources/ResourcesCard'
import React from 'react'
import { BASE_URL, horsesImageUploadRoute, horsesRoute } from '@/constants/api'
import NoDataFound from '@/components/shared/all/NoDataFound'

type HorsesPageProps = {
    isDataHere: boolean,
    response:any,
    refetch:()=> any
}
function HorsesPageContent({isDataHere,response,refetch}:HorsesPageProps) {

    const horses = response?.data?.hourse

    
    return (
        
        <PageContent>
            
            <Loader isLoading={!isDataHere}>
            
                {
                    isDataHere ? ( 
                        horses.length ? (
                            <div className='grid w-full h-full p-10 gap-5 grid-cols-[repeat(auto-fill,230px)]'>
                                {
                                    horses.map((horse:any,idx:number) => (
                                        <ResourcesCard
                                            refetch={refetch}
                                            key={idx}
                                            deleteRedirectURL="/resources/horses"
                                            editPageURL={`/resources/horses/${horse._id}/edit`}
                                            titles={{
                                                age:horse.age,
                                                gender:horse.gender
                                            }}
                                            route={horsesRoute}
                                            title={horse.hourseName}
                                            _id={horse._id}
                                            imgUrl={`${BASE_URL}${horsesImageUploadRoute}/${horse._id}`}
                                            inquiryRoute="horse"
                                        />
                                    ))
                                }
                            </div>
                        ) : <NoDataFound message='no horses to show , add horses to show here'/>
                    ) :
                    <></>
                } 
            
            </Loader>

        </PageContent>
    )
}

export default HorsesPageContent