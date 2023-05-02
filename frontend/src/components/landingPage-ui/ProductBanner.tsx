import React, { useEffect, useRef, useState } from "react";
import { getTrandingProductsThree } from "../../api/product";
import { useNavigate } from "react-router-dom";
import Trending from "../home-ui/Trending";

interface Response {
  trending: [];
  views: [];
  likes: [];
  ratings: [];
}

const ProductBanner = () => {
  const [showCards, setShowCards] = useState("trending");
  const activeClasses = "bg-blue-600 text-white";
  const inactiveClasses =
    "text-body-color hover:bg-blue-500 hover:text-white dark:text-white";

  const [products, setProducts] = useState<Response>();
  const navigate = useNavigate();
  const isMountedRef = useRef(false);

  console.log(products);
  async function getProducts() {
    const response = await getTrandingProductsThree();
    console.log(response);
    setProducts(response);
  }

  useEffect(() => {
    // Only call getProducts() if the component has mounted
    if (isMountedRef.current) {
      getProducts();
    } else {
      isMountedRef.current = true;
    }
  }, []);

  return (
    <section className="pt-20 lg:pt-[120px] bg-white dark:bg-gray-900">
      <div className="container mx-auto" id="product">
        <div className="-mx-4 flex flex-wrap">
          <div className="w-full px-4 dark:text-white">
            <div className="mx-auto mb-[60px] max-w-[510px] text-center">
              <span className="mb-2 block text-lg font-semibold text-primary">
                Your One-Stop Shop for Bulk Orders
              </span>
              <h2 className="mb-4 text-3xl font-bold text-dark sm:text-4xl md:text-[40px]">
                Highligted Products
              </h2>
              <p className="text-base text-body-color">
                Discover our top-quality highligted products and easily place
                your bulk order with us. Find everything you need, from
                electronics to home essentials, all in one place.
              </p>
            </div>
          </div>
        </div>
        <div className="-mx-4 flex flex-wrap justify-center">
          <div className="w-full px-4">
            <ul className="mb-12 flex flex-wrap justify-center space-x-1">
              <li className="mb-1">
                <button
                  onClick={() => setShowCards("trending")}
                  className={`inline-block rounded-lg py-2 px-5 text-center text-base font-semibold transition md:py-3 lg:px-8 ${
                    showCards === "trending" ? activeClasses : inactiveClasses
                  }`}
                >
                  Trending
                </button>
              </li>
              <li className="mb-1">
                <button
                  onClick={() => setShowCards("views")}
                  className={`inline-block rounded-lg py-2 px-5 text-center text-base font-semibold transition md:py-3 lg:px-8 ${
                    showCards === "views" ? activeClasses : inactiveClasses
                  }`}
                >
                  Top views
                </button>
              </li>
              <li className="mb-1">
                <button
                  onClick={() => setShowCards("likes")}
                  className={`inline-block rounded-lg py-2 px-5 text-center text-base font-semibold transition md:py-3 lg:px-8 ${
                    showCards === "likes" ? activeClasses : inactiveClasses
                  }`}
                >
                  Top Likes
                </button>
              </li>
              <li className="mb-1">
                <button
                  onClick={() => setShowCards("ratings")}
                  className={`inline-block rounded-lg py-2 px-5 text-center text-base font-semibold transition md:py-3 lg:px-8 ${
                    showCards === "rating" ? activeClasses : inactiveClasses
                  }`}
                >
                  Top Ratings
                </button>
              </li>
            </ul>
          </div>
        </div>
        <div className="-mx-4 flex flex-wrap">
          {products?.trending?.map((product: any) => (
            <div
              className={`w-full px-4 md:w-1/2 xl:w-1/3 ${
                showCards === "all" || showCards === "trending"
                  ? "block"
                  : "hidden"
              }`}
              key={product.productName}
            >
              <div className="relative mb-12">
                <div className="overflow-hidden rounded-lg">
                  <img
                    src={product.thumbnailUrl}
                    alt="portfolio"
                    className="w-full"
                  />
                </div>
                <div className="relative z-10 mx-7 -mt-20 rounded-lg bg-white py-9 px-3 text-center shadow-lg">
                  <span className="mb-2 block text-sm font-semibold text-primary">
                    {product.category}
                  </span>
                  <h3 className="mb-4 text-xl font-bold text-dark">
                    {product.productName}
                  </h3>
                  <p className="text-body-color mb-2 text-md font-medium">
                    Price: ₹{product.discountedPrice}
                  </p>
                  <a
                    href="javascript:void(0)"
                    className="inline-block rounded-md border py-3 px-7 text-sm font-semibold text-body-color transition hover:border-blue-500 hover:bg-blue-500 hover:text-white"
                    onClick={() => navigate(`/product?query=${product._id}`)}
                  >
                    View Details
                  </a>
                </div>
              </div>
            </div>
          ))}

          {products?.views?.map((product: any) => (
            <div
              className={`w-full px-4 md:w-1/2 xl:w-1/3 ${
                showCards === "all" || showCards === "views"
                  ? "block"
                  : "hidden"
              }`}
              key={product.productName}
            >
              <div className="relative mb-12">
                <div className="overflow-hidden rounded-lg">
                  <img
                    src={product.thumbnailUrl}
                    alt="portfolio"
                    className="w-full"
                  />
                </div>
                <div className="relative z-10 mx-7 -mt-20 rounded-lg bg-white py-9 px-3 text-center shadow-lg">
                  <span className="mb-2 block text-sm font-semibold text-primary">
                    {product.category}
                  </span>
                  <h3 className="mb-4 text-xl font-bold text-dark">
                    {product.productName}
                  </h3>
                  <p className="text-body-color mb-2 text-md font-medium">
                    Price: ₹{product.discountedPrice}
                  </p>
                  <a
                    href="javascript:void(0)"
                    className="inline-block rounded-md border py-3 px-7 text-sm font-semibold text-body-color transition hover:border-blue-500 hover:bg-blue-500 hover:text-white"
                    onClick={() => navigate(`/product?query=${product._id}&}`)}
                  >
                    View Details
                  </a>
                </div>
              </div>
            </div>
          ))}

          {products?.likes?.map((product: any) => (
            <div
              className={`w-full px-4 md:w-1/2 xl:w-1/3 ${
                showCards === "all" || showCards === "likes"
                  ? "block"
                  : "hidden"
              }`}
              key={product.productName}
            >
              <div className="relative mb-12">
                <div className="overflow-hidden rounded-lg">
                  <img
                    src={product.thumbnailUrl}
                    alt="portfolio"
                    className="w-full"
                  />
                </div>
                <div className="relative z-10 mx-7 -mt-20 rounded-lg bg-white py-9 px-3 text-center shadow-lg">
                  <span className="mb-2 block text-sm font-semibold text-primary">
                    {product.category}
                  </span>
                  <h3 className="mb-4 text-xl font-bold text-dark">
                    {product.productName}
                  </h3>
                  <p className="text-body-color mb-2 text-md font-medium">
                    Price: ₹
                    {product.discountedPrice
                      ? product.discountedPrice
                      : product.price}
                  </p>
                  <a
                    href="javascript:void(0)"
                    className="inline-block rounded-md border py-3 px-7 text-sm font-semibold text-body-color transition hover:border-blue-500 hover:bg-blue-500 hover:text-white"
                    onClick={() => navigate(`/product?query=${product._id}&}`)}
                  >
                    View Details
                  </a>
                </div>
              </div>
            </div>
          ))}

          {products?.ratings?.map((product: any) => (
            <div
              className={`w-full px-4 md:w-1/2 xl:w-1/3 ${
                showCards === "all" || showCards === "ratings"
                  ? "block"
                  : "hidden"
              }`}
              key={product.productName}
            >
              <div className="relative mb-12">
                <div className="overflow-hidden rounded-lg">
                  <img
                    src={product.thumbnailUrl}
                    alt="portfolio"
                    className="w-full"
                  />
                </div>
                <div className="relative z-10 mx-7 -mt-20 rounded-lg bg-white py-9 px-3 text-center shadow-lg">
                  <span className="mb-2 block text-sm font-semibold text-primary">
                    {product.category}
                  </span>
                  <h3 className="mb-4 text-xl font-bold text-dark">
                    {product.productName}
                  </h3>
                  <p className="text-body-color mb-2 text-md font-medium">
                    Price: ₹
                    {product.discountedPrice
                      ? product.discountedPrice
                      : product.price}
                  </p>
                  <a
                    href="javascript:void(0)"
                    className="inline-block rounded-md border py-3 px-7 text-sm font-semibold text-body-color transition hover:border-blue-500 hover:bg-blue-500 hover:text-white"
                    onClick={() => navigate(`/product?query=${product._id}&}`)}
                  >
                    View Details
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductBanner;
