import {
  EthereumClient,
  w3mConnectors,
  w3mProvider,
} from "@web3modal/ethereum";
import { Web3Button, Web3Modal } from "@web3modal/react";
import { configureChains, createClient, useAccount, WagmiConfig } from "wagmi";
// import { arbitrum, mainnet, polygon, goerli } from "wagmi/chains";
import { sepoliaTestnet } from "./sepolia";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/rootReducer";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { BeatLoader } from "react-spinners";
import { useState } from "react";

const chains = [sepoliaTestnet];
const projectId = "a2fa3d81ffd44bbf887ace58ad8aaee0";

const { provider } = configureChains(chains, [w3mProvider({ projectId })]);
const wagmiClient = createClient({
  autoConnect: true,
  connectors: w3mConnectors({ projectId, version: 1, chains }),
  provider,
});
const ethereumClient = new EthereumClient(wagmiClient, chains);

function MetaMask() {
  const cartItems = useSelector((state: RootState) => state.cart);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const { state } = useLocation();
  const { address, isConnected } = useAccount();

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    console.log(state);
    // if (result?.paymentIntent?.status === "succeeded") {
    //   await updateTransaction(transactionId);
    //   const products = cartItems.items.map((item) => ({
    //     id: item._id,
    //     quantity: item.quantity,
    //   }));

    //   const { cart_id } = await placeOrderApi({
    //     shippingAddress: state.address,
    //     number: state.number,
    //     fullname: state.fullname,
    //     products: products,
    //     transactionId: transactionId,
    //   });
    //   navigate(`/orders`, { replace: true });
    //   dispatch(clearCart());
    //   CreateToast("payment", "Payment Successful", "success");
    // }
  };

  return (
    <>
      <WagmiConfig client={wagmiClient}>
        <div className="relative mx-auto w-full bg-white">
          <div className="grid min-h-screen grid-cols-10">
            <div className="col-span-full py-6 px-4 sm:py-12 lg:col-span-6 lg:py-24">
              <div className="mx-auto w-full max-w-lg">
                <h1 className="relative text-2xl font-medium text-gray-700 sm:text-3xl">
                  Secure Checkout
                  <span className="mt-2 block h-1 w-10 bg-teal-600 sm:w-20"></span>
                </h1>
                <form className="mt-10 flex flex-col space-y-4">
                  <Web3Button />
                  <Web3Modal
                    projectId={projectId}
                    ethereumClient={ethereumClient}
                  />
                  <p className="mt-10 text-center text-sm font-semibold text-gray-500">
                    By placing this order you agree to the{" "}
                    <span
                      onClick={() => navigate("/termsandconditions")}
                      className="cursor-pointer whitespace-nowrap text-teal-400 underline hover:text-teal-600"
                    >
                      Terms and Conditions
                    </span>
                  </p>
                  <button
                    type="submit"
                    className="mt-4 inline-flex w-full items-center justify-center rounded bg-teal-600 py-2.5 px-4 text-base font-semibold tracking-wide text-white text-opacity-80 outline-none ring-offset-2 transition hover:text-opacity-100 focus:ring-2 focus:ring-teal-500 sm:text-lg"
                    onClick={(e) => handleSubmit(e)}
                    disabled={loading || !isConnected}
                  >
                    {address ? (
                      <>
                        {!loading ? "Place Order" : <BeatLoader color="#fff" />}
                      </>
                    ) : (
                      <>
                        <BeatLoader color="#fff" />
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>
            <div className="relative col-span-full flex flex-col py-6 pl-8 pr-4 sm:py-12 lg:col-span-4 lg:py-24">
              <h2 className="sr-only">Order summary</h2>
              <div>
                <img
                  src="https://images.unsplash.com/photo-1581318694548-0fb6e47fe59b?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=880&q=80"
                  alt=""
                  className="absolute inset-0 h-full w-full object-cover"
                />
                <div className="absolute inset-0 h-full w-full bg-gradient-to-t from-teal-800 to-teal-400 opacity-95"></div>
              </div>
              <div className="relative">
                <ul className="space-y-5">
                  {cartItems.items.length !== 0 ? (
                    cartItems.items.map((product) => (
                      <li className="flex justify-between">
                        <div className="inline-flex">
                          <img
                            src={product.thumbnailUrl}
                            alt={product.productName}
                            className="max-h-16"
                          />
                          <div className="ml-3">
                            <p className="text-base font-semibold text-white">
                              {product.productName}
                            </p>
                          </div>
                        </div>
                        <p className="text-sm font-semibold text-white">
                          ₹{product.price}
                        </p>
                      </li>
                    ))
                  ) : (
                    <></>
                  )}
                </ul>
                <div className="my-5 h-0.5 w-full bg-white bg-opacity-30"></div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <dt className="text-sm text-white dark:text-gray-200">
                      Price ({cartItems.totalQuantity} item)
                    </dt>
                    <dd className="text-sm font-medium text-white dark:text-gray-100">
                      ₹{cartItems.totalPrice}
                    </dd>
                  </div>
                  <div className="flex items-center justify-between pt-4">
                    <dt className="flex items-center text-sm text-white dark:text-gray-200">
                      <span>Discount</span>
                    </dt>
                    <dd className="text-sm font-medium text-white dark:text-green-400">
                      - ₹{cartItems.totalDiscount}
                    </dd>
                  </div>
                  <div className="flex items-center justify-between py-4 border-y border-dashed">
                    <dt className="text-base font-medium text-white dark:text-white">
                      Total Amount
                    </dt>
                    <dd className="text-base font-medium text-white dark:text-white">
                      ₹{cartItems.totalAmount}
                    </dd>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </WagmiConfig>
    </>
  );
}

export default MetaMask;

var myHeaders = new Headers();
myHeaders.append("apikey", "4sCvqsIE6SywuiZPwdAyGbU8IJh454d4");

// var requestOptions = {
//   method: "GET",
//   redirect: "follow",
//   headers: myHeaders,
// };

// fetch(
//   "https://api.apilayer.com/exchangerates_data/convert?to=USD&from=INR&amount=1199",
//   requestOptions
// )
//   .then((response) => response.text())
//   .then((result) => console.log(result))
//   .catch((error) => console.log("error", error));
