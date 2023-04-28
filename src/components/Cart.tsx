import React, { useContext } from "react";
import { Grid, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button } from "@mui/material";
import { ProductCard } from "../types";
import { CartContext } from "./CartContext";
import CartItem from "./CartItem";

interface CartItem {
  product: ProductCard;
  quantity: number;
}

interface CartProps {
  cartItems: CartItem[];
  total: number;
  checkoutHandler: () => void;
}

const Cart: React.FC<CartProps> = ({ total }) => {
  const { cartItems, removeFromCart, checkoutHandler, addToCart } = useContext(CartContext);

  const handleAddToCart = (product: ProductCard) => {
    addToCart(product);
  };

  const removeFromCartHandler = async (product: ProductCard) => {
    removeFromCart(product);
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Title</TableCell>
                <TableCell align="right">Amount</TableCell>
                <TableCell align="right">Price</TableCell>
                <TableCell align="right">Delete</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {cartItems.map((item) => (
                <TableRow key={item.product.id}>
                  <TableCell component="th" scope="row">
                    <CartItem product={item.product} addToCartHandler={handleAddToCart} removeFromCartHandler={removeFromCart} />
                  </TableCell>
                  <TableCell align="right">{item.quantity}</TableCell>
                  <TableCell align="right">{item.product.price}</TableCell>
                  <TableCell align="right">
                    <Button variant="outlined" color="secondary" onClick={() => removeFromCartHandler(item.product)}>Удалить</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>
      <Grid item xs={12}>
        <Typography variant="h6">Total price: {total}</Typography>
      </Grid>
      <Grid item xs={12}>
        <Button variant="contained" color="primary" onClick={checkoutHandler}>Оформить заказ</Button>
      </Grid>
    </Grid>
  );
};

export default Cart;





// import React from "react";
// import { Grid, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button } from "@mui/material";
// import axios from "axios";
// import {Product} from "../types";
//
// interface CartItem {
//   product: Product;
//   quantity: number;
// }
//
// interface CartProps {
//   cartItems: CartItem[];
//   total: number;
// }
//
// const Cart: React.FC<CartProps> = ({ cartItems, total }) => {
//   const checkoutHandler = async () => {
//     try {
//       await axios.post("/api/checkout", { cartItems, total });
//       alert("Заказ успешно оформлен.");
//     } catch (error) {
//       console.error(error);
//     }
//   };
//
//   return (
//     <Grid container spacing={2}>
//       <Grid item xs={12}>
//         <Typography variant="h4">Корзина товаров</Typography>
//       </Grid>
//       <Grid item xs={12}>
//         <TableContainer component={Paper}>
//           <Table>
//             <TableHead>
//               <TableRow>
//                 <TableCell>Название товара</TableCell>
//                 <TableCell align="right">Количество</TableCell>
//                 <TableCell align="right">Цена</TableCell>
//               </TableRow>
//             </TableHead>
//             <TableBody>
//               {cartItems.map((item) => (
//                 <TableRow key={item.product.id}>
//                   <TableCell component="th" scope="row">
//                     {item.product.title}
//                   </TableCell>
//                   <TableCell align="right">{item.quantity}</TableCell>
//                   <TableCell align="right">{item.product.price}</TableCell>
//                 </TableRow>
//               ))}
//             </TableBody>
//           </Table>
//         </TableContainer>
//       </Grid>
//       <Grid item xs={12}>
//         <Typography variant="h6">Total price: {total}</Typography>
//       </Grid>
//       <Grid item xs={12}>
//         <Button variant="contained" color="primary" onClick={checkoutHandler}>Оформить заказ</Button>
//       </Grid>
//     </Grid>
//   );
// };
//
// export default Cart;