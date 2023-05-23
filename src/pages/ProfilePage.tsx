import React from "react";
import { Profile } from "../components/profile/Profile";
import {useLocation} from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";

export const ProfilePage = () => {

  const location = useLocation();
  const userId = location.state?.user;

  return (
    <>
      <Header title="GameScape" />
      <div style={{display:'flex', justifyContent: 'center', minHeight: '800px'}}>
        <Profile user={userId}/>
      </div>
      <Footer />
    </>
  );
};