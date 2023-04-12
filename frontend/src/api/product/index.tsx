import instance from "../../utils/Axios";

export const searchProducts = async (query: string) => {
  const { data } = await instance.get(`product/search?search=${query}`);
  return data;
};

export const searchProduct = async (id: string) => {
  const { data } = await instance.get(`product/search/${id}`);
  return data;
};

export const getRecommendedProducts = async () => {
  const { data } = await instance.get("product/recommendations?limit=4");
  return data;
};

export const getTrandingProducts = async () => {
  const { data } = await instance.get("product/trending?limit=4");
  return data;
};
