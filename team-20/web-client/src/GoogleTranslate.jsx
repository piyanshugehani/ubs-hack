import { useEffect } from "react";

export function GoogleTranslate() {
    useEffect(() => {
      const script = document.createElement("script");
      script.src = "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
      script.async = true;
      document.body.appendChild(script);
  
      window.googleTranslateElementInit = () => {
        if (window.google && window.google.translate) {
          new window.google.translate.TranslateElement(
            {
              pageLanguage: "en",
              includedLanguages: "hi,ta,te,kn,ml,mr,bn,gu,pa,or,as,ur", // List of Indian languages
            },
            "google_translate_element"
          );
        }
      };
  
      return () => {
        document.body.removeChild(script);
        delete window.googleTranslateElementInit; // Clean up the global function
      };
    }, []);
  
    return <div id="google_translate_element" style={{ position: "absolute", top: 10, right: 10, zIndex: 1000 }}></div>;
  }