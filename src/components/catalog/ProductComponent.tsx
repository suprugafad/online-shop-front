import React from 'react';
import { Box, Card, CardActionArea, CardContent, CardMedia, Typography } from '@mui/material';
import styled from '@emotion/styled';
import { useNavigate } from "react-router-dom";
import { ProductCard } from "../../types";

const StyledCard = styled(Card)`
  transition: transform 0.3s;

  &:hover {
    transform: translateY(-10px);
  }
`;

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
          <CardContent style={{backgroundColor: '#ece8f5', textAlign: 'center', marginTop:'10px', padding: '10px'}}>
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
