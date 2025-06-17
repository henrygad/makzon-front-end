import { useEffect, useRef, useState } from "react";
import Displayimage from "../components/Displayimage";
import { useAppDispatch, useAppSelector } from "../redux";
import userProps from "../types/user.type";
import { editProfile } from "../redux/slices/userProfileSlices";
import avatarPlaceholder from "./../assets/avaterplaceholder.svg";
import Customselection from "../components/Customselection";
import { Countries, Professions } from "../assets/date";
import { Button } from "../components/Button";
import { addMedia } from "../redux/slices/userMediaSlices";
import axios from "axios";
import Displayscreenloading from "../loaders/Displayscreenloading";
import useDateFormat from "../hooks/useDateFormat";
import Displaychangemedia from "../sections/Displaychangemedia";
import useDialog from "../hooks/useDialog";
const apiEndPont = import.meta.env.VITE_DOMAIN_NAME_BACKEND;

const Updateprofile = () => {
    const { data: User, loading } = useAppSelector(
        (state) => state.userProfileSlices.userProfile
    );

    const appDispatch = useAppDispatch();

    const [userData, setUserData] = useState<userProps | null>(null);
    const [displayPhoneNumber, setDisplayPhoneNumber] = useState<{
        code: string;
        number: string | undefined;
    }>({ code: "+234", number: undefined });

    const [searchProfession, setSearchProfession] = useState("");
    const [displayDateOfBirth, setDisplayDateOfBirth] = useState(false);

    const firstNameInputRef = useRef<HTMLInputElement | null>(null);
    const lastNameInputRef = useRef<HTMLInputElement | null>(null);
    const bioInputRef = useRef<HTMLTextAreaElement | null>(null);
    const professionInputRef = useRef<HTMLInputElement | null>(null);
    const displayEmailInputRef = useRef<HTMLInputElement | null>(null);
    const displayPhoneNumberInputRef = useRef<HTMLInputElement | null>(null);
    const websiteInputRef = useRef<HTMLInputElement | null>(null);
    const birthDayInputRef = useRef<HTMLInputElement | null>(null);
    const sexInputRef = useRef<HTMLSelectElement | null>(null);
    const countryInputRef = useRef<HTMLSelectElement | null>(null);

    const [toEdit, setToEdit] = useState<Record<string, string | undefined>>({
        "": "",
    });
    const [onChange, setOnChange] = useState<string[]>([]);

    const [blob, setBlob] = useState<Blob | undefined>(undefined);
    const [loadingUpdatedData, setLoadingUpdatedData] = useState(false);

    const { dialog, handleDialog } = useDialog();

    const formatDate = useDateFormat();

    const updatedOtherData = async (user: userProps, imageBlob: Blob | undefined) => {
        setLoadingUpdatedData(true);
        try {

            // Create new form data
            const formData = new FormData();

            // if there is image blob attach file to formdata
            if (imageBlob) formData.append("avatar", imageBlob);

            // Append other user data to formData
            for (const key in user) {
                const value = user[key as keyof userProps];
                if (value !== undefined) formData.append(key, JSON.stringify(value));
            }
            
            const url = apiEndPont + "/user";
            const res = await axios.patch(url,
                formData,
                {
                    baseURL: apiEndPont,
                    withCredentials: true,
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );
            const updatedUserData: userProps = await res.data.data;

            if (updatedUserData) {
                appDispatch(editProfile(updatedUserData));

                if (imageBlob) {
                    appDispatch(
                        addMedia({
                            _id: Date.now().toString(),
                            filename: updatedUserData?.avatar,
                            size: 100,
                            fieldname: "avatar",
                            mimetype: updatedUserData?.avatar.split(".")[1],
                            uploader: updatedUserData.userName,
                        })
                    );
                }
            }

        } catch (error) {
            console.error(error);
        } finally {
            setLoadingUpdatedData(false);
            setToEdit({ "": "" });
            setOnChange([]);
            if (imageBlob) setBlob(undefined);
        }
    };

    useEffect(() => {
        if (User) {
            setUserData((pre) => (pre ?
                { ...pre, ...User, avatar: User.avatar ? apiEndPont + "/media/" + User.avatar : "" } :
                { ...User, avatar: User.avatar ? apiEndPont + "/media/" + User.avatar : "" }
            ));
            setDisplayDateOfBirth(User.displayDateOfBirth);
            if (User.displayPhoneNumber && User.displayPhoneNumber.split("-")[1]) {
                setDisplayPhoneNumber({
                    code: User.displayPhoneNumber.split("-")[0],
                    number: User.displayPhoneNumber.split("-")[1],
                });
            }
        }
    }, [User]);

    return (
        <>
            <main className="container font-text font-normal text-slate-800 overflow-x-hidden">
                {
                    !loading ?
                        <>
                            <section className="flex justify-center mt-10">
                                {/* display avatar */}
                                <Displayimage
                                    url={userData?.avatar || ""}
                                    alt={User.userName}
                                    useCancle={onChange.includes("avatar") ? true : false}
                                    className="h-16 w-16 object-contain rounded-full border cursor-pointer"
                                    placeHolder={
                                        <img
                                            src={avatarPlaceholder}
                                            className="absolute top-0 bottom-0 right-0 left-0 h-16 w-16  object-contain rounded-full border cursor-pointer"
                                            onClick={handleDialog}
                                        />
                                    }
                                    loadingPlaceHolder={
                                        <span className="absolute top-0 bottom-0 right-0 left-0 h-16 w-16 object-contain rounded-full border border-slate-200 bg-slate-200 animate-pulse cursor-pointer"
                                            onClick={handleDialog}
                                        >
                                        </span>
                                    }
                                    onCancle={() => {
                                        setUserData((pre) => pre ? { ...pre, avatar: apiEndPont + "/media/" + User.avatar } : pre);
                                        setBlob(undefined);
                                        setOnChange(pre => pre.filter(id => id !== "avatar"));
                                    }}
                                    onClick={handleDialog}
                                />
                            </section>
                            <section className="space-y-4 mt-10">
                                {/* first name */}
                                <label htmlFor="first-name" className="block space-y-0.5">
                                    <p className="text-sm capitalize">First name</p>
                                    <span className="flex flex-wrap justify-between items-center gap-2">
                                        <input
                                            id="first-name"
                                            ref={firstNameInputRef}
                                            type="text"
                                            className={`${toEdit["firstName"] ? "block" : "hidden"
                                                } flex-1 min-w-0 py-1 px-2 capitalize border border-slate-800 rounded-md outline-none"`}
                                            autoComplete="false"
                                            value={userData?.name?.givenName || ""}
                                            onChange={(e) => {
                                                setUserData((pre) => pre ? { ...pre, name: { givenName: e.target.value, familyName: pre.name?.familyName } } : pre);
                                                if (!onChange.includes("firstName")) {
                                                    setOnChange((pre) => ([...pre, "firstName"]));
                                                }
                                            }}
                                        />
                                        {!toEdit["firstName"] ? (
                                            <>
                                                <span className="block flex-1 text-base">
                                                    <p className="py-1 capitalize">
                                                        {User?.name?.givenName || ""}
                                                    </p>
                                                </span>
                                                <button
                                                    className="text-xs border border-slate-800 py-1.5 px-3 rounded-full cursor-pointer"
                                                    onClick={() => {
                                                        if (firstNameInputRef.current) {
                                                            firstNameInputRef.current.focus();
                                                            setToEdit((pre) => ({
                                                                ...pre,
                                                                firstName: "firstName",
                                                            }));
                                                        }
                                                    }}
                                                >
                                                    Edit
                                                </button>
                                            </>
                                        ) : (
                                            <button
                                                className="text-xs border border-slate-800 py-1.5 px-3 rounded-full cursor-pointer"
                                                onClick={() => {
                                                    if (firstNameInputRef.current) {
                                                        setOnChange((pre) => pre.filter(id => id !== "firstName"));
                                                        setToEdit((pre) => ({
                                                            ...pre,
                                                            firstName: undefined,
                                                        }));
                                                        firstNameInputRef.current.blur();
                                                    }
                                                }}
                                            >
                                                Cancel
                                            </button>
                                        )}
                                    </span>
                                </label>
                                {/* last name */}
                                <label htmlFor="last-name" className="block space-y-0.5">
                                    <p className="text-sm">Last name</p>
                                    <span className="flex flex-wrap justify-between items-center gap-2">
                                        <input
                                            id="last-name"
                                            ref={lastNameInputRef}
                                            className={`${toEdit["lastName"] ? "block" : "hidden"
                                                } flex-1 min-w-0 py-1 px-2 capitalize border border-slate-800 rounded-md outline-none"`}
                                            value={userData?.name?.familyName || ""}
                                            onChange={(e) => {
                                                setUserData((pre) =>
                                                    pre
                                                        ? {
                                                            ...pre,
                                                            name: {
                                                                givenName: pre.name?.givenName,
                                                                familyName: e.target.value,
                                                            },
                                                        }
                                                        : pre
                                                );

                                                if (!onChange.includes("lastName")) {
                                                    setOnChange((pre) => ([...pre, "lastName"]));
                                                }
                                            }}
                                        />
                                        {!toEdit["lastName"] ? (
                                            <>
                                                <span className="block flex-1 text-base">
                                                    <p className="py-1 capitalize">
                                                        {User?.name?.familyName || ""}
                                                    </p>
                                                </span>
                                                <button
                                                    className="text-xs border border-slate-800 py-1.5 px-3 rounded-full cursor-pointer"
                                                    onClick={() => {
                                                        if (lastNameInputRef.current) {
                                                            lastNameInputRef.current.focus();
                                                            setToEdit((pre) => ({
                                                                ...pre,
                                                                lastName: "lastName",
                                                            }));
                                                        }
                                                    }}
                                                >
                                                    Edit
                                                </button>
                                            </>
                                        ) : (
                                            <button
                                                className="text-xs border border-slate-800 py-1.5 px-3 rounded-full cursor-pointer"
                                                onClick={() => {
                                                    if (lastNameInputRef.current) {
                                                        setToEdit((pre) => ({ ...pre, lastName: undefined }));
                                                        setOnChange(pre => pre.filter(id => id !== "lastName"));
                                                        lastNameInputRef.current.blur();
                                                    }
                                                }}
                                            >
                                                Cancel
                                            </button>
                                        )}
                                    </span>
                                </label>
                                {/* bio */}
                                <label htmlFor="bio" className="block space-y-0.5">
                                    <p className="text-sm">Bio</p>
                                    <span className="flex flex-wrap justify-between items-end gap-2">
                                        <textarea
                                            id="bio"
                                            ref={bioInputRef}
                                            className={`${toEdit["bio"] ? "block" : "hidden"
                                                } flex-1 w-auto min-w-[200px] h-auto min-h-[100px] py-1 px-2 border border-slate-800 rounded-md outline-none resize-none`}
                                            value={userData?.bio || ""}
                                            onChange={(e) => {
                                                setUserData((pre) =>
                                                    pre ? { ...pre, bio: e.target.value } : pre
                                                );
                                                if (!onChange.includes("bio")) {
                                                    setOnChange((pre) => ([...pre, "bio"]));
                                                }
                                            }}
                                        />
                                        {!toEdit["bio"] ? (
                                            <>
                                                <span className="block flex-1 text-base">
                                                    <p className="py-1 capitalize">{User?.bio || ""}</p>
                                                </span>
                                                <button
                                                    className="text-xs border border-slate-800 py-1.5 px-3 rounded-full cursor-pointer"
                                                    onClick={() => {
                                                        if (bioInputRef.current) {
                                                            setToEdit((pre) => ({ ...pre, bio: "bio" }));
                                                            bioInputRef.current.focus();
                                                        }
                                                    }}
                                                >
                                                    Edit
                                                </button>
                                            </>
                                        ) : (
                                            <button
                                                className="text-xs border border-slate-800 py-1.5 px-3 rounded-full cursor-pointer"
                                                onClick={() => {
                                                    if (bioInputRef.current) {
                                                        setToEdit((pre) => ({ ...pre, bio: undefined }));
                                                        setOnChange(pre => pre.filter(id => id !== "bio"));
                                                        bioInputRef.current.blur();
                                                    }
                                                }}
                                            >
                                                Cancel
                                            </button>
                                        )}
                                    </span>
                                </label>
                                {/* profession */}
                                <label htmlFor="profession" className="block space-y-0.5">
                                    <p className="text-sm">Profession</p>
                                    <span className="flex flex-wrap justify-between items-center gap-2">
                                        <span
                                            className={`${toEdit["profession"] ? "block" : "hidden"
                                                } flex-1 relative`}
                                        >
                                            <input
                                                id="profession"
                                                ref={professionInputRef}
                                                type="text"
                                                className="block w-full min-w-0 py-1 px-2 capitalize border border-slate-800 rounded-md outline-none"
                                                value={userData?.profession || ""}
                                                onChange={(e) => {
                                                    setSearchProfession(e.target.value);
                                                    setUserData((pre) =>
                                                        pre
                                                            ? {
                                                                ...pre,
                                                                profession: e.target.value,
                                                            }
                                                            : pre
                                                    );

                                                    if (!onChange.includes("profession")) {
                                                        setOnChange((pre) => ([...pre, "profession"]));
                                                    }
                                                }}
                                            />
                                            <Customselection
                                                arrOfOptions={Professions}
                                                className="top-9 right-0 left-0 w-full min-h-[180px] max-h-[180px] border border-blue-600 py-2 rounded-md shadow-md shadow-gray-400 overflow-y-auto"
                                                dropDown={searchProfession.trim() ? true : false}
                                                useSearch={true}
                                                search={searchProfession}
                                                select={userData?.profession || ""}
                                                setSelect={(value) => {
                                                    setUserData((pre) =>
                                                        pre
                                                            ? {
                                                                ...pre,
                                                                profession: value as string,
                                                            }
                                                            : pre
                                                    );
                                                    setSearchProfession("");
                                                }}
                                            />
                                        </span>
                                        {!toEdit["profession"] ? (
                                            <>
                                                <span className="block flex-1 text-base">
                                                    <p className="py-1 capitalize">
                                                        {User?.profession || ""}
                                                    </p>
                                                </span>
                                                <button
                                                    className="text-xs border border-slate-800 py-1.5 px-3 rounded-full cursor-pointer"
                                                    onClick={() => {
                                                        if (professionInputRef.current) {
                                                            setToEdit((pre) => ({
                                                                ...pre,
                                                                profession: "profession",
                                                            }));
                                                            professionInputRef.current.focus();
                                                        }
                                                    }}
                                                >
                                                    Edit
                                                </button>
                                            </>
                                        ) : (
                                            <button
                                                className="text-xs border border-slate-800 py-1.5 px-3 rounded-full cursor-pointer"
                                                onClick={() => {
                                                    if (professionInputRef.current) {
                                                        setToEdit((pre) => ({
                                                            ...pre,
                                                            profession: undefined,
                                                        }));
                                                        setOnChange((pre) => pre.filter(id => id !== "profession"));
                                                        professionInputRef.current.blur();
                                                    }
                                                }}
                                            >
                                                Cancel
                                            </button>
                                        )}
                                    </span>
                                </label>
                                {/* display email */}
                                <label htmlFor="display-email" className="block space-y-0.5">
                                    <p className="text-sm">Display email</p>
                                    <span className="flex flex-wrap justify-between items-center gap-2">
                                        <input
                                            id="display-email"
                                            ref={displayEmailInputRef}
                                            type="email"
                                            className={`${toEdit["displayEmail"] ? "block" : "hidden"
                                                } flex-1 min-w-0 py-1 px-2 border border-slate-800 rounded-md outline-none"`}
                                            value={userData?.displayEmail || ""}
                                            onChange={(e) => {
                                                setUserData((pre) =>
                                                    pre
                                                        ? {
                                                            ...pre,
                                                            displayEmail: e.target.value,
                                                        }
                                                        : pre
                                                );

                                                if (!onChange.includes("displayEmail")) {
                                                    setOnChange((pre) => ([...pre, "displayEmail"]));
                                                }
                                            }}
                                        />
                                        {!toEdit["displayEmail"] ? (
                                            <>
                                                <span className="block flex-1 text-base">
                                                    <p className="py-1">
                                                        {User?.displayEmail || ""}
                                                    </p>
                                                </span>
                                                <button
                                                    className="text-xs border border-slate-800 py-1.5 px-3 rounded-full cursor-pointer"
                                                    onClick={() => {
                                                        if (displayEmailInputRef.current) {
                                                            displayEmailInputRef.current.focus();
                                                            setToEdit((pre) => ({
                                                                ...pre,
                                                                displayEmail: "displayEmail",
                                                            }));
                                                        }
                                                    }}
                                                >
                                                    Edit
                                                </button>
                                            </>

                                        ) : (
                                            <button
                                                className="text-xs border border-slate-800 py-1.5 px-3 rounded-full cursor-pointer"
                                                onClick={() => {
                                                    if (displayEmailInputRef.current) {
                                                        setToEdit((pre) => ({ ...pre, displayEmail: undefined }));
                                                        displayEmailInputRef.current.blur();
                                                        setOnChange(pre => pre.filter(id => id !== "displayEmail"));
                                                    }
                                                }}
                                            >
                                                Cancel
                                            </button>
                                        )}
                                    </span>
                                </label>
                                {/* display phone number */}
                                <label
                                    htmlFor="display-phone-number"
                                    className="block w-full space-y-0.5"
                                >
                                    <p className="text-sm">Display Phone number</p>
                                    <span className="flex flex-wrap justify-between items-center gap-2">
                                        <span className={`flex-1 ${toEdit["displayPhoneNumber"] ? "flex" : "hidden"} flex-wrap justify-between items-center gap-x-2`}>
                                            <>
                                                {Countries?.length ?
                                                    <select
                                                        name="countries-code"
                                                        id="countries-code"
                                                        value={displayPhoneNumber?.code}
                                                        className="text-sm min-w-0 py-1.5 px-1 border rounded-md"
                                                        onChange={(e) => {
                                                            setDisplayPhoneNumber((pre) => ({ ...pre, code: e.target.value, }));
                                                            if (!onChange.includes("displayPhoneNumber")) {
                                                                setOnChange((pre) => ([...pre, "displayPhoneNumber"]));
                                                            }
                                                        }}
                                                    >
                                                        {
                                                            Countries.map((country) => (
                                                                <option key={country.code} value={country.code}>
                                                                    {country.country} {country.code}
                                                                </option>
                                                            ))
                                                        }
                                                    </select> :
                                                    null
                                                }
                                            </>
                                            <input
                                                id="display-phone-number"
                                                ref={displayPhoneNumberInputRef}
                                                type="number"
                                                className="flex-1 min-w-0 py-1 px-2 capitalize border border-slate-800 rounded-md outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                                value={displayPhoneNumber?.number || ""}
                                                onChange={(e) => {
                                                    setDisplayPhoneNumber((pre) => ({
                                                        ...pre,
                                                        number: e.target.value.toString().trim(),
                                                    }));
                                                    if (!onChange.includes("displayPhoneNumber")) {
                                                        setOnChange((pre) => ([...pre, "displayPhoneNumber"]));
                                                    }
                                                }}
                                            />
                                        </span>
                                        {!toEdit["displayPhoneNumber"] ? (
                                            <>
                                                <span className="block flex-1 text-base">
                                                    <p className="py-1 capitalize">
                                                        {User.displayPhoneNumber}
                                                    </p>
                                                </span>
                                                <button
                                                    className="text-xs border border-slate-800 py-1.5 px-3 rounded-full cursor-pointer"
                                                    onClick={() => {
                                                        if (displayPhoneNumberInputRef.current) {
                                                            displayPhoneNumberInputRef.current.focus();
                                                            setToEdit(pre => ({ ...pre, displayPhoneNumber: "displayPhoneNumber" }));
                                                        }
                                                    }}
                                                >
                                                    Edit
                                                </button>
                                            </>

                                        ) : (
                                            <button
                                                className="text-xs border border-slate-800 py-1.5 px-3 rounded-full cursor-pointer"
                                                onClick={() => {
                                                    if (displayPhoneNumberInputRef.current) {
                                                        setToEdit((pre) => ({ ...pre, displayPhoneNumber: undefined }));
                                                        setOnChange(pre => pre.filter(id => id !== "displayPhoneNumber"));
                                                        displayPhoneNumberInputRef.current.blur();
                                                    }
                                                }}
                                            >
                                                Cancel
                                            </button>
                                        )}
                                    </span>
                                </label>
                                {/* website */}
                                <label htmlFor="website" className="block space-y-0.5">
                                    <p className="text-sm">Website</p>
                                    <span className="flex flex-wrap justify-between items-center gap-2">
                                        <input
                                            id="website"
                                            ref={websiteInputRef}
                                            type="text"
                                            className={`${toEdit["website"] ? "block" : "hidden"
                                                } flex-1 min-w-0 py-1 px-2 border border-slate-800 rounded-md outline-none"`}
                                            value={userData?.website || ""}
                                            onChange={(e) => {
                                                setUserData((pre) =>
                                                    pre
                                                        ? {
                                                            ...pre,
                                                            website: e.target.value,
                                                        }
                                                        : pre
                                                );
                                                if (!onChange.includes("website")) {
                                                    setOnChange((pre) => ([...pre, "website"]));
                                                }

                                            }}
                                        />
                                        {!toEdit["website"] ? (
                                            <>
                                                <span className="block flex-1 text-base">
                                                    <p className="py-1">
                                                        {User?.website || ""}
                                                    </p>
                                                </span>
                                                <button
                                                    className="text-xs border border-slate-800 py-1.5 px-3 rounded-full cursor-pointer"
                                                    onClick={() => {
                                                        if (websiteInputRef.current) {
                                                            setToEdit(pre => ({ ...pre, website: "website" }));
                                                            websiteInputRef.current.focus();
                                                        }

                                                    }}
                                                >
                                                    Edit
                                                </button>
                                            </>
                                        ) : (
                                            <button
                                                className="text-xs border border-slate-800 py-1.5 px-3 rounded-full cursor-pointer"
                                                onClick={() => {
                                                    if (websiteInputRef.current) {
                                                        setToEdit((pre) => ({
                                                            ...pre,
                                                            website: undefined,
                                                        }));
                                                        setOnChange(pre => pre.filter(id => id !== "website"));
                                                        websiteInputRef.current.blur();
                                                    }
                                                }}
                                            >
                                                Cancel
                                            </button>
                                        )}
                                    </span>
                                </label>
                                {/* birthday */}
                                <label htmlFor="birth-day" className="block space-y-1">
                                    <p className="text-sm capitalize">Birth Day</p>
                                    <span className="flex flex-wrap justify-between items-end gap-2">
                                        <span className={`${toEdit["birthDay"] ? "block" : "hidden"} space-y-2`}>
                                            <input
                                                id="birth-day"
                                                ref={birthDayInputRef}
                                                type="date"
                                                className="w-full min-w-0 py-1 px-2 capitalize border border-slate-800 rounded-md outline-none"
                                                value={userData?.dateOfBirth || ""}
                                                onChange={(e) => {
                                                    setUserData((pre) =>
                                                        pre
                                                            ? {
                                                                ...pre,
                                                                dateOfBirth: e.target.value,
                                                            }
                                                            : pre
                                                    );

                                                    if (!onChange.includes("birthDay")) {
                                                        setOnChange((pre) => ([...pre, "birthDay"]));
                                                    }
                                                }}
                                            />
                                            <span className="flex items-center gap-2 w-full">
                                                <span className="text-sm text-wrap">
                                                    Display date of birth
                                                </span>
                                                <span className="flex flex-nowrap items-center gap-1 text-sm font-text font-semibold border border-gray-500 shadow-inner shadow-gray-500 bg-gray-100">
                                                    <button
                                                        className={` py-0.5 px-1.5 ${!displayDateOfBirth ? "bg-white" : ""
                                                            } cursor-pointer`}
                                                        onClick={() => {
                                                            setDisplayDateOfBirth(false);
                                                            if (!onChange.includes("birthDay")) {
                                                                setOnChange((pre) => ([...pre, "birthDay"]));
                                                            }
                                                        }}
                                                    >
                                                        No
                                                    </button>
                                                    <button
                                                        className={`py-0.5 px-1.5 ${displayDateOfBirth ? "bg-white" : ""
                                                            } cursor-pointer`}
                                                        onClick={() => {
                                                            setDisplayDateOfBirth(true);
                                                            if (!onChange.includes("birthDay")) {
                                                                setOnChange((pre) => ([...pre, "birthDay"]));
                                                            }
                                                        }}
                                                    >
                                                        Yes
                                                    </button>
                                                </span>
                                            </span>
                                        </span>
                                        {!toEdit["birthDay"] ? (
                                            <>
                                                <span className="block flex-1 text-base">
                                                    <p className="py-1">
                                                        {formatDate(User?.dateOfBirth || "")}
                                                    </p>
                                                </span>
                                                <button
                                                    className="text-xs border border-slate-800 py-1.5 px-3 rounded-full cursor-pointer"
                                                    onClick={() => {
                                                        if (birthDayInputRef.current) {
                                                            birthDayInputRef.current.focus();
                                                            setToEdit(pre => ({ ...pre, birthDay: "birthDay" }));
                                                        }
                                                    }}
                                                >
                                                    Edit
                                                </button>
                                            </>
                                        ) : (
                                            <button
                                                className="text-xs border border-slate-800 py-1.5 px-3 rounded-full cursor-pointer"
                                                onClick={() => {
                                                    if (birthDayInputRef.current) {
                                                        setToEdit((pre) => ({
                                                            ...pre,
                                                            birthDay: undefined,
                                                        }));
                                                        setOnChange(pre => pre.filter(id => id !== "birthDay"));
                                                        setDisplayDateOfBirth(User.displayDateOfBirth);
                                                        birthDayInputRef.current.blur();
                                                    }
                                                }}
                                            >
                                                Cancel
                                            </button>
                                        )}
                                    </span>
                                </label>
                                {/* sex (selection) */}
                                <label htmlFor="sex" className="block space-y-0.5">
                                    <p className="text-sm capitalize">Gender</p>
                                    <span className="flex flex-wrap justify-between items-center gap-2">
                                        <select
                                            name="sex"
                                            id="sex"
                                            ref={sexInputRef}
                                            value={userData?.sex}
                                            className={`${toEdit["sex"] ? "block" : "hidden"} flex-1 min-w-0 py-1 px-2 capitalize border border-slate-800 rounded-md outline-none cursor-pointer`}
                                            onChange={(e) => {
                                                setUserData((pre) => pre ? { ...pre, sex: e.target.value } : pre);
                                                if (!onChange.includes("sex")) {
                                                    setOnChange((pre) => ([...pre, "sex"]));
                                                }
                                            }}
                                        >
                                            <option value="male">Male</option>
                                            <option value="female">Female</option>
                                            <option value="others">others</option>
                                        </select>
                                        {!toEdit["sex"] ? (
                                            <>
                                                <span className="block flex-1 text-base">
                                                    <p className="py-1 capitalize">
                                                        {User?.sex}
                                                    </p>
                                                </span>
                                                <button
                                                    className="text-xs border border-slate-800 py-1.5 px-3 rounded-full cursor-pointer"
                                                    onClick={() => {
                                                        if (sexInputRef.current) {
                                                            sexInputRef.current.focus();
                                                            setToEdit(pre => ({ ...pre, sex: "sex" }));
                                                        }
                                                    }}
                                                >
                                                    Edit
                                                </button>
                                            </>
                                        ) : (
                                            <button
                                                className="text-xs border border-slate-800 py-1.5 px-3 rounded-full cursor-pointer"
                                                onClick={() => {
                                                    if (sexInputRef.current) {
                                                        setToEdit((pre) => ({
                                                            ...pre,
                                                            sex: undefined,
                                                        }));
                                                        setOnChange(pre => pre.filter(id => id !== "sex"));
                                                        sexInputRef.current.blur();
                                                    }
                                                }}
                                            >
                                                Cancel
                                            </button>
                                        )}
                                    </span>
                                </label>
                                {/* country (selection) */}
                                <label htmlFor="country" className="block space-y-0.5">
                                    <p className="text-sm capitalize">Country</p>
                                    <span className="flex flex-wrap justify-between items-center gap-2">
                                        <>
                                            {Countries?.length ?
                                                <select
                                                    name="country"
                                                    id="country"
                                                    ref={countryInputRef}
                                                    value={userData?.country}
                                                    className={`${toEdit["country"] ? "block" : "hidden"} flex-1 min-w-0 py-1 px-2 capitalize border border-slate-800 rounded-md outline-none cursor-pointer`}
                                                    onChange={(e) => {
                                                        setUserData((pre) => pre ? { ...pre, country: e.target.value } : pre);
                                                        if (!onChange.includes("country")) {
                                                            setOnChange((pre) => ([...pre, "country"]));
                                                        }
                                                    }}
                                                >
                                                    {
                                                        Countries.map(country =>
                                                            <option
                                                                key={country.country}
                                                                value={country.country}
                                                            >
                                                                {country.country}
                                                            </option>
                                                        )
                                                    }
                                                </select> :
                                                null
                                            }
                                        </>
                                        {!toEdit["country"] ? (
                                            <>
                                                <span className="block flex-1 text-base">
                                                    <p className="py-1 capitalize">
                                                        {User?.country || ""}
                                                    </p>
                                                </span>
                                                <button
                                                    className="text-xs border border-slate-800 py-1.5 px-3 rounded-full cursor-pointer"
                                                    onClick={() => {
                                                        if (countryInputRef.current) {
                                                            setToEdit(pre => ({ ...pre, country: "country" }));
                                                            countryInputRef.current.focus();
                                                        }
                                                    }}
                                                >
                                                    Edit
                                                </button>
                                            </>
                                        ) : (
                                            <button
                                                className="text-xs border border-slate-800 py-1.5 px-3 rounded-full cursor-pointer"
                                                onClick={() => {
                                                    if (countryInputRef.current) {
                                                        setToEdit((pre) => ({
                                                            ...pre,
                                                            country: undefined,
                                                        }));
                                                        setOnChange(pre => pre.filter(id => id !== "country"));
                                                        countryInputRef.current.blur();
                                                    }
                                                }}
                                            >
                                                Cancel
                                            </button>
                                        )}
                                    </span>
                                </label>
                            </section>
                        </> :
                        <Displayscreenloading loading={loading} />
                }
            </main>
            <footer className="mt-8">
                {/* update all user data btn */}
                <div className="container fixed bottom-0 left-0 right-0 py-2 bg-white z-10">
                    <div className="flex justify-center items-center">
                        {onChange.length ? (
                            <Button
                                fieldName={"Save changes"}
                                className="font-text text-sm text-white font-semibold py-1.5 min-w-[180px] rounded-full transition-colors border-2 bg-green-600 shadow"
                                onClick={() => {
                                    if (userData) {
                                        const updateUserData = {
                                            ...userData,
                                            avatar: userData.avatar.split("/")[userData.avatar.split("/").length - 1],
                                            displayPhoneNumber: displayPhoneNumber?.number
                                                ? displayPhoneNumber.code +
                                                "-" +
                                                displayPhoneNumber.number
                                                : "",
                                            displayDateOfBirth,
                                        };
                                        updatedOtherData(updateUserData, blob);
                                    }
                                }}
                            />
                        ) :
                            null}
                    </div>
                </div>

                {/* Screen loading */}
                <Displayscreenloading loading={loadingUpdatedData} />
                {/* display add media model */}
                <Displaychangemedia
                    title="Select image"
                    dialog={dialog}
                    handleDialog={handleDialog}
                    viewMediaUrl={userData?.avatar || ""}
                    setGetMediaFromDevice={({ blob, tempUrl }) => {
                        setBlob(blob);
                        setUserData((pre) =>
                            pre ? { ...pre, avatar: tempUrl } : pre
                        );
                        if (!onChange.includes("avatar")) {
                            setOnChange((pre) => ([...pre, "avatar"]));
                        }
                    }}
                    setGetMediaFromGalary={(url) => {
                        setUserData((pre) =>
                            pre ? { ...pre, avatar: apiEndPont + "/media/" + url[0] } : pre
                        );
                        if (!onChange.includes("avatar")) {
                            setOnChange((pre) => ([...pre, "avatar"]));
                        }
                    }}
                />
            </footer>
        </>
    );
};

export default Updateprofile;
