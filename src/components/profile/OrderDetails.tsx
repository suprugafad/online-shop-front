import React from "react";
import { IOrder } from "../../types";
import {Dialog, DialogTitle, DialogContent, Typography, Stack, Button, Box, Divider, Grid} from "@mui/material";

interface OrderDetailsProps {
  open: boolean;
  onClose: () => void;
  order: IOrder;
}

export const OrderDetails: React.FC<OrderDetailsProps> = ({ open, onClose, order }) => {
  return (
    <Dialog open={open} onClose={onClose} fullWidth >
      <DialogTitle style={{backgroundColor: '#7E52A0', color: 'white', textAlign:'center'}}>ORDER DETAILS</DialogTitle>
      <DialogContent style={{backgroundColor: '#ece8f5', paddingTop: '20px'}}>
        <Stack spacing={2} style={{width: '480px', margin: 'auto'}}>
          <Typography style={{fontSize: '18px', textAlign: 'center'}}>#{order.id}</Typography>
          <Divider/>
          <Box style={{display: 'flex', justifyContent: "space-between", alignItems: "center"}}>
            <Typography>Status: </Typography>
            <Typography  color={'#6a278a'}>{order.status[0].toUpperCase() + order.status.slice(1)}</Typography>
          </Box>
          <Box style={{display: 'flex', justifyContent: "space-between", alignItems: "center"}}>
            <Typography>Created at: </Typography>
            <Typography color='#6a278a'>{order.createdAt}</Typography>
          </Box>
          <Box style={{display: 'flex', justifyContent: "space-between", alignItems: "center"}}>
            <Typography>Total price: </Typography>
            <Typography  color='#6a278a'>{order.totalPrice}</Typography>
          </Box>
          <Divider/>
          <Typography>Products:</Typography>

          <Stack spacing={1}>
            {order.products.map((item) => (
              <Stack key={item.id} direction="row" alignItems="center" spacing={1} style={{justifyContent: 'space-between'}}>
                <Typography color='#6a278a'>
                  {item.title} - ${item.price} (amount: {item.quantity})
                </Typography>
              <Button variant='outlined'>Leave review</Button>
              </Stack>
            ))}
          </Stack>
          <Button onClick={onClose}>Close</Button>
        </Stack>
      </DialogContent>
    </Dialog>
  );
};