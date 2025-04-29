import { createContext, useState } from "react";

export const SearchContext = createContext()

export const SearchProvider = ({children}) => {
    const [inSearch, setInSearch] = useState(false)
    const [searchData, setSearchData] = useState({})

    return (
        <SearchContext.Provider value={{inSearch,setInSearch,searchData,setSearchData}}>
            {children}
        </SearchContext.Provider>
    )
}