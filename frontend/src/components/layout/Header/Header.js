import React from 'react'
import {ReactNavbar} from "overlay-navbar"
import {FaSearch} from "react-icons/fa"
import {FaUserCircle} from "react-icons/fa"
import {FaShoppingCart} from "react-icons/fa"
import electroPRIMELogo from "../../../images/electroPRIMELogo.png"

const options = {
  burgerColorHover:"#e60584",
  burgerColor:"#03adfc",
  logo : electroPRIMELogo,
  logoWidth:"6vmax",
  // navColor1="#f7f7f7"
  navColor1:"#f2f2f2",
//   navColor2="#f7f0f0"
//   navColor3="#f7f7f7"
//   navColor4="#f7f0f0"
  logoHoverSize:"15px",
  logoHoverColor:"#adf7f0",
  link1Text:"Home",
  link2Text:"Products",
  link3Text:"Contact",
  link4Text:"About",
  link1Family:"Lobster",
  link1Url:"/",
  link2Url:"/products",
  link3Url:"/contact",
  link4Url:"/about",
  link1Size:"1.9vmax",
  nav1justifyContent:"flex-end",
  nav2justifyContent:"flex-end",
  nav3justifyContent:"flex-start",
  nav4justifyContent:"flex-start",
  link1ColorHover:"#e60584",
  link1Margin:"4.5vmax",
  link2Margin:"2vmax",
  link3Margin:"1vmax",
  link4Margin:"4.5vmax",
  searchIcon:true,
  SearchIconElement:FaSearch,
  cartIcon:true,
  CartIconElement:FaShoppingCart,
  profileIcon:true,
  ProfileIconElement:FaUserCircle,
  profileIconUrl:"/login",
  searchIconColor:"rgba(35,35,35,0.8)",
  cartIconColor:"rgba(35,35,35,0.8)",
  profileIconColor:"rgba(35,35,35,0.8)",
  searchIconColorHover:"#5739bd",
  cartIconColorHover:"#5739bd",
  profileIconColorHover:"#5739bd",
  cartIconMargin:"2.2vmax"
}

const Header = () => {
  return <ReactNavbar {...options} />
};

export default Header