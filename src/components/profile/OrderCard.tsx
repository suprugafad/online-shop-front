import React, { useState } from "react";
import { IOrder } from "../../types";
import { Card, CardContent, Typography, Button } from "@mui/material";
import { OrderDetails } from "./OrderDetails";

interface OrderCardProps {
  order: IOrder;
}

export const OrderCard: React.FC<OrderCardProps> = ({ order }) => {
  const [openDetails, setOpenDetails] = useState(false);

  const handleDetailsOpen = () => {
    setOpenDetails(true);
  };

  const handleDetailsClose = () => {
    setOpenDetails(false);
  };

  return (
    <>
      <Card onClick={handleDetailsOpen} style={{width: '250px', height: '130px', backgroundColor:'#ece8f5'}}>
        <CardContent>
          <Typography>#{order.id}</Typography>
          <Typography>{order.status[0].toUpperCase() + order.status.slice(1)}</Typography>
          <Typography>Created at: {order.createdAt}</Typography>
          <Typography>Total amount: {order.totalPrice}</Typography>
        </CardContent>
      </Card>
      <OrderDetails open={openDetails} onClose={handleDetailsClose} order={order} />
    </>
  );
};