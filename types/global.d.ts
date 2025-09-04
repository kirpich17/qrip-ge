export {};

declare global {
  interface Window {
    selectedLanguage: string | null;
    setSelectedLanguage: (lang: string) => void;
  }
}
