import {
  Button,
  Form,
  Input,
  InputNumber,
  notification,
  Space,
  Table,
  Radio,
} from "antd";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import formatMoney from "../../utils/common";
import { orders } from "../../redux/slices/orderSlice";
import {
  getBonus,
  setNullMessageCouponError,
} from "../../redux/slices/bonusSlice";
import React from "react";
import { useEffect, useState } from "react";
import useAuth from "../../hooks/useAuth";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { updateStateModal } from "../../redux/action/Modal.action";
import { ROUTES } from "../../constants/routers";
import { v4 as uuidv4 } from "uuid";

const Payment = () => {
  const { Search } = Input;
  const navigate = useNavigate();
  const userAuth = useAuth();
  const dispatch = useDispatch();
  const [cart, setCart] = useState([]);
  const coupon = useSelector((state) => state.bonus.coupon);
  const [totalPriceProducts, setTotalPriceProducts] = useState(0);
  const [totalOrder, setTotalOrder] = useState(0);
  const [couponValue, setCouponValue] = useState(0);
  const [shippingCharges, setShippingCharges] = useState(0);
  const [disableApplyCoupon, setDisableApplyCoupon] = useState(false);

  const messageErrorBonus = useSelector(
    (state) => state.bonus.messageErrorBonus
  );

  if (!userAuth) {
    dispatch(updateStateModal(true));
    navigate(ROUTES.HOME);
  }

  useEffect(() => {
    let cart = localStorage.getItem("cart")
      ? JSON.parse(localStorage.getItem("cart"))
      : [];
    const cartOfUser = [];
    cart.forEach((cartItem) => {
      if (cartItem.email === userAuth?.email) {
        cartOfUser.push(cartItem);
      }
    });
    cart = cartOfUser;
    setCart(cart);
  }, []);

  // }, [dispatch, navigate, userAuth]);

  const handleChange = (value) => {
    const shipping = value.target.value;

    const bonus = coupon?.data ? coupon?.data[0] : null;
    if (shipping === "shipping-free") {
      const price = 0;
      setShippingCharges(price);

      if (bonus?.is_percent === false) {
        const value = bonus.value;
        console.log({ value });
        setTotalOrder(totalPriceProducts - value);
      } else if (bonus?.is_percent === true) {
        const value = (totalPriceProducts * bonus.value) / 100;

        setTotalOrder(totalPriceProducts - value);
      }
      if (!bonus) {
        setTotalOrder(totalPriceProducts);
      }
    } else {
      const price = 20000;
      setShippingCharges(price);

      if (bonus?.is_percent === false) {
        const value = bonus.value;
        console.log({ value });
        setTotalOrder(totalPriceProducts - value + price);
      } else if (bonus?.is_percent === true) {
        const value = (totalPriceProducts * bonus.value) / 100;

        setTotalOrder(totalPriceProducts - value + price);
      }
      if (!bonus) {
        setTotalOrder(price + totalPriceProducts);
      }
    }
  };

  useEffect(() => {
    if (coupon) {
    }
  }, [coupon, totalOrder]);

  const handleBonus = (value) => {
    dispatch(getBonus(value));
  };

  useEffect(() => {
    if (coupon && coupon.data.length > 0) {
      setDisableApplyCoupon(true);
    } else {
      if (messageErrorBonus) {
        notification["error"]({
          message: "Error apply coupon",
          description: messageErrorBonus,
        });
        dispatch(setNullMessageCouponError());
      }
    }
  }, [coupon]);

  useEffect(() => {
    const totalAmount = cart.reduce((subTotalPrice, item) => {
      return item.total + subTotalPrice;
    }, 0);

    setTotalPriceProducts(totalAmount);
    console.log("RE-RENDER CART");
    setTotalOrder(totalAmount);
  }, [cart]);

  useEffect(() => {
    if (coupon) {
      const bonus = coupon.data[0];
      if (bonus?.start_date && bonus?.end_date) {
        if (totalPriceProducts >= bonus.total_amount_apply) {
          const currentDate = new Date();

          // if (currentDate >= bonus.start_date && currentDate < bonus.end_date) {

          const is_percent = bonus.is_percent;
          if (is_percent) {
            const remainAmount = totalOrder - (totalOrder * bonus.value) / 100;
            const bonusPrice = (totalOrder * bonus.value) / 100;

            setTotalOrder(remainAmount);
            setCouponValue(bonusPrice);
          } else {
            const remainAmount = totalOrder - bonus.value;
            setCouponValue(bonus.value);
            setTotalOrder(remainAmount);
          }
          // }
        }
      }
    }
  }, [totalPriceProducts, coupon]);

  const handleSubmit = (values) => {
    const info = values;
    const curDate = new Date();
    const email = userAuth.email;
    if (info.payment === "offline" && cart.length > 0) {
      const order = {
        id: uuidv4(),
        email: email,
        total: totalOrder,
        fullName: values.fullname,
        phone: values.phonenumber,
        address: values.address,
        note: values.note,
        shipping: values.shipping,
        created: curDate,
        status: "CREATED",
        product: cart.map((item) => item),
      };

      dispatch(orders(order));
      localStorage.removeItem("cart");
      localStorage.removeItem("quantity");
      navigate("/track-my-order");
      window.location.reload();
    }
  };

  const Column = [
    {
      title: "T??n s???m ph???m",
      dataIndex: "name",

      width: 400,
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
      title: "Gi?? s???n ph???m",
      dataIndex: "price",
      align: "center",
      width: 150,
      render: (_, record) => {
        return <h4>{formatMoney(record.price)}</h4>;
      },
    },
    {
      title: "M??u s???c",
      dataIndex: "color",
      align: "center",
      width: 130,
    },

    {
      title: "S??? l?????ng",
      dataIndex: "quantity",
      align: "center",
      width: 130,
    },
    {
      title: "Th??nh ti???n",
      dataIndex: "total",
      align: "center",
      width: 50,
      render: (_, record) => {
        return <h4>{formatMoney(record.total)}</h4>;
      },
    },
  ];

  return (
    <div>
      <Header />
      <div className="paymentPage">
        <div style={{ maxWidth: 1200 }}>
          <Form
            onFinish={(values) => handleSubmit(values)}
            className="inforuser"
            style={{ marginTop: 20, marginLeft: 20 }}
            name="wrap"
            layout="vertical"
            labelAlign="left"
            labelWrap
            wrapperCol={{
              flex: 1,
            }}
            colon={false}
          >
            <Form.Item
              label="H??? t??n"
              name="fullname"
              rules={[
                {
                  required: true,
                  message: "Vui l??ng nh???p h??? t??n",
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="S??? ??i???n tho???i"
              name="phonenumber"
              rules={[
                {
                  required: true,
                  message: "Vui l??ng nh???p s??? ??i???n tho???i",
                },
              ]}
            >
              <InputNumber style={{ width: "300px" }} />
            </Form.Item>

            <Form.Item
              label="?????a ch???"
              name="address"
              rules={[
                {
                  required: true,
                  message: "Vui l??ng nh???p ?????a ch???",
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item name="note" label="N???i dung ">
              <Input.TextArea />
            </Form.Item>

            <Form.Item name="bonus" label="M?? gi???m gi?? ">
              <Search
                placeholder="Nh???p m?? gi???m gi??"
                allowClear
                enterButton="Apply"
                size="large"
                onSearch={handleBonus}
                disabled={disableApplyCoupon}
              />
            </Form.Item>

            <Form.Item
              label="H??nh th???c giao h??ng"
              name="shipping"
              rules={[
                { required: true, message: "Vui l??ng ch???n c??ch giao h??ng!" },
              ]}
            >
              <Radio.Group onChange={(value) => handleChange(value)}>
                <Radio value={"shipping-free"}>Giao h??ng mi???n ph??</Radio>
                <Radio value={"shipping-wasteful"}>
                  Giao h??ng nhanh c?? ph??
                </Radio>
              </Radio.Group>
            </Form.Item>
            <Form.Item
              label="H??nh th???c thanh to??n"
              name="payment"
              rules={[
                { required: true, message: "Vui l??ng ch???n c??ch thanh to??n!" },
              ]}
            >
              <Radio.Group>
                <Radio value={"offline"}>Thanh to??n khi nh???n h??ng</Radio>
                <Radio value={"online"}>Thanh to??n tr???c tuy???n</Radio>
              </Radio.Group>
            </Form.Item>
            <Form.Item label=" ">
              <Button type="primary" htmlType="submit">
                Place Order
              </Button>
            </Form.Item>
          </Form>
        </div>
        <div className="computer" style={{ marginLeft: 20, marginTop: 20 }}>
          <Table
            columns={Column}
            rowKey="id"
            dataSource={cart}
            bordered
            pagination={false}
          ></Table>
          <br />
          <div style={{ display: "flex" }}>
            {" "}
            <h4> T???ng ti???n s???n ph???m: </h4>
            <span style={{ marginLeft: 20 }}>
              {formatMoney(totalPriceProducts)}
            </span>
          </div>
          <div style={{ display: "flex" }}>
            {" "}
            <h4> Ph?? v???n chuy???n: </h4>
            <span style={{ marginLeft: 20 }}>
              {formatMoney(shippingCharges)}
            </span>
          </div>
          <div style={{ display: "flex" }}>
            {" "}
            <h4> ???????c gi???m gi??: </h4>
            <span style={{ marginLeft: 20 }}>{formatMoney(couponValue)}</span>
          </div>
          <div style={{ display: "flex" }}>
            {" "}
            <h4> T???ng ti???n: </h4>
            <span style={{ marginLeft: 20 }}> {formatMoney(totalOrder)}</span>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Payment;
