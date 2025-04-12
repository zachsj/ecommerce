// Zustand manges global state.  In a React app, state is any data that can change over time (like cart items, user info, or 
// authentication). Normally, state belongs to a single component. But when multiple components need to share and update the 
// same state, managing it becomes tricky. Global state management means keeping shared data in a centralized store so multiple 
// components/pages can access and modify it without passing props manually. Avoiding "prop drilling" – Instead of passing data
// manually through multiple components, they can read/write directly from the store. State persistence – Keeps data even when 
// navigating between pages or refreshing the app.

import { doc, getDoc } from "firebase/firestore";
import { create } from "zustand";    //a state management library for React. Manages Global Data (e.g., cart, user authentication, favorite products).
import { persist } from "zustand/middleware";
import { db } from "./firebase";
import { ProductProps } from "../../type";

interface CartProduct extends ProductProps { //new interface with the same properties as ProductProps, plus something new (quantity).
  //but quantity is already in ProductProps so not sure.
  quantity: number;
}

interface UserType {   //UserTypes interface is defined in type.ts file. But this interface adds a password field.
  firstName: string;
  lastName: string;
  password: string;
  email: string;
  avatar: string;
  id: string;
}


interface StoreType {
  // user
  currentUser: UserType | null;  //A variable that holds user object data above or just null.
  isLoading: boolean;
  getUserInfo: (uid: any) => Promise<void>; //A function type that takes a uid and returns a Promise<void>.
  // cart
  cartProduct: CartProduct[];
  addToCart: (product: ProductProps) => Promise<void>;
  decreaseQuantity: (productId: number) => void;
  removeFromCart: (productId: number) => void;
  resetCart: () => void;
  // // favorite
  favoriteProduct: CartProduct[];
  addToFavorite: (product: ProductProps) => Promise<void>;
  removeFromFavorite: (productId: number) => void;
  resetFavorite: () => void;
}

const customStorage = { //provides a custom way to interact with the browser’s localStorage, which allows you to store data persistently in a user’s browser
  getItem: (name: string) => {   //Retrieves an item from local storage and parses it as JSON.
    const item = localStorage.getItem(name);
    return item ? JSON.parse(item) : null;
  },
  setItem: (name: string, value: any) => {   //Saves an item in local storage after converting it to a JSON string.
    localStorage.setItem(name, JSON.stringify(value));
  },
  removeItem: (name: string) => {  //Deletes an item from local storage.
    localStorage.removeItem(name);
  },
};
export const store = create<StoreType>()(  //creates a global state store using Zustand, a lightweight state management library.
  //<StoreType> ensures TypeScript type safety for the store, makes sure all state values n functions match the expected types. create() initializes the Zustand store.
  persist(  //wraps the store, enabling automatic local storage for persistence. persistence ensures that user data, cart items, 
    //and favorite products are saved in local storage, so they are not lost when the user refreshes the page.
    (set) => ({  //defines the state structure and methods to update state.
      currentUser: null,  //no user is logged in initially
      isLoading: true,
      cartProduct: [],  //arrays to store the cart and favorite items, start as emptly lists.
      favoriteProduct: [],

      getUserInfo: async (uid: any) => {  //Takes a uid (user ID). Fetches user data from Firestore, Updates the state accordingly.
        if (!uid) return set({ currentUser: null, isLoading: false }); //If no uid is provided, it sets currentUser to null and stops loading

        const docRef = doc(db, "users", uid); //creates a reference to the user document in Firestore.
        const docSnap = await getDoc(docRef); //fetches the user data.

        try {
          if (docSnap.exists()) { //if user data exists in firestore
            set({ currentUser: docSnap.data() as UserType, isLoading: false }); //docSnap.data() → Retrieves the user's data from Firestore.
            //as UserType → Ensures TypeScript knows the data structure matches the UserType interface.
            //set({...}) Updates the Zustand store
          }
        } catch (error) {  //Handles errors (e.g., network issues).
          console.log("getUserInfo error", error); //Logs the error.
          set({ currentUser: null, isLoading: false }); //Ensures graceful failure by setting currentUser to null.
        }
      },
      addToCart: (product: ProductProps) => {  //function that takes a product as an argument, follows the ProductProps interface
        return new Promise<void>((resolve) => { //promise resolves when the cart update is complete.
          set((state: StoreType) => { //(state: StoreType) is the current state, the set function updates the Zustand store's state. 
            const existingProduct = state.cartProduct.find(  //state.cartProduct contains the list of items currently in the cart.
              (p) => p.id === product.id  //searches for the product in cartProduct using id
            );

            if (existingProduct) {
              return {
                cartProduct: state.cartProduct.map((p) =>
                  p.id === product.id  //If the product matches (p.id === product.id), it increments the quantity
                    ? { ...p, quantity: (p.quantity || 0) + 1 } //if already in the cart increases quantity, could be in the cart with no quantity.
                    : p  //If id doesn’t match, return the product as is (no changes).
                ),
              };
            } else {  //If the product doesn’t exist, it adds it to cartProduct with quantity: 1
              return {
                cartProduct: [
                  ...state.cartProduct,  //spreads (copies) all existing products into the new array. ensures that existing cart items are not lost when adding a new product.
                  { ...product, quantity: 1 }, //ensures that the new product has a quantity property while keeping its other attributes
                ],
              };
            }
          });
          resolve();  //Once the state update is done, the promise is resolved. This allows other parts of the code to wait for addToCart to finish if needed
        });
      },
      decreaseQuantity: (productId: number) => {
        set((state: StoreType) => {
          const existingProduct = state.cartProduct.find(
            (p) => p.id === productId
          );

          if (existingProduct) {
            return {
              cartProduct: state.cartProduct.map((p) =>
                p.id === productId
                  ? { ...p, quantity: Math.max(p.quantity - 1, 1) }
                  : p
              ),
            };
          } else {
            return state;
          }
        });
      },
      removeFromCart: (productId: number) => {
        set((state: StoreType) => ({
          cartProduct: state.cartProduct.filter(
            (item) => item.id !== productId
          ),
        }));
      },
      resetCart: () => {
        set({ cartProduct: [] });
      },
      addToFavorite: (product: ProductProps) => {
        return new Promise<void>((resolve) => {
          set((state: StoreType) => {
            const isFavorite = state.favoriteProduct.some(
              (item) => item.id === product.id
            );
            return {
              favoriteProduct: isFavorite
                ? state.favoriteProduct.filter(
                  (item) => item.id !== product.id
                )
                : [...state.favoriteProduct, { ...product }],
            };
          });
          resolve();
        });
      },

      removeFromFavorite: (productId: number) => {
        set((state: StoreType) => ({
          favoriteProduct: state.favoriteProduct.filter(
            (item) => item.id !== productId
          ),
        }));
      },
      resetFavorite: () => {
        set({ favoriteProduct: [] });
      },
    }),
    {
      name: "supergear-storage",  //Saves store data under this key in localStorage.
      storage: customStorage, //Uses the custom localStorage wrapper for persistence. Ensures cart, favorites, and user session persist even after a refresh.
    }
  )
);