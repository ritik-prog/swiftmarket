import { createBrowserRouter } from "react-router-dom";
import Checkout from "../pages/order/checkout";
import Error404 from "../pages/error/Error404";
import Verification from "../pages/auth/Verification";
import Profile from "../pages/profile";
import { MainLayoutRoutes } from "./MainLayoutRoutes";
import { SecuredLayoutRoutes } from "./SecuredLayoutRoutes";
import { RestrictedLayoutRoutes } from "./RestrictedLayout";

const routes = [
    MainLayoutRoutes,
    SecuredLayoutRoutes,
    RestrictedLayoutRoutes,
    // Profile using withAuth
    {
        path: "profile",
        element: (
            <>
                <Profile />
            </>
        ),
    },
    // No Layout
    {
        path: "/verification",
        element: <Verification />,
    },
    {
        path: "/checkout",
        element: <Checkout />,
    },
    {
        path: "*",
        element: <Error404 />,
    },
];

export default createBrowserRouter(routes);
