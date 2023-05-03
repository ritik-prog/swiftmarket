import instance from "../../utils/Axios";

// get user data
export const getUsers = async () => {
  const response = await instance.get(`/admin/user/users`);
  return response.data;
};
