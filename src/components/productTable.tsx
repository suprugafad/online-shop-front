import React, { useState, useEffect } from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Modal
} from '@mui/material';
import axios from 'axios';
import UpdateProductForm from "./updateProductForm";

interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  mainImage: string | null;
  mainImageUrl: string | null;
  additionalImages: string[];
  categories: number[] | null;
}

interface ProductTableProps {
  productsTable: Product[];
  handleDeleteTable: (id: number) => Promise<void>;
  handleUpdateTable: (updatedProduct: Partial<Product>) => Promise<void>;
}

interface Category {
  id: number;
  name: string;
}

const ProductTable: React.FC<ProductTableProps> = ({ productsTable, handleDeleteTable, handleUpdateTable }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
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
          description: product._description,
          price: product._price,
          mainImage: product._mainImage,
          additionalImages: product._additionalImages,
          categories: categories,
        }
      });

      const products = await Promise.all(productData);

      setProducts(products);
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
    <div>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id}>
                <TableCell>{product.title}</TableCell>
                <TableCell>{product.description}</TableCell>
                <TableCell>{product.price}</TableCell>
                <TableCell>
                  <Button variant="contained" color="primary" onClick={() => handleOpen(product)} style={{marginRight:"0.5rem"}}>
                    Edit
                  </Button>
                  <Button variant="contained" color="secondary" onClick={() => handleDelete(product.id)}>
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

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