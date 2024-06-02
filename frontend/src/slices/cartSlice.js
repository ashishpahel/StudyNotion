import { createSlice } from "@reduxjs/toolkit";
import { toast } from "react-hot-toast";

const getItemFromLocalStorage = (key, defaultValue) => {
    try {
        const value = localStorage.getItem(key);
        return value ? JSON.parse(value) : defaultValue;
    } catch (error) {
        console.error(`Error getting ${key} from localStorage`, error);
        return defaultValue;
    }
};

const setItemToLocalStorage = (key, value) => {
    try {
        localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
        console.error(`Error setting ${key} to localStorage`, error);
    }
};

const initialState = {
    cart: getItemFromLocalStorage("cart", []),
    total: getItemFromLocalStorage("total", 0),
    totalItems: getItemFromLocalStorage("totalItems", 0),
};

const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {
        addToCart: (state, action) => {
            const course = action.payload;
            const index = state.cart.findIndex((item) => item._id === course._id);

            // If the course is already in the cart, do not modify the quantity
            if (index >= 0) {
                toast.error("Course already in cart");
                return;
            }

            // If the course is not in the cart, add it to the cart
            state.cart.push(course);

            // Update the total quantity and price
            state.totalItems++;
            state.total += course.price;

            // Update to localStorage
            setItemToLocalStorage("cart", state.cart);
            setItemToLocalStorage("total", state.total);
            setItemToLocalStorage("totalItems", state.totalItems);

            // Show toast
            toast.success("Course added to cart");
        },

        removeFromCart: (state, action) => {
            const courseId = action.payload;
            const index = state.cart.findIndex((item) => item._id === courseId);

            // If the course is found in the cart, remove it
            if (index >= 0) {
                state.totalItems--;
                state.total -= state.cart[index].price;
                state.cart.splice(index, 1);

                // Update to localStorage
                setItemToLocalStorage("cart", state.cart);
                setItemToLocalStorage("total", state.total);
                setItemToLocalStorage("totalItems", state.totalItems);

                // Show toast
                toast.success("Course removed from cart");
            }
        },

        resetCart: (state) => {
            state.cart = [];
            state.total = 0;
            state.totalItems = 0;

            // Update to localStorage
            localStorage.removeItem("cart");
            localStorage.removeItem("total");
            localStorage.removeItem("totalItems");

            // Show toast
            toast.success("Cart has been reset");
        }
    }
});

export const { addToCart, removeFromCart, resetCart } = cartSlice.actions;

export default cartSlice.reducer;
