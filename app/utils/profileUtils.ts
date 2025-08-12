import { useRouter } from 'expo-router';
import { useSelector } from 'react-redux';

/**
 * Utility functions for profile navigation
 */

export const useProfileNavigation = () => {
  const router = useRouter();
  const currentUser = useSelector((state: any) => state.auth);

  const navigateToProfile = (userId?: string | number) => {
    if (!userId || userId === currentUser?.profile_id) {
      // Navigate to own profile (tabs/profile)
      router.push('/(tabs)/profile');
    } else {
      // Navigate to other user's profile
      router.push(`/profile/${userId}`);
    }
  };

  const navigateToSelfProfile = () => {
    router.push('/(tabs)/profile');
  };

  const navigateToUserProfile = (userId: string | number) => {
    router.push(`/profile/${userId}`);
  };

  return {
    navigateToProfile,
    navigateToSelfProfile,
    navigateToUserProfile,
  };
};

/**
 * Check if a user ID belongs to the current user
 */
export const isCurrentUser = (userId: string | number, currentUserId: string | number) => {
  return userId?.toString() === currentUserId?.toString();
};

/**
 * Format profile image URL
 */
export const formatProfileImageUrl = (imageUrl?: string, baseUrl?: string) => {
  if (!imageUrl) return 'https://via.placeholder.com/100';
  
  if (imageUrl.startsWith('http')) {
    return imageUrl;
  }
  
  return `${baseUrl}${imageUrl}`;
};

/**
 * Format follower/following counts
 */
export const formatCount = (count: number): string => {
  if (count < 1000) return count.toString();
  if (count < 1000000) return `${(count / 1000).toFixed(1)}K`;
  return `${(count / 1000000).toFixed(1)}M`;
};

/**
 * Generate share text for profile
 */
export const generateProfileShareText = (username: string, name?: string) => {
  return `Check out ${name || username}'s profile on ArtDomainX! @${username}`;
};

export default {
  useProfileNavigation,
  isCurrentUser,
  formatProfileImageUrl,
  formatCount,
  generateProfileShareText,
};
