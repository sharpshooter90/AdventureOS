import { createContext, useContext, useEffect, useState } from "react";
import { AppLoader } from "@/components/app-loader";
import { useAssetLoading } from "@/hooks/use-asset-loading";

type AppContextType = {
  isInitialLoading: boolean;
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const isLoading = useAssetLoading();

  useEffect(() => {
    if (!isLoading && isInitialLoad) {
      setIsInitialLoad(false);
    }
  }, [isLoading, isInitialLoad]);

  if (isInitialLoad) {
    return <AppLoader />;
  }

  return (
    <AppContext.Provider value={{ isInitialLoading: isLoading }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
};
