import React from "react";
import "./Contact.css";
import { Button } from "@material-ui/core";

const Contact = () => {
  return (
    <div className="contactContainer">
        <p>For any 'Genuine' Queries, Contact Us at : </p>
        <a className="mailBtn" href="mailto:owner.of.emarket@gmail.com">
            <Button>owner.of.emarket@gmail.com</Button>
        </a>
    </div>
  );
};

export default Contact;