import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import {Category, Product} from "../types";
import {
  Box,
  CircularProgress,
} from '@mui/material';
import {ProductDetails} from "../components/ProductDetails";

export const ProductDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);

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
        description: data._description,
        price: data._price,
        amount: data._amount,
        mainImage: data._mainImage,
        mainImageUrl: `http://localhost:5000/assets/images/products/${data._title}/${data._mainImage}`,
        additionalImages: data._additionalImages,
        categories: categories
      });
    };

    fetchProduct();
  }, [id]);

  if (!product) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    );
  }


  return <ProductDetails product={product} />;

};