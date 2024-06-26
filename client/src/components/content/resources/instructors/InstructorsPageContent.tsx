import PageContent from '@/components/layout/PageContent'
import Loader from '@/components/layout/Loader'
import ResourcesCard from '@/components/shared/resources/ResourcesCard'
import React from 'react'
import { BASE_URL, instructorsImageUploadRoute, instructorsRoute } from '@/constants/api'
import NoDataFound from '@/components/shared/all/NoDataFound'

type ClientsPageProps = {
    isDataHere: boolean,
    response:any,
    refetch:()=> void
}

function InstructorsPageContent({isDataHere,response,refetch}:ClientsPageProps) {
    const instructors = response?.data?.instractor
    
    return (
        
        <PageContent >
            
            <Loader isLoading={!isDataHere}>
            
                {
                    isDataHere ? ( 
                        instructors.length ? (
                            <div className='grid w-full h-full p-10 gap-10 grid-cols-[repeat(auto-fill,230px)]'>
                                {
                                    instructors.map((instructor:any,idx:number) => (
                                        <ResourcesCard
                                            key={idx}
                                            refetch={refetch}
                                            deleteRedirectURL="/resources/instructors"
                                            editPageURL={`/resources/instructors/${instructor._id}/edit`}
                                            titles={{
                                                email:instructor.email,
                                                mobile:instructor.phoneNumber
                                            }}
                                            title={instructor.instractorName}
                                            _id={instructor._id}
                                            imgUrl={`${BASE_URL}${instructorsImageUploadRoute}/${instructor._id}`}
                                            route={instructorsRoute}
                                            inquiryRoute="instructor"
                                        />
                                    ))
                                }
                            </div>
                        ) : <NoDataFound message='no instructors to show , add instructors to show here'/>
                    ) :
                    <></>
                } 
            
            </Loader>

        </PageContent>
    )
}

export default InstructorsPageContent