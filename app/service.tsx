import axios from "axios";
import constant from "@app/constant";
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

// Handle API errors with proper Error objects (avoid rejecting strings/objects)
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    const serverData = error?.response?.data;
    const serverMessage =
      (typeof serverData === 'string' && serverData) ||
      serverData?.detail ||
      serverData?.message ||
      error?.message ||
      'Request failed';
    const wrapped = new Error(serverMessage);
    // @ts-ignore
    wrapped.status = status;
    // @ts-ignore
    wrapped.data = serverData;
    return Promise.reject(wrapped);
  },
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
  const res = await axiosInstance.post("user/login/", formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return res;
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
export const profileDetail = (id :any) => {
  return axiosInstance.get(`/profile/profile/${id}/`);
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

// Profile APIs
// export async function getCurrentUserProfile() {
//   try {
//     const response = await axiosInstance.get("/profile/profile/");
//     return response.data;
//   } catch (error) {
//     console.error("Error fetching current user profile:", error);
//     throw error;
//   }
// }

export async function getUserProfile(userId: string | number) {
  try {
    const response = await axiosInstance.get(`/profile/profile/${userId}/`);
    return response.data;
  } catch (error) {
    console.error("Error fetching user profile:", error);
    throw error;
  }
}



export async function getUserPosts(userId: string | number, page = 1) {
  try {
    const endpoint = `/media/profile-posts/profile-id/${userId}/?page=${page}`;
    const response = await axiosInstance.get(endpoint);
    return response.data;
  } catch (error) {
    console.error("Error fetching user posts:", error);
    throw error;
  }
}

export async function followUser(userId: string | number) {
  try {
    const response = await axiosInstance.post(`/user/follow/${userId}/`);
    return response.data;
  } catch (error) {
    console.error("Error following user:", error);
    throw error;
  }
}

export async function unfollowUser(userId: string | number) {
  try {
    const response = await axiosInstance.delete(`/user/follow/${userId}/`);
    return response.data;
  } catch (error) {
    console.error("Error unfollowing user:", error);
    throw error;
  }
}
  


export default axiosInstance;
