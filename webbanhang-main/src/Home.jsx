import React from "react";
import HeaderPage from "./components/Header/Header";
import CarouselMain from "./components/Main/Carousel";
import Navbar from "./components/Main/Menu";
import { Col, Row } from "antd";
import Suggestions from "./components/Main/Suggestions";
import Product from "./components/Main/Product";

import Footer from "./components/Footer/Footer";

const Home = () => {
  return (
    <div>
      <HeaderPage />

      <Row>
        <Col md={3} sm={24} style={{ background: "#ccc" }}>
          <Navbar />
        </Col>
        <Col md={21} sm={24}>
          <CarouselMain />
        </Col>
      </Row>

      <Suggestions />

      <Product />

      <Footer />
    </div>
  );
};

export default Home;
