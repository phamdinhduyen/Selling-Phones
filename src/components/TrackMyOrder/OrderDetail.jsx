import { Col, Row } from "antd";
import React from "react";
import Header from "../Header/Header";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect } from "react";
import useAuth from "../../hooks/useAuth";
import { Table, Space } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { updateStateModal } from "../../redux/action/Modal.action";
import { ROUTES } from "../../constants/routers";
import { orderDetail } from "../../redux/slices/orderSlice";
import formatMoney from "../../utils/common";
import or from "or";

const OrderDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const user = useAuth();
  const navigate = useNavigate();
  if (!user) {
    dispatch(updateStateModal(true));
    navigate(ROUTES.HOME);
  }
  useEffect(() => {
    dispatch(orderDetail(id));
  }, []);
  let order = useSelector((state) => state.order.entities);
  console.log({ order });
  order = order?.data ? order?.data[0] : null;
  const products = order?.product?.map((item) => {
    return {
      id: item.id,
      name: item.name,
      image: item.image,
      price: item.price,
      status: item.status,
      quantity: item.total,
      total: item.total,
    };
  });
  console.log(products);
  const Column = [
    {
      title: "Tên sản phẩm",
      dataIndex: "name",
      align: "center",
      width: 150,
      render: (_, record) => {
        return (
          <Space>
            <img
              src={record.image}
              alt=""
              style={{ width: "50px", height: "50px" }}
            />
            <h4>{record.name}</h4>
          </Space>
        );
      },
    },

    {
      title: "Gia sản phẩm",
      dataIndex: "price",
      align: "center",
      width: 150,
      render: (_, record) => {
        return <h4>{formatMoney(record.price)}</h4>;
      },
    },

    {
      title: "Thành tiền",
      dataIndex: "total",
      align: "center",
      width: 200,
      render: (_, record) => {
        return <h4>{formatMoney(record.total)}</h4>;
      },
    },
  ];
  return (
    <>
      <Header />
      <div>
        <Row style={{ marginTop: 10 }}>
          <Col md={12} sm={24} style={{ background: "#cccc" }}>
            <div
              style={{
                fontSize: 18,
                marginLeft: "10px",
                border: "1px solid black",
              }}
            >
              <div style={{ display: "flex", border: "1px solid black" }}>
                <h4 style={{ fontweight: 800 }}> ID hông tin đơn hàng: </h4>{" "}
                <p style={{ fontweight: 400, marginLeft: 10 }}> {order?.id}</p>
              </div>
              <div style={{ display: "flex", border: "1px solid black" }}>
                <h4 style={{ fontweight: 800 }}> Ngày mua: </h4>{" "}
                <p style={{ fontweight: 400, marginLeft: 10 }}>
                  {order?.created}
                </p>
              </div>
              <div style={{ display: "flex", border: "1px solid black" }}>
                <h4 style={{ fontweight: 800 }}>Tổng tiền đơn hàng: </h4>{" "}
                <p style={{ fontweight: 400, marginLeft: 10 }}>
                  {formatMoney(order?.total)}
                </p>
              </div>
              <div style={{ display: "flex", border: "1px solid black" }}>
                <h4 style={{ fontweight: 800 }}>Phương thức giao hàng: </h4>{" "}
                <p style={{ fontweight: 400, marginLeft: 10 }}>
                  {order?.shipping}
                </p>
              </div>
              <div style={{ display: "flex", border: "1px solid black" }}>
                <h4 style={{ fontweight: 800 }}>Địa chỉ giao hàng: </h4>{" "}
                <p style={{ fontweight: 400, marginLeft: 10 }}>
                  {order?.address}
                </p>
              </div>
              <div style={{ display: "flex", border: "1px solid black" }}>
                <h4 style={{ fontweight: 800 }}>Trạng thái đơn hàng: </h4>{" "}
                <p style={{ fontweight: 400, marginLeft: 10 }}>
                  {order?.status}
                </p>
              </div>
            </div>
          </Col>

          <Col span={12}>
            <div>
              {" "}
              <Table
                columns={Column}
                rowKey={"id"}
                dataSource={products}
                bordered
                pagination={false}
              ></Table>
            </div>
          </Col>
        </Row>
      </div>
    </>
  );
};
export default OrderDetail;
