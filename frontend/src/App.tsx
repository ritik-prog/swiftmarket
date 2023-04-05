import React, { useEffect, useState } from "react";
import logo from "./logo.svg";
import Login from "./pages/auth/Login";
import { BrowserRouter } from "react-router-dom";
import { SignUp } from "./pages/auth/SignUp";
import { Table } from "./components/common/Table";
import Verification from "./pages/auth/Verification";
import Error404 from "./pages/error/Error404";
import Home from "./pages/home/Home";
import NavBar from "./components/common/NavBar";
import Services from "./components/ui/Services";
import Faq from "./components/ui/Faq";
import Portfolio from "./components/ui/ProductBanner";
import Footer from "./components/common/Footer";
import SellerBanner from "./components/ui/SellerBanner";

function App() {
  const [theme, setTheme] = useState("");
  useEffect(() => {
    if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      setTheme("dark");
    } else {
      setTheme("light");
    }
  }, []);
  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);
  const handleThemeSwitch = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };
  return (
    <BrowserRouter>
      <div className="relative">
        <NavBar />
        <Home />
        <Portfolio />
        <SellerBanner />
        <Services />
        <Faq />
        <Footer />
        <button
          className="z-20 fixed bottom-4 right-4 p-2 rounded-md focus:outline-none"
          onClick={handleThemeSwitch}
        >
          {theme === "dark" ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-6 h-6 text-yellow-500"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z"
              />
            </svg>
          )}
        </button>
      </div>
    </BrowserRouter>
  );
}

export default App;
