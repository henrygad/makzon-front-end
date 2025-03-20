import { useEffect, useState } from "react";


const useFilterQuery = <T,>(search: string) => {
    const [query, setQuery] = useState<T | null>(null);

    const filterSearchQuery = <T,>(search: string) => {
        let queries: T | null = null;
        if (search.startsWith("?")) {
            search.slice(1).split("&").map(query => {
                const result: { [key: string]: string } = {};
                result[query.split("=")[0]] = query.split("=")[1];
                queries = { ...queries, ...result } as T;
            });
        }
        setQuery(queries);
    };

    useEffect(() => {
        filterSearchQuery(search);
    }, [search]);

    return { query };
};

export default useFilterQuery;
