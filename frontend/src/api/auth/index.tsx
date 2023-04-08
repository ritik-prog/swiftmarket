import instance from "../../utils/Axios";

export const signUpApi = async (email: any, password: any, username: any) => {
  const response = await instance.post("/auth/signup", {
    username,
    email,
    password,
  });
  return response;
};

export const signInpApi = async (email: any, password: any) => {
  const response = await instance.post("/auth/login", {
    email,
    password,
  });
  return response;
};

export const verifyApi = async (code: any) => {
  const response = await instance.post("/auth/verify", {
    code,
  });
  return response;
};

export const ResendVerificationMail = async () => {
  const response = await instance.post("/auth/sendVerificationCodeAgain");
  return response;
};
