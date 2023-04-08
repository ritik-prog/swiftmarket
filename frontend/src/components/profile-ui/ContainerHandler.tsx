import React from "react";
import Home from "./Home";
import { OrderDetails } from "../../pages/order/details/indes";
import Payments from "./Home/Payments";
import Wishlist from "../../pages/order/wishlist/Wishlist";

interface ContainerHandlerProps {
  type: string;
}

const ContainerHandler = ({ type }: ContainerHandlerProps) => {
  switch (type) {
    case "home":
      return <Home />;
    case "orders":
      return <OrderDetails />;
    case "transactions":
      return <Payments />;
    case "wishlist":
      return <Wishlist />;
    case "tickets":
      return <div>tickets</div>;
    case "setting":
      return <div>setting</div>;
    default:
      return <div>Unknown type: {type}</div>;
  }
};

export default ContainerHandler;
