import { AxiosError } from "axios";
import { banImposed, logoutSuccess } from "../redux/user/userSlice";
import { store } from "../redux/store";
import { CreateToast } from "./Toast";

const HandleError = async (
  e: Error | AxiosError,
  onError: (error: any) => void
) => {
  const error = e as AxiosError;
  const data = error.response?.data as { code: string };
  const message = error.response?.data as { message: string };
  switch (error.response?.status) {
    case 400:
      switch (data.code) {
        case "CustomValidationError":
          CreateToast("ValidationError", "Validation Error", "error");
          break;
        case "missing_fields":
          CreateToast("Missingfields", "Missing fields", "error");
          console.log("Missing fields error occurred.");
          break;
        default:
          CreateToast("Unknown", "Unknown error", "error");
          console.log("Unknown 400 error occurred.");
          break;
      }
      break;
    case 404:
      CreateToast("notfound", "404 Not Found", "error");
      console.log("Resource not found error occurred.");
      break;
    case 401:
      onError(error);
      CreateToast("notfound", message.message, "error");
      console.log("Authentication failed error occurred.");
      break;
    case 403:
      onError(error);
      console.log("Unauthorized access error occurred.");
      break;
    case 410:
      CreateToast("already_exists", "Email or Username already taken", "error");
      console.log("User already exists :- email or username already taken.");
      break;
    case 411:
      CreateToast("Useralreadyverified", "User already verified", "error");
      console.log("User already verified error occurred.");
      break;
    case 412:
      CreateToast(
        "Invalidorexpiredverification",
        "Invalid or expired verification",
        "error"
      );
      console.log("Invalid or expired verification code error occurred.");
      break;
    case 413:
      CreateToast("Verificationpending", "Verification pending", "error");
      console.log("Verification pending error occurred.");
      break;
    case 414:
      CreateToast("Email not verified", "Email not verified", "error");
      console.log("Email not verified error occurred.");
      break;
    case 415:
      onError(error);
      CreateToast("not authorized", "Not Authorized", "error");
      console.log("Invalid or expired token error occurred.");
      break;
    case 416:
      onError(error);
      CreateToast("not authorized", "Not Authorized", "error");
      console.log("User not authorized error occurred.");
      break;
    case 417:
      store.dispatch(
        banImposed({
          message: message.message,
        })
      );
      console.log(
        `Banned error occurred. Time until unban: ${error.response.data} hours.`
      );
      break;
    case 418:
      store.dispatch(banImposed({ message: message.message }));
      console.log("Permanent ban error occurred.");
      break;
    case 419:
      store.dispatch(banImposed({ message: message.message }));
      console.log(message.message);
      break;
    case 420:
      CreateToast("Signupratelimit", "Signup rate limit exceeded", "error");
      console.log("Signup rate limit exceeded error occurred.");
      break;
    case 500:
      CreateToast("Servererror", "Server error", "error");
      console.log("Server error occurred.");
      break;
    case error.status:
      CreateToast(message.message, message.message, "error");
      break;
    default:
      CreateToast("wentwrong", "Something went wrong....", "error");
      break;
  }
};

export default HandleError;
