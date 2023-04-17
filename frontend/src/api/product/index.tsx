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

export const getTrandingProductsThree = async () => {
  const { data } = await instance.get(
    "product/getTopProductsByDifferentFilters"
  );
  return data;
};

export const getTopProductsByTopCategorySearched = async () => {
  const { data } = await instance.get(
    "product/getTopProductsByTopCategorySearched"
  );
  return data;
};

export const searchProductsByCategory = async (category: any) => {
  const { data } = await instance.get(`/product/search/category/${category}`);
  return data;
};
