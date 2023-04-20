import { CssBaseline } from '@mui/material';
import { Route, Routes, BrowserRouter as Router } from 'react-router-dom';
import SignInPage from './pages/SignIn';
import SignUpPage from './pages/SignUp';
import React from "react";
import AddProduct from "./pages/AddProduct";
import ProductPage from "./pages/ProductTableAdmin";
import StartPage from "./pages/StartPage";
import { ProductDetailsPage } from "./pages/ProductDetailsPage";

function App() {
  return (
    <Router>
      <CssBaseline />
      <Routes>
        <Route path="/product/:id" element={<ProductDetailsPage />} />
        <Route path="/" element={<StartPage />} />
        <Route path='/' element={<SignInPage />} />
        <Route path='/signup' element={<SignUpPage />} />
        <Route path='/addProduct' element={<AddProduct />} />
        <Route path='/productPage' element={<ProductPage />}/>
      </Routes>
    </Router>
  );
}

export default App;
