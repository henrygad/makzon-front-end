import postProps from "../types/post.type";
import userProps from "../types/user.type";
import { useLocation, useNavigate } from "react-router-dom";
import Tab from "../components/Tab";
import Searchform from "../sections/Searchform";
import Displaymultipleusers from "../sections/Displaymultipleusers";
import Displaymultipleposts from "../sections/Displaymultipleposts";

const Searcherror = ({ error }: { error: string }) => {
    return <section>
        <div>
            <span>{error}</span>
        </div>
    </section>;
};


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

const Searchresult = ({
    searchHistories,
    setSearchHistories,
    postSearchResults,
    setpostSearchResults,
    userSearchResults,
    setuUserSearchResults,
    searchError,
    setSearchError
}: Props) => {

    const navigate = useNavigate();
    const location = useLocation();   

    return <main className="container">
        <Searchform
            searchHistories={searchHistories}
            setSearchHistories={setSearchHistories}
            setpostSearchResults={setpostSearchResults}
            setuUserSearchResults={setuUserSearchResults}
            postSearchResults={postSearchResults}
            userSearchResults={userSearchResults}
            searchError={searchError}
            setSearchError={setSearchError}
        />
        <section className="mt-4 mb-5">
            <menu className="px-2">
                <ul className="flex justify-between items-center gap-4 font-text text-sm">
                    <li
                        className={`transition-colors delay-200 border-b-4 
                        ${(location.hash === "#all-search" ||
                                location.hash === ""
                            ) ? "border-green-700" : ""} 
                        cursor-pointer rounded`}
                        onClick={() => navigate("#all-search")}
                    >
                        All
                    </li>
                    <li
                        className={`transition-colors delay-200 border-b-4 
                        ${location.hash === "#users-search" ? "border-green-700" : ""} 
                        cursor-pointer rounded`}
                        onClick={() => navigate("#users-search")}
                    >
                        Users
                    </li>
                    <li
                        className={`transition-colors delay-200 border-b-4 
                        ${location.hash === "#posts-search" ? "border-green-700" : ""} 
                        cursor-pointer rounded`}
                        onClick={() => navigate("#posts-search")}
                    >
                        Posts
                    </li>
                </ul>
            </menu>
        </section>
        <Tab
            arrOfTab={[
                {
                    id: "all-search",
                    tab: !searchError?.trim() ?
                        <>
                            <Displaymultipleusers
                                title="Search result for users"
                                horizontal={true}
                                users={userSearchResults}
                            />

                            <Displaymultipleposts
                                title="Search result for posts"
                                posts={postSearchResults}
                                updatepost={({ blogpost, type }) => {
                                    if (type === "EDIT") {
                                        setpostSearchResults((pre) =>
                                            pre ? ({ ...pre, ...blogpost }) : pre
                                        );
                                    } else if (type === "DELETE") {
                                        setpostSearchResults(null);
                                    }
                                }}
                            />
                        </> :
                        <Searcherror error={searchError} />
                },
                {
                    id: "users-search",
                    tab: !searchError?.trim() ?
                        <Displaymultipleusers
                            horizontal={false}
                            users={userSearchResults}
                        /> :
                        <Searcherror error={searchError} />
                },
                {
                    id: "posts-search",
                    tab: !searchError?.trim() ?
                        <Displaymultipleposts
                            posts={postSearchResults}
                            updatepost={({ blogpost, type }) => {
                                if (type === "EDIT") {
                                    setpostSearchResults((pre) =>
                                        pre ? ({ ...pre, ...blogpost }) : pre
                                    );
                                } else if (type === "DELETE") {
                                    setpostSearchResults(null);
                                }
                            }}
                        /> :
                        <Searcherror error={searchError} />
                },
            ]}
        />
    </main >;
};

export default Searchresult;
