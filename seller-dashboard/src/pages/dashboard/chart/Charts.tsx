import React, { useEffect, useState } from "react";
import { getMetrics } from "../../../api/dashboard";
import TopSellingProducts from "./Sales/TopSellingProducts";

const initialState = {
  orderTotal: 0,
  newCustomers: 0,
  totalOrders: 0,
  conversionRate: 0,
  avgOrderValue: 0,
  customerLifetimeValue: 0,
  avgOrderSize: 0,
  customerRetentionRate: 0,
};

const DashboardCharts = () => {
  const [metrics, setMetrics] = useState<any>(initialState);

  const getData = async () => {
    try {
      const result = await getMetrics();
      setMetrics(result);
    } catch {}
  };

  useEffect(() => {
    getData();
  }, []);

  const data = [
    {
      title: "Total Revenue",
      value: "₹" + metrics.orderTotal,
      icon: "fas fa-chart-line",
    },
    {
      title: "New Customers",
      value: metrics.newCustomers,
      icon: "fas fa-users",
    },
    {
      title: "Total Orders",
      value: metrics.totalOrders,
      icon: "fas fa-shopping-cart",
    },
    {
      title: "Conversion Rate",
      value: metrics.conversionRate + "%",
      icon: "fas fa-chart-pie",
    },
    {
      title: "Average Order Value",
      value: "₹" + metrics.avgOrderValue,
      icon: "fas fa-dollar-sign",
    },
    {
      title: "Total Views",
      value: metrics.totalViews,
      icon: "fas fa-solid fa-eye",
    },
    {
      title: "Average Order Size",
      value: metrics.avgOrderSize,
      icon: "fas fa-file-invoice-dollar",
    },
    {
      title: "Customer Retention Rate",
      value: metrics.retentionRate + "%",
      icon: "fas fa-user-check",
    },
  ];

  return (
    <>
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
              <div className="text-4xl font-bold text-gray-800">
                {item.value}
              </div>
            </div>
          </div>
        ))}
      </div>
      <TopSellingProducts products={metrics.topSellingProducts} />
    </>
  );
};

export default DashboardCharts;
