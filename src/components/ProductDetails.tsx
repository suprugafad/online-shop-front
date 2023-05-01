import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button, Typography, Box } from '@mui/material';
import { NavigateBefore, NavigateNext } from '@mui/icons-material';
import { Product, Category } from '../types';

type ProductDetailsProps = {
  product: Product;
};

export const ProductDetails: React.FC<ProductDetailsProps> = ({ product }) => {
  const [productCategories, setProductCategories] = useState<Category[]>([]);
  const isAvailable = product.amount > 0;
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  useEffect(() => {
    fetchProductCategories(product.id).catch(() => {});
  }, [product.id]);

  const fetchProductCategories = async (productId: number) => {
    try {
      const categoryIds = await axios.get(`http://localhost:5000/api/productCategories/product_id/${productId}`);
      const productCategories = categoryIds.data.map((categoryId: any) => categoryId._categoryId);

      const categories: Category[] = [];

      for (const id of productCategories) {
        const response = await axios.get(`http://localhost:5000/api/categories/${id}`);
        const category = {id: response.data._id, name: response.data._name};

        categories.push(category);
      }

      setProductCategories(categories);
    } catch (error) {
      console.error(error);
    }
  };

  const handlePrevImage = () => {
    setActiveImageIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : product.additionalImages.length));
  };

  const handleNextImage = () => {
    setActiveImageIndex((prevIndex) => (prevIndex + 1) % (product.additionalImages.length + 1));
  };

  const handleThumbnailClick = (index: number) => {
    setActiveImageIndex(index);
  };

  const handleAddToCart = async () => {
    try {
      const userData = await axios.get('http://localhost:5000/api/auth/userId', { withCredentials: true });
      console.log(userData);
      const userId = userData.data.userId;
      const response = await axios.get(`http://localhost:5000/api/carts/${userId}`, { withCredentials: true });
      console.log(response)
      await axios.post(`http://localhost:5000/api/cartItems`, {
        productId: product.id,
        cartId: response.data._id,
        quantity: 1,
      }, { withCredentials: true });

    } catch (error) {
      console.error(error);
    }
  };

  const renderThumbnails = () => {
    if (!product.additionalImages || product.additionalImages.length === 0) {
      return null;
    }
    const images = [product.mainImageUrl, ...product.additionalImages || []].map((img, index) => (
      <div
        key={`thumbnail-${index}`}
        style={{
        height: '65px',
        width: '65px',
        margin: '5px',
        cursor: 'pointer',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        border: activeImageIndex === index ? '2px solid #3f51b5' : 'none',
      }} onClick={() => handleThumbnailClick(index)}>
        <img
          src={img === product.mainImageUrl ? img : `http://localhost:5000/assets/images/products/${product.title}/${img}`}
          alt={`${product.title}-${img}`}
          style={{
            maxHeight: '60px',
            maxWidth: '60px',
            objectFit: 'contain',
          }}
        />
      </div>
    ));

    return <Box display="flex" justifyContent="center" alignItems="center" flexWrap="wrap">{images}</Box>;
  };

  const hasAdditionalImages = product.additionalImages && product.additionalImages.length > 0;

  const renderCarousel = () => {
    const images = [product.mainImageUrl, ...product.additionalImages || []].map((img, index) => (
      <img
        key={`image-${index}`}
        src={img === product.mainImageUrl ? img : `http://localhost:5000/assets/images/products/${product.title}/${img}`}
        alt={`${product.title}-${img}`}
        style={{ display: index === activeImageIndex ? 'block' : 'none', maxHeight: '400px', maxWidth: '400px', objectFit: 'contain' }}
      />
    ));

    return (
      <Box position="relative" sx={{"justifyContent": 'center', "alignItems": "center", "display": "fex"}}>
        <Box
          maxWidth="70%"
          sx={{
            width: '400px',
            height: '400px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          {images}
          {hasAdditionalImages && (
            <>
              <div
                onClick={handlePrevImage}
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: 0,
                  transform: 'translateY(-50%)',
                  zIndex: 1,
                  backgroundColor: 'rgba(255, 255, 255, 0.7)',
                  cursor: 'pointer',
                  padding: '10px',
                  borderRadius: '50%'
                }}
              >
                <NavigateBefore />
              </div>
              <div
                onClick={handleNextImage}
                style={{
                  position: 'absolute',
                  top: '50%',
                  right: 0,
                  transform: 'translateY(-50%)',
                  zIndex: 1,
                  backgroundColor: 'rgba(255, 255, 255, 0.7)',
                  cursor: 'pointer',
                  padding: '10px',
                  borderRadius: '50%'
                }}
              >
                <NavigateNext />
              </div>
            </>
          )}
        </Box>
      </Box>
    );
  };

  return (
    <Box style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: '100px', marginLeft: '30px', marginRight:'30px' }}>
      <div style={{ flex: '0 0 40%', marginRight: '50px' }}>
        {renderCarousel()}
        {renderThumbnails()}
      </div>
      <div style={{ flex: '0 0 50%' }}>
        <Typography gutterBottom variant="h5" component="div">
          {product.title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {product.description}
        </Typography>
        <Box mt={2}>
          <Typography variant="h6" color="text.primary">
            ${product.price.toFixed(2)}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {isAvailable ? 'In stock' : 'Out of stock'}
          </Typography>
        </Box>
        <Box mt={2}>
          <Typography variant="subtitle1" color="text.primary">
            Categories:
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {productCategories.map((category) => category.name).join(', ')}
          </Typography>
        </Box>
        <Box mt={2}>
          <Button variant="contained" color="primary" disabled={!isAvailable} onClick={handleAddToCart}>
            Add to cart
          </Button>
        </Box>
      </div>
    </Box>
  );
};