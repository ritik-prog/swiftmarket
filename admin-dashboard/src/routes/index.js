import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import UserLayout from "../layouts/UserLayout";
import Users from "../pages/user/Users";
import NewUser from "../pages/user/NewUser";
import Error404 from "../pages/error/Error404";
import UpdateUser from "../pages/user/updateuser/UpdateUser";
import Seller from "../pages/seller/Sellers";
import SellerLayout from "../layouts/SellerLayout";
import SellerRequests from "../pages/seller/SellerRequests";
import UpdateSeller from "../pages/seller/UpdateSeller";
import ProductLayout from "../layouts/ProductLayout";
import Products from "../pages/product/Products";
import UpdateProduct from "../pages/product/UpdateProduct";
import TicketLayout from "../layouts/TicketLayout";
import Tickets from "../pages/ticket/Tickets";
import UpdateTicket from "../pages/ticket/UpdateTicket";
import OrderRefundLayout from "../layouts/OrderRefundeLayout";
import OrderRefund from "../pages/order/OrderRefund";
import Transactions from "../pages/transaction/Transactions";
import TransactionsLayout from "../layouts/TransactionLayout";
import WithdrawalRequestLayout from "../layouts/WithdrawalRequest";
import WithdrawalRequest from "../pages/payroll/WithdrawalRequest";
import Dashboard from "../pages/dashboard/Dashboard";
import Login from "../pages/login/login";
const routes = [
    {
        path: "/",
        element: <MainLayout />,
        children: [
            { path: "/", element: <><Dashboard /></> },
            { path: "/user", element: <><UserLayout><Users /></UserLayout></> },
            { path: "/newuser", element: <><UserLayout><NewUser /></UserLayout></> },
            { path: "/updateuser/:userId", element: <><UserLayout><UpdateUser /></UserLayout></> },
            { path: "/seller", element: <><SellerLayout><Seller /></SellerLayout></> },
            { path: "/sellerrequests", element: <><SellerLayout><SellerRequests /></SellerLayout></> },
            { path: "/updateseller", element: <><SellerLayout><UpdateSeller /></SellerLayout></> },
            { path: "/product", element: <><ProductLayout><Products /></ProductLayout></> },
            { path: "/updateproduct", element: <><ProductLayout><UpdateProduct /></ProductLayout></> },
            { path: "/ticket", element: <><TicketLayout><Tickets /></TicketLayout></> },
            { path: "/updateticket", element: <><TicketLayout><UpdateTicket /></TicketLayout></> },
            { path: "/orderrefund", element: <><OrderRefundLayout><OrderRefund /></OrderRefundLayout></> },
            { path: "/transaction", element: <><TransactionsLayout><Transactions /></TransactionsLayout></> },
            { path: "/payroll", element: <><WithdrawalRequestLayout><WithdrawalRequest /></WithdrawalRequestLayout></> },
            {
                path: "*",
                element: <Error404 />,
            }
        ]
    },
    {
        path: "/login",
        element: <Login />,
    },
    {
        path: "*",
        element: <Error404 />,
    }
];

export default createBrowserRouter(routes);
