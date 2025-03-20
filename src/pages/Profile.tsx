
import { useParams } from "react-router-dom";
import { useAppSelector } from "../redux";
import Footernav from "../sections/Footernav";
import Headernav from "../sections/Headernav";
import Userprofile from "../subpages/Userprofile";
import Othersprofile from "../subpages/Othersprofile";


const Profile = () => {
    const { userName } = useParams();
    const { data: User, loading } = useAppSelector(state => state.userProfileSlices.userProfile);

    return <>
        <Headernav />
        <main className="container">
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
        </main>
        <Footernav />
    </>;
};

export default Profile;
