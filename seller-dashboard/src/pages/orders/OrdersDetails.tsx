import React from "react";

const orders = [
  {
    orderId: "order_12345",
    fullName: "John Smith",
    orderDate: "2023-04-19",
    shippingAddress: "123 Main St, Anytown USA",
    products: [
      { name: "Product 1", quantity: 2, price: 10.99, discountedPrice: 9.99 },
      { name: "Product 2", quantity: 1, price: 19.99, discountedPrice: 0 },
    ],
    orderStatus: "Placed",
    trackingDetails: {
      carrierName: "UPS",
      trackingNumber: "1234567890",
      trackingUrl: "https://www.ups.com/tracking/1234567890",
      deliveryDate: null,
      deliveryStatus: null,
    },
    orderAmount: 41.97,
    totalDiscount: 9.99,
    orderTotal: 31.98,
  },
  {
    orderId: "order_12345",
    fullName: "John Smith",
    orderDate: "2023-04-19",
    shippingAddress: "123 Main St, Anytown USA",
    products: [
      { name: "Product 1", quantity: 2, price: 10.99, discountedPrice: 9.99 },
      { name: "Product 2", quantity: 1, price: 19.99, discountedPrice: 0 },
    ],
    orderStatus: "Placed",
    trackingDetails: {
      carrierName: "UPS",
      trackingNumber: "1234567890",
      trackingUrl: "https://www.ups.com/tracking/1234567890",
      deliveryDate: null,
      deliveryStatus: null,
    },
    orderAmount: 41.97,
    totalDiscount: 9.99,
    orderTotal: 31.98,
  },
  {
    orderId: "order_12345",
    fullName: "John Smith",
    orderDate: "2023-04-19",
    shippingAddress: "123 Main St, Anytown USA",
    products: [
      { name: "Product 1", quantity: 2, price: 10.99, discountedPrice: 9.99 },
      { name: "Product 2", quantity: 1, price: 19.99, discountedPrice: 0 },
    ],
    orderStatus: "Placed",
    trackingDetails: {
      carrierName: "UPS",
      trackingNumber: "1234567890",
      trackingUrl: "https://www.ups.com/tracking/1234567890",
      deliveryDate: null,
      deliveryStatus: null,
    },
    orderAmount: 41.97,
    totalDiscount: 9.99,
    orderTotal: 31.98,
  },
  // Add more orders here...
];

const OrderList = () => {
  return (
    <div className="shadow overflow-scroll">
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-4 mt-4 flex items-center justify-between border-b">
          <h2 className="text-lg font-medium text-gray-900">Orders</h2>
          <div className="flex items-center">
            <label htmlFor="search" className="mr-2 text-gray-500">
              Search:
            </label>
            <input
              type="text"
              id="search"
              // value={searchTerm}
              // onChange={(e) => setSearchTerm(e.target.value)}
              className="px-2 py-1 border rounded text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Search by name or order ID"
            />
            <label htmlFor="sort" className="ml-4 mr-2 text-gray-500">
              Sort:
            </label>
            <select
              id="sort"
              // value={sortOrder}
              // onChange={(e) => setSortOrder(e.target.value)}
              className="px-2 py-1 border rounded text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="asc">Ascending</option>
              <option value="desc">Descending</option>
            </select>
            <label htmlFor="status" className="ml-4 mr-2 text-gray-500">
              Status:
            </label>
            <select
              id="status"
              // value={statusFilter}
              // onChange={(e) => setStatusFilter(e.target.value)}
              className="px-2 py-1 border rounded text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All</option>
              <option value="Placed">Placed</option>
              <option value="Shipped">Shipped</option>
              <option value="Delivered">Delivered</option>
            </select>
            <button className="ml-4 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50">
              Filter
            </button>
          </div>
        </div>
      </div>
      <div className="p-6">
        <div className="rounded-lg">
          {orders.map((order) => (
            <div
              key={order.orderId}
              className="border-b py-4 m-2 bg-gray-100 p-4 rounded"
            >
              <div className="flex justify-between mb-2">
                <div className="font-medium">Order ID:</div>
                <div>{order.orderId}</div>
              </div>
              <div className="flex justify-between mb-2">
                <div className="font-medium">Order Date:</div>
                <div>{order.orderDate}</div>
              </div>
              <div className="flex justify-between mb-2">
                <div className="font-medium">Customer Name:</div>
                <div>{order.fullName}</div>
              </div>
              <div className="flex justify-between mb-2">
                <div className="font-medium">Shipping Address:</div>
                <div>{order.shippingAddress}</div>
              </div>
              <div className="mb-2">
                <div className="font-medium mb-1">Products:</div>
                <ul className="pl-4">
                  {order.products.map((product) => (
                    <li key={product.name}>
                      {product.name} ({product.quantity}) - ${product.price}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex justify-between mb-2">
                <div className="font-medium">Order Status:</div>
                <div>{order.orderStatus}</div>
              </div>
              <div className="flex justify-between">
                <div className="font-medium">Order Amount:</div>
                <div>${order.orderAmount}</div>
              </div>
              <div className="flex justify-between">
                <div className="font-medium">Total Discount:</div>
                <div>${order.totalDiscount}</div>
              </div>
              <div className="flex justify-between">
                <div className="font-medium">Order Total:</div>
                <div>${order.orderTotal}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OrderList;
