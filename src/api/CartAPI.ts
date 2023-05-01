import axios from 'axios';

interface CartItem {
  id: number,
  productId: number,
  quantity: number,
  cartId: number,
}

class CartAPI {
  public async getCartItems(cartId: number) {
    try {
      const response = await axios.get(`http://localhost:5000/api/cartItems/cart/${cartId}`);

      return response.data.map((cartItem: any) => ({
        id: cartItem._id,
        productId: cartItem._productId,
        quantity: cartItem._quantity,
        cartId: cartItem._cartId,
      }));
    } catch (error) {
      console.error(error);
      return [];
    }
  };

  public async getProducts(cartItems: CartItem[]) {
    let products = [];

    for (const item of cartItems) {
      const response = await axios.get(`http://localhost:5000/api/products/${item.productId}`, { withCredentials: true });

      const product = {
        id: response.data._id,
        title: response.data._title,
        price: response.data._price,
        mainImage: response.data._mainImage,
      };
      products.push({id: item.id, product, quantity: item.quantity});
    }
    return products;
  };

  public async getCartId(userId: number) {
    try {
      const response = await axios.get(`http://localhost:5000/api/carts/${userId}`, { withCredentials: true });
      return response.data._id;
    } catch (error) {
      console.error(error);
      return [];
    }
  };

  public async updateCartItemQuantity(cartItem: { id: number, quantity: number }) {
    try {
      const response = await axios.put(`http://localhost:5000/api/cartItems/${cartItem.id}`, {quantity: cartItem.quantity}, { withCredentials: true });
      return response.data._id;
    } catch (error) {
      console.error(error);
      return [];
    }
  };

  public async deleteCartItem(cartId: number) {
    try {
      const response = await axios.delete(`http://localhost:5000/api/cartItems/${cartId}`, { withCredentials: true });
      return response.data._id;
    } catch (error) {
      console.error(error);
    }
  };
}

export default CartAPI;