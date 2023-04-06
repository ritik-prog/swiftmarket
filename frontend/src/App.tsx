import React, { useEffect } from "react";
import { BrowserRouter } from "react-router-dom";
import NavBar from "./components/common/NavBar";
import Footer from "./components/common/Footer";
import ApplyAsSeller from "./pages/seller/ApplyAsSeller";
import ModeSwitch from "./utils/ModeSwitch";
import { useSelector } from "react-redux";
import { RootState } from "./redux/rootReducer";

function App() {
  const theme = useSelector((state: RootState) => state.theme.theme);
  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);
  return (
    <BrowserRouter>
      <div className="relative">
        <NavBar />
        <ApplyAsSeller />
        <Footer />
        <ModeSwitch theme={theme} />
      </div>
    </BrowserRouter>
  );
}

export default App;
