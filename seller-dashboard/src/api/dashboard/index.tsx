import instance from "../../utils/Axios";

export const getMetrics = async () => {
  const result = await instance.get("/seller/get-metrics");
  return result.data;
};

export const getSalesMetricsData = async () => {
  const result = await instance.get("/seller/get-sales-data");
  return result.data;
}