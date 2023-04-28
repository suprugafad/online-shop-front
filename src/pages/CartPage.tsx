import React, { useContext } from "react";
import { Grid, Typography } from "@mui/material";
import Cart from "../components/Cart";
import { CartContext } from "../components/CartContext";

const CartPage: React.FC = () => {
  const { cartItems, total, checkoutHandler } = useContext(CartContext);


  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Typography variant="h4">Cart</Typography>
      </Grid>
      <Grid item xs={12}>
        <Cart cartItems={cartItems} total={total} checkoutHandler={checkoutHandler} />
      </Grid>
    </Grid>
  );
};

export default CartPage;