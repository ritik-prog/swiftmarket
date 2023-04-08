import { Route, Routes, createBrowserRouter } from "react-router-dom";
import SignUp from "./pages/auth/SignUp";
import ApplyAsSeller from "./pages/seller/ApplyAsSeller";
import Login from "./pages/auth/SignIn";
import Home from "./pages/home";
import LandingPage from "./pages/landing";
import SearchFilter from "./pages/product/SearchFilter";
import Overview from "./pages/product/Overview";
import { ShoppingCart } from "./pages/order/cart";
import Wishlist from "./pages/order/wishlist/Wishlist";
import Checkout from "./pages/order/checkout";
import Privacy from "./pages/conditions/privacy";
import TandC from "./pages/conditions/tandc";
import { OrderConfirmed } from "./pages/order/confirmed";
import { OrderDetails } from "./pages/order/details/indes";
import Error404 from "./pages/error/Error404";
import Verification from "./pages/auth/Verification";
import MainLayout from "./layouts/MainLayout";
import SecuredLayout from "./layouts/SecuredLayout";
import RestrictedLayout from "./layouts/RestrictedLayout";
import Profile from "./pages/profile";

const routes = [
    // Main Layout
    {
        path: "/",
        element: <MainLayout />,
        children: [
            {
                path: "/",
                element: (
                    <>
                        <LandingPage />
                    </>
                ),
            },
            {
                path: "applyforseller",
                element: (
                    <>
                        <ApplyAsSeller />
                    </>
                ),
            },
            {
                path: "shop",
                element: (
                    <>
                        <Home />
                    </>
                ),
            },
            {
                path: "search",
                element: (
                    <>
                        <SearchFilter />
                    </>
                ),
            },
            {
                path: "product",
                element: (
                    <>
                        <Overview />
                    </>
                ),
            },
            {
                path: "privacypolicy",
                element: (
                    <>
                        <Privacy />
                    </>
                ),
            },
            {
                path: "termsandconditions",
                element: (
                    <>
                        <TandC />
                    </>
                ),
            },
        ],
    },
    // Secured Layout
    {
        path: "/",
        element: <SecuredLayout />,
        children: [
            {
                path: "cart",
                element: (
                    <>
                        {" "}
                        <ShoppingCart />
                    </>
                ),
            },
            {
                path: "wishlist",
                element: (
                    <>
                        <Wishlist />
                    </>
                ),
            }, {
                path: "orderconfirmed",
                element: (
                    <>
                        <OrderConfirmed />
                    </>
                ),
            },
            {
                path: "orders",
                element: (
                    <>
                        <OrderDetails />
                    </>
                ),
            },
        ],
    },
    // Restricted Layout
    {
        path: "/",
        element: <RestrictedLayout />,
        children: [
            {
                path: "/signin",
                element: <Login />,
            },
            {
                path: "/signup",
                element: <SignUp />,
            },
        ],
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
    {
        path: "profile",
        element: (
            <>
                <Profile />
            </>
        ),
    },
];

export default createBrowserRouter(routes);
