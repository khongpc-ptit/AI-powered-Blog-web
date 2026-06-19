import React from "react";

const Newsletter = () => {
  return (
    <div className="flex flex-col items-center justify-center text-center space-y-2 my-32">
      <h1 className="md:text-4xl text-2xl font-semibold">
        {" "}
        Never Miss an Update
      </h1>
      <p className="md:text-lg text-gray-500/70 pb-8">
        Subscribe to get the latest blog, new tech, and exclusive news.
      </p>
    </div>
  );
};

export default Newsletter;
