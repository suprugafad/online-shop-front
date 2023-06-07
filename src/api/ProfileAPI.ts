import axios from "axios";
import {IUser} from "../types";

interface IOrderResponse {
  _id: number;
  _userId: number;
  _status: string;
  _createdAt: string;
  _totalPrice: number;
  _comment: string;
  _products: string;
}

class ProfileAPI {
  public async fetchOrders(userId: number) {
    try {
      const response = await axios.get(`http://localhost:5000/api/orders/user_id/${userId}`, {withCredentials: true});

      return response.data.map((order: IOrderResponse) => {
        const timestamp = Date.parse(order._createdAt);
        const date = new Date(timestamp);
        const formattedDate = date.toLocaleDateString('en', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          }
        );

        return {
          id: order._id,
          userId: order._userId,
          status: order._status,
          createdAt: formattedDate,
          totalPrice: order._totalPrice,
          comment: order._comment,
          products: order._products
        };
      });
    } catch (err) {
      console.error(err);
    }
  }

  public async fetchUserInfo(userId: number) {
    try {
      const response = await axios.get(`http://localhost:5000/api/users/${userId}`, {withCredentials: true});
      const user = response.data;

      return {
        id: user._id,
        username: user._username,
        email: user._email,
        role: user._role,
      };

    } catch (err) {
      console.error(err);
    }
  }

  public async updateUserInfo(updatedUser: IUser) {
    try {
      await axios.put(`http://localhost:5000/api/users/${updatedUser.id}`, { id: updatedUser.id, username: updatedUser.username, email: updatedUser.email, role: updatedUser.role }, {withCredentials: true});
    } catch (err) {
      console.error(err);
    }
  }

  public async updateUserPassword(currentPassword: string, updatedPassword: string) {

  }
}

const profileAPI = new ProfileAPI();
export default profileAPI;

