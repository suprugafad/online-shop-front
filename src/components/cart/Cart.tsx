import React, { useEffect, useState } from "react";
import {
  Grid, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button,
  DialogTitle, DialogContent, DialogContentText, DialogActions, Dialog, Checkbox, Box, Snackbar, Alert, CircularProgress
} from "@mui/material";
import { ICartItem } from "../../types";
import CartItem from "./CartItem";
import CartAPI from "../../api/CartAPI";
import { getUserId } from "../../api/AuthAPI";
import QuantityInput from "./QuantityInput";
import {Link, useLocation, useNavigate} from "react-router-dom";

const CartApi = new CartAPI();

const Cart = () => {
  const [cartItems, setCartItems] = useState<ICartItem[]>([]);
  const [open, setOpen] = useState(false);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const location = useLocation();

  const successMessage = location.state && location.state.successMessage;

  useEffect(() => {
    if (successMessage) {
      setSnackbarOpen(true);
    }
  }, [successMessage]);

  function calculateTotal(cartItems: ICartItem[]) {
    let total = 0;

    if (selectedItems.length === 0) {
      cartItems.forEach((item: ICartItem) => {
        total += item.quantity * Number(item.product.price);
      });
    } else {
      cartItems.forEach((item: ICartItem) => {
        if (selectedItems.includes(item.id)) {
          total += item.quantity * Number(item.product.price);
        }
      });
    }

    return total;
  }

  function calculateTotalAmount(cartItems: ICartItem[]) {
    let total = 0;

    if (selectedItems.length === 0) {
      cartItems.forEach((item: ICartItem) => {
        total += item.quantity;
      });
    } else {
      cartItems.forEach((item: ICartItem) => {
        if (selectedItems.includes(item.id)) {
          total += item.quantity;
        }
      });
    }
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
    setTimeout(() => {
      setLoading(false);
    }, 500)

  }, []);

  const removeFromCartHandler = async (itemId: number) => {
    await CartApi.deleteCartItem(itemId);
    fetchCartItems().catch(() => {
    });
  };

  const checkoutHandler = async () => {
    let selectedCartItems = cartItems.filter(item => selectedItems.includes(item.id));
    if (selectedCartItems.length === 0) {
      selectedCartItems = cartItems;
    }

    const totalPrice = calculateTotal(cartItems);

    navigate('/checkout', {state: {selectedCartItems, totalPrice}});
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

  const clearCartHandler = async () => {
    const userId = await getUserId();
    const cartId = await CartApi.getCartId(userId);
    await CartApi.clearCart(cartId);
    setCartItems([]);
    setOpen(false);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleOrderItemsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const cartItemId = Number(event.target.value);

    if (selectedItems.includes(cartItemId)) {
      setSelectedItems(selectedItems.filter(id => id !== cartItemId));
    } else {
      setSelectedItems([...selectedItems, cartItemId]);
    }
  }

  if (loading) {
    return (
      <>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
          <CircularProgress />
        </Box>
      </>
    )
  }

  if (cartItems.length === 0) {
    return (
      <Box minHeight='650px' display='flex' alignItems='center' justifyContent='center'>
        <Box textAlign='center'>
        <Typography variant="h4"> Yours cart is empty </Typography>
        <Button component={Link} to='/catalog' variant={'contained'} style={{fontSize: '20px', marginTop: '40px'}}>Go to catalog</Button>
        </Box>
      </Box>
    )
  }

  return (
    <Grid container spacing={2} minHeight='630px' style={{display: 'flex', justifyContent: 'right', marginTop: '10px'}}>
      <Grid item xs={12}>
        <Grid item xs={12} style={{textAlign: 'center', marginBottom: '20px'}}>
          <Typography variant="h4">Cart</Typography>
        </Grid>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow style={{backgroundColor: '#ede3fc'}}>
                <TableCell style={{textAlign: 'center'}}></TableCell>
                <TableCell style={{fontSize: 'large', textAlign: 'center'}}>Product</TableCell>
                <TableCell align="right" style={{fontSize: 'large', textAlign: 'center'}}>Amount</TableCell>
                <TableCell align="right" style={{fontSize: 'large', textAlign: 'center'}}>Price</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {cartItems.map((item) => (
                <TableRow key={item.product.id}>
                  <TableCell component="th" scope="row" style={{maxWidth: '40px', textAlign: 'center'}}>
                    <Checkbox onChange={handleOrderItemsChange} value={item.id}
                              sx={{'& .MuiSvgIcon-root': {fontSize: 35}}}
                              style={{width: '30px', height: '30px', padding: '0'}}/>
                  </TableCell>
                  <TableCell component="th" scope="row" style={{maxWidth: '300px'}}>
                    <CartItem item={item} removeFromCartHandler={removeFromCartHandler}/>
                  </TableCell>
                  <TableCell align="right" style={{fontSize: 'large', textAlign: 'center'}}>
                    <QuantityInput item={item} onChange={(item: ICartItem, newQuantity: number) => handleQuantityChange(item, newQuantity)}/>
                  </TableCell>
                  <TableCell align="right" style={{fontSize: 'large', textAlign: 'center'}}>{(Number(item.product.price) * item.quantity)}$</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>
      <Grid item xs={12} style={{display: 'flex', justifyContent: 'space-between', maxWidth: '350px', alignItems: 'center'}}>
        <Typography variant="h6">Total {calculateTotalAmount(cartItems)} items </Typography>
        <Typography variant="h4"> {calculateTotal(cartItems)}$</Typography>
      </Grid>
      <Grid item xs={12} style={{display: 'flex', justifyContent: 'space-between', height: '70px'}}>
        <Button variant="outlined" color="primary" disabled={!(cartItems.length > 0)} onClick={handleOpen}>
          Clear cart
        </Button>
        <Button variant="contained" color="primary" style={{fontSize: "20px"}}
                onClick={() => checkoutHandler()}>
          Checkout order
        </Button>
      </Grid>
      <Dialog open={open} onClose={handleClose} aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description">
        <DialogTitle id="alert-dialog-title">
          Clear cart
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to clear your cart?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={clearCartHandler} color="primary" autoFocus>
            Clear
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbarOpen}
        onClose={() => setSnackbarOpen(false)}
        autoHideDuration={3000}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
      >
        <Alert onClose={() => setSnackbarOpen(false)} severity="success" sx={{ width: '100%' }}>
          Order successfully placed
        </Alert>
      </Snackbar>
    </Grid>
  );
};

export default Cart;

