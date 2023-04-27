import instance from "../../utils/Axios";

export {};

export const signInApi = async (email: any, password: any) => {
  const response = await instance.post("/ticketmaster/login", {
    email,
    password,
  });
  return response;
};

// logout
export const logoutApi = async () => {
  const response = await instance.post("/auth/logout");
  return response;
};



