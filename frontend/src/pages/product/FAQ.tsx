import React, { useState } from "react";

interface FaqFormat {
  question: string;
  answer: string;
}

const FAQ = (faqs: any) => {
  return (
    <section className="relative pt-1 pb-16 bg-blueGray-50 overflow-hidden">
      <img
        className="absolute bottom-0 left-1/2 transform -translate-x-1/2"
        src="flaro-assets/images/faqs/gradient.svg"
        alt=""
      />
      <div className="relative z-10 container px-4 mx-auto">
        <div className="md:max-w-4xl mx-auto">
          <h2 className="mb-16 text-6xl md:text-2xl xl:text-5xl text-center font-bold font-heading tracking-px-n leading-none">
            Frequently Asked Questions
          </h2>
          <div className="mb-11 flex flex-wrap -m-1">
            {faqs.faqs &&
              faqs.faqs.map((faq: any, index: any) => (
                <div className="w-full p-1" key={index}>
                  <div className="py-7 px-8 bg-white bg-opacity-60 border-2 border-indigo-600 rounded-2xl shadow-10xl">
                    <div className="flex flex-wrap justify-between -m-2">
                      <div className="flex-1 p-2">
                        <h3 className="mb-4 text-lg font-semibold leading-normal">
                          {faq.question}
                        </h3>
                        <p className="text-gray-600 font-medium">
                          {faq.answer}
                        </p>
                      </div>
                      <div className="w-auto p-2">
                        <svg
                          className="relative top-1"
                          width="20"
                          height="20"
                          viewBox="0 0 20 20"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M4.16732 12.5L10.0007 6.66667L15.834 12.5"
                            stroke="#4F46E5"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          ></path>
                        </svg>
                      </div>
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

export default FAQ;
