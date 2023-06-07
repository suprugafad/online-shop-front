import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Modal,
  Grid,
  CircularProgress,
  FormControl,
  Select,
  MenuItem, SelectChangeEvent,
} from '@mui/material';
import UpdateOrderForm from './UpdateOrderForm';
import { OrderStatus, IOrderTable } from '../../../types';

interface OrderTableProps {
  ordersTable: IOrderTable[];
  handleUpdateTable: (updatedOrder: Partial<IOrderTable>) => Promise<void>;
}

const OrderTable: React.FC<OrderTableProps> = ({ ordersTable, handleUpdateTable, }) => {
  const [orders, setOrders] = useState<IOrderTable[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<IOrderTable | null>(null);
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>('');

  useEffect(() => {
    setOrders(ordersTable);
    setTimeout(() => {
      setIsLoading(false)
    }, 300);
  }, [ordersTable]);

  const handleOpen = (order: IOrderTable) => {
    setSelectedOrder(order);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleUpdate = async (updatedOrder: Partial<IOrderTable>) => {
    try {
      await handleUpdateTable(updatedOrder);
      handleClose();
    } catch (error) {
      console.error(error);
    }
  };

  const handleFilterStatusChange = (event: SelectChangeEvent<string>) => {
    setFilterStatus(event.target.value);
  };

  const filteredOrders = filterStatus ? orders.filter((order) => order.status === filterStatus.toLowerCase()) : orders;

  return (
    <div style={{ width: '70%', minHeight: '630px' }}>
      {isLoading && (
        <Grid
          style={{
            width: '100%',
            height: '600px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            textAlign: 'center',
          }}
        >
          <CircularProgress />
        </Grid>
      )}
      {!isLoading && (
        <>
          <FormControl variant="outlined" style={{ marginBottom: '1rem' }}>
            <Select
              value={filterStatus}
              onChange={handleFilterStatusChange}
              displayEmpty
              inputProps={{ 'aria-label': 'Select Order Status' }}
            >
              <MenuItem value="">All Statuses</MenuItem>
              <MenuItem value={OrderStatus.PENDING}>Pending</MenuItem>
              <MenuItem value={OrderStatus.CONFIRMED}>Confirmed</MenuItem>
              <MenuItem value={OrderStatus.SHIPPED}>Shipped</MenuItem>
              <MenuItem value={OrderStatus.DELIVERED}>Delivered</MenuItem>
              <MenuItem value={OrderStatus.CANCELLED}>Cancelled</MenuItem>
            </Select>
          </FormControl>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow style={{ backgroundColor: '#ece8f5' }}>
                  <TableCell style={{ textAlign: 'center' }}>Order Number</TableCell>
                  <TableCell style={{ textAlign: 'center' }}>User Email</TableCell>
                  <TableCell style={{ textAlign: 'center' }}>Status</TableCell>
                  <TableCell style={{ textAlign: 'center' }}>Total price</TableCell>
                  <TableCell style={{ textAlign: 'center' }}>Payment status</TableCell>
                  <TableCell style={{ textAlign: 'center' }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell style={{ textAlign: 'center' }}>#{order.id}</TableCell>
                    <TableCell style={{ textAlign: 'center' }}>{order.userEmail}</TableCell>
                    <TableCell style={{ textAlign: 'center' }}>{order.status.toUpperCase()}</TableCell>
                    <TableCell style={{ textAlign: 'center' }}>{order.totalPrice}</TableCell>
                    <TableCell style={{ textAlign: 'center' }}>{order.paymentStatus.toUpperCase()}</TableCell>
                    <TableCell style={{ textAlign: 'center' }}>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => handleOpen(order)}
                        style={{ marginRight: '0.5rem' }}
                      >
                        Edit
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </>
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
          zIndex: 99,
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
          {selectedOrder && <UpdateOrderForm order={selectedOrder} onUpdate={handleUpdate} />}
        </div>
      </Modal>
    </div>
  );
};

export default OrderTable;
