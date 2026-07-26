import { create } from 'zustand';
import { UserProfile } from '../types/user';

interface UserState {
  profile: UserProfile;
  toggleUserMode: () => void;
  updateProfileName: (name: string) => void;
}

export const useUserStore = create<UserState>((set) => ({
  profile: {
    id: 'user-demo-1',
    isVisitor: true,
    name: 'Art Enthusiast (Visitor)',
    email: undefined,
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    favoritesArtworkIds: ['art-1', 'art-2'],
    savedDesignIds: [],
    orderHistory: [],
  },

  toggleUserMode: () => set(state => {
    const isNowSigned = state.profile.isVisitor;
    return {
      profile: {
        ...state.profile,
        isVisitor: !isNowSigned,
        name: isNowSigned ? 'Lihan Zhu (Creator)' : 'Art Enthusiast (Visitor)',
        email: isNowSigned ? 'lihan@example.com' : undefined,
      }
    };
  }),

  updateProfileName: (name: string) => set(state => ({
    profile: { ...state.profile, name }
  })),
}));
