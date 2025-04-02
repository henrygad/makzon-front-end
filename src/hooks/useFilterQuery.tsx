
const useFilterQuery = () => {

    const filterQuery = <T,>(queries: string) => {
        let searchObj: T | undefined = undefined;
        if (queries.startsWith("?")) {
            queries.slice(1).split("&").map(query => {
                const result: { [key: string]: string } = {};
                result[query.split("=")[0]] = query.split("=")[1];
                searchObj = { ...searchObj, ...result } as T;
            });
        }
        return searchObj as T | undefined;
    };

    return filterQuery;
};

export default useFilterQuery;
