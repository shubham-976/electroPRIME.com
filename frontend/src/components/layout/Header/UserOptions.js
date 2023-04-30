import React, { useState } from 'react'
import "./Header.css"
import {SpeedDial, SpeedDialAction} from "@material-ui/lab"
import { Backdrop } from '@material-ui/core';
import DashboardIcon from "@material-ui/icons/Dashboard";
import PersonIcon from "@material-ui/icons/Person";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import ListAltIcon from "@material-ui/icons/ListAlt";
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useAlert } from 'react-alert';
import { logout } from '../../../actions/userAction';
import ShoppingCartIcon from "@material-ui/icons/ShoppingCart"
import HomeIcon from '@mui/icons-material/Home';

const UserOptions = ({user}) => {
    const [open, setOpen] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const alert = useAlert();

    const {cartItems} = useSelector((state)=>state.cart_);

    const options = [
        {icon:<HomeIcon/>, name:"HomePage", func:home},
        {icon:<ListAltIcon/>, name:"Orders", func:orders},
        {icon:<PersonIcon/>, name:"Profile", func:account},
        {icon:<ShoppingCartIcon style={{color:(cartItems.length>0 ? "#e60584" : "unset")}}/>, name:`Cart(${cartItems.length})`, func:cart},
        {icon:<ExitToAppIcon/>, name:"Logout", func:logoutUser}
    ];

    if(user.role==="admin"){
        //unshift is like push in front of array.
        options.unshift({icon:<DashboardIcon/>, name:"Dashboard", func:dashboard})
    }

    function home(){
        navigate("/");
    }
    function dashboard(){
        navigate("/admin/dashboard");
    }
    function orders(){
        navigate("/orders");
    }
    function account(){
        navigate("/account");
    }
    function cart(){
        navigate("/cart");
    }
    function logoutUser(){
        dispatch(logout());
        alert.success("Logout successful.")
    }

  return (
    <>
        <Backdrop open={open} style={{zIndex:"11"}}/>
        <SpeedDial
            ariaLabel='SpeedDial tooltip example'
            onClose={()=>setOpen(false)}
            onOpen={()=>setOpen(true)}
            open={open}
            direction="down"
            className='speedDial'
            style={{zIndex:"11"}}
            icon={<img className="speedDialIcon" src={user.avatar.url ? user.avatar.url : "/profile.png"} alt="profile"/>}
        >
        {options.map((item)=>(
            <SpeedDialAction 
            key={item.name} 
            icon={item.icon} 
            tooltipTitle={item.name} 
            onClick={item.func}
            tooltipOpen={window.innerWidth<=650 ? true : false} 
                />
        ))}
        </SpeedDial>
    </>
  )
}

export default UserOptions