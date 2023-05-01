import React, { useEffect, useState } from "react";
import { Grid, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button } from "@mui/material";
import { ICartItem } from "../types";
import CartItem from "./CartItem";
import CartAPI from "../api/CartAPI";
import { getUserId } from "../api/AuthAPI";
import QuantityInput from "./QuantityInput";

const CartApi = new CartAPI();

const Cart = () => {
  const [cartItems, setCartItems] = useState<ICartItem[]>([]);

  function calculateTotal (cartItems: ICartItem[]) {
    let total = 0;
    cartItems.forEach((product: ICartItem) => {
      total += product.quantity * Number(product.product.price);
    });
    return total;
  }

  async function fetchCartItems() {
    const userId = await getUserId();
    const cartId = await CartApi.getCartId(userId);
    const items = await CartApi.getCartItems(cartId);
    const products = await CartApi.getProducts(items);

    setCartItems(products);
  }

  useEffect(() => {
    fetchCartItems().catch(() => {});
  }, []);

  const removeFromCartHandler = async (itemId: number) => {
    await CartApi.deleteCartItem(itemId);
    fetchCartItems().catch(() => {});
  };

  const checkoutHandler = async (cartItems: ICartItem[]) => {

  };

  const updateQuantityHandler = async (cartProduct: ICartItem, newQuantity: number) => {
    const cartItem = {
      id: cartProduct.id,
      quantity: newQuantity,
    };
    await CartApi.updateCartItemQuantity(cartItem);
    const updatedCartItems = cartItems.map((item) => {
      if (item.product.id === cartProduct.product.id) {
        item.quantity = newQuantity;
      }
      return item;
    });
    setCartItems(updatedCartItems);
  };

  const handleQuantityChange = async (item: ICartItem, newQuantity: number) => {
    item.quantity = newQuantity;
    await updateQuantityHandler(item, newQuantity);
  };

  const clearCartHandler = async (cartItems: ICartItem[]) => {

  }

  return (
    <Grid container spacing={2} >
      <Grid item xs={12}>
        <TableContainer component={Paper}>
          <Table >
            <TableHead >
              <TableRow >
                <TableCell style={{fontSize: 'large', textAlign: 'center'}}>Product</TableCell>
                <TableCell align="right" style={{fontSize: 'large', textAlign: 'center'}}>Amount</TableCell>
                <TableCell align="right" style={{fontSize: 'large', textAlign: 'center'}}>Price</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {cartItems.map((item) => (
                <TableRow key={item.product.id}>
                  <TableCell component="th" scope="row" style={{maxWidth: '300px'}}>
                    <CartItem item={item} removeFromCartHandler={removeFromCartHandler} />
                  </TableCell>
                  <TableCell align="right" style={{ fontSize: 'large', textAlign: 'center' }}>
                    <QuantityInput item={item} onChange={(item: ICartItem, newQuantity: number) => handleQuantityChange(item, newQuantity)}/>
                  </TableCell>
                  <TableCell align="right" style={{fontSize: 'large', textAlign: 'center'}}>{(Number(item.product.price) * item.quantity)}$</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>
      <Grid item xs={12} style={{textAlign: 'right'}}>
        <Typography variant="h5">Total price: {calculateTotal(cartItems)}$</Typography>
      </Grid>
      <Grid item xs={12} style={{display: 'flex', justifyContent: 'space-between'}}>
        <Button variant="outlined" color="primary" onClick={() => checkoutHandler(cartItems)}>Clear cart</Button>
        <Button variant="contained" color="primary" onClick={() => clearCartHandler(cartItems)}>Checkout order</Button>
      </Grid>
    </Grid>
  );
};

export default Cart;

