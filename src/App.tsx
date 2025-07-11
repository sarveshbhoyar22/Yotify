import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { PlayerProvider } from "./context/PlayerProvider";
import Footer from "./components/Footer";
import { Home } from "lucide-react";
import SearchPage from "./SearchPage";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/search" element={<SearchPage />} />
    </Routes>
  );
};

export default App;
