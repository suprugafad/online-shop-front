import React, {useState, useEffect} from 'react';
import {Box, Typography, CardMedia, Divider, Button, Container, Grid, CircularProgress} from '@mui/material';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import axios from 'axios';
import Header from "../components/Header";
import {ProductComponent} from "../components/catalog/ProductComponent";
import Footer from "../components/Footer";
import {Link} from "react-router-dom";
import {getUserId} from "../api/AuthAPI";
import profileAPI from "../api/ProfileAPI";
import HeaderAdmin from "../components/admin/HeaderAdmin";

interface Product {
  id: number;
  title: string;
  mainImage: string;
  price: string;
}

const MainPage: React.FC = () => {
  const [newProducts, setNewProducts] = useState<Product[]>([]);
  const [popularProducts, setPopularProducts] = useState<Product[]>([]);
  const [recommendations, setRecommendations] = useState<Product[]>([]);
  const [isCustomer, setIsCustomer] = useState<boolean>(false);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNewProducts().catch(() => {});
    fetchPopularProducts().catch(() => {});
    setTimeout(() => {
      fetchRecommendations().catch(() => {});
    }, 200)
    setTimeout(() => {
      setLoading(false);
    }, 500)
  }, []);

  const fetchNewProducts = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/products/new_products`);

      const products = response.data.map((product: any) => ({
        id: product._id,
        title: product._title,
        price: product._price,
        mainImage: product._mainImage,
      }));

      setNewProducts(products);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchPopularProducts = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/products/popular_products`);

      const products = response.data.topProducts.map((product: any) => ({
        id: product._id,
        title: product._title,
        price: product._price,
        mainImage: product._mainImage,
      }));

      setPopularProducts(products);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchRecommendations = async () => {
    try {
      const userId = await getUserId();
      if (!userId) {
        return;
      }

      const user = await profileAPI.fetchUserInfo(userId);

      if (user && user.role === 'customer') {
        setIsCustomer(true);

        const response = await axios.get(`http://localhost:5000/api/products/recommendations/${userId}`);

        const products = response.data.recommendedProducts.map((product: any) => ({
          id: product._id,
          title: product._title,
          price: product._price,
          mainImage: product._mainImage,
        }));

        setRecommendations(products);
      } else if (user && user.role === 'admin') {
        setIsAdmin(true);
      }

    } catch (error) {
      console.error(error);
    }
  };

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 3,
    autoplay: true,
    autoplaySpeed: 5000,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  };

  if (loading) {
    return (
      <>
        <Header title={'GameScape'}></Header>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
          <CircularProgress />
        </Box>
      </>
    )
  }

  return (
    <>
      {!isAdmin && (
        <>
          <Header title={'GameScape'}></Header>
          <Box style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: '90%', textAlign: 'center', margin: "auto", marginTop: '30px', padding: '20px 70px 20px 20px', backgroundColor:'#e2d7ef', borderRadius: '20px'}}>
            <Box>
              <Typography variant="h2" style={{color:'#fff', textShadow: '4px 4px 6px #4f0f98', marginBottom: '80px'}} > GameScape </Typography>
              <Typography variant="h4" width='750px'>Where fun and games come to life! Discover our world of tabletop entertainment.</Typography>
              <Button component={Link} to='/catalog' variant={'contained'} style={{fontSize: '20px', marginTop: '40px'}}>Go to catalog</Button>
            </Box>
            <CardMedia
              component="img"
              image={`/mainPage/1.jpg`}
              alt={`main img`}
              sx={{
                objectFit: 'contain',
                width:"35%",
                margin: '10px 10px 10px 10px',
                borderRadius: '20px',
                backgroundColor: 'white'
              }}
            />
          </Box>
        </>
      )}

      {isCustomer && (
        <>
          <Box style={{display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '30px'}}>
            <Divider style={{width: '400px', textAlign: 'center'}}></Divider>
          </Box>
          <Typography variant="h4" textAlign='center' marginTop='10px' style={{textShadow: '3px 3px 5px #e2d7ef', color:'#4f0f98'}}>Personal recommendations</Typography>
          <Box style={{display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '10px'}}>
            <Divider style={{width: '400px', textAlign: 'center'}}></Divider>
          </Box>
          <Box margin='3% 5% 3% 7%'>
            <Box mt={2} width='85%' margin='auto' >
              <Slider {...settings}>
                {recommendations.map((product) => (
                  <div key={product.id} >
                    <Box style={{display: 'flex', alignItems: 'center', marginLeft: '50px', height: '380px'}}>
                      <ProductComponent id={product.id} title={product.title} price={product.price + '$'} mainImage={product.mainImage}></ProductComponent>
                    </Box>
                  </div>
                ))}
              </Slider>
            </Box>
          </Box>
        </>
      )}
      {!isAdmin && (
        <>
          <Box style={{display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '30px'}}>
            <Divider style={{width: '400px', textAlign: 'center'}}></Divider>
          </Box>
          <Typography variant="h4" textAlign='center' marginTop='10px' style={{textShadow: '3px 3px 5px #e2d7ef', color:'#4f0f98'}}>New products</Typography>
          <Box style={{display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '10px'}}>
            <Divider style={{width: '400px', textAlign: 'center'}}></Divider>
          </Box>
          <Box margin='3% 5% 3% 7%'>
            <Box mt={2} width='85%' margin='auto' >
              <Slider {...settings}>
                {newProducts.map((product) => (
                  <div key={product.id} >
                    <Box style={{display: 'flex', alignItems: 'center', marginLeft: '50px', height: '380px'}}>
                      <ProductComponent id={product.id} title={product.title} price={product.price + '$'} mainImage={product.mainImage}></ProductComponent>
                    </Box>
                  </div>
                ))}
              </Slider>
            </Box>
          </Box>

          <Box style={{display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '30px'}}>
            <Divider style={{width: '400px', textAlign: 'center'}}></Divider>
          </Box>
          <Typography variant="h4" textAlign='center' marginTop='10px' style={{textShadow: '3px 3px 5px #e2d7ef', color:'#4f0f98'}}>Popular products</Typography>
          <Box style={{display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '10px'}}>
            <Divider style={{width: '400px', textAlign: 'center'}}></Divider>
          </Box>
          <Box margin='3% 5% 3% 7%'>
            <Box mt={2} width='85%' margin='auto' >
              <Slider {...settings}>
                {popularProducts.map((product) => (
                  <div key={product.id} style={{}}>
                    <Box style={{display: 'flex', alignItems: 'center', marginLeft: '50px', height: '380px'}}>
                      <ProductComponent id={product.id} title={product.title} price={product.price + '$'} mainImage={product.mainImage}></ProductComponent>
                    </Box>
                  </div>
                ))}
              </Slider>
            </Box>
          </Box>
        </>
      )}

      {isAdmin && (
        <>
          <HeaderAdmin title="GameScape"/>
          <Container maxWidth="lg" style={{marginTop: '80px', marginBottom: '400px', minHeight: '320px'}}>
            <Typography variant="h3" component="h1" align="center" gutterBottom marginBottom='40px'>
              Admin panel
            </Typography>
            <Divider/>
            <Grid container spacing={3} style={{marginTop: '40px'}}>
              <Grid item xs={12} sm={4}>
                <Button component={Link} to="/statistics" variant="contained" color="primary" fullWidth style={{height: '60px', fontSize: '20px'}}>
                  Statistics
                </Button>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Button component={Link} to="/users" variant="contained" color="primary" fullWidth style={{height: '60px', fontSize: '20px'}}>
                  Users
                </Button>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Button component={Link} to="/orders" variant="contained" color="primary" fullWidth style={{height: '60px', fontSize: '20px'}}>
                  Orders
                </Button>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Button component={Link} to="/products" variant="contained" color="primary" fullWidth style={{height: '60px', fontSize: '20px'}}>
                  Products
                </Button>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Button component={Link} to="/content" variant="contained" color="primary" fullWidth style={{height: '60px', fontSize: '20px'}}>
                  Content
                </Button>
              </Grid>
            </Grid>
          </Container>
        </>
      )}
      <Footer></Footer>
    </>
  );
};

export default MainPage;