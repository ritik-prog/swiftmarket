import React from "react";
import { FaHeart, FaShoppingCart } from "react-icons/fa";
import { IoIosStar, IoIosStarHalf } from "react-icons/io";

const Wishlist = () => {
  return (
    <section>
      <div className="mx-auto max-w-screen-xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <header className="text-center">
            <h1 className="text-xl font-bold text-gray-900 sm:text-3xl">
              Your Wishlist
            </h1>
          </header>

          <div className="mt-8">
            <ul className="space-y-4">
              <li className="flex items-center gap-4">
                <div className="flex w-full space-x-2 sm:space-x-4 pb-5 align-middle justify-center">
                  <div className="relative flex w-48 sm:w-96">
                    <div className="absolute inset-0 bg-gray-100"></div>
                    <img
                      className="absolute inset-0 object-contain object-center w-full h-full p-2"
                      src="https://dev-ui-image-assets.s3.ap-south-1.amazonaws.com/shopping-cart/iphone-11-256-u-mwm82hn-a-apple-0-original-imafkg25mhaztxns.jpeg?q=90"
                      alt="APPLE iPhone 11 (White, 128 GB)"
                    />
                  </div>
                  <div className="flex flex-col justify-between w-full pb-4">
                    <div className="flex justify-between w-full pb-2 space-x-2">
                      <div className="space-y-1">
                        <h3 className="text-lg font-semibold leading-snug sm:pr-8">
                          APPLE iPhone 11 (White, 128 GB) (Includes EarPods,
                          Power Adapter) (Renewed) (White, 128 GB) (Includes
                          EarPods, Power Adapter) (Renewed) (White, 128 GB)
                          (Includes EarPods, Power Adapter) (Renewed)
                        </h3>
                        <p className="text-sm dark:text-gray-400">White</p>
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
                            ₹47,199
                          </p>
                          <p className="text-md font-medium text-gray-900 dark:text-white">
                            &nbsp;&nbsp;₹37,199
                          </p>
                          &nbsp;&nbsp;
                          <p className="text-sm font-medium text-green-500">
                            ₹10,000
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            </ul>

            <div className="mt-8 flex justify-end border-t border-gray-100 pt-8">
              <div className="w-screen max-w-lg space-y-4">
                <dl className="space-y-0.5 text-sm text-gray-700">
                  <div className="flex justify-between">
                    <dt>Subtotal</dt>
                    <dd>£250</dd>
                  </div>

                  <div className="flex justify-between">
                    <dt>VAT</dt>
                    <dd>£25</dd>
                  </div>

                  <div className="flex justify-between">
                    <dt>Discount</dt>
                    <dd>-£20</dd>
                  </div>

                  <div className="flex justify-between !text-base font-medium">
                    <dt>Total</dt>
                    <dd>£200</dd>
                  </div>
                </dl>

                <div className="flex justify-end">
                  <span className="inline-flex items-center justify-center rounded-full bg-indigo-100 px-2.5 py-0.5 text-indigo-700">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke-width="1.5"
                      stroke="currentColor"
                      className="-ml-1 mr-1.5 h-4 w-4"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M16.5 6v.75m0 3v.75m0 3v.75m0 3V18m-9-5.25h5.25M7.5 15h3M3.375 5.25c-.621 0-1.125.504-1.125 1.125v3.026a2.999 2.999 0 010 5.198v3.026c0 .621.504 1.125 1.125 1.125h17.25c.621 0 1.125-.504 1.125-1.125v-3.026a2.999 2.999 0 010-5.198V6.375c0-.621-.504-1.125-1.125-1.125H3.375z"
                      />
                    </svg>

                    <p className="whitespace-nowrap text-xs">
                      2 Discounts Applied
                    </p>
                  </span>
                </div>

                <div className="flex justify-end">
                  <a
                    href="#"
                    className="block rounded bg-gray-700 px-5 py-3 text-sm text-gray-100 transition hover:bg-gray-600"
                  >
                    Checkout
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Wishlist;
