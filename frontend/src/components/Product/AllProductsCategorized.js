import React, { useEffect, useState } from 'react';
import "./AllProductsCategorized.css";
import { useSelector, useDispatch } from 'react-redux';
import { clearErrors, getAllProducts } from '../../actions/productAction';
import Loader from '../layout/Loader/Loader';
import ProductCard from '../Home/ProductCard';
import { useParams } from 'react-router-dom';
import Pagination from 'react-js-pagination';
import Slider from "@material-ui/core/Slider";
import Typography from "@material-ui/core/Typography";
import {useAlert} from "react-alert";
import MetaData from '../layout/MetaData';

const categories = ["Laptop, PC", "Phone", "Tablet", "Speaker", "Headphone", "Earbuds", "Smartwatch", "Camera", "Air Conditioner", "LED TV", "Refrigerator", "Washing Machine", "Microwave", "Printer", "Others"]

const AllProductsCategorized = () => {
    const dispatch = useDispatch();
    const alert = useAlert();
    const {categorychoosen} = useParams();

    const [currentPage, setCurrentPage] = useState(1);
    const [minPrice, setMinPrice] = useState(0);
    const [maxPrice, setMaxPrice] = useState(250000);
    const [price, setPrice] = useState([minPrice, maxPrice]); //price is array of 2 numbers minprice,maxprice
    const [category, setCategory] = useState(categorychoosen);
    const [avgRating, setAvgRating] = useState(0);

    const {loading, products, productsCount, error, resultPerPage, filteredProductsCount} = useSelector((state) => state.products_);

    const {keyword} = useParams();


    const setCurrentPageNo = (e)=>{
      setCurrentPage(e);
    }

    const priceHandler = (e)=>{
      e.preventDefault();
      setPrice([minPrice, maxPrice]);
    }
    const ratingHandler = (e, newValue)=>{
        setAvgRating(newValue);
    }

    useEffect(() => {
      if(error){
        alert.error(error);
        dispatch(clearErrors());
      }
      dispatch(getAllProducts(keyword, currentPage, price, category, avgRating));
    }, [dispatch, keyword, currentPage, price, category, avgRating, alert, error])
    
    let count = filteredProductsCount;

    const resetAllParameters = ()=>{
      //reset all parameters which are set for filter and search
      setCurrentPage(1);
      setMinPrice(0);
      setMaxPrice(250000);
      setPrice([minPrice, maxPrice]);
      setCategory("");
      setAvgRating(0);
    }

  return (
    <>
    {loading ? <Loader/> : (
        <>
        <MetaData title="electroPRIME | Products"/>
        {category==="" ? <h2 className='productsHeading'>ALL PRODUCTS</h2> : <h2 className='productsHeading'>ALL {category}(s)</h2>}
        {products.length > 0 ? (
          <div className='products'>
              {products && products.map((prod) => (<ProductCard product={prod} key={prod._id}/>))}
          </div>
        ) : (
          <div className='products'><p id="message">No products found with such filter Parameters</p></div>
        )}

        <div className="filterBox">
          <button onClick={resetAllParameters}>All Products</button>
          <hr/>
          {/* Filter by Price */}
          <Typography>Price Range</Typography>
          <form className="priceBox" onSubmit={priceHandler}>
              <span>₹</span>
              <input className="minPrice" type="number" placeholder='Min' value={minPrice} onChange={(e)=>setMinPrice(e.target.value)}/>
              <input className="maxPrice" type="number" placeholder='Max' value={maxPrice} onChange={(e)=>setMaxPrice(e.target.value)}/>
              <input className="priceBtn" type="submit" value="Go"/>
          </form>

          {/* Filter by category */}
          <Typography>Categories</Typography>
          <ul className="categoryBox">
            {categories.map((category_)=>(
              <li
                className="category-link"
                key={category_}
                onClick={()=>setCategory(category_)}   
              >
                {category_}
              </li>
            ))}
          </ul>

          {/*  Filter by rating */}
          <fieldset>
            <Typography component="legend">Rating Above</Typography>
            <Slider
              value = {avgRating}
              onChange = {ratingHandler}
              aria-labelledby="continuous-slider"
              valueLabelDisplay='auto'
              min={0}
              max={5}
            />
          </fieldset>
        </div>

        {count>resultPerPage && (<div className="paginationBox">
          <Pagination
            activePage = {currentPage}
            itemsCountPerPage={resultPerPage}
            totalItemsCount={productsCount}
            onChange={setCurrentPageNo}
            nextPageText="Next"
            prevPageText="Prev"
            firstPageText="1st"
            lastPageText="Last"
            itemClass="page-item"
            linkClass="page-link"
            activeClass="pageItemActive"
            activeLinkClass="pageLinkActive"
          />
        </div>)}
        </>
    )}
    </>
  )
}

export default AllProductsCategorized