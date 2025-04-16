import { ReactElement, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

type Props = {
  id: string;
  children: ReactElement;
};

const Model = ({ id, children }: Props) => {
  const location = useLocation();
  const [currentModelId, setCurrentModelId] = useState("");
  const [lastHashId, setLastHashId] = useState("");
  const [displayModel, setDisplayModel] = useState(false);

  const handleDisplayModel = () => {
    const hashId = location.hash.trim().slice(1);
    if (hashId &&
      hashId.trim() === id.trim()
    ) {
      setCurrentModelId(id);
      setLastHashId(hashId);
      setDisplayModel(true); 
      document.body.classList.add("overflow-hidden");     
    }else {
      if (lastHashId && lastHashId.trim() === currentModelId.trim()) {
        setDisplayModel(false);
        if(displayModel)document.body.classList.remove("overflow-hidden");
      }
    }

    return () => document.body.classList.remove("overflow-hidden");
  };
 
  const handlePopState = () => {
    handleDisplayModel();
  };

  useEffect(() => {
    handleDisplayModel();
  }, [location.hash]);


  useEffect(() => {
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  return (
    displayModel ?
      <div
        id={id.trim().toLowerCase()}
        className="block fixed top-0 bottom-0 right-0 left-0 w-full h-full max-w-full max-h-full bg-gray-600/55 z-50"
      >
        <div className="container relative w-screen h-screen max-w-full max-h-screen flex justify-center items-center overflow-hidden">
          {children}
        </div>
      </div > :
      null
  );
};

export default Model;
