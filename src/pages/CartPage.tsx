import React from "react";
import { Grid, Typography } from "@mui/material";
import Cart from "../components/cart/Cart";

const CartPage: React.FC = () => {

  return (
    <Grid container spacing={2} style={{padding: '30px'}}>
      <Grid item xs={12} style={{textAlign: 'center'}}>
        <Typography variant="h4">Cart</Typography>
      </Grid>
      <Grid item xs={12}>
        <Cart />
      </Grid>
    </Grid>
  );
};

export default CartPage;