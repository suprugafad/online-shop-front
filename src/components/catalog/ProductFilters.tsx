import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import {
  Box,
  Button,
  Checkbox,
  Divider,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
  Slider,
  TextField,
  Typography,
} from '@mui/material';
import { Filters } from "../../types";

interface ProductFiltersProps {
  filters: Filters;
  onFilterChange: (filters: Filters) => void;
}

export const ProductFilters: React.FC<ProductFiltersProps> = ({ filters, onFilterChange }) => {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedManufacturers, setSelectedManufacturers] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<number[]>([0, 200]);
  const [allCategories, setAllCategories] = useState<any[]>([]);
  const [allManufacturers, setAllManufacturers] = useState<any[]>([]);

  const fetchManufacturers = useCallback( async () => {
    try {
      const manufacturers = await axios.get("http://localhost:5000/api/products/manufacturers");

      setAllManufacturers(manufacturers.data);
    } catch (error) {
      console.error(error);
    }
  }, []);

  const fetchCategories = useCallback( async () => {
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
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        await fetchCategories();
        await fetchManufacturers();
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData().catch(() => {});
  }, [fetchCategories, fetchManufacturers]);

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
    <Box style={{ width: '320px', padding: '20px', border: '1px solid #7E52A0', backgroundColor: '#f7f3fa', borderRadius: '10px'}}>
      <Box my={2} marginTop={'0'}>
        <FormControl component="fieldset">
          <FormLabel component="legend" style={{fontSize: '20px', marginBottom:'10px'}}>Categories</FormLabel>
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
      <Divider />
      <Box my={2}>
        <FormControl component="fieldset">
          <FormLabel component="legend" style={{fontSize: '20px', marginBottom:'10px'}}>Manufactures</FormLabel>
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
      <Divider />
      <Box my={2}>
        <Typography id="range-slider" gutterBottom style={{fontSize: '20px', color: 'dimgrey'}}>
          Cost
        </Typography>
        <Slider
          value={priceRange}
          onChange={handlePriceRangeChange}
          valueLabelDisplay="auto"
          aria-labelledby="range-slider"
          min={0}
          max={200}
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