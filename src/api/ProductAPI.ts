import axios from 'axios';

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
}

const productAPI = new ProductAPI();
export default productAPI;