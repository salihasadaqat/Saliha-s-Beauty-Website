import React, { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";
import API from "../api/axios";

function Products() {

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");


  // =========================
  // LOAD PRODUCTS + CATEGORIES
  // =========================

  useEffect(() => {

    const fetchData = async () => {

      try {

        const [productsResponse, categoriesResponse] =
          await Promise.all([
            API.get("/products"),
            API.get("/categories")
          ]);


        setProducts(
          productsResponse.data
        );


        setCategories(
          categoriesResponse.data
        );

      } catch (error) {

        console.error(error);

        setError(
          "Unable to load products."
        );

      } finally {

        setLoading(false);

      }

    };


    fetchData();

  }, []);


  // =========================
  // FILTER PRODUCTS
  // =========================

  const filteredProducts =
    products.filter((product) => {

      const matchesSearch =
        product.name
          .toLowerCase()
          .includes(
            search.toLowerCase()
          );


      const matchesCategory =
        category === "All" ||
        product.category === category;


      return (
        matchesSearch &&
        matchesCategory
      );

    });


  return (

    <div className="container mt-5 mb-5">

      <h2 className="text-center mb-4">
        💄 Saliha's Beauty Products
      </h2>


      {/* SEARCH */}

      <input
        type="text"
        className="form-control mb-3"
        placeholder="🔍 Search Product..."
        value={search}
        onChange={(e) =>
          setSearch(e.target.value)
        }
      />


      {/* CATEGORY */}

      <select
        className="form-select mb-4"
        value={category}
        onChange={(e) =>
          setCategory(e.target.value)
        }
      >

        <option value="All">
          All Categories
        </option>


        {categories.map((cat) => (

          <option
            key={cat._id}
            value={cat.name}
          >
            {cat.name}
          </option>

        ))}

      </select>


      {/* LOADING */}

      {loading && (

        <div className="text-center">

          <h4>
            Loading Products...
          </h4>

        </div>

      )}


      {/* ERROR */}

      {error && (

        <div className="alert alert-danger text-center">
          {error}
        </div>

      )}


      {/* PRODUCTS */}

      {!loading && !error && (

        <div className="row">

          {filteredProducts.length > 0 ? (

            filteredProducts.map(
              (product) => (

                <div
                  className="col-md-6 col-lg-3 mb-4"
                  key={product._id}
                >

                  <ProductCard
                    product={product}
                  />

                </div>

              )
            )

          ) : (

            <div className="text-center">

              <h4>
                No Products Found
              </h4>

            </div>

          )}

        </div>

      )}

    </div>

  );

}

export default Products;