import axios from 'axios';
import {Category} from "../types";

class ProductAPI {
  public async createCategory(newCategory: string) {
    try {
      await axios.post(`http://localhost:5000/api/categories`, { name: newCategory});
    } catch (err) {
      console.error(err);
    }
  }

  public async getAllCategories() {
    try {
      const response = await axios.get("http://localhost:5000/api/categories");

      return response.data.map((category: any) => ({
        id: category._id,
        name: category._name,
      }));
    } catch (err) {
      console.error(err);
    }
  }

  public async getProductCategories(productId: number) {
    try {
      const categoryIds = await axios.get(`http://localhost:5000/api/productCategories/product_id/${productId}`);
      const productCategories = categoryIds.data.map((categoryId: any) => categoryId._categoryId);

      const categories: Category[] = [];

      for (const id of productCategories) {
        const response = await axios.get(`http://localhost:5000/api/categories/${id}`);
        const category = {id: response.data._id, name: response.data._name};

        categories.push(category);
      }

      return categories;
    } catch (error) {
      console.error(error);
    }
  }

  public async addToCart(productId: number) {
    try {
      const userData = await axios.get('http://localhost:5000/api/auth/userId', { withCredentials: true });
      const userId = userData.data.userId;
      const response = await axios.get(`http://localhost:5000/api/carts/${userId}`, { withCredentials: true });
      await axios.post(`http://localhost:5000/api/cartItems`, {
        productId: productId,
        cartId: response.data._id,
        quantity: 1,
      }, { withCredentials: true });

    } catch (error) {
      console.error(error);
    }
  }
}

const productAPI = new ProductAPI();
export default productAPI;