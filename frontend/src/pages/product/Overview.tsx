import React, { useEffect, useState } from "react";
import ShoppingBagIcon from "@heroicons/react/24/outline/ShoppingBagIcon";
import HeartIcon from "@heroicons/react/24/outline/HeartIcon";
import TagIcon from "@heroicons/react/24/outline/TagIcon";
import ShareIcon from "@heroicons/react/24/outline/ShareIcon";
import PlusIcon from "@heroicons/react/24/outline/PlusIcon";
import MinusIcon from "@heroicons/react/24/outline/MinusIcon";
import ChevronLeftIcon from "@heroicons/react/24/outline/ChevronLeftIcon";
import ChevronRightIcon from "@heroicons/react/24/outline/ChevronRightIcon";
import { getLikedProduct, searchProduct } from "../../api/product";
import Reviews from "./Reviews";
import FAQ from "./FAQ";
import Recommendations from "./Recommendations";
import { CreateToast } from "../../utils/Toast";
import SellerCard from "./SellerCard";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addItem as addItemToCart } from "../../redux/cart/cartSlice";
import { addItem } from "../../redux/wishlist/wishlistSlice";
import ReviewsOverview from "./ReviewsOverview";
import { likeProduct } from "../../api/product";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/rootReducer";

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
  const isAuthenticated = useSelector(
    (state: RootState) => state.user.isAuthenticated
  );

  const [liked, setLiked] = useState(false);

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
    const likedProduct = await getLikedProduct(response.data._id);
    setLiked(likedProduct.isLiked);
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

  const handleClick = async (id: any) => {
    if (isAuthenticated) {
      if (!liked) {
        try {
          // save like
          const result = await likeProduct(id);
          CreateToast("resultliked", result.message, "success");
          setLiked(!liked);
        } catch (error) {}
      }
    }else{
      CreateToast("login", "Please login to like this product", "info");
    }
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
                    <div className="flex items-center justify-center relative">
                      <img
                        alt={`Product gallery ${currentImage}`}
                        src={product.data?.imagesUrl[currentImage]}
                        width={650}
                        height={590}
                        decoding="async"
                        data-nimg={1}
                        className="rounded-lg object-cover"
                      />

                      <button
                        onClick={() => handleClick(product.data._id)}
                        className={`absolute top-0 right-4 mt-4 inline-flex items-center justify-center space-x-2 px-4 py-2 rounded-full font-medium transition-all ${
                          liked
                            ? "text-white bg-red-500 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                            : "text-gray-700 bg-gray-200 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                        }`}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className={`h-5 w-5 ${
                            liked ? "text-white" : "text-gray-700"
                          }`}
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18.785l-.497-.447C4.406 13.547 1.588 10.962 1.588 7.28c0-2.638 2.16-4.798 4.798-4.798 1.421 0 2.727.615 3.636 1.677C11.615 3.096 12.921 2.48 14.342 2.48c2.638 0 4.798 2.16 4.798 4.798 0 3.682-2.817 6.267-7.915 11.058L10 18.785z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </button>
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
          <ReviewsOverview productId={product.data.id} />
          {/* Reviews */}
          <Reviews product={product.data} />
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
