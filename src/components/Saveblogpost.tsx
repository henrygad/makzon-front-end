import axios from "axios";
import { useAppDispatch } from "../redux";
import { editProfile } from "../redux/slices/userProfileSlices";
import postProps from "../types/post.type";
import userProps from "../types/user.type";
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
            } else {
                updateUserSaves = { ...User, saves: [...User.saves, save] };
            }
            appDispatch(editProfile(updateUserSaves));
        } catch (error) {
            console.error(error);
        }
    };

    return <span
        className={`${User && User.saves.includes(blogpost._id || "") ? "text-green-600" : ""}`}
        onClick={() => handleSave(User, blogpost)}
    >
        save
    </span>;
};

export default Saveblogpost;
