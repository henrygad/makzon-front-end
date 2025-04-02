import Displayblogpost from "../components/Displayblogpost";
import { useAppSelector } from "../redux";

const Unpublishs = () => {
    const { data: Blogposts, loading } = useAppSelector(state => state.userBlogpostSlices.blogposts);

    return <section>
        <div className="space-y-6">
            {!loading ?
                Blogposts &&
                    Blogposts.length ?
                    Blogposts
                        .filter(blogpost => blogpost.status.toLowerCase() === "unpublished")
                        .map(blogpost =>
                            <Displayblogpost
                                key={blogpost._id}
                                displayType="TEXT"
                                blogpost={blogpost}
                                updateBlogpost={() => null}
                            />
                        ) :
                    <span>No unpublish blogposts</span> :
                <span>loading...</span>
            }
        </div>
    </section>;
};

export default Unpublishs;
