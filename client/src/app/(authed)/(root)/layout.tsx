
import SideNav from '@/components/layout/sideNav/SideNav'


function DashboardLayout({children}:Children) {
 
 

    return (
        <main className='w-full relative h-screen overflow-hidden flex items-center justify-center '>
            <span style={{clipPath:"polygon(0% 0%, 100% 100%, 0% 100%)"}} className='w-full h-full bg-[#4c4b4f] left-0 top-0 absolute'/>

            <div className='w-[95%] z-10 relative h-[95%] flex items-center justify-center gap-10'>
                <SideNav/>
                <div className='h-full overflow-hidden flex-1'>
                    {
                        children
                    }
                </div>
            </div>
        
        </main>
    )
}

export default DashboardLayout