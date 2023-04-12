import React from "react";
import Home from "./home";
import { OrderDetails } from "../../pages/order/details/indes";
import Payments from "./payments/Payments";
import Wishlist from "./wishlist/Wishlist";
import TicketConsole from "./ticket/Ticket";
import AccountSettings from "./account/AccountSettings";

interface ContainerHandlerProps {
  type: string;
}

const ContainerHandler = ({ type }: ContainerHandlerProps) => {
  const products = [
    {
      name: "Product 1",
      image: {
        sm: "https://via.placeholder.com/150",
        lg: "https://via.placeholder.com/400",
      },
      code: "001",
      color: "Black",
      size: "M",
      price: "$50",
    },
    {
      name: "Product 2",
      image: {
        sm: "https://via.placeholder.com/150",
        lg: "https://via.placeholder.com/400",
      },
      code: "002",
      color: "Blue",
      size: "L",
      price: "$75",
    },
    {
      name: "Product 3",
      image: {
        sm: "https://via.placeholder.com/150",
        lg: "https://via.placeholder.com/400",
      },
      code: "003",
      color: "Red",
      size: "S",
      price: "$30",
    },
  ];

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
      return <TicketConsole />;
    case "setting":
      return <AccountSettings />;
    default:
      return <div>Unknown type: {type}</div>;
  }
};

export default ContainerHandler;
