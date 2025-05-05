import { useNavigate } from "react-router-dom";
import Displayuserinfor from "../components/Displayuserinfor";
import postProps from "../types/post.type";
import userProps from "../types/user.type";
import Displayblogpost from "../components/Displayblogpost";

type props = {
    newUsers: userProps[] | null,
    trendingBlogposts: postProps[] | null,
    setTrendingBlogposts: React.Dispatch<React.SetStateAction<postProps[] | null>>
};

const Trending = ({ newUsers, trendingBlogposts, setTrendingBlogposts }: props) => {
    const navigate = useNavigate();

    return <>
        <main className="container">
            {/* slidder show */}
            <section className="my-2">
                <div className="min-h-40 bg-gray-100 rounded my-2">
                    <div>slide one</div>
                    <div>slide two</div>
                    <div>slide three</div>
                </div>
            </section>
            {/* new user section */}
            <section className="space-y-8 my-4">
                <span className="block font-prim text-xl font-semibold">
                    Popular Authors
                </span>
                {newUsers ?
                    newUsers.length ?
                        <div className="flex justify-between items-start gap-4 overflow-x-auto snap-x snap-center snap-always px-2">
                            {
                                newUsers.map(user =>
                                    <Displayuserinfor
                                        key={user.userName}
                                        short={true}
                                        user={user}
                                        onClick={() => navigate("/profile/" + user.userName)}
                                    />
                                )
                            }
                        </div> :
                        null
                    :
                    <span>loading...</span>
                }
            </section>
            {/* trending blogpost section */}
            <section className="space-y-8 mb-4">
                <span className="block font-prim text-xl font-semibold">
                    Popular posts
                </span>
                {
                    trendingBlogposts ?
                        trendingBlogposts.length ?
                            <div className="space-y-6">
                                {
                                    trendingBlogposts
                                        .map(post =>
                                        <Displayblogpost
                                            key={post._id}
                                            displayType="TEXT"
                                            blogpost={post}
                                            updateBlogpost={({ blogpost, type }) => {
                                                if (type === "EDIT") {
                                                    setTrendingBlogposts((pre) =>
                                                        pre ? ({ ...pre, ...blogpost }) : pre
                                                    );
                                                } else if (type === "DELETE") {
                                                    setTrendingBlogposts(null);
                                                }
                                            }}
                                        />
                                    )
                                }
                            </div> :
                            null :
                        <span>laoding...</span>
                }
            </section>
        </main>
    </>;
};

export default Trending;
