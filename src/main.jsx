import React from "react";   
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import LoadingProvider from "./components/LoadingProvider";
import { BrowserRouter } from "react-router-dom";

createRoot(document.getElementById("root")).render(

  <React.StrictMode>
    <LoadingProvider>
      <BrowserRouter>
       <App />
     </BrowserRouter>
    </LoadingProvider>
  </React.StrictMode>
)
