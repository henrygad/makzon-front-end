import Displaymedia from "../components/Displaymedia";
import { useAppDispatch, useAppSelector } from "../redux";
import {  addSelectedMedia, clearSelectedMedia, deleteMdia } from "../redux/slices/userMediaSlices";
import mediaProps from "../types/media.type";
import { useEffect, useState } from "react";
import { MdDeleteOutline } from "react-icons/md";


const Media = () => {
    const { data: Media, loading, selectedMedia} = useAppSelector(state => state.userMediaSlices.media);
    const appDispatch = useAppDispatch();
    const [useSelect, setUseSelect] = useState(false);

    const handleDelete = (_id: string) => {
        const Getmedia: mediaProps[] = JSON.parse(localStorage.getItem("media") || "[]");
        localStorage.setItem("media", JSON.stringify(Getmedia.filter(md => md._id !== _id)));
        appDispatch(deleteMdia({ _id }));
        appDispatch(clearSelectedMedia([]));
    };

    const handleSelectAll = () => {
        if (Media) {
            Media.map(md => {
                appDispatch(addSelectedMedia({...md}));
            });
        }
    };

    const handleMultipleMediaDelete = () => {
        if (selectedMedia) {
            selectedMedia.map(md => {
                handleDelete(md.filename);
            });
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
            {!loading ?
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
    </section>;
};

export default Media;
