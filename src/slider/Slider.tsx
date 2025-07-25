import { useState } from "react";
import { BsArrowLeftCircleFill, BsArrowRightCircleFill } from "react-icons/bs";
import Displayimage from "../components/Displayimage";

const Slider = ({ media, className }: { media: string[], className: string }) => {
  const [currentImage, setCurrentImage] = useState(0);
  const [transition, setTransition] = useState(true);

  const handlePreviousSlide = () => {
    if (currentImage === 0) {
      setTransition(false);
      setCurrentImage(media.length - 1);

      const clear = setTimeout(() => {
        setTransition(true);
        setCurrentImage((pre) => pre - 1);
        clearTimeout(clear);
      }, 100);
    } else {
      setTransition(true);
      setCurrentImage((pre)=> pre - 1);
    }
  };

  const handleNextSlide = () => {
    if (currentImage === media.length) {
      setTransition(false);
      setCurrentImage(0);

      setTimeout(() => {
        setTransition(true);
        setCurrentImage(1);
      }, 100);
    } else {
      setTransition(true);
      setCurrentImage((pre) => pre + 1);
    }
  };

  const handleDotsSlide = (index: number) => {
    setCurrentImage(index);
  };

  const handleDotsColor = () => {
    if (currentImage === media.length) {
      return 0;
    } else return currentImage;
  };

 
  if (!media.length) {
    return <div
      className={`flex ${className} rounded-md animate-pulse`}
    >
      <div className="flex-1 bg-slate-300 "></div>
    </div>;
  }

  return (
    <div className={`flex justify-center ${className}`}>
      <div className="relative flex-1 max-w-full max-h-full overflow-hidden">
        <button
          onClick={handlePreviousSlide}
          className="absolute top-1/2 -translate-y-1/2 left-6 z-20 cursor-pointer"
        >
          <BsArrowLeftCircleFill size={25} />
        </button>
        <div
          className={`flex relative ${transition ? "transition-[left] duration-700" : ""
            }`}
          style={{
            width: media.length > 0 ? (media.length * 100 + 100) + "%" : "100%",
            height: "100%",
            left: -(currentImage * 100) + "%",
          }}
          onMouseEnter={() => {
           
          }}
          onMouseLeave={() => {
           
          }}
        >
          {media.map((link, index) => (
            <div
              key={link + "_" + index}
              className="w-full h-full"
            >
              <Displayimage
                useCancle={false}
                url={link}
                alt={link}
                className="w-full h-full rounded-md object-cover"
                parentClassName="w-full h-full"
              />
            </div>
          ))}
          <div className="w-full h-full">
            <Displayimage
              useCancle={false}
              url={media[0]}
              alt={media[0]}
              className="w-full h-full rounded-md object-cover"
              parentClassName="w-full h-full"
            />
          </div>
        </div>
        <button
          onClick={handleNextSlide}
          className=" absolute top-1/2 -translate-y-1/2 right-6 z-20 cursor-pointer"
        >
          <BsArrowRightCircleFill size={25} />
        </button>
        <div className="flex gap-1 absolute bottom-6 left-1/2 -translate-x-1/2">
          {
            media.map((_, index) => (
              <button
                key={index}
                onClick={() => handleDotsSlide(index)}
                className={`h-3 w-3 border border-gray-800 rounded-full cursor-pointer transition-colors ${handleDotsColor() === index
                  ? " bg-gray-600"
                  : "bg-gray-200 "
                  }`}
              ></button>
            ))
          }
        </div>
      </div>
    </div>
  );
};

export default Slider;
