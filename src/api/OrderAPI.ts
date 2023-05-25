import axios from 'axios';
import {IAddress, ICartItem} from "../types";

interface IAddressResponse {
  _id: number;
  _country: string;
  _city: string;
  _street: string;
  _house: string;
  _apartment: string | null;
}

class OrderAPI {
  public async fetchAddresses(userId: number) {
    try {
      const response = await axios.get(`http://localhost:5000/api/addresses/user/${userId}`, { withCredentials: true });

      return response.data.map((address: IAddressResponse) => {
        let addressValue = `${address._country}, ${address._city}, ${address._street} ${address._house}, ${address._apartment ? 'Apt. ' + address._apartment : ''}`;

        return {
          id: address._id,
          addressValue: addressValue,
        };
      });
    } catch (err) {
      console.error(err);
    }
  }

  public async createAddress(userId: number, address: IAddress) {
    try {
      const response = await axios.post(`http://localhost:5000/api/addresses`, address);
      await axios.post(`http://localhost:5000/api/usersAddresses`, { addressId: response.data.addressId, userId: userId });
    } catch (err) {
      console.error(err);
    }
  }

  public async checkoutOrder(userId: number, products: ICartItem[], comment: string, totalPrice: number, addressId: number) {
    try {
      let productsInfo = [];

      for (const cartItem of products) {
        const product = await axios.get(`http://localhost:5000/api/products/${cartItem.product.id}`);
        productsInfo.push({ id: product.data._id, price: product.data._price, title: product.data._title, quantity: cartItem.quantity});
      }

      const response = await axios.post(`http://localhost:5000/api/orders`, { userId, products: productsInfo, comment, totalPrice, addressId }, { withCredentials: true });
      return response.data.orderId;
    } catch (err) {
      console.error(err);
    }
  }

  public async createPayment(userId: number, orderId: number, amount: number, method: string) {
    try {
      await axios.post(`http://localhost:5000/api/payments`, { userId, orderId, transactionId: null, transactionDate: null, amount, method, status: "PENDING"});
    } catch (err) {
      console.error(err);
    }
  }


}

const orderAPI = new OrderAPI();
export default orderAPI;