import React, { useEffect } from 'react'
import { CgMouse } from "react-icons/all"
import "./Home.css";
import ProductCard from "./ProductCard.js"
import MetaData from "../layout/MetaData.js"
import { getAllProducts, clearErrors, getRecommendedProductsIds } from "../../actions/productAction";
import { useSelector, useDispatch } from "react-redux";
import Loader from "../layout/Loader/Loader"
import { useAlert } from "react-alert";
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const dispatch = useDispatch();
  const alert = useAlert();
  const navigate = useNavigate();

  const { loading, error, products } = useSelector((state) => state.products_);
  const { loading: userLoading, isAuthenticated } = useSelector((state) => state.user_);
  const { loading: recommedationLoading, error: recommendationError, recommendedProducts } = useSelector((state) => state.recommendations_);


  const category = [{ category: "Laptop, PC", image: 'https://res.cloudinary.com/dgknqvfsy/image/upload/v1682710038/categories/laptop_duqaxp.jpg' },
  { category: "Phone", image: 'https://res.cloudinary.com/dgknqvfsy/image/upload/v1682710039/categories/phone_bmawvl.jpg' },
  { category: "Tablet", image: 'https://res.cloudinary.com/dgknqvfsy/image/upload/v1682710040/categories/tablet_byev4u.jpg' },
  { category: "Speaker", image: 'https://res.cloudinary.com/dgknqvfsy/image/upload/v1682710040/categories/speaker_ovjzvf.jpg' },
  { category: "Headphone", image: 'https://res.cloudinary.com/dgknqvfsy/image/upload/v1682710038/categories/headphone_r5c030.jpg' },
  { category: "Earbuds", image: 'https://res.cloudinary.com/dgknqvfsy/image/upload/v1682710038/categories/earbud_qhzrii.jpg' },
  { category: "Smartwatch", image: 'https://res.cloudinary.com/dgknqvfsy/image/upload/v1682710040/categories/smartwatch_foztc3.jpg' },
  { category: "Camera", image: 'https://res.cloudinary.com/dgknqvfsy/image/upload/v1682710038/categories/camera_tuzjde.jpg' },
  { category: "Air Conditioner", image: 'https://res.cloudinary.com/dgknqvfsy/image/upload/v1682710038/categories/ac_h63fqw.jpg' },
  { category: "LED TV", image:'https://res.cloudinary.com/dgknqvfsy/image/upload/v1682710040/categories/tv_pke3dp.jpg'},
  { category: "Refrigerator", image: 'https://res.cloudinary.com/dgknqvfsy/image/upload/v1682710038/categories/fridge_xiit7s.jpg' },
  { category: "Washing Machine", image: 'https://res.cloudinary.com/dgknqvfsy/image/upload/v1682710040/categories/washingmachine_n8lkco.jpg' },
  { category: "Microwave", image: 'https://res.cloudinary.com/dgknqvfsy/image/upload/v1682710039/categories/microwave_elbwmv.jpg' },
  { category: "Printer", image: 'https://res.cloudinary.com/dgknqvfsy/image/upload/v1682710039/categories/printer_jexvia.jpg' },
  { category: "Others", image: 'https://res.cloudinary.com/dgknqvfsy/image/upload/v1682710039/categories/others_sbgzb6.jpg' }];


  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }
    if (recommendationError) {
      alert.error(error);
      dispatch(clearErrors());
    }
    if (isAuthenticated === true) {
      dispatch(getRecommendedProductsIds());
    }
    dispatch(getAllProducts())
  }, [dispatch, error, alert, isAuthenticated, recommendationError]);

  const redirectHandler = (categorychoosen)=>{
    navigate(`/productsCategorized/${categorychoosen}`)
  }
  const goToAllProducts = ()=>{
    navigate("/products");
  }

  return (
    <>
      {loading ? (<Loader />) :
        (<>
          <MetaData title="electroPRIME | Home" />

          <div className="banner">
            <p>Welcome to electroPRIME</p>
            <h2>Exclusive Electronics Store</h2>
            <a href="#container">
              <button>Scroll <CgMouse /></button>
            </a>
          </div>

          <h2 className='homeHeading'>Featured Products</h2>
          <div className="container" id="container">

            {products && products.map(prod => <ProductCard product={prod} key={prod._id} />)}
          </div>
            <button id='allProductsBtn' onClick={goToAllProducts}>See ALL Products</button>

          <h2 className='homeHeading'>Explore Categories of Products</h2>
          <div className='categoryContainer'>
            {category.map((item, index) => {
              return (
                <div onClick={() => redirectHandler(item.category)} key={index}>
                  <img src={item.image} alt="Category Preview" />
                  <p>{item.category}</p>
                </div>
              )
            })}
          </div>

          <h2 className='homeHeading'>Recommended Products for You</h2>
          <div className="recommendationContainer">
            {userLoading === false && (
              isAuthenticated === false ? (
                <div className='reBox'>
                  <p>No recommendations since you are not logged in.</p>
                </div>
              ) : (recommedationLoading===false && (recommendedProducts.length <= 0 ? (
                <div className='reBox'>
                  <p>No recommendations as of now.</p>
                </div>
              ) : (
                <div>
                  {recommendedProducts.map(prod => <ProductCard product={prod} key={prod._id} />)}
                </div>
              )
              ))
            )}
          </div>
        </>)}
    </>
  )
}

export default Home