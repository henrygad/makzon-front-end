import { ReactElement, useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";

type Props = {
  id: string;
  children: ReactElement;
};

const Modal = ({ id, children }: Props) => {
  const location = useLocation();
  const currentModalIdRef = useRef("");
  const lastHashIdRef = useRef("");
  const [displayModal, setDisplayModal] = useState(false);

  const handleDisplayModal = () => {
    const hashId = location.hash.trim().slice(1);
    if (hashId &&
      hashId.trim() === id.trim()
    ) {
      currentModalIdRef.current = id;
      lastHashIdRef.current = hashId;
      setDisplayModal(true);
      document.body.classList.add("overflow-hidden");
    } else {
      if (lastHashIdRef.current === currentModalIdRef.current) {
        setDisplayModal(false);
        if (displayModal) document.body.classList.remove("overflow-hidden");
      }
    }   
  };

  const handlePopState = () => {
    handleDisplayModal();
    return () => document.body.classList.remove("overflow-hidden");
  };


  useEffect(() => {
    handleDisplayModal();
    return () => document.body.classList.remove("overflow-hidden");
  }, [location.hash]);


  useEffect(() => {
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  return displayModal ? <div
    id={id.trim().toLowerCase()}
    className="fixed top-0 bottom-0 right-0 left-0 bg-gray-600/55 z-50"
  >
    {children}
  </div > :
    null;
};

export default Modal;
