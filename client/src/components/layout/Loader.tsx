
type LoaderProps = {
    isLoading:boolean
} & Children
function Loader({children,isLoading}: LoaderProps) {

    return (
        <>
            {
                isLoading ? (
                    <div className='w-full h-full gap-6 flex-col flex justify-center items-center'>
                        <div className="w-[100px] flex justify-between items-center h-[16px]">
                            <span style={{animationDelay:"0"}} className="upAndDown w-[20px] aspect-square bg-primary"/>
                            <span style={{animationDelay:".25s"}} className="upAndDown w-[20px] aspect-square bg-primary"/>
                            <span style={{animationDelay:".5s"}} className="upAndDown w-[20px] aspect-square bg-primary"/>
                        </div>
                        <p className="text-primary text-xl">lOADING...</p>
                    </div>
                ) : children
            }
        
        </>
    )
}

export default Loader