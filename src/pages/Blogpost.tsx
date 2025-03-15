import { useLocation, useParams } from "react-router-dom";
import Headernav from "../sections/Headernav";
import Footernav from "../sections/Footernav";
import postProps from "../types/post.type";
import Displayblogpost from "../components/Displayblogpost";

const Blogpost = () => {
    const param = useParams();
    const location = useLocation();
    const state = location.state as { blogpost: postProps | undefined };    

    return <>
        <Headernav />
        <main className="container">
            {
                state.blogpost ?                     
                    state.blogpost.status.toLowerCase() === "published" ?                        
                    <Displayblogpost
                        displyType="_HTML"
                        blogpost={state.blogpost}
                        /> :
                        <span>This blogpost has been unpublish</span>
                     :
                    null
                    
            }
        </main>
        <Footernav />
    </>;
};

export default Blogpost;
