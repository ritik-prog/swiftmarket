import React from "react";

const Reviews = (product: any) => {
  return (
    <section className="py-16 2xl:py-44 bg-blueGray-100 rounded-t-10xl overflow-hidden">
      <div className="container px-4 mx-auto">
        <span className="inline-block mb-14 text-3xl font-heading font-medium underline hover:text-darkBlueGray-700">
          {product.product.ratings.length} reviews
        </span>

        {product.product.ratings.map((item: any) => (
          <div
            className="mb-2 shadow-lg rounded-t-8xl rounded-b-5xl overflow-hidden"
            key={item.name}
          >
            <div className="pt-3 pb-3 md:pb-1 px-4 md:px-16 bg-white bg-opacity-40">
              <div className="flex flex-wrap items-center">
                <img
                  className="mr-6"
                  src={`https://ui-avatars.com/api/?name=${
                    item?.user?.username || "Deleted User"
                  }&rounded=true`}
                  alt={item.name}
                />
                <h4 className="w-full md:w-auto text-xl font-heading font-medium">
                  {item?.user?.username || "Deleted User"}
                </h4>
                <div className="w-full md:w-px h-2 md:h-8 mx-8 bg-transparent md:bg-gray-200"></div>
                <span className="mr-4 text-xl font-heading font-medium">
                  {item.rating}
                </span>
                <div className="inline-flex">
                  {[...Array(5)].map((star: any, index: any) => {
                    const value = index + 1;
                    return (
                      <svg
                        key={index}
                        aria-hidden="true"
                        className={`w-7 h-7 cursor-pointer ${
                          value <= item.rating
                            ? "text-yellow-400"
                            : "text-gray-400"
                        }`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <title>{`${value} star`}</title>
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                      </svg>
                    );
                  })}
                </div>
              </div>
            </div>
            <div className="px-4 overflow-hidden md:px-16 pt-8 pb-12 bg-white">
              <div className="flex flex-wrap">
                <div className="w-full md:w-2/3 mb-6 md:mb-0">
                  <p className="max-w-2xl text-darkBlueGray-400 leading-loose">
                    {item.review}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
        {/* <div className="text-center mt-10">
          <button className="inline-block w-full md:w-auto h-full py-4 px-10 leading-8 font-heading font-medium tracking-tighter text-xl text-white bg-blue-500 hover:bg-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 rounded-xl">
            See all
          </button>
        </div> */}
      </div>
    </section>
  );
};

export default Reviews;
