import {
  Card,
  CardContent,
  CardMedia,
  Grid,
  Pagination,
  Typography
} from "@mui/material";
import React, {useEffect, useState} from "react";
import axios from "axios";

interface Product {
  id: number;
  name: string;
  image: string;
  description: string;
  price: number;
}

const Products: React.FC = () => {
  const [page, setPage] = useState(1);
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get("http://localhost:5000/api/products");
      setProducts(response.data);
    };
    fetchData();
  }, []);

  const handleChangePage = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  const productsPerPage = 2;
  const startIndex = (page - 1) * productsPerPage;
  const endIndex = startIndex + productsPerPage;

  const currentProducts = products.slice(startIndex, endIndex);

  return (
    <>
      <Grid container spacing={2}>
        {currentProducts.map((product) => (
          <Grid item key={product.id} xs={12} sm={6} md={4}>
            <Card sx={{ maxWidth: 345 }}>
              <CardMedia sx={{ height: 140 }} image={product.image} title={product.name} />
              <CardContent>
                <Typography gutterBottom variant="h5" component="h2">
                  {product.name}
                </Typography>
                <Typography variant="body2" color="textSecondary" component="p">
                  {product.description}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      <Pagination count={Math.ceil(products.length / productsPerPage)} page={page} onChange={handleChangePage} />
    </>
  );
};

export default Products;