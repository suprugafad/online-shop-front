import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box, Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
  Slider,
  TextField,
  Typography,
} from '@mui/material';

interface Filters {
  categories: string[];
  manufacturers: string[];
  priceRange: number[];
}

interface ProductFiltersProps {
  filters: Filters;
  onFilterChange: (filters: Filters) => void;
}

export const ProductFilters: React.FC<ProductFiltersProps> = ({ filters, onFilterChange }) => {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedManufacturers, setSelectedManufacturers] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<number[]>([0, 1000]);
  const [allCategories, setAllCategories] = useState<any[]>([]);
  const [allManufacturers, setAllManufacturers] = useState<any[]>([]);

  useEffect(() => {
    fetchCategories();
    fetchManufacturers();
  }, []);

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

  const fetchManufacturers = async () => {
    try {
      const manufacturers = await axios.get("http://localhost:5000/api/products/manufacturers");

      setAllManufacturers(manufacturers.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleCategoryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = event.target;
    setSelectedCategories(
      checked ? [...selectedCategories, name] : selectedCategories.filter((category) => category !== name),
    );
  };

  const handleManufacturerChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = event.target;
    setSelectedManufacturers(
      checked ? [...selectedManufacturers, name] : selectedManufacturers.filter((manufacturer) => manufacturer !== name),
    );
  };

  const handlePriceRangeChange = async (event: Event, newValue: number | number[]) => {
    setPriceRange(newValue as number[]);
  };

  const handleApplyFilters = () => {
    onFilterChange({ ...filters, priceRange: priceRange, categories: selectedCategories, manufacturers: selectedManufacturers });
  };

  const handleResetFilters = () => {
    setSelectedCategories([]);
    setSelectedManufacturers([]);
    setPriceRange([0, 1000]);
    onFilterChange({ ...filters, priceRange: [0, 1000], categories: [], manufacturers: [] });
  };

  return (
    <Box style={{ width: '275px'}}>
      <Box my={2}>
        <FormControl component="fieldset">
          <FormLabel component="legend">Categories</FormLabel>
          <FormGroup>
            {allCategories.map((category) => (
              <FormControlLabel
                key={category.id}
                control={<Checkbox checked={selectedCategories.includes(category.name)} onChange={handleCategoryChange} name={category.name} />}
                label={category.name}
              />
            ))}
          </FormGroup>
        </FormControl>
      </Box>
      <Box my={2}>
        <FormControl component="fieldset">
          <FormLabel component="legend">Manufactures</FormLabel>
          <FormGroup>
            {allManufacturers.map((manufacturer) => (
              <FormControlLabel
                key={manufacturer}
                control={<Checkbox checked={selectedManufacturers.includes(manufacturer)} onChange={handleManufacturerChange} name={manufacturer} />}
                label={manufacturer}
              />
            ))}
          </FormGroup>
        </FormControl>
      </Box>
      <Box my={2}>
        <Typography id="range-slider" gutterBottom>
          Cost
        </Typography>
        <Slider
          value={priceRange}
          onChange={handlePriceRangeChange}
          valueLabelDisplay="auto"
          aria-labelledby="range-slider"
          min={0}
          max={1000}
        />
        <Box display="flex" justifyContent="space-between">
          <TextField label="Min cost" value={priceRange[0]} type="number" InputProps={{ inputProps: { min: 0, max: 1000 } }} />
          <TextField label="Max cost" value={priceRange[1]} type="number" InputProps={{ inputProps: { min: 0, max: 1000 } }} />
        </Box>
        <Box my={2}>
          <Button variant="contained" color="primary" onClick={handleApplyFilters}>
            Apply Filters
          </Button>
          <Button variant="outlined" color="secondary" onClick={handleResetFilters} style={{ marginLeft: '1rem' }}>
            Reset Filters
          </Button>
        </Box>
      </Box>
    </Box>
  );
};