import React from "react";
import Home from "./home";
import { OrderDetails } from "../../pages/order/details/orderDetails";
import Payments from "./payments/Payments";
import Wishlist from "./wishlist/Wishlist";
import TicketConsole from "./ticket/Ticket";
import AccountSettings from "./account/AccountSettings";

interface ContainerHandlerProps {
  type: string;
}

const ContainerHandler = ({ type }: ContainerHandlerProps) => {
  switch (type) {
    // case "home":
    //   return <Home />;
    case "orders":
      return <OrderDetails />;
    case "transactions":
      return <Payments />;
    case "wishlist":
      return <Wishlist />;
    case "tickets":
      return <TicketConsole />;
    case "setting":
      return <AccountSettings />;
    default:
      return <div>Unknown type: {type}</div>;
  }
};

export default ContainerHandler;
