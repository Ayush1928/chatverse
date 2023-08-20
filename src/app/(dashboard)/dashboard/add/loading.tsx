import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css"
import { FC } from "react"
const loading: FC = async () => {
  return <div className='flex flex-col justify-center mt-28 md:mt-16 items-center'>
    <div>
      <Skeleton baseColor="#475569" highlightColor="#334155" height={50} width={300} />
    </div>
    <div className="mt-8">
      <Skeleton baseColor="#475569" highlightColor="#334155" height={40} width={450} />
    </div>
  </div>;
};

export default loading;
