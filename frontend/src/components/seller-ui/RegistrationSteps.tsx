import React from "react";
import steps from "../../assets/steps.svg";

const RegistrationSteps = ({ openModal }: any) => {
  return (
    <section
      className="text-gray-600 body-font bg-white shadow-md dark:bg-gray-900 dark:text-white"
      id="registrationsteps"
    >
      <div className="container px-5 mx-auto flex flex-wrap">
        <div className="flex flex-wrap w-full">
          <div className="lg:w-2/5 md:w-1/2 md:pr-10 md:py-6">
            <div className="flex relative pb-12">
              <div className="h-full w-10 absolute inset-0 flex items-center justify-center">
                <div className="h-full w-1 bg-gray-200 pointer-events-none"></div>
              </div>
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-indigo-500 inline-flex items-center justify-center text-white relative z-10">
                <svg
                  fill="none"
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  className="w-5 h-5"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                </svg>
              </div>
              <div className="flex-grow pl-4">
                <h2 className="font-medium title-font text-sm text-black dark:text-white mb-1 tracking-wider">
                  Step 1 - Apply As Seller
                </h2>
                <p className="leading-relaxed">
                  Click the{" "}
                  <span
                    onClick={openModal}
                    className="text-indigo-600 uppercase cursor-pointer"
                  >
                    "Start Now"
                  </span>{" "}
                  button below to begin the registration process and create your
                  account. It only takes a few minutes to get started!
                </p>
              </div>
            </div>
            <div className="flex relative pb-12">
              <div className="h-full w-10 absolute inset-0 flex items-center justify-center">
                <div className="h-full w-1 bg-gray-200 pointer-events-none"></div>
              </div>
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-indigo-500 inline-flex items-center justify-center text-white relative z-10">
                <svg
                  fill="none"
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  className="w-5 h-5"
                  viewBox="0 0 24 24"
                >
                  <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
                </svg>
              </div>
              <div className="flex-grow pl-4">
                <h2 className="font-medium title-font text-sm text-black dark:text-white mb-1 tracking-wider">
                  STEP 2 - Fill Form
                </h2>
                <p className="leading-relaxed">
                  After clicking on "Start Now," a registration form will
                  appear. Please fill in all the required information accurately
                  and completely. This will include your name, contact
                  information, and any other necessary details to create your
                  account.
                </p>
              </div>
            </div>
            <div className="flex relative pb-12">
              <div className="h-full w-10 absolute inset-0 flex items-center justify-center">
                <div className="h-full w-1 bg-gray-200 pointer-events-none"></div>
              </div>
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-indigo-500 inline-flex items-center justify-center text-white relative z-10">
                <svg
                  fill="none"
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  className="w-5 h-5"
                  viewBox="0 0 24 24"
                >
                  <circle cx="12" cy="5" r="3"></circle>
                  <path d="M12 22V8M5 12H2a10 10 0 0020 0h-3"></path>
                </svg>
              </div>
              <div className="flex-grow pl-4">
                <h2 className="font-medium title-font text-sm text-black dark:text-white mb-1 tracking-wider">
                  STEP 3 - Wait for Admin
                </h2>
                <p className="leading-relaxed">
                  Congratulations! You have successfully submitted your
                  registration request. Please allow our admin team to review
                  your request and confirm your account. You will receive an
                  email notification once your account has been activated.
                </p>
              </div>
            </div>
            <div className="flex relative pb-12">
              <div className="h-full w-10 absolute inset-0 flex items-center justify-center">
                <div className="h-full w-1 bg-gray-200 pointer-events-none"></div>
              </div>
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-indigo-500 inline-flex items-center justify-center text-white relative z-10">
                <svg
                  fill="none"
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  className="w-5 h-5"
                  viewBox="0 0 24 24"
                >
                  <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
              </div>
              <div className="flex-grow pl-4">
                <h2 className="font-medium title-font text-sm text-black dark:text-white mb-1 tracking-wider">
                  STEP 4 - Verify
                </h2>
                <p className="leading-relaxed">
                  After receiving the verification email, log in to your account
                  and enter the verification code provided in the email to
                  confirm your account. Once your account is verified, you can
                  start exploring the marketplace and making sales.
                </p>
              </div>
            </div>
            <div className="flex relative">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-indigo-500 inline-flex items-center justify-center text-white relative z-10">
                <svg
                  fill="none"
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  className="w-5 h-5"
                  viewBox="0 0 24 24"
                >
                  <path d="M22 11.08V12a10 10 0 11-5.93-9.14"></path>
                  <path d="M22 4L12 14.01l-3-3"></path>
                </svg>
              </div>
              <div className="flex-grow pl-4">
                <h2 className="font-medium title-font text-sm text-black dark:text-white mb-1 tracking-wider">
                  FINISH - Start Selling
                </h2>
                <p className="leading-relaxed">
                  Congratulations! You're now ready to start buying and selling
                  on SwiftMarket. We hope you have a great experience and find
                  success on our platform. If you have any questions or
                  concerns, please don't hesitate to reach out to our support
                  team.
                </p>
              </div>
            </div>
          </div>
          <img
            className="lg:w-3/5 md:w-1/2 sm:w-0 object-cover object-center rounded-lg md:mt-0 mt-12"
            src={steps}
            alt="step"
          />
        </div>
      </div>
    </section>
  );
};

export default RegistrationSteps;
