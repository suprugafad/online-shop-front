import React, {useState} from "react";
import {Box, Button, Rating, TextField, Typography} from "@mui/material";
import StarBorderOutlinedIcon from '@mui/icons-material/StarBorderOutlined';
import reviewApi from "../../api/ReviewApi";

interface ReviewFormProps {
  userId: number;
  productId: number;
  onAdd: () => void;
}

const ReviewForm: React.FC<ReviewFormProps> = ({ userId, productId, onAdd }) => {
  const [rating, setRating] = useState<number | null>(null);
  const [comment, setComment] = useState('');

  const handleRatingChange = (event: React.ChangeEvent<{}>, value: number | null) => {
    setRating(value);
  };

  const handleCommentChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setComment(event.target.value);
  };

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (rating !== null && comment.trim() !== '') {
      await reviewApi.createReview(userId, productId, rating, comment);

      onAdd();
    }
  }

  return (
    <Box style={{width: '400px'}}>
      <Typography variant="h6" gutterBottom>
        Leave a review
      </Typography>
      <form onSubmit={handleSubmit}>
        <Box mb={2}>
          <Rating
            name="rating"
            value={rating}
            onChange={handleRatingChange}
            precision={1}
            emptyIcon={<StarBorderOutlinedIcon fontSize="inherit" />}
          />
        </Box>
        <TextField
          label="Comment"
          value={comment}
          onChange={handleCommentChange}
          multiline
          rows={4}
          variant="outlined"
          fullWidth
          required
        />
        <Box mt={2}>
          <Button type="submit" variant="contained" color="primary">
            Submit
          </Button>
        </Box>
      </form>
    </Box>
  );
};

export default ReviewForm;