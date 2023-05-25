import {Box, CircularProgress, Grid, Stack, Typography} from "@mui/material";
import {OrderCard} from "../../profile/OrderCard";
import React, {useEffect, useState} from "react";
import {IOrder, IUser} from "../../../types";
import profileAPI from "../../../api/ProfileAPI";

interface UserOrdersFormProps {
  user: IUser;
}

const UserOrdersForm: React.FC<UserOrdersFormProps> = ({ user }) => {
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchOrders = async () => {
    try {
      setIsLoading(true)
      const data = await profileAPI.fetchOrders(user.id);

      setOrders(data);
      setTimeout(() => {setIsLoading(false)}, 500)

    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchOrders().catch(() => {});
  }, []);

  return (
    <Grid container spacing={2}>
      {isLoading && (
        <Grid style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
          <CircularProgress/>
        </Grid>
      )}
      {!isLoading && orders && orders.length > 0 && (
        orders.map((order) => (
          <Grid item key={order.id} xs={12} sm={6} md={4}>
            <Box sx={{marginBottom: 2}}>
              <OrderCard order={order}/>
            </Box>
          </Grid>
        ))
      )}
      {!isLoading && orders.length === 0 && (
        <Grid item xs={12}>
          <Typography variant="body1" textAlign={'center'} marginBottom={'10px'}>No orders</Typography>
        </Grid>
      )}
    </Grid>
  );
}

export default UserOrdersForm;