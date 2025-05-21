
import { useParams } from "react-router-dom";
import { useAppSelector } from "../redux";
import Userprofile from "../subpages/Userprofile";
import Othersprofile from "../subpages/Othersprofile";


const Profile = () => {
    const { userName } = useParams();
    const { data: User, loading } = useAppSelector(state => state.userProfileSlices.userProfile);

    return <main className="container">
        {userName &&
            User && userName.trim() === User.userName.trim() ?
            <Userprofile
                User={{ ...User }}
                loading={loading}
            /> :
            <Othersprofile
                userName={userName}
            />
        }
    </main>;
};

export default Profile;
