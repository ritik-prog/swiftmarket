import React from "react";

const SellerCard = () => {
  const seller = {
    image: "https://via.placeholder.com/150",
    businessName: "Example Business",
    businessType: "Retail",
    location: "New York, NY",
    businessEmail: "ritikmakhija2002@gmail.com",
    businessNumber: "1234567890",
    businessRegistrationNumber: "ABC123",
    productCategories: ["Electronics", "Home Goods"],
    businessWebsite: "https://www.examplebusiness.com",
  };
  return (
    <div className="mt-10 bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden w-full">
      <div className="flex items-center p-4">
        <img
          src={seller.image}
          alt={seller.businessName}
          className="h-16 w-16 rounded-full mr-4"
        />
        <div>
          <h2 className="text-lg font-medium">{seller.businessName}</h2>
          <p className="text-gray-600">{seller.businessType}</p>
        </div>
      </div>
      <div className="px-4 py-2 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <p className="text-gray-600">Location:</p>
          <p>{seller.location}</p>
        </div>
        <div className="flex items-center justify-between">
          <p className="text-gray-600">Email:</p>
          <p>{seller.businessEmail}</p>
        </div>
        <div className="flex items-center justify-between">
          <p className="text-gray-600">Phone:</p>
          <p>{seller.businessNumber}</p>
        </div>
        <div className="flex items-center justify-between">
          <p className="text-gray-600">Registration Number:</p>
          <p>{seller.businessRegistrationNumber}</p>
        </div>
        <div className="flex items-center justify-between">
          <p className="text-gray-600">Product Categories:</p>
          <p>{seller.productCategories.join(", ")}</p>
        </div>
        <div className="flex items-center justify-between">
          <p className="text-gray-600">Website:</p>
          <p>
            <a
              href={seller.businessWebsite}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:text-blue-600"
            >
              {seller.businessWebsite}
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SellerCard;
