import useSendNotification from "../hooks/useSendNotification";
import { useAppDispatch, useAppSelector } from "../redux";
import { editProfile } from "../redux/slices/userProfileSlices";
import userProps from "../types/user.type";
import { Button } from "./Button";


const Follow = ({ friend }: { friend: string }) => {
    const { data: User } = useAppSelector(state => state.userProfileSlices.userProfile);
    const appDispatch = useAppDispatch();
    const sendNotification = useSendNotification();

    const follow = (friend: string) => {
        const updatedUser: userProps = {
            ...User,
            followings: [friend, ...(User.followings || [])]
        };

        localStorage.setItem("user", JSON.stringify({ ...updatedUser }));
        appDispatch(editProfile(updatedUser));
        sendNotification({
            type: "followed",
            targetTitle: "Someone followed you",
            from: User.userName,
            to: friend,
            message: " followed you. You can follow them back",
            checked: false,
            url: "/profile/" + User.userName,
        });
    };

    const unFollow = (friend: string) => {
        const updatedUser: userProps = {
            ...User,
            followings: (User.followings || []).filter(userName => userName !== friend)
        };

        localStorage.setItem("user", JSON.stringify({ ...updatedUser }));
        appDispatch(editProfile(updatedUser));
        sendNotification({
            type: "unfollowed",
            from: User.userName,
            targetTitle: "Someone unfollowed you",
            to: friend,
            message: "unfollowed you. You can unfollow them back",
            checked: false,
            url: "/profile/" + User.userName,
        });
    };

    const handleFollow = () => {
        if ((User.followings || []).includes(friend)) {
            unFollow(friend);
        } else {
            follow(friend);
        }
    };

    return <Button
        id='follow-btn'
        fieldName={(User.followings || []).includes(friend) ? "Following" : "Follow"}
        className="rounded-full text-sm font-semibold transition-colors hover:bg-blue-600 hover:text-white active:bg-blue-800 active:text-white -mt-2"
        onClick={handleFollow}
    />;
};

export default Follow;

