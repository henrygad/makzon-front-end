import { useNavigate } from "react-router-dom";
import { Button } from "../components/Button";
import Model from "../components/Model";
import { useAppDispatch, useAppSelector } from "../redux";
import { clearSelectedMedia } from "../redux/slices/userMediaSlices";
import Displaymedia from "../components/Displaymedia";

const Displaymediamultiplemodel = () => {
  const navigate = useNavigate();
  const { data: Media, selectedMedia } = useAppSelector((state) => state.userMediaSlices.media);
  const appDispatch = useAppDispatch();

  return (
    <Model
      id="display-image-galary"
      children={
        <section className="relative font-text shadow-sm bg-white">
          <div className="flex justify-center items-center gap-2 border-b shadow-sm p-2">
            {/* header */}
            <h2 className="text-2xl">Image galary</h2>
            <span>({Media && Media.length})</span>
          </div>
          <div className="flex flex-wrap justify-center gap-2 p-6 h-auto w-auto min-w-full max-w-full max-h-[480px] md:max-h-[768px] overflow-auto">
            {Media && Media.length ? (
              Media.map((md) =>
                <Displaymedia
                  key={md._id}
                  media={md}
                  useSelect={true}
                  handleDelete={undefined}
                />)
            ) : (
              <span>No Image</span>
            )}
          </div>          
          <div className="flex justify-between items-center gap-2 border-t shadow-sm px-4 py-2">
            {/* footer */}
            <Button
              id="go-back-galary-dialog"
              fieldName={"Go back"}
              className="bg-red-600 text-white text-sm rounded-md font-text"
              onClick={() => {
                appDispatch(clearSelectedMedia([]));
                navigate(-1);
              }}
            />
            <Button
              id="go-back-galary-dialog"
              fieldName={
                <>
                  Add {selectedMedia && selectedMedia.length ? selectedMedia.length : null}
                </>
              }
              className={`bg-green-600 text-white text-sm rounded-md font-text ${selectedMedia && selectedMedia.length ? "cursor-pointer" : ""
                }`}
              onClick={() => {                
                appDispatch(clearSelectedMedia([]));
                navigate(-1);
              }}
              disabled={selectedMedia && !selectedMedia.length}
            />
          </div>
        </section>
      }
    />
  );
};

export default Displaymediamultiplemodel;
