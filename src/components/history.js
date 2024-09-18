import React, { useState, useEffect } from "react";
import axios from "axios";

const History = () => {
  const [orders, setOrders] = useState([]);
  const [menuItems, setMenuItems] = useState({});

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get("http://localhost:8000/order", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
          },
        });
        setOrders(response.data.data);
      } catch (error) {
        console.error(error);
      }
    };

    const fetchMenuItems = async () => {
      try {
        const response = await axios.get("http://localhost:8000/food", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
          },
        });
        const menuItemsData = {};
        response.data.data.forEach((item) => {
          menuItemsData[item.id_food] = item.name;
        });
        setMenuItems(menuItemsData);
      } catch (error) {
        console.error(error);
      }
    };

    fetchOrders();
    fetchMenuItems();
  }, []);

  const formatDetailOrder = (orderDetail) => {
    return orderDetail
      .map((detail) => {
        const itemName = menuItems[detail.id_food] || "Unknown Item";
        return `${itemName} (${detail.quantity})`;
      })
      .join(", ");
  };

  return (
    <div className="m-3 card text-sm px-12">
      <div className="card-header bg-info text-white">Data History Order</div>
      <div className="card-body">
        <table className="table-auto w-full">
          <thead>
            <tr className="bg-blue-700 text-white">
              <th className="border px-4 py-2 text-left">No</th>
              <th className="border px-4 py-2 text-left">Nama Customer</th>
              <th className="border px-4 py-2 text-left">Tanggal</th>
              <th className="border px-4 py-2 text-left">Tipe Order</th>
              <th className="border px-4 py-2 text-left">Detail Order</th>
              <th className="border px-4 py-2 text-left">Total Harga</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order, index) => (
              <tr
                key={order.id}
                className={index % 2 === 0 ? "bg-gray-100" : ""}
              >
                <td className="border px-4 py-2">{index + 1}</td>
                <td className="border px-4 py-2">{order.customer_name}</td>
                <td className="border px-4 py-2">{order.order_date}</td>
                <td className="border px-4 py-2">{order.order_type}</td>
                <td className="border px-4 py-2">
                  {formatDetailOrder(order.order_detail)}
                </td>
                <td className="border px-4 py-2">
                  {order.order_detail.reduce(
                    (total, detail) => total + (menuItems[detail.id_food]?.price || 0) * detail.quantity,
                    0
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default History;