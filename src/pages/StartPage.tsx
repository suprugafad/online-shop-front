import React, {useEffect, useState} from "react";
import {ProductCatalog} from "../components/catalog/ProductCatalog";
import Header from "../components/Header";
import Footer from "../components/Footer";
import {ProductFilters} from "../components/catalog/ProductFilters";
import {Filters} from "../types";
import {checkAuthentication} from "../api/AuthAPI";

const StartPage = () => {
  const [filter, setFilter] = useState<Filters>({categories: [], manufacturers: [], priceRange: [0, 1000]});
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await checkAuthentication();

        if (response && response.data.role === 'admin') {
          setIsAdmin(true);
        }
      } catch (error) {
        console.error(error)
        window.location.reload();
      }
    }

    fetchData().catch(() => {
    });
  });

  const handleFilterChange = (filters: Filters) => {
    setFilter(filters);
  };

  return (
    <>
      {!isAdmin && (
        <>
          <Header title="GameScape"/>
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            width: '100%',
            height: '100%',
          }}>

            <div style={{marginLeft: "5rem", width: '330px', marginTop: '3rem'}}>
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
        </>
      )}

      <Footer/>
    </>
  );
}

export default StartPage;