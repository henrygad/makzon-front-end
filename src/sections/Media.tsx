import Displaymedia from "../components/Displaymedia";
import { useAppDispatch, useAppSelector } from "../redux";
import { addToMediaSelections, clearAllSelectedMedia, deleteMdia } from "../redux/slices/userMediaSlices";
import mediaProps from "../types/file.type";
import { useEffect, useState } from "react";
import { MdDeleteOutline } from "react-icons/md";


const Media = () => {
    const { data: Media, loading, mediaSelections } = useAppSelector(state => state.userMediaSlices.media);
    const appDispatch = useAppDispatch();
    const [isSelect, setIsSelect] = useState(false);

    const handleDelete = (_id: string) => {
        const Getmedia: mediaProps[] = JSON.parse(localStorage.getItem("media") || "[]");
        localStorage.setItem("media", JSON.stringify(Getmedia.filter(md => md._id !== _id)));
        appDispatch(deleteMdia({ _id }));
        appDispatch(clearAllSelectedMedia([]));
    };

    const handleSelectAll = () => {
        if (Media) {
            Media.map(md => {
                appDispatch(addToMediaSelections({ ...md }));
            });
        }
    };

    const handleMultipleMediaDelete = () => {
        if (mediaSelections) {
            mediaSelections.map(md => {
                handleDelete(md._id);
            });
        }
    };

    useEffect(() => {
        if (mediaSelections?.length === 0) {
            setIsSelect(false);
        }
    }, [mediaSelections]);

    return <section>
        <menu className="flex items-center justify-betweenbg-gray-50 border py-1 px-3 mb-3 rounded shadow-sm">
            {isSelect &&
                mediaSelections &&
                mediaSelections?.length ? <ul>
                <li>
                    <button
                        className="flex items-center gap-1 text-red-800"
                        onClick={() => handleMultipleMediaDelete()}
                    >
                        <MdDeleteOutline color="red" size={18} />
                        ({mediaSelections &&
                            mediaSelections.length || 0})
                    </button>
                </li>
            </ul> :
                null
            }
            <ul className="flex-1 flex justify-end gap-4">
                <li>
                    {
                        isSelect ?
                            <button
                                className="text-sm font-text font-semibold text-blue-600 "
                                onClick={() => handleSelectAll()}
                            >
                                Select all
                            </button> :
                            <button
                                className="text-sm font-text font-semibold text-blue-600"
                                onClick={() => setIsSelect(true)}
                            >
                                Select
                            </button>
                    }
                </li>
                {isSelect ?
                    <li> <button
                        className="text-base font-text font-bold text-slate-800"
                        onClick={() => {
                            setIsSelect(false);
                            appDispatch(clearAllSelectedMedia([]));
                        }}
                    >
                        X
                    </button></li> :
                    null
                }
            </ul>
        </menu>
        <div className={`flex flex-wrap items-center gap-2 ${isSelect ? "p-3" : ""}`}>
            {!loading ?
                Media &&
                    Media.length ?
                    Media.map(md =>
                        <Displaymedia
                            key={md._id}
                            media={md}
                            mediaSelections={mediaSelections}
                            isSelect={isSelect} handleDelete={handleDelete} />
                    ) :
                    <div>No media yet</div> :
                <div>loading...</div>
            }
        </div>
    </section>;
};

export default Media;
