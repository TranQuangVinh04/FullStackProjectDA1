import React from "react";
import { Spinner } from "./ui/Spinner";

const Loading = () => {
  return (
    <div className="flex items-center justify-center h-screen">
      <Spinner size="lg" />
    </div>
  );
};

export default Loading; 