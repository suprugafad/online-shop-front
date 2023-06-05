import React, {useEffect, useState} from "react";
import {
  Box,
  Button,
  Dialog, DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Rating,
  TextField,
  Typography
} from "@mui/material";
import StarBorderOutlinedIcon from '@mui/icons-material/StarBorderOutlined';
import {IReview} from "../../types";
import reviewApi from "../../api/ReviewApi";

interface ReviewFormProps {
  review: IReview;
  onUpdate: (updatedReview: Partial<IReview>) => void;
  onClose: () => void;
}

const UpdateReviewForm: React.FC<ReviewFormProps> = ({  review , onUpdate, onClose}) => {
  const [rating, setRating] = useState<number | null>(review.rating);
  const [comment, setComment] = useState(review.comment);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  const handleRatingChange = (event: React.ChangeEvent<{}>, value: number | null) => {
    setRating(value);
  };

  const handleCommentChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setComment(event.target.value);
  };

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const updatedReview = {
      id: review.id,
      productId: review.id,
      userId: review.userId,
      rating: rating || review.rating,
      comment,
    };

    onUpdate(updatedReview)

    setRating(null);
    setComment('');
  }

  function handleDeleteReview() {
    setOpenDeleteDialog(true);
  }

  async function handleConfirmDelete() {
    await reviewApi.deleteReview(review.id);
    setOpenDeleteDialog(false);
    onClose();
  }

  function handleCancelDelete() {
    setOpenDeleteDialog(false);
  }

  return (
    <Box style={{width: '400px'}}>
      <Typography variant="h6" gutterBottom>
        Edit your review
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
        <Box mt={2} style={{display: 'flex', justifyContent: 'space-between'}}>
          <Button type="submit" variant="contained" color="primary">
            Submit
          </Button>
          <Button onClick={handleDeleteReview} style={{border: 'solid 1px #7E52A0'}}>
            Delete review
          </Button>
        </Box>
      </form>

      <Dialog
        open={openDeleteDialog}
        onClose={handleCancelDelete}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Confirm Delete"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete the review?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelDelete} color="primary">
            Cancel
          </Button>
          <Button onClick={handleConfirmDelete} color="primary" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UpdateReviewForm;