import React, { useState } from "react";

const TicketConsole = () => {
  const [activeTab, setActiveTab] = useState("all");

  const tabs = [
    { id: "all", name: "All" },
    { id: "open", name: "Open" },
    { id: "pending", name: "Pending" },
    { id: "closed", name: "Closed" },
  ];

  const tickets = [
    {
      id: 1,
      title: "Ticket #1",
      status: "open",
      date: "2023-04-09T08:00:00.000Z",
      description: "This is the description of ticket #1",
    },
    {
      id: 2,
      title: "Ticket #2",
      status: "pending",
      date: "2023-04-08T13:00:00.000Z",
      description: "This is the description of ticket #2",
    },
    {
      id: 3,
      title: "Ticket #3",
      status: "closed",
      date: "2023-04-07T10:00:00.000Z",
      description: "This is the description of ticket #3",
    },
  ];

  const filteredTickets =
    activeTab === "all"
      ? tickets
      : tickets.filter((ticket) => ticket.status === activeTab);

  return (
    <div className="container mx-auto my-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Help Center</h1>
        <div className="flex gap-4">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`px-4 py-2 rounded-md text-sm font-medium text-white ${
                activeTab === tab.id ? "bg-blue-500" : "bg-gray-500"
              }`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.name}
            </button>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {filteredTickets.map((ticket) => (
          <div
            key={ticket.id}
            className="bg-white shadow-md rounded-md p-4 flex flex-col justify-between"
          >
            <div>
              <h2 className="text-lg font-medium text-gray-800">
                {ticket.title}
              </h2>
              <p className="text-gray-500 text-sm mt-1">
                {new Date(ticket.date).toLocaleDateString()}
              </p>
              <p className="text-gray-600 mt-2">{ticket.description}</p>
            </div>
            <div className="mt-4">
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium text-white ${
                  ticket.status === "open"
                    ? "bg-red-500"
                    : ticket.status === "pending"
                    ? "bg-yellow-500"
                    : "bg-green-500"
                }`}
              >
                {ticket.status.toUpperCase()}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TicketConsole;
