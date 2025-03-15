import { RiDeleteBin5Line } from "react-icons/ri";

type Props = {
    deleteAll: () => void
};

const Deleteall = ({deleteAll}: Props) => {
    
  return <div id='detele-all-inputs-from-inputarea' className="flex items-center">
    <button className="block cursor-pointer" onClick={deleteAll} >
      <RiDeleteBin5Line size={19} />
    </button>
  </div>;
};

export default Deleteall;
