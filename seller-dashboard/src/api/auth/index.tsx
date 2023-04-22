import instance from "../../utils/Axios";

export const login = async (data: any) => {
  const result = await instance.post(`/seller/login/${data.email}`, data);
  console.log(result);
  return result.data;
};
