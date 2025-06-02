import axios from "axios";
import Displaymedia from "../components/Displaymedia";
import { useAppDispatch, useAppSelector } from "../redux";
import { deleteMdia } from "../redux/slices/userMediaSlices";
import { useState } from "react";
import { MdDeleteOutline } from "react-icons/md";
import Displayscreenloading from "../components/loaders/Displayscreenloading";
import mediaProps from "../types/media.type";
const apiEndPont = import.meta.env.VITE_DOMAIN_NAME_BACKEND;


const Media = () => {
    const { data: Media, loading: loadingMedia } = useAppSelector(state => state.userMediaSlices.media);
    const appDispatch = useAppDispatch();
    const [selectMedia, setSelectMedia] = useState<mediaProps[]>([]);
    const [useSelect, setUseSelect] = useState(false);

    const [loading, setLoading] = useState(false);

    const handleDelete = async (_id: string) => {
        setLoading(true);
        try {
            const url = apiEndPont + "/media/" + _id;
            await axios.delete(url,
                {
                    baseURL: apiEndPont,
                    withCredentials: true
                }
            );
            appDispatch(deleteMdia({ _id }));
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }


    };

    const handleSelectAll = () => {
        if (Media) {
            Media.map(md => {
                setSelectMedia(pre => [...pre, md]);
            });
        }
    };

    const handleMultipleMediaDelete = () => {
        selectMedia.map(async (md) => {
            await handleDelete(md.filename);
        });
        setSelectMedia([]);
    };


    return <section>
        <menu className="flex items-center justify-between bg-gray-50 py-1 px-3 mb-3">
            {useSelect &&
                selectMedia.length ?
                <ul>
                    <li>
                        <button
                            className="flex items-center gap-1 text-red-800"
                            onClick={() => handleMultipleMediaDelete()}
                        >
                            <MdDeleteOutline color="red" size={18} />
                            {selectMedia.length || 0}
                        </button>
                    </li>
                </ul> :
                null
            }
            <ul className="flex-1 flex justify-end gap-4">
                <li>
                    {
                        useSelect ?
                            <button
                                className="text-sm font-text font-semibold text-blue-600 "
                                onClick={() => handleSelectAll()}
                            >
                                Select all
                            </button> :
                            <button
                                className="text-sm font-text font-semibold text-blue-600"
                                onClick={() => setUseSelect(true)}
                            >
                                Select
                            </button>
                    }
                </li>
                {useSelect ?
                    <li> <button
                        className="text-base font-text font-bold text-slate-800"
                        onClick={() => {
                            setUseSelect(false);
                            setSelectMedia([]);
                        }}
                    >
                        X
                    </button></li> :
                    null
                }
            </ul>
        </menu>
        <div className="flex flex-wrap gap-2 py-4">
            {!loadingMedia ?
                <>
                    {
                        Media &&
                            Media.length ?
                            Media.map(md =>
                                <Displaymedia
                                    key={md._id}
                                    media={md}
                                    useSelect={useSelect}
                                    handleDelete={handleDelete}
                                    selectMedia={selectMedia}
                                    setSelectMedia={setSelectMedia}
                                />
                            ) :
                            <span className="text-xl font-text font-bold flex justify-center items-center">No Image</span>

                    }
                </> :
                <span className="text-base font-text font-normal flex justify-center items-center">Loading...</span>
            }
        </div>
        {/* diplay loader */}
        <Displayscreenloading loading={loading} />
    </section>;
};

export default Media;
