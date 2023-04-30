import React from 'react'
import playstore from "../../../images/playstore.png"
import appstore from "../../../images/appstore.png"
import linkedin from "../../../images/linkedin.png"
import youtube from "../../../images/youtube.png"
import facebook from "../../../images/facebook.png"
import instagram from "../../../images/instagram.png"
import electroPRIMELogo from "../../../images/electroPRIMELogo.png"
import "./Footer.css"

const Footer = () => {
  return (
    <footer id="footer">
        <div className="leftFooter">
            <h4>Download our App</h4>
            <img src={playstore} alt="playstore"></img>
            <img src={appstore} alt="appstore"></img>
        </div>
        <div className="midFooter">
            <div id="brand">
                <img src={electroPRIMELogo} alt="electroPRIME logo" />
                <h1>electroPRIME.com</h1>
                <h3>-- Best Deals at Best Prices --</h3>
            </div>
            <p>Copyrights &copy; 2023 | electroprime-onlinestore.onrender.com | All Rights Reserved</p>
        </div>
        <div className="rightFooter">
            <h4>Connect with us</h4>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer"><img src={linkedin} alt="linkedin logo" /></a>
            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer"><img src={youtube} alt="youtube logo" /></a>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer"><img src={facebook} alt="facebook logo" /></a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer"><img src={instagram} alt="instagram logo" /></a>
        </div>
    </footer>  
  );
};

export default Footer