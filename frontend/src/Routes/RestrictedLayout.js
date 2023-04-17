import Login from "../pages/auth/SignIn";
import SignUp from "../pages/auth/SignUp";
import EmptyLayout from "../layouts/EmptyLayout";

export const RestrictedLayoutRoutes =
{
    path: "/",
    element: <EmptyLayout />,
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
}
