import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export interface CartItem {
  id: string; // unique cart item id (combines productId + customizedOptions hash)
  productId: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  isTastingBox: boolean;
  customizedOptions?: Record<string, string>; // e.g. {"Classic Butter Croissant": "Almond Laminated Croissant"}
}

export interface DeliveryDetails {
  date: string;
  timeSlot: string;
  name: string;
  phone: string;
  address: string;
  notes?: string;
  isGift: boolean;
  giftMessage?: string;
}

interface KingsBakeryState {
  cart: CartItem[];
  wishlist: string[]; // product IDs
  deliveryDetails: DeliveryDetails | null;
  discountCode: string;
  discountPercent: number;
  isHydrated: boolean;
  
  // Cart Actions
  addToCart: (item: Omit<CartItem, "id">) => void;
  removeFromCart: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, quantity: number) => void;
  clearCart: () => void;
  
  // Wishlist Actions
  toggleWishlist: (productId: string) => void;
  
  // Delivery Actions
  setDeliveryDetails: (details: DeliveryDetails) => void;
  
  // Discount Actions
  applyDiscountCode: (code: string) => boolean;
  removeDiscount: () => void;

  isCartOpen: boolean;
  setCartOpen: (open: boolean) => void;
  setHydrated: (state: boolean) => void;
}

export const useStore = create<KingsBakeryState>()(
  persist(
    (set, get) => ({
      cart: [],
      wishlist: [],
      deliveryDetails: null,
      discountCode: "",
      discountPercent: 0,
      isHydrated: false,
      isCartOpen: false,

      setCartOpen: (open) => set({ isCartOpen: open }),

      addToCart: (newItem) => {
        const cart = get().cart;
        // Create a unique key for items to separate different customized configurations of the same tasting box
        const optionString = newItem.customizedOptions 
          ? JSON.stringify(newItem.customizedOptions)
          : "";
        const id = `${newItem.productId}-${optionString}`;

        const existingItemIndex = cart.findIndex((item) => item.id === id);

        if (existingItemIndex > -1) {
          const updatedCart = [...cart];
          updatedCart[existingItemIndex].quantity += newItem.quantity;
          set({ cart: updatedCart, isCartOpen: true });
        } else {
          set({ cart: [...cart, { ...newItem, id }], isCartOpen: true });
        }
      },

      removeFromCart: (cartItemId) => {
        set({
          cart: get().cart.filter((item) => item.id !== cartItemId),
        });
      },

      updateQuantity: (cartItemId, quantity) => {
        if (quantity <= 0) {
          get().removeFromCart(cartItemId);
          return;
        }
        set({
          cart: get().cart.map((item) =>
            item.id === cartItemId ? { ...item, quantity } : item
          ),
        });
      },

      clearCart: () => {
        set({ cart: [], discountCode: "", discountPercent: 0, deliveryDetails: null });
      },

      toggleWishlist: (productId) => {
        const wishlist = get().wishlist;
        if (wishlist.includes(productId)) {
          set({ wishlist: wishlist.filter((id) => id !== productId) });
        } else {
          set({ wishlist: [...wishlist, productId] });
        }
      },

      setDeliveryDetails: (details) => {
        set({ deliveryDetails: details });
      },

      applyDiscountCode: (code) => {
        const cleanedCode = code.trim().toUpperCase();
        if (cleanedCode === "KINGS10") {
          set({ discountCode: "KINGS10", discountPercent: 10 });
          return true;
        }
        return false;
      },

      removeDiscount: () => {
        set({ discountCode: "", discountPercent: 0 });
      },

      setHydrated: (state) => {
        set({ isHydrated: state });
      },
    }),
    {
      name: "kings-bakery-storage",
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true);
      },
    }
  )
);
