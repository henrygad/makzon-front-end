import { useNavigate } from "react-router-dom";
import Displaylike from "../components/Displaylike";


const Followings = ({ following }: { following: string[] }) => {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-start gap-4 sticky top-0 px-1 py-2 shadow-sm">
        <span
          onClick={() => navigate(-1)}
        >
          back
        </span>
        <span className="text-xl font-sec font-semibold">
          Following {following.length || 0}
        </span>
      </div>
      <div className="pl-6 space-y-2">
        {
          following &&
            following.length ?
            following.map(userName =>
              <Displaylike key={userName} userName={userName} />
            ) :
            <span className="block text-center">
              No followers yet
            </span>
        }
      </div>
    </div>
  );
};

export default Followings;
