import Displayblogpost from "../components/Displayblogpost";
import { useAppDispatch, useAppSelector } from "../redux";
import { deleteBlogpost, editBlogpost } from "../redux/slices/userBlogpostSlices";

const Unpublishs = () => {
    const { data: Allblogposts, loading } = useAppSelector(state => state.userBlogpostSlices.blogposts);
    const { data: User } = useAppSelector(state => state.userProfileSlices.userProfile);
    const appDispatch = useAppDispatch();

    const unpublishedPost = Allblogposts.filter(blogpost => blogpost.status.toLowerCase() === "unpublished");    

    return <section>
        <div className="space-y-6">
            {!loading ?
                unpublishedPost &&
                    unpublishedPost.length ?
                    unpublishedPost
                        .map(blogpost =>
                            <Displayblogpost
                                key={blogpost._id}
                                displayType="TEXT"
                                blogpost={blogpost}
                                authorInfor={User}
                                updateBlogpost={
                                    ({ blogpost, type }) => {
                                        if (type === "EDIT") {
                                            appDispatch(editBlogpost(blogpost));
                                        } else if (type === "DELETE") {
                                            appDispatch(deleteBlogpost({ _id: blogpost._id }));
                                        }
                                    }
                                }
                            />
                        ) :
                    <span>No unpublish blogposts</span> :
                <span>loading...</span>
            }
        </div>
    </section>;
};

export default Unpublishs;
