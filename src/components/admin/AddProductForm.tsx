import React, {FormEvent, useEffect, useState} from "react";
import {
  TextField, Button, FormControlLabel, Checkbox, FormControl,
  FormLabel, Box, Input, IconButton, Grid, Container, FormGroup
} from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import axios from "axios";
import { Category } from "../../types";
import {
  buttonStyles, submitButton, centeredContainer, formControl, input, buttonBack,
  mainImageStyle, additionalImage, additionalImageWrapper, additionalImagesList, deleteIconButton, textField
} from "../../styles/addProductFormStyles";
import { Link } from 'react-router-dom';

interface AddProductFormProps {
  onAddProduct: (newProduct: any) => void;
}

const AddProductForm: React.FC<AddProductFormProps> = ({onAddProduct}) => {
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [price, setPrice] = useState<number>(0);
  const [amount, setAmount] = useState<number>(0);
  const [mainImage, setMainImage] = useState<File | "">("");
  const [additionalImages, setAdditionalImages] = useState<File[]>([]);
  const [mainImageUrl, setMainImageUrl] = useState<string | null>(null);
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
  const [allCategories, setAllCategories] = useState<Category[]>([]);

  useEffect(() => {
    axios.get("http://localhost:5000/api/categories").then((response) => {
      const data = response.data.map((category: any) => ({
        id: category._id,
        name: category._name,
      }));
      setAllCategories(data);
    }).catch((error) => {
      console.error(error);
    });
  }, []);

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };

  const handleDescriptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDescription(event.target.value);
  };

  const handlePriceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPrice(parseInt(event.target.value));
  };

  const handleAmountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAmount(parseInt(event.target.value));
  };

  const handleMainImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const file = event.target.files[0];
      setMainImage(file);
      setMainImageUrl(URL.createObjectURL(file));
    }
  };

  const handleAdditionalImagesChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const files = Array.from(event.target.files);
      setAdditionalImages([...additionalImages, ...files.slice(0, 10)]);
    }
  };

  const handleDeleteImage = (index: number) => {
    const newImages = [...additionalImages];
    newImages.splice(index, 1);
    setAdditionalImages(newImages);
  };

  const handleCategoryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const categoryId = parseInt(event.target.value);
    if (selectedCategories.includes(categoryId)) {
      setSelectedCategories(selectedCategories.filter(id => id !== categoryId));
    } else {
      setSelectedCategories([...selectedCategories, categoryId]);
    }
  };

  const addProductCategory = async (productId: number, categoryId: number) => {
    try {
      await axios.post(
        "http://localhost:5000/api/productCategories",
        { productId: productId, categoryId: categoryId },
        {
          headers: { "Content-Type": "application/json" },
        }
      );
    } catch (error) {
      console.error(error);
      throw new Error("Unable to add product category");
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("price", price.toString());
    formData.append("amount", amount.toString());

    if (mainImage) {
      formData.append("mainImage", mainImage);
    }

    additionalImages.forEach((image, index) => {
      formData.append("additionalImages", image, `additionalImage-${index}`);
    });

    selectedCategories.forEach((categoryId, index) => {
      formData.append(`selectedCategories[${index}]`, categoryId.toString());
    });

    try {
      const response = await axios.post("http://localhost:5000/api/products", formData, {
        headers: {"Content-Type": "multipart/form-data"},
      });

      onAddProduct(response.data);

      const promises = selectedCategories.map(categoryId => addProductCategory(response.data.id, categoryId));
      await Promise.all(promises);

      setTitle("");
      setDescription("");
      setPrice(0);
      setAmount(0);
      setMainImage("");
      setMainImageUrl(null);
      setAdditionalImages([]);
      setSelectedCategories([]);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <TextField
        label="Title"
        value={title}
        onChange={handleTitleChange}
        fullWidth
        sx={textField}/>
      <TextField
        label="Description"
        value={description}
        onChange={handleDescriptionChange}
        fullWidth
        sx={textField}
        autoComplete="off"
      />
      <TextField
        label="Price"
        type="number"
        value={price}
        onChange={handlePriceChange}
        fullWidth
        sx={textField}
      />
      <TextField
        label="Amount"
        type="number"
        value={amount}
        onChange={handleAmountChange}
        fullWidth
        sx={textField}
      />
      <Container sx={centeredContainer}>
      <FormControl component="fieldset" sx={formControl}>
        <FormLabel component="legend">Category</FormLabel>
        <FormGroup>
          <Grid container spacing={3} >
            {allCategories.map((category) => (
              <Grid item xs={4} key={category.id}>
                <FormControlLabel key={category.id} label={category.name} control={
                    <Checkbox
                      checked={selectedCategories.includes(category.id)}
                      onChange={handleCategoryChange}
                      value={category.id.toString()}
                    />
                  }
                />
              </Grid>
            ))}
          </Grid>
        </FormGroup>
      </FormControl>
      </Container>
      <Box className={"input-file-box"}>
        <Input type="file" onChange={handleMainImageChange} id="file-input-main" disableUnderline sx={input}/>
        <label htmlFor="file-input-main">
          <Button component="span" sx={buttonStyles}>
            Choose main photo
          </Button>
        </label>
      </Box>
      {mainImageUrl && (
        <Box component="img" src={mainImageUrl} alt="Main Image" sx={mainImageStyle}/>
      )}
      <Box className={"input-file-box"}>
        <Input type="file" onChange={handleAdditionalImagesChange} id="file-input-additional" disableUnderline sx={input}/>
        <label htmlFor="file-input-additional">
          <Button component="span" sx={buttonStyles}>
            Choose additional photos
          </Button>
        </label>
      </Box>
      <Box sx={additionalImagesList}>
        {additionalImages.map((file, index) => (
          <Box key={index} sx={additionalImageWrapper}>
            <Box
              component="img"
              key={index}
              src={URL.createObjectURL(file)}
              alt={`Additional Image ${index + 1}`}
              sx={additionalImage}
            />
            <IconButton sx={deleteIconButton} onClick={() => handleDeleteImage(index)}>
              <CloseIcon/>
            </IconButton>
          </Box>
        ))}
      </Box>
      <Button type="submit" variant="contained" sx={submitButton}>
        Add product
      </Button>
      <Button variant="outlined" sx={buttonBack}>
        <Link to="/productPage" style={{ textDecoration: 'none', color: 'inherit' }}>
          Back
        </Link>
      </Button>
    </form>
  );
};

export default AddProductForm;
export type {AddProductFormProps};