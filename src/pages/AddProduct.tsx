import React from "react";
import { Box, Typography, Grid } from "@mui/material";
import AddProductForm, { AddProductFormProps } from "../components/AddProductForm";

const styles = {
  container: {
    maxWidth: 600,
    margin: "0 auto",
    padding: "20px",
  },
  title: {
    marginBottom: "20px",
  },
};

const AddProductPage = () => {
  const handleAddProduct = (newProduct: any) => {
    // редирект на страницу с подробной информацией о продукте
    // или показать сообщение об успешном добавлении продукта
  };

  const formProps: AddProductFormProps = { onAddProduct: handleAddProduct };

  return (
    <Box style={styles.container}>
      <Typography variant="h4" component="h1" style={styles.title}>
        Add product
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <AddProductForm {...formProps} />
        </Grid>
      </Grid>
    </Box>
  );
};

export default AddProductPage;