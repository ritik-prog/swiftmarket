import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import OrderDetails from "./OrderDeatils";

interface Ticket {
  _id: string;
  type: string;
  subject: string;
  order: {
    _id: string;
    fullname: string;
    cartId: string;
    seller: {
      _id: string;
      businessUsername: string;
      user: {
        _id: string;
        email: string;
      };
    };
    shippingAddress: string;
    number: string;
    customer: {
      _id: string;
      username: string;
    };
    products: {
      product: {
        _id: string;
        seller: {
          _id: string;
          businessEmail: string;
          businessName: string;
          businessUsername: string;
          user: {
            _id: string;
            email: string;
          };
          businessLogo: string;
        };
        productName: string;
        id: string;
      };
      quantity: number;
      price: number;
      discountedPrice: number;
      _id: string;
    }[];
    orderStatus: string;
    transactionId: string;
    orderAmount: number;
    totalDiscount: number;
    orderTotal: number;
    orderDate: string;
    createdAt: string;
    updatedAt: string;
    orderId: string;
    __v: number;
  };
  description: string;
  status: string;
  priority: string;
  customer_id: string;
  messages: {
    message: string;
    user_id: {
      _id: string;
      username: string;
    };
    _id: string;
    time: string;
  }[];
  createdAt: string;
  updatedAt: string;
  __v: number;
  agent_id: string;
}

const UpdateTicket = () => {
  const [message, setMessage] = useState("");
  const { id } = useParams();
  const [ticket, setTicket] = useState<Ticket | any>({
    _id: "609afbbc4d4ee13b6c7f6d8a",
    type: "Support Request",
    subject: "Order Status Inquiry",
    order: {
      _id: "609afb3a3ca8c838d0a9c820",
      fullname: "Jane Doe",
      cartId: "abc123",
      seller: {
        _id: "609afbbe4d4ee13b6c7f6d8b",
        businessUsername: "examplestore",
        user: {
          _id: "609afb984d4ee13b6c7f6d88",
          email: "seller@example.com",
        },
      },
      shippingAddress: "123 Main St, Anytown USA",
      number: "1234567890",
      customer: {
        _id: "609afbce3ca8c838d0a9c821",
        username: "janedoe",
      },
      products: [
        {
          product: {
            _id: "609afcd34d4ee13b6c7f6d8c",
            seller: {
              _id: "609afbbe4d4ee13b6c7f6d8b",
              businessEmail: "seller@example.com",
              businessName: "Example Store",
              businessUsername: "examplestore",
              user: {
                _id: "609afb984d4ee13b6c7f6d88",
                email: "seller@example.com",
              },
              businessLogo: "https://example.com/logo.png",
            },
            productName: "Widget",
            id: "abc123",
          },
          quantity: 1,
          price: 10.99,
          discountedPrice: 9.99,
          _id: "609afcf74d4ee13b6c7f6d8d",
        },
      ],
      orderStatus: "Shipped",
      transactionId: "xyz789",
      orderAmount: 10.99,
      totalDiscount: 1,
      orderTotal: 9.99,
      orderDate: "2022-04-01T10:00:00.000Z",
      createdAt: "2022-04-01T11:00:00.000Z",
      updatedAt: "2022-04-01T12:00:00.000Z",
      orderId: "def456",
      __v: 0,
    },
    description: "I would like to know the status of my order",
    status: "Open",
    priority: "Medium",
    customer_id: "609afbce3ca8c838d0a9c821",
    messages: [
      {
        message:
          "Hi, I was wondering if you could provide an update on my order?",
        user_id: {
          _id: "609afbce3ca8c838d0a9c821",
          username: "janedoe",
        },
        _id: "609afcd34d4ee13b6c7f6d8c",
        time: "2022-04-01T13:00:00.000Z",
      },
    ],
  });
  const bottomRef = useRef<HTMLDivElement>(null);

  // modals
  const [showReAssignModal, setShowReAssignModal] = useState(false);
  // ChangeStatus modal
  const [showChangeStatusModal, setShowChangeStatusModal] = useState(false);
  // change priority
  const [showChangePriorityModal, setShowChangePriorityModal] = useState(false);

  const handleInputChange = (event: any) => {
    setMessage(event.target.value);
  };

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    // TODO: Add message to ticket
    if (message === "") {
      return;
    }
    try {
      //   await addMessageToTicket(id, message);
      fetchData();
    } catch (error) {}
    setMessage("");
  };

  const fetchData = async () => {
    try {
      //   const result = await getTicketById(id);
    //   setTicket(result.ticket);
      setTimeout(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 0);
    } catch (error) {}
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    JSON.stringify(ticket) !== "{}" && (
      <div className="px-4 sm:px-6 lg:px-8 mt-10 flex space-x-5 mb-4">
        <div>
          <div className="bg-white shadow overflow-hidden rounded-md">
            <div className="px-4 py-5 sm:p-6">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                Subject:- {ticket.subject}
              </h1>
              <h2 className="text-xl font-medium text-gray-900 mb-4">
                Details
              </h2>
              <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500">
                    Description
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {ticket.description}
                  </dd>
                </div>
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500">Status</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {ticket.status}
                  </dd>
                </div>
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500">
                    Priority
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {ticket.priority}
                  </dd>
                </div>
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500">
                    Internal Order Reference
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {ticket.order._id}
                  </dd>
                </div>
              </dl>
            </div>
          </div>
          <div className="bg-white shadow overflow-hidden rounded-md mt-4">
            <div className="px-4 py-5 sm:p-6">
              <h2 className="text-xl font-medium text-gray-900 mb-4">
                Order Details
              </h2>
              <OrderDetails order={ticket.order} />
            </div>
          </div>
        </div>
        <div className="bg-white shadow overflow-hidden rounded-md">
          <div className="px-4 py-5 sm:p-6">
            <h2 className="text-xl font-medium text-gray-900 mb-4">Messages</h2>
            <div className="max-h-60 overflow-y-scroll">
              <ul className="divide-y divide-gray-200">
                {ticket.messages.map((message: any) => (
                  <li key={message._id} className="py-4">
                    <div className="flex space-x-3">
                      <div className="flex-1 space-y-2">
                        <div className="text-sm font-medium text-gray-900">
                          {message?.user_id?.username ||
                            message?.agent_id?.username}
                        </div>
                        <div className="text-sm text-gray-500">
                          {new Date(message.time).toLocaleString()}
                        </div>
                      </div>
                      <p className="text-sm text-gray-500">{message.message}</p>
                    </div>
                  </li>
                ))}
                <div ref={bottomRef} />
              </ul>
            </div>
            <div className="mt-8">
              <label
                htmlFor="message"
                className="block text-sm font-medium text-gray-700"
              >
                Add Message
              </label>
              <div className="mt-1">
                <textarea
                  id="message"
                  name="message"
                  rows={3}
                  required
                  className="p-4 shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  value={message}
                  onChange={handleInputChange}
                ></textarea>
              </div>
            </div>

            <div className="mt-5 flex flex-wrap">
              <button
                type="button"
                onClick={(e) => handleSubmit(e)}
                className="m-2 inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  );
};

export default UpdateTicket;
