import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {Box, Container, Grid, Pagination} from '@mui/material';
import { ProductComponent } from './ProductComponent';
import { Product } from '../types'

const PRODUCTS_PER_PAGE = 12;

interface Filters {
  categories: string[];
  manufacturers: string[];
  priceRange: number[];
}

interface ProductCatalogProps {
  filters: Filters;
}

export const ProductCatalog: React.FC<ProductCatalogProps> = ({ filters }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [totalProducts, setTotalProducts] = useState(0);
  const [page, setPage] = useState(1);
  const [filterPriceRange, setFilterPriceRange] = useState<number[]>([0, 1000]);
  const [noProductsFound, setNoProductsFound] = useState(false);

  useEffect(() => {
    setPage(1);
  }, [filterPriceRange]);

  useEffect(() => {
    if (filters.manufacturers.length || filters.categories.length || filters.priceRange[0] !== 0 || filters.priceRange[1] !== 1000) {
      console.log('filter', filters.priceRange)
      fetchProductsWithFilter()
    }
    fetchProducts();
  }, [page, filterPriceRange]);

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/products/paginated?page=${page}&limit=${PRODUCTS_PER_PAGE}`);
      const products = response.data.products.map((product: any) => ({
        id: product._id,
        title: product._title,
        price: product._price,
        mainImage: product._mainImage,
      }));
      setProducts(products);
      const amount = parseInt(response.data.totalProducts);
      setTotalProducts(amount);
      setNoProductsFound(amount === 0);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchProductsWithFilter = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/products/byFilterPaginated?page=${page}&limit=${PRODUCTS_PER_PAGE}&minPrice=${filters.priceRange[0]}&maxPrice=${filters.priceRange[1]}&manufacturers=${filters.manufacturers.join(',')}`);

      const data = response.data.products.map((product: any) => ({
        id: product._id,
        title: product._title,
        price: product._price,
        mainImage: product._mainImage,
      }));
      setProducts(data);
      console.log(response)
      const amount = parseInt(response.data.amount);
      console.log('amount', amount)
      setTotalProducts(amount);
      setNoProductsFound(amount === 0);
    } catch (error) {
      console.error(error);
    }
  };

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  const totalPages = Math.ceil(totalProducts / PRODUCTS_PER_PAGE);
  console.log(totalPages)
  console.log(totalProducts)

  useEffect(() => {
    setFilterPriceRange(filters.priceRange);
  }, [filters.priceRange]);

  return (
    <Box sx={{width: '100%', marginTop:'50px'}}>
      <Container maxWidth="lg">
        {noProductsFound ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', fontSize: '2rem', fontWeight: 'bold', marginTop: '3rem' }}>
            No products found
          </Box>
        ) : (
          <Grid container spacing={2}>
            {products.map((product) => (
              <Grid item xs={12} sm={6} md={4} key={product.id} >
                <ProductComponent
                  id={product.id}
                  title={product.title}
                  price={String(product.price) + `$`}
                  mainImage={product.mainImage}
                />
              </Grid>
            ))}
          </Grid>)}
      </Container>
      <Box my={2} display="flex" justifyContent="center">
        <Pagination count={totalPages} page={page} onChange={handlePageChange} sx={{ marginTop: 4, marginBottom: 4, display: 'flex', justifyContent: 'center' }} />
      </Box>
    </Box>
  );
};