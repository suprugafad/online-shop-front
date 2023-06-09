import React, {useEffect, useState} from "react";
import {IUser, IOrder} from "../../types";
import {UserProfile} from "./UserProfile";
import {OrderHistory} from "./OrderHistory";
import {Box, Container, Typography} from "@mui/material";
import profileAPI from "../../api/ProfileAPI";

interface ProfileProps {
  user: IUser;
}

export const Profile: React.FC<ProfileProps> = ({user}) => {
  const [currentUser, setCurrentUser] = useState(user);
  const [orders, setOrders] = useState<IOrder[]>([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await profileAPI.fetchOrders(currentUser.id);

        setOrders(data);
      } catch (error) {
        console.error(error);
      }
    }

    fetchData().catch(() => {
    });
  }, [currentUser]);

  const handleUserUpdate = async (updatedUser: IUser) => {
    await profileAPI.updateUserInfo(updatedUser);
    setCurrentUser(updatedUser);
  };

  return (
    <Container style={{width: '70%'}}>
      <h1 style={{textAlign: 'center', marginTop: '60px'}}>Profile</h1>
      <Box style={{display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '40px'}}>
        <UserProfile user={currentUser} onUserUpdate={handleUserUpdate}/>
      </Box>
      <Typography sx={{textAlign: 'center', marginTop: '50px', fontSize: '20px'}}>Order history <em
        style={{fontSize: '15px'}}>(for last 6 month)</em></Typography>
      <Box style={{minHeight: '390px', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '30px'}}>
        <OrderHistory orders={orders}/>
      </Box>
    </Container>
  );
};