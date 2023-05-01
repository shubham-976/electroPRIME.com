import React, { useState } from 'react';
import './App.css';
import Header from "./components/layout/Header/Header.js"
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import WebFont from "webfontloader";
import Footer from "./components/layout/Footer/Footer.js";
import Home from "./components/Home/Home.js";
import SingleProductDetails from "./components/Product/SingleProductDetails.js";
import AllProducts from './components/Product/AllProducts';
import Search from "./components/Product/Search.js"
import LoginSignUp from './components/User/LoginSignUp';
import store from "./store"
import { loadUser } from './actions/userAction';
import UserOptions from './components/layout/Header/UserOptions.js';
import { useSelector } from 'react-redux';
import Profile from "./components/User/Profile.js"
import ProtectedRoute from './components/Route/ProtectedRoute';
import UpdateProfile from './components/User/UpdateProfile.js';
import UpdatePassword from './components/User/UpdatePassword.js';
import ForgotPassword from './components/User/ForgotPassword.js';
import ResetPassword from './components/User/ResetPassword.js';
import Cart from './components/Cart/Cart.js'
import Shipping from "./components/Cart/Shipping.js";
import ConfirmOrder from "./components/Cart/ConfirmOrder.js"
import Payment from "./components/Cart/Payment.js"
import OrderSuccess from "./components/Cart/OrderSuccess.js"
import MyOrders from "./components/Order/MyOrders.js"
import OrderDetails from "./components/Order/OrderDetails.js"
import Dashboard from "./components/Admin/Dashboard.js"
import ProductList from "./components/Admin/ProductList.js"
import CreateNewProduct from "./components/Admin/CreateNewProduct.js"
import UpdateProduct from "./components/Admin/UpdateProduct.js"
import OrderList from "./components/Admin/OrderList.js"
import ProcessOrder from "./components/Admin/ProcessOrder.js"
import UserList from "./components/Admin/UserList.js"
import UpdateUser from "./components/Admin/UpdateUser.js"
import ProductReviews from "./components/Admin/ProductReviews.js"
import About from "./components/layout/About/About.js"
import Contact from "./components/layout/Contact/Contact.js"
import PageNotFound from "./components/layout/PageNotFound/PageNotFound.js"
import AllProductsCategorized from "./components/Product/AllProductsCategorized.js"
import axios from "axios";
//below 2 things are needed here, so that stripe/react-js components work in Payment.js
import{Elements} from "@stripe/react-stripe-js";
import {loadStripe} from "@stripe/stripe-js";

function App() {
  const {isAuthenticated, user} = useSelector((state)=>state.user_);

  const [stripeApiKey, setStripeApiKey] = useState("");

  async function getStripeApiKey(){
    const {data}  = await axios.get("/api/v1/stripeapikey");

    setStripeApiKey(data.stripeApiKey);
  }

  React.useEffect(()=>{
    window.process = {
      ...window.process,
    };
    WebFont.load({
      google:{
        families:[ "Frankiln Gothic Medium", "Abril Fatface", "Oxygen", "Lobster", "Playfair Display","Roboto", "Droid Sans", "Chilanka"],
      },
    });
    store.dispatch(loadUser());
    getStripeApiKey();
  }, []);
  return(
    <Router>
      <Header/>
      {isAuthenticated && <UserOptions user={user}/>}
      <Routes>
        <Route exact path="/" element={<Home/>}></Route>
        <Route exact path="/product/:id" element={<SingleProductDetails/>}></Route>
        <Route exact path="/products" element={<AllProducts/>}></Route>
        <Route exact path="/productsCategorized/:categorychoosen" element={<AllProductsCategorized/>}></Route>
        <Route path="/products/:keyword" element={<AllProducts/>}></Route>
        <Route exact path="/search" element={<Search/>}></Route>
        <Route exact path="/login" element={<LoginSignUp/>}></Route>
        <Route exact path="/account" element={<ProtectedRoute ele={<Profile/>}/>}></Route>
        <Route exact path="/me/update" element={<ProtectedRoute ele={<UpdateProfile/>}/>}></Route>
        <Route exact path="/password/update" element={<ProtectedRoute ele={<UpdatePassword/>}/>}></Route>
        <Route exact path="/password/forgot" element={<ForgotPassword/>}></Route>
        <Route exact path="/password/reset/:token" element={<ResetPassword/>}></Route>
        <Route exact path="/cart" element={<Cart/>}></Route>
        <Route exact path="/shipping" element={<ProtectedRoute ele={<Shipping/>}/>}></Route>
        <Route exact path="/order/confirm" element={<ProtectedRoute ele={<ConfirmOrder/>}/>}></Route>
        <Route exact path="/process/payment" element={stripeApiKey &&( <Elements stripe={loadStripe(stripeApiKey)}><ProtectedRoute ele={<Payment/>}/></Elements>)}></Route>
        <Route exact path="/success" element={<ProtectedRoute ele={<OrderSuccess/>}/>}></Route>
        <Route exact path="/orders" element={<ProtectedRoute ele={<MyOrders/>}/>}></Route>
        <Route exact path="/order/:id" element={<ProtectedRoute ele={<OrderDetails/>}/>}></Route>
        <Route exact path="/admin/dashboard" element={<ProtectedRoute adminOnly={true} ele={<Dashboard/>}/>}></Route>
        <Route exact path="/admin/products" element={<ProtectedRoute adminOnly={true} ele={<ProductList/>}/>}></Route>
        <Route exact path="/admin/product" element={<ProtectedRoute adminOnly={true} ele={<CreateNewProduct/>}/>}></Route>
        <Route exact path="/admin/product/:id" element={<ProtectedRoute adminOnly={true} ele={<UpdateProduct/>}/>}></Route>
        <Route exact path="/admin/orders" element={<ProtectedRoute adminOnly={true} ele={<OrderList/>}/>}></Route>
        <Route exact path="/admin/order/:id" element={<ProtectedRoute adminOnly={true} ele={<ProcessOrder/>}/>}></Route>
        <Route exact path="/admin/users" element={<ProtectedRoute adminOnly={true} ele={<UserList/>}/>}></Route>
        <Route exact path="/admin/user/:id" element={<ProtectedRoute adminOnly={true} ele={<UpdateUser/>}/>}></Route>
        <Route exact path="/admin/reviews" element={<ProtectedRoute adminOnly={true} ele={<ProductReviews/>}/>}></Route>
        <Route exact path="/about" element={<About/>}></Route>
        <Route exact path="/contact" element={<Contact/>}></Route>
        {/* Route in Routes works sequentially, if from above no url matched, only then show below page */}
        <Route path="*" element={<PageNotFound/>}></Route>
      </Routes>
      <Footer/>
    </Router>
  );
};

export default App;
