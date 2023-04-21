import React from "react";
import { Link } from "react-router-dom";

const UpdateProfile = () => {
  const user = {
    username: "admin",
    name: "Admin",
    email: "",
    avatar: "https://i.pravatar.cc/150?img=1",
    role: "admin",
    createdAt: "2021-04-20T09:00:00.000Z",
    address: "",
    phone: "",
    bio: "",
  };

  return (
    <div className="p-8 bg-white dark:bg-gray-900 lg:w-screen mt-10">
      <h1 className="text-3xl font-semibold mb-6">Account Settings</h1>

      <div className="flex flex-wrap -mx-2 flex-col w-full">
        <div className="w-full md:w-1/2 px-2">
          <h2 className="text-lg font-medium mb-4">Profile Information</h2>

          <div className="grid  gap-4">
            <div className="col-span-2 sm:col-span-1">
              <label
                htmlFor="username"
                className="block text-gray-700 dark:text-gray-400 font-medium mb-1"
              >
                Username
              </label>
              <input
                type="text"
                id="username"
                value={user.username}
                readOnly
                className="w-full bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded py-2 px-3 mb-2 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
              />
            </div>

            <div className="col-span-2 sm:col-span-1">
              <label
                htmlFor="name"
                className="block text-gray-700 dark:text-gray-400 font-medium mb-1"
              >
                Name
              </label>
              <input
                type="text"
                id="name"
                value={user.name || ""}
                readOnly
                className="w-full bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded py-2 px-3 mb-2 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
              />
            </div>

            <div className="col-span-2 sm:col-span-1">
              <label
                htmlFor="email"
                className="block text-gray-700 dark:text-gray-400 font-medium mb-1"
              >
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={user.email}
                readOnly
                className="w-full bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded py-2 px-3 mb-2 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
              />
            </div>

            <div className="col-span-2 sm:col-span-1">
              <label
                htmlFor="address"
                className="block text-gray-700 dark:text-gray-400 font-medium mb-1"
              >
                Address
              </label>
              <textarea
                id="address"
                value={user.address || ""}
                readOnly
                className="w-full bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded py-2 px-3 mb-2 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
              ></textarea>
            </div>

            <div className="col-span-2 sm:col-span-1">
              <label
                htmlFor="role"
                className="block text-gray-700 dark:text-gray-400 font-medium mb-1"
              >
                Role
              </label>
              <input
                type="text"
                id="role"
                value={user.role}
                readOnly
                className="w-full bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded py-2 px-3 mb-2 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
              />
            </div>
          </div>
        </div>
        <div className="w-full md:w-1/2 px-2 mt-10">
          <h2 className="text-lg font-medium mb-4">Security Settings</h2>

          <div className="flex">
            <div className="">
              <label
                htmlFor="reset-password"
                className="block text-gray-700 dark:text-gray-400 font-medium mb-1"
              >
                Edit Profile
              </label>
              <Link
                to="/reset-password"
                className="inline-block bg-blue-500 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded focus:outline-none focus:shadow-outline-blue"
              >
                Edit Profile
              </Link>
            </div>
            <div className="pl-4">
              <label
                htmlFor="reset-password"
                className="block text-gray-700 dark:text-gray-400 font-medium mb-1"
              >
                Reset Password
              </label>
              <Link
                to="/reset-password"
                className="inline-block bg-red-500 hover:bg-red-700 text-white font-medium py-2 px-4 rounded focus:outline-none focus:shadow-outline-blue"
              >
                Reset Password
              </Link>
            </div>
            <div className="pl-4">
              <label
                htmlFor="reset-password"
                className="block text-gray-700 dark:text-gray-400 font-medium mb-1"
              >
                Delete Account
              </label>
              <Link
                to="/reset-password"
                className="inline-block bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded focus:outline-none focus:shadow-outline-red"
              >
                Delete Account
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateProfile;
