

const useAutoScroll = () => {
    const autoScroll = (scrollPosition: number) => {         
        window.scrollTo(0, scrollPosition);
    };

    return autoScroll;
};

export default useAutoScroll;