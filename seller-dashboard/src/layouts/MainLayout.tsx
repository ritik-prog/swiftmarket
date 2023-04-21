import React, { useState } from "react";
import SideBar from "../component/sidebar/SideBar";
import { Outlet } from "react-router-dom";
import Dashboard from "../pages/dashboard/Dashboard";

const MainLayout = () => {
  return (
    <div>
      <div className="flex h-screen">
        <SideBar />
        <span
          className="overflow-scroll z-[`999`] w-full"
          // onClick={() => openSidebar === false && setOpenSidebar(true)}
        >
          <Outlet />
        </span>
      </div>
    </div>
  );
};

export default MainLayout;
