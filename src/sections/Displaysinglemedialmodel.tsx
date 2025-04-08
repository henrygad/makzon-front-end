import { IoMdArrowRoundBack } from "react-icons/io";
import Model from "../components/Model";
import Displayimage from "../components/Displayimage";
import { useLocation, useNavigate } from "react-router-dom";
import Displayvideo from "../components/Displayvideo";
import { useEffect, useState } from "react";
import useFilterQuery from "../hooks/useFilterQuery";

const Displaysinglemedialmodel = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const filterQuery = useFilterQuery();
    const [media, setMedia] = useState<{ url: string, type: string } | undefined>(undefined);

    useEffect(() => {
        if (location.search) {
            const query = filterQuery<{ url: string, type: string }>(location.search);
            if (query) {
                setMedia(query);
            }
        }
    }, [location.search]);
    
    return (
        <Model
            id="single-image"
            children={
                <section className="relative h-full w-full bg-white p-1">
                    <button
                        className="absolute top-2 left-2 bg-white cursor-pointer z-20"
                        onClick={() => navigate(-1)}
                    >
                        <IoMdArrowRoundBack size={20} />
                    </button>
                    {media?.type ?
                        <>
                            {
                                media.type.includes("image") ?
                                    <Displayimage
                                        url={media.url}
                                        alt={media.url}
                                        useCancle={false}
                                        parentClassName="h-full w-full"
                                        className="h-full w-full object-contain"
                                    /> :
                                    <Displayvideo
                                        url={media.url}
                                        useCancle={false}
                                        className="h-full w-full object-contain"
                                    />
                            }
                        </> :
                        null
                    }
                </section>
            }
        />
    );
};

export default Displaysinglemedialmodel;
