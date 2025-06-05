import Displayblogpost from "../components/Displayblogpost";
import Displayblogpostloading from "../loaders/Displayblogpostloading";
import postProps from "../types/post.type";

type Props = {
    title?: string,
    posts: postProps[] | null
    loading?: boolean
    updatepost: ({ type, blogpost }: {
        type: "EDIT";
        blogpost: postProps;
    } | {
        type: "DELETE";
        blogpost: {
            _id: string;
        };
    }) => void

};


const Displaymultipleposts = ({ title, posts, loading = false, updatepost }: Props) => {


    return <section className="space-y-8 mb-4">
        {title ?
            <span className="block font-text text-base font-semibold">
                {title}
            </span> :
            null
        }
        <div className="space-y-4">
            {
                !loading && posts ?
                    posts.length ?
                        <>
                            {
                                posts
                                    .map(post =>
                                        <Displayblogpost
                                            key={post._id}
                                            displayType="TEXT"
                                            blogpost={post}
                                            updateBlogpost={updatepost}
                                        />
                                    )
                            }
                        </> :
                        null :
                    <>
                        {
                            Array(4).fill("")
                                .map((_, index) =>
                                    <Displayblogpostloading
                                        key={index}
                                        displayType="text"
                                    />
                                )
                        }
                    </>
            }
        </div>
    </section>;
};

export default Displaymultipleposts;
