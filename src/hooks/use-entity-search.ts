import { useState, useEffect } from "react";
import { useDebounce } from "./use-debounce";

export const useEntitySearch = ({ 
    params, 
    setParams 
}: { 
    params: any; 
    setParams: (params: any) => void;
}) => {
    const [searchValue, setSearchValue] = useState(params.search || "");
    const debouncedSearch = useDebounce(searchValue, 500);

    useEffect(() => {
        setParams({ ...params, search: debouncedSearch, page: 1 });
    }, [debouncedSearch]);

    return {
        searchValue,
        onSearchChange: setSearchValue,
    };
};
