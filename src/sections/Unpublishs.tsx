import Displayblogpost from "../components/Displayblogpost";
import { useAppSelector } from "../redux";

const Unpublishs = () => {
    const { data: Blogposts, loading } = useAppSelector(state => state.userBlogpostSlices.blogposts);

    return <div>
        <div className="space-y-6">
            {!loading ?
                Blogposts &&
                    Blogposts.length ? 
                    Blogposts
                        .filter(blogpost=> blogpost.status.toLowerCase() === "unpublished")
                        .map(blogpost =>
                        <Displayblogpost
                            key={blogpost._id}
                            displyType="TEXT"
                            blogpost={blogpost}
                        /> 
                    ):
                    <span>No unpublish blogposts</span>:
                <span>loading...</span>
            }
        </div>
    </div>;
};

export default Unpublishs;
