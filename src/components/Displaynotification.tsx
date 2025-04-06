import { FaRegComments, FaRegEye } from "react-icons/fa";
import notificationProps from "../types/notification.type";
import { SlLike, SlUserFollow, SlUserUnfollow } from "react-icons/sl";
import { MdDeleteOutline } from "react-icons/md";
import Displayimage from "./Displayimage";
import avatarPlaceholder from "../assert/avaterplaceholder.svg";
import { useEffect, useState } from "react";
import { useAppDispatch } from "../redux";
import {
  deleteNotifications,
  viewedNotifications,
} from "../redux/slices/userNotificationSlices";
import { useNavigate } from "react-router-dom";
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
  const [avatar, setAvater] = useState("");

  useEffect(() => {
    setAvater(userName);
  }, [userName]);

  return (
    <Displayimage
      url={apiEndPont+"/media/"+avatar}
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

export const Single = ({
  notification,
  isSelect,
  selections,
  setSelections = () => null,
  useDelete = true,
}: {
  notification: notificationProps;
  isSelect?: boolean,
  selections?: string[],
  setSelections?: React.Dispatch<React.SetStateAction<string[]>>
  useDelete?: boolean;
}) => {
  const navigate = useNavigate();
  const appDispatch = useAppDispatch();

  const handleViewNotification = (notic: notificationProps) => {
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

    const Notifications: notificationProps[] = JSON.parse(
      localStorage.getItem("notifications") || "[]"
    );
    localStorage.setItem(
      "notifications",
      JSON.stringify(
        Notifications.map((notification) =>
          notification._id === notic._id
            ? { ...notification, checked: true }
            : notification
        )
      )
    );
    appDispatch(viewedNotifications({ _id: notic._id || "" }));

    if (notic.url.trim().startsWith("/")) {
      navigate(notic.url.trim(), { state: viewTargetNotification });
      return;
    }

    navigate("/" + notic.url.trim(), { state: viewTargetNotification });
  };

  const handleDeleteNotic = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    _id: string
  ) => {
    const Notifications: notificationProps[] = JSON.parse(
      localStorage.getItem("notifications") || "[]"
    );
    localStorage.setItem(
      "notifications",
      JSON.stringify(Notifications.filter((notic) => notic._id !== _id))
    );

    appDispatch(deleteNotifications({ _id }));
    e.stopPropagation();
  };

  return (
    <span
      className={`block ${isSelect ? "border-blue-100 p-3" : "p-2"} ${selections?.includes(notification._id || "") ? "bg-blue-100" : ""} ${!notification.checked && !isSelect ? "bg-yellow-100" : ""} space-y-1 border cursor-pointer`}
      onClick={() => {
        if (isSelect) {
          if (selections?.includes(notification._id || "")) {
            setSelections(pre => pre.filter(_id => _id !== notification._id));
          } else {
            setSelections(pre => ([...pre, notification._id || ""]));
          }
          return;
        }
        handleViewNotification(notification);
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
            {notification.message.trim()}
          </span>
        </span>
      </span>
    </span>
  );
};

export const Multiple = ({
  notifications,
  isSelect,
  selections,
  setSelections
}: {
  notifications: notificationProps[];
  isSelect: boolean,
  selections: string[],
  setSelections: React.Dispatch<React.SetStateAction<string[]>>
}) => {
  const [lastNotic, setLastNotic] = useState<notificationProps>(
    notifications[0]
  );
  const navigate = useNavigate();

  const appDispatch = useAppDispatch();

  const handleViewNotification = (notic: notificationProps) => {
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

    const Notifications: notificationProps[] = JSON.parse(
      localStorage.getItem("notifications") || "[]"
    );
    localStorage.setItem(
      "notifications",
      JSON.stringify(
        Notifications.map((notification) =>
          notification._id === notic._id
            ? { ...notification, checked: true }
            : notification
        )
      )
    );
    appDispatch(viewedNotifications({ _id: notic._id || "" }));

    if (notic.url.trim().startsWith("/")) {
      navigate(notic.url.trim(), { state: viewTargetNotification });
      return;
    }

    navigate("/" + notic.url.trim(), { state: viewTargetNotification });
  };

  const handleDeleteNotic = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    const deleteAll = (_id: string) => {
      const Notifications: notificationProps[] = JSON.parse(
        localStorage.getItem("notifications") || "[]"
      );
      localStorage.setItem(
        "notifications",
        JSON.stringify(Notifications.filter((notic) => notic._id !== _id))
      );

      appDispatch(deleteNotifications({ _id }));
    };

    notifications.forEach(notic => {
      deleteAll(notic._id || "");
    });
    e.stopPropagation();
  };

  useEffect(() => {
    setLastNotic(notifications[0]);
  }, [notifications]);

  return (
    <span
      className={`block ${isSelect ? "border-blue-100 p-3" : "p-2"} ${selections?.includes(lastNotic._id || "") ? "bg-blue-100" : ""} ${!lastNotic.checked && !isSelect ? "bg-yellow-100" : ""} space-y-1 border cursor-pointer`}
      onClick={() => {
        if (isSelect) {
          if (selections?.includes(lastNotic._id || "")) {
            setSelections(pre => pre.filter(_id => !pre.includes(_id)));
          } else {
            setSelections(pre=> ([...pre, ...notifications.map(notic => notic._id || "")]));
          }
          return;
        }
        handleViewNotification(lastNotic);
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
              <button onClick={handleDeleteNotic}>
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
