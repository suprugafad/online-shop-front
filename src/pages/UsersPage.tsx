import React, { useState, useEffect } from "react";
import axios from "axios";
import { IUser } from "../types";
import UsersTable from "../components/admin/UsersTable";
import HeaderAdmin from "../components/admin/HeaderAdmin";
import Footer from "../components/Footer";


const UsersPage: React.FC = () => {
  const [users, setUsers] = useState<IUser[]>([]);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/users');
      const userData = response.data.map(async (user: any) => {

        return {
          id: user._id,
          username: user._username,
          email: user._email,
          role: user._role,
        }
      });

      const users = await Promise.all(userData);

      setUsers(users);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchUsers().catch(() => {});
  });

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`http://localhost:5000/api/users/${id}`);
      setUsers(users.filter((user: IUser) => user.id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  const handleUpdate = async (updatedUser: Partial<IUser>) => {
    try {
      await axios.put(
        `http://localhost:5000/api/users/${updatedUser.id}`,
        updatedUser,
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      const newUser = users.map((user: IUser) =>
        user.id === updatedUser.id ? { ...user, ...updatedUser } : user
      );
      setUsers(newUser);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div >
      <HeaderAdmin title="GameScape"/>
      <h1 style={{textAlign: "center"}}>Users</h1>
      <div style={{display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: '100%',
      marginBottom: '80px'}}>
        <UsersTable
          usersTable={users}
          handleDeleteTable={handleDelete}
          handleUpdateTable={handleUpdate}
        />
      </div>
      <Footer></Footer>
    </div>
  );
};

export default UsersPage;