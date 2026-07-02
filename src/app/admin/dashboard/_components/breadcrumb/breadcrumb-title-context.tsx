"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

type BreadcrumbTitleContextValue = {
  title: string | null;
  setTitle: (title: string | null) => void;
};

const BreadcrumbTitleContext = createContext<BreadcrumbTitleContextValue | null>(null);

export function BreadcrumbTitleProvider({ children }: { children: ReactNode }) {
  const [title, setTitleState] = useState<string | null>(null);
  const setTitle = useCallback((next: string | null) => setTitleState(next), []);

  const value = useMemo(() => ({ title, setTitle }), [title, setTitle]);

  return (
    <BreadcrumbTitleContext.Provider value={value}>{children}</BreadcrumbTitleContext.Provider>
  );
}

export function useBreadcrumbTitle() {
  return useContext(BreadcrumbTitleContext);
}

/** Sets the layout breadcrumb label for the current page (e.g. task title). */
export function SetBreadcrumbTitle({ title }: { title: string }) {
  const ctx = useBreadcrumbTitle();

  useEffect(() => {
    ctx?.setTitle(title);
    return () => ctx?.setTitle(null);
  }, [title, ctx]);

  return null;
}
