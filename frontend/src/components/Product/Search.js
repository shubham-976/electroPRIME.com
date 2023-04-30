import React from 'react'
import { useState } from 'react';
import {useNavigate} from 'react-router-dom';
import "./Search.css";
import MetaData from '../layout/MetaData';

const Search = () => {
    const [keyword, setKeyword] = useState("");

    const navigate = useNavigate();

    const searchSubmitHandler = (e)=>{
        e.preventDefault();
        //history.push(some_link) : allows to programmatically control the browser's history and change the URL displayed in the address bar without reloading the page.
        //hostory() doesn't work now, instead of that now we have to use navgate(some_link) .
        if(keyword.trim()){
            navigate(`/products/${keyword}`); 
        }
        else{
            navigate('/products');
        }
    }

  return (
    <>
    <MetaData title="electroPRIME | Search Product"/>
    <form className='searchBox' onSubmit={searchSubmitHandler}>
        <input type="text" placeholder='Search a Product ...' onChange={(e)=>setKeyword(e.target.value)}/>
        <input type="submit" value="Search"/>
    </form>
    </>
  )
}

export default Search;