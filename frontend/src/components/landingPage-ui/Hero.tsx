import React from "react";
import { useNavigate } from "react-router-dom";

const Hero = () => {
  const navigate = useNavigate();
  return (
    <header className="bg-white dark:bg-gray-900 pt-20 lg:pt-[40px]">
      <div
        className="w-full bg-center bg-cover h-[52rem] h-screen"
        style={{
          backgroundImage:
            "url(https://images.unsplash.com/photo-1508394522741-82ac9c15ba69?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=748&q=80)",
        }}
      >
        <div className="flex items-center justify-center w-full h-full bg-gray-900/40">
          <div className="flex items-center justify-center w-full h-full bg-gray-900 bg-opacity-40">
            <div className="text-center">
              <h1 className="text-3xl font-semibold text-white lg:text-4xl">
                Revolutionize Your Business with swiftmarket
              </h1>
              <p className="mt-3 text-gray-100">
                Trade in bulk for free on our secure, blockchain-based platform.{" "}
                <br />
                Use blockchain or card to pay and track orders with our
                intuitive dashboard.
              </p>
              <button
                onClick={() => navigate("/shop")}
                className="inline-block w-full px-5 py-2 mt-4 text-sm font-medium text-white capitalize transition-colors duration-300 bg-blue-600 rounded-md lg:w-auto hover:bg-blue-500 focus:outline-none focus:bg-blue-500"
              >
                Shop Now
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* <div className="container px-6 py-16 mx-auto">
        <div className="items-center lg:flex">
          <div className="w-full lg:w-1/2">
            <div className="lg:max-w-lg">
              <h1 className="text-3xl font-semibold text-gray-800 dark:text-white lg:text-4xl">
                Revolutionize Your Business <br /> with{" "}
                <span className="text-blue-500">swiftmarket</span>
              </h1>

              <p className="mt-3 text-gray-600 dark:text-gray-400">
                Trade in bulk for free on our secure, blockchain-based platform.
                Use blockchain or PayPal to pay and track orders with our
                intuitive dashboard.
              </p>

              <button
                className="w-full px-5 py-2 mt-6 text-sm tracking-wider text-white uppercase transition-colors duration-300 transform bg-blue-600 rounded-lg lg:w-auto hover:bg-blue-500 focus:outline-none focus:bg-blue-500"
                onClick={() => navigate("/shop")}
              >
                Shop Now
              </button>
            </div>
          </div>

          <div className="flex items-center justify-center w-full mt-6 lg:mt-0 lg:w-1/2">
            <img
              className="w-full h-full lg:max-w-3xl"
              src="https://merakiui.com/images/components/Catalogue-pana.svg"
              alt="Catalogue-pana.svg"
            />
          </div>
        </div>
      </div> */}
    </header>
  );
};

export default Hero;
