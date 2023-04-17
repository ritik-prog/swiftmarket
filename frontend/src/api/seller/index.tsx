import instance from "../../utils/Axios";

export const getSellerProfileAndProducts = async ({ username }: any) => {
  const { data } = await instance.get(`product/seller/${username}`);
  return data;
};
