import React, { PropsWithChildren, useContext } from "react";

interface AsideComponentContext {
  asideComponent?: React.ReactNode;
  setAsideComponent: (component: React.ReactNode) => void;
}

const AsideComponentContext = React.createContext<AsideComponentContext | undefined>(undefined);

export const useAsideComponentContext = () => {
  const context = useContext(AsideComponentContext);
  if (context === undefined) {
    throw new Error("useAsideComponentContext must be used within a AsideComponentProvider");
  }
  return context;
};

export const AsideComponentProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [asideComponent, setAsideComponent] = React.useState<React.ReactNode>();

  return (
    <AsideComponentContext.Provider value={{ asideComponent, setAsideComponent }}>
      {children}
    </AsideComponentContext.Provider>
  );
};
