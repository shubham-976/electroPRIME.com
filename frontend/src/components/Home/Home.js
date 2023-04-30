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

const Home = () => {
  const dispatch = useDispatch();
  const alert = useAlert();

  const { loading, error, products } = useSelector((state) => state.products_);
  const { loading: userLoading, isAuthenticated } = useSelector((state) => state.user_);
  const { loading: recommedationLoading, error: recommendationError, recommendedProducts } = useSelector((state) => state.recommendations_);


  const category = [{ heading: "Laptop", image: 'https://res.cloudinary.com/dgknqvfsy/image/upload/v1682710038/categories/laptop_duqaxp.jpg' },
  { heading: "Phone", image: 'https://res.cloudinary.com/dgknqvfsy/image/upload/v1682710039/categories/phone_bmawvl.jpg' },
  { heading: "Tablet", image: 'https://res.cloudinary.com/dgknqvfsy/image/upload/v1682710040/categories/tablet_byev4u.jpg' },
  { heading: "Speaker", image: 'https://res.cloudinary.com/dgknqvfsy/image/upload/v1682710040/categories/speaker_ovjzvf.jpg' },
  { heading: "Headphone", image: 'https://res.cloudinary.com/dgknqvfsy/image/upload/v1682710038/categories/headphone_r5c030.jpg' },
  { heading: "Earbuds", image: 'https://res.cloudinary.com/dgknqvfsy/image/upload/v1682710038/categories/earbud_qhzrii.jpg' },
  { heading: "SmartWatch", image: 'https://res.cloudinary.com/dgknqvfsy/image/upload/v1682710040/categories/smartwatch_foztc3.jpg' },
  { heading: "Camera", image: 'https://res.cloudinary.com/dgknqvfsy/image/upload/v1682710038/categories/camera_tuzjde.jpg' },
  { heading: "Air Conditioner", image: 'https://res.cloudinary.com/dgknqvfsy/image/upload/v1682710038/categories/ac_h63fqw.jpg' },
  { heading: "LED TV", image:'https://res.cloudinary.com/dgknqvfsy/image/upload/v1682710040/categories/tv_pke3dp.jpg'},
  { heading: "Refrigerator", image: 'https://res.cloudinary.com/dgknqvfsy/image/upload/v1682710038/categories/fridge_xiit7s.jpg' },
  { heading: "Washing Machine", image: 'https://res.cloudinary.com/dgknqvfsy/image/upload/v1682710040/categories/washingmachine_n8lkco.jpg' },
  { heading: "Microwave", image: 'https://res.cloudinary.com/dgknqvfsy/image/upload/v1682710039/categories/microwave_elbwmv.jpg' },
  { heading: "Printer", image: 'https://res.cloudinary.com/dgknqvfsy/image/upload/v1682710039/categories/printer_jexvia.jpg' },
  { heading: "Others", image: 'https://res.cloudinary.com/dgknqvfsy/image/upload/v1682710039/categories/others_sbgzb6.jpg' }];


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

          <h2 className='homeHeading'>Explore Categories of Products</h2>
          <div className='categoryContainer'>
            {category.map((item, index) => {
              return (
                <Link to="/products" key={index}>
                  <img src={item.image} alt="Category Preview" />
                  <p>{item.heading}</p>
                </Link>
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