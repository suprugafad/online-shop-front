import React, { useState, useEffect, FormEvent } from 'react';
import { TextField, Button } from '@mui/material';
import axios from 'axios';
import {IUser} from "../../types";

interface UpdateUserFormProps {
  user: IUser;
  onUpdate: (updatedUser: Partial<IUser>) => void;
}

const UpdateUserForm: React.FC<UpdateUserFormProps> = ({ user, onUpdate }) => {
  const [username, setUsername] = useState<string>(user.username);
  const [email, setEmail] = useState<string>(user.email);
  const [role, setRole] = useState<string>(user.role);

  const handleUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(event.target.value);
  };

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  const handleRoleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRole(event.target.value);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const updatedUser = {
      id: user.id,
      username,
      email,
      role,
    };

    onUpdate(updatedUser);
  };

  return (
    <form onSubmit={handleSubmit}>
      <TextField
        label="Username"
        value={username}
        disabled={true}
        onChange={handleUsernameChange}
        fullWidth
        style={{ marginBottom: "1rem" }}
      />
      <TextField
        label="Email"
        value={email}
        disabled={true}
        onChange={handleEmailChange}
        fullWidth
        style={{ marginBottom: "1rem" }}
      />
      <TextField
        label="Role"
        value={role}
        onChange={handleRoleChange}
        fullWidth
        style={{ marginBottom: "1rem" }}
      />
      <Button type="submit" variant="contained" sx={{ py: '0.8rem', mt: 2, width: '100%', marginInline: 'auto' }}>
        Update user
      </Button>
    </form>
  );
};

export default UpdateUserForm;
