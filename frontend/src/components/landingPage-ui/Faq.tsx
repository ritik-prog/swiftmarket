import React, { useState } from "react";

function Faq() {
  const [openFaq1, setOpenFaq1] = useState(true);
  const [openFaq2, setOpenFaq2] = useState(true);
  const [openFaq3, setOpenFaq3] = useState(true);
  const [openFaq4, setOpenFaq4] = useState(true);
  return (
    <section className="relative overflow-hidden bg-white dark:bg-gray-900 pt-20 lg:pt-[120px]">
      <div className="container mx-auto">
        <div className="-mx-4 flex flex-wrap bg-dark">
          <div className="w-full px-4">
            <div className="mx-auto mb-[60px] max-w-[520px] text-center lg:mb-20 dark:text-white">
              <span className="mb-2 block text-lg font-semibold text-primary">
                FAQ
              </span>
              <h2 className="mb-4 text-3xl font-bold text-light sm:text-4xl md:text-[40px]">
                Any Questions? Look Here
              </h2>
              <p className="text-base text-body-color">
                Find Quick Answers. Get started on SwiftMarket with our curated
                list of commonly asked questions.
              </p>
            </div>
          </div>
        </div>

        <div className="-mx-4 flex flex-wrap">
          <div className="w-full px-4 lg:w-1/2">
            <div className="single-faq mb-8 w-full rounded-lg border border-[#F3F4FE] bg-white p-4 sm:p-8 lg:px-6 xl:px-8">
              <button
                className="faq-btn flex w-full text-left"
                onClick={() => setOpenFaq1(!openFaq1)}
              >
                <div className="mr-5 flex h-10 w-full max-w-[40px] items-center justify-center rounded-lg bg-blue-600 bg-opacity-5 text-blue-600">
                  <svg
                    width="17"
                    height="10"
                    viewBox="0 0 17 10"
                    className="icon fill-current"
                  >
                    <path
                      d="M7.28687 8.43257L7.28679 8.43265L7.29496 8.43985C7.62576 8.73124 8.02464 8.86001 8.41472 8.86001C8.83092 8.86001 9.22376 8.69083 9.53447 8.41713L9.53454 8.41721L9.54184 8.41052L15.7631 2.70784L15.7691 2.70231L15.7749 2.69659C16.0981 2.38028 16.1985 1.80579 15.7981 1.41393C15.4803 1.1028 14.9167 1.00854 14.5249 1.38489L8.41472 7.00806L2.29995 1.38063L2.29151 1.37286L2.28271 1.36548C1.93092 1.07036 1.38469 1.06804 1.03129 1.41393L1.01755 1.42738L1.00488 1.44184C0.69687 1.79355 0.695778 2.34549 1.0545 2.69659L1.05999 2.70196L1.06565 2.70717L7.28687 8.43257Z"
                      fill="#3056D3"
                      stroke="#3056D3"
                    />
                  </svg>
                </div>
                <div className="w-full">
                  <h4 className="text-lg font-semibold text-black">
                    How does SwiftMarket differ from other bulk trading
                    platforms?
                  </h4>
                </div>
              </button>
              {openFaq1 && (
                <div className="faq-content pl-[62px]">
                  <p className="py-3 text-base leading-relaxed text-body-color">
                    SwiftMarket stands out from the competition with its no-fee
                    transactions, secure blockchain-based platform, and global
                    reach. Our platform allows buyers and sellers to trade
                    securely and seamlessly without any added fees, making it an
                    attractive option for businesses of all sizes.
                  </p>
                </div>
              )}
            </div>
            <div className="single-faq mb-8 w-full rounded-lg border border-[#F3F4FE] bg-white p-4 sm:p-8 lg:px-6 xl:px-8">
              <button
                className="faq-btn flex w-full text-left"
                onClick={() => setOpenFaq2(!openFaq2)}
              >
                <div className="mr-5 flex h-10 w-full max-w-[40px] items-center justify-center rounded-lg bg-blue-600 bg-opacity-5 text-blue-600">
                  <svg
                    width="17"
                    height="10"
                    viewBox="0 0 17 10"
                    className="icon fill-current"
                  >
                    <path
                      d="M7.28687 8.43257L7.28679 8.43265L7.29496 8.43985C7.62576 8.73124 8.02464 8.86001 8.41472 8.86001C8.83092 8.86001 9.22376 8.69083 9.53447 8.41713L9.53454 8.41721L9.54184 8.41052L15.7631 2.70784L15.7691 2.70231L15.7749 2.69659C16.0981 2.38028 16.1985 1.80579 15.7981 1.41393C15.4803 1.1028 14.9167 1.00854 14.5249 1.38489L8.41472 7.00806L2.29995 1.38063L2.29151 1.37286L2.28271 1.36548C1.93092 1.07036 1.38469 1.06804 1.03129 1.41393L1.01755 1.42738L1.00488 1.44184C0.69687 1.79355 0.695778 2.34549 1.0545 2.69659L1.05999 2.70196L1.06565 2.70717L7.28687 8.43257Z"
                      fill="#3056D3"
                      stroke="#3056D3"
                    />
                  </svg>
                </div>
                <div className="w-full">
                  <h4 className="text-lg font-semibold text-black">
                    How can I buy and sell products on SwiftMarket?
                  </h4>
                </div>
              </button>
              {openFaq2 && (
                <div className="faq-content pl-[62px]">
                  <p className="py-3 text-base leading-relaxed text-body-color">
                    To buy and sell products on SwiftMarket, simply sign up for
                    an account and list your products or start browsing. Our
                    platform offers secure and flexible payment options,
                    including PayPal and blockchain-based transactions, to make
                    the buying and selling process easy and efficient.
                  </p>
                </div>
              )}
            </div>
          </div>
          <div className="w-full px-4 lg:w-1/2">
            <div className="single-faq mb-8 w-full rounded-lg border border-[#F3F4FE] bg-white p-4 sm:p-8 lg:px-6 xl:px-8">
              <button
                className="faq-btn flex w-full text-left"
                onClick={() => setOpenFaq3(!openFaq3)}
              >
                <div className="mr-5 flex h-10 w-full max-w-[40px] items-center justify-center rounded-lg bg-blue-600 bg-opacity-5 text-blue-600">
                  <svg
                    width="17"
                    height="10"
                    viewBox="0 0 17 10"
                    className="icon fill-current"
                  >
                    <path
                      d="M7.28687 8.43257L7.28679 8.43265L7.29496 8.43985C7.62576 8.73124 8.02464 8.86001 8.41472 8.86001C8.83092 8.86001 9.22376 8.69083 9.53447 8.41713L9.53454 8.41721L9.54184 8.41052L15.7631 2.70784L15.7691 2.70231L15.7749 2.69659C16.0981 2.38028 16.1985 1.80579 15.7981 1.41393C15.4803 1.1028 14.9167 1.00854 14.5249 1.38489L8.41472 7.00806L2.29995 1.38063L2.29151 1.37286L2.28271 1.36548C1.93092 1.07036 1.38469 1.06804 1.03129 1.41393L1.01755 1.42738L1.00488 1.44184C0.69687 1.79355 0.695778 2.34549 1.0545 2.69659L1.05999 2.70196L1.06565 2.70717L7.28687 8.43257Z"
                      fill="#3056D3"
                      stroke="#3056D3"
                    />
                  </svg>
                </div>
                <div className="w-full">
                  <h4 className="text-lg font-semibold text-black">
                    Is it safe to trade on SwiftMarket?
                  </h4>
                </div>
              </button>
              {openFaq3 && (
                <div className="faq-content pl-[62px]">
                  <p className="py-3 text-base leading-relaxed text-body-color">
                    Yes, SwiftMarket is a secure platform that uses blockchain
                    technology to ensure all transactions are verified and
                    secure. We also offer additional security features, such as
                    two-factor authentication and encrypted messaging, to
                    protect both buyers and sellers.
                  </p>
                </div>
              )}
            </div>
            <div className="single-faq mb-8 w-full rounded-lg border border-[#F3F4FE] bg-white p-4 sm:p-8 lg:px-6 xl:px-8">
              <button
                className="faq-btn flex w-full text-left"
                onClick={() => setOpenFaq4(!openFaq4)}
              >
                <div className="mr-5 flex h-10 w-full max-w-[40px] items-center justify-center rounded-lg bg-blue-600 bg-opacity-5 text-blue-600">
                  <svg
                    width="17"
                    height="10"
                    viewBox="0 0 17 10"
                    className="icon fill-current"
                  >
                    <path
                      d="M7.28687 8.43257L7.28679 8.43265L7.29496 8.43985C7.62576 8.73124 8.02464 8.86001 8.41472 8.86001C8.83092 8.86001 9.22376 8.69083 9.53447 8.41713L9.53454 8.41721L9.54184 8.41052L15.7631 2.70784L15.7691 2.70231L15.7749 2.69659C16.0981 2.38028 16.1985 1.80579 15.7981 1.41393C15.4803 1.1028 14.9167 1.00854 14.5249 1.38489L8.41472 7.00806L2.29995 1.38063L2.29151 1.37286L2.28271 1.36548C1.93092 1.07036 1.38469 1.06804 1.03129 1.41393L1.01755 1.42738L1.00488 1.44184C0.69687 1.79355 0.695778 2.34549 1.0545 2.69659L1.05999 2.70196L1.06565 2.70717L7.28687 8.43257Z"
                      fill="#3056D3"
                      stroke="#3056D3"
                    />
                  </svg>
                </div>
                <div className="w-full">
                  <h4 className="text-lg font-semibold text-black">
                    How can I track my orders and sales on SwiftMarket?
                  </h4>
                </div>
              </button>
              {openFaq4 && (
                <div className="faq-content pl-[62px]">
                  <p className="py-3 text-base leading-relaxed text-body-color">
                    SwiftMarket offers an intuitive dashboard that allows you to
                    easily track your orders and sales in real-time. With our
                    dashboard, you can manage your inventory, track shipments,
                    and view your transaction history all in one place.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Faq;
