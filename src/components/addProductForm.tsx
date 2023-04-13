import React, {FormEvent, useEffect, useState} from "react";
import {
  TextField,
  Button,
  IconButton,
  FormControlLabel,
  Checkbox,
  FormControl,
  FormLabel, FormGroup
} from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import axios from "axios";
import { flexbox } from '@mui/system';

interface AddProductFormProps {
  onAddProduct: (newProduct: any) => void;
}

interface Category {
  id: number;
  name: string;
}

const styles = {
  inputFile: {
    backgroundColor: "rgba(41,105,217,0.22)",
    color: "black",
    padding: "0.5rem 1rem",
    borderRadius: "0.25rem",
    width: "100%",
    fontSize: "1rem",
    cursor: "pointer",
    border: "none",
    outline: "none",
    transition: "all 0.3s ease",
    marginBottom: "1rem"
  },
  formControl: {
    width: "100%",
    display: "flex",
    ...flexbox({
      flexWrap: "wrap",
    }),
    marginBottom: "1rem"
  },
  formGroup: {
    width: "100%",
    ...flexbox({
      flexDirection: "row",
      justifyContent: "space-between",
    }),
  },
  categoryButton: {
    width: "27%",
    flexShrink: 0,
  },
};

const AddProductForm: React.FC<AddProductFormProps> = ({onAddProduct}) => {
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [price, setPrice] = useState<number>(0);
  const [mainImage, setMainImage] = useState<File | null>(null);
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
      setMainImage(null);
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
        style={{marginBottom: "1rem"}}
      />
      <TextField
        label="Description"
        value={description}
        onChange={handleDescriptionChange}
        fullWidth
        style={{marginBottom: "1rem"}}
        autoComplete="off"
      />
      <TextField
        label="Price"
        type="number"
        value={price}
        onChange={handlePriceChange}
        fullWidth
        style={{marginBottom: "1rem"}}
      />
      <FormControl component="fieldset" style={styles.formControl}>
        <FormLabel component="legend">Category</FormLabel>
        <FormGroup style={styles.formGroup}>
          {allCategories.map((category) => (
            <FormControlLabel style={styles.categoryButton}
              key={category.id}
              control={
                <Checkbox
                  checked={selectedCategories.includes(category.id)}
                  onChange={handleCategoryChange}
                  value={category.id.toString()}
                />
              }
              label={category.name}
            />
          ))}
        </FormGroup>
      </FormControl>
      <input style={styles.inputFile} type="file" onChange={handleMainImageChange}/>
      {mainImageUrl && (
        <img
          src={mainImageUrl}
          alt="Main Image"
          style={{maxWidth: "30%", marginBottom: "1rem", borderRadius: "0.25rem"}}
        />
      )}
      <input style={styles.inputFile} type="file" multiple onChange={handleAdditionalImagesChange}/>
      <div style={{ display: "flex", flexWrap: "wrap" }}>
        {additionalImages.map((file, index) => (
          <div key={index} style={{position: 'relative', maxWidth: "30%", margin: "0.5rem"}}>
            <img
              key={index}
              src={URL.createObjectURL(file)}
              alt={`Additional Image ${index + 1}`}
              style={{maxWidth: "100%", marginBottom: "1rem", borderRadius: "0.25rem"}}
            />
            <IconButton
              style={{position: 'absolute', top: '0.25rem', right: '0.25rem', backgroundColor: "white"}}
              onClick={() => handleDeleteImage(index)}
            >
              <CloseIcon/>
            </IconButton>
          </div>
        ))}
      </div>
      <Button type="submit" variant="contained" sx={{
        py: '0.8rem',
        mt: 2,
        width: '100%',
        marginInline: 'auto',
      }}>
        Add product
      </Button>
    </form>
  );
};

export default AddProductForm;
export type {AddProductFormProps};