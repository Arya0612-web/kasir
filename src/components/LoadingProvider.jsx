// src/components/LoadingProvider.jsx
import { useState, useEffect } from "react";
import LoadingOverlay from "./LoadingOverlay";
import { setLoadingHandlers } from "../pages/loadingManager";

export default function LoadingProvider({ children }) {
  const [loading, setLoading] = useState(false);
  // const [text, setText] = useState("");

  useEffect(() => {
    // Daftarkan handler global
    setLoadingHandlers({
      showLoading: (msg = "...") => {
        // setText(msg);
        setLoading(true);
      },
      hideLoading: () => setLoading(false),
    });
  }, []);

  return (
    <>
      {children}
      <LoadingOverlay show={loading}  />
    </>
  );
}
// text={text}