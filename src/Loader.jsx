import React from "react";
import loader from "./assets/loader.gif";
function Loader() {
  return (
    <div className="loader">
      <img src={loader} alt="" />
    </div>
  );
}

export default Loader;
