import * as Yup from "yup";

export const signUpSchema = Yup.object({
  username: Yup.string()
    .min(4, "Username must be at least 4 characters")
    .max(15, "Username must be no more than 15 characters")
    .matches(
      /^[a-zA-Z0-9_]+$/,
      "Username can only contain letters and/or numbers"
    )
    .required("Please enter your username"),
  email: Yup.string()
    .trim()
    .matches(
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      "Please enter a valid email address"
    )
    .required("Please enter your email"),
  password: Yup.string()
    .min(6, "Username must be at least 6 characters")
    .required("Please enter your password"),
});

export const loginSchema = Yup.object({
  email: Yup.string()
    .trim()
    .matches(
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      "Please enter a valid email address"
    )
    .required("Please enter your email"),
  password: Yup.string()
    .min(6, "Please enter valid password")
    .required("Please enter your password"),
});
