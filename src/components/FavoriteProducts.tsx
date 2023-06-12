import React, {useEffect, useState} from "react";
import {Box, Button, CircularProgress, IconButton, Stack, Typography} from "@mui/material";
import {Product} from "../types";
import {ProductComponent} from "./catalog/ProductComponent";
import {Delete, ShoppingCartOutlined} from "@mui/icons-material";
import productAPI from "../api/ProductAPI";
import {Link} from "react-router-dom";

interface FavoriteProductsProps {
  products: Product[];
  userId: number;
}

export const FavoriteProducts: React.FC<FavoriteProductsProps> = ({ products, userId }) => {
  const [favoriteProducts, setFavoriteProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setFavoriteProducts(products);
    setTimeout(() => {
      setLoading(false);
    }, 300);
  }, [products]);

  const handleDeleteProduct = async (productId: number) => {
    try {
      await productAPI.deleteFavoriteItem(userId, productId);

      const updatedProducts = favoriteProducts.filter(
        (product) => product.id !== productId
      );

      setFavoriteProducts(updatedProducts);
    } catch (error) {
      console.log("Error on deleting product", error);
    }
  };

  const handleAddToCart = async (productId: number) => {
    try {
      await productAPI.addToCart(productId);

    } catch (error) {
      console.log("Error on deleting product", error);
    }
  };

  if (loading) {
    return (
      <>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
          <CircularProgress />
        </Box>
      </>
    )
  }

  if (favoriteProducts.length === 0) {
    return (
      <Box minHeight='650px' display='flex' alignItems='center' justifyContent='center'>
        <Box textAlign='center'>
          <Typography variant="h4"> Yours favorite list is empty </Typography>
          <Button component={Link} to='/catalog' variant={'contained'} style={{fontSize: '20px', marginTop: '40px'}}>Go to catalog</Button>
        </Box>
      </Box>
    )
  }

  return (
    <Stack
      sx={{
        width: "80%",
        flexDirection: "row",
        flexWrap: "wrap",
        marginTop: "20px",
      }}
    >
      {favoriteProducts?.map((product, index) => (
        <Box key={product.id}
           sx={{
             marginBottom: 2,
             position: "relative",

             marginRight: index % 3 === 2 ? 0 : "120px",
           }}
        >
          <ProductComponent
            id={product.id}
            title={product.title}
            price={product.price.toString()}
            mainImage={product.mainImage}
          />
          <IconButton
            sx={{
              position: "absolute",
              bottom: 20,
              left: 8,
            }}
            onClick={() => handleAddToCart(product.id)}
          >
            <ShoppingCartOutlined />
          </IconButton>
          <IconButton
            sx={{
              position: "absolute",
              bottom: 20,
              right: 8,
            }}
            onClick={() => handleDeleteProduct(product.id)}
          >
            <Delete />
          </IconButton>
        </Box>
      ))}
    </Stack>
  );
};