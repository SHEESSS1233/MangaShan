import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface FavoriteItem {
  title: string;
  link: string;
  thumb: string;
  desc?: string;
}

interface FavoriteStore {
  favorites: FavoriteItem[];
  toggleFavorite: (item: FavoriteItem) => void;
  isFavorite: (link: string) => boolean;
}

export const useFavorites = create<FavoriteStore>()(
  persist(
    (set, get) => ({
      favorites: [],
      toggleFavorite: (item) => {
        const favs = get().favorites;
        const exists = favs.find(f => f.link === item.link);
        if (exists) {
          set({ favorites: favs.filter(f => f.link !== item.link) });
        } else {
          set({ favorites: [...favs, item] });
        }
      },
      isFavorite: (link) => {
        return !!get().favorites.find(f => f.link === link);
      }
    }),
    {
      name: 'komiku-favorites',
    }
  )
);
