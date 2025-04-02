

const useTrimWords = () => {
    const trim = (words: string, numWords: number) => {
        return words.split(" ", numWords).join(" ");
    };
    
    return trim;
};

export default useTrimWords;