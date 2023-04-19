import { useState } from "react";
import { placeOrderApi, updateTransaction } from "../../../api/order";
import { useSelector } from "react-redux";

interface productList {
  id: string;
  quantity: Number;
}

interface PlaceOrderRequest {
  shippingAddress: string;
  number: string;
  products: productList[];
  transactionId: string;
}

interface CartItem {
  _id: string;
  productName: string;
  price: number;
  discountedPrice: number;
  productDescription: "";
  thumbnailUrl: string;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  totalAmount: number;
  totalDiscount: number;
  totalPrice: number;
  totalQuantity: number;
}