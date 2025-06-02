
import { useAppDispatch, useAppSelector } from "../redux";
import { deleteBlogpost, editBlogpost } from "../redux/slices/userBlogpostSlices";
import Displaymultipleposts from "../sections/Displaymultipleposts";


const Saves = () => {
  const { data: Savedposts} = useAppSelector((state) => state.userBlogpostSlices.savedBlogposts);
  const appDispatch = useAppDispatch();

  return <main className="container">    
    <Displaymultipleposts     
      posts={Savedposts}
      updatepost={({ blogpost, type }) => {
        if (type === "EDIT") {
          appDispatch(editBlogpost(blogpost));
        } else if (type === "DELETE") {
          appDispatch(deleteBlogpost({ _id: blogpost._id }));
        }
      }}
    />
  </main>;
};

export default Saves;
