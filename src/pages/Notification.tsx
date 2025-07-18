import { useEffect, useState } from "react";
import { Multiple, Single } from "../components/Displaynotification";
import { useAppDispatch, useAppSelector } from "../redux";
import notificationProps from "../types/notification.type";
import { MdDeleteOutline } from "react-icons/md";
import { deleteNotifications } from "../redux/slices/userNotificationSlices";
import axios from "axios";
const apiEndPont = import.meta.env.VITE_DOMAIN_NAME_BACKEND;

const Notification = () => {
    const { data: Notifications, loading } = useAppSelector(
        (state) => state.userNotificationSlices
    );
    const appDispatch = useAppDispatch();
    const [isSelect, setIsSelect] = useState(false);
    const [selections, setSelections] = useState<string[]>([]);

    const handleSelectAll = () => {
        setSelections(Notifications.map(notic => notic._id || ""));
    };

    const deleteNotic = async (_id: string) => {
        try {
            const url = apiEndPont + "/notification/" + _id;
            await axios.delete(url, {
                baseURL: apiEndPont,
                withCredentials: true,
            });
            appDispatch(deleteNotifications({ _id }));
        } catch (error) {
            console.error(error);
        }
    };

    const handleMultipleDelete = () => {
        selections.forEach(async (_id, index) => {
            await deleteNotic(_id);
            if (index === selections.length - 1) {
                setSelections([]);                
            }
        });
    };

    const callBackFn = (acc: notificationProps[], curr: notificationProps) => {
        const pre = acc?.[acc.length - 1];

        if (pre?.type?.trim().toLowerCase() === curr.type?.trim().toLowerCase() &&
            pre?.targetTitle?.trim().toLowerCase() === curr?.targetTitle?.trim().toLowerCase()
        ) {
            acc = acc.map((notic) =>
                notic._id === pre._id
                    ? { ...pre, similar: [curr, ...(pre.similar || [])] }
                    : notic
            );
        } else {
            acc.push({ ...curr, similar: [curr] });
        }
        return acc;
    };


    useEffect(() => {
        if (selections?.length === 0) {
            setIsSelect(false);
        }
    }, [selections]);

    return (
        <main className="container">
            <menu className="flex items-center justify-between bg-gray-50 py-1 px-3 mb-3">
                {isSelect &&
                    selections &&
                    selections?.length ? <ul>
                    <li>
                        <button
                            className="flex items-center gap-1 text-red-800"
                            onClick={() => handleMultipleDelete()}
                        >
                            <MdDeleteOutline color="red" size={18} />
                            ({selections &&
                                selections.length || 0})
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
                                setSelections([]);
                            }}
                        >
                            X
                        </button></li> :
                        null
                    }
                </ul>
            </menu>
            <div className="space-y-1">
                {!loading ? (
                    Notifications &&
                        Notifications.length ? (
                        Notifications.reduce(callBackFn, [] as notificationProps[])
                            .map((notic) => (
                                notic?.similar &&
                                    notic.similar.length > 1 ?
                                    <Multiple
                                        key={notic._id}
                                        notifications={notic.similar}
                                        isSelect={isSelect}
                                        selections={selections}
                                        setSelections={setSelections}
                                    /> :
                                    <Single
                                        key={notic._id}
                                        notification={notic}
                                        isSelect={isSelect}
                                        selections={selections}
                                        setSelections={setSelections}

                                    />
                            ))
                            .reverse()
                    ) : (
                        <span>No notification yet</span>
                    )
                ) : (
                    <span>loading...</span>
                )}
            </div>
        </main>
    );
};

export default Notification;
