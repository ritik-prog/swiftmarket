import React from "react";
import businessSvg from "../../assets/business.svg";
const Hero = () => {
  return (
    <section className="dark:bg-gray-900 dark:text-gray-100">
      <div className="container flex flex-row justify-center p-24 mx-auto sm:py-12 lg:py-24 lg:flex-row lg:justify-between">
        <div className="flex flex-col justify-center p-6 text-center rounded-sm lg:max-w-md xl:max-w-lg lg:text-left">
          <h1 className="text-5xl font-bold leading-none sm:text-6xl">
            Join Our
            <span className="dark:text-violet-400"> Marketplace</span> <br />
            as seller
          </h1>
          <p className="mt-6 mb-8 text-lg sm:mb-12">
            Start Selling Your Products in Bulk Today and Reach a Wider Audience
          </p>
        </div>
        <div className="flex items-center justify-center w-full mt-6 lg:mt-0 lg:w-1/2">
          <img
            src={businessSvg}
            alt=""
            className="object-contain h-72 sm:h-80 lg:h-96 xl:h-112 2xl:h-128"
          />
        </div>
      </div>
    </section>
  );
};

export default Hero;
