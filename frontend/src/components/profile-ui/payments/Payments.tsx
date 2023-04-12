import React from "react";

const Payments = () => {
  return (
    <div className="mt-10">
      <header className="text-left">
        <h1 className="text-xl font-bold text-gray-900 sm:text-3xl">
          Previous Transactions
        </h1>
      </header>
      <div className="mt-10">
        <section className="container px-4 mx-auto">
          <div className="flex flex-col">
            <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
              <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                  {/* Repeat this transaction box for each transaction */}
                  <div className="bg-white shadow-md rounded-md p-4">
                    <div className="flex justify-between items-center mb-4">
                      <div className="flex items-center">
                        <button className="flex items-center gap-x-1">
                          <span className="text-gray-500 dark:text-gray-400 font-medium">
                            Invoice
                          </span>
                        </button>
                      </div>
                      <span className="text-gray-400 text-xs pl-4">
                        Apr 7, 2023
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-500 dark:text-gray-400 text-sm font-medium">
                        $1250.00
                      </span>
                      <span className="bg-gray-200 rounded-full px-2 py-1 text-xs text-gray-700 dark:bg-gray-700 dark:text-gray-200 font-medium">
                        Paid
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Payments;
