import React, { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import Header from "../components/Header";
import BlogList from "../components/BlogList";
import Newsletter from "../components/Newsletter";
import Footer from "../components/Footer";

const Home = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Sync search query from URL to BlogList
  useEffect(() => {
    // This effect just ensures URL params are in sync
    // BlogList will handle reading the search params
  }, [searchParams]);

  return (
    <>
      <Navbar />
      <Header />
      <BlogList />
      <Newsletter />
      <Footer />
    </>
  );
};

export default Home;
