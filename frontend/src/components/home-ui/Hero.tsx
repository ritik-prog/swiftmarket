import React from "react";
import { useNavigate } from "react-router-dom";

const Hero = () => {
  const styles = {
    pageHeader: {
      backgroundImage:
        "url(" +
        "https://images.unsplash.com/photo-1534802046520-4f27db7f3ae5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2729&q=80" +
        ")",
      minHeight: "50vh",
    },
  } as const;
  const navigate = useNavigate();
  return (
    <section>
      <div className="page-header" style={styles.pageHeader}>
        <div className="faded opacity-10"></div>
        <div className="container z-index-2">
          <div className="row justify-center">
            <div className="col-sm-9 text-center mx-auto pt-6">
              <h1 className="mb-2 text-4xl font-bold">
                Welcome to Our Online Store!
              </h1>
              <p className="lead mb-5 px-8">
                Discover an Amazing Selection of Products and Start Shopping
                Today!
              </p>
              <button
                onClick={() => navigate(`/search?category=All`)}
                className="bg-indigo-600 py-3 px-6 rounded-lg hover:bg-indigo-500 focus:outline-none focus:bg-indigo-500 text-white"
              >
                Explore Our Collection
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
