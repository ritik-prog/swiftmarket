import React, { useEffect } from "react";
import { Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../redux/rootReducer";
import ModeSwitch from "../utils/ModeSwitch";
import instance from "../utils/Axios";
import { logoutSuccess, banRemoved } from "../redux/user/userSlice";
import { useDispatch } from "react-redux";
import IpBanned from "../pages/error/IpBanned";
import HomeLayout from "./Homelayout";
import FloatingButton from "../components/common/FloatingButton";

interface Props {
  children: React.ReactNode;
}

interface AuthenticationResponse {
  status: string;
  message: string;
}

const MainLayout = ({ children }: Props) => {
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

  if (ban?.status && ban?.banExpiresAt < Date.now()) {
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

export default MainLayout;