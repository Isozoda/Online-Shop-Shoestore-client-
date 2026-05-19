import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '../types';
import { useCartStore } from './cart.store';
import { useLikesStore } from './likes.store';

interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  setUser: (user: User) => void;
  setToken: (token: string) => void;
  login: (user: User, token: string) => void;
  logout: () => void;
  updateUser: (user: Partial<User>) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      isAuthenticated: false,

      setUser: (user) => set({ user, isAuthenticated: true }),

      setToken: (token) => {
        localStorage.setItem('accessToken', token);
        set({ accessToken: token });
      },

      login: (user, token) => {
        localStorage.setItem('accessToken', token);
        set({ user, accessToken: token, isAuthenticated: true });
        
        // Restore user's specific cart and likes
        try {
          const savedCart = localStorage.getItem(`cart_${user.id}`);
          if (savedCart) useCartStore.getState().setItems(JSON.parse(savedCart));
          
          const savedLikes = localStorage.getItem(`likes_${user.id}`);
          if (savedLikes) useLikesStore.getState().setLikedProducts(JSON.parse(savedLikes));
        } catch (e) {
          console.error("Failed to restore cart/likes", e);
        }
      },

      logout: () => {
        const currentUser = get().user;
        if (currentUser) {
          // Save current cart and likes for this user before clearing
          const currentCart = useCartStore.getState().items;
          const currentLikes = useLikesStore.getState().likedProducts;
          localStorage.setItem(`cart_${currentUser.id}`, JSON.stringify(currentCart));
          localStorage.setItem(`likes_${currentUser.id}`, JSON.stringify(currentLikes));
        }
        
        localStorage.removeItem('accessToken');
        set({ user: null, accessToken: null, isAuthenticated: false });
        
        // Clear global stores so guests don't see previous user's data
        useCartStore.getState().clearCart();
        useLikesStore.getState().clearLikes();
      },

      updateUser: (userData) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...userData } : null,
        })),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
