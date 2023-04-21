import { createBrowserRouter } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import Dashboard from "./pages/dashboard/Dashboard";
import Products from "./pages/products/Products";
import Error404 from "./pages/error/Error404";
import OrdersTable from "./pages/orders/Orders";
import FundRelease from "./pages/funds/FundRelease";
import UpdateProfile from "./pages/Settings/UpdateProfile";
import Login from "./pages/login/Login";

const router = createBrowserRouter([
    {
        path: "/",
        element: <MainLayout />,
        children: [
            {
                path: "/",
                element: <Dashboard />,
            },
            {
                path: "/orders",
                element: <OrdersTable />,
            },
            {
                path: "/products",
                element: <Products />,
            },
            {
                path: "/funds",
                element: <FundRelease />,
            },
            {
                path: "/profile",
                element: <UpdateProfile />,
            }
        ],
    },
    {
        path: "/login/:email",
        element: <Login />,
    },
    {
        path: "error",
        element: <Error404 />,
    },
    {
        path: "*",
        element: <Error404 />,
    }
]);

export default router