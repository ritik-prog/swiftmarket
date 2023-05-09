import React, { useState, FormEventHandler } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/rootReducer";
import { useNavigate } from "react-router-dom";

const NavBar = () => {
  const navigate = useNavigate();
  const isAuthenticated = useSelector(
    (state: RootState) => state.user.isAuthenticated
  );

  const user = useSelector((state: RootState) => state.user.user);

  const [searchQuery, setSearchQuery] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleSearch: FormEventHandler<HTMLFormElement> = (e) => {
    // e.preventDefault();
    navigate(`/search?query=${searchQuery}`);
  };

  return (
    <div className="container m-auto">
      <nav className="relative px-4 py-4 flex justify-between items-center bg-white dark:bg-gray-900">
        <span
          className="text-xl text-black-300 dark:text-gray-300 cursor-pointer flex space-x-1"
          onClick={() => navigate("/")}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349m-16.5 11.65V9.35m0 0a3.001 3.001 0 003.75-.615A2.993 2.993 0 009.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 002.25 1.016c.896 0 1.7-.393 2.25-1.016a3.001 3.001 0 003.75.614m-16.5 0a3.004 3.004 0 01-.621-4.72L4.318 3.44A1.5 1.5 0 015.378 3h13.243a1.5 1.5 0 011.06.44l1.19 1.189a3 3 0 01-.621 4.72m-13.5 8.65h3.75a.75.75 0 00.75-.75V13.5a.75.75 0 00-.75-.75H6.75a.75.75 0 00-.75.75v3.75c0 .415.336.75.75.75z"
            />
          </svg>

          <span>SwiftMarket</span>
        </span>
        <div className="lg:hidden">
          <button className="navbar-burger flex items-center text-gray-600 dark:text-gray-300 p-3">
            <svg
              className="block h-4 w-4 fill-current"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <title>Mobile menu</title>
              <path
                className="fill-current"
                d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z"
              />
            </svg>
          </button>
        </div>
        <ul className="hidden absolute top-1/2 left-1/2 transform -translate-y-1/2 -translate-x-1/2 lg:flex lg:mx-auto lg:items-center lg:w-auto lg:space-x-6">
          <li>
            <a
              className="text-sm text-black-300 hover:text-gray-600 dark:text-gray-300 cursor-pointer"
              onClick={() => navigate("/")}
            >
              Homepage
            </a>
          </li>
          <li className="text-gray-300">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              stroke="currentColor"
              className="w-4 h-4 stroke-current text-gray-300"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 5v0m0 7v0m0 7v0m0-13a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
              />
            </svg>
          </li>
          <li>
            <a
              className="text-sm text-black-300 hover:text-gray-600 dark:text-gray-300 cursor-pointer"
              onClick={() => navigate("/shop")}
            >
              Browse Products
            </a>
          </li>
          <li className="text-gray-300">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              stroke="currentColor"
              className="w-4 h-4 stroke-current text-gray-300"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 5v0m0 7v0m0 7v0m0-13a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
              />
            </svg>
          </li>
          <li>
            <a
              className="text-sm text-black-500 hover:text-gray-600 dark:text-gray-300 cursor-pointer"
              onClick={() => navigate("/applyforseller")}
            >
              Launch Store
            </a>
          </li>
        </ul>
        {isAuthenticated ? (
          <>
            <div className="flex items-center mt-4 lg:mt-0">
              <button
                className="hidden mx-4 text-gray-600 transition-colors duration-300 transform lg:block dark:text-gray-200 hover:text-gray-700 dark:hover:text-gray-400 focus:text-gray-700 dark:focus:text-gray-400 focus:outline-none"
                aria-label="show notifications"
                onClick={(e) => navigate("/cart")}
              >
                <span className="relative text-gray-700 transition-colors duration-300 transform dark:text-gray-200 hover:text-gray-600 dark:hover:text-gray-300">
                  <svg
                    className="w-5 h-5"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M3 3H5L5.4 5M7 13H17L21 5H5.4M7 13L5.4 5M7 13L4.70711 15.2929C4.07714 15.9229 4.52331 17 5.41421 17H17M17 17C15.8954 17 15 17.8954 15 19C15 20.1046 15.8954 21 17 21C18.1046 21 19 20.1046 19 19C19 17.8954 18.1046 17 17 17ZM9 19C9 20.1046 8.10457 21 7 21C5.89543 21 5 20.1046 5 19C5 17.8954 5.89543 17 7 17C8.10457 17 9 17.8954 9 19Z"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>

                  <span className="absolute top-0 left-0 p-1 text-xs text-white bg-blue-500 rounded-full"></span>
                </span>
              </button>

              <button
                type="button"
                className="flex items-center focus:outline-none"
                aria-label="toggle profile dropdown"
              >
                <div
                  className="w-8 h-8 overflow-hidden border-2 border-gray-400 rounded-full"
                  onClick={() => navigate("/profile")}
                >
                  <img
                    src={`https://ui-avatars.com/api/?name=${user.username}`}
                    className="object-cover w-full h-full"
                    alt="avatar"
                  />
                </div>
              </button>
            </div>
          </>
        ) : (
          <div className="space-x-2 hidden lg:block">
            <button
              className="rounded-md border border-blue-600 px-3.5 py-1.5 text-base font-semibold leading-7 text-blue-700 hover:bg-blue-300 dark:border-blue-400 dark:text-white dark:hover:bg-blue-500"
              onClick={() => navigate("/signin")}
            >
              Login
            </button>
            <button
              className="rounded-md bg-blue-600 px-3.5 py-1.5 text-base font-semibold leading-7 text-white hover:bg-blue-500 dark:bg-blue-400 dark:hover:bg-blue-500"
              onClick={() => navigate("/signup")}
            >
              SignUp
            </button>
          </div>
        )}
      </nav>
      <nav className="relative px-8 py-4 bg-white dark:bg-gray-900">
        <ul>
          <li>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  className="w-4 h-4 text-gray-500 dark:text-white"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  ></path>
                </svg>
              </span>
              <form onSubmit={handleSearch}>
                <input
                  id="query"
                  name="query"
                  type="search"
                  className="w-[100%] py-2 pl-10 pr-4 text-sm bg-gray-100 dark:bg-gray-800 rounded-md focus:outline-none focus:bg-white focus:text-gray-900 text-gray-700 dark:text-white"
                  placeholder="Search"
                  onChange={handleInputChange}
                />
              </form>
            </div>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default NavBar;
