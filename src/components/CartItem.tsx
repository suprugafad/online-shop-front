import React from "react";
import { Card, CardActionArea, CardActions, CardContent, CardMedia, IconButton, Typography } from "@mui/material";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import RemoveShoppingCartIcon from "@mui/icons-material/RemoveShoppingCart";
import { ProductCard } from "../types";

interface CartItemProps {
  product: ProductCard;
  addToCartHandler: (product: ProductCard) => void;
  removeFromCartHandler: (product: ProductCard) => void;
}

const CartItem: React.FC<CartItemProps> = ({ product, addToCartHandler, removeFromCartHandler }) => {
  const handleAddToCart = () => {
    addToCartHandler(product);
  };

  const handleRemoveFromCart = () => {
    removeFromCartHandler(product);
  };

  return (
    <Card>
      <CardActionArea>
        <CardMedia component="img" image={product.mainImage} title={product.title} />
        <CardContent>
          <Typography gutterBottom variant="h5" component="h2">
            {product.title}
          </Typography>
          <Typography variant="h6" component="p">
            {product.price} руб.
          </Typography>
        </CardContent>
      </CardActionArea>
      <CardActions>
        <IconButton onClick={handleAddToCart}>
          <AddShoppingCartIcon />
        </IconButton>
        <IconButton onClick={handleRemoveFromCart}>
          <RemoveShoppingCartIcon />
        </IconButton>
      </CardActions>
    </Card>
  );
};

export default CartItem;