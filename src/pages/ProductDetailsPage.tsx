import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import {Category, Product} from "../types";
import {Box, CircularProgress} from '@mui/material';
import {ProductDetails} from "../components/catalog/ProductDetails";
import Header from "../components/Header";
import Footer from "../components/Footer";
import {getUserId} from "../api/AuthAPI";

export const ProductDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [userId, setUserId] = useState<number>(0);

  useEffect(() => {
    const fetchProduct = async () => {
      const response = await axios.get(`http://localhost:5000/api/products/${id}`);
      const data = response.data;
      let categoryIdResponse;

      try {
        categoryIdResponse = await axios.get(`http://localhost:5000/api/productCategories/product_id/${data._id}`);
      } catch (error) {
        console.error(error);
      }

      let categories: number[] | null = null;

      if (categoryIdResponse && categoryIdResponse.data) {
        categories = categoryIdResponse.data.map((c: Category) => c.id);
      }
      setProduct({
        id: data._id,
        title: data._title,
        manufacturer: data._manufacturer,
        description: data._description,
        price: data._price,
        amount: data._amount,
        mainImage: data._mainImage,
        mainImageUrl: `http://localhost:5000/assets/images/products/${data._title}/${data._mainImage}`,
        additionalImages: data._additionalImages,
        categories: categories
      });
    };

    fetchProduct().catch(() => {});
    fetchUserId().catch(() => {});
  }, [id]);

  const fetchUserId = async () => {
    const userId = await getUserId();
    setUserId(userId);
  }

  if (!product) {
    return (
      <>
        <Box display="flex" justifyContent="center" alignItems="center" height="100%">
          <CircularProgress />
        </Box>
      </>
    );
  }

  return (
    <>
      <Header title={'GameScape'}></Header>
      <Box minHeight={'730px'}>
        <ProductDetails product={product} userId={userId} />
      </Box>
      <Footer></Footer>
    </>
  );

};