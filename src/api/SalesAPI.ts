import axios from "axios";
import {IMonthlySales} from "../types";

const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

class SalesAPI {
  public async getMonthlySales() {
    const labels = [];
    const salesData = [];

    try {
      const response = await axios.get(`http://localhost:5000/api/orders/sales`);
      const sales: IMonthlySales[] = response.data;

      for (let i = 0; i < sales.length; i++) {
        const monthNumber = parseInt(sales[i].month) - 1;
        labels.push(monthNames[monthNumber]);
        salesData.push(parseFloat(sales[i].total_sales.replace('$', '')));
      }

      return {
        labels: labels,
        datasets: [
          {
            label: 'Sales',
            data: salesData,
            backgroundColor: ['#6d3398', '#6d3398'],
            borderColor: "black",
            borderWidth: 1
          },
        ],
      };
    } catch (err) {
      console.error(err);
      return {
        labels: [],
        datasets: []
      };
    }
  }

  public async getAmountOfCustomers() {
    try {
      const response = await axios.get(`http://localhost:5000/api/users/amountCustomers`);
      return response.data;
    } catch (err) {
      console.error(err);
    }
  }

  public async getTotalSales() {
    try {
      const response = await axios.get(`http://localhost:5000/api/payments/totalAmount`);
      return response.data;
    } catch (err) {
      console.error(err);
    }
  }

  public async getAmountOfDeliveredOrders() {
    try {
      const response = await axios.get(`http://localhost:5000/api/orders/amountDelivered`);
      return response.data;
    } catch (err) {
      console.error(err);
    }
  }
}

const salesApi = new SalesAPI();
export default salesApi;