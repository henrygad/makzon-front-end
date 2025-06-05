import { FaRegComments, FaRegEye } from "react-icons/fa";
import notificationProps from "../types/notification.type";
import { SlLike, SlUserFollow, SlUserUnfollow } from "react-icons/sl";
import { MdDeleteOutline } from "react-icons/md";
import Displayimage from "./Displayimage";
import avatarPlaceholder from "../assets/avaterplaceholder.svg";
import { useEffect, useState } from "react";
import { useAppDispatch } from "../redux";
import {
  deleteNotifications,
  viewedNotifications,
} from "../redux/slices/userNotificationSlices";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import useSanitize from "../hooks/useSanitize";
import userProps from "../types/user.type";
const apiEndPont = import.meta.env.VITE_DOMAIN_NAME_BACKEND;

type viewTargetNotificationProps =
  | {
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
  }
  | undefined;

const Displayicon = ({ type }: { type: string }) => {
  if (!type) return null;
  if (type.trim().toLowerCase() === "viewed")
    return <FaRegEye size={24} color="gray" />;
  if (type.trim().toLowerCase() === "followed")
    return <SlUserFollow size={24} color="gray" />;
  if (type.trim().toLowerCase() === "unfollowed")
    return <SlUserUnfollow size={24} color="gray" />;
  if (type.trim().toLowerCase() === "commented")
    return <FaRegComments size={26} color="gray" />;
  if (type.trim().toLowerCase() === "liked")
    return <SlLike size={24} color="gray" />;
};

const Displayuseravatar = ({ userName }: { userName: string }) => {
  const [userInfor, setUserInfor] = useState<userProps | null>(null);

  useEffect(() => {
    // Fetch author short details
    const url = apiEndPont + "/user/" + userName;
    axios(url, {
      withCredentials: true,
      baseURL: apiEndPont
    })
      .then(async (res) => {
        const userInfor: userProps = await res.data.data;
        setUserInfor(userInfor);
      })
      .catch((error) =>
        console.error(error)
      );
  }, [userName]);


  if (!userInfor) return <span>loading</span>;

  return (
    <Displayimage
      url={userInfor.avatar ? apiEndPont + "/media/" + userInfor?.avatar : ""}
      alt={userName}
      useCancle={false}
      className="h-9 w-9 rounded-full object-contain"
      placeHolder={
        <img
          className="absolute top-0 bottom-0 right-0 left-0 h-9 w-9 rounded-full"
          src={avatarPlaceholder}
        />
      }
      loadingPlaceHolder={
        <span className="absolute top-0 bottom-0 right-0 left-0 border-slate-200 bg-slate-200 animate-pulse h-9 w-9 rounded-full"></span>
      }
    />
  );
};

type singleProps = {
  notification: notificationProps;
  isSelect?: boolean,
  selections?: string[],
  setSelections?: React.Dispatch<React.SetStateAction<string[]>>
  useDelete?: boolean;
}

