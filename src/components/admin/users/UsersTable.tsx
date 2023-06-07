import React, {useState, useEffect} from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Button, Modal, Typography, Divider, Grid, CircularProgress
} from '@mui/material';
import UpdateUserForm from "./UpdateUserForm";
import {IUser} from "../../../types";
import UserOrdersForm from "./UserOrdersForm";

interface UserTableProps {
  usersTable: IUser[];
  handleDeleteTable: (id: number) => Promise<void>;
  handleUpdateTable: (updatedUser: Partial<IUser>) => Promise<void>;
}

const UserTable: React.FC<UserTableProps> = ({usersTable, handleDeleteTable, handleUpdateTable}) => {
  const [users, setUsers] = useState<IUser[]>([]);
  const [selectedUser, setSelectedUser] = useState<IUser | null>(null);
  const [open, setOpen] = useState(false);
  const [openOrders, setOpenOrders] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setUsers(usersTable)
    setTimeout(() => {
      setIsLoading(false)
    }, 300)

  }, [usersTable]);


  const handleOpen = (user: IUser) => {
    setSelectedUser(user);
    setOpen(true);
  };

  const handleOpenOrders = (user: IUser) => {
    setSelectedUser(user);
    setOpenOrders(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleCloseOrders = () => {
    setOpenOrders(false);
  };

  const handleDelete = async (userId: number) => {
    try {
      await handleDeleteTable(userId);
    } catch (error) {
      console.error(error);
    }
  };

  const handleUpdate = async (updatedUser: Partial<IUser>) => {
    try {
      await handleUpdateTable(updatedUser)
      handleClose();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div style={{width: '70%', minHeight: '630px'}}>
      {isLoading && (
        <Grid style={{
          width: '100%',
          height: '600px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'center'
        }}>
          <CircularProgress/>
        </Grid>
      )}
      {!isLoading && (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow style={{backgroundColor: '#ece8f5'}}>
                <TableCell style={{textAlign: 'center'}}>Username</TableCell>
                <TableCell style={{textAlign: 'center'}}>Email</TableCell>
                <TableCell style={{textAlign: 'center'}}>Role</TableCell>
                <TableCell style={{textAlign: 'center'}}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell style={{textAlign: 'center'}}>{user.username}</TableCell>
                  <TableCell style={{textAlign: 'center'}}>{user.email}</TableCell>
                  <TableCell style={{textAlign: 'center'}}>{user.role}</TableCell>
                  <TableCell style={{textAlign: 'center'}}>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => handleOpenOrders(user)}
                      style={{marginRight: '0.5rem'}}
                      disabled={user.role === 'admin'}
                    >
                      Orders
                    </Button>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => handleOpen(user)}
                      style={{marginRight: '0.5rem'}}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="outlined"
                      color="secondary"
                      onClick={() => handleDelete(user.id)}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Modal
        open={open}
        onClose={handleClose}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          height: '100%',
          overflow: 'auto',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          position: 'fixed',
          top: 0,
          left: 0,
          zIndex: 9999,
        }}
      >
        <div
          style={{
            backgroundColor: '#fff',
            padding: '20px',
            borderRadius: '5px',
            boxShadow: '0 0 10px rgba(0, 0, 0, 0.3)',
            maxWidth: '70%',
            maxHeight: '90%',
            overflow: 'auto',
            boxSizing: 'border-box',
          }}
        >
          {selectedUser && <UpdateUserForm user={selectedUser} onUpdate={handleUpdate}/>}
        </div>
      </Modal>
      <Modal
        open={openOrders}
        onClose={handleCloseOrders}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          height: '100%',
          overflow: 'auto',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          position: 'fixed',
          top: 0,
          left: 0,
          zIndex: 1,
        }}
      >
        <div
          style={{
            backgroundColor: '#fff',
            padding: '20px',
            borderRadius: '5px',
            boxShadow: '0 0 10px rgba(0, 0, 0, 0.3)',
            maxWidth: '60%',
            maxHeight: '90%',
            overflow: 'auto',
            boxSizing: 'border-box',
          }}
        >
          <Typography variant="h5" component="div" style={{marginBottom: '20px'}}>
            History of orders
          </Typography>
          <Divider style={{marginBottom: '30px'}}></Divider>
          {selectedUser && <UserOrdersForm user={selectedUser}/>}
        </div>
      </Modal>
    </div>
  );
};

export default UserTable;