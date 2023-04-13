import { CssBaseline } from '@mui/material';
import { Route, Routes, BrowserRouter as Router } from 'react-router-dom';
import SignInPage from './pages/SignIn';
import SignUpPage from './pages/SignUp';
import React from "react";
import AddProduct from "./pages/addProduct";
import ProductPage from "./pages/productTableAdmin";

function App() {
  return (
    <Router>
      <CssBaseline />
      <Routes>
        <Route path='/' element={<SignInPage />} />
        <Route path='/signup' element={<SignUpPage />} />
        <Route path='/addProduct' element={<AddProduct />} />
        <Route path='/productPage' element={<ProductPage />}/>
      </Routes>
    </Router>
  );
}

export default App;