export const Single = ({
  notification,
  isSelect,
  selections,
  setSelections = () => null,
  useDelete = true,
}: singleProps) => {
  const navigate = useNavigate();
  const appDispatch = useAppDispatch();
  const sanitize = useSanitize();

  const handleViewNotification = async (notic: notificationProps) => {
    let viewTargetNotification: viewTargetNotificationProps = undefined;

    if (notic.type.trim().toLowerCase().includes("followed")) {
      viewTargetNotification = undefined;
    } else if (notic.type.trim().toLowerCase() === "commented") {
      const options = notic.options as {
        type: string;
        parentCommentId: string | null;
        targetCommentId: string;
      };
      viewTargetNotification = {
        autoViewComment: {
          blogpostParentComment: options.parentCommentId,
          targetComment: options.targetCommentId,
        },
      };
    } else if (notic.type.trim().toLowerCase() === "liked") {
      const options = notic.options as {
        type: string;
        parentCommentId: string | null;
        targetCommentId: string;
      };

      if (options.type.trim().toLowerCase() === "blogpost-like") {
        viewTargetNotification = {
          autoViewLike: {
            targetLike: notic.from,
            comment: undefined,
          },
        };
      } else {
        viewTargetNotification = {
          autoViewLike: {
            targetLike: notic.from,
            comment: {
              blogpostParentComment: options.parentCommentId,
              targetComment: options.targetCommentId,
            },
          },
        };
      }
    } else if (notic.type.trim().toLowerCase() === "viewed") {
      viewTargetNotification = undefined;
    }

    const url = sanitize(notic.url).__html;
    if (url.startsWith("/")) {
      navigate(url, { state: viewTargetNotification });
    } else {
      navigate("/" + url, { state: viewTargetNotification });
    }

    try {
      const url = apiEndPont + "/notification/" + notic._id;
      const res = await axios.patch(url, null, {
        baseURL: apiEndPont,
        withCredentials: true
      });
      const viewedNotic: notificationProps = await res.data.data;
      appDispatch(viewedNotifications({ _id: viewedNotic._id! }));
    } catch (error) {
      console.error(error);
    }

  };

  const handleDeleteNotic = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    _id: string
  ) => {
    e.stopPropagation();

    try {
      const url = apiEndPont + "/notification/" + _id;
      await axios.delete(url, {
        baseURL: apiEndPont,
        withCredentials: true,
      });      
      appDispatch(deleteNotifications({ _id }));
    } catch (error) {
      console.error(error);
    }

  };

  return (
    <span
      className={`block ${isSelect ? "border-blue-100 p-3" : "p-2"} ${selections?.includes(notification._id || "") ? "bg-blue-100" : ""} ${!notification.checked && !isSelect ? "bg-yellow-100" : ""} space-y-1 rounded-md cursor-pointer`}
      onClick={() => {
        if (isSelect) {
          if (selections?.includes(notification._id || "")) {
            setSelections(pre => pre.filter(_id => _id !== notification._id));
          } else {
            setSelections(pre => ([...pre, notification._id || ""]));
          }
          return;
        } else {
          handleViewNotification(notification);
        }
      }}
    >
      <span className="flex items-start gap-2">
        <span className="block mt-1">
          <Displayicon type={notification.type} />
        </span>
        <span className="flex-1">
          <span className="relative flex items-center justify-between gap-6">
            <Displayuseravatar userName={notification.from} />
            {useDelete && !isSelect ?
              (
                <button
                  onClick={(e) => handleDeleteNotic(e, notification._id || "")}
                >
                  <MdDeleteOutline size={16} color="gray" />
                </button>
              ) :
              null
            }
          </span>
          <span className="text-sm font-text break-words hyphens-auto line-clamp-3 ">
            <span className="font-semibold">{notification.from} </span>{" "}
            {notification.message?.trim()}
          </span>
        </span>
      </span>
    </span>
  );
};

type multipleProps = {
  notifications: notificationProps[];
  isSelect: boolean,
  selections: string[],
  setSelections: React.Dispatch<React.SetStateAction<string[]>>
};


