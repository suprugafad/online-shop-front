import React from "react";
import {Grid, Typography} from "@mui/material";
import Checkout from "../components/Checkout";
import {useLocation} from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";

const CheckoutPage: React.FC = () => {

  const location = useLocation();
  const selectedCartItems = location.state?.selectedCartItems || [];
  const totalPrice = location.state?.totalPrice || 0;

  return (
    <>
      <Header title={'GameScape'}></Header>
      <Grid container spacing={2} style={{padding: '30px', marginBottom: '20px'}}>
        <Grid item xs={12} style={{textAlign: 'center'}}>
          <Typography variant="h4">Order</Typography>
        </Grid>
        <Grid item xs={12} style={{display: "flex", justifyContent:'center', alignItems: 'center'}}>
          <Checkout selectedCartItems={selectedCartItems} totalPrice={totalPrice}/>
        </Grid>
      </Grid>
      <Footer></Footer>
    </>
  );
};

export default CheckoutPage;