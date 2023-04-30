import React from 'react'
import { Typography, Stepper, StepLabel, Step } from '@material-ui/core';
// import LocalShippingIcon from "@material-ui/icon/LocalShipping";
// import LibraryAddCheckIcon from "@material-ui/icon/LibraryAddCheck";
// import AccountBalanceIcon from "@material-ui/icon/AccountBalance";
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import LibraryAddCheckIcon from '@mui/icons-material/LibraryAddCheck';
import "./PlaceOrderSteps.css";

const PlaceOrderSteps = ({activeStep}) => {

    //3 steps for placing the order completely.
    const steps = [
        {
            label:<Typography>Shipping Details</Typography>,
            icon:<LocalShippingIcon/>
        },
        {
            label:<Typography>Confirm Order</Typography>,
            icon:<LibraryAddCheckIcon/>
        },
        {
            label:<Typography>Payment</Typography>,
            icon:<AccountBalanceIcon/>
        }
    ];

    const stepStyles = {
        boxSizing:"border-box"
    }

  return (
    <>
    {/* Stepper, Step, StepLabel are inbuilt components of material-ui*/}
    <Stepper alternativeLabel activeStep={activeStep} style={stepStyles}>
        {steps.map((item, index)=>(
            <Step key={index} active={activeStep===index ? true : false} completed={activeStep>=index ? true : false}>
                <StepLabel style={{color:activeStep>=index ? "green": "rgba(0,0,0,0.649"}} icon={item.icon}>{item.label}</StepLabel>
            </Step>
        ))}
    </Stepper>
    </>
  )
}

export default PlaceOrderSteps