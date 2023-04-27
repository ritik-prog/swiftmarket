import React, { useEffect, useState } from "react";
import { getAllTickets } from "../../api/ticket";
const Tickets = () => {
  const [tickets, setTickets] = useState([
    {
      id: "23fds43214afa31ds",
      type: "Query",
      subject: "Need help with my order",
      order: "613a4f08d9c3d66bf034235c",
      description:
        "I received my order but it was missing an item, can you help me with that?",
      status: "Open",
      priority: "Medium",
      customer_id: "613a4d1ed9c3d66bf0342359",
      agent_id: null,
      messages: [
        {
          message: "Hello, I am having an issue with my order",
          user_id: "613a4d1ed9c3d66bf0342359",
          time: "2023-04-26T10:00:00.000Z",
        },
        {
          message: "Sure, can you give me your order number?",
          user_id: "613a4f43d9c3d66bf034235d",
          time: "2023-04-26T11:00:00.000Z",
        },
        {
          message: "Yes, my order number is 123456",
          user_id: "613a4d1ed9c3d66bf0342359",
          time: "2023-04-26T11:30:00.000Z",
        },
        {
          message: "Thank you, let me check that for you",
          user_id: "613a4f43d9c3d66bf034235d",
          time: "2023-04-26T12:00:00.000Z",
        },
      ],
      createdAt: "2023-04-26T12:00:00.000Z",
      updatedAt: "2023-04-26T12:00:00.000Z",
    },
  ]);

  // fetch data
  useEffect(() => {
    const fetchTickets = async () => {
      const res = await getAllTickets();
      setTickets(res);
    };
    fetchTickets();
  }, []);

  return (
    <div>
      <section className="container px-4 mx-auto">
        <div className="flex flex-col mt-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Ticket Master Dashboard
          </h1>
          <p className="text-lg text-gray-500 w-8/12 text-justify">
            Welcome to the Ticket Master dashboard. Here, you can view all the
            tickets that have been submitted by customers, and manage them
            accordingly. Use the navigation bar on the left to access different
            features of the dashboard.
          </p>
        </div>
        <div className="flex flex-col mt-4">
          <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
              <div className="overflow-hidden border border-gray-200 dark:border-gray-700 md:rounded-lg">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-800">
                    <tr>
                      <th
                        scope="col"
                        className="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400"
                      >
                        Date
                      </th>
                      <th
                        scope="col"
                        className="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400"
                      >
                        Type
                      </th>
                      <th
                        scope="col"
                        className="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400"
                      >
                        Subject
                      </th>
                      <th
                        scope="col"
                        className="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400"
                      >
                        description
                      </th>
                      <th
                        scope="col"
                        className="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400"
                      >
                        status
                      </th>
                      <th
                        scope="col"
                        className="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400"
                      >
                        priority
                      </th>
                      <th scope="col" className="relative py-3.5 px-4">
                        <span className="sr-only">Actions</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200 dark:divide-gray-700 dark:bg-gray-900">
                    {tickets.map((item: any) => (
                      <tr key={item.id}>
                        <td className="px-4 py-4 text-sm text-gray-500 dark:text-gray-300 whitespace-nowrap">
                          {new Date(item.createdAt).toLocaleDateString(
                            "en-US",
                            { month: "long", day: "numeric", year: "numeric" }
                          )}
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-500 dark:text-gray-300 whitespace-nowrap">
                          {item.type}
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-500 dark:text-gray-300 whitespace-nowrap">
                          {item.subject}
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-500 dark:text-gray-300 whitespace-nowrap">
                          {item.description}
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-500 dark:text-gray-300 whitespace-nowrap">
                          {item.status}
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-500 dark:text-gray-300">
                          {item.priority}
                        </td>
                        <td className="px-4 py-4 text-sm whitespace-nowrap">
                          <button className="flex items-center gap-x-2 px-3 py-2 bg-green-500 rounded-md text-white transition-colors duration-200 hover:bg-green-600 focus:outline-none">
                            <span>Join</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between mt-6">
          <a
            href="#"
            className="flex items-center px-5 py-2 text-sm text-gray-700 capitalize transition-colors duration-200 bg-white border rounded-md gap-x-2 hover:bg-gray-100 dark:bg-gray-900 dark:text-gray-200 dark:border-gray-700 dark:hover:bg-gray-800"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              className="w-5 h-5 rtl:-scale-x-100"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M6.75 15.75L3 12m0 0l3.75-3.75M3 12h18"
              />
            </svg>

            <span>previous</span>
          </a>

          <div className="items-center hidden md:flex gap-x-3">
            <a
              href="#"
              className="px-2 py-1 text-sm text-blue-500 rounded-md dark:bg-gray-800 bg-blue-100/60"
            >
              1
            </a>
            <a
              href="#"
              className="px-2 py-1 text-sm text-gray-500 rounded-md dark:hover:bg-gray-800 dark:text-gray-300 hover:bg-gray-100"
            >
              2
            </a>
            <a
              href="#"
              className="px-2 py-1 text-sm text-gray-500 rounded-md dark:hover:bg-gray-800 dark:text-gray-300 hover:bg-gray-100"
            >
              3
            </a>
            <a
              href="#"
              className="px-2 py-1 text-sm text-gray-500 rounded-md dark:hover:bg-gray-800 dark:text-gray-300 hover:bg-gray-100"
            >
              ...
            </a>
            <a
              href="#"
              className="px-2 py-1 text-sm text-gray-500 rounded-md dark:hover:bg-gray-800 dark:text-gray-300 hover:bg-gray-100"
            >
              12
            </a>
            <a
              href="#"
              className="px-2 py-1 text-sm text-gray-500 rounded-md dark:hover:bg-gray-800 dark:text-gray-300 hover:bg-gray-100"
            >
              13
            </a>
            <a
              href="#"
              className="px-2 py-1 text-sm text-gray-500 rounded-md dark:hover:bg-gray-800 dark:text-gray-300 hover:bg-gray-100"
            >
              14
            </a>
          </div>

          <a
            href="#"
            className="flex items-center px-5 py-2 text-sm text-gray-700 capitalize transition-colors duration-200 bg-white border rounded-md gap-x-2 hover:bg-gray-100 dark:bg-gray-900 dark:text-gray-200 dark:border-gray-700 dark:hover:bg-gray-800"
          >
            <span>Next</span>

            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              className="w-5 h-5 rtl:-scale-x-100"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3"
              />
            </svg>
          </a>
        </div>
      </section>
    </div>
  );
};

export default Tickets;
