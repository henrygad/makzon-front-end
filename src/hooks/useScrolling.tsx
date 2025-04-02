

const useScrolling = () => {

    const lockScroll = () => {  
        window.addEventListener("wheel", handleScroll, { passive: false });
        window.addEventListener("touchmove", handleScroll, { passive: false });
       
    };

    const unlokckScroll = () => {
        window.removeEventListener("wheel", handleScroll);
        window.removeEventListener("touchmove", handleScroll);
    };
   

    const handleScroll = (e: Event) => {
        e.preventDefault();
    }; 

    return { lockScroll, unlokckScroll};
};

export default useScrolling;
