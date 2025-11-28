import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface AccessibilityContextType {
    highContrast: boolean;
    largeText: boolean;
    toggleHighContrast: () => void;
    toggleLargeText: () => void;
}

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

export const AccessibilityProvider = ({ children }: { children: ReactNode }) => {
    const [highContrast, setHighContrast] = useState(() => {
        return localStorage.getItem("highContrast") === "true";
    });
    const [largeText, setLargeText] = useState(() => {
        return localStorage.getItem("largeText") === "true";
    });

    useEffect(() => {
        localStorage.setItem("highContrast", highContrast.toString());
        localStorage.setItem("largeText", largeText.toString());

        // 전역 스타일 적용
        const root = document.documentElement;
        if (highContrast) {
            root.classList.add("high-contrast");
        } else {
            root.classList.remove("high-contrast");
        }

        if (largeText) {
            root.classList.add("large-text");
        } else {
            root.classList.remove("large-text");
        }
    }, [highContrast, largeText]);

    const toggleHighContrast = () => {
        setHighContrast((prev) => !prev);
    };

    const toggleLargeText = () => {
        setLargeText((prev) => !prev);
    };

    return (
        <AccessibilityContext.Provider
            value={{
                highContrast,
                largeText,
                toggleHighContrast,
                toggleLargeText,
            }}
        >
            {children}
        </AccessibilityContext.Provider>
    );
};

export const useAccessibility = () => {
    const context = useContext(AccessibilityContext);
    if (context === undefined) {
        throw new Error("useAccessibility must be used within an AccessibilityProvider");
    }
    return context;
};

