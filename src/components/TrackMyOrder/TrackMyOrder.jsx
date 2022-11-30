import React from "react";
import { Button, Modal } from "antd";
import MyOrder from "./MyOrder";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";

const TrackMyOrderProduct = () => {
  return (
    <>
      <Header />
      <div style={{ marginTop: 20 }}>
        <MyOrder />
      </div>
    </>
  );
};

export default TrackMyOrderProduct;
