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
          className="text-3xl font-bold leading-none text-transparent dark:text-transparent"
          onClick={() => navigate("/")}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            xmlnsXlink="http://www.w3.org/1999/xlink"
            zoomAndPan="magnify"
            viewBox="0 0 375 374.999991"
            preserveAspectRatio="xMidYMid meet"
            version="1.0"
            className="h-8 w-8"
          >
            <defs>
              <clipPath id="e71b01a591">
                <path
                  d="M 57 41.25 L 374 41.25 L 374 333.75 L 57 333.75 Z M 57 41.25 "
                  clip-rule="nonzero"
                />
              </clipPath>
            </defs>
            <g clip-path="url(#e71b01a591)">
              <path
                fill="#202020"
                d="M 68.414062 282.320312 L 257.757812 282.320312 C 266.542969 282.320312 273.984375 275.769531 275.175781 267.136719 L 298.246094 93.945312 C 298.246094 93.945312 298.246094 93.945312 298.246094 93.871094 C 302.117188 63.875 327.871094 41.175781 358.164062 41.175781 L 362.703125 41.175781 C 368.878906 41.175781 373.867188 46.164062 373.867188 52.339844 C 373.867188 58.515625 368.878906 63.503906 362.703125 63.503906 L 358.164062 63.503906 C 339.035156 63.503906 322.808594 77.792969 320.351562 96.773438 C 320.351562 96.773438 320.351562 96.773438 320.351562 96.847656 L 297.28125 270.039062 C 294.675781 289.761719 277.707031 304.648438 257.757812 304.648438 L 251.0625 304.648438 C 250.835938 320.875 237.738281 333.972656 221.4375 333.972656 C 205.140625 333.972656 192.039062 320.875 191.816406 304.648438 L 145.523438 304.648438 C 145.300781 320.875 132.199219 333.972656 115.902344 333.972656 C 99.601562 333.972656 86.5 320.875 86.277344 304.648438 L 68.414062 304.648438 C 62.238281 304.648438 57.25 299.664062 57.25 293.484375 C 57.25 287.308594 62.238281 282.320312 68.414062 282.320312 Z M 68.414062 282.320312 "
                fill-opacity="1"
                fill-rule="nonzero"
              />
            </g>
            <path
              fill="#77bf3f"
              d="M 135.25 92.457031 L 172.09375 87.992188 C 186.160156 110.46875 216.675781 149.167969 270.710938 172.242188 L 260.4375 248.976562 C 184.152344 204.992188 147.234375 123.9375 135.25 92.457031 Z M 135.25 92.457031 "
              fill-opacity="1"
              fill-rule="nonzero"
            />
            <path
              fill="#50b948"
              d="M 112.402344 95.210938 C 122.898438 125.128906 160.632812 216.378906 246 266.691406 L 128.851562 266.691406 C 89.554688 197.996094 79.878906 122.898438 77.644531 99.378906 Z M 112.402344 95.210938 "
              fill-opacity="1"
              fill-rule="nonzero"
            />
            <path
              fill="#fbcc06"
              d="M 273.835938 149.167969 C 234.984375 131.082031 210.496094 104.214844 196.953125 85.011719 L 269.519531 76.304688 C 272.941406 75.859375 276.367188 77.125 278.824219 79.582031 C 281.277344 82.035156 282.394531 85.460938 281.949219 88.882812 Z M 273.835938 149.167969 "
              fill-opacity="1"
              fill-rule="nonzero"
            />
            <path
              fill="#38a34a"
              d="M 3.886719 111.582031 C 5.75 109.203125 8.425781 107.714844 11.40625 107.339844 L 55.539062 102.058594 C 57.773438 126.992188 66.925781 197.917969 103.324219 266.691406 L 57.328125 266.691406 C 36.785156 266.691406 19.21875 251.359375 16.539062 230.964844 L 1.804688 119.917969 C 1.207031 116.941406 2.027344 113.964844 3.886719 111.582031 Z M 3.886719 111.582031 "
              fill-opacity="1"
              fill-rule="nonzero"
            />
          </svg>
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
