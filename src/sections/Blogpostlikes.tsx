import Displaylike from "../components/Displaylike";



const Blogpostlikes = ({ likes }: {likes: string[]}) => {    
    return <div className="space-y-1">
        {
            likes &&
                likes.length ?
                likes.map(like =>
                    <Displaylike key={like} userName={like} />
                ) :
                <span className="text-sm text-slate-600 font-text">
                    Be the first to like this post
                </span>
        }
    </div>;
};

export default Blogpostlikes;
