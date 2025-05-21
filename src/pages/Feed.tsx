import Displaymultipleposts from "../sections/Displaymultipleposts";
import postProps from "../types/post.type";

type Props = {
    postFeeds: postProps[] | null
    setPostFeeds: React.Dispatch<React.SetStateAction<postProps[] | null>>
    newPostFeeds: postProps[] | null
    setNewPostFeeds: React.Dispatch<React.SetStateAction<postProps[] | null>>
}

const Feed = ({
    postFeeds,
    setNewPostFeeds,
    newPostFeeds,
    setPostFeeds
}: Props) => {

    const handleViewedNotifications = () => {
        if (newPostFeeds) {
            setPostFeeds(pre => pre ? [...newPostFeeds, ...pre] : newPostFeeds);
            setNewPostFeeds(null);
        }
    };

    return <main className="container">
        {/* display a pop up if there is a new feed */}
        <section>
            <div className="relative">
                {
                    newPostFeeds &&
                        newPostFeeds.length ?
                        <div className="absolute -top-10 left-0 right-0 bg-green-600 z-10 rounded-lg p-1">
                            <button
                                className="text-center text-sm  text-white font-text font-medium w-full mx-auto cursor-pointer"
                                onClick={handleViewedNotifications}
                            >
                                New feeds is available
                            </button>
                        </div> :
                        null

                }
            </div>
        </section>
        {/* display user timeline post feeds */}
        <Displaymultipleposts          
            posts={postFeeds}
            updatepost={({ blogpost, type }) => {
                if (type === "EDIT") {
                    setPostFeeds((pre) =>
                        pre ? ({ ...pre, ...blogpost }) : pre
                    );
                } else if (type === "DELETE") {
                    setPostFeeds(pre => pre ? pre.filter(post => post._id !== blogpost._id) : pre);
                }
            }}
        />
    </main>;
};

export default Feed;
