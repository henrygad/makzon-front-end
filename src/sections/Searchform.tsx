import { FaHistory } from "react-icons/fa";
import { RiSearch2Line } from "react-icons/ri";
import useDialog from "../hooks/useDialog";
import { useRef, useState } from "react";
import useClickOutSide from "../hooks/useClickOutSide";
import { IoMdArrowRoundBack } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import postProps from "../types/post.type";
import userProps from "../types/user.type";
import errorProps from "../types/error.type";
const apiEndPont = import.meta.env.VITE_DOMAIN_NAME_BACKEND;


type Props = {
    searchHistories: { _id: string, search: string }[] | null
    setSearchHistories: React.Dispatch<React.SetStateAction<{ _id: string, search: string }[] | null>>
    postSearchResults: postProps[] | null
    setpostSearchResults: React.Dispatch<React.SetStateAction<postProps[] | null>>
    userSearchResults: userProps[] | null
    setuUserSearchResults: React.Dispatch<React.SetStateAction<userProps[] | null>>
    searchError: string
    setSearchError: React.Dispatch<React.SetStateAction<string>>
};


const Searchform = ({
    searchHistories,
    setSearchHistories,   
    setpostSearchResults,    
    setuUserSearchResults,    
    setSearchError
}: Props) => {

    const { dialog, handleDialog } = useDialog();
    const dropRef = useRef<HTMLDivElement | null>(null);
    const [search, setSearch] = useState("");
    const searchInputRef = useRef<HTMLInputElement | null>(null);

    const navigate = useNavigate();

    useClickOutSide(dropRef, () => {
        if (dialog) handleDialog();
    });

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (!search.trim()) return;
        setSearch("");

        if (dialog) handleDialog();
        if (searchInputRef && searchInputRef.current) {
            searchInputRef.current.blur();
        }
    
        const query = new URLSearchParams({
            title: search,
            body: search,
            catigory: search,
            userName: search,
        });
        const url = apiEndPont + "/search?" + query.toString();
        axios(url)
            .then(res => res.data)
            .then(async (data) => {
                const { users, posts } = data.data as { users: userProps[], posts: postProps[] };
                setpostSearchResults(posts);
                setuUserSearchResults(users);

                axios.post(apiEndPont + "/search/history", { searched: search })
                    .then(res => res.data)
                    .then(data => {
                        const searched = data.data as { _id: string, search: string };                        
                        if (searchHistories && searchHistories.length) {
                            const isExist = searchHistories.find((history) => history.search === searched.search);
                            if (isExist) return;
                        }
                        setSearchHistories((pre) => pre ? [searched, ...pre] : [searched]);
                    })
                    .catch(error => console.error(error));

            })
            .catch((error) => {
                const getError = error as errorProps;
                const errorMsg: string = getError.response.data.message;
                setSearchError(errorMsg);
                console.error(error);
            })
            .finally(() => {
                navigate("/search");
            });
    };

    return (
        <section ref={dropRef} className="relative w-full h-full">
            <form
                id="search-form"
                className={`flex items-center justify-between gap-2 border-slate-300 px-4
                  ${dialog
                        ? "border-t-2 border-r-2 border-l-2 rounded-t-2xl"
                        : "border-2 rounded-2xl shadow-sm"
                    }
                `}
                onSubmit={handleSearch}

            >
                <>
                    {!dialog ? (
                        <span className="cursor-pointer"
                            onClick={() => {
                                handleDialog();
                                if (searchInputRef &&
                                    searchInputRef.current) {
                                    searchInputRef.current.focus();
                                }

                            }}>
                            <FaHistory className="text-slate-400" size={18} />
                        </span>
                    ) : (
                        <span className="cursor-pointer" onClick={handleDialog}>
                            <IoMdArrowRoundBack className="text-slate-400" size={20} />
                        </span>
                    )}
                </>

                <label htmlFor="search" className="flex-1 flex">
                    <input
                        ref={searchInputRef}
                        id="search"
                        type="text"
                        placeholder="Search..."
                        autoComplete="true"
                        className="flex-1 font-text text-sm text-slate-600 font-medium w-full min-w-0 outline-none px-2 py-2"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        onFocus={() => {
                            if (searchHistories && searchHistories.length) {
                                handleDialog();
                            }
                        }}
                    />
                </label>
                <span>
                    {!dialog ? (
                        <button className="flex items-center cursor-pointer">
                            <RiSearch2Line className="text-slate-400" size={20} />
                        </button>
                    ) : null}
                </span>
            </form>

            {/* display search history */}
            <>
                {dialog ? (
                    <div className="p-4 border-slate-300 border-b-2 border-r-2 border-l-2 border-t rounded-b-2xl shadow-lg mt-.5">
                        <header className="flex justify-between gap-4">
                            <span className="font-test text-base text-slate-600 text-start font-semibold">
                                Recent Searches
                            </span>
                            <span className="font-test text-base text-blue-800 text-start font-semibold">
                                See All
                            </span>
                        </header>
                        <main>
                            <div className="space-y-4 mt-4">
                                {searchHistories && searchHistories.length
                                    ? searchHistories.map((history) => (
                                        <span
                                            key={history._id}
                                            className="font-text text-sm text-nowrap whitespace-break-spaces"
                                            onClick={()=> setSearch(history.search)}
                                        >
                                            {history.search}
                                        </span>
                                    ))
                                    : null}
                            </div>
                        </main>
                        <footer></footer>
                    </div>
                ) : null}
            </>
        </section>
    );
};

export default Searchform;
