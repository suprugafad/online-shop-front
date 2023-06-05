import axios from "axios";

class ReviewApi {
  public async createReview(userId: number, productId: number, rating: number, comment: string) {
    try {
      await axios.post(`http://localhost:5000/api/reviews`, {userId, productId, rating, comment});
    } catch (err) {
      console.error(err);
    }
  }

  public async getProductReviews(productId: number) {
    try {
      const response = await axios.get(`http://localhost:5000/api/reviews/product_id/${productId}`);
      return response.data.map((review: any) => (
        {
          id: review._id,
          comment: review._comment,
          rating: review._rating,
          productId: review._productId,
          userId: review._userId,
        }));
    } catch (error) {
      console.error(error);
    }
  }

  public async deleteReview(reviewId: number) {
    try {
      await axios.delete(`http://localhost:5000/api/reviews/${reviewId}`);
    } catch (err) {
      console.error(err);
    }
  }

  public async updateReview(reviewId: number, userId: number, productId: number, rating: number, comment: string) {
    try {
      await axios.put(`http://localhost:5000/api/reviews/${reviewId}`, {userId, productId, rating, comment});
    } catch (err) {
      console.error(err);
    }
  }

  public async fetchProductReviewsByUserId(productId: number, userId: number) {
    try {
      const response = await axios.get(`http://localhost:5000/api/reviews/product/${productId}/user/${userId}`);
      const review = response.data;

      return {
        id: review._id,
        comment: review._comment,
        rating: review._rating,
        productId: review._productId,
        userId: review._userId,
      };
    } catch (error) {
      console.error(error);
    }
  }

  public async isUserBoughtProduct(productId: number, userId: number) {
    try {
      const response = await axios.get(`http://localhost:5000/api/orders/product/${productId}/user/${userId}`);
      return response.data.isExist;
    } catch (err) {
      console.error(err);
    }
  }

}

const reviewApi = new ReviewApi();
export default reviewApi;