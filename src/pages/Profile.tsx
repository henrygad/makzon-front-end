
import { useParams } from "react-router-dom";
import { useAppSelector } from "../redux";
import Userprofile from "../subpages/Userprofile";
import Othersprofile from "../subpages/Othersprofile";


const Profile = () => {
    const { userName } = useParams();
    const { data: User, loading } = useAppSelector(state => state.userProfileSlices.userProfile);

    return <main className="container">
        {!loading ?
            <>
                {userName &&
                    User && userName.trim() === User.userName.trim() ?
                    <Userprofile
                        User={{ ...User }}
                    /> :
                    <Othersprofile
                        userName={userName}
                    />
                }
            </> :
            <div>loading profile page...</div>
        }
    </main>;
};

export default Profile;
