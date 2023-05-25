import React, {useEffect, useState} from "react";
import {ProductCatalog} from "../components/catalog/ProductCatalog";
import Header from "../components/Header";
import Footer from "../components/Footer";
import {ProductFilters} from "../components/catalog/ProductFilters";
import {Filters} from "../types";
import {checkAuthentication} from "../api/AuthAPI";
import {Button, Container, Divider, Grid, Typography} from "@mui/material";
import {Link} from "react-router-dom";
import HeaderAdmin from "../components/admin/HeaderAdmin";

const StartPage = () => {
  const [filter, setFilter] = useState<Filters>({categories: [], manufacturers: [], priceRange: [0, 1000]});
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await checkAuthentication();
        console.log(response?.data.role)

        if (response && response.data.role === 'admin') {
          setIsAdmin(true);
        }
      } catch (error) {
        console.error(error)
        window.location.reload();
      }
    }

    fetchData().catch(() => {
    });
  });

  const handleFilterChange = (filters: Filters) => {
    setFilter(filters);
  };

  return (
    <>
      {!isAdmin && (
        <>
          <Header title="GameScape"/>
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            width: '100%',
            height: '100%',
          }}>

            <div style={{marginLeft: "5rem", width: '330px', marginTop: '3rem'}}>
              <ProductFilters
                filters={{
                  categories: [],
                  manufacturers: [],
                  priceRange: [0, 1000],
                }}
                onFilterChange={handleFilterChange}
              />
            </div>
            <ProductCatalog filters={filter}/>
          </div>
        </>
      )}
      {isAdmin && (
        <>
          <HeaderAdmin title="GameScape"/>
          <Container maxWidth="lg" style={{marginTop: '80px', marginBottom: '400px'}}>
            <Typography variant="h4" component="h1" align="center" gutterBottom marginBottom='40px'>
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
      <Footer/>
    </>
  );
}

export default StartPage;