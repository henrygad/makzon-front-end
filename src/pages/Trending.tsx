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
            {/* new user section */}
            <>
                {newUsers ?
                    newUsers.length ?
                        <section className="mb-10 space-y-4">
                            <span className="block pl-1 font-text text-base font-medium">Follow new users</span>
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
                            </div>
                        </section> :
                        null :
                    <span>loading...</span>
                }
            </>
            {/* new user section */}
            <section className="space-y-6">
                {
                    trendingBlogposts ?
                        trendingBlogposts.length ? <>
                            <span className="block pl-3 font-text text-base font-medium">Read popular posts</span>
                            {
                                trendingBlogposts.map(post =>
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
                        </> :
                            null :
                        <span>laoding trending post</span>
                }
            </section>
        </main>
    </>;
};

export default Trending;
