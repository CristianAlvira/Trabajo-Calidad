import React from "react";
import { useEffect } from "react";
import { Navbar } from "./Navbar";
import { AfterNav } from "./AfterNav";
import { Info1 } from "./Info1";
import { Brands } from "./Brands";
import { Comments } from "./Comments";
import { Footer } from "./Footer";
import AOS from "aos";
import "aos/dist/aos.css";
import axios from "axios";

export const Home = ({
  isPopoverOpen,
  handlePopoverOpen,
  handlePopoverClose,
  loggedInUser,
  setLoggedInUser,
}) => {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      easing: "ease-in-out",
      once: false,
    });
  }, []);

  return (
    <div>
      <div data-aos="zoom-out">
        <>
          <Navbar
            isPopoverOpen={isPopoverOpen}
            handlePopoverOpen={handlePopoverOpen}
            handlePopoverClose={handlePopoverClose}
            loggedInUser={loggedInUser}
            setLoggedInUser={setLoggedInUser}
          />
        </>
      </div>
      <div data-aos="zoom-in">
        <>
          <AfterNav
            isPopoverOpen={isPopoverOpen}
            handlePopoverOpen={handlePopoverOpen}
            handlePopoverClose={handlePopoverClose}
            loggedInUser={loggedInUser}
            setLoggedInUser={setLoggedInUser}
          />
        </>
      </div>
      <div id="info1" data-aos="fade-up">
        <Info1 />
      </div>
      <div data-aos="fade-up">
        <Comments />
      </div>
      <Footer />
    </div>
  );
};
