import React, { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import {Box, CircularProgress, Container, FormControl, Grid, MenuItem, Pagination, Typography, Select, SelectChangeEvent} from '@mui/material';
import { ProductComponent } from './ProductComponent';
import { Product, Filters } from '../types';

const PRODUCTS_PER_PAGE = 12;

interface ProductCatalogProps {
  filters: Filters;
}

export const ProductCatalog: React.FC<ProductCatalogProps> = ({ filters}) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [totalProducts, setTotalProducts] = useState(0);
  const [page, setPage] = useState(1);
  const [filterPriceRange, setFilterPriceRange] = useState<number[]>([0, 1000]);
  const [noProductsFound, setNoProductsFound] = useState(false);
  const [sortOption, setSortOption] = useState('no');
  // const [loading, setLoading] = useState(false);

  const fetchProducts = useCallback(async (sortOption: string) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/products/paginated?page=${page}&limit=${PRODUCTS_PER_PAGE}&sort=${sortOption}`);
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

  const fetchProductsWithFilter = useCallback(async (sortOption: string) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/products/byFilterPaginated?page=${page}&limit=${PRODUCTS_PER_PAGE}&minPrice=${filters.priceRange[0]}&maxPrice=${filters.priceRange[1]}&manufacturers=${filters.manufacturers.join(',')}&categories=${filters.categories.join(',')}&sort=${sortOption}`);
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
      // setLoading(true);
      try {
        if (filters.manufacturers.length || filters.categories.length || filters.priceRange[0] !== 0 || filters.priceRange[1] !== 1000) {
          await fetchProductsWithFilter(sortOption);
        } else {
          await fetchProducts(sortOption);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } /*finally {
        setTimeout(() => {
          setLoading(false);
        }, 500)
      } */
    };

    fetchData().catch(() => {});
  }, [page, sortOption, filterPriceRange, filters, fetchProducts, fetchProductsWithFilter]);

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  const handleSortChange = (event: SelectChangeEvent<string>) => {
    setSortOption(event.target.value);
  };

  const totalPages = Math.ceil(totalProducts / PRODUCTS_PER_PAGE);

  useEffect(() => {
    setFilterPriceRange(filters.priceRange);
  }, [filters.priceRange]);

  // if (loading) {
  //   return (
  //     <>
  //       <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
  //         <CircularProgress />
  //       </Box>
  //     </>
  //   );
  // }

  return (
    <Box sx={{width: '100%', marginTop:'50px'}}>
      <Container maxWidth="lg">
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 2 }}>
          <FormControl variant="outlined" size="small">
            <Typography sx={{ marginRight: 1 }}>Sort by:</Typography>
            <Select
              value={sortOption}
              onChange={handleSortChange}
              label="Sort"
            >
              <MenuItem value="no">No</MenuItem>
              <MenuItem value="lowest-price">Lowest price</MenuItem>
              <MenuItem value="highest-price">Highest price</MenuItem>
              <MenuItem value="newest">Newest</MenuItem>
            </Select>
          </FormControl>
        </Box>
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