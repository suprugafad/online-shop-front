import React from "react";
import {IOrder} from "../../types";
import {OrderCard} from "./OrderCard";
import {Box, Stack} from "@mui/material";

interface OrderHistoryProps {
  orders: IOrder[];
}

export const OrderHistory: React.FC<OrderHistoryProps> = ({ orders }) => {
  return (
    <Stack sx={{  width: '60%', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginTop: '20px' }}>
      {orders?.map((order) => (
        <Box key={order.id} sx={{  marginBottom: 2 }}>
          <OrderCard order={order} />
        </Box>
      ))}
    </Stack>
  );
};