import React from 'react'
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/sidebar/Sidebar';

const MainLayout = () => {
  return (
    <div>
      <div className="flex h-screen">
        <Sidebar />
        <span className="overflow-scroll w-full">
          <Outlet />
        </span>
      </div>
    </div>
  );
}

export default MainLayout