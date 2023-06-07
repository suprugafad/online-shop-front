import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {Button, Typography, Box, Divider, Modal, Checkbox} from '@mui/material';
import {Favorite, FavoriteBorder, NavigateBefore, NavigateNext} from '@mui/icons-material';
import {Product, Category, IReview} from '../../types';
import {Rating} from "@mui/material";
import ReviewForm from "../reviews/ReviewForm";
import reviewApi from "../../api/ReviewApi";
import EditReviewForm from "../reviews/UpdateReviewForm";
import productAPI from "../../api/ProductAPI";
import {checkAuthentication} from "../../api/AuthAPI";

const label = { inputProps: { 'aria-label': 'Checkbox demo' } };

type ProductDetailsProps = {
  product: Product;
  userId: number;
};

export const ProductDetails: React.FC<ProductDetailsProps> = ({ product, userId }) => {
  const [productCategories, setProductCategories] = useState<Category[]>([]);
  const isAvailable = product.amount > 0;
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [reviews, setReviews] = useState<IReview[]>([]);
  const [open, setOpen] = useState<boolean>(false);
  const [openEdit, setOpenEdit] = useState<boolean>(false);
  const [availableToLeave, setAvailableToLeave] = useState<boolean>(false);
  const [review, setReview] = useState<IReview | null>(null);
  const [availableToEdit, setAvailableToEdit] = useState<boolean>(false);
  const [isFavorite, setIsFavorite] = useState<boolean>(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    fetchAuth().catch(() => {});
  }, []);

  useEffect(() => {
    fetchProductCategories().catch(() => {});
    fetchProductReviews().catch(() => {});

    if (isAuthenticated) {
      fetchLeavingComment().catch(() => {});
      fetchIsFavoriteItem().catch(() => {});
    }
  }, [product.id, isAuthenticated]);

  const fetchAuth = async () => {
    const response = await checkAuthentication();

    if (response && response.data.isAuthenticated) {
      setIsAuthenticated(true);
    }
  }

  const fetchLeavingComment = async () => {
    try {
      const leave = await reviewApi.isUserBoughtProduct(product.id, userId);

      if (leave) {
        const review = await reviewApi.fetchProductReviewsByUserId(product.id, userId);

        if (review && review.id) {
          setReview(review);
          setAvailableToLeave(false);
          setAvailableToEdit(true);
        } else {
          setAvailableToLeave(true);
        }
      }

    } catch (error) {
      console.error(error);
    }
  }

  const fetchProductCategories = async () => {
    const categories = await productAPI.getProductCategories(product.id);

    if (categories) {
      setProductCategories(categories);
    }
  };

  const fetchProductReviews = async () => {
    const reviews = await reviewApi.getProductReviews(product.id);
    setReviews(reviews);
  };

  const fetchIsFavoriteItem = async () => {
    const isFavoriteItem = await productAPI.isFavoriteItem(userId, product.id);
    console.log(isFavoriteItem)
    setIsFavorite(isFavoriteItem);
  }

  const handlePrevImage = () => {
    setActiveImageIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : product.additionalImages.length));
  };

  const handleNextImage = () => {
    setActiveImageIndex((prevIndex) => (prevIndex + 1) % (product.additionalImages.length + 1));
  };

  const handleThumbnailClick = (index: number) => {
    setActiveImageIndex(index);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    fetchProductReviews().catch(() => {});
    fetchLeavingComment().catch(() => {});
  };

  const handleAddToCart = async () => {
    await productAPI.addToCart(product.id);
  };

  const handleUpdate = async (updatedReview: Partial<IReview>) => {
    try {
      await axios.put(`http://localhost:5000/api/reviews/${updatedReview.id}`, updatedReview);

      fetchProductReviews().catch(() => {});
      fetchLeavingComment().catch(() => {});

      handleCloseEdit();
    } catch (error) {
      console.error(error);
    }
  };

  const handleCloseAddReview = () => {
    setOpen(false);
    fetchProductReviews().catch(() => {});
    fetchLeavingComment().catch(() => {});
  }

  function handleOpenEdit() {
    setOpenEdit(true);
  }

  function handleCloseEdit() {
    setOpenEdit(false);
    fetchProductReviews().catch(() => {});
    fetchLeavingComment().catch(() => {});
  }

  const handleFavoriteItem = async () => {

    if (isFavorite) {
      await productAPI.deleteFavoriteItem(userId, product.id);
    } else {
      await productAPI.addFavoriteItem(userId, product.id);
    }
    console.log(isFavorite)

    setIsFavorite(!isFavorite);
  };

  const renderReviews = () => {
    if (!reviews || reviews.length === 0) {
      return <Typography variant="body2" color="text.secondary" marginTop={'10px'}>No reviews available</Typography>;
    }

    return reviews.map((review) => (
      <div key={review.id} style={{border: 'solid 2px #7E52A0', width: '600px', borderRadius: '10px', padding: '15px', margin: '20px 0 20px 0', backgroundColor: 'rgb(247,245,253)'}}>
        <Rating value={review.rating} readOnly />
        <Box style={{display: "flex", justifyContent: 'space-between'}}>
          <Typography variant="body1" color="text.secondary">User #{review.userId}</Typography>
          <Typography variant="body1" color="text.secondary">01.10.1001</Typography>
        </Box>
        <Divider/>
        <Typography variant="body1" color="text.primary" style={{marginTop: '10px'}}>{review.comment}</Typography>
      </div>
    ));
  };

  const renderThumbnails = () => {
    if (!product.additionalImages || product.additionalImages.length === 0) {
      return null;
    }

    const images = [product.mainImageUrl, ...product.additionalImages || []].map((img, index) => (
      <div key={`thumbnail-${index}`} style={{height: '65px', width: '65px', margin: '5px', cursor: 'pointer', display: 'flex', justifyContent: 'center',
        alignItems: 'center', border: activeImageIndex === index ? '2px solid #7E52A0' : 'none', borderRadius: '5px'}} onClick={() => handleThumbnailClick(index)}>
        <img src={img === product.mainImageUrl ? img : `http://localhost:5000/assets/images/products/${product.title}/${img}`}
          alt={`${product.title}-${img}`} style={{maxHeight: '60px', maxWidth: '60px', objectFit: 'contain',
          }}
        />
      </div>
    ));

    return <Box display="flex" justifyContent="center" alignItems="center" flexWrap="wrap">{images}</Box>;
  };

  const hasAdditionalImages = product.additionalImages && product.additionalImages.length > 0;

  const renderCarousel = () => {
    const images = [product.mainImageUrl, ...product.additionalImages || []].map((img, index) => (
      <img key={`image-${index}`}
        src={img === product.mainImageUrl ? img : `http://localhost:5000/assets/images/products/${product.title}/${img}`}
        alt={`${product.title}-${img}`}
        style={{ display: index === activeImageIndex ? 'block' : 'none', maxHeight: '400px', maxWidth: '400px', objectFit: 'contain' }}
      />
    ));

    return (
      <Box position="relative" sx={{"justifyContent": 'center', "alignItems": "center", "display": "fex"}}>
        <Box maxWidth="70%" sx={{width: '400px', height: '400px', display: 'flex', justifyContent: 'center', alignItems: 'center',}}>
          {images}
          {hasAdditionalImages && (
            <>
              <div onClick={handlePrevImage} style={{position: 'absolute', display: 'flex', alignItems: 'center', justifyContent: 'center', top: '50%', left: 0, transform: 'translateY(-50%)',
                  zIndex: 1, backgroundColor: 'rgba(126,82,160,0.49)', cursor: 'pointer', padding: '10px', borderRadius: '50%', width: '40px', height: '40px', textAlign: 'center'}}>
                <NavigateBefore />
              </div>
              <div
                onClick={handleNextImage}
                style={{ position: 'absolute', display: 'flex', alignItems: 'center', top: '50%', right: 0, transform: 'translateY(-50%)', zIndex: 1, backgroundColor: 'rgba(126,82,160,0.49)',
                  cursor: 'pointer', padding: '10px', borderRadius: '50%', width: '40px', height: '40px', textAlign: 'center'}}>
                <NavigateNext />
              </div>
            </>
          )}
        </Box>
      </Box>
    );
  };

  return (
    <>
      <Box>
        <Box style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: '100px', marginLeft: '30px', marginRight:'30px' }}>
          <div style={{ flex: '0 0 40%', marginRight: '50px' }}>
            {renderCarousel()}
            {renderThumbnails()}
          </div>
          <div style={{ flex: '0 0 50%' }}>
            <Box style={{display: 'flex', alignItems: 'center'}}>
              <Typography gutterBottom variant="h5" component="div">
                {product.title}
              </Typography>
              {isAuthenticated && (
                <Checkbox {...label} icon={<FavoriteBorder />} checkedIcon={<Favorite />} onClick={handleFavoriteItem} checked={isFavorite} style={{marginBottom: '0.35em', marginLeft: '1em'}}/>
                )}
            </Box>
              <Divider/>
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
            {isAuthenticated && (
            <Box mt={2}>
              <Button variant="contained" color="primary" disabled={!isAvailable} onClick={handleAddToCart}>
                Add to cart
              </Button>
            </Box>
              )}
            <Divider style={{marginTop: '15px'}}/>
            <Typography variant="body1" color="text.secondary" style={{marginTop: '20px', textAlign:'justify'}}>
              {product.description}
            </Typography>
          </div>
        </Box>
        <Box style={{margin: '100px 100px 50px 100px' }}>
          <Box style={{display: 'flex', justifyContent: 'space-between', marginBottom: '15px'}}>
            <Typography gutterBottom variant="h5" component="div">
              Reviews
            </Typography>
            {isAuthenticated && (
            <Box>
              <Button variant="contained" color="primary" disabled={!availableToLeave} onClick={handleOpen} style={{marginRight: '30px'}}>
                Leave review
              </Button>
              <Button variant="contained" color="primary" disabled={!availableToEdit} onClick={handleOpenEdit}>
                Edit review
              </Button>
            </Box>
              )}
          </Box>
          <Divider></Divider>
          {renderReviews()}
        </Box>
      </Box>

      <Modal open={open} onClose={handleClose} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%',
        overflow: 'auto', backgroundColor: 'rgba(0, 0, 0, 0.5)', position: 'fixed', top: 0, left: 0, zIndex: 99,}}>
        <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '5px', boxShadow: '0 0 10px rgba(0, 0, 0, 0.3)', maxWidth: '70%', maxHeight: '90%', overflow: 'auto', boxSizing: 'border-box'}}>
          {<ReviewForm userId={userId} productId={product.id} onAdd={handleCloseAddReview}  />}
        </div>
      </Modal>

      {review && (
        <Modal open={openEdit} onClose={handleCloseEdit} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%',
          overflow: 'auto', backgroundColor: 'rgba(0, 0, 0, 0.5)', position: 'fixed', top: 0, left: 0, zIndex: 99}}>
            <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '5px', boxShadow: '0 0 10px rgba(0, 0, 0, 0.3)', maxWidth: '70%', maxHeight: '90%', overflow: 'auto', boxSizing: 'border-box' }}>
              <EditReviewForm review={review} onUpdate={handleUpdate} onClose={handleCloseEdit} />
            </div>
        </Modal>
      )}
    </>
  );
};