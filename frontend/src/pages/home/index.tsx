import React, { useState } from "react";
import NavBar from "../../components/common/NavBar";
import ProductBanner from "../../components/home-ui/ProductBanner";
import SellerBanner from "../../components/home-ui/SellerBanner";
import Services from "../../components/home-ui/Services";
import Faq from "../../components/home-ui/Faq";
import Footer from "../../components/common/Footer";
import Hero from "../../components/home-ui/Hero";

function Home() {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <>
      <Hero />
      <ProductBanner />
      <SellerBanner />
      <Services />
      <Faq />
    </>
  );
}
export default Home;
