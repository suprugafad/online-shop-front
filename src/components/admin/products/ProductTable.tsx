import React, { useState, useEffect } from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Modal, Grid, CircularProgress
} from '@mui/material';
import axios from 'axios';
import UpdateProductForm from "./UpdateProductForm";
import { Category, Product } from "../../../types";

interface ProductTableProps {
  productsTable: Product[];
  handleDeleteTable: (id: number) => Promise<void>;
  handleUpdateTable: (updatedProduct: Partial<Product>) => Promise<void>;
}

const ProductTable: React.FC<ProductTableProps> = ({ productsTable, handleDeleteTable, handleUpdateTable }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get('http://localhost:5000/api/products');
      const productData = response.data.map(async (product: any) => {
        let categoryIdResponse;

        try {
          categoryIdResponse = await axios.get(`http://localhost:5000/api/productCategories/product_id/${product._id}`);
        } catch (error) {
          console.error(error);
        }

        let categories: number[] | null = null;

        if (categoryIdResponse && categoryIdResponse.data) {
          categories = categoryIdResponse.data.map((c: Category) => c.id);
        }

        return {
          id: product._id,
          title: product._title,
          manufacturer: product._manufacturer,
          description: product._description,
          price: product._price,
          amount: product._amount,
          mainImage: product._mainImage,
          additionalImages: product._additionalImages,
          categories: categories,
        }
      });

      const products = await Promise.all(productData);

      setProducts(products);

      setIsLoading(false)
    } catch (error) {
      console.error(error);
    }
  };

  const handleOpen = (product: Product) => {
    setSelectedProduct(product);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleDelete = async (productId: number) => {
    try {
      await axios.delete(`http://localhost:5000/api/products/${productId}`);
      fetchProducts();
    } catch (error) {
      console.error(error);
    }
  };

  const handleUpdate = async (updatedProduct: Partial<Product>) => {
    try {
      await axios.put(`http://localhost:5000/api/products/${updatedProduct.id}`, updatedProduct);
      fetchProducts();
      handleClose();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div style={{width: '70%'}}>
      {isLoading && (
        <Grid style={{ width: '100%',height: '700px', display: 'flex', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
          <CircularProgress/>
        </Grid>
      )}
      {!isLoading && (
      <TableContainer component={Paper}>
        <Table >
          <TableHead>
            <TableRow style={{backgroundColor: '#ece8f5'}}>
              <TableCell style={{textAlign: 'center'}}>Title</TableCell>
              <TableCell style={{textAlign: 'center'}}>Manufacturer</TableCell>
              <TableCell style={{textAlign: 'center'}}>Price</TableCell>
              <TableCell style={{textAlign: 'center'}}>Amount</TableCell>
              <TableCell style={{textAlign: 'center'}}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id}>
                <TableCell style={{textAlign: 'center'}}>{product.title}</TableCell>
                <TableCell style={{textAlign: 'center'}}>{product.manufacturer}</TableCell>
                <TableCell style={{textAlign: 'center'}}>{product.price}</TableCell>
                <TableCell style={{textAlign: 'center'}}>{product.amount || 0}</TableCell>
                <TableCell style={{textAlign: 'center'}}>
                  <Button variant="contained" color="primary" onClick={() => handleOpen(product)} style={{marginRight:"0.5rem"}}>
                    Edit
                  </Button>
                  <Button variant="outlined" color="secondary" onClick={() => handleDelete(product.id)}>
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
        )}

      <Modal open={open} onClose={handleClose} style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: '100%',
        overflow: 'auto',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: 9999,
      }} >
        <div style={{ backgroundColor: '#fff',
          padding: '20px',
          borderRadius: '5px',
          boxShadow: '0 0 10px rgba(0, 0, 0, 0.3)',
          maxWidth: '70%',
          maxHeight: '90%',
          overflow: 'auto',
          boxSizing: 'border-box', }}>
          {selectedProduct && (
            <UpdateProductForm product={selectedProduct} onUpdate={handleUpdate} />
          )}
        </div>
      </Modal>
    </div>
  );
};

export default ProductTable;