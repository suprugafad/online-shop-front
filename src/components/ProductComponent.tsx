import React from 'react';
import {Box, Card, CardActionArea, CardContent, CardMedia, Typography} from '@mui/material';
import styled from '@emotion/styled';
import { useNavigate } from "react-router-dom";

const StyledCard = styled(Card)`
  transition: transform 0.3s;

  &:hover {
    transform: translateY(-10px);
  }
`;

interface ProductCard {
  id: number,
  title: string,
  price: string,
  mainImage: string,
}

export const ProductComponent: React.FC<ProductCard> = ({id, title, price, mainImage}) => {
  const navigate = useNavigate();
  const imageUrl = `http://localhost:5000/assets/images/products/${title}/${mainImage}`;

  const handleClick = () => {
    navigate(`/product/${id}`);
  };

  return (
    <Box>
      <StyledCard sx={{width: 300}}>
        <CardActionArea onClick={handleClick}>
          <CardMedia
            component="img"
            height="250"
            image={imageUrl}
            alt={title}
            sx={{
              objectFit: 'contain',
            }}
          />
          <CardContent>
            <Typography gutterBottom variant="h5" component="div">
              {title}
            </Typography>
            <Typography gutterBottom variant="subtitle1" component="div">
              {price}
            </Typography>
          </CardContent>
        </CardActionArea>
      </StyledCard>
    </Box>
  );
};
