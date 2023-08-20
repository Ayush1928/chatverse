import Skeleton from "react-loading-skeleton";

interface IloadingProps {
}

const loading: React.FunctionComponent<IloadingProps> = (props) => {
    return <div className='flex flex-col h-full items-center bg-slate-800'>
        <Skeleton className='mb-4' height={40} width={400} />
        <div className='flex-1 max-h-full w-full'>
            <div className='flex flex-col flex-auto h-full p-6'>
                <div className='flex flex-col flex-auto flex-shrink-0 justify-end rounded-2xl bg-slate-800 h-full p-4'>
                    <div className='flex flex-col h-full'>
                        <div className='flex flex-col h-full justify-end'>
                            <div className='grid grid-cols-12 gap-y-2 mb-2'>
                                <div className='col-start-3 col-end-13 p-3 rounded-lg'>
                                    <div className='flex items-center w-full justify-start flex-row-reverse'>
                                        <div className='relative h-10 w-10 bg-slate-500 rounded-full'>
                                            <Skeleton width={40} height={40} borderRadius={999} />
                                        </div>
                                        <div className='relative mr-3 w-40 bg-indigo-600 py-2 px-4 rounded-md'>
                                            <Skeleton className='ml-2' width={280} height={20} />
                                        </div>
                                    </div>
                                </div>
                                <div className='col-start-5 col-end-13 p-3 rounded-lg'>
                                    <div className='flex items-center justify-start flex-row-reverse'>
                                        <div className='relative h-10 w-10 bg-slate-500 rounded-full'>
                                            <Skeleton width={40} height={40} borderRadius={999} />
                                        </div>
                                        <div className='relative mr-3 w-24 text-sm bg-indigo-600 py-2 px-4 rounded-md'>
                                            <Skeleton className='ml-2' width={250} height={20} />
                                        </div>
                                    </div>
                                </div>

                                <div className='col-start-1 col-end-10 p-3 rounded-lg'>
                                    <div className='flex flex-row items-center'>
                                        <div className='relative h-10 w-10 bg-slate-500 rounded-full'>
                                            <Skeleton width={40} height={40} borderRadius={999} />
                                        </div>
                                        <div className='relative ml-3 w-32 text-sm bg-gray-700 py-2 px-4 rounded-md'>
                                            <Skeleton className='ml-2' width={300} height={20} />
                                        </div>
                                    </div>
                                </div>
                                <div className='col-start-3 col-end-13 p-3 rounded-lg'>
                                    <div className='flex items-center justify-start flex-row-reverse'>
                                        <div className='relative h-10 w-10 bg-slate-500 rounded-full'>
                                            <Skeleton width={40} height={40} borderRadius={999} />
                                        </div>
                                        <div className='relative mr-3 w-48 text-sm bg-indigo-600 py-2 px-4 rounded-md'>
                                            <Skeleton className='ml-2' width={260} height={20} />
                                        </div>
                                    </div>
                                </div>
                                <div className='col-start-1 col-end-9 p-3 rounded-lg'>
                                    <div className='flex flex-row items-center'>
                                        <div className='relative h-10 w-10 bg-slate-500 rounded-full'>
                                            <Skeleton width={40} height={40} borderRadius={999} />
                                        </div>
                                        <div className='relative ml-3 w-36 text-sm bg-gray-700 py-2 px-4 rounded-md'>
                                            <Skeleton className='ml-2' width={200} height={20} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>;
};

export default loading;


