import React, { useState } from "react";

const FundRelease = () => {
  const [bankDetails, setBankDetails] = useState({
    accountHolderName: "",
    accountNumber: "",
    bankName: "",
    branchName: "",
    ifscCode: "",
    amount: "",
  });

  const handleInputChange = (event: any) => {
    const { name, value } = event.target;
    setBankDetails({ ...bankDetails, [name]: value });
  };

  const handleSubmit = (event: any) => {
    event.preventDefault();
    // Code to initiate bank transfer with the entered bank details
  };

  return (
    <div className="m-4 p-4 bg-white shadow-lg rounded-lg max-w-xl">
      <div className="rounded-lg shadow-lg p-4 bg-white bg-opacity-70">
        <div className="flex items-center justify-between mb-4">
          <div className="text-lg font-bold text-gray-800">
            Total Account Balance
          </div>
          <div className="text-2xl text-gray-800">
            <i className="fas fa-chart-line"></i>
          </div>
        </div>
        <div className="text-4xl font-bold text-gray-800">$2000</div>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="my-4">
          <label
            htmlFor="accountHolderName"
            className="block text-gray-700 font-medium mb-2"
          >
            Account Holder Name
          </label>
          <input
            type="text"
            id="accountHolderName"
            name="accountHolderName"
            value={bankDetails.accountHolderName}
            onChange={handleInputChange}
            required
            className="w-full px-4 py-2 border border-gray-400 rounded-lg outline-none focus:border-blue-500"
          />
        </div>
        <div className="my-4">
          <label
            htmlFor="accountNumber"
            className="block text-gray-700 font-medium mb-2"
          >
            Account Number
          </label>
          <input
            type="text"
            id="accountNumber"
            name="accountNumber"
            value={bankDetails.accountNumber}
            onChange={handleInputChange}
            required
            className="w-full px-4 py-2 border border-gray-400 rounded-lg outline-none focus:border-blue-500"
          />
        </div>
        <div className="my-4">
          <label
            htmlFor="bankName"
            className="block text-gray-700 font-medium mb-2"
          >
            Bank Name
          </label>
          <input
            type="text"
            id="bankName"
            name="bankName"
            value={bankDetails.bankName}
            onChange={handleInputChange}
            required
            className="w-full px-4 py-2 border border-gray-400 rounded-lg outline-none focus:border-blue-500"
          />
        </div>
        <div className="my-4">
          <label
            htmlFor="branchName"
            className="block text-gray-700 font-medium mb-2"
          >
            Branch Name
          </label>
          <input
            type="text"
            id="branchName"
            name="branchName"
            value={bankDetails.branchName}
            onChange={handleInputChange}
            required
            className="w-full px-4 py-2 border border-gray-400 rounded-lg outline-none focus:border-blue-500"
          />
        </div>
        <div className="my-4">
          <label
            htmlFor="ifscCode"
            className="block text-gray-700 font-medium mb-2"
          >
            IFSC Code
          </label>
          <input
            type="text"
            id="ifscCode"
            name="ifscCode"
            value={bankDetails.ifscCode}
            onChange={handleInputChange}
            required
            className="w-full px-4 py-2 border border-gray-400 rounded-lg outline-none focus:border-blue-500"
          />
        </div>
        <div className="my-4">
          <label
            htmlFor="amount"
            className="block text-gray-700 font-medium mb-2"
          >
            Amount
          </label>
          <input
            type="number"
            id="amount"
            name="amount"
            value={bankDetails.amount}
            onChange={handleInputChange}
            required
            className="w-full px-4 py-2 border border-gray-400 rounded-lg outline-none focus:border-blue-500"
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
        >
          Send Request
        </button>
        <p className="text-gray-500 text-sm mt-2">
          Note: Please allow up to 7 business days for the money transfer to be
          completed.
        </p>
      </form>
    </div>
  );
};

export default FundRelease;
