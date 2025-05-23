import axios from "axios";
import { useAppDispatch } from "../redux";
import { editProfile } from "../redux/slices/userProfileSlices";
import postProps from "../types/post.type";
import userProps from "../types/user.type";
import { GoBookmark } from "react-icons/go";
import { addSaveBlogposts, removeSaveBlogpost } from "../redux/slices/userBlogpostSlices";
const apiEndPont = import.meta.env.VITE_DOMAIN_NAME_BACKEND;

const Saveblogpost = ({ User, blogpost }: { User: userProps, blogpost: postProps }) => {
    const appDispatch = useAppDispatch();

    const handleSave = async (User: userProps, blogpost: postProps) => {
        try {

            const url = apiEndPont + "/user/save";
            const data = { save: blogpost._id };
            const res = await axios.post(url, data, {
                withCredentials: true,
                baseURL: apiEndPont
            });
            const save: string = await res.data.data.save;
            let updateUserSaves: userProps = User;

            if (User.saves.includes(save)) {
                updateUserSaves = { ...User, saves: User.saves.filter((saveId) => saveId !== save) };
                appDispatch(removeSaveBlogpost({_id: blogpost._id!}));
            } else {
                updateUserSaves = { ...User, saves: [...User.saves, save] };
                appDispatch(addSaveBlogposts(blogpost));
            }
            appDispatch(editProfile(updateUserSaves));                       

        } catch (error) {
            console.error(error);
        }
    };

    return <GoBookmark
        size={23}
        className={`${User.saves && User.saves.includes(blogpost._id || "") ? "text-green-600" : ""}`}
        onClick={() => handleSave(User, blogpost)}
    />;    
};

export default Saveblogpost;
