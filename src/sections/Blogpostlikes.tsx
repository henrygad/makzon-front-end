import { useEffect, useRef } from "react";
import Displaylike from "../components/Displaylike";
import { useLocation } from "react-router-dom";
import useAutoNavigate from "../hooks/useAutoNavigate";


const Blogpostlikes = ({ likes, autoViewLike }: {
    likes: string[];
    autoViewLike?: {
        comment?: {
            blogpostParentComment: string | null,
            targetComment: string | null,
        },
        targetLike: string
    }
}) => {
    const location = useLocation();
    const autoNavigate = useAutoNavigate();
    const sectionRef = useRef<HTMLElement | null>(null);


    useEffect(() => {
        const clear = setTimeout(() => {
            if (location.hash &&
                location.hash.trim() === "#blogpost-likes" &&
                sectionRef.current
            ) {
                autoNavigate(sectionRef.current);                
            }

            clearTimeout(clear);
        
       }, 1);
    }, [location.hash, sectionRef]);

    return <section ref={sectionRef}>
        <div className="space-y-1">
            {
                likes &&
                    likes.length ?
                    likes.map(like =>
                        <Displaylike
                            key={like}
                            userName={like}
                            autoViewLike={autoViewLike}
                        />
                    ) :
                    <span className="text-sm text-slate-600 font-text">
                        Be the first to like this post
                    </span>
            }
        </div>
    </section>;
};

export default Blogpostlikes;
