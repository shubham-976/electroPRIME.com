import React from "react";
import "./About.css";
import { Button, Typography, Avatar } from "@material-ui/core";
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import { useNavigate } from "react-router-dom";
import electroPRIMELogo from "../../../images/electroPRIMELogo.png"
import developerPic from "../../../images/developerPic.jpg"

const About = () => {
  const navigate = useNavigate();

  const takeToHomepage = () => {
    navigate("/");
  };
  return (
    <div className="aboutSection">
      <div></div> {/* 1st half white div */}
      <div className="aboutSectionGradient"></div> {/* 2nd half colorful div */}

      <div className="aboutSectionContainer"> {/* This is OVER the above 2 divs */}
        <Typography component="h1">About Us</Typography>

        <div>

          <div>
            <Typography component="h2">electroPRIME.com</Typography>
            <Avatar
              style={{ width: "10vmax", height: "10vmax", margin: "2vmax 0" }}
              src={electroPRIMELogo}
              alt="electroPRIME"
            />
            <Button onClick={takeToHomepage} color="primary">
              Visit our Website
            </Button>
            <span>
              <b>electroPRIME</b> is an exclusive 'Electronics online store'. You just name the electronic item and we have got you covered.
              We provide 'Best Deals at Best Prices' to every Customer.
            </span>
          </div>

          <div className="aboutSectionContainer2">
            <Typography component="h2">Our Developer(s)</Typography>
            <Avatar
              style={{ width: "10vmax", height: "10vmax", margin: "2vmax 0" }}
              src={developerPic}
              alt="developer"
            />
            <a href="https://linkedin.com/in/shubham-11547b237" target="blank">
              <LinkedInIcon className="LinkedinSvgIcon" />
            </a>
            <span>
              Shubham CSE'24 NIT_KKR
            </span>
          </div>

        </div>
      </div>
    </div>
  );
};

export default About;