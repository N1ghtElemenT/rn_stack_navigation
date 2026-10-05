import React, { createContext, useCallback, useContext, useState } from "react";

interface SearchFocusContextType {
  focusSignal: number;
  requestFocus: () => void;
}

const SearchFocusContext = createContext<SearchFocusContextType>({
  focusSignal: 0,
  requestFocus: () => {},
});

export function SearchFocusProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [focusSignal, setFocusSignal] = useState(0);

  const requestFocus = useCallback(() => {
    setFocusSignal((prev) => prev + 1);
  }, []);

  return (
    <SearchFocusContext.Provider value={{ focusSignal, requestFocus }}>
      {children}
    </SearchFocusContext.Provider>
  );
}

export function useSearchFocus() {
  return useContext(SearchFocusContext);
}
