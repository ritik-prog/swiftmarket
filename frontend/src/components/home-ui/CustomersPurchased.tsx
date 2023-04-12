import { useEffect, useRef, useState } from "react";
import { IoIosStar, IoIosStarHalf } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { getRecommendedProducts } from "../../api/product";

export default function CustomersPurchased() {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();
  const isMountedRef = useRef(false);

  async function getProducts() {
    const response = await getRecommendedProducts();
    console.log(response);
    setProducts(response.products);
  }

  useEffect(() => {
    // Only call getProducts() if the component has mounted
    if (isMountedRef.current) {
      if (products.length === 0) {
        getProducts();
      }
    } else {
      isMountedRef.current = true;
    }
  }, []);

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
        <h2 className="text-2xl font-bold tracking-tight text-gray-900">
          Customers also purchased
        </h2>
        <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
          {products &&
            products.map((product: any) => (
              <div
                key={product.id}
                className="group relative cursor-pointer"
                onClick={() => navigate(`/product?query=${product._id}`)}
              >
                <div className="min-h-80 aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-md bg-gray-200 lg:aspect-none group-hover:opacity-75 lg:h-80">
                  <img
                    src={product.imagesUrl}
                    alt={product.productName}
                    className="h-full w-full object-cover object-center lg:h-full lg:w-full"
                  />
                </div>
                <div className="mt-4 flex justify-between">
                  <div>
                    <h3 className="text-sm text-gray-700">
                      <a href={product.href}>
                        <span aria-hidden="true" className="absolute inset-0" />
                        {product.productName}
                      </a>
                    </h3>

                    <div className="flex items-center mt-1">
                      <IoIosStar className="w-4 h-4 text-yellow-500" />
                      <IoIosStar className="w-4 h-4 text-yellow-500" />
                      <IoIosStar className="w-4 h-4 text-yellow-500" />
                      <IoIosStarHalf className="w-4 h-4 text-yellow-500" />
                      <span className="text-sm text-gray-500 ml-1">(25)</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs line-through font-medium text-gray-500 dark:text-gray-100">
                      ₹{product.price}
                    </p>
                    <p className="text-md font-medium text-gray-900 dark:text-white">
                      &nbsp;&nbsp;₹{product.discountedPrice}
                    </p>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
