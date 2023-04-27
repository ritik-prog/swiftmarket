import { createBrowserRouter } from "react-router-dom";
import Sidebar from "../component/sidebar/Sidebar";
import MainLayout from "../Layout/MainLayout";
import Login from "../pages/login/login";
import Error404 from "../error/Error404";
import Tickets from "../pages/tickets/Tickets";
import TicketDetails from "../pages/tickets/TicketDetails";
const routes = [
    {
        path: "/",
        element: <MainLayout />,
        children: [
            { path: "/", element: <><Tickets /></> },
            { path: "/ticket/:id", element: <><TicketDetails /></> },
        ]
    },
    {
        path: "/login",
        element: <Login />,
    },
    {
        path: "/error",
        element: <Error404 />,
    },
    {
        path: "*",
        element: <Error404 />,
    }
];

export default createBrowserRouter(routes);
