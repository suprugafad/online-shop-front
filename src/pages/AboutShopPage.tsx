import React from 'react';
import {MapContainer, Marker, TileLayer, useMap} from 'react-leaflet';
import {Container, Typography, Box, List, ListItem, ListItemText, Divider} from '@mui/material';
import {useEffect} from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import Header from "../components/Header";
import Footer from "../components/Footer";

interface SetViewProps {
  center: [number, number];
  zoom: number;
}

const ShopPage: React.FC = () => {
  const center: [number, number] = [51.5074, -0.1278];
  const zoom: number = 13;

  useEffect(() => {
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
      iconUrl: require("leaflet/dist/images/marker-icon.png"),
      shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
    });
  }, []);

  const SetViewComponent: React.FC<SetViewProps> = ({center, zoom}) => {
    const map = useMap();
    map.setView(center, zoom);
    return null;
  };

  return (
    <>
      <Header title={'GameScape'}></Header>
      <Container maxWidth="md" sx={{py: 2}}>
        <Typography variant="h4" component="h1" sx={{mb: 2}} textAlign={'center'} marginTop={'20px'}>
          About Our Game Store
        </Typography>
        <Typography variant="h6" textAlign={'justify'} sx={{mb: 2}}>
          Welcome to our imaginary game store! We are passionate about board games, card games, and tabletop gaming.
        </Typography>
        <Box border={'solid 2px #7E52A0'} padding={'10px 20px'} borderRadius={'20px'} marginTop={'30px'}>
          <Typography variant="h5" component="h2" sx={{mb: 2, color: '#6d3398'}}>
            Store Location
          </Typography>
          <Box sx={{height: '400px', width: '100%', mb: 2}}>
            <MapContainer style={{height: '400px', width: '100%'}}>
              <SetViewComponent center={center} zoom={zoom}/>
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>
              <Marker position={center}/>
            </MapContainer>
          </Box>
        </Box>

        <Typography variant="h5" component="h2" sx={{mb: 2}} marginTop={'30px'} textAlign={'center'}>
          Store History
        </Typography>
        <Typography variant="body1" sx={{mb: 2}} textAlign={'justify'}>
          Our store was established in 2010 with the aim of providing a wide range of tabletop games to enthusiasts.
          Over the years, we have built a strong community of players and fostered a love for gaming.
        </Typography>
        <Divider/>
        <Typography variant="h5" component="h2" sx={{mb: 2}} textAlign={'center'} marginTop={'15px'}>
          Contact Us
        </Typography>
        <Typography variant="body1" sx={{mb: 2}}>
          If you have any questions or need assistance, feel free to reach out to us:
        </Typography>
        <List>
          <ListItem>
            <ListItemText primary="Phone: +1234567890"/>
          </ListItem>
          <ListItem>
            <ListItemText primary="Email: info@example.com"/>
          </ListItem>
          <ListItem>
            <ListItemText primary="Address: 123 Boardgame Street, Cityville, Country"/>
          </ListItem>
        </List>
      </Container>
      <Footer></Footer>
    </>
  );
};

export default ShopPage;
