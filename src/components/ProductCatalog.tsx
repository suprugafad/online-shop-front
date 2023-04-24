import React, {useCallback, useEffect, useState} from 'react';
import axios from 'axios';
import { Box, Container, Grid, Pagination } from '@mui/material';
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

  const fetchProducts = useCallback(async () => {
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
  }, [page]);

  const fetchProductsWithFilter = useCallback(async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/products/byFilterPaginated?page=${page}&limit=${PRODUCTS_PER_PAGE}&minPrice=${filters.priceRange[0]}&maxPrice=${filters.priceRange[1]}&manufacturers=${filters.manufacturers.join(',')}&categories=${filters.categories.join(',')}`);
      const data = response.data.products.map((productInfo: { product: any, category_names: number[] }) => ({
        id: productInfo.product._id,
        title: productInfo.product._title,
        price: productInfo.product._price,
        mainImage: productInfo.product._mainImage,
      }));

      setProducts(data);
      const amount = parseInt(response.data.amount);
      setTotalProducts(amount);
      setNoProductsFound(amount === 0);
    } catch (error) {
      console.error(error);
    }
  }, [filters, page]);

  useEffect(() => {
    setPage(1);
  }, [filterPriceRange]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (filters.manufacturers.length || filters.categories.length || filters.priceRange[0] !== 0 || filters.priceRange[1] !== 1000) {
          await fetchProductsWithFilter();
        } else {
          await fetchProducts();
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData().catch(() => {});
  }, [page, filterPriceRange, filters, fetchProducts, fetchProductsWithFilter]);

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  const totalPages = Math.ceil(totalProducts / PRODUCTS_PER_PAGE);

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