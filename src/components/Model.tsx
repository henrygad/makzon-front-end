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
    if (hashId.trim() &&
      hashId.trim().toLowerCase() === id.trim().toLowerCase()) {
      setDisplayModel(true); 
    } else {
      setDisplayModel(false);     
    }

  };

  const handleStopScrolling = () => { 
    if (displayModel) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");      
    }

  };

  const handlePopState = () => {
    const hashId = location.hash.trim().slice(1);
    handleDisplayModel(id, hashId);
  };


  useEffect(() => {
    handleStopScrolling();
  }, [displayModel]);

  useEffect(() => {
    const hashId = location.hash.trim().slice(1);
    handleDisplayModel(id, hashId);
  }, [id, location.hash]);

  useEffect(() => {
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);


  return (
    displayModel ? <div
      id={id.trim().toLowerCase()}
      className="block fixed top-0 bottom-0 right-0 left-0 w-full h-full max-w-full max-h-full bg-gray-600/55 z-50"
    >
      <div className="relative w-screen h-screen max-w-full max-h-screen flex justify-center items-center overflow-hidden">
        {children}
      </div>
    </div > : null
  );
};

export default Model;
