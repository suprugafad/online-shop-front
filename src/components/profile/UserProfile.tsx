import React, {useState} from "react";
import {IUser} from "../../types";
import {TextField, Button, Stack, Box} from "@mui/material";

interface UserProfileProps {
  user: IUser;
  onUserUpdate: (user: IUser) => void;
}

export const UserProfile: React.FC<UserProfileProps> = ({user, onUserUpdate}) => {
  const [edit, setEdit] = useState(false);
  const [newName, setNewName] = useState(user.username);
  const [newEmail, setNewEmail] = useState(user.email);

  const handleEdit = () => {
    setEdit(!edit);
  };

  const handleSave = () => {
    const updatedUser: IUser = {...user, username: newName, email: newEmail};
    onUserUpdate(updatedUser);
    setEdit(false);
  };

  return (
    <Stack spacing={2} style={{width: '70%'}}>
      <TextField
        label="Name"
        value={newName}
        disabled={!edit}
        onChange={(e) => setNewName(e.target.value)}
      />
      <TextField
        label="Email"
        value={newEmail}
        disabled={!edit}
        onChange={(e) => setNewEmail(e.target.value)}
      />
      <Box style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
        <Button sx={{width: '50px'}} variant="contained" onClick={handleEdit}>{edit ? "Cancel" : "Edit"}</Button>
        {edit && <Button onClick={handleSave}>Save</Button>}
        <Button >Change password</Button>
      </Box>
    </Stack>
  );
};