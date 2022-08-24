import {
  ADD_TO_CART,
  CLEAR_CART,
  COUNT_CART_TOTALS,
  REMOVE_CART_ITEM,
  TOGGLE_CART_ITEM_AMOUNT,
} from "../actions";

const cart_reducer = (state, action) => {
  if (action.type === ADD_TO_CART) {
    const { id, color, amount, product } = action.payload; // note: product will allow us to manage updating amounts based on availability, show product info, etc.

    // Checks if item exists in the cart
    const tempItem = state.cart.find((i) => i.id === id + color); // note: check for item of a color which is the id in the cart

    // If item is in the cart iterate over the cart items and update the item amount. Else create new cart item. Update existing cart.
    if (tempItem) {
      const tempCart = state.cart.map((cartItem) => {
        // Adjust the cart item amount
        if (cartItem.id === id + color) {
          let newAmount = cartItem.amount + amount;

          if (newAmount > cartItem.max) {
            newAmount = cartItem.max; // check stock and adjust accordingly
          }

          return { ...cartItem, amount: newAmount }; // return all properties of the item with the adjusted new amount
        } else {
          return cartItem; // just return the cart item whose amount does not need to be adjusted
        }
      });

      return { ...state, cart: tempCart }; // Replace the full cart
    } else {
      const newItem = {
        id: id + color,
        name: product.name,
        color,
        amount,
        image: product.images[0].url,
        price: product.price,
        max: product.stock,
      };

      return {
        ...state,
        cart: [...state.cart, newItem],
      };
    }
  }
  if (action.type === REMOVE_CART_ITEM) {
    const tempCart = state.cart.filter((item) => item.id !== action.payload.id);

    return {
      ...state,
      cart: tempCart,
    };
  }
  if (action.type === CLEAR_CART) {
    return {
      ...state,
      cart: [],
    };
  }
  if (action.type === TOGGLE_CART_ITEM_AMOUNT) {
    const { id, value } = action.payload;

    const tempCart = state.cart.map((item) => {
      if (item.id === id) {
        if (value === "inc") {
          let newAmount = item.amount + 1;
          if (newAmount > item.max) {
            newAmount = item.max;
          }
          return { ...item, amount: newAmount };
        }
        if (value === "dec") {
          let newAmount = item.amount - 1;
          if (newAmount < 1) {
            newAmount = 1;
          }
          return { ...item, amount: newAmount };
        }
      }

      return item;
    });

    return { ...state, cart: tempCart };
  }
  if (action.type === COUNT_CART_TOTALS) {
    const { total_items, total_amount } = state.cart.reduce(
      (total, cartItem) => {
        const { amount, price } = cartItem;

        total.total_items += amount;
        total.total_amount += price * amount;

        return total;
      },
      { total_items: 0, total_amount: 0 }
    );

    return { ...state, total_items, total_amount };
  }

  throw new Error(`No Matching "${action.type}" - action type`);
};

export default cart_reducer;