export const Multiple = ({
  notifications,
  isSelect,
  selections,
  setSelections
}: multipleProps) => {
  const [lastNotic, setLastNotic] = useState<notificationProps>(
    notifications[0]
  );
  const navigate = useNavigate();
  const sanitize = useSanitize();
  const appDispatch = useAppDispatch();

  const handleViewNotification = async (notic: notificationProps) => {
    
    let viewTargetNotification: viewTargetNotificationProps = undefined;

    if (notic.type.trim().toLowerCase().includes("followed")) {
      viewTargetNotification = undefined;
    } else if (notic.type.trim().toLowerCase() === "commented") {
      const options = notic.options as {
        type: string;
        parentCommentId: string | null;
        targetCommentId: string;
      };
      viewTargetNotification = {
        autoViewComment: {
          blogpostParentComment: options.parentCommentId,
          targetComment: options.targetCommentId,
        },
      };
    } else if (notic.type.trim().toLowerCase() === "liked") {
      const options = notic.options as {
        type: string;
        parentCommentId: string | null;
        targetCommentId: string;
      };

      if (options.type.trim().toLowerCase() === "blogpost-like") {
        viewTargetNotification = {
          autoViewLike: {
            targetLike: notic.from,
            comment: undefined,
          },
        };
      } else {
        viewTargetNotification = {
          autoViewLike: {
            targetLike: notic.from,
            comment: {
              blogpostParentComment: options.parentCommentId,
              targetComment: options.targetCommentId,
            },
          },
        };
      }
    } else if (notic.type.trim().toLowerCase() === "viewed") {
      viewTargetNotification = undefined;
    }

    const url = sanitize(notic.url).__html;
    if (url.startsWith("/")) {
      navigate(url, { state: viewTargetNotification });
    } else {
      navigate("/" + url, { state: viewTargetNotification });
    }

    try {
      const url = apiEndPont + "/notification/" + notic._id;
      const res = await axios.patch(url, null, {
        baseURL: apiEndPont,
        withCredentials: true
      });
      const viewedNotic: notificationProps = await res.data.data;
      appDispatch(viewedNotifications({ _id: viewedNotic._id! }));
    } catch (error) {
      console.error(error);
    }

  };

  const handleDeleteMultipleNotic = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    notifications: notificationProps[]
  ) => {

    const deleteNotic = async (_id: string) => {
      try {
        const url = apiEndPont + "/notification/" + _id;
        await axios.delete(url, {
          baseURL: apiEndPont,
          withCredentials: true,
        });
        appDispatch(deleteNotifications({ _id }));
      } catch (error) {
        console.error(error);
      }
    };

    notifications.forEach(async (notic) => {
      await deleteNotic(notic._id!);
    });
    e.stopPropagation();
  };

  useEffect(() => {
    setLastNotic(notifications[0]);
  }, [notifications]);

  return (
    <span
      className={`block ${isSelect ? "border-blue-100 p-3" : "p-2"} ${selections?.includes(lastNotic._id || "") ? "bg-blue-100" : ""} ${!lastNotic.checked && !isSelect ? "bg-yellow-100" : ""} space-y-1 rounded-md cursor-pointer`}
      onClick={() => {
        if (isSelect) {
          if (selections?.includes(lastNotic._id || "")) {
            setSelections(pre => pre.filter(_id => !pre.includes(_id)));
          } else {
            setSelections(pre => ([...pre, ...notifications.map(notic => notic._id || "")]));
          }
          return;
        } else {
          handleViewNotification(lastNotic);          
        }
      }}
    >
      <span className="flex items-start gap-2">
        <span className="block mt-1">
          <Displayicon type={lastNotic.type} />
        </span>
        <span className="flex-1">
          <span className="flex items-center justify-between gap-6">
            <span className="flex">
              {notifications.map((notic, index) =>
                index >= 4 ? null : (
                  <span
                    key={notic.from + index}
                    className="block relative"
                    style={{
                      left: `-${index * 20}px`,
                      zIndex: `${notifications.length - index}`,
                    }}
                  >
                    <Displayuseravatar userName={notic.from} />
                  </span>
                )
              )}
            </span>
            {!isSelect ?
              <button onClick={(e)=> handleDeleteMultipleNotic(e, notifications)}>
                <MdDeleteOutline size={16} color="gray" />
              </button> :
              null
            }
          </span>
          <span className="text-sm font-text break-words hyphens-auto line-clamp-3">
            {notifications.map((notic, index) => {
              if (index >= 3) {
                if (index == 3) {
                  return (
                    <span key={notic.from + index}>
                      and{" "}
                      <span className="font-semibold">
                        {notifications.length - 3} others{" "}
                      </span>
                    </span>
                  );
                } else {
                  return null;
                }
              } else {
                if (notifications.length - 1 === index) {
                  return (
                    <span key={notic.from + index}>
                      and <span className="font-semibold">{notic.from} </span>
                    </span>
                  );
                }
                return (
                  <span key={notic.from + index} className="font-semibold">
                    {notic.from},{" "}
                  </span>
                );
              }
            })}
            {lastNotic.message.trim()}
          </span>
        </span>
      </span>
    </span>
  );
};
