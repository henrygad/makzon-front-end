import postProps from "../types/post.type";
import userProps from "../types/user.type";
import Slider from "../slider";
import Searchform from "../sections/Searchform";
import Displaymultipleusers from "../sections/Displaymultipleusers";
import Displaymultipleposts from "../sections/Displaymultipleposts";
const apiEndPont = import.meta.env.VITE_DOMAIN_NAME_BACKEND;

type props = {
    newUsers: userProps[] | null,
    trendingPosts: postProps[] | null,
    setTrendingPosts: React.Dispatch<React.SetStateAction<postProps[] | null>>
    searchHistories: { _id: string, search: string }[] | null
    setSearchHistories: React.Dispatch<React.SetStateAction<{ _id: string, search: string }[] | null>>
    postSearchResults: postProps[] | null
    setpostSearchResults: React.Dispatch<React.SetStateAction<postProps[] | null>>
    userSearchResults: userProps[] | null
    setuUserSearchResults: React.Dispatch<React.SetStateAction<userProps[] | null>>
    searchError: string
    setSearchError: React.Dispatch<React.SetStateAction<string>>
};


const Trending = ({
    newUsers,
    trendingPosts,
    setTrendingPosts,
    searchHistories,
    setSearchHistories,
    postSearchResults,
    setpostSearchResults,
    userSearchResults,
    setuUserSearchResults,
    searchError,
    setSearchError
}: props) => {    

    return <>
        <main className="container">
            {/* slidder show */}
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
            <section className="my-2">
                <Slider
                    media={trendingPosts&&
                        trendingPosts?.length ?
                        trendingPosts.map((blogpost) => blogpost?.image ? (apiEndPont + "/media/" + blogpost.image) : " ") :
                        []
                    }
                    className="w-full h-[200px] md:h-[300px] rounded-lg border"
                />
            </section>
            {/* new user section */}
            <Displaymultipleusers
                title="Popular Authors"
                horizontal={true}
                users={newUsers}
            />           
            {/* trending blogpost section */}
            <Displaymultipleposts
                title="Popular Articles"
                posts={trendingPosts}
                updatepost={({ blogpost, type }) => {
                    if (type === "EDIT") {
                        setTrendingPosts((pre) =>
                            pre ? ({ ...pre, ...blogpost }) : pre
                        );
                    } else if (type === "DELETE") {
                        setTrendingPosts(null);
                    }
                }}
            />          
        </main>
    </>;
};

export default Trending;

