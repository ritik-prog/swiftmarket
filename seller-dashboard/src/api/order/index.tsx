import instance from "../../utils/Axios";

export const getOrders = async () => {
     const result = await instance.get("/seller/get-orders");
     return result.data;
};
