import instance from "../../utils/Axios";

// get user data
export const getSellers = async () => {
  const response = await instance.get(`/admin/seller/sellers`);
  return response.data;
};
