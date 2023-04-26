import React, { useState, useEffect, FormEvent } from 'react';
import { TextField, Button, FormControl, FormLabel, FormGroup, FormControlLabel, Checkbox, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import axios from 'axios';
import { flexbox } from "@mui/system";
import { Product, Category } from "../types";
import {textField} from "../styles/addProductFormStyles";

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

interface UpdateProductFormProps {
  product: Product;
  onUpdate: (updatedProduct: Partial<Product>) => void;
}

const UpdateProductForm: React.FC<UpdateProductFormProps> = ({ product, onUpdate }) => {
  const [title, setTitle] = useState<string>(product.title);
  const [description, setDescription] = useState<string>(product.description);
  const [price, setPrice] = useState<number>(product.price);
  const [amount, setAmount] = useState<number>(0);
  const [mainImage, setMainImage] = useState<string>('');
  const [additionalImages, setAdditionalImages] = useState<string[]>([]);
  const [mainImageUrl, setMainImageUrl] = useState<string>(`http://localhost:5000/assets/images/products/${product.title}/${product.mainImage}`);
  const [selectedCategories, setSelectedCategories] = useState<number[]>(product.categories || []);
  const [allCategories, setAllCategories] = useState<Category[]>([]);
  const [initialCategories, setInitialCategories] = useState<number[]>(product.categories || []);

  useEffect(() => {
    setMainImageUrl(`http://localhost:5000/assets/images/products/${product.title}/${product.mainImage}`);
    setAdditionalImages(product.additionalImages ?
      product.additionalImages.map(img => `http://localhost:5000/assets/images/products/${product.title}/${img}`) : []);
    fetchCategories();
    fetchProductCategories(product.id);
  }, [product]);

  const fetchCategories = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/categories");
      let categories: [] = [];

      if (response && response.data) {
        categories = response.data.map((category: any) => ({
            id: category._id,
            name: category._name
          }
        ));
      }

      setAllCategories(categories);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchProductCategories = async (productId: number) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/productCategories/product_id/${productId}`);

      if (response && response.data) {
        console.log(response.data)
        const productCategories = response.data.map((category: any) => category._categoryId);
        setInitialCategories(productCategories || [])
        setSelectedCategories(productCategories);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const deleteProductCategory = async (productId: number, categoryId: number) => {
    try {
      await axios.delete(`http://localhost:5000/api/productCategories/${productId}/${categoryId}`);
    } catch (error) {
      console.error(error);
      throw new Error("Unable to delete product category");
    }
  };

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
      const reader = new FileReader();
      reader.onloadend = () => {
        setMainImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAdditionalImagesChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const files = Array.from(event.target.files);
      const newImages: string[] = [];
      files.forEach((file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          newImages.push(reader.result as string);
          if (newImages.length === files.length) {
            setAdditionalImages([...additionalImages, ...newImages.slice(0, 10)]);
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const handleDeleteImage = (index: number) => {
    const newImages = [...additionalImages];
    newImages.splice(index, 1);
    setAdditionalImages(newImages);
  };

  const handleCategoryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const categoryId = parseInt(event.target.value);
    console.log(categoryId)
    if (selectedCategories && selectedCategories.includes(categoryId)) {
      setSelectedCategories(selectedCategories.filter(id => id !== categoryId));
    } else {
      setSelectedCategories(selectedCategories ? [...selectedCategories, categoryId] : [categoryId]);
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

    const updatedProduct = {
      id: product.id,
      title,
      description,
      price,
      amount,
      mainImage,
      mainImageUrl,
      additionalImages,
      categories: selectedCategories,
    };

    onUpdate(updatedProduct);

    const categoriesToAdd = selectedCategories.filter(id => !initialCategories.includes(id));
    const categoriesToDelete = initialCategories.filter(id => !selectedCategories.includes(id));

    const addPromises = categoriesToAdd.map(categoryId => addProductCategory(updatedProduct.id, categoryId));
    const deletePromises = categoriesToDelete.map(categoryId => deleteProductCategory(updatedProduct.id, categoryId));

    await Promise.all([...addPromises, ...deletePromises]);
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
      <TextField
        label="Amount"
        type="number"
        value={amount}
        onChange={handleAmountChange}
        fullWidth
        sx={textField}
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
      {(mainImage || mainImageUrl) && (
        <img
          src={mainImageUrl ?? undefined}
          alt="Main Image"
          style={{maxWidth: "30%", marginBottom: "1rem", borderRadius: "0.25rem"}}
        />
      )}
      <input style={styles.inputFile} type="file" multiple onChange={handleAdditionalImagesChange}/>
      <div style={{ display: "flex", flexWrap: "wrap" }}>
        {additionalImages && additionalImages.map((url, index) => (
          <div key={index} style={{position: 'relative', maxWidth: "30%", margin: "0.5rem"}}>
            <img
              key={index}
              src={url}
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
      <Button type="submit" variant="contained" sx={{ py: '0.8rem', mt: 2, width: '100%', marginInline: 'auto' }}>
        Update product
      </Button>
    </form>
  );
};

export default UpdateProductForm;