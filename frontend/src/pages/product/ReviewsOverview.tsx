import React, { useEffect } from "react";
import { getRatingsOverViewData } from "../../api/product";

const ReviewsOverview = ({ productId }: any) => {
  // state for saving reviews data
  const [reviewsData, setReviewsData] = React.useState<any>(null);

  async function fetchData() {
    try {
      const data = await getRatingsOverViewData(productId);
      setReviewsData(data);
    } catch (error) {}
  }
  useEffect(() => {
    fetchData();
  }, []);
  console.log(reviewsData);
  return reviewsData !== null ? (
    <div className="mt-10">
      <div className="flex items-center mb-3">
        {[...Array(5)].map((star: any, index: any) => {
          const value = index + 1;
          return (
            <svg
              key={index}
              aria-hidden="true"
              className={`w-5 h-5 ${
                value <= reviewsData.average
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
        <p className="ml-2 text-sm font-medium text-gray-900 dark:text-white">
          {reviewsData.average} out of 5
        </p>
      </div>
      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
        {reviewsData.total} global ratings
      </p>
      <div className="flex items-center mt-4">
        <span className="text-sm font-medium text-blue-600 dark:text-blue-500">
          5 star
        </span>
        <div className="w-2/4 h-5 mx-4 bg-gray-200 rounded dark:bg-gray-700">
          <div
            className="h-5 bg-yellow-400 rounded"
            style={{ width: reviewsData.percentages[5] || 0 }}
          ></div>
        </div>
        <span className="text-sm font-medium text-blue-600 dark:text-blue-500">
          {reviewsData.percentages[5] || `0%`}
        </span>
      </div>
      <div className="flex items-center mt-4">
        <span className="text-sm font-medium text-blue-600 dark:text-blue-500">
          4 star
        </span>
        <div className="w-2/4 h-5 mx-4 bg-gray-200 rounded dark:bg-gray-700">
          <div
            className="h-5 bg-yellow-400 rounded"
            style={{ width: reviewsData.percentages[4] || 0 }}
          ></div>
        </div>
        <span className="text-sm font-medium text-blue-600 dark:text-blue-500">
          {reviewsData.percentages[4] || `0%`}
        </span>
      </div>
      <div className="flex items-center mt-4">
        <span className="text-sm font-medium text-blue-600 dark:text-blue-500">
          3 star
        </span>
        <div className="w-2/4 h-5 mx-4 bg-gray-200 rounded dark:bg-gray-700">
          <div
            className="h-5 bg-yellow-400 rounded"
            style={{ width: reviewsData.percentages[3] || 0 }}
          ></div>
        </div>
        <span className="text-sm font-medium text-blue-600 dark:text-blue-500">
          {reviewsData.percentages[3] || `0%`}
        </span>
      </div>
      <div className="flex items-center mt-4">
        <span className="text-sm font-medium text-blue-600 dark:text-blue-500">
          2 star
        </span>
        <div className="w-2/4 h-5 mx-4 bg-gray-200 rounded dark:bg-gray-700">
          <div
            className="h-5 bg-yellow-400 rounded"
            style={{ width: reviewsData.percentages[2] || 0 }}
          ></div>
        </div>
        <span className="text-sm font-medium text-blue-600 dark:text-blue-500">
          {reviewsData.percentages[2] || `0%`}
        </span>
      </div>
      <div className="flex items-center mt-4">
        <span className="text-sm font-medium text-blue-600 dark:text-blue-500">
          1 star
        </span>
        <div className="w-2/4 h-5 mx-4 bg-gray-200 rounded dark:bg-gray-700">
          <div
            className="h-5 bg-yellow-400 rounded"
            style={{ width: reviewsData.percentages[1] || 0 }}
          ></div>
        </div>
        <span className="text-sm font-medium text-blue-600 dark:text-blue-500">
          {reviewsData.percentages[1] || `0%`}
        </span>
      </div>
    </div>
  ) : (
    <></>
  );
};

export default ReviewsOverview;
