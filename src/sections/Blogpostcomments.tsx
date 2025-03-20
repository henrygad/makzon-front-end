import Displaycomment from "../components/Displaycomment";
import commentProps from "../types/comment.type";
import postProps from "../types/post.type";

type Props = {
  blogpost: postProps;
  comments: commentProps[];
  setComments: React.Dispatch<React.SetStateAction<commentProps[]>>;
};

const Blogpostcomments = ({ blogpost, comments, setComments }: Props) => {
  return (
    <div>
      <div>
        {comments && comments.length ? (
          comments.map((comment) =>
            comment.replyId === null ? (
              <Displaycomment
                key={comment._id}
                blogpost={blogpost}
                replyId={comment._id}
                comment={comment}
                setComments={setComments}
              />
            ) : null
          )
        ) : (
          <span>Be the first to comment</span>
        )}
      </div>
    </div>
  );
};

export default Blogpostcomments;
