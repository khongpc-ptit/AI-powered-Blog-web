import React, { useState, useEffect, useMemo } from "react";
import Navbar from "../components/Navbar";
import Header from "../components/Header";
import BlogList from "../components/BlogList";
import Newsletter from "../components/Newsletter";
import Footer from "../components/Footer";
import { blogService } from "../services/blog.service";

const Home = () => {
  const [blogs, setBlogs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [blogsRes, categoriesRes] = await Promise.all([
        blogService.getAll(),
        blogService.getCategories(),
      ]);

      if (blogsRes.data) {
        setBlogs(blogsRes.data);
      }
      if (categoriesRes.data) {
        setCategories(categoriesRes.data);
      }
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      <Navbar />
      <Header />
      <BlogList blogs={blogs} categories={categories} loading={loading} refreshBlogs={fetchData} />
      <Newsletter />
      <Footer />
    </>
  );
};

export default Home;
