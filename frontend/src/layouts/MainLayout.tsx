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

interface Props {
  children: React.ReactNode;
}

interface AuthenticationResponse {
  status: string;
  message: string;
}

const MainLayout = ({ children }: Props) => {
  const theme = useSelector((state: RootState) => state.theme.theme);
  const ban = useSelector((state: RootState) => state.user.ban);
  const isAuthenticated = useSelector(
    (state: RootState) => state.user.isAuthenticated
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
        <ModeSwitch />
      </div>
    </>
  );
};

export default MainLayout;
