import React from "react";
import { IOrder } from "../../types";
import { Dialog, DialogTitle, DialogContent, Typography, Stack, Button } from "@mui/material";

interface OrderDetailsProps {
  open: boolean;
  onClose: () => void;
  order: IOrder;
}

export const OrderDetails: React.FC<OrderDetailsProps> = ({ open, onClose, order }) => {
  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>ORDER DETAILS</DialogTitle>
      <DialogContent>
        <Stack spacing={2}>
          <Typography>#{order.id}</Typography>
          <Typography>{order.status[0].toUpperCase() + order.status.slice(1)}</Typography>
          <Typography>Created at: {order.createdAt}</Typography>
          <Typography>Total price: {order.totalPrice}</Typography>
          <Typography>Products:</Typography>
          <Stack spacing={1}>
            {order.products.map((item) => (
              <Typography key={item.id}>
                {item.title} - ${item.price} (amount: {item.quantity})
              </Typography>
            ))}
          </Stack>
          {/*<Typography>Информация о доставке: {order.deliveryInfo}</Typography>*/}
          {/*<Typography>Информация об оплате: {order.paymentInfo}</Typography>*/}
          <Button onClick={onClose}>Close</Button>
        </Stack>
      </DialogContent>
    </Dialog>
  );
};