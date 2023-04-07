import React from "react";
import ShoppingBagIcon from "@heroicons/react/24/outline/ShoppingBagIcon";
import HeartIcon from "@heroicons/react/24/outline/HeartIcon";
import TagIcon from "@heroicons/react/24/outline/TagIcon";
import ShareIcon from "@heroicons/react/24/outline/ShareIcon";
import PlusIcon from "@heroicons/react/24/outline/PlusIcon";
import MinusIcon from "@heroicons/react/24/outline/MinusIcon";
import ChevronLeftIcon from "@heroicons/react/24/outline/ChevronLeftIcon";
import ChevronRightIcon from "@heroicons/react/24/outline/ChevronRightIcon";

const Overview = () => {
    return (
        <div
            dir="ltr"
            className="dark:bg-gray-900 md:w-[600px] lg:w-[940px] xl:w-[1180px] 2xl:w-[1360px] mx-auto p-1 lg:p-0 xl:p-3 bg-brand-light rounded-md"
        >
            <div className="overflow-hidden">
                <div className="px-4 pt-4 md:px-6 lg:p-8 2xl:p-10 mb-9 lg:mb-2 md:pt-7 2xl:pt-10">
                    <div className="items-start justify-between lg:flex">
                        <div className="items-center justify-center mb-6 overflow-hidden xl:flex md:mb-8 lg:mb-0">
                            <div className="w-full xl:flex xl:flex-row-reverse">
                                <div className="shrink-0 w-full xl:ltr:ml-5 xl:rtl:mr-5 mb-2.5 md:mb-3 border border-border-base overflow-hidden rounded-md relative xl:w-[480px] 2xl:w-[650px]">
                                    <div className="flex items-center justify-center">
                                        <img
                                            alt="Product gallery 1"
                                            src="https://dev-ui-image-assets.s3.ap-south-1.amazonaws.com/products/p-14-1.png"
                                            width={650}
                                            height={590}
                                            decoding="async"
                                            data-nimg={1}
                                            className="rounded-lg object-cover"
                                        />
                                    </div>
                                    <div className="flex items-center justify-between w-full absolute top-2/4 z-10 px-2.5">
                                        <div className="flex items-center justify-center text-base transition duration-300 transform -translate-y-1/2 rounded-full cursor-pointer w-7 h-7 md:w-8 md:h-8 lg:w-9 lg:h-9 xl:w-10 xl:h-10 lg:text-lg xl:text-xl bg-brand-light hover:bg-brand hover:text-brand-light focus:outline-none shadow-navigation swiper-button-disabled">
                                            <ChevronLeftIcon className="h-5 w-5" />
                                        </div>
                                        <div className="flex items-center justify-center text-base transition duration-300 transform -translate-y-1/2 rounded-full cursor-pointer w-7 h-7 md:w-8 md:h-8 lg:w-9 lg:h-9 xl:w-10 xl:h-10 lg:text-lg xl:text-xl bg-brand-light hover:bg-brand hover:text-brand-light focus:outline-none shadow-navigation">
                                            <ChevronRightIcon className="h-5 w-5" />
                                        </div>
                                    </div>
                                </div>
                                <div className="flex xl:flex-col gap-2">
                                    {[
                                        "https://dev-ui-image-assets.s3.ap-south-1.amazonaws.com/products/p-14-1.png",
                                        "https://dev-ui-image-assets.s3.ap-south-1.amazonaws.com/products/p-14-2.png",
                                        "https://dev-ui-image-assets.s3.ap-south-1.amazonaws.com/products/p-14-3.png",
                                    ].map((image, index) => (
                                        <div
                                            key={image}
                                            className="flex items-center justify-center overflow-hidden transition border rounded cursor-pointer border-border-base hover:opacity-75 "
                                        >
                                            <img
                                                alt={`Product ${index}`}
                                                src={image}
                                                decoding="async"
                                                loading="lazy"
                                                className="object-cover "
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
                                        Great Value Tortilla Chips, Cantina Style
                                    </h2>
                                </div>
                                <div className="flex items-center mt-5">
                                    <div className="text-brand-dark font-bold text-base md:text-xl xl:text-[22px]">
                                        $5.00 - $15.00
                                    </div>
                                </div>
                            </div>
                            <div className="mb-2 pt-0.5">
                                <h4 className="mb-3 font-normal capitalize text-15px text-brand-dark text-opacity-70">
                                    available in:
                                </h4>
                                <ul className="flex flex-wrap ltr:-mr-2 rtl:-ml-2">
                                    <li className="cursor-pointer rounded border h-9 md:h-10 p-1 mb-2 md:mb-3 ltr:mr-2 rtl:ml-2 flex justify-center items-center font-medium text-sm md:text-15px text-brand-dark transition duration-200 ease-in-out hover:hover:border-brand px-3">
                                        small
                                    </li>
                                    <li className="cursor-pointer rounded border h-9 md:h-10 p-1 mb-2 md:mb-3 ltr:mr-2 rtl:ml-2 flex justify-center items-center font-medium text-sm md:text-15px text-brand-dark transition duration-200 ease-in-out hover:hover:border-brand px-3">
                                        medium
                                    </li>
                                    <li className="cursor-pointer rounded border h-9 md:h-10 p-1 mb-2 md:mb-3 ltr:mr-2 rtl:ml-2 flex justify-center items-center font-medium text-sm md:text-15px text-brand-dark transition duration-200 ease-in-out hover:hover:border-brand px-3">
                                        large
                                    </li>
                                </ul>
                            </div>
                            <div className="pb-2" />
                            <div className="pt-1.5 lg:pt-3 xl:pt-4 space-y-2.5 md:space-y-3.5">
                                <div className="flex dark:text-gray-900 items-center justify-between rounded overflow-hidden shrink-0 p-1 h-11 md:h-14 bg-[#f3f5f9]">
                                    <button className="flex items-center justify-center shrink-0  transition-all ease-in-out duration-300 focus:outline-none focus-visible:outline-none !w-10 !h-10 rounded-full transform scale-80 lg:scale-100 text-brand-dark hover:bg-fill-four ltr:ml-auto rtl:mr-auto">
                                        <span className="sr-only">button-minus</span>
                                        <MinusIcon className="transition-all h-6 w-6" />
                                    </button>
                                    <span className="font-semibold text-brand-dark flex items-center justify-center h-full transition-colors duration-250 ease-in-out cursor-default shrink-0 text-base md:text-[17px] w-12 md:w-20 xl:w-28 ">
                                        1
                                    </span>
                                    <button className="group flex items-center  shrink-0 transition-all ease-in-out duration-300 focus:outline-none focus-visible:outline-none !w-10 !h-10 rounded-full scale-80 lg:scale-100 text-heading hover:bg-fill-four ltr:mr-auto rtl:ml-auto !pr-0 justify-center">
                                        <span className="sr-only">button-plus</span>
                                        <PlusIcon className="transition-all h-6 w-6" />
                                    </button>
                                </div>
                                <button
                                    data-variant="primary"
                                    className="group text-[13px] md:text-sm lg:text-15px leading-4 inline-flex items-center transition ease-in-out duration-300 font-body font-semibold text-center justify-center rounded placeholder-white focus-visible:outline-none focus:outline-none h-12 md:h-14 bg-brand text-brand-light tracking-widest px-5 md:px-6 lg:px-8 py-4 md:py-3.5 lg:py-4 hover:text-white hover:bg-opacity-90   w-full
                  bg-green-600  text-white hover:bg-green-500"
                                    disabled
                                >
                                    <ShoppingBagIcon className="ltr:mr-3 rtl:ml-3 h-5 w-5" />
                                    Add to Cart
                                </button>
                                <div className="grid grid-cols-2 gap-2.5">
                                    <button
                                        data-variant="border"
                                        className="group text-[13px] md:text-sm lg:text-15px leading-4 inline-flex items-center cursor-pointer transition ease-in-out duration-300 font-body font-semibold text-center justify-center  rounded placeholder-white focus-visible:outline-none focus:outline-none h-12 md:h-14 bg-brand-light text-brand-dark border border-border-four tracking-widest px-5 md:px-6 lg:px-8 py-4 md:py-3.5 lg:py-4 group hover:false"
                                    >
                                        <HeartIcon className="text-2xl md:text-[26px] ltr:mr-2 rtl:ml-2 transition-all h-5 w-5" />
                                        Wishlist
                                    </button>
                                    <div className="relative">
                                        <button
                                            data-variant="border"
                                            className="text-[13px] md:text-sm lg:text-15px leading-4 inline-flex items-center cursor-pointer transition ease-in-out duration-300 font-body font-semibold text-center justify-center  rounded placeholder-white focus-visible:outline-none focus:outline-none h-12 md:h-14 bg-brand-light text-brand-dark border border-border-four tracking-widest px-5 md:px-6 lg:px-8 py-4 md:py-3.5 lg:py-4 w-full hover:false"
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
                                {["Fast Food", "Organic Potato", "Flavoured", "Dry Food"].map(
                                    (tag) => (
                                        <li className="inline-block p-[3px]" key={tag}>
                                            <div
                                                className="font-medium text-13px md:text-sm rounded hover:bg-fill-four block border border-sink-base px-2 py-1 transition"
                                                role="button"
                                            >
                                                {tag}
                                            </div>
                                        </li>
                                    )
                                )}
                            </ul>
                            <div className="pt-6 xl:pt-8">
                                <h3 className="text-15px sm:text-base font-semibold mb-3 lg:mb-3.5">
                                    Product Details:
                                </h3>
                                <p className=" text-sm leading-7 lg:leading-[1.85em]">
                                    A chip (often just chip, or crisp in British and Irish
                                    English) may be a thin slice of potato that has been either
                                    deep fried or baked until crunchy. theyre commonly served as a
                                    snack, side dish, or appetizer. the...
                                    <span role="button" className="ltr:ml-0.5 rtl:mr-0.5">
                                        Read More
                                    </span>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Overview