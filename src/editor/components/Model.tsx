import { ReactElement, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

type Props = {
  id: string;
  children: ReactElement;
};

const Model = ({ id, children }: Props) => {
  const [displayModel, setDisplayModel] = useState(false);
  const location = useLocation();

  const handleDisplayModel = (id: string, hashId: string) => {
    if (hashId.trim().toLowerCase() === id.trim().toLowerCase()) {
      setDisplayModel(true);
      document.body.classList.add("overflow-hidden");
    } else {
      setDisplayModel(false);
      if (displayModel) document.body.classList.remove("overflow-hidden");
    }
  };

  const handlePopState = () => {
    const hashId = location.hash.trim().slice(1);
    handleDisplayModel(id, hashId);
  };

  useEffect(() => {
    const hashId = location.hash.trim().slice(1);
    handleDisplayModel(id, hashId);
  }, [location.hash, id]);

  useEffect(() => {
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  return (
    <div
      id={id.trim().toLowerCase()}
      className={`${displayModel ?
        "block" :
        "hidden"
        } fixed top-0 bottom-0 right-0 left-0 w-full h-full max-w-full max-h-full bg-gray-600/55 z-50`}
    >
      <div className="relative w-screen h-screen max-w-full max-h-screen flex justify-center items-center animate-none px-3 overflow-hidden">
        {children}
      </div>
    </div>
  );
};

export default Model;
