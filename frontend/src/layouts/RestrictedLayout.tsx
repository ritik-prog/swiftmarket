import React, { useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../redux/rootReducer";
import ModeSwitch from "../utils/ModeSwitch";
import instance from "../utils/Axios";
import { logoutSuccess } from "../redux/user/userSlice";
import { useDispatch } from "react-redux";
import IpBanned from "../pages/error/IpBanned";

interface Props {
  children: React.ReactNode;
}

const EmptyLayout = ({ children }: Props) => {
  const theme = useSelector((state: RootState) => state.theme.theme);
  const ban = useSelector((state: RootState) => state.user.ban);
  const { isAuthenticated, user } = useSelector(
    (state: RootState) => state.user
  );
  const dispatch = useDispatch();
  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  useEffect(() => {
    async function checkAuth() {
      const response: any = await instance.get<any>("/auth/check");
      return response;
    }
    // if (isAuthenticated) {
    try {
      const response: any = checkAuth();
      if (response.data.status !== "success") {
        dispatch(logoutSuccess());
      }
    } catch (err) {
      // dispatch(logoutSuccess());
    }
    // }
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
        <ModeSwitch />
      </div>
    </>
  );
};

export default EmptyLayout;
