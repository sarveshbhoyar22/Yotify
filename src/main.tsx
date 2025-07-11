import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Home } from "./pages/Home.tsx";

import Footer from "./components/Footer.tsx";
import SearchPage from "./SearchPage.tsx";
registerSW({ immediate: true });
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { registerSW } from "virtual:pwa-register";

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

// Use the ScrollToTop component in your app
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/search" element={<SearchPage />} />
      </Routes>

      <Footer />
    </BrowserRouter>
  </StrictMode>
);

// document.addEventListener("contextmenu", (event) => event.preventDefault());
