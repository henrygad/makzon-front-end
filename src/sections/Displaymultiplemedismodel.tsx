import { useNavigate } from "react-router-dom";
import { Button } from "../components/Button";
import Displayimage from "../components/Displayimage";
import Model from "../components/Model";
import { useAppDispatch, useAppSelector } from "../redux";
import {
  addToMediaSelections,
  clearAllSelectedMedia,
  removeFromMediaSelections,
  selectedMedia,
} from "../redux/slices/userMediaSlices";
import mediaProps from "../types/file.type";
import Displayvideo from "../components/Displayvideo";

const Displaymediamultiplemodel = () => {
  const navigate = useNavigate();
  const {
    data: Media,
    mediaSelectOptions,
    mediaSelections,
  } = useAppSelector((state) => state.userMediaSlices.media);
  const appDispatch = useAppDispatch();

  const Displaymedia = ({ media }: { media: mediaProps }) => {
    if (media.type) {
      if (
        media.type.toLowerCase() === "image" &&
        mediaSelectOptions &&
        (mediaSelectOptions.medieType === "all" ||
          mediaSelectOptions.medieType === "image")
      ) {
        return (
          <Displayimage
            url={media.url}
            useCancle={false}
            className="w-[120px] h-[120px] object-contain border rounded-md cursor-pointer"
            selected={
              mediaSelections && mediaSelections.includes(media) ? true : false
            }
            removeSelection={() =>
              appDispatch(removeFromMediaSelections({ _id: media._id }))
            }
            onClick={() => appDispatch(addToMediaSelections(media))}
          />
        );
      } else if (
        media.type.toLowerCase() === "video" &&
        mediaSelectOptions &&
        (mediaSelectOptions.medieType === "all" ||
          mediaSelectOptions.medieType === "image")
      ) {
        return (
          <Displayvideo
            url={media.url}
            className="w-[200px] h-[200px] object-contain border rounded-md"
            useCancle={false}
            selected={
              mediaSelections && mediaSelections.includes(media) ? true : false
            }
            removeSelection={() =>
              appDispatch(removeFromMediaSelections({ _id: media._id }))
            }
            onClick={() => appDispatch(addToMediaSelections(media))}
          />
        );
      } else {
        return null;
      }
    } else {
      return null;
    }
  };

  return (
    <Model
      id="display-image-galary"
      children={
        <div className="relative font-text shadow-sm bg-white">
          <div className="flex justify-center items-center gap-2 border-b shadow-sm p-2">
            {/* header */}
            <h2 className="text-2xl">Image galary</h2>
            <span>({Media && Media.length})</span>
          </div>
          <div className="flex flex-wrap justify-center gap-2 p-6 h-auto w-auto min-w-full max-w-full max-h-[480px] md:max-h-[768px] overflow-auto">
            {Media && Media.length ? (
              Media.map((md) => <Displaymedia key={md._id} media={md} />)
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
                appDispatch(clearAllSelectedMedia([]));
                navigate(mediaSelectOptions?.negativeNavigate || " ");
              }}
            />
            <Button
              id="go-back-galary-dialog"
              fieldName={
                <>
                  Add {mediaSelections && mediaSelections.length ? mediaSelections.length : null}
                </>
              }
              className={`bg-green-600 text-white text-sm rounded-md font-text ${mediaSelections && mediaSelections.length ? "cursor-pointer" : ""
                }`}
              onClick={() => {
                appDispatch(selectedMedia(mediaSelections || []));
                appDispatch(clearAllSelectedMedia([]));
                navigate(mediaSelectOptions?.positiveNavigate || " ");
              }}
              disabled={mediaSelections && !mediaSelections.length}
            />
          </div>
        </div>
      }
    />
  );
};

export default Displaymediamultiplemodel;
