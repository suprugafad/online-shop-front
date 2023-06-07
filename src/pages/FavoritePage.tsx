import React, { useState, useEffect } from "react";
import {Product} from "../types";
import Header from "../components/Header";
import {FavoriteProducts} from "../components/FavoriteProducts";
import productAPI from "../api/ProductAPI";
import {getUserId} from "../api/AuthAPI";
import {Box} from "@mui/material";

const FavoritePage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [userId, setUserId] = useState<number>(0);

  useEffect(() => {
    fetchUserId().catch(() => {});
  }, []);

  useEffect(() => {
    if (userId !== 0) {
      fetchFavoriteProducts().catch(() => {});
    }
  }, [userId]);

  const fetchUserId = async () => {
    const userId = await getUserId();
    setUserId(userId);
  };

  const fetchFavoriteProducts = async () => {
    const products = await productAPI.getFavoriteProducts(userId)
    setProducts(products);
  };

  return (
    <>
      <Header title="GameScape"/>
      <h1 style={{textAlign: "center", marginTop: '40px'}}>Favorite games</h1>
      <Box style={{display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',}}>
        <Box style={{display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '80%',
          height: '100%',
          marginBottom: '80px'}}>
          <FavoriteProducts
            products={products}
            userId={userId}
          />
        </Box>
      </Box>
    </>
  );
};

export default FavoritePage;