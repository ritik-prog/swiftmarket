import React from "react";
import CheckIcon from "@heroicons/react/24/outline/CheckIcon";

export function OrderDetails() {
  return (
    <div
      dir="ltr"
      className="mx-auto flex w-full max-w-1920 flex-col items-start bg-light py-10 px-2 dark:bg-gray-900 lg:bg-gray-100 xl:flex-row xl:py-14 xl:px-8 2xl:px-14"
    >
      <div className="w-full overflow-hidden lg:flex">
        <div className="w-full pr:0 lg:w-1/3 md:shrink-0 lg:pr-8">
          <div className="flex h-full flex-col bg-white dark:bg-gray-600 pb-5 md:border dark:border-gray-400 ">
            <h3 className="py-5 px-5 text-xl font-semibold text-heading">
              My Orders
            </h3>
            <div className="w-full overflow-y-visible">
              <div className="px-1 md:px-5">
                <div
                  role="button"
                  className="mb-4 flex w-full shrink-0 cursor-pointer flex-col overflow-hidden rounded border-2 border-green-600 bg-gray-100 dark:bg-gray-700 dark:text-white last:mb-0  "
                >
                  <div className="flex items-center justify-between border-b py-3 px-5 md:px-3 lg:px-5 ">
                    <span className="flex shrink-0 text-sm font-bold text-heading ltr:mr-4 rtl:ml-4 lg:text-base">
                      Order<span className="font-normal">#544</span>
                    </span>
                    <span
                      className="max-w-full truncate whitespace-nowrap rounded bg-[#F59E0B] px-3 py-2 text-sm text-white"
                      title="Order Processing"
                    >
                      Order Processing
                    </span>
                  </div>
                  <div className="flex flex-col p-5 md:p-3 lg:px-4 lg:py-5">
                    <p className="mb-4 flex w-full items-center justify-between text-sm text-heading last:mb-0">
                      <span className="w-24 shrink-0 overflow-hidden">
                        Order Date
                      </span>
                      <span className="ltr:mr-auto rtl:ml-auto">:</span>
                      <span className="ltr:ml-1 rtl:mr-1">
                        December 1, 2022
                      </span>
                    </p>
                    <p className="mb-4 flex w-full items-center justify-between text-sm text-heading last:mb-0">
                      <span className="w-24 shrink-0 overflow-hidden">
                        Delivery Time
                      </span>
                      <span className="ltr:mr-auto rtl:ml-auto">:</span>
                      <span className="truncate ltr:ml-1 rtl:mr-1">
                        Express Delivery
                      </span>
                    </p>
                    <p className="mb-4 flex w-full items-center justify-between text-sm font-bold text-heading last:mb-0">
                      <span className="w-24 shrink-0 overflow-hidden">
                        Amount
                      </span>
                      <span className="ltr:mr-auto rtl:ml-auto">:</span>
                      <span className="ltr:ml-1 rtl:mr-1">$5.00</span>
                    </p>
                    <p className="mb-4 flex w-full items-center justify-between text-sm font-bold text-heading last:mb-0">
                      <span className="w-24 flex-shrink-0 overflow-hidden">
                        Total Price
                      </span>
                      <span className="ltr:mr-auto rtl:ml-auto">:</span>
                      <span className="ltr:ml-1 rtl:mr-1">$55.10</span>
                    </p>
                  </div>
                </div>
                <div
                  role="button"
                  className="mb-4 flex w-full shrink-0 cursor-pointer flex-col overflow-hidden rounded border-2 border-transparent bg-gray-100  dark:bg-gray-700 dark:text-white  last:mb-0 !border-accent"
                >
                  <div className="flex items-center justify-between border-b py-3 px-5 md:px-3 lg:px-5 ">
                    <span className="flex shrink-0 text-sm font-bold text-heading ltr:mr-4 rtl:ml-4 lg:text-base">
                      Order<span className="font-normal">#544</span>
                    </span>
                    <span
                      className="max-w-full truncate whitespace-nowrap rounded bg-[#EAB308] px-3 py-2 text-sm text-white"
                      title="Order Pending"
                    >
                      Order Pending
                    </span>
                  </div>
                  <div className="flex flex-col p-5 md:p-3 lg:px-4 lg:py-5">
                    <p className="mb-4 flex w-full items-center justify-between text-sm text-heading last:mb-0">
                      <span className="w-24 shrink-0 overflow-hidden">
                        Order Date
                      </span>
                      <span className="ltr:mr-auto rtl:ml-auto">:</span>
                      <span className="ltr:ml-1 rtl:mr-1">
                        December 1, 2022
                      </span>
                    </p>
                    <p className="mb-4 flex w-full items-center justify-between text-sm text-heading last:mb-0">
                      <span className="w-24 shrink-0 overflow-hidden">
                        Delivery Time
                      </span>
                      <span className="ltr:mr-auto rtl:ml-auto">:</span>
                      <span className="truncate ltr:ml-1 rtl:mr-1">
                        Express Delivery
                      </span>
                    </p>
                    <p className="mb-4 flex w-full items-center justify-between text-sm font-bold text-heading last:mb-0">
                      <span className="w-24 shrink-0 overflow-hidden">
                        Amount
                      </span>
                      <span className="ltr:mr-auto rtl:ml-auto">:</span>
                      <span className="ltr:ml-1 rtl:mr-1">$5.00</span>
                    </p>
                    <p className="mb-4 flex w-full items-center justify-between text-sm font-bold text-heading last:mb-0">
                      <span className="w-24 flex-shrink-0 overflow-hidden">
                        Total Price
                      </span>
                      <span className="ltr:mr-auto rtl:ml-auto">:</span>
                      <span className="ltr:ml-1 rtl:mr-1">$55.10</span>
                    </p>
                  </div>
                </div>
                <div
                  role="button"
                  className="mb-4 flex w-full shrink-0 cursor-pointer flex-col overflow-hidden rounded border-2 border-transparent bg-gray-100  dark:bg-gray-700 dark:text-white  last:mb-0"
                >
                  <div className="flex items-center justify-between border-b py-3 px-5 md:px-3 lg:px-5 ">
                    <span className="flex shrink-0 text-sm font-bold text-heading ltr:mr-4 rtl:ml-4 lg:text-base">
                      Order<span className="font-normal">#10</span>
                    </span>
                    <span
                      className="max-w-full truncate whitespace-nowrap rounded bg-green-600 px-3 py-2 text-sm text-white"
                      title="Order Completed"
                    >
                      Order Completed
                    </span>
                  </div>
                  <div className="flex flex-col p-5 md:p-3 lg:px-4 lg:py-5">
                    <p className="mb-4 flex w-full items-center justify-between text-sm text-heading last:mb-0">
                      <span className="w-24 shrink-0 overflow-hidden">
                        Order Date
                      </span>
                      <span className="ltr:mr-auto rtl:ml-auto">:</span>
                      <span className="ltr:ml-1 rtl:mr-1">January 2, 2023</span>
                    </p>
                    <p className="mb-4 flex w-full items-center justify-between text-sm text-heading last:mb-0">
                      <span className="w-24 shrink-0 overflow-hidden">
                        Delivery Time
                      </span>
                      <span className="ltr:mr-auto rtl:ml-auto">:</span>
                      <span className="truncate ltr:ml-1 rtl:mr-1">
                        Express Delivery
                      </span>
                    </p>
                    <p className="mb-4 flex w-full items-center justify-between text-sm font-bold text-heading last:mb-0">
                      <span className="w-24 shrink-0 overflow-hidden">
                        Amount
                      </span>
                      <span className="ltr:mr-auto rtl:ml-auto">:</span>
                      <span className="ltr:ml-1 rtl:mr-1">$935.00</span>
                    </p>
                    <p className="mb-4 flex w-full items-center justify-between text-sm font-bold text-heading last:mb-0">
                      <span className="w-24 flex-shrink-0 overflow-hidden">
                        Total Price
                      </span>
                      <span className="ltr:mr-auto rtl:ml-auto">:</span>
                      <span className="ltr:ml-1 rtl:mr-1">$1,003.70</span>
                    </p>
                  </div>
                </div>
                <div
                  role="button"
                  className="mb-4 flex w-full shrink-0 cursor-pointer flex-col overflow-hidden rounded border-2 border-transparent bg-gray-100  dark:bg-gray-700 dark:text-white  last:mb-0"
                >
                  <div className="flex items-center justify-between border-b py-3 px-5 md:px-3 lg:px-5 ">
                    <span className="flex shrink-0 text-sm font-bold text-heading ltr:mr-4 rtl:ml-4 lg:text-base">
                      Order<span className="font-normal">#8</span>
                    </span>
                    <span
                      className="max-w-full truncate whitespace-nowrap rounded bg-green-600 px-3 py-2 text-sm text-white"
                      title="Order Completed"
                    >
                      Order Completed
                    </span>
                  </div>
                  <div className="flex flex-col p-5 md:p-3 lg:px-4 lg:py-5">
                    <p className="mb-4 flex w-full items-center justify-between text-sm text-heading last:mb-0">
                      <span className="w-24 shrink-0 overflow-hidden">
                        Order Date
                      </span>
                      <span className="ltr:mr-auto rtl:ml-auto">:</span>
                      <span className="ltr:ml-1 rtl:mr-1">January 1, 2023</span>
                    </p>
                    <p className="mb-4 flex w-full items-center justify-between text-sm text-heading last:mb-0">
                      <span className="w-24 shrink-0 overflow-hidden">
                        Delivery Time
                      </span>
                      <span className="ltr:mr-auto rtl:ml-auto">:</span>
                      <span className="truncate ltr:ml-1 rtl:mr-1">
                        Express Delivery
                      </span>
                    </p>
                    <p className="mb-4 flex w-full items-center justify-between text-sm font-bold text-heading last:mb-0">
                      <span className="w-24 shrink-0 overflow-hidden">
                        Amount
                      </span>
                      <span className="ltr:mr-auto rtl:ml-auto">:</span>
                      <span className="ltr:ml-1 rtl:mr-1">$775.00</span>
                    </p>
                    <p className="mb-4 flex w-full items-center justify-between text-sm font-bold text-heading last:mb-0">
                      <span className="w-24 flex-shrink-0 overflow-hidden">
                        Total Price
                      </span>
                      <span className="ltr:mr-auto rtl:ml-auto">:</span>
                      <span className="ltr:ml-1 rtl:mr-1">$790.50</span>
                    </p>
                  </div>
                </div>
                <div
                  role="button"
                  className="mb-4 flex w-full shrink-0 cursor-pointer flex-col overflow-hidden rounded border-2 border-transparent bg-gray-100  dark:bg-gray-700 dark:text-white  last:mb-0"
                >
                  <div className="flex items-center justify-between border-b py-3 px-5 md:px-3 lg:px-5 ">
                    <span className="flex shrink-0 text-sm font-bold text-heading ltr:mr-4 rtl:ml-4 lg:text-base">
                      Order<span className="font-normal">#5</span>
                    </span>
                    <span
                      className="max-w-full truncate whitespace-nowrap rounded bg-green-600 px-3 py-2 text-sm text-white"
                      title="Order Completed"
                    >
                      Order Completed
                    </span>
                  </div>
                  <div className="flex flex-col p-5 md:p-3 lg:px-4 lg:py-5">
                    <p className="mb-4 flex w-full items-center justify-between text-sm text-heading last:mb-0">
                      <span className="w-24 shrink-0 overflow-hidden">
                        Order Date
                      </span>
                      <span className="ltr:mr-auto rtl:ml-auto">:</span>
                      <span className="ltr:ml-1 rtl:mr-1">January 1, 2023</span>
                    </p>
                    <p className="mb-4 flex w-full items-center justify-between text-sm text-heading last:mb-0">
                      <span className="w-24 shrink-0 overflow-hidden">
                        Delivery Time
                      </span>
                      <span className="ltr:mr-auto rtl:ml-auto">:</span>
                      <span className="truncate ltr:ml-1 rtl:mr-1">
                        Express Delivery
                      </span>
                    </p>
                    <p className="mb-4 flex w-full items-center justify-between text-sm font-bold text-heading last:mb-0">
                      <span className="w-24 shrink-0 overflow-hidden">
                        Amount
                      </span>
                      <span className="ltr:mr-auto rtl:ml-auto">:</span>
                      <span className="ltr:ml-1 rtl:mr-1">$1,035.00</span>
                    </p>
                    <p className="mb-4 flex w-full items-center justify-between text-sm font-bold text-heading last:mb-0">
                      <span className="w-24 flex-shrink-0 overflow-hidden">
                        Total Price
                      </span>
                      <span className="ltr:mr-auto rtl:ml-auto">:</span>
                      <span className="ltr:ml-1 rtl:mr-1">$1,055.70</span>
                    </p>
                  </div>
                </div>
                <div
                  role="button"
                  className="mb-4 flex w-full shrink-0 cursor-pointer flex-col overflow-hidden rounded border-2 border-transparent bg-gray-100  dark:bg-gray-700 dark:text-white  last:mb-0"
                >
                  <div className="flex items-center justify-between border-b py-3 px-5 md:px-3 lg:px-5 ">
                    <span className="flex shrink-0 text-sm font-bold text-heading ltr:mr-4 rtl:ml-4 lg:text-base">
                      Order<span className="font-normal">#3</span>
                    </span>
                    <span
                      className="max-w-full truncate whitespace-nowrap rounded bg-[#9CA3AF] px-3 py-2 text-sm text-white"
                      title="Order Cancelled"
                    >
                      Order Cancelled
                    </span>
                  </div>
                  <div className="flex flex-col p-5 md:p-3 lg:px-4 lg:py-5">
                    <p className="mb-4 flex w-full items-center justify-between text-sm text-heading last:mb-0">
                      <span className="w-24 shrink-0 overflow-hidden">
                        Order Date
                      </span>
                      <span className="ltr:mr-auto rtl:ml-auto">:</span>
                      <span className="ltr:ml-1 rtl:mr-1">January 1, 2023</span>
                    </p>
                    <p className="mb-4 flex w-full items-center justify-between text-sm text-heading last:mb-0">
                      <span className="w-24 shrink-0 overflow-hidden">
                        Delivery Time
                      </span>
                      <span className="ltr:mr-auto rtl:ml-auto">:</span>
                      <span className="truncate ltr:ml-1 rtl:mr-1">
                        Express Delivery
                      </span>
                    </p>
                    <p className="mb-4 flex w-full items-center justify-between text-sm font-bold text-heading last:mb-0">
                      <span className="w-24 shrink-0 overflow-hidden">
                        Amount
                      </span>
                      <span className="ltr:mr-auto rtl:ml-auto">:</span>
                      <span className="ltr:ml-1 rtl:mr-1">$100.00</span>
                    </p>
                    <p className="mb-4 flex w-full items-center justify-between text-sm font-bold text-heading last:mb-0">
                      <span className="w-24 flex-shrink-0 overflow-hidden">
                        Total Price
                      </span>
                      <span className="ltr:mr-auto rtl:ml-auto">:</span>
                      <span className="ltr:ml-1 rtl:mr-1">$0.00</span>
                    </p>
                  </div>
                </div>
                <div
                  role="button"
                  className="mb-4 flex w-full shrink-0 cursor-pointer flex-col overflow-hidden rounded border-2 border-transparent bg-gray-100  dark:bg-gray-700 dark:text-white  last:mb-0"
                >
                  <div className="flex items-center justify-between border-b py-3 px-5 md:px-3 lg:px-5 ">
                    <span className="flex shrink-0 text-sm font-bold text-heading ltr:mr-4 rtl:ml-4 lg:text-base">
                      Order<span className="font-normal">#1</span>
                    </span>
                    <span
                      className="max-w-full truncate whitespace-nowrap rounded bg-[#9CA3AF] px-3 py-2 text-sm text-white"
                      title="Order Cancelled"
                    >
                      Order Cancelled
                    </span>
                  </div>
                  <div className="flex flex-col p-5 md:p-3 lg:px-4 lg:py-5">
                    <p className="mb-4 flex w-full items-center justify-between text-sm text-heading last:mb-0">
                      <span className="w-24 shrink-0 overflow-hidden">
                        Order Date
                      </span>
                      <span className="ltr:mr-auto rtl:ml-auto">:</span>
                      <span className="ltr:ml-1 rtl:mr-1">
                        December 26, 2022
                      </span>
                    </p>
                    <p className="mb-4 flex w-full items-center justify-between text-sm text-heading last:mb-0">
                      <span className="w-24 shrink-0 overflow-hidden">
                        Delivery Time
                      </span>
                      <span className="ltr:mr-auto rtl:ml-auto">:</span>
                      <span className="truncate ltr:ml-1 rtl:mr-1">
                        Express Delivery
                      </span>
                    </p>
                    <p className="mb-4 flex w-full items-center justify-between text-sm font-bold text-heading last:mb-0">
                      <span className="w-24 shrink-0 overflow-hidden">
                        Amount
                      </span>
                      <span className="ltr:mr-auto rtl:ml-auto">:</span>
                      <span className="ltr:ml-1 rtl:mr-1">$5.50</span>
                    </p>
                    <p className="mb-4 flex w-full items-center justify-between text-sm font-bold text-heading last:mb-0">
                      <span className="w-24 flex-shrink-0 overflow-hidden">
                        Total Price
                      </span>
                      <span className="ltr:mr-auto rtl:ml-auto">:</span>
                      <span className="ltr:ml-1 rtl:mr-1">$0.00</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex w-full flex-col lg:w-2/3 ">
          <div className="bg-white dark:bg-gray-700 border dark:border-gray-400">
            <div className="flex flex-col items-center p-5 md:flex-row md:justify-between">
              <h2 className="mb-2 dark:text-white flex text-sm font-semibold text-heading md:text-lg">
                Order Details <span className="px-2">-</span> 334983046149
              </h2>
              <div className="flex items-center">
                <button className="flex items-center text-sm font-semibold text-gray-500 dark:text-gray-200 transition-colors hover:text-accent disabled:cursor-not-allowed disabled:text-gray-400 disabled:hover:text-gray-400 ltr:mr-4 rtl:ml-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 106.059 106.059"
                    fill="currentColor"
                    width={18}
                    className="ltr:mr-2 rtl:ml-2"
                  >
                    <path d="M90.546 15.518c-20.688-20.69-54.347-20.69-75.031-.005-20.688 20.685-20.686 54.345.002 75.034 20.682 20.684 54.341 20.684 75.027-.004 20.686-20.685 20.685-54.343.002-75.025zm-5.789 69.24c-17.494 17.494-45.96 17.496-63.455.002-17.498-17.497-17.496-45.966 0-63.46 17.494-17.493 45.959-17.495 63.457.002 17.494 17.494 17.492 45.963-.002 63.456zm-7.74-10.757a2.998 2.998 0 0 1-1.562 3.943 2.998 2.998 0 0 1-3.944-1.562c-2.893-6.689-9.73-11.012-17.421-11.012-7.868 0-14.747 4.319-17.522 11.004a3.002 3.002 0 0 1-3.921 1.621 3 3 0 0 1-1.62-3.921c3.71-8.932 12.764-14.703 23.063-14.703 10.084 0 19.084 5.742 22.927 14.63zM33.24 38.671a6.201 6.201 0 1 1 12.4 0 6.201 6.201 0 0 1-12.4 0zm28.117 0a6.201 6.201 0 0 1 12.403 0c0 3.426-2.776 6.202-6.2 6.202s-6.203-2.776-6.203-6.202z" />
                  </svg>
                  Ask for a refund
                </button>
                <a
                  className="flex items-center text-sm font-semibold text-green-600 dark:text-green-500 no-underline transition duration-200 hover:text-accent-hover focus:text-accent-hover"
                  href="#"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    width={20}
                    className="ltr:mr-2 rtl:ml-2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                  Details
                </a>
              </div>
            </div>
            <div className="relative mx-5 mb-6 overflow-hidden rounded">
              <div className="bg-[#F7F8FA] dark:bg-gray-500 px-7 py-4">
                <div className="mb-0 flex flex-col flex-wrap items-center justify-between gap-x-8 text-base font-bold text-heading sm:flex-row lg:flex-nowrap">
                  <div className="order-2 flex w-full gap-6 xs:flex-nowrap sm:order-1 max-w-full basis-full justify-between">
                    <div className="flex flex-wrap items-center">
                      <span className="dark:text-white mb-2 block text-xs xs:text-base lg:mb-0 lg:inline-block lg:ltr:mr-4 lg:rtl:ml-4">
                        Order Status :
                      </span>
                      <div className="w-full lg:w-auto">
                        <span className="px-3 py-2 rounded-full text-center text-white text-sm  bg-[#F59E0B] min-h-[2rem] items-center justify-center !leading-none xs:text-sm inline-flex">
                          Order Processing
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center">
                      <span className="dark:text-white mb-2 block text-xs xs:text-base lg:mb-0 lg:inline-block lg:ltr:mr-4 lg:rtl:ml-4">
                        Payment Status :
                      </span>
                      <div className="w-full lg:w-auto">
                        <span className="px-3 py-2 rounded-full text-sm text-center text-white bg-green-600 min-h-[2rem] items-center justify-center !leading-none xs:text-sm inline-flex">
                          Cash On Delivery
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-col border-b sm:flex-row">
              <div className="flex w-full flex-col border-b px-5 py-4 sm:border-b-0 ltr:sm:border-r rtl:sm:border-l md:w-3/5">
                <div className="mb-4">
                  <span className="dark:text-white mb-2 block text-sm font-bold text-heading">
                    Shipping Address
                  </span>
                  <span className="dark:text-gray-300 text-sm text-gray-500">
                    mermoz, Dakar, Dakar, 38169, Sénégal
                  </span>
                </div>
                <div>
                  <span className="dark:text-white mb-2 block text-sm font-bold text-heading">
                    Billing Address
                  </span>
                  <span className="text-sm text-gray-500 dark:text-gray-300">
                    Voluptatum qui sunt, Quod et consequatur, Ipsum qui minus
                    sint, 51397, Aut fugiat iusto do
                  </span>
                </div>
              </div>
              <div className="flex w-full flex-col px-5 py-4 md:w-2/5">
                <div className="mb-3 flex justify-between">
                  <span className="text-sm text-gray-500 dark:text-gray-300">
                    Sub Total
                  </span>
                  <span className="text-sm text-heading dark:text-gray-300">
                    $5.00
                  </span>
                </div>
                <div className="mb-3 flex justify-between">
                  <span className="text-sm text-gray-500 dark:text-gray-300">
                    Discount
                  </span>
                  <span className="text-sm text-heading dark:text-gray-300">
                    $0.00
                  </span>
                </div>
                <div className="mb-3 flex justify-between">
                  <span className="text-sm text-gray-500 dark:text-gray-300">
                    Delivery Fee
                  </span>
                  <span className="text-sm text-heading dark:text-gray-300">
                    $50.00
                  </span>
                </div>
                <div className="mb-3 flex justify-between">
                  <span className="text-sm text-gray-500 dark:text-gray-300">
                    Tax
                  </span>
                  <span className="text-sm text-heading dark:text-gray-300">
                    $0.10
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-bold text-heading dark:text-white">
                    Total
                  </span>
                  <span className="text-sm font-bold text-heading dark:text-white">
                    $55.10
                  </span>
                </div>
              </div>
            </div>
            <div>
              <div className="flex w-full items-center justify-center px-6">
                <div className="h-full w-full dark:text-white">
                  <div className="flex flex-col md:flex-row py-7">
                    {/*  */}
                    <div className="flex md:flex-col w-full md:w-1/5 relative pb-6 ">
                      <div className="flex justify-center items-center md:mb-4">
                        <div className=" bg-green-600 absolute top-1/2 md:top-auto md:left-1/2 h-1/4 md:h-1 w-1 md:w-1/2" />
                        <div className="p-2 z-10 bg-green-600 rounded-full">
                          <CheckIcon
                            className="h-4 w-4 text-white"
                            strokeWidth={4}
                          />
                        </div>
                      </div>
                      <div className="text-base font-semibold capitalize text-body-dark ltr:text-left rtl:text-right md:px-2 md:!text-center ml-2 md:ml-0">
                        Order Pending
                      </div>
                    </div>
                    {/*  */}
                    <div className="flex md:flex-col w-full md:w-1/5 relative pb-6 ">
                      <div className="flex justify-center items-center md:mb-4">
                        <div className=" bg-green-600 absolute -top-1/4 md:top-auto md:left-0 h-full md:h-1 w-1 md:w-full" />
                        <div className="p-2 z-10 bg-green-600 rounded-full">
                          <CheckIcon
                            className="h-4 w-4 text-white"
                            strokeWidth={4}
                          />
                        </div>
                      </div>
                      <div className="text-base font-semibold capitalize text-body-dark ltr:text-left rtl:text-right md:px-2 md:!text-center ml-2 md:ml-0">
                        Order Processing
                      </div>
                    </div>
                    {/*  */}
                    <div className="flex md:flex-col w-full md:w-1/5 relative pb-6 ">
                      <div className="flex justify-center items-center md:mb-4">
                        <div className=" bg-gray-200 absolute -top-1/4 md:top-auto md:left-0 h-full md:h-1 w-1 md:w-full" />
                        <div className="z-10 h-8 w-8 border-dashed bg-white  dark:bg-gray-700 text-green-600 border border-green-600 rounded-full justify-center items-center flex">
                          <span className="h-4 w-4 text-green-600 justify-center items-center flex">
                            3
                          </span>
                        </div>
                      </div>
                      <div className="text-base font-semibold capitalize text-body-dark ltr:text-left rtl:text-right md:px-2 md:!text-center ml-2 md:ml-0">
                        Order At Local Facility
                      </div>
                    </div>
                    <div className="flex md:flex-col w-full md:w-1/5 relative pb-6 ">
                      <div className="flex justify-center items-center md:mb-4">
                        <div className=" bg-gray-200 absolute -top-1/4 md:top-auto md:left-0 h-full md:h-1 w-1 md:w-full" />
                        <div className="z-10 h-8 w-8 border-dashed bg-white  dark:bg-gray-700 text-green-600 border border-green-600 rounded-full justify-center items-center flex">
                          <span className="h-4 w-4 text-green-600 justify-center items-center flex">
                            4
                          </span>
                        </div>
                      </div>
                      <div className="text-base font-semibold capitalize text-body-dark ltr:text-left rtl:text-right md:px-2 md:!text-center ml-2 md:ml-0">
                        Order Out For Delivery
                      </div>
                    </div>
                    <div className="flex md:flex-col w-full md:w-1/5 relative pb-6 ">
                      <div className="flex justify-center items-center md:mb-4">
                        <div className=" bg-gray-200 absolute -top-1/4 md:top-auto md:left-0 h-1/2 md:h-1 w-1 md:w-1/2" />
                        <div className="z-10 h-8 w-8 border-dashed bg-white  dark:bg-gray-700 text-green-600 border border-green-600 rounded-full justify-center items-center flex">
                          <span className="h-4 w-4 text-green-600 justify-center items-center flex">
                            5
                          </span>
                        </div>
                      </div>
                      <div className="text-base font-semibold capitalize text-body-dark ltr:text-left rtl:text-right md:px-2 md:!text-center ml-2 md:ml-0">
                        Order Completed
                      </div>
                    </div>

                    {/*  */}
                  </div>
                </div>
              </div>
              <div className="border-t border-gray-400">
                {/*  */}
                <div key={products[0].id} className="px-4">
                  <li className="flex py-6 sm:py-6 ">
                    <div className="flex-shrink-0">
                      <img
                        src={products[0].imageSrc}
                        alt={products[0].name}
                        className="h-24 w-24 rounded-md object-contain object-center sm:h-38 sm:w-38"
                      />
                    </div>

                    <div className="ml-4 flex flex-1 flex-col justify-between sm:ml-6">
                      <div className="relative pr-9 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:pr-0">
                        <div>
                          <div className="flex justify-between">
                            <h3 className="text-sm">
                              <a
                                href={products[0].href}
                                className="font-medium text-lg text-gray-700 dark:text-white"
                              >
                                {products[0].name}
                              </a>
                            </h3>
                          </div>
                          <div className="mt-1 flex text-sm">
                            <p className="text-gray-500 dark:text-gray-200">
                              {products[0].color}
                            </p>
                            {products[0].size ? (
                              <p className="ml-4 border-l border-gray-200 pl-4 text-gray-500 dark:text-gray-200">
                                {products[0].size}
                              </p>
                            ) : null}
                          </div>
                          <div className="mt-1 flex items-end">
                            <p className="text-xs line-through font-medium text-gray-500 dark:text-gray-100">
                              {products[0].originalPrice}
                            </p>
                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                              &nbsp;&nbsp;{products[0].price}
                            </p>
                            &nbsp;&nbsp;
                            <p className="text-sm font-medium text-green-500">
                              {products[0].discount}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                </div>
                {/*  */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const products = [
  {
    id: 1,
    name: "APPLE iPhone 11 (White, 128 GB)",
    href: "#",
    price: "₹47,199",
    originalPrice: "₹48,900",
    discount: "5% Off",
    color: "White",
    size: "6.1 inch",
    imageSrc:
      "https://dev-ui-image-assets.s3.ap-south-1.amazonaws.com/order-confirmed/iphone-11-256-u-mwm82hn-a-apple-0-original-imafkg25mhaztxns.jpeg?q=90",
  },
];
