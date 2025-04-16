import axios from "axios";
import Displaymedia from "../components/Displaymedia";
import { useAppDispatch, useAppSelector } from "../redux";
import { addSelectedMedia, clearSelectedMedia, deleteMdia } from "../redux/slices/userMediaSlices";
import { useEffect, useState } from "react";
import { MdDeleteOutline } from "react-icons/md";
import Displayscreenloading from "../components/Displayscreenloading";
const apiEndPont = import.meta.env.VITE_DOMAIN_NAME_BACKEND;


const Media = () => {
    const { data: Media, loading: loadingMedia, selectedMedia } = useAppSelector(state => state.userMediaSlices.media);
    const appDispatch = useAppDispatch();
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
                appDispatch(addSelectedMedia({ ...md }));
            });
        }
    };

    const handleMultipleMediaDelete = () => {
        if (selectedMedia) {
            selectedMedia.map(async(md) => {
                await handleDelete(md.filename);
            });
            appDispatch(clearSelectedMedia([]));
        }
    };

    useEffect(() => {
        if (!selectedMedia?.length) {
            setUseSelect(false);
        }
    }, [selectedMedia]);

    return <section>
        <menu className="flex items-center justify-betweenbg-gray-50 border py-1 px-3 mb-3 rounded shadow-sm">
            {useSelect &&
                selectedMedia &&
                selectedMedia?.length ? <ul>
                <li>
                    <button
                        className="flex items-center gap-1 text-red-800"
                        onClick={() => handleMultipleMediaDelete()}
                    >
                        <MdDeleteOutline color="red" size={18} />
                        ({selectedMedia &&
                            selectedMedia.length || 0})
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
                            appDispatch(clearSelectedMedia([]));
                        }}
                    >
                        X
                    </button></li> :
                    null
                }
            </ul>
        </menu>
        <div className={`flex flex-wrap items-center gap-2 ${useSelect ? "p-3" : ""}`}>
            {!loadingMedia ?
                Media &&
                    Media.length ?
                    Media.map(md =>
                        <Displaymedia
                            key={md._id}
                            media={md}
                            useSelect={useSelect}
                            handleDelete={handleDelete}
                        />
                    ) :
                    <div>No media yet</div> :
                <div>loading...</div>
            }
        </div>
        {/* diplay loader */}
        <Displayscreenloading  loading={loading} />
    </section>;
};

export default Media;
