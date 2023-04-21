import React from "react";

const DashboardCharts = () => {
  const totalRevenue = 40000;
  const newCustomers = 500;
  const totalOrders = 1000;
  const conversionRate = 5;
  const avgOrderValue = totalRevenue / totalOrders;
  const customerLifetimeValue = avgOrderValue / (conversionRate / 100);
  const avgOrderSize = totalRevenue / totalOrders;
  const customerRetentionRate =
    ((totalOrders - newCustomers) / totalOrders) * 100;

  const data = [
    {
      title: "Total Revenue",
      value: "$" + totalRevenue,
      icon: "fas fa-chart-line",
    },
    { title: "New Customers", value: newCustomers, icon: "fas fa-users" },
    { title: "Total Orders", value: totalOrders, icon: "fas fa-shopping-cart" },
    {
      title: "Conversion Rate",
      value: conversionRate + "%",
      icon: "fas fa-chart-pie",
    },
    {
      title: "Average Order Value",
      value: "$" + avgOrderValue.toFixed(2),
      icon: "fas fa-dollar-sign",
    },
    {
      title: "Customer Lifetime Value",
      value: "$" + customerLifetimeValue.toFixed(2),
      icon: "fas fa-money-bill-wave",
    },
    {
      title: "Average Order Size",
      value: "$" + avgOrderSize.toFixed(2),
      icon: "fas fa-file-invoice-dollar",
    },
    {
      title: "Customer Retention Rate",
      value: customerRetentionRate.toFixed(2) + "%",
      icon: "fas fa-user-check",
    },
  ];

  return (
    <div className="flex flex-wrap items-center justify-center w-full">
      {data.map((item) => (
        <div
          key={item.title}
          className="w-full sm:w-1/2 md:w-1/4 lg:w-1/4 px-4 mb-4"
        >
          <div className="rounded-lg shadow-lg p-4 bg-white bg-opacity-70">
            <div className="flex items-center justify-between mb-4">
              <div className="text-lg font-bold text-gray-800">
                {item.title}
              </div>
              <div className="text-2xl text-gray-800">
                <i className={item.icon}></i>
              </div>
            </div>
            <div className="text-4xl font-bold text-gray-800">{item.value}</div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DashboardCharts;
