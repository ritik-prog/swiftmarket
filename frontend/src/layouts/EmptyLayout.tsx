import React, { useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../redux/rootReducer";
import instance from "../utils/Axios";
import { logoutSuccess } from "../redux/user/userSlice";
import { useDispatch } from "react-redux";
import IpBanned from "../pages/error/IpBanned";
import FloatingButton from "../components/common/FloatingButton";

interface Props {
  children: React.ReactNode;
}

const EmptyLayout = ({ children }: Props) => {
  const ban = useSelector((state: RootState) => state.user.ban);
  const { isAuthenticated, user } = useSelector(
    (state: RootState) => state.user
  );
  const dispatch = useDispatch();

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
      </div>
    </>
  );
};

export default EmptyLayout;
