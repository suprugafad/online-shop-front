import React, { useState, useEffect } from "react";
import axios from "axios";
import {IOrderTable} from "../types";
import HeaderAdmin from "../components/admin/HeaderAdmin";
import OrdersTable from "../components/admin/orders/OrdersTable";

const OrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<IOrderTable[]>([]);

  const fetchOrders = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/orders/full_info');
      const orderData: IOrderTable[] = response.data.map(async (order: any) => {

        return {
          id: order.id,
          userId: order.userId,
          userEmail: order.userEmail,
          createdAt: order.createdAt,
          comment: order.comment,
          totalPrice: order.totalPrice,
          status: order.status,
          products: order.products,
          address: order.address,
          paymentMethod: order.paymentMethod,
          paymentStatus: order.paymentStatus,
        }
      });

      const orders = await Promise.all(orderData);

      setOrders(orders);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchOrders().catch(() => {});
  },[]);

  const handleUpdate = async (updatedOrder: Partial<IOrderTable>) => {
    try {
      await axios.put(`http://localhost:5000/api/orders/${updatedOrder.id}`, updatedOrder,
        { headers: { "Content-Type": "application/json" }});

      const paymentResponse = await axios.get(`http://localhost:5000/api/payments/order_id/${updatedOrder.id}`,
        { headers: { "Content-Type": "application/json" }});

      await axios.put(`http://localhost:5000/api/payments/${paymentResponse.data[0]._id}`, {status: updatedOrder.paymentStatus?.toLowerCase()},
        { headers: { "Content-Type": "application/json" }});

      const newOrder = orders.map((order: IOrderTable) =>
        order.id === updatedOrder.id ? { ...order, ...updatedOrder } : order
      );

      setOrders(newOrder);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div >
      <HeaderAdmin title="GameScape"/>
      <h1 style={{textAlign: "center"}}>Orders</h1>
      <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%', marginBottom: '80px'}}>
        <OrdersTable ordersTable={orders} handleUpdateTable={handleUpdate}/>
      </div>
    </div>
  );
};

export default OrdersPage;