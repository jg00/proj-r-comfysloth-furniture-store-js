import React, { useEffect, useContext, useReducer } from "react";
import reducer from "../reducers/filter_reducer";
import {
  LOAD_PRODUCTS,
  SET_GRIDVIEW,
  SET_LISTVIEW,
  UPDATE_SORT,
  SORT_PRODUCTS,
  UPDATE_FILTERS,
  FILTER_PRODUCTS,
  CLEAR_FILTERS,
} from "../actions";
import { useProductsContext } from "./products_context";

const initialState = {
  filtered_products: [],
  all_products: [],
  grid_view: true,
  sort: "price-lowest",
  filters: {
    text: "",
    company: "all",
    category: "all",
    color: "all",
    min_price: 0,
    max_price: 0,
    price: 0,
    shipping: false,
  },
};

const FilterContext = React.createContext();

export const FilterProvider = ({ children }) => {
  const { products } = useProductsContext(); // Note <FilterProvider> is child of <ProductsProvider> and allows us to access products.
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    dispatch({ type: LOAD_PRODUCTS, payload: products });
  }, [products]);

  useEffect(() => {
    dispatch({ type: FILTER_PRODUCTS });
    dispatch({ type: SORT_PRODUCTS });
  }, [products, state.sort, state.filters]);

  /* Note - why add products to dependency array?
    filtered_products is initially [] and also it is dependent on products which is also [] initially.  
    We need to add products as a dependency in our useEffect in order for it to run after initial render.

    Note - filter products first before sort because it will change the number of products
  */

  // View - grid, list
  const setGridView = () => dispatch({ type: SET_GRIDVIEW });

  const setListView = () => dispatch({ type: SET_LISTVIEW });

  // Sort - select option
  const updateSort = (e) => {
    // const name = e.target.name; // Not needed for this scenario because there is only one state to be updated
    const value = e.target.value;
    dispatch({ type: UPDATE_SORT, payload: value });
  };

  // Filters
  const updateFilters = (e) => {
    let name = e.target.name;
    let value = e.target.value;

    // Note button elements do not have a value property
    if (name === "category") {
      value = e.target.textContent;
    }
    if (name === "color") {
      value = e.target.dataset.color;
    }

    // Note input of type range value is returned as a string
    if (name === "price") {
      value = Number(value);
    }

    // Note with checkboxes we do not have a value property
    if (name === "shipping") {
      value = e.target.checked;
    }

    dispatch({ type: UPDATE_FILTERS, payload: { name, value } }); // Note after dispatch see the useEffects above dependent on state.filters
  };

  const clearFilters = () => {
    dispatch({ type: CLEAR_FILTERS });
  };

  return (
    <FilterContext.Provider
      value={{
        ...state,
        setGridView,
        setListView,
        updateSort,
        updateFilters,
        clearFilters,
      }}
    >
      {children}
    </FilterContext.Provider>
  );
};

export const useFilterContext = () => {
  return useContext(FilterContext);
};
