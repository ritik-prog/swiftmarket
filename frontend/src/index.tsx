import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import reportWebVitals from "./reportWebVitals";
import { Provider } from "react-redux";
import { RouterProvider } from "react-router-dom";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "./redux/store";
import FullPageLoading from "./pages/loading/FullPageLoading";
import routes from "./routes";
import ModeSwitch from "./utils/ModeSwitch";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={<FullPageLoading />} persistor={persistor}>
        <RouterProvider router={routes} />
        <ModeSwitch />
      </PersistGate>
      <ToastContainer />
    </Provider>
  </React.StrictMode>
);

reportWebVitals();
