import { create } from 'zustand';

export interface Product {
    id: number;
    name: string;
    category: string;
    price: number;
    stock: number;
    image: string;
}

export interface CartItem extends Product {
    quantity: number;
}

interface CartStore {
    items: CartItem[];
    addItem: (product: Product) => void;
    removeItem: (id: number) => void;
    updateQuantity: (id: number, quantity: number) => void;
    clearCart: () => void;
    getTotal: () => number;
}

export const useCartStore = create<CartStore>((set, get) => ({
    items: [],
    addItem: (product) => set((state) => {
        const existing = state.items.find(i => i.id === product.id);
        if (existing) {
            return { items: state.items.map(i => i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i) };
        }
        return { items: [...state.items, { ...product, quantity: 1 }] };
    }),
    removeItem: (id) => set((state) => ({ items: state.items.filter(i => i.id !== id) })),
    updateQuantity: (id, quantity) => set((state) => ({
        items: state.items.map(i => i.id === id ? { ...i, quantity } : i)
    })),
    clearCart: () => set({ items: [] }),
    getTotal: () => get().items.reduce((total, item) => total + (item.price * item.quantity), 0)
}));
