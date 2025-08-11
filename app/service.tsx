import axios from "axios";
import constant from "./constant";
import AsyncStorage from "@react-native-async-storage/async-storage";


import qs from 'qs'; // npm install qs


const axiosInstance = axios.create({
  baseURL: `${constant.appBaseUrl}/`,
  // timeout: 10000,
});

// Attach token only to protected endpoints
axiosInstance.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem("accessToken");
  console.log("🔐 Access Token from AsyncStorage:", token); // 🧪 DEBUG LOG

  const publicEndpoints = [
    "organization/send-register-otp/",
    "user/registration/",
    "auth/login/",
    "auth/signup/",
  ];

  const isPublic = publicEndpoints.some((endpoint) =>
    config.url?.includes(endpoint),
  );

  if (!isPublic && token) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }

  // Avoid accidentally setting wrong Content-Type
  if (config.headers["Content-Type"] === "application/x-www-form-urlencoded") {
    delete config.headers["Content-Type"];
  }

  return config;
});

// Handle API errors
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(error.response?.data || "Something went wrong"),
);

// API functions
export async function authorizeMe(token: string) {
  await AsyncStorage.setItem("accessToken", token);
}


export async function sendRegisterOtp(data: { email: string }) {
  const formBody = qs.stringify(data); // Converts { email: '...' } to `email=value`
  return axiosInstance.post("organization/send-register-otp/", formBody, {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });
}

// ✅ New function added
export async function RegisterUser(data :any) {
  return axiosInstance.post("user/registration/", data);
}

// 📁 service.ts or service.js

export async function loginUser(formData: any) {
  return axiosInstance.post("user/login/", formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
}

// 📤 Send Forgot Password OTP API
export async function sendForgotOtp(email: string) {
  return axiosInstance.post(
    "organization/send-forgot-otp/",
    { email },
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
}


// 📥 Get All Posts (Paginated)
export async function getAllPosts(page = 1) {
  return axiosInstance.get(`media/all-posts/?page=${page}`);
}
export const getPostById = (id :any) => {
  return axiosInstance.get(`media/post/${id}/`);
};
export const getPostComments = (id :any) => {
  return axiosInstance.get(`media/posts-comments/${id}/`);
};

export async function addPostComment(postId: number | string, content: string) {
  return axiosInstance.post(
    `media/posts-comments/${postId}/`,{ content },
  );
}

export async function replyToComment(commentId: number | string, content: string) {
  const formData = new FormData();
  formData.append('content', content);

  return axiosInstance.post(`media/comment/reply/${commentId}/`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
}



export const likePost = (postId: number | string, reactionType: 'like' | 'dislike') => {
  const formData = new FormData();
  formData.append('reaction_type', reactionType);

  return axiosInstance.post(`media/reactions/${postId}/`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};


export async function getUserNotifications(params = {}){
  try{
     const response = await axiosInstance.get("/notification/user/notifications/" , { params });
     return response.data;
  }catch(error){
    console.error("Error fetching user notifications:", error);
    throw error;
  }
}

export async function markNotificationsAsRead(notificationIds: number[]){
    try{
      const response = await axiosInstance.post("/notification/notifications/mark-read/",{
         ids: notificationIds,
      });
     return response.data
    }catch(error){
      console.error("error in marking notifications as read", error);
      throw error;
    }
}

export async function searchUser(name: string) {
  return axiosInstance.get("profile/profiles/search/", {
    params: { name },
  });
}


// GET API FOR HASHTAG SEARCH {{url}}/media/hashtags-list/?search=query
export async function searchHashtag(query: string) {
  return axiosInstance.get("media/hashtags-list/", {
    params: { search: query },
  });
}


// export async function searchUserByUsername(username) {
//   return axiosInstance.get("profile/profiles/search/", {
//     params: { name: username },
//   });
// }
  
export async function fetchHashtags(searchQuery: string) {
  return axiosInstance.get("media/hashtags-list/", {
    params: { search: searchQuery },
  });
}

export async function fetchHashtag(searchQuery: string) {
  return axiosInstance.get("media/hashtags-list/", {
    params: { search: searchQuery },
  });
}

export async function fetchDraftPost() {
  return axiosInstance.get("media/posts/my-drafts/");
}

export async function describeArt(imageFile) {
  const formData = new FormData();
  formData.append("image", imageFile);

  return axiosInstance.post("ai/art/describe/", formData); 
}

export async function fetchAllPosts() {
  return axiosInstance.get("media/all-posts/");
}

export async function fetchTrendingPosts() {
  return axiosInstance.get("media/posts/trending/");
}

export async function fetchPostsByPage(page) {
  return axiosInstance.get(`media/all-posts/?page=${page}`);
}

export async function increasePostViewCount(postId) {
  return axiosInstance.post(`media/post-view/${postId}/`);
}

export async function reactToPost(postId, reactionType) {
  return axiosInstance.post(`media/reactions/${postId}/`, {
    reaction_type: reactionType,
  });
}

export async function postShareCount(postId) {
  return axiosInstance.post(`media/share/posts/${postId}/`);
}

export async function fetchSinglePost(postId) {
  return axiosInstance.get(`media/post/${postId}/`);
}

export async function uploadPost(formData) {
  return axiosInstance.post("media/post/", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
}

export async function uploadCanvasImage(formData) {
  return axiosInstance.post("profile/canvas/", formData);
}

export async function fetchCanvasImage(userId) {
  return axiosInstance.get(`profile/canvas/${userId}/`);
}

// TO GET PINNED POST OF THE USER  /media/post/userId
export async function fetchPinnedPost(userId) {
  return axiosInstance.get(
    `media/profile-trending-posts/profile-id/${userId}/`,
  );
}

export async function deletePost(postId) {
  return axiosInstance.delete(`media/post/${postId}/`);
}

// TO PIN A POST /media/post/postid/
export async function pinPost(postId, isPinned = true) {
  return axiosInstance.put(`media/post/${postId}/`, { is_pinned: isPinned });
}

export async function deletePostReaction(postId) {
  return axiosInstance.delete(`media/post-reactions/${postId}/`);
}

export const fetchUserProfile = async (userId: string) => {
  return axiosInstance.get(`profile/profile/${userId}/`);
};

// You can also add a function for fetching posts, if needed
export const fetchUserPosts = async (userId: string) => {
  return axiosInstance.get(`profile/profile/${userId}/posts/`);
};

export const fetchUserByUsername = async (username: string) => {
  try {
    const response = await axiosInstance.get(`profile/profile-detail/${username}/`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export default axiosInstance;
