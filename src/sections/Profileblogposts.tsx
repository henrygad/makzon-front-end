import Displayblogpost from "../components/Displayblogpost";
import { useAppSelector } from "../redux";
import postProps from "../types/post.type";

type Props = {
    loading: boolean
    blogposts: postProps[]
    updateBlogpost: ({ type, blogpost }: {
        type: "EDIT";
        blogpost: postProps;
    } | {
        type: "DELETE";
        blogpost: {
            _id: string;
        };
    }) => void
}

const Profileblogposts = ({ loading, blogposts, updateBlogpost }: Props) => {
    const { data: User } = useAppSelector(state => state.userProfileSlices.userProfile);

    return <section>
        <div className="border-b pb-1 mb-4">
            <span className="block text-base text-slate-400 font-sec mt-5">
                Published {blogposts && blogposts.length || 0} articles
            </span>
        </div>
        <div className="p-2 space-y-10">
            {/* list blogpost */}
            {
                !loading ?
                    <>
                        {
                            blogposts &&
                                blogposts.length ?
                                blogposts
                                    .filter(blogpost => blogpost.status.toLowerCase() === "published")
                                    .map((blogpost) =>
                                        <Displayblogpost
                                            key={blogpost._id}
                                            displayType="TEXT"
                                            blogpost={blogpost}
                                            authorInfor={User}
                                            updateBlogpost={updateBlogpost}
                                        />
                                    ) :
                                <span>Publish your first blogpost</span>
                        }
                    </> :
                    <div>loading blogposts ...</div>
            }
        </div>
    </section>;
};

export default Profileblogposts;
