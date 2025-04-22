import axios from "axios";
import useSendNotification from "../hooks/useSendNotification";
import { useAppDispatch, useAppSelector } from "../redux";
import { editProfile } from "../redux/slices/userProfileSlices";
import userProps from "../types/user.type";
import { Button } from "./Button";
const apiEndPont = import.meta.env.VITE_DOMAIN_NAME_BACKEND;

const Follow = ({ friend }: { friend: string }) => {
    const { data: User } = useAppSelector(state => state.userProfileSlices.userProfile);
    const appDispatch = useAppDispatch();
    const sendNotification = useSendNotification();

    const handleFollow = async (friend: string) => {
        try {
            const url = apiEndPont + "/user/follow";
            const data = { friendUserName: friend };
            const res = await axios.post(url, data, {
                withCredentials: true,
                baseURL: apiEndPont
            });
            const friendUserName: string = await res.data.data.friendUserName;
            
            let updateUserFollowing: userProps = User;
            
            if (User.followings.includes(friendUserName)) {
                updateUserFollowing = { ...User, followings: User.followings.filter(flw => flw !== friendUserName) };
            } else {
                updateUserFollowing = { ...User, followings: [...User.followings, friendUserName] };

            }
            appDispatch(editProfile(updateUserFollowing));
        } catch (error) {
            console.error(error);
        }

         sendNotification({
            type: "followed",
            targetTitle: "Someone followed you",
            from: User.userName,
            to: friend,
            message: `${User.followings.includes(friend) ? "unfollowed" : "followed "} you. You can follow them back`,
            checked: false,
            url: "/profile/" + User.userName,
        });
    };

    return <Button
        id='follow-btn'
        fieldName={User.followings && User.followings.includes(friend) ? "Following" : "Follow"}
        className="rounded-full text-sm font-semibold transition-colors hover:bg-blue-600 hover:text-white active:bg-blue-800 active:text-white -mt-2"
        onClick={() => handleFollow(friend)}
    />;
};

export default Follow;

