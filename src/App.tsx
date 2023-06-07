import { CssBaseline } from '@mui/material';
import { Route, Routes, BrowserRouter as Router } from 'react-router-dom';
import SignInPage from './pages/SignIn';
import SignUpPage from './pages/SignUp';
import React from "react";
import AddProduct from "./pages/AddProduct";
import ProductPage from "./pages/ProductTableAdmin";
import StartPage from "./pages/StartPage";
import { ProductDetailsPage } from "./pages/ProductDetailsPage";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import MainPage from "./pages/MainPage";
import {ProfilePage} from "./pages/ProfilePage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import UsersPage from "./pages/UsersPage";
import OrdersPage from "./pages/OrdersPage";
import ShopPage from "./pages/AboutShopPage";
import PaymentPage from "./pages/PaymentPage";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import FavoritePage from "./pages/FavoritePage";

function App() {
  return (
    <Router>
      <CssBaseline />
      <Routes>
        <Route path="/product/:id" element={<ProductDetailsPage />} />
        <Route path="/catalog" element={<StartPage />} />
        <Route path='/signin' element={<SignInPage />} />
        <Route path='/signup' element={<SignUpPage />} />
        <Route path='/addProduct' element={<AddProduct />} />
        <Route path='/products' element={<ProductPage />}/>
        <Route path='/users' element={<UsersPage />}/>
        <Route path='/orders' element={<OrdersPage />}/>
        <Route path='/cart' element={<CartPage />}/>
        <Route path='/checkout' element={<CheckoutPage />}/>
        <Route path='/' element={<MainPage />}/>
        <Route path='/profile' element={<ProfilePage />}/>
        <Route path='/forgotPassword' element={<ForgotPasswordPage />}/>
        <Route path='/resetPassword/:id/:resetToken' element={<ResetPasswordPage />}/>
        <Route path='/aboutShop' element={<ShopPage />}/>
        <Route path='/payment' element={<PaymentPage />}/>
        <Route path='/statistics' element={<AdminDashboardPage />}/>
        <Route path='/favorite' element={<FavoritePage />}/>
      </Routes>
    </Router>
  );
}

export default App;
