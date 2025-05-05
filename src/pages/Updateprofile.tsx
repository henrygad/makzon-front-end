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
import Makzontexteditor from "makzontexteditor";
import Customselection from "../components/Customselection";
import { Countries, Professions } from "../assets/date";
import { Button } from "../components/Button";
import { addMedia } from "../redux/slices/userMediaSlices";
import axios from "axios";
import useSanitize from "../hooks/useSanitize";
import Displayscreenloading from "../components/Displayscreenloading";
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

    const [userData, setUserData] = useState<userProps | null>(null);
    const [displayAvatar, setDisplayAvatar] = useState("");
    const [displayPhoneNumber, setDisplayPhoneNumber] = useState<{
        code: string;
        number: string | undefined;
    }>({ code: "+234", number: undefined });

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
    const [onChangeInInputs, setOnChangeInInputs] = useState([""]);
    const { getLocalFiles } = useGetLocalFiles();
    const holdSelectedMediaRef = useRef<string | undefined>(undefined);

    const [blob, setBlob] = useState<Blob | undefined>(undefined);
    const [loadingUpdatedData, setLoadingUpdatedData] = useState(false);
    const sanitize = useSanitize();

    const updatedAvatar = async (file: Blob) => {
        setLoadingUpdatedData(true);
        try {
            const formData = new FormData();
            formData.append("avatar", file);

            const url = apiEndPont + "/user";
            const res = await axios.patch(url, formData, {
                baseURL: apiEndPont,
                withCredentials: true,
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            });
            const updatedUserData: userProps = await res.data.data;
            appDispatch(editProfile(updatedUserData));
            appDispatch(addMedia({
                _id: Date.now().toString(),
                filename: updatedUserData?.avatar,
                size: 100,
                fieldname: "avatar",
                mimetype: updatedUserData?.avatar.split(".")[1],
                uploader: updatedUserData.userName
            }));

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
            const updatedUserData: userProps = await res.data.data;
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
            holdSelectedMediaRef.current = selectedMedia[0].filename;
        } else {
            if (holdSelectedMediaRef.current) {
                setDisplayAvatar(apiEndPont + "/media/" + holdSelectedMediaRef.current);
                setUserData((pre) => pre ? ({ ...pre, avatar: holdSelectedMediaRef.current! }) : pre);
                setBlob(undefined);
                setOnChangeInInputs((pre) => pre.includes("avatar") ? pre : [...pre, "avatar"]);
                holdSelectedMediaRef.current = undefined;
            }
        }
    }, [selectedMedia]);

    useEffect(() => {
        if (User) {
            if (User.avatar) {
                setDisplayAvatar(apiEndPont + "/media/" + User.avatar);
            }
            setUserData((pre) => pre ? ({ ...pre, ...User }) : ({ ...User }));
            setDisplayDateOfBirth(User.displayDateOfBirth);
            if (User.displayPhoneNumber &&
                User.displayPhoneNumber.split("-")[1]) {
                setDisplayPhoneNumber({
                    code: User.displayPhoneNumber.split("-")[0],
                    number: User.displayPhoneNumber.split("-")[1],
                });
            }
        }
    }, [User]);

    return (
        <main className="container font-text overflow-x-hidden">
            {!loading ? (
                <div className="space-y-4">
                    {/* display avatar */}
                    <span className="block">
                        <Displayimage
                            url={User?.avatar ? apiEndPont + "/media/" + User.avatar : ""}
                            alt={User.userName}
                            useCancle={false}
                            className="h-16 w-16 object-contain rounded-full border cursor-pointer"
                            placeHolder={
                                <img
                                    src={avatarPlaceholder}
                                    className="absolute top-0 bottom-0 right-0 left-0 h-16 w-16  object-contain rounded-full border cursor-pointer"
                                    onClick={() => navigate("#insert-profile-picture")}
                                />
                            }
                            loadingPlaceHolder={<span className="absolute top-0 bottom-0 right-0 left-0 h-16 w-16 object-contain rounded-full border border-slate-200 bg-slate-200 animate-pulse"></span>}
                            onClick={() => navigate("#insert-profile-picture")}
                        />
                    </span>
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
                                value={userData?.name?.givenName || ""}
                                onChange={(e) => {
                                    setUserData((pre) => pre ? ({
                                        ...pre,
                                        name: {
                                            givenName: e.target.value,
                                            familyName: pre.name?.familyName,
                                        },
                                    }) : pre);
                                    setOnChangeInInputs((pre) => {
                                        if (pre.includes("first-name")) {
                                            return pre;
                                        } else {
                                            return [...pre, "first-name"];
                                        }
                                    });
                                }}
                                onFocus={() => setFocusInput("first-name")}
                            />
                            {onChangeInInputs.includes("first-name") ? (
                                <button
                                    className="text-sm border-2 border-slate-800 py-1 px-3 rounded-full cursor-pointer"
                                    onClick={() => {
                                        const updatedUserData = {
                                            name: {
                                                familyName: User.name?.familyName,
                                                givenName: userData?.name?.givenName,
                                            },
                                        };
                                        handleUpadteUserData(updatedUserData);
                                        setOnChangeInInputs((pre) =>
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
                        <span className="flex justify-between items-center gap-6">
                            <input
                                id="last-name"
                                ref={lastNameInputRef}
                                type="text"
                                className={`flex-1 py-1 ${focusInput === "last-name" ? "px-2" : ""
                                    } capitalize rounded-md`}
                                placeholder="Your last name..."
                                value={userData?.name?.familyName || ""}
                                onChange={(e) => {
                                    setUserData((pre) => pre ? ({
                                        ...pre,
                                        name: {
                                            givenName: pre.name?.givenName,
                                            familyName: e.target.value,
                                        },
                                    }) : pre);

                                    setOnChangeInInputs((pre) => {
                                        if (pre.includes("last-name")) {
                                            return pre;
                                        } else {
                                            return [...pre, "last-name"];
                                        }
                                    });
                                }}
                                onFocus={() => setFocusInput("last-name")}
                            />
                            {onChangeInInputs.includes("last-name") ? (
                                <button
                                    onClick={() => {
                                        const updatedUserData = {
                                            name: {
                                                familyName: userData?.name?.familyName,
                                                givenName: User.name?.givenName,
                                            },
                                        };
                                        handleUpadteUserData(updatedUserData);
                                        setOnChangeInInputs((pre) =>
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
                        <div className="flex justify-between items-center gap-6">
                            <Makzontexteditor
                                inputRef={bioInputRef}
                                wrapperClassName="flex-1"
                                inputClassName={`w-full min-h-[100px] max-h-[10px] py-2 
                                        ${focusInput === "bio"
                                        ? "px-2 outline outline-2 outline-yellow-600 sm:outline-stone-600"
                                        : ""
                                    } 
                                        rounded-md overflow-y-auto`}
                                placeholder={User.bio?.trim() ? "" : "Your bio"}
                                useToolBar={false}
                                autoFocus={false}                                
                                setContext={{
                                    new: User.bio?.trim() ? false : true,
                                    context: sanitize(User.bio).__html || "",
                                }}
                                setGetValue={(value) => {
                                    setUserData((pre) => pre ? ({ ...pre, bio: value._html }) : pre);
                                    setOnChangeInInputs((pre) => {
                                        if (pre.includes("bio")) {
                                            return pre;
                                        } else {
                                            return [...pre, "bio"];
                                        }
                                    });
                                }}
                            />
                            {onChangeInInputs.includes("bio") ? (
                                <button
                                    onClick={() => {
                                        const updatedUserData = {
                                            bio: userData?.bio,
                                        };
                                        handleUpadteUserData(updatedUserData);
                                        setOnChangeInInputs((pre) =>
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
                        <span className="flex justify-between items-center gap-6">
                            <span className="relative w-full">
                                <input
                                    id="profession"
                                    ref={professionInputRef}
                                    type="text"
                                    placeholder="Your profession..."
                                    className={`block w-full py-1 ${focusInput === "profession" ? "px-2" : ""
                                        } rounded-md`}
                                    value={userData?.profession || ""}
                                    onChange={(e) => {
                                        setSearchProfession(e.target.value);
                                        setUserData((pre) => pre ? ({
                                            ...pre,
                                            profession: e.target.value,
                                        }) : pre);
                                        setOnChangeInInputs((pre) => {
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
                                    select={userData?.profession || ""}
                                    setSelect={(value) => {
                                        setUserData((pre) => pre ? ({
                                            ...pre,
                                            profession: value as string,
                                        }) : pre);
                                        setOnChangeInInputs((pre) => {
                                            if (pre.includes("profession")) {
                                                return pre;
                                            } else {
                                                return [...pre, "profession"];
                                            }
                                        });
                                    }}
                                />
                            </span>
                            {onChangeInInputs.includes("profession") ? (
                                <button
                                    onClick={() => {
                                        const updatedUserData = {
                                            profession: userData?.profession,
                                        };
                                        handleUpadteUserData(updatedUserData);
                                        setOnChangeInInputs((pre) =>
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
                        <span className="flex justify-between items-center gap-6">
                            <input
                                id="display-email"
                                ref={displayEmailInputRef}
                                type="email"
                                className={`flex-1 py-1 ${focusInput === "display-email" ? "px-2" : ""
                                    } rounded-md`}
                                placeholder="Display email..."
                                value={userData?.displayEmail || ""}
                                onChange={(e) => {
                                    setUserData((pre) => pre ? ({
                                        ...pre,
                                        displayEmail: e.target.value,
                                    }) : pre);

                                    setOnChangeInInputs((pre) => {
                                        if (pre.includes("display-email")) {
                                            return pre;
                                        } else {
                                            return [...pre, "display-email"];
                                        }
                                    });
                                }}
                                onFocus={() => setFocusInput("display-email")}
                            />
                            {onChangeInInputs.includes("display-email") ? (
                                <button
                                    onClick={() => {
                                        const updatedUserData = {
                                            displayEmail: userData?.displayEmail,
                                        };
                                        handleUpadteUserData(updatedUserData);
                                        setOnChangeInInputs((pre) =>
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
                        <span className="flex justify-between items-center gap-6">
                            <span className="flex-1 flex items-center gap-2">
                                {focusInput === "display-phone-number" ? (
                                    <select
                                        name="countries-code"
                                        id="countries-code"
                                        value={displayPhoneNumber?.code}
                                        className="text-base font-text p-1 border rounded-md"
                                        onChange={(e) => {
                                            setDisplayPhoneNumber((pre) => ({ ...pre, code: e.target.value }));
                                            setOnChangeInInputs((pre) => {
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
                                    value={displayPhoneNumber?.number || ""}
                                    onChange={(e) => {
                                        setDisplayPhoneNumber((pre) => ({ ...pre, number: e.target.value.toString().trim() }));
                                        setOnChangeInInputs((pre) => {
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
                            {onChangeInInputs.includes("display-phone-number") ? (
                                <button
                                    onClick={() => {
                                        const updatedUserData = {
                                            displayPhoneNumber: displayPhoneNumber?.number ? (displayPhoneNumber.code + "-" + displayPhoneNumber.number) : undefined,
                                        };
                                        handleUpadteUserData(updatedUserData);
                                        setOnChangeInInputs((pre) =>
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
                        <span className="flex justify-between items-center gap-6">
                            <input
                                id="website"
                                ref={websiteInputRef}
                                type="text"
                                className={`flex-1 py-1 ${focusInput === "website" ? "px-2" : ""
                                    } rounded-md`}
                                placeholder="Your website..."
                                value={userData?.website || ""}
                                onChange={(e) => {
                                    setUserData((pre) => pre ? ({
                                        ...pre,
                                        website: e.target.value,
                                    }) : pre);

                                    setOnChangeInInputs((pre) => {
                                        if (pre.includes("website")) {
                                            return pre;
                                        } else {
                                            return [...pre, "website"];
                                        }
                                    });
                                }}
                                onFocus={() => setFocusInput("website")}
                            />
                            {onChangeInInputs.includes("website") ? (
                                <button
                                    onClick={() => {
                                        const updatedUserData = {
                                            website: userData?.website,
                                        };
                                        handleUpadteUserData(updatedUserData);
                                        setOnChangeInInputs((pre) =>
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
                        <span className="flex justify-between items-center gap-6">
                            <input
                                id="birth-day"
                                ref={birthDayInputRef}
                                type="date"
                                className={`flex-1 py-1 ${focusInput === "birth-day" ? "px-2" : ""
                                    } rounded-md`}
                                placeholder="Display email..."
                                value={userData?.dateOfBirth || ""}
                                onChange={(e) => {
                                    setUserData((pre) => pre ? ({
                                        ...pre,
                                        dateOfBirth: e.target.value,
                                    }) : pre);

                                    setOnChangeInInputs((pre) => {
                                        if (pre.includes("birth-day")) {
                                            return pre;
                                        } else {
                                            return [...pre, "birth-day"];
                                        }
                                    });
                                }}
                                onFocus={() => setFocusInput("birth-day")}
                            />
                            {onChangeInInputs.includes("birth-day") ? (
                                <button
                                    onClick={() => {
                                        const updatedUserData = {
                                            displayDateOfBirth,
                                            dateOfBirth: userData?.dateOfBirth,
                                        };
                                        handleUpadteUserData(updatedUserData);
                                        setOnChangeInInputs((pre) =>
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
                                            setOnChangeInInputs((pre) => {
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
                                            setOnChangeInInputs((pre) => {
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
                        <span className="flex justify-between items-center gap-6">
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
                                    {userData?.sex || "Your sex"}
                                </span>
                                <Customselection
                                    arrOfOptions={["Male", "Female"]}
                                    className="top-9 right-0 left-0 w-full  bg-white border border-blue-600 py-2 rounded-md shadow-md shadow-gray-400 overflow-y-auto z-10"
                                    dropDown={focusInput === "sex" ? true : false}
                                    useSearch={false}
                                    select={userData?.sex || ""}
                                    setSelect={(value) => {
                                        setFocusInput("");
                                        setUserData((pre) => pre ? ({
                                            ...pre,
                                            sex: value as string,
                                        }) : pre);
                                        setOnChangeInInputs((pre) => {
                                            if (pre.includes("sex")) {
                                                return pre;
                                            } else {
                                                return [...pre, "sex"];
                                            }
                                        });
                                    }}
                                />
                            </span>
                            {onChangeInInputs.includes("sex") ? (
                                <button
                                    onClick={() => {
                                        const updatedUserData = {
                                            sex: userData?.sex,
                                        };
                                        handleUpadteUserData(updatedUserData);
                                        setOnChangeInInputs((pre) =>
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
                        <span className="flex justify-between items-center gap-6">
                            <span className="relative w-full">
                                <input
                                    id="country"
                                    ref={countryInputRef}
                                    type="text"
                                    placeholder="Your country..."
                                    className={`block w-full py-1 ${focusInput === "country" ? "px-2" : ""
                                        } rounded-md`}
                                    value={userData?.country || ""}
                                    onChange={(e) => {
                                        setSearchCountry(e.target.value);
                                        setUserData((pre) => pre ? ({
                                            ...pre,
                                            country: e.target.value,
                                        }) : pre);
                                        setOnChangeInInputs((pre) => {
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
                                    select={userData?.country || ""}
                                    setSelect={(value) => {
                                        setUserData((pre) => pre ? ({
                                            ...pre,
                                            country: value as string,
                                        }) : pre);
                                        setOnChangeInInputs((pre) => {
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
                            {onChangeInInputs.includes("country") ? (
                                <button
                                    onClick={() => {
                                        const updatedUserData = {
                                            country: userData?.country,
                                        };
                                        handleUpadteUserData(updatedUserData);
                                        setOnChangeInInputs((pre) =>
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
                    <span className="space">
                        <span className="space block mt-12"></span>
                    </span>
                    {/* update all user data btn */}
                    <span className="w-full flex justify-center items-center">
                        {onChangeInInputs.length > 1 ? (
                            <Button
                                fieldName={"Save all"}
                                className="text-base px-10 py-1.5 bg-green-800 hover:bg-green-600 active:bg-green-600 text-white font-semibold rounded-full"
                                onClick={() => {
                                    const updatedUserData = {
                                        ...userData,
                                        displayPhoneNumber: (
                                            displayPhoneNumber?.number ?
                                                (displayPhoneNumber.code + "-" + displayPhoneNumber.number) :
                                                undefined
                                        ),
                                        displayDateOfBirth,
                                    };
                                    handleUpadteUserData(updatedUserData);
                                    setOnChangeInInputs([""]);
                                }}
                            />
                        ) : null}
                    </span>

                    {/* Screen loading */}
                    <Displayscreenloading
                        loading={loadingUpdatedData}
                    />

                    {/* model for profile picture */}
                    <Model
                        id="insert-profile-picture"
                        children={
                            <div className="font-text bg-white px-8 pb-6 rounded-md -mt-[15%]">
                                {/* header */}
                                <header className="flex justify-start items-center gap-4 mt-2 mb-4">
                                    <button
                                        className="cursor-pointer"
                                        onClick={() => navigate(-1)}
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
                                <main>
                                    {/* display avatar */}
                                    <div className="flex justify-center items-center">
                                        <Displayimage
                                            url={displayAvatar}
                                            useCancle={true}
                                            onCancle={() => {
                                                setDisplayAvatar("");
                                                setUserData((pre) => pre ? ({
                                                    ...pre,
                                                    avatar: ""
                                                }) : pre);
                                                setBlob(undefined);
                                                setOnChangeInInputs((pre) => pre.includes("avatar") ? pre : [...pre, "avatar"]);
                                            }}
                                            parentClassName=""
                                            className="h-[100px] w-[100px] object-contain rounded-full border cursor-pointer"
                                            placeHolder={
                                                <img
                                                    src={avatarPlaceholder}
                                                    className="absolute top-0 bottom-0 right-0 h-[100px] w-[100px] rounded-full object-contain border cursor-pointer"
                                                    onClick={() => navigate(`?url=${displayAvatar}&type=image#single-image`)}
                                                />
                                            }
                                            loadingPlaceHolder={<span className="absolute top-0 bottom-0 right-0 left-0 h-[100px] w-[100px] rounded-full border border-slate-200 bg-slate-200 animate-pulse"></span>}
                                            onClick={() => navigate(`?url=${displayAvatar}&type=image#single-image`)}
                                        />
                                    </div>
                                    {/* profile picture btn */}
                                    <div className="flex justify-between items-center gap-8 mt-8 mb-4">
                                        {/* view btn */}
                                        <span>
                                            <button
                                                className="cursor-pointer"
                                                onClick={() => navigate(`?url=${displayAvatar}&type=image#single-image`)}
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
                                                    setDisplayAvatar(data[0].url);
                                                    setOnChangeInInputs((pre) => pre.includes("avatar") ? pre : [...pre, "avatar"]);
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
                                    {onChangeInInputs.includes("avatar") ?
                                        (<button
                                            className="text-white text-base font-text font-semibold w-full py-1.5 bg-blue-600 border rounded-lg shadow "
                                            onClick={() => {
                                                if (blob) {
                                                    updatedAvatar(blob);
                                                } else {
                                                    const updatedUserData = {
                                                        avatar: userData?.avatar
                                                    };
                                                    handleUpadteUserData(updatedUserData);
                                                }
                                                setOnChangeInInputs((pre) => pre.filter(item => item !== "avatar"));
                                                navigate(-1);
                                            }}
                                        >
                                            Save
                                        </button>
                                        ) :
                                        null
                                    }
                                </footer>
                            </div>
                        }
                    />
                </div>
            ) : (
                <div className="space-y-4">
                    loading update profile page...
                </div>
            )}
        </main>
    );
};

export default Updateprofile;
