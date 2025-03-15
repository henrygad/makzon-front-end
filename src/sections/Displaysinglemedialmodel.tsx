import { IoMdArrowRoundBack } from "react-icons/io";
import Model from "../components/Model";
import Displayimage from "../components/Displayimage";
import { useAppSelector } from "../redux";
import { useNavigate } from "react-router-dom";
import Displayvideo from "../components/Displayvideo";

const Displaysinglemedialmodel = () => {
    const navigate = useNavigate();
    const { displaySingleMedia , mediaSelectOptions} = useAppSelector((state) => state.userMediaSlices.media);

    return (
        <Model
            id="single-image"
            children={
                <div className="relative h-full w-full bg-white p-1">
                    <button
                        className="absolute top-2 left-2 bg-white cursor-pointer z-20"
                        onClick={() => navigate(mediaSelectOptions?.negativeNavigate || "")}
                    >
                        <IoMdArrowRoundBack size={20} />
                    </button>
                    {displaySingleMedia &&
                        displaySingleMedia.type === "image" ?
                        <Displayimage
                            url={displaySingleMedia?.url || ""}
                            alt={displaySingleMedia?._id || ""}
                            useCancle={false}
                            parentClassName="h-full w-full"
                            className="h-full w-full object-contain"
                        /> :
                        <Displayvideo
                            url={displaySingleMedia?.url || ""}                            
                            useCancle={false}                            
                            className="h-full w-full object-contain"                           
                        />                        
                    }
                </div>
            }
        />
    );
};

export default Displaysinglemedialmodel;
