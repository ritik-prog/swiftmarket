import React from "react";

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
  return (
    <section>
      <div className="page-header" style={styles.pageHeader}>
        <div className="faded opacity-10"></div>
        <div className="container z-index-2">
          <div className="row justify-center">
            <div className="col-sm-9 text-center mx-auto pt-6">
              <h1 className="mb-2 text-4xl font-bold">
                Get 50% off during our one-time sale
              </h1>
              <p className="lead mb-5 px-8">
                We’re constantly trying to express ourselves and actualize our
                dreams. If you have the opportunity to play this game.
              </p>
              <button className="bg-indigo-600 py-3 px-6 rounded-lg hover:bg-indigo-500 focus:outline-none focus:bg-indigo-500 text-white">
                Get access to our one-time sale
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
