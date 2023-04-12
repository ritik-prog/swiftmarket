import React, { useEffect, useRef, useState } from "react";
import { FaHeart, FaShoppingCart } from "react-icons/fa";
import { IoIosStar, IoIosStarHalf } from "react-icons/io";
import { searchProducts } from "../../api/product";
import { useNavigate } from "react-router-dom";
import { addItem } from "../../redux/cart/cartSlice";
import { useDispatch } from "react-redux";

interface CartItem {
  _id: string;
  productName: string;
  price: number;
  discountedPrice: number;
  productDescription: "";
  thumbnailUrl: string;
  quantity: number;
}

interface wishlistItem {
  _id: string;
  productName: string;
  productDescription: string;
  discountedPrice: number;
  thumbnailUrl: string;
}

const SearchFilter = () => {
  // const { query } = useParams();
  const [query, setQuery] = useState<any>();
  const [products, setProducts] = useState([]);
  const [sellers, setSellers] = useState([]);
  const navigate = useNavigate();
  const isMountedRef = useRef(false);
  const dispatch = useDispatch();

  async function getProducts(query: any) {
    const response = await searchProducts(query);
    console.log(response);
    setSellers(response.sellers);
    setProducts(response.products);
  }

  useEffect(() => {
    const url = new URL(window.location.href);
    const query = url.searchParams.get("query");
    setQuery(query);
  }, []);

  useEffect(() => {
    // Only call getProducts() if the component has mounted
    if (isMountedRef.current) {
      if (query && query.length > 0 && products.length === 0) {
        getProducts(query);
      }
    } else {
      isMountedRef.current = true;
    }
  }, [query]);

  const handleAddToCart = (product: CartItem) => {
    const cartItem = {
      _id: product._id,
      productName: product.productName,
      price: product.price,
      productDescription: product.productDescription,
      discountedPrice: product.discountedPrice,
      thumbnailUrl: product.thumbnailUrl,
      quantity: 1,
    };
    dispatch(addItem(cartItem));
  };

  const handleAddToWishlist = (product: wishlistItem) => {
    const wishlistItem = {
      _id: product._id,
      productName: product.productName,
      price: product.discountedPrice,
      productDescription: product.productDescription,
      thumbnailUrl: product.thumbnailUrl,
    };
    dispatch(addItem(wishlistItem));
  };

  return (
    <section className="bg-white dark:bg-gray-900">
      <div className="mx-auto max-w-7xl">
        <div className="lg:flex lg:items-center lg:justify-between">
          <p className="text-xl font-bold text-gray-500 dark:text-gray-400">
            Search result for:
            <span className="text-gray-800 dark:text-white"> {query}</span>
          </p>
          <div className="mt-5 overflow-x-auto lg:hidden">
            <div className="flex flex-nowrap gap-2">
              <button
                type="button"
                className="inline-flex whitespace-nowrap items-center justify-center px-4 py-2 text-gray-800 rounded-xl"
              >
                <svg
                  className="w-5 h-5"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                  ></path>
                </svg>
                All Filters
              </button>
              <button
                type="button"
                className="inline-flex items-center justify-center px-4 py-2 text-gray-800 border rounded-xl whitespace-nowrap"
              >
                Category
                <svg
                  className="w-5 h-5"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M19 9l-7 7-7-7"
                  ></path>
                </svg>
              </button>
              <button
                type="button"
                className="inline-flex items-center justify-center px-4 py-2 text-gray-800 border rounded-xl whitespace-nowrap"
              >
                Size
                <svg
                  className="w-5 h-5 pb"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M19 9l-7 7-7-7"
                  ></path>
                </svg>
              </button>
              <button
                type="button"
                className="inline-flex items-center justify-center px-4 py-2 text-gray-800 border vg rounded-xl whitespace-nowrap"
              >
                Size
                <svg
                  className="w-5 h-5"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M19 9l-7 7-7-7"
                  ></path>
                </svg>
              </button>
            </div>
          </div>
          <div className="hidden gap-2 lg:flex lg:items-center lg:justify-end">
            <div className="flex items-center py-3 pl-3 border border-black dark:border-white rounded-md">
              <label className="text-sm font-medium text-gray-800 dark:text-white whitespace-nowrap">
                Sort by:
              </label>
              <select className="block w-full my-0 pl-0 ml-1 text-sm text-gray-600 dark:text-gray-100 dark:bg-gray-900 outline-none mr-2">
                <option>Popularity</option>
              </select>
            </div>
            <button
              type="button"
              className="inline-flex items-center justify-center text-gray-800 dark:text-white border rounded-xl w-11 h-11"
            >
              <svg
                className="w-5 yc"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                ></path>
              </svg>
            </button>
            <button
              type="button"
              className="inline-flex items-center justify-center text-gray-500 dark:text-white border rounded-xl w-11 h-11"
            >
              <svg
                className="w-5"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M4 6h16M4 12h16M4 18h16"
                ></path>
              </svg>
            </button>
          </div>
        </div>
        <div className="grid md:mt-10 lg:grid-cols-4 grid-cols-1 gap-8 gap-y-10 gap-x-8">
          <div className="space-y-5 hidden md:block">
            {/* <div className="bg-white border border-gray-200 rounded-md">
                            <div className="px-7 py-6">
                                <p className="text-lg font-bold text-gray-800">Category</p>
                                <ul className="mt-4">
                                    <li>
                                        <a href="#" title="New in" className="font-medium text-gray-500">
                                            New in
                                        </a>
                                    </li>
                                    <li>
                                        <a
                                            href="#"
                                            title="Activeware"
                                            className="font-medium text-gray-500">
                                            Activeware
                                        </a>
                                    </li>
                                    <li>
                                        <a
                                            href="#"
                                            title="Running shoe"
                                            className="font-medium text-gray-500">
                                            Running shoe
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#" title="Boat shoe" className="font-medium text-gray-500">
                                            Boat shoe
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#" title="Hiking" className="font-medium text-gray-500">
                                            Hiking
                                        </a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div className="bg-white border border-gray-200 rounded-md">
                            <div className="px-7 py-6">
                                <p className="text-lg font-bold text-gray-800">Price</p>
                            </div>
                        </div> */}

            <div className="bg-white border border-gray-200 rounded-md">
              <div className="px-7 py-6">
                <p className="text-lg font-bold text-gray-800">Sellers</p>
                <div className="mt-6">
                  {sellers &&
                    sellers.map((seller: any) => (
                      <div
                        key={seller._id}
                        className="bg-gray-100 rounded-md p-4 w-full"
                      >
                        <p className="text-lg font-medium text-gray-800">
                          {seller.businessName}
                        </p>
                        <p className="text-gray-600">
                          {seller.businessAddress}
                        </p>
                        <p className="text-gray-600">{seller.businessType}</p>
                        <p className="text-gray-600">
                          {seller.productCategories.join(", ")}
                        </p>
                        <div className="flex justify-start mt-2">
                          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full">
                            Contact
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
          {/* products border-2 border-dashed */}
          <div className="col-span-3  h-full mt-4 md:mt-0 rounded-xl min-h-[200px]">
            {products &&
              products.map((product: any) => (
                <div className="flex w-full space-x-2 sm:space-x-4 pb-5 align-middle justify-center cursor-pointer">
                  <div
                    className="relative flex w-48 sm:w-96"
                    onClick={() => navigate(`/product?query=${product._id}`)}
                  >
                    <div className="absolute inset-0 bg-gray-100"></div>
                    <img
                      className="absolute inset-0 object-contain object-center w-full h-full p-2"
                      src={product.thumbnailUrl}
                      alt={product.productName}
                    />
                  </div>
                  <div className="flex flex-col justify-between w-full pb-4">
                    <div
                      className="flex justify-between w-full pb-2 space-x-2"
                      onClick={() => navigate(`/product?query=${product._id}`)}
                    >
                      <div className="space-y-1">
                        <h3 className="text-lg font-semibold leading-snug sm:pr-8">
                          {product.productName}
                        </h3>
                        <p
                          className="text-sm dark:text-gray-400"
                          style={{
                            display: "-webkit-box",
                            WebkitLineClamp: 3,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                          }}
                        >
                          {product.productDescription}
                        </p>
                        <div className="flex items-center mt-1">
                          <IoIosStar className="w-4 h-4 text-yellow-500" />
                          <IoIosStar className="w-4 h-4 text-yellow-500" />
                          <IoIosStar className="w-4 h-4 text-yellow-500" />
                          <IoIosStarHalf className="w-4 h-4 text-yellow-500" />
                          <span className="text-sm text-gray-500 ml-1">
                            (25)
                          </span>
                        </div>
                        <div className="mt-1 flex items-end">
                          <p className="text-xs line-through font-medium text-gray-500 dark:text-gray-100">
                            ₹{product.price}
                          </p>
                          <p className="text-md font-medium text-gray-900 dark:text-white">
                            &nbsp;&nbsp;₹{product.discountedPrice}
                          </p>
                          &nbsp;&nbsp;
                          <p className="text-sm font-medium text-green-500">
                            ₹{product.price - product.discountedPrice}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-start">
                      <button
                        type="button"
                        className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 mr-2"
                        onClick={() => handleAddToCart(product)}
                      >
                        <FaShoppingCart className="w-4 h-4 fill-current mr-2" />
                        <span>Add to cart</span>
                      </button>
                      <button
                        type="button"
                        className="inline-flex items-center px-4 py-2 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 cursor-pointer"
                        onClick={() => handleAddToWishlist(product)}
                      >
                        <FaHeart className="w-4 h-4 fill-current mr-2" />
                        <span>Add to wishlist</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default SearchFilter;
