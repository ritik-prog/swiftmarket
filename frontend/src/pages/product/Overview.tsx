import React, { useEffect, useState } from "react";
import ShoppingBagIcon from "@heroicons/react/24/outline/ShoppingBagIcon";
import HeartIcon from "@heroicons/react/24/outline/HeartIcon";
import TagIcon from "@heroicons/react/24/outline/TagIcon";
import ShareIcon from "@heroicons/react/24/outline/ShareIcon";
import PlusIcon from "@heroicons/react/24/outline/PlusIcon";
import MinusIcon from "@heroicons/react/24/outline/MinusIcon";
import ChevronLeftIcon from "@heroicons/react/24/outline/ChevronLeftIcon";
import ChevronRightIcon from "@heroicons/react/24/outline/ChevronRightIcon";
import { searchProduct } from "../../api/product";
import Reviews from "./Reviews";
import FAQ from "./FAQ";
import Recommendations from "./Recommendations";
import { CreateToast } from "../../utils/Toast";
import SellerCard from "./SellerCard";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addItem as addItemToCart } from "../../redux/cart/cartSlice";
import { addItem } from "../../redux/wishlist/wishlistSlice";

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
  price: string;
}

const Overview = () => {
  const [query, setQuery] = useState<any>("");
  const [product, setProduct] = useState<any>("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [quantity, setQuantity] = useState(1);

  const handleDecrease = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleIncrease = () => {
    setQuantity(quantity + 1);
  };

  async function getProduct(query: any) {
    const response = await searchProduct(query);
    setProduct(response);
  }

  useEffect(() => {
    const url = new URL(window.location.href);
    const query = url.searchParams.get("query");
    setQuery(query);
    getProduct(query);
  }, []);

  const [currentImage, setCurrentImage] = useState(0);

  const handleLeftClick = () => {
    setCurrentImage(
      currentImage === 0 ? product.data?.imagesUrl.length - 1 : currentImage - 1
    );
  };

  const handleRightClick = () => {
    setCurrentImage(
      currentImage === product.data?.imagesUrl.length - 1 ? 0 : currentImage + 1
    );
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(window.location.href);
    CreateToast("clipboard", "Link copied to clipboard!", "success");
  };

  const handleAddToCart = (product: CartItem) => {
    console.log(product);
    const cartItem = {
      _id: product._id,
      productName: product.productName,
      price: product.price,
      productDescription: product.productDescription,
      discountedPrice: product.discountedPrice,
      thumbnailUrl: product.thumbnailUrl,
      quantity: quantity,
    };
    dispatch(addItemToCart(cartItem));
    CreateToast("addedToCart", "Product successfully added to cart", "success");
  };

  const handleAddToWishlist = (product: wishlistItem) => {
    const wishlistItem = {
      _id: product._id,
      productName: product.productName,
      discountedPrice:
        product.discountedPrice !== 0 ? product.discountedPrice : product.price,
      productDescription: product.productDescription,
      thumbnailUrl: product.thumbnailUrl,
    };
    dispatch(addItem(wishlistItem));
    navigate("/wishlist");
  };

  return (
    <div
      dir="ltr"
      className="dark:bg-gray-900 md:w-[600px] lg:w-[940px] xl:w-[1180px] 2xl:w-[1360px] mx-auto p-1 lg:p-0 xl:p-3 bg-brand-light rounded-md"
    >
      {product ? (
        <div className="overflow-hidden">
          <div className="px-4 pt-4 md:px-6 lg:p-8 2xl:p-10 mb-4 lg:mb-0 md:pt-7 2xl:pt-10">
            <div className="items-start justify-between lg:flex">
              <div className="items-center justify-center mb-6 overflow-hidden xl:flex md:mb-8 lg:mb-0">
                <div className="w-full xl:flex xl:flex-row-reverse">
                  <div className="shrink-0 w-full xl:ltr:ml-5 xl:rtl:mr-5 mb-2.5 md:mb-3 border border-border-base overflow-hidden rounded-md relative xl:w-[480px] 2xl:w-[650px]">
                    <div className="flex items-center justify-center">
                      <img
                        alt={`Product gallery ${currentImage}`}
                        src={product.data?.imagesUrl[currentImage]}
                        width={650}
                        height={590}
                        decoding="async"
                        data-nimg={1}
                        className="rounded-lg object-cover"
                      />
                    </div>
                    <div className="flex items-center justify-between w-full absolute top-2/4 z-10 px-2.5">
                      <div
                        onClick={handleLeftClick}
                        className="flex items-center justify-center text-base transition duration-300 transform -translate-y-1/2 rounded-full cursor-pointer w-7 h-7 md:w-8 md:h-8 lg:w-9 lg:h-9 xl:w-10 xl:h-10 lg:text-lg xl:text-xl bg-brand-light hover:bg-brand hover:text-brand-light focus:outline-none shadow-navigation swiper-button-disabled"
                      >
                        <ChevronLeftIcon className="h-5 w-5" />
                      </div>
                      <div
                        onClick={handleRightClick}
                        className="flex items-center justify-center text-base transition duration-300 transform -translate-y-1/2 rounded-full cursor-pointer w-7 h-7 md:w-8 md:h-8 lg:w-9 lg:h-9 xl:w-10 xl:h-10 lg:text-lg xl:text-xl bg-brand-light hover:bg-brand hover:text-brand-light focus:outline-none shadow-navigation"
                      >
                        <ChevronRightIcon className="h-5 w-5" />
                      </div>
                    </div>
                  </div>
                  <div className="flex xl:flex-col gap-2">
                    {product.data?.imagesUrl.map((image: any, index: any) => (
                      <div
                        key={index}
                        className={`flex items-center justify-center overflow-hidden transition border rounded cursor-pointer border-border-base ${
                          currentImage === index &&
                          "border-brand-light shadow-navigation"
                        }`}
                        onClick={() => setCurrentImage(index)}
                      >
                        <img
                          alt={`Product gallery thumbnail ${index}`}
                          src={image}
                          width={96}
                          height={96}
                          decoding="async"
                          data-nimg={1}
                          className="rounded-lg object-cover"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="dark:text-white shrink-0 flex flex-col lg:ltr:pl-5 lg:rtl:pr-5 xl:ltr:pl-8 xl:rtl:pr-8 2xl:ltr:pl-10 2xl:rtl:pr-10 lg:w-[430px] xl:w-[470px] 2xl:w-[480px]">
                <div className="pb-5">
                  <div className="mb-2 md:mb-2.5 block -mt-1.5" role="button">
                    <h2 className="text-lg font-medium transition-colors duration-300 text-brand-dark md:text-xl xl:text-2xl hover:text-brand">
                      {product.data?.productName}
                    </h2>
                  </div>
                  <div className="flex items-center mt-5">
                    {product.data.discountedPrice !== 0 ? (
                      <div className="mt-1 flex items-end">
                        <p className="text-xs line-through font-medium text-gray-500 dark:text-gray-100">
                          ₹{product.data.price}
                        </p>
                        <p className="text-md font-medium text-gray-900 dark:text-white">
                          &nbsp;&nbsp;₹{product.data.discountedPrice}
                        </p>
                        &nbsp;&nbsp;
                        <p className="text-sm font-medium text-green-500">
                          ₹{product.data.price - product.data.discountedPrice}
                        </p>
                      </div>
                    ) : (
                      <div className="mt-1 flex items-end">
                        <p className="text-xs line-through font-medium text-gray-500 dark:text-gray-100">
                          ₹{product.data.price}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
                <div className="pb-2" />
                <div className="pt-1.5 lg:pt-3 xl:pt-4 space-y-2.5 md:space-y-3.5">
                  {product.data.isAvailable ? (
                    <>
                      <div className="flex dark:text-gray-900 items-center justify-between rounded overflow-hidden shrink-0 p-1 h-11 md:h-14 bg-[#f3f5f9]">
                        <button
                          className="flex items-center justify-center shrink-0  transition-all ease-in-out duration-300 focus:outline-none focus-visible:outline-none !w-10 !h-10 rounded-full transform scale-80 lg:scale-100 text-brand-dark hover:bg-fill-four ltr:ml-auto rtl:mr-auto"
                          onClick={handleDecrease}
                        >
                          <span className="sr-only">button-minus</span>
                          <MinusIcon className="transition-all h-6 w-6" />
                        </button>
                        <span className="font-semibold text-brand-dark flex items-center justify-center h-full transition-colors duration-250 ease-in-out cursor-default shrink-0 text-base md:text-[17px] w-12 md:w-20 xl:w-28 ">
                          {quantity}
                        </span>
                        <button
                          className="group flex items-center  shrink-0 transition-all ease-in-out duration-300 focus:outline-none focus-visible:outline-none !w-10 !h-10 rounded-full scale-80 lg:scale-100 text-heading hover:bg-fill-four ltr:mr-auto rtl:ml-auto !pr-0 justify-center"
                          onClick={handleIncrease}
                        >
                          <span className="sr-only">button-plus</span>
                          <PlusIcon className="transition-all h-6 w-6" />
                        </button>
                      </div>
                      <button
                        data-variant="primary"
                        className="group text-[13px] md:text-sm lg:text-15px leading-4 inline-flex items-center transition ease-in-out duration-300 font-body font-semibold text-center justify-center rounded placeholder-white focus-visible:outline-none focus:outline-none h-12 md:h-14 bg-brand text-brand-light tracking-widest px-5 md:px-6 lg:px-8 py-4 md:py-3.5 lg:py-4 hover:text-white hover:bg-opacity-90   w-full
                  bg-green-600  text-white hover:bg-green-500"
                        onClick={() => handleAddToCart(product.data)}
                      >
                        <ShoppingBagIcon className="ltr:mr-3 rtl:ml-3 h-5 w-5" />
                        Add to Cart
                      </button>
                    </>
                  ) : (
                    <p className="text-red-500 font-medium">Out of stock</p>
                  )}
                  <div className="grid grid-cols-2 gap-2.5">
                    <button
                      data-variant="border"
                      className="group text-[13px] md:text-sm lg:text-15px leading-4 inline-flex items-center cursor-pointer transition ease-in-out duration-300 font-body font-semibold text-center justify-center  rounded placeholder-white focus-visible:outline-none focus:outline-none h-12 md:h-14 bg-brand-light text-brand-dark border border-border-four tracking-widest px-5 md:px-6 lg:px-8 py-4 md:py-3.5 lg:py-4 group hover:false"
                      onClick={() => handleAddToWishlist(product.data)}
                    >
                      <HeartIcon className="text-2xl md:text-[26px] ltr:mr-2 rtl:ml-2 transition-all h-5 w-5" />
                      Wishlist
                    </button>
                    <div className="relative">
                      <button
                        data-variant="border"
                        className="text-[13px] md:text-sm lg:text-15px leading-4 inline-flex items-center cursor-pointer transition ease-in-out duration-300 font-body font-semibold text-center justify-center  rounded placeholder-white focus-visible:outline-none focus:outline-none h-12 md:h-14 bg-brand-light text-brand-dark border border-border-four tracking-widest px-5 md:px-6 lg:px-8 py-4 md:py-3.5 lg:py-4 w-full hover:false"
                        onClick={copyToClipboard}
                      >
                        <ShareIcon className="text-2xl md:text-[26px] ltr:mr-2 rtl:ml-2 transition-all h-5 w-5" />
                        Share
                      </button>
                    </div>
                  </div>
                </div>
                <ul className="pt-5 xl:pt-6">
                  <li className="relative inline-flex items-center justify-center text-sm md:text-15px text-brand-dark text-opacity-80 ltr:mr-2 rtl:ml-2 top-1">
                    <TagIcon className="ltr:mr-2 rtl:ml-2 h-5 w-5" /> Tags:
                  </li>
                  {product.data.tags.map((tag: any) => (
                    <li className="inline-block p-[3px]" key={tag}>
                      <div
                        className="font-medium text-13px md:text-sm rounded hover:bg-fill-four block border border-sink-base px-2 py-1 transition"
                        role="button"
                      >
                        {tag}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
          {/* product details */}
          <div className="pt-1 xl:pt-1">
            <h3 className="text-15px sm:text-base font-semibold mb-3 lg:mb-3.5">
              Product Details:
            </h3>
            <p className=" text-sm leading-7 lg:leading-[1.85em]">
              {product.data.productDescription}
            </p>
          </div>
          {/* Seller card */}
          <SellerCard seller={product.data.seller} />
          {/* product reviews and rating */}
          <div className="mt-10">
            <div className="flex items-center mb-3">
              <svg
                aria-hidden="true"
                className="w-5 h-5 text-yellow-400"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <title>First star</title>
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
              </svg>
              <svg
                aria-hidden="true"
                className="w-5 h-5 text-yellow-400"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <title>Second star</title>
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
              </svg>
              <svg
                aria-hidden="true"
                className="w-5 h-5 text-yellow-400"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <title>Third star</title>
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
              </svg>
              <svg
                aria-hidden="true"
                className="w-5 h-5 text-yellow-400"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <title>Fourth star</title>
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
              </svg>
              <svg
                aria-hidden="true"
                className="w-5 h-5 text-gray-300 dark:text-gray-500"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <title>Fifth star</title>
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
              </svg>
              <p className="ml-2 text-sm font-medium text-gray-900 dark:text-white">
                4.95 out of 5
              </p>
            </div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
              1,745 global ratings
            </p>
            <div className="flex items-center mt-4">
              <span className="text-sm font-medium text-blue-600 dark:text-blue-500">
                5 star
              </span>
              <div className="w-2/4 h-5 mx-4 bg-gray-200 rounded dark:bg-gray-700">
                <div
                  className="h-5 bg-yellow-400 rounded"
                  style={{ width: "70%" }}
                ></div>
              </div>
              <span className="text-sm font-medium text-blue-600 dark:text-blue-500">
                70%
              </span>
            </div>
            <div className="flex items-center mt-4">
              <span className="text-sm font-medium text-blue-600 dark:text-blue-500">
                4 star
              </span>
              <div className="w-2/4 h-5 mx-4 bg-gray-200 rounded dark:bg-gray-700">
                <div
                  className="h-5 bg-yellow-400 rounded"
                  style={{ width: "17%" }}
                ></div>
              </div>
              <span className="text-sm font-medium text-blue-600 dark:text-blue-500">
                17%
              </span>
            </div>
            <div className="flex items-center mt-4">
              <span className="text-sm font-medium text-blue-600 dark:text-blue-500">
                3 star
              </span>
              <div className="w-2/4 h-5 mx-4 bg-gray-200 rounded dark:bg-gray-700">
                <div
                  className="h-5 bg-yellow-400 rounded"
                  style={{ width: "8%" }}
                ></div>
              </div>
              <span className="text-sm font-medium text-blue-600 dark:text-blue-500">
                8%
              </span>
            </div>
            <div className="flex items-center mt-4">
              <span className="text-sm font-medium text-blue-600 dark:text-blue-500">
                2 star
              </span>
              <div className="w-2/4 h-5 mx-4 bg-gray-200 rounded dark:bg-gray-700">
                <div
                  className="h-5 bg-yellow-400 rounded"
                  style={{ width: "4%" }}
                ></div>
              </div>
              <span className="text-sm font-medium text-blue-600 dark:text-blue-500">
                4%
              </span>
            </div>
            <div className="flex items-center mt-4">
              <span className="text-sm font-medium text-blue-600 dark:text-blue-500">
                1 star
              </span>
              <div className="w-2/4 h-5 mx-4 bg-gray-200 rounded dark:bg-gray-700">
                <div
                  className="h-5 bg-yellow-400 rounded"
                  style={{ width: "1%" }}
                ></div>
              </div>
              <span className="text-sm font-medium text-blue-600 dark:text-blue-500">
                1%
              </span>
            </div>
          </div>
          {/* Reviews */}
          <Reviews />
          {/* FAQ */}
          <FAQ faqs={product.data.faqs} />
          {/* Recommended products */}
          <Recommendations />
        </div>
      ) : (
        <div>loading</div>
      )}
    </div>
  );
};

export default Overview;
