import { useEffect, useRef} from "react";
import Displaycomment from "../components/Displaycomment";
import commentProps from "../types/comment.type";
import postProps from "../types/post.type";
import { useLocation } from "react-router-dom";
import useAutoNavigate from "../hooks/useAutoNavigate";

type Props = {
  blogpost: postProps;
  comments: commentProps[] | null;
  setComments: React.Dispatch<React.SetStateAction<commentProps[] | null>>;
  autoViewComment?: {
    blogpostParentComment: string | null,
    targetComment: string,
  }
  autoViewLike?: {
    comment?: {
      blogpostParentComment: string | null;
      targetComment: string;
    };
    targetLike: string;
  };
};

const Blogpostcomments = ({ blogpost, comments, setComments, autoViewComment, autoViewLike }: Props) => {
  const location = useLocation();
  const autoNavigate = useAutoNavigate();

  const sectionRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (location.hash &&
      location.hash.trim() === "#blogpost-comments" &&
      sectionRef.current
    ) {
      autoNavigate(sectionRef.current);
    }
  }, [location.hash, sectionRef]);

  return (
    <section ref={sectionRef}>
      <div className="space-y-4">
        {/* display normal comments */}
        {comments ?
          <> 
            {
              comments.length ? 
                comments.map((comment) =>
                  <Displaycomment
                    key={comment._id}
                    blogpost={blogpost}
                    replyId={comment._id}
                    comment={comment}
                    setComments={setComments}
                    autoViewComment={autoViewComment}
                    autoViewLike={autoViewLike}
                  />
                ) :
                <span>Be the first to comment</span>
            }
          </>
          :
          <span>loading...</span>
        }        
      </div>
    </section>
  );
};

export default Blogpostcomments;
