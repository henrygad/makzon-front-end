import { useEffect, useState } from "react";
import commentProps from "../types/comment.type";
import postProps from "../types/post.type";
import Displayuserinfor from "./Displayuserinfor";
import userProps from "../types/user.type";
import Comment from "./Comment";
import Like from "./Likecomment";
import { MdDeleteOutline } from "react-icons/md";
import { useAppSelector } from "../redux";
import Displaylike from "./Displaylike";
import axios from "axios";
import Displayscreenloading from "../loaders/Displayscreenloading";
const apiEndPont = import.meta.env.VITE_DOMAIN_NAME_BACKEND;

type Props = {
  blogpost: postProps;
  replyId: string | null;
  comment: commentProps;
  setComments: React.Dispatch<React.SetStateAction<commentProps[] | null>>;
  autoViewComment?: {
    blogpostParentComment: string | null;
    targetComment: string;
  };
  autoViewLike?: {
    comment?: {
      blogpostParentComment: string | null;
      targetComment: string;
    };
    targetLike: string;
  };
};

interface commentuiProps extends Props {
  isParentComment: boolean;
  toggleChildTab: string;
  setToggleChildTab: React.Dispatch<React.SetStateAction<string>>;
}

const Commentui = ({
  blogpost,
  replyId = null,
  comment,
  setComments,
  toggleChildTab,
  setToggleChildTab,
  isParentComment,
  autoViewComment,
  autoViewLike,
}: commentuiProps) => {
  const { data: User } = useAppSelector(
    (state) => state.userProfileSlices.userProfile
  );
  const [likes, setLikes] = useState<string[]>([]);
  const [viewReplyLikes, setViewReplyLikes] = useState(false);

  const [authorData, setAuthorData] = useState<userProps | null>(null);

  const [loading, setLoading] = useState(false);

  const handleDeleteComment = async (deleteCommentData: commentProps) => {
    setLoading(true);
    try {
      const url = apiEndPont + "/comment/" + deleteCommentData._id;
      await axios.delete(url, {
        baseURL: apiEndPont,
        withCredentials: true
      });
      
      setComments((pre) => {
        if (!pre) return pre;

        if (deleteCommentData.replyId === null) {
          /* it a parent comment */
          return pre.filter((comment) => comment._id !== deleteCommentData._id);
        } else  {
          /* it a child comment */
          return pre.map((parentComment) => {
            if (parentComment._id === deleteCommentData.replyId) {
              return {
                ...parentComment,
                children: (parentComment.children || []).filter(
                  (childComment) => childComment._id !== deleteCommentData._id
                ),
              };
            } else {
              /* call a recursive function if need */
              return parentComment;
            }
          });
        }
      });
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!comment.author) return;
    const url = apiEndPont + "/user/" + comment.author;
    axios(url)
      .then(async (res) => {
        const user: userProps = await res.data.data;
        setAuthorData(user);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [comment.author]);

  useEffect(() => {
    if (autoViewLike?.targetLike &&
      autoViewLike.comment?.targetComment === comment._id) {
      if (isParentComment) {
        setToggleChildTab("likes");
      } else {
        setViewReplyLikes(true);
      }
    }
  }, [autoViewComment, comment._id]);

  return <>
    <div className="block p-1">
      {/* comment */}
      <span
        className={`block ${autoViewComment?.targetComment === comment._id
          ? "bg-yellow-100 shadow-sm"
          : ""
          }`}
      >
        {authorData ? (
          <Displayuserinfor short={true} user={authorData} onClick={() => { }} />
        ) : (
          <span>loading...</span>
        )}
        <span className="font-text text-base break-words hyphens-auto">
          {comment.body.text}
        </span>
        <span className="flex items-center gap-6 p-2">
          {/* comment stat */}
          <button
            id="reply-comment-btn"
            className="flex items-center gap-2 cursor-pointer"
          >
            <Comment
              blogpost={blogpost}
              parentComment={comment}
              replyId={replyId}
              replying={comment.replyingTo.includes(comment.author) ? comment.replyingTo : [...comment.replyingTo, comment.author]}
              setComments={setComments}
              callBack={() => setToggleChildTab("comments")}
            />
            {isParentComment ? (
              <span onClick={() => setToggleChildTab("comments")}>
                {(comment.children && comment.children.length) || 0}
              </span>
            ) : null}
          </button>
          <button
            id="like-btn"
            className="flex items-center gap-2 cursor-pointer"
          >
            <Like
              comment={comment}
              setCommentLikes={setLikes}
              blogpost={blogpost}
            />
            <span
              onClick={() => {
                if (isParentComment) {
                  setToggleChildTab("likes");
                } else {
                  setViewReplyLikes(true);
                }
              }}
            >
              {(likes && likes.length) || 0}
            </span>
          </button>
          {comment.author === User.userName ||
            blogpost.author === User.userName ? (
            <button
              id="delete-comment-btn"
              className="cursor-pointer"
              onClick={() => handleDeleteComment(comment)}
            >
              <MdDeleteOutline size={16} />
            </button>
          ) : null}
        </span>
      </span>

      {/* list comment likes */}

      {likes &&
        likes.length &&
        (toggleChildTab === "likes" || viewReplyLikes) ? (
        <div className="space-y-4 px-4 border-l rounded-b-3xl">
          <span className="block text-base text-slate-800 font-text font-semibold py-1 mb-3">
            Likes
          </span>
          {likes.map((like) => (
            <Displaylike
              key={like}
              userName={like}
              autoViewLike={autoViewLike}
            />
          ))}
          <span className="flex items-center">
            <button
              className="text-sm text-slate-500 font-text cursor-pointer"
              onClick={() => {
                if (isParentComment) {
                  setToggleChildTab("");
                } else {
                  setViewReplyLikes(false);
                }
              }}
            >
              Close likes
            </button>
          </span>
        </div>
      ) :
        null
      }
    </div>
    <Displayscreenloading loading={loading} />
  </>;
};

const Displaycomment = ({
  blogpost,
  replyId = null,
  comment,
  setComments,
  autoViewComment,
  autoViewLike,
}: Props) => {
  const [toggleChildTab, setToggleChildTab] = useState("");

  useEffect(() => {
    if (autoViewComment?.blogpostParentComment === comment._id ||
      (autoViewLike?.targetLike && autoViewLike.comment?.blogpostParentComment === comment._id)
    ) {
      setToggleChildTab("comments");
    }
  }, [autoViewComment, autoViewLike, comment._id]);

  return (
    <>
      {comment.children &&
        comment.children.length ? (
        <section
          id="comment-with-children"
          className="border-l rounded-b-3xl pl-3"
        >
          <Commentui
            blogpost={blogpost}
            replyId={replyId}
            comment={comment}
            setComments={setComments}
            toggleChildTab={toggleChildTab}
            setToggleChildTab={setToggleChildTab}
            isParentComment={true}
            autoViewComment={autoViewComment}
            autoViewLike={autoViewLike}
          />
          {!toggleChildTab ? (
            <span className="flex items-center pl-2">
              <button
                className="text-sm text-slate-500 font-text cursor-pointer"
                onClick={() => setToggleChildTab("comments")}
              >
                {comment.children.length > 1
                  ? `View ${comment.children.length} replies`
                  : "View  1 reply"}
              </button>
            </span>
          ) : null}
          {toggleChildTab === "comments" ? (
            <div className="space-y-2 pl-4">
              {/* display replies */}
              <span className="block text-base text-slate-800 font-text font-semibold">
                Replies
              </span>
              {comment.children
                .map((chiidComment) => (
                  <Commentui
                    key={chiidComment._id}
                    blogpost={blogpost}
                    replyId={replyId}
                    comment={chiidComment}
                    setComments={setComments}
                    toggleChildTab={toggleChildTab}
                    setToggleChildTab={setToggleChildTab}
                    isParentComment={false}
                    autoViewComment={autoViewComment}
                    autoViewLike={autoViewLike}
                  />
                ))}
              {toggleChildTab ? (
                <span className="flex items-center pl-4">
                  <button
                    className="text-sm text-slate-500 font-text cursor-pointer"
                    onClick={() => setToggleChildTab("")}
                  >
                    Close replies
                  </button>
                </span>
              ) :
                null
              }
            </div>
          ) :
            null
          }
        </section>
      ) : (


        <Commentui
          blogpost={blogpost}
          replyId={replyId}
          comment={comment}
          setComments={setComments}
          toggleChildTab={toggleChildTab}
          setToggleChildTab={setToggleChildTab}
          isParentComment={true}
          autoViewComment={autoViewComment}
          autoViewLike={autoViewLike}
        />
      )}
    </>
  );
};

export default Displaycomment;
