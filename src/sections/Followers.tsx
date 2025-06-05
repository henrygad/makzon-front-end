import { useNavigate } from "react-router-dom";
import Displaylike from "../components/Displaylike";
import { IoArrowBackSharp } from "react-icons/io5";

const Followers = ({ followers }: { followers: string[] }) => {
  const navigate = useNavigate();

  return (
    <section className="bg-white h-screen max-h-screen">
      <div className="container space-y-6">
        <nav className="flex items-center gap-4 py-4 mb-2 ">
          {/* return button */}
          <button onClick={() => navigate(-1)} className="cursor-pointer">
            <IoArrowBackSharp size={24} />
          </button>
          {/* page title */}
          <span>
            <h2 className="font-text text-xl font-semibold whitespace-pre capitalize">
              Followers {followers.length || null}
            </h2>
          </span>
        </nav>
        <div className="pl-6 space-y-2">
          {
            followers &&
              followers.length ?
              followers.map(userName =>
                <Displaylike key={userName} userName={userName} />
              ) :
              <div className="flex justify-center items-center">
                <span className="font-text text-xl text-slate-600">No followers yet</span>
              </div>
          }
        </div>
      </div>
    </section>
  );
};

export default Followers;
