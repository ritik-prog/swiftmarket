import React, { useEffect } from "react";
import IpBanned from "../pages/error/IpBanned";
import { Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../redux/rootReducer";
import { useDispatch } from "react-redux";
import instance from "../utils/Axios";
import { logoutSuccess } from "../redux/user/userSlice";
import HomeLayout from "./Homelayout";
import withAuth from "../hoc/withAuth";
import FloatingButton from "../components/common/FloatingButton";

const SecuredLayout = () => {
  // const theme = useSelector((state: RootState) => state.theme.theme);
  const ban = useSelector((state: RootState) => state.user.ban);
  const dispatch = useDispatch();

  useEffect(() => {
    async function checkAuth() {
      const response: any = await instance.get<any>("/auth/check");
      return response;
    }
    try {
      const response: any = checkAuth();
      if (response.data.status !== "success") {
        dispatch(logoutSuccess());
      }
    } catch (err) {
      // dispatch(logoutSuccess());
    }
  }, []);

  if (ban?.status) {
    return <IpBanned />;
  }

  return (
    <>
      <div className="flex flex-col min-h-screen bg-white dark:bg-gray-900">
        <HomeLayout>
          <Outlet />
        </HomeLayout>
        <FloatingButton />
      </div>
    </>
  );
};

export default withAuth(SecuredLayout);
