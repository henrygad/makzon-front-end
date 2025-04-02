

const useAutoNavigate = () => {
    const autoNavigate = (target: HTMLElement) => {
        const targetPositionY = target.getBoundingClientRect().top;
        const currentPostionY = window.pageYOffset;
        const distance: number = currentPostionY + targetPositionY;

        window.scroll({ top: distance, behavior: "smooth" });
    };

    return autoNavigate;
};


export default useAutoNavigate;

