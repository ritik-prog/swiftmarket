import React, { useEffect } from "react";
import { BrowserRouter } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "./redux/rootReducer";
import AppRoutes from "./routes";
import ModeSwitch from "./utils/ModeSwitch";

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
      <AppRoutes />
      <ModeSwitch />
    </BrowserRouter>
  );
}

export default App;
