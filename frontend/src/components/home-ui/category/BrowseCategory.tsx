import React from "react";
import { useNavigate } from "react-router-dom";

const categories = [
  {
    title: "Mobiles",
    image:
      "https://dev-ui-image-assets.s3.ap-south-1.amazonaws.com/category/22fddf3c7da4c4f4.png",
  },
  {
    title: "Fashion",
    image:
      "https://dev-ui-image-assets.s3.ap-south-1.amazonaws.com/category/c12afc017e6f24cb.png",
  },
  {
    title: "Electronics",
    image:
      "https://dev-ui-image-assets.s3.ap-south-1.amazonaws.com/category/69c6589653afdb9a.png",
  },
  {
    title: "Home",
    image:
      "https://dev-ui-image-assets.s3.ap-south-1.amazonaws.com/category/ab7e2b022a4587dd.jpg",
  },
  {
    title: "Appliances",
    image:
      "https://dev-ui-image-assets.s3.ap-south-1.amazonaws.com/category/0ff199d1bd27eb98.png",
  },
  {
    title: "Travel",
    image:
      "https://dev-ui-image-assets.s3.ap-south-1.amazonaws.com/category/71050627a56b4693.png",
  },
];

const BrowseCategory = () => {
  const navigate = useNavigate();
  return (
    <div className="max-w-6xl px-4 mx-auto py-4 md:py-6 dark:text-gray-300 dark:bg-gray-900">
      <div className="flex md:text-left text-center md:justify-between justify-center items-center">
        <div>
          <h2 className="text-3xl font-medium">Popular Categories</h2>
          <div className="mt-2">Choose from variety of items</div>
        </div>
        <div className="md:flex hidden items-center uppercase text-gray-500">
          All Categories
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="ml-1 w-4 h-4"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8.25 4.5l7.5 7.5-7.5 7.5"
            />
          </svg>
        </div>
      </div>
      <div className="my-10">
        <div className="grid gap-6 grid-cols-2 sm:grid-cols-3 lg:grid-cols-6">
          {categories.map((category) => (
            <span
              className="bg-gray-100 dark:bg-gray-800 rounded-xl flex flex-col justify-center items-center p-4 md:p-6 cursor-pointer"
              key={category.title}
              onClick={() => navigate(`/search?category=${category.title}`)}
            >
              <img
                className="h-20 w-20"
                src={category.image}
                alt={category.title}
              />
              <div className="font-bold mt-4 text-center">{category.title}</div>
            </span>
          ))}
        </div>
      </div>

      <div className="md:hidden flex items-center justify-center mt-8 font-medium uppercase text-gray-500">
        All Categories
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          className="ml-1 w-4 h-4"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M8.25 4.5l7.5 7.5-7.5 7.5"
          />
        </svg>
      </div>
    </div>
  );
};

export default BrowseCategory;
