import React from "react";
import { Card, CardActionArea, CardActions, CardContent, CardMedia, IconButton, Typography } from "@mui/material";
import RemoveShoppingCartIcon from "@mui/icons-material/RemoveShoppingCart";
import { ICartItem } from "../types";

interface CartItemProps {
  item: ICartItem;
  removeFromCartHandler: (itemId: number) => void;
}

const CartItem: React.FC<CartItemProps> = ({ item, removeFromCartHandler }) => {

  const handleRemoveFromCart = () => {
    removeFromCartHandler(item.id);
  };

  return (
      <Card sx={{ display: "flex", alignItems: "center", height: "200px" }}>
        <CardActionArea sx={{ display: "flex", alignItems: "center", width: "100%", height:'100%' }}>
          <CardMedia component="img" image={`http://localhost:5000/assets/images/products/${item.product.title}/${item.product.mainImage}`} title={item.product.title} sx={{ height:'80%', maxWidth: "200px", marginRight: "16px", marginLeft:'10px', objectFit: 'contain' }} />
          <CardContent sx={{ display: "flex", flexDirection: "column", flexGrow: 1 }}>
            <Typography variant="h5" component="h2" sx={{ marginBottom: "8px" }}>
              {item.product.title}
            </Typography>
            <Typography variant="h6" component="p">
              {item.product.price}$
            </Typography>
          </CardContent>
        </CardActionArea>
      <CardActions style={{margin: "0 30px 0 30px"}}>
        <IconButton onClick={handleRemoveFromCart} >
          <RemoveShoppingCartIcon />
        </IconButton>
      </CardActions>
    </Card>
  );
};

export default CartItem;