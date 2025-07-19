import useClickOutSide from "../hooks/useClickOutSide";

type Props = {
    arrOfOptions: string[]
    className: string
    useSearch: boolean,
    search?: string
    dropDown: boolean,
    setDropDown?: () => void
    select: string,
    setSelect: React.Dispatch<React.SetStateAction<string>>
    professionAreaRef: React.MutableRefObject<HTMLElement | null>

};

const Customselection = ({
    professionAreaRef,
    arrOfOptions = [],
    className,
    useSearch,
    search = "",
    dropDown,
    setDropDown = () => { },
    select,
    setSelect,
}: Props) => {
    useClickOutSide(professionAreaRef, () => setDropDown());

    const filterSelectOptions = (arr: string[], search: string): string[] => {
        if (search.trim()) {
            const searchResult = arr.filter(item =>
                item.trim().toLowerCase()
                    .includes(select.trim().toLowerCase())
            );

            const others = arr.filter(item =>
                !item.trim().toLowerCase()
                    .includes(select.trim().toLowerCase())
            );

            return [...searchResult, ...others];
        } else {
            return arr;
        }
    };


    return <span
        className={`${dropDown ? "block" : "hidden"} absolute bg-white ${className}`}
    >
        {
            arrOfOptions &&
                arrOfOptions.length ?
                useSearch ?
                    filterSelectOptions(arrOfOptions, search)
                        .map(pro =>
                            pro.trim() ?
                                <span
                                    key={pro}
                                    className={`block w-full hover:text-white ${select.trim() === pro.trim() ? "text-white bg-blue-400" : ""} hover:bg-blue-600 px-2 py-1 transition-colors cursor-pointer`}
                                    onClick={() => {
                                        setSelect(pro);
                                    }}
                                >
                                    {pro}
                                </span> :
                                null
                        ) :
                    arrOfOptions
                        .map(pro =>
                            pro.trim() ?
                                <span
                                    key={pro}
                                    className={`block w-full hover:text-white ${select.trim() === pro.trim() ? "text-white bg-blue-400" : ""} hover:bg-blue-600 px-2 py-1 transition-colors cursor-pointer`}
                                    onClick={() => {
                                        setSelect(pro);
                                    }}
                                >
                                    {pro}
                                </span> :
                                null
                        ) :
                null
        }
    </span>;
};

export default Customselection;
