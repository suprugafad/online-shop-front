import React, { useState} from "react";
import { ProductCatalog } from "../components/ProductCatalog";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { ProductFilters } from "../components/ProductFilters";
import { Filters } from "../types";
import { Box, CircularProgress } from '@mui/material';

const StartPage = () => {
  const [filter, setFilter] = useState<Filters>({ categories: [], manufacturers: [], priceRange:[0, 1000] });

  const handleFilterChange = (filters: Filters) => {
    setFilter(filters);
  };

  return (
    <>
      <Header title="Shop" />
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        width: '100%',
        height: '100%',
      }}>
        <div style={{ marginLeft: "5rem", width: '330px', marginTop:'3rem' }}>
          <ProductFilters
            filters={{
              categories: [],
              manufacturers: [],
              priceRange: [0, 1000],
            }}
            onFilterChange={handleFilterChange}
          />
        </div>
        <ProductCatalog filters={filter}/>
      </div>
      <Footer />
    </>
  );
}

export default StartPage;