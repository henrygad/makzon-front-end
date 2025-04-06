import { useEffect, useRef, useState } from "react";
import Displayimage from "../components/Displayimage";
import { useAppDispatch, useAppSelector } from "../redux";
import { useNavigate } from "react-router-dom";
import Model from "../components/Model";
import userProps from "../types/user.type";
import { editProfile } from "../redux/slices/userProfileSlices";
import avatarPlaceholder from "../assert/avaterplaceholder.svg";
import Fileinput from "../components/Fileinput";
import useGetLocalFiles from "../hooks/useGetLocalFiles";
import { IoMdArrowRoundBack, IoMdImages } from "react-icons/io";
import Texteditor from "../editor/App";
import Customselection from "../components/Customselection";
import { Countries, Professions } from "../assert/date";
import { Button } from "../components/Button";
import { addMedia} from "../redux/slices/userMediaSlices";
import axios from "axios";
const apiEndPont = import.meta.env.VITE_DOMAIN_NAME_BACKEND;

const Updateprofile = () => {
    const navigate = useNavigate();
    const { data: User, loading } = useAppSelector(
        (state) => state.userProfileSlices.userProfile
    );
    const { selectedMedia } = useAppSelector(
        (state) => state.userMediaSlices.media
    );
    const appDispatch = useAppDispatch();

    const [userData, setUserData] = useState({
        userName: "",
        name: { familyName: "", givenName: "" },
        dateOfBirth: "",
        displayDateOfBirth: false,
        displayEmail: "",
        displayPhoneNumber: "",
        website: "",
        profession: "",
        country: "",
        sex: "",
        bio: "",
    });
    const [avatar, setAvatar] = useState(" ");
    const [displayPhoneNumber, setDisplayPhoneNumber] = useState<{
        code: string;
        number: string;
    }>({ code: "", number: "" });

    const [searchProfession, setSearchProfession] = useState("");
    const [searchCountry, setSearchCountry] = useState("");
    const [displayDateOfBirth, setDisplayDateOfBirth] = useState(false);

    const firstNameInputRef = useRef<HTMLInputElement | null>(null);
    const lastNameInputRef = useRef<HTMLInputElement | null>(null);
    const bioInputRef = useRef<HTMLDivElement | null>(null);
    const professionInputRef = useRef<HTMLInputElement | null>(null);
    const displayEmailInputRef = useRef<HTMLInputElement | null>(null);
    const displayPhoneNumberInputRef = useRef<HTMLInputElement | null>(null);
    const websiteInputRef = useRef<HTMLInputElement | null>(null);
    const birthDayInputRef = useRef<HTMLInputElement | null>(null);
    const sexInputRef = useRef<HTMLSelectElement | null>(null);
    const countryInputRef = useRef<HTMLInputElement | null>(null);

    const [focusInput, setFocusInput] = useState("");
    const [changeInputs, setChangeInputs] = useState([""]);
    const { getLocalFiles } = useGetLocalFiles();
    const [grapSelectedMedia, setGrapSelectedMedia] = useState("");
    const [blob, setBlob] = useState<Blob | undefined>(undefined);
    const [loadingUpdatedData, setLoadingUpdatedData] = useState(false);

    const updatedAvatar = async (file: Blob) => {
        setLoadingUpdatedData(true);
        try {
            const formData = new FormData();
            formData.append("avatar", file);

            const url = apiEndPont + "/user";
            const res = await axios.patch(url, formData, {
                baseURL: apiEndPont,
                withCredentials: true,
            });
            const updatedUserData: userProps = await res.data;
            if (updatedUserData) {
                console.log(updatedUserData);
                appDispatch(editProfile(updatedUserData));
                appDispatch(addMedia({
                    _id: Date.now().toString(),
                    filename: updatedUserData.avatar,
                    size: 100,
                    fieldname: "avatar",
                    mimetype: updatedUserData.avatar.split(".")[1],

                }));
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoadingUpdatedData(false);
        }
    };

    const updatedOtherData = async (user: userProps) => {
        setLoadingUpdatedData(true);
        try {
            const url = apiEndPont + "/user";
            const res = await axios.patch(
                url,
                { ...user },
                {
                    baseURL: apiEndPont,
                    withCredentials: true,
                }
            );
            const updatedUserData: userProps = await res.data;
            if (updatedUserData) {
                appDispatch(editProfile(updatedUserData));
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoadingUpdatedData(false);
        }
    };

    const handleUpadteUserData = (data: unknown) => {
        const getData = data as userProps;
        updatedOtherData({ ...User, ...getData });
        setFocusInput("");
    };

    useEffect(() => {
        if (selectedMedia && selectedMedia.length) {
            setGrapSelectedMedia(apiEndPont + "/media/" + User.avatar || "");           
        } else {
            if (grapSelectedMedia) {
                setAvatar(grapSelectedMedia);
            }
        }        
    }, [selectedMedia]);

    useEffect(() => {
        if (User) {
            setAvatar(apiEndPont + "/media/" + User.avatar || "");
            setUserData((pre) => ({ ...pre, ...User }));
            setDisplayDateOfBirth(User.displayDateOfBirth);
            setDisplayPhoneNumber({
                code: User.displayPhoneNumber?.split("-")[0] || "",
                number: User.displayPhoneNumber?.split("-")[1] || "",
            });
        }
    }, [User]);

    console.log(loadingUpdatedData, "loadingUpdatedData");

    return (
        <main className="container">
            <div>
                {!loading ? (
                    <>
                        <div className="space-y-4 font-text">
                            {/* display avatar */}
                            <div>
                                <Displayimage
                                    url={apiEndPont + "/media/" + User.avatar || ""}
                                    setUrl={setAvatar}
                                    alt={User.userName}
                                    useCancle={true}
                                    onCancle={() => {
                                        const updatedUserData = {
                                            avatar: "",
                                        };
                                        handleUpadteUserData(updatedUserData);
                                    }}
                                    parentClassName={
                                        User.avatar?.trim() ? "border p-1 rounded-md" : ""
                                    }
                                    className="h-16 w-16 object-contain rounded-full border cursor-pointer"
                                    placeHolder={
                                        <img
                                            src={avatarPlaceholder}
                                            className="absolute top-0 bottom-0 right-0 left-0 h-16 w-16 rounded-full cursor-pointer"
                                            onClick={() => navigate("#insert-profile-picture")}
                                        />
                                    }
                                    onClick={() => navigate("#insert-profile-picture")}
                                />
                            </div>
                            {/* first name */}
                            <label htmlFor="first-name" className="block space-y-0.5">
                                <span className="block font-semibold">First name</span>
                                <span className="flex justify-between gap-10 items-center">
                                    <input
                                        id="first-name"
                                        ref={firstNameInputRef}
                                        type="text"
                                        className={`flex-1 py-1 ${focusInput === "first-name" ? "px-2" : ""
                                            } capitalize rounded-md`}
                                        autoComplete="false"
                                        placeholder="Your first name..."
                                        value={userData["name"].givenName}
                                        onChange={(e) => {
                                            setUserData((pre) => ({
                                                ...pre,
                                                name: {
                                                    givenName: e.target.value,
                                                    familyName: pre.name.familyName,
                                                },
                                            }));
                                            setChangeInputs((pre) => {
                                                if (pre.includes("first-name")) {
                                                    return pre;
                                                } else {
                                                    return [...pre, "first-name"];
                                                }
                                            });
                                        }}
                                        onFocus={() => setFocusInput("first-name")}
                                    />
                                    {changeInputs.includes("first-name") ? (
                                        <button
                                            className="text-sm border-2 border-slate-800 py-1 px-3 rounded-full cursor-pointer"
                                            onClick={() => {
                                                const updatedUserData = {
                                                    name: {
                                                        familyName: User.name?.familyName,
                                                        givenName: userData["name"].givenName,
                                                    },
                                                };
                                                handleUpadteUserData(updatedUserData);
                                                setChangeInputs((pre) =>
                                                    pre.filter((inputId) => inputId !== "first-name")
                                                );
                                            }}
                                        >
                                            Save
                                        </button>
                                    ) : (
                                        <button
                                            className="text-sm border-2 border-slate-800 py-1 px-3 rounded-full cursor-pointer"
                                            onClick={() => {
                                                if (firstNameInputRef.current) {
                                                    firstNameInputRef.current.focus();
                                                    setFocusInput("first-name");
                                                }
                                            }}
                                        >
                                            Edit
                                        </button>
                                    )}
                                </span>
                            </label>
                            {/* last name */}
                            <label htmlFor="last-name" className="block space-y-0.5">
                                <span className="block font-semibold">Last name</span>
                                <span className="flex justify-between items-center gap-10">
                                    <input
                                        id="last-name"
                                        ref={lastNameInputRef}
                                        type="text"
                                        className={`flex-1 py-1 ${focusInput === "last-name" ? "px-2" : ""
                                            } capitalize rounded-md`}
                                        placeholder="Your last name..."
                                        value={userData["name"].familyName}
                                        onChange={(e) => {
                                            setUserData((pre) => ({
                                                ...pre,
                                                name: {
                                                    givenName: pre.name.givenName,
                                                    familyName: e.target.value,
                                                },
                                            }));

                                            setChangeInputs((pre) => {
                                                if (pre.includes("last-name")) {
                                                    return pre;
                                                } else {
                                                    return [...pre, "last-name"];
                                                }
                                            });
                                        }}
                                        onFocus={() => setFocusInput("last-name")}
                                    />
                                    {changeInputs.includes("last-name") ? (
                                        <button
                                            onClick={() => {
                                                const updatedUserData = {
                                                    name: {
                                                        familyName: userData["name"].familyName,
                                                        givenName: User.name?.givenName,
                                                    },
                                                };
                                                handleUpadteUserData(updatedUserData);
                                                setChangeInputs((pre) =>
                                                    pre.filter((inputId) => inputId !== "last-name")
                                                );
                                            }}
                                            className="text-sm border-2 border-slate-800 py-1 px-3 rounded-full cursor-pointer"
                                        >
                                            Save
                                        </button>
                                    ) : (
                                        <button
                                            className="text-sm border-2 border-slate-800 py-1 px-3 rounded-full cursor-pointer"
                                            onClick={() => {
                                                if (lastNameInputRef.current) {
                                                    lastNameInputRef.current.focus();
                                                    setFocusInput("last-name");
                                                }
                                            }}
                                        >
                                            Edit
                                        </button>
                                    )}
                                </span>
                            </label>
                            {/* bio */}
                            <div id="bio">
                                <span className="block font-semibold">Bio</span>
                                <div className="flex justify-between items-center gap-10">
                                    <Texteditor
                                        editorRef={bioInputRef}
                                        wrapperClassName="flex-1"
                                        inputClassName={`w-full min-h-[100px] max-h-[10px] py-2 
                                        ${focusInput === "bio"
                                                ? "px-2 outline outline-2 outline-yellow-600 sm:outline-stone-600"
                                                : ""
                                            } 
                                        rounded-md overflow-y-auto`}
                                        placeholderValue={User.bio?.trim() ? "" : "Your bio"}
                                        useToolBar={false}
                                        autoFocus={false}
                                        onFocus={() => setFocusInput("bio")}
                                        addValue={{
                                            createNew: User.bio?.trim() ? false : true,
                                            data: (User.bio && User.bio) || "",
                                        }}
                                        setGetValue={(value) => {
                                            setUserData((pre) => ({ ...pre, bio: value._html }));
                                            setChangeInputs((pre) => {
                                                if (pre.includes("bio")) {
                                                    return pre;
                                                } else {
                                                    return [...pre, "bio"];
                                                }
                                            });
                                        }}
                                    />
                                    {changeInputs.includes("bio") ? (
                                        <button
                                            onClick={() => {
                                                const updatedUserData = {
                                                    bio: userData.bio,
                                                };
                                                handleUpadteUserData(updatedUserData);
                                                setChangeInputs((pre) =>
                                                    pre.filter((inputId) => inputId !== "bio")
                                                );
                                            }}
                                            className="text-sm border-2 border-slate-800 py-1 px-3 rounded-full cursor-pointer"
                                        >
                                            Save
                                        </button>
                                    ) : (
                                        <button
                                            className="text-sm border-2 border-slate-800 py-1 px-3 rounded-full cursor-pointer"
                                            onClick={() => {
                                                if (bioInputRef.current) {
                                                    bioInputRef.current.focus();
                                                    setFocusInput("bio");
                                                }
                                            }}
                                        >
                                            Edit
                                        </button>
                                    )}
                                </div>
                            </div>
                            {/* profession */}
                            <label htmlFor="profession" className="block space-y-0.5">
                                <span className="block font-semibold">Profession</span>
                                <span className="flex justify-between items-center gap-10">
                                    <span className="relative w-full">
                                        <input
                                            id="profession"
                                            ref={professionInputRef}
                                            type="text"
                                            placeholder="Your profession..."
                                            className={`block w-full py-1 ${focusInput === "profession" ? "px-2" : ""
                                                } rounded-md`}
                                            value={userData.profession}
                                            onChange={(e) => {
                                                setSearchProfession(e.target.value);
                                                setUserData((pre) => ({
                                                    ...pre,
                                                    profession: e.target.value,
                                                }));
                                                setChangeInputs((pre) => {
                                                    if (pre.includes("profession")) {
                                                        return pre;
                                                    } else {
                                                        return [...pre, "profession"];
                                                    }
                                                });
                                            }}
                                            onFocus={() => {
                                                setFocusInput((pre) =>
                                                    pre === "profession" ? "" : "profession"
                                                );
                                            }}
                                        />
                                        <Customselection
                                            arrOfOptions={Professions}
                                            className="top-9 right-0 left-0 w-full min-h-[180px] max-h-[180px] border border-blue-600 py-2 rounded-md shadow-md shadow-gray-400 overflow-y-auto"
                                            dropDown={focusInput === "profession" ? true : false}
                                            useSearch={true}
                                            search={searchProfession}
                                            select={userData.profession}
                                            setSelect={(value) => {
                                                setUserData((pre) => ({
                                                    ...pre,
                                                    profession: value as string,
                                                }));
                                                setChangeInputs((pre) => {
                                                    if (pre.includes("profession")) {
                                                        return pre;
                                                    } else {
                                                        return [...pre, "profession"];
                                                    }
                                                });
                                            }}
                                        />
                                    </span>
                                    {changeInputs.includes("profession") ? (
                                        <button
                                            onClick={() => {
                                                const updatedUserData = {
                                                    profession: userData.profession,
                                                };
                                                handleUpadteUserData(updatedUserData);
                                                setChangeInputs((pre) =>
                                                    pre.filter((inputId) => inputId !== "profession")
                                                );
                                                setFocusInput("");
                                            }}
                                            className="text-sm border-2 border-slate-800 py-1 px-3 rounded-full cursor-pointer"
                                        >
                                            Save
                                        </button>
                                    ) : (
                                        <button
                                            className="text-sm border-2 border-slate-800 py-1 px-3 rounded-full cursor-pointer"
                                            onClick={() => {
                                                if (professionInputRef.current) {
                                                    professionInputRef.current.focus();
                                                    setFocusInput("profession");
                                                }
                                            }}
                                        >
                                            Edit
                                        </button>
                                    )}
                                </span>
                            </label>
                            {/* display email */}
                            <label htmlFor="display-email" className="block space-y-0.5">
                                <span className="block font-semibold">Display email</span>
                                <span className="flex justify-between items-center gap-10">
                                    <input
                                        id="display-email"
                                        ref={displayEmailInputRef}
                                        type="email"
                                        className={`flex-1 py-1 ${focusInput === "display-email" ? "px-2" : ""
                                            } rounded-md`}
                                        placeholder="Display email..."
                                        value={userData.displayEmail}
                                        onChange={(e) => {
                                            setUserData((pre) => ({
                                                ...pre,
                                                displayEmail: e.target.value,
                                            }));

                                            setChangeInputs((pre) => {
                                                if (pre.includes("display-email")) {
                                                    return pre;
                                                } else {
                                                    return [...pre, "display-email"];
                                                }
                                            });
                                        }}
                                        onFocus={() => setFocusInput("display-email")}
                                    />
                                    {changeInputs.includes("display-email") ? (
                                        <button
                                            onClick={() => {
                                                const updatedUserData = {
                                                    displayEmail: userData.displayEmail,
                                                };
                                                handleUpadteUserData(updatedUserData);
                                                setChangeInputs((pre) =>
                                                    pre.filter((inputId) => inputId !== "display-email")
                                                );
                                            }}
                                            className="text-sm border-2 border-slate-800 py-1 px-3 rounded-full cursor-pointer"
                                        >
                                            Save
                                        </button>
                                    ) : (
                                        <button
                                            className="text-sm border-2 border-slate-800 py-1 px-3 rounded-full cursor-pointer"
                                            onClick={() => {
                                                if (displayEmailInputRef.current) {
                                                    displayEmailInputRef.current.focus();
                                                    setFocusInput("display-email");
                                                }
                                            }}
                                        >
                                            Edit
                                        </button>
                                    )}
                                </span>
                            </label>
                            {/* display phone number */}
                            <label
                                htmlFor="display-phone-number"
                                className="block w-full space-y-0.5"
                            >
                                <span className="block font-semibold">
                                    Display Phone number
                                </span>
                                <span className="flex justify-between items-center gap-10">
                                    <span className="flex-1 flex items-center gap-2">
                                        {focusInput === "display-phone-number" ? (
                                            <select
                                                name="countries-code"
                                                id="countries-code"
                                                value={displayPhoneNumber.code}
                                                className="text-base font-text p-1 border rounded-md"
                                                onChange={(e) => {
                                                    setDisplayPhoneNumber((pre) => ({
                                                        ...pre,
                                                        code: e.target.value,
                                                    }));
                                                    setChangeInputs((pre) => {
                                                        if (pre.includes("display-phone-number")) {
                                                            return pre;
                                                        } else {
                                                            return [...pre, "display-phone-number"];
                                                        }
                                                    });
                                                }}
                                            >
                                                {Countries && Countries.length
                                                    ? Countries.map((country) => (
                                                        <option key={country.code} value={country.code}>
                                                            {country.country} ({country.code})
                                                        </option>
                                                    ))
                                                    : null}
                                            </select>
                                        ) : null}
                                        <input
                                            id="display-phone-number"
                                            ref={displayPhoneNumberInputRef}
                                            type="number"
                                            className={`flex-1 py-1 ${focusInput === "display-phone-number" ? "px-2" : ""
                                                } rounded-md`}
                                            placeholder="Phone number..."
                                            value={displayPhoneNumber.number}
                                            onChange={(e) => {
                                                setDisplayPhoneNumber((pre) => ({
                                                    ...pre,
                                                    number: e.target.value.toString().trim(),
                                                }));
                                                setChangeInputs((pre) => {
                                                    if (pre.includes("display-phone-number")) {
                                                        return pre;
                                                    } else {
                                                        return [...pre, "display-phone-number"];
                                                    }
                                                });
                                            }}
                                            onFocus={() => setFocusInput("display-phone-number")}
                                        />
                                    </span>
                                    {changeInputs.includes("display-phone-number") ? (
                                        <button
                                            onClick={() => {
                                                const updatedUserData = {
                                                    displayPhoneNumber:
                                                        displayPhoneNumber.code +
                                                        "-" +
                                                        displayPhoneNumber.number,
                                                };
                                                handleUpadteUserData(updatedUserData);
                                                setChangeInputs((pre) =>
                                                    pre.filter(
                                                        (inputId) => inputId !== "display-phone-number"
                                                    )
                                                );
                                            }}
                                            className="text-sm border-2 border-slate-800 py-1 px-3 rounded-full cursor-pointer"
                                        >
                                            Save
                                        </button>
                                    ) : (
                                        <button
                                            className="text-sm border-2 border-slate-800 py-1 px-3 rounded-full cursor-pointer"
                                            onClick={() => {
                                                if (displayPhoneNumberInputRef.current) {
                                                    displayPhoneNumberInputRef.current.focus();
                                                    setFocusInput("display-phone-number");
                                                }
                                            }}
                                        >
                                            Edit
                                        </button>
                                    )}
                                </span>
                            </label>
                            {/* website */}
                            <label htmlFor="website" className="block space-y-0.5">
                                <span className="block font-semibold">Website</span>
                                <span className="flex justify-between items-center gap-10">
                                    <input
                                        id="website"
                                        ref={websiteInputRef}
                                        type="text"
                                        className={`flex-1 py-1 ${focusInput === "website" ? "px-2" : ""
                                            } rounded-md`}
                                        placeholder="Your website..."
                                        value={userData.website}
                                        onChange={(e) => {
                                            setUserData((pre) => ({
                                                ...pre,
                                                website: e.target.value,
                                            }));

                                            setChangeInputs((pre) => {
                                                if (pre.includes("website")) {
                                                    return pre;
                                                } else {
                                                    return [...pre, "website"];
                                                }
                                            });
                                        }}
                                        onFocus={() => setFocusInput("website")}
                                    />
                                    {changeInputs.includes("website") ? (
                                        <button
                                            onClick={() => {
                                                const updatedUserData = {
                                                    website: userData.website,
                                                };
                                                handleUpadteUserData(updatedUserData);
                                                setChangeInputs((pre) =>
                                                    pre.filter((inputId) => inputId !== "website")
                                                );
                                            }}
                                            className="text-sm border-2 border-slate-800 py-1 px-3 rounded-full cursor-pointer"
                                        >
                                            Save
                                        </button>
                                    ) : (
                                        <button
                                            className="text-sm border-2 border-slate-800 py-1 px-3 rounded-full cursor-pointer"
                                            onClick={() => {
                                                if (websiteInputRef.current) {
                                                    websiteInputRef.current.focus();
                                                    setFocusInput("website");
                                                }
                                            }}
                                        >
                                            Edit
                                        </button>
                                    )}
                                </span>
                            </label>
                            {/* birthday */}
                            <label htmlFor="birth-day" className="block space-y-1">
                                <span className="block font-semibold">Birthday</span>
                                <span className="flex justify-between items-center gap-10">
                                    <input
                                        id="birth-day"
                                        ref={birthDayInputRef}
                                        type="date"
                                        className={`flex-1 py-1 ${focusInput === "birth-day" ? "px-2" : ""
                                            } rounded-md`}
                                        placeholder="Display email..."
                                        value={userData.dateOfBirth}
                                        onChange={(e) => {
                                            setUserData((pre) => ({
                                                ...pre,
                                                dateOfBirth: e.target.value,
                                            }));

                                            setChangeInputs((pre) => {
                                                if (pre.includes("birth-day")) {
                                                    return pre;
                                                } else {
                                                    return [...pre, "birth-day"];
                                                }
                                            });
                                        }}
                                        onFocus={() => setFocusInput("birth-day")}
                                    />
                                    {changeInputs.includes("birth-day") ? (
                                        <button
                                            onClick={() => {
                                                const updatedUserData = {
                                                    displayDateOfBirth,
                                                    dateOfBirth: userData.dateOfBirth,
                                                };
                                                handleUpadteUserData(updatedUserData);
                                                setChangeInputs((pre) =>
                                                    pre.filter((inputId) => inputId !== "birth-day")
                                                );
                                            }}
                                            className="text-sm border-2 border-slate-800 py-1 px-3 rounded-full cursor-pointer"
                                        >
                                            Save
                                        </button>
                                    ) : (
                                        <button
                                            className="text-sm border-2 border-slate-800 py-1 px-3 rounded-full cursor-pointer"
                                            onClick={() => {
                                                if (birthDayInputRef.current) {
                                                    birthDayInputRef.current.focus();
                                                    setFocusInput("birth-day");
                                                }
                                            }}
                                        >
                                            Edit
                                        </button>
                                    )}
                                </span>
                                {focusInput === "birth-day" ? (
                                    <span className="flex items-center gap-2 w-full">
                                        <span className="text-sm font-text text-wrap">
                                            Display Birthday
                                        </span>
                                        <span className="flex flex-nowrap items-center gap-1 text-sm font-text font-semibold border border-gray-500 shadow-inner shadow-gray-500 bg-gray-100">
                                            <button
                                                className={` py-0.5 px-1.5 ${!displayDateOfBirth ? "bg-white" : ""
                                                    } cursor-pointer`}
                                                onClick={() => {
                                                    setDisplayDateOfBirth(false);
                                                    setChangeInputs((pre) => {
                                                        if (pre.includes("birth-day")) {
                                                            return pre;
                                                        } else {
                                                            return [...pre, "birth-day"];
                                                        }
                                                    });
                                                }}
                                            >
                                                No
                                            </button>
                                            <button
                                                className={`py-0.5 px-1.5 ${displayDateOfBirth ? "bg-white" : ""
                                                    } cursor-pointer`}
                                                onClick={() => {
                                                    setDisplayDateOfBirth(true);
                                                    setChangeInputs((pre) => {
                                                        if (pre.includes("birth-day")) {
                                                            return pre;
                                                        } else {
                                                            return [...pre, "birth-day"];
                                                        }
                                                    });
                                                }}
                                            >
                                                Yes
                                            </button>
                                        </span>
                                    </span>
                                ) : null}
                            </label>
                            {/* sex (selection) */}
                            <label htmlFor="sex" className="block space-y-0.5">
                                <span className="block font-semibold">Sex</span>
                                <span className="flex justify-between items-center gap-10">
                                    <span className="flex-1 block relative">
                                        <span
                                            id="sex"
                                            ref={sexInputRef}
                                            className={`block w-full py-1 ${focusInput === "sex"
                                                ? "px-2 outline outline-2 outline-yellow-600 sm:outline-stone-600"
                                                : ""
                                                } rounded-md`}
                                            onClick={() => setFocusInput("sex")}
                                        >
                                            {userData.sex || "Your sex"}
                                        </span>
                                        <Customselection
                                            arrOfOptions={["Male", "Female"]}
                                            className="top-9 right-0 left-0 w-full  bg-white border border-blue-600 py-2 rounded-md shadow-md shadow-gray-400 overflow-y-auto z-10"
                                            dropDown={focusInput === "sex" ? true : false}
                                            useSearch={false}
                                            select={userData.sex}
                                            setSelect={(value) => {
                                                setFocusInput("");
                                                setUserData((pre) => ({
                                                    ...pre,
                                                    sex: value as string,
                                                }));
                                                setChangeInputs((pre) => {
                                                    if (pre.includes("sex")) {
                                                        return pre;
                                                    } else {
                                                        return [...pre, "sex"];
                                                    }
                                                });
                                            }}
                                        />
                                    </span>
                                    {changeInputs.includes("sex") ? (
                                        <button
                                            onClick={() => {
                                                const updatedUserData = {
                                                    sex: userData.sex,
                                                };
                                                handleUpadteUserData(updatedUserData);
                                                setChangeInputs((pre) =>
                                                    pre.filter((inputId) => inputId !== "sex")
                                                );
                                            }}
                                            className="text-sm border-2 border-slate-800 py-1 px-3 rounded-full cursor-pointer"
                                        >
                                            Save
                                        </button>
                                    ) : (
                                        <button
                                            className="text-sm border-2 border-slate-800 py-1 px-3 rounded-full cursor-pointer"
                                            onClick={() => {
                                                if (sexInputRef.current) {
                                                    sexInputRef.current.focus();
                                                    setFocusInput("sex");
                                                }
                                            }}
                                        >
                                            Edit
                                        </button>
                                    )}
                                </span>
                            </label>
                            {/* country (selection) */}
                            <label htmlFor="country" className="block space-y-0.5">
                                <span className="block font-semibold">Country</span>
                                <span className="flex justify-between items-center gap-10">
                                    <span className="relative w-full">
                                        <input
                                            id="country"
                                            ref={countryInputRef}
                                            type="text"
                                            placeholder="Your country..."
                                            className={`block w-full py-1 ${focusInput === "country" ? "px-2" : ""
                                                } rounded-md`}
                                            value={userData.country}
                                            onChange={(e) => {
                                                setSearchCountry(e.target.value);
                                                setUserData((pre) => ({
                                                    ...pre,
                                                    country: e.target.value,
                                                }));
                                                setChangeInputs((pre) => {
                                                    if (pre.includes("country")) {
                                                        return pre;
                                                    } else {
                                                        return [...pre, "country"];
                                                    }
                                                });
                                            }}
                                            onFocus={() => {
                                                setFocusInput((pre) =>
                                                    pre === "country" ? "" : "country"
                                                );
                                            }}
                                        />
                                        <Customselection
                                            arrOfOptions={Countries.map((country) => country.country)}
                                            className="bottom-9 right-0 left-0 w-full min-h-[180px] max-h-[180px] border border-blue-600 py-2 rounded-md shadow-md shadow-gray-400 overflow-y-auto"
                                            useSearch={true}
                                            search={searchCountry}
                                            select={userData.country}
                                            setSelect={(value) => {
                                                setUserData((pre) => ({
                                                    ...pre,
                                                    country: value as string,
                                                }));
                                                setChangeInputs((pre) => {
                                                    if (pre.includes("country")) {
                                                        return pre;
                                                    } else {
                                                        return [...pre, "country"];
                                                    }
                                                });
                                            }}
                                            dropDown={focusInput === "country" ? true : false}
                                        />
                                    </span>
                                    {changeInputs.includes("country") ? (
                                        <button
                                            onClick={() => {
                                                const updatedUserData = {
                                                    country: userData.country,
                                                };
                                                handleUpadteUserData(updatedUserData);
                                                setChangeInputs((pre) =>
                                                    pre.filter((inputId) => inputId !== "country")
                                                );
                                                setFocusInput("");
                                            }}
                                            className="text-sm border-2 border-slate-800 py-1 px-3 rounded-full cursor-pointer"
                                        >
                                            Save
                                        </button>
                                    ) : (
                                        <button
                                            className="text-sm border-2 border-slate-800 py-1 px-3 rounded-full cursor-pointer"
                                            onClick={() => {
                                                if (countryInputRef.current) {
                                                    countryInputRef.current.focus();
                                                    setFocusInput("country");
                                                }
                                            }}
                                        >
                                            Edit
                                        </button>
                                    )}
                                </span>
                            </label>
                            {/* create sapce */}
                            <div className="space">
                                <span className="space block mt-12"></span>
                            </div>
                            {/* update all user data btn */}
                            <span className="w-full flex justify-center items-center">
                                {changeInputs.length > 1 ? (
                                    <Button
                                        fieldName={"Save all"}
                                        className="text-base px-10 py-1.5 bg-green-800 hover:bg-green-600 active:bg-green-600 text-white font-semibold rounded-full"
                                        onClick={() => {
                                            const updatedUserData = {
                                                ...userData,
                                                displayPhoneNumber:
                                                    displayPhoneNumber.code +
                                                    "-" +
                                                    displayPhoneNumber.number,
                                                displayDateOfBirth,
                                            };
                                            handleUpadteUserData(updatedUserData);
                                            setChangeInputs([""]);
                                        }}
                                    />
                                ) : null}
                            </span>
                        </div>
                        {/* model for profile picture */}
                        <Model
                            id="insert-profile-picture"                            
                            children={
                                <div className="font-text bg-white px-8 pb-6 rounded-md -mt-[15%]">
                                    {/* header */}
                                    <header className="flex justify-start items-center gap-4 mt-2 mb-4">
                                        <button
                                            className="cursor-pointer"
                                            onClick={() => navigate("")}
                                        >
                                            <IoMdArrowRoundBack size={20} />
                                        </button>
                                        <div className="flex-1 flex justify-center">
                                            <span className="block font-prim text-2xl font-bold">
                                                Profile picture
                                            </span>
                                        </div>
                                    </header>
                                    {/* body change profile picture */}
                                    <main className="w-full flex justify-center items-center">
                                        {/* display avatar */}
                                        <div>
                                            <Displayimage
                                                url={avatar}
                                                setUrl={setAvatar}
                                                useCancle={false}
                                                alt={avatar}
                                                parentClassName={
                                                    avatar.trim() ? "border p-1 rounded-md" : ""
                                                }
                                                className="h-[100px] w-[100px] object-contain rounded-full border cursor-pointer"
                                                placeHolder={
                                                    <img
                                                        src={avatarPlaceholder}
                                                        className="absolute top-0 bottom-0 right-0 h-[100px] w-[100px] rounded-full cursor-pointer"
                                                        onClick={() => navigate(`?url=${avatar}&type=image#single-image`)}
                                                    />
                                                }
                                                onClick={() => navigate(`?url=${avatar}&type=image#single-image`)}
                                            />
                                        </div>
                                        {/* profile picture btn */}
                                        <div className="flex justify-between items-center gap-8 mt-8 mb-4">
                                            {/* view btn */}
                                            <span>
                                                <button
                                                    className="cursor-pointer"
                                                    onClick={() => navigate(`?url=${avatar}&type=image#single-image`)}
                                                >
                                                    Icon
                                                </button>
                                                View
                                            </span>
                                            {/* get image from device btn  */}
                                            <Fileinput
                                                id="choose-profile-picture"
                                                accept="image/png, image/gif, image/jpeg"
                                                type="image"
                                                fieldName="Device"
                                                className="cursor-pointer"
                                                handleGetFile={async (fileList) => {
                                                    if (fileList) {
                                                        setBlob(fileList[0]);
                                                        const data = await getLocalFiles(fileList);
                                                        setAvatar(data[0].url);
                                                    }
                                                }}
                                            />
                                            {/* display galary btn  */}
                                            <span className="text-sm text-center">
                                                <button
                                                    className="block text-white bg-orange-500 p-3 rounded-full shadow-sm cursor-pointer"
                                                    onClick={() => {                                                        
                                                        navigate("#display-image-galary");
                                                    }}
                                                >
                                                    <IoMdImages size={25} className="text-white" />
                                                </button>
                                                Galary
                                            </span>
                                        </div>
                                    </main>
                                    {/* change avatar btn */}
                                    <footer>
                                        {avatar && avatar.trim() !== User.avatar ? (
                                            <button
                                                className="text-white text-base font-text font-semibold w-full py-1.5 bg-blue-600 border rounded-lg shadow "
                                                onClick={() => {
                                                    if (blob) updatedAvatar(blob);
                                                    navigate("");
                                                }}
                                            >
                                                Add photo
                                            </button>
                                        ) :
                                            null
                                        }
                                    </footer>
                                </div>
                            }
                        />
                    </>
                ) : (
                    <div>loading...</div>
                )}
            </div>
        </main>
    );
};

export default Updateprofile;
