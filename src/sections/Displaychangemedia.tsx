import { IoArrowBackSharp } from "react-icons/io5";
import Dialog from "../components/Dialog";
import Fileinput from "../components/Fileinput";
import useGetLocalFiles from "../hooks/useGetLocalFiles";
import Displayimage from "../components/Displayimage";
import { useNavigate } from "react-router-dom";
import imgplaceholder from "../assets/imageplaceholder.svg";
import Modal from "../components/Modal";
import Displaymedia from "../components/Displaymedia";
import { Button } from "../components/Button";
import { useAppSelector } from "../redux";
import { useState } from "react";
import mediaProps from "../types/media.type";

type Props = {
  title: string
  dialog: boolean,
  handleDialog: () => void
  viewMediaUrl: string
  setGetMediaFromDevice: ({ blob, tempUrl }: { blob: Blob, tempUrl: string }) => void
  setGetMediaFromGalary: (url: string[]) => void
  onCancelGetMediaFromGalary?: (url: string[]) => void
}

const Displaychangemedia = ({ title, dialog, handleDialog, viewMediaUrl, setGetMediaFromDevice, setGetMediaFromGalary, onCancelGetMediaFromGalary = () => null }: Props) => {
  const { data: Media } = useAppSelector((state) => state.userMediaSlices.media);
  const [selectMedia, setSelectMedia] = useState<mediaProps[]>([]);
  const { getLocalFiles } = useGetLocalFiles();
  const navigate = useNavigate();

  return <section>
    <Dialog
      dialog={dialog}
      handleDialog={handleDialog}
      className="font-text text-slate-800 font-normal min-w-[220px] sm:min-w-[240px] max-w-[240px]"
      children={<>
        <span className="flex items-center gap-3 border-b p-4">
          <button className="cursor-pointer" onClick={handleDialog}>
            <IoArrowBackSharp size={19} />
          </button>
          <span className="text-base whitespace-pre font-semibold">{title}</span>
        </span>
        <span className="flex justify-center w-full h-full">
          <Displayimage
            url={viewMediaUrl}
            useCancle={false}
            parentClassName="flex-1 min-h-[80px] max-h-[80px]"
            className="h-full w-full object-contain rounded-md cursor-pointer"
            placeHolder={
              <img
                src={imgplaceholder}
                className="absolute top-0 bottom-0 right-0 h-full w-full object-contain rounded-md cursor-pointer"
                onClick={() =>
                  navigate(
                    `?url=${viewMediaUrl}&type=image#single-image`
                  )
                }
              />
            }
            loadingPlaceHolder={
              <span className="absolute top-0 bottom-0 right-0 left-0 h-full w-full rounded-md bg-slate-200 animate-pulse"></span>
            }
            onClick={() =>
              navigate(
                `?url=${viewMediaUrl}&type=image#single-image`
              )
            }
          />

        </span>
        <span className="flex text-sm font-medium text-slate-60 px-4 border-t">
          <span className="flex-1 flex justify-start items-center px-2 py-4">
            <Fileinput
              id="choose-media-from-device"
              accept="image/png, image/gif, image/jpeg"
              type="image"
              fieldName="From device"
              handleGetFile={async (fileList) => {
                handleDialog();
                try {
                  if (fileList) {
                    const data = await getLocalFiles(fileList);
                    setGetMediaFromDevice({ blob: fileList[0], tempUrl: data[0].url });
                  }
                } catch (error) {
                  console.error(error);
                }
              }}
            />
          </span>
          <span className="flex-1 flex justify-end items-center border-l px-2 py-4">
            <button
              className="font-text text-nowrap whitespace-pre text-sm cursor-pointer"
              onClick={() => {
                handleDialog();
                setTimeout(() => {
                  navigate("#display-image-galary");
                }, 100);
              }}>
              From galary
            </button>
          </span>
        </span>
      </>}
    />
    <Modal
      id="display-image-galary"
      children={
        <div className="bg-white h-screen max-h-screen overflow-hidden scroll-auto">
          <div className="container relative">
            <span className="flex items-center gap-3 border-b p-2">
              <button
                className="cursor-pointer"
                onClick={() => {
                  setSelectMedia([]);
                  navigate(-1);
                }}
              >
                <IoArrowBackSharp size={19} />
              </button>
              <span className="text-xl whitespace-pre font-semibold">Galary</span>
            </span>
            <div className="flex flex-wrap gap-2 py-4">
              {Media && Media.length ? (
                Media.map((md) =>
                  <Displaymedia
                    key={md._id}
                    media={md}
                    useSelect={true}
                    handleDelete={undefined}
                    selectMedia={selectMedia}
                    setSelectMedia={setSelectMedia}
                  />)
              ) : (
                <span className="text-xl font-text font-bold flex justify-center items-center">No Image</span>
              )}
            </div>
            <span className="flex justify-between items-center mt-8">
              {/* footer */}
              <Button
                id="go-back-galary-dialog"
                fieldName={"Cancel"}
                className="font-text font-semibold py-1 bg-red-600 text-white text-sm rounded-md"
                onClick={() => {
                  onCancelGetMediaFromGalary([]);
                  setSelectMedia([]);
                  navigate(-1);
                }}
              />
              <Button
                id="go-back-galary-dialog"
                fieldName={
                  <>
                    Add {selectMedia.length || null}
                  </>
                }
                className={`font-text font-semibold py-1 bg-green-600 text-white text-sm rounded-md ${selectMedia.length ? "cursor-pointer" : "opacity-25"}`}
                onClick={() => {
                  setGetMediaFromGalary(selectMedia.map(md => md.filename));
                  setSelectMedia([]);
                  navigate(-1);
                }}
                disabled={!selectMedia.length}
              />
            </span>
          </div>
        </div>
      }
    />
  </section>;
};

export default Displaychangemedia;
