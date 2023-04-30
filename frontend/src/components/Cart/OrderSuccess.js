import React from 'react'; 
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import "./OrderSuccess.css"
import { Typography } from '@material-ui/core';
import {Link} from "react-router-dom";
import MetaData from '../layout/MetaData';

const OrderSuccess = () => {
  return (
    <>
    <MetaData title="electroPRIME | Order Success"/>
    <div className="orderSuccess">
        <CheckCircleIcon/>
        <Typography>Your Order has been Placed Successfully</Typography>
        <Link to="/orders">View Orders</Link>
    </div>
    </>
  )
}

export default OrderSuccess;