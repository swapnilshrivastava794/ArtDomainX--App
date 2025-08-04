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
  


export default axiosInstance;
