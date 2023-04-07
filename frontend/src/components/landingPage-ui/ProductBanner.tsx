import React, { useState } from "react";

const ProductBanner = () => {
  const [showCards, setShowCards] = useState("branding");
  const activeClasses = "bg-blue-600 text-white";
  const inactiveClasses =
    "text-body-color hover:bg-blue-500 hover:text-white dark:text-white";

  return (
    <section className="pt-20 lg:pt-[120px] bg-white dark:bg-gray-900">
      <div className="container mx-auto" id="product">
        <div className="-mx-4 flex flex-wrap">
          <div className="w-full px-4 dark:text-white">
            <div className="mx-auto mb-[60px] max-w-[510px] text-center">
              <span className="mb-2 block text-lg font-semibold text-primary">
                Our Portfolio
              </span>
              <h2 className="mb-4 text-3xl font-bold text-dark sm:text-4xl md:text-[40px]">
                Our Recent Projects
              </h2>
              <p className="text-base text-body-color">
                There are many variations of passages of Lorem Ipsum available
                but the majority have suffered alteration in some form.
              </p>
            </div>
          </div>
        </div>
        <div className="-mx-4 flex flex-wrap justify-center">
          <div className="w-full px-4">
            <ul className="mb-12 flex flex-wrap justify-center space-x-1">
              {/* <li className="mb-1">
                <button
                  onClick={() => setShowCards("all")}
                  className={`inline-block rounded-lg py-2 px-5 text-center text-base font-semibold transition md:py-3 lg:px-8 ${
                    showCards === "all" ? activeClasses : inactiveClasses
                  }`}
                >
                  All Projects
                </button>
              </li> */}
              <li className="mb-1">
                <button
                  onClick={() => setShowCards("branding")}
                  className={`inline-block rounded-lg py-2 px-5 text-center text-base font-semibold transition md:py-3 lg:px-8 ${
                    showCards === "branding" ? activeClasses : inactiveClasses
                  }`}
                >
                  Branding
                </button>
              </li>
              <li className="mb-1">
                <button
                  onClick={() => setShowCards("design")}
                  className={`inline-block rounded-lg py-2 px-5 text-center text-base font-semibold transition md:py-3 lg:px-8 ${
                    showCards === "design" ? activeClasses : inactiveClasses
                  }`}
                >
                  Design
                </button>
              </li>
              <li className="mb-1">
                <button
                  onClick={() => setShowCards("marketing")}
                  className={`inline-block rounded-lg py-2 px-5 text-center text-base font-semibold transition md:py-3 lg:px-8 ${
                    showCards === "marketing" ? activeClasses : inactiveClasses
                  }`}
                >
                  Marketing
                </button>
              </li>
              <li className="mb-1">
                <button
                  onClick={() => setShowCards("development")}
                  className={`inline-block rounded-lg py-2 px-5 text-center text-base font-semibold transition md:py-3 lg:px-8 ${
                    showCards === "development"
                      ? activeClasses
                      : inactiveClasses
                  }`}
                >
                  Development
                </button>
              </li>
            </ul>
          </div>
        </div>
        <div className="-mx-4 flex flex-wrap">
          <div
            className={`w-full px-4 md:w-1/2 xl:w-1/3 ${
              showCards === "all" || showCards === "branding"
                ? "block"
                : "hidden"
            }`}
          >
            <div className="relative mb-12">
              <div className="overflow-hidden rounded-lg">
                <img
                  src="https://www.musafir.com/SFImage/Images/img-theme-park-015.jpg"
                  alt="portfolio"
                  className="w-full"
                />
              </div>
              <div className="relative z-10 mx-7 -mt-20 rounded-lg bg-white py-9 px-3 text-center shadow-lg">
                <span className="mb-2 block text-sm font-semibold text-primary">
                  Branding
                </span>
                <h3 className="mb-4 text-xl font-bold text-dark">
                  Branding Design
                </h3>
                <p className="text-body-color mb-2 text-md font-medium">
                  Price: $50
                </p>
                <a
                  href="javascript:void(0)"
                  className="inline-block rounded-md border py-3 px-7 text-sm font-semibold text-body-color transition hover:border-blue-500 hover:bg-blue-500 hover:text-white"
                >
                  View Details
                </a>
              </div>
            </div>
          </div>

          <div
            className={`w-full px-4 md:w-1/2 xl:w-1/3 ${
              showCards === "all" || showCards === "branding"
                ? "block"
                : "hidden"
            }`}
          >
            <div className="relative mb-12">
              <div className="overflow-hidden rounded-lg">
                <img
                  src="https://www.musafir.com/SFImage/Images/img-theme-park-015.jpg"
                  alt="portfolio"
                  className="w-full"
                />
              </div>
              <div className="relative z-10 mx-7 -mt-20 rounded-lg bg-white py-9 px-3 text-center shadow-lg">
                <span className="mb-2 block text-sm font-semibold text-primary">
                  Branding
                </span>
                <h3 className="mb-4 text-xl font-bold text-dark">
                  Creative Agency
                </h3>
                <p className="text-body-color mb-2 text-md font-medium">
                  Price: $50
                </p>
                <a
                  href="javascript:void(0)"
                  className="inline-block rounded-md border py-3 px-7 text-sm font-semibold text-body-color transition hover:border-blue-500 hover:bg-blue-500 hover:text-white"
                >
                  View Details
                </a>
              </div>
            </div>
          </div>
          <div
            className={`w-full px-4 md:w-1/2 xl:w-1/3 ${
              showCards === "all" || showCards === "design" ? "block" : "hidden"
            }`}
          >
            <div className="relative mb-12">
              <div className="overflow-hidden rounded-lg">
                <img
                  src="https://www.musafir.com/SFImage/Images/img-theme-park-015.jpg"
                  alt="portfolio"
                  className="w-full"
                />
              </div>
              <div className="relative z-10 mx-7 -mt-20 rounded-lg bg-white py-9 px-3 text-center shadow-lg">
                <span className="mb-2 block text-sm font-semibold text-primary">
                  Design
                </span>
                <h3 className="mb-4 text-xl font-bold text-dark">
                  Business Card Design
                </h3>
                <p className="text-body-color mb-2 text-md font-medium">
                  Price: $50
                </p>
                <a
                  href="javascript:void(0)"
                  className="inline-block rounded-md border py-3 px-7 text-sm font-semibold text-body-color transition hover:border-blue-500 hover:bg-blue-500 hover:text-white"
                >
                  View Details
                </a>
              </div>
            </div>
          </div>
          <div
            className={`w-full px-4 md:w-1/2 xl:w-1/3 ${
              showCards === "all" || showCards === "marketing"
                ? "block"
                : "hidden"
            }`}
          >
            <div className="relative mb-12">
              <div className="overflow-hidden rounded-lg">
                <img
                  src="https://www.musafir.com/SFImage/Images/img-theme-park-015.jpg"
                  alt="portfolio"
                  className="w-full"
                />
              </div>
              <div className="relative z-10 mx-7 -mt-20 rounded-lg bg-white py-9 px-3 text-center shadow-lg">
                <span className="mb-2 block text-sm font-semibold text-primary">
                  Marketing
                </span>
                <h3 className="mb-4 text-xl font-bold text-dark">
                  Best Marketing tips
                </h3>
                <p className="text-body-color mb-2 text-md font-medium">
                  Price: $50
                </p>
                <a
                  href="javascript:void(0)"
                  className="inline-block rounded-md border py-3 px-7 text-sm font-semibold text-body-color transition hover:border-blue-500 hover:bg-blue-500 hover:text-white"
                >
                  View Details
                </a>
              </div>
            </div>
          </div>
          <div
            className={`w-full px-4 md:w-1/2 xl:w-1/3 ${
              showCards === "all" || showCards === "development"
                ? "block"
                : "hidden"
            }`}
          >
            <div className="relative mb-12">
              <div className="overflow-hidden rounded-lg">
                <img
                  src="https://www.musafir.com/SFImage/Images/img-theme-park-015.jpg"
                  alt="portfolio"
                  className="w-full"
                />
              </div>
              <div className="relative z-10 mx-7 -mt-20 rounded-lg bg-white py-9 px-3 text-center shadow-lg">
                <span className="mb-2 block text-sm font-semibold text-primary">
                  Development
                </span>
                <h3 className="mb-4 text-xl font-bold text-dark">
                  Web Design Trend
                </h3>
                <p className="text-body-color mb-2 text-md font-medium">
                  Price: $50
                </p>
                <a
                  href="javascript:void(0)"
                  className="inline-block rounded-md border py-3 px-7 text-sm font-semibold text-body-color transition hover:border-blue-500 hover:bg-blue-500 hover:text-white"
                >
                  View Details
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductBanner;
