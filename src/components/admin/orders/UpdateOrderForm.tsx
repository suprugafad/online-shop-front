import {IOrderTable, OrderStatus, PaymentStatus} from "../../../types";
import React, {FormEvent, useState} from "react";
import {
  Box,
  Button,
  DialogTitle,
  Divider,
  Grid,
  IconButton,
  MenuItem,
  Stack,
  TextField,
  Typography
} from "@mui/material";
import EmailIcon from '@mui/icons-material/Email';

interface UpdateOrderFormProps {
  order: IOrderTable;
  onUpdate: (updatedOrder: Partial<IOrderTable>) => void;
}

const UpdateOrderForm: React.FC<UpdateOrderFormProps> = ({ order, onUpdate }) => {
  const [status, setStatus] = useState<string>(order.status);
  const [paymentStatus, setPaymentStatus] = useState<string>(order.paymentStatus);

  const statuses = [OrderStatus.PENDING, OrderStatus.CONFIRMED, OrderStatus.SHIPPED, OrderStatus.DELIVERED, OrderStatus.CANCELLED ];
  const paymentStatuses = [PaymentStatus.PENDING, PaymentStatus.PAID, PaymentStatus.CANCELLED];

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const updatedOrder = {
      id: order.id,
      userId: order.userId,
      totalPrice: order.totalPrice,
      status,
      paymentStatus,
    };

    onUpdate(updatedOrder);
  };

  const handleStatusChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setStatus(event.target.value);
  };

  function handlePaymentStatusChange(event: React.ChangeEvent<HTMLInputElement>) {
    setPaymentStatus(event.target.value);
  }

  return (
    <div style={{ position: 'relative' }}>
      <form onSubmit={handleSubmit} style={{border: 'solid 2px #7E52A0', width: '450px', position: 'relative', zIndex: 1}}>
        <DialogTitle style={{backgroundColor: '#7E52A0', color: 'white', textAlign:'center'}}>Order #{order.id}</DialogTitle>
        <Typography style={{fontSize: '18px', textAlign: 'center'}}></Typography>
        <Divider></Divider>
        <Box style={{ height: '50px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '15px' }}>
          <Typography>User email:</Typography>
          <Box display="flex" alignItems="center">
            <Typography color="#6a278a">{order.userEmail}</Typography>
            <IconButton
              onClick={() => {
                window.location.href = `mailto:${order.userEmail}`;
              }}
              style={{ marginLeft: '0.5rem' }}
            >
              <EmailIcon />
            </IconButton>
          </Box>
        </Box>
        <Box style={{height: '50px', display: 'flex', justifyContent: "space-between", alignItems: "center", margin: '15px'}}>
          <Typography>Created at: </Typography>
          <Typography color='#6a278a'>{order.createdAt}</Typography>
        </Box>
        <Grid item xs={12} style={{zIndex: 999, margin: '0 15px 0 15px'}}>
          <TextField
            select
            label="Order status"
            value={status.toUpperCase()}
            onChange={handleStatusChange}
            fullWidth
          >
            {statuses.map((status) => (
              <MenuItem key={status} value={status} >
                {status}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item xs={12} style={{zIndex: 999, margin: '20px 15px 0 15px'}}>
          <TextField
            select
            label="Payment status"
            value={paymentStatus.toUpperCase()}
            onChange={handlePaymentStatusChange}
            fullWidth
          >
            {paymentStatuses.map((paymentStatus) => (
              <MenuItem key={paymentStatus} value={paymentStatus} >
                {paymentStatus}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Typography style={{margin: '15px'}}>Products:</Typography>
        <Stack spacing={1}>
          {order.products.map((item) => (
            <Typography key={item.id} style={{margin: '0 15px 20px 15px'}} color='#6a278a'>
              {item.title} - ${item.price} (amount: {item.quantity})
            </Typography>
          ))}
        </Stack>
        <Divider/>
        <Box style={{display: 'flex', justifyContent: "space-between", alignItems: "center", margin: '15px'}}>
          <Typography>Total price: </Typography>
          <Typography  color='#6a278a'>{order.totalPrice}</Typography>
        </Box>
        <Box style={{display: 'flex', justifyContent: "space-between", alignItems: "center", marginBottom: '20px'}}>
          <Button type="submit" variant="contained" sx={{ py: '0.8rem', mt: 2, width: '50%', margin: 'auto'}}>
            Update order
          </Button>
        </Box>
      </form>
    </div>
  );
}

export default UpdateOrderForm;