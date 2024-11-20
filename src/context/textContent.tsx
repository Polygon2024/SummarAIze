import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';

interface ExtensionContextProps {
  textContent: string;
  setTextContent: (text: string) => void;
}

const ExtensionContext = createContext<ExtensionContextProps | undefined>(
  undefined
);

export const ExtensionProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [textContent, setTextContent] = useState<string>('');

  useEffect(() => {
    // Load initial text content from Chrome storage when the component mounts
    chrome.storage?.sync.get(['textContent'], (result) => {
      if (result.textContent !== undefined) {
        setTextContent(result.textContent);
      }
    });
  }, []);

  useEffect(() => {
    // Save the current text content to Chrome storage whenever it changes
    chrome.storage?.sync.set({ textContent });
  }, [textContent]);

  return (
    <ExtensionContext.Provider value={{ textContent, setTextContent }}>
      {children}
    </ExtensionContext.Provider>
  );
};

// Custom hook to use the Extension context
export const useExtensionContext = () => {
  const context = useContext(ExtensionContext);
  if (!context) {
    throw new Error(
      'useExtensionContext must be used within an ExtensionProvider'
    );
  }
  return context;
};
