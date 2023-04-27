import React, { useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../redux/rootReducer";
import instance from "../utils/Axios";
import { loginSuccess, logoutSuccess } from "../redux/user/userSlice";
import { useDispatch } from "react-redux";
import IpBanned from "../pages/error/IpBanned";

interface Props {
  children: React.ReactNode;
}

const EmptyLayout = ({ children }: Props) => {
  const ban = useSelector((state: RootState) => state.user.ban);
  const { isAuthenticated, user } = useSelector(
    (state: RootState) => state.user
  );
  const dispatch = useDispatch();

  const checkAuth = async () => {
    const response = await instance.get("/auth/check");
    console.log(response.data);
    if (response.data.status === "success") {
      dispatch(loginSuccess(response.data));
    } else {
      dispatch(logoutSuccess());
    }
    return response;
  };

  useEffect(() => {
    try {
      checkAuth();
    } catch (err) {
      // dispatch(logoutSuccess());
    }
  }, []);

  if (ban?.status) {
    return <IpBanned />;
  }

  if (isAuthenticated && user.verificationStatus) {
    return <Navigate to="/shop" />;
  } else if (isAuthenticated && !user.verificationStatus) {
    return <Navigate to="/verification" />;
  }
  return (
    <>
      <div className="flex flex-col min-h-screen bg-white dark:bg-gray-900">
        <Outlet />
      </div>
    </>
  );
};

export default EmptyLayout;
