import React, {FormEvent, useEffect, useState} from "react";
import { TextField, Button, FormControl, Box, Input, IconButton, Grid, Container,
  DialogTitle, DialogContent, DialogContentText, DialogActions, Dialog,
  InputLabel, MenuItem, Select, Chip, SelectChangeEvent } from "@mui/material";
import OutlinedInput from '@mui/material/OutlinedInput';
import { Theme } from '@mui/material/styles';
import CloseIcon from '@mui/icons-material/Close';
import axios from "axios";
import { Category } from "../../../types";
import { buttonStyles, submitButton, centeredContainer, formControl, input, buttonBack,
  mainImageStyle, additionalImage, additionalImageWrapper, additionalImagesList,
  deleteIconButton, textField } from "../../../styles/addProductFormStyles";
import { Link } from 'react-router-dom';
import productAPI from "../../../api/ProductAPI";
import theme from "../../../theme";

interface AddProductFormProps {
  onAddProduct: (newProduct: any) => void;
}

const AddProductForm: React.FC<AddProductFormProps> = ({onAddProduct}) => {
  const [title, setTitle] = useState<string>("");
  const [manufacturer, setManufacturer] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [price, setPrice] = useState<number>(0);
  const [amount, setAmount] = useState<number>(0);
  const [mainImage, setMainImage] = useState<File | "">("");
  const [additionalImages, setAdditionalImages] = useState<File[]>([]);
  const [mainImageUrl, setMainImageUrl] = useState<string | null>(null);
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
  const [selectedCategoriesNames, setSelectedCategoriesNames] = useState<string[]>([]);
  const [allCategories, setAllCategories] = useState<Category[]>([]);
  const [open, setOpen] = useState<boolean>(false);
  const [newCategory, setNewCategory] = useState<string>("");

  useEffect(() => {
    fetchCategories().catch(() => {});
  }, []);

  const fetchCategories = async () => {
    const categories = await productAPI.getAllCategories();
    setAllCategories(categories);
  }

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };

  const handleManufacturerChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setManufacturer(event.target.value);
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

  const handleCategoryChange = (event: SelectChangeEvent<string[]>) => {
    const {
      target: { value },
    } = event;

    setSelectedCategoriesNames(
      typeof value === 'string' ? value.split(',') : value,
    );
  };

  useEffect(() => {
    const selectedIds: number[] = [];
    allCategories.forEach((category) => {
      if (selectedCategoriesNames.includes(category.name)) {
        selectedIds.push(category.id);
      }
    })
    setSelectedCategories(selectedIds);
  }, [selectedCategoriesNames, allCategories]);

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
    formData.append("manufacturer", manufacturer);
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
      setManufacturer("");
      setDescription("");
      setPrice(0);
      setAmount(0);
      setMainImage("");
      setMainImageUrl(null);
      setAdditionalImages([]);
      setSelectedCategories([]);
      setSelectedCategoriesNames([]);
    } catch (error) {
      console.error(error);
    }
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleAddNewCategory = async () => {
    try {
      await productAPI.createCategory(newCategory);
      fetchCategories().catch(() => {})
      handleClose();
    } catch (err) {
      console.error(err);
    }
  }

  function getStyles(name: string, personName: readonly string[], theme: Theme) {
    return {
      fontWeight:
        personName.indexOf(name) === -1
          ? theme.typography.fontWeightRegular
          : theme.typography.fontWeightMedium,
    };
  }

  function getSelectedCategoriesNames(): string[] {
    const selectedCategoriesNames: string[] = [];
    selectedCategories.forEach((categoryId) => {
      const category = allCategories.find((category) => category.id === categoryId);
      if (category) {
        selectedCategoriesNames.push(category.name);
      }
    });
    return selectedCategoriesNames;
  }

  const ITEM_HEIGHT = 48;
  const ITEM_PADDING_TOP = 8;
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 250,
      },
    },
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
        label="Manufacturer"
        value={manufacturer}
        onChange={handleManufacturerChange}
        fullWidth
        sx={textField}/>
      <TextField
        label="Description"
        value={description}
        multiline
        rows={4}
        onChange={handleDescriptionChange}
        fullWidth
        sx={textField}
        autoComplete="off"
      />
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <TextField
            label="Price"
            type="number"
            value={price}
            onChange={handlePriceChange}
            fullWidth
            sx={textField}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            label="Amount"
            type="number"
            value={amount}
            onChange={handleAmountChange}
            fullWidth
            sx={textField}
          />
        </Grid>
      </Grid>
      <Container sx={centeredContainer}>
      <FormControl component="fieldset" sx={formControl}>
        <InputLabel id="demo-multiple-chip-label" >Categories</InputLabel>
        <Select
          labelId="demo-multiple-chip-label"
          id="demo-multiple-chip"
          multiple
          value={selectedCategoriesNames}
          onChange={handleCategoryChange}
          input={<OutlinedInput id="select-multiple-chip" label="Categories" />}
          renderValue={(selected: string[]) => (
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
              {selected.map((categoryName) => (
                <Chip key={categoryName} label={categoryName} />
              ))}
            </Box>
          )}
          MenuProps={MenuProps}
        >
          {allCategories.map((category) => (
            <MenuItem key={category.id} value={category.name} style={getStyles(category.name, getSelectedCategoriesNames(), theme)}>
              {category.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      </Container>
      <Box sx={{textAlign: 'right'}}>
        <Button onClick={handleOpen} variant="outlined" sx={buttonBack}>
            Add category
        </Button>
      </Box>
      <Box className={"input-file-box"}>
        <Input type="file" onChange={handleMainImageChange} id="file-input-main" disableUnderline sx={input}/>
        <label htmlFor="file-input-main">
          <Button component="span" sx={buttonStyles} style={{marginBottom: '10px'}}>
            Choose main photo
          </Button>
        </label>
      </Box>
      {mainImageUrl && (
        <Box component="img" src={mainImageUrl} alt="Main Image" sx={mainImageStyle} style={{marginLeft: '10px'}}/>
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
        <Link to="/products" style={{ textDecoration: 'none', color: 'inherit' }}>
          Back
        </Link>
      </Button>
      <Dialog open={open} onClose={handleClose} aria-labelledby="add-category-dialog-title">
        <DialogTitle id="add-category-dialog-title">Add new category</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Input category name:
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="category"
            label="Category"
            type="text"
            fullWidth
            onChange={(event) => setNewCategory(event.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleAddNewCategory} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </form>
  );
};

export default AddProductForm;
export type {AddProductFormProps};