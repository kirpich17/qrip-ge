"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface FooterVisibilityContextType {
  showPhone: boolean;
  showEmail: boolean;
  togglePhone: () => void;
  toggleEmail: () => void;
}

const FooterVisibilityContext = createContext<FooterVisibilityContextType>({
  showPhone: true,
  showEmail: true,
  togglePhone: () => {},
  toggleEmail: () => {},
});

export const FooterVisibilityProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [showPhone, setShowPhone] = useState(true);
  const [showEmail, setShowEmail] = useState(true);

  return (
    <FooterVisibilityContext.Provider
      value={{
        showPhone,
        showEmail,
        togglePhone: () => setShowPhone((prev) => !prev),
        toggleEmail: () => setShowEmail((prev) => !prev),
      }}
    >
      {children}
    </FooterVisibilityContext.Provider>
  );
};

export const useFooterVisibility = () => useContext(FooterVisibilityContext);
