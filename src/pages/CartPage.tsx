import React from "react";
import { Grid } from "@mui/material";
import Cart from "../components/cart/Cart";
import Header from "../components/Header";
import Footer from "../components/Footer";

const CartPage: React.FC = () => {

  return (
    <>
      <Header title={'GameScape'}></Header>
      <Grid container spacing={2} style={{padding: '20px 100px 60px 100px', minHeight: '850px'}}>
        <Grid item xs={12}>
          <Cart />
        </Grid>
      </Grid>
      <Footer></Footer>
    </>
  );
};

export default CartPage;