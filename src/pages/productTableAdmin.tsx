import React, { useState, useEffect } from "react";
import ProductTable from "../components/productTable";
import axios from "axios";

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

interface Category {
  id: number;
  name: string;
}

const ProductPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);

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

        const categories = categoryIdResponse?.data.map((c: Category) => c.id) ?? null;

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

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`http://localhost:5000/api/products/${id}`);
      setProducts(products.filter((product: Product) => product.id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  const handleUpdate = async (updatedProduct: Partial<Product>) => {
    try {
      await axios.put(
        `http://localhost:5000/api/products/${updatedProduct.id}`,
        updatedProduct,
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      const newProducts = products.map((product: Product) =>
        product.id === updatedProduct.id ? { ...product, ...updatedProduct } : product
      );
      setProducts(newProducts);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div >
      <h1 style={{textAlign: "center"}}>Products</h1>
      <div style={{display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: '100%',}}>

        <ProductTable
          productsTable={products}
          handleDeleteTable={handleDelete}
          handleUpdateTable={handleUpdate}
        />
      </div>
    </div>
  );
};

export default ProductPage;