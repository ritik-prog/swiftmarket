import SecuredLayout from "../layouts/SecuredLayout";
import { ShoppingCart } from "../pages/order/cart";
import Wishlist from "../components/profile-ui/wishlist/Wishlist";
import { OrderConfirmed } from "../pages/order/confirmed";
import { OrderDetails } from "../pages/order/details/indes";

// Secured Layout
export const SecuredLayoutRoutes = {
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
        }, 
        {
            path: "orders",
            element: (
                <>
                    <OrderDetails />
                </>
            ),
        },
        {
            path: "order/confirmed/:cart_id",
            element: <OrderConfirmed />,
        },
    ],
}