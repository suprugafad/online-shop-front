import React from "react";
import { Profile } from "../components/profile/Profile";
import {useLocation} from "react-router-dom";

export const ProfilePage = () => {

  const location = useLocation();
  const userId = location.state?.user;


  return (
    <div style={{display:'flex', justifyContent: 'center', alignItems: 'center'}}>
      <Profile user={userId}/>
    </div>
  );
};