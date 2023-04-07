import React from "react";
import NavBar from "../components/common/NavBar";
import Footer from "../components/common/Footer";

interface Props {
  children: React.ReactNode;
}

const Layout = ({ children }: Props) => {
  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-gray-900">
      <NavBar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
};

export default Layout;
