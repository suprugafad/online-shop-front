import React, {useEffect, useState} from 'react';
import {
  Grid, TextField, MenuItem, Button, Dialog, DialogTitle, DialogContent, DialogContentText,
  DialogActions, Paper, Table, TableHead, TableRow, TableCell, TableBody, TableContainer,
  Box, FormControl, FormLabel, RadioGroup, FormControlLabel, Radio, FormControlLabelProps,
  useRadioGroup,
} from '@mui/material';
import {IAddressForSelect, ICartItem} from '../types';
import {styled} from '@mui/material/styles';
import {getUserId} from "../api/AuthAPI";
import orderAPI from "../api/OrderAPI";

interface CheckoutProps {
  selectedCartItems: ICartItem[];
  totalPrice: number;
}

const StyledTableRow = styled(TableRow)(({theme}) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

const Checkout: React.FC<CheckoutProps> = ({selectedCartItems, totalPrice}) => {
  const [comment, setComment] = useState('');
  const [selectedAddress, setSelectedAddress] = useState('');
  const [addresses, setAddresses] = useState<IAddressForSelect[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<number>(0);
  const [open, setOpen] = useState<boolean>(false);
  const [country, setCountry] = useState('');
  const [city, setCity] = useState('');
  const [street, setStreet] = useState('');
  const [house, setHouse] = useState('');
  const [apartment, setApartment] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');

  useEffect(() => {
    async function fetchData() {
      try {
        const userId = await getUserId();
        const data = await orderAPI.fetchAddresses(userId);

        setAddresses(data);
      } catch (error) {
        console.error(error);
      }
    }

    fetchData().catch(() => {
    });
  }, []);

  const handleCommentChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setComment(event.target.value);
  };

  const handleAddressChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedAddress(event.target.value);

    const addressId = addresses.filter((address) =>
      address.addressValue === event.target.value)[0].id;

    setSelectedAddressId(addressId)
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleAddNewAddress = async () => {
    const newAddress = {country, city, street, house, apartment};

    try {
      const userId = await getUserId();
      await orderAPI.createAddress(userId, newAddress);

      handleClose();
    } catch (err) {
      console.error(err);
    }
  };

  const handlePaymentStatusChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    setPaymentMethod(event.target.value);
  }

  const handleConfirmOrder = async () => {
    try {
      const userId = await getUserId();
      const orderId = await orderAPI.checkoutOrder(userId, selectedCartItems, comment, totalPrice, selectedAddressId);
      await orderAPI.createPayment(userId, orderId, totalPrice, paymentMethod);
    } catch (err) {
      console.error(err);
    }
  };

  interface StyledFormControlLabelProps extends FormControlLabelProps {
    checked: boolean;
  }

  const StyledFormControlLabel = styled((props: StyledFormControlLabelProps) => (
    <FormControlLabel {...props} />
  ))(({theme, checked}) => ({
    '.MuiFormControlLabel-label': checked && {
      color: theme.palette.primary.main,
    },
  }));

  function MyFormControlLabel(props: FormControlLabelProps) {
    const radioGroup = useRadioGroup();

    let checked = false;

    if (radioGroup) {
      checked = radioGroup.value === props.value;
    }

    return <StyledFormControlLabel checked={checked} {...props} />;
  }

  return (
    <Grid container spacing={2} style={{width: "60%"}}>

      <Grid item xs={12}>
        <TableContainer component={Paper}>
          <Table aria-label="customized table">
            <TableHead>
              <TableRow style={{backgroundColor:'#ece8f5'}}>
                <TableCell style={{fontSize: 'large', textAlign: 'center'}}>Product</TableCell>
                <TableCell align="right" style={{fontSize: 'large', textAlign: 'center'}}>Amount</TableCell>
                <TableCell align="right" style={{fontSize: 'large', textAlign: 'center'}}>Price</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {selectedCartItems.map((item) => (
                <TableRow key={item.product.id}>
                  <TableCell component="th" scope="row" style={{fontSize: 'large'}}>
                    <Box style={{fontSize: 'large', width: '300px', display: 'flex', alignItems: 'center'}}>
                      <img
                        src={`http://localhost:5000/assets/images/products/${item.product.title}/${item.product.mainImage}`}
                        alt={`${item.product.title}`}
                        style={{
                          height: '50px',
                          width: '50px',
                          objectFit: 'contain',
                          marginRight: '30px'
                        }}
                      />
                      {item.product.title}
                    </Box>
                  </TableCell>
                  <TableCell align="right" style={{fontSize: 'large', textAlign: 'center'}}>
                    {item.quantity}
                  </TableCell>
                  <TableCell align="right" style={{
                    fontSize: 'large',
                    textAlign: 'center'
                  }}>{(Number(item.product.price) * item.quantity)}$</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>

      <Grid item xs={12}>
        <TextField
          select
          label="Choose address"
          value={selectedAddress}
          onChange={handleAddressChange}
          fullWidth
        >
          {addresses.map((address) => (
            <MenuItem key={address.id} value={address.addressValue}>
              {address.addressValue}
            </MenuItem>
          ))}
        </TextField>
      </Grid>

      <Grid item xs={12} style={{textAlign: 'right'}}>
        <Button variant="outlined" color="primary" onClick={handleOpen}>
          Add new address
        </Button>
      </Grid>

      <Grid item xs={12} style={{textAlign: 'center'}}>
        <FormControl>
          <FormLabel id="demo-row-radio-buttons-group-label">Payment method</FormLabel>
          <RadioGroup
            row
            aria-labelledby="demo-row-radio-buttons-group-label"
            name="row-radio-buttons-group"
            onChange={handlePaymentStatusChange}
          >
            <MyFormControlLabel value="CASH" control={<Radio/>} label="Cash"/>
            <MyFormControlLabel value="CREDIT_CARD" control={<Radio/>} label="Credit Card"/>
            <MyFormControlLabel value="ONLINE" control={<Radio/>} label="Online"/>
          </RadioGroup>
        </FormControl>
      </Grid>

      <Grid item xs={12}>
        <TextField
          label="Comment to the order"
          fullWidth
          multiline
          rows={4}
          value={comment}
          onChange={handleCommentChange}
        />
      </Grid>

      <Grid item xs={12} style={{textAlign: 'center'}}>
        <Button variant="contained" color="primary" onClick={handleConfirmOrder} style={{fontSize: '20px'}}>
          Submit order
        </Button>
      </Grid>

      <Dialog open={open} onClose={handleClose} aria-labelledby="add-address-dialog-title">
        <DialogTitle id="add-address-dialog-title">Add new address</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Input address info:
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="country"
            label="Country"
            type="text"
            fullWidth
            onChange={(event) => setCountry(event.target.value)}
          />
          <TextField
            autoFocus
            margin="dense"
            id="city"
            label="City"
            type="text"
            fullWidth
            onChange={(event) => setCity(event.target.value)}
          />
          <TextField
            autoFocus
            margin="dense"
            id="street"
            label="Street"
            type="text"
            fullWidth
            onChange={(event) => setStreet(event.target.value)}
          />
          <TextField
            autoFocus
            margin="dense"
            id="house"
            label="House"
            type="text"
            fullWidth
            onChange={(event) => setHouse(event.target.value)}
          />
          <TextField
            autoFocus
            margin="dense"
            id="apartment"
            label="Apartment"
            type="text"
            fullWidth
            onChange={(event) => setApartment(event.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleAddNewAddress} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Grid>
  );
};

export default Checkout;
