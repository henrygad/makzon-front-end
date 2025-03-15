import { useNavigate } from "react-router-dom";
import Displayblogpost from "../components/Displayblogpost";
import Displayuserinfor from "../components/Displayuserinfor";
import Dropmenu from "../components/Dropmenu";
import { useAppSelector } from "../redux";
import userProps from "../types/user.type";


const Userprofile = ({ User }: { User: userProps }) => {
    const { data: Blogposts, loading } = useAppSelector(state => state.userBlogpostSlices.blogposts);
    const navigate = useNavigate();

    return <div className="space-y-4">
        <div className="flex">
            {/* disply user infor*/}
            <Displayuserinfor
                short={false}
                user={User}
                onClick={()=> navigate("/profile/update")}
            />
            <div className="flex flex-col items-end justify-between py-2">
                <div className="flex items-start gap-4">
                    {/* follow btn */}
                    <button className="border py-0.5 px-4 rounded-full text-sm font-text font-semibold cursor-pointer">follow</button>
                    {/* profile menu */}
                    <Dropmenu
                        children={
                            <div></div>
                        }
                    />
                </div>
                <div className="flex gap-4">
                    <button className="text-sm">Followers</button>
                    <button className="text-sm">Followings</button>
                </div>
            </div>
        </div>
        <div className="border-t p-2 space-y-10">
            {/* list blogpost */}
            {
                !loading ?
                    <>
                        {
                            Blogposts &&
                                Blogposts.length ?
                                Blogposts
                                    .filter(blogpost => blogpost.status.toLowerCase() === "published")
                                    .map((blogpost) =>
                                        <Displayblogpost
                                            key={blogpost._id}
                                            displyType="TEXT"
                                            blogpost={blogpost}
                                        />
                                    ) :
                                <span>Publish your first blogpost</span>
                        }
                    </> :
                    <div>loading blogposts ...</div>
            }
        </div>
    </div>;
};

export default Userprofile;
