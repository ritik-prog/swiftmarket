import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface UserLayoutProps {
  children: React.ReactNode;
}

const TransactionsLayout: React.FC<UserLayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<any>("Users");
  const activeClass =
    "inline-flex items-center h-12 px-4 py-2 text-sm text-center text-gray-700 border border-b-0 border-gray-300 sm:text-base dark:border-gray-500 rounded-t-md dark:text-white whitespace-nowrap focus:outline-none";
  const inactiveClass =
    "inline-flex items-center h-12 px-4 py-2 text-sm text-center text-gray-700 bg-transparent border-b border-gray-300 sm:text-base dark:border-gray-500 dark:text-white whitespace-nowrap cursor-base focus:outline-none hover:border-gray-400 dark:hover:border-gray-300";

  const handleTab = () => {
    if (window.location.pathname === "/transaction") {
      setActiveTab("User Transaction");
    } else if (window.location.pathname === "/sellertransaction") {
      setActiveTab("Seller Transaction");
    }
  };

  useEffect(() => {
    handleTab();
  }, [window.location.pathname]);

  return (
    <div className="mt-10 p-4">
      <div className="flex overflow-x-auto whitespace-nowrap w-full">
        <button
          className={
            activeTab === "User Transaction" ? activeClass : inactiveClass
          }
          onClick={() => navigate("/transaction")}
        >
          User Transactions
        </button>
        <button
          className={
            activeTab === "Seller Transaction" ? activeClass : inactiveClass
          }
          onClick={() => navigate("/sellertransaction")}
        >
          Seller Transactions
        </button>
      </div>
      <div className="mt-4">{children}</div>
    </div>
  );
};

export default TransactionsLayout;