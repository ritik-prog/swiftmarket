import instance from "../../utils/Axios";

export const login = async (data: any) => {
  const result = await instance.post(`/seller/login/${data.email}`, data);
  console.log(result);
  return result.data;
};

// update seller profile
export const updateSellerProfile = async (data: any) => {
  const result = await instance.put(`/seller/updateprofile`, data);
  return result.data;
};

// delete seller profile
export const deleteSellerProfile = async () => {
  const result = await instance.delete(`/seller/deleteprofile`);
  return result.data;
};
